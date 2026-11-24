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
import { fileURLToPath } from 'node:url';
import { Liquid } from 'liquidjs';
import { Marked } from 'marked';
import * as yaml from 'js-yaml';

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

function writeOut(rel, content) {
  const file = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

function copyDir(src, dest, filter = () => true) {
  if (!fs.existsSync(src)) return;
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (!filter(s, entry)) continue;
    if (entry.isDirectory()) copyDir(s, d, filter);
    else {
      fs.mkdirSync(path.dirname(d), { recursive: true });
      fs.copyFileSync(s, d);
    }
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

function postProcessHtml(html) {
  return html
    // external links open in a new tab
    .replace(/<a href="(https?:\/\/(?!theastralforge\.com)[^"]+)"(?![^>]*target=)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer"')
    // lazy images
    .replace(/<img (?![^>]*loading=)/g, '<img loading="lazy" decoding="async" ');
}

/* ------------------------------------------------------------------ */
/* Build                                                              */
/* ------------------------------------------------------------------ */

async function build({ clean = true } = {}) {
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
  if (clean) fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  const site = {
    title: config.title,
    description: config.description,
    url: siteUrl,
    baseurl,
    data,
    modlists,
    year: new Date().getFullYear(),
    version: Date.now().toString(36),
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
        if (i !== -1) { prev = seq[i - 1] || null; next = seq[i + 1] || null; step = { i: i + 1, n: seq.length, urls: seq.map((s) => s.url) }; }
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
    page.has_h1 = /<h1[\s>]/.test(content);
    if (page.gallery_path) {
      const dir = path.join(ROOT, decodeURI(page.gallery_path));
      page.gallery = fs.existsSync(dir)
        ? fs.readdirSync(dir).filter((f) => /\.(webp|jpe?g|png)$/i.test(f)).sort()
            .map((f) => page.gallery_path + encodeURIComponent(f))
        : [];
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
  for (const f of ['CNAME', 'ads.txt']) if (exists(f)) fs.copyFileSync(path.join(ROOT, f), path.join(OUT, f));

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

  let timer = null;
  fs.watch(ROOT, { recursive: true }, (_e, f) => {
    if (!f || /^(_site|node_modules|\.git)[\\/]/.test(f) || f.startsWith('_site')) return;
    clearTimeout(timer);
    timer = setTimeout(() => build({ clean: false }).catch((e) => console.error(e)), 150);
  });
}

await build();
if (process.argv.includes('--serve')) serve(Number(process.env.PORT) || 4000);
