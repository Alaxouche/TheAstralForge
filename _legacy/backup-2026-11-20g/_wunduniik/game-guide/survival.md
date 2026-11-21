---
layout: skyground_readme
title: Survival and Travel
title_fr: Survie et voyage
parent: Game Guide
nav_order: 5
---

<div lang="en" markdown="1">

# Survival and Travel

{: .short }
> **In short**
> - Survival Mode is optional and off by default: you switch it on in the New Game panel.
> - With it on ([Starfrost](https://www.nexusmods.com/skyrimspecialedition/mods/97536)): fatigue, hunger and cold, injuries as a fourth need, diseases that worsen daily, no natural Health regeneration above half Health, carry weight 200.
> - One food item ends hunger, 12 hours of sleep ends fatigue.
> - Injuries happen with or without Survival Mode. Sleep cures them.
> - Food gives long regeneration buffs. Gear wears down, never breaks, and is repaired by tempering.
> - With Survival on, fast travel needs a travel pack. Time runs at timescale 12 (vanilla is 20).

## Survival Mode on or off

The Survival Mode toggle is in the New Game panel ([First Hours]({{ '/wunduniik/game-guide/first-hours/' | relative_url }})). Wunduniik leaves it off by default, and does not force it on afterwards.

| System | Survival off | Survival on |
| --- | --- | --- |
| Hunger, fatigue, cold | No | Yes |
| Injuries | Yes (Blade and Blunt version) | Yes (Starfrost version) |
| Diseases | Fixed effect | Worsen every 24 hours |
| Natural Health regeneration | Normal | Almost none above 50% Health |
| Base carry weight | Normal | 200 |
| Fast travel | Free | Needs a travel pack |
| Food buff duration (Gourmet) | 20 minutes | 10 minutes |

## Needs (Survival on)

[Starfrost](https://www.nexusmods.com/skyrimspecialedition/mods/97536) runs on [Survival Mode Improved](https://www.nexusmods.com/skyrimspecialedition/mods/78244). Fatigue and hunger reduce max Magicka and Stamina; cold and injuries reduce max Health. Penalties that hit the same stats add up: Very Tired and Very Hungry together means -50%.

{{ site.data.gauges.wunduniik_needs | gauge: 'en' }}

A bed gives the Rested buff for 8 hours, then 4 neutral hours before fatigue starts.

### Warmth

Warmth (0 to 250) slows how fast you get cold, by 0.3% per point, up to 75% at 250.

| Gear | Chest piece | Helmet, gloves or boots |
| --- | --- | --- |
| Heavy armor | 60 | 30 |
| Light armor | 40 | 20 |
| Clothing | 20 | 10 |

{{ site.data.gauges.wunduniik_warmth | gauge: 'en' }}

A hot stew adds 50 while its effect lasts, holding a torch adds 50, and werewolves always have +50. Swimming in freezing water makes you cold fast, slows you by 25% and drains 10 Stamina per second. The [Temperature Gauge](https://www.nexusmods.com/skyrimspecialedition/mods/194794) bar shows your body temperature (settings in the F1 menu).

### Other Survival rules

- **Health**: no natural regeneration above 50% Health. Below 50%, +100%; below 25%, another +100%. Potions, food, perks and spells work as usual.
- **Carry weight**: base 200. Over-encumbered, you tire very fast and lose 5 Stamina per second.
- **Vampires** ignore cold and hunger but still get tired. **Werewolves** tire half as fast.
- **Levelling**: the Experience mod notes that with Survival Mode, a level-up is applied when you sleep.

## Injuries

Heavy hits can injure you. Each new injury upgrades the previous one: Minor, then Major, then Critical. Blocking or holding a ward halves the chance. With Survival on, Freezing and a Critical injury at the same time kill you.

{{ site.data.gauges.wunduniik_health | gauge: 'en' }}

| | Survival off ([Blade and Blunt](https://www.nexusmods.com/skyrimspecialedition/mods/34549)) | Survival on (Starfrost) |
| --- | --- | --- |
| Chance when hit | 10% below 50% Health, 25% below 25% | 5% below 75%, 25% below 50%, 50% below 25% |
| Minor | -25 max Health | -10% max Health |
| Major | -50 max Health | -25% max Health |
| Critical | -100 max Health | -50% max Health |
| Cure | Rest 4 / 8 / 12 hours | Sleep 4 hours per injury level |

## Diseases

Starfrost reworks diseases into three tiers. With Survival on, they move up a tier every 24 hours, so cure them early (priests sell cures).

| Disease | Caught from | Effect (tier 1 / 2 / 3) |
| --- | --- | --- |
| Ataxia | Skeevers | Carry weight -25 / 50 / 100 |
| Bone Break Fever | Bears | Weapon damage -10 / 25 / 50% |
| Brain Rot | Hagravens | Magicka regeneration -25 / 50 / 75% |
| Brown Rot | Draugr | Armor Rating -50 / 100 / 200 |
| Droops | Ash hoppers | Movement speed -10 / 25 / 50% |
| Greenspore | Slaughterfish | Buy and sell prices 10 / 25 / 50% worse |
| Gutworm | Trolls | Health regeneration -25 / 50 / 75% |
| Rattles | Chaurus | Stamina regeneration -25 / 50 / 75% |
| Rockjoint | Wolves | Stamina -25 / 50 / 100 |
| Witbane | Sabre cats | Magicka -25 / 50 / 100 |

## Food and drink

[Gourmet](https://www.nexusmods.com/skyrimspecialedition/mods/96876) turns food into regeneration buffs. You can have one of each type at once:

| Food | Buff | Raw / simple | Cooked | Stews, soups, breads, desserts |
| --- | --- | --- | --- | --- |
| Meat and stews | Health regeneration | 10% | 25% | 50% |
| Vegetables, soups, breads | Stamina regeneration | 10% | 25% | 50% |
| Fruit, dairy, pastries, cheese | Magicka regeneration | 10% | 25% | 50% |

Buffs last 20 minutes (10 with Survival on). The chef books *The Art of Cooking* Vol. 1 and 2 each add +100% duration, and Vol. 3 doubles what you cook. Chef vendors are in Understone Keep, the Blue Palace and the Bards College. Raw meat can give food poisoning with Survival on. Skooma, Sleeping Tree Sap and Eversnow give big buffs with big drawbacks, and each dose has a 25% addiction chance.

## Camping and hunting

- [Campfire](https://www.nexusmods.com/skyrimspecialedition/mods/667): build fires and tents, cook, carry a backpack, gather wood.
- [Simple Hunting Overhaul](https://www.nexusmods.com/skyrimspecialedition/mods/95943): skinning takes time (a few minutes to 2 hours, shorter as you gain experience). Hold Shift to pick up a carcass, which some merchants buy.

## Gear wear

[Equipment Durability System NG](https://www.nexusmods.com/skyrimspecialedition/mods/109899), with the [Angelic preset](https://www.nexusmods.com/skyrimspecialedition/mods/145131), wears down your gear as you fight:

- Gear never breaks.
- In the list's preset, only iron, leather, fur and glass items lose condition. Other materials are set not to degrade.
- Repair an item by tempering it again (grindstone or workbench).
- Loot can be pre-tempered or enchanted: 20% for normal enemies, 60% for vendors, 90% for bosses (enchanted: 1%, 5% and 15%).

## Travel

- **Timescale 12**: one real minute is 12 game minutes (vanilla 20), so days last longer.
- **Fast travel** ([Journeyman](https://www.nexusmods.com/skyrimspecialedition/mods/92220)): with Survival on, you need a travel pack in your inventory, and one is used per trip. Craft it at a forge (1 leather, 2 leather strips, 2 firewood, 1 torch), or buy it from general merchants. A torch is crafted from 1 firewood and 2 leather strips. With Survival off, fast travel is free.
- **Carriages, horses and the paraglider** ([Skyrim's Paraglider](https://www.nexusmods.com/skyrimspecialedition/mods/53256)) are all in the list.

</div>
<div lang="fr" markdown="1">

# Survie et voyage

{: .short }
> **En bref**
> - Le Mode Survie est optionnel et désactivé par défaut : vous l'activez dans le panneau Nouvelle partie.
> - Activé ([Starfrost](https://www.nexusmods.com/skyrimspecialedition/mods/97536)) : fatigue, faim et froid, blessures comme quatrième besoin, maladies qui s'aggravent chaque jour, pas de régénération naturelle de Santé au-dessus de la moitié, charge de base 200.
> - Un seul aliment met fin à la faim, 12 heures de sommeil à la fatigue.
> - Les blessures existent avec ou sans Mode Survie. Le sommeil les soigne.
> - La nourriture donne de longs bonus de régénération. L'équipement s'use, ne casse jamais, et se répare en l'affûtant ou en l'améliorant.
> - Avec la Survie, le voyage rapide demande un sac de voyage. Le temps passe à l'échelle 12 (20 en vanilla).

## Mode Survie activé ou non

L'option Mode Survie se trouve dans le panneau Nouvelle partie ([Premières heures]({{ '/wunduniik/game-guide/first-hours/' | relative_url }})). Wunduniik la laisse désactivée par défaut et ne l'impose pas ensuite.

| Système | Survie désactivée | Survie activée |
| --- | --- | --- |
| Faim, fatigue, froid | Non | Oui |
| Blessures | Oui (version Blade and Blunt) | Oui (version Starfrost) |
| Maladies | Effet fixe | S'aggravent toutes les 24 heures |
| Régénération naturelle de Santé | Normale | Quasi nulle au-dessus de 50 % de Santé |
| Charge de base | Normale | 200 |
| Voyage rapide | Libre | Demande un sac de voyage |
| Durée des bonus de nourriture (Gourmet) | 20 minutes | 10 minutes |

## Besoins (Survie activée)

[Starfrost](https://www.nexusmods.com/skyrimspecialedition/mods/97536) fonctionne avec [Survival Mode Improved](https://www.nexusmods.com/skyrimspecialedition/mods/78244). La fatigue et la faim réduisent la Magie et la Vigueur maximales ; le froid et les blessures réduisent la Santé maximale. Les malus qui touchent les mêmes statistiques s'additionnent : Very Tired et Very Hungry ensemble donnent -50 %.

{{ site.data.gauges.wunduniik_needs | gauge: 'fr' }}

Un lit donne le bonus Rested pendant 8 heures, puis 4 heures neutres avant que la fatigue commence.

### Chaleur

La chaleur (de 0 à 250) ralentit le refroidissement de 0,3 % par point, jusqu'à 75 % à 250.

| Équipement | Torse | Casque, gants ou bottes |
| --- | --- | --- |
| Armure lourde | 60 | 30 |
| Armure légère | 40 | 20 |
| Vêtements | 20 | 10 |

{{ site.data.gauges.wunduniik_warmth | gauge: 'fr' }}

Un ragoût chaud ajoute 50 tant que son effet dure, tenir une torche ajoute 50, et les loups-garous ont toujours +50. Nager en eau glacée vous refroidit vite, vous ralentit de 25 % et draine 10 de Vigueur par seconde. La jauge de [Temperature Gauge](https://www.nexusmods.com/skyrimspecialedition/mods/194794) affiche votre température (réglages dans le menu F1).

### Autres règles de survie

- **Santé** : pas de régénération naturelle au-dessus de 50 % de Santé. En dessous de 50 %, +100 % ; en dessous de 25 %, encore +100 %. Potions, nourriture, perks et sorts fonctionnent normalement.
- **Charge** : 200 de base. En surcharge, vous vous fatiguez très vite et perdez 5 de Vigueur par seconde.
- **Les vampires** ignorent le froid et la faim mais se fatiguent. **Les loups-garous** se fatiguent deux fois moins vite.
- **Niveaux** : le mod Experience précise qu'avec le Mode Survie, un passage de niveau s'applique quand vous dormez.

## Blessures

Les gros coups peuvent vous blesser. Chaque nouvelle blessure aggrave la précédente : mineure, puis grave, puis critique. Bloquer ou tenir une protection divise le risque par deux. Avec la Survie, être Freezing avec une blessure critique vous tue.

{{ site.data.gauges.wunduniik_health | gauge: 'fr' }}

| | Survie désactivée ([Blade and Blunt](https://www.nexusmods.com/skyrimspecialedition/mods/34549)) | Survie activée (Starfrost) |
| --- | --- | --- |
| Risque à chaque coup | 10 % sous 50 % de Santé, 25 % sous 25 % | 5 % sous 75 %, 25 % sous 50 %, 50 % sous 25 % |
| Mineure | -25 de Santé max | -10 % de Santé max |
| Grave | -50 de Santé max | -25 % de Santé max |
| Critique | -100 de Santé max | -50 % de Santé max |
| Soin | Repos de 4 / 8 / 12 heures | 4 heures de sommeil par niveau de blessure |

## Maladies

Starfrost répartit les maladies en trois stades. Avec la Survie, elles passent au stade suivant toutes les 24 heures : soignez-les vite (les prêtres vendent des remèdes).

| Maladie | Transmise par | Effet (stade 1 / 2 / 3) |
| --- | --- | --- |
| Ataxia | Ragnards | Charge -25 / 50 / 100 |
| Bone Break Fever | Ours | Dégâts des armes -10 / 25 / 50 % |
| Brain Rot | Hagravens | Régénération de Magie -25 / 50 / 75 % |
| Brown Rot | Draugr | Armure -50 / 100 / 200 |
| Droops | Ash hoppers | Vitesse -10 / 25 / 50 % |
| Greenspore | Slaughterfish | Prix d'achat et de vente 10 / 25 / 50 % moins bons |
| Gutworm | Trolls | Régénération de Santé -25 / 50 / 75 % |
| Rattles | Chaurus | Régénération de Vigueur -25 / 50 / 75 % |
| Rockjoint | Loups | Vigueur -25 / 50 / 100 |
| Witbane | Tigres à dents de sabre | Magie -25 / 50 / 100 |

## Nourriture et boissons

[Gourmet](https://www.nexusmods.com/skyrimspecialedition/mods/96876) transforme la nourriture en bonus de régénération. Vous pouvez cumuler un bonus de chaque type :

| Nourriture | Bonus | Cru / simple | Cuisiné | Ragoûts, soupes, pains, desserts |
| --- | --- | --- | --- | --- |
| Viandes et ragoûts | Régénération de Santé | 10 % | 25 % | 50 % |
| Légumes, soupes, pains | Régénération de Vigueur | 10 % | 25 % | 50 % |
| Fruits, laitages, pâtisseries, fromages | Régénération de Magie | 10 % | 25 % | 50 % |

Les bonus durent 20 minutes (10 avec la Survie). Les livres de cuisine *The Art of Cooking* vol. 1 et 2 ajoutent chacun +100 % de durée, et le vol. 3 double ce que vous cuisinez. Les marchands chefs se trouvent à Understone Keep (Markarth), au Palais Bleu et au Collège des bardes. La viande crue peut provoquer une intoxication avec la Survie. Le Skooma, la Sleeping Tree Sap et l'Eversnow donnent de gros bonus avec de gros défauts, et chaque prise a 25 % de chances de créer une dépendance.

## Camping et chasse

- [Campfire](https://www.nexusmods.com/skyrimspecialedition/mods/667) : construisez feux de camp et tentes, cuisinez, portez un sac à dos, ramassez du bois.
- [Simple Hunting Overhaul](https://www.nexusmods.com/skyrimspecialedition/mods/95943) : dépecer prend du temps (quelques minutes à 2 heures, moins avec l'expérience). Maintenez Maj pour ramasser une carcasse, que certains marchands achètent.

## Usure de l'équipement

[Equipment Durability System NG](https://www.nexusmods.com/skyrimspecialedition/mods/109899), avec le [préréglage Angelic](https://www.nexusmods.com/skyrimspecialedition/mods/145131), use votre équipement au combat :

- L'équipement ne casse jamais.
- Avec le préréglage de la liste, seuls les objets en fer, en cuir, en fourrure et en verre perdent en état. Les autres matériaux sont réglés pour ne pas s'user.
- Réparez un objet en l'améliorant à nouveau (meule ou établi).
- Le butin peut être déjà amélioré ou enchanté : 20 % pour les ennemis normaux, 60 % chez les marchands, 90 % pour les boss (enchanté : 1 %, 5 % et 15 %).

## Voyager

- **Échelle de temps 12** : une minute réelle vaut 12 minutes en jeu (20 en vanilla), les journées durent donc plus longtemps.
- **Voyage rapide** ([Journeyman](https://www.nexusmods.com/skyrimspecialedition/mods/92220)) : avec la Survie, il faut un sac de voyage dans l'inventaire, et chaque trajet en consomme un. Fabriquez-le à une forge (1 cuir, 2 lanières de cuir, 2 bûches, 1 torche) ou achetez-le chez les marchands généraux. Une torche se fabrique avec 1 bûche et 2 lanières de cuir. Sans la Survie, le voyage rapide est libre.
- **Calèches, chevaux et parapente** ([Skyrim's Paraglider](https://www.nexusmods.com/skyrimspecialedition/mods/53256)) font tous partie de la liste.

</div>
