---
layout: skyground_readme
title: Survival
title_fr: Survie
parent: Game Guide
nav_order: 5
---

<div lang="en" markdown="1">

# Survival

{: .short }
> **In short**
> - Your pack holds a limited O2 reserve outside breathable air. Running, bad weather and combat drain it faster; it refills as soon as you are back in air.
> - Suit protection and environmental damage no longer regenerate by themselves: use a Decontamination Station, injectors or a doctor.
> - 75 in the matching resistance makes a hostile planet safe indefinitely (for example 75 thermal on a Deep Freeze world).
> - Hunger, thirst and fatigue move in stages: hunger every 8 hours, thirst every 5, fatigue every 14. Sleep 8 hours somewhere safe to wake up Refreshed.
> - Food buffs you before a fight instead of healing you during it.
> - Gravity changes what your items weigh, and what you carry changes how fast you move and breathe.

## Oxygen and CO2

The list ships three oxygen mods. Each one has its own setting, so look at them on a new game and keep the behaviour you want.

### Real O2: a reserve in your pack

[Real O2](https://www.nexusmods.com/starfield/mods/12303) gives your pack a fixed amount of O2 when the air is not breathable.

- Pack categories: Survival (just enough to avoid instant death), Balanced (short walks, vehicles), Standard (fights, light exploration), Exploration (long expeditions). Swapping packs in vacuum costs most of your reserve.
- Drain: a constant rate, plus running and sprinting, plus extreme weather and combat adrenaline. Boost jumps in zero atmosphere use O2 (can be turned off).
- Simulation mode adds punctures (gunfire or bites drain O2 at once) and blocks fast travel while you draw on the reserve. Streamlined mode removes those extras.
- At very low O2 you take environmental damage. Get out with breathable air, Personal Atmosphere, or an Emergency Reserve.
- Back in breathable air, O2 refills to full. Vehicles regenerate it slowly.
- Crafting: Heliox (pharmaceutical bench), Emergency Reserves (industrial bench), Experimental Scrubbers pack mod, Hypercure Sealant suit mod.

### Atmo: regeneration and CO2

[Atmo](https://www.nexusmods.com/starfield/mods/17543) runs while your suit and helmet are on and shown (default), or only in unbreathable atmosphere.

| Condition | Effect |
| --- | --- |
| O2 falling | O2 recovery rate down by up to 60 % |
| O2 under 10 % | Sprint speed -20 %, jump height -60 % |
| While Atmo is running | CO2 recovery rate -60 % |
| Hits, running, sprinting, sneaking | CO2 builds up over time |
| Sliding, mantling | Instant CO2 gain |
| Heliox | Restores O2 and stops CO2 buildup for a while |

{{ site.data.gauges.ecp_o2 | gauge: 'en' }}

When O2 recovery is too low to refill, you enter **Rebreather Overload** and your watch warns you.

### Deadly Hazards oxygen

[Deadly Hazards](https://www.nexusmods.com/starfield/mods/5800) also has an oxygen module where you can run out and suffocate, with its own items and research. It is configured from an in-game item.

{: .note }
The list makes sprinting cost 25 % less O2 than vanilla, and a dodge costs 40 O2. Blocking a melee hit also takes O2.

## Hazards, suits and resistances

[Extremophile](https://www.nexusmods.com/starfield/mods/15601) changes how hostile planets wear you down:

- Suit protection and environmental damage **do not regenerate** on their own.
- To restore suit protection, build a **Decontamination Station** on your ship or at an outpost.
- To heal environmental damage, use an **injector**: it enables natural healing while you rest or wait. Boosted injectors heal about 30 % at once. Rejuvenation rank 3 allows passive healing, and a doctor removes it all when curing afflictions.
- **Threshold damage** starts once 25 % of your suit protection is gone in extreme weather or planet conditions. 75 in the matching resistance cancels it, for example 75 thermal to stay on a Deep Freeze world.
- **Threshold Resist** comes from the sum of your resistances and reduces threshold damage from 15 % to 85 %. With 50 in each resistance (200 out of 400) you take 50 % less.
- Maximum suit protection is 150 (vanilla 100), 250 with Environmental Conditioning rank 2.
- Removing your helmet in the wrong place will probably kill you.

{{ site.data.gauges.ecp_suit | gauge: 'en' }}

[Deadly Hazards](https://www.nexusmods.com/starfield/mods/5800) adds the rest: temperatures matter with and without a suit, a planet's magnetosphere sets how strong solar radiation is, atmospheric pressure counts, and you can shelter from solar radiation under a roof or in a cave. Its settings are in the in-game menu it adds. Wearing a spacesuit protects you from lung damage caused by poor air quality and toxic gas, but not from corrosive gas ([No Lung Damage While Wearing Space Suit](https://www.nexusmods.com/starfield/mods/6073)).

{: .tip }
Your choice of suit matters here too. Exploration suits filter extremely well, Support suits resist heat and radiation, Assault and Utility suits trade comfort for protection. See [Combat]({{ '/extrasolar-containment-protocol/game-guide/combat/' | relative_url }}).

## Hunger, thirst and fatigue

[Peak Performance](https://www.nexusmods.com/starfield/mods/12420) starts after your first sleep.

{{ site.data.gauges.ecp_needs | gauge: 'en' }}

- Sleep at least 8 hours in a safe place to wake up **Refreshed**.
- Food comes in Filling, Normal and Poor. Alien food only suits characters with alien DNA, and the other way round; some backgrounds and skills soften this.
- Coffee and some teas are weak stimulants that restore fatigue; strong stimulants also add some thirst. Alcohol raises intoxication and quenches less.
- **Hygiene** slightly affects persuasion and stealth. Build a shower on your ship (Decorate menu) or use Sani-wipes.
- In dangerous places you enter **Tension**: needs stop progressing, then catch up with a penalty when you leave. Plan your supplies before a long dungeon.
- Eating or drinking several things in a row has a reduced effect. Auto-consumption can be turned on; rates can be changed.

### Food and drink

[Gluttony](https://www.nexusmods.com/starfield/mods/14202) changes what food is for:

- Food and drink no longer restore health directly.
- Food gives +5, 10, 15 or 20 % health for 30 minutes, depending on its tier. This does not stack.
- Alcohol gives +5, 10, 15 or 20 % persuasion for 15 minutes.
- Some non-alcoholic drinks boost O2.
- Produce and butter give no benefit: they are cooking ingredients. Crafted meals are the reliable way to the 20 % tier.

Your crew eats too ([Crew Eats Food](https://www.nexusmods.com/starfield/mods/12100)); premium meals give them a small XP bonus.

## Healing

- **Ship infirmary**: assign a crew member with the Medical perk, then sit in the surgical chair to heal and cure afflictions ([Functional Ship Infirmaries](https://www.nexusmods.com/starfield/mods/6386)). In vanilla, Rosie Tannehill at the Hitching Post in Akila City has the perk.
- **Doctors** charge according to [Dynamic Medical Bill 2.0](https://www.nexusmods.com/starfield/mods/13861).
- A med kit or chem kit drop in loot has a 30 % chance to be empty (vanilla: never).

## Weight, gravity and movement

- Item weights follow gravity: things weigh more on heavy worlds and less on light ones ([Gravity Affects Weight](https://www.nexusmods.com/starfield/mods/3048)).
- [Mass Matters](https://www.nexusmods.com/starfield/mods/16044): at 1 G and half your carry capacity you move at 100 % speed. Less load or lower gravity makes you faster, more makes you slower. Your load also changes O2 use, reload speed and recoil drift in zero G. Overencumbered means 50 % speed.
- Weight Lifting gives up to +200 kg (see [Character]({{ '/extrasolar-containment-protocol/game-guide/character/' | relative_url }})).

## Time

[Configurable Timescale](https://www.nexusmods.com/starfield/mods/12601) sets how fast time passes, in Gameplay Options: by default 5 in-game hours per real hour in space and 15 on the ground. A change applies after a load door, fast travel or grav jump. You can wait or sleep up to 96 hours at once.

</div>
<div lang="fr" markdown="1">

# Survie

{: .short }
> **En bref**
> - Hors d'un air respirable, votre pack contient une réserve d'O2 limitée. Courir, les intempéries et le combat la vident plus vite ; elle se remplit dès que vous retrouvez de l'air.
> - La protection de la combinaison et les dégâts environnementaux ne se régénèrent plus seuls : station de décontamination, injecteurs ou médecin.
> - 75 dans la résistance adaptée rend une planète hostile sûre sans limite de temps (par exemple 75 thermique sur un monde de type Deep Freeze).
> - Faim, soif et fatigue avancent par paliers : la faim toutes les 8 heures, la soif toutes les 5, la fatigue toutes les 14. Dormez 8 heures en lieu sûr pour vous réveiller Refreshed.
> - La nourriture vous renforce avant un combat au lieu de vous soigner pendant.
> - La gravité change le poids de vos objets, et votre charge change votre vitesse et votre respiration.

## Oxygène et CO2

La liste contient trois mods d'oxygène. Chacun a son propre réglage : regardez-les en début de partie et gardez le comportement qui vous convient.

### Real O2 : une réserve dans votre pack

[Real O2](https://www.nexusmods.com/starfield/mods/12303) donne à votre pack une quantité fixe d'O2 quand l'air n'est pas respirable.

- Catégories de pack : Survival (juste de quoi éviter la mort immédiate), Balanced (courtes marches, véhicules), Standard (combats, exploration légère), Exploration (longues expéditions). Changer de pack dans le vide coûte l'essentiel de la réserve.
- Consommation : un débit constant, plus la course et le sprint, plus les intempéries extrêmes et l'adrénaline du combat. Les sauts au boost pack sans atmosphère consomment de l'O2 (désactivable).
- Le mode Simulation ajoute les perforations (un tir ou une morsure vide d'un coup une partie de l'O2) et bloque le voyage rapide pendant que vous puisez dans la réserve. Le mode Streamlined retire ces extras.
- Avec très peu d'O2, vous subissez des dégâts environnementaux. Pour vous en sortir : un air respirable, Personal Atmosphere ou une Emergency Reserve.
- De retour dans un air respirable, l'O2 se remplit entièrement. Les véhicules le régénèrent lentement.
- Fabrication : Heliox (établi pharmaceutique), Emergency Reserves (établi industriel), mod de pack Experimental Scrubbers, mod de combinaison Hypercure Sealant.

### Atmo : régénération et CO2

[Atmo](https://www.nexusmods.com/starfield/mods/17543) s'active quand votre combinaison et votre casque sont portés et visibles (par défaut), ou seulement dans une atmosphère irrespirable.

| Situation | Effet |
| --- | --- |
| L'O2 baisse | Récupération d'O2 réduite jusqu'à 60 % |
| O2 sous 10 % | Vitesse de sprint -20 %, hauteur de saut -60 % |
| Tant qu'Atmo tourne | Récupération du CO2 -60 % |
| Coups reçus, course, sprint, déplacement accroupi | Le CO2 monte peu à peu |
| Glissade, escalade | Hausse immédiate du CO2 |
| Heliox | Rend de l'O2 et bloque la hausse du CO2 un moment |

{{ site.data.gauges.ecp_o2 | gauge: 'fr' }}

Quand la récupération d'O2 ne suffit plus, vous passez en **Rebreather Overload** et votre montre vous prévient.

### L'oxygène de Deadly Hazards

[Deadly Hazards](https://www.nexusmods.com/starfield/mods/5800) a lui aussi un module d'oxygène où vous pouvez manquer d'air et suffoquer, avec ses propres objets et recherches. Il se règle depuis un objet en jeu.

{: .note }
La liste rend le sprint 25 % moins coûteux en O2 qu'en vanilla, et une esquive coûte 40 d'O2. Bloquer un coup de mêlée prend aussi de l'O2.

## Dangers, combinaisons et résistances

[Extremophile](https://www.nexusmods.com/starfield/mods/15601) change la manière dont les planètes hostiles vous usent :

- La protection de la combinaison et les dégâts environnementaux **ne se régénèrent pas** seuls.
- Pour restaurer la protection, construisez une **station de décontamination** dans votre vaisseau ou un avant-poste.
- Pour soigner les dégâts environnementaux, utilisez un **injecteur** : il permet une guérison naturelle pendant le repos ou l'attente. Les injecteurs renforcés soignent environ 30 % d'un coup. Le rang 3 de Rejuvenation permet une guérison passive, et un médecin efface tout en soignant vos afflictions.
- Les **dégâts de seuil** commencent quand 25 % de la protection de la combinaison est perdue, sous une météo ou des conditions extrêmes. 75 dans la résistance adaptée les annule, par exemple 75 thermique pour rester sur un monde Deep Freeze.
- Le **Threshold Resist** vient de la somme de vos résistances et réduit les dégâts de seuil de 15 à 85 %. Avec 50 dans chaque résistance (200 sur 400), vous en subissez 50 % de moins.
- La protection maximale de la combinaison est de 150 (100 en vanilla), 250 avec le rang 2 d'Environmental Conditioning.
- Retirer votre casque au mauvais endroit vous tuera probablement.

{{ site.data.gauges.ecp_suit | gauge: 'fr' }}

[Deadly Hazards](https://www.nexusmods.com/starfield/mods/5800) ajoute le reste : la température compte avec et sans combinaison, la magnétosphère d'une planète fixe la force des radiations solaires, la pression atmosphérique entre en jeu, et vous pouvez vous abriter des radiations solaires sous un toit ou dans une grotte. Ses réglages se trouvent dans le menu qu'il ajoute en jeu. Porter une combinaison vous protège des lésions pulmonaires dues à l'air vicié et aux gaz toxiques, mais pas aux gaz corrosifs ([No Lung Damage While Wearing Space Suit](https://www.nexusmods.com/starfield/mods/6073)).

{: .tip }
Le choix de la combinaison compte ici aussi. Les combinaisons Exploration filtrent très bien, les Support résistent à la chaleur et aux radiations, les Assault et Utility échangent le confort contre la protection. Voir [Combat]({{ '/extrasolar-containment-protocol/game-guide/combat/' | relative_url }}).

## Faim, soif et fatigue

[Peak Performance](https://www.nexusmods.com/starfield/mods/12420) démarre après votre premier sommeil.

{{ site.data.gauges.ecp_needs | gauge: 'fr' }}

- Dormez au moins 8 heures en lieu sûr pour vous réveiller **Refreshed**.
- La nourriture se classe en Filling, Normal et Poor. La nourriture extraterrestre ne convient qu'aux personnages à l'ADN extraterrestre, et inversement ; certains passés et compétences atténuent cet effet.
- Le café et certains thés sont des stimulants légers qui réduisent la fatigue ; les stimulants forts donnent aussi un peu soif. L'alcool augmente l'ivresse et désaltère moins.
- L'**hygiène** joue un peu sur la persuasion et la discrétion. Construisez une douche dans votre vaisseau (menu Décoration) ou utilisez des Sani-wipes.
- Dans les lieux dangereux, vous passez en **Tension** : vos besoins n'avancent plus, puis se rattrapent avec une pénalité à la sortie. Prévoyez vos provisions avant un long donjon.
- Manger ou boire plusieurs choses à la suite a un effet réduit. La consommation automatique peut être activée ; les rythmes sont réglables.

### Nourriture et boissons

[Gluttony](https://www.nexusmods.com/starfield/mods/14202) change le rôle de la nourriture :

- La nourriture et les boissons ne rendent plus de santé directement.
- La nourriture donne +5, 10, 15 ou 20 % de santé pendant 30 minutes selon sa catégorie. Ce bonus ne se cumule pas.
- L'alcool donne +5, 10, 15 ou 20 % de persuasion pendant 15 minutes.
- Certaines boissons sans alcool augmentent l'O2.
- Les produits frais et le beurre ne donnent aucun bonus : ce sont des ingrédients. Les plats cuisinés sont le moyen fiable d'atteindre le palier de 20 %.

Votre équipage mange aussi ([Crew Eats Food](https://www.nexusmods.com/starfield/mods/12100)) ; les repas haut de gamme lui donnent un petit bonus d'XP.

## Soins

- **Infirmerie du vaisseau** : affectez un membre d'équipage qui a la compétence Medical, puis asseyez-vous dans le fauteuil chirurgical pour vous soigner et guérir vos afflictions ([Functional Ship Infirmaries](https://www.nexusmods.com/starfield/mods/6386)). Dans le jeu de base, Rosie Tannehill, au Hitching Post d'Akila City, a cette compétence.
- **Les médecins** facturent selon [Dynamic Medical Bill 2.0](https://www.nexusmods.com/starfield/mods/13861).
- Une trousse de soins ou de chimie prévue dans un butin a 30 % de chances de manquer (jamais en vanilla).

## Poids, gravité et déplacement

- Le poids des objets suit la gravité : ils pèsent plus sur les mondes lourds et moins sur les mondes légers ([Gravity Affects Weight](https://www.nexusmods.com/starfield/mods/3048)).
- [Mass Matters](https://www.nexusmods.com/starfield/mods/16044) : à 1 G et à la moitié de votre capacité, vous avancez à 100 % de votre vitesse. Moins de charge ou moins de gravité vous accélèrent, plus vous ralentit. Votre charge change aussi votre consommation d'O2, votre vitesse de rechargement et votre dérive en apesanteur quand vous tirez. En surcharge, vous tombez à 50 % de votre vitesse.
- Weight Lifting donne jusqu'à +200 kg (voir [Personnage]({{ '/extrasolar-containment-protocol/game-guide/character/' | relative_url }})).

## Le temps

[Configurable Timescale](https://www.nexusmods.com/starfield/mods/12601) règle la vitesse du temps dans Gameplay Options : par défaut 5 heures de jeu par heure réelle dans l'espace et 15 au sol. Un changement s'applique après une porte de chargement, un voyage rapide ou un saut. Vous pouvez attendre ou dormir jusqu'à 96 heures d'un coup.

</div>
