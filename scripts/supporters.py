"""Build the recent / top supporter lists of _data/contributors.yml from the Patreon and Ko-fi exports.
Only names, platforms, totals and dates are kept: e-mails are used to match one person across both
platforms and are never written out.
usage: python supporters.py <patreon members.csv> <kofi supporters.csv> <contributors.yml>"""
import csv, json, re, sys, unicodedata

PAT, KOFI, YML = sys.argv[1:4]
EUR_TO_USD_FOR_SORTING = 1.1  # ranking only; amounts are shown in their own currency

def key(name):
    s = unicodedata.normalize('NFKD', name or '').lower()
    return re.sub(r'[^a-z0-9]', '', s)

people = {}   # id -> {name, pat, kofi, last}
by_mail, by_name = {}, {}

def person(name, mail, generic=False):
    pid = None
    if mail and mail.lower() in by_mail:
        pid = by_mail[mail.lower()]
    elif not generic and key(name) and key(name) in by_name:
        pid = by_name[key(name)]
    if pid is None:
        pid = len(people)
        people[pid] = {'name': name, 'pat': 0.0, 'kofi': 0.0, 'last': ''}
    if mail:
        by_mail[mail.lower()] = pid
    if not generic and key(name):
        by_name.setdefault(key(name), pid)
    return pid

# Patreon first: its names are the ones already shown on the site
with open(PAT, encoding='utf-8-sig', newline='') as f:
    for r in csv.DictReader(f):
        total = float(r['Montant total'] or 0)
        if total <= 0:
            continue
        name = r['Nom'].strip().lstrip("'")
        pid = person(name, r['E-mail'].strip())
        p = people[pid]
        p['pat'] += total
        last = (r['Date de la dernière facturation'] or r['Date des contributions depuis'] or '')[:10]
        p['last'] = max(p['last'], last)

with open(KOFI, encoding='utf-8-sig', newline='') as f:
    for r in csv.DictReader(f):
        total = float(r['Total'] or 0)
        if total <= 0:
            continue
        name = r['Name'].strip()
        generic = name.lower() in ('ko-fi supporter', 'supporter', '')
        pid = person(name or 'Ko-fi Supporter', r['Email'].strip(), generic)
        p = people[pid]
        p['kofi'] += total
        p['last'] = max(p['last'], r['LastSupportedDateUTC'][:10])

def usd(x): return f"${x:,.2f}"
def eur(x): return (f"{x:,.0f}" if abs(x - round(x)) < 0.005 else f"{x:,.2f}") + " €"

def platform(p):
    return ' + '.join(n for n, v in (('Patreon', p['pat']), ('Ko-fi', p['kofi'])) if v)

def total(p):
    return ' + '.join(s for s in ((usd(p['pat']) if p['pat'] else ''), (eur(p['kofi']) if p['kofi'] else '')) if s)

ppl = list(people.values())
recent = sorted(ppl, key=lambda p: p['last'], reverse=True)[:10]
top = sorted(ppl, key=lambda p: p['pat'] + p['kofi'] * EUR_TO_USD_FOR_SORTING, reverse=True)[:10]

q = json.dumps  # JSON strings are valid YAML scalars (quotes, emoji)
out = ['# Generated from the Patreon and Ko-fi exports (names, totals and dates only; no e-mail).',
       '# recent: the ten people who gave most recently; top: the ten largest totals, both platforms together.',
       '# Patreon totals are USD, Ko-fi totals are EUR.', 'recent:']
for p in recent:
    out += [f"  - name: {q(p['name'], ensure_ascii=False)}", f"    platform: {q(platform(p))}",
            f"    amount: {q(total(p), ensure_ascii=False)}", f"    date: {q(p['last'])}"]
out += ['', 'top:']
for p in top:
    out += [f"  - name: {q(p['name'], ensure_ascii=False)}", f"    platform: {q(platform(p))}",
            f"    total: {q(total(p), ensure_ascii=False)}"]

s = open(YML, encoding='utf-8').read()
i = s.index('\nrecent:')
s = s[:i].rstrip('\n') + '\n\n' + '\n'.join(out) + '\n'
open(YML, 'w', encoding='utf-8', newline='').write(s)
print(len(ppl), 'people who gave money')
for p in recent: print('R', p['last'], p['name'], platform(p), total(p))
for p in top: print('T', p['name'], platform(p), total(p))
