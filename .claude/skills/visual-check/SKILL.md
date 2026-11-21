---
name: visual-check
description: Look at the local Astral Forge site after a CSS, template or JS change. Takes screenshots with scripts/shot.mjs in both themes, at desktop and phone width, in both languages, and measures home page frame rate when the forge was touched. Use before calling any visual change done, or when asked to screenshot, compare or check how a page looks.
---

# Visual check

A change to `theme/` is not done until it has been seen in the states visitors use. This is the routine.

## 1. Server

The dev server must be on port 4000. Check before starting a second one:

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:4000/
```

Not 200: run `npm run dev` in the background. If `scripts/build.mjs`, `visuals.mjs`, `contents.mjs` or `troubleshoot.mjs` were edited, the running server still has the old code: stop it (`netstat -ano | grep ":4000 " | grep LISTENING`, then `taskkill //PID <pid> //F`) and start it again.

CSS, JS, template and content edits rebuild by themselves in about a second. Wait for it before shooting.

## 2. Screenshots

`node scripts/shot.mjs <page> [out.png] [options]`. Write the output into the session scratchpad, then open the PNG with Read.

In Git Bash, give pages **without the leading slash** (`hub/`, `wunduniik/changelog/`, `home` for the root).

| Need | Command |
|---|---|
| The four basic states of a page | `node scripts/shot.mjs wunduniik/ <dir>/wun --matrix` (writes `wun-desktop-dark.png`, `wun-mobile-dark.png`, `wun-desktop-light.png`, `wun-mobile-light.png`) |
| French | add `--lang fr` (French strings are longer: check buttons, nav and labels for overflow) |
| Home, a forge section struck in | `node scripts/shot.mjs home out.png --panel 1 --wait 2500` (0 is The Forge, 1 to 5 the lists) |
| A section further down | `--at ".doc-cta"` or `--full` for the whole page |
| A state set by script | `--js "document.querySelector('[data-search-open]').click()"` |
| Settled entrances | `--still` (reduced motion) |
| Another width | `--w 1240 --h 800` (the nav collapses below 1240 px, the list name shows above 1500 px) |

## 3. Which pages

Pick by what changed. One page of each affected kind is enough.

| Changed | Look at |
|---|---|
| Tokens, typography, buttons, nav, footer | `home`, `hub/`, `wunduniik/`, `wunduniik/installation-guide/`, `faq/` |
| Home forge | `home` idle (`--wait 4000`, the 3D loads after first paint), `--panel 1 --wait 6000`, `--panel 5`, `--mobile`, `--lang fr` |
| Page hero | `wunduniik/` (full hero), `wunduniik/installation-guide/` (compact), `hub/` (honeycomb), a missing URL such as `nope/` (404) |
| Docs layout, prose, callouts | `wunduniik/installation-guide/`, `wunduniik/game-guide/survival/`, `wunduniik/changelog/` |
| Widgets | `wunduniik/game-guide/skill-trees/`, `wunduniik/game-guide/controls/`, `wunduniik/contents/`, `wunduniik/troubleshooting/` |
| Inner pages | `gallery/`, `contributors/`, `authors/`, `report-a-bug/`, `legal/` |

## 4. What to look for

- **Light theme**: white or near-black literals that ignore the tokens show up as invisible text or dark slabs. Image areas (heroes, the home forge, `.doc-cta`, lightbox) are meant to stay dark.
- **Phone**: no sideways scroll, nothing cut by a slanted edge, tap targets at least about 44 px.
- **French**: no clipped or wrapped button labels.
- **Things that must not be there**: glow or drop-shadow on the logo, particles, a cursor halo, roman numerals on the home, a dash rule before "Version".

## 5. Home performance

Only when the home forge markup, CSS or JS changed:

```bash
node scripts/bench.mjs http://localhost:4000/ after
```

Run it on the code before the change too (`git stash`, bench, `git stash pop`) and compare the two lines: fps, frames over 34 ms, layout and style time. Numbers depend on the machine and screen refresh rate, so only the before / after pair means anything. A change that raises layout or style time per run is doing too much per strike: see "Home performance rules" in `CLAUDE.md`.

## 6. Built site

After template or build changes, also run `npm run build` then `npm run check`. It must end without errors.

## Report

Say which pages and states were looked at, what was wrong and fixed, and anything left that was not checked. Give the screenshot paths in full.
