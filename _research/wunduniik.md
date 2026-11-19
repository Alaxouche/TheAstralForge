# Wunduniik Game Guide: research fact sheet

Profile read: `Wunduniik Reloaded - Standard`. Not published. Abbreviations:

- `M\` = `F:\Games\Wunduniik Reloaded\mods\`
- `OO\` = `M\Overwrite Output\` (the list's own settings/output mod, modid 89632, priority line 24 of modlist.txt, so it wins over almost every mod)
- `P\` = `F:\Games\Wunduniik Reloaded\profiles\Wunduniik Reloaded - Standard\`
- "desc" = the mod's `nexusDescription` in its `meta.ini`
- "HC" = houseCARL read tool (records at load-order winner, epoch e2-05993f7977f8f6a9)

Priority check: `P\modlist.txt` lists highest priority first. OO (line 24) beats Starfrost (2138), SMI (2139), AutoExec Console Commands (3831), EDS (2112).

The Performance / Ultra profiles were not compared for gameplay (brief says same; nothing found to contradict).

---

## 1. Starting a new game

| Fact | Source |
|---|---|
| New Game panel (Start Game Settings) offers Difficulty, Survival Mode toggle and starting date (month/day). Difficulty is then remembered per save. | `M\Start Game Settings\meta.ini` desc; `...\SKSE\Plugins\StartGameSettings\StartGameSettings_Difficulty.json`, `_SurvivalMode.json`, `_Date.json` |
| Difficulty stepper reads the INI pref as its initial value; pref is Expert: `iDifficulty=3` | `P\skyrimprefs.ini`; `M\(OPT) Difficulty - Expert\Weapons and Armors Stat Balance.ini` (`iDifficulty = 3`) |
| Alternative difficulty presets exist as disabled optional mods: Easy, Apprentice, Adept, Master, Legendary | `P\modlist.txt` lines 64-69 |
| Survival Mode toggle default = 0 (off) | `StartGameSettings_SurvivalMode.json` (`defaultValue: 0`, global `ccQDRSSE001-SurvivalMode.esl|828`) |
| SMI does not auto-enable Survival on new game: `bAutoEnableSMOnNewGame=0`, `bDisableFastTravel=0` (Starfrost's own copy says 1 / 1 but OO wins) | `OO\SKSE\Plugins\SurvivalModeImproved.ini` vs `M\Starfrost - A Survival Overhaul\SKSE\Plugins\SurvivalModeImproved.ini` |
| Main menu: MOTD and Creations entry removed | `M\Start Game Settings\SKSE\Plugins\StartGameSettings.ini` |
| Alternate Perspective: you spawn in a start room, create the character, talk to the little dragon on the lantern, pick a start, step through the door. Ignoring the dragon = default start. Main quest starts by renting a room at Helgen's inn ("Start Intro (10 gold)") and sleeping there. Helgen is a living town until then. | `M\Alternate Perspective - Alternate Start\meta.ini` desc |
| AP start categories (11): Regular (Inn), From Overseas, Wanted Criminal, Left for Dead, Shipwrecked, My own Home, Vampire, Werewolf, Forsworn (Druadach Redoubt), Guilds, Dragonborn | `...\SKSE\AlternatePerspective\AlternatePerspective.json` + `Interface\Translations\AlternatePerspective_ENGLISH.txt` |
| Adventurer's Start adds 7 starts: Roadside Ambush, Fell in a Spike Pit, Bounty Hunter, Bandit Prisoner, Orc Stronghold, Saved by Vigilants, Out in the Wilderness | `M\Adventurer's Start...\meta.ini` desc; json has 7 entries |
| New Beginnings adds 14 entries (addict in skooma den, Dwemer ruin, alchemist camp, Angi's camp, beggar, jail, temple pilgrim, sacred site pilgrim, Thalmor prisoner, slain by vampire, merchant/mercenary...) | `M\New Beginnings...\meta.ini` desc; `NewBeginnings.json` (14 entries) |
| Through the Woods replaces the AP start room with a forested copse | `M\Through the Woods...\meta.ini` desc |
| Apprentice - Starting Gear: class starting gear given and auto-equipped when you leave character creation | `M\Apprentice - Starting Gear for Start Mods\meta.ini` desc |
| Vanilla start not supported (site) | `_wunduniik\known-issues.md` "Vanilla start instability" |
| "Dragonborn start in Helgen missing" known issue | `_wunduniik\known-issues.md` |
| Wait for MCMs to finish loading; presets loaded automatically (site) | `_wunduniik\installation-guide\using-the-list.md` |
| MCM Memory: active profile "Wunduniik Reloaded", autoRestore true, autoBackup true | `OO\SKSE\Plugins\MCMMemory\Settings.json`, `Profiles\Wunduniik Reloaded.json` |
| New game starts at 14:30 (`set gamehour to 14.30`) | `OO\autoxec_new_game.txt` (not used in pages) |

## 2. Controls

| Fact | Source |
|---|---|
| F8 keymap data (Hotkey Reminder). Keyboard labels used in controls.md come from this file only. | `OO\interface\hotkeysreminder_data.json` |
| Confirmed independently: Taunt `iTauntHotkey = 34` (G); Helmet Toggle keycode 48 (B) | `OO\MCM\Settings\Taunt Your Enemies.ini`; `OO\MCM\Settings\keybinds.json` |
| Mouse binds in config files: TDM target lock `uTargetLockKey = 259`; Dodge Framework `dodgeBind = 260`; Animus target lock `TargetLockKey=258`; Bow Rapid Combo `iBowComboKey1=281` | `OO\MCM\Settings\TrueDirectionalMovement.ini`; `OO\SKSE\Plugins\DodgeFramework.ini`; `OO\SKSE\Plugins\Animus_TargetLock.ini`; `OO\MCM\Settings\BowRapidCombo.ini` |
| The F8 file labels mouse3 = Dodge, mouse4 = Bow Rapid Combo, mouse6 = Target Lock. I could not map these names to the keycodes above with certainty, so controls.md does not name mouse buttons for these three actions and points to F8. | see above |
| DodgeFramework.ini in `OO\MCM\Settings` says `uDodgeKey = 56` (Left Alt) while the SKSE ini says 260 and F8 says Left Alt = Sprint. Contradiction, not used. | `OO\MCM\Settings\DodgeFramework.ini` |
| EDS widget toggle `ToggleKeyCode = 7` (key 6 on DIK) while F8 says 6 = Fav 6. Not used. | `M\Equipment Durability System NG - Angelic Preset\SKSE\Plugins\EquipmentDurability\Settings.ini` |
| F8 label "Left Ctrl + H: Slaves Menu" looks like a leftover; not used. | `hotkeysreminder_data.json` |

## 3. Levelling and character

| Fact | Source |
|---|---|
| Experience: character XP from quests, discovering and clearing locations, kills, reading. `bEnableSkillXP=0` (skills give no XP), `bEnableKilling=1`, `bEnableReading=1`, `iMaxPlayerLevel=100`, `fSkillCapBase=100`, `fSkillCapMult=0`, `bUseRacialCaps=0`, `fXPKillingMult=1.00`, `fXPGroupFactor=0.3`, `fXPReadingMult=0.50` | `M\Experience\SKSE\Plugins\Experience.ini` (list values differ from Nexus defaults) |
| Quest XP: Main 125, Daedric 150, Civil War 100, Dawnguard 150, Dragonborn 150, College / Brotherhood / Companions 80, Thieves 50, Side 30, Misc 0, None 10, objectives 10 | same file `[Questing]` |
| Discover XP (non-zero only): Miraak temple 30, Castle Karstaag 30, Raven Rock 20, Dwemer ruin 15, Dragon lair 15, Daedric shrine 15, Doomstone 10, Orc stronghold 10, Standing stones 10, Nordic ruin 5, Shipwreck 5, Giant camp 5, Nordic tower 5, Nordic dwelling 5 | same `[Exploring]` |
| Clear XP: Miraak temple 80, Castle Karstaag 80, Dwemer ruin 60, Dragon lair 60, Giant camp 50, Nordic ruin 40, Doomstone 40, Altar 40, Standing stones 40, Fort 30, Imperial tower 25, Nordic tower 25, Cave 20, Mine 20, Landmark 20, default 20 | same `[Clearing]` |
| Kill XP formula: RacialXP x (EnemyLevel/PlayerLevel)^factor x group mult | Experience desc |
| Levelling curve = vanilla formula (fXPLevelUpBase / Mult), values not read | Experience desc |
| Static Skill Leveling: `bDisableSkillLeveling = 1`, `iSkillPointsPerLevel = 5`, `iMaxLevelsPerSkillPerPlayerLevel = 5`, cost 1 point per skill level at 0/25/50/75, `iSkillPointCost100 = 10000`, `iSkillPointsCap = 0`, `fSkillPointsLevelMultiplier = 0` | `OO\MCM\Settings\StaticSkillLeveling.ini` (same in `OO\MCM\Config\StaticSkillLeveling\settings.ini`); labels in `M\Static Skill Leveling for Firmament\interface\Translations\StaticSkillLeveling_english.txt` |
| Custom skills from Constellations/Firmament have use-XP disabled (`useMult 0.000001`, `improveOffset 10000`) | `M\Static Skill Leveling for Firmament\SKSE\Plugins\CustomSkills\Constellations\HandToHand.json` |
| Uncapper: 1 perk per level, +10 to chosen attribute, +5 carry weight when choosing Stamina, skill caps 100 | `M\Skyrim Skill Uncapper\SKSE\Plugins\SkyrimUncapper.ini` |
| `OO\MCM\Settings\ExperienceMultipliers.ini` (fAllSkills 2, TwoHanded 2, HeavyArmor 2): owner mod not identified, irrelevant if skill use XP is off | file |
| Skill sky (24 trees): vanilla 18 + Hand to Hand, Athletics, Sorcery (Constellations) + Horseman, Exploration, Philosophy (Firmament) | `M\Firmament\SKSE\Plugins\CustomSkills\SKILLS.json` (Firmament priority 2247 beats Constellations 2249) |
| Adamant Hand to Hand addon renames vanilla trees: AVLockpicking -> "Hand to Hand", AVPickpocket -> "Security" | HC: `000454:Skyrim.esm` and `000453:Skyrim.esm`, winner Synthesis Patcher 1.esp; `M\Hand to Hand - An Adamant Addon\meta.ini` desc |
| So two unarmed trees exist (Adamant one in the Lockpicking slot + Constellations Hand-to-hand). Flagged. | above |
| Constellations Hand-to-hand: +0.5% unarmed damage per skill point, 9 perks / 14 points. Athletics: up to +8.1% speed at 100, 9 perks / 14 points. | `M\Constellations...\meta.ini` desc |
| Firmament: Horseman 10 perks / 15 points; Exploration 12 perks / 18 points | `M\Firmament\meta.ini` desc |
| Apprentice: 18 classes, 32 traits, chosen in the vanilla race menu (`bRaceMenuUseClass = true`, `bRaceMenuUseTrait = true`). Class bonuses and trait texts | `M\Apprentice - A Class Overhaul\skse\plugins\app_classes.json`, `app_traits.json`, `Apprentice.ini` |
| Race passives (one each, Apprentice versions). Verified Argonian (50/50), Khajiit "Lunar Blessing" 20%, Wood Elf "Green Pact" 10% in game records | Apprentice desc; HC `000083`, `000093`, `000095`, `000082:Apprentice.esp` |
| Race no longer affects starting skills or spells; beast races 10 base unarmed, others 5; Imperial +1 perk | Apprentice desc |
| Mundus stones (13) texts | `M\Mundus - A Standing Stone Overhaul\meta.ini` desc. Note: desc "Notes" mention Reflect Damage for the Tower Stone but the stone text says Armor +100 and 25% stagger; I used the stone text. |
| Skills of the Wild: 4 Campfire perk trees (Wayfarer, Art of the Hunt, Culinary Arts, Beast Handler) | `M\Skills of the Wild...\meta.ini` desc. Its "no compass at first" feature not verified in the list config, left out. |
| Pilgrim: Pilgrim perk (Restoration) and Cultist perk (Conjuration), ranks at 30 and 60; Prayer lesser power after first shrine prayer | `M\Pilgrim - A Religion Overhaul\meta.ini` desc |
| Stormcrown: Meditate power after the Greybeards; Dragonborn perk tree bought with dragon souls (2/3/4/5 souls per tier, 50 dragons total), souls not consumed | `M\Stormcrown - A Shout Overhaul\meta.ini` desc |

## 4. Combat

| Fact | Source |
|---|---|
| B&B ini: `bEnableInjuries = true`, `bEnableInjuriesOnlyWithSM = false`, `bLevelBasedDifficulty = true`, `bArmorRatingScalingEnabled = true` | `M\Blade and Blunt - A Combat Overhaul\SKSE\Plugins\BladeAndBlunt.ini` |
| B&B armor: 0.15% per point to 75% at 500, then 0.03% per point to 90% at 1000; armor also cuts spell damage up to 25% / 40%. Resist caps 75% | B&B desc |
| B&B difficulty rules: Expert = +10% spell and stamina costs, +25% incoming stagger, -10% parry window | B&B desc |
| B&B difficulty damage table and level-based scaling table (Expert 1.00/1.50 at level 1 to 0.75/2.00 at level 50) | B&B desc |
| YADM: `iMode = 0` (basic), `sPlayerDamageMulti = 1.00`, `sNPCDamageMulti = 1.00`, `sDifficulty = Expert` | `OO\MCM\Settings\YetAnotherDifficultyMod.ini` |
| -> Which of B&B scaling and YADM sets the live damage multipliers is NOT documented. Pages say: check YADM MCM. | |
| B&B kill moves: player immune; enemies only below half health | B&B desc |
| B&B blocking: shield 40% base, 50% chance to stagger attacker; weapon 20% base, weapon parry timed (0.75 s 2H, 1.0 s 1H + empty off-hand) | B&B desc. Not used in pages as numbers, since Simple Timed Block and For Honor Reforged also rework blocking. |
| B&B base stamina costs (power attacks 40-100, sprint 8/s...) | B&B desc. NOT used: For Honor Stamina System and `OO\autoxec_load.txt` GMSTs (`fCombatStaminaRegenRateMult 1.00`, `fSprintStaminaDrainMult 3.50`, `fStaminaAttackWeaponBase 5.00`...) also change stamina; final values not documented. |
| For Honor Stamina System (player): light attacks cost stamina; an attack that leaves you at 0 triggers exhaustion: 50% move speed, -15% weapon speed, no stamina regen 10 s (potions blocked), +50% damage and stagger taken if not blocking, block 50% weaker; +50 stamina at the end | `M\For Honor Stamina System\meta.ini` desc (defaults, no config file in list) |
| For Honor Reforged: parry is a counterattack scaling with Block; back power attack = guard break; parry knockdown cooldown 10 s with icon; NPCs parry, guard break, knock down | `M\For Honor Reforged\meta.ini` desc |
| Simple Timed Block - Blessed: perfect / good / regular block, timing windows scale with Block, stamina back on perfect block | desc |
| Chocolate Poise - Reforged is enabled (OPT): poise system, armor weight counts | `P\modlist.txt` line 54; desc |
| Infinite Stamina Out of Combat: main file installed (infinite stamina out of combat, not only sprint) | `M\Infinite Stamina Out of Combat\meta.ini` installationFile `Infinite Stamina Out of Combat-70134-1-1-...` |
| Precision: `uMaxTargetsSweepAttack = 3`, trails on | `OO\MCM\Settings\Precision.ini` |
| Accuracy: localized damage by body part and armor coverage | desc |
| Smart NPC Potions: 10% chance, max 2 potions | `OO\SKSE\Plugins\MCMMemory\Profiles\Wunduniik Reloaded.json` |
| autoxec (runs on load): NPC aim random offset 70, NPC magic dodge chance 0, max player runes 3, pickpocket max chance 100, timescale 12, dual cast cost mult 2.0 | `OO\autoxec_load.txt` (wins over `M\AutoExec Console Commands\autoxec_load.txt`, which has no active commands) |
| Last Man Standing: if you go down and a follower wins the fight, you revive in place; otherwise normal death. `fHealthFloor=15.0`, `fRadius=6000` | `M\Last Man Standing\meta.ini` desc; `MCM\Config\LastManStanding\settings.ini` |
| Shadow of Skyrim: the enemy that defeats you becomes a Nemesis (name, stats, buff), you get a debuff, respawn elsewhere, quest to recover backpack and kill the Nemesis; enemies 25+ levels above you don't become Nemeses by default | desc |
| -> How Last Man Standing and Shadow of Skyrim chain is NOT documented. | |
| Permadeath mod is an optional disabled mod | `P\modlist.txt` line 55 |
| Know Your Enemy 2: 16 damage types, creature resistances / weaknesses, MCM with 4 intensity levels | `M\(OPT) Know Your Enemy 2\meta.ini` desc |
| Wait Your Turn Redux: limits simultaneous attackers | desc |
| Stress and Fear shipped profile: `EnableStress 1`, `EnableFear 1`, `EnableEnhancedPenalty 1`, `EnableFollowers 1`, `PhobiaChance 27`, `PhobiaHealthThreshold 25`, `PhobiaCureChance 18`, `SleepCuresPhobia 1` | `OO\StressAndFear\Config\Default\StressAndFear.json` |
| Enhanced penalty values: Minor -25%, Moderate -50%, Severe -75%, Critical -90% damage dealt; 24 h uninterrupted sleep cures one phobia | `M\Stress and Fear - Tweaked\meta.ini` desc |
| Stress reduces max stamina and magicka; reduced by alcohol (4 bottles = 100 to 0), comfort food, stews/soups, bath, fishing, reading, petting an animal, praying, music, sleeping at an inn or home | `M\Stress and Fear - A Dynamic Sanity System\meta.ini` desc |

## 5. Survival (Starfrost + SMI, only when Survival Mode is on unless noted)

| Fact | Source |
|---|---|
| Exhaustion: Rested 8 h, 4 h neutral, then Tired (-10% max Magicka and Stamina) at 12 h, Very Tired (-25%) at 18 h, Exhausted (-50%) at 24 h; 12 h sleep clears all | Starfrost desc |
| Hunger: 2 h neutral after last food buff, then Hungry -10%, Very Hungry -25%, Famished -50% (max Magicka and Stamina) at 2/4/6 h; one food item clears hunger | Starfrost desc |
| Cold: Cold -10%, Very Cold -25%, Freezing -50% max Health. Warmth 0-250, 0.3% cold resistance per point, 75% at 250 | Starfrost desc; `fMaxWarmthRatingBonus=0.75` in `OO\SKSE\Plugins\SurvivalModeImproved.ini` |
| Warmth by armor: heavy chest 60 / other pieces 30; light 40 / 20; clothing 20 / 10. Hot stew +50, torch +50, werewolves +50 | Starfrost desc |
| Injuries with SM: chance 5% below 75% HP, 25% below 50%, 50% below 25%; Minor -10%, Major -25%, Critical -50% max Health; 4 h sleep per level; block or ward halves the chance; Freezing + Critical = death | Starfrost desc |
| Injuries without SM (B&B): 10% below 50%, 25% below 25%; Minor -25, Major -50, Critical -100 max Health; rest 4/8/12 h | B&B desc + `bEnableInjuriesOnlyWithSM = false` |
| Health regen with SM: natural regen ~0, +100% below 50% HP, +100% more below 25% | Starfrost desc |
| Carry weight with SM: base 200; over-encumbered = fast exhaustion + 5 stamina/s | Starfrost desc |
| Freezing water: -25% speed, 10 stamina/s, cold rises fast | Starfrost desc |
| Diseases (tiers progress every 24 h with SM; without SM fixed at tier 1 or 2): table of 10 diseases and sources | Starfrost desc |
| Vampires immune to cold and hunger; werewolves tire half as fast | Starfrost desc; SMI ini `bVampireColdEnabled=false`, `bVampireHungerEnabled=false` |
| SMI: `fMaxAvPenPercent=0.5` (max stat penalty 50%), `bForceEnableFoodPoisoning=true` | `OO\SKSE\Plugins\SurvivalModeImproved.ini` |
| Journeyman: fast travel needs a travel pack, but only when Survival is on (`bEnableOnlyOnSurvivalEnabled=true`). Pack = 1 leather, 2 leather strips, 2 firewood, 1 torch at a forge; torch = 1 firewood + 2 leather strips; sold by general merchants; 5 lb; consumed per trip | `M\Journeyman...\SKSE\Plugins\Journeyman.ini`; desc |
| Experience FAQ: with Survival Mode, level-ups wait until you sleep | Experience desc FAQ (not verified in SMI config) |
| Gourmet: food buffs to Health (meat/stews), Stamina (veg/soups/bread), Magicka (pastries/cheese) Regeneration at 10/25/50%; 20 min (halved to 10 min with SM); one of each type at once. Art of Cooking Vol 1/2 (+100% duration each), Vol 3 (double yield) from chef vendors in Understone Keep, Blue Palace, Bards College. Drugs: Sleeping Tree Sap, Skooma, Eversnow; 25% addiction chance | `M\Gourmet...\meta.ini` desc; Starfrost desc |
| Fed / Well Fed / Rested XP bonuses: Starfrost text, but in this list skills give no XP, so left out of pages | flagged |
| Timescale 12 | `OO\autoxec_load.txt` |
| EDS NG Angelic preset: `DisableBreak = true`, `OnlyPlayer = true`, degradation rates per weapon/armor type, `MaterialMultiplier`: Iron, Leather, Fur, Glass = 1, all others (Steel, Elven, Dwarven, Orcish, Ebony, Daedric, Dragon, Stalhrim, Chitin, Falmer, Bonemold, Silver) = 0. DynamicTemper 20 / vendor 60 / boss 90 %; DynamicEnchant 1 / 5 / 15 % | `M\Equipment Durability System NG - Angelic Preset\SKSE\Plugins\EquipmentDurability\Settings.ini` (Edge UI copy is in a disabled mod) |
| EDS repair = re-temper | EDS desc |
| Campfire: build campfires, tents, backpacks, Harvest Wood, Instincts | Campfire desc |
| Simple Hunting Overhaul: skinning advances time (few min to 2 h), hold Shift to pick up a carcass, some shopkeepers buy carcasses | desc |
| Temperature Gauge reads Starfrost / SMI, configured in SKSE Menu Framework | desc + files `SKSE\Plugins\TemperatureGauge\Needs\Starfrost.json` |

## 6. Magic

| Fact | Source |
|---|---|
| Mysticism: ~200 new spells, one-handed Master spells, rebalanced vanilla spells | desc |
| Sorcerer: scroll enchanter and staff enchanter tables; scroll enchanters in the Arcanaeum, the Arch-Mage's quarters, the Frozen Hearth (list cut) | desc |
| Thaumaturgy: rebalanced and new enchantments, no 100% cost reduction loop | desc |
| Apothecary: normalized ingredients, lower potion value | desc |
| Immersive Spell Learning DESTified: spell tomes are studied over time (not eaten); time depends on spell level, school skill, max Magicka, sitting, quiet place (College, Arcanaeum best); one spell at a time | desc |
| Mysticism Cure Disease adds Cure Injury, sold by Pilgrim priests (Starfrost injury addon) | Starfrost desc. Whether that addon plugin is active was not checked; mentioned only as "Cure Disease/injury services from priests" via Pilgrim desc. |
| Spell packs present (09.2): list of 22 mods | `scratchpad\inv\wun.json`; most descs are empty, so no acquisition details |
| Scion stages, Manbeast mortal form (Animal Senses, Lycanthrope) | descs |
| Dual casting cost mult 2.0 | `OO\autoxec_load.txt` |

## 7. Content

| Fact | Source |
|---|---|
| VIGILANT starts with Altano in the Windpeak Inn, Dawnstar | `M\VIGILANT\meta.ini` desc |
| Delayed start: Story Manager node `VigilantDelayedStart` condition `GetLevel >= zzzVigilantMinLevel`, global = 25 | HC `000801` and `000800:Vigilant - Delayed Start.esp` |
| Extended Cut - Saints and Seducers: level 20+ and The Mind of Madness done, then sleep 6 h or leave and re-enter Solitude | desc |
| There Is No Umbra (Chapters I-III): "There Is No Umbra" book in common loot, copy on Farengar's desk in Dragonsreach | desc |
| SIRENROOT: Lake Honrich, hired by the Black-Briars; no level requirement; followers poorly supported | desc. Exact trigger not documented. |
| Mage Towers of Skyrim: 5 abandoned mage towers | desc |
| Penitus Oculatus: after "Destroy the Dark Brotherhood!", talk to Commander Maro | desc |
| Followers: Inigo (Riften jail, cell next to Sibbi; own framework, not counted); Auri (Falkreath Hold, "Auri's Pod" marker); Lucien (Dead Man's Drink, Falkreath); Remiel (Silver-Blood Inn, Markarth); Dagoth Ur (alchemy table, Sleeping Giant Inn, Riverwood); Allies of the Inquisition: Cassandra (Windhelm, Temple of Talos), Vivienne (College of Winterhold), Sera (Riften), Josephine (Blue Palace, Solitude), Blackwall (Shor's Stone / Riften market), Solas (Dead Man's Drink, Falkreath), Dorian (Silver-Blood Inn, Markarth), Cullen (Dragonsreach), Iron Bull (Windpeak Inn, Dawnstar) | each mod's desc |
| Xelzaz, Jesper: location not in desc (Jesper desc empty) | |
| Simple Follower Framework: `iMaxFollowers=4`, `bFollowerEssential=1`, friendly fire and crossfire protection on, follower homes on | `M\Simple Follower Framework\SKSE\Plugins\SimpleFollowerFramework.ini` |
| Follower Death and Injury Chance: at 0 HP, 80% minor injury, 15% serious injury, 5% death | desc (v3.51 installed) |
| -> interaction with `bFollowerEssential=1` not documented | |
| Economy: The Gilded Road (regional supply and demand via Dynamic Pricing Framework); DPF shows cheaper / dearer indicators in the barter menu; C.O.I.N. ancient coins; M.I.N.T. regional currencies; Exchange Currency Enhanced | descs |
| Lawbringer / Lawbringer Guardsman: claim cleared locations (44 in Guardsman) for a faction | desc |
| Crime Bounty Decay: bounties decay if you stay away from the hold | desc |
| Headhunter: bounty targets need proof (head), bandit leaders can be captured | desc |
| Missives: notice-board jobs; known issue with gathering quests | desc; `_wunduniik\known-issues.md` |
| Player homes in 07.6: Gonzeh - Home in a Hill, Homes Under the Warhammer | `scratchpad\inv\wun.json` |

## Not confirmed / left out

- Live difficulty damage multipliers (B&B level scaling vs YADM).
- Final stamina costs (B&B vs For Honor Stamina System vs autoxec GMSTs).
- Whether Fed / Rested "+% experience" does anything when skill XP is off.
- How Last Man Standing hands over to Shadow of Skyrim.
- Mouse button names for dodge / target lock / bow rapid combo.
- Spell pack acquisition (descs empty).
- SIRENROOT trigger, Xelzaz and Jesper locations, Paraglider acquisition, Ish's Respec usage (no desc).
- Skills of the Wild compass restriction.
- Whether skill books and trainers still raise skills under Static Skill Leveling (removed from the page).
- F8 "mouse1 / mouse2" read as left / right click in controls.md (consistent with "Shift + mouse2 = Block").
- SMI `fMaxAvPenPercent=0.5` vs Starfrost's "penalties stack to 100%" and "Freezing + Critical Injury = death": the page only says penalties add up (example at -50%) and does not state a cap or the death rule.
- Stress and Fear Enhanced Penalty: read from the shipped JContainers profile `OO\StressAndFear\Config\Default\StressAndFear.json`; MCM Memory also records "Stress Rate" = 0 (meaning of index 0 unknown).
- FR game names I was not sure of were left in English (quest titles, inn names, Understone Keep, Hagraven, Slaughterfish, Ash hopper, The Reach).

## Observed inconsistencies

- Changelog v7.0.0.0-Beta02 (line ~816 of `_wunduniik\changelog.md`) says "Removed Through the Woods - Alternate Perspective Addon", but the mod is enabled in the Standard profile (v2.0.0).
- Two Hand to Hand skill trees (Adamant addon in the Lockpicking slot + Constellations custom skill).
- `OO\MCM\Settings\DodgeFramework.ini` (`uDodgeKey = 56`, Left Alt) vs `OO\SKSE\Plugins\DodgeFramework.ini` (`dodgeBind = 260`) vs F8 map (Left Alt = Sprint, mouse3 = Dodge).
- `OO\SKSE\Plugins\SurvivalModeImproved.ini` overrides Starfrost's intended `bDisableFastTravel=1` / `bAutoEnableSMOnNewGame=1` (deliberate list choice: survival is opt-in).
- `_wunduniik\index.md` says "hundreds of carefully selected mods" while the banner says 2900+ and the profile has 3603 enabled mods.
- houseCARL could not parse `ksws03_quest.esp` (FootstepSet `000A96`, XCNT length). Probably a parser limit, not necessarily a game problem.
