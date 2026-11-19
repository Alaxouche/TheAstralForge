"""Read-only inventory of an MO2 modlist: enabled mods grouped by separator, with Nexus ids.

Usage: python -I inventory.py <mo2 dir> <profile name> <out.json>
modlist.txt is stored highest priority first; the MO2 left pane shows it reversed, with each
separator above its mods, so the file is read bottom-up.
"""
import configparser
import json
import sys
from pathlib import Path

base, profile, out = Path(sys.argv[1]), sys.argv[2], Path(sys.argv[3])
lines = (base / 'profiles' / profile / 'modlist.txt').read_text(encoding='utf8', errors='replace').splitlines()
entries = [l for l in lines if l and not l.startswith('#')]

def meta(name):
    f = base / 'mods' / name / 'meta.ini'
    if not f.exists():
        return {}
    cp = configparser.ConfigParser(interpolation=None, strict=False)
    try:
        cp.read_string(f.read_text(encoding='utf8', errors='replace'))
    except Exception:
        return {}
    g = cp['General'] if cp.has_section('General') else {}
    keep = {k: g.get(k, '') for k in ('modid', 'gameName', 'version', 'url', 'comments', 'notes', 'nexusDescription') if g.get(k)}
    if 'nexusDescription' in keep:
        keep['nexusDescription'] = keep['nexusDescription'][:600]
    return keep

groups, current = [], {'separator': '(top, no separator)', 'mods': []}
for e in reversed(entries):
    flag, name = e[0], e[1:]
    if name.endswith('_separator'):
        groups.append(current)
        current = {'separator': name[:-len('_separator')], 'enabled_by_default': flag == '+', 'mods': []}
        continue
    if flag != '+':
        continue
    current['mods'].append({'name': name, **meta(name)})
groups.append(current)
groups = [g for g in groups if g['mods']]
plugins = base / 'profiles' / profile / 'plugins.txt'
plugin_count = sum(1 for l in plugins.read_text(encoding='utf8', errors='replace').splitlines() if l.startswith('*')) if plugins.exists() else None
data = {'profile': profile, 'enabled_mods': sum(len(g['mods']) for g in groups), 'active_plugins': plugin_count, 'groups': groups}
out.write_text(json.dumps(data, indent=1, ensure_ascii=False), encoding='utf8')
print(f"{profile}: {data['enabled_mods']} enabled mods in {len(groups)} groups, {plugin_count} active plugins")
for g in groups:
    print(f"  [{len(g['mods']):4d}] {g['separator']}")
