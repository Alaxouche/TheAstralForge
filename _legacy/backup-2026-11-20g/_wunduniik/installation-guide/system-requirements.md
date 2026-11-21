---
layout: skyground_readme
title: System Requirements
parent: Installation Guide
nav_order: 1
---

<div lang="en" markdown="1">

# System Requirements

## System Requirements

Only Windows 10 and 11 fully support Wabbajack. LTSC, special variants, lightened editions or any other modified variant **WILL NOT WORK**. Your Windows version **must be 21H2 or newer** to run both Wabbajack and Wunduniik.

Running the list from Hard Disk Drives or external drives is **STRONGLY ADVISED AGAINST**. A lot of content is swapped at game run time and, as a result, fast storage and RAM are needed.

As Wunduniik is a modlist based on graphics, you must have a good graphics card.

</div>
<div lang="fr" markdown="1">

# Configuration Requise

## Configuration Requise

Seuls Windows 10 et 11 prennent entièrement en charge Wabbajack. Les variantes LTSC, éditions spéciales, allégées ou toute autre variante modifiée **NE FONCTIONNERONT PAS**. Votre version de Windows **doit être 21H2 ou plus récente** pour faire fonctionner Wabbajack et Wunduniik.

Exécuter la liste depuis des disques durs (HDD) ou des lecteurs externes est **FORTEMENT DÉCONSEILLÉ**. Une grande quantité de contenu est échangée lors de l'exécution du jeu, ce qui nécessite un stockage rapide et de la RAM.

Comme Wunduniik est une modlist axée sur les graphismes, vous devez disposer d'une bonne carte graphique.

</div>

<div class="modlist-size" data-modlist-size data-modlist-source="https://raw.githubusercontent.com/Alaxouche/Wunduniik/main/modlist.json" data-modlist-title="Wunduniik">
  <strong>Space required:</strong>
  <span data-modlist-total>Loading...</span> total,
  including <span data-modlist-install>Loading...</span> for install
  and <span data-modlist-download>Loading...</span> for downloads.
  <span data-modlist-version hidden>Version</span>
</div>

<noscript>
  <p><strong>Space required:</strong> about 502 GB total (311 GB install + 190 GB downloads).</p>
</noscript>

<div lang="en" markdown="1">

> If the space requirement is uncomfortable, remember that you can delete downloads once the list is successfully installed. You can also set your download location to a different drive than the installation location; more on that later.
{: .note }

| Configuration         | CPU        | GPU                | RAM          | Storage                | Display          | FPS |
|-----------------------|------------|--------------------|--------------|------------------------|------------------|-----|
| **Minimum Specs**     | i5-7600k   | Nvidia GTX 2080    | 16 GB DDR4   | 500 GB SATA II SSD     | FHD 60 Hz        | 45  |
| **Recommended Specs** | i7-9700k   | Nvidia RTX 3060 Ti | 32 GB DDR4   | 1 TB SATA III/M.2 SSD  | FHD 60 Hz        | 60  |
| **Author's Specs**    | i5-10400f  | Nvidia RTX 3090    | 32 GB DDR4   | 1 TB M.2 SSD           | 2K 180 Hz        | 60+ |

## Necessary And Useful Applications

For the modlist to work you must have some apps: Please ensure you have the latest .NET Runtime installed. Download the desktop app installer and console app x64 from Microsoft here:
[https://dotnet.microsoft.com/en-us/download](https://dotnet.microsoft.com/en-us/download), and also the latest [Visual C++ Redistributable x64](https://aka.ms/vc14/vc_redist.x64.exe). Wabbajack itself already includes its own .NET runtime.

<p align="center">
     <img src="/assets/Images/guides/microsoft-net-5-0-installation-10f760.webp" alt=".NET download page: the Download x64 buttons for console and desktop apps are highlighted" width="500" height="312">
</p>

To help you with the INIs configuration, I highly recommend installing [Sublime Text](https://www.sublimetext.com/)

## PageFile Configuration

<img src="/assets/Images/guides/da459dcbe3be46ad934f5ed3d962eca8-e9c33a.webp" alt="Windows Virtual Memory window: custom size, initial 20480 MB and maximum 40960 MB on drive C" width="891" height="1360">

**Bigger Skyrim modlists** need a lot of memory, and when there is not enough available it may fail allocating more.

To fix this, you'll want to have a bigger pagefile. A pagefile is a file on your disk Windows will use when there is not enough RAM available.

**Never disable the pagefile**: this may lead to various issues on your system, including Skyrim crashes. If you've never touched the pagefile, try performing the following steps:

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

## Exclusions and AntiVirus

<img src="/assets/Images/guides/1d3150dfc46844dfaf1d657e56c723d3-39fd15.webp" alt="Windows Exploit protection, program settings for GoaT.exe: Code integrity guard and Control flow guard overrides" width="527" height="634">

- Exclude **1)** `SkyrimSE.exe` and `skse64_loader.exe`, **2)** the Wunduniik install folder (it holds the game copy in `Game Root`), and **3)** the shader cache folder from Windows Defender (or other) antivirus
- The install folder contains `Windows Exclusion.bat`. Run it to add the Windows Defender exclusions for you: it asks for administrator rights, then excludes the install folder, the two Skyrim folders in Documents and AppData, the game, SKSE and Mod Organizer. `Windows Exclusion.bat /remove` undoes it. It only works with Windows Defender: with another antivirus, add the exclusions by hand.
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

---

</div>
<div lang="fr" markdown="1">

> Si l'espace requis vous pose problème, sachez que vous pouvez supprimer les téléchargements une fois la liste installée avec succès. Vous pouvez également définir un emplacement de téléchargement sur un lecteur différent de celui de l'installation.
{: .note }

| Configuration          | CPU        | GPU                 | RAM          | Stockage               | Écran            | FPS |
|------------------------|------------|---------------------|--------------|------------------------|------------------|-----|
| **Config. Minimum**    | i5-7600k   | Nvidia GTX 2080     | 16 Go DDR4   | 500 Go SATA II SSD     | FHD 60 Hz        | 45  |
| **Config. Recommandée**| i7-9700k   | Nvidia RTX 3060 Ti  | 32 Go DDR4   | 1 To SATA III/M.2 SSD  | FHD 60 Hz        | 60  |
| **Config. de l'Auteur**| i5-10400f  | Nvidia RTX 3090     | 32 Go DDR4   | 1 To M.2 SSD           | 2K 180 Hz        | 60+ |

## Applications Nécessaires et Utiles

Pour que la modlist fonctionne, vous devez disposer de certaines applications. Veuillez vous assurer que le dernier runtime .NET est installé. Téléchargez l'installateur de l'application bureau et l'application console x64 depuis Microsoft ici :
[https://dotnet.microsoft.com/fr-fr/download](https://dotnet.microsoft.com/fr-fr/download), ainsi que la dernière version de [Visual C++ Redistributable x64](https://aka.ms/vc14/vc_redist.x64.exe). Wabbajack embarque déjà son propre runtime .NET.

<p align="center">
     <img src="/assets/Images/guides/microsoft-net-5-0-installation-10f760.webp" alt="Page de téléchargement de .NET : les boutons Download x64 des applications console et bureau sont mis en avant" width="500" height="312">
</p>

Pour vous aider avec la configuration des INIs, je recommande vivement d'installer [Sublime Text](https://www.sublimetext.com/)

## Configuration du Fichier d'Échange (PageFile)

<img src="/assets/Images/guides/da459dcbe3be46ad934f5ed3d962eca8-e9c33a.webp" alt="Fenêtre Mémoire virtuelle de Windows : taille personnalisée, initiale 20480 Mo et maximale 40960 Mo sur le lecteur C" width="891" height="1360">

**Les grandes modlists Skyrim** ont besoin de beaucoup de mémoire, et lorsqu'il n'y en a pas assez de disponible, l'allocation peut échouer.

Pour corriger cela, vous devrez augmenter la taille du fichier d'échange. Un fichier d'échange est un fichier sur votre disque que Windows utilisera lorsque la RAM disponible est insuffisante.

**Ne désactivez jamais le fichier d'échange** : cela peut entraîner divers problèmes sur votre système, y compris des crashs de Skyrim. Si vous n'avez jamais modifié le fichier d'échange, effectuez les étapes suivantes :

1. Appuyez sur **Windows + R** sur votre clavier
2. Tapez `sysdm.cpl,3`
3. Appuyez sur **Entrée**
4. Dans la section **Performances**, cliquez sur **Paramètres**
5. Cliquez sur l'onglet **Avancé** en haut
6. Dans la section **Mémoire virtuelle**, cliquez sur **Modifier…**
7. Désactivez **Gérer automatiquement la taille du fichier d'échange pour tous les lecteurs**
8. Cliquez sur **Taille personnalisée :**
   - **Taille initiale (Mo) :** 20480
   - **Taille maximale (Mo) :** 40960
9. Cliquez sur **Définir**
10. Cliquez sur **Appliquer** & **OK**
11. Cliquez sur **Oui** pour redémarrer
12. Redémarrez votre ordinateur

---

**CETTE ÉTAPE N'EST PAS OPTIONNELLE, VOUS NE POUVEZ PAS LA PASSER MÊME SI VOUS AVEZ 256 GO DE RAM.**

## Exclusions et Antivirus

<img src="/assets/Images/guides/1d3150dfc46844dfaf1d657e56c723d3-39fd15.webp" alt="Protection contre les exploits de Windows, paramètres du programme GoaT.exe : options Code integrity guard et Control flow guard" width="527" height="634">

- Excluez **1)** `SkyrimSE.exe` et `skse64_loader.exe`, **2)** le dossier d'installation de Wunduniik (il contient la copie du jeu dans `Game Root`), et **3)** le dossier du cache de shaders de Windows Defender (ou autre) antivirus
- Le dossier d'installation contient `Windows Exclusion.bat`. Lancez-le pour ajouter les exclusions de Windows Defender à votre place : il demande les droits administrateur, puis exclut le dossier d'installation, les deux dossiers Skyrim de Documents et d'AppData, le jeu, SKSE et Mod Organizer. `Windows Exclusion.bat /remove` annule tout. Il ne fonctionne qu'avec Windows Defender : avec un autre antivirus, ajoutez les exclusions à la main.
- Excluez également le jeu du Control Flow Guard :
  1. Cliquez sur **Démarrer**
  2. Tapez **Protection contre les attaques**
  3. Cliquez sur **Paramètres du programme**
  4. Cliquez sur **Ajouter un programme à personnaliser**
  5. Cliquez sur **Ajouter par nom de programme**
  6. Tapez **SKSE64_Loader.exe**
  7. Faites défiler jusqu'à **Protection du flux de contrôle (CFG)**
  8. Cliquez sur **Remplacer**
  9. Basculez sur **Désactivé**

---

</div>
