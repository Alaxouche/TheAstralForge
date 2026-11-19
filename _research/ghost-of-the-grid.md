# Ghost of the Grid: Game Guide research sheet

Not published. Every fact below has its source. Path shorthands:

- `M` = `D:\Games\Ghosts of the Grid\mods`
- `S` = `M\Ghost of the Grid - Standard` (the list's own settings mod, priority 18 of 1453 in the Standard profile's `modlist.txt`, so it wins over nearly every other mod)
- `UI` = `S\red4ext\plugins\mod_settings\user.ini` (Mod Settings values shipped by the list)
- `CET` = `bin\x64\plugins\cyber_engine_tweaks\mods`
- `PROF` = `D:\Games\Ghosts of the Grid\profiles\Ghost of the Grid - Standard\modlist.txt`
- `INV` = `scratchpad\inv\gotg.json` (enabled-mod inventory, Standard profile, 1303 mods)
- `DOCS` = `g:\TheAstralForge-main-master\TheAstralForge-main-master\_ghost-of-the-grid\`

## 0. Caveats that apply to the whole guide

1. **The instance is a work in progress toward V4.0.0.0.** The top separator in `PROF` is `GHOST OF THE GRID V4.0.0.0_separator`; the latest entry in `DOCS\changelog.md` is v3.0.0.0 (May 25, 2026). Several mods in the instance are not in the released changelog (separator `99. NEW & UNSORTED`: RentDay, NightCityTexts, DistrictMemory, NightCityDiary, CyberRichPresence, all `modid 0`, versions `d2026.11.17`, plus Much Better Contracts, Militech M15, Immersive Helmet View, turn-signal mods). Some v3.0 additions are no longer in the instance (Immersive Odometer and Fuel System, Metro System, Pachinko, Playable Blackjack, Drive an Aerial Vehicle: none found in `INV`), and `Black Chrome` was "Removed" in the v3.0 changelog but is enabled again. The guide describes the current Standard profile.
2. **`UI` contains stale sections.** It holds settings for mods that are not enabled (e.g. `DarkFutureCore.Settings.DFSettings`, `GarageCore.*`, `AMoC.Config.AMoCConfig`, `XUtils.*`, `GrunhartMasteryConfig`, `Arclight*`). I only used a section after checking its mod is enabled in `PROF` (grep of `^module <name>` in `M\**\*.reds`, or the mod name in `PROF`). Dark Future is **not** enabled (`-Dark Future...` not in enabled list, not in `INV`).
3. **`overwrite` folder.** `D:\Games\Ghosts of the Grid\overwrite` holds runtime state (logs, sqlite, sessions) plus a few config files (Weapon Conditioning RCF json, True Flashlight RCF json). I don't know whether Wabbajack ships those. Where a number comes only from `overwrite`, it is marked "(overwrite)".
4. **Profiles.** Diff of enabled mods between profiles (`profiles\*\modlist.txt`):
   - Crowd density: Standard = `NIGHT CITY ALIVE - Standard Density` + `Spawned NPC Post Combat Fix - Standard Density`; Performance = Low Density versions; Ultra = High Density versions.
   - Only in Standard (not Ultra): RentDay, NightCityTexts, NightCityDiary, DistrictMemory, Much Better Contracts, NCI Addon x6, True Flashlight, Sheng Noods Ramenshop, Relentless Audio Addon, V's Edgerunners Mansion Reloaded, Militech M15, turn-signal mods. Performance also lacks True Flashlight, Much Better Contracts, RentDay, etc.
   - Only in Ultra: Environmental Weapon Handling, Glen Apartment Expanded - Redux, Lucy Apartment Remastered 2025, Highway H10 Rework, Driver Spawn Distance Overhaul.
   - Looks like Ultra/Performance were not re-synced after recent work rather than a design choice. Mentioned in the guide only as "density differs, a few recent additions are Standard-only".

## 1. Starting the game

- Launch: DOCS `installation-guide\g_using-the-list.md` says launch "Ghost of the Grid Launcher" from MO2, don't use Steam/GOG, don't click Unlock. The executable in `D:\Games\Ghosts of the Grid\ModOrganizer.ini` is titled `Ghost of the Grid` (entry 5) with arguments `--launcher-skip -skipStartScreen`. Small naming difference with the doc ("Ghost of the Grid Launcher").
- Known issue: CTD during the first act / scripted intro, workaround retry, stability improves after the opening (DOCS `known-issues.md`).
- New lifepath **Fresh Start** (`M\New Lifepath Intro - Fresh Start\meta.ini`, modid 18223): 4th lifepath at character creation, V is ex-corpo and ex-nomad returning to Night City, new intro before the Half Year Montage, picked up by Misty, Jackie and Vik at the Orbital Air terminal, access to both lifepaths' dialogue options. Lifepath side quests are disabled by default for this lifepath; CET console command to enable: `Game.GetQuestsSystem():SetFactStr("ns_lp_quests_enabled", 1)`. "disabled for the Phantom Liberty skip".
- Skip Unskippable Cutscenes... (modid 3278): fast-forwards unskippable scenes by accelerating time, needs CET, bindable hotkey (meta.ini). Hotkey not bound in `S\bin\x64\plugins\cyber_engine_tweaks\bindings.json` (no entry).
- CET overlay key: `S\bin\x64\plugins\cyber_engine_tweaks\bindings.json` → `"cet": {"overlay_key": 9851624184872960}` = 0x23000000000000 → VK code 0x23 = **End**. All other CET hotkeys in that file are `0` (unbound), including Weapon Loadouts, WeatherSwitcher, LUTSwitcher, AMM, Semi-automatic Transmission, car_menu, Shift.
- Settings menus:
  - Native Settings: Better Leveling "Configure via Settings → Mods → Better Leveling" (meta.ini 22784); Damage Scaling "MODS -> Dmg. Scaling from the main menu" (meta.ini 1712); Simple XP Multiplier "RMK MODS" tab of the Mods menu (meta.ini 3136).
  - Mod Settings (`M\Mod Settings`, values in `UI`).
  - Redscript Configuration Framework hub: `M\Redscript Configuration Framework\r6\input\dvrcf.xml` `DVRCF_OpenHub_Button` = **F8**. True Flashlight docs: "Battery Presets in the Redscript Configuration Framework hub".
  - **F8 is also Limited HUD's global toggle** (`M\Limited HUD\r6\input\LimitedHUD.xml` and `UI [LimitedHudConfig.LimitedHudHotkeys] lhudGlobalToggle = IK_F8`). Potential key clash, reported.
- Limited HUD configured behaviour (`UI`): minimap `ShowOutOfCombat = true`, `ShowInCombat = true`, hidden with scanner/zoom; health bar `ShowOutOfCombat = false`, shown in combat, when health not full, when buffs/quickhacks active, with weapon; quest tracker hidden in and out of combat, shown for 5 s on quest updates (`DisplayForQuestUpdates = true`, `QuestUpdateDisplayingTime = 5`), in vehicle and when zooming; weapon roster shown in combat, in stealth, with weapon. Hotkeys F6 minimap, F8 global.
- Computer Anywhere (12520): computer access anywhere incl. Virtual Atelier and Virtual Car Dealer; "Visit V's starting apartment in H10. You only need to do this once to activate the mod"; with Radial Menu Upgrade (26764) the option is the new bottom entry of the radial/quick menu, which scrolls between Idle Anywhere, Computer Anywhere, TV Anywhere.
- Reset Attributes always available (9240): reset attributes as many times as you want.
- Atone (14814): a confession booth resets Street Cred.

## 2. Controls (keyboard). Only bindings found in files

| Key | Action | Source |
| --- | --- | --- |
| End | CET overlay | `S\...\cyber_engine_tweaks\bindings.json` |
| F8 | Redscript Configuration Framework hub | `M\Redscript Configuration Framework\r6\input\dvrcf.xml` |
| F8 | Limited HUD global toggle | `M\Limited HUD\r6\input\LimitedHUD.xml`, `UI` |
| F6 | Limited HUD minimap toggle | same |
| F2 | Always First Equip: first equip / idle break animation | `M\Always First Equip\r6\input\AlwaysFirstEquip.xml`, `UI afeMainHotkey = IK_F2` |
| F3 | Always First Equip: ready / lowered weapon | same, `afeAdditionalHotkey = IK_F3`; meta.ini: "switch between ready and lowered weapon positions" |
| 1 to 8 | Quickhack Hotkeys: select quickhack 1 to 8 | `M\Quickhack Hotkeys\r6\input\QuickhackHotkeys.xml`, `UI [QHHotkeys...]` |
| 9, 0, V, B, R, T, Y, U | quickhacks 9 to 16 (extra slots) | `M\Slots Slots Slots - More Cyberdeck Quickhack Slots\r6\input\SlotsSlotsSlots_QuickhackHotkeys.xml`, `UI` |
| T | Trigger Mode Control: swap fire mode (weapons that support it) | `M\Trigger Mode Control\r6\input\TriggerModeControl.xml`, `UI SwapFiremode = IK_T` |
| F (+ Ctrl / Shift modifiers) | True Flashlight toggle; modifier Ctrl, tactical modifier Shift | `UI [TF_Config] toggleKey = IK_F, modifierKey = Ctrl, tacModifierKey = Shift`; `M\True Flashlight...\r6\input\TrueFlashlight.xml`. Exact combination semantics not documented; I only state the configured keys. |
| Left Shift (car) / Left Ctrl (bike) | Nitrous | `UI [MisterChedda.NitroBoost.VehicleNitroSystem] nitroActivationKey_Keyboard_Car = IK_LShift`, `_Bike = IK_LControl`; meta.ini 20675 |
| Left mouse / right mouse (hold) | Finisher Overhaul: accept finisher / Savage Sling (blunt) | `UI [FinisherOverhaulBehavior] finisherKey = IK_LeftMouse, savageSlingKey = IK_RightMouse`; Settings.reds descriptions |
| S / A (inventory) | Mark To Sell: mark item as junk / mark all same type and quality | `M\Mark To Sell\r6\input\MarkToSell.xml`, meta.ini 4725 |
| Z / C (crafting) | Enhanced Craft: previous / next weapon variant | `M\Enhanced Craft\r6\input\EnhancedCraft.xml`, meta.ini 4378 |
| P | Filthy Access Points: repair personal link | `M\Filthy Access Points\r6\input\FilthyAccessPoints.xml` (`repair_personal_link`) |
| 4 | Metro Pocket Guide: toggle navigation widget | `M\Metro Pocket Guide\r6\input\MetroPocketGuide.xml`, meta.ini 11882 |
| U | Immersive Throwables: switch throw mode for held weapon | `M\Immersive Throwables\r6\input\ImmersiveThrowables.xml`; meta.ini 25074 "keybind to switch the mode for the currently held weapon" |
| R / Q | Stealthrunner pickpocket: loot / use | `M\Stealthrunner...\r6\input\StealthRunner.xml` |
| F / R | Drug Dealer interactions (main / secondary) | `M\Drug Dealer...\r6\input\DrugDealer.xml` |
| V / Y | Auto Drive Enhanced: switch seats / switch AI | `UI [AutoDriveEnhanced.Settings] ADE_SwitchSeats_Key = IK_V, ADE_SwitchAI_Key = IK_Y` (xml default T is overridden to Y) |
| Q / E | Dialogue choice up / down (W/S disabled) | `M\Disable W-S Keys For Select Dialogue Options\r6\input\no_movement_keys_on_dialogue_selection.xml`, meta.ini 9799 |
| Mouse thumb buttons, LShift/LCtrl | Immersive Driving analog throttle values | `M\Immersive Driving\r6\input\ImmersiveDriving.xml` (Mouse4/5 0.05 accel, LShift 1.7 accel, LCtrl 0.4 brake). Middle mouse: inverse vehicle camera. |
| Drone Companions: O drive, G jack, X lure, LCtrl cloak, V view, F2 repair, 5 mark, F4 handling, F6 spoof | `M\Drone Companions Revamp (2.5)\r6\input\DroneCompanions.xml`, `UI [DCRSettings]` |
| Vehicle Turret Core: LMB fire, 1/2/3 cannon/MG/rocket, 4-6 extra weapons, MMB next weapon, RMB zoom | `M\Vehicle Turret Core\r6\input\VehicleTurretCore.xml` |
| Consumable Animations: R manual choice | xml, but `UI consumableAnimationLootActionEnabled = false` so not active. Left out. |

## 3. Character

### Better Leveling (`M\Better Leveling (Revamp of Custom Level Cap)`, modid 22784)
Shipped config `...\CET\BetterLeveling\Data\config.json` vs defaults in `init.lua` lines 3-50:

| Setting | List | Mod default |
| --- | --- | --- |
| NewLevelCap | 300 | 60 |
| StreetCredCap | 500 | 50 |
| StartingAttributePoints | 12 | 7 |
| MaxStartingAttribute | 8 | 6 |
| AttributeCap | 40 | 20 |
| SkillProgressionCap | 150 | 60 |
| AttrPointsPerLevel / PerkPointsPerLevel | 1 / 1 | 1 / 1 |
| MoreCyberwareCapacity | 6 | 6 |
| CyberwareCap | 1000 | 1000 |
| XP multipliers | all 1 | all 1 |

`BTL_02_TweakDB.reds` line 126: `MoreCyberwareCapacity` is written to `Constants.CyberwareCapacity.cyberwarePointsIncreasePerLevel`, `CyberwareCap` to `cyberwarePointsMax`.
Street Cred discount tiers (meta.ini): 75+ 5 %, 100+ 10 %, 150+ 15 %, 200+ 20 %, 250+ 30 %, 500+ 45 %.
Note: NewLevelCap slider in init.lua goes 1 to 500.

### Graven's Attribute Expansion (24883), per-point bonuses (meta.ini)
- Body: +2 max health, +2 stamina, +1 % melee damage, +4 carry capacity per point; +4 % stamina regen per 10 points.
- Reflexes: +1 % crit chance, -0.5 % reload time, +0.5 % attack speed, +1.25 stamina, +0.5 % fall damage reduction per point; +0.5 % move speed per 4 points (reduced beyond 20).
- Technical Ability: +2 armor per point (+5 beyond 20), +5 Humanity, -0.25 % cyberware cooldown, +0.5 % cyberware stat modifier, +0.25 % grenade damage per point; +1 grenade charge per 20.
- Intelligence: +1 max RAM per 2 points, +0.25 memory regen, +1 % quickhack damage, +0.25 % quickhack resistance per point; -0.25 % upload speed per 5; +1 queue slot per 20.
- Cool: +2.5 % crit damage, +2.5 % headshot and weakspot multiplier, +0.5 % stealth damage per point; -5 % visibility per 20; +5 % mitigation chance per 10.

### Renaissance Punk - Perk Scaling (14037), meta.ini
Perk scales with attribute: +2 / 4 / 6 / 8 capacity for each attribute at 4 / 9 / 15 / 20 (floatValues in `r6/tweaks/Renaissance Punk Scaling/NewPerks.Tech_Central_Perk_2_2.yaml`, checked Nov 20, 2026; vanilla flat +4).

### Simple XP Multiplier (3136)
`S\CET\SimpleXPMultiplier\settings.json`: all multipliers 1 (vanilla XP).

### Bullet Ballet (32933), from scripts (`M\Bullet Ballet...\r6\scripts\BulletBallet\`)
- New perk tree "BULLET BALLET · Handgun and revolver doctrine" (BulletBallet_Tree.reds) built on Custom Perk Framework (BulletBallet_Tree.reds error string).
- 12 perks, 3 chains of 4 (BulletBallet_Core.reds `GetPerkTier`, `GetPrerequisite`): Vigilante (handguns & revolvers): Desperado → The Professional → Die Hard → Sicario; Gun Fu (handguns): Hard Target → A Better Tomorrow → Hard Boiled → The Killer; Yakuza (revolvers): Boiling Point → Sonatine → Violent Cop → Hanabi.
- Cool required by tier: 4 / 9 / 15 / 20 (`GetPerkRequiredCool`).
- Points come from milestone tracks (comment: "twelve points mapping exactly onto twelve perks"): handgun kills 25/75/175/350, revolver kills 15/50/120/250, headshot kills 20/60/150/300 (`GetTrackThresholds`, comment says thresholds are "PROVISIONAL").
- Perk texts (BulletBallet_Progression.reds lines 49-71, mapping by order of the switch, not fully verified per perk): ricochets +50 % damage and one extra bounce; dodge/dash removes recoil 3 s; dodge/dash/slide while aiming dilates time 99 % for 2 s; fire 100 % faster while time is dilated; fire rate and damage up to +45 % with movement speed; reload or switch grants 30 % damage for 5 s; every third quick hit staggers; headshots dilate time 99 % for 1 s; revolver damage rises as health falls, up to double; revolver hits within 4 m always crit, +20 % crit damage; dashing returns two rounds to a revolver; reloading a revolver dilates time 70 % for 4 s. In the guide I list effects, not which perk gives which (mapping per perk name not verified).

### Running Man - New Sprinting Perks (26611), meta.ini
Body tree: sprint in any direction; Double Sprint (press sprint again while sprinting, drains stamina); Hit and Run (fast melee attacks while sprinting); Second Wind (Double Sprint drains 50 % less stamina).

### Set Bonuses (8103), meta.ini
Bonuses for TTRPG and other sets, e.g. Cop (blunt): 2 pieces -20 % blunt stamina cost, 3 pieces +20 % max health and stamina, 4 pieces +10 % blunt damage; Corporate (smart), Fixer (blades), Media (throwing), Netrunner (quickhacks) sets listed. Only the general idea used in the guide.

### Lifepath Bonuses and Gang-Corp Traits (2217)
Configured file `S\CET\lifepath_bonuses_and_gang_corp_traits\settings.json` (non-default values):
- Familiar groups (description: Corpo = Arasaka, Biotechnica, Kang Tao, Militech; Nomad = Aldecaldos, Wraiths, NUSA; Street Kid = Tyger Claws, Valentinos, Scavengers; also `lifepathAffiliation` fields: 6th Street = Nomad in this file).
- `LifepathFamiliar`: damage to NPC x1.2, detection x0.8, RAM cost -1, Street Cred x0.25, money reward per level 5.
- `LifepathOpposed`: damage to NPC x0.8, upload time +1, RAM cost +1, Street Cred x1.5, money per level 2.
- Gang traits (selection): Animals immune to poison and electrocution, take x0.5 from handguns, assault rifles and "annihilation" (shotguns/LMG class) weapons, your armor x0.75 vs them. Arasaka immune to ultimate quickhacks, x0.5 crits and stealth attacks, one-shot protection 75, RAM cost +2, upload +1. Tyger Claws and Kang Tao: 80 % smart bullet miss chance, immune to burning. Militech: immune to damage hacks and electrocution, x0.5 headshots and tech weapons. Voodoo Boys: immune to ultimate quickhacks, RAM +2, upload +1.5, x0.5 smart weapons. Maelstrom: upload +2, RAM +1, detection x1.2, x0.5 assault rifles. Valentinos: x0.5 crits and tech weapons, immune to bleeding, your armor x0.5. 6th Street: immune to damage hacks, x2 ricochet damage, x0.5 blunt and annihilation, x0.8 power. Wraiths: x0.5 blades and blunt, poison immune. Scavengers: one-shot protection 90, 50 % smart miss, x0.8 quickhack damage. Biotechnica: immune to control hacks, bleeding, poison, x0.5 power weapons.
- `scaleQuickHackUploadTimeByDistance = true`: description: enemy netrunner upload time scales with distance, "Players can have this feature too".
- Settings also show `showNpcStatus` and `showNpcbonuses = true`.

### Convo Skill Check Scaling (2886)
`S\CET\ConvoSkillCheckScaling\settings.json`: scalingFactor 0.75, easyToMediumThreshold 15, mediumToHardThreshold 35. Mod default not checked. Description: vanilla dialogue checks rarely go above 7; this scales them so hard checks can reach 20.

### Practice Makes Perfect (21340)
Rematch Coach Fred's sparring bot from the bench in H10 after Act 1, level scaled.

### Cyberware
- Slots Slots Slots (`UI`): unlock mode `ByRarity` ("more slots open at each rarity, all at Legendary"); cyberdecks `Double` (twice the quickhack slots), duplicates Off; cyberware arms 4 mod slots (Gorilla Arms, Mantis Blades, Monowire, Projectile Launch System); weapons 4 mod slots normal, 4 iconic (vanilla 2), "x-MOD2 iconics get 2 more". Descriptions from `M\Slots Slots Slots - *\r6\scripts\SlotsSlotsSlots\*\*.reds` ModSettings attributes.
- RipperDeck (9302): manage cyberware from Hub > Cyberware without visiting a ripperdoc.
- Megingjord (12664): hover legs, Arroyo's ripperdoc or Dogtown Stadium ripperdoc from level 20.
- Extra Hands (12325): Magnetic Wrist Sheath (hidden knife, no weapon slot) at Victor's or Dogtown Stadium ripperdoc; Ambush Compiler (stealth ballistic coprocessor).
- Black Chrome, Gravitas, Missile Rain, Relic Enhanced, Actual Chrome Compression, Specialized Ripperdocs, Cyberpsychosis Overdrive, CCXL - More Cyberware, Beanie's CCXL Clinic, Kiroshi Night Vision: enabled, no description in meta.ini; mechanics not documented here.
- Overclock Overheat (14255): overclock can be partial; running out of charge overheats and burns you; can't overclock while burning; Power Surge becomes 5 %/s regen. `UI`: partialCharge true, overheatBurn true, burnOpt Medium, ocDilation false.
- Upgrade Weapons Unlocked (9889): non-iconic weapons can be upgraded again; `UI upgradeReduction = 10`, `reductionEnabled = true` (meaning of 10 not documented, probably price reduction).

### Quickhacks added (names only, no description in meta.ini)
10 New Quickhacks - Netrunner's Arsenal (31125), Blackwall Takedown (32126), Enter Blackwall (35785), Gravitational Force (31872), Thunderclap (31484), Widow's Web (31818), Missile Rain (33390), Quickhack Combos - 21 New Synergies (33920), Quickhack Loadouts (11682). Netrunner Quickhack Shop (Virtual Atelier, 5918).

## 4. Combat

### Damage Scaling and Balance (1712), `S\CET\DamageScaling\settings.json`
Key mapping from `M\Damage Scaling and Balance (Formerly Level Scaling)\...\DamageScaling\init.lua` (lines 95-98, 259) and `localization\en.lua`: `npcDamageScaling` = "Damage to NPC Multiplier by Level", `playerDamageScaling` = "Damage to Player Multiplier by Level"; 7 points at levels 1, 10, 20, 30, 40, 50, 60 (meta.ini).
- Damage to NPCs: x2 at every level (preset `Mult_2.0`).
- Damage to player: 1.0 / 1.25 / 1.5 / 1.75 / 2.0 / 2.25 / 2.5 at levels 1 / 10 / 20 / 30 / 40 / 50 / 60 (preset `Custom`).
- Extra damage to NPC by tier: trash x2, weak x1.75, normal x1.5, officer x1.25, rare/elite/boss/MaxTac x1. Health multipliers all 1.
- headhshotMultiplier 5, grenadeDamageMult 5 (meaning: multiplier on top; exact formula not documented).
- Weapon class multipliers: pistol 0.8, revolver 1.25, SMG 0.65, assault rifle 0.8, precision rifle 1.3, sniper 3, shotgun 2, HMG 1.15, power 1.3, smart 0.7, LMG/tech/melee 1.
- All NPC-weapon multipliers 1. Stamina cost x1.

### Reinforcements System (21532) + Delayed addon (29473)
meta.ini: gangs plus Arasaka and Militech call backup; hidden grace time up to a minute at fight start; call lasts about 20 s shown by a phone icon over the caller; next call possible after about 60 s; size from heat 1 to 20; starting size depends on Street Cred and turf; each call raises your bounty with that gang. `UI [Phoenicia...ReinforcementsSettings]` per-gang values (e.g. Maelstrom 30 % chance of stronger reinforcements, Barghest 20 % police call chance and 100 % fast call). Only the general mechanics used.

### Endurance System (27990), `UI [EnduranceSystemConfig]`
Low health slows stamina regen and low stamina slows health regen (min 20 % regen at zero). Each full stamina exhaustion: -5 max health and -2 max stamina, down to 50 % at most; falling below 25 % health also costs 5 stamina. Health regen stays on in and out of combat; sleep restores degradation (`disableDegradationRecoveryOnSleep = false`; description: "Recovery Mechanic").

### Weapon Conditioning (10479)
`M\Weapon Conditioning (Tier System Overhaul)\r6\storages\RedscriptConfigFramework\WeaponConditioning.docs.txt`: condition bar on every weapon, wears with use and explosions; at zero the quality tier can drop; damage falls linearly with condition down to the previous tier's damage; low condition causes jams and extra damage effects; you must maintain a weapon before upgrading it; enemy rarity drives drop quality. Localization `en-us.reds`: "Maintain", "Upgrade", "Can only be maintained in unrestricted locations", stage names Pristine Condition / Minor Wear Detected / Checkup Recommended / Attention Required / Useless scrap. Settings (overwrite only, `overwrite\r6\storages\RedscriptConfigFramework\WeaponConditioning.json`): vendor weapons 80-100 % durability, crafted 70-90 %, looted world items 43-90 %, isTierDegradable true, isConditionAffectDPS true. Numbers left out of the guide (overwrite).

### Respect Your Weapon 2.0 (27287), `UI [RespectYourWeapon]` and Settings descriptions in `Respect Your Weapon.reds`
Night City reacts to visible weapons: "tension" grows when you show a weapon (x2), point it at an NPC (x5) or aim (x100); ignored in combat; melee aim not counted; `combatOnTension = true`; `crowdReactions = true`; ranged visible range 20 m, dangerous 10 m; melee 10 / 5 m; quest NPCs excluded.

### Stealthrunner (7616), meta.ini + `S\CET\StealthRunner\settings.json`
Stealth objectives (Ghost etc.) on main quests, side quests, gigs and NCPD hustles; rewards XP, Street Cred, Headhunter XP, money, recipes; enough completions unlock perk points, new cyberware at ripperdocs, iconic recipes and a Stealthrunner perk tree. Settings mostly 1x. Pickpocket keys R/Q (xml).

### Silent Silencers and Throwing Knives, `S\CET\SilentSilencersAndKnives\settings.json`
silenced gunshots and thrown knives stealthy (true), min distance 2 m, `afterStealthHitNoKillDebuff = true` (visibility modifier 0.5 for 5 s after a non-lethal stealth hit, interpreted from key names).

### Ricochet Redux, `S\CET\RicochetRedux\settings.json`: BounceBonus 50, SearchAngle 40, works silenced and with coprocessor, Stun true.

### More Vigilant Enemies (26778), `UI [MoreVigilantEnemies]`: sensor multipliers hostile 300, alerted 30; player hostile 200-400, known 20-40, unknown 2-4. No description; only "enemies notice you faster" implied by name. Left as name only.

### Trace Position Overhaul (12445): only enemies with the right ICE can trace your quickhacks; netrunners guard their squad's network; `UI`: reverseTrace, traceNetrunners, traceMechanical, pingNetrunners all true.

### Lifepath / gang traits: see section 3.

### Body Shield (10533): carrying a body gives flat damage protection.

### Finisher Overhaul (33307), `UI` + ModSettings descriptions: directional fast finishers, cross-weapon executes, legacy pre-2.0 finishers restored (Mantis leap, Gorilla grab, katana stab, two-handed club), slow motion off, red outline on target.

### Immersive Knockdown (37600), Settings.reds + `UI`: knocked down mid-air you stay down until you land; barbed wire cuts (short stagger, push, 5 s bleed) instead of knocking down; electric wire shocks, first hit 10 % max health.

### Custom Max Ammo (8090), `M\Custom Max Ammo...\CET\CustomMaxAmmo\init.lua`: handgun 3000, rifle 2000, shotgun 1000, sniper 500.

### CyberShell (29889), `UI`: shield points, passive regen 0.5, repaired out of combat. Mechanic not documented beyond keys.

### Weather Condition - Dress for the Forecast (29024)
Docs `M\Weather Condition...\r6\storages\RedscriptConfigFramework\WeatherCondition.docs.txt`; config `S\r6\storages\RedscriptConfigFramework\WeatherCondition.json` (modEnabled true, enableComfort true, enableBiohazard **false**, showWheelOverlay true).
- Clothing gives an insulation score (via EquipmentEx); weather + time of day + district (Badlands) give effective temperature.
- Cold: Chill = slower reload and ADS; Freezing = slower again plus weapon sway.
- Heat: Warm = -10 % stamina regen; Overheating = -25 % plus breathing VFX.
- Toxic rain without head and face cover: -25 % max health. Sandstorm without eyes and face cover: -25 % movement speed.
- Indoors, vehicles, metro and elevators protect; bikes don't. Food (vs cold) and non-alcoholic drinks (vs heat) give Comfortable for 1 / 5 / 7 min by quality, only when the debuff is active. Hold the weapon wheel to see your state.
- `UI [Exposure.Settings.WeatherConditionSettings]` (module owned by this mod): rain/sand/fog weapon modifiers (e.g. p_rain_reload 0.98, s_rain_jam 0.05).

### Police and Trauma Team
- NCPD Prevention Police Enhancement (9863): no description; `UI [mm_NCPDConfig_*]` per-district sections. Mechanics not documented. Name only.
- Trauma Team Response (37784), `M\Trauma Team Response\r6\scripts\TraumaTeamSubscriptions\Localization.reds`: Trauma Team AVs respond to the BioMonitor transmission of insured NPCs; tiers send 1/2/3 responders with default dispatch 60/45/30 s; a quickhack-like option "Block the patient's emergency transmission to Trauma Team". **Inconsistent strings**: "Forces Silver coverage ... two responders (60-second...)" vs "One responder; ... 60 seconds". Guide says "more responders and faster dispatch for higher tiers, 30 to 60 s by default".
- CyberBane (35847), `M\CyberBane...\r6\scripts\Cyberbane\Localization\CyberbaneLocalization.reds` + `UI [CyberbaneSettings]` (enabled, preset Default, pacing Timetable, rivalsPerDay 8, maxRivals 8, messageDelivery Phone, mapMarkers Everyone, rivals/rivalTeams/rivalHideouts true): named Rivals hunt you; reputation (renown, dread) spreads between districts and decays; street talk prompt (Greet, Dismiss, Antagonize, Intimidate) when you look at someone up close with empty hands, choose with F; spare or finish beaten Rivals, informants, crew members you can call, surrenders, sit-downs between gangs at war, bagmen carrying a gang's take, morning brief text at dawn, map markers gold for Rival, purple apex squad, white crew; Rivals may come back with chrome that counters how you hurt them; some senior Rivals have a fatal flaw.

## 5. The city

### Vehicles
- 142 mods in separator `07.5 VEHICLES` (INV), includes addon/optional entries. Virtual Car Dealer (4454): store on the PC in your apartments (and through Computer Anywhere), lists all supported modded cars.
- Car Selection Menu (35954): CET mod `car_menu`, no description; bindings in `bindings.json` (`car_menu_summon`, next/prev manufacturer, favorite) all unbound.
- Nitrous (20675): on all vehicles, LShift car / LCtrl bike (`UI`).
- Anti-Theft Measures (27229): hacking minigame when you hotwire a stolen car, one try; fail → alarm, brake lock, tire deflation, MagnaVolt shock, NCPD notified, security detail, etc. `UI`: breachMode Minigame, hotwireDuration 3 s, lethal countermeasure disabled (`lethalEnabled = false`), `magnaVoltMaxHealthDamage = 25`, `notifyNcpdHeatValue = 1` on Premium category, security detail on Premium, money counterhack 20 on Premium, glitch vision on Luxury.
- Repairs: Viktor Vektor's Garage Add-on (23386) full repair at Vik's for 500 eddies (meta.ini); NC Autoshop's Repair (22571): workshops in Watson, Westbrook, City Center, The Glen, Santo Domingo, Pacifica, Badlands; cars 5,500, bikes 2,500 (meta.ini, editable yaml; not checked if yaml changed).
- Vehicle Durability Display, Vehicle Gear Display (HUD), Semi-automatic Transmission (8016), Cyber Drift (8306), Immersive Driving (5293 analog keyboard throttle), Auto Drive Enhanced (switch seats V / switch AI Y).
- Delamain Combat Mode, Vehicle Turret Core + weaponized cars (VelociRaptor 6x6 weaponized, Shion Blackbird weaponized, Solvind TOR).

### Travel
- Fast Travel from anywhere to everywhere (9241), script `FastTravelFromAnywhereToAnyMapPin.reds`: from the world map you can fast travel to any selected map pin (teleport to pin position) when fast travel is enabled and you're not in a workspot/scene.
- Fast Travel Time (23250): time passes based on distance (bus wait + ride); travel time shown in the map tooltip with arrival time.
- Pay-To-Go (23415): fast travel costs money; if you can't pay you get debt with daily interest ("It's 2.49%"); prices inflate over time. `UI`: enabled, bus enabled, `fMS_TravelDistrictRate = 0.075`, `fMS_TravelRateInflation = 0.0005`.
- Metro: Inside The Metro (walk in carriage), Metro Pocket Guide (shortest route, widget, key 4), Metro Cams.
- Taxi Work in Night City (15624): find a cab, honk twice, pick up, drop off, paid by distance; fares unlock Combat Cab vehicles at Autofixer. `UI`: VIP chance 10 %, random event 30 %, `taxiRequirement = true`.

### Homes and rent
- Rent a Motel (21729): rent rooms at supported motels (map filter "apartments for rent"), pay at the terminal by the door, 24 h or 7 days (10 % discount per day), 20 % fine if you overstay.
- Rent a Hotel (33351): no description.
- Pay Rent (30374), `M\Pay Rent\r6\scripts\PayRent\Rental\Constants.reds`: rent schedule 7 days per apartment, default rent 10,000; adjustable per apartment in Native Settings (range 1,000-250,000, `init.lua` line 70-71). "HappyTenant" phone contact.
- RentDay (modid 0, unreleased custom mod), `M\RentDay\r6\storages\RentDay\RentDay.ini`: H10 1500 + 25 per level; Northside 1000 + 20; Japantown 3000 + 50; Glen 4000 + 60; Corpo Plaza 6000 + 80; late fee 250; lock stash and bed while locked out; Home notes 35 % chance, 25 % bonus. **Conflicting period**: ini `PeriodDays = 7`, `GraceDays = 3`; `UI [RentDay.RentDaySettings]` `periodDays = 1`, `graceDays = 0`. Which wins at runtime: not checked.
- **Pay Rent and RentDay are both enabled** in Standard: possible double rent on the same apartments. Reported.
- Apartments added (07.6 separator): Dogtown Hideout, Eden Plaza - Charter Hill Player Penthouse, V's Pacifica Cabana Hideout, Rebecca's Apartment DLC, TPP Rooftop Hangout - Judy, Lucy's Apartment (2 mods), Brutalist H10 Apartment, H10 Window Garden, Apartment Cats x5, Pet Your Cat; V's Edgerunners Mansion Reloaded (99.). Locations not documented in meta.ini (descriptions empty for several).
- Apartment life: Use Your Fridge, Immersive Shower, Apartment Dropoffs, Apartment Birds, Apartment Toys, TV/Idle/Computer Anywhere.

### Shops and economy
- 28 mods in `13.1 VIRTUAL ATELIERS` (INV). Virtual Atelier (2987): open V's computer; stores show modded items with preview on V. Computer Anywhere gives access anywhere.
- EconomyPunk (16952): reprices everything, Street Cred discounts, rewards, autofixer prices, service costs; selling cyberware is good money, weapons no longer the best sale, cyberware and quickhacks more expensive.
- No More Out-Leveling Vendor Items (12500): items no longer vanish from vendors when you level up.
- Holy Focking Vending Machines (25732) `UI [HFVM.Config.HFVMConfig]`: limited stock (12 per item, 9 for weapon vending machines), restock at 06:00 only if you're at least 1500 m away, 3 % jamming chance, price x1.
- Stock Market and News System (6319): "Stock Market" tab on every PC, 33 stocks, 66 news items, reacts to quests.
- Drop Points Reimagined (29563): drop points become parcel machines to send items around the city with delivery times, pricing, service tiers.
- Mark To Sell, Smarter Scrapper, Automatic Junk Scrapper perk back, Vendor Filters/Search.
- District Memory (modid 0, unreleased), `M\DistrictMemory\r6\storages\DistrictMemory\DistrictMemory.ini` (same values in `UI`): per-district heat (+5 per wanted star, +2 civilian kill, +4 cop kill, -8 per day, max 100) and standing (+10 per gig, +4 per hustle, -1 per day, -4 per day when heat ≥ 60); prices +25 % markup from heat, up to -20 % from standing, clamped 0.70-1.50; police tougher above heat 50 (+0.5 crime score). Tiers: heat Unknown/Noticed (15)/Wanted (40)/Public Enemy (70); standing Stranger/Familiar (15)/Respected (40)/Legend (70).
- Immersive features: Multiple Use Consumables (consumables last several uses), Weather Condition (see 4).

## 6. Content

- Deceptious quests (Deceptious Quest Core 7831): Californication (7833: romanced Judy, Judy stays in NC, positive talk with Judy's Abuela, triggers 24 h+ after...), Hot Fuzz (7832: same Judy requirements), Encore (8413: romanced Panam and the Nomads moved camp), One More Light (7834: attended Jackie's ofrenda, so his body was not sent to Vik's).
- Fresh Start lifepath (see 1).
- Undermine Quest Series (17186), Possibilities (17185: part 1 of a series, needs choice "Send Songbird to the moon"; Song So Mi survives and wants to meet; relationship possible).
- Missing Persons - Fixer's Hidden Gems (5058): immersive way to find almost all of the 194 Hidden Gems; `S\CET\MissingPersons\settings-MissingPersons.json`: XP 20, Street Cred 10, eddies 100 per find (keys XPValue, SCValue, EDValue), hints on, counter on, no auto-track.
- Hidden Gems as Random Events (16619), Airdrops (21836: GPS markers on Hansen's Dogtown airdrops, reveals hidden gem airdrops), Airdrops - More Hidden Gems, Hidden Gems Enemies.
- Repeatable NCPD Gigs (18968): Assault in Progress respawns with higher rewards and stronger enemies when fewer than 8 are available. Much Better Contracts (Repeatable Gigs) (35142), unreleased add.
- Story gigs without descriptions (names only): Acceptable Loss (33959), Dead Ringer (33571), Negative Balance (32694), Return Ticket (36829), New Fixer - Hodan Warsame (36816), Join Trauma Team - AV Rescue Shifts (37338), Hothead Restored Gig (37939), Return Imogen (16474), Light Candle For Johnny (16916), The Lone Wanderer's Stash (23127: "somewhere near border crossing", don't own the car first).
- Jobs: Drug Dealer - Become a Kingpin (27800: drug labs, raids, stashes, research, in-game tutorials), Taxi Work, Courier Jobs settings (21707, for "Just Another Story" courier missions; `S\CET\CourierJobSettings\settings.json`: longerTimers false, fastReinforcements true, chaseRate 3, damageRate 3), Guitar Gigs Across Night City (34751, no description).
- Night City Interactions - Core (5519) + 6 NCI addons: Edgerunners Tour meta quest with locations from each anime episode; Watson addon: partner drinks at Tom's Diner, Lizzie's, Afterlife; Westbrook: Lele Park, Dark Matter, Xiao Xiongma.
- Ghosts of Night City Pt 1 and 2 (22321, 22600): 5 small story encounters each (Pt 1 example: "Rogue's Wall" behind the Afterlife dancefloor).
- Romance: Judy/Panam/River/Kerry Romanced Enhanced, Rita Wheeler Romanced, Aurore Romanced, Flaming Crotch Man Romanced, Alex Romanced, Non-Canon Romances Enhanced, Hangout Romances, Romance Hangouts Enhanced, I Really Want To Stay At Your House x5, Go on a Date (Judy, Panam), Romance Replays (all names from INV; mechanics not read).
- Practice Makes Perfect (Coach Fred rematch), Atone (confession booth), Arcade Anywhere, Dance Off, Immersive Meditations - Unmarked Locations.
- The Passenger - Feature Settings `S\CET\#ThePassengerSettings\settings.json`: Delamain spawn on, awayDays 3, spawnRate 30 (no description read; left out).

## 7. Could not confirm / left out

- Time Dilation Overhaul (4931): no readable description; only LICENSE and config. Left out.
- NCPD Prevention Police Enhancement, More Vigilant Enemies, Cyberpsychosis Overdrive, Specialized Ripperdocs, Black Chrome, Gravitas, CCXL More Cyberware, Expanded Dual Wielding, CyberShell, Curbside, Rent a Hotel, Car Selection Menu, all new quickhacks: empty `nexusDescription` in meta.ini, no readme. Named at most, no mechanics claimed (except where ModSettings descriptions exist).
- True Flashlight exact key combination (F alone vs Ctrl+F).
- RentDay runtime period (7 vs 1 day), and the overlap with Pay Rent.
- Whether `overwrite` configs ship.
- New Game Plus - Native (15043): settings present in `UI [NGPlus.UserSettings]` (clampPlayerLevel true, random encounters true), no description. Left out.
- Damage Scaling `headhshotMultiplier = 5` and `grenadeDamageMult = 5`: exact formula not documented.

## 8. Added during drafting

- Viktor Vektor's Garage Add-on (23386) says "You MUST have" Nexus mod 20793. No enabled mod in `INV` has modid 20793, so the add-on probably does nothing. Left out of the guide; reported.
- Immersive Driving maps Left Shift to throttle 1.7 (`ImmersiveDriving.xml`), and Nitrous uses Left Shift in cars (`UI`). Mentioned as shared key.
- CyberBane feature defaults (`M\CyberBane...\r6\scripts\Cyberbane\Settings\CyberbaneSettings.reds`): mercyChoice, informants, rivalFlaws, rivalChrome, myCrew, streetTalk, talkShakedowns, bagmen, sitDowns, morningBrief all `true`; rivalsPerDay 8, maxRivals 8. These keys are not in `UI`, so defaults apply.
- Filthy Access Points docs (`M\Filthy Access Points\r6\storages\RedscriptConfigFramework\FilthyAccessPoints.docs.txt`): integrity on cyberware page, passive regen, RAM Jolt heals part, ripperdoc repairs fully. Values (overwrite only): malware chance 25/15/5 % by difficulty, -10 on fail, -5 on success, +5 per hour up to 50, RAM Jolt +15 up to 35, repair 50 eddies per %. Numbers left out (overwrite).
- Quickhack Loadouts: `QuickhackLoadoutConfig.GetNumLoadouts() = 6` (`QuickhackLoadouts.reds`).
- Lifepath mod label for `weapon_annihilation_mult`: "Shotgun, HMG, and LMG damage multiplier" (`...\lifepath_bonuses_and_gang_corp_traits\localization\en.lua` line 58).
- Endurance System: "Health degradation can be reset by sleeping" (meta.ini).
- Undermine Quest Series menu locations: V's H10 apartment, Corpo apartment, Heywood, Northside, Japantown, plus Kress Street hideout in Dogtown (disabled by default) (meta.ini 17186).
- Californication: triggers at least 24 h after Judy's final romance texts and 24 h after install; Hot Fuzz 36 h apart; can fail by leaving the area (meta.ini 7833). One More Light: 36 h after the ofrenda, starts with a text from Mama Welles, columbarium niche (meta.ini 7834).
- Site URLs: `scripts\build.mjs` line 482: collection files without permalink get `/<collection>/<path>/`, `index` dropped. So `game-guide/index.md` → `/ghost-of-the-grid/game-guide/`, using-the-list → `/ghost-of-the-grid/installation-guide/g_using-the-list/`.
- French terms kept in English when unsure: Street Cred, ripperdoc, quickhack, perk, cyberware, eddies, fixer. Official French attribute names (game texts, Nov 20, 2026): Constitution (Body), Réflexes, Capacité technique (Technical Ability), Intelligence, Sang-froid (Cool); the Relic tree stays "Relic". Earlier guess was "Corps", lifepath as "parcours (lifepath)", Street Kid as "Gosse des rues (Street Kid)": please confirm these against the French game.
