# Usage: python -I scripts/starfield-skills.py <mo2 dir> <profile> <out json>
"""Read-only extraction of the Starfield skill trees of an MO2 profile (Extrasolar Containment Protocol).

Reads every enabled plugin in load order (game Data folder or MO2 mod folders, highest priority mod wins),
keeps the winning version of each skill PERK, and resolves names, rank texts and rank-up challenges in English
and French from the plugins' string tables (loose Strings/ files or BA2 archives). Nothing is written outside
<out json>. See _research/starfield-skills.md.

Skill PERK layout (Starfield.esm): DATA byte 0 = category (1 Combat, 2 Science, 3 Tech, 4 Physical, 5 Social),
byte 1 = tier (1 Base .. 4 Master), byte 3 bit 0x02 = playable. Each rank sits between PRRK and PRRF; its
description is the last DESC before PRUC; an ATCP block in a rank is the challenge that unlocks the next rank,
with its count in the ATAV JSON ("Repetitions").
"""
import configparser
import json
import re
import struct
import sys
import zlib
from pathlib import Path

base, profile, out = Path(sys.argv[1]), sys.argv[2], Path(sys.argv[3])
prof = base / 'profiles' / profile


def subrecords(data):
    i, big = 0, None
    while i + 6 <= len(data):
        typ = data[i:i + 4].decode('latin1')
        size = struct.unpack_from('<H', data, i + 4)[0]
        i += 6
        if typ == 'XXXX':
            big = struct.unpack_from('<I', data, i)[0]
            i += size
            continue
        if big is not None:
            size, big = big, None
        yield typ, data[i:i + size]
        i += size


def read_plugin(path, wanted=('PERK', 'GMST')):
    with open(path, 'rb') as f:
        head = f.read(24)
        size, flags = struct.unpack_from('<II', head, 4)
        hdr = f.read(size)
        masters = [d[:-1].decode('utf8', 'replace') for t, d in subrecords(hdr) if t == 'MAST']
        recs = []
        while True:
            h = f.read(24)
            if len(h) < 24:
                break
            gsize = struct.unpack_from('<I', h, 4)[0]
            label = h[8:12].decode('latin1')
            if label not in wanted:
                f.seek(gsize - 24, 1)
                continue
            end = f.tell() + gsize - 24
            while f.tell() < end:
                rh = f.read(24)
                typ = rh[:4].decode('latin1')
                rsize, rflags, fid = struct.unpack_from('<III', rh, 4)
                if typ == 'GRUP':
                    f.seek(rsize - 24, 1)
                    continue
                data = f.read(rsize)
                if rflags & 0x20:  # deleted
                    continue
                if rflags & 0x40000:
                    data = zlib.decompress(data[4:])
                recs.append((typ, fid, list(subrecords(data))))
    return flags, masters, recs


# ---- string tables (loose files or BA2) ----
def dec(raw):
    try:
        return raw.decode('utf8')
    except UnicodeDecodeError:
        return raw.decode('cp1252', 'replace')


def parse_strings(data, kind):
    count = struct.unpack_from('<I', data, 0)[0]
    basep = 8 + count * 8
    out = {}
    for k in range(count):
        sid, off = struct.unpack_from('<II', data, 8 + k * 8)
        p = basep + off
        if kind == 'strings':
            raw = data[p:data.index(b'\0', p)]
        else:
            ln = struct.unpack_from('<I', data, p)[0]
            raw = data[p + 4:p + 4 + ln].rstrip(b'\0')
        out[sid] = dec(raw)
    return out


def ba2_index(path):
    with open(path, 'rb') as f:
        magic, ver, typ, n, name_off = struct.unpack('<4sI4sIQ', f.read(24))
        if magic != b'BTDX' or typ != b'GNRL':
            return path, ver, {}
        if ver >= 2:
            f.read(8)
        comp = struct.unpack('<I', f.read(4))[0] if ver == 3 else 0
        recs = [struct.unpack('<I4sIIQIII', f.read(36)) for _ in range(n)]
        f.seek(name_off)
        names = []
        for _ in range(n):
            ln = struct.unpack('<H', f.read(2))[0]
            names.append(f.read(ln).decode('utf8', 'replace').replace('\\', '/').lower())
    if comp:
        return path, ver, {}
    return path, ver, {nm: (r[4], r[5], r[6]) for nm, r in zip(names, recs) if nm.startswith('strings/')}


def ba2_read(path, entry):
    off, packed, unpacked = entry
    with open(path, 'rb') as f:
        f.seek(off)
        return zlib.decompress(f.read(packed)) if packed else f.read(unpacked)


# ---- load order and file locations ----
order_mods = [l[1:] for l in (prof / 'modlist.txt').read_text('utf8', 'replace').splitlines()
              if l.startswith('+') and not l.endswith('_separator')]  # highest priority first
plugins_txt = (prof / 'plugins.txt').read_text('utf8', 'replace').splitlines()
listed = {l.lstrip('*').lower(): l.startswith('*') for l in plugins_txt if l and not l.startswith('#')}
loadorder = [l for l in (prof / 'loadorder.txt').read_text('utf8', 'replace').splitlines() if l and not l.startswith('#')]
ini = configparser.ConfigParser(interpolation=None, strict=False)
ini.read(base / 'ModOrganizer.ini', encoding='utf8')
game = ini['General']['gamePath'].replace('@ByteArray(', '').rstrip(')').replace('\\\\', '\\')
data_dir = Path(game) / 'Data'

files = {}  # lowercased path relative to Data -> real path (highest priority wins)
for mod in reversed(order_mods):
    d = base / 'mods' / mod
    if d.is_dir():
        for p in d.iterdir():
            if p.is_file() and p.suffix.lower() in ('.esm', '.esp', '.esl', '.ba2'):
                files[p.name.lower()] = (p, mod)
        s = d / 'Strings'
        if s.is_dir():
            for p in s.iterdir():
                files['strings/' + p.name.lower()] = (p, mod)
for p in data_dir.iterdir():
    if p.is_file():
        files.setdefault(p.name.lower(), (p, None))
for p in (data_dir / 'Strings').glob('*') if (data_dir / 'Strings').is_dir() else []:
    files.setdefault('strings/' + p.name.lower(), (p, None))

active = [p for p in loadorder if listed.get(p.lower(), p.lower() not in listed) and p.lower() in files]
ba2s = [ba2_index(v[0]) for k, v in files.items() if k.endswith('.ba2') and 'localization' in k or k.endswith(' - main.ba2')]


def string_table(stem, lang):
    table = {}
    for kind in ('strings', 'dlstrings', 'ilstrings'):
        name = f'strings/{stem.lower()}_{lang}.{kind}'
        if name in files:
            table.update(parse_strings(files[name][0].read_bytes(), kind))
            continue
        for path, ver, idx in ba2s:
            if name in idx:
                table.update(parse_strings(ba2_read(path, idx[name]), kind))
                break
    return table


# ---- read the PERK records of every active plugin ----
winners, firsts, touchers, gmst, gmst_first = {}, {}, {}, {}, {}
plugin_meta = {}
for name in active:
    path, mod = files[name.lower()]
    try:
        flags, masters, recs = read_plugin(path)
    except Exception as e:  # unreadable plugin: report, keep going
        print('skip', name, e)
        continue
    plugin_meta[name] = {'flags': flags, 'mod': mod}
    for typ, fid, subs in recs:
        idx = fid >> 24
        owner = masters[idx] if idx < len(masters) else name
        key = f'{fid & 0xFFFFFF:06X}:{owner}'
        if typ == 'PERK':
            firsts.setdefault(key, (name, subs))
            winners[key] = (name, subs)
            touchers.setdefault(key, []).append(name)
        else:
            gmst_first.setdefault(key, (name, subs))
            gmst[key] = (name, subs)
print(len(active), 'active plugins,', len(winners), 'perks')

tables = {}


def text(plugin, raw, lang):
    if plugin_meta[plugin]['flags'] & 0x80:  # localized: a string id
        sid = struct.unpack('<I', raw[:4])[0]
        if sid == 0:
            return ''
        if (plugin, lang) not in tables:
            tables[(plugin, lang)] = string_table(Path(plugin).stem, lang)
        t = tables[(plugin, lang)]
        if sid in t:
            return t[sid]
        if lang != 'en':
            return text(plugin, raw, 'en')
        return ''
    return dec(raw.rstrip(b'\0'))


def clean(s, reps=None):
    if reps is not None:
        s = s.replace('<repetitions>', str(reps)).replace('<Repetitions>', str(reps))
    return re.sub(r'\s+', ' ', s).strip()


CATS = {1: 'combat', 2: 'science', 3: 'tech', 4: 'physical', 5: 'social'}


def parse_skill(plugin, subs):
    """Texts of one version of a skill PERK, in both languages."""
    head_full = next((d for t, d in subs if t == 'FULL'), None)
    head_desc = next((d for t, d in subs if t == 'DESC'), None)
    ranks, cur, in_ch = [], None, False
    for t, d in subs:
        if t == 'PRRK':
            cur, in_ch = {}, False
        elif cur is None:
            continue
        elif t == 'ATCP':
            in_ch = True
        elif t == 'ATAV' and in_ch:
            try:
                cur['reps'] = json.loads(d.decode('utf8', 'replace').rstrip('\0'))['Data'].get('Repetitions')
            except (ValueError, KeyError, AttributeError):
                pass
        elif t == 'DESC' and in_ch:
            cur['challenge_raw'] = d
        elif t == 'ATAF':
            in_ch = False
        elif t == 'DESC':
            cur['desc_raw'] = d
        elif t == 'PRRF':
            ranks.append(cur)
            cur = None
    tx = lambda raw, lang, reps=None: clean(text(plugin, raw, lang), reps) if raw is not None else ''
    return {
        'name': {l: tx(head_full, l) for l in ('en', 'fr')},
        'description': {l: tx(head_desc, l) for l in ('en', 'fr')},
        'ranks': [{'desc': {l: tx(r.get('desc_raw'), l) for l in ('en', 'fr')},
                   'challenge': {l: tx(r.get('challenge_raw'), l, r.get('reps')) for l in ('en', 'fr')}} for r in ranks],
    }


def with_official_fr(win, first):
    """A mod that is not translated keeps the game's English text word for word in most fields:
    there the official French text of the first version is used."""
    def pick(w, f):
        if f and w['en'] == f['en'] and f['fr']:
            return {'en': w['en'], 'fr': f['fr']}
        return w
    win['name'] = pick(win['name'], first['name'])
    win['description'] = pick(win['description'], first['description'])
    for k, r in enumerate(win['ranks']):
        fr = first['ranks'][k] if k < len(first['ranks']) else None
        r['desc'] = pick(r['desc'], fr and fr['desc'])
        r['challenge'] = pick(r['challenge'], fr and fr['challenge'])
    return win


skills = []
for key, (plugin, subs) in winners.items():
    data = next((d for t, d in subs if t == 'DATA'), b'')
    edid = next((d[:-1].decode('utf8', 'replace') for t, d in subs if t == 'EDID'), '')
    if len(data) < 4 or data[0] not in CATS or not 1 <= data[1] <= 4 or not data[3] & 0x02:
        continue
    win = parse_skill(plugin, subs)
    fplugin, fsubs = firsts[key]
    if fplugin != plugin:
        win = with_official_fr(win, parse_skill(fplugin, fsubs))
    if not win['name']['en']:
        win['name'] = {'en': edid, 'fr': edid}
    mod = plugin_meta[plugin]['mod']
    skills.append({'id': key, 'edid': edid, 'category': CATS[data[0]], 'tier': data[1], **win,
                   'plugin': plugin, 'by': mod if mod and fplugin != plugin or mod and plugin_meta[fplugin]['mod'] else None,
                   'new': fplugin != 'Starfield.esm' and plugin_meta[fplugin]['mod'] is not None,
                   'touched_by': [m for m in dict.fromkeys(plugin_meta[p]['mod'] for p in touchers[key]) if m]})

skills.sort(key=lambda s: (list(CATS.values()).index(s['category']), s['tier'], s['name']['en'].lower()))
gm = {}
for key, (plugin, subs) in gmst.items():
    edid = next((d[:-1].decode('utf8', 'replace') for t, d in subs if t == 'EDID'), '')
    if re.search(r'skill|perk', edid, re.I):
        val = next((d for t, d in subs if t == 'DATA'), b'')
        fp, fs = gmst_first[key]
        gm[edid] = {'plugin': plugin, 'raw': val.hex(), 'first_plugin': fp, 'first_raw': next((d for t, d in fs if t == 'DATA'), b'').hex()}
gm = {k: v for k, v in gm.items() if k == 'iPerkSkillGroupUnlockTargetNumber'}  # points that open the next tier
out.write_text(json.dumps({'skills': skills, 'gmst': gm}, ensure_ascii=False, indent=1), encoding='utf8')
for s in skills:
    print(f"{s['category']:<9} {s['tier']} {s['name']['en']:<32} {s['name']['fr']:<34} ranks={len(s['ranks'])} by={s['by']} new={s['new']}")
print('iPerkSkillGroupUnlockTargetNumber', gm.get('iPerkSkillGroupUnlockTargetNumber'))
