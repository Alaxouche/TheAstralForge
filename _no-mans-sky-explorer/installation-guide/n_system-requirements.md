---
layout: skyground_readme
title: System Requirement
parent: Installation Guide
nav_order: 1
---

<div lang="en" markdown="1">

# System Requirements & Necessary Tools

## System Requirements

Only Windows 10 and 11 fully support Wabbajack. LTSC, special variants, lightened editions or any other modified variant **WILL NOT WORK**. Your Windows version **must be 21H2 or newer** to run both Wabbajack and No Man's Sky Explorer.

Running the list from Hard Disk Drives or external drives is **STRONGLY ADVISED AGAINST**.

As No Man's Sky Explorer is a modlist based on graphics, you must have a good graphics card.

</div>
<div lang="fr" markdown="1">

# Configuration Requise & Outils Nécessaires

## Configuration Requise

Seuls Windows 10 et 11 prennent entièrement en charge Wabbajack. Les variantes LTSC, éditions spéciales ou allégées **NE FONCTIONNERONT PAS**. Votre version de Windows **doit être 21H2 ou plus récente**.

Exécuter la liste depuis des disques durs (HDD) ou des lecteurs externes est **FORTEMENT DÉCONSEILLÉ**.

Comme No Man's Sky Explorer est une modlist axée sur les graphismes, vous devez disposer d'une bonne carte graphique.

</div>

<div class="modlist-size" data-modlist-size data-modlist-source="https://raw.githubusercontent.com/Alaxouche/Wunduniik/main/modlist.json" data-modlist-machine="NMSExplorer">
   <strong>Space required:</strong>
   <span data-modlist-total>Loading...</span> total,
   including <span data-modlist-install>Loading...</span> for install
   and <span data-modlist-download>Loading...</span> for downloads.
   <span data-modlist-version hidden>Version</span>
</div>

<noscript>
   <p><strong>Space required:</strong> 12 GB total (approx. 10 GB install + 2 GB downloads).</p>
</noscript>

<div lang="en" markdown="1">

> If the space requirement is uncomfortable, you can delete downloads once installed.
{: .note }

| Configuration         | CPU        | GPU                | RAM          | Storage                | Display          | FPS  |
|-----------------------|------------|--------------------|--------------|------------------------|------------------|------|
| **Minimum Specs**     | i5-7600k   | Nvidia GTX 2060    | 16 GB DDR4   | 500 GB SATA II SSD     | FHD 60 Hz        | 45   |
| **Recommended Specs** | i7-9700k   | Nvidia RTX 3060 Ti | 32 GB DDR4   | 1 TB SATA III/M.2 SSD  | FHD 60 Hz        | 60+  |
| **Author's Specs**    | i5-10400f  | Nvidia RTX 3090    | 32 GB DDR4   | 1 TB M.2 SSD           | 2K 180 Hz        | 60+  |

## Necessary And Useful Applications

Please ensure you have the latest .NET version installed:
[https://dotnet.microsoft.com/download/dotnet/5.0/runtime](https://dotnet.microsoft.com/download/dotnet/5.0/runtime), and also [Visual C++ x64](https://aka.ms/vs/16/release/vc_redist.x64.exe).

<p align="center">
     <img src="/assets/Images/guides/microsoft-net-5-0-installation-10f760.webp" alt=".NET download page: the Download x64 buttons for console and desktop apps are highlighted" width="500" height="312">
</p>

## PageFile Configuration

<img src="/assets/Images/guides/da459dcbe3be46ad934f5ed3d962eca8-e9c33a.webp" alt="Windows Virtual Memory window: custom size, initial 20480 MB and maximum 40960 MB on drive C" width="891" height="1360">

**Bigger NMS modlists** need a lot of memory. **Never disable the pagefile.**

1. Press **Windows + R** → type `sysdm.cpl,3` → **Enter**
2. **Performance** → **Settings** → **Advanced** → **Virtual memory** → **Change…**
3. Disable **Automatically manage...** → **Custom size:** Initial 20480 / Maximum 40960
4. **Set** → **Apply** → **OK** → Restart

---

**THIS IS NOT OPTIONAL, YOU CANNOT SKIP THIS STEP EVEN IF YOU HAVE 256 GB OF RAM.**

## Exclusions and AntiVirus

<img src="/assets/Images/guides/1d3150dfc46844dfaf1d657e56c723d3-39fd15.webp" alt="Windows Exploit protection, program settings for GoaT.exe: Code integrity guard and Control flow guard overrides" width="527" height="634">

- Exclude **1)** `NMS.exe`, **2)** the game folder, and **3)** the shader cache folder from antivirus
- Exclude from Control Flow Guard: Start → **Exploit Protection** → **Program Settings** → Add **NMS.exe** → **Control flow guard (CFG)** → **Override** → **Off**

</div>
<div lang="fr" markdown="1">

> Si l'espace requis vous pose problème, vous pouvez supprimer les téléchargements une fois l'installation terminée.
{: .note }

| Configuration          | CPU        | GPU                 | RAM          | Stockage               | Écran            | FPS  |
|------------------------|------------|---------------------|--------------|------------------------|------------------|------|
| **Config. Minimum**    | i5-7600k   | Nvidia GTX 2060     | 16 Go DDR4   | 500 Go SATA II SSD     | FHD 60 Hz        | 45   |
| **Config. Recommandée**| i7-9700k   | Nvidia RTX 3060 Ti  | 32 Go DDR4   | 1 To SATA III/M.2 SSD  | FHD 60 Hz        | 60+  |
| **Config. de l'Auteur**| i5-10400f  | Nvidia RTX 3090     | 32 Go DDR4   | 1 To M.2 SSD           | 2K 180 Hz        | 60+  |

## Applications Nécessaires et Utiles

Assurez-vous d'avoir la dernière version de .NET installée :
[https://dotnet.microsoft.com/download/dotnet/5.0/runtime](https://dotnet.microsoft.com/download/dotnet/5.0/runtime), ainsi que [Visual C++ x64](https://aka.ms/vs/16/release/vc_redist.x64.exe).

<p align="center">
     <img src="/assets/Images/guides/microsoft-net-5-0-installation-10f760.webp" alt="Page de téléchargement de .NET : les boutons Download x64 des applications console et bureau sont mis en avant" width="500" height="312">
</p>

## Configuration du Fichier d'Échange

<img src="/assets/Images/guides/da459dcbe3be46ad934f5ed3d962eca8-e9c33a.webp" alt="Fenêtre Mémoire virtuelle de Windows : taille personnalisée, initiale 20480 Mo et maximale 40960 Mo sur le lecteur C" width="891" height="1360">

**Les grandes modlists NMS** nécessitent beaucoup de mémoire. **Ne désactivez jamais le fichier d'échange.**

1. **Windows + R** → tapez `sysdm.cpl,3` → **Entrée**
2. **Performances** → **Paramètres** → **Avancé** → **Mémoire virtuelle** → **Modifier…**
3. Désactivez **Gérer automatiquement...** → **Taille personnalisée :** Initial 20480 / Maximum 40960
4. **Définir** → **Appliquer** → **OK** → Redémarrez

---

**CETTE ÉTAPE N'EST PAS OPTIONNELLE, MÊME AVEC 256 GO DE RAM.**

## Exclusions et Antivirus

<img src="/assets/Images/guides/1d3150dfc46844dfaf1d657e56c723d3-39fd15.webp" alt="Protection contre les exploits de Windows, paramètres du programme GoaT.exe : options Code integrity guard et Control flow guard" width="527" height="634">

- Excluez **1)** `NMS.exe`, **2)** le dossier du jeu, et **3)** le dossier du cache de shaders de votre antivirus
- Excluez du Control Flow Guard : Démarrer → **Protection contre les attaques** → **Paramètres du programme** → Ajoutez **NMS.exe** → **Protection du flux de contrôle (CFG)** → **Remplacer** → **Désactivé**

</div>
