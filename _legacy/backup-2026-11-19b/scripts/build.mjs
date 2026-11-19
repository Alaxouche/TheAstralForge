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
  'System Requirement': 'Configuration requise',
  'Wabbajack Installation': 'Installation Wabbajack',
  'Post Installation': 'Post-installation',
  'Using The List': 'Utiliser la liste',
  'Linux Installation Guide': 'Guide Linux',
  'Frequently Asked Questions': 'Foire aux questions',
  'Community Gallery': 'Galerie communautaire',
  'Contributors': 'Contributeurs',
  'Report a Bug': 'Signaler un bug',
  'Size': 'Taille',
  'Updated': 'Mise à jour',
  'Archives': 'Archives',
  'Version': 'Version',
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

function postProcessHtml(html) {
  return youtubeFacade(html)
    // external links open in a new tab
    .replace(/<a href="(https?:\/\/(?!theastralforge\.com)[^"]+)"(?![^>]*target=)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer"')
    // lazy images
    .replace(/<img (?![^>]*loading=)/g, '<img loading="lazy" decoding="async" ');
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
  [/starting|demarrer|launch|lancement/, 'play'],
  [/updat|mise-a-jour/, 'refresh'],
  [/(^|-)enb(-|$)|preset/, 'sun'],
  [/keymap|raccourci/, 'keyboard'],
  [/profil/, 'layers'],
  [/performance/, 'gauge'],
  [/new-game|nouvelle-partie/, 'flag'],
  [/faq|question/, 'help'],
  [/support/, 'chat'],
  [/(^|-)(sfse|skse)(-|$)|script/, 'code'],
  [/(^|-)(bethini|inis?)(-|$)|mcm|config|setting|parametre/, 'sliders'],
  [/about|propos/, 'info'],
  [/(^|-)live(-|$)/, 'pulse'],
];
const sectionIcon = (id) => (SECTION_ICONS.find(([re]) => re.test(id)) || [])[1];

/* Quick-link cards for a modlist overview, built from the real navigation. */
const QUICK = {
  'Installation Guide': ['download', (n) => [`${n} steps, from the requirements to the first launch`, `${n} étapes, de la configuration requise au premier lancement`]],
  'Changelog': ['refresh', (_, m) => [`Every version. Latest: v<span data-live="${m.title}" data-field="version">${m.live.version}</span>`, `Toutes les versions. Dernière : v<span data-live="${m.title}" data-field="version">${m.live.version}</span>`]],
  'Known Issues': ['alert', () => ['Problems we know about and how to fix them', 'Les problèmes connus et comment les régler']],
  'Load Order': ['layers', () => ['Every mod and plugin in the list, in order', 'Tous les mods et plugins de la liste, dans l\'ordre']],
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
  engine.registerFilter('slug', slugify);
  // {{ src | thumb: 480 }} → thumbnail URL (or src); {{ src | srcset }} → "t480 480w, ..., src 2560w" (or '')
  try { THUMBS = JSON.parse(read('assets/Images/_thumbs/manifest.json')); } catch { THUMBS = {}; }
  engine.registerFilter('thumb', (s, w = 480) => relativeUrl(thumbOf(s, w)));
  engine.registerFilter('srcset', (s) => srcsetOf(s).split(', ').filter(Boolean)
    .map((p) => { const i = p.lastIndexOf(' '); return relativeUrl(p.slice(0, i)) + p.slice(i); }).join(', '));

  /* Collect pages */
  const pages = [];
  const collections = Object.keys(config.collections || {});
  const collectionNames = (config.just_the_docs && config.just_the_docs.collections) || {};

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
      title: idx.title || collectionNames[key]?.name || key,
      game: idx.game || '',
      image: banner.image || idx.image || '/assets/Images/generic_background.webp',
      accent: banner.accent || '#a78bfa',
      subtitle: banner.subtitle || '',
      subtitle_fr: banner.subtitle_fr || '',
      stats: banner.stats || [],
    };
  });

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
      size: meta.TotalSize ? Math.round(meta.TotalSize / 1e9) + ' GB' : '',
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
    if (p.layout === 'skyground_base' || p.layout === 'page') return 'page.liquid';
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
        if (i !== -1) { prev = seq[i - 1] || null; next = seq[i + 1] || null; step = { i: i + 1, n: seq.length, urls: seq.map((s) => s.url), items: seq }; }
      }
    }
    const ctx = { site, page, modlist, nav: page.collection ? navs[page.collection] : null, prev, next, step };
    let content = await engine.parseAndRender(page.body, ctx);
    // Pages using the 'page' layout are hand-written HTML: skip Markdown.
    if (page.ext === '.md' && layoutFor(page) !== 'page.liquid') content = renderMarkdown(content);
    content = postProcessHtml(content);
    // Disk-space placeholders (formerly filled client-side) → values from _data/modlist_snapshot.json
    const snap = (data.modlist_snapshot || []).find((x) => x.id === page.collection);
    const meta = snap && snap.download_metadata;
    const gb = (b) => (meta ? Math.round(b / 1e9) + ' GB' : '?');
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
    page.has_h1 = /<h1[\s>]/.test(content);
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
    writeOut(urlToFile(page.url), html);

    if (page.url !== '/404') {
      const text = content.replace(/<(script|style)[\s\S]*?<\/\1>/g, ' ').replace(/<[^>]+>/g, ' ')
        .replace(/&[#\w]+;/g, ' ').replace(/\s+/g, ' ').trim();
      searchIndex.push({ t: page.title, s: modlist ? modlist.title : '', u: page.url, x: text.slice(0, 30000) });
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

  /* Search index + sitemap */
  writeOut('search.json', JSON.stringify(searchIndex));
  const urls = pages.filter((p) => p.url !== '/404' && p.sitemap !== false).map((p) => p.url).sort();
  writeOut('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${
    urls.map((u) => `  <url><loc>${siteUrl}${relativeUrl(u)}</loc></url>`).join('\n')}\n</urlset>\n`);

  /* Static files */
  copyDir(path.join(ROOT, 'assets/Images'), path.join(OUT, 'assets/Images'));
  copyDir(path.join(ROOT, 'assets/logos'), path.join(OUT, 'assets/logos'));
  copyDir(path.join(THEME, 'assets'), path.join(OUT, 'assets'));
  copyDir(path.join(THEME, 'static'), OUT);
  for (const f of ['CNAME', 'ads.txt']) if (exists(f)) copyFileIfChanged(path.join(ROOT, f), path.join(OUT, f));

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
  '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json',
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
