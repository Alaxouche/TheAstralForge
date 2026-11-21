---
layout: skyground_readme
title: Updating the List
title_fr: Mettre à jour la liste
parent: Installation Guide
nav_order: 5.5
description: "How to update Krentoraan with Wabbajack without losing your saves or your own mods."
---

<div lang="en" markdown="1">

# Updating the List

A new version of Krentoraan installs over the old one, in the same folder. Wabbajack reuses the files you already downloaded, so only what changed is downloaded again.

## Before You Update

1. Read the changelog of the new version. A version marked **New save** is not compatible with games started on an older version: you will need a new game.
2. **Back up your saves.** Your saves are inside the list folder, in `profiles\<profile name>\saves`: the list keeps separate saves for each profile. Wabbajack leaves that folder alone during an update, but copy it somewhere outside the list folder first. A wrong folder choice or a cancelled update should never cost you a playthrough.
3. **Protect the mods you added.** The update deletes every file of the list folder that is not part of the list. Rename the folder of each mod you added in Mod Organizer 2 so that it starts with `[NoDelete]`, such as `[NoDelete] My Mod`: Wabbajack keeps those.
4. **Copy your own order.** The profile files (mod order, plugin order, INI files) are replaced by the list's. If you changed `modlist.txt` or `loadorder.txt` in your profile folder, copy them outside the list folder.
5. **Check the game version.** The list runs its own copy of Skyrim from its `Game Root` folder, which the update rebuilds. Leave the Steam game as it is. The [first page of the installation guide]({{ '/krentoraan/installation-guide/' | relative_url }}) gives the game version the list runs on.

## Updating

1. Close Mod Organizer 2 and the game.
2. Open Wabbajack, find Krentoraan in the gallery and download the new version, as for the first install.
3. Set **Installation Location** and **Downloads Location** to the **same folders as before**, then press **Install**.
4. Before deleting anything, Wabbajack shows a **Confirm file deletion** window with the number of files that are not part of the list. It keeps save files, the downloads folder and `[NoDelete]` folders. If the count looks wrong, check the folders you picked before you confirm.
5. When it is done, open Mod Organizer 2, check the profile at the top left and start the game as usual. Then redo the steps of the [post-installation page]({{ '/krentoraan/installation-guide/post-installation/' | relative_url }}) you changed.

## What the Update Keeps

| Kept | Replaced or deleted |
|---|---|
| The `saves` folders inside `profiles` | The list's mods, by their new versions |
| The downloads folder | Mods you added, unless their name starts with `[NoDelete]` |
| Folders and files whose name starts with `[NoDelete]` | Everything in the `overwrite` folder |
| The `.wabbajack` file | The profile files: mod order, plugin order and INI files |

The `overwrite` folder is where Mod Organizer 2 puts files written by the game and its tools, such as settings that mods save to a file: they go back to the list's defaults. Each profile has its own game INI files, and they are part of the list: the update puts back the list's versions. If you changed them with BethINI or by hand, do it again afterwards.

## Free Disk Space Afterwards

Wabbajack never empties the downloads folder: archives that the new version no longer uses stay there. Once the update works, you can delete the downloads folder to free space, but the next update will then download everything again.

</div>
<div lang="fr" markdown="1">

# Mettre à jour la liste

Une nouvelle version de Krentoraan s'installe par-dessus l'ancienne, dans le même dossier. Wabbajack réutilise les fichiers déjà téléchargés : seul ce qui a changé est téléchargé à nouveau.

## Avant de mettre à jour

1. Lisez le changelog de la nouvelle version. Une version marquée **Nouvelle partie** n'est pas compatible avec les parties commencées sur une version précédente : il faudra une nouvelle partie.
2. **Sauvegardez vos parties.** Vos sauvegardes sont dans le dossier de la liste, dans `profiles\<nom du profil>\saves` : la liste garde des sauvegardes séparées pour chaque profil. Wabbajack ne touche pas à ce dossier pendant une mise à jour, mais copiez-le d'abord hors du dossier de la liste. Un mauvais choix de dossier ou une mise à jour annulée ne doivent jamais vous coûter une partie.
3. **Protégez les mods que vous avez ajoutés.** La mise à jour supprime tous les fichiers du dossier de la liste qui n'en font pas partie. Renommez dans Mod Organizer 2 le dossier de chaque mod ajouté pour qu'il commence par `[NoDelete]`, par exemple `[NoDelete] Mon mod` : Wabbajack les garde.
4. **Copiez votre propre ordre.** Les fichiers du profil (ordre des mods, ordre des plugins, fichiers INI) sont remplacés par ceux de la liste. Si vous avez modifié `modlist.txt` ou `loadorder.txt` dans le dossier du profil, copiez-les hors du dossier de la liste.
5. **Vérifiez la version du jeu.** La liste lance sa propre copie de Skyrim depuis son dossier `Game Root`, que la mise à jour reconstruit. Laissez le jeu Steam tel quel. La [première page du guide d'installation]({{ '/krentoraan/installation-guide/' | relative_url }}) donne la version du jeu sur laquelle tourne la liste.

## Mettre à jour

1. Fermez Mod Organizer 2 et le jeu.
2. Ouvrez Wabbajack, trouvez Krentoraan dans la galerie et téléchargez la nouvelle version, comme pour la première installation.
3. Choisissez pour **Installation Location** et **Downloads Location** **les mêmes dossiers qu'avant**, puis appuyez sur **Install**.
4. Avant de supprimer quoi que ce soit, Wabbajack affiche une fenêtre **Confirm file deletion** avec le nombre de fichiers qui ne font pas partie de la liste. Il garde les sauvegardes, le dossier de téléchargements et les dossiers `[NoDelete]`. Si le nombre semble anormal, vérifiez les dossiers choisis avant de confirmer.
5. À la fin, ouvrez Mod Organizer 2, vérifiez le profil en haut à gauche et lancez le jeu comme d'habitude. Refaites ensuite les étapes de la [post-installation]({{ '/krentoraan/installation-guide/post-installation/' | relative_url }}) que vous aviez modifiées.

## Ce que la mise à jour garde

| Gardé | Remplacé ou supprimé |
|---|---|
| Les dossiers `saves` dans `profiles` | Les mods de la liste, par leurs nouvelles versions |
| Le dossier de téléchargements | Les mods ajoutés par vous, sauf si leur nom commence par `[NoDelete]` |
| Les dossiers et fichiers dont le nom commence par `[NoDelete]` | Tout le contenu du dossier `overwrite` |
| Le fichier `.wabbajack` | Les fichiers du profil : ordre des mods, ordre des plugins et fichiers INI |

Le dossier `overwrite` est celui où Mod Organizer 2 range les fichiers écrits par le jeu et ses outils, comme les réglages que des mods enregistrent dans un fichier : ils reviennent aux valeurs de la liste. Chaque profil a ses propres fichiers INI du jeu, et ils font partie de la liste : la mise à jour remet ceux de la liste. Si vous les aviez modifiés avec BethINI ou à la main, refaites-le ensuite.

## Libérer de l'espace ensuite

Wabbajack ne vide jamais le dossier de téléchargements : les archives que la nouvelle version n'utilise plus y restent. Une fois la mise à jour fonctionnelle, vous pouvez supprimer ce dossier pour libérer de la place, mais la prochaine mise à jour retéléchargera alors tout.

</div>
