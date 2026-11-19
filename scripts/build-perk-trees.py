# Usage: python scripts/build-perk-trees.py <raw dir> <mo2 dir> <out json>
"""Assemble the skill-tree data drawn on a Wunduniik game guide page.

Inputs, in <raw dir> (see _research/perk-trees.md for how they are produced):
  avif2.jsonl      houseCARL read of every AVIF with a perk tree (winner), fields EditorID/Name/Description/PerkTree
  providers.jsonl  houseCARL 'tree' read of the same AVIFs (plugins touching each tree, in load order)
  perks.jsonl      houseCARL read of the tree perks + their NextPerk ranks (Name, Description, Conditions...)
  csf_skills.json  Custom Skills Framework trees (winning JSON files), from csf_collect.py
  csf_perks.jsonl  houseCARL read of those trees' perks + ranks
<mo2 dir> is only read, to find which mod folder ships each plugin (for the "last changed by" line).
"""
import json
import re
import sys
from pathlib import Path

raw, mo2, out = Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3])

def jsonl(name):
    return [json.loads(l) for l in (raw / name).read_text(encoding='utf8').splitlines()[1:] if l.strip()]

def flat(row):
    return {x['path']: x['value'] for x in row['fields'] if 'value' in x}

# ---- perks: name, description, ranks (NextPerk chain) and the level each rank needs
perk_rows = {r['formid']: flat(r) for r in jsonl('perks.jsonl') + jsonl('csf_perks.jsonl') if r['type'] == 'Perk'}

def requirement(f):
    """Lowest '>= N' on a skill (GetBaseActorValue) or custom-skill level (GetGlobalValue) condition."""
    vals = []
    i = 0
    while f'Conditions[{i}].Data.Function' in f or f'Conditions[{i}].CompareOperator' in f:
        fn = f.get(f'Conditions[{i}].Data.Function')
        if fn in ('GetBaseActorValue', 'GetGlobalValue', 'GetActorValue') and f.get(f'Conditions[{i}].CompareOperator') == 'GreaterThanOrEqualTo':
            try:
                vals.append(float(f[f'Conditions[{i}].ComparisonValue']))
            except (KeyError, ValueError):
                pass
        i += 1
    return int(min(vals)) if vals else None

def perk_info(fid):
    ranks, seen, cur = [], set(), fid
    while cur and cur in perk_rows and cur not in seen:
        seen.add(cur)
        f = perk_rows[cur]
        ranks.append({'req': requirement(f), 'desc': (f.get('Description') or '').strip()})
        cur = f.get('NextPerk')
    f = perk_rows.get(fid, {})
    return {'name': (f.get('Name') or f.get('EditorID') or fid).strip(), 'ranks': ranks}

# ---- which mod folder ships a plugin (enabled mods of the profile, highest priority first)
def mod_of_plugin():
    found = {}
    for d in (mo2 / 'mods').iterdir():
        if d.is_dir():
            for p in d.glob('*.es[mpl]'):
                found.setdefault(p.name.lower(), d.name)
    return found
plugin_mod = mod_of_plugin()
GENERATED = re.compile(r'^(synthesis|dyndolod|occlusion|pgpatcher|pg_\d|requiem for the indifferent)', re.I)

def changed_by(touchers):
    for p in reversed(touchers):
        if not GENERATED.match(p):
            return plugin_mod.get(p.lower(), Path(p).stem)
    return None

providers = {r['formid']: r['touchers'] for r in jsonl('providers.jsonl')}

trees = []
# ---- vanilla-style trees (AVIF): position = grid cell + offset; links point at node Index values
for r in jsonl('avif2.jsonl'):
    f = flat(r)
    count = int(next(x['note'].split(':')[1].split()[0] for x in r['fields'] if x['path'] == 'PerkTree'))
    nodes = []
    for i in range(count):
        p = f'PerkTree[{i}]'
        perk = f.get(f'{p}.Perk')
        if not perk:  # the invisible root node
            continue
        links, j = [], 0
        while f'{p}.ConnectionLineToIndices[{j}]' in f:
            links.append(int(f[f'{p}.ConnectionLineToIndices[{j}]'])); j += 1
        nodes.append({'i': int(f.get(f'{p}.Index', i)),
                      'x': int(f.get(f'{p}.PerkGridX', 0)) + float(f.get(f'{p}.HorizontalPosition', 0)),
                      'y': int(f.get(f'{p}.PerkGridY', 0)) + float(f.get(f'{p}.VerticalPosition', 0)),
                      'links': links, **perk_info(perk)})
    ids = {n['i'] for n in nodes}
    for n in nodes:
        n['links'] = [l for l in n['links'] if l in ids and l != n['i']]
    group = 'transform' if r['editorid'] in ('AVMagickaRateMod', 'AVHealRatePowerMod') else 'skills'
    trees.append({'id': r['editorid'], 'name': f.get('Name', r['editorid']), 'description': f.get('Description', ''),
                  'group': group, 'by': changed_by(providers.get(r['formid'], [])), 'nodes': nodes})

# ---- Custom Skills Framework trees: x/y as given, links by node id
for s in json.loads((raw / 'csf_skills.json').read_text(encoding='utf8')):
    index = {n['id']: k for k, n in enumerate(s['nodes'])}
    nodes = [{'i': index[n['id']], 'x': n['x'], 'y': n['y'], 'links': [index[l] for l in n['links'] if l in index],
              **perk_info(n['perk'])} for n in s['nodes']]
    first_plugin = s['nodes'][0]['perk'].split(':', 1)[1] if s['nodes'] else ''
    trees.append({'id': 'CSF_' + str(s['id']), 'name': s['name'], 'description': s['description'], 'group': 'custom',
                  'by': plugin_mod.get(first_plugin.lower(), s['mod']), 'nodes': nodes})

order = {'skills': 0, 'custom': 1, 'transform': 2}
trees.sort(key=lambda t: (order[t['group']], t['name'].lower()))
for t in trees:
    t['slug'] = re.sub(r'[^a-z0-9]+', '-', t['name'].lower()).strip('-')
out.write_text(json.dumps({'trees': trees}, ensure_ascii=False, indent=1), encoding='utf8')
for t in trees:
    print(f"{t['group']:<9} {t['name']:<16} {len(t['nodes']):>3} perks  by {t['by']}")
