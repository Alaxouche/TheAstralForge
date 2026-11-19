# The Astral Forge: notes for the next AI

Documentation site for Alaxouche's Wabbajack modlists (theastralforge.com). There are five lists: Wunduniik and Krentoraan (Skyrim SE), Ghost of the Grid (Cyberpunk 2077), No Man's Sky Explorer, and Extrasolar Containment Protocol (Starfield). All content is bilingual EN/FR.

The site was **rebuilt in November 2026**. It no longer uses Jekyll. A small Node generator now reads the old Jekyll content (Markdown, YAML, Liquid) unchanged. The user speaks French.

## Commands

```bash
npm install          # liquidjs, marked, js-yaml (dev deps only)
npm run dev          # build + server on http://localhost:4000, rebuilds when files change
npm run build        # one-off build into _site/
```

- **The dev server does not reload `scripts/build.mjs`.** After editing that file, restart the server. On Windows, the old Node process often keeps port 4000 (`EADDRINUSE`). Free it with:
  `netstat -ano | grep ":4000 " | grep LISTENING` then `taskkill //PID <pid> //F`.
- Changes to templates, CSS, JS and content trigger an automatic rebuild (~0.8 s). Builds are **incremental**: `_site/` is never wiped, files are only written/copied when they changed, and anything the build didn't produce is deleted at the end (`pruneOut`). So a test file dropped in `_site/` disappears at the next rebuild. Builds never overlap (a change during a build queues one more).
- `site.version` (the `?v=` on site.css/js) is a hash of `site.css` + `site.js`, not a timestamp.
- Ruby/Jekyll is not installed and is no longer needed.
- Deployment: `.github/workflows/pages.yml` (Node 22, `npm ci && npm run build`, uploads `_site/`). Other workflows (`quality.yml`, `lighthouse.yml`) haven't been checked since the migration.

## Architecture

| Path | Role |
|---|---|
| `scripts/build.mjs` | The generator: front matter, Liquid (`liquidjs`, Jekyll-style includes), Markdown (`marked`), sidebar navigation, prev/next, guide steps, `search.json`, `sitemap.xml`, copies assets. Includes the dev server. |
| `theme/layouts/` | `base.liquid` (head, nav, drawer, footer, search, lightbox), `home.liquid` (panels), `doc.liquid` (modlist docs), `page.liquid` (pass-through for hand-written HTML pages) |
| `theme/includes/` | `page_hero.html` (image hero), `components/` (`project_banner`, `loadorder_embed`, `faq`, `community_gallery`). These override the files of the same name in `_includes/`. |
| `theme/assets/site.css`, `site.js` | All the CSS and JS, no frameworks. CSS is built up in layers, appended at the end of the file: base theme, then "Astral identity layer", then "Enhancements". JS has two IIFEs: main, then enhancements. |
| `theme/static/` | Copied to the root of `_site/`. `sw.js` unregisters the old caching service worker. |
| `_<modlist>/` | Collections (Jekyll format). URL: `/<modlist>/<path>/`, or the `permalink` from front matter. |
| `*.md` at the root | Pages (hub, faq, gallery, contributors, report-a-bug, index) + `404.html`. Written in **HTML**, so no Markdown processing (layout `page`). |
| `_data/` | `faq.yml`, `faq_fr.yml`, `contributors.yml`, `community_gallery.yml`, `alerts.yml`, `modlist_snapshot.json` |
| `_legacy/` | Backups of the root pages and of the old `pages.yml` before the rebuild |

**Obsolete files** (old Jekyll theme, not read by the build; can be deleted once the user agrees): `_layouts/`, most of `_includes/`, `_sass/`, `assets/skyground/`, `assets/data/`, `Gemfile*`, `_headers` (Netlify), `sw.js` at the root (replaced by `theme/static/sw.js`). Careful: `_includes/feeds/modlist_feed.xml` **is still used** by `feeds/*.xml`.

**The folder is not a git repository.** Before deleting or overwriting anything, make a backup or ask.

## Build-specific behaviour

- Layout mapping (`layoutFor`): `skyground_home` → home, `skyground_base` / `page` → page, everything else → doc.
- kramdown is emulated: `markdown="1"` is removed (CommonMark handles HTML blocks itself), and `{: .note }` / `{: .warning }` etc. become `.callout callout-*` (on the paragraph or the following blockquote).
- Heading ids are slugified with de-duplication. The `# h1` in the content is **hidden by CSS**; the doc layout shows its own title.
- Each modlist's front matter (`_<id>/index.md`) supplies `game`, `project_banner.{image, accent, subtitle, subtitle_fr, stats}`. The build exposes this as `site.modlists[]` with `nav` and `live` (fallback values taken from `_data/modlist_snapshot.json`).
- The `Loading...` placeholders (`data-modlist-total/install/download`) are filled in at build time from the snapshot.
- The `FR` dictionary in `build.mjs` translates titles and labels. Liquid filter `bi` → `<span lang="en">…</span><span lang="fr">…</span>`.
- `step` (guide page n / total) is computed from the parent page and its children (`parent: Installation Guide`). `step.items` carries `{title, url}` for the step bar labels.
- A first `h2` that repeats the page title (e.g. "System Requirements" under "System Requirements") gets `class="is-dup"`: hidden by CSS, skipped by the outline and anchors.
- Doc subpages use a compact hero (`.phero--compact`); only the modlist overview keeps the full-height one.

## Front end

- **Language**: `html[data-lang]` hides `[lang="en"|"fr"]` blocks. Choice stored in `localStorage['sg-lang']`, browser language by default. Every interface string must exist in both: `<span lang="en">…</span><span lang="fr">…</span>`. Attributes can't hold spans: put English in the attribute and French in `data-ph-fr` (placeholder), `data-aria-fr` (aria-label) or `data-title-fr` (title); `localizeAttrs()` in `site.js` swaps them.
- **Accessibility** (last CSS layer "Readability & accessibility"): text tokens meet WCAG AA (`--dim` 4.7:1, `--muted` 6.2:1, don't darken them), body weight 400, 2px gold focus ring (inset on `overflow: hidden` boxes), `prefers-reduced-motion` stops all loops, `prefers-contrast: more` and `forced-colors` handled. Mobile menu and docs sidebar go through `overlay()` in `site.js` (Escape, focus in/out, Tab trap, `aria-expanded`). Search announces its result count in `#search-status`. `.sr-only` exists for screen-reader-only text.
- **Theme**: dark only. Gold `--gold: #c9a96e`, background `#07080a`, font **Jost** (Google Fonts, stand-in for Futura). Each modlist has its `--accent`.
- **Logo**: the emblem (circle + sword). Source in `assets/source/emblem-source.png` (not deployed), assets regenerated with `python scripts/make-emblem.py assets/source/emblem-source.png assets/logos`: `emblem.webp` (large) and `emblem-mark.webp` (nav/footer), both transparent and lossless, `emblem-32/180/192/512.png` (favicon, apple-touch, manifest) and `emblem-og.jpg` (social card), white on the site background. The source is rendered with a glow: the script keeps only the solid strokes (luminance >= 252). **The user wants the plain logo, no glow, halo or drop-shadow**, in files and in CSS. The old `theastralforge.*` files are no longer referenced by the theme.
- **Visual identity** (asked for by the user, keep it): 4-point star (`.diamond` / `.star` via `clip-path`) instead of diamonds, rune decoding of titles (`[data-scramble]`), roman numerals on the panels, film grain (`body::after`), animated "molten metal" bar. **No cursor halo**: removed at the user's request, do not add it back.
- **No particles**: the user asked (Nov 2026) to remove the ember / spark effects completely (first a Canvas 2D version, then a WebGL one). Do not add particle effects back unless asked.
- **Home**: 6 panels (`.panel`) driven by JS through `.hero.has-on` / `.panel.is-on` (hover on desktop, tap on mobile, arrow keys). They are **slanted** (asked by the user): each panel is a `clip-path` parallelogram overlapping the previous one by `--o` (about 5 degrees), with a gradient seam in `.panel + .panel::before`. On mobile they are horizontal bands slanted the same way (`--o: 16px`, vertical overlap). Content stays upright; elements near a slanted edge are offset by `--o`.
- **Home performance rules** (the site lagged badly before): the panel width animates (`flex-grow`), so nothing inside may be resized or repainted per frame. Images, `.panel__shade` and `.panel__scrim` have a fixed width (`max(80vw, 100%)`); dimming is the image's `opacity`, not a CSS `filter`; no container queries; text blocks have their own layers; pointer handlers go through `pointerFrame()` (one layout read per frame) and never set inherited custom properties. Measure with `node scripts/bench.mjs http://localhost:4000/ label ["css to inject"]` (headless Edge via DevTools protocol: fps, long frames, main-thread time). Reference on the home page: 42 fps / 16 long frames before the fixes, ~58-60 fps / 1-4 after.
- **Live data**:
  - `[data-live="<Title>"][data-field="version|size|archives|updated"]` is filled from `https://raw.githubusercontent.com/Alaxouche/Wunduniik/main/modlist.json`, which holds all 5 lists, CORS OK, 10-minute `sessionStorage` cache.
  - `[data-fresh]` shows "Updated" when the update is less than 45 days old.
  - Discord: `[data-discord-online]` / `[data-discord-count]` via `discord.com/api/guilds/750268919201398805/widget.json`.
- **Docs**:
  - sidebar where the current page lists its h2s (`[data-side-toc]`);
  - reading bar (`[data-progress]`);
  - "Step n / N" bar, with pages already read stored in `localStorage['taf-read']`;
  - copyable section anchors, code copy buttons;
  - zoomable images, lightbox with navigation;
  - **section icons**: `build.mjs` (`SECTION_ICONS`) gives each h2 a `data-icon` from its id (EN and FR slugs: install, antivirus, page file, update, ENB…); the star stays the fallback. Icons are CSS custom properties `[data-icon="x"] { --i: url(svg) }` at the end of `site.css`;
  - **checklists**: on guide pages (`[data-steps]`), every top-level numbered list gets a tick per step, a "n / N steps done" bar and a reset, saved in `localStorage['taf-ticks']`. Keyed by page + list position in its language block + item count, so the EN and FR lists share ticks.
- **Modlist overview pages** (built in `build.mjs`): the "Quick Links" / "Liens Rapides" lists are replaced by cards (`quickCards()`, built from the real nav, with live version on the changelog card), the "Key Features" / "Fonctionnalités Clés" bullets (`- **Title**: text`) become alternating text / screenshot rows (`featureRows()`, pictures from the page's `gallery_path`), and `doc.liquid` adds an "Install X" call-to-action strip (`.doc-cta`) at the end.
- **Nav**: text links with a gold underline on the current page and one Discord button (`.nav__cta`) showing the live online count (cached 5 min in `sessionStorage['taf-discord']`).
- **Changelogs**: a JS module detects the `<details>`. It adds a mod search box, Latest / MAJOR / "New save" badges and +added / −removed / fix / upd counters, plus expand all.
- Search: `Ctrl+K` or `/`, index in `/search.json` built at build time, quick links when the field is empty.
- Cross-page View Transitions (`@view-transition`) + Speculation Rules prefetch.
- Everything respects `prefers-reduced-motion`.

## Editorial preferences (from the user)

- Modern, cinematic, "unique" design. Inspirations: https://zenematics.com (split-panel home, docs at `/zenderal/docs/`; the user calls it "zenderal.com", which does not resolve) and Ivy's Workshop https://itzivy05.github.io/Workshop/index.html (light nav with one CTA, diagonal hero, alternating feature rows, CTA strip). **Don't copy them**: keep the Astral Forge identity (forge, stars, gold, the emblem).
- **No visible signs of AI writing**: no em dash (—) in the copy, no hollow phrasing ("forged with passion", "lost in the void"…). Direct, concrete tone. Use `·`, `:`, `|` or a sentence instead.
- Prefer dynamic elements and real live data when they're possible.
- Lightweight: no framework, no external dependency in the browser apart from Jost and the Ezoic script (ads, keep it, along with `ads.txt`).

## Verifying visually

There's no Playwright. Headless Edge works. Its binary moved to `EdgeCore/<version>/` (the old `Edge/Application/` folder no longer has `msedge.exe`); check `ls "/c/Program Files (x86)/Microsoft/EdgeCore/"` if the version changed:
```bash
"/c/Program Files (x86)/Microsoft/EdgeCore/157.0.4341.60/msedge.exe" --headless=new --disable-gpu --hide-scrollbars \
  --virtual-time-budget=6000 --window-size=1440,900 --screenshot="<scratchpad>/x.png" "http://localhost:4000/"
```
- Headless Edge can't render narrower than ~500 px. For mobile, use a test HTML page in `_site/` with 390 px `<iframe>`s (then delete it).
- A hover state can't be captured: set the classes from the parent page (`hero.classList.add('has-on'); panel.classList.add('is-on')`).

## Shell pitfalls hit on Windows

- `cat <<'EOF'` heredocs containing apostrophes sometimes fail in this Bash. Use the Write tool, or a file in the scratchpad that gets `cat >>`-ed.
- The accent-stripping regexes in `site.js` / `build.mjs` contain the literal characters U+0300–U+036F. That's intentional; they work.

## Ideas not done yet

- Real emblems for each modlist, centered in the panels like zenematics (the user doesn't have them yet).
- Checking / adapting `quality.yml` and `lighthouse.yml`.
- Cleaning up the obsolete Jekyll files (with the user's go-ahead).
- Updating `_data/modlist_snapshot.json` at build time (it is older than the live data).
