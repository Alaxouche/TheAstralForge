# No Man's Sky - Explorer: research sheet (not published)

Sources are relative to `D:\Games\No Man's Sky - Explorer\` (MO2 instance, read only) unless stated.
`mods/<Mod>/...` = a file inside that mod. "desc" = `nexusDescription` in that mod's `meta.ini`.
Inventory: `scratchpad/inv/nms.json` (222 enabled mods). Profile: `profiles/No Man's Sky - Explorer/modlist.txt`.

## 0. How the list loads (important for reading every value below)

- MO2 game plugin maps each mod to `GAMEDATA/MODS`: `plugins/basic_games/games/game_nomanssky.py` (`GameDataPath = "GAMEDATA/MODS"`). So every top-level folder inside an MO2 mod is one game mod.
- Nearly all files are AMUMSS "patch" EXMLs: only the changed fields, marked `!# CHANGED` (e.g. `mods/Faster Scanning v7.14/FasterScanning1s+NoDelay/GLOBALS/GCGAMEPLAYGLOBALS.GLOBAL.EXML`). The game merges them.
- Game mod list and priorities as the game saw them on the last launch: `C:\applications\steam\steamapps\common\No Man's Sky\Binaries\SETTINGS\GCMODSETTINGS.MXML` (247 entries, all `Enabled=true`). Extract: `guides/no-mans-sky-explorer/_work/modsettings.txt`. This is the user's game folder, read only, not part of the list download.
- Several MO2 mods ship ALL their variant folders, and all of them load (see section 9). When two loaded folders set the same field, only one value applies. I could not confirm from files which one wins (the rule for `ModPriority` is not documented in anything I read), so those values are left out of the guide or flagged.
- `overwrite/` is empty.
- Launch: executable "No Man's Sky - Explorer Launcher" = `Binaries/NMS.exe` (`ModOrganizer.ini` `[customExecutables]` 1\title). Matches `_no-mans-sky-explorer/installation-guide/n-using-the-list.md`.

## 1. Mining, resources, inventory

| Fact | Value | Source |
| --- | --- | --- |
| Optical Drill (UT_MINER) stat bonus | `Bonus 3.0` | `mods/Mining Multiplier/MiningMultiplier/METADATA/REALITY/TABLES/NMS_REALITY_GCTECHNOLOGYTABLE.EXML` |
| Mining Multiplier needs the Optical Drill upgrade; hand mining only, ships unaffected | text | Mining Multiplier desc |
| Which multiplier (x2/x5/x10/x100) the FOMOD picked | NOT in files (folder is just `MiningMultiplier`, `comments=Fomod`). Vanilla bonus not in files. Guide says "boosted", gives raw 3.0 only here. | `mods/Mining Multiplier/meta.ini` |
| Terrain manipulator yields (TerrainMultiplier) | ResourceReducer 1, ResourceMin/Max 2/4, Common 2/16, Dirt 2/16 | `mods/Mining Multiplier/TerrainMultiplier/GLOBALS/GCGAMEPLAYGLOBALS.GLOBAL.EXML` |
| Same fields set by Better Rewards | ResourceMin/Max 5/10, Common 5/40 | `mods/Better Rewards/BetterRewardsCombined/GLOBALS/GCGAMEPLAYGLOBALS.GLOBAL.EXML` (CONFLICT, see 9) |
| Better Rewards resource multipliers | RESOURCES_MULTI 2 (mining beam, containers, depots, guild rewards, ships), TERRAIN_RESOURCE_MULTI 5 | `mods/Better Rewards/BetterRewardsCombined/BetterRewards.lua` lines 17-18 |
| Stack limits (gStack 10x), Normal inventory difficulty | substances: Personal 5000, Ship 10000, Freighter 20000, Vehicle 10000, Chest 10000, Base capsule 20000; products: Personal 100, Ship 100, Freighter 100 (cargo 200), Chest 200 | `mods/gGame Stack - Gumsk's Inventory gStack Multiplier - EXML/gGame Stack 10x/METADATA/GAMESTATE/DIFFICULTYCONFIG.EXML` |
| Same, High option | 100000 substances everywhere; products 100 to 1000 | same file |
| Same, Low option | substances Personal 3000, Ship 3000, Freighter 7500 | same file |
| More Upgradeable Slots (max slots after upgrades) | Multi-tool C/B/A/S 33/55/77/99 (desc: vanilla 21/30/45/60). Ships and freighters cargo/tech: C 48/33, B 72/55, A 96/77, S 120/99. Exocraft 120/60 | More Upgradeable Slots desc |
| Lua table (ships) | Hauler/Fighter/Explorer/Shuttle/Solar cargo 60/80/100/120 by class, tech 33/55/77/99; Exotic and Living 120/99 | `mods/More Upgradeable Slots/More Upgradeable Slots/More Upgradeable Slots.lua` (lua and desc differ for ship cargo; guide uses tech values that agree, and gives cargo "up to 120") |
| Warning: removing / breaking the mod deletes the extra slots and their items | text | More Upgradeable Slots desc |
| Refiners + Nutrient Processor 10x faster | REFINER_TIME_FACTOR 0.1; folder "Fast Refiners" (not Instant) | `mods/Fast Refiners/Fast Refiners.lua`, `Fast Refiners_ReadMe.txt` |
| Refiner min/max buttons | text | Refiner Min-Max Buttons desc |
| Fractured Mining: removes the "bloody" terrain effect, bigger rock debris | text | Fractured Mining desc |
| Quick Crates: green crates and crashed freighter containers open in one press, no junk | text | Quick Crates desc |
| Quick Damaged Machineries: one click, stay open permanently | text | Quick Damaged Machineries desc |

## 2. Scanning and finding things

| Fact | Value | Source |
| --- | --- | --- |
| Faster Scanning variant | "1s + NoDelay": BinocTimeBeforeScan 0, Min/Scan/Creature scan time 1.0 | `mods/Faster Scanning v7.14/FasterScanning1s+NoDelay/GLOBALS/GCGAMEPLAYGLOBALS.GLOBAL.EXML` |
| Quick Scan with Range Boost, same fields | 0.01 / 0.333 | `mods/Exosolar's and Babs' Quick Scan with Range Boost/Quick Scan with Range Boost/GLOBALS/GCGAMEPLAYGLOBALS.GLOBAL.EXML` (CONFLICT, analysis time is either ~1 s or ~0.33 s) |
| Quick Scan: survey distance 1000 (orig 400), terrain resource scan 2000 (orig 1200), compass 200 (orig 120), new discovery stays 5 s | values | same file + lua comments `Quick Scan with Range Boost.lua` |
| Scanner pulse: multi-tool range 300, charge 1 s (TOOL); ship pulse range 15000, charge 0.25 s | values | `.../METADATA/SIMULATION/SCANNING/SCANDATATABLE.EXML` |
| Zoom levels: no walk penalty while zoomed (WalkSpeed 1), max scan distance 1000 at top zoom | values | GCGAMEPLAYGLOBALS of Quick Scan |
| Better Buildings Scans: UnknownBuildingRange 4800 (orig 600), MaxIconRange 9600, ship scan finds 1 to 4 buildings | values | `mods/Better Buildings Scans - BBS/_MOD_Better_Buildings_Scans/GLOBALS/GCBUILDINGGLOBALS.GLOBAL.EXML`, `.LUA` comment |
| Colossal Corvette build area also sets UnknownBuildingRange 40000 | value | `mods/Colossal Corvette build area/Colossal Corvettes/GLOBALS/GCBUILDINGGLOBALS.GLOBAL.EXML` (CONFLICT with BBS) |
| Exocraft Scanner Upgrade: scanner list on all land vehicles and mech; adds portal, settlements, archive, ship debris, sentinel pillar, base site, minor settlement, secure facility, ancient plaque, remote terminal, treasure ruin, traveler grave, distress signals, underwater sites, crashed sentinel, robot camp | text | `mods/Exocraft Scanner Upgrade/ReadMe - Exocraft Scanner Upgrade.txt` |
| Galactic Positioning System (GPS): ship and Deployable Signal Scanner scan POIs by category / biome; Signal Scanner built from build menu; ship mission appears after first take-off; Deep Space Scanning via the Fleet Manager on the freighter; costs and requirements configurable in game per save | text | GPS desc |
| Ship Hunting Quick Actions: emote / quick menu entries: Locate Sentinel Pillar, Trading Post, Sentinel Interceptor, Sentinel Multi-Tool, Monolith, Autophage Camp, Living Ship, Portal, Minor Settlement, Crashed Ship, Organic Frigate, Derelict Freighter | text | desc + `ShipHuntingQuickActions.lua` |
| Always Show Distance: markers on the current planet show distance, never time (not in exocraft) | HUDMarkerDistanceOrTimeDistance 10000000 | `mods/Always Show Distance II/.../GCUIGLOBALS.GLOBAL.EXML`, desc |
| Exact Markers: markers sit on the object, not floating above | MaxLineLength 0 | `mods/Exact Markers/...GCBUILDINGGLOBALS.GLOBAL.EXML` |
| No Bird's Eye Scans: no aerial camera on scan, quick look toward the POI | text | desc |
| Transparent Space Encounters: pulse-drive encounter name is shown | text | desc |
| Crashed Freighter Procedural Containers / Treasure Ruin Procedural Crates: loot placement is procedural, use the scanner; treasure ruins show only 3 keys, 4 chest placements | text | readmes of both mods |

## 3. Movement, flight, travel

| Fact | Value | Source |
| --- | --- | --- |
| Walk 7.0, run 12, low-G walk 3.2 / run 7.0 | values; desc: walk x1.6, run x1.5, 0G x2 | `mods/Faster Movement Speed/Faster Movement Speed 3.0/Globals/GCPLAYERGLOBALS.GLOBAL.EXML` |
| Slippery Slopes | SlopeSlidingSpeed -50, brake 0 | `mods/Slippery Slopes/.../GCPLAYERGLOBALS.GLOBAL.EXML` |
| Nomad JetPack (inside Nomad Biomes) changes jetpack globals | JetpackMaxUpSpeed 33, UpForce 35, FillRate 2, ... (vanilla unknown) | `mods/Nomad Biomes - Modpack (formerly Lasagna)/_Nomad JetPack v1.2 (EXML)/globals/gcplayerglobals.global.EXML` |
| Realistic Atmospheric Flight: planet min speed 12, boost max 250 (desc says 260), all ship classes incl. corvette; landing smoother | values | `mods/Realistic Atmospheric Flight/.../GCSPACESHIPGLOBALS.GLOBAL.EXML`; desc |
| Launch fuel: "about 10% of the tank per launch" | desc; file sets launcher stat Bonus 20 | desc + `.../NMS_REALITY_GCTECHNOLOGYTABLE.EXML` |
| Realistic Space Station Docking: approach speed cap 125, take-off speed 200 / boost 35; NPC ships too | values | `mods/Realistic Space Station Docking/...` EXMLs, desc |
| Better Pulse Drive Aim: snap angle 10 to 2, station 5 to 4 | values | desc + GCSPACESHIPGLOBALS |
| Honest HUD Speed: speed readout multipliers set to 1, boost-upgrade multiplier 0 (HUD shows real speed, desc: vanilla x2 in space, x1.5 in combat) | values | `mods/Honest HUD Speed/HonestHUDSpeed/GLOBALS/*.EXML`, desc |
| Better Ship Transfer Range: ship interact radius 200 (desc: from 50) | value | `mods/Better Ship Transfer Ranges/Better Ship Transfer Range 5.9/Globals/GCGAMEPLAYGLOBALS.GLOBAL.EXML` |
| Teleport receiver module (SHIP_TELEPORT): 400 (Better Ship Teleport Module Range) vs 1005 (Super Ship Teleporter, also TELEPORT_ALIEN) | CONFLICT | both EXMLs |
| Immersive Teleport (Hardcore): base teleporter, freighter teleporter room, station teleporter (both station types), Nexus teleporter: activation cost 50 NAV_DATA | values | `mods/Immersive Teleport (Teleport Costs - Hardcore)/TeleporterActivationCost/...` 5 EXMLs; desc "Using any teleporter now costs 50 Navigation Data" |
| Asteroid damage 50 / 75 / 100 (desc: vanilla 5 / 15 / 40) | values | `mods/Asteroid Hits/.../DAMAGETABLE.EXML`, desc |
| Asteroid Fields: no lone asteroids, mineable ones bigger and inside fields | text | desc |
| Large Corvette Station Exit Clearance: removes 48 collision nodes in Type B station launch tubes; can still take damage at the opening | text | desc + `mods/Large Corvette Station Exit Clearance/README.txt` |
| DIABLO'S BLACK HOLE: new black-hole model; arrival offset moved to 250,000 units; its own changelog says arrival behaviour "awaits runtime confirmation" | text | `mods/DIABLO'S BLACK HOLE/Diablos_Black_Hole/CHANGELOG.txt`, README |

## 4. Freighter, corvette, exocraft, ships

| Fact | Value | Source |
| --- | --- | --- |
| Long Range Freighters: F_HYPERDRIVE 1000, boosts 2000 / 4000 / 8000; desc: x10, basic freighter 1000 ly, up to 15000 ly | values | `mods/Long Range Freighters/.../NMS_REALITY_GCTECHNOLOGYTABLE.EXML`, desc |
| zBest Freighter: new open bridge (build on it), hangar 9 to 12 pads, player ships in hangar 6 to 9, corvette teleporters moved, Starship Outfitting terminal in hangar | MaxNumberOfPlayerShipsInFreighterHangar 9 | desc + `.../GcFleetGlobals.global.EXML` |
| zBridge Terminal: planetary scan on bridge terminal, Starship Outfitter on the terminal next to the navigator | text | desc |
| Freighter Hangar Interior Changes: "Beam to corvette" button near hangar teleport room, outfitting consoles near teleport entrances | text | readme |
| Better Freighter Entry and Exit: auto-land range 500 to 100 | PlayerAutoLandRange 100 | EXML + desc |
| Open These Freighter Doors: doors retract fully | text | desc |
| Build the Antimatter Reactor on your Freighter: snaps to the centre of any Extension Room | text | desc |
| Freighter Room Teleporter Fix | (no player-facing detail read) | |
| Space battles (4 variants all loaded): Guaranteed (0 warps / 0 h, spawn rate 100), Common (2 / 1 h, 45), Rare (12 / 8 h), None (99999) | CONFLICT, effective frequency unknown | `mods/Exosolar's and Babs' Space Battle Frequency Controller/*/GLOBALS/*.EXML` |
| Freighter Defense Reward: battle reward = warp cell, gold, platinum, units, nanites, race items; pirate freighter tribute = items | text | readme |
| Colossal Corvettes: corvette build radius 40000, camera 40000; author advises swapping to a non-corvette ship before base building | values + text | `mods/Colossal Corvette build area/Colossal Corvettes/GLOBALS/*.EXML`, desc |
| New Boundaries: base build camera 2000 (orig 60 dome per desc), photo mode 2000, corvette build camera 180 (orig 90) | values | `mods/New Boundaries/.../GCCAMERAGLOBALS.GLOBAL.EXML` (corvette camera also set to 40000 by Colossal Corvettes: CONFLICT) |
| Convenient Corvette Teleporters: freighter corvette teleporters moved to the front near the bridge; station corvette teleporters moved next to the corvette board | text | desc |
| Cockpit Beam Down Buttons: beam up/down button and bay door switches in every corvette cockpit; Beam Aboard goes to the oldest part with a destination (build cockpit first) | text | desc |
| Corvette Exterior Ramp Switches: ramp switch outside landing bays; only owner can use | text | desc |
| gBase Sleepy-Time Bed / Corvette Bunk: "Take a Nap" creates a restore point | text | descs |
| gShip Corvette Medbay Bacta Tank: heals | text | desc |
| gShip Corvette Supercomputer: trade terminal, freighter planetary probe (system scan), teleporter on the corvette mission terminal | text | desc |
| zCamera Corvette: 3rd-person corvette camera 55-60 back (default 28-40), look angle 125 | values | `mods/zCamera Corvette/.../gccameraglobals.global.EXML` |
| Corvette Technology Fix: reactor/shield and cockpit/pulse adjacency fixed | text | desc |
| zStarship Outfitter: Orange Wall Monitor becomes a Starship Outfitting terminal (upgrade or scrap a ship from base or corvette); place it on a wall | text | desc |
| zBest Weapon Rack: weapon rack gets multi-tool upgrade and decommission | text | desc |
| Ship and Multitool Upgrade Terminals: multi-tool upgrade/salvage at the weapons specialist terminal; ship upgrade/salvage at the Synthesis Core (quicksilver shop) | text | readme |
| Add Ship Custom Parts To Space Station Shop (Expensive Price): Fighter, Hauler, Explorer, Sail parts in the station shop, 1,000,000 units each | BaseValue 1000000 | installationFile `2-ExpensivePrice`, EXML |
| Natural Expedition Ships: exotic spawn pool gains Golden Vector, Utopia Speeder, Starborn Runner, Wraith, Boundary Herald, living ships; not real expedition stats | text | desc |
| Living Ship Upgrades: faster living ship via Pulsing Heart upgrades; scanner tech and materials teleport enabled | text | desc + lua mod_desc |
| Natural Steering: VehicleAltControlScheme True: WASD exocraft steering, mouse looks around | value + text | EXML + desc |
| zCrazy Colossus: top speed 30, boost max 50, boost 5 s, recharge 1 s, drives on water | values | `mods/zCrazy Colossus/zCrazy Colossus v7.04/Globals/gcvehicleglobals.global.EXML` |
| zFlatbed Friction: cargo grips the flatbed, hazardous crates health x8 (3200-6400) | values | EXMLs + lua |
| Exocraft slots (More Upgradeable Slots) 120 cargo / 60 tech | desc | |

## 5. Economy, rewards, missions

| Fact | Value | Source |
| --- | --- | --- |
| Better Rewards: units x5, low unit sources an extra x10 on top (x50), nanites x5, recycling nanites x5, quicksilver x10, Nada milestone 150 nanites (default 50), words 3 per non-NPC source, Atlas interface 5 words, 20% Atlas word chance, salvaged data x3, station / Nexus / bounty mission units and nanites x5, products x1 | values | `mods/Better Rewards/BetterRewardsCombined/BetterRewards.lua` top |
| Better Rewards frigate expeditions: units x5, nanites x5, resources x3, products x2 | values | `.../BetterFrigateRewards.lua` |
| Better Rewards warns not to use it on a game version it is not updated for (back up saves) | text | desc |
| QS Missions: extra quicksilver chance on missions: Mission board 10% (50/100/150/200 by tier), Nexus 20% (Med 150, Mega 250), Outlaw bounty master 10% (100), Corvette board 10% (50/100/150/200) | values | `mods/Quicksilver Missions/QS Missions/QS Missions.lua` |
| QS Daily Mission Reward Multiplier: 2x, 5x and 10x folders all loaded | CONFLICT | `mods/Quicksilver Daily Mission Reward Multiplier/*` + modsettings.txt lines 181-183 |
| Enjoyable Quicksilver (lua values): missions RS_QUICKSILV_ML 125; fossils 25 each; cargo crates 5/10/25 (S/M/L); drone loot 10; quad 25; walker 75; sentinels off 50; pirate bounties 25/50/100; sea chest, salvage, flying crash site, proc chest 100; abandoned building end, Nexus mega, freighter saved 250 | values | `mods/Enjoyable Quicksilver - (LUA Script Included)/Enjoyable Quicksilver/Enjoyable Quicksilver.lua` lines 76-153 (desc lists slightly different values; lua used) |
| Enjoyable Quicksilver: QS not shown on mission boards but paid on turn-in | text | desc |
| More Words: NPC 2, knowledge stone 3, word station / encyclopedia 4, monolith 5, monolith atlas 3, atlas orb 2 | values | `mods/More Words/More Words/More Words.lua` top; desc |
| Atlas Orb Word-o-Rama: all Atlas orbs give words | text | lua MOD_DESCRIPTION |
| Overlap Better Rewards (3 words per non-NPC source) vs More Words (stone 3, station 4) | CONFLICT on encyclopedias only | |
| Expensive Charts (cartographer, Navigation Data): Commercial 3, Alien 3, Dig Site 6, Secret 6, Emergency 9, Encrypted Navigation Data (exosuit chart) 12, Settlement chart 15 | values | `mods/Expensive Charts/ExpensiveCharts/METADATA/REALITY/TABLES/NMS_REALITY_GCPRODUCTTABLE.EXML`, desc |
| Keep Mapping: map seller dialog stays open | text | lua |
| Keep Gifting: gift option costs 5 gifts, gives 5 reputation, dialog stays open (Gek Relic, Korvax Casing, Vy'keen Effigy) | values | `mods/Keep Gifting/Keep Gifting/Keep Gifting.lua`, desc |
| Keep Talking Chef: Cronus dialog stays open when trading food for nanites | text | lua |
| Keep Talking Polo E7: Expedition 7 Leviathan dialog stays open (Liquid Sun, Ancestral Memories, Somnal Dust) | text | lua |
| More Materials: folder `MoreProducts` = products only (not substances), 10x stock | text | desc + folder name `mods/More Materials/MoreProducts` |
| zMore Salvage Time: derelict hulk meltdown 1800 s (vanilla 180 per desc) | value | `mods/zMore Salvage Time/.../data.entity.EXML` |
| New Milestones: thresholds (aliens met / words 10..400; units 100k..100M; enemies & sentinels 1..350; warp distance 1..80; distance 10000..400000; longest life 900..9000 s) | values | `mods/New Milestones/New Milestones 3.4.lua` |
| Renewed Riddles: new radio tower / observatory riddles | text | desc, LocTable.txt (sample answers, not used) |
| Mission Timer Redux: base computer and living ship timers 0; fleet expedition event 600 s (easy 120); settlement building upgrade 30 s, judgement wait 20-30 s, settlement mini expedition 1500 s | values | `mods/Mission Timer Redux - MTR/_MOD_Mission_Timer_Redux/...`, readme |
| Gourmet Flavours: food reworked; horrific food 10/25/50/90% chance of Biological Horrors; anomalous food 10/25/50/75% chance of Sentinels; stellar food 10/25/50/90% chance of extreme weather; raw food damages; milk = shield; meat = life support; plants = hazard; ice cream = shield + jetpack; doughnuts = strong jetpack; cakes = long sprint | values + text | `mods/Gourmet Flavors/Gourmet Flavours/LocTable.txt`, desc |
| Helpful Descriptions: item descriptions get Used to make / Refines into / Made in a Refiner from / Used in cooking / Cooked from / trade-good Sold in lines | text | `mods/Helpful Descriptions/HelpfulDescriptions/HelpfulDescriptions READ ME.txt` |
| All Refiner and Cooking Recipes in the Wiki: two Catalogue categories, Cooking and Refiner, 1/2/3 ingredient pages; "normal" variant | text | desc + folder `RefinerWikiSlots_normal` |
| Construction Research Unit Updated: BOTH folders "ALL" (most tech and base part recipes) and "Update" loaded; desc says USE ONLY ONE | CONFLICT | modsettings.txt lines 137-138, desc |
| MT Shop Everywhere: multi-tool shop in the build menu, free, no blueprint, new tool each time it is built | text | desc |
| Ultimate Arms Dealer: outlaw station weapons dealer with 18 multi-tools, rare skins | text | readme |
| Astroport: trading posts rebuilt, 8 landing pads, trade terminal, ship salvager, appearance modifier, shield/health stations, save point | text | desc |
| Better Abandoned Station: Starship Fabricator and corvette teleport pads in abandoned stations | text | desc |
| zBest Station: station interior opened for building, vendors moved to back of the middle tunnel, portal added | text | desc |

## 6. Danger and encounters

| Fact | Value | Source |
| --- | --- | --- |
| Savage Sentinels: faster, more accurate, stronger, possibly more; desync in multiplayer with players without the mod | text; lua: MaxNumPatrolDrones 2, MaxNumInvestigatingDrones 8, CombatWaveSpawnTime 15 (vanilla unknown) | desc, `Savage Sentinels.lua` |
| Actually Extreme Gas Giants: gas giant hazard raised to extreme-storm level (Extreme 300), scales with Survival Difficulty | values | desc, lua/EXML |
| Increase Space Encounter Chance 1.5x: pulse encounter chance standard 0.00495, red 0.00075, green/blue 0.0015 | values | `mods/Increase Space Encounter Chance/Increase Space Encounter Chance1.5x/GLOBALS/GCGAMEPLAYGLOBALS.GLOBAL.EXML` |
| Unpredictable Roaming Ships: 0 to 5 traders, spread, later starts | values | EXPERIENCESPAWNTABLE.EXML, desc |
| Companion Pet Unlocker: almost any creature can be a pet; air / sea creatures must be tamed on foot; more rideable creatures | text | desc |
| Better Sentinel Destruction | visual, not detailed | |

## 7. World generation (short mentions only)

| Fact | Source |
| --- | --- |
| Nomad Biomes: 500 custom biomes, all planet types; "Save at a space station first when adding or removing this mod with an existing save" | `mods/Nomad Biomes - Modpack (formerly Lasagna)/_Nomad Biomes - README.txt`, desc |
| Lush Always Have Water: lush worlds always have oceans (not lush moons in non-purple systems); old bases on such worlds may float | desc |
| Waterless Hot n Dry Planets: desert and scorched worlds have oceans 5% of the time (both folders loaded, different biomes, no conflict) | lua descriptions, EXML `WaterActiveFrequency 0.05` |
| Huge Props Activated: huge trees and rocks can be shot, destroyed and scanned | desc |
| Unpredictable Shelters: 1-3 shacks; warns it changes the seed of some items (multi-tools, trade lists) | desc |
| Draw Distance Ground Objects 10x variant (author: high-end, heavy CPU/GPU) | installationFile `DrawDistance GroundObjects10x`, desc |
| Lunatus (darker nights), Nubilus (clouds), Stellarum, No Man's Sound, ANALOGUE exosuit voice | descs / READMEs |

## 8. Interface (short)

Instant Text Display (hold left mouse to speed up further, desc), Fast Text View, Short Shop Dialogs (one page), Fast Actions (confirm hold 0.35 s, GCUIGLOBALS), Bigger Wallet, Multi Pass (bronze/silver/gold/black-red Atlas Pass icons), Simple Colored System Info (galaxy map economy/conflict colours), UIO, Custom/Small Panels, Enhanced First Person Camera (ship FOV 90-100; desc says player FOV may not apply; first person FOV 140 in file), Easy Build (place parts close to you), Snappy Industry (snap points on industry buildings; "Scaling breaks snapping"), New Boundaries (photo mode 2000).

## 8b. Corrections made while writing

- No Notification Icons: the installed file is the "No Inventory Notification Icons" version (`mods/No Notification Icons/NoInventoryNotificationIcons/NoInventoryNotificationIcons.lua`: "Removes inventory notification marker icons"), not the build-menu one.
- Shorter Arrival Messages: installed variant is "Shorter" (DiscoverPlanetMessageTime 3), `mods/Shorter Arrival Messages/Shorter Arrival Messages 5.0/Globals/GCUIGLOBALS.GLOBAL.EXML`.
- Enjoyable Quicksilver ID `R_ABAND_END` (250) left out of the guide: I could not tell from files whether it is the abandoned building or the derelict freighter ending.
- Fleet expedition event time 600 is read as seconds (Mission Timer Redux readme says "Greatly Decreases Fleet Expeditions Time"; unit not stated).
- Companion Pet Unlocker species named in the guide (fish, birds, jellyfish, sharks, sandworms) are from its desc list.

## 9. Conflicts and things that look broken

1. Variant folders all loaded although their authors say "use only one":
   - Space Battle Frequency Controller: Guaranteed + Common + Rare + No battles (modsettings lines 70, 114, 170, 187).
   - QS Daily Mission Reward Multiplier: 2x + 5x + 10x (181-183).
   - Custom Binoc Panels: 7 colours (72-78) plus UIO says choose one of its opaque panels or Custom Color Binoc Panels.
   - Construction Research Unit Updated: ALL + Update (136-137), desc "USE ONLY ONE MOD FOLDER".
2. Same field from two mods: Faster Scanning vs Quick Scan (scan times); Better Ship Teleport Module Range (400) vs Super Ship Teleporter (1005); TerrainMultiplier vs Better Rewards (resource amounts); Better Buildings Scans (4800) vs Colossal Corvettes (40000) UnknownBuildingRange; New Boundaries (180) vs Colossal Corvettes (40000) corvette build camera; Better Rewards vs More Words (encyclopedia words).
3. Two MO2 mods "Stellarum" (mostly black) and "Stellarum (vanilla colors)" are both enabled and both contain a `Stellarum/` folder: the MO2 priority picks file by file.
4. NMS BootSkip ships `XINPUT9_1_0.dll` meant for `Binaries\`, but MO2 maps the mod to `GAMEDATA/MODS`, and there is no `xinput9_1_0.dll` in `Binaries\`. So it likely does nothing; the mod warning at launch stays (consistent with n-using-the-list.md, which says the warning is normal).
5. Version mismatch: MO2 top separator "NO MAN'S SKY - EXPLORER V3.0.2.0" and `_data/modlist_snapshot.json` version 3.0.2.0, but `_no-mans-sky-explorer/changelog.md` stops at v1.5.2.0 (July 11, 2026), and `_no-mans-sky-explorer/index.md` banner says Version "4.x", Size "12 GB" (snapshot: ~1.36 GB archives, ~2.1 GB installed).
6. Changelog lists "Removed Lasagna Obscura" but the list now has Nomad Biomes (formerly Lasagna). Not a real contradiction (new mod), but the changelog never records its addition.
7. Existing doc `installation-guide/n-using-the-list.md` uses em dashes (in "simply click to skip" and "THIS IS NORMAL / DON'T PANIC", both EN and FR blocks), against the copy rules.
8. DIABLO'S BLACK HOLE is an RC whose changelog says arrival and traversal still need runtime confirmation.

## 10. Not confirmed / left out

- Effective winner of every conflict in section 9.
- Vanilla values for Optical Drill bonus, jetpack, sentinel globals, stack limits (only mod-side values read).
- Mining Multiplier FOMOD choice (x2/x5/x10/x100): not recorded anywhere I could read.
- Whether Immersive Teleport's `Repeat=False` means a one-time charge per teleporter or per use. Desc says per use ("Using any teleporter now costs 50 Navigation Data"); guide follows the desc.
- Freighter Room Teleporter Fix, New Corrupted Recipes, reQuick, zDim Containers: details not needed for players or not documented in readable files (New Corrupted Recipes desc only says "see the screenshots").
- Key bindings: no mod in the list rebinds keys. Only control-scheme change found: Natural Steering (exocraft). No controls page written.
