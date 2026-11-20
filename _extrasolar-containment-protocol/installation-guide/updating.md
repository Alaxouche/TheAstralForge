---
layout: skyground_readme
title: Updating the List
title_fr: Mettre à jour la liste
parent: Installation Guide
nav_order: 5.5
description: "How to update Extrasolar Containment Protocol with Wabbajack without losing your saves or your own mods."
---

<div lang="en" markdown="1">

# Updating the List

A new version of Extrasolar Containment Protocol installs over the old one, in the same folder. Wabbajack reuses the files you already downloaded, so only what changed is downloaded again.

## Before You Update

1. Read the [changelog]({{ '/extrasolar-containment-protocol/changelog/' | relative_url }}) of the new version. A version marked **New save** is not compatible with games started on an older version: you will need a new game.
2. **Back up your saves.** Starfield keeps its saves outside the list folder, in `Documents\My Games\Starfield\Saves`. The update does not touch them; copy that folder anyway before you update.
3. **Protect the mods you added.** The update deletes every file of the list folder that is not part of the list. Rename the folder of each mod you added in Mod Organizer 2 so that it starts with `[NoDelete]`, such as `[NoDelete] My Mod`: Wabbajack keeps those.
4. **Copy your own order.** The profile files (mod order, plugin order) are replaced by the list's. If you changed `modlist.txt` or `loadorder.txt` in your profile folder, copy them outside the list folder.
5. **Check the game version.** Each list version is made for a given version of Starfield. If the new version needs a newer game version, update the game first; otherwise keep it where it is. The [system requirements]({{ '/extrasolar-containment-protocol/installation-guide/system-requirements/' | relative_url }}) page gives the version the list needs.

## Updating

1. Close Mod Organizer 2 and the game.
2. Open Wabbajack, find Extrasolar Containment Protocol in the gallery and download the new version, as for the first install.
3. Set **Installation Location** and **Downloads Location** to the **same folders as before**, then press **Install**.
4. Before deleting anything, Wabbajack shows a **Confirm file deletion** window with the number of files that are not part of the list. It keeps save files, the downloads folder and `[NoDelete]` folders. If the count looks wrong, check the folders you picked before you confirm.
5. When it is done, open Mod Organizer 2, check the profile at the top left and start the game as usual.

## What the Update Keeps

| Kept | Replaced or deleted |
|---|---|
| The `saves` folders inside `profiles` | The list's mods, by their new versions |
| The downloads folder | Mods you added, unless their name starts with `[NoDelete]` |
| Folders and files whose name starts with `[NoDelete]` | Everything in the `overwrite` folder |
| The `.wabbajack` file | The profile files: mod order and plugin order |

The `overwrite` folder is where Mod Organizer 2 puts files written by the game and its tools, such as settings that mods save to a file: they go back to the list's defaults. Your Starfield INI files stay in `Documents\My Games\Starfield` and are not touched by the update.

## Free Disk Space Afterwards

Wabbajack never empties the downloads folder: archives that the new version no longer uses stay there. Once the update works, you can delete the downloads folder to free space, but the next update will then download everything again.

</div>
<div lang="fr" markdown="1">

# Mettre à jour la liste

Une nouvelle version de Extrasolar Containment Protocol s'installe par-dessus l'ancienne, dans le même dossier. Wabbajack réutilise les fichiers déjà téléchargés : seul ce qui a changé est téléchargé à nouveau.

## Avant de mettre à jour

1. Lisez le [changelog]({{ '/extrasolar-containment-protocol/changelog/' | relative_url }}) de la nouvelle version. Une version marquée **Nouvelle partie** n'est pas compatible avec les parties commencées sur une version précédente : il faudra une nouvelle partie.
2. **Sauvegardez vos parties.** Starfield range ses sauvegardes hors du dossier de la liste, dans `Documents\My Games\Starfield\Saves`. La mise à jour n'y touche pas ; copiez quand même ce dossier avant de mettre à jour.
3. **Protégez les mods que vous avez ajoutés.** La mise à jour supprime tous les fichiers du dossier de la liste qui n'en font pas partie. Renommez dans Mod Organizer 2 le dossier de chaque mod ajouté pour qu'il commence par `[NoDelete]`, par exemple `[NoDelete] Mon mod` : Wabbajack les garde.
4. **Copiez votre propre ordre.** Les fichiers du profil (ordre des mods, ordre des plugins) sont remplacés par ceux de la liste. Si vous avez modifié `modlist.txt` ou `loadorder.txt` dans le dossier du profil, copiez-les hors du dossier de la liste.
5. **Vérifiez la version du jeu.** Chaque version de la liste est faite pour une version précise de Starfield. Si la nouvelle version demande une version plus récente du jeu, mettez d'abord le jeu à jour ; sinon laissez-le où il est. La page [configuration requise]({{ '/extrasolar-containment-protocol/installation-guide/system-requirements/' | relative_url }}) donne la version demandée par la liste.

## Mettre à jour

1. Fermez Mod Organizer 2 et le jeu.
2. Ouvrez Wabbajack, trouvez Extrasolar Containment Protocol dans la galerie et téléchargez la nouvelle version, comme pour la première installation.
3. Choisissez pour **Installation Location** et **Downloads Location** **les mêmes dossiers qu'avant**, puis appuyez sur **Install**.
4. Avant de supprimer quoi que ce soit, Wabbajack affiche une fenêtre **Confirm file deletion** avec le nombre de fichiers qui ne font pas partie de la liste. Il garde les sauvegardes, le dossier de téléchargements et les dossiers `[NoDelete]`. Si le nombre semble anormal, vérifiez les dossiers choisis avant de confirmer.
5. À la fin, ouvrez Mod Organizer 2, vérifiez le profil en haut à gauche et lancez le jeu comme d'habitude.

## Ce que la mise à jour garde

| Gardé | Remplacé ou supprimé |
|---|---|
| Les dossiers `saves` dans `profiles` | Les mods de la liste, par leurs nouvelles versions |
| Le dossier de téléchargements | Les mods ajoutés par vous, sauf si leur nom commence par `[NoDelete]` |
| Les dossiers et fichiers dont le nom commence par `[NoDelete]` | Tout le contenu du dossier `overwrite` |
| Le fichier `.wabbajack` | Les fichiers du profil : ordre des mods et ordre des plugins |

Le dossier `overwrite` est celui où Mod Organizer 2 range les fichiers écrits par le jeu et ses outils, comme les réglages que des mods enregistrent dans un fichier : ils reviennent aux valeurs de la liste. Vos fichiers INI de Starfield restent dans `Documents\My Games\Starfield` et la mise à jour n'y touche pas.

## Libérer de l'espace ensuite

Wabbajack ne vide jamais le dossier de téléchargements : les archives que la nouvelle version n'utilise plus y restent. Une fois la mise à jour fonctionnelle, vous pouvez supprimer ce dossier pour libérer de la place, mais la prochaine mise à jour retéléchargera alors tout.

</div>
