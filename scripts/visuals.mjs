/* Build-time visuals for the game guides: keyboard maps (_data/keymaps.yml) and stage gauges (_data/gauges.yml).
   Both are Liquid filters taking the language of the block they sit in:
     {{ site.data.keymaps.wunduniik | keymap: 'en' }}
     {{ site.data.gauges.wunduniik_needs | gauge: 'fr' }}
   Output is one HTML block without blank lines, so the Markdown pass leaves it alone. */

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
const escA = (s) => esc(s).replace(/"/g, '&quot;');
const NBSP = ' ';

// A text field is either a plain string (same in both languages) or {en, fr}
function tr(v, lang) {
  if (v == null) return '';
  const s = typeof v === 'object' ? (v[lang] ?? v.en ?? '') : String(v);
  return lang === 'fr' ? s.replace(/(\d)\s?%/g, `$1${NBSP}%`).replace(/(\d)\.(\d)/g, '$1,$2') : s;
}
const pct = (x) => +x.toFixed(3) + '%';

/* ---------------- Keyboard ----------------
   ANSI QWERTY main block (15 units wide) with the navigation keys moved to a strip underneath, so the keys
   stay wide enough for their labels in the 780px text column. "_n" is a gap, "Id:w" a key of width w. */
const KB_ROWS = [
  'Esc _1 F1 F2 F3 F4 _.5 F5 F6 F7 F8 _.5 F9 F10 F11 F12',
  '` 1 2 3 4 5 6 7 8 9 0 - = Backspace:2',
  'Tab:1.5 Q W E R T Y U I O P [ ] \\:1.5',
  'Caps:1.75 A S D F G H J K L ; \' Enter:2.25',
  'LShift:2.25 Z X C V B N M , . / RShift:2.75',
  'LCtrl:1.25 Win:1.25 LAlt:1.25 Space:6.25 RAlt:1.25 Fn:1.25 Menu:1.25 RCtrl:1.25',
  '_.5 PrtSc ScrLk Pause _.5 Ins Home PgUp Del End PgDn _.5 Left Up Down Right',
];
const KB_KH = 1.3; // key height in units: taller than wide, for three lines of text
const KB_Y = [0, 1.6, 2.9, 4.2, 5.5, 6.8, 8.4]; // gaps under the function row and above the navigation strip
const KB_W = 15, KB_H = 8.4 + KB_KH;
const KEY_NAMES = {
  Esc: ['Esc', 'Échap'], Backspace: ['Backspace', 'Retour'], Tab: ['Tab', 'Tab'], Caps: ['Caps Lock', 'Verr. Maj'],
  Enter: ['Enter', 'Entrée'], LShift: ['Shift', 'Maj'], RShift: ['Shift', 'Maj'], LCtrl: ['Ctrl', 'Ctrl'], RCtrl: ['Ctrl', 'Ctrl'],
  LAlt: ['Alt', 'Alt'], RAlt: ['Alt', 'Alt Gr'], Space: ['Space', 'Espace'], PrtSc: ['PrtSc', 'Impr'], ScrLk: ['ScrLk', 'Défil'],
  Ins: ['Ins', 'Inser'], Home: ['Home', 'Origine'], PgUp: ['PgUp', 'Pg préc'], Del: ['Del', 'Suppr'], End: ['End', 'Fin'],
  PgDn: ['PgDn', 'Pg suiv'], Up: ['↑', '↑'], Down: ['↓', '↓'], Left: ['←', '←'], Right: ['→', '→'],
};
const MOUSE = [['Left', 'Left click', 'Clic gauche'], ['Right', 'Right click', 'Clic droit'], ['Middle', 'Wheel', 'Molette'], ['Side', 'Side buttons', 'Boutons latéraux']];

// keys: {Id: [cat, en, fr]} or {Id: [[cat, en, fr], [cat, en, fr]]}
const actionsOf = (v) => (v == null ? [] : Array.isArray(v[0]) ? v : [v]);

export function keymapHtml(map, lang = 'en') {
  if (!map || !map.keys) return '';
  const fr = lang === 'fr';
  const cats = map.cats || [];
  const ci = new Map(cats.map((c, k) => [c.id, k + 1]));
  // A word that cannot fit on a keycap gets a smaller font, then breaks (approx. Jost widths at 10px and 8.5px,
  // a 1-unit key is about 52px wide at the 780px text column). Soft hyphens (U+00AD) count as break points.
  const fit = (txt, wu) => {
    const inner = wu * 52 - 10, longest = Math.max(...txt.split(/[\s­-]+/).map((w) => w.length));
    return longest * 5 <= inner ? '' : longest * 4.3 <= inner ? ' is-tight' : ' is-break';
  };
  const keyHtml = (bound, name, style, wu = 4) => {
    const acts = actionsOf(bound);
    if (!acts.length) return `<span class="kb__k is-off"${style}><span class="kb__n">${esc(name)}</span></span>`;
    const cls = [...new Set(acts.map((a) => 'has-c' + ci.get(a[0])))].join(' ');
    const title = `${name}: ` + acts.map((a) => tr(fr ? a[2] : a[1], lang)).join(' | ');
    const spans = acts.map((a) => `<span class="kb__a c${ci.get(a[0])}${fit(tr(fr ? a[2] : a[1], lang), wu)}">${esc(tr(fr ? a[2] : a[1], lang))}</span>`).join('');
    const more = acts.length > 1 ? `<span class="kb__more">+${acts.length - 1}</span>` : '';
    return `<span class="kb__k c${ci.get(acts[0][0])} ${cls}"${style} title="${escA(title)}"><span class="kb__n">${esc(name)}</span>${spans}${more}</span>`;
  };
  let keys = '';
  KB_ROWS.forEach((row, r) => {
    let x = 0;
    for (const tok of row.split(' ')) {
      if (tok.startsWith('_')) { x += parseFloat(tok.slice(1)); continue; }
      const [id, w = '1'] = tok.split(/:(?=[\d.]+$)/);
      const width = parseFloat(w);
      const name = KEY_NAMES[id] ? KEY_NAMES[id][fr ? 1 : 0] : id;
      const style = ` style="left:${pct(x / KB_W * 100)};top:${pct(KB_Y[r] / KB_H * 100)};width:${pct(width / KB_W * 100)};height:${pct(KB_KH / KB_H * 100)}"`;
      keys += keyHtml(map.keys[id], name, style, width);
      x += width;
    }
  });
  let mouse = '';
  for (const [id, en, frn] of MOUSE) {
    if (map.mouse && map.mouse[id]) mouse += keyHtml(map.mouse[id], fr ? frn : en, '');
  }
  const legend = `<button type="button" class="kb-leg is-on" data-kb-cat="" aria-pressed="true">${fr ? 'Tout' : 'All'}</button>` +
    cats.map((c, k) => `<button type="button" class="kb-leg c${k + 1}" data-kb-cat="c${k + 1}" aria-pressed="false"><i aria-hidden="true"></i>${esc(tr(c, lang))}</button>`).join('');
  const cap = tr(map.caption, lang);
  return `<figure class="kbmap" data-kbmap><div class="kb-legend" role="group" aria-label="${fr ? 'Afficher une catégorie' : 'Show one category'}">${legend}</div>` +
    `<div class="kb-scroll"><div class="kb" aria-hidden="true">${keys}</div>` +
    (mouse ? `<div class="kb-mouse" aria-hidden="true"><span class="kb-mouse__t">${fr ? 'Souris' : 'Mouse'}</span>${mouse}</div>` : '') + '</div>' +
    `<figcaption>${esc(cap)}<span class="sr-only"> ${fr ? 'Les mêmes touches sont listées dans les tableaux de la page.' : 'The same keys are listed in the tables on this page.'}</span></figcaption></figure>`;
}

/* ---------------- Gauges ----------------
   A figure of rows; each row is a bar of contiguous segments on its own axis.
   row: {name, note, start (0), end (max), unit, ticks, approx, axis, open, segs: [{to, label, value, tone}] | every: n} */
export function gaugeHtml(g, lang = 'en') {
  if (!g || !g.rows) return '';
  const fr = lang === 'fr';
  let rows = '';
  for (const row of g.rows) {
    const start = row.start ?? g.start ?? 0, end = row.end ?? g.end ?? g.max ?? row.max;
    const span = Math.abs(end - start), dir = Math.sign(end - start) || 1;
    const unit = row.unit ?? g.unit ?? '';
    const fmt = (v, approx) => tr(`${approx && v !== start ? '~' : ''}${+(+v).toFixed(2)}${unit === '%' ? '%' : unit ? ' ' + unit : ''}`, lang);
    let segs = row.segs;
    if (!segs && row.every) { // periodic: one segment per step, labelled with the number of steps reached
      segs = [];
      for (let k = 0, v = start; v * dir < end * dir; k++, v += row.every * dir) {
        segs.push({ to: dir > 0 ? Math.min(v + row.every, end) : Math.max(v - row.every, end), value: k ? `+${k}` : '0', tone: k ? Math.min(k, 3) : 'calm' });
      }
    }
    let prev = start, lis = '';
    segs.forEach((s, i) => {
      const w = Math.abs(s.to - prev) / span * 100;
      const label = tr(s.label, lang), value = tr(s.value, lang);
      const size = w < 7 ? ' is-tiny' : w < 16 ? ' is-narrow' : w < 30 ? ' is-mid' : '';
      const range = row.noaxis || g.noaxis ? '' : (fr ? ` (de ${fmt(prev, row.approx)} à ${fmt(s.to, row.approx)})` : ` (${fmt(prev, row.approx)} to ${fmt(s.to, row.approx)})`);
      const full = [label, value].filter(Boolean).join(' ');
      lis += `<li class="g-${s.tone ?? 'calm'}${size}" style="--w:${pct(w)}" title="${escA(full + range)}">` +
        (label ? `<span class="gauge__lbl">${esc(label)}</span>` : '') + (value ? `<span class="gauge__val">${esc(value)}</span>` : '') +
        (range ? `<span class="sr-only">${esc(range)}</span>` : '') + '</li>';
      prev = s.to;
    });
    const rest = Math.abs(end - prev) / span * 100;
    if (rest > 0.01) lis += `<li class="g-empty" style="--w:${pct(rest)}" aria-hidden="true"></li>`;
    let axis = '';
    const ticks = row.ticks ?? g.ticks;
    if (ticks && !(row.noaxis || g.noaxis)) {
      axis = `<div class="gauge__axis" aria-hidden="true">` + ticks.map((t) => {
        const at = typeof t === 'object' ? t.at : t;
        const p = Math.abs(at - start) / span * 100;
        const edge = p < 1 ? ' is-first' : p > 99 ? ' is-last' : '';
        return `<span class="${edge.trim()}" style="left:${pct(p)}">${esc(typeof t === 'object' ? tr(t.label, lang) : fmt(at, row.approx))}</span>`;
      }).join('') + '</div>';
    }
    const axisNote = tr(row.axis ?? g.axis, lang);
    rows += `<div class="gauge__row"><div class="gauge__head"><span class="gauge__name">${esc(tr(row.name, lang))}</span>` +
      (row.note ? `<span class="gauge__note">${esc(tr(row.note, lang))}</span>` : '') + '</div>' +
      `<ol class="gauge__bar${(row.open ?? g.open) ? ' gauge__bar--open' : ''}">${lis}</ol>${axis}` +
      (axisNote ? `<p class="gauge__axisnote">${esc(axisNote)}</p>` : '') + '</div>';
  }
  const cap = tr(g.caption, lang);
  return `<figure class="gauge">${rows}${cap ? `<figcaption>${esc(cap)}</figcaption>` : ''}</figure>`;
}

/* ---------------- Cyberpunk 2077 perk trees (_data/perks_<list>.json, scripts/cyberpunk-perks.py) ----------------
   Schematic drawing: one row per tier (attribute points needed, lowest at the bottom), one column per branch,
   milestones as big stars with their perks around them, lines for prerequisites. Both languages at once. */
const bi = (en, fr) => (en === fr || !fr ? esc(en) : `<span lang="en">${esc(en)}</span><span lang="fr">${esc(fr)}</span>`);
const biRaw = (en, fr) => `<span lang="en">${en}</span><span lang="fr">${fr}</span>`;
const CP_COL = { Left: 0, Inbetween_Left: 1, Central: 2, Inbetween_Right: 3, Right: 4 };
const CP_ROW = { Novice: 0, Adept: 1, Expert: 2, Master: 3, Espionage: 0 };
const slugify = (s) => String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function cpOrder(tree) {
  const key = (p) => [CP_ROW[p.tier] ?? 0, p.branch === 'Master' ? 9 : CP_COL[p.branch] ?? 9, p.milestone ? 0 : 1, p.id];
  return [...tree.perks].sort((a, b) => {
    const x = key(a), y = key(b);
    for (let i = 0; i < x.length; i++) if (x[i] !== y[i]) return x[i] < y[i] ? -1 : 1;
    return 0;
  });
}

function cpLayout(tree, W, H, pad, big, padL = pad) {
  const rows = Math.max(...tree.perks.map((p) => CP_ROW[p.tier] ?? 0)) + 1;
  const rowH = (H - 2 * pad) / Math.max(rows, 1);
  const colX = (c) => padL + c * (W - padL - pad) / 4;
  const rowY = (r) => H - pad - rowH * (r + 0.5);
  const pos = new Map();
  const cells = new Map();
  for (const p of cpOrder(tree)) {
    const k = p.branch === 'Master' ? 'M' : `${CP_ROW[p.tier] ?? 0}:${p.branch}`;
    if (!cells.has(k)) cells.set(k, []);
    cells.get(k).push(p);
  }
  for (const [k, list] of cells) {
    if (k === 'M') { // master perks: spread along the top row
      list.forEach((p, i) => pos.set(p.id, [padL + (i + 0.5) * (W - padL - pad) / list.length, rowY(3)]));
      continue;
    }
    const [r, br] = k.split(':');
    const cx = colX(CP_COL[br] ?? 2), cy = rowY(+r);
    const ms = list.find((p) => p.milestone), rest = list.filter((p) => p !== ms);
    if (ms) pos.set(ms.id, [cx, cy + (big ? 10 : 6)]);
    const rad = Math.min(rowH * 0.42, big ? 46 : 26);
    rest.forEach((p, i) => {
      if (!ms) { pos.set(p.id, [cx + (i - (rest.length - 1) / 2) * rad * 0.9, cy]); return; }
      const a = Math.PI * (1.1 + 0.8 * (rest.length === 1 ? 0.5 : i / (rest.length - 1)));
      pos.set(p.id, [cx + Math.cos(a) * rad, cy + (big ? 10 : 6) + Math.sin(a) * rad]);
    });
  }
  return { pos, rows, rowY };
}

function cpSvg(tree, mode = 'thumb') {
  const big = mode === 'full';
  const rows = Math.max(...tree.perks.map((p) => CP_ROW[p.tier] ?? 0)) + 1;
  const W = big ? 640 : 240, pad = big ? 44 : 14, H = big ? Math.max(200, rows * 130 + 2 * pad) : 150;
  const { pos, rowY } = cpLayout(tree, W, H, pad, big, big && tree.id !== 'Espionage' ? 84 : pad);
  const num = new Map(cpOrder(tree).map((p, k) => [p.id, k + 1]));
  const f = (v) => +v.toFixed(1);
  let lines = '', dots = '', labels = '';
  for (const p of tree.perks) for (const r of p.requires || []) {
    const a = pos.get(p.id), b = pos.get(r);
    if (a && b) lines += `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}"/>`;
  }
  if (big && tree.id !== 'Espionage') {
    for (const [t, r] of Object.entries(CP_ROW)) if (t !== 'Espionage' && r < rows) labels += `<text class="pt__tier" x="4" y="${f(rowY(r) + 14)}">${tree.tiers?.[t] ?? ''}</text>`;
  }
  for (const p of tree.perks) {
    const [x, y] = pos.get(p.id);
    const cls = (p.milestone ? 'is-big' : '') + (p.changed_by && p.changed_by.length ? ' is-mod' : '');
    if (big) {
      const k = num.get(p.id);
      dots += `<a href="#perk-${tree.slug}-${k}"><title>${esc(p.name.en)}</title><circle class="${cls.trim()}" cx="${f(x)}" cy="${f(y)}" r="${p.milestone ? 11 : 7}"/>` +
        `<text x="${f(x)}" y="${f(y - (p.milestone ? 16 : 12))}">${k}</text></a>`;
    } else {
      dots += `<circle class="${cls.trim()}" cx="${f(x)}" cy="${f(y)}" r="${p.milestone ? 5 : 3}"/>`;
    }
  }
  return `<svg class="pt pt--${big ? 'full' : 'thumb'}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${escA(tree.name.en + ' perk tree, ' + tree.perks.length + ' perks')}">` +
    `<g class="pt__links">${lines}</g>${labels}<g class="pt__nodes">${dots}</g></svg>`;
}

export function cpPerksHtml(data) {
  const trees = ((data && data.trees) || []).map((t) => ({ ...t, slug: slugify(t.name.en), tiers: data.tiers }));
  const total = trees.reduce((n, t) => n + t.perks.length, 0);
  let html = `<div class="pt-grid">`;
  for (const t of trees) {
    const mods = t.perks.filter((p) => p.changed_by && p.changed_by.length).length;
    html += `<a class="pt-card" href="#tree-${t.slug}"><span class="pt-card__head"><span class="pt-card__name">${bi(t.name.en, t.name.fr)}</span>` +
      `<span class="pt-card__count">${t.perks.length} perks</span></span>${cpSvg(t, 'thumb')}` +
      `<span class="pt-card__by">${biRaw(mods + ' changed by mods', mods + ' modifiés par des mods')}</span></a>`;
  }
  html += '</div>';
  html += `<p class="pt-legend"><span class="pt-key pt-key--big" aria-hidden="true"></span>${biRaw('Milestone perk', 'Perk majeur')}` +
    `<span class="pt-key" aria-hidden="true"></span>${biRaw('Perk', 'Perk')}<span class="pt-key pt-key--mod" aria-hidden="true"></span>` +
    `${biRaw('Changed by a mod of the list', 'Modifié par un mod de la liste')}</p>`;
  for (const t of trees) {
    html += `<section class="pt-tree" id="tree-${t.slug}"><h2 id="${t.slug}">${bi(t.name.en, t.name.fr)}</h2>` +
      `<div class="pt-figure">${cpSvg(t, 'full')}</div><div class="table-scroll"><table class="pt-table"><thead><tr><th>#</th><th>Perk</th>` +
      `<th>${biRaw('Needs', 'Requis')}</th><th>${biRaw('Effect', 'Effet')}</th></tr></thead><tbody>`;
    cpOrder(t).forEach((p, k) => {
      const lv = p.levels || [];
      const eff = (l) => esc(l).replace(/\n+/g, '<br>');
      const effect = lv.length > 1
        ? '<ol class="pt-ranks">' + lv.map((l) => `<li>${biRaw(eff(l.en), eff(l.fr))}</li>`).join('') + '</ol>'
        : (lv[0] ? biRaw(eff(lv[0].en), eff(lv[0].fr)) : '');
      const by = p.changed_by && p.changed_by.length
        ? `<span class="pt-mod">${biRaw('Changed by ', 'Modifié par ')}${esc(p.changed_by.join(', '))}</span>` : '';
      const needs = t.id === 'Espionage' ? 'Relic' : p.needs;
      html += `<tr id="perk-${t.slug}-${k + 1}"><td class="pt-num">${k + 1}</td><td class="pt-name">${bi(p.name.en, p.name.fr)}${p.milestone ? ' <span class="pt-star" aria-hidden="true">✦</span>' : ''}</td>` +
        `<td class="pt-req">${needs}</td><td>${effect}${by}</td></tr>`;
    });
    html += '</tbody></table></div></section>';
  }
  return html.replace('{{TOTAL}}', total);
}

/* ---------------- Starfield skill trees (_data/skills_<list>.json, scripts/starfield-skills.py) ----------------
   The game's grid: five categories, four tiers each, four ranks per skill. */
const SF_CATS = [['combat', 'Combat', 'Combat'], ['science', 'Science', 'Science'], ['tech', 'Tech', 'Technologie'],
  ['physical', 'Physical', 'Physique'], ['social', 'Social', 'Social']];
const SF_TIERS = { 1: ['Base', 'Base'], 2: ['Advanced', 'Avancé'], 3: ['Expert', 'Expert'], 4: ['Master', 'Maître'] };

export function sfSkillsHtml(data) {
  const skills = (data && data.skills) || [];
  const slug = (s) => 'skill-' + slugify(s.name.en);
  let board = '<div class="sk-board">';
  for (const [id, en, fr] of SF_CATS) {
    board += `<div class="sk-col sk-col--${id}"><a class="sk-col__head" href="#${id}">${bi(en, fr)}</a>`;
    for (const tier of [4, 3, 2, 1]) {
      const list = skills.filter((s) => s.category === id && s.tier === tier);
      board += `<div class="sk-tier"><span class="sk-tier__name">${bi(...SF_TIERS[tier])}</span>`;
      for (const s of list) {
        const mark = s.new ? ' is-new' : s.by ? ' is-mod' : '';
        board += `<a class="sk-chip${mark}" href="#${slug(s)}" title="${escA(s.description.en)}"><span class="sk-chip__name">${bi(s.name.en, s.name.fr)}</span>` +
          (s.name.fr !== s.name.en ? `<span class="sk-alt" lang="fr">${esc(s.name.en)}</span>` : '') +
          `<span class="sk-pips" aria-hidden="true">${'<i></i>'.repeat(s.ranks.length || 4)}</span></a>`;
      }
      board += '</div>';
    }
    board += '</div>';
  }
  board += '</div>';
  let html = board + `<p class="pt-legend"><span class="pt-key pt-key--mod" aria-hidden="true"></span>${biRaw('Changed by a mod of the list', 'Modifié par un mod de la liste')}` +
    `<span class="pt-key pt-key--new" aria-hidden="true"></span>${biRaw('Added by a mod', 'Ajoutée par un mod')}</p>`;
  for (const [id, en, fr] of SF_CATS) {
    html += `<h2 id="${id}">${bi(en, fr)}</h2><div class="table-scroll"><table class="pt-table sk-table"><thead><tr><th>${biRaw('Skill', 'Compétence')}</th>` +
      `<th>${biRaw('Tier', 'Palier')}</th><th>${biRaw('Ranks', 'Rangs')}</th></tr></thead><tbody>`;
    for (const tier of [1, 2, 3, 4]) {
      for (const s of skills.filter((x) => x.category === id && x.tier === tier)) {
        const ranks = '<ol class="pt-ranks">' + s.ranks.map((r) => {
          const ch = r.challenge && r.challenge.en ? `<span class="sk-next">${biRaw('Next rank: ', 'Rang suivant : ')}${bi(r.challenge.en, r.challenge.fr)}</span>` : '';
          return `<li>${bi(r.desc.en, r.desc.fr)}${ch}</li>`;
        }).join('') + '</ol>';
        const by = s.by ? `<span class="pt-mod">${s.new ? biRaw('Added by ', 'Ajoutée par ') : biRaw('Changed by ', 'Modifiée par ')}${esc(s.by)}</span>` : '';
        html += `<tr id="${slug(s)}"><td class="pt-name">${bi(s.name.en, s.name.fr)}${s.name.fr !== s.name.en ? `<span class="sk-alt" lang="fr">${esc(s.name.en)}</span>` : ''}</td>` +
          `<td class="pt-req">${bi(...SF_TIERS[tier])}</td><td>${ranks}${by}</td></tr>`;
      }
    }
    html += '</tbody></table></div>';
  }
  return html;
}
