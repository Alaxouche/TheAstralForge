# Wunduniik skill trees: how the data is produced

Page: `_wunduniik/game-guide/skill-trees.md`, rendered by the `perk_trees` Liquid filter (`perkTreesHtml` and
`perkTreeSvg` in `scripts/build.mjs`) from `_data/perk_trees_wunduniik.json`. Nothing is drawn by hand: positions,
links, perk names, descriptions, ranks and required levels all come from the list.

## 1. Vanilla-style trees (18 skills + Vampire Lord + Werewolf), houseCARL MCP, read-only

houseCARL must point at `F:\Games\Wunduniik Reloaded`, profile `Wunduniik Reloaded - Standard`.

1. Trees: `housecarl_records` with `types=["AVIF"]`, `where=["PerkTree[*count] > 1"]`,
   `project={form:"fields", fields:["EditorID","Name","Description","PerkTree"], depth:5}`, `format="json"`,
   `to_file=<raw>/avif2.jsonl`. Each node: `Perk`, `PerkGridX/Y` + `HorizontalPosition/VerticalPosition` (position),
   `ConnectionLineToIndices` (links, pointing at node `Index` values, not list positions). The node without a
   perk is the invisible root and is skipped.
2. Who changed each tree: same FormIDs (`formids=["@<raw>/avif-ids.txt"]`) with `project={form:"tree", fields:["PerkTree"]}`
   to `<raw>/providers.jsonl`. The "last changed by" line is the last toucher that is not generated output
   (Synthesis, DynDOLOD...), shown as its MO2 mod folder name.
3. Perks: the FormIDs of every node's `Perk` (`<raw>/perks.txt`) with
   `walk={follow:"NextPerk", depth:8, max_nodes:20}` (ranks are a NextPerk chain) and
   `project={form:"fields", fields:["EditorID","Name","Description","NextPerk","NumRanks","Playable","Conditions"], depth:4}`
   to `<raw>/perks.jsonl`. A rank's required level is its `GetBaseActorValue >= N` condition.

## 2. Custom Skills Framework trees (Constellations, Firmament, Thu'um)

`python -I csf_collect.py "F:/Games/Wunduniik Reloaded" "Wunduniik Reloaded - Standard" <raw>` (kept in the session
scratchpad; logic: for each `SKSE/Plugins/CustomSkills/**/*.json`, the copy from the highest-priority enabled mod in
`modlist.txt` wins, both CSF formats are read, `$KEY` names resolve through `Interface/Translations/*_english.txt`).
It writes `csf_skills.json` and `csf_perks.txt`; then the same houseCARL perk read as above on `csf_perks.txt`
to `<raw>/csf_perks.jsonl` (required level = `GetGlobalValue >= N`).

Not covered yet: the four Campfire trees of Skills of the Wild (they are neither AVIF perk trees nor CSF files).

## 3. Assemble

`python scripts/build-perk-trees.py <raw> "F:/Games/Wunduniik Reloaded" _data/perk_trees_wunduniik.json`

Snapshot of Nov 19, 2026 (epoch `e2-05993f7977f8f6a9`, `ksws03_quest.esp` unreadable by houseCARL, not involved):
27 trees, 311 perks. After a list update, redo steps 1 to 3 and update the counts in the page's "In short" box.
