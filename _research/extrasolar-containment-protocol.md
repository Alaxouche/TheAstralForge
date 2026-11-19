# Extrasolar Containment Protocol: game guide fact sheet

Review document, not published. Every fact below has its source. Abbreviations:

- `INST` = `D:\Games\EXTRASOLAR CONTAINMENT PROTOCOL`
- `M\<mod>` = `INST\mods\<mod>`
- `PROF` = `INST\profiles\Extrasolar Containment Protocol - Ultra`
- `meta(<mod>)` = `M\<mod>\meta.ini`, field `nexusDescription` (the mod's own Nexus description, as stored by MO2)
- `strings(<plugin>)` = readable text strings extracted read-only from the plugin file (in-game help text, messages, item names)
- `GMST scan` = a read-only parser I ran over every active plugin in `PROF\plugins.txt` load order (plus the base game masters in `C:\Applications\Steam\steamapps\common\Starfield\Data`). It reads the GMST group of each plugin and lists who sets each game setting, in load order; the last one wins at the plugin level. Script: `scratchpad\tools\gmst.js`. Raw output: `scratchpad\gmst_overrides.txt`.
- `CCR` = Console Command Runner `.toml` files run on `DataLoaded` (after plugins load, so a `setgs` there beats the plugin value). Files: `M\Starfield - Tweaks Fixes and Patches\SFSE\Plugins\ConsoleCommandRunner\*.toml`, `M\True Aim\SFSE\Plugins\ConsoleCommandRunner\*.toml`, `M\Gate To Stars - Starfield Mod List\...\GTSThirdPersonFOV.toml`, `M\Reduced NPC Greetings Chatter (CCR)\...`, `M\Longer Corpse Despawn (More Dead Bodies) - CCR\...`, `M\ClickLight - Highlight Objects Clicked in Console\...`.

Profile used: `Extrasolar Containment Protocol - Ultra` (759 enabled mods, 556 plugins, `scratchpad\inv\ecp.json`).

## 0. Profiles

- Performance vs Ultra enabled-mod diff (`PROF\modlist.txt` vs `INST\profiles\Extrasolar Containment Protocol - Performance\modlist.txt`): Ultra only: Crystaline Landscapes, Skurkbro's Retexture Project (Architecture, Landscape), ZoNE79 Clothing Pack. Performance only: Ecliptic Mercenary (Replacer or Standalone), Optimax - Performance, Robotics Outfit (VBB), Starfield Backpacks, Starfield Gadgets - Watches and Headphones, Starfield Performance BOOST, Starfield Performance Textures, VBB body. No gameplay-system difference found (all visual, performance or outfit mods). Performance profile files are dated Sep 11, Ultra Nov 15: Performance may simply be older.
- `StarfieldCustom.ini` (instance root and both profiles): only `[Archive]`, display, shadows, reflections, `bEnableMessageOfTheDay=0`. No gameplay setting.
- `PROF\StarfieldPrefs.ini` `[GamePlay]`: `bShowFloatingQuestMarkers=0`, `bCrosshairEnabled=1`, `bSaveOnRest=1`, `bSaveOnWait=1`. `[Interface]`: `bDamageNumbersEnabled=0`, `bGeneralSubtitles=0`. `[Camera] bAlwaysShowLanding=1`. These are user prefs shipped in the profile (they also contain the author's resolution 2560x1409, so they are the author's own prefs).
- Site doc `installation-guide/post-installation.md` mentions a "Standard" profile: only Ultra and Performance exist in `INST\profiles`.

## 1. New game and first hours

- Alternate start: ECS Asteria 2.0 (modid 16206). meta(ECS Asteria 2.0 - Alt Start - Backrooms Expansion): on New Game you are teleported to the ECS Asteria; a terminal lets you choose a start. Start locations listed: New Atlantis, Londinion, Cydonia (UC); Akila City, Neon, Hopetown, Niira (Freestar); Charybdis III, Freya III, McClure II, Beta Marae I (independent). Va'ruun and Crimson Fleet starts "work in progress". "Project Asteria Terminal": choose from 15 ships (Starborn Guardian + Frontier default, Discovery, Endeavor, UC Dagger, UC Econohaul, UC Transpo, Freestar Mustang, Rambler, Railstar, Va'ruun Dirge, Litany, Ecliptic Falcata, Crimson Fleet Ghost, Spacer Raven, Spacer Raccoon). "You will need to pay for ship registration before modifications." "Your ship won't land where you spawn, it will appear if you fast-travel beyond walking distance." "You begin with the quest One Small Step in your quest log, the same as regular NG+. You have the Starborn trait and dialogue options." Backrooms Expansion: explore deeper into the ship. Plugin `ProjectAsteria_TwinCrows.esm` active (plugins.txt line 183).
- No intro videos: Cleanfield (88); CCR `GateToStars.toml` / `GateToStarsLoader.toml` set `SIntroSequence=0`, `uMainMenuDelayBeforeAllowSkip=0`, and near-zero fade times on doors, fast travel, loading.
- Take Your Time (10419, three plugins incl. Shattered Space and Terran Armada): meta: quests do not appear in the log until you accept them; The Old Neighborhood and All That Money Can Buy only start when you talk to Sarah and Walter; faction questline markers removed; Failure to Communicate only starts in the Eridani system.
- The Trackers Alliance Delayed Start (11533): meta: the first Trackers Alliance quest no longer starts on game start; it triggers when you land in a major city (Neon, New Atlantis, Akila) after completing 5 or more bounty missions or space bounty missions.
- Peak Performance (12420): meta: "After installing the mod, you must sleep before Needs systems will start running."
- Real Fuel (13306): strings(rbt_RealFuel_RE.esm): "Real Fuel installed. Sit in a ship's Pilot Seat to initialize systems." Offers tutorials pop-ups (Show / Don't show).
- Real O2 (12303): meta: "The mod will initialize the first time you exit your ship after installation."
- Site doc `using-the-list.md`: "Some settings are loaded automatically on new game start. Make sure to wait for all background processes to finish before making changes." Linked, not repeated.
- Royal Galaxy (8222) meta: "In early game, you will have to play more like a conventional RPG than in vanilla. You will have to lower the difficulty to normal or lower." and "You should probably run from Terrormorphs until you get a decent energy weapon or armor-piercing rounds."
- Skill ReSpec Terminal (6484): meta: terminal in The Lodge basement, "on the wall under the weapon rack immediately to your right after you come down the stairs"; buildable under Miscellaneous at outposts, ship, home. "There is currently no cost to refund your points."

## 2. Controls (only bindings found in files)

| Key | Action | Source |
| --- | --- | --- |
| F1 (gamepad: double START) | SFSE Menu Framework, Mod Control Panel | `M\SFSE Menu Framework\SFSE\Plugins\SFSEMenuFramework.ini` (`ToggleKey=F1`, `ToggleKeyGamePad=START`, `ToggleModeGamePad=DOUBLEPRESS`); meta confirms. CAVEAT: `M\Overwrite Output\SFSE\Plugins\SFSEMenuFramework.ini` (last priority) contains only `[MainWindow]`; via the VFS it replaces the shipped file, so the plugin falls back to its built-in default. The description says the default is F1, so F1 should still hold. |
| Left Alt, or double tap Sprint | Dodge, costs 40 O2 | `M\Dodge Framework SFSE\SFSE\Plugins\DodgeFrameworkSFSE_Hotkey.ini` (`iHotkey=18` VK Alt, `bDoubleTapSprint=true`, `fDoubleTapWindow=350`), `DodgeFrameworkSFSE.ini` (`sActorValue=Oxygen`, `fDodgeCost=40`, `fDodgeCooldown=0.3`, `fIframeSeconds=0.15`, `bNoDodgingMidAir=true`, `bPerkRequired=false`) |
| Shift (hold, while aiming) | Hold breath | `M\Scopes Without Overlays\SFSE\Plugins\ScopesWithoutOverlays\Settings.ini` `iKeyCodeHoldBreath=16` (VK_SHIFT); meta: default hotkey Shift, replaces the overlay hold-breath |
| Sprint key | Hold to sprint instead of toggle | Baka Hold to Sprint (8915) meta |
| Jump (boost pack) | Press and hold control | CCR `2GateToStarsLoader.toml`: `bUsePressAndHoldControls:Boostpack 1` |
| Q (Galaxy star map) | Search a planet/location, then number keys to jump to a result | `M\Starware Search Engine - SFSE\SFSE\Plugins\StarwareSearchEngine.ini` `iTextInputMenuHotkey=0x51`; meta usage steps |
| Space (in a vehicle, aiming) | Slow time (Smart Aim) | `M\Overwrite Output\SFSE\Plugins\ImmersiveDriving.ini` `iShowTimeEffectHotkey=0x20`, `bSmartAim=1`; meta: VK codes, "pressing Space" |
| Q (in a vehicle, hold) | Rear view | same ini `iRearViewHotkey=0x51`, `bRearView=1`; meta |
| Left Shift (in a vehicle) | Talk to your companion | same ini `iCompanionChatterHotkey=0xA0`, `bCompanionChatter=1` |
| (vehicle) | Exit anywhere | same ini `bExitAnywhere=1` |
| Activate prompt when sneaking behind a target | Takedown (lethal or knock-out) | Shades Stealth Takedowns (8382) meta: "usually the 'R' key by default on PC, but it will show you on-screen"; needs the new Takedowns skill |
| 1-0, [ ] | Favorites quickkeys on the default row | `M\Favorites Menu Grid - SFSE\FavoritesMenuGrid-README.md`; ini `RowCount=4`, `DefaultRow=1` |
| Delete (favorites menu open) | Clear a slot | `FavoritesMenuGrid.ini` `ClearSlotKey=DELETE` |
| Arrows / D-pad (favorites menu) | Up/down change row, left/right step slots | README |

Not bound / no default: No Vehicle Auto Handbrake `iHandbrakeHotkey=0x0` (meta: "There is no default hotkey"). No Vehicle Mouse Steering (11135): turns off mouse magnetism for steering.

Item-based controls (inventory items that count as weapons, so they can be favorited): Swiftly Order Squad communicator (wait, follow, return to ship, teleport, cycle inventories) meta(6439); Summoning of Ship remote control (take off, land within 200 m of a pad or on 60x60 m flat ground, set interior gravity 0 / 0.1 / 0.5 / 1.0 g) meta(6216); Mission Boards Anywhere "Online Mission Boards" item meta(6570); Enhanced Surrender "surrender" item, or holster on land / power down all weapons in space meta(13793); Immersive Landing Ramps remote and Ramp Control Console, B-variant landing bays only meta(8093); Mass Matters craftable "Walk Toggle" at the industrial workbench meta(16044).

Console commands documented by mods: Call Your Ship `cgf "CallYourShip.Mobile"`, `cgf "CallYourShip.Here"`, `cgf "CallYourShip.HereAndCheck"` (meta 4923; no bat files present in the mod folder, so only the cgf form). Take All to Ship enable/disable `CGF "TransferInventoryContentToShip.DisableMod"` / `EnableMod` (meta 8810). Quick Lowered Weapons first person `CGF "FirstPersonLoweredWeaponsScript.EnableLoweringInCombat"` etc. (meta 6338).

Root batch files (installed to the game root by Root Builder, run only if you type `bat <name>`; nothing in the list runs them automatically: grep of all toml/ini and the profile ini found no `bat` call): `PowerAttackCostReduction.txt` (`setgs fPowerAttackOxygenPenalty 3`, vanilla 4 per GMST scan), `SetAimStability.txt`, `SetReloadSpeed.txt` (note: this one is not inside `Root\`, it is at the mod root, so it lands in Data and may not be reachable by `bat`), `SneakSoundLosMult.txt` (0.33), `wait.txt`, `JetpackOverhaul.txt` / `JetpackVanilla.txt`, `LootOverhaul.txt`, `BetterSprintCosts.txt`, `ALOP.txt`, `BugFix.txt`. Of these, the Jetpack values, sprint O2 and Loot Overhaul lines are ALSO in CCR files (see below), so they are applied anyway.

Dash Mod (3941): `M\Dash Mod\Starfield-Dash.exe` is an AutoHotkey program that must be running; it is NOT registered as an MO2 executable (`INST\ModOrganizer.ini` executables: shader reset, Starfield.exe, xSFEdit x2, sfse_loader x2, Explorer++, Bethini, LOOT). Its `StarfieldConsole.ini` must sit in Documents\My Games\Starfield and it needs `bUseConsoleHotkeys=1`, which the profile ini does not have. Its dash key is Mouse 4 (`Dash=XButton1`) and it requires Left Alt as alternate Jump, which collides with the Dodge key. Conclusion: likely inert. Not documented in the guide as a working control.

CCR camera / aim settings: `fov103.toml` sets FOV 103 (first person, world, third person, flight camera). `GTSThirdPersonFOV.toml` third-person aim FOV 80. `AimImproved.toml` + `TrueAim.toml`: `bMagnetismEnabled:Combat 0`, no control dampening. `GTSUpdate2.toml`: `fAutoAimMaxDegrees 0`, `fAutoAimMaxDegrees3rdPerson 0`, `fAutoAimScreenPercentage 0`. `GtsControlsImproved.toml`: `bMouseAcceleration 0`. Remove Auto Aim (14096) also present.

## 3. Character

### Levelling and difficulty (GMST scan, last value wins)

| Setting | Vanilla | Final | Set by |
| --- | --- | --- | --- |
| fLeveledActorMultEasy | 0.4 | 0.9 | GRiNDTerraGameplay.esm (after RoyalGalaxy 0.65, RoyalHardModePatch 0.5) |
| fLeveledActorMultMedium | 0.7 | 1.0 | GRiNDTerraGameplay.esm |
| fLeveledActorMultHard | 1.0 | 1.1 | GRiNDTerraGameplay.esm |
| fLeveledActorMultVeryHard | 1.25 | 1.3 | RoyalHardModePatch.esm |
| fLevelScalingMult | 1 | 1.1 | GRiNDTerraGameplay.esm |
| fHealthEnduranceOffset (player HP per level) | 20 | 10 | GRiNDTerraGameplay.esm (Gameplay Tweaks and Fixes set 5) |
| fNPCHealthLevelBonus | 20 | 10 | GRiNDTerraGameplay.esm |
| fDefaultHealth | (not in Starfield.esm) | 100 | RoyalHardModePatch.esm (RoyalGalaxy had 200) |
| fXPExpMult | 0.0015 | 0.001 | Gameplay Tweaks and Fixes.esm |
| fXPModBase | 1 | 0.85 | RoyalHardModePatch.esm (effect not documented; left out of the guide) |
| fXPDeathRewardHealthThreshold | 0.25 | 0.0001 | NoXPKillSteal.esm |
| iXPRewardDiscoverMapMarker | 20 | 40 | RoyalGalaxy.esm |
| iXPRewardDiscoverSecretArea | 20 | 60 | RoyalGalaxy.esm |
| fLockpickXPReward Easy/Average/Hard/VeryHard | 5/10/15/20 | 10/20/30/40 | RoyalGalaxy.esm |
| fSpeechChallengeAutoSuccessMult | 1 | 2 | RoyalGalaxy.esm |

- GRiNDTerra Gameplay Overhaul (17670) meta labels the leveled-actor multipliers Easy / Medium / Hard / Very Hard and says they set NPC level vs player level. It also says "NPC health bonus as well as the players endurance health bonus per level has been cut in half."
- Gameplay Tweaks and Fixes (241) meta: "Increased the base XP required slightly, decreased the XP required for level up on higher levels"; "Reduced the amount of player damage needed to earn XP from defeating an enemy from 25% to 1%".
- CCR `GTSUpdate2.toml` sets all `fDiffMultHPByPC*`, `fDiffMultHPToPC*`, `fDiffMultLegendaryChance_*` to 1.0. GMST scan shows Starfield.esm already has 1.0 for all of them, so no change at the GMST level. Not used in the guide.
- Configurable Level Limit (12661) meta: Gameplay Options, cap at 50, 75, 100, 125 or 150; blocks XP at the cap; can be changed at any time. Default not documented.

### Perks and skills

- Deadly Effective (11834) meta: Ballistics -> Neutralisation (semi-auto carbines, later pistols and shotguns); Lasers -> Focus (all energy weapons); Dueling -> Evasion (CQC); Pistol Certification reworked (gunslinger, "manipulate enemy health"); Shotgun Certification reworked; Boxing (footwork, trip, dodge blows). Tier 2: Rifle Certification -> Suppression; Particle Beams -> Efficiency; Incapacitation differentiates organic/inorganic and can KO; Isolation gives stealth bonuses and Fear. Tier 3: Rapid Reloading -> Weapon Handling. "Hardcore Mode: A single perk is added to the player to lower stats like reload speed, weapon handling, or fall damage reduction by default... can be disabled at will under Gameplay Options." Some skill challenges changed.
- Perk Up (10107) meta: Fitness +30/+60/+100/+100 % (vanilla 10/20/30/30); Weight Lifting +50/+100/+150/+200 kg (vanilla 10/25/50/100); Payloads +30/+60/+90/+120 % (vanilla 10/20/30/50). Rested XP options x10 / x20 exist as versions; installed file `Perk Up - Quality of Life Skills Improved-10107-1-1-...7z`, plugin `PerkUp_QoLskills.esm`: which rested variant is in it is not documented. Left out.
- Shades Stealth Takedowns (8382) meta: new Takedowns skill (Physical tree). Rank 1 unlock takedowns; 2 refill O2 on success; 3 also heal 10 %; 4 also 10 s stealth field. Must be sneaking, undetected, out of combat.
- StarGym (12530) meta: Weight Lifting rank challenges now need gym stations (5 / 10 / 25 uses); mats and stations give a 2 h bonus after 1 minute; craftable in Misc (Fitness perk for mats, Heavy Lifting for stations).
- Immersive Digipick and Immersive Speech are the installed variants (plugins `Immersive Digipick.esm`, `Immersive Speech.esm` in `M\Easy Digipick (Lockpick)`, `M\Easy Speech`). meta(450): persuasion chances 60/45/30 % -> 70/40/25 % (Easy/Medium/Hard). meta(451): "rebalances lockpicking... Master locks remain challenging, lower-level locks significantly easier".
- Auto Unlock SFSE (5571) `M\Auto Unlock SFSE\SFSE\Plugins\po3_AutoUnlock.ini`: `iAutoUnlockMode = 0` for Door, Container, Terminal = auto-unlock when Security rank >= lock level; `iUnlockInaccessibleLevel = -1` (disabled).
- More Traits (8012) meta: 25 new traits, limit 1 per category (medical m, ship s, behavioral b, physical p). Examples with numbers: All or Nothing (+100 % damage dealt and taken), Deep Breather (+50 O2, -25 % airborne resist), Strongback (+75 carry weight, +100 % fall damage), Smart Guy (+100 % XP, none from combat), Blood Thirsty (+50 % combat XP, no quest XP), Space Hauler (+10 % cargo, -10 % ship damage), Silver-Tongued (-10 % buy, +15 % sell, -10 % weapon damage), Cybernetic Implants (-50 % O2 for activity, +100 % EM damage taken), Thick Skin (+50 % thermal, -25 % radiation and corrosive), Raised Old Faith (-10 % damage taken, triple bounties).
- Better Backgrounds (7955) meta: 20 new backgrounds, each background gets a unique bonus (e.g. Beast Hunter +15 % damage vs alien creatures, Bouncer +25 % unarmed damage).
- Starborn trait from the Asteria start (see 1).
- Affinity Reworked (6891) meta: repeatable actions change companion affinity (scanning, mining, crafting, stealing, drugs, lockpicking, hacking, firing in public...).

## 4. Combat

- Auto-aim and magnetism off (CCR, see 2). Remove Auto Aim (14096). No Forced Vehicle Aim Assist (13261).
- Balanced Ballistics (8541) meta: Grendel 10 base damage (was 3), Maelstrom 8 (4), Kraken 7 (3); semi/full/burst/binary damage brought within 60-150 % of semi-auto; automatic weapons: more hip-fire recoil, wider cone, more per-shot recoil; lasers: recoil "functionally eliminated", Equinox full-auto 65 % of semi (was 24 %), Solstice 55 % (30 %); shotguns more recoil; slug rounds increase recoil.
- Royal Weapon Balance (7856) meta: full-auto and burst buffed, affects NPCs too. Load order: RoyalWeaponBalance.esm line 37, BalancedBallistics_RE.esm line 214 (later), so Balanced Ballistics wins where both edit the same weapon record (not verified record by record).
- Locational damage: three mods. GRiNDTerra (17670) meta: humans 4x headshot, 1.5x torso; robots no bonus; creatures 2x head, 1.5x torso; Terrormorphs 1.25x head, 0.75x torso. Locational Damage Overhaul (5626) meta: human head x2.25, creature head x1.5, limbs x0.75, boost pack x0.5, claws x0.5. Better Locational Damage (13286) meta: unhelmeted humans die to one headshot; helmeted ones need head health broken ("Head Destruction"); distributed by StarPatcher `M\Better Locational Damage\SFSE\Plugins\StarPatcher\npc\Better Locational Damage\Better Locational Damage.ini` (spell added to keyword `Starfield.esm|25E194`); plus patch `M\Starfield - Melius - Wabbajack Mod List\Better Locational Damge_Human Damage_Patch.esm`. Which multiplier wins is not resolved (body-part data, not GMST). Guide says headshots are much deadlier, without a single number.
- Better Blocking (4734) meta: blocking reduces melee damage 90 % (vanilla 50 %); costs O2 = 15 % of damage + 5; blocking with full CO2 damages health. GMST scan confirms `fOxygenBlockBase` 5, `fOxygenBlockDmgMult` 0.15 (Better Blocking.esm).
- `fPowerAttackDefaultBonus` 1 -> 3.5 (RoyalGalaxy.esm). Power attack O2 penalty stays vanilla 4 (batch file not run).
- `fWeaponBashMax` 0.25 -> 0.6 (GRiNDTerraGameplay.esm).
- No Stagger Animation (4494): removes 1st-person stagger from melee hits and explosions.
- Dodge: see controls.
- Stealth (GMST scan): fDetectionViewCone 190 -> 170 (GRiNDTerra; Stealth Overhaul had 165); fSneakRunningMult 1.25 -> 1.5 (GRiNDTerra); fSneakEquippedWeightMult 0 -> 0.25 (Stealth Overhaul: gear weight adds noise); fSneakLightMult 1 -> 0.6 (RoyalGalaxy); fSneakLightExteriorMult 1 -> 1.1 (GRiNDTerra); fSneakSoundLosMult 0.4 -> 0.35 (GRiNDTerra); fSneakSleepBonus ends at 0 (GRiNDTerra overrides Stealth Overhaul -0.2, so the "sleeping NPCs detect less" change from Stealth Overhaul is reverted); fDetectionMaxDistance 70; fSneakMaxDistance 60 -> 90 (RoyalGalaxy). Chameleon Improved (5907): ADS while invisible.
- AI: Improved Combat AI (1392), Red Dog's AI upgrades (Crimson Fleet, Ecliptic, Starborn, Spacer, Va'ruun Zealot), GRiNDTerra NPC AI (cover, flanking, fall back, more grenades with cooldown, longer memory), Royal Leveled Enemies - Shattered Space. iNumberActorsInCombatPlayer 125 (GRiNDTerra; meta "125 NPCs can be active in combat at the same time").
- Better Explosives (9650) meta: grenade and mine damage greatly increased; impact grenades less than timed; world explosive objects increased. GRiNDTerra: bigger explosion radius, shorter mine delay, turrets must reload.
- Suit Up (12102) meta: spacesuit categories (Recon, Assault, Exploration, Utility, Support, Piloting, Otherworldly...), heavier = damage reduction and clunkier, lighter = nimbler with better O2; summary in Status Effects menu; optional speed system; deflection chance.
- Specters, Vortex Phantoms, Mech Enemies, bosses: see content.
- Corpses: CCR `longerCorpseDespawn.toml` `iHoursToClearCorpses 48`.
- Combat music: No Combat Music (382) + GMST radii 0 (NoCombatMusic.esm, GRiNDTerraGameplay.esm) + GRiNDTerra "Combat Music Remover".
- Crime (GMST scan, rbt_SpacefaringEconomy_Values.esm unless noted): murder 15000 -> 27500; piracy 1500 -> 8000; pickpocket 500 -> 3000; attack 650 -> 1200; escape 1500 -> 2500; trespass 350 -> 700 (RoyalGalaxy); smuggling mult 0.0045 -> 0.02. GRiNDTerra meta: NPCs remember crime up to 5 days. Gameplay Tweaks meta: 3 -> 7 days (GRiNDTerra loads later; exact winner for that record not checked).
- Leave No Witnesses (12000) meta: ship crimes cleared if every witness ship is destroyed or its crew killed before you leave the area; no 30 s limit.
- Enhanced Surrender (13793): see controls. Only to guards.
- LOC - Life of Crime (16102) meta: build a Lawbreaker Operations Console (Misc tab, ship or settlement); faction NPCs carry single-use keys (pickpocket or kill) to wipe your bounty with CF, Freestar, UC, Va'ruun; toggle Crimson Fleet membership; smuggling missions.
- All Prisoners Go To Prison (13922), Useful Brigs (8139): knocked-out or pacified NPCs can be sent to your brig, one per bed, gear moved to cargo.

## 5. Survival

- Three oxygen systems are active at once: Deadly Hazards oxygen (`DH_Oxygen.esm`, plugins.txt line 83), Real O2 (`rbt_RealO2.esm`, 334), Atmo (`rbt_oxygen.esm`, 464). Atmo meta: "It is however redundant with O2 Reserve systems like Real O2 or Realistic Oxygen Meter." FLAGGED.
  - Real O2 (12303) meta: pack holds set O2 (Survival / Balanced / Standard / Exploration pack categories); constant drain in unbreathable areas, extra drain sprinting, bad weather, combat adrenaline; boost uses O2 in zero-atmosphere (toggle); punctures in Simulation mode; CO2 buildup; asphyxiation; refills when you enter breathable air; vehicles slowly regenerate O2; fast travel blocked while on reserves in Simulation mode; items Heliox (pharma bench), Emergency Reserves (industrial bench), Experimental Scrubbers, Hypercure Sealant. Modes: Simulation / Streamlined / Disabled in Gameplay Options.
  - Atmo (17543) meta: runs when spacesuit and helmet are equipped and shown (default) or only in non-breathable atmosphere; as O2 depletes, O2 recovery drops up to 60 %; under 10 % O2: sprint speed -20 %, jump height -60 %; boost pack drains O2; Rebreather Overload warning; CO2 recovery -60 %; hits, running, sprinting, sneaking add CO2; sliding and mantling add CO2 instantly; Heliox chem.
  - Deadly Hazards (5800) meta: "Immersive oxygen system that can cause you actually to run out of oxygen and suffocate", configured with an in-game item, presets.
- CCR `GTSUpdate1.toml` and `Better Sprint Costs`: `fSprintOxygenEndBase 0.7875` (vanilla 1.05, plugin winner RoyalHardModePatch 1.05): sprinting costs 25 % less O2. CCR `GTSUpdate2.toml`: `fOxygenToCarbonDioxideMult 3.75` (vanilla 2): interpretation "O2 use turns into more CO2" is mine, not documented.
- Environment: Deadly Hazards (5800) + Deadly Hazards - All Settings added (11121) + Extremophile (15601) + No Lung Damage While Wearing Space Suit (6073). Extremophile meta: "Deadly Hazards or other comprehensive Hazard overhauls are generally incompatible." FLAGGED.
  - Extremophile meta: no passive regeneration of suit protection and enviro damage; Decontamination Station (ship or outpost) restores protection; injectors enable natural healing of enviro damage while resting or waiting; Boosted Injectors heal about 30 %; Rejuvenation rank 3 allows passive healing; a doctor cures it all; threshold damage starts once 25 % of suit protection is gone; 75 in the matching resistance nullifies it (e.g. 75 thermal for Deep Freeze); Threshold Resist from the sum of resistances, 15 to 85 %, 50 in each = 200/400 = 50 %; max suit protection 150 (was 100), 250 with Environmental Conditioning 2; removing helmet where you shouldn't "you will probably die". Single Gameplay Option ([LIGHTWEIGHT] disables threshold damage and regen limits).
  - Deadly Hazards meta: temperatures matter with and without a suit; magnetosphere sets solar radiation severity; atmospheric pressure; shelter from solar radiation under roofs and in caves; settings via in-game menu/item; optional fast-travel block when exposed.
  - No Lung Damage (6073): no Lung Damage from Poor Air Quality and Toxic Gas while in a spacesuit; corrosive gas still applies.
  - Show Spacesuit When Taking Environmental Damage (4306), and Spacesuit Hider ini `M\Overwrite Output\SFSE\Plugins\SpacesuitHider.ini` (`iInSafeTemperature=1`, `iIsCurrentAtmosphereBreatheable=1`; mod name for this ini not identified in the enabled list, so left out).
- Needs: Peak Performance (12420) meta: hunger stage every 8 h UT (controls health restoration), thirst ~5 h (controls O2 recovery speed), exhaustion ~14 h (controls XP gain); sleep 8 h in a safe place to be Refreshed; intoxication; hygiene (persuasion and stealth; showers via ship Decorate menu, Sani-wipes); optional auto-consumption; Tension state in dangerous places pauses needs then charges them plus a penalty; alien food incompatibility; must sleep once to start. Configurable rates.
- Food: Gluttony (14202) meta: food and drink no longer restore health; food gives +5/10/15/20 % health for 30 minutes (does not stack); alcohol +5/10/15/20 % persuasion for 15 minutes; Heart+ 1 % healing for 30 s; produce and butter no benefit. Better Food and Chems (2687) meta: food healing x5, durations x2. Load order: Better Food and Chems.esm line 68, Gluttony.esm 225, Gluttony - Shattered Space.esm 228: Gluttony loads later, so its food records win where they overlap (not checked record by record). FLAGGED (contradictory intent).
- Crew Eats Food (12100): crew consume food; premium food gives small XP bonus.
- Healing: Functional Ship Infirmaries (6386) meta: heal and cure afflictions in your ship's infirmary surgical chair if a crew member with the Medical perk is assigned (vanilla one: Rosie Tannehill, Hitching Post, Akila City). Dynamic Medical Bill 2.0 (13861): doctor heal cost modifier (details not extracted).
- Carry weight and movement: Gravity Affects Weight (3048) `M\Gravity Affects Weight (SFSE)\SFSE\Plugins\po3_GravityAffectsCarryWeight.ini` `bAdjustItemWeights = true`, `fGravityBase = 1.0`: item weights scale with gravity. Mass Matters (16044) meta: speed depends on carried mass and gravity (1 G and 50 % mass = 100 % speed); burden changes O2 use, reload speed, zero-G drift, ship handling from cargo fill; overencumbered = 50 % speed. CCR `GTSUpdate2.toml` `player.setav speedmult 90` (after 78). Starfield Revised - Player Speed (10184) meta: running ~87 % of vanilla, walking +30 %, ADS at walk speed, sneak run +20 %, run while blocking.
- Boost pack: CCR `GTSBoostPack.toml` same as Jetpack Overhaul values (drain and thrust actor values; the Jetpack Overhaul txt explains the AV names are swapped). Not turned into player numbers in the guide.
- Timescale: Configurable Timescale (12601) strings(ConfigurableTimescale.esm): Gameplay Options "Timescale (Space)" default 5, "Timescale (Ground)" default 15; takes effect after a load door, fast travel or grav jump.
- Wait/sleep: Immersive Wait and Sleep Menu `interface\sleepwaitmenu.ini` `HoursMaximum = 96`. `iSecondsToSleepPerUpdate` 1800 -> 4000 (Gameplay Tweaks and Fixes.esm).

## 6. Space, travel, vehicles, economy

### Travel

- Real Fuel (13306) strings(rbt_RealFuel_RE.esm): grav drive uses Helium-3 from tanks; jump range shrinks as fuel drops; empty = stuck in system; refuel via [REFUEL] on the Cargo panel (He-3 or Ship Fuel items in the hold), Ship Services technicians in settlements (market price), docked starstations, outpost harvesters/containers with He-3 ([REFUEL]); SmartFuel buys automatically in settlements; Simulation mode: interplanetary and grav jump travel only from the pilot seat or in space (or the Navigation Console); Streamlined mode: also from ship interior or settlements; fast travel to city/ground locations unavailable from some parts of the star map ("from outside of Settled Systems"); rapid sequential jumps trigger a grav drive Cooldown; jumping on low fuel can Overheat and damage the ship (repair from the pilot seat); Emergency Jump option "severely damages your ship"; siphon fuel from docked vessels with malware items (Siphon Protocol, illegal for non-combatants); loose fuel in the hold can detonate; items: Ship Fuel (Refined, Compressed), Empty Fuel Canister, Ship Fueling Station, Ship Fuel Dispenser; Real Fuel entry in the Help menu.
- Configurable Limited Fast Travel (13290) meta: Gameplay Options Normal / Inside Ship / In Space / In Pilot Seat. Default not documented.
- Real O2 Simulation mode blocks fast travel while drawing on reserves (meta).
- Astrogate (9363) meta: immersive grav jumps started from the pilot seat (otherwise you fast travel); duration set in Gameplay Options "Grav Jump Duration"; skip by sleeping/waiting unless set to FAST; arrival near planet, system edge or star; cancel by removing engine power or "Cancel" in starmap travel data. Compatible with Real Fuel and True Seamless Grav Jumps.
- True Seamless Grav Jumps (17159) `M\Overwrite Output\SFSE\Plugins\SGJ_Config.ini` `DisableJumpCam = true`, `GravLanesSupport = false`. Seamless Grav Jump (9666), Seamless Wormhole Grav Jump, Grav Jump Reanimated also enabled (visual).
- All Cockpits Have Nav Consoles (7960): navigation console in every cockpit.
- GRiNDTerra Planetary POI Generation (13035) meta: 1 to 10 POIs per map, 1 dungeon per planet, fewer ship landings, more civilized outposts on settled worlds.
- Bigger Systems, See Distances in Light Years, See day length when landing (UI).

### Ships

- Ship builder limit removers (SFSE DLLs, logs in Overwrite Output): No Reactor Limit, No Shield Limit, No Weapon Power or Count Limits, No Engine Power Limits (separator 04.2), No Grav Drive Weight Limit ("You still have to keep jump range above 0LY"), No Landing Bay or Docker Limits, No Cockpit Limit, No Reactor Class Requirement, No Minimum Landing Gear, No Build Below Bay..., No Unattached Module Error.
- CCR `GTSBuilderTweaks.toml`: builder floor range -50 to 50, faster pan/rotate, snap distances.
- Cargo Reconsidered (15103): more cockpit cargo, cargo halls more capacity and mass.
- Sit To Add Ship to Fleet (6493): sit in the pilot seat of a captured ship, yes/no box adds it to the fleet without making it home ship.
- Seizure Of Ships (5212): take over restricted ships (warning box first; save before).
- Ship Crew Assignments (12744): Assignment Mode in Gameplay Options; assign crew to furniture and 80+ buildable markers; work schedules; music player.
- Call Your Ship (4923) / Summoning of Ship (6216): see controls.
- Immersive Landing Ramps (8093): B-variant landing bays with manual ramps.
- Landing Bay Cargo Access (11972), Integrated Ship Optimization Terminal (16412), Useful Brigs (8139), Functional Ship Infirmaries.
- Space combat: Improved Enemy Ship AI (11404) meta: UC Vigilance now aggressive; veteran ships turn while boosting. Enemies Boarding My Ship (13999) meta: enemies dock and board you in combat, chance by faction (Crimson Fleet most likely; Va'ruun and Spacers would rather destroy you). Better Boarding Encounters strings: docking to hostile ships has a chance of a hazard inside and/or the crew boarding your ship; hazard raises boarding chance; Gameplay Option (disabled / default / 100 %). Hazardous ship boarding (4702) meta: about 25 % chance of a danger aboard (reactor leak, no gravity, boarding party). Deadly Ramming (12940) + GMST: fShipCollDamageMax 100 -> 1000, fShipCollDamageMin 100, fShipCollDamagePlayerClamp 0.2 -> 1, fSpaceshipBodyCollisionMaxDamage 1000 (GRiNDTerra wins). fShipSystemDamageChanceMultUntargetedEngine 3 -> 24 (RoyalGalaxy; Royal meta: "Large chance to disable enemy engines and to be able to board encounters"). Royal Galaxy meta: doubled enemies in space combat, more space encounters. Orbital Defense - Capital Ships (17343): faction capital ships and stations roam systems. Antares Armiger (17678): drone-launching weapons hab purchasable from level 45. GRiNDTerra: faster ships, stronger shields, deadlier collisions. CCR: `fSpaceshipMaxDockingDistance 200` (vanilla 500).
- New ships for sale: UC Pegasus (Deimos Staryard, Sol, needs Ship Vendor Framework), UC Misthios, Myrmidon, Sabre, Warglaive (descriptions only read for Pegasus).
- Transfer Spaceships Across Universes - SFSE (13449) ini: export/import ships with inventory and workshop items through NG+; `bNoPilotingSkillRequirement=0`.

### Vehicles

- Roverhaul (14008) strings(rbt_Roverhaul.esm): vehicles use charge ("Vehicles use <mag> charge per second while in use") or fuel; power cells (Depleted, Emergency, High-Efficiency), Combustible Fuel, Vehicle Charger, vehicle garages (Nova Galactic Garage 2x1/3x1, HopeTech Garage 2x1, StorMax 15 Vehicle Stowage); Vehicle Management: deploy when planetside / keep in ship / convert to fueled or electric; garages refill charge.
- All Vehicles Have Storage (13993): 150 trunk, +10/20/30/50 % with Payloads, shared between vehicles, no contraband.
- Immersive Driving (11253): see controls; visible body, panorama.
- No Vehicle Weapon Aim Oxygen Penalty (11136), No Forced Vehicle Aim Assist (13261), No Vehicle Mouse Steering (11135, `bAllowVehicleAirborne=0`), No Vehicle Auto Handbrake (12684).
- Parked Vehicles (13838): static decoration only.

### Money

- Sell price: `fVendorSellPriceMult` 0.125 -> 0.1 (GRiNDTerraGameplay.esm, last; RoyalGalaxy 0.0625, Gameplay Tweaks 0.1).
- Vendor restock: `iDaysToRespawnVendor` 2 -> 5 (GRiNDTerraGameplay.esm, last). Richer Vendors (5624) claims 1-day restock: overridden. Richer Vendors' 10x merchant credits (meta) not verified at record level.
- Ship registration: `fSpaceshipRegisterValueMult` 0.841 -> 0.65 (rbt_SpacefaringEconomy_Values.esm).
- Spacefaring Economy (12022) meta: ships, parts and rare resources worth far more; common resources and junk worth less; Exotic resources very valuable; Class B/C parts and large habs much more expensive; Taiyo and Stroud-Eklund premium, Hopetech/Nova budget, Deimos mid; quest rewards much higher and scale later; bounties significantly increased; you can lose money choosing the easy option in quests; cargo missions scale strongly with weight; piracy and smuggling missions very rewarding; crimes heavier.
- GRiNDTerra Economy (17670) meta: credits no longer tied to level, max pool lower than vanilla; resources removed from most loot (replaced by primer or random object chance); less ammo, medkits, digipicks from loot; vendors less resources; quest reward table Large 6000, Medium 4000, Small 2500, Smallest 1000, Minor Extortion 2000; Challenge background 33 % worse sell prices, 25 % less XP.
- Loot Overhaul (5181) credit lines are applied by CCR `GTSUpdate1.toml` (identical `revertleveledlist`/`addformtoleveledlist` lines, plus `set 280211 to 30`, `set 280212 to 30` = LL_ChanceNone_Medkit and ChemKit 30 per LootOverhaul.txt comments). meta: credits from loot about +50 % on average, less tied to level. The ammo/meds reductions belong to its plugin version; no plugin is installed (folder has only Root\LootOverhaul.txt).
- Vendor Overhaul (5179) meta: vendors stock ~100 % more repair kits, grenades, mines, meds; 100-300 % more ammo.
- Harbor (17667) meta: port dues = administrative fee + visitor's levy at major spaceports, taken automatically when landing or exiting the ship; UC citizens -600 on levies in UC settlements, Freestar Rangers -240, Neon Voucher -1800 in Neon (from Back to the Grind, or bought from Kolman Lang); mooring fee 50 % of dues once per local day; ship upkeep scales with total mass, drive thrust, reactor power; vessel condition drops with travel and combat; paying upkeep restores it; all Harbor costs halved in the Frontier; unpaid dues: bounty if you leave the planet; penalty 150 % + 1000 (dues), 120 % + 250 (mooring); Spacefarer Mode doubles costs.
- Cost Of Spacing (11726) strings: registration fees on arrival ("Unrecognized ship assessed as type: Pleasure Craft. Registration fees totaled ..."), maintenance/refit costs, Constellation covers costs for the Frontier ("All expenses covered by CONSTELLATION"), Crimson Fleet tribute, Freestar space cheaper than UC, Neon expensive, Akila cheap; staryard delivery contracts at twice the trade rate. Harbor meta: "Harbor is a gameplay-centric re-imagining of Cost of Spacing." Both active. FLAGGED (possible double fees).
- Cost Of Living (12136) strings: one-time outpost registration fee when you build in settled space (unless the beacon is shielded), residence taxes on homes, late fees.
- Gallion (17626) meta: GalBank ATMs work; buildable GalBank Terminal (outpost) and Mobile device (ship/home), Miscellaneous category; loans 25,000 to 1,000,000 in six tiers, auto-collected per cycle; savings 0.40 %/cycle (Basic) to 0.75 % (Premier); 33 businesses in New Atlantis, Akila City, Neon, Orbital; risk Stable / Balanced / Turbulent / Venture; term 12 days, paid every 3 days; early withdrawal returns 85 %; receivership: pay 40 % of stake or 50 % collapse risk; insolvency recovers ~40 %; standing Basic -> Preferred -> Priority -> Premier; default sends Ecliptic hunters ("Cities are safe; the open world is not").
- Variable Contraband Prices - Redux (12205): contraband 3x more valuable in scanned locations (New Atlantis, Akila City, Neon except Aurora, Cydonia, Hopetown, Gagarin Landing, New Homestead), cheap elsewhere. Also original Variable Contraband Prices enabled (both plugins active: `Variable Contraband Prices.esm`, `ws_VariableContrabandPrices.esm`). FLAGGED (duplicate).
- Hackable Vending Machines (14416): no description; strings list abandoned locations only. Left out.
- Faction Requisition Kiosks (9012): kiosks in faction HQs, sell faction gear, no credits to sell to; Constellation one in the Lodge basement after One Small Step.
- Dynamic Repair Bill 2.0 + Dynamic Ship Repair Bill - Modified (Expensive) share the same plugin name `Samantha Says - Dynamic Repair Bill.esm` in two folders: only the higher-priority one is used. Not described.
- Crafting: Stellar Crafting (16665) meta: quality upgrades cost resources instead of credits, tiered materials. GRiNDTerra (17670) meta "Immersive Simplified Crafting": all resources convert to GEO, BIO, MFG01, MFG02, MFG03 or Unique categories for crafting and research; new industrial workbench conversion recipes; "cheater resources" for mod recipes. Load order Stellar Crafting 423, GRiNDTerraGameplay 455. Interaction not verified. FLAGGED.
- Looting: Shades Immersive Looting (8383) Strip / Loot All (to ship, party or player per Gameplay Options) / Loot-Transfer on unconscious NPCs; Simple Immersive Looting (12677) Strip / Transfer (overlap); Take All to Ship (8810) "Take All to Ship" on any container or body, `bTransferToPlayer=0` (to ship); Baka NPCs Always Drop Their Equipped Armor (723).
- Mission boards: Dark Universe - Overtime (13175): 300+ repeatable missions of 65+ types. Mission Boards Anywhere item.

## 7. Content

- Quests: New Landmark Quests (5824): Pisa, NASA, Face on Mars; 5 books at Sinclair's bookstore, Akila City, each starts a landmark quest. Lazarus Awakened (12505): start by entering the SSNN building, New Atlantis commercial district (spoils UC Vanguard). Regrets (12506): land in Akila, cross the bridge from the landing pad, objective to visit the Marshals office. Justice For Proxima (15798): adds Proxima Centauri system (d, b, c, c-I). More Lore: Kreet Research Lab, Legacy of the Mantis (install before retrieving the Secret Outpost slate), Nova Galactic Staryard. Andreja and Sarah Morgan Dialogue Enhanced. Books of Starfield.
- Bounties: Dark Universe - Outlaws 01 (15316): 100 bounty chains, leads from dataslates (Trade Authority rumours) and the Outlaw Terminal in The Broken Spear, Cydonia; unique legendary helmets, packs, suits. Dark Universe - Retrograde (16025): 100 repeatable bounty missions in generated space stations. Dark Universe - Takeover (11045): 50 Spacer military bases. Dark Universe - Crossfire (8994): more space POIs (piracy boarding, faction skirmishes, strongholds).
- Encounters/enemies: Red Mile Terror (11536): Red Mile run with Terrormorphs, bosses, progressive rewards. Specters of Starfield (7503): decorative corpses in abandoned facilities rise as Specters; EM knocks them down briefly. Vortex Phantom Invasion (11929): phantoms in mines, labs, bases; 10 human hostile types across scenes. Grylloba Matriarch boss: Burial Temple, Masada system; 35 % less energy and ballistic damage, immune to EM, rock for 500 damage. Hephaestus Hound boss (placed "into Egypt", Earth), drops Hephaestus Shards for a Hard Target barrel. Mech Enemies: Deserted Ecliptic Garrison, Mars Mech Factory, Freestar Mech Factory, Forgotten Mech Graveyard. The Revenant (alpha, derelict ships). PoI Faction Diversity + New Hostile Factions, POIs Hostiles Diversity. Bedlam - Dungeon Randomizer (10717): moves up to 20 hostiles around on each location change, plus other randomizers.
- Locations: Colony One (13863): UC space colony in Jemison orbit, vendors, ship and health services, mission boards, crew, purchasable home ("currently undergoing renovation"). Pytheas System (15571): new star system, 8 orbits, "high level destination". Your Personal Spacestation (9951): Tau Ceti system, orbit of Tau Ceti III. Additional POIs - Mars (16869): 5 fixed POIs, need a planet scan. Permanent POIs (+ Darkness Beckons, Evil Beyond, Rogue Science, Untouched Horizons): fixed POIs marked "Structure". The Den - Last Stop (17173), Red Mile Expanded, Echoes of Neon, The Dark Side of Neon (9 Aurora stashes, 5 guarded stashes, Ebbside crowds depend on your Strikers choice), Battleground Niira (no description), Hopetown / Gagarin / New Homestead "New Dawn" and Eternal, The Lodge Awakened, Paradiso Evolved, Winds of Akila/Cydonia/Gagarin, Heart of Cydonia, Project Rework - Akila, Pluto, many biome mods (visual).
- Homes: Mantis Lair Player Home (13783) after the Mantis quest (vendor, ship services, infinite linked storage, decorations). Akila - The Core Expanded and Furnished, Neon Sky Suite Expanded, Neon Sleepcrate Furnished, Mercury Penthouse Furnished, The Well Apartment Furnished, The Well Apartment 79, Dave's Astral Lounge Enhanced, Colony One home, Your Personal Spacestation.
- Outposts: Frontier Cantinas (16814): staffed cantina habs, passive income, management/stocking/upgrades. Mercenaries and Mayhem (16770): raid spawners, fortifications, NPC markers, landscaping. Wicked Workshop packs (6). GRiNDTerra Raids: new outpost raid variants without cooldown. Hjalmere's Aquariums. Cost Of Living taxes.
- Companions: Upgraded Companions (12030) bundles companion fixes (auto gifts, Barrett pays bills, companions board the Scorpius, etc.). Cydonia Tracker Agent Companion (14944): "Recruit your own tracker agent as a follower" (no location given). Swiftly Order Squad (6439): unlimited followers (1 romanceable Constellation companion), communicator. Improved Follower Behavior, Keep Generic Crew Members Around, Various Crew (AddCrew txt files are console batch files, not used).

## 8. Could not confirm / left out

- Default values of Gameplay Options of every mod (Real O2 mode, Real Fuel mode, level cap, fast travel limit, Astrogate duration, Deadly Hazards preset, Ship Crew Assignments, Better Boarding Encounters, etc.): stored in the save, not in files. Guide says "check Gameplay Options".
- Which locational-damage numbers win.
- Exact Royal Galaxy changes beyond its description (47 kB, read partially).
- Actor value `002a84f7` set to 200 by CCR `GTSUpdate2.toml`: not identified.
- `fXPModBase 0.85` effect.
- Whether Gallion, Harbor and Cost of Spacing are all meant to charge at once.
- Where to find Cydonia Tracker Agent Companion.
- Hackable Vending Machines, Spaceships use private channels, Battleground Niira: no descriptions.
- Whether the Dash Mod works (evidence says no).

## 9. Broken or contradictory things noticed

1. Three O2 systems active together: Deadly Hazards oxygen (`DH_Oxygen.esm`), Real O2, Atmo (Atmo calls itself redundant with Real O2).
2. Deadly Hazards and Extremophile both active; Extremophile says they are generally incompatible.
3. Gluttony (food no longer heals) and Better Food and Chems (food heals x5) both active.
4. Harbor and Cost Of Spacing both active (Harbor is the re-imagining of Cost of Spacing).
5. Variable Contraband Prices and its Redux both active.
6. Shades Immersive Looting and Simple Immersive Looting both add Strip.
7. Richer Vendors' 1-day restock is overridden to 5 days by GRiNDTerra; Stealth Overhaul's sleeping-NPC bonus is reverted by GRiNDTerra.
8. Dash Mod needs an external exe and console-hotkey ini that are not set up; its Left Alt requirement collides with the Dodge key.
9. Several Root batch files (Power Attack Cost Reduction, Firearm Tweaks, Better out of LOS Sneaking, Faster Waiting) only work if typed in the console; nothing runs them. `SetReloadSpeed.txt` is outside `Root\`.
10. `M\Overwrite Output\SFSE\Plugins\SFSEMenuFramework.ini` (only window size) replaces the shipped ini through the VFS.
11. Site docs: `post-installation.md` lists a "Standard" profile that does not exist; it also tells users to create `StarfieldCustom.ini` in Documents although MO2 uses the profile-local ini. `index.md` stats still say "TBD" and Version 1.0.0 while the changelog is at v2.4.0.0. `known-issues.md` lists no issue.
12. Changelog v2.4.0.0 says "Removed HideHUD" etc. and "Updated Starvival - Immersive Survival Addon", but Starvival is disabled in the Ultra profile (`-Starvival - Immersive Survival Addon` in modlist.txt).
13. Two mods ship the same plugin `Samantha Says - Dynamic Repair Bill.esm` (Dynamic Repair Bill 2.0 and the "Modified (Expensive)" version).
14. SFSE Performance Overlay is enabled by default (`Enabled=1`, FPS, frame time, CPU, GPU, VRAM); players may want to turn it off in F1 > Utilities.

## 10. Extra sources for statements in the pages

- "Skips the Vectera mine": meta(ECS Asteria) "Upon starting a New Game, you will be immediately teleported to the ECS Asteria" and "the game begins quickly in an open state without intro or tutorial". Inference that the vanilla mine intro is skipped.
- "Constellation exploration missions pay well even at level 1": meta(Royal Galaxy) "Exploring for Constellation gets you about 8k credits even at level 1". Spacefaring Economy / GRiNDTerra may change the actual amount; kept as an author tip, no number given in the page.
- "Ship Ramp Remote": meta(Immersive Landing Ramps) is cut at "equip your Ship Ramp Rem"; full item name not confirmed.
- Hephaestus Hound location: meta(8345) "I placed it into Egypt". Exact site on Earth not given.
- Red Mile location: page says only "The Red Mile" (planet name not taken from files).
- "Scopes show x4, x6, x8": meta(15828) "Short: x4, Medium: x6, Long: x8".
- Accurate Aiming spread multipliers are set in Gameplay Options: meta(5558).
- Atmo's "CO2 recovery -60 %" applies whenever Atmo is running (meta lists it under CO2 Management without condition).
- "Med kit / chem kit drop 30 % chance to be empty": CCR `GTSUpdate1.toml` `set 280211 to 30`, `set 280212 to 30`; `M\Loot Overhaul\Root\LootOverhaul.txt` comments name these globals `LL_ChanceNone_Medkit` and `LL_ChanceNone_ChemKit` (vanilla 0 per the same comment).
- Wait up to 96 hours: `M\Immersive Wait and Sleep Menu - Enhanced and Fully Configurable\interface\sleepwaitmenu.ini` `HoursMaximum = 96`.
- Favorites grid 4 rows: `FavoritesMenuGrid.ini` `RowCount=4` (the mod supports up to 8).
- Vehicle trunk: meta(13993).
- "Collisions for you and NPC ships": meta(12940) "increases the damage done to all ships (both player and NPC)".
- French terms: "Colonies Unies" and "Collectif Freestar" used for United Colonies / Freestar Collective; other names (New Atlantis, Akila City, Neon, Terrormorphs, UC Vanguard, Gameplay Options, skill names) kept in English because I am not sure of the official French localisation.
