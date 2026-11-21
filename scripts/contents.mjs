/* What is inside each list, from _data/contents_<id>.json (scripts/modlist-contents.py):
     {{ modlist.id | contents_map }}               the "Mod Contents" page: treemap of the MO2 sections
     {{ modlist.id | install_estimator: 'en' }}    the install time estimator (Wabbajack install pages)
     {{ site.modlists | authors_wall }}            the /authors/ page
   Layouts are computed here (squarified treemap), so the page needs no script to draw; site.js only
   loads the mod lists on demand (/assets/data/contents-<id>.json, /assets/data/authors.json).
   Output is one HTML block without blank lines, so the Markdown pass leaves it alone. */

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
const escA = (s) => esc(s).replace(/"/g, '&quot;');
const bi = (en, fr) => (en === fr ? en : `<span lang="en">${en}</span><span lang="fr">${fr}</span>`);
const NNBSP = ' ';

export const fmtInt = (n, lang) => (lang === 'fr' ? String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, NNBSP)
  : String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ','));
export function fmtBytes(b, lang) {
  const fr = lang === 'fr';
  // thresholds a little under 1e9 / 1e6 so 999.6 MB shows as 1 GB, never "1000 MB"
  const [v, u] = b >= 999.5e6 ? [b / 1e9, fr ? 'Go' : 'GB'] : b >= 999.5e3 ? [b / 1e6, fr ? 'Mo' : 'MB'] : [b / 1e3, fr ? 'ko' : 'KB'];
  const s = v >= 100 ? String(Math.round(v)) : v.toFixed(1).replace(/\.0$/, '');
  return (fr ? s.replace('.', ',') : s) + ' ' + u;
}
const bytesBi = (b) => bi(fmtBytes(b, 'en'), fmtBytes(b, 'fr'));
const intBi = (n) => bi(fmtInt(n, 'en'), fmtInt(n, 'fr'));
const pct = (x) => +x.toFixed(3) + '%';

/* Squarified treemap (Bruls, Huizing, van Wijk). Returns [x, y, w, h] per value, in input order. */
export function squarify(vals, x, y, w, h) {
  const total = vals.reduce((a, b) => a + b, 0) || 1;
  const items = vals.map((v, i) => ({ i, a: (v / total) * w * h })).sort((p, q) => q.a - p.a);
  const out = new Array(vals.length);
  let row = [];
  const worst = (r, side) => {
    const s = r.reduce((a, it) => a + it.a, 0);
    const mx = Math.max(...r.map((it) => it.a)), mn = Math.min(...r.map((it) => it.a));
    return Math.max((side * side * mx) / (s * s), (s * s) / (side * side * mn));
  };
  const place = (r) => {
    const s = r.reduce((a, it) => a + it.a, 0);
    if (w >= h) {
      const cw = s / h; let cy = y;
      for (const it of r) { const ch = it.a / cw; out[it.i] = [x, cy, cw, ch]; cy += ch; }
      x += cw; w -= cw;
    } else {
      const ch = s / w; let cx = x;
      for (const it of r) { const cw = it.a / ch; out[it.i] = [cx, y, cw, ch]; cx += cw; }
      y += ch; h -= ch;
    }
  };
  for (const it of items) {
    const side = Math.min(w, h);
    if (!row.length || worst([...row, it], side) <= worst(row, side)) row.push(it);
    else { place(row); row = [it]; }
  }
  if (row.length) place(row);
  return out;
}

// Four layouts: size or mod count, on a wide (desktop) or tall (phone) frame. Tiny entries get a floor
// so every sub-section stays clickable (the list under the map gives the exact figures).
const FRAMES = { w: [160, 100, 4.75], t: [100, 150, 3.6] }; // units wide, units high, px per unit (approx.)
const HEADER_PX = 24;

function layouts(groups) {
  const res = {};
  for (const metric of ['s', 'c']) {
    const val = (x) => (metric === 's' ? x.b : x.m ? x.m.length : x.c);
    for (const [fk, [W, H, ppu]] of Object.entries(FRAMES)) {
      const key = metric + fk;
      const gv = groups.map(val), gt = gv.reduce((a, b) => a + b, 0);
      const grects = squarify(gv.map((v) => Math.max(v, gt * 0.004)), 0, 0, W, H);
      res[key] = groups.map((g, gi) => {
        const [gx, gy, gw, gh] = grects[gi];
        const hu = HEADER_PX / ppu;
        const solo = g.s.length === 1 && g.s[0].n === g.n; // the cell label already names it
        const head = !solo && gh >= hu * 2.6 && gw * ppu >= 80 ? hu : 0;
        const sv = g.s.map(val), st = sv.reduce((a, b) => a + b, 0);
        const srects = squarify(sv.map((v) => Math.max(v, st * 0.012)), 0, head, gw, gh - head);
        return {
          g: [gx / W * 100, gy / H * 100, gw / W * 100, gh / H * 100, head / gh * 100],
          s: srects.map(([x, y, w, h]) => [x / gw * 100, y / gh * 100, w / gw * 100, h / gh * 100]),
          px: [gw * ppu, gh * ppu],
          spx: srects.map(([, , w, h]) => [w * ppu, h * ppu]),
        };
      });
    }
  }
  return res;
}

const varsOf = (pre, a) => ['x', 'y', 'w', 'h', 'hh'].slice(0, a.length).map((k, i) => `--${pre}${k}:${pct(a[i])}`).join(';');
const TINTS = [30, 20, 26, 16, 24, 18];

export function contentsMapHtml(c) {
  if (!c || !c.groups) return '';
  const L = layouts(c.groups);
  const t = c.totals;
  const fit = (px) => (px[0] >= 78 && px[1] >= 40 ? ' is-lab' : px[0] >= 46 && px[1] >= 20 ? ' is-name' : '');
  const cells = c.groups.map((g, gi) => {
    const gvars = ['sw', 'cw', 'st', 'ct'].map((k) => varsOf(k, L[k][gi].g)).join(';');
    const tint = TINTS[gi % TINTS.length];
    const head = L.sw[gi].g[4] > 0;
    const subs = g.s.map((s, si) => {
      const svars = ['sw', 'cw', 'st', 'ct'].map((k) => varsOf(k, L[k][gi].s[si])).join(';');
      const same = s.n === g.n;
      const tip = `${same ? g.n : g.n + ' › ' + s.n}: ${fmtBytes(s.b, 'en')}, ${fmtInt(s.m.length, 'en')} mods`;
      const tipFr = `${same ? g.n : g.n + ' › ' + s.n} : ${fmtBytes(s.b, 'fr')}, ${fmtInt(s.m.length, 'fr')} mods`;
      return `<button type="button" class="tm__c${fit(L.sw[gi].spx[si])}" style="${svars};--t:${tint - (si % 3) * 3}%" data-g="${gi}" data-s="${si}" title="${escA(tip)}" data-title-fr="${escA(tipFr)}">` +
        `<span class="tm__n">${esc(s.n)}</span><span class="tm__v">${bytesBi(s.b)} · ${intBi(s.m.length)}</span></button>`;
    }).join('');
    return `<div class="tm__g${head ? ' has-head' : ''}" style="${gvars}">` +
      `<span class="tm__h" aria-hidden="true">${esc(g.n)}</span>${subs}</div>`;
  }).join('');

  const max = Math.max(...c.groups.map((g) => g.b));
  const list = c.groups.map((g, gi) => {
    const subs = g.s.map((s, si) => `<li><button type="button" class="tm-list__s" data-g="${gi}" data-s="${si}">` +
      `<span>${esc(s.n === g.n && g.s.length === 1 ? bi('All mods', 'Tous les mods') : s.n)}</span>` +
      `<span class="tm-list__v">${bytesBi(s.b)} · ${intBi(s.m.length)}&nbsp;mods</span></button></li>`).join('');
    return `<li class="tm-list__g"><details><summary><span class="tm-list__n">${esc(g.n)}</span>` +
      `<span class="tm-list__bar" aria-hidden="true"><i style="width:${pct((g.b / max) * 100)}"></i></span>` +
      `<span class="tm-list__v">${bytesBi(g.b)} · ${intBi(g.c)}&nbsp;mods</span></summary><ul>${subs}</ul></details></li>`;
  }).join('');

  const stats = [
    [intBi(t.mods), bi('mods', 'mods')],
    [intBi(t.sections), bi('sections', 'sections')],
    [intBi(t.categories), bi('categories', 'catégories')],
    [bytesBi(t.installed), bi('of mod files', 'de fichiers de mods')],
    [`<a href="/authors/?list=${escA(c.id)}">${intBi(t.authors)}</a>`, bi('authors credited', 'auteurs crédités')],
  ].map(([v, l]) => `<div><dt>${l}</dt><dd>${v}</dd></div>`).join('');

  return `<div class="tmw" data-tmap="${escA(c.id)}">` +
    `<dl class="stats tm-stats">${stats}</dl>` +
    `<p class="tm-src">${bi(`Read from the published <code>.wabbajack</code> of version ${esc(c.version)}, profile ${esc(c.profile)}. Each block is a section of the list in Mod Organizer 2, cut into its sub-sections. Click a block to see its mods.`,
      `Lu dans le <code>.wabbajack</code> publié de la version ${esc(c.version)}, profil ${esc(c.profile)}. Chaque bloc est une section de la liste dans Mod Organizer 2, découpée en sous-sections. Cliquez sur un bloc pour voir ses mods.`)}</p>` +
    `<div class="tm-bar" role="group" aria-label="Block size" data-aria-fr="Taille des blocs"><span class="tm-bar__l">${bi('Block size', 'Taille des blocs')}</span>` +
    `<button type="button" class="tm-seg" data-metric="s" aria-pressed="true">${bi('Disk space', 'Espace disque')}</button>` +
    `<button type="button" class="tm-seg" data-metric="c" aria-pressed="false">${bi('Number of mods', 'Nombre de mods')}</button></div>` +
    `<div class="tm" data-m="s">${cells}</div>` +
    `<div class="tm-panel" data-tm-panel aria-live="polite"><p class="tm-panel__hint">${bi('Pick a block or a section below to list its mods.', 'Choisissez un bloc ou une section ci-dessous pour afficher ses mods.')}</p></div>` +
    `<h2 id="all-sections" class="tm-h">${bi('All sections', 'Toutes les sections')}</h2>` +
    `<ol class="tm-list">${list}</ol>` +
    `<noscript><p>${bi('The mod lists need JavaScript.', 'Les listes de mods ont besoin de JavaScript.')}</p></noscript></div>`;
}

/* Data for the panel: per sub-section, the mods in MO2 order. Nexus links are stored as "domain/id". */
export function contentsJson(c) {
  const short = (u) => (u || '').replace('https://www.nexusmods.com/', '').replace('/mods/', '/');
  return JSON.stringify({ v: c.version, g: c.groups.map((g) => ({ n: g.n, s: g.s.map((s) => ({ n: s.n, m: s.m.map((m) => [m[0], m[1], short(m[2]), m[3]]) })) })) });
}

/* ---------------- Install time estimator ---------------- */
export function estimate(d, cfg, o) {
  const eff = cfg.efficiency || 0.85;
  const line = (o.mbit / 8) * eff * 1e6; // bytes per second
  const total = d.nxB + d.otB;
  let dl;
  if (o.acc === 'premium') dl = total / line;
  else {
    const cap = (o.acc === 'adblock' ? cfg.nexus_free_adblock_mbs : cfg.nexus_free_mbs) * 1e6;
    dl = Math.max(d.nxB / Math.min(cap, line), total / line, d.nxN * (cfg.click_seconds || 10));
  }
  const inst = d.inst / ((cfg.install_mbs[o.disk] || 30) * 1e6);
  return { dl, inst, tot: dl + inst };
}
export function fmtDur(sec, lang) {
  const fr = lang === 'fr';
  if (sec < 3600) return `${Math.max(1, Math.round(sec / 60))} min`;
  const h = sec / 3600;
  if (h >= 48) { const dd = (h / 24).toFixed(1).replace(/\.0$/, ''); return `${fr ? dd.replace('.', ',') : dd} ${fr ? 'jours' : 'days'}`; }
  const hh = Math.floor(h), mm = Math.round((h - hh) * 60 / 5) * 5;
  return mm === 60 ? `${hh + 1} h` : mm ? `${hh} h ${String(mm).padStart(2, '0')}` : `${hh} h`;
}

export function estimatorHtml(c, cfg, lang = 'en') {
  if (!c || !c.downloads) return '';
  const fr = lang === 'fr';
  const T = (en, f) => (fr ? f : en);
  const nx = c.downloads.Nexus || [0, 0];
  const otB = Object.entries(c.downloads).filter(([k]) => k !== 'Nexus').reduce((a, [, v]) => a + v[1], 0);
  const d = { nxN: nx[0], nxB: nx[1], otB, inst: c.inst || 0 };
  const def = { mbit: 100, acc: 'premium', disk: 'nvme' };
  const r = estimate(d, cfg, def);
  const id = `est-${c.id}-${lang}`;
  const seg = (name, opts, cur) => opts.map(([v, label]) =>
    `<label class="est-seg"><input type="radio" name="${id}-${name}" value="${v}"${v === cur ? ' checked' : ''}><span>${label}</span></label>`).join('');
  const conf = JSON.stringify({ e: cfg.efficiency, f: cfg.nexus_free_mbs, a: cfg.nexus_free_adblock_mbs, k: cfg.click_seconds, i: cfg.install_mbs });
  return `<div class="est" data-est="${escA(conf)}" data-nxn="${d.nxN}" data-nxb="${d.nxB}" data-otb="${d.otB}" data-inst="${d.inst}" data-lang="${lang}">` +
    `<p class="est__sizes">${T('Download', 'Téléchargement')} <b>${fmtBytes(d.nxB + d.otB, lang)}</b> · ${T('Install', 'Installation')} <b>${fmtBytes(d.inst, lang)}</b> · <b>${fmtInt(d.nxN, lang)}</b> ${T('files from Nexus Mods', 'fichiers sur Nexus Mods')}</p>` +
    `<div class="est__form">` +
    `<div class="est__f"><label class="est__l" for="${id}-speed">${T('Your connection', 'Votre connexion')}</label>` +
    `<div class="est__speed"><input id="${id}-speed" type="number" min="1" max="10000" step="1" value="${def.mbit}" inputmode="numeric" data-est-speed><span>Mbit/s</span></div>` +
    `<div class="est__presets">${[50, 100, 300, 1000].map((v) => `<button type="button" data-est-preset="${v}">${v >= 1000 ? (fr ? '1 Gbit' : '1 Gbit') : v}</button>`).join('')}</div></div>` +
    `<fieldset class="est__f"><legend class="est__l">${T('Nexus Mods account', 'Compte Nexus Mods')}</legend><div class="est__segs">` +
    seg('acc', [['premium', 'Premium'], ['free', T('Free', 'Gratuit')], ['adblock', T('Free + ad blocker', 'Gratuit + bloqueur de pub')]], def.acc) + `</div></fieldset>` +
    `<fieldset class="est__f"><legend class="est__l">${T('Install drive', 'Disque d\'installation')}</legend><div class="est__segs">` +
    seg('disk', [['nvme', 'SSD NVMe'], ['sata', 'SSD SATA'], ['hdd', T('Hard drive', 'Disque dur')]], def.disk) + `</div></fieldset>` +
    `</div>` +
    `<div class="est__out"><div><span>${T('Download', 'Téléchargement')}</span><b data-est-dl>≈ ${fmtDur(r.dl, lang)}</b></div>` +
    `<div><span>${T('Install', 'Installation')}</span><b data-est-in>≈ ${fmtDur(r.inst, lang)}</b></div>` +
    `<div class="est__tot"><span>${T('Total', 'Total')}</span><b data-est-tot>≈ ${fmtDur(r.tot, lang)}</b></div></div>` +
    `<p class="est__note" data-est-note>${T(`All ${fmtInt(d.nxN, lang)} Nexus files download on their own.`, `Les ${fmtInt(d.nxN, lang)} fichiers Nexus se téléchargent tout seuls.`)}</p>` +
    `<p class="est__fine">${T(`A rough estimate. Download: ${Math.round(cfg.efficiency * 100)}% of your line speed; without Premium, Nexus caps downloads at ${cfg.nexus_free_mbs} MB/s (${cfg.nexus_free_adblock_mbs} MB/s with an ad blocker) and Wabbajack asks for one click per file. Install: about ${cfg.install_mbs.nvme} / ${cfg.install_mbs.sata} / ${cfg.install_mbs.hdd} MB of files per second on NVMe / SATA / hard drive. A slow CPU or an antivirus scanning every file adds time.`,
      `Estimation grossière. Téléchargement : ${Math.round(cfg.efficiency * 100)} % du débit de votre ligne ; sans Premium, Nexus limite à ${String(cfg.nexus_free_mbs).replace('.', ',')} Mo/s (${String(cfg.nexus_free_adblock_mbs).replace('.', ',')} Mo/s avec un bloqueur de pub) et Wabbajack demande un clic par fichier. Installation : environ ${cfg.install_mbs.nvme} / ${cfg.install_mbs.sata} / ${cfg.install_mbs.hdd} Mo de fichiers par seconde sur NVMe / SATA / disque dur. Un processeur lent ou un antivirus qui analyse chaque fichier rallonge le tout.`)}</p>` +
    `</div>`;
}

/* ---------------- Authors wall ---------------- */
const fold = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export function authorsModel(all, modlists) {
  const lists = modlists.filter((m) => all[m.id]);
  const map = new Map();
  lists.forEach((m, li) => {
    for (const [name, mods] of Object.entries(all[m.id].authors || {})) {
      const key = fold(name);
      if (!map.has(key)) map.set(key, { name, lists: new Set(), mods: new Map() });
      const a = map.get(key);
      a.lists.add(li);
      for (const [mn, url] of mods) {
        if (!a.mods.has(url)) a.mods.set(url, { n: mn, l: new Set() });
        a.mods.get(url).l.add(li);
      }
    }
  });
  const authors = [...map.values()].sort((a, b) => fold(a.name).localeCompare(fold(b.name)));
  return { lists, authors };
}

export function authorsJson(model) {
  const short = (u) => u.replace('https://www.nexusmods.com/', '').replace('/mods/', '/');
  return JSON.stringify({
    l: model.lists.map((m) => m.title),
    a: model.authors.map((a) => [a.name, [...a.mods.entries()].map(([u, m]) => [m.n, short(u), [...m.l]])
      .sort((x, y) => fold(x[0]).localeCompare(fold(y[0])))]),
  });
}

export function authorsWallHtml(model) {
  const { lists, authors } = model;
  const nMods = new Set(authors.flatMap((a) => [...a.mods.keys()])).size;
  const top = [...authors].sort((a, b) => b.mods.size - a.mods.size || fold(a.name).localeCompare(fold(b.name))).slice(0, 12);
  const idx = new Map(authors.map((a, i) => [a, i]));
  const btn = (a, cls = 'aw__a') => `<button type="button" class="${cls}" data-a="${idx.get(a)}" data-l="${[...a.lists].join(' ')}">` +
    `<span class="aw__name">${esc(a.name)}</span><span class="aw__n">${a.mods.size}</span></button>`;
  const letters = new Map();
  for (const a of authors) {
    const ch = fold(a.name).charAt(0);
    const k = /[a-z]/.test(ch) ? ch.toUpperCase() : '#';
    if (!letters.has(k)) letters.set(k, []);
    letters.get(k).push(a);
  }
  const order = [...letters.keys()].sort((a, b) => (a === '#') - (b === '#') || a.localeCompare(b));
  const chips = [`<button type="button" class="aw-chip" data-list="all" aria-pressed="true">${bi('All lists', 'Toutes les listes')}</button>`,
    ...lists.map((m, i) => `<button type="button" class="aw-chip" data-list="${i}" data-id="${escA(m.id)}" aria-pressed="false">${esc(m.title)}</button>`)].join('');
  const stats = [
    [intBi(authors.length), bi('authors', 'auteurs')],
    [intBi(nMods), bi('Nexus Mods pages', 'pages Nexus Mods')],
    [String(lists.length), bi('modlists', 'modlists')],
  ].map(([v, l]) => `<div><dt>${l}</dt><dd>${v}</dd></div>`).join('');
  return `<div class="aw" data-authors>` +
    `<dl class="stats tm-stats aw__stats">${stats}</dl>` +
    `<h2 class="section-title"><span class="diamond"></span>${bi('Most present in the lists', 'Les plus présents dans les listes')}</h2>` +
    `<div class="aw__top">${top.map((a) => btn(a, 'aw__a aw__a--top')).join('')}</div>` +
    `<h2 class="section-title"><span class="diamond"></span>${bi('Everyone', 'Tout le monde')}</h2>` +
    `<div class="aw__bar"><input type="search" class="aw__q" placeholder="Find an author" data-ph-fr="Chercher un auteur" aria-label="Find an author" data-aria-fr="Chercher un auteur" data-aw-q>` +
    `<div class="aw__chips" role="group" aria-label="Filter by modlist" data-aria-fr="Filtrer par modlist">${chips}</div>` +
    `<p class="aw__count" data-aw-count aria-live="polite"></p></div>` +
    `<nav class="aw__az" aria-label="Letters" data-aria-fr="Lettres">${order.map((k) => `<a href="#aw-${k === '#' ? 'other' : k}">${k}</a>`).join('')}</nav>` +
    order.map((k) => `<section class="aw__sec" id="aw-${k === '#' ? 'other' : k}"><h3 class="aw__k">${k}</h3><div class="aw__grid">${letters.get(k).map((a) => btn(a)).join('')}</div></section>`).join('') +
    `<dialog class="aw-dlg" data-aw-dlg aria-labelledby="aw-dlg-t"><div class="aw-dlg__in"><h3 id="aw-dlg-t" data-aw-t></h3><div data-aw-body></div>` +
    `<button type="button" class="aw-dlg__x" data-aw-close aria-label="Close" data-aria-fr="Fermer">×</button></div></dialog>` +
    `</div>`;
}
