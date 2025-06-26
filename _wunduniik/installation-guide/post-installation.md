---
layout: default
title: Post Installation
parent: Installation Guide
nav_order: 4
---

# Post Installation

## BethINI and INIs

BethINI is a really useful tool to edit your Skyrim.ini, SkyrimCustom.ini and SkyrimPrefs.ini. I already provided you my INIs, but some lines might not be set up correctly for your computer. However, BethINI is making changes to ini settings it isn't supposed to, so i removed it from the list. I advise you to make the changes by hand, but if you really want you can install BethINI yourself. Here are the lines you must check before starting your game:
1. SkyrimPrefs.ini:
- [Display]
- - iSize H=1080 -> Change this with your screen resolution Height
- - iSize W=1920 -> Change this with your screen resolution Width
    <p>Those 2 lines can be changed directly through the Skyrim Launcher or BethINI

- [Launcher]
- - sD3DDevice="NVIDIA GeForce RTX 3060TI" -> Change this with you GPU name  

2. Skyrim.ini:
- [Display]
- - sScreenShotBaseName=C:\Games\The Elder Scrolls - Skyrim - Special Edition\Screenshots\Screenshots -> Create a folder called Screenshots and replace this line with the path leading to the new folder.

3. SSEDisplayTweaks.ini
- Resolution=1920x1080 -> Change this with your screen resolution

## Switching ENB Preset

Wunduniik was designed and set up to be used with Cabbage ENB for NAT III Weather, but you can change it if you don't like it.  
Now since Chapter IV, Wunduniik makes use of Root Builder. This allows mods modifying game root to be installed as mods, like ENBs or Reshade. If you wish to modify the current ENB, you must:
1. Disable the current active preset ((ENB) Cabbage ENB - Wunduniik Edit - Clear by default):
<p align="center">
    <img src="https://static.wixstatic.com/media/579922_07e367e948ae44d186a20946870246cf~mv2.png/v1/fill/w_712,h_371,al_c,lg_1,q_85,enc_avif,quality_auto/579922_07e367e948ae44d186a20946870246cf~mv2.png" >
</p>
2. Enable the preset you want to use from the list;
3. Clear overwrite to delete the ENB Shader Cache as it needs to be regenerated when changing ENB:
<p align="center">
    <img src="https://static.wixstatic.com/media/579922_7b4dcdecd048480b9393151600b1f903~mv2.png/v1/fill/w_719,h_335,al_c,lg_1,q_85,enc_avif,quality_auto/579922_7b4dcdecd048480b9393151600b1f903~mv2.png" >
</p>
4. It works the same for Reshade, exept you don't need to clear the cache and can have multiple presets installed at the same time.

## Increasing Wunduniik Performance

### Profiles Options

Wunduniik comes with 3 different profiles: Performance, Standard and Ultra. The profiles are automatically assigned at Mod Organizer 2 launch through a plugin called Profile Assistant. It chooses the profile based on the following informations: your screen resolution and your amount of VRAM. Here are the differences between the 3 profiles:
- Performance (0GB to 8GB VRAM): Sparse Forest with less realistic trees and lower density flora;
- Standard (8GB to 14GB VRAM): Sparse Forests with realistic trees and dense flora;
- Ultra (14GB VRAM and more): Dense Forests with realistic trees, ultra dense flora and Grass Lods.  
Additionally, at first launch of Mod Organizer 2, the app will verify you have a correct amount of pagefile set up and will check if your system is compatible with Frame Generation for ENB. If so, it will display a positive pop up on screen and automatically enable it. Frame Generation for ENB can double your performance at no visual cost if you have a compatible hardware and up to date .net framework.
<p align="center">
    <img src="https://static.wixstatic.com/media/579922_349e8144acad4d0183354432f0602cb1~mv2.png/v1/fill/w_600,h_245,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/3b4e2d65f56f9178bbbad61edea29b3d1b3db469301776c6b449d80ffb953f62.png" >
</p>
​
### SSE Display Tweaks

Use the server command /displaytweaks to see how to access and use this file.  
Set BorderlessUpscale = True. Remove the # if present.  
Remove the # from #ResolutionScale=0.75. You can play with this 0.75 number to tweak the scaling value.  

### Disable ENB In-Game

Open ENB GUI with shift+enter.  
Under enbseries.ini section go to GLOBAL and uncheck UseEffect. Then click on the ---SAVE CONFIGURATION--- box above.

{: .warning }
> This method is not recommended as it will break visuals and some other mods functions like lighting or parallax. Do this only on last resort.

The next solutions presented are going to be external tools not included in the modlist, some free, some to buy.

{: .note } You are NOT forced to install and buy those apps and tools. We are only providing you solutions to help your performance.

### Magpie Window Scaling Tool (free)

[https://github.com/Blinue/Magpie](https://github.com/Blinue/Magpie)  
Follow the provided How To Use steps on the github.

### PureDark's DLSS Mod -> $5

'Google it'  
Follow the provided guide on the Patreon or check the appropriate channel on their Discord.

### THS Lossless Scaling Steam Program $7

Search for it on Steam.  
After purchasing, go to the Guides section to set it up.
