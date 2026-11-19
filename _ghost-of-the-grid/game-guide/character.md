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
> - Level cap 300, Street Cred cap 500, attribute cap 40, skill cap 150. XP gain is vanilla (all multipliers at 1).
> - Every attribute point gives flat bonuses on top of perks (Graven's Attribute Expansion).
> - Cyberware capacity grows by 6 per level, up to 1000.
> - New perks: a pistol and revolver tree (Bullet Ballet), sprint perks (Running Man), a stealth tree (Stealthrunner).
> - Your lifepath makes some gangs and corporations "familiar": you hit them harder but earn little Street Cred from them.
> - More slots everywhere: twice the cyberdeck slots, 4 mod slots on weapons and cyberware arms.

## Levels and caps

**Better Leveling** ([Nexus](https://www.nexusmods.com/cyberpunk2077/mods/22784)) with the list's configuration:

| Setting | Ghost of the Grid | Vanilla |
| --- | --- | --- |
| Level cap | 300 | 60 |
| Street Cred cap | 500 | 50 |
| Attribute cap | 40 | 20 |
| Skill progression cap | 150 | 60 |
| Attribute points at creation | 12 | 7 |
| Highest starting attribute | 8 | 6 |
| Attribute / perk points per level | 1 / 1 | 1 / 1 |
| Cyberware capacity per level | +6 | |
| Cyberware capacity maximum | 1000 | |

Level, Street Cred and skill XP are not multiplied: Better Leveling and Simple XP Multiplier are both set to 1.

High Street Cred also unlocks extra vendor discounts:

| Street Cred | 75 | 100 | 150 | 200 | 250 | 500 |
| --- | --- | --- | --- | --- | --- | --- |
| Discount | 5 % | 10 % | 15 % | 20 % | 30 % | 45 % |

## What each attribute point gives

**Better Leveling Addon - Graven's Attribute Expansion** ([Nexus](https://www.nexusmods.com/cyberpunk2077/mods/24883)) adds bonuses per point, which keep working past 20:

| Attribute | Per point | Thresholds |
| --- | --- | --- |
| Body | +2 health, +2 stamina, +1 % melee damage, +4 carry capacity | +4 % stamina regen per 10 points |
| Reflexes | +1 % crit chance, -0.5 % reload time, +0.5 % attack speed, +1.25 stamina | +0.5 % move speed per 4 points |
| Technical Ability | +2 armor (+5 past 20), +5 Humanity, +0.5 % cyberware stats, -0.25 % cyberware cooldown | +1 grenade charge per 20 points |
| Intelligence | +1 % quickhack damage, +0.25 memory regen, +0.25 % quickhack resistance | +1 RAM per 2 points, +1 queue slot per 20 |
| Cool | +2.5 % crit damage, +2.5 % headshot and weak spot damage, +0.5 % stealth damage | +5 % mitigation chance per 10, -5 % visibility per 20 |

**Renaissance Punk - Perk Scaling** ([Nexus](https://www.nexusmods.com/cyberpunk2077/mods/14037)) makes that Technical Ability perk scale with your attributes: +2 / 4 / 6 / 8 cyberware capacity for each attribute at 4 / 9 / 15 / 20 or higher (vanilla: a flat +4). Every perk tree is drawn on the [Perk Trees]({{ '/ghost-of-the-grid/game-guide/perk-trees/' | relative_url }}) page.

Respecs are free: Reset Attributes always available lets you reset attributes as often as you like.

## New perks

### Bullet Ballet: pistols and revolvers

[Bullet Ballet](https://www.nexusmods.com/cyberpunk2077/mods/32933) adds a separate perk tree with 12 perks in three chains of four:

| Chain | Weapons | Perks, bottom to top |
| --- | --- | --- |
| Vigilante | Handguns and revolvers | Desperado, The Professional, Die Hard, Sicario |
| Gun Fu | Handguns | Hard Target, A Better Tomorrow, Hard Boiled, The Killer |
| Yakuza | Revolvers | Boiling Point, Sonatine, Violent Cop, Hanabi |

Each tier needs Cool 4, 9, 15 and 20. Points don't come from levelling: you earn them at kill milestones.

| Track | Milestones |
| --- | --- |
| Handgun kills | 25, 75, 175, 350 |
| Revolver kills | 15, 50, 120, 250 |
| Headshot kills | 20, 60, 150, 300 |

Effects in the tree include time dilation on headshots and dodges, firing faster while time is slowed, damage that grows with movement speed or with missing health, revolver crits within 4 metres, and rounds returned to the cylinder when you dash.

### Running Man: sprinting

[Running Man](https://www.nexusmods.com/cyberpunk2077/mods/26611) fills an empty slot of the Body tree:

- Running Man 1: sprint in any direction.
- Running Man 2: Double Sprint. Press sprint again while sprinting to go faster, at a stamina cost.
- Hit and Run: fast melee attacks while sprinting.
- Second Wind: Double Sprint drains 50 % less stamina.

### Stealthrunner

[Stealthrunner](https://www.nexusmods.com/cyberpunk2077/mods/7616) adds stealth objectives (such as Ghost: never enter combat) to main quests, side quests, gigs and NCPD hustles. Completing them gives XP, Street Cred, money and recipes. Enough completions unlock perk points, new cyberware at ripperdocs, iconic weapon recipes and the Stealthrunner perk tree.

### Set bonuses

[Set Bonuses](https://www.nexusmods.com/cyberpunk2077/mods/8103) gives bonuses for wearing several pieces of the same clothing set (Cop, Corporate, Fixer, Media, Netrunner...). Example, Cop set: 2 pieces cut blunt weapon stamina cost by 20 %, 3 pieces add 20 % max health and stamina, 4 pieces add 10 % blunt damage.

## Lifepath and factions

**Lifepath Bonuses and Gang-Corp Traits** ([Nexus](https://www.nexusmods.com/cyberpunk2077/mods/2217)) sorts factions by lifepath:

| Lifepath | Familiar factions |
| --- | --- |
| Corpo | Arasaka, Biotechnica, Kang Tao, Militech |
| Nomad | Aldecaldos, Wraiths, NUSA, 6th Street |
| Street Kid | Tyger Claws, Valentinos, Scavengers |

Every other faction counts as opposed. Values used by the list:

| Against | Your damage | Detection | Quickhack RAM cost | Upload time | Street Cred | Money from bodies |
| --- | --- | --- | --- | --- | --- | --- |
| Familiar | x1.2 | x0.8 | -1 | +0 | x0.25 | 5 per level |
| Opposed | x0.8 | x1 | +1 | +1 s | x1.5 | 2 per level |

So fighting your own people is easier but does little for your name. Each gang also has its own resistances: see [Combat]({{ '/ghost-of-the-grid/game-guide/combat/' | relative_url }}).

## Dialogue skill checks

[Convo Skill Check Scaling](https://www.nexusmods.com/cyberpunk2077/mods/2886) raises attribute checks in dialogue, which rarely go above 7 in vanilla, so hard checks can reach 20. The list uses a scaling factor of 0.75. Clear Skill Checks shows the value you needed when you pass a check.

## Cyberware

- **Capacity**: +6 per level, up to 1000 (Better Leveling), plus Technical Ability and Renaissance Punk bonuses.
- **Slots Slots Slots** ([Nexus](https://www.nexusmods.com/cyberpunk2077/mods/21644)): every cyberdeck has twice its quickhack slots; Gorilla Arms, Mantis Blades, Monowire and the Projectile Launch System get 4 mod slots; weapons get 4 mod slots (vanilla: 2), iconics 4 plus their iconic slot. Slots open with rarity, all of them at Legendary.
- **RipperDeck** ([Nexus](https://www.nexusmods.com/cyberpunk2077/mods/9302)): manage your cyberware from Hub > Cyberware, without visiting a ripperdoc.
- **Overclock Overheat** ([Nexus](https://www.nexusmods.com/cyberpunk2077/mods/14255)): you can stop and restart Overclock to use it in parts. Running it dry overheats you and you start burning, and you can't overclock while burning.
- **New implants**: Megingjord hover legs (Arroyo's ripperdoc or the Dogtown Stadium ripperdoc, from level 20), Extra Hands (Magnetic Wrist Sheath: a hidden knife that takes no weapon slot, at Viktor's or the Dogtown Stadium ripperdoc), plus Black Chrome, Gravitas, Missile Rain, CCXL - More Cyberware and Kiroshi Optics Night Vision.

## Quickhacks

New quickhacks come from 10 New Quickhacks - Netrunner's Arsenal, Blackwall Takedown, Enter Blackwall, Gravitational Force, Thunderclap, Widow's Web and Missile Rain. Quickhack Combos adds 21 synergies between hacks, and Quickhack Loadouts keeps up to 6 saved sets of quickhacks. The Netrunner Quickhack Shop on V's computer sells quickhacks too.

</div>
<div lang="fr" markdown="1">

# Personnage

{: .short }
> **En bref**
> - Niveau maximum 300, Street Cred maximum 500, attributs jusqu'à 40, compétences jusqu'à 150. Le gain d'XP est celui du jeu de base (tous les multiplicateurs à 1).
> - Chaque point d'attribut donne des bonus fixes en plus des perks (Graven's Attribute Expansion).
> - La capacité de cyberware augmente de 6 par niveau, jusqu'à 1000.
> - Nouveaux perks : un arbre pistolets et revolvers (Bullet Ballet), des perks de sprint (Running Man), un arbre d'infiltration (Stealthrunner).
> - Votre parcours rend certains gangs et corporations « familiers » : vous les frappez plus fort mais ils vous rapportent peu de Street Cred.
> - Plus d'emplacements partout : deux fois plus d'emplacements de cyberdeck, 4 emplacements de mods sur les armes et les bras cybernétiques.

## Niveaux et plafonds

**Better Leveling** ([Nexus](https://www.nexusmods.com/cyberpunk2077/mods/22784)) avec la configuration de la liste :

| Réglage | Ghost of the Grid | Jeu de base |
| --- | --- | --- |
| Niveau maximum | 300 | 60 |
| Street Cred maximum | 500 | 50 |
| Attribut maximum | 40 | 20 |
| Progression des compétences | 150 | 60 |
| Points d'attribut à la création | 12 | 7 |
| Attribut de départ maximum | 8 | 6 |
| Points d'attribut / de perk par niveau | 1 / 1 | 1 / 1 |
| Capacité de cyberware par niveau | +6 | |
| Capacité de cyberware maximum | 1000 | |

L'XP de niveau, de Street Cred et de compétences n'est pas multipliée : Better Leveling et Simple XP Multiplier sont tous deux réglés sur 1.

Une Street Cred élevée débloque aussi des remises chez les marchands :

| Street Cred | 75 | 100 | 150 | 200 | 250 | 500 |
| --- | --- | --- | --- | --- | --- | --- |
| Remise | 5 % | 10 % | 15 % | 20 % | 30 % | 45 % |

## Ce que donne chaque point d'attribut

**Better Leveling Addon - Graven's Attribute Expansion** ([Nexus](https://www.nexusmods.com/cyberpunk2077/mods/24883)) ajoute des bonus par point, qui continuent au-delà de 20 :

| Attribut | Par point | Paliers |
| --- | --- | --- |
| Constitution (Body) | +2 santé, +2 endurance, +1 % dégâts de mêlée, +4 capacité de charge | +4 % de régénération d'endurance tous les 10 points |
| Réflexes | +1 % de chances de critique, -0,5 % de temps de rechargement, +0,5 % de vitesse d'attaque, +1,25 endurance | +0,5 % de vitesse de déplacement tous les 4 points |
| Capacité technique (Technical Ability) | +2 armure (+5 au-delà de 20), +5 Humanité, +0,5 % aux stats du cyberware, -0,25 % de recharge du cyberware | +1 charge de grenade tous les 20 points |
| Intelligence | +1 % de dégâts de quickhack, +0,25 de régénération de mémoire, +0,25 % de résistance aux quickhacks | +1 RAM tous les 2 points, +1 emplacement de file tous les 20 |
| Sang-froid (Cool) | +2,5 % de dégâts critiques, +2,5 % de dégâts à la tête et aux points faibles, +0,5 % de dégâts furtifs | +5 % de chances d'atténuation tous les 10, -5 % de visibilité tous les 20 |

**Renaissance Punk - Perk Scaling** ([Nexus](https://www.nexusmods.com/cyberpunk2077/mods/14037)) fait évoluer ce perk de Capacité technique avec vos attributs : +2 / 4 / 6 / 8 de capacité de cyberware pour chaque attribut à 4 / 9 / 15 / 20 ou plus (jeu de base : +4 fixe). Tous les arbres sont dessinés dans la page [Arbres de perks]({{ '/ghost-of-the-grid/game-guide/perk-trees/' | relative_url }}).

Les réinitialisations sont gratuites : Reset Attributes always available permet de redistribuer vos attributs autant que vous voulez.

## Nouveaux perks

### Bullet Ballet : pistolets et revolvers

[Bullet Ballet](https://www.nexusmods.com/cyberpunk2077/mods/32933) ajoute un arbre de perks séparé, 12 perks répartis en trois chaînes de quatre :

| Chaîne | Armes | Perks, du bas vers le haut |
| --- | --- | --- |
| Vigilante | Pistolets et revolvers | Desperado, The Professional, Die Hard, Sicario |
| Gun Fu | Pistolets | Hard Target, A Better Tomorrow, Hard Boiled, The Killer |
| Yakuza | Revolvers | Boiling Point, Sonatine, Violent Cop, Hanabi |

Chaque palier demande Sang-froid 4, 9, 15 puis 20. Les points ne viennent pas des niveaux : vous les gagnez à des paliers d'éliminations.

| Compteur | Paliers |
| --- | --- |
| Éliminations au pistolet | 25, 75, 175, 350 |
| Éliminations au revolver | 15, 50, 120, 250 |
| Éliminations par tir à la tête | 20, 60, 150, 300 |

Parmi les effets : ralentissement du temps sur les tirs à la tête et les esquives, cadence plus rapide quand le temps est ralenti, dégâts qui montent avec la vitesse de déplacement ou avec la santé perdue, critiques garantis au revolver à moins de 4 mètres, balles rendues au barillet quand vous faites un dash.

### Running Man : le sprint

[Running Man](https://www.nexusmods.com/cyberpunk2077/mods/26611) occupe un emplacement vide de l'arbre Constitution :

- Running Man 1 : sprinter dans toutes les directions.
- Running Man 2 : Double Sprint. Appuyez de nouveau sur sprint pendant que vous sprintez pour aller plus vite, au prix d'endurance.
- Hit and Run : attaques rapides de mêlée en sprintant.
- Second Wind : le Double Sprint consomme 50 % d'endurance en moins.

### Stealthrunner

[Stealthrunner](https://www.nexusmods.com/cyberpunk2077/mods/7616) ajoute des objectifs d'infiltration (comme Ghost : ne jamais entrer en combat) aux quêtes principales, quêtes secondaires, contrats et missions du NCPD. Les réussir rapporte XP, Street Cred, argent et plans. Assez de réussites débloquent des points de perk, du cyberware chez les ripperdocs, des plans d'armes iconiques et l'arbre de perks Stealthrunner.

### Bonus de panoplie

[Set Bonuses](https://www.nexusmods.com/cyberpunk2077/mods/8103) donne des bonus quand vous portez plusieurs pièces d'une même tenue (Cop, Corporate, Fixer, Media, Netrunner...). Exemple, tenue Cop : 2 pièces réduisent de 20 % le coût en endurance des armes contondantes, 3 pièces ajoutent 20 % de santé et d'endurance max, 4 pièces ajoutent 10 % de dégâts contondants.

## Parcours et factions

**Lifepath Bonuses and Gang-Corp Traits** ([Nexus](https://www.nexusmods.com/cyberpunk2077/mods/2217)) classe les factions selon votre parcours :

| Parcours | Factions familières |
| --- | --- |
| Corpo | Arasaka, Biotechnica, Kang Tao, Militech |
| Nomade | Aldecaldos, Wraiths, NUSA, 6th Street |
| Gosse des rues (Street Kid) | Tyger Claws, Valentinos, Scavengers |

Toutes les autres factions comptent comme opposées. Valeurs utilisées par la liste :

| Face à | Vos dégâts | Détection | Coût en RAM des quickhacks | Temps de téléversement | Street Cred | Argent sur les corps |
| --- | --- | --- | --- | --- | --- | --- |
| Familiers | x1,2 | x0,8 | -1 | +0 | x0,25 | 5 par niveau |
| Opposés | x0,8 | x1 | +1 | +1 s | x1,5 | 2 par niveau |

Se battre contre les siens est donc plus facile, mais rapporte peu à votre réputation. Chaque gang a aussi ses propres résistances : voir [Combat]({{ '/ghost-of-the-grid/game-guide/combat/' | relative_url }}).

## Tests de compétence en dialogue

[Convo Skill Check Scaling](https://www.nexusmods.com/cyberpunk2077/mods/2886) relève les tests d'attribut en dialogue, qui dépassent rarement 7 dans le jeu de base, pour que les tests difficiles puissent atteindre 20. La liste utilise un facteur de 0,75. Clear Skill Checks affiche la valeur demandée quand vous réussissez un test.

## Cyberware

- **Capacité** : +6 par niveau, jusqu'à 1000 (Better Leveling), plus les bonus de Capacité technique et de Renaissance Punk.
- **Slots Slots Slots** ([Nexus](https://www.nexusmods.com/cyberpunk2077/mods/21644)) : chaque cyberdeck a deux fois plus d'emplacements de quickhacks ; les Gorilla Arms, Mantis Blades, Monowire et le Projectile Launch System ont 4 emplacements de mods ; les armes ont 4 emplacements de mods (jeu de base : 2), les iconiques 4 plus leur emplacement iconique. Les emplacements s'ouvrent selon la rareté, tous au niveau Légendaire.
- **RipperDeck** ([Nexus](https://www.nexusmods.com/cyberpunk2077/mods/9302)) : gérez votre cyberware depuis Hub > Cyberware, sans passer chez un ripperdoc.
- **Overclock Overheat** ([Nexus](https://www.nexusmods.com/cyberpunk2077/mods/14255)) : vous pouvez couper puis relancer l'Overclock pour l'utiliser en plusieurs fois. Le vider complètement vous fait surchauffer et brûler, et vous ne pouvez pas l'activer en brûlant.
- **Nouveaux implants** : les jambes à lévitation Megingjord (ripperdoc d'Arroyo ou du stade de Dogtown, dès le niveau 20), Extra Hands (Magnetic Wrist Sheath : un couteau caché qui ne prend pas d'emplacement d'arme, chez Viktor ou au ripperdoc du stade de Dogtown), plus Black Chrome, Gravitas, Missile Rain, CCXL - More Cyberware et Kiroshi Optics Night Vision.

## Quickhacks

Les nouveaux quickhacks viennent de 10 New Quickhacks - Netrunner's Arsenal, Blackwall Takedown, Enter Blackwall, Gravitational Force, Thunderclap, Widow's Web et Missile Rain. Quickhack Combos ajoute 21 synergies entre piratages, et Quickhack Loadouts garde jusqu'à 6 ensembles de quickhacks enregistrés. La boutique Netrunner Quickhack Shop, sur l'ordinateur de V, vend aussi des quickhacks.

</div>
