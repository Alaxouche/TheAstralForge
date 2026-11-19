---
layout: skyground_readme
title: Combat
title_fr: Combat
parent: Game Guide
nav_order: 4
---

<div lang="en" markdown="1">

# Combat

{: .short }
> **In short**
> - No aim assist. Lasers have almost no recoil; automatic ballistic weapons kick much harder from the hip.
> - Headshots are far deadlier: an enemy without a helmet can die from a single shot.
> - Blocking stops 90 % of melee damage but costs oxygen; the power attack bonus goes from 1 to 3.5.
> - Enemies use cover, flank, fall back and throw more grenades. Up to 125 NPCs can fight at once.
> - Stealth: enemies see in a narrower cone, but running while sneaking and heavy gear make more noise.
> - Crime is expensive: murder costs 27,500 credits of bounty, piracy 8,000, pickpocketing 3,000.

## Weapons

[Balanced Ballistics](https://www.nexusmods.com/starfield/mods/8541) loads after [Royal Weapon Balance](https://www.nexusmods.com/starfield/mods/7856) and sets the feel of guns:

- Grendel deals 10 base damage (vanilla 3), Maelstrom 8 (vanilla 4), Kraken 7 (vanilla 3).
- Semi-auto, full-auto, burst and binary modes stay within 60 to 150 % of semi-auto damage (vanilla ranged from 33 to 367 %).
- Automatic ballistic weapons: more hip-fire recoil, wider cone of fire, more recoil per shot. You need to aim them.
- Laser weapons: recoil is practically gone, and full-auto no longer hurts accuracy. Equinox full-auto deals 65 % of semi-auto (vanilla 24 %), Solstice 55 % (vanilla 30 %).
- Shotguns kick more; slug rounds increase recoil instead of reducing it.

Other changes: weapons no longer snap back to center after recoil ([Realistic Recoil](https://www.nexusmods.com/starfield/mods/5770)), aim spread is lower when aiming ([Accurate Aiming](https://www.nexusmods.com/starfield/mods/5558), set in Gameplay Options), and grenades, mines and explosive objects deal much more damage ([Better Explosives](https://www.nexusmods.com/starfield/mods/9650)). Timed grenades hit harder than impact grenades. Enemy turrets now have to reload.

## Headshots and body parts

Three mods change where hits land:

- [Better Locational Damage](https://www.nexusmods.com/starfield/mods/13286): one shot to the head kills a human with no helmet. A helmeted enemy has "head health" that you must break first.
- [GRiNDTerra Gameplay Overhaul](https://www.nexusmods.com/starfield/mods/17670): humans take 4x damage to the head and 1.5x to the torso; creatures 2x head and 1.5x torso; Terrormorphs only 1.25x head and 0.75x torso; robots have no weak spot.
- [Locational Damage Overhaul](https://www.nexusmods.com/starfield/mods/5626): arms and legs take 0.75x, boost packs 0.5x, creature claws 0.5x.

## Melee, blocking and dodging

| Mechanic | Value | Source |
| --- | --- | --- |
| Block | Stops 90 % of melee damage (vanilla 50 %) | [Better Blocking](https://www.nexusmods.com/starfield/mods/4734) |
| Block cost | 15 % of the blocked damage + 5, taken from O2. With a full CO2 bar it costs health | Better Blocking |
| Power attack | Bonus 3.5 (vanilla 1) | Royal Galaxy |
| Dodge (Left Alt or double tap Sprint) | 40 O2, 0.3 s cooldown, 0.15 s invulnerable | [Dodge Framework SFSE](https://www.nexusmods.com/starfield/mods/16111) |
| Stagger | No first-person stagger from melee hits or explosions | [No Stagger Animation](https://www.nexusmods.com/starfield/mods/4494) |

[Starfield Revised - Player Speed](https://www.nexusmods.com/starfield/mods/10184) lets you run while blocking with a melee weapon; running is slower (about 87 % of vanilla) and walking faster (about +30 %).

## Enemy AI

- [Improved Combat AI](https://www.nexusmods.com/starfield/mods/1392): enemies shoot more, fire from cover, move more often, react faster, aim a bit better and throw more grenades. This also applies to your companions.
- GRiNDTerra: NPCs use cover, suppression and teamwork, flank and follow you further, fall back under fire, remember you longer and are alerted from further away by explosions, bodies and gunfire. Up to 125 NPCs can be in combat at the same time.
- Red Dog's AI upgrades give the Crimson Fleet, Ecliptic, Starborn, Spacers and Va'ruun Zealots their own behaviour.
- Bodies stay for 48 hours ([Longer Corpse Despawn](https://www.nexusmods.com/starfield/mods/3201)).
- There is no combat music, so listen for enemies.

## Spacesuits

[Suit Up](https://www.nexusmods.com/starfield/mods/12102) sorts every spacesuit into a category in the background. The summary of your equipped parts is in the Status Effects menu.

| Category | Built for |
| --- | --- |
| Recon | Long fights and space combat; combat enhancements, large O2 reserves |
| Assault | Short ground assaults; highest survivability, slower |
| Exploration | Long surveys; extreme filtration, harder to breathe |
| Utility | Blunt and puncture protection; clumsy weapon handling |
| Support | Ship repair and EVA; very light, heat and radiation protection |
| Piloting | Pilots; helmet improves ship handling and targeting |
| Otherworldly | All-rounders with high damage reduction and good O2 |

Heavier suits reduce damage and slow you; lighter ones move faster and breathe better. Recon and Assault suits get a speed boost in combat.

## Stealth

| Setting | Vanilla | This list | Effect |
| --- | --- | --- | --- |
| NPC view cone | 190 | 170 | They see less to the side |
| Noise when running while sneaking | 1.25x | 1.5x | Move slowly near enemies |
| Noise from equipped weight | 0 | 0.25 | Heavy gear is louder ([Stealth Overhaul](https://www.nexusmods.com/starfield/mods/819)) |
| Noise out of line of sight | 0.4x | 0.35x | Break line of sight to stay quiet |

With [Chameleon Improved](https://www.nexusmods.com/starfield/mods/5907) you can aim down sights while Chameleon, Concealment or Void Form are active. Takedowns are covered on the [Character]({{ '/extrasolar-containment-protocol/game-guide/character/' | relative_url }}) page.

## Crime and bounties

[Spacefaring Economy](https://www.nexusmods.com/starfield/mods/12022) raises the bounties:

| Crime | Vanilla | This list |
| --- | --- | --- |
| Murder | 15,000 | 27,500 |
| Piracy | 1,500 | 8,000 |
| Pickpocketing | 500 | 3,000 |
| Escaping jail | 1,500 | 2,500 |
| Assault | 650 | 1,200 |
| Trespassing | 350 | 700 |

Smuggling fines are also about four times higher. Ways out of trouble:

- **Surrender** to guards even when vanilla refuses: holster, use the surrender item, or power down all weapons in space ([Enhanced Surrender](https://www.nexusmods.com/starfield/mods/13793)).
- **Leave no witnesses** in space: destroy or board every witness ship before you leave the area and the bounty for that crime disappears, with no 30-second limit ([Leave No Witnesses](https://www.nexusmods.com/starfield/mods/12000)).
- **Wipe your record**: build a Lawbreaker Operations Console (Misc tab, ship or settlement) and use the data keys some faction NPCs carry (pickpocket or kill them) to delete your bounty with the UC, Freestar, Crimson Fleet or Va'ruun. The same console toggles Crimson Fleet membership and offers smuggling jobs ([LOC - Life of Crime](https://www.nexusmods.com/starfield/mods/16102)).
- **Take prisoners**: knocked-out or pacified NPCs can be sent to your ship's brig, one per bed, their gear going to your cargo ([Useful Brigs](https://www.nexusmods.com/starfield/mods/8139)).

</div>
<div lang="fr" markdown="1">

# Combat

{: .short }
> **En bref**
> - Pas d'aide à la visée. Les lasers n'ont presque plus de recul ; les armes balistiques automatiques reculent beaucoup plus sans viser.
> - Les tirs à la tête sont bien plus mortels : un ennemi sans casque peut tomber d'une seule balle.
> - Le blocage arrête 90 % des dégâts de mêlée mais coûte de l'oxygène ; le bonus des attaques puissantes passe de 1 à 3,5.
> - Les ennemis se mettent à couvert, vous contournent, reculent et lancent plus de grenades. Jusqu'à 125 PNJ peuvent combattre en même temps.
> - Discrétion : les ennemis voient dans un cône plus étroit, mais courir accroupi et porter un équipement lourd font plus de bruit.
> - Le crime coûte cher : un meurtre vaut 27 500 crédits de prime, la piraterie 8 000, le vol à la tire 3 000.

## Armes

[Balanced Ballistics](https://www.nexusmods.com/starfield/mods/8541) se charge après [Royal Weapon Balance](https://www.nexusmods.com/starfield/mods/7856) et donne le ton des armes :

- Le Grendel inflige 10 points de dégâts de base (3 en vanilla), le Maelstrom 8 (4), le Kraken 7 (3).
- Les modes semi-auto, auto, rafale et binaire restent entre 60 et 150 % des dégâts du semi-auto (de 33 à 367 % en vanilla).
- Armes balistiques automatiques : plus de recul sans viser, cône de tir plus large, plus de recul par tir. Il faut viser.
- Armes laser : le recul a pratiquement disparu et le tir automatique ne nuit plus à la précision. L'Equinox en automatique inflige 65 % des dégâts du semi-auto (24 % en vanilla), le Solstice 55 % (30 %).
- Les fusils à pompe reculent davantage ; les balles slug augmentent le recul au lieu de le réduire.

Autres changements : l'arme ne revient plus au centre après le recul ([Realistic Recoil](https://www.nexusmods.com/starfield/mods/5770)), la dispersion baisse en visée ([Accurate Aiming](https://www.nexusmods.com/starfield/mods/5558), réglable dans Gameplay Options), et grenades, mines et objets explosifs font beaucoup plus de dégâts ([Better Explosives](https://www.nexusmods.com/starfield/mods/9650)). Les grenades à retardement frappent plus fort que celles à impact. Les tourelles ennemies doivent maintenant recharger.

## Tirs à la tête et parties du corps

Trois mods changent l'effet de l'endroit touché :

- [Better Locational Damage](https://www.nexusmods.com/starfield/mods/13286) : une balle dans la tête tue un humain sans casque. Un ennemi casqué a une « santé de la tête » qu'il faut d'abord briser.
- [GRiNDTerra Gameplay Overhaul](https://www.nexusmods.com/starfield/mods/17670) : les humains subissent 4 fois plus de dégâts à la tête et 1,5 fois au torse ; les créatures 2 fois à la tête et 1,5 fois au torse ; les Terrormorphs seulement 1,25 fois à la tête et 0,75 fois au torse ; les robots n'ont pas de point faible.
- [Locational Damage Overhaul](https://www.nexusmods.com/starfield/mods/5626) : bras et jambes à 0,75, boost pack à 0,5, griffes des créatures à 0,5.

## Mêlée, blocage et esquive

| Mécanique | Valeur | Source |
| --- | --- | --- |
| Blocage | Arrête 90 % des dégâts de mêlée (50 % en vanilla) | [Better Blocking](https://www.nexusmods.com/starfield/mods/4734) |
| Coût du blocage | 15 % des dégâts bloqués + 5, pris sur l'O2. Avec la jauge de CO2 pleine, il coûte des points de vie | Better Blocking |
| Attaque puissante | Bonus de 3,5 (1 en vanilla) | Royal Galaxy |
| Esquive (Alt gauche ou double appui sur Sprint) | 40 d'O2, 0,3 s de recharge, 0,15 s d'invulnérabilité | [Dodge Framework SFSE](https://www.nexusmods.com/starfield/mods/16111) |
| Déséquilibre | Plus d'animation de déséquilibre en vue subjective après un coup ou une explosion | [No Stagger Animation](https://www.nexusmods.com/starfield/mods/4494) |

[Starfield Revised - Player Speed](https://www.nexusmods.com/starfield/mods/10184) permet de courir en bloquant avec une arme de mêlée ; la course est plus lente (environ 87 % de la vanilla) et la marche plus rapide (environ +30 %).

## IA ennemie

- [Improved Combat AI](https://www.nexusmods.com/starfield/mods/1392) : les ennemis tirent davantage, depuis un couvert, se déplacent plus souvent, réagissent plus vite, visent un peu mieux et lancent plus de grenades. Vos compagnons en profitent aussi.
- GRiNDTerra : les PNJ utilisent couverts, tirs de suppression et travail d'équipe, vous contournent et vous suivent plus loin, reculent sous le feu, se souviennent de vous plus longtemps et sont alertés de plus loin par les explosions, les corps et les coups de feu. Jusqu'à 125 PNJ peuvent être en combat en même temps.
- Les Red Dog's AI Upgrades donnent un comportement propre au Crimson Fleet, à Ecliptic, aux Starborn, aux Spacers et aux Zélotes Va'ruun.
- Les corps restent 48 heures ([Longer Corpse Despawn](https://www.nexusmods.com/starfield/mods/3201)).
- Il n'y a plus de musique de combat : écoutez les ennemis.

## Combinaisons spatiales

[Suit Up](https://www.nexusmods.com/starfield/mods/12102) classe chaque combinaison dans une catégorie, en arrière-plan. Le résumé des pièces équipées se trouve dans le menu Effets de statut.

| Catégorie | Conçue pour |
| --- | --- |
| Recon | Combats longs et combat spatial ; améliorations de combat, grandes réserves d'O2 |
| Assault | Assauts courts au sol ; meilleure survie, plus lente |
| Exploration | Longues prospections ; filtration extrême, respiration plus difficile |
| Utility | Protection contre les chocs et les perforations ; maniement des armes maladroit |
| Support | Réparations du vaisseau et sorties extravéhiculaires ; très légère, protège de la chaleur et des radiations |
| Piloting | Pilotes ; le casque améliore la maniabilité et le ciblage du vaisseau |
| Otherworldly | Polyvalentes, forte réduction des dégâts et bon O2 |

Les combinaisons lourdes réduisent les dégâts et vous ralentissent ; les légères vont plus vite et respirent mieux. Les Recon et Assault gagnent de la vitesse en combat.

## Discrétion

| Réglage | Vanilla | Cette liste | Effet |
| --- | --- | --- | --- |
| Cône de vision des PNJ | 190 | 170 | Ils voient moins sur les côtés |
| Bruit en courant accroupi | 1,25 | 1,5 | Avancez lentement près des ennemis |
| Bruit dû au poids équipé | 0 | 0,25 | Un équipement lourd est plus bruyant ([Stealth Overhaul](https://www.nexusmods.com/starfield/mods/819)) |
| Bruit hors ligne de vue | 0,4 | 0,35 | Cassez la ligne de vue pour rester discret |

Avec [Chameleon Improved](https://www.nexusmods.com/starfield/mods/5907), vous pouvez viser pendant Chameleon, Concealment ou Void Form. Les neutralisations sont traitées sur la page [Personnage]({{ '/extrasolar-containment-protocol/game-guide/character/' | relative_url }}).

## Crimes et primes

[Spacefaring Economy](https://www.nexusmods.com/starfield/mods/12022) relève les primes :

| Crime | Vanilla | Cette liste |
| --- | --- | --- |
| Meurtre | 15 000 | 27 500 |
| Piraterie | 1 500 | 8 000 |
| Vol à la tire | 500 | 3 000 |
| Évasion de prison | 1 500 | 2 500 |
| Agression | 650 | 1 200 |
| Intrusion | 350 | 700 |

Les amendes pour contrebande sont aussi environ quatre fois plus élevées. Pour vous sortir d'affaire :

- **Rendez-vous** aux gardes même quand le jeu de base refuse : rangez votre arme, utilisez l'objet de reddition, ou coupez l'énergie de toutes vos armes dans l'espace ([Enhanced Surrender](https://www.nexusmods.com/starfield/mods/13793)).
- **Ne laissez aucun témoin** dans l'espace : détruisez ou abordez chaque vaisseau témoin avant de quitter la zone, et la prime de ce crime disparaît, sans la limite de 30 secondes ([Leave No Witnesses](https://www.nexusmods.com/starfield/mods/12000)).
- **Effacez votre casier** : construisez une Lawbreaker Operations Console (onglet Misc, vaisseau ou colonie) et utilisez les clés de données que portent certains PNJ de faction (volez-les ou tuez-les) pour supprimer votre prime auprès des UC, du Freestar, du Crimson Fleet ou des Va'ruun. La même console permet de rejoindre ou quitter le Crimson Fleet et propose des missions de contrebande ([LOC - Life of Crime](https://www.nexusmods.com/starfield/mods/16102)).
- **Faites des prisonniers** : les PNJ assommés ou pacifiés peuvent être envoyés dans la cellule de votre vaisseau, un par lit, leur équipement rejoignant votre soute ([Useful Brigs](https://www.nexusmods.com/starfield/mods/8139)).

</div>
