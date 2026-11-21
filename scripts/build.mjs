// The Astral Forge — static site builder.
//
// Reads the existing content (collections in _<modlist>/, root pages, _data/)
// and renders it with the minimal theme in theme/ into _site/.
//
//   npm run build      → one-off build
//   npm run dev        → build + local server on http://localhost:4000 + rebuild on change

import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { Liquid } from 'liquidjs';
import { Marked } from 'marked';
import yaml from 'js-yaml';
import { transformSync } from 'esbuild';
import { keymapHtml, gaugeHtml, cpPerksHtml, sfSkillsHtml } from './visuals.mjs';
import { contentsMapHtml, contentsJson, estimatorHtml, authorsModel, authorsJson, authorsWallHtml, fmtInt } from './contents.mjs';
import { troubleshooterHtml, crashReaderHtml, headingIds } from './troubleshoot.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, '_site');
const THEME = path.join(ROOT, 'theme');

const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8').replace(/\r\n/g, '\n');
const exists = (p) => fs.existsSync(path.join(ROOT, p));

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function parseFrontMatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n?---\n?/);
  if (!m) return { data: null, body: src };
  return { data: yaml.load(m[1]) || {}, body: src.slice(m[0].length) };
}

/* Remove every element marked lang="<drop>" (with its content): leaves the text of the other language */
function dropLang(html, drop) {
  const open = new RegExp(`<([a-z][\\w-]*)\\b[^>]*\\blang="${drop}"[^>]*>`, 'gi');
  let out = '', i = 0, m;
  while ((m = open.exec(html))) {
    out += html.slice(i, m.index);
    const tags = new RegExp(`<(/?)${m[1]}\\b[^>]*>`, 'gi');
    tags.lastIndex = m.index + m[0].length;
    let depth = 1, t;
    while (depth && (t = tags.exec(html))) depth += t[1] ? -1 : t[0].endsWith('/>') ? 0 : 1;
    i = t ? tags.lastIndex : html.length;
    open.lastIndex = i;
  }
  return out + html.slice(i);
}

function slugify(text) {
  return String(text)
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z]+;/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

/* Incremental output: files are only written / copied when they changed, and files
   not produced by the current build are removed at the end (see pruneOut). Wiping
   _site/ and rewriting 20 MB of images took ~10 s of the 13 s build on Windows. */
let written = new Set();
const madeDirs = new Set();
function ensureDir(dir) {
  if (madeDirs.has(dir)) return;
  fs.mkdirSync(dir, { recursive: true });
  madeDirs.add(dir);
}

function writeOut(rel, content) {
  const file = path.join(OUT, rel);
  written.add(file);
  ensureDir(path.dirname(file));
  try {
    const buf = Buffer.from(content);
    const old = fs.readFileSync(file);
    if (old.equals(buf)) return;
  } catch { /* missing file: write it */ }
  fs.writeFileSync(file, content);
}

function copyFileIfChanged(s, d) {
  written.add(d);
  const ss = fs.statSync(s);
  try {
    const ds = fs.statSync(d);
    if (ds.size === ss.size && ds.mtimeMs >= ss.mtimeMs) return;
  } catch { /* missing file: copy it */ }
  ensureDir(path.dirname(d));
  fs.copyFileSync(s, d);
}

function copyDir(src, dest, filter = () => true) {
  if (!fs.existsSync(src)) return;
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (!filter(s, entry)) continue;
    if (entry.isDirectory()) copyDir(s, d, filter);
    else copyFileIfChanged(s, d);
  }
}

function pruneOut(dir = OUT) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      pruneOut(p);
      if (!fs.readdirSync(p).length) { fs.rmdirSync(p); madeDirs.delete(p); }
    } else if (!written.has(p)) fs.rmSync(p, { force: true });
  }
}

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

const urlToFile = (url) => (url.endsWith('/') ? url + 'index.html' : url.endsWith('.html') ? url : url + '.html');

/* French labels for navigation / page titles (content itself is bilingual in the Markdown). */
const FR = {
  'Overview': 'Présentation',
  'Installation Guide': "Guide d'installation",
  'Changelog': 'Journal des modifications',
  'Known Issues': 'Problèmes connus',
  'Load Order': 'Ordre de chargement',
  'System Requirements': 'Configuration requise',
  'Wabbajack Installation': 'Installation Wabbajack',
  'Post Installation': 'Post-installation',
  'Using The List': 'Utiliser la liste',
  'Linux Installation Guide': 'Guide Linux',
  'Frequently Asked Questions': 'Foire aux questions',
  'Community Gallery': 'Galerie communautaire',
  'Report a Bug': 'Signaler un bug',
  'Size': 'Taille',
  'Updated': 'Mise à jour',
};

/* ------------------------------------------------------------------ */
/* Markdown                                                           */
/* ------------------------------------------------------------------ */

function createMarkdown() {
  let used = new Map();
  const md = new Marked({ gfm: true });
  md.use({
    hooks: {
      preprocess(src) { used = new Map(); return src; },
    },
    renderer: {
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);
        let id = slugify(text) || 'section';
        const n = used.get(id) || 0;
        used.set(id, n + 1);
        if (n) id = `${id}-${n}`;
        return `<h${depth} id="${id}">${text}</h${depth}>\n`;
      },
    },
  });
  return md;
}
const markdown = createMarkdown();

function renderMarkdown(src) {
  // kramdown's markdown="1" is implicit in CommonMark when a blank line follows the tag.
  src = src.replace(/\s+markdown="1"/g, '');
  // Raw HTML blocks written with tab indentation and blank lines (known issue cards): in CommonMark a
  // blank line ends the HTML block and the next indented tag becomes a code block. Pure-HTML blocks
  // (no markdown inside) are dedented and their blank lines dropped.
  src = src.replace(/^<div class="issue-grid">[\s\S]*?^<\/div>/gm, (b) => b.replace(/^[ \t]+/gm, '').replace(/\n\s*\n/g, '\n'));
  let html = markdown.parse(src);
  // kramdown block IAL → callouts: "{: .note }" before a paragraph or a blockquote.
  html = html
    .replace(/<p>\{:\s*\.([\w-]+)\s*\}<\/p>\s*<blockquote>/g, '<blockquote class="callout callout-$1">')
    .replace(/<p>\{:\s*\.([\w-]+)\s*\}\s*/g, '<p class="callout callout-$1">')
    .replace(/\n?\{:\s*[^}]*\}/g, '');
  return html;
}

/* YouTube iframes → a link with a local thumbnail. site.js swaps it for the player on click
   (youtube-nocookie); without JS the link opens the video on YouTube. Nothing is loaded
   from YouTube until the visitor asks for it. */
function youtubeFacade(html) {
  return html.replace(/<iframe\b[^>]*?src="https:\/\/www\.youtube(?:-nocookie)?\.com\/embed\/([\w-]{6,})[^"]*"[^>]*>\s*<\/iframe>/g, (m, id) => {
    const thumb = `/assets/Images/guides/yt-${id}.webp`;
    const img = fs.existsSync(path.join(ROOT, thumb)) ? `<img src="${thumb}" alt="" loading="lazy" decoding="async">` : '';
    return `<a class="yt" href="https://www.youtube.com/watch?v=${id}" data-yt="${id}" aria-label="Play the video (YouTube)" data-aria-fr="Lire la vidéo (YouTube)">${img}<span class="yt__play" aria-hidden="true"></span></a>`;
  });
}

/* French typography: a no-break space before : ; ? ! » and after «, so a line never starts with
   the punctuation. Text nodes only (not tags, attributes, scripts, styles, code). English text has no
   space before these signs, so running it on the whole page is safe. */
function frenchSpacing(html) {
  let skip = 0;
  return html.split(/(<[^>]+>)/).map((part) => {
    if (part.startsWith('<')) {
      const m = part.match(/^<(\/?)(pre|code|script|style|textarea|kbd)\b/i);
      if (m) skip += m[1] ? -1 : 1;
      return part;
    }
    if (skip > 0 || !part.trim()) return part;
    return part.replace(/ ([:;!?\u00bb])(?=\s|$|&|[)\]])/g, '\u00a0$1').replace(/\u00ab /g, '\u00ab\u00a0');
  }).join('');
}

function postProcessHtml(html) {
  return youtubeFacade(html)
    // external links open in a new tab
    .replace(/<a href="(https?:\/\/(?!theastralforge\.com)[^"]+)"(?![^>]*target=)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer"')
    // lazy images (not the hero picture marked fetchpriority: it is the LCP element and must load at once)
    .replace(/<img (?![^>]*(?:loading|fetchpriority)=)/g, '<img loading="lazy" decoding="async" ');
}

/* ------------------------------------------------------------------ */
/* Live modlist data at build time                                    */
/* ------------------------------------------------------------------ */

// The same file the browser reads. Fetched once per process; on failure (offline,
// timeout, TAF_OFFLINE=1) the committed _data/modlist_snapshot.json is used as is.
const MODLIST_JSON = 'https://raw.githubusercontent.com/Alaxouche/Wunduniik/main/modlist.json';
const SERVE = process.argv.includes('--serve');
let liveCache = null;
async function liveModlists() {
  if (liveCache) return liveCache;
  liveCache = [];
  if (process.env.TAF_OFFLINE) return liveCache;
  try {
    const r = await fetch(MODLIST_JSON, { signal: AbortSignal.timeout(8000) });
    const d = r.ok ? await r.json() : null;
    if (Array.isArray(d)) liveCache = d;
    else console.warn(`! modlist.json: HTTP ${r.status}, using the snapshot`);
  } catch (e) {
    console.warn('! modlist.json unavailable, using the snapshot:', e.message);
  }
  return liveCache;
}

function refreshSnapshot(snapshot, live) {
  const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
  let changed = false;
  const out = snapshot.map((s) => {
    const l = live.find((x) => norm(x.title) === norm(s.title));
    if (!l) return s;
    const n = { ...s, version: l.version, dateUpdated: l.dateUpdated, download_metadata: l.download_metadata };
    if (JSON.stringify(n) !== JSON.stringify(s)) changed = true;
    return n;
  });
  return { out, changed };
}

/* ------------------------------------------------------------------ */
/* Doc enhancements                                                   */
/* ------------------------------------------------------------------ */

/* Section icon from the heading id (EN and FR slugs). First match wins; no match keeps the star. */
const SECTION_ICONS = [
  [/report|signaler/, 'chat'],
  [/disclaimer|avertissement|problem|issue|probleme/, 'alert'],
  [/unlock|deverrouiller/, 'lock'],
  [/antivirus|exclusion/, 'shield'],
  [/pagefile|page-file|fichier-d/, 'memory'],
  [/pre-installation|preparing|preparer|necessary-tweaks|modifications-necessaires|requirement|requise/, 'list'],
  [/install/, 'download'],
  [/application/, 'grid'],
  [/account|compte|website/, 'user'],
  [/starting|demarrer|launch|lancement|(^|-)(first-hours|premieres-heures|getting-started)(-|$)/, 'play'],
  [/updat|mise-a-jour/, 'refresh'],
  [/(^|-)enb(-|$)|preset/, 'sun'],
  [/keymap|raccourci/, 'keyboard'],
  [/profil/, 'layers'],
  [/performance/, 'gauge'],
  [/new-game|nouvelle-partie/, 'flag'],
  [/faq|question/, 'help'],
  [/support/, 'chat'],
  [/(^|-)(sfse|skse|scripts?)(-|$)/, 'code'],
  [/(^|-)(bethini|inis?)(-|$)|mcm|config|setting|parametre/, 'sliders'],
  // Game guide sections (whole words or word starts in the slug, so keymapping, entire, description don't match)
  [/(^|-)(combat|fight|melee|archery|archerie|weapons?|armes?)(-|$)/, 'sword'],
  [/(^|-)(magic|magie|spells?|sorts|shouts?|cris)(-|$)/, 'spark'],
  [/(^|-)(surviv|camping|campfire|hunger|faim|cold|froid|needs|besoins|injur|blessure)/, 'flame'],
  [/(^|-)(money|gold|econom|trade|trading|commerce|vendors?|marchands?|shops?|boutiques?|loot|butin|craft|artisanat|alchem)/, 'coin'],
  [/(^|-)(travel|voyage|horses?|chevaux|cheval|ships?|vaisseaux?|vehicles?|vehicules?|explor|freighters?|cargos?|outposts?|avant-postes?)(-|$)?/, 'compass'],
  [/(^|-)(followers?|compagnons?|companions?|allies|allies)(-|$)/, 'users'],
  [/(^|-)(levell?ing|levels?|niveaux?|perks?|skills?|competences?|class|classes|races?|standing-stones|pierres|cyberware|character|personnage)(-|$)|(^|-)progress/, 'chart'],
  [/(^|-)(quests?|quetes?|missions?|content|contenu|gigs?|contrats?|lands|terres)(-|$)/, 'flag'],
  [/about|propos/, 'info'],
  [/(^|-)live(-|$)/, 'pulse'],
];
const sectionIcon = (id) => (SECTION_ICONS.find(([re]) => re.test(id)) || [])[1];

/* Quick-link cards for a modlist overview, built from the real navigation. */
const QUICK = {
  'Installation Guide': ['download', (n) => [`${n} steps, from the requirements to the first launch`, `${n} étapes, de la configuration requise au premier lancement`]],
  'Game Guide': ['compass', (n) => [`${n} pages: how a new game starts, the controls, progression and the systems the list adds`, `${n} pages : le début de partie, les commandes, la progression et les systèmes ajoutés par la liste`]],
  'Changelog': ['refresh', (_, m) => [`Every version. Latest: v<span data-live="${m.title}" data-field="version">${m.live.version}</span>`, `Toutes les versions. Dernière : v<span data-live="${m.title}" data-field="version">${m.live.version}</span>`]],
  'Known Issues': ['alert', () => ['Problems we know about and how to fix them', 'Les problèmes connus et comment les régler']],
  'Load Order': ['layers', () => ['Every mod and plugin in the list, in order', 'Tous les mods et plugins de la liste, dans l\'ordre']],
  'Troubleshooting': ['help', () => ['Find your problem in a few questions, read a crash log', 'Trouvez votre problème en quelques questions, lisez un journal de crash']],
  'Mod Contents': ['chart', (_, m) => (m.contents
    ? [`${fmtInt(m.contents.totals.mods, 'en')} mods in ${m.contents.totals.sections} sections, by disk space and by count`,
      `${fmtInt(m.contents.totals.mods, 'fr')} mods en ${m.contents.totals.sections} sections, par espace disque et par nombre`]
    : ['What the list is made of', 'De quoi la liste est faite'])],
};
const biHtml = (en, fr) => `<span lang="en">${en}</span><span lang="fr">${fr}</span>`;
const escHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

function quickCards(modlist, relativeUrl) {
  const items = [...modlist.nav].sort((a, b) => (b.children.length > 0) - (a.children.length > 0));
  const cards = items.map((item) => {
    const q = QUICK[item.title];
    const [icon, desc] = q || ['star', () => ['', '']];
    const [en, fr] = desc(item.children.length + 1, modlist);
    const title = FR[item.title] && FR[item.title] !== item.title ? biHtml(escHtml(item.title), escHtml(FR[item.title])) : escHtml(item.title);
    return `<a class="quick__card" href="${relativeUrl(item.url)}" data-icon="${icon}"><span class="quick__ico" aria-hidden="true"></span>` +
      `<span class="quick__title">${title}</span>${en ? `<span class="quick__desc">${biHtml(en, fr)}</span>` : ''}<span class="quick__go" aria-hidden="true">→</span></a>`;
  });
  return `<nav class="quick" aria-label="Quick links" data-aria-fr="Accès rapides">${cards.join('')}</nav>`;
}

/* ---- Skill trees (data from scripts/build-perk-trees.py, e.g. _data/perk_trees_wunduniik.json) ----
   Drawn as the game draws them: node positions and links from the perk tree records. */
const escAttr = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function perkOrder(tree) {
  // Reading order used by the numbers on the drawing and in the table: lowest requirement first
  const req = (n) => (n.ranks && n.ranks[0] && n.ranks[0].req != null ? n.ranks[0].req : 999);
  return [...tree.nodes].sort((a, b) => req(a) - req(b) || a.y - b.y || a.x - b.x);
}

function perkTreeSvg(tree, mode = 'thumb') {
  const nodes = tree.nodes || [];
  if (!nodes.length) return '';
  const big = mode === 'full';
  const xs = nodes.map((n) => n.x), ys = nodes.map((n) => n.y);
  const minX = Math.min(...xs), minY = Math.min(...ys);
  const spanX = Math.max(Math.max(...xs) - minX, 0.5), spanY = Math.max(Math.max(...ys) - minY, 0.5);
  const W = big ? 640 : 240, pad = big ? 36 : 16, maxH = big ? 520 : 150;
  const s = Math.min((W - 2 * pad) / spanX, (maxH - 2 * pad) / spanY);
  const H = big ? Math.max(220, Math.round(spanY * s + 2 * pad)) : maxH;
  const ox = (W - spanX * s) / 2, oy = (H - spanY * s) / 2;
  const px = (x) => +(ox + (x - minX) * s).toFixed(1);
  const py = (y) => +(H - (oy + (y - minY) * s)).toFixed(1); // the game's y axis points up
  const byI = new Map(nodes.map((n) => [n.i, n]));
  const num = new Map(perkOrder(tree).map((n, k) => [n.i, k + 1]));
  let lines = '', dots = '';
  for (const n of nodes) for (const l of n.links) {
    const m = byI.get(l);
    if (m) lines += `<line x1="${px(n.x)}" y1="${py(n.y)}" x2="${px(m.x)}" y2="${py(m.y)}"/>`;
  }
  for (const n of nodes) {
    const req = n.ranks && n.ranks[0] && n.ranks[0].req != null ? ` (${n.ranks[0].req})` : '';
    if (big) {
      const k = num.get(n.i);
      dots += `<a href="#perk-${tree.slug}-${k}"><title>${escAttr(n.name + req)}</title><circle cx="${px(n.x)}" cy="${py(n.y)}" r="8"/>` +
        `<text x="${px(n.x)}" y="${py(n.y) - 13}">${k}</text></a>`;
    } else {
      dots += `<circle cx="${px(n.x)}" cy="${py(n.y)}" r="3.4"/>`;
    }
  }
  const label = `${tree.name} skill tree, ${nodes.length} perks`;
  return `<svg class="pt pt--${big ? 'full' : 'thumb'}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${escAttr(label)}"><g class="pt__links">${lines}</g><g class="pt__nodes">${dots}</g></svg>`;
}

/* The whole skill-tree page body: card grids per group, then each tree with its drawing and perk table.
   Returned as one HTML block without blank lines, so the Markdown pass leaves it alone. */
const PT_GROUPS = {
  skills: ['The skills', 'Les compétences', 'Every vanilla skill tree, rebuilt by the perk overhauls of the list.', 'Tous les arbres du jeu de base, refaits par les refontes de perks de la liste.'],
  custom: ['Added skills', 'Compétences ajoutées', 'New skills from Custom Skills Framework mods, each with its own perk points or levels.', 'Les nouvelles compétences des mods Custom Skills Framework, chacune avec ses propres points ou niveaux.'],
  transform: ['Vampire Lord and Werewolf', 'Seigneur vampire et loup-garou', 'The trees you only get by turning.', 'Les arbres que vous obtenez seulement en vous transformant.'],
};
function perkTreesHtml(data) {
  const trees = (data && data.trees) || [];
  let html = '';
  for (const [g, [en, fr, den, dfr]] of Object.entries(PT_GROUPS)) {
    const list = trees.filter((t) => t.group === g);
    if (!list.length) continue;
    html += `<h2 id="${g}">${biHtml(en, fr)}</h2><p>${biHtml(den, dfr)}</p><div class="pt-grid">`;
    for (const t of list) {
      html += `<a class="pt-card" href="#tree-${t.slug}"><span class="pt-card__head"><span class="pt-card__name">${escHtml(t.name)}</span>` +
        `<span class="pt-card__count">${biHtml(t.nodes.length + ' perks', t.nodes.length + ' perks')}</span></span>${perkTreeSvg(t, 'thumb')}` +
        (t.by ? `<span class="pt-card__by">${biHtml('Last changed by ' + escHtml(t.by), 'Modifié en dernier par ' + escHtml(t.by))}</span>` : '') + '</a>';
    }
    html += '</div>';
  }
  html += `<h2 id="every-perk">${biHtml('Every perk', 'Tous les perks')}</h2>`;
  for (const t of trees) {
    html += `<section class="pt-tree" id="tree-${t.slug}"><h3>${escHtml(t.name)}</h3>` +
      (t.description ? `<p class="pt-tree__desc">${escHtml(t.description)}</p>` : '') +
      `<div class="pt-figure">${perkTreeSvg(t, 'full')}</div><div class="table-scroll"><table class="pt-table"><thead><tr><th>#</th><th>Perk</th>` +
      `<th>${biHtml('Needs', 'Requis')}</th><th>${biHtml('Effect', 'Effet')}</th></tr></thead><tbody>`;
    perkOrder(t).forEach((n, k) => {
      const ranks = n.ranks || [];
      const reqs = ranks.map((r) => (r.req != null ? r.req : '·')).join(' / ');
      const eff = ranks.length > 1
        ? '<ol class="pt-ranks">' + ranks.map((r) => `<li>${escHtml(r.desc)}</li>`).join('') + '</ol>'
        : escHtml(ranks[0] ? ranks[0].desc : '');
      html += `<tr id="perk-${t.slug}-${k + 1}"><td class="pt-num">${k + 1}</td><td class="pt-name">${escHtml(n.name)}</td><td class="pt-req">${reqs}</td><td>${eff}</td></tr>`;
    });
    html += '</tbody></table></div>' + (t.by ? `<p class="pt-tree__by">${biHtml('Last changed by ' + escHtml(t.by), 'Modifié en dernier par ' + escHtml(t.by))}</p>` : '') + '</section>';
  }
  return html;
}

/* ---- Static versions of what site.js used to add after load (layout shifts, CLS) ---- */

const stripTags = (s) => String(s).replace(/<[^>]+>/g, '').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

/* Changelogs (3+ <details>): version / date / badges / counters in the summary, the latest
   version open, and the search bar. site.js only wires the search and "expand all". */
const CL_KINDS = [['add', /addition|added|ajout/i, '+'], ['rem', /removal|removed|retir|suppr/i, '−'], ['fix', /fix|tweak|correct/i, 'fix'], ['upd', /update|mise/i, '↑']];
const CL_RE = /<details>\s*<summary>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/g;
function changelogStatic(content) {
  if ((content.match(CL_RE) || []).length < 3) return content;
  let i = 0;
  // Section headings were written three ways over the years ("### Additions", "# Additions:", or a
  // plain "Additions:" line): every version gets the same <h3> label, so headings and counters match.
  const CL_LABEL = { add: 'Additions', rem: 'Removals', fix: 'Fixes and Tweaks', upd: 'Updates' };
  const kindOf = (t) => { t = stripTags(t).trim(); return t.length <= 32 ? (CL_KINDS.find(([, re]) => re.test(t)) || [])[0] : null; };
  const normalize = (body) => body
    .replace(/<h[1-6]((?:\s[^>]*)?)>([\s\S]*?)<\/h[1-6]>/g, (m, attrs, inner) => { const k = kindOf(inner); return k ? `<h3${attrs}>${CL_LABEL[k]}</h3>` : /^<h[12]/.test(m) ? `<h3${attrs}>${inner}</h3>` : m; })
    .replace(/<p>((?:(?!<\/p>)[\s\S]){1,60})<\/p>(?=\s*<ul>)/g, (m, inner) => {
      const t = stripTags(inner).trim();
      const k = /:\s*$/.test(t) || /^<strong>[\s\S]*<\/strong>$/.test(inner.trim()) ? kindOf(t.replace(/:\s*$/, '')) : null;
      return k ? `<h3>${CL_LABEL[k]}</h3>` : m;
    });
  return content.replace(CL_RE, (m, sum, body) => {
    body = normalize(body);
    const counts = {};
    for (const [, h3, , ul] of body.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>((?:(?!<h3)[\s\S])*?)<ul>([\s\S]*?)<\/ul>/g)) {
      const k = CL_KINDS.find(([, re]) => re.test(stripTags(h3)));
      if (k) counts[k[0]] = (counts[k[0]] || 0) + (ul.match(/<li\b/g) || []).length;
    }
    const txt = stripTags(sum + ' ' + body);
    const imp = (txt.match(/Update Importance:\s*\**\s*(MAJOR|MINOR|MEDIUM|HOTFIX|PATCH|CRITICAL|SMALL|LOW|HIGH)/i) || [])[1];
    const raw = stripTags(sum).trim(), cut = raw.lastIndexOf(' - ');
    const ver = cut > 0 ? raw.slice(0, cut) : raw, date = cut > 0 ? raw.slice(cut + 3) : '';
    let meta = '';
    if (i === 0) meta += `<span class="cl-tag cl-tag--latest">${biHtml('Latest', 'Dernière')}</span>`;
    if (imp) meta += `<span class="cl-tag cl-imp cl-imp--${imp.toLowerCase()}">${imp.toUpperCase()}</span>`;
    if (/NOT SAVE COMPATIBLE/i.test(txt)) meta += `<span class="cl-tag cl-tag--warn" title="Not save compatible" data-title-fr="Incompatible avec les sauvegardes existantes">${biHtml('New save', 'Nouvelle partie')}</span>`;
    for (const [k, , sign] of CL_KINDS) if (counts[k]) meta += `<span class="cl-count cl-count--${k}">${k === 'fix' ? counts[k] + ' fix' : k === 'upd' ? counts[k] + ' ' + biHtml('upd', 'maj') : sign + counts[k]}</span>`;
    const summary = `<summary><span class="cl-v">${escHtml(ver)}</span>${date ? `<span class="cl-date">${escHtml(date)}</span>` : ''}<span class="cl-meta">${meta}</span></summary>`;
    const tools = i === 0
      ? '<div class="cl-tools" data-cl-tools><input class="input" type="search" data-cl-q placeholder="Find a mod in the changelog…" data-ph-fr="Chercher un mod dans le changelog…" aria-label="Find a mod in the changelog" data-aria-fr="Chercher un mod dans le changelog">' +
        `<span class="cl-found" data-cl-found role="status"></span><button class="btn btn--sm" type="button" data-cl-all aria-expanded="false">${biHtml('Expand all', 'Tout déplier')}</button></div>\n`
      : '';
    return `${tools}<details${i++ === 0 ? ' open' : ''}>${summary}${body}</details>`;
  });
}


/* "6 months ago" / "il y a 6 mois" at build time, same thresholds as relTime() in site.js */
function relTimeBi(iso, now = Date.now()) {
  const d = new Date(iso);
  if (isNaN(d)) return '';
  const s = (d - now) / 1000, a = Math.abs(s);
  const fmt = (l) => {
    const r = new Intl.RelativeTimeFormat(l, { numeric: 'auto' });
    if (a < 3600) return r.format(Math.round(s / 60), 'minute');
    if (a < 86400) return r.format(Math.round(s / 3600), 'hour');
    if (a < 86400 * 30) return r.format(Math.round(s / 86400), 'day');
    if (a < 86400 * 365) return r.format(Math.round(s / (86400 * 30.4)), 'month');
    return r.format(Math.round(s / (86400 * 365)), 'year');
  };
  return biHtml(fmt('en'), fmt('fr'));
}

/* Thumbnails from scripts/make-thumbs.py (assets/Images/_thumbs/manifest.json).
   Every helper falls back to the original image when no thumbnail exists. */
let THUMBS = {};
const decodeSafe = (s) => { try { return decodeURI(s); } catch { return s; } };
function thumbOf(src, width) {
  const e = THUMBS[decodeSafe(String(src))];
  const t = e && e.t && e.t[String(width)];
  return t && fs.existsSync(path.join(ROOT, t)) ? encodeURI(t) : src;
}
function srcsetOf(src) {
  const e = THUMBS[decodeSafe(String(src))];
  if (!e || !e.t) return '';
  const parts = Object.entries(e.t).filter(([, t]) => fs.existsSync(path.join(ROOT, t))).map(([w, t]) => `${encodeURI(t)} ${w}w`);
  return parts.length ? [...parts, `${src} ${e.w}w`].join(', ') : '';
}

/* Glossary tooltips (_data/glossary.yml). The first occurrence of each term on a page, in each
   language block, becomes <span class="gl">term<span class="gl__tip" role="tooltip">…</span></span>.
   Only text inside .prose or .faq__answer is touched, never headings, links, code, buttons, summaries
   or the drawn widgets (keyboard maps, gauges, skill boards). Runs on the final HTML, after the
   search index, so the definitions do not leak into search results. */
const GL_SKIP_TAGS = new Set(['a', 'code', 'pre', 'kbd', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'summary', 'button', 'script', 'style',
  'svg', 'title', 'textarea', 'select', 'option', 'label', 'figcaption', 'abbr', 'dt',
  'table']); // tables scroll sideways (overflow), which would clip the tooltip
const GL_SKIP_CLASS = /\b(?:gl|kbmap|kb|gauge|sk-board|pt-grid|pt-table|sk-table|issue-status|quick|doc-cta|steps|pager|tags|cl-tools|stats|yt|anchor|copy|shots|features|tmw|tm|est|aw|ts|cr)\b/;
const GL_VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
let GLOSSARY = null;
function glossaryEntries(list) {
  return (list || []).map((g) => ({
    ...g,
    re: new RegExp(`(?<![\\p{L}\\p{N}_.])(?:${g.match.join('|')})(?![\\p{L}\\p{N}_])`, g.i ? 'iu' : 'u'),
  }));
}
function glossarize(html) {
  if (!GLOSSARY || !GLOSSARY.length) return html;
  const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const seen = {};
  const stack = []; // {name, allow, skip, lang}
  let n = 0;
  const out = [];
  const tagRe = /<!--[\s\S]*?-->|<\/?([a-zA-Z][\w-]*)\b[^>]*>/g;
  let last = 0, m;
  const top = () => stack[stack.length - 1] || { allow: false, skip: false, lang: 'x' };
  const tip = (g, lang) => {
    const id = `gl-${g.id}-${++n}`;
    const def = lang === 'en' || lang === 'fr' ? esc(g[lang])
      : `<span lang="en">${esc(g.en)}</span><span lang="fr">${esc(g.fr)}</span>`;
    return [id, `<span class="gl__tip" role="tooltip" id="${id}"><strong>${esc(g.name)}</strong> ${def}</span>`];
  };
  const doText = (text) => {
    const ctx = top();
    if (!ctx.allow || ctx.skip || !text.trim()) return text;
    const done = (seen[ctx.lang] = seen[ctx.lang] || new Set());
    let res = '', rest = text;
    for (;;) {
      let best = null;
      for (const g of GLOSSARY) {
        if (done.has(g.id)) continue;
        const r = g.re.exec(rest);
        if (r && (!best || r.index < best.r.index)) best = { g, r };
      }
      if (!best) break;
      const { g, r } = best;
      done.add(g.id);
      const [id, t] = tip(g, ctx.lang);
      res += rest.slice(0, r.index) + `<span class="gl" tabindex="0" aria-describedby="${id}">${r[0]}${t}</span>`;
      rest = rest.slice(r.index + r[0].length);
    }
    return res + rest;
  };
  while ((m = tagRe.exec(html))) {
    out.push(doText(html.slice(last, m.index)));
    last = tagRe.lastIndex;
    const tag = m[0], name = (m[1] || '').toLowerCase();
    out.push(tag);
    if (!name || tag.startsWith('<!--')) continue;
    if (tag[1] === '/') {
      for (let i = stack.length - 1; i >= 0; i--) if (stack[i].name === name) { stack.length = i; break; }
      continue;
    }
    if (GL_VOID.has(name) || tag.endsWith('/>')) continue;
    const parent = top();
    const cls = (tag.match(/\sclass="([^"]*)"/) || [])[1] || '';
    const lang = (tag.match(/\slang="([a-z]+)"/) || [])[1];
    stack.push({
      name,
      allow: parent.allow || /\b(?:prose|faq__answer)\b/.test(cls),
      skip: parent.skip || GL_SKIP_TAGS.has(name) || GL_SKIP_CLASS.test(cls),
      lang: lang || parent.lang,
    });
  }
  out.push(doText(html.slice(last)));
  return out.join('');
}

/* "Key Features" bullet list (- **Title**: text) → alternating text / screenshot rows. */
function featureRows(content, gallery, relativeUrl) {
  return content.replace(/(<h3 id="(?:key-features|fonctionnalites-cles)[^"]*">[\s\S]*?<\/h3>)\s*<ul>([\s\S]*?)<\/ul>/g, (m, head, list) => {
    const items = [...list.matchAll(/<li>\s*<strong>([\s\S]*?)<\/strong>\s*:?\s*([\s\S]*?)<\/li>/g)];
    if (!items.length) return m;
    const pics = gallery || [];
    const rows = items.map(([, title, text], i) => {
      const pic = pics.length ? pics[Math.round(((i + 1) * pics.length) / (items.length + 1)) % pics.length] : null;
      const media = pic ? `<figure class="feature__media"><img src="${relativeUrl(thumbOf(pic, 960))}" data-zoom="${relativeUrl(pic)}" alt="" loading="lazy" decoding="async"></figure>` : '';
      return `<article class="feature${pic ? '' : ' feature--text'}">${media}<div class="feature__text">` +
        `<span class="feature__n">${String(i + 1).padStart(2, '0')}</span><h4>${title}</h4><p>${text.replace(/^:\s*/, '')}</p></div></article>`;
    });
    return `${head}\n<div class="features">${rows.join('')}</div>`;
  });
}

/* ------------------------------------------------------------------ */
/* Build                                                              */
/* ------------------------------------------------------------------ */

async function build() {
  const t0 = Date.now();
  const config = yaml.load(read('_config.yml'));
  const baseurl = (config.baseurl || '').replace(/\/$/, '');
  const siteUrl = (config.url || '').replace(/\/$/, '');

  /* Data files */
  const data = {};
  for (const f of fs.readdirSync(path.join(ROOT, '_data'))) {
    const name = f.replace(/\.(ya?ml|json)$/, '');
    const raw = read(path.join('_data', f));
    data[name] = f.endsWith('.json') ? JSON.parse(raw) : yaml.load(raw);
  }
  // Fresh version / size / date for the values printed in the HTML (no-JS and first paint)
  if (Array.isArray(data.modlist_snapshot)) {
    const live = await liveModlists();
    if (live.length) {
      const { out, changed } = refreshSnapshot(data.modlist_snapshot, live);
      data.modlist_snapshot = out;
      // `npm run build` keeps the committed fallback current; the dev server only uses it in memory
      // (writing into _data/ would trigger another rebuild).
      if (changed && !SERVE) fs.writeFileSync(path.join(ROOT, '_data/modlist_snapshot.json'), JSON.stringify(out, null, 2) + '\n');
    }
  }

  const engine = new Liquid({
    root: [path.join(THEME, 'layouts'), path.join(THEME, 'includes'), path.join(ROOT, '_includes')],
    layouts: path.join(THEME, 'layouts'),
    extname: '',
    jekyllInclude: true,
    dynamicPartials: false,
    strictFilters: false,
    strictVariables: false,
    cache: false,
  });
  const relativeUrl = (u = '') => (/^https?:/.test(u) ? u : baseurl + (String(u).startsWith('/') ? u : '/' + u));
  engine.registerFilter('relative_url', relativeUrl);
  engine.registerFilter('absolute_url', (u) => siteUrl + relativeUrl(u));
  engine.registerFilter('markdownify', (s) => renderMarkdown(String(s ?? '')));
  engine.registerFilter('fr', (s) => FR[s] || s);
  engine.registerFilter('bi', (s) => {
    const fr = FR[s];
    const esc = (x) => String(x).replace(/&/g, '&amp;').replace(/</g, '&lt;');
    return fr && fr !== s ? `<span lang="en">${esc(s)}</span><span lang="fr">${esc(fr)}</span>` : esc(s);
  });
  engine.registerFilter('reltime', (iso) => relTimeBi(iso));
  engine.registerFilter('num', (n) => (Number.isFinite(+n) ? (+n).toLocaleString('en') : n)); // 3784 -> 3,784
  engine.registerFilter('perk_trees', (data) => perkTreesHtml(data));
  engine.registerFilter('keymap', (data, lang) => keymapHtml(data, lang));
  engine.registerFilter('gauge', (data, lang) => gaugeHtml(data, lang));
  engine.registerFilter('cp_perks', (data) => cpPerksHtml(data));
  engine.registerFilter('sf_skills', (data) => sfSkillsHtml(data));
  // What is inside each list (_data/contents_<id>.json from scripts/modlist-contents.py)
  const contents = Object.fromEntries(Object.entries(data).filter(([k]) => k.startsWith('contents_')).map(([k, v]) => [k.slice(9), v]));
  const snapOf = (id) => ((data.modlist_snapshot || []).find((x) => x.id === id) || {}).download_metadata || {};
  engine.registerFilter('contents_map', (id) => contentsMapHtml(contents[id]));
  engine.registerFilter('install_estimator', (id, lang) => (contents[id] && data.install_estimator
    ? estimatorHtml({ ...contents[id], inst: snapOf(id).SizeOfInstalledFiles || contents[id].totals.installed }, data.install_estimator, lang) : ''));
  let authorsCache = null;
  const authorsOf = () => (authorsCache ||= authorsModel(contents, modlists));
  engine.registerFilter('authors_wall', () => authorsWallHtml(authorsOf()));
  // Troubleshooting: links to sections of the list's own pages (page title aliases, heading ids as the
  // Markdown renderer makes them). A missing page drops the link; a missing heading drops the anchor.
  const PAGE_ALIASES = { Installation: ['Installation', 'Pre-Installation'] };
  const resolveLink = (id, l) => {
    const self = l.page === 'self';
    const names = self ? ['Troubleshooting'] : PAGE_ALIASES[l.page] || [l.page];
    const pg = pages.find((x) => x.collection === id && names.includes(x.title));
    if (!pg) return null;
    const ml = modlists.find((m) => m.id === id) || {};
    const alts = (v) => (v == null ? [] : Array.isArray(v) ? v : [v]).map((t) => t.replace('{list}', ml.title || ''));
    let aEn = '', aFr = '', hEn = '', hFr = '';
    if (l.h) {
      const hs = headingIds(pg.body, slugify);
      const en = alts(l.h.en), fr = alts(l.h.fr);
      const iEn = hs.findIndex((x) => en.includes(x.text));
      if (iEn !== -1) { aEn = hs[iEn].id; hEn = hs[iEn].text; }
      const iFr = hs.findIndex((x, i) => fr.includes(x.text) && (i !== iEn || !en.includes(x.text)));
      if (iFr !== -1) { aFr = hs[iFr].id; hFr = hs[iFr].text; }
      if (!aEn && !aFr && self) return null;
    }
    const url = self ? '' : relativeUrl(pg.url);
    const tEn = pg.title, tFr = FR[pg.title] || pg.title;
    const lab = (t, h) => (self ? h || t : h ? `${t} › ${h}` : t);
    return {
      hrefEn: url + (aEn ? '#' + aEn : '') || '#', hrefFr: url + (aFr ? '#' + aFr : '') || '#',
      labelEn: l.label ? l.label.en : lab(tEn, hEn), labelFr: l.label ? l.label.fr : lab(tFr, hFr),
    };
  };
  engine.registerFilter('troubleshooter', (id) => troubleshooterHtml(data.troubleshoot, id, resolveLink));
  engine.registerFilter('crash_reader', (id) => crashReaderHtml(id));
  // {{ src | thumb: 480 }} → thumbnail URL (or src); {{ src | srcset }} → "t480 480w, ..., src 2560w" (or '')
  try { THUMBS = JSON.parse(read('assets/Images/_thumbs/manifest.json')); } catch { THUMBS = {}; }
  GLOSSARY = glossaryEntries(data.glossary);
  engine.registerFilter('thumb', (s, w = 480) => relativeUrl(thumbOf(s, w)));
  engine.registerFilter('srcset', (s) => srcsetOf(s).split(', ').filter(Boolean)
    .map((p) => { const i = p.lastIndexOf(' '); return relativeUrl(p.slice(0, i)) + p.slice(i); }).join(', '));

  /* Collect pages */
  const pages = [];
  const collections = Object.keys(config.collections || {});

  for (const key of collections) {
    const dir = path.join(ROOT, '_' + key);
    if (!fs.existsSync(dir)) continue;
    for (const file of walk(dir).filter((f) => /\.(md|html)$/.test(f))) {
      const rel = path.relative(dir, file).replace(/\\/g, '/');
      const { data: fm, body } = parseFrontMatter(fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n'));
      let url = fm.permalink;
      if (!url) {
        const noExt = rel.replace(/\.(md|html)$/, '');
        url = '/' + key + '/' + (noExt === 'index' ? '' : noExt.replace(/\/index$/, '') + '/');
      }
      pages.push({ ...fm, url, body, collection: key, ext: path.extname(file), source: path.relative(ROOT, file) });
    }
  }

  for (const f of fs.readdirSync(ROOT)) {
    if (!/\.(md|html)$/.test(f) || /^readme/i.test(f)) continue;
    const { data: fm, body } = parseFrontMatter(read(f));
    if (!fm) continue;
    const base = f.replace(/\.(md|html)$/, '');
    const url = fm.permalink || (base === 'index' ? '/' : `/${base}/`);
    pages.push({ ...fm, url, body, ext: path.extname(f), source: f });
  }

  /* Modlists (from each collection's index page) */
  const modlists = collections.map((key) => {
    const idx = pages.find((p) => p.collection === key && p.url === `/${key}/`) || {};
    const banner = idx.project_banner || {};
    return {
      id: key,
      url: `/${key}/`,
      title: idx.title || key,
      game: idx.game || '',
      image: banner.image || idx.image || '/assets/Images/generic_background.webp',
      // Every list uses the site gold (asked by the user, Nov 2026); project_banner.accent is no longer used
      accent: 'var(--gold)',
      // emblem drawn by scripts/make-modlist-emblems.py, shown on the home panel
      emblem: exists(`assets/logos/emblems/${key}.svg`) ? `/assets/logos/emblems/${key}.svg` : null,
      subtitle: banner.subtitle || '',
      subtitle_fr: banner.subtitle_fr || '',
      contents: data['contents_' + key] || null,
      // Mod count: from the published list (_data/contents_<id>.json), else the hand-written stat
      mods: data['contents_' + key]?.totals?.mods ? String(data['contents_' + key].totals.mods)
        : ((banner.stats || []).find((s) => s.label === 'Mods') || {}).value || null,
    };
  });

  // French titles given in front matter (title_fr) join the FR dictionary used by the bi filter
  for (const p of pages) if (p.title && p.title_fr) FR[p.title] = p.title_fr;

  /* Sidebar navigation per collection */
  const byOrder = (a, b) => (a.nav_order ?? 99) - (b.nav_order ?? 99) || String(a.title).localeCompare(String(b.title));
  const navs = {};
  for (const m of modlists) {
    const docs = pages.filter((p) => p.collection === m.id);
    const top = docs.filter((p) => !p.parent && p.url !== m.url && !p.nav_exclude).sort(byOrder);
    navs[m.id] = top.map((p) => ({
      title: p.title,
      url: p.url,
      children: docs.filter((c) => c.parent === p.title).sort(byOrder).map((c) => ({ title: c.title, url: c.url })),
    }));
  }

  for (const m of modlists) {
    m.nav = navs[m.id];
    // Fallback values for live data (refreshed client-side from modlist.json)
    const snap = (data.modlist_snapshot || []).find((x) => x.id === m.id) || {};
    const meta = snap.download_metadata || {};
    m.live = {
      version: snap.version || '',
      updated: snap.dateUpdated || '',
      size: meta.TotalSize ? String(Math.round(meta.TotalSize / 1e9)) : '',
      archives: meta.NumberOfArchives ? String(meta.NumberOfArchives) : '',
    };
  }

  /* Render */
  written = new Set();
  madeDirs.clear();
  fs.mkdirSync(OUT, { recursive: true });

  // Cache-busting token: changes only when the CSS or JS changes, so unchanged
  // pages keep identical bytes between builds (and browsers keep their cache).
  const version = crypto.createHash('sha1')
    .update(fs.readFileSync(path.join(THEME, 'assets/site.css')))
    .update(fs.readFileSync(path.join(THEME, 'assets/site.js')))
    .update(fs.readFileSync(path.join(THEME, 'assets/forge/forge.js')))
    .digest('hex').slice(0, 10);

  const site = {
    title: config.title,
    description: config.description,
    url: siteUrl,
    baseurl,
    data,
    modlists,
    year: new Date().getFullYear(),
    version,
  };
  const searchIndex = [];
  const layoutFor = (p) => {
    if (p.layout === 'skyground_home') return 'home.liquid';
    if (p.layout === 'page') return 'page.liquid';
    return 'doc.liquid';
  };

  for (const page of pages) {
    const modlist = modlists.find((m) => m.id === page.collection);
    // Prev / next within a guide section (parent page + its children)
    let prev = null, next = null, step = null;
    if (page.collection) {
      for (const item of navs[page.collection]) {
        const seq = item.children.length ? [{ title: item.title, url: item.url }, ...item.children] : [];
        const i = seq.findIndex((s) => s.url === page.url);
        if (i === -1) continue;
        prev = seq[i - 1] || null; next = seq[i + 1] || null;
        // "Step n / N" only for the install guide: a game guide is not read in order
        if (/install/i.test(item.title)) step = { i: i + 1, n: seq.length, items: seq };
      }
    }
    // Social preview drawn by scripts/make-og.py (assets/og/<url with / as -->.jpg), when it exists
    const ogSlug = page.url.replace(/^\/|\/$/g, '').replace(/\//g, '--') || 'home';
    page.og_image = exists(`assets/og/${ogSlug}.jpg`) ? `/assets/og/${ogSlug}.jpg` : null;
    const ctx = { site, page, modlist, nav: page.collection ? navs[page.collection] : null, prev, next, step };
    let content = await engine.parseAndRender(page.body, ctx);
    // Pages using the 'page' layout are hand-written HTML: skip Markdown.
    if (page.ext === '.md' && layoutFor(page) !== 'page.liquid') content = renderMarkdown(content);
    content = postProcessHtml(content);
    // Disk-space placeholders (formerly filled client-side) → values from _data/modlist_snapshot.json
    const snap = (data.modlist_snapshot || []).find((x) => x.id === page.collection);
    const meta = snap && snap.download_metadata;
    const gb = (b) => (meta ? Math.round(b / 1e9) + '&nbsp;<span lang="en">GB</span><span lang="fr">Go</span>' : '?');
    content = content
      .replace(/(data-modlist-total[^>]*>)Loading.../g, (_, t) => t + gb(meta && meta.TotalSize))
      .replace(/(data-modlist-install[^>]*>)Loading.../g, (_, t) => t + gb(meta && meta.SizeOfInstalledFiles))
      .replace(/(data-modlist-download[^>]*>)Loading.../g, (_, t) => t + gb(meta && meta.SizeOfArchives));
    // The doc layout prints the page title; a first h2 repeating it ("System Requirements"
    // under "System Requirements") is marked so CSS hides it and the outline skips it.
    if (modlist && page.title) {
      const titles = [page.title, FR[page.title]].filter(Boolean).map(slugify);
      const same = (t) => titles.some((x) => t === x || t === x + 's' || t + 's' === x);
      content = content.replace(/(^\s*|<div lang="(?:en|fr)">\s*)(<h1[^>]*>[\s\S]*?<\/h1>\s*)?<h2 id="([^"]+)">([\s\S]*?)<\/h2>/g,
        (m, pre, h1 = '', id, text) => (same(slugify(text)) ? `${pre}${h1}<h2 id="${id}" class="is-dup">${text}</h2>` : m));
    }
    if (page.gallery_path) {
      const dir = path.join(ROOT, decodeURI(page.gallery_path));
      page.gallery = fs.existsSync(dir)
        ? fs.readdirSync(dir).filter((f) => /\.(webp|jpe?g|png)$/i.test(f)).sort()
            .map((f) => page.gallery_path + encodeURIComponent(f))
        : [];
    }
    if (modlist) {
      // Section icons (h2 only)
      content = content.replace(/<h2 id="([^"]+)"/g, (m, id) => { const ic = sectionIcon(id); return ic ? `${m} data-icon="${ic}"` : m; });
      // Changelog pages only: the contents page also has <details> blocks
      if (page.url.includes('/changelog/')) content = changelogStatic(content);
      if (page.url === modlist.url) {
        // Overview: text "Quick Links" lists become cards placed under the stats
        content = content.replace(/<h2 id="(?:quick-links|liens-rapides)[^>]*>[\s\S]*?<\/h2>\s*<ul>[\s\S]*?<\/ul>\s*/g, '');
        const cards = quickCards(modlist, relativeUrl);
        content = content.includes('</dl>') ? content.replace('</dl>', '</dl>\n' + cards) : cards + content;
        content = featureRows(content, page.gallery, relativeUrl);
      }
    }
    const inner = await engine.renderFile(layoutFor(page), { ...ctx, content });
    const html = await engine.renderFile('base.liquid', { ...ctx, content: inner });
    const glossed = (modlist && !/\/(?:changelog|loadorder)\//.test(page.url)) || page.url === '/faq/' || page.url === '/hub/';
    writeOut(urlToFile(page.url), frenchSpacing(glossed ? glossarize(html) : html));

    if (page.url !== '/404') {
      // One text per language (site.js searches the visitor's language), French title when there is one
      const textOf = (h) => h.replace(/<(script|style)[\s\S]*?<\/\1>/g, ' ').replace(/<[^>]+>/g, ' ')
        .replace(/&[#\w]+;/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 30000);
      const en = textOf(dropLang(content, 'fr')), fr = textOf(dropLang(content, 'en'));
      const entry = { t: page.title, s: modlist ? modlist.title : '', u: page.url, x: en };
      const tFr = FR[page.title] || page.title_fr;
      if (tFr && tFr !== page.title) entry.f = tFr;
      if (fr !== en) entry.y = fr;
      searchIndex.push(entry);
    }
  }

  /* Liquid-processed non-HTML files (feeds, robots, manifest) */
  const extraFiles = ['releases.xml', 'robots.txt', 'manifest.webmanifest',
    ...fs.readdirSync(path.join(ROOT, 'feeds')).map((f) => 'feeds/' + f)];
  for (const f of extraFiles) {
    if (!exists(f)) continue;
    const { body } = parseFrontMatter(read(f));
    writeOut(f, (await engine.parseAndRender(body, { site })).trimStart());
  }

  /* Mod lists loaded on demand by the contents pages and the authors wall */
  for (const [id, c] of Object.entries(contents)) {
    writeOut(`assets/data/contents-${id}.json`, contentsJson(c));
    // Key file -> mod folder, for the crash log reader
    if (c.files) writeOut(`assets/data/files-${id}.json`, JSON.stringify(c.files));
  }
  if (Object.keys(contents).length) writeOut('assets/data/authors.json', authorsJson(authorsOf()));

  /* Search index + sitemap */
  writeOut('search.json', JSON.stringify(searchIndex));
  // What this build used, compared hourly with modlist.json by workers/rebuild (no timestamp in the
  // signature: an unchanged list must not trigger a rebuild)
  writeOut('build-info.json', JSON.stringify({ builtAt: new Date().toISOString(),
    lists: (data.modlist_snapshot || []).map((x) => ({ title: x.title, version: x.version, dateUpdated: x.dateUpdated })) }));
  const urls = pages.filter((p) => p.url !== '/404' && p.sitemap !== false).map((p) => p.url).sort();
  writeOut('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${
    urls.map((u) => `  <url><loc>${siteUrl}${relativeUrl(u)}</loc></url>`).join('\n')}\n</urlset>\n`);

  /* Static files */
  copyDir(path.join(ROOT, 'assets/Images'), path.join(OUT, 'assets/Images'));
  copyDir(path.join(ROOT, 'assets/logos'), path.join(OUT, 'assets/logos'));
  if (exists('assets/og')) copyDir(path.join(ROOT, 'assets/og'), path.join(OUT, 'assets/og'));
  // site.css / site.js / forge/forge.js (the home page module) are written minified (esbuild, dev
  // dependency only); the rest is copied as is
  copyDir(path.join(THEME, 'assets'), path.join(OUT, 'assets'), (f) => !/[\\/](site\.(css|js)|forge\.js)$/.test(f));
  for (const [f, loader] of [['site.css', 'css'], ['site.js', 'js'], ['forge/forge.js', 'js']]) {
    const src = fs.readFileSync(path.join(THEME, 'assets', f), 'utf8');
    const esm = f.startsWith('forge/');
    const target = loader === 'css' ? ['chrome111', 'edge111', 'firefox121', 'safari16.4'] : esm ? 'es2020' : 'es2019';
    writeOut('assets/' + f, transformSync(src, { loader, minify: true, target, legalComments: 'none', ...(esm ? { format: 'esm' } : {}) }).code);
  }
  copyDir(path.join(THEME, 'static'), OUT);
  for (const f of ['CNAME']) if (exists(f)) copyFileIfChanged(path.join(ROOT, f), path.join(OUT, f));

  // Remove files left over from earlier builds (renamed pages, deleted images).
  pruneOut();

  console.log(`✓ Built ${pages.length} pages in ${Date.now() - t0} ms → _site/`);
}

/* ------------------------------------------------------------------ */
/* Dev server                                                         */
/* ------------------------------------------------------------------ */

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json',
};

function serve(port = 4000) {
  http.createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let file = path.join(OUT, p);
    if (!file.startsWith(OUT)) { res.writeHead(403); return res.end(); }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
      if (!p.endsWith('/')) { res.writeHead(301, { Location: p + '/' }); return res.end(); }
      file = path.join(file, 'index.html');
    }
    if (!fs.existsSync(file) && fs.existsSync(file + '.html')) file += '.html';
    let status = 200;
    if (!fs.existsSync(file)) { status = 404; file = path.join(OUT, '404.html'); }
    fs.readFile(file, (err, buf) => {
      if (err) { res.writeHead(503); return res.end('Rebuilding… refresh in a second.'); }
      res.writeHead(status, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
      res.end(buf);
    });
  }).listen(port, () => console.log(`→ http://localhost:${port}/`));

  // Builds never overlap: a change during a build queues exactly one more build
  // (overlapping builds would prune each other's output).
  let timer = null, running = null, again = false;
  const rebuild = () => {
    if (running) { again = true; return; }
    running = build().catch((e) => console.error(e)).finally(() => {
      running = null;
      if (again) { again = false; rebuild(); }
    });
  };
  fs.watch(ROOT, { recursive: true }, (_e, f) => {
    // _legacy/ only holds backups: changes there must not trigger rebuilds
    if (!f || /^(_site|_legacy|node_modules|\.git)([\\/]|$)/.test(f)) return;
    clearTimeout(timer);
    timer = setTimeout(rebuild, 150);
  });
}

await build();
if (process.argv.includes('--serve')) serve(Number(process.env.PORT) || 4000);
