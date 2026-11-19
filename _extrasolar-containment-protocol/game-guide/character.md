---
layout: skyground_readme
title: Character
title_fr: Personnage
parent: Game Guide
nav_order: 3
---

<div lang="en" markdown="1">

# Character

{: .short }
> **In short**
> - Enemies are levelled closer to you: 0.9x your level on Easy, 1.0x on Medium, 1.1x on Hard, 1.3x on Very Hard.
> - You and leveled NPCs gain 10 health per level instead of 20.
> - Discovering a location gives 40 XP (vanilla 20), a secret area 60 XP (vanilla 20), picking locks gives twice the vanilla XP.
> - Deadly Effective renames and rebuilds the combat perks; its Hardcore Mode lowers base handling until you invest in perks.
> - Fitness, Weight Lifting and Payloads give much more per rank; a new Takedowns skill sits in the Physical tree.
> - 25 new traits and 20 new backgrounds; respec is free at the Lodge.

## Levelling and enemy scaling

Three mods set these values: [Royal Galaxy](https://www.nexusmods.com/starfield/mods/8222), its Hard Mode patch, and [GRiNDTerra Gameplay Overhaul](https://www.nexusmods.com/starfield/mods/17670). The numbers below are the ones that win in this load order.

| Setting | Vanilla | This list |
| --- | --- | --- |
| Enemy level vs yours, Easy | 0.4x | 0.9x |
| Enemy level vs yours, Medium | 0.7x | 1.0x |
| Enemy level vs yours, Hard | 1.0x | 1.1x |
| Enemy level vs yours, Very Hard | 1.25x | 1.3x |
| Your health per level | 20 | 10 |
| Leveled NPC health per level | 20 | 10 |
| XP for discovering a location | 20 | 40 |
| XP for finding a secret area | 20 | 60 |
| XP for a lock (easy / average / hard / very hard) | 5 / 10 / 15 / 20 | 10 / 20 / 30 / 40 |

- [Gameplay Tweaks and Fixes](https://www.nexusmods.com/starfield/mods/241) slightly raises the XP needed for the first levels and lowers it for higher levels.
- You get kill XP as long as you dealt any damage to the enemy ([No XP Kill Steal Fix](https://www.nexusmods.com/starfield/mods/1018)).
- [Configurable Level Limit](https://www.nexusmods.com/starfield/mods/12661) can stop XP at level 50, 75, 100, 125 or 150. Set it in Gameplay Options; you can change or remove it at any time.
- Sleep matters for XP: in [Peak Performance](https://www.nexusmods.com/starfield/mods/12420), fatigue mainly controls experience gain (see [Survival]({{ '/extrasolar-containment-protocol/game-guide/survival/' | relative_url }})).

## Perks: Deadly Effective

[Deadly Effective](https://www.nexusmods.com/starfield/mods/11834) reworks most combat perks around playstyles. Old perk checks still work (a mod or dialogue that looks for Dueling sees Evasion). Every skill, rank and challenge of the list is on the [Skill Trees]({{ '/extrasolar-containment-protocol/game-guide/skills/' | relative_url }}) page.

| Vanilla perk | Becomes | Focus |
| --- | --- | --- |
| Ballistics | Neutralisation | Semi-auto carbines, then pistols and shotguns |
| Lasers | Focus | All energy weapons, accuracy and fire rate |
| Dueling | Evasion | Close combat, avoiding hits |
| Pistol Certification | reworked | Daring gunslinger play |
| Shotgun Certification | reworked | Clearing rooms, crippling foes |
| Boxing | reworked | Footwork, tripping enemies, dodging blows |
| Rifle Certification | Suppression | Automatic fire |
| Particle Beams | Efficiency | Getting more out of weak weapons |
| Incapacitation | reworked | Organic vs inorganic targets, instant knock-out at high ranks |
| Isolation | reworked | Stealth bonuses and Fear for solo players |
| Rapid Reloading | Weapon Handling | Handling of every weapon in combat |

{: .tip }
**Hardcore Mode** adds one perk that lowers stats like reload speed, weapon handling and fall damage reduction, so the matching perks matter more. You can disable it in Gameplay Options.

## Physical skills: bigger numbers

[Perk Up](https://www.nexusmods.com/starfield/mods/10107) raises three skills:

| Skill | Vanilla, ranks 1 to 4 | This list |
| --- | --- | --- |
| Fitness (max O2) | +10 / 20 / 30 / 30 % | +30 / 60 / 100 / 100 % |
| Weight Lifting | +10 / 25 / 50 / 100 kg | +50 / 100 / 150 / 200 kg |
| Payloads (ship cargo) | +10 / 20 / 30 / 50 % | +30 / 60 / 90 / 120 % |

With [StarGym](https://www.nexusmods.com/starfield/mods/12530), Weight Lifting rank challenges ask you to train on gym stations (5, 10, then 25 sessions). Training for 1 minute on a mat or station gives a 2-hour bonus. Mats need the Fitness perk, stations need Weight Lifting; both are in the Misc build menu of outposts and ships, and vanilla pull-up bars and benches are usable.

### Takedowns

[Shades Stealth Takedowns](https://www.nexusmods.com/starfield/mods/8382) adds a Takedowns skill to the Physical tree. You must be sneaking, undetected and out of combat.

| Rank | Effect |
| --- | --- |
| 1 | Unlocks lethal and knock-out takedowns |
| 2 | Refills your oxygen on a takedown |
| 3 | Also heals 10 % health |
| 4 | Also gives a stealth field for 10 seconds |

## Speech, locks and terminals

- Persuasion chances are 70 / 40 / 25 % for easy / medium / hard options (vanilla 60 / 45 / 30 %) with Immersive Speech from [Easy Speech](https://www.nexusmods.com/starfield/mods/450).
- Lockpicking is easier on low-level locks; Master locks stay hard (Immersive Digipick from [Easy Digipick](https://www.nexusmods.com/starfield/mods/451)).
- Doors, containers and terminals open by themselves when your Security rank is equal to or higher than the lock level ([Auto Unlock SFSE](https://www.nexusmods.com/starfield/mods/5571)).

## Traits

[More Traits](https://www.nexusmods.com/starfield/mods/8012) adds 25 traits. You can only take one per category (medical, ship, behavioural, physical). A few with clear numbers:

| Trait | Upside | Downside |
| --- | --- | --- |
| All or Nothing | +100 % damage | +100 % damage taken |
| Smart Guy | +100 % XP | No XP from combat |
| Blood Thirsty | +50 % combat XP | No quest XP |
| Deep Breather | +50 O2 | -25 % airborne resistance |
| Strongback | +75 carry weight | +100 % fall damage |
| Cybernetic Implants | -50 % O2 for physical activity | +100 % EM damage taken |
| Thick Skin | +50 % thermal resistance | -25 % radiation and corrosive resistance |
| Silver-Tongued | -10 % buy, +15 % sell prices | -10 % weapon damage |
| Space Hauler | +10 % cargo space | -10 % ship damage |
| Raised Old Faith | -10 % damage taken | Triple crime bounties |

## Backgrounds

[Better Backgrounds](https://www.nexusmods.com/starfield/mods/7955) adds 20 backgrounds and gives every background a lasting bonus tied to it, for example Beast Hunter +15 % damage against alien creatures, Bouncer +25 % unarmed damage. GRiNDTerra also changes a few: Xenobiologist starts with Zoology and Surveying, Xenobotanist with Botany and Surveying, Spacer with no starting skills.

## Respec

The [Skill ReSpec Terminal](https://www.nexusmods.com/starfield/mods/6484) refunds your skill points for free, by category or all at once. It is in the Lodge basement, on the wall under the weapon rack to your right after the stairs, and you can build one (Miscellaneous) at outposts, on your ship or in a home. Re-buying a skill does not ask you to redo challenges you already completed.

## Companions

[Affinity Reworked](https://www.nexusmods.com/starfield/mods/6891) makes everyday actions count for your companion's affinity: scanning, mining, crafting, modding gear, healing them, but also stealing, picking locks, hacking, using drugs or firing in public places.

</div>
<div lang="fr" markdown="1">

# Personnage

{: .short }
> **En bref**
> - Les ennemis sont plus proches de votre niveau : 0,9 fois votre niveau en Facile, 1,0 en Moyen, 1,1 en Difficile, 1,3 en Très difficile.
> - Vous et les PNJ à niveau variable gagnez 10 points de vie par niveau au lieu de 20.
> - Découvrir un lieu rapporte 40 XP (20 en vanilla), une zone secrète 60 XP (20 en vanilla), crocheter une serrure le double de l'XP vanilla.
> - Deadly Effective renomme et reconstruit les compétences de combat ; son Hardcore Mode réduit votre maniement de base tant que vous n'investissez pas.
> - Fitness, Weight Lifting et Payloads donnent beaucoup plus par rang ; une nouvelle compétence Takedowns apparaît dans l'arbre Physique.
> - 25 nouveaux traits et 20 nouveaux passés ; la réinitialisation est gratuite au Lodge.

## Niveaux et échelle des ennemis

Trois mods fixent ces valeurs : [Royal Galaxy](https://www.nexusmods.com/starfield/mods/8222), son patch Hard Mode et [GRiNDTerra Gameplay Overhaul](https://www.nexusmods.com/starfield/mods/17670). Les chiffres ci-dessous sont ceux qui l'emportent dans cet ordre de chargement.

| Réglage | Vanilla | Cette liste |
| --- | --- | --- |
| Niveau ennemi par rapport au vôtre, Facile | 0,4 | 0,9 |
| Niveau ennemi par rapport au vôtre, Moyen | 0,7 | 1,0 |
| Niveau ennemi par rapport au vôtre, Difficile | 1,0 | 1,1 |
| Niveau ennemi par rapport au vôtre, Très difficile | 1,25 | 1,3 |
| Vos points de vie par niveau | 20 | 10 |
| Points de vie par niveau des PNJ à niveau variable | 20 | 10 |
| XP pour la découverte d'un lieu | 20 | 40 |
| XP pour une zone secrète | 20 | 60 |
| XP par serrure (facile / moyenne / difficile / très difficile) | 5 / 10 / 15 / 20 | 10 / 20 / 30 / 40 |

- [Gameplay Tweaks and Fixes](https://www.nexusmods.com/starfield/mods/241) augmente un peu l'XP demandée aux premiers niveaux et la réduit aux niveaux élevés.
- Vous recevez l'XP d'un ennemi tué dès que vous lui avez infligé des dégâts ([No XP Kill Steal Fix](https://www.nexusmods.com/starfield/mods/1018)).
- [Configurable Level Limit](https://www.nexusmods.com/starfield/mods/12661) peut bloquer l'XP au niveau 50, 75, 100, 125 ou 150. Réglez-le dans Gameplay Options ; vous pouvez le modifier ou le retirer à tout moment.
- Le sommeil compte pour l'XP : dans [Peak Performance](https://www.nexusmods.com/starfield/mods/12420), la fatigue agit surtout sur le gain d'expérience (voir [Survie]({{ '/extrasolar-containment-protocol/game-guide/survival/' | relative_url }})).

## Compétences : Deadly Effective

[Deadly Effective](https://www.nexusmods.com/starfield/mods/11834) retravaille la plupart des compétences de combat autour de styles de jeu. Les vérifications d'origine fonctionnent toujours (un mod ou un dialogue qui cherche Dueling voit Evasion). Toutes les compétences, leurs rangs et leurs défis sont dans la page [Arbres de compétences]({{ '/extrasolar-containment-protocol/game-guide/skills/' | relative_url }}).

| Compétence vanilla | Devient | Rôle |
| --- | --- | --- |
| Ballistics | Neutralisation | Carabines semi-automatiques, puis pistolets et fusils à pompe |
| Lasers | Focus | Toutes les armes à énergie, précision et cadence |
| Dueling | Evasion | Corps à corps, éviter les coups |
| Pistol Certification | retravaillée | Jeu de pistolero audacieux |
| Shotgun Certification | retravaillée | Nettoyer les pièces, handicaper l'adversaire |
| Boxing | retravaillée | Jeu de jambes, faire trébucher, esquiver les coups |
| Rifle Certification | Suppression | Tir automatique |
| Particle Beams | Efficiency | Tirer le meilleur des armes faibles |
| Incapacitation | retravaillée | Cibles organiques ou non, mise K.-O. instantanée aux rangs élevés |
| Isolation | retravaillée | Bonus de discrétion et effet de peur pour qui joue seul |
| Rapid Reloading | Weapon Handling | Maniement de toutes les armes en combat |

{: .tip }
**Hardcore Mode** ajoute une compétence cachée qui réduit la vitesse de rechargement, le maniement ou la réduction des dégâts de chute, pour donner plus de poids aux compétences correspondantes. Vous pouvez le désactiver dans Gameplay Options.

## Compétences physiques : des chiffres plus élevés

[Perk Up](https://www.nexusmods.com/starfield/mods/10107) renforce trois compétences :

| Compétence | Vanilla, rangs 1 à 4 | Cette liste |
| --- | --- | --- |
| Fitness (O2 max) | +10 / 20 / 30 / 30 % | +30 / 60 / 100 / 100 % |
| Weight Lifting | +10 / 25 / 50 / 100 kg | +50 / 100 / 150 / 200 kg |
| Payloads (soute du vaisseau) | +10 / 20 / 30 / 50 % | +30 / 60 / 90 / 120 % |

Avec [StarGym](https://www.nexusmods.com/starfield/mods/12530), les défis de rang de Weight Lifting demandent de s'entraîner sur des appareils de musculation (5, 10 puis 25 séances). Une minute sur un tapis ou un appareil donne un bonus de 2 heures. Les tapis demandent la compétence Fitness, les appareils Weight Lifting ; ils se trouvent dans le menu de construction Misc des avant-postes et des vaisseaux, et les barres de traction et bancs du jeu deviennent utilisables.

### Takedowns

[Shades Stealth Takedowns](https://www.nexusmods.com/starfield/mods/8382) ajoute une compétence Takedowns dans l'arbre Physique. Vous devez être accroupi, non repéré et hors combat.

| Rang | Effet |
| --- | --- |
| 1 | Débloque les neutralisations mortelles et assommantes |
| 2 | Remplit votre oxygène à chaque neutralisation |
| 3 | Soigne aussi 10 % de vos points de vie |
| 4 | Donne aussi un champ de discrétion pendant 10 secondes |

## Persuasion, serrures et terminaux

- Les chances de persuasion sont de 70 / 40 / 25 % pour les options faciles / moyennes / difficiles (60 / 45 / 30 % en vanilla), avec la version Immersive Speech d'[Easy Speech](https://www.nexusmods.com/starfield/mods/450).
- Le crochetage est plus simple sur les serrures de bas niveau ; les serrures Maître restent difficiles (version Immersive Digipick d'[Easy Digipick](https://www.nexusmods.com/starfield/mods/451)).
- Portes, conteneurs et terminaux s'ouvrent seuls quand votre rang de Security est égal ou supérieur au niveau de la serrure ([Auto Unlock SFSE](https://www.nexusmods.com/starfield/mods/5571)).

## Traits

[More Traits](https://www.nexusmods.com/starfield/mods/8012) ajoute 25 traits. Un seul par catégorie (médical, vaisseau, comportement, physique). Quelques exemples chiffrés :

| Trait | Avantage | Contrepartie |
| --- | --- | --- |
| All or Nothing | +100 % de dégâts | +100 % de dégâts subis |
| Smart Guy | +100 % d'XP | Aucune XP en combat |
| Blood Thirsty | +50 % d'XP de combat | Aucune XP de quête |
| Deep Breather | +50 d'O2 | -25 % de résistance aux menaces aériennes |
| Strongback | +75 de poids transportable | +100 % de dégâts de chute |
| Cybernetic Implants | -50 % d'O2 pour l'effort physique | +100 % de dégâts EM subis |
| Thick Skin | +50 % de résistance thermique | -25 % de résistance aux radiations et à la corrosion |
| Silver-Tongued | -10 % à l'achat, +15 % à la vente | -10 % de dégâts aux armes |
| Space Hauler | +10 % de soute | -10 % de dégâts du vaisseau |
| Raised Old Faith | -10 % de dégâts subis | Primes pour crime triplées |

## Passés

[Better Backgrounds](https://www.nexusmods.com/starfield/mods/7955) ajoute 20 passés et donne à chacun un bonus durable, par exemple Beast Hunter +15 % de dégâts contre les créatures extraterrestres, Bouncer +25 % de dégâts à mains nues. GRiNDTerra en modifie aussi quelques-uns : Xenobiologist commence avec Zoology et Surveying, Xenobotanist avec Botany et Surveying, Spacer sans compétence de départ.

## Réinitialisation

Le [Skill ReSpec Terminal](https://www.nexusmods.com/starfield/mods/6484) rembourse gratuitement vos points de compétence, par catégorie ou en totalité. Il se trouve au sous-sol du Lodge, sur le mur sous le râtelier d'armes, à droite en bas de l'escalier, et vous pouvez en construire un (Miscellaneous) dans un avant-poste, votre vaisseau ou un logement. Racheter une compétence ne vous oblige pas à refaire les défis déjà accomplis.

## Compagnons

[Affinity Reworked](https://www.nexusmods.com/starfield/mods/6891) fait compter les gestes du quotidien dans l'affinité de votre compagnon : scanner, miner, fabriquer, modifier votre équipement, le soigner, mais aussi voler, crocheter, pirater, prendre des drogues ou tirer dans un lieu public.

</div>
