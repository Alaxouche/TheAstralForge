---
layout: skyground_readme
title: Post Installation
parent: Installation Guide
nav_order: 4
reading_mode_default: true
---

<div lang="en" markdown="1">

# Post Installation

## BethINI and INIs

BethINI is a really useful tool to edit your Skyrim INI files. I already provided my INIs, but some lines might not be set up correctly for your computer. Here are the lines you must check:

1. SkyrimPrefs.ini:
   - `iSize H=1440` → Change to your screen resolution Height
   - `iSize W=2560` → Change to your screen resolution Width
   - `sD3DDevice="NVIDIA GeForce RTX 4090"` → Change to your GPU name

2. SSEDisplayTweaks.ini:
   - `Resolution=1920x1080` → Change to your screen resolution

## Switching ENB Preset

Krentoraan was designed to be used with **(ENB) CabbAlax ENB**, enabled by default on all three profiles. The presets are in separator **16.3 ENBSERIES - PRESETS (PICK ONE ONLY)**. Krentoraan uses Root Builder. To change the ENB:

1. Disable the current active preset ((ENB) CabbAlax ENB by default):
<p align="center">
    <img src="/assets/Images/guides/07e367e948ae44d186a20946870246cf-37eb09.webp" alt="Mod Organizer 2: right-click menu on the ENB presets in the left panel" width="751" height="388">
</p>
2. Enable the preset you want to use. Keep only one enabled.
3. Clear overwrite to delete the ENB Shader Cache:
<p align="center">
    <img src="/assets/Images/guides/7b4dcdecd048480b9393151600b1f903-8f80e5.webp" alt="Mod Organizer 2: right-click menu on Overwrite, with Clear Overwrite" width="772" height="359">
</p>

## Increasing Krentoraan Performance

### Profile Options

Krentoraan comes with 3 profiles: Performance, Standard, and Ultra, automatically assigned based on your screen resolution and VRAM:
- **Performance** (0 to 8 GB VRAM): Sparse Forest with lower density flora
- **Standard** (8 to 14 GB VRAM): Sparse Forests with realistic trees and dense flora
- **Ultra** (14+ GB VRAM): Dense Forests with ultra dense flora and Grass Lods

<p align="center">
    <img src="/assets/Images/guides/349e8144acad4d0183354432f0602cb1-12cafe.webp" alt="Mod Organizer 2 profile drop-down with the Standard and Ultra profiles" width="1576" height="644">
</p>

### External Performance Tools

{: .note }
These tools are optional.

- **Magpie (free):** [https://github.com/Blinue/Magpie](https://github.com/Blinue/Magpie)
- **PureDark's DLSS Mod (~$5):** Search on Patreon.
- **Lossless Scaling (~$7):** Available on Steam.

</div>
<div lang="fr" markdown="1">

# Post-Installation

## BethINI et INIs

BethINI est un outil très utile pour modifier vos fichiers INI de Skyrim. J'ai déjà fourni mes INIs, mais certaines lignes pourraient ne pas être correctement configurées. Voici les lignes à vérifier :

1. SkyrimPrefs.ini :
   - `iSize H=1440` → Remplacez par la hauteur de votre résolution
   - `iSize W=2560` → Remplacez par la largeur de votre résolution
   - `sD3DDevice="NVIDIA GeForce RTX 4090"` → Remplacez par le nom de votre GPU

2. SSEDisplayTweaks.ini :
   - `Resolution=1920x1080` → Remplacez par votre résolution d'écran

## Changer le Preset ENB

Krentoraan a été conçu pour **(ENB) CabbAlax ENB**, activé par défaut sur les trois profils. Les presets se trouvent dans le séparateur **16.3 ENBSERIES - PRESETS (PICK ONE ONLY)**. Krentoraan utilise Root Builder. Pour changer l'ENB :

1. Désactivez le preset actif ((ENB) CabbAlax ENB par défaut) :
<p align="center">
    <img src="/assets/Images/guides/07e367e948ae44d186a20946870246cf-37eb09.webp" alt="Mod Organizer 2 : menu clic droit sur les presets ENB du panneau de gauche" width="751" height="388">
</p>
2. Activez le preset souhaité. N'en gardez qu'un seul activé.
3. Videz l'overwrite pour supprimer le cache de shaders ENB :
<p align="center">
    <img src="/assets/Images/guides/7b4dcdecd048480b9393151600b1f903-8f80e5.webp" alt="Mod Organizer 2 : menu clic droit sur Overwrite, avec Clear Overwrite" width="772" height="359">
</p>

## Améliorer les Performances de Krentoraan

### Options de Profils

Krentoraan est livré avec 3 profils : Performance, Standard et Ultra, assignés automatiquement selon votre résolution et VRAM :
- **Performance** (0 à 8 Go de VRAM) : Forêt clairsemée, flore moins dense
- **Standard** (8 à 14 Go de VRAM) : Forêts clairsemées avec arbres réalistes et flore dense
- **Ultra** (14+ Go VRAM) : Forêts denses avec flore ultra dense et LODs d'herbe

<p align="center">
    <img src="/assets/Images/guides/349e8144acad4d0183354432f0602cb1-12cafe.webp" alt="Liste déroulante des profils de Mod Organizer 2 avec les profils Standard et Ultra" width="1576" height="644">
</p>

### Outils de Performance Externes

{: .note }
Ces outils sont optionnels.

- **Magpie (gratuit) :** [https://github.com/Blinue/Magpie](https://github.com/Blinue/Magpie)
- **Mod DLSS de PureDark (~5$) :** Recherchez sur Patreon.
- **Lossless Scaling (~7$) :** Disponible sur Steam.

</div>
