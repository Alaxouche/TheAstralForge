---
layout: skyground_readme
title: Linux Installation Guide
parent: Installation Guide
nav_order: 7
reading_mode_default: true
---

<div lang="en" markdown="1">

# Krentoraan on Linux

Krentoraan is not officially supported on Linux by the modlist's creator, Alaxouche. Players have installed Alaxouche's lists on Linux with community tools. This guide assumes you have a basic understanding of Linux and Mod Organizer 2 (MO2). Read the Windows pages of this guide too: the game requirements (Steam, Anniversary Edition upgrade, English game, game files of version 1.6.1170) are the same.

### 1. Install the list

The Omni-Guides "Wabbajack via Proton" guide and the `omni-guides.sh` script that older versions of this page linked to are marked as superseded. Their author replaced them with **Jackify**, a Linux application that installs and configures Wabbajack modlists on Linux and Steam Deck.

*   **Read the guide:** [Installing a Modlist with Jackify](https://github.com/Omni-guides/Jackify/wiki/Installing-a-Modlist-with-Jackify). Jackify is downloaded from [Nexus Mods](https://www.nexusmods.com/site/mods/1427) and is still alpha software.
*   **Before you start:** Jackify needs Steam (not the Snap version), Protontricks and a Nexus Mods account (Premium for fully automatic downloads). Its guide recommends GE-Proton 10-14, the highest version it advises for ENB lists.
*   **Install:** in Jackify, choose **Modlist Tasks**, then **Install a Modlist (Automated)**, select Skyrim Special Edition, log in to Nexus, pick **Krentoraan**, set the install and download folders (avoid spaces in the paths), then **Start Installation**.
*   Jackify creates a Steam shortcut for the list. Launch it from your Steam library: it opens Mod Organizer 2.

{: .note }
Wabbajack itself added a Linux beta in version 4.3.2.0 (October 2026). It is a first beta. This guide has not been tested with it.

> **Note:** When you launch Mod Organizer 2 for the first time, an error from the **Frame Gen Compatibility Checker** may appear. This is expected on Linux. Simply click **OK** to dismiss the message and continue.

### 2. Start the game

*   In MO2, check that a Krentoraan profile is selected.
*   In the executable drop-down (next to **Run**), select **Krentoraan Launcher**, then click **Run**.
*   Do not click **Unlock** in MO2 while the game runs.

### 3. Handling Frame Generation

The **Frame Gen Compatibility Checker** will give an error on Linux. Click **OK** whenever it appears. Frame generation comes from the mod **(ENB) ENB Frame Generation**, in separator **16.2 ENBSERIES - CORE FILES**. It is enabled in the Standard and Ultra profiles and disabled in the Performance profile. Using it on Linux is at your own risk.

### 4. Troubleshooting

#### Game Closes Immediately After Launch

*   In MO2, select the **Skyrim Special Edition Launcher** executable (it is already in the list and points to `Game Root\SkyrimSELauncher.exe`) and click **Run**.
*   The vanilla launcher will open and select a graphics preset. Close it.
*   Change the MO2 executable back to **Krentoraan Launcher**.

For further issues, use the [Jackify wiki](https://github.com/Omni-guides/Jackify/wiki) or ask on Alaxouche's Discord server.

</div>
<div lang="fr" markdown="1">

# Krentoraan sur Linux

Krentoraan n'est pas officiellement pris en charge sur Linux par le créateur de la modlist, Alaxouche. Des joueurs ont installé les listes d'Alaxouche sur Linux avec des outils de la communauté. Ce guide suppose que vous avez des bases sur Linux et sur Mod Organizer 2 (MO2). Lisez aussi les pages Windows de ce guide : les exigences sur le jeu (Steam, mise à niveau Anniversary Edition, jeu en anglais, fichiers du jeu en version 1.6.1170) sont les mêmes.

### 1. Installer la liste

Le guide Omni-Guides « Wabbajack via Proton » et le script `omni-guides.sh`, cités par les anciennes versions de cette page, sont marqués comme remplacés. Leur auteur les a remplacés par **Jackify**, une application Linux qui installe et configure les modlists Wabbajack sur Linux et Steam Deck.

*   **Lisez le guide :** [Installing a Modlist with Jackify](https://github.com/Omni-guides/Jackify/wiki/Installing-a-Modlist-with-Jackify) (en anglais). Jackify se télécharge sur [Nexus Mods](https://www.nexusmods.com/site/mods/1427) et reste un logiciel en version alpha.
*   **Avant de commencer :** Jackify a besoin de Steam (pas de la version Snap), de Protontricks et d'un compte Nexus Mods (Premium pour des téléchargements entièrement automatiques). Son guide recommande GE-Proton 10-14, la version la plus haute qu'il conseille pour les listes ENB.
*   **Installation :** dans Jackify, choisissez **Modlist Tasks**, puis **Install a Modlist (Automated)**, sélectionnez Skyrim Special Edition, connectez-vous à Nexus, choisissez **Krentoraan**, indiquez les dossiers d'installation et de téléchargement (évitez les espaces dans les chemins), puis **Start Installation**.
*   Jackify crée un raccourci Steam pour la liste. Lancez-le depuis votre bibliothèque Steam : il ouvre Mod Organizer 2.

{: .note }
Wabbajack lui-même propose une bêta Linux depuis la version 4.3.2.0 (octobre 2026). C'est une première bêta. Ce guide n'a pas été testé avec elle.

> **Note :** Lors du premier lancement de MO2, une erreur du **Frame Gen Compatibility Checker** peut apparaître. C'est attendu sur Linux. Cliquez simplement sur **OK** pour continuer.

### 2. Lancer le jeu

*   Dans MO2, vérifiez qu'un profil Krentoraan est sélectionné.
*   Dans la liste déroulante des exécutables (à côté de **Run**), choisissez **Krentoraan Launcher**, puis cliquez sur **Run**.
*   Ne cliquez pas sur **Unlock** dans MO2 pendant que le jeu tourne.

### 3. Gestion de la Génération d'Images

Le **Frame Gen Compatibility Checker** donnera une erreur sur Linux. Cliquez sur **OK** à chaque fois. La génération d'images vient du mod **(ENB) ENB Frame Generation**, dans le séparateur **16.2 ENBSERIES - CORE FILES**. Il est activé dans les profils Standard et Ultra et désactivé dans le profil Performance. L'utiliser sur Linux se fait à vos risques.

### 4. Dépannage

#### Le Jeu Se Ferme Immédiatement Après le Lancement

*   Dans MO2, choisissez l'exécutable **Skyrim Special Edition Launcher** (il est déjà dans la liste et pointe vers `Game Root\SkyrimSELauncher.exe`) et cliquez sur **Run**.
*   Le lanceur vanilla s'ouvre et choisit un préréglage graphique. Fermez-le.
*   Remettez l'exécutable MO2 sur **Krentoraan Launcher**.

Pour d'autres problèmes, consultez le [wiki de Jackify](https://github.com/Omni-guides/Jackify/wiki) ou demandez sur le serveur Discord d'Alaxouche.

</div>
