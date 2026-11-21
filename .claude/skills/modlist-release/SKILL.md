---
name: modlist-release
description: Bring the Astral Forge site up to date after a modlist release (Wunduniik, Krentoraan, Ghost of the Grid, No Man's Sky Explorer, Extrasolar Containment Protocol). Regenerates the mod contents data, snapshot, thumbnails and social cards, and lists the guide pages to re-check. Use when a list was updated, when a changelog version was added, or when versions, sizes or mod counts on the site look out of date.
---

# After a modlist release

List ids: `wunduniik`, `krentoraan`, `ghost-of-the-grid`, `no-mans-sky-explorer`, `extrasolar-containment-protocol`.

On Windows, if `python` is the Microsoft Store stub, replace `npm run <x>` with `py scripts/<script>.py` for the Python steps.

## 1. Start from the remote

```bash
git pull
```

The changelog is usually written on GitHub's web editor and the gallery is synced by a workflow. Working from an old copy has already reverted 13 changelog versions once.

## 2. Changelog

The new version goes at the top of `_<id>/changelog.md` as a `<details markdown="1">` block, like the ones below it. Leave the heading style as the owner wrote it: the build normalises `### Additions`, `# Additions:` and a plain `Additions:` line. Do not rewrite older versions.

If the version is not there yet, ask for the notes. Do not write a changelog from the data diff alone.

## 3. Mod contents

```bash
npm run contents -- <id>        # reads the PUBLISHED .wabbajack from authored-files.wabbajack.org
```

It rewrites `_data/contents_<id>.json` (treemap, authors wall, install estimator, the "Mods" stat) and the files map used by the crash log reader. Without an id it does every list. The site must show the published build: only pass a local `.wabbajack` when asked to preview an unpublished one, and don't commit that result.

Then look at `git diff --stat _data/` and read the totals: a mod count that dropped by half or an empty author list means the profile or the download failed, not that the list shrank.

## 4. Build

```bash
npm run build
```

This fetches the live `modlist.json` and rewrites `_data/modlist_snapshot.json` (version, sizes, date). If the snapshot did not change, the list's entry in `github.com/Alaxouche/Wunduniik/main/modlist.json` has not been updated yet: say so.

## 5. Guide pages against the changed mods

From the new changelog version, take the added, removed and updated mods and search the guides and data for them:

```bash
grep -rn -i "<mod name>" _<id>/ _data/keymaps.yml _data/gauges.yml _data/troubleshoot.yml _research/<id>.md
```

- A removed mod that a guide page describes: the page is now wrong. Fix it or flag it.
- A mod whose settings feed a table, a keyboard map (`_data/keymaps.yml`) or a gauge (`_data/gauges.yml`): the numbers need re-reading from the list's files.
- Perk and skill tree data (`_data/perk_trees_wunduniik.json`, `_data/perks_ghost-of-the-grid.json`, `_data/skills_extrasolar-containment-protocol.json`) is generated from the installed list: see `_research/perk-trees.md` and `_research/skill-trees-cyberpunk-starfield.md`.

Re-reading values needs the installed list (MO2 folders named in `CLAUDE.md`, on the owner's machine, **read-only**). If they are not on this machine, do not guess: list what needs re-checking and by whom. `scripts/mo2-inventory.py <mo2 dir> <profile> <out.json>` gives the enabled mods when the folder is available.

Every number in a guide has its source in `_research/<id>.md`. Update that sheet with the page.

## 6. Images and cards

Only if screenshots were added or pages were added or renamed:

```bash
npm run thumbs      # after adding images
npm run og          # after the build, when pages were added or renamed
```

## 7. Check

```bash
npm run check
```

Then look at the list's overview, changelog and contents pages (`visual-check` skill): the new version is open at the top of the changelog with its counters, the overview shows the new version and size, the contents map loads.

## 8. Report

State what was regenerated, what changed in the data (mods, size, version), which guide pages were touched, and which still need someone with the installed list. Commit only when asked.
