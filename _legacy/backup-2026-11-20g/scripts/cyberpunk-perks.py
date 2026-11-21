# Usage: python -I scripts/cyberpunk-perks.py <mo2 dir> <profile> <out json>
"""Read-only extraction of the Cyberpunk 2077 perk trees of an MO2 profile (Ghost of the Grid).

Sources, all read in place:
- r6/cache/tweakdb_ep1.bin (flats): perks listed by NewPerks.<Attr>AttributeData.perks, with tier, prerequisites,
  levels, name / description LocKeys and the floatValues that fill {float_N} in the texts.
- archive/pc/{content,ep1}/lang_<lang>_text.archive: the onscreens texts (Oodle decompression through the game's
  own bin/x64/oo2ext_7_win64.dll).
- Enabled MO2 mods: TweakXL .yaml files applied over the TweakDB for NewPerks records (new perks, new texts and
  values), their onscreens texts (mod .archive files) and Codeware texts (this.Text("key", "text") in .reds).
A perk is marked as changed by a mod when an enabled mod's TweakXL file or Perks And Skills Fixes names it.
See _research/cyberpunk-perks.md.
"""
import configparser
import ctypes
import json
import re
import struct
import sys
import zlib
from pathlib import Path

import yaml

base, profile, out = Path(sys.argv[1]), sys.argv[2], Path(sys.argv[3])
ini = configparser.ConfigParser(interpolation=None, strict=False)
ini.read(base / 'ModOrganizer.ini', encoding='utf8')
game = Path(ini['General']['gamePath'].replace('@ByteArray(', '').rstrip(')').replace('\\\\', '\\'))
mods_order = [l[1:] for l in (base / 'profiles' / profile / 'modlist.txt').read_text('utf8', 'replace').splitlines()
              if l.startswith('+') and not l.endswith('_separator')][::-1]  # lowest priority first
mod_dirs = [base / 'mods' / m for m in mods_order if (base / 'mods' / m).is_dir()]


# ---------------- TweakDB flats ----------------
def fnv(s):
    h = 0xcbf29ce484222325
    for c in s.encode():
        h ^= c
        h = (h * 0x100000001b3) & 0xFFFFFFFFFFFFFFFF
    return h


def tdbid(name):
    return zlib.crc32(name.encode()) | (len(name) << 32)


def cint(b, p):
    b0 = b[p]
    neg, val, shift, p = b0 & 0x80, b0 & 0x3f, 6, p + 1
    if b0 & 0x40:
        while True:
            x = b[p]
            p += 1
            val |= (x & 0x7f) << shift
            shift += 7
            if not x & 0x80:
                break
    return neg, val, p


def rstring(b, p):
    neg, n, p = cint(b, p)
    if neg:
        return b[p:p + n].decode('utf8', 'replace'), p + n
    return b[p:p + 2 * n].decode('utf-16-le', 'replace'), p + 2 * n


SCALARS = {'Float': ('<f', 4), 'Int32': ('<i', 4), 'Bool': ('<?', 1), 'TweakDBID': ('<Q', 8),
           'gamedataLocKeyWrapper': ('<Q', 8), 'raRef:CResource': ('<Q', 8), 'Vector2': ('<2f', 8),
           'Vector3': ('<3f', 12), 'Quaternion': ('<4f', 16), 'EulerAngles': ('<3f', 12), 'Color': ('<4B', 4)}
BASE = list(SCALARS) + ['String', 'CName']
TYPES = {fnv(n): n for n in BASE + ['array:' + x for x in BASE]}


def read_value(b, p, typ):
    if typ.startswith('array:'):
        _, n, p = cint(b, p)
        res = []
        for _ in range(n):
            v, p = read_value(b, p, typ[6:])
            res.append(v)
        return res, p
    if typ in ('String', 'CName'):
        return rstring(b, p)
    fmt, size = SCALARS[typ]
    v = struct.unpack_from(fmt, b, p)
    if typ == 'TweakDBID':
        v = (v[0] & 0xFFFFFFFFFF,)
    return (v[0] if len(v) == 1 else list(v)), p + size


def load_flats(path):
    b = path.read_bytes()
    fo = struct.unpack_from('<I', b, 16)[0]
    n = struct.unpack_from('<I', b, fo)[0]
    flats = {}
    for i in range(n):
        h, _, _, off = struct.unpack_from('<QIII', b, fo + 4 + i * 20)
        typ, p = TYPES[h], off
        cnt = struct.unpack_from('<I', b, p)[0]
        p += 4
        values = []
        for _ in range(cnt):
            v, p = read_value(b, p, typ)
            values.append(v)
        kn = struct.unpack_from('<I', b, p)[0]
        p += 4
        for k in range(kn):
            fid, idx = struct.unpack_from('<QI', b, p + k * 12)
            flats[fid & 0xFFFFFFFFFF] = values[idx]
    return flats


# ---------------- archives and onscreens texts ----------------
_oodle = None


def oodle_decompress(data):
    global _oodle
    if data[:4] != b'KARK':
        return data
    if _oodle is None:
        f = ctypes.WinDLL(str(game / 'bin' / 'x64' / 'oo2ext_7_win64.dll')).OodleLZ_Decompress
        f.restype = ctypes.c_ssize_t
        f.argtypes = [ctypes.c_void_p, ctypes.c_ssize_t, ctypes.c_void_p, ctypes.c_ssize_t] + [ctypes.c_int] * 3 + \
                     [ctypes.c_void_p, ctypes.c_ssize_t, ctypes.c_void_p, ctypes.c_void_p, ctypes.c_void_p, ctypes.c_ssize_t, ctypes.c_int]
        _oodle = f
    size = struct.unpack_from('<I', data, 4)[0]
    buf = ctypes.create_string_buffer(size)
    n = _oodle(data[8:], len(data) - 8, buf, size, 1, 0, 0, None, 0, None, None, None, 0, 3)
    if n != size:
        raise ValueError('oodle failed')
    return buf.raw


def archive_blobs(path, needle):
    """Main resource of every file in a RDAR archive whose data contains needle."""
    with open(path, 'rb') as f:
        magic, ver, idx_pos = struct.unpack('<4sIQ', f.read(16))
        if magic != b'RDAR':
            return
        f.seek(idx_pos)
        _, _, _, n_files, n_segs, _ = struct.unpack('<IIQIII', f.read(28))
        files = [struct.unpack('<QqIIIII20s', f.read(56)) for _ in range(n_files)]
        segs = [struct.unpack('<QII', f.read(16)) for _ in range(n_segs)]
        for e in files:
            off, zsize, size = segs[e[3]]
            f.seek(off)
            data = f.read(zsize)
            if zsize != size:
                data = oodle_decompress(data)
            if needle in data:
                yield data


def cr2w_names(blob):
    """Name table of a CR2W file (header 40 bytes, then 10 table descriptors: strings, names, ...)."""
    s_off = struct.unpack_from('<I', blob, 40)[0]
    n_off, n_cnt = struct.unpack_from('<II', blob, 52)
    names = []
    for i in range(n_cnt):
        o = struct.unpack_from('<I', blob, n_off + i * 8)[0]
        names.append(blob[s_off + o:blob.index(b'\0', s_off + o)].decode('utf8', 'replace'))
    return names


def onscreens(blob):
    """(primaryKey or None, secondaryKey, text) of each localizationPersistenceOnScreenEntry.
    Properties are serialized as (u16 name index, u16 type index, u32 size incl. itself, value); the indices
    come from the file's own name table, which differs between game files and files built by modding tools."""
    if blob[:4] != b'CR2W':
        return
    idx = {n: i for i, n in enumerate(cr2w_names(blob))}
    if 'secondaryKey' not in idx or 'String' not in idx:
        return
    t_str = idx['String']
    variants = {idx[n] for n in ('femaleVariant', 'maleVariant') if n in idx}
    sk_head = struct.pack('<HH', idx['secondaryKey'], t_str)
    pk_head = struct.pack('<HHI', idx['primaryKey'], idx['Uint64'], 12) if 'primaryKey' in idx and 'Uint64' in idx else None
    if pk_head:
        starts = [m.start() for m in re.finditer(re.escape(pk_head), blob)]
    else:
        starts = [m.start() for m in re.finditer(re.escape(sk_head), blob)]
    for p in starts:
        pk = None
        if pk_head:
            pk = struct.unpack_from('<Q', blob, p + 8)[0]
            p += 16
        props = {}
        while p + 8 <= len(blob):
            name, typ, size = struct.unpack_from('<HHI', blob, p)
            if typ != t_str or size < 5 or (name != idx['secondaryKey'] and name not in variants):
                break
            props[name], _ = rstring(blob[p + 8:p + 4 + size], 0)
            p += 4 + size
        sk = props.pop(idx['secondaryKey'], None)
        text = next((v for v in props.values() if v), '')
        yield pk, sk, text


texts = {'en': {}, 'fr': {}}  # key ('#123' or secondary key) -> text
for lang in texts:
    for sub in ('content', 'ep1'):
        p = game / 'archive' / 'pc' / sub / f'lang_{lang}_text.archive'
        if p.is_file():
            for blob in archive_blobs(p, b'localizationPersistenceOnScreenEntries'):
                for pk, sk, t in onscreens(blob):
                    if pk is not None:
                        texts[lang]['#%d' % pk] = t
                    if sk:
                        texts[lang][sk] = t


def archive_file(paths, rel):
    """One file of a mod archive, by its resource path (FNV-1a 64 of the lowercased backslash path)."""
    h = fnv(rel.replace('/', '\\').lower())
    for path in paths:
        with open(path, 'rb') as f:
            magic, ver, idx_pos = struct.unpack('<4sIQ', f.read(16))
            f.seek(idx_pos)
            _, _, _, n_files, n_segs, _ = struct.unpack('<IIQIII', f.read(28))
            files = [struct.unpack('<QqIIIII20s', f.read(56)) for _ in range(n_files)]
            segs = [struct.unpack('<QII', f.read(16)) for _ in range(n_segs)]
            for e in files:
                if e[0] == h:
                    off, zsize, size = segs[e[3]]
                    f.seek(off)
                    data = f.read(zsize)
                    return data if zsize == size else oodle_decompress(data)
    return None


def mod_texts(d):
    """Onscreens texts a mod declares in its ArchiveXL files (localization: onscreens: <lang>: path or [paths])."""
    archives = list(d.rglob('*.archive'))
    for xl in list(d.rglob('*.xl')):
        try:
            doc = yaml.safe_load(xl.read_text('utf8', 'replace')) or {}
        except yaml.YAMLError:
            continue
        ons = ((doc.get('localization') or {}).get('onscreens') or {}) if isinstance(doc, dict) else {}
        for code, lang in (('en-us', 'en'), ('fr-fr', 'fr')):
            paths = ons.get(code) or []
            for rel in ([paths] if isinstance(paths, str) else paths):
                blob = archive_file(archives, rel)
                if blob:
                    for pk, sk, t in onscreens(blob):
                        if sk:
                            texts[lang].setdefault(sk, t)


codeware = {}  # Codeware texts: this.Text("key", "text") in a mod's ModLocalizationPackage (English)
for d in mod_dirs:
    for p in d.rglob('*.reds'):
        src = p.read_text('utf8', 'replace')
        if 'ModLocalizationPackage' in src:
            for k, v in re.findall(r'this\.Text\(\s*"([^"]+)"\s*,\s*"((?:[^"\\]|\\.)*)"', src):
                codeware.setdefault(k, (d.name, v.replace('\\"', '"')))
print(len(texts['en']), 'en texts,', len(texts['fr']), 'fr texts,', len(codeware), 'Codeware texts')

# ---------------- TweakXL overlay ----------------
class Tag:
    def __init__(self, op, value):
        self.op, self.value = op, value


for tag in ('!append', '!prepend', '!remove', '!append-once', '!append-from', '!prepend-once', '!merge'):
    yaml.SafeLoader.add_constructor(tag, lambda loader, node, t=tag: Tag(
        t, loader.construct_sequence(node) if isinstance(node, yaml.SequenceNode) else loader.construct_scalar(node)))

overlay = {}   # record name -> {prop: value}
touched = {}   # perk name -> [mod folder]
PERK_RE = re.compile(r'NewPerks\.((?:Body|Reflexes|Tech|Intelligence|Cool|Espionage)_[A-Za-z]+_[A-Za-z0-9_]*?)(?:_inline\d+|_Effector\w*|\b)')


def perk_of(name):
    m = re.match(r'NewPerks\.((?:Body|Reflexes|Tech|Intelligence|Cool|Espionage)_(?:Left|Central|Right|Master|Inbetween)_[A-Za-z]*_?\d+(?:_\d+)?)', name)
    return m.group(1) if m else None


def put(rec, prop, value):
    cur = overlay.setdefault(rec, {})
    if isinstance(value, list) and value and all(isinstance(v, Tag) for v in value):
        lst = list(cur.get(prop) or [('base',)])
        for v in value:
            lst.append((v.op, v.value))
        cur[prop] = lst
    else:
        cur[prop] = value


for d in mod_dirs:
    tw = d / 'r6' / 'tweaks'
    files = sorted(tw.rglob('*.y*ml')) if tw.is_dir() else []
    for p in files:
        try:
            doc = yaml.safe_load(p.read_text('utf8', 'replace')) or {}
        except yaml.YAMLError:
            continue
        if not isinstance(doc, dict):
            continue
        for key, val in doc.items():
            key = str(key)
            if not key.startswith('NewPerks.'):
                continue
            pk = perk_of(key)
            if pk:
                touched.setdefault(pk, [])
                if d.name not in touched[pk]:
                    touched[pk].append(d.name)
            parts = key.split('.')
            if isinstance(val, dict):
                for prop, v in val.items():
                    put(key, prop, v)
            elif len(parts) >= 3:
                put('.'.join(parts[:-1]), parts[-1], val)
psf = next((d for d in mod_dirs if d.name == 'Perks And Skills Fixes'), None)
if psf:
    for p in psf.rglob('*.reds'):
        for name in re.findall(r'NewPerks\.[A-Za-z0-9_]+', p.read_text('utf8', 'replace')):
            pk = perk_of(name)
            if pk and psf.name not in touched.setdefault(pk, []):
                touched[pk].append(psf.name)
    for k in re.findall(r'New_Perks-Descriptions-\w+-(\w+)', ''.join(p.read_text('utf8', 'replace') for p in psf.rglob('Texts*.reds'))):
        pk = re.sub(r'_Level\d+$', '', k)
        if psf.name not in touched.setdefault(pk, []):
            touched[pk].append(psf.name)

LUA_STR = r"""'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*\""""
LUA_ENTRY = r'\[\s*"([^"]+)"\s*\]\s*=\s*((?:(?:' + LUA_STR + r')\s*(?:\.\.\s*)?)+)'
LUA_PART = r"""'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)\""""
touch_mods = {m for ms in touched.values() for m in ms}
for d in mod_dirs:  # texts shipped by the mods that change perks
    if d.name in touch_mods:
        mod_texts(d)
for d in mod_dirs:  # CET mods keeping their texts in a Lua table: ["key"]='text' .. 'text'
    if d.name in touch_mods:
        for p in d.rglob('*.lua'):
            src = p.read_text('utf8', 'replace')
            for k, body in re.findall(LUA_ENTRY, src):
                parts = re.findall(LUA_PART, body)
                codeware.setdefault(k, (d.name, ''.join(a or b for a, b in parts)))

flats = load_flats(game / 'r6' / 'cache' / 'tweakdb_ep1.bin')


def get(rec, prop, default=None):
    if isinstance(rec, dict):  # inline record from a yaml file
        return rec.get(prop, default)
    o = overlay.get(rec, {})
    if prop in o:
        v = o[prop]
        if isinstance(v, list) and v and v[0] == ('base',):
            res = list(flats.get(tdbid(f'{rec}.{prop}'), []))
            for op, val in v[1:]:
                vals = val if isinstance(val, list) else [val]
                if op.startswith('!append'):
                    res += [tdbid(x) if isinstance(x, str) else x for x in vals]
                elif op.startswith('!prepend'):
                    res = [tdbid(x) if isinstance(x, str) else x for x in vals] + res
            return res
        return v
    return flats.get(tdbid(f'{rec}.{prop}'), default)


def name_of_inline(owner, fid):
    for n in range(0, 200):
        nm = f'{owner}_inline{n}'
        if tdbid(nm) == fid:
            return nm
    return None


# ---------------- perks ----------------
ATTRS = [('Body', 'Body'), ('Reflexes', 'Reflexes'), ('TechnicalAbility', 'Tech'), ('Intelligence', 'Intelligence'),
         ('Cool', 'Cool'), ('Espionage', 'Espionage')]
TIERS = {}
for t in ('Novice', 'Adept', 'Expert', 'Master', 'Espionage'):
    TIERS[tdbid(f'NewPerks.{t}NewPerkTier')] = (t, get(f'NewPerks.{t}NewPerkTier', 'requiredAttributePoints'))
cands = {}
for _, a in ATTRS:
    for br in ('Left', 'Central', 'Right'):
        for n in range(0, 6):
            cands[f'{a}_{br}_Milestone_{n}'] = 1
        for t in range(0, 6):
            for i in range(0, 10):
                cands[f'{a}_{br}_Perk_{t}_{i}'] = cands[f'{a}_{br}_Perk_{t}_0{i}'] = 1
    for i in range(0, 10):
        cands[f'{a}_Master_Perk_{i}'] = cands[f'{a}_Master_Perk_0{i}'] = 1
    for br in ('Left', 'Central', 'Right'):
        cands[f'{a}_{br}_Milestone_Perk'] = 1
    for s in ('Left', 'Right'):
        for n in range(0, 6):
            cands[f'{a}_Inbetween_{s}_{n}'] = 1
idmap = {tdbid('NewPerks.' + c): c for c in cands}


def loc(key, lang):
    """Text for 'LocKey#123', 'LocKey#name' or 'LocKey("name")'."""
    if not key:
        return ''
    m = re.match(r'LocKey(?:#|\(")([^")]+)', str(key), re.I)  # the game also accepts "Lockey#"
    k = m.group(1) if m else str(key)
    if k.isdigit():
        return texts[lang].get('#' + k) or (texts['en'].get('#' + k, '') if lang != 'en' else '')
    if k in codeware:
        return codeware[k][1]
    return texts[lang].get(k) or texts['en'].get(k, '')


def fmt(v):
    if isinstance(v, float) and v.is_integer() or isinstance(v, int):
        return str(int(v))
    return ('%.2f' % v).rstrip('0').rstrip('.')


def render(text, ui):
    fv = list(get(ui, 'floatValues', []) or []) if ui else []
    iv = list(get(ui, 'intValues', []) or []) if ui else []
    t = re.sub(r'\{float_(\d+)\}', lambda m: fmt(fv[int(m.group(1))]) if int(m.group(1)) < len(fv) else m.group(0), text)
    t = re.sub(r'\{int_(\d+)\}', lambda m: fmt(iv[int(m.group(1))]) if int(m.group(1)) < len(iv) else m.group(0), t)
    t = re.sub(r'<Input[^>]*actionName="([^"]+)"[^>]*/?>', r'[\1]', t)
    t = re.sub(r'</?[A-Za-z][^>]*>|</>', '', t)
    t = t.replace('\\n', '\n')
    return re.sub(r'[ \t]+', ' ', t).strip()


def ref(owner, v):
    """A level / uiData reference: a yaml dict, a record name or a TweakDBID."""
    if isinstance(v, (dict, str)) or v is None:
        return v
    return name_of_inline(owner, v) if v else None


trees = []
for attr_rec, prefix in ATTRS:
    perk_ids = get(f'NewPerks.{attr_rec}AttributeData', 'perks', []) or []
    perks = []
    for fid in perk_ids:
        name = idmap.get(fid)
        if not name:
            print('unresolved perk id', fid, 'in', attr_rec)
            continue
        rec = 'NewPerks.' + name
        tier_name, tier_req = TIERS.get(tdbid(get(rec, 'tier')) if isinstance(get(rec, 'tier'), str) else get(rec, 'tier'), ('?', None))
        req = [idmap.get(tdbid(x) if isinstance(x, str) else x) for x in (get(rec, 'requiresPerks', []) or [])]
        levels = []
        for k, lv in enumerate(get(rec, 'levels', []) or []):
            lv = ref(rec, lv)
            ui = ref(rec, get(lv, 'uiData')) if lv else None
            if not ui and k == 0:
                ui = ref(rec, get(rec, 'uiData'))
            dkey = (get(lv, 'loc_desc_key') if lv else '') or (get(rec, 'loc_desc_key') if k == 0 else '')
            levels.append({lang: render(loc(dkey, lang), ui) for lang in ('en', 'fr')})
        nm = {lang: render(loc(get(rec, 'loc_name_key'), lang), None) for lang in ('en', 'fr')}
        m = re.match(rf'{prefix}_(Inbetween_Left|Inbetween_Right|Left|Central|Right|Master)_', name)
        branch = m.group(1) if m else '?'
        perks.append({'id': name, 'name': nm, 'tier': tier_name, 'needs': tier_req, 'branch': branch,
                      'milestone': '_Milestone_' in name, 'requires': [r for r in req if r], 'levels': levels,
                      'changed_by': touched.get(name, [])})
    trees.append({'id': prefix, 'perks': perks})
    print(prefix, len(perks), 'perks')

# Official names of the attributes and the Relic tree: the secondary keys whose English text is exactly the name
ATTR_EN = {'Body': 'Body', 'Reflexes': 'Reflexes', 'Tech': 'Technical Ability', 'Intelligence': 'Intelligence',
           'Cool': 'Cool', 'Espionage': 'Relic'}
for t in trees:
    en = ATTR_EN[t['id']]
    keys = sorted((k for k, v in texts['en'].items() if v == en and not k.startswith('#') and re.search(r'Attribut|Stat|Relic|Espionage|Perk', k)), key=len)
    if not keys:  # the Relic tree: any key holding exactly that word
        keys = sorted((k for k, v in texts['en'].items() if v == en and not k.startswith('#')), key=len)
    t['name'] = {'en': en, 'fr': texts['fr'].get(keys[0], en) if keys else en, 'key': keys[0] if keys else None}
    print(t['id'], t['name'])
out.write_text(json.dumps({'tiers': {v[0]: v[1] for v in TIERS.values()}, 'trees': trees}, ensure_ascii=False, indent=1), encoding='utf8')
