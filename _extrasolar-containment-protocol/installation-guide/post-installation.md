---
layout: skyground_readme
title: Post Installation
parent: Installation Guide
nav_order: 4
reading_mode_default: true
---

<div lang="en" markdown="1">

# Post Installation

## INI Configuration

The list's profiles do not use profile-specific INI files. The game reads its settings from `Documents\My Games\Starfield`: `StarfieldPrefs.ini` and `StarfieldCustom.ini`, created when you launched the game through Steam.

Set your resolution, display mode and upscaling in the game's display settings. The game saves them in `StarfieldPrefs.ini`. If you change the resolution by hand, it is in that file, under `[Display]`:

```ini
[Display]
iSize H=1080
iSize W=1920
```

Replace these values with your actual screen resolution.

## Profiles

Extrasolar Containment Protocol comes with two profiles. Both have the same gameplay mods; only the texture and performance mods change:

- **Extrasolar Containment Protocol - Ultra**: uses Skurkbro's Retexture Project (architecture and landscape textures). This is the profile Wabbajack selects by default.
- **Extrasolar Containment Protocol - Performance**: for lower-end hardware. Replaces Skurkbro's Retexture Project with Starfield Performance Textures, and adds Starfield Performance BOOST and Optimax - Performance.

Select the profile in the profile dropdown at the top left of Mod Organizer 2 before launching the game.

## Antivirus Exclusions

Before launching the game, make sure your antivirus software is not interfering with the modlist. Add the following folders to your exclusions:

- Your Starfield installation folder
- Your Extrasolar Containment Protocol installation folder
- Your Mod Organizer 2 executable

## SFSE (Starfield Script Extender)

Extrasolar Containment Protocol requires SFSE. It is included in the modlist. Always launch the game from Mod Organizer 2 with the **Extrasolar Containment Protocol Launcher** executable. **Never launch through Steam directly.**

</div>
<div lang="fr" markdown="1">

# Post-Installation

## Configuration des INIs

Les profils de la liste n'utilisent pas de fichiers INI propres au profil. Le jeu lit ses réglages dans `Documents\My Games\Starfield` : `StarfieldPrefs.ini` et `StarfieldCustom.ini`, créés lorsque vous avez lancé le jeu via Steam.

Réglez la résolution, le mode d'affichage et l'upscaling dans les options d'affichage du jeu. Le jeu les enregistre dans `StarfieldPrefs.ini`. Si vous modifiez la résolution à la main, elle se trouve dans ce fichier, sous `[Display]` :

```ini
[Display]
iSize H=1080
iSize W=1920
```

Remplacez ces valeurs par votre résolution d'écran réelle.

## Profils

Extrasolar Containment Protocol est fourni avec deux profils. Les deux ont les mêmes mods de gameplay ; seuls les mods de textures et de performances changent :

- **Extrasolar Containment Protocol - Ultra** : utilise Skurkbro's Retexture Project (textures d'architecture et de paysages). C'est le profil que Wabbajack sélectionne par défaut.
- **Extrasolar Containment Protocol - Performance** : pour le matériel plus modeste. Remplace Skurkbro's Retexture Project par Starfield Performance Textures, et ajoute Starfield Performance BOOST et Optimax - Performance.

Sélectionnez le profil dans le menu déroulant des profils, en haut à gauche de Mod Organizer 2, avant de lancer le jeu.

## Exclusions Antivirus

Avant de lancer le jeu, assurez-vous que votre antivirus n'interfère pas avec la modlist. Ajoutez ces dossiers à vos exclusions :

- Votre dossier d'installation Starfield
- Votre dossier d'installation Extrasolar Containment Protocol
- Votre exécutable Mod Organizer 2

## SFSE (Starfield Script Extender)

Extrasolar Containment Protocol nécessite SFSE. Il est inclus dans la modlist. Lancez toujours le jeu depuis Mod Organizer 2 avec l'exécutable **Extrasolar Containment Protocol Launcher**. **Ne lancez jamais le jeu directement via Steam.**

</div>
