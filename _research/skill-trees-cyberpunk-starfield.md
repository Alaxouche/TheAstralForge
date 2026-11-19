# Ghost of the Grid perk trees and ECP skill trees: how the data is produced

Both scripts only read: game folders and MO2 instances are never written. Outputs go to `_data/`.

## Ghost of the Grid (Cyberpunk 2077): `scripts/cyberpunk-perks.py`

`python -I scripts/cyberpunk-perks.py "D:/Games/Ghosts of the Grid" "Ghost of the Grid - Standard" _data/perks_ghost-of-the-grid.json`
(about 1.5 min; needs PyYAML; Windows only, it loads the game's `bin/x64/oo2ext_7_win64.dll` for Oodle).

- **TweakDB** (`r6/cache/tweakdb_ep1.bin`, blob version 8): header of 8 uint32; flats = uint32 type count, then per
  type (uint64 FNV-1a of the type name, value count, key count, absolute offset); at the offset: uint32 count + values,
  uint32 count + keys (uint64 TweakDBID, uint32 value index). Arrays have a CompressedInt length. A TweakDBID is
  `crc32(name) | len(name) << 32`, so a flat is found by hashing `Record.property`.
- Perks of a tree: `NewPerks.<Attr>AttributeData.perks` (Attr = Body, Reflexes, TechnicalAbility, Intelligence, Cool,
  Espionage). Names are recovered by hashing the patterns `<Prefix>_<Left|Central|Right>_Milestone_n`,
  `_Perk_t_i` (also `_0i`), `_Master_Perk_i`, `_Inbetween_<Left|Right>_n`, `_<Branch>_Milestone_Perk`.
- Per perk: `tier` (NoviceNewPerkTier 4, Adept 9, Expert 15, Master 20, Espionage 0: `requiredAttributePoints`),
  `requiresPerks`, `loc_name_key`, `loc_desc_key`, `levels` (records named `<perk>_inlineN`, each with `loc_desc_key`
  and `uiData` → `floatValues` / `intValues` that fill `{float_N}` / `{int_N}`). Keys can be written `Lockey#`.
- **Texts**: `archive/pc/{content,ep1}/lang_{en,fr}_text.archive` (RDAR; segments starting with `KARK` are Oodle).
  Onscreens resources are CR2W files; property indices come from each file's name table (game files and files built
  by modding tools differ). `LocKey#N` = primaryKey N.
- **Mods** (enabled in the profile): TweakXL `.yaml` under `r6/tweaks` applied over the TweakDB for `NewPerks.*`
  (`!append` supported), texts from the `localization: onscreens:` files their `.xl` declare (by FNV-1a 64 of the
  path), Codeware `this.Text()` in `.reds`, and CET Lua tables (`["key"]='text'`). A perk is "changed by" a mod when
  an enabled mod's TweakXL file names it, or when Perks And Skills Fixes does (its changes depend on its settings, so
  the page shows the game's numbers and flags the perk).
- Snapshot of Nov 20, 2026: 196 perks (Body 36 with Running Man's 3, Reflexes 37, Tech 34, Intelligence 38,
  Cool 42, Relic 9), 39 flagged as changed by a mod. Official French names: Constitution, Réflexes,
  Capacité technique, Intelligence, Sang-froid, Relic.
- Not drawn: Bullet Ballet (Custom Perk Framework, its own tree in redscript; see `_research/ghost-of-the-grid.md`).

## Extrasolar Containment Protocol (Starfield): `scripts/starfield-skills.py`

`python -I scripts/starfield-skills.py "D:/Games/EXTRASOLAR CONTAINMENT PROTOCOL" "Extrasolar Containment Protocol - Ultra" _data/skills_extrasolar-containment-protocol.json`
(a few seconds).

- Load order: `loadorder.txt`, enabled = `*` in `plugins.txt` or not listed there (game masters); files from the game
  `Data` folder or MO2 mods (highest priority wins). Only the PERK and GMST top groups are read.
- Skill PERK: `DATA` byte 0 = category (1 Combat, 2 Science, 3 Tech, 4 Physical, 5 Social), byte 1 = tier
  (1 Base .. 4 Master), byte 3 bit 0x02 = playable. Each rank sits between `PRRK` and `PRRF`; its text is the last
  `DESC` before `PRUC`; an `ATCP` block is the challenge that opens the next rank, with its count in the `ATAV` JSON
  (`Repetitions`, replaces `<repetitions>`).
- Strings: localized plugins (header flag 0x80) through `Strings/<plugin>_<lang>.(dl|il)strings`, loose or in BA2
  (GNRL, zlib). French text: when a mod keeps the game's English text word for word, the official French text of the
  first version is used.
- `iPerkSkillGroupUnlockTargetNumber` (points that open the next tier): 4 in Starfield.esm, 3 with RoyalGalaxy.esm.
- Snapshot of Nov 20, 2026: 83 skills, 67 changed by a mod, 2 added (Takedowns by Shades Stealth Takedowns, Plasma
  Weaponry by Lodecs Custom Armory). Fitness: the winning version is StarGym's (10 / 20 / 30 % oxygen), not the
  +30 / 60 / 100 % that Perk Up's page lists.

After a list update, rerun the script and check the counts in the "In short" boxes of
`_ghost-of-the-grid/game-guide/perk-trees.md` and `_extrasolar-containment-protocol/game-guide/skills.md`.
