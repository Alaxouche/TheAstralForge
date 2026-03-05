---
layout: skyground_readme
title: Post Installation
parent: Installation Guide
nav_order: 4
reading_mode_default: true
---

# Post Installation

## INI Configuration

After the Wabbajack installation is complete, you may need to adjust a few INI settings for your specific hardware configuration.

1. Navigate to your Starfield installation folder inside the modlist directory.
2. Open `StarfieldCustom.ini` (create it if it does not exist at `Documents\My Games\Starfield\`).
3. Ensure your resolution is correctly set:

```ini
[Display]
iSize H=1080
iSize W=1920
```

Replace these values with your actual screen resolution.

## Profiles

Extrasolar Containment Protocol may include multiple profiles for different hardware configurations:

- **Performance**: Reduced visual quality for lower-end hardware
- **Standard**: Balanced visuals and performance
- **Ultra**: Maximum visual quality for high-end hardware

Select the appropriate profile in Mod Organizer 2 before launching the game.

## Antivirus Exclusions

Before launching the game, make sure your antivirus software is not interfering with the modlist. Add the following folders to your exclusions:

- Your Starfield installation folder
- Your Extrasolar Containment Protocol installation folder
- Your Mod Organizer 2 executable

## SFSE (Starfield Script Extender)

Extrasolar Containment Protocol requires SFSE to be configured correctly. It is included in the modlist, but you must always launch the game through Mod Organizer 2 using the SFSE executable — **never launch through Steam directly**.
