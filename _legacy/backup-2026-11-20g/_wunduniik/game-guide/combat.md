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
> - Every attack costs Stamina, light attacks included. Empty your bar with an attack and you are exhausted: slower, weaker block, more damage taken.
> - Out of combat your Stamina is infinite, so sprint freely between fights.
> - Defence is active: timed blocks, parries that counterattack, dodges, and a back power attack that breaks guards.
> - Armor caps at 90% damage reduction (75% at 500 armor). Armor also reduces spell damage.
> - Getting hit builds stress. High stress cuts your damage by up to 90% until you rest, drink or eat a warm meal.
> - When you go down, a follower can win the fight and revive you. Otherwise the enemy may become your Nemesis.

## Stamina

[For Honor Stamina System](https://www.nexusmods.com/skyrimspecialedition/mods/174120) gives every attack a Stamina cost, light attacks included, with a different cost per weapon type. On top of it, [Blade and Blunt](https://www.nexusmods.com/skyrimspecialedition/mods/34549) makes Stamina the core resource of melee and archery.

If an attack leaves you at 0 Stamina, you become exhausted:

| Effect | Value |
| --- | --- |
| Movement speed | -50% |
| Weapon speed | -15% |
| Stamina regeneration | None for 10 seconds (Stamina potions blocked) |
| Damage and stagger taken when not blocking | +50% |
| Block effectiveness | -50% |
| When it ends | You get 50 Stamina back |

Sprinting or blocking down to 0 does not trigger this state: only an attack does. Out of combat, [Infinite Stamina Out of Combat](https://www.nexusmods.com/skyrimspecialedition/mods/70134) keeps your bar full.

## Moving and attacking

- **Attacks**: [BFCO](https://www.nexusmods.com/skyrimspecialedition/mods/117052) and [For Honor Reforged](https://www.nexusmods.com/skyrimspecialedition/mods/172176) give combos, directional moves, sprint and jump attacks, for you and for NPCs.
- **Hits**: [Precision](https://www.nexusmods.com/skyrimspecialedition/mods/72347) uses the real weapon swing, so you hit what the blade touches. A sweeping attack can hit up to 3 targets. [Accuracy](https://www.nexusmods.com/skyrimspecialedition/mods/187578) changes damage by body part and by the armor covering it.
- **Dodge**: [DMCO](https://www.nexusmods.com/skyrimspecialedition/mods/175129) on a mouse button (see F8).
- **Target lock**: [True Directional Movement](https://www.nexusmods.com/skyrimspecialedition/mods/51614), also on a mouse button.
- **Kill moves**: you cannot be killed by one, and enemies only trigger them below half health.

## Blocking, parrying and poise

- [Simple Timed Block - Blessed Version](https://www.nexusmods.com/skyrimspecialedition/mods/178776) separates a perfect block, a good block and a regular block. The timing windows grow with your Block skill, and a perfect block gives Stamina back.
- [For Honor Reforged](https://www.nexusmods.com/skyrimspecialedition/mods/172176) turns the parry into a counterattack: it deals part of your damage and a chunk of poise damage, and an enemy whose poise hits 0 is knocked down for a follow-up. Parry timing, poise damage and damage reduction scale with Block. The **back power attack** is the guard breaker.
- [Chocolate Poise - Reforged](https://www.nexusmods.com/skyrimspecialedition/mods/181084) handles stagger with a poise system. Heavier armor and weapons count.
- Power attacks stagger blocking enemies: use them to open a guard, and block or bash to interrupt an enemy's power attack.

## Armor and resistances

Blade and Blunt replaces the vanilla armor formula:

| Armor Rating | Physical damage reduction | Spell damage reduction |
| --- | --- | --- |
| 500 (soft cap) | 75% | 25% |
| 1000 (hard cap) | 90% | 40% |

Below 500, each point gives 0.15%. Magic Resistance, Spell Absorption and elemental resistances cap at 75%.

Creatures have their own resistances and weaknesses through [Know Your Enemy 2](https://www.nexusmods.com/skyrimspecialedition/mods/93258) (16 damage types: blade, axe, blunt, bows, crossbows, fists, fire, frost, shock, poison, sun and more). The bestiary on **K** helps you learn them.

## Difficulty

Wunduniik starts on **Expert**. Blade and Blunt adds rules on top of the damage sliders. At Expert:

| Rule | Value |
| --- | --- |
| Spell costs | +10% |
| Combat Stamina costs | +10% |
| Stagger you take | +25% |
| Parry window | -10% |

Master doubles these (+20%, +20%, +50%, -20%). Legendary adds +50% damage to enemies caught attacking and to staggered enemies.

{: .note }
Damage multipliers are handled by two mods in this list: Blade and Blunt (with its level-based scaling turned on) and Yet Another Difficulty Mod. To see or change the player and NPC damage multipliers, open the **Yet Another Difficulty Mod** MCM.

## Enemies

- [Arena](https://www.nexusmods.com/skyrimspecialedition/mods/33487) sorts dungeons by enemy type rather than scaling everything to you. Some places are simply too dangerous early.
- Enemies drink potions (10% chance, up to 2) with [Smart NPC Potions](https://www.nexusmods.com/skyrimspecialedition/mods/40102).
- [Wait Your Turn Redux](https://www.nexusmods.com/skyrimspecialedition/mods/185557) limits how many enemies attack you at the same time.
- NPC archers no longer aim perfectly, and NPCs no longer dodge spells on reaction.

## Stress and fear

[Stress and Fear](https://www.nexusmods.com/skyrimspecialedition/mods/116522), with its [Tweaked](https://www.nexusmods.com/skyrimspecialedition/mods/180865) addon, tracks stress from 0 to 100. Taking hits raises it. Stress lowers your max Stamina and Magicka, and the list also turns on the damage penalty:

| Stress level | Damage you deal |
| --- | --- |
| Minor | -25% |
| Moderate | -50% |
| Severe | -75% |
| Critical | -90% |

Followers are affected too. To bring stress down: drink alcohol (4 bottles take you from 100 to 0), eat comfort food or a warm stew or soup, sleep at an inn or at home, pray, play music, fish, read, or pet an animal.

If you are badly hurt (below 25% Health) by a type of enemy, you have a 27% chance to develop a phobia of it. Each time you defeat that enemy type you have an 18% chance to cure it, and 24 hours of uninterrupted sleep cures one random phobia.

## When you fall

- [Last Man Standing](https://www.nexusmods.com/skyrimspecialedition/mods/192712): when you are downed, you stay on the ground while the fight goes on. If your followers win, you get back up with no penalty. If nobody is left fighting for you, the defeat counts.
- [Shadow of Skyrim](https://www.nexusmods.com/skyrimspecialedition/mods/65136): an enemy that defeats you becomes a **Nemesis**, with a new name, better stats and a special buff, and may take your gear. You wake up somewhere else with a debuff and two quests: get your backpack back and kill your Nemesis. Killing it removes the debuff and gives you a reward buff. Enemies 25 or more levels above you do not become Nemeses.

{: .tip }
Followers matter more than usual: they are what turns a defeat into a second chance. See the follower section of [Quests and World]({{ '/wunduniik/game-guide/content/' | relative_url }}).

Injuries from heavy hits are covered in [Survival and Travel]({{ '/wunduniik/game-guide/survival/' | relative_url }}). They exist even with Survival Mode off.

</div>
<div lang="fr" markdown="1">

# Combat

{: .short }
> **En bref**
> - Chaque attaque coûte de la Vigueur, attaques légères comprises. Videz votre jauge en attaquant et vous êtes épuisé : plus lent, blocage plus faible, plus de dégâts subis.
> - Hors combat, votre Vigueur est illimitée : sprintez librement entre deux combats.
> - La défense est active : blocages au bon moment, contres qui ripostent, esquives et attaque puissante arrière qui brise la garde.
> - L'armure plafonne à 90 % de réduction des dégâts (75 % à 500 d'armure). Elle réduit aussi les dégâts des sorts.
> - Encaisser des coups fait monter le stress. Un stress élevé réduit vos dégâts jusqu'à 90 %, tant que vous ne vous reposez pas, ne buvez pas ou ne mangez pas un plat chaud.
> - Quand vous tombez, un compagnon peut gagner le combat et vous relever. Sinon, l'ennemi peut devenir votre Némésis.

## Vigueur

[For Honor Stamina System](https://www.nexusmods.com/skyrimspecialedition/mods/174120) donne un coût en Vigueur à chaque attaque, attaques légères comprises, différent selon le type d'arme. [Blade and Blunt](https://www.nexusmods.com/skyrimspecialedition/mods/34549) fait en plus de la Vigueur la ressource centrale du corps à corps et de l'arc.

Si une attaque vous laisse à 0 de Vigueur, vous êtes épuisé :

| Effet | Valeur |
| --- | --- |
| Vitesse de déplacement | -50 % |
| Vitesse d'attaque | -15 % |
| Régénération de Vigueur | Aucune pendant 10 secondes (potions de Vigueur bloquées) |
| Dégâts et déséquilibre subis hors blocage | +50 % |
| Efficacité du blocage | -50 % |
| À la fin | Vous récupérez 50 de Vigueur |

Sprinter ou bloquer jusqu'à 0 ne déclenche pas cet état : seule une attaque le fait. Hors combat, [Infinite Stamina Out of Combat](https://www.nexusmods.com/skyrimspecialedition/mods/70134) garde votre jauge pleine.

## Se déplacer et attaquer

- **Attaques** : [BFCO](https://www.nexusmods.com/skyrimspecialedition/mods/117052) et [For Honor Reforged](https://www.nexusmods.com/skyrimspecialedition/mods/172176) apportent combos, coups directionnels, attaques en course et en saut, pour vous comme pour les PNJ.
- **Impacts** : [Precision](https://www.nexusmods.com/skyrimspecialedition/mods/72347) utilise la vraie trajectoire de l'arme : vous touchez ce que la lame touche. Une attaque en arc de cercle peut toucher jusqu'à 3 cibles. [Accuracy](https://www.nexusmods.com/skyrimspecialedition/mods/187578) module les dégâts selon la partie du corps touchée et l'armure qui la couvre.
- **Esquive** : [DMCO](https://www.nexusmods.com/skyrimspecialedition/mods/175129), sur un bouton de souris (voir F8).
- **Verrouillage de cible** : [True Directional Movement](https://www.nexusmods.com/skyrimspecialedition/mods/51614), aussi sur un bouton de souris.
- **Mises à mort** : aucune ne peut vous tuer, et les ennemis n'en déclenchent que sous la moitié de leur santé.

## Blocage, contre et équilibre

- [Simple Timed Block - Blessed Version](https://www.nexusmods.com/skyrimspecialedition/mods/178776) distingue blocage parfait, bon blocage et blocage simple. Les fenêtres de timing s'élargissent avec votre compétence Parade, et un blocage parfait rend de la Vigueur.
- [For Honor Reforged](https://www.nexusmods.com/skyrimspecialedition/mods/172176) fait du contre une riposte : il inflige une partie de vos dégâts et une bonne part de dégâts d'équilibre, et un ennemi dont l'équilibre tombe à 0 est mis à terre pour une attaque de suivi. Le timing, les dégâts d'équilibre et la réduction des dégâts progressent avec Parade. L'**attaque puissante arrière** sert à briser la garde.
- [Chocolate Poise - Reforged](https://www.nexusmods.com/skyrimspecialedition/mods/181084) gère le déséquilibre avec un système d'équilibre (poise). Le poids de l'armure et des armes compte.
- Les attaques puissantes déséquilibrent un ennemi qui bloque : servez-vous-en pour ouvrir sa garde, et bloquez ou donnez un coup de bouclier pour interrompre son attaque puissante.

## Armure et résistances

Blade and Blunt remplace la formule d'armure vanilla :

| Armure | Réduction des dégâts physiques | Réduction des dégâts des sorts |
| --- | --- | --- |
| 500 (plafond souple) | 75 % | 25 % |
| 1000 (plafond dur) | 90 % | 40 % |

En dessous de 500, chaque point donne 0,15 %. La résistance à la magie, l'absorption de sorts et les résistances élémentaires plafonnent à 75 %.

Les créatures ont leurs propres résistances et faiblesses grâce à [Know Your Enemy 2](https://www.nexusmods.com/skyrimspecialedition/mods/93258) (16 types de dégâts : lame, hache, contondant, arcs, arbalètes, poings, feu, froid, foudre, poison, soleil, etc.). Le bestiaire sur **K** vous aide à les apprendre.

## Difficulté

Wunduniik démarre en **Expert**. Blade and Blunt ajoute des règles en plus des curseurs de dégâts. En Expert :

| Règle | Valeur |
| --- | --- |
| Coût des sorts | +10 % |
| Coût en Vigueur au combat | +10 % |
| Déséquilibre subi | +25 % |
| Fenêtre de contre | -10 % |

Maître double ces valeurs (+20 %, +20 %, +50 %, -20 %). Légendaire ajoute +50 % de dégâts aux ennemis surpris en pleine attaque et aux ennemis déséquilibrés.

{: .note }
Deux mods de la liste gèrent les multiplicateurs de dégâts : Blade and Blunt (avec son ajustement selon le niveau activé) et Yet Another Difficulty Mod. Pour voir ou changer les multiplicateurs du joueur et des PNJ, ouvrez le MCM de **Yet Another Difficulty Mod**.

## Ennemis

- [Arena](https://www.nexusmods.com/skyrimspecialedition/mods/33487) classe les donjons selon le type d'ennemis au lieu de tout adapter à votre niveau. Certains lieux sont tout simplement trop dangereux au début.
- Les ennemis boivent des potions (10 % de chances, 2 au maximum) avec [Smart NPC Potions](https://www.nexusmods.com/skyrimspecialedition/mods/40102).
- [Wait Your Turn Redux](https://www.nexusmods.com/skyrimspecialedition/mods/185557) limite le nombre d'ennemis qui vous attaquent en même temps.
- Les archers PNJ ne visent plus parfaitement, et les PNJ n'esquivent plus les sorts par réflexe.

## Stress et peur

[Stress and Fear](https://www.nexusmods.com/skyrimspecialedition/mods/116522), avec son extension [Tweaked](https://www.nexusmods.com/skyrimspecialedition/mods/180865), suit un stress de 0 à 100. Encaisser des coups le fait monter. Le stress réduit votre Vigueur et votre Magie maximales, et la liste active aussi la pénalité de dégâts :

| Niveau de stress | Dégâts infligés |
| --- | --- |
| Léger | -25 % |
| Modéré | -50 % |
| Sévère | -75 % |
| Critique | -90 % |

Les compagnons sont aussi concernés. Pour faire baisser le stress : buvez de l'alcool (4 bouteilles font passer de 100 à 0), mangez une douceur ou un ragoût ou une soupe chaude, dormez à l'auberge ou chez vous, priez, jouez de la musique, pêchez, lisez ou caressez un animal.

Si un type d'ennemi vous blesse gravement (sous 25 % de Santé), vous avez 27 % de chances d'en développer la phobie. Chaque victoire contre ce type d'ennemi a 18 % de chances de la guérir, et 24 heures de sommeil ininterrompu guérissent une phobie au hasard.

## Quand vous tombez

- [Last Man Standing](https://www.nexusmods.com/skyrimspecialedition/mods/192712) : à terre, vous restez au sol pendant que le combat continue. Si vos compagnons gagnent, vous vous relevez sans pénalité. S'il ne reste personne pour se battre pour vous, la défaite compte.
- [Shadow of Skyrim](https://www.nexusmods.com/skyrimspecialedition/mods/65136) : l'ennemi qui vous vainc devient votre **Némésis**, avec un nouveau nom, de meilleures statistiques et un bonus spécial, et peut prendre votre équipement. Vous vous réveillez ailleurs avec un malus et deux quêtes : récupérer votre sac et tuer votre Némésis. Le tuer retire le malus et vous donne un bonus de récompense. Les ennemis de 25 niveaux ou plus au-dessus de vous ne deviennent pas des Némésis.

{: .tip }
Les compagnons comptent plus que d'habitude : ce sont eux qui transforment une défaite en seconde chance. Voir la partie compagnons de [Quêtes et monde]({{ '/wunduniik/game-guide/content/' | relative_url }}).

Les blessures dues aux gros coups sont décrites dans [Survie et voyage]({{ '/wunduniik/game-guide/survival/' | relative_url }}). Elles existent même sans Mode Survie.

</div>
