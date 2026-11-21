# The Astral Forge

Source of [theastralforge.com](https://theastralforge.com): the documentation site for Alaxouche's Wabbajack modlists.

| List | Game |
|---|---|
| Wunduniik | Skyrim Special Edition |
| Krentoraan | Skyrim Special Edition |
| Ghost of the Grid | Cyberpunk 2077 |
| No Man's Sky Explorer | No Man's Sky |
| Extrasolar Containment Protocol | Starfield |

Each list has an overview, an installation guide, a changelog, a load order, and for most lists a game guide, a mod contents map, known issues and a troubleshooting page. Everything is written in English and French.

The site is static. A small Node script (`scripts/build.mjs`) turns Markdown, YAML and Liquid templates into plain HTML, with one CSS file and one JS file. There is no framework and nothing is loaded from another site except live version data, the Discord member count, and YouTube when a visitor plays a video.

## Run it locally

You need [Node.js](https://nodejs.org) 22 or newer.

```bash
git pull           # changelogs are edited on GitHub and a workflow syncs the gallery: always pull first
npm install
npm run dev        # http://localhost:4000, rebuilds when a file changes
```

The first build after starting the server can take a while on a slow disk. Later rebuilds take about a second.

Two things don't run locally: the `/api/live` and `/api/report` functions (Cloudflare only). The site falls back to asking GitHub and Discord directly, and the bug form falls back to copy and paste.

If you edit `scripts/build.mjs` or a file it imports (`visuals.mjs`, `contents.mjs`, `troubleshoot.mjs`), restart the server: it does not reload its own code.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Build and serve on port 4000, rebuild on change |
| `npm run build` | One build into `_site/`; also refreshes `_data/modlist_snapshot.json` from the live list data |
| `npm run check` | Checks the built site: internal links, images, `alt` text, no hotlinked images. This is the gate on pull requests |
| `npm run shot -- <page>` | Screenshot of a local page (desktop or phone, dark or light, EN or FR). See the top of `scripts/shot.mjs` |
| `npm run bench -- <url> <label>` | Frame rate of the home page panels, to compare before and after a change |
| `npm run thumbs` | Image thumbnails (480 / 960 / 1600 px WebP). Run after adding images |
| `npm run og` | Social preview cards in `assets/og/`. Run after a build when pages were added or renamed |
| `npm run hex` | Honeycomb backgrounds, then run `npm run thumbs` |
| `npm run contents` | Mod contents data from the published `.wabbajack` files. Run after each list release |

The last four need Python 3 with Pillow (`pip install pillow`; `npm run hex` also needs numpy). On Windows, if `python` opens the Microsoft Store, call the script with the launcher instead, for example `py scripts/make-thumbs.py`.

There are no unit tests. `npm run check` and looking at the pages are the checks.

## Where things are

| Path | Contents |
|---|---|
| `_wunduniik/`, `_krentoraan/`, `_ghost-of-the-grid/`, `_no-mans-sky-explorer/`, `_extrasolar-containment-protocol/` | The pages of each list, in Markdown. The URL follows the path: `_wunduniik/changelog.md` is `/wunduniik/changelog/` |
| `index.md`, `hub.md`, `faq.md`, `gallery.md`, `contributors.md`, `authors.md`, `report-a-bug.md`, `legal.md`, `404.html` | Site pages, written in HTML |
| `_data/` | FAQ entries, supporters, community gallery, glossary, keyboard maps, generated mod contents and perk tree data |
| `theme/layouts/`, `theme/includes/` | Page templates (Liquid) |
| `theme/assets/site.css`, `site.js` | All the styling and scripting |
| `theme/static/` | Files copied as they are to the site root |
| `assets/` | Images, logos, social cards, generated thumbnails |
| `scripts/` | The generator and the tools listed above |
| `functions/api/` | Cloudflare Pages Functions: live data and the bug report form |
| `workers/` | The Worker that rebuilds the site when a list is updated (setup notes in `workers/README.md`, in French) |
| `_research/` | Fact sheets behind the game guides. Not published |
| `_legacy/` | Backups from before the rebuild, including the old Jekyll theme. Not built |
| `_site/` | Build output. Not committed |

## Editing content

**A list page.** Edit the Markdown file in the list's folder. Front matter at the top sets the title (`title`, `title_fr`), the position in the sidebar (`nav_order`) and the parent page (`parent`).

**Two languages.** Each page holds both. A block of English is wrapped in `<div lang="en" markdown="1">`, the French in `<div lang="fr" markdown="1">`. Short interface strings use `<span lang="en">…</span><span lang="fr">…</span>`. Anything added in one language needs its twin.

**A changelog.** Add the new version at the top of the list's `changelog.md`, following the versions already there (a `<details>` block per version, with Additions / Removals / Fixes and Tweaks / Updates sections). The build adds the counters, badges and search box.

**Notes and warnings.** Put `{: .note }`, `{: .warning }` or `{: .short }` on the line before a paragraph or blockquote.

**Images.** Put them under `assets/Images/`, then run `npm run thumbs`. Guide images must be local files: `npm run check` rejects images linked from other sites.

**A YouTube video.** Use the normal embed iframe, and save its thumbnail as `assets/Images/guides/yt-<video id>.webp`. The player only loads when the visitor clicks.

**After a list release.** Run `npm run contents`, then `npm run build` and `npm run og`, and check the guide pages against the mods that changed.

## Writing rules

- Direct and concrete. No em dashes, no filler phrases.
- French is written as French, not translated word for word, with "vous".
- Every number in a guide comes from the list's own files. The sources are in `_research/`.

## Deployment

Pushing to `main` publishes the site.

- `.github/workflows/pages.yml` builds it with Node 22 (thumbnails, build, link check as a report) and uploads `_site/`.
- The Cloudflare side serves `functions/api/` with the site and runs the hourly rebuild Worker in `workers/rebuild/`, which starts a new build when a list's version changes. See `workers/README.md`.
- On pull requests, `quality.yml` builds and runs `npm run check` (blocking) and `lighthouse.yml` measures five pages.
- `gallery-sync.yml` copies new community screenshots from Discord once a week, and `images.yml` enforces an image size budget.

## For AI assistants

`CLAUDE.md` holds the detailed notes: how the build behaves, the design and performance rules, what the owner asked to keep or remove. `.claude/` has project skills (`visual-check`, `astral-identity`, `modlist-release`) and a `design-reviewer` agent for Claude Code.

## Credits

Modlists and site content by Alaxouche. The Jost typeface is used under the SIL Open Font License (`theme/assets/fonts/OFL.txt`). Thanks to the mod authors listed on the [authors page](https://theastralforge.com/authors/) and to the supporters on Patreon and Ko-fi.
