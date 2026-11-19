# Brief: game guide for one Wabbajack modlist (research + first draft)

You are writing the **Game Guide** section of one modlist on theastralforge.com, the documentation site of
Alaxouche's Wabbajack modlists. Players read it after installing the list, to understand how the game plays
with this list: how it starts, controls, progression, the systems the mods add, the content worth finding.
Inspiration for the depth and tone: https://gatetosovngarde.cc/ ("How GTS works", "Survival", "Levelling"):
short "In short" summary first, then concrete sections, exact numbers in tables, "read from the modlist's own
files". We start smaller than that site: **simple but complete** guides.

## Hard rules

1. **READ-ONLY on the game folders.** Never create, edit, rename, move or delete anything under the modlist
   folder (MO2 instance, mods, profiles, game files). Never run ModOrganizer, the game, tools or installers.
   Only read files. Write output only in your staging folder (given in your task).
2. **Every fact must come from a file you read**: a mod's readme / txt / ini / json / MCM config
   (e.g. `mods/<mod>/MCM/Config/<name>/config.json`, `settings.ini`, SKSE plugin `.ini`/`.toml`/`.json`),
   the `meta.ini` of the mod (fields `nexusDescription`, `comments`, `notes`, `modid`, `version`,
   `installationFile`), the profile's ini files, or the site's existing docs for this list. Record the source
   path of every number and every non-obvious claim in `research.md`. If you cannot confirm something,
   leave it out or say plainly that it is not documented. Do not describe a mod's mechanics from memory.
   Prefer the values actually configured in this list (MCM presets, ini values shipped in the list's own
   config/patch mods, e.g. a "Wunduniik - Settings" style mod or the `overwrite` folder) over the mod's
   defaults; if a value comes from defaults, say so in research.md.
3. **The site's existing docs for this list are the reference** for installation matters
   (`g:\TheAstralForge-main-master\TheAstralForge-main-master\_<list>\` : installation-guide/*.md,
   known-issues.md, changelog.md). Read `installation-guide/using-the-list.md` (or its equivalent) first:
   don't contradict it, link to it instead of repeating it.
4. Copy style (the owner is strict about it):
   - No em dash or en dash (— –) anywhere. Use a colon, a middle dot `·`, a comma, a pipe or a new sentence.
   - No hollow phrasing ("immerse yourself", "breathtaking", "journey awaits", "forged with passion",
     "take your experience to the next level"...). Direct, concrete, second person ("you").
   - French is written natively (not a word-by-word translation), vouvoiement ("vous"), French typography
     (space before `:` `;` `?` `!`, guillemets « » if you quote).
   - Mod names stay as they are (not translated). Game terms: use the official French game terms when you
     are sure of them (Skyrim FR: Blancherive, Solitude, Vendeaume, Faillaise, Markarth...), otherwise keep
     the English term.
5. Be useful to a player, not a mod list dump. Group by what the player experiences (starting the game,
   fighting, staying alive, levelling, money, travel, magic, followers...). Name the main mods behind each
   system with a link to their Nexus page when `meta.ini` gives a `modid`:
   `https://www.nexusmods.com/<domain>/mods/<modid>` with domain `skyrimspecialedition`, `cyberpunk2077`,
   `nomanssky` or `starfield`. Don't list 50 mods; list the ones that change how the game plays.

## Deliverables (in your staging folder)

- `research.md`: your fact sheet. Sections per topic, each fact with its source path. List what you could not
  confirm. This is for review, not published.
- The guide pages, ready to drop into the site (see format below):
  - `index.md`: the Game Guide landing page. "In short" box (5 to 8 bullets: what is different from the
    vanilla game), then one short paragraph and a list of the sub-pages with one line each.
  - 4 to 7 sub-pages. Suggested set, adapt to the list (merge or drop what doesn't apply, split if huge):
    `first-hours.md` (how a new game starts, first steps, what to set up first),
    `controls.md` (keys added or changed by the list, as a table; only bindings you found in files),
    `character.md` (levelling, skills, perks, classes, races: the numbers the list uses),
    one or more system pages (e.g. `combat.md`, `survival.md`, `magic.md`, `economy.md`, `travel.md`),
    `content.md` (major new quests, lands, followers, homes: where and how they start, when documented).
- `pages.txt`: one line per page: `file | EN title | FR title | nav_order | one-line summary`.

## Page format (Markdown read by the site's generator)

Front matter of `index.md`:

```
---
layout: skyground_readme
title: Game Guide
title_fr: Guide de jeu
nav_order: 1.5
has_children: true
---
```

Front matter of a sub-page (`nav_order` gives the order in the sidebar):

```
---
layout: skyground_readme
title: Combat
title_fr: Combat
parent: Game Guide
nav_order: 4
---
```

Body: two language blocks, English first, then French, each wrapped like this (the blank lines matter):

```
<div lang="en" markdown="1">

# Combat

{: .short }
> **In short**
> - First key point, concrete.
> - Second key point.

## A section

Text, lists, and tables:

| Stage | Effect |
| --- | --- |
| Hungry | Max stamina down 15 % |

</div>
<div lang="fr" markdown="1">

# Combat

{: .short }
> **En bref**
> - Premier point clé, concret.

## Une section

...

</div>
```

- One `#` title per language block (the site hides it and shows its own), then `##` sections (they feed the
  page outline and get an icon automatically), `###` for sub-sections.
- Links to other pages of the site: `[Controls]({{ '/<list-id>/game-guide/controls/' | relative_url }})`,
  same for the install guide pages (check their real URLs in the site's files: the URL is the folder path,
  or the `permalink` in the front matter).
- Callouts: a paragraph preceded by `{: .warning }`, `{: .note }`, `{: .tip }` or `{: .important }` on its own
  line becomes a coloured box. Use them sparingly.
- No images for now. No HTML other than the two `<div lang>` wrappers.
- Keep each page readable: an "In short" box, then sections of a few short paragraphs, lists or tables.

## Report back

When done, reply with: the staging folder path, the page list with one line each, the 5 to 10 facts you are
least sure about, and anything in the list that looked broken or contradictory (e.g. a doc page that says
something the files contradict).
