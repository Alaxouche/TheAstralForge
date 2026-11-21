---
layout: skyground_readme
title: First Hours
title_fr: Premières heures
parent: Game Guide
nav_order: 1
---

<div lang="en" markdown="1">

# First Hours

{: .short }
> **In short**
> - Launch through the list's executable in Mod Organizer, never through Steam or GOG.
> - A fourth lifepath, **Fresh Start**, is available at character creation.
> - You start with 12 attribute points (vanilla: 7), and no starting attribute can go above 8.
> - From level 1 you deal double damage, and enemy damage to you climbs as levels rise. Low-tier enemies die fast, but so can you later on.
> - Most mod options live in four places: the Mods menu, the Mod Settings menu, the RCF hub (F8) and the CET overlay (End).
> - Visit V's H10 apartment once to unlock the computer from the radial menu anywhere.

## Launching

Start the game from Mod Organizer with the **Ghost of the Grid** executable. It skips the launcher and the start screen. The full procedure, the profiles and the "do not click Unlock" warning are in [Using the List]({{ '/ghost-of-the-grid/installation-guide/g_using-the-list/' | relative_url }}).

{: .warning }
A crash during the scripted opening sequence is a [known issue]({{ '/ghost-of-the-grid/known-issues/' | relative_url }}). Retry: stability improves once the intro is over.

## Character creation

**New Lifepath Intro - Fresh Start** ([Nexus](https://www.nexusmods.com/cyberpunk2077/mods/18223)) adds a fourth lifepath. V is both an ex-corpo and an ex-nomad returning to Night City. A new intro plays before the Half Year Montage: Misty, Jackie and Vik pick V up at the Orbital Air terminal. You get the dialogue options of both the Corpo and Nomad lifepaths for the rest of the game.

The lifepath side quests are off for Fresh Start, because they don't fit the new intro. To play them anyway, open the CET console (End) and enter:

`Game.GetQuestsSystem():SetFactStr("ns_lp_quests_enabled", 1)`

The quests then start at their normal point in the story, even if you already passed it.

Starting points come from **Better Leveling** ([Nexus](https://www.nexusmods.com/cyberpunk2077/mods/22784)):

| Setting | Ghost of the Grid | Vanilla |
| --- | --- | --- |
| Attribute points at creation | 12 | 7 |
| Highest starting attribute | 8 | 6 |

Your lifepath also decides which gangs and corporations are "familiar" to you, which changes damage, detection and rewards against them. See [Character]({{ '/ghost-of-the-grid/game-guide/character/' | relative_url }}).

## Where the settings are

| Menu | How to open | Examples |
| --- | --- | --- |
| Mods (Native Settings) | "Mods" entry of the main menu | Better Leveling, Damage Scaling ("Dmg. Scaling"), Simple XP Multiplier |
| Mod Settings | "Mod Settings" entry of the main menu | Limited HUD, Nitrous, CyberBane, Quickhack Hotkeys, Finisher Overhaul |
| Redscript Configuration Framework hub | F8 | Weapon Conditioning, Weather Condition, True Flashlight |
| CET overlay | End | Console, Car Selection Menu, Weapon Loadouts, Weather Switcher |

{: .note }
F8 also toggles the whole HUD (Limited HUD). If one of the two doesn't react, rebind one of them.

The list ships its own values for all of these. Change them if you want, but the numbers in this guide assume the defaults of the list.

## The HUD

**Limited HUD** ([Nexus](https://www.nexusmods.com/cyberpunk2077/mods/2592)) hides most of the HUD when you don't need it:

- The health bar appears in combat, when your health or RAM isn't full, with a weapon drawn or with active buffs or quickhacks.
- The quest tracker stays hidden and pops up for 5 seconds when a quest updates (also in vehicles and when zooming).
- The minimap stays visible, except with the scanner or zoom.
- F6 toggles the minimap, F8 the whole HUD.

## First things to do

1. **Go home to H10 once.** Computer Anywhere ([Nexus](https://www.nexusmods.com/cyberpunk2077/mods/12520)) activates after one visit to V's starting apartment. After that, the bottom entry of the radial menu scrolls between Idle Anywhere, Computer Anywhere and TV Anywhere. The computer gives you the Virtual Atelier shops and the Virtual Car Dealer.
2. **Keep a weapon in good shape.** Weapons lose condition with use (see [Combat]({{ '/ghost-of-the-grid/game-guide/combat/' | relative_url }})). A worn gun deals less damage and jams.
3. **Don't steal cars casually.** Hotwiring a stolen car starts a one-shot security minigame. Failing can lock the brakes, deflate the tyres, shock you or call the NCPD (see [The City]({{ '/ghost-of-the-grid/game-guide/the-city/' | relative_url }})).
4. **Check the weather before you go out.** Toxic rain and sandstorms punish uncovered faces.
5. **Mistakes are cheap to fix.** Reset Attributes always available ([Nexus](https://www.nexusmods.com/cyberpunk2077/mods/9240)) lets you reset attributes as often as you want, and Atone ([Nexus](https://www.nexusmods.com/cyberpunk2077/mods/14814)) resets your Street Cred at a confession booth.

{: .tip }
Long scenes, braindances and rides you can't skip can be sped up with Skip Unskippable Cutscenes ([Nexus](https://www.nexusmods.com/cyberpunk2077/mods/3278)). Its hotkey is not bound by default: set it in the CET overlay.

</div>
<div lang="fr" markdown="1">

# Premières heures

{: .short }
> **En bref**
> - Lancez le jeu avec l'exécutable de la liste dans Mod Organizer, jamais via Steam ou GOG.
> - Un quatrième parcours (lifepath), **Fresh Start**, est disponible à la création du personnage.
> - Vous commencez avec 12 points d'attribut (7 dans le jeu de base), et aucun attribut de départ ne peut dépasser 8.
> - Dès le niveau 1 vous infligez le double de dégâts, et les dégâts des ennemis sur vous augmentent avec les niveaux. Les ennemis faibles tombent vite, mais vous aussi plus tard.
> - La plupart des options de mods se trouvent à quatre endroits : le menu Mods, le menu Mod Settings, le hub RCF (F8) et l'overlay CET (Fin).
> - Passez une fois à l'appartement H10 de V pour débloquer l'ordinateur partout depuis la roue rapide.

## Lancer le jeu

Lancez le jeu depuis Mod Organizer avec l'exécutable **Ghost of the Grid**. Il saute le lanceur et l'écran titre. La procédure complète, les profils et l'avertissement « ne cliquez pas sur Unlock » sont dans [Utiliser la liste]({{ '/ghost-of-the-grid/installation-guide/g_using-the-list/' | relative_url }}).

{: .warning }
Un crash pendant la séquence d'ouverture scriptée est un [problème connu]({{ '/ghost-of-the-grid/known-issues/' | relative_url }}). Réessayez : la stabilité s'améliore une fois l'intro terminée.

## Création du personnage

**New Lifepath Intro - Fresh Start** ([Nexus](https://www.nexusmods.com/cyberpunk2077/mods/18223)) ajoute un quatrième parcours. V est à la fois ex-corpo et ex-nomade, de retour à Night City. Une nouvelle intro se joue avant la séquence des six mois : Misty, Jackie et Vik viennent chercher V au terminal d'Orbital Air. Vous avez ensuite accès aux choix de dialogue des parcours Corpo et Nomade pendant toute la partie.

Les quêtes secondaires liées au parcours sont désactivées pour Fresh Start, car elles ne collent pas à la nouvelle intro. Pour les jouer quand même, ouvrez la console CET (Fin) et entrez :

`Game.GetQuestsSystem():SetFactStr("ns_lp_quests_enabled", 1)`

Les quêtes démarrent alors à leur moment normal dans l'histoire, même si vous l'avez déjà dépassé.

Les points de départ viennent de **Better Leveling** ([Nexus](https://www.nexusmods.com/cyberpunk2077/mods/22784)) :

| Réglage | Ghost of the Grid | Jeu de base |
| --- | --- | --- |
| Points d'attribut à la création | 12 | 7 |
| Attribut de départ maximum | 8 | 6 |

Votre parcours détermine aussi quels gangs et corporations vous sont « familiers », ce qui modifie les dégâts, la détection et les récompenses face à eux. Voir [Personnage]({{ '/ghost-of-the-grid/game-guide/character/' | relative_url }}).

## Où sont les réglages

| Menu | Comment l'ouvrir | Exemples |
| --- | --- | --- |
| Mods (Native Settings) | Entrée « Mods » du menu principal | Better Leveling, Damage Scaling (« Dmg. Scaling »), Simple XP Multiplier |
| Mod Settings | Entrée « Mod Settings » du menu principal | Limited HUD, Nitrous, CyberBane, Quickhack Hotkeys, Finisher Overhaul |
| Hub Redscript Configuration Framework | F8 | Weapon Conditioning, Weather Condition, True Flashlight |
| Overlay CET | Fin | Console, Car Selection Menu, Weapon Loadouts, Weather Switcher |

{: .note }
F8 sert aussi à afficher ou masquer tout le HUD (Limited HUD). Si l'un des deux ne réagit pas, changez la touche de l'un d'eux.

La liste fournit ses propres valeurs pour tous ces menus. Vous pouvez les changer, mais les chiffres de ce guide correspondent aux réglages de la liste.

## Le HUD

**Limited HUD** ([Nexus](https://www.nexusmods.com/cyberpunk2077/mods/2592)) masque la majeure partie du HUD quand vous n'en avez pas besoin :

- La barre de santé apparaît en combat, quand votre santé ou votre RAM n'est pas pleine, arme en main ou avec des effets ou quickhacks actifs.
- Le suivi de quête reste caché et s'affiche 5 secondes à chaque mise à jour de quête (aussi en véhicule et en visée zoomée).
- La mini-carte reste visible, sauf avec le scanner ou le zoom.
- F6 affiche ou masque la mini-carte, F8 tout le HUD.

## À faire en premier

1. **Rentrez une fois au H10.** Computer Anywhere ([Nexus](https://www.nexusmods.com/cyberpunk2077/mods/12520)) s'active après une visite à l'appartement de départ de V. Ensuite, l'entrée du bas de la roue rapide alterne entre Idle Anywhere, Computer Anywhere et TV Anywhere. L'ordinateur donne accès aux boutiques Virtual Atelier et au Virtual Car Dealer.
2. **Gardez une arme en bon état.** Les armes perdent de l'état à l'usage (voir [Combat]({{ '/ghost-of-the-grid/game-guide/combat/' | relative_url }})). Une arme usée fait moins de dégâts et s'enraye.
3. **Ne volez pas de voiture à la légère.** Démarrer une voiture volée lance un mini-jeu de sécurité, sans seconde chance. Un échec peut bloquer les freins, dégonfler les pneus, vous électrocuter ou prévenir le NCPD (voir [La ville]({{ '/ghost-of-the-grid/game-guide/the-city/' | relative_url }})).
4. **Regardez la météo avant de sortir.** Les pluies toxiques et les tempêtes de sable punissent les visages découverts.
5. **Les erreurs se rattrapent.** Reset Attributes always available ([Nexus](https://www.nexusmods.com/cyberpunk2077/mods/9240)) permet de réinitialiser vos attributs autant de fois que vous voulez, et Atone ([Nexus](https://www.nexusmods.com/cyberpunk2077/mods/14814)) remet votre Street Cred à zéro dans un confessionnal.

{: .tip }
Les scènes, braindances et trajets impossibles à passer peuvent être accélérés avec Skip Unskippable Cutscenes ([Nexus](https://www.nexusmods.com/cyberpunk2077/mods/3278)). Son raccourci n'est pas attribué par défaut : réglez-le dans l'overlay CET.

</div>
