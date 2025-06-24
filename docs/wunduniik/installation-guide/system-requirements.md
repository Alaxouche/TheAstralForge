---
layout: default
title: System Requirement
parent: Installation Guide
nav_order: 1
---

# System Requirements Necessary Tools

## System Requirements

As Wunduniik is a modlist modlist based on graphics, you must have a good graphic card.  
**YOU NEED 500GB free to download the modlist**

{: .note } If the space requirement is uncomfortable, remember that you can delete downloads and/or the french translations once the list is successfully installed. You can also set your download location to a different drive than the installation location; more on that later.

| Configuration         | CPU        | GPU                | RAM          | Stockage               | Écran            | FPS |
|-----------------------|------------|--------------------|--------------|------------------------|------------------|-----|
| **Minimum Specs**     | i5-7600k   | Nvidia GTX 2080    | 16 GB DDR4   | 500 GB SATA II SSD     | FHD 60 Hz        | 45  |
| **Recommended Specs** | i7-9700k   | Nvidia RTX 3060 Ti | 32 GB DDR4   | 1 TB SATA III/M.2 SSD  | FHD 60 Hz        | 60  |
| **Author’s Specs**    | i5-10400f  | Nvidia RTX 3090    | 32 GB DDR4   | 1 TB M.2 SSD           | 2K 180 Hz        | 60+ |

## Necessary And Useful Applications

For the modlist to work you must have some apps: Please ensure you have the latest .NET version installed. Download the desktop app installer and console app x64 from Microsoft here  
[https://dotnet.microsoft.com/download/dotnet/5.0/runtime](https://dotnet.microsoft.com/download/dotnet/5.0/runtime), and also [Visual C++ x64](https://aka.ms/vs/16/release/vc_redist.x64.exe).

<p align="center">
![Image](https://raw.githubusercontent.com/Lost-Outpost/lost-legacy/main/images/microsoft-net-5-0-installation.png)
</p>

To help you with the INIs configuration, I highly recommand to have installed [Sublime Text](https://www.sublimetext.com/)

<img src="https://static.wixstatic.com/media/579922_da459dcbe3be46ad934f5ed3d962eca8~mv2.png/v1/fill/w_384,h_587,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/e692b4cc9e2a94f37eec075d05c81bdd2d2a925dbf55944e1d2abfb660ab6d0f.png" 
     alt="PageFile Configuration" 
     align="right" 
     width="200" />

## PageFile Configuration

**Bigger Skyrim modlists** need a lot of memory, and when there is not enough available it may fail allocating more.

To fix this, you’ll want to have a bigger pagefile. A pagefile is a file on your disk Windows will use when there is not enough RAM available.

**Never disable the pagefile** – this may lead to various issues on your system, such as this Skyrim crash. If you’ve never touched the pagefile, try performing the following steps:

1. Press **Windows + R** on your keyboard  
2. Type `sysdm.cpl,3`  
3. Press **Enter**  
4. Under the **Performance** section, press **Settings**  
5. Click the **Advanced** tab at the top  
6. At the **Virtual memory** section press **Change…**  
7. Disable **Automatically manage paging file size for all drives**  
8. Click **Custom size:**  
   - **Initial size (MB):** 20480  
   - **Maximum size (MB):** 40960  
9. Click **Set**  
10. Click **Apply** & **OK**  
11. Press **Yes** to restart  
12. Restart your computer

---

**THIS IS NOT OPTIONAL, YOU CANNOT SKIP THIS STEP EVEN IF YOU HAVE 256 GB OF RAM.**

<img src="[https://static.wixstatic.com/media/579922_1d3150…~mv2.jpg](https://static.wixstatic.com/media/579922_1d3150dfc46844dfaf1d657e56c723d3~mv2.jpg/v1/fill/w_396,h_478,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/579922_1d3150dfc46844dfaf1d657e56c723d3~mv2.jpg)" 
     alt="Exclusions and AntiVirus" 
     align="right" 
     width="200" />
     
## Exclusions and AntiVirus

- Exclude **1)** `gamename.exe`, **2)** the game folder, and **3)** the shader cache folder from Windows Defender (or other) antivirus  
- Also exclude the game from Control Flow Guard:  
  1. Click **Start**  
  2. Type **Exploit Protection**  
  3. Click **Program Settings**  
  4. Click **Add program to customize**  
  5. Click **Add by program name**  
  6. Type **SKSE64_Loader.exe**  
  7. Scroll down to **Control flow guard (CFG)**  
  8. Click **Override**  
  9. Switch to **Off**
