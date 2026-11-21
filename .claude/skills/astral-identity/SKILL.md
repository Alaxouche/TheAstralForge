---
name: astral-identity
description: Brief and method for giving The Astral Forge a visual identity of its own instead of the look borrowed from Zenematics (zen-site-v1). Use when redesigning or restyling any part of the site (home, nav, heroes, docs, buttons, type, colour), when proposing design directions, or when asked to make the site more bespoke, distinctive or less like Zenematics.
---

# The Astral Forge: its own identity

The November 2026 rebuild borrowed its look from Zenematics. The job is to replace what was borrowed with design that comes from The Astral Forge's own material, without losing what works.

Read "Current goal: a design of its own", "Front end", "Editorial preferences" and "Performance rules" in `CLAUDE.md` first. They hold the facts and the hard rules. This skill is the method.

## The reference

`../zen-site-v1/` (React + Vite; styles in `src/index.css` and `src/zenderal.css`, home in `src/components/Hero.jsx`) is what the site was modelled on. Read it to know what to move away from. **Never edit it and never copy from it.** If the folder is not there, use https://zenematics.com.

To see how close a part still is, compare directly:

```bash
# class names both stylesheets define
grep -oh "^\.[a-z][a-zA-Z0-9_-]*" ../zen-site-v1/src/*.css | sort -u > z.txt
grep -oh "^\.[a-z][a-zA-Z0-9_-]*" theme/assets/site.css | sort -u > a.txt
comm -12 z.txt a.txt
```

Write the two lists in the scratchpad, not in the repo. A shared class name is a hint, not proof: open both rules and compare what they draw.

## Borrowed, to be replaced or reworked

| Part | What is the same | Where |
|---|---|---|
| Palette | near-black `#07080a`, bone `#ece9e2`, muted gold | `:root` tokens at the top of `site.css`, light theme layer at the end |
| Type | Futura-style geometric sans, wide-tracked uppercase for titles, labels, buttons | `--font`, `@font-face` Jost, the many `letter-spacing` / `text-transform` rules |
| Home | replaced Nov 21 2026 by the forge (3D anvil, one section per strike); nothing borrowed left there | `theme/layouts/home.liquid`, "Home: the forge" in `site.css`, `theme/assets/forge/forge.js` |
| Buttons | outlined rectangles, one solid bone primary, spaced capitals | `.btn` |
| Labels | small eyebrow with a mark, thin rules | `.eyebrow`, `.eyebrow-row`, `.badge` |
| Docs | left sidebar with groups, pager | `.side`, `.side__group`, `.pager` |

## Its own, to build on

- **The emblem**: a ring and a sword. Plain, no glow. Geometry in `scripts/make-emblem.py`.
- **The 4-point star** (`.star`, `clip-path`).
- **The forge**: heat, metal, the molten bar, the honeycomb fields that light up (`scripts/make-hexfield.py`).
- **The five modlist emblems** drawn in the emblem's language (`scripts/make-modlist-emblems.py`).
- **Five different worlds**: snowy Skyrim, a Skyrim tower, Night City, open space, a Starfield containment field. Zenematics has one list; this site is a house with five.
- **Slanted seams**, rune decoding of titles, the light theme, two languages, live versions and Discord count.

A direction is good when someone who knows both sites could not mistake one for the other with the logos hidden, and when it could not be moved to another modlist site by swapping the logo.

## Hard limits

These come from the owner and from measurements. A design that breaks one is not a candidate.

- **Tokens only** in new CSS: no literal `rgba(255,255,255,…)`, `rgba(7,8,10,…)` or `#fff`. Changing the palette means changing the tokens in both the dark `:root` and the `:root[data-theme=light]` layer, and re-checking contrast (text tokens must stay at WCAG AA: 4.5:1 for body text).
- **Both themes, both languages, phone width** for every component.
- **One accent for every list.** Per-list colours were removed on request. Ask before bringing them back, even as a small detail.
- **Removed on request, do not bring back**: logo glow / halo / drop-shadow, particles and embers, cursor halo, roman numerals on the home, "already read" marks and step tick boxes, the dash rule before "Version", ads.
- **Kept on request**: the forge home (it replaced the slanted panels, Nov 21 2026), the 4-point star, rune decoding, static film grain, the molten bar, honeycomb backgrounds.
- **Fonts are local.** A new typeface needs a licence that allows self-hosting (SIL OFL or similar), latin + latin-ext subsets as woff2, a preload for the latin file, and a metric-matched fallback `@font-face` (the current one was computed with fontTools) so the swap does not shift the page. No Google Fonts, no Adobe Fonts.
- **Performance**: the home forge draws only during a strike and its start-up never blocks long; no infinite animation that repaints; no opacity in hero entrance animations; nothing inserted above content after load. Everything honours `prefers-reduced-motion`.
- **No framework, no browser dependency.**
- **Copy**: no em dash, no hollow phrases, French written as French.

## Method

1. **Look first.** Screenshot the current state of the part being redesigned (`visual-check` skill, `--matrix`) and keep the files as the "before".
2. **Propose before building** when the change is a direction and not a detail (palette, typeface, home layout, nav, hero). Give two or three directions in a few lines each: what it draws on, what changes, what it costs. The owner and contributors decide. A static mock on a scratch page is cheaper than a full implementation: a file dropped in `_site/` is deleted at the next rebuild, so build mocks in the scratchpad and open them with `scripts/shot.mjs file:///…` or serve them from there.
3. **Change one layer at a time**: tokens, then type, then components, then page layouts. Each can be reviewed and reverted alone.
4. **Add CSS as a new named layer at the end of `site.css`** only for new parts. When replacing a borrowed rule, edit or delete the original rule instead of overriding it lower down: the file already has five layers of overrides, and the goal is less of the old look, not the old look hidden.
5. **Rename what you rebuild.** A component that no longer works like the Zenematics one should not keep its class names. Rename in `site.css`, `site.js`, `theme/` and `scripts/build.mjs` together (`grep -rn "<old class>" theme scripts`), and check `scripts/bench.mjs` and `scripts/shot.mjs`, which query the home (`.forge__rail`).
6. **Check**: `visual-check` skill, then the `design-reviewer` agent on the diff, then `npm run build && npm run check`.
7. **Record the decision** in `CLAUDE.md` (what was chosen, what was rejected and why), and update the "borrowed" list there as parts are replaced.

## Generated images

The Higgsfield / Artlist connector can make images. Credits cost real money: quote the cost and get an explicit yes before any generation. Do not reuse the "Zenderal" style kit for this site; that would import the look this work is meant to leave. The site's own backgrounds are drawn by scripts (`make-hexfield.py`, `make-emblem.py`, `make-modlist-emblems.py`), which keeps them reproducible and plain: prefer extending those.
