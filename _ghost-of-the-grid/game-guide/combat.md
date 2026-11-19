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
> - You deal x2 damage to every enemy, more to low-tier ones. Enemies deal x1 to x2.5 to you, rising with level.
> - Sniper rifles (x3), shotguns (x2) and revolvers are strong; SMGs (x0.65) and smart guns (x0.7) are weak.
> - Running out of stamina costs max health. Weapons wear out, jam and can lose a quality tier.
> - Gangs call reinforcements, have their own resistances and send named Rivals after you.
> - Pointing a gun at people in the street has consequences. Access points can infect you.
> - Weather affects you: dress for the cold, the heat, toxic rain and sand.

## Damage

**Damage Scaling and Balance** ([Nexus](https://www.nexusmods.com/cyberpunk2077/mods/1712)) sets the difficulty curve. Multipliers are set at levels 1, 10, 20, 30, 40, 50 and 60, and interpolated in between.

| Level | 1 | 10 | 20 | 30 | 40 | 50 | 60 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Your damage to enemies | x2 | x2 | x2 | x2 | x2 | x2 | x2 |
| Enemy damage to you | x1 | x1.25 | x1.5 | x1.75 | x2 | x2.25 | x2.5 |

On top of that, weaker enemy tiers take extra damage:

| Enemy tier | Trash | Weak | Normal | Officer | Rare, Elite, Boss, MaxTac |
| --- | --- | --- | --- | --- | --- |
| Extra damage taken | x2 | x1.75 | x1.5 | x1.25 | x1 |

And each weapon class has its own multiplier:

| Weapon | Multiplier |
| --- | --- |
| Sniper rifles | x3 |
| Shotguns | x2 |
| Precision rifles, power weapons | x1.3 |
| Revolvers | x1.25 |
| Heavy machine guns | x1.15 |
| LMGs, tech weapons, melee | x1 |
| Pistols, assault rifles | x0.8 |
| Smart weapons | x0.7 |
| SMGs | x0.65 |

The list also raises headshot and grenade damage (both multipliers set to 5 in the mod). Enemy health is not changed. Fights end fast on both sides: early on you kill quickly, late in the game enemies kill you quickly too.

Ammo limits are raised by Custom Max Ammo: 3000 handgun, 2000 rifle, 1000 shotgun, 500 sniper rounds.

## Health and stamina

**Endurance System** ([Nexus](https://www.nexusmods.com/cyberpunk2077/mods/27990)) links the two bars:

- Low health slows stamina regeneration, and low stamina slows health regeneration (down to 20 % at zero).
- Each time you empty your stamina, you lose 5 max health and 2 max stamina, up to half of each.
- Dropping under 25 % health also costs 5 max stamina.
- Sleeping resets the lost max health.

Watch your stamina in melee and when dodging: a long fight can leave you with a much shorter health bar.

## Weapon condition

**Weapon Conditioning** ([Nexus](https://www.nexusmods.com/cyberpunk2077/mods/10479)):

- Every weapon has a condition bar that drops with use and in explosions.
- Damage falls with condition, down to the damage of the previous quality tier.
- In bad condition the weapon jams and can hurt you. Stages go from Pristine Condition to Minor Wear, Checkup Recommended, Attention Required and Useless Scrap.
- At zero, the weapon can drop one quality tier.
- **Maintain** the weapon in the crafting menu before you can **Upgrade** it. Maintenance only works in unrestricted locations.
- Enemy rarity decides the quality of the weapons they drop, so common loot is common again.

Settings are in the RCF hub (F8). Upgrade Weapons Unlocked brings back upgrades for non-iconic weapons.

## Gangs and reinforcements

**Reinforcements System** ([Nexus](https://www.nexusmods.com/cyberpunk2077/mods/21532)): all gangs, Arasaka and Militech can call for backup.

- A hidden grace period of up to a minute follows the start of a fight.
- After that, any enemy can call. A call takes about 20 seconds and shows a phone icon over their head.
- Another call is possible about 60 seconds later. Each call brings more and tougher enemies, from one weak ganger up to an elite squad.
- Reinforcements start bigger on the gang's own turf, with your Street Cred, and with your bounty with that gang, which rises with each call.

**Lifepath Bonuses and Gang-Corp Traits** gives each faction its own strengths. A few you will meet early:

| Faction | Traits |
| --- | --- |
| Tyger Claws | 80 % of smart bullets miss, immune to burning and ultimate quickhacks, half grenade damage |
| Maelstrom | Your quickhacks upload 2 s slower and cost 1 more RAM, they spot you faster, half assault rifle damage |
| Valentinos | Half crit and tech weapon damage, immune to bleeding, your armor counts for half |
| Animals | Half damage from handguns, assault rifles, shotguns, LMGs and HMGs, immune to poison and shock, your armor counts for 75 % |
| 6th Street | Immune to damage quickhacks, double ricochet damage against them, half damage from blunt weapons, shotguns, LMGs and HMGs |
| Voodoo Boys | Immune to ultimate quickhacks, +1.5 s upload and +2 RAM cost, half smart weapon damage |
| Arasaka | Immune to ultimate quickhacks, half crit and stealth damage, one-shot protection |
| Militech | Immune to damage quickhacks and shock, half headshot and tech damage |

The list turns on the mod's NPC status and bonus display. Quickhack upload time also grows with distance: get close to hack.

## Rivals and reputation (CyberBane)

**CyberBane - Reputation and Nemesis Overhaul** ([Nexus](https://www.nexusmods.com/cyberpunk2077/mods/35847)) turns the gangs into people who remember you. Configured with the Default preset and a daily Timetable:

- **Rivals**: named gang members hunt you, up to 8 a day. They climb ranks, can come back with implants that answer how you hurt them, and some senior Rivals have a fatal flaw (a blade, a fist, a quickhack, explosives...) that their people can reveal.
- **Mercy or death**: walk away from a downed Rival to spare them, or finish them. A spared Rival may owe you; an escaped one comes back.
- **Street talk**: look at someone up close with empty hands and press F: Greet, Dismiss, Antagonize or Intimidate. Intimidated gangers may give up a Rival's hideout, pay you off or join your crew.
- **Your crew**: spared Rivals and frightened gangers can work for you. Call them from the phone or the Hub when someone comes for you.
- **Reputation** spreads between districts and fades if you stop earning it. Gangs at war meet at sit-downs you can crash, and bagmen carry a gang's weekly take across its turf.
- Markers: gold for a Rival, purple for an apex squad, white for a crew. Contacts reach you on the phone, and a broker texts you a summary every dawn.

Everything is tunable in Mod Settings (CyberBane), including a QuietLife preset if you want fewer hunts.

## Police and Trauma Team

- **NCPD**: the police and wanted system is reworked by NCPD Prevention Police Enhancement.
- **Trauma Team Response**: kill an NPC with a Trauma Team subscription and an AV comes for the body after the BioMonitor call. Higher tiers send more responders, faster (30 to 60 seconds by default).
- **District Memory** (see [The City]({{ '/ghost-of-the-grid/game-guide/the-city/' | relative_url }})): crimes raise a district's heat, which makes its police tougher.

## Stealth and netrunning

- **Silent Silencers and Throwing Knives**: silenced shots and thrown knives count as stealthy attacks.
- **Ricochet Redux**: reworks ricochets and lets them work with silenced weapons.
- **Trace Position Overhaul** ([Nexus](https://www.nexusmods.com/cyberpunk2077/mods/12445)): only enemies with the right ICE can trace your quickhacks. Netrunners guard their squad's network, and elites or mechanical enemies may also trace you.
- **Filthy Access Points** ([Nexus](https://www.nexusmods.com/cyberpunk2077/mods/27698)): jacking into an access point can infect you with malware (overheat, EMP, cyberware malfunction, weapon jam). Your personal link has an integrity meter (cyberware page). At 0 % you flatline. It recovers slowly over time, RAM Jolt restores some, and only a ripperdoc repairs it fully.
- **Body Shield**: carrying a body gives you flat protection against bullets.

## Weapons in public

**Respect Your Weapon 2.0** ([Nexus](https://www.nexusmods.com/cyberpunk2077/mods/27287)): Night City reacts to visible weapons. Tension builds when you show a gun, faster when you point it at someone, much faster when you aim. Enough tension starts combat. Melee weapons in a block stance don't count, quest NPCs are excluded, and nothing changes once you're already fighting. Holster in crowds.

## Melee and finishers

- **Finisher Overhaul** ([Nexus](https://www.nexusmods.com/cyberpunk2077/mods/33307)): finishers on blades, blunt weapons, monowire and throwables, directional fast finishers, executes borrowed from related weapon types, and the cut pre-2.0 finishers (Mantis Blades leap, Gorilla Arms grab, katana stab, two-handed club). The target gets a red outline when a finisher is available.
- **Immersive Knockdown**: knocked down in the air, V stays down until landing. Barbed wire cuts (short stagger and a 5 second bleed) instead of knocking you down, and electric wire's first hit takes 10 % of max health.
- **Melee Attack Variety** shuffles combo, strong and final attacks.

## Weather

**Weather Condition - Dress for the Forecast** ([Nexus](https://www.nexusmods.com/cyberpunk2077/mods/29024)): your clothes give an insulation score, and weather, time of day and district (Badlands) set the temperature.

| Condition | Trigger | Effect |
| --- | --- | --- |
| Chill / Freezing | Too cold for your clothes | Slower reload and aiming; Freezing adds weapon sway |
| Warm / Overheating | Too hot for your clothes | -10 % / -25 % stamina regeneration |
| Toxic | Toxic rain, head and face uncovered | -25 % max health |
| Dusty | Sandstorm, eyes and face uncovered | -25 % movement speed |

- Apartments, cars, the metro and elevators protect you. Bikes don't.
- A mask and a hat (or a balaclava) stop toxic rain. Goggles or glasses with a mask stop sand.
- Food helps against cold and non-alcoholic drinks against heat, for 1, 5 or 7 minutes by quality, only while the debuff is active.
- Hold the weapon wheel to see your current state.

</div>
<div lang="fr" markdown="1">

# Combat

{: .short }
> **En bref**
> - Vous infligez x2 dégâts à tous les ennemis, davantage aux plus faibles. Les ennemis vous infligent de x1 à x2,5, selon le niveau.
> - Fusils de sniper (x3), fusils à pompe (x2) et revolvers sont forts ; pistolets-mitrailleurs (x0,65) et armes intelligentes (x0,7) sont faibles.
> - Vider votre endurance coûte de la santé max. Les armes s'usent, s'enrayent et peuvent perdre un palier de qualité.
> - Les gangs appellent des renforts, ont leurs propres résistances et lancent des Rivaux nommés à vos trousses.
> - Pointer une arme sur les passants a des conséquences. Les points d'accès peuvent vous infecter.
> - La météo vous affecte : habillez-vous selon le froid, la chaleur, les pluies toxiques et le sable.

## Dégâts

**Damage Scaling and Balance** ([Nexus](https://www.nexusmods.com/cyberpunk2077/mods/1712)) fixe la courbe de difficulté. Les multiplicateurs sont définis aux niveaux 1, 10, 20, 30, 40, 50 et 60, et interpolés entre les deux.

| Niveau | 1 | 10 | 20 | 30 | 40 | 50 | 60 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Vos dégâts aux ennemis | x2 | x2 | x2 | x2 | x2 | x2 | x2 |
| Dégâts des ennemis sur vous | x1 | x1,25 | x1,5 | x1,75 | x2 | x2,25 | x2,5 |

En plus, les ennemis de rang faible subissent des dégâts supplémentaires :

| Rang | Trash | Weak | Normal | Officer | Rare, Elite, Boss, MaxTac |
| --- | --- | --- | --- | --- | --- |
| Dégâts subis en plus | x2 | x1,75 | x1,5 | x1,25 | x1 |

Et chaque type d'arme a son propre multiplicateur :

| Arme | Multiplicateur |
| --- | --- |
| Fusils de sniper | x3 |
| Fusils à pompe | x2 |
| Fusils de précision, armes à percussion | x1,3 |
| Revolvers | x1,25 |
| Mitrailleuses lourdes | x1,15 |
| Mitrailleuses légères, armes technologiques, mêlée | x1 |
| Pistolets, fusils d'assaut | x0,8 |
| Armes intelligentes | x0,7 |
| Pistolets-mitrailleurs | x0,65 |

La liste augmente aussi les dégâts des tirs à la tête et des grenades (deux multiplicateurs réglés sur 5 dans le mod). La santé des ennemis ne change pas. Les combats sont courts des deux côtés : au début vous tuez vite, en fin de partie les ennemis vous tuent vite aussi.

Les limites de munitions sont relevées par Custom Max Ammo : 3000 balles de pistolet, 2000 de fusil, 1000 de fusil à pompe, 500 de sniper.

## Santé et endurance

**Endurance System** ([Nexus](https://www.nexusmods.com/cyberpunk2077/mods/27990)) relie les deux barres :

- Une santé basse ralentit la régénération d'endurance, et une endurance basse ralentit celle de la santé (jusqu'à 20 % à zéro).
- Chaque fois que vous videz votre endurance, vous perdez 5 de santé max et 2 d'endurance max, jusqu'à la moitié de chacune.
- Passer sous 25 % de santé coûte aussi 5 d'endurance max.
- Dormir rétablit la santé max perdue.

Surveillez votre endurance en mêlée et en esquivant : un long combat peut vous laisser avec une barre de santé bien plus courte.

## État des armes

**Weapon Conditioning** ([Nexus](https://www.nexusmods.com/cyberpunk2077/mods/10479)) :

- Chaque arme a une barre d'état qui baisse à l'usage et dans les explosions.
- Les dégâts baissent avec l'état, jusqu'aux dégâts du palier de qualité inférieur.
- En mauvais état, l'arme s'enraye et peut vous blesser. Les stades vont de Pristine Condition à Minor Wear, Checkup Recommended, Attention Required puis Useless Scrap.
- À zéro, l'arme peut perdre un palier de qualité.
- **Entretenez** (Maintain) l'arme dans le menu d'artisanat avant de pouvoir l'**améliorer** (Upgrade). L'entretien n'est possible que dans les lieux sans restriction.
- La rareté de l'ennemi décide de la qualité des armes qu'il lâche : le butin commun redevient commun.

Les réglages sont dans le hub RCF (F8). Upgrade Weapons Unlocked rétablit l'amélioration des armes non iconiques.

## Gangs et renforts

**Reinforcements System** ([Nexus](https://www.nexusmods.com/cyberpunk2077/mods/21532)) : tous les gangs, Arasaka et Militech peuvent appeler des renforts.

- Un délai de grâce caché, jusqu'à une minute, suit le début d'un combat.
- Ensuite, n'importe quel ennemi peut appeler. L'appel dure environ 20 secondes et affiche une icône de téléphone au-dessus de sa tête.
- Un nouvel appel est possible environ 60 secondes plus tard. Chaque appel amène des ennemis plus nombreux et plus solides, d'un simple voyou jusqu'à une escouade d'élite.
- Les renforts sont plus gros sur le territoire du gang, selon votre Street Cred, et selon votre prime auprès de ce gang, qui augmente à chaque appel.

**Lifepath Bonuses and Gang-Corp Traits** donne à chaque faction ses points forts. Quelques-uns que vous croiserez tôt :

| Faction | Traits |
| --- | --- |
| Tyger Claws | 80 % des balles intelligentes ratent, immunisés aux brûlures et aux quickhacks ultimes, moitié des dégâts de grenade |
| Maelstrom | Vos quickhacks mettent 2 s de plus et coûtent 1 RAM de plus, ils vous repèrent plus vite, moitié des dégâts de fusil d'assaut |
| Valentinos | Moitié des dégâts critiques et des armes technologiques, immunisés au saignement, votre armure compte moitié |
| Animals | Moitié des dégâts des pistolets, fusils d'assaut, fusils à pompe et mitrailleuses légères et lourdes, immunisés au poison et à l'électrocution, votre armure compte à 75 % |
| 6th Street | Immunisés aux quickhacks de dégâts, ricochets doublés contre eux, moitié des dégâts des armes contondantes, fusils à pompe et mitrailleuses |
| Voodoo Boys | Immunisés aux quickhacks ultimes, +1,5 s de téléversement et +2 RAM, moitié des dégâts d'armes intelligentes |
| Arasaka | Immunisés aux quickhacks ultimes, moitié des dégâts critiques et furtifs, protection contre les coups fatals en un seul tir |
| Militech | Immunisés aux quickhacks de dégâts et à l'électrocution, moitié des dégâts à la tête et des armes technologiques |

La liste active l'affichage de l'état et des bonus des PNJ. Le temps de téléversement des quickhacks augmente aussi avec la distance : approchez-vous pour pirater.

## Rivaux et réputation (CyberBane)

**CyberBane - Reputation and Nemesis Overhaul** ([Nexus](https://www.nexusmods.com/cyberpunk2077/mods/35847)) fait des gangs des gens qui se souviennent de vous. Réglé sur le préréglage Default avec un rythme Timetable (créneaux quotidiens) :

- **Rivaux** : des membres de gang nommés vous traquent, jusqu'à 8 par jour. Ils montent en grade, peuvent revenir avec des implants qui répondent à la façon dont vous les avez blessés, et certains Rivaux haut placés ont un point faible fatal (une lame, les poings, un quickhack, des explosifs...) que leurs hommes peuvent vous révéler.
- **Grâce ou mort** : éloignez-vous d'un Rival à terre pour l'épargner, ou achevez-le. Un Rival épargné peut vous devoir quelque chose ; un Rival qui s'échappe revient.
- **Parler dans la rue** : regardez quelqu'un de près, mains vides, et appuyez sur F : Greet, Dismiss, Antagonize ou Intimidate. Un voyou intimidé peut livrer la cachette d'un Rival, vous payer ou rejoindre votre équipe.
- **Votre équipe** : Rivaux épargnés et voyous effrayés peuvent travailler pour vous. Appelez-les depuis le téléphone ou le Hub quand on vient vous chercher.
- **La réputation** circule entre les quartiers et s'efface si vous cessez de l'entretenir. Les gangs en guerre se retrouvent pour des rencontres que vous pouvez interrompre, et des convoyeurs transportent la recette hebdomadaire d'un gang sur son territoire.
- Marqueurs : or pour un Rival, violet pour une escouade d'élite, blanc pour une équipe. Les contacts passent par le téléphone, et un informateur vous envoie un résumé chaque matin à l'aube.

Tout se règle dans Mod Settings (CyberBane), y compris un préréglage QuietLife si vous voulez moins de traques.

## Police et Trauma Team

- **NCPD** : la police et le système de recherche sont revus par NCPD Prevention Police Enhancement.
- **Trauma Team Response** : tuez un PNJ abonné à Trauma Team et un AV vient chercher le corps après l'appel du BioMonitor. Les abonnements supérieurs envoient plus d'intervenants, plus vite (30 à 60 secondes par défaut).
- **District Memory** (voir [La ville]({{ '/ghost-of-the-grid/game-guide/the-city/' | relative_url }})) : vos crimes font monter la tension d'un quartier, ce qui durcit sa police.

## Infiltration et netrunning

- **Silent Silencers and Throwing Knives** : les tirs silencieux et les couteaux lancés comptent comme des attaques discrètes.
- **Ricochet Redux** : revoit les ricochets et les rend possibles avec les armes silencieuses.
- **Trace Position Overhaul** ([Nexus](https://www.nexusmods.com/cyberpunk2077/mods/12445)) : seuls les ennemis avec la bonne ICE peuvent remonter vos quickhacks. Les netrunners protègent le réseau de leur escouade, et les élites ou les ennemis mécaniques peuvent aussi vous tracer.
- **Filthy Access Points** ([Nexus](https://www.nexusmods.com/cyberpunk2077/mods/27698)) : se brancher sur un point d'accès peut vous infecter (surchauffe, IEM, panne de cyberware, enrayement d'arme). Votre liaison personnelle a une jauge d'intégrité (page cyberware). À 0 %, vous mourez. Elle remonte lentement avec le temps, le RAM Jolt en rend une partie, et seul un ripperdoc la répare entièrement.
- **Body Shield** : porter un corps vous donne une protection fixe contre les balles.

## Les armes en public

**Respect Your Weapon 2.0** ([Nexus](https://www.nexusmods.com/cyberpunk2077/mods/27287)) : Night City réagit aux armes visibles. La tension monte quand vous montrez une arme, plus vite si vous la pointez sur quelqu'un, beaucoup plus vite si vous visez. Assez de tension déclenche le combat. Une arme de mêlée en garde ne compte pas, les PNJ de quête sont exclus, et rien ne change une fois le combat engagé. Rangez votre arme dans la foule.

## Mêlée et exécutions

- **Finisher Overhaul** ([Nexus](https://www.nexusmods.com/cyberpunk2077/mods/33307)) : exécutions pour les lames, armes contondantes, monofil et armes de jet, exécutions rapides directionnelles, mises à mort empruntées aux armes du même type, et retour des exécutions coupées d'avant la 2.0 (saut des Mantis Blades, saisie des Gorilla Arms, estoc au katana, massue à deux mains). La cible est entourée de rouge quand une exécution est possible.
- **Immersive Knockdown** : renversé en l'air, V reste à terre jusqu'à l'atterrissage. Les barbelés coupent (bref vacillement et saignement de 5 secondes) au lieu de vous renverser, et le premier contact avec un fil électrifié coûte 10 % de santé max.
- **Melee Attack Variety** mélange les attaques de combo, fortes et finales.

## Météo

**Weather Condition - Dress for the Forecast** ([Nexus](https://www.nexusmods.com/cyberpunk2077/mods/29024)) : vos vêtements donnent un score d'isolation, et la météo, l'heure et le quartier (Badlands) fixent la température.

| État | Déclencheur | Effet |
| --- | --- | --- |
| Chill / Freezing | Trop froid pour vos vêtements | Rechargement et visée plus lents ; Freezing ajoute du balancement à la visée |
| Warm / Overheating | Trop chaud pour vos vêtements | -10 % / -25 % de régénération d'endurance |
| Toxic | Pluie toxique, tête et visage découverts | -25 % de santé max |
| Dusty | Tempête de sable, yeux et visage découverts | -25 % de vitesse de déplacement |

- Appartements, voitures, métro et ascenseurs vous protègent. Les motos, non.
- Un masque et un chapeau (ou une cagoule) arrêtent la pluie toxique. Des lunettes avec un masque arrêtent le sable.
- La nourriture aide contre le froid et les boissons sans alcool contre la chaleur, pendant 1, 5 ou 7 minutes selon la qualité, seulement quand le malus est actif.
- Maintenez la roue des armes pour voir votre état actuel.

</div>
