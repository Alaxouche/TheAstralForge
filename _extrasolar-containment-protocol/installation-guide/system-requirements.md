---
layout: skyground_readme
title: System Requirements
parent: Installation Guide
nav_order: 1
---

<div lang="en" markdown="1">

# System Requirements & Necessary Tools

## System Requirements

Only Windows 10 and 11 fully support Wabbajack. LTSC, special variants, lightened editions or any other modified variant **WILL NOT WORK**. Your Windows version **must be 21H2 or newer** to run both Wabbajack and Extrasolar Containment Protocol.

Running the list from Hard Disk Drives or external drives is **STRONGLY ADVISED AGAINST**.

</div>
<div lang="fr" markdown="1">

# Configuration Requise & Outils Nécessaires

## Configuration Requise

Seuls Windows 10 et 11 prennent entièrement en charge Wabbajack. Les variantes LTSC, éditions spéciales ou allégées **NE FONCTIONNERONT PAS**. Votre version de Windows **doit être 21H2 ou plus récente**.

Exécuter la liste depuis des disques durs (HDD) ou des lecteurs externes est **FORTEMENT DÉCONSEILLÉ**.

</div>

<div class="modlist-size">
<p lang="en"><strong>Space required:</strong> <span data-modlist-total>Loading...</span> in total, including <span data-modlist-install>Loading...</span> for the install and <span data-modlist-download>Loading...</span> for the downloads.</p>
<p lang="fr"><strong>Espace nécessaire :</strong> <span data-modlist-total>Loading...</span> au total, dont <span data-modlist-install>Loading...</span> pour l'installation et <span data-modlist-download>Loading...</span> pour les téléchargements.</p>
</div>

<div lang="en" markdown="1">

> If the space requirement is uncomfortable, you can delete downloads once installed. You can also set your download location to a different drive. The Wabbajack troubleshooting FAQ recommends keeping an extra 40 to 60 GB free on top of these numbers during installation.
{: .note }

| Configuration         | CPU        | GPU                | RAM          | Storage                | Display          | FPS |
|-----------------------|------------|--------------------|--------------|------------------------|------------------|-----|
| **Minimum Specs**     | i5-9600k   | Nvidia RTX 2070    | 16 GB DDR4   | SATA SSD, space above  | FHD 60 Hz        | 45  |
| **Recommended Specs** | i7-10700k  | Nvidia RTX 3080    | 32 GB DDR4   | 1 TB M.2 SSD           | FHD 60 Hz        | 60  |
| **Author's Specs**    | i5-10400f  | Nvidia RTX 3090    | 32 GB DDR4   | 1 TB M.2 SSD           | 2K 180 Hz        | 60+ |

## Necessary And Useful Applications

Install the latest [Microsoft Visual C++ Redistributable (x64)](https://aka.ms/vc14/vc_redist.x64.exe), then restart your PC. Wabbajack ships with the .NET runtime it needs. If the install stops on texture conversion (texconv) errors, the [Wabbajack troubleshooting FAQ](https://wiki.wabbajack.org/user_documentation/Troubleshooting%20FAQ.html) says to also install the [.NET 8 Desktop Runtime](https://dotnet.microsoft.com/download/dotnet/8.0).

## PageFile Configuration

**Larger modlists** need a lot of memory. **Never disable the pagefile.**

1. Press **Windows + R** → type `sysdm.cpl,3` → **Enter**
2. **Performance** → **Settings** → **Advanced** → **Virtual memory** → **Change…**
3. Disable **Automatically manage...** → **Custom size:** Initial 20480 / Maximum 40960
4. **Set** → **Apply** → **OK** → Restart your computer

---

**THIS IS NOT OPTIONAL, YOU CANNOT SKIP THIS STEP EVEN IF YOU HAVE 256 GB OF RAM.**

## Exclusions and AntiVirus

Make sure to add your Starfield installation folder, your Wabbajack folder, and your modlist installation folder to your antivirus exclusions. Security software can interfere with Wabbajack downloads and mod file extraction.

</div>
<div lang="fr" markdown="1">

> Si l'espace requis vous pose problème, vous pouvez supprimer les téléchargements une fois l'installation terminée. Vous pouvez aussi placer le dossier de téléchargement sur un autre disque. La FAQ de dépannage de Wabbajack conseille de garder 40 à 60 Go libres en plus de ces chiffres pendant l'installation.
{: .note }

| Configuration          | CPU        | GPU                | RAM          | Stockage               | Écran            | FPS |
|------------------------|------------|--------------------|--------------|------------------------|------------------|-----|
| **Config. Minimum**    | i5-9600k   | Nvidia RTX 2070    | 16 Go DDR4   | SSD SATA, place ci-dessus | FHD 60 Hz        | 45  |
| **Config. Recommandée**| i7-10700k  | Nvidia RTX 3080    | 32 Go DDR4   | 1 To M.2 SSD           | FHD 60 Hz        | 60  |
| **Config. de l'Auteur**| i5-10400f  | Nvidia RTX 3090    | 32 Go DDR4   | 1 To M.2 SSD           | 2K 180 Hz        | 60+ |

## Applications Nécessaires et Utiles

Installez la dernière version de [Microsoft Visual C++ Redistributable (x64)](https://aka.ms/vc14/vc_redist.x64.exe), puis redémarrez votre PC. Wabbajack embarque le runtime .NET dont il a besoin. Si l'installation s'arrête sur des erreurs de conversion de textures (texconv), la [FAQ de dépannage de Wabbajack](https://wiki.wabbajack.org/user_documentation/Troubleshooting%20FAQ.html) conseille d'installer aussi le [.NET 8 Desktop Runtime](https://dotnet.microsoft.com/download/dotnet/8.0).

## Configuration du Fichier d'Échange

**Les grandes modlists** nécessitent beaucoup de mémoire. **Ne désactivez jamais le fichier d'échange.**

1. **Windows + R** → tapez `sysdm.cpl,3` → **Entrée**
2. **Performances** → **Paramètres** → **Avancé** → **Mémoire virtuelle** → **Modifier…**
3. Désactivez **Gérer automatiquement...** → **Taille personnalisée :** Initial 20480 / Maximum 40960
4. **Définir** → **Appliquer** → **OK** → Redémarrez votre ordinateur

---

**CETTE ÉTAPE N'EST PAS OPTIONNELLE, MÊME AVEC 256 GO DE RAM.**

## Exclusions et Antivirus

Assurez-vous d'ajouter votre dossier d'installation Starfield, votre dossier Wabbajack et votre dossier d'installation de la modlist aux exclusions de votre antivirus. Les logiciels de sécurité peuvent interférer avec les téléchargements Wabbajack et l'extraction des fichiers de mods.

</div>
