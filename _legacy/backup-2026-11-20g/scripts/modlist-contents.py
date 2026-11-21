"""What is inside each published modlist, read from its .wabbajack.

    python scripts/modlist-contents.py            # every list in the live modlist.json
    python scripts/modlist-contents.py wunduniik  # one list (site id)
    python scripts/modlist-contents.py ghost-of-the-grid "D:/Games/Ghost of the Grid.wabbajack"   # local file

By default the published .wabbajack is read from authored-files.wabbajack.org without downloading it:
the file is served in 2 MB parts, so only the zip index, the 'modlist' entry and the profiles'
modlist.txt are fetched (about 15 MB for Wunduniik instead of 430 MB).

Writes _data/contents_<id>.json, used by the build for:
  - the "Mod contents" page of each list (treemap of the MO2 separators, mods per separator),
  - the authors wall (/authors/),
  - the install time estimator (archive counts and sizes per source).
Run it again when a list is published (npm run contents).
"""
import gzip, io, json, re, struct, sys, urllib.request, zipfile, zlib
from collections import Counter, defaultdict
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MODLISTS_URL = 'https://raw.githubusercontent.com/Alaxouche/Wunduniik/main/modlist.json'
UA = {'User-Agent': 'theastralforge-site-build'}
# Site id <- modlist.json title
IDS = {'Wunduniik': 'wunduniik', 'Krentoraan': 'krentoraan', 'Ghost of the Grid': 'ghost-of-the-grid',
       "No Man's Sky - Explorer": 'no-mans-sky-explorer', 'Extrasolar Containment Protocol': 'extrasolar-containment-protocol'}
# Profile used for the contents (default: the profile with the most enabled mods)
PROFILE = {}
NEXUS_DOMAIN = {'SkyrimSpecialEdition': 'skyrimspecialedition', 'Skyrim': 'skyrim', 'Cyberpunk2077': 'cyberpunk2077',
                'NoMansSky': 'nomanssky', 'Starfield': 'starfield', 'Fallout4': 'fallout4', 'Oblivion': 'oblivion',
                'Morrowind': 'morrowind', 'FalloutNewVegas': 'newvegas', 'Fallout3': 'fallout3', 'Enderal': 'enderal',
                'EnderalSpecialEdition': 'enderalspecialedition', 'SkyrimVR': 'skyrimspecialedition'}


def get(url):
    url = urllib.request.quote(url, safe=':/?=&%')
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=120) as r:
        return r.read()


class RemoteZip:
    """Random access to a .wabbajack stored as parts on authored-files.wabbajack.org."""

    def __init__(self, base):
        self.base = base.rstrip('/')
        d = json.loads(gzip.decompress(get(self.base + '/definition.json.gz')))
        self.size, self.parts, self.cache = d['Size'], d['Parts'], {}
        tail = self.read(self.size - min(self.size, 70000), min(self.size, 70000))
        i = tail.rfind(b'PK\x05\x06')
        cd_size, cd_off = struct.unpack('<II', tail[i + 12:i + 20])
        if cd_off == 0xFFFFFFFF:
            j = tail.rfind(b'PK\x06\x06')
            cd_size, cd_off = struct.unpack('<QQ', tail[j + 40:j + 56])
        self.entries = self._central(self.read(cd_off, cd_size))

    def _part(self, i):
        if i not in self.cache:
            self.cache[i] = get(f'{self.base}/parts/{i}')
        return self.cache[i]

    def read(self, off, n):
        out = bytearray()
        while n > 0:
            p = next(p for p in self.parts if p['Offset'] <= off < p['Offset'] + p['Size'])
            chunk = self._part(p['Index'])[off - p['Offset']:off - p['Offset'] + n]
            out += chunk
            off += len(chunk)
            n -= len(chunk)
        return bytes(out)

    @staticmethod
    def _central(cd):
        entries, pos = {}, 0
        while pos + 46 <= len(cd) and cd[pos:pos + 4] == b'PK\x01\x02':
            meth = struct.unpack('<H', cd[pos + 10:pos + 12])[0]
            csize, usize = struct.unpack('<II', cd[pos + 20:pos + 28])
            nlen, xlen, clen = struct.unpack('<HHH', cd[pos + 28:pos + 34])
            loff = struct.unpack('<I', cd[pos + 42:pos + 46])[0]
            name = cd[pos + 46:pos + 46 + nlen].decode('utf-8', 'replace')
            extra = cd[pos + 46 + nlen:pos + 46 + nlen + xlen]
            k = 0
            while k + 4 <= len(extra):
                hid, hl = struct.unpack('<HH', extra[k:k + 4])
                if hid == 1:
                    vals = list(struct.unpack('<' + 'Q' * (hl // 8), extra[k + 4:k + 4 + hl - hl % 8]))
                    if usize == 0xFFFFFFFF: usize = vals.pop(0)
                    if csize == 0xFFFFFFFF: csize = vals.pop(0)
                    if loff == 0xFFFFFFFF: loff = vals.pop(0)
                k += 4 + hl
            entries[name] = (meth, csize, loff)
            pos += 46 + nlen + xlen + clen
        return entries

    def entry(self, name):
        meth, csize, loff = self.entries[name]
        n2, x2 = struct.unpack('<HH', self.read(loff + 26, 4))
        data = self.read(loff + 30 + n2 + x2, csize)
        return zlib.decompress(data, -15) if meth == 8 else data


class LocalZip:
    def __init__(self, path):
        self.z = zipfile.ZipFile(path)

    def entry(self, name):
        return self.z.read(name)


# Words kept as written when a separator name is in capitals
KEEP = {w.lower(): w for w in ('UI', 'HUD', 'ENB', 'NPC', 'NPCs', 'VFX', 'SFX', 'QoL', 'CET', 'AI', 'NSFW', 'DLC', 'DLCs',
                               'LOD', 'LODs', 'LUT', 'FPS', 'SKSE', 'SFSE', 'DLL', 'DLLs', 'CC', 'MCM', 'SPID', 'RT', 'PT',
                               'II', 'III', 'IV', 'DynDOLOD', 'xLODGen', 'TexGen', 'ReShade', 'AV', 'NCPD', 'VR', 'DAR', 'OAR',
                               'ENBSeries', 'SkyPatcher', 'RaceMenu', 'BodySlide', 'CBBE', 'HIMBO', 'SMP', 'HDT', 'FNIS', 'MO2', 'xEdit', 'SSE', 'AE', 'NMS', 'AMUMSS', 'REDmod', 'ArchiveXL', 'TweakXL', 'CCXL')}
SMALL = {'and', 'of', 'the', 'for', 'to', 'in', 'on', 'with', 'or', 'a', 'an'}
LETTER = 'A-Za-z\u00C0-\u024F'


def is_major(raw):
    """A section separator: '02. ____ USER INTERFACE ____' or a name without numbering."""
    s = re.sub(r'_?separator$', '', raw)
    return bool(re.match(r'^\s*\d+\.?\s*[_=~\-]{3,}', s)) or not re.match(r'^\s*\d', s)


def clean_sep(name):
    s = re.sub(r'_?separator$', '', name)
    s = re.sub(r'^\s*\d+(?:\.\d+)*\.?\s*', '', s)            # "01. " / "11.3.2 " numbering
    s = re.sub(r'[_=~*#|]{2,}|-{3,}', ' ', s)                  # ____ / ==== rulers
    s = re.sub('^[^0-9' + LETTER + ']+|[^0-9' + LETTER + r')\]!?]+$', '', s)
    s = re.sub(r'\s+', ' ', s).strip()
    if sum(c.isupper() for c in s) > sum(c.islower() for c in s):
        first = [True]

        def word(m):
            w, lw = m.group(0), m.group(0).lower()
            out = KEEP.get(lw) or (lw if not first[0] and lw in SMALL else w[:1].upper() + w[1:].lower())
            first[0] = False
            return out
        s = re.sub("[0-9" + LETTER + "']+", word, s)
    return s or name


def split_authors(s):
    parts = re.split(r'\s*(?:,|&|\+|/|\band\b)\s*', s)
    return [p.strip() for p in parts if p.strip()]


def analyse(site_id, title, src):
    m = json.loads(src.entry('modlist'))
    archives = {a['Hash']: a for a in m['Archives']}
    game_domain = NEXUS_DOMAIN.get(m.get('GameType'), '')

    # Profiles: modlist.txt per profile
    profiles = {}
    for d in m['Directives']:
        t = d['To'].replace('/', '\\')
        mm = re.match(r'profiles\\([^\\]+)\\modlist\.txt$', t, re.I)
        if mm and 'SourceDataID' in d:
            profiles[mm.group(1)] = src.entry(d['SourceDataID']).decode('utf-8', 'replace').splitlines()
    enabled_of = lambda lines: [l[1:] for l in lines if l.startswith('+') and not l.endswith('_separator')]
    prof = PROFILE.get(site_id) or max(profiles, key=lambda p: len(enabled_of(profiles[p])))
    lines = profiles[prof]

    # Bytes per mod folder and per source archive
    mod_bytes, mod_arch = Counter(), defaultdict(Counter)
    for d in m['Directives']:
        t = d['To'].replace('/', '\\')
        mm = re.match(r'mods\\([^\\]+)\\', t, re.I)
        if not mm:
            continue
        mod_bytes[mm.group(1)] += d.get('Size', 0)
        ahp = d.get('ArchiveHashPath')
        if ahp:
            mod_arch[mm.group(1)][ahp[0]] += max(d.get('Size', 0), 1)

    def nexus(a):
        st = a.get('State', {})
        if not st.get('$type', '').startswith('NexusDownloader'):
            return None
        meta = dict(re.findall(r'(\w+)=(.*)', a.get('Meta', '')))
        dom = meta.get('gameName', '').strip().lower() or NEXUS_DOMAIN.get(st.get('GameName'), game_domain)
        dom = {'skyrimse': 'skyrimspecialedition'}.get(dom, dom)
        return {'author': (st.get('Author') or '').strip(), 'name': (st.get('Name') or '').strip(),
                'url': f"https://www.nexusmods.com/{dom}/mods/{st.get('ModID')}"}

    # Separators in MO2 order (modlist.txt is highest priority first; MO2 shows a separator above
    # its mods). Two levels: sections ('02. ____ USER INTERFACE ____') and their sub-separators
    # ('02.1 INVENTORY'). Mods sitting directly under a section form a sub-group named like it.
    groups = [{'n': 'Base', 's': [{'n': 'Base', 'mods': []}]}]
    for l in reversed(lines):
        name = l[1:] if l[:1] in '+-*' else l
        if name.endswith('separator') and (name.endswith('_separator') or '__' in name):
            if is_major(name):
                groups.append({'n': clean_sep(name), 's': []})
                groups[-1]['s'].append({'n': groups[-1]['n'], 'mods': []})
            else:
                groups[-1]['s'].append({'n': clean_sep(name), 'mods': []})
        elif l.startswith('+'):
            groups[-1]['s'][-1]['mods'].append(name)

    owner = (m.get('Author') or '').strip().lower()
    authors = defaultdict(dict)
    out_groups = []
    for g in groups:
        subs = []
        for c in g['s']:
            mods = []
            for name in c['mods']:
                arch = mod_arch.get(name, Counter())
                main = next((nexus(archives[h]) for h, _ in arch.most_common() if h in archives and nexus(archives[h])), None)
                for h in arch:
                    nx = nexus(archives[h]) if h in archives else None
                    if nx and nx['author']:
                        for au in split_authors(nx['author']):
                            if au.lower() != owner:
                                authors[au][nx['url']] = nx['name']
                mods.append([name, main['author'] if main else '', main['url'] if main else '', mod_bytes.get(name, 0)])
            if mods:
                subs.append({'n': c['n'], 'b': sum(x[3] for x in mods), 'm': mods})
        if subs:
            out_groups.append({'n': g['n'], 'b': sum(s['b'] for s in subs), 'c': sum(len(s['m']) for s in subs), 's': subs})

    # Key files per enabled mod, for the crash log reader: plugins, DLLs, archives, scripts, CET mod folders.
    # When several mods ship the same file, the one with the highest MO2 priority (the winner) is kept.
    prio = {}
    for i, l in enumerate(lines):  # modlist.txt: highest priority first
        if l.startswith('+'):
            prio.setdefault(l[1:], i)
    files = {}
    for d in m['Directives']:
        t = d['To'].replace('/', '\\')
        mm = re.match(r'mods\\([^\\]+)\\(.+)$', t, re.I)
        if not mm or mm.group(1) not in prio:
            continue
        mod, rel = mm.group(1), mm.group(2)
        keys = []
        base = rel.rsplit('\\', 1)[-1]
        if re.search(r'\.(dll|asi|esp|esm|esl|archive|reds|xl)$', base, re.I):
            keys.append(base.lower())
        cet = re.match(r'bin\\x64\\plugins\\cyber_engine_tweaks\\mods\\([^\\]+)\\', rel, re.I)
        if cet:
            keys.append(cet.group(1).lower())
        for k in keys:
            if k not in files or prio[mod] < prio[files[k]]:
                files[k] = mod

    # Downloads (everything Wabbajack fetches; game files are copied from the game folder)
    by_source = defaultdict(lambda: [0, 0])
    for a in m['Archives']:
        t = a.get('State', {}).get('$type', '?').split(',')[0].replace('Downloader', '')
        by_source[t][0] += 1
        by_source[t][1] += a.get('Size', 0)
    by_source.pop('GameFileSource', None)

    return {
        'id': site_id, 'title': title, 'version': m.get('Version', ''), 'profile': prof,
        'generated': date.today().isoformat(), 'game': m.get('GameType', ''),
        'totals': {'mods': sum(g['c'] for g in out_groups), 'sections': len(out_groups),
                   'categories': sum(len(g['s']) for g in out_groups),
                   'installed': sum(g['b'] for g in out_groups), 'authors': len(authors)},
        'downloads': {k: v for k, v in sorted(by_source.items(), key=lambda kv: -kv[1][1])},
        'groups': out_groups,
        'files': dict(sorted(files.items())),
        'authors': {a: sorted(([n, u] for u, n in v.items()), key=lambda x: x[0].lower())
                    for a, v in sorted(authors.items(), key=lambda kv: kv[0].lower())},
    }


def main():
    args = sys.argv[1:]
    lists = json.loads(get(MODLISTS_URL))
    for ml in lists:
        sid = IDS.get(ml['title'].strip())
        if not sid or (args and args[0] != sid):
            continue
        src = LocalZip(args[1]) if len(args) > 1 else RemoteZip(ml['links']['download'])
        res = analyse(sid, ml['title'].strip(), src)
        out = ROOT / '_data' / f'contents_{sid}.json'
        out.write_text(json.dumps(res, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
        t = res['totals']
        print(f"{sid} {res['version']} [{res['profile']}] mods={t['mods']} cats={t['categories']} "
              f"sections={t['sections']} authors={t['authors']} installed={t['installed'] / 1e9:.1f} GB -> {out.name} ({out.stat().st_size // 1024} KB)")


if __name__ == '__main__':
    main()
