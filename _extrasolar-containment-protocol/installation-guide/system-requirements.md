---
layout: skyground_readme
title: System Requirements
parent: Installation Guide
nav_order: 1
---

# System Requirements & Necessary Tools

## System Requirements

Only Windows 10 and 11 fully support Wabbajack. LTSC, special variants, lightened editions or any other modified variant **WILL NOT WORK**. Your Windows version **must be 21H2 or newer** to run both Wabbajack and Extrasolar Containment Protocol.

Running the list from Hard Disk Drives or external drives is **STRONGLY ADVISED AGAINST**. A lot of content is swapped at game run time and, as a result, fast storage and RAM are needed.

<div class="modlist-size" data-modlist-size data-modlist-source="https://raw.githubusercontent.com/Alaxouche/extrasolar-containment-protocol/main/modlist.json" data-modlist-title="Extrasolar Containment Protocol">
  <strong>Space required:</strong>
  <span data-modlist-total>Loading...</span> total,
  including <span data-modlist-install>Loading...</span> for install
  and <span data-modlist-download>Loading...</span> for downloads.
  <span data-modlist-version hidden>Version</span>
</div>

<noscript>
  <p><strong>Space required:</strong> Refer to the Wabbajack gallery for current size information.</p>
</noscript>

> If the space requirement is uncomfortable, remember that you can delete downloads once the list is successfully installed. You can also set your download location to a different drive than the installation location.
{: .note }

| Configuration         | CPU        | GPU                | RAM          | Storage                | Display          | FPS |
|-----------------------|------------|--------------------|--------------|------------------------|------------------|-----|
| **Minimum Specs**     | i5-9600k   | Nvidia RTX 2070    | 16 GB DDR4   | 500 GB SATA III SSD    | FHD 60 Hz        | 45  |
| **Recommended Specs** | i7-10700k  | Nvidia RTX 3080    | 32 GB DDR4   | 1 TB M.2 SSD           | FHD 60 Hz        | 60  |
| **Author's Specs**    | i5-10400f  | Nvidia RTX 3090    | 32 GB DDR4   | 1 TB M.2 SSD           | 2K 180 Hz        | 60+ |

## Necessary And Useful Applications

For the modlist to work you must have some apps installed. Please ensure you have the latest .NET version installed. Download the desktop app installer and console app x64 from Microsoft here  
[https://dotnet.microsoft.com/download/dotnet/5.0/runtime](https://dotnet.microsoft.com/download/dotnet/5.0/runtime), and also [Visual C++ x64](https://aka.ms/vs/16/release/vc_redist.x64.exe).

## PageFile Configuration

**Larger modlists** need a lot of memory, and when there is not enough available it may fail allocating more. To fix this, you'll want to have a bigger pagefile.

**Never disable the pagefile** – this may lead to various issues on your system.

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
11. Restart your computer

---

**THIS IS NOT OPTIONAL, YOU CANNOT SKIP THIS STEP EVEN IF YOU HAVE 256 GB OF RAM.**

## Exclusions and AntiVirus

Make sure to add your Starfield installation folder, your Wabbajack folder, and your modlist installation folder to your antivirus exclusions. Security software can interfere with Wabbajack downloads and mod file extraction.
