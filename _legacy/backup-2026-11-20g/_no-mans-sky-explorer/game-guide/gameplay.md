---
layout: skyground_readme
title: Gameplay Changes
title_fr: Changements de gameplay
parent: Game Guide
nav_order: 2
---

<div lang="en" markdown="1">

# Gameplay Changes

{: .short }
> **In short**
> - Scans: analysis in a second or less, multi-tool pulse every second over 300 u, ship pulse every 0.25 s over 15000 u.
> - Mining: the Optical Drill yield is boosted, the terrain manipulator gives more per node, and mining beam drops are doubled.
> - Storage: much bigger stacks, up to 99 tech slots on S-class ships and multi-tools, refiners 10 times faster.
> - Teleporters cost 50 Navigation Data per use.
> - Danger is up: tougher Sentinels, harder asteroids, extreme gas giants, more space encounters.
> - Worlds: 500 new biomes, oceans on every lush world, almost none on desert and scorched worlds.

## Scanning and finding sites

| What | With the list | Mod |
| --- | --- | --- |
| Analysis visor scan | about 1 s or less, no wait between scans | [Faster Scanning](https://www.nexusmods.com/nomanssky/mods/2284), [Quick Scan with Range Boost](https://www.nexusmods.com/nomanssky/mods/1198) |
| Multi-tool scanner pulse | 300 u range, recharges in 1 s | Quick Scan with Range Boost |
| Ship scanner pulse | 15000 u range, recharges in 0.25 s | Quick Scan with Range Boost |
| Survey range | 1000 u (vanilla 400) | Quick Scan with Range Boost |
| Resource scan range | 2000 u (vanilla 1200) | Quick Scan with Range Boost |
| Zoomed visor | no walking penalty, scans up to 1000 u at the top zoom | Quick Scan with Range Boost |
| Unknown buildings | detected from much further away (at least 4800 u instead of 600), and a ship scan reveals 1 to 4 buildings | [Better Buildings Scans](https://www.nexusmods.com/nomanssky/mods/1259) |

Other ways to find things:

- **Quick actions**: the emote menu gets "Locate" entries for portals, crashed ships, sentinel pillars, monoliths, trading posts, minor settlements, Autophage camps, living ships, organic frigates, derelict freighters and Sentinel ships and multi-tools ([Ship Hunting Quick Actions](https://www.nexusmods.com/nomanssky/mods/2476)).
- **Signal Scanner and ship scans**: [Galactic Positioning System](https://www.nexusmods.com/nomanssky/mods/2144) searches the nearest point of interest by category, exact type or planet biome. The freighter's Fleet Manager adds deep space scans of other systems. Costs and tech requirements can be set in game, per save.
- **Exocraft scanner**: lists almost every site type, see [Ships and Vehicles]({{ '/no-mans-sky-explorer/game-guide/ships-and-vehicles/' | relative_url }}).

Loot is no longer in the same place every time: crashed freighter containers are placed at random ([Crashed Freighter Procedural Containers](https://www.nexusmods.com/nomanssky/mods/2653)), and treasure ruins show only 3 keys and use 4 chest positions ([Treasure Ruin Procedural Crates](https://www.nexusmods.com/nomanssky/mods/2662)). Use the scanner.

## Mining and resources

- **Hand mining**: [Mining Multiplier](https://www.nexusmods.com/nomanssky/mods/3647) raises the Optical Drill's yield. Without the Optical Drill installed, it does nothing. Ship weapons are not affected.
- **Mining beam drops**: [Better Rewards](https://www.nexusmods.com/nomanssky/mods/1460) doubles resources from the mining beam, containers, depots, guild rewards, asteroids and ships that drop resources.
- **Terrain manipulator**: both Mining Multiplier and Better Rewards raise what a resource node gives.
- **Huge props**: giant trees and rocks can be shot, destroyed and scanned like normal ones ([Huge Props Activated](https://www.nexusmods.com/nomanssky/mods/2989)).
- **Asteroids**: lone asteroids are gone; mineable asteroids are bigger and sit inside regular fields ([Asteroid Fields](https://www.nexusmods.com/nomanssky/mods/1148)).

## Inventory and storage

Stack sizes depend on the inventory difficulty you pick (table in [First Hours]({{ '/no-mans-sky-explorer/game-guide/first-hours/' | relative_url }})). On Normal, an exosuit slot holds 5000 of a substance and a freighter slot 20000.

Maximum slots after upgrades, from [More Upgradeable Slots](https://www.nexusmods.com/nomanssky/mods/2299):

| Class | Multi-tool | Ship tech | Freighter tech |
| --- | --- | --- | --- |
| C | 33 | 33 | 33 |
| B | 55 | 55 | 55 |
| A | 77 | 77 | 77 |
| S | 99 | 99 | 99 |

Ship and freighter cargo goes up to 120 slots, exocraft up to 120 cargo and 60 tech.

{: .warning }
If More Upgradeable Slots is ever missing or broken by a game update, the extra slots and what is in them are deleted. After a game update, check the [Changelog]({{ '/no-mans-sky-explorer/changelog/' | relative_url }}) before loading a save.

## Refining, crafting and building

- Refiners (portable, medium, large) and the Nutrient Processor are **10 times faster** ([Fast Refiners](https://www.nexusmods.com/nomanssky/mods/2016)), and the refiner has min and max buttons for the amount ([Refiner Min-Max Buttons](https://www.nexusmods.com/nomanssky/mods/2542)).
- The Catalogue lists every refiner and cooking recipe, see [Interface]({{ '/no-mans-sky-explorer/game-guide/interface/' | relative_url }}).
- Shops stock 10 times more of each product ([More Materials](https://www.nexusmods.com/nomanssky/mods/2285), products version). Raw substances are unchanged.
- Base building: parts can be placed right next to you ([Easy Build](https://www.nexusmods.com/nomanssky/mods/2318)), the build camera reaches 2000 u ([New Boundaries](https://www.nexusmods.com/nomanssky/mods/1557)), and industry buildings (refiners, extractors, generators, batteries, depots) snap to each other and to floor panels ([Snappy Industry](https://www.nexusmods.com/nomanssky/mods/2113)). Its author warns that scaling a part breaks snapping.
- The Antimatter Reactor can be built in any freighter Extension Room again ([Build the Antimatter Reactor on your Freighter](https://www.nexusmods.com/nomanssky/mods/3444)).

## Moving around

| What | With the list |
| --- | --- |
| Walk / run | 7 / 12 (vanilla speed x1.6 / x1.5), faster in low gravity too |
| Slopes | you slide down instead of being slowed |
| Ship transfer range | 200 m from your ship (vanilla 50) |
| Ship take-off | about 10% of the launch fuel tank per launch |

The [Ships and Vehicles]({{ '/no-mans-sky-explorer/game-guide/ships-and-vehicles/' | relative_url }}) page covers flight, docking and exocraft.

## Teleporters cost Navigation Data

[Immersive Teleport (Hardcore)](https://www.nexusmods.com/nomanssky/mods/4062) puts a price of **50 Navigation Data** on:

- base teleporters,
- space station teleporters,
- the Space Anomaly (Nexus) teleporter,
- the freighter teleporter room.

Navigation Data also buys charts from the cartographer (3 to 15 each, see [Missions and Rewards]({{ '/no-mans-sky-explorer/game-guide/missions-and-rewards/' | relative_url }})). Collect it whenever you find it, and plan trips so that the starship or freighter does most of the travel.

## Dangers

- **Sentinels** ([Savage Sentinels](https://www.nexusmods.com/nomanssky/mods/1275)): they decide to fire much faster, aim better, are stronger and can be more numerous; drones are a real threat. In multiplayer with players who do not have the mod, drones can desync.
- **Asteroids** ([Asteroid Hits](https://www.nexusmods.com/nomanssky/mods/1165)): 50 / 75 / 100 damage for small / medium / large (vanilla 5 / 15 / 40).
- **Gas giants** ([Actually Extreme Gas Giants](https://www.nexusmods.com/nomanssky/mods/4613)): hazard at extreme-storm level, scaled by Survival Difficulty.
- **Space encounters** ([Increase Space Encounter Chance](https://www.nexusmods.com/nomanssky/mods/1874), 1.5x version): pulse drive encounters happen 1.5 times as often, and their name is shown when you hit one ([Transparent Space Encounters](https://www.nexusmods.com/nomanssky/mods/2463)).
- **Roaming traders** ([Unpredictable Roaming Ships](https://www.nexusmods.com/nomanssky/mods/2307)): groups of 0 to 5 ships, more spread out, sometimes late.

## The worlds

- **[Nomad Biomes](https://www.nexusmods.com/nomanssky/mods/4696)**: 500 custom biomes covering every planet type, with plants and props grouped the way they would grow. Its readme asks you to save at a space station before adding or removing it.
- **Water**: lush worlds always have oceans, except lush moons outside purple systems ([Lush Always Have Water](https://www.nexusmods.com/nomanssky/mods/4614)). Desert and scorched worlds have oceans only 5% of the time ([Waterless Hot n Dry Planets](https://www.nexusmods.com/nomanssky/mods/4612)).
- **Shelters** have 1 to 3 shacks and vary their layout ([Unpredictable Shelters](https://www.nexusmods.com/nomanssky/mods/2308)). Its author notes it changes the seed of some items (multi-tools, trade lists), so online seed databases may not match.
- **Look and sound**: Lunatus (planet lighting, haze, darker nights), Nubilus (clouds), Stellarum (space sky colours), No Man's Sound and the ANALOGUE exosuit voice. Ground objects use a 10x draw distance, which its author labels the high-end option.

</div>
<div lang="fr" markdown="1">

# Changements de gameplay

{: .short }
> **En bref**
> - Analyse : une seconde ou moins, impulsion du multi-outil chaque seconde sur 300 u, impulsion du vaisseau toutes les 0,25 s sur 15000 u.
> - Minage : le rendement de la Foreuse optique est augmenté, le Manipulateur de terrain donne plus par gisement, et les ressources du rayon minier sont doublées.
> - Stockage : piles bien plus grandes, jusqu'à 99 emplacements de technologie sur les vaisseaux et multi-outils de classe S, raffineurs 10 fois plus rapides.
> - Les téléporteurs coûtent 50 Données de navigation par utilisation.
> - Plus de danger : Sentinelles plus coriaces, astéroïdes plus durs, géantes gazeuses extrêmes, plus de rencontres spatiales.
> - Mondes : 500 nouveaux biomes, des océans sur tous les mondes luxuriants, presque aucun sur les mondes désertiques et brûlés.

## Analyse et recherche de sites

| Quoi | Avec la liste | Mod |
| --- | --- | --- |
| Analyse de la visière | environ 1 s ou moins, sans attente entre deux analyses | [Faster Scanning](https://www.nexusmods.com/nomanssky/mods/2284), [Quick Scan with Range Boost](https://www.nexusmods.com/nomanssky/mods/1198) |
| Impulsion du scanner du multi-outil | portée 300 u, recharge en 1 s | Quick Scan with Range Boost |
| Impulsion du scanner du vaisseau | portée 15000 u, recharge en 0,25 s | Quick Scan with Range Boost |
| Portée de prospection | 1000 u (400 de base) | Quick Scan with Range Boost |
| Portée de détection des ressources | 2000 u (1200 de base) | Quick Scan with Range Boost |
| Visière zoomée | aucune pénalité de marche, analyse jusqu'à 1000 u au zoom maximal | Quick Scan with Range Boost |
| Bâtiments inconnus | détectés de beaucoup plus loin (au moins 4800 u au lieu de 600), et une analyse depuis le vaisseau révèle de 1 à 4 bâtiments | [Better Buildings Scans](https://www.nexusmods.com/nomanssky/mods/1259) |

Autres moyens de trouver des choses :

- **Actions rapides** : le menu des emotes reçoit des entrées « Locate » pour les portails, vaisseaux écrasés, piliers des Sentinelles, monolithes, comptoirs commerciaux, petites colonies, camps autophages, vaisseaux vivants, frégates organiques, cargos abandonnés, vaisseaux et multi-outils des Sentinelles ([Ship Hunting Quick Actions](https://www.nexusmods.com/nomanssky/mods/2476)).
- **Scanner de signal et analyses du vaisseau** : [Galactic Positioning System](https://www.nexusmods.com/nomanssky/mods/2144) cherche le point d'intérêt le plus proche par catégorie, par type exact ou par biome de planète. Le gestionnaire de flotte du cargo ajoute des analyses de l'espace lointain vers d'autres systèmes. Les coûts et technologies requises se règlent en jeu, par sauvegarde.
- **Scanner des exovéhicules** : il liste presque tous les types de sites, voir [Vaisseaux et véhicules]({{ '/no-mans-sky-explorer/game-guide/ships-and-vehicles/' | relative_url }}).

Le butin n'est plus toujours au même endroit : les conteneurs des cargos écrasés sont placés au hasard ([Crashed Freighter Procedural Containers](https://www.nexusmods.com/nomanssky/mods/2653)), et les ruines au trésor ne montrent que 3 clés et utilisent 4 positions de coffre ([Treasure Ruin Procedural Crates](https://www.nexusmods.com/nomanssky/mods/2662)). Servez-vous du scanner.

## Minage et ressources

- **Minage à la main** : [Mining Multiplier](https://www.nexusmods.com/nomanssky/mods/3647) augmente le rendement de la Foreuse optique. Sans elle, il ne fait rien. Les armes du vaisseau ne sont pas concernées.
- **Rayon minier** : [Better Rewards](https://www.nexusmods.com/nomanssky/mods/1460) double les ressources du rayon minier, des conteneurs, des dépôts, des récompenses de guilde, des astéroïdes et des vaisseaux qui lâchent des ressources.
- **Manipulateur de terrain** : Mining Multiplier et Better Rewards augmentent tous deux ce que donne un gisement.
- **Accessoires géants** : les arbres et rochers géants se tirent, se détruisent et s'analysent comme les autres ([Huge Props Activated](https://www.nexusmods.com/nomanssky/mods/2989)).
- **Astéroïdes** : les astéroïdes isolés disparaissent ; ceux qu'on peut miner sont plus gros et se trouvent dans les champs habituels ([Asteroid Fields](https://www.nexusmods.com/nomanssky/mods/1148)).

## Inventaire et stockage

La taille des piles dépend de la difficulté d'inventaire choisie (tableau dans [Premières heures]({{ '/no-mans-sky-explorer/game-guide/first-hours/' | relative_url }})). En Normal, un emplacement d'exocombinaison contient 5000 d'une substance et un emplacement de cargo 20000.

Nombre maximal d'emplacements après améliorations, d'après [More Upgradeable Slots](https://www.nexusmods.com/nomanssky/mods/2299) :

| Classe | Multi-outil | Technologie du vaisseau | Technologie du cargo |
| --- | --- | --- | --- |
| C | 33 | 33 | 33 |
| B | 55 | 55 | 55 |
| A | 77 | 77 | 77 |
| S | 99 | 99 | 99 |

La cargaison des vaisseaux et du cargo monte jusqu'à 120 emplacements, celle des exovéhicules jusqu'à 120, avec 60 emplacements de technologie.

{: .warning }
Si More Upgradeable Slots vient à manquer ou est cassé par une mise à jour du jeu, les emplacements en plus et leur contenu sont supprimés. Après une mise à jour du jeu, consultez le [Journal des modifications]({{ '/no-mans-sky-explorer/changelog/' | relative_url }}) avant de charger une sauvegarde.

## Raffinage, fabrication et construction

- Les raffineurs (portable, moyen, grand) et le processeur nutritif sont **10 fois plus rapides** ([Fast Refiners](https://www.nexusmods.com/nomanssky/mods/2016)), et le raffineur a des boutons min et max pour la quantité ([Refiner Min-Max Buttons](https://www.nexusmods.com/nomanssky/mods/2542)).
- Le Catalogue liste toutes les recettes de raffinage et de cuisine, voir [Interface]({{ '/no-mans-sky-explorer/game-guide/interface/' | relative_url }}).
- Les boutiques ont 10 fois plus de chaque produit en stock ([More Materials](https://www.nexusmods.com/nomanssky/mods/2285), version produits). Les substances brutes ne changent pas.
- Construction de base : les pièces se posent juste à côté de vous ([Easy Build](https://www.nexusmods.com/nomanssky/mods/2318)), la caméra de construction va jusqu'à 2000 u ([New Boundaries](https://www.nexusmods.com/nomanssky/mods/1557)), et les bâtiments industriels (raffineurs, extracteurs, générateurs, batteries, dépôts) s'emboîtent entre eux et sur les dalles de sol ([Snappy Industry](https://www.nexusmods.com/nomanssky/mods/2113)). Son auteur prévient que redimensionner une pièce casse l'emboîtement.
- Le réacteur à antimatière se construit de nouveau dans n'importe quelle salle d'extension du cargo ([Build the Antimatter Reactor on your Freighter](https://www.nexusmods.com/nomanssky/mods/3444)).

## Se déplacer

| Quoi | Avec la liste |
| --- | --- |
| Marche / course | 7 / 12 (vitesse de base x1,6 / x1,5), plus rapide aussi en faible gravité |
| Pentes | vous glissez au lieu d'être ralenti |
| Portée de transfert vers le vaisseau | 200 m autour du vaisseau (50 de base) |
| Décollage | environ 10 % du réservoir de carburant de décollage par décollage |

La page [Vaisseaux et véhicules]({{ '/no-mans-sky-explorer/game-guide/ships-and-vehicles/' | relative_url }}) traite du vol, de l'amarrage et des exovéhicules.

## Les téléporteurs coûtent des Données de navigation

[Immersive Teleport (Hardcore)](https://www.nexusmods.com/nomanssky/mods/4062) fixe un prix de **50 Données de navigation** pour :

- les téléporteurs de base,
- les téléporteurs des stations spatiales,
- le téléporteur de l'Anomalie spatiale (Nexus),
- la salle de téléportation du cargo.

Les Données de navigation servent aussi à acheter les cartes du cartographe (de 3 à 15 chacune, voir [Missions et récompenses]({{ '/no-mans-sky-explorer/game-guide/missions-and-rewards/' | relative_url }})). Ramassez-les dès que vous en trouvez, et organisez vos trajets pour que le vaisseau ou le cargo fasse l'essentiel du voyage.

## Dangers

- **Sentinelles** ([Savage Sentinels](https://www.nexusmods.com/nomanssky/mods/1275)) : elles décident de tirer bien plus vite, visent mieux, sont plus fortes et peuvent être plus nombreuses ; les drones deviennent une vraie menace. En multijoueur avec des joueurs qui n'ont pas le mod, les drones peuvent se désynchroniser.
- **Astéroïdes** ([Asteroid Hits](https://www.nexusmods.com/nomanssky/mods/1165)) : 50 / 75 / 100 dégâts pour petit / moyen / grand (5 / 15 / 40 de base).
- **Géantes gazeuses** ([Actually Extreme Gas Giants](https://www.nexusmods.com/nomanssky/mods/4613)) : danger au niveau d'une tempête extrême, ajusté par la difficulté de survie.
- **Rencontres spatiales** ([Increase Space Encounter Chance](https://www.nexusmods.com/nomanssky/mods/1874), version 1.5x) : les rencontres en moteur à impulsion arrivent 1,5 fois plus souvent, et leur nom s'affiche quand vous en touchez une ([Transparent Space Encounters](https://www.nexusmods.com/nomanssky/mods/2463)).
- **Marchands de passage** ([Unpredictable Roaming Ships](https://www.nexusmods.com/nomanssky/mods/2307)) : groupes de 0 à 5 vaisseaux, plus dispersés, parfois en retard.

## Les mondes

- **[Nomad Biomes](https://www.nexusmods.com/nomanssky/mods/4696)** : 500 biomes sur mesure pour tous les types de planètes, avec plantes et décors regroupés comme ils pousseraient. Son readme demande d'enregistrer dans une station spatiale avant de l'ajouter ou de le retirer.
- **Eau** : les mondes luxuriants ont toujours des océans, sauf les lunes luxuriantes hors des systèmes violets ([Lush Always Have Water](https://www.nexusmods.com/nomanssky/mods/4614)). Les mondes désertiques et brûlés n'ont des océans que 5 % du temps ([Waterless Hot n Dry Planets](https://www.nexusmods.com/nomanssky/mods/4612)).
- **Abris** : de 1 à 3 cabanes, disposées différemment ([Unpredictable Shelters](https://www.nexusmods.com/nomanssky/mods/2308)). Son auteur signale qu'il change la graine de certains objets (multi-outils, listes des marchands) : les bases de données de graines en ligne peuvent ne plus correspondre.
- **Image et son** : Lunatus (éclairage des planètes, brume, nuits plus sombres), Nubilus (nuages), Stellarum (couleurs du ciel spatial), No Man's Sound et la voix d'exocombinaison ANALOGUE. Les objets au sol ont une distance d'affichage x10, l'option que son auteur réserve aux machines puissantes.

</div>
