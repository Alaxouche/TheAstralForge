---
layout: skyground_readme
title: Troubleshooting
title_fr: Dépannage
nav_order: 3.5
description: "Find what is wrong with your Krentoraan install in a few questions, and read your crash log."
---

<div lang="en" markdown="1">

## Find Your Problem

Answer a few questions to reach the fix. Every answer links to the part of the guide that explains it.

</div>
<div lang="fr" markdown="1">

## Trouver votre problème

Répondez à quelques questions pour arriver à la solution. Chaque réponse renvoie à la partie du guide qui l'explique.

</div>

{{ modlist.id | troubleshooter }}

<div lang="en" markdown="1">

## Crash Logs

The list includes **Crash Logger**. Each time the game crashes, it writes a log to:

`Documents\My Games\Skyrim Special Edition\SKSE\crash-<date>-<time>.log`

The newest file is the crash you just had. SKSE plugins write their own logs in the same folder: only the files whose name starts with `crash-` are crash logs.

### Reading a Crash Logger Log

- **The first lines** give the game version and the error, such as `Unhandled exception ... at 0x... SkyrimSE.exe+...`. The name after the address is the module where the crash happened. `SkyrimSE.exe` there does not point to a mod by itself.
- **PROBABLE CALL STACK** lists the code that was running, most recent call first. A mod DLL in the first lines is a strong lead.
- **POSSIBLE RELEVANT OBJECTS** (when present), **REGISTERS** and **STACK** name the game objects in use, with the plugin (`.esp`, `.esm`, `.esl`) each one comes from and the plugins that change it. A plugin that keeps coming back is the usual suspect.
- **MODULES**, **SKSE PLUGINS** and **PLUGINS** at the end list everything that was loaded. Every mod is there, so these lists say nothing about the cause.

{: .note }
A mod named in a log is not always the culprit: it can be hit by another mod, by a lack of memory or by the graphics driver. A page file set as the system requirements page says and an up-to-date driver solve many crashes.

</div>
<div lang="fr" markdown="1">

## Journaux de crash

La liste contient **Crash Logger**. À chaque plantage, il écrit un journal ici :

`Documents\My Games\Skyrim Special Edition\SKSE\crash-<date>-<heure>.log`

Le fichier le plus récent correspond au plantage que vous venez d'avoir. Les plugins SKSE écrivent aussi leurs propres journaux dans ce dossier : seuls les fichiers dont le nom commence par `crash-` sont des journaux de crash.

### Lire un journal de Crash Logger

- **Les premières lignes** donnent la version du jeu et l'erreur, par exemple `Unhandled exception ... at 0x... SkyrimSE.exe+...`. Le nom après l'adresse est le module où le plantage s'est produit. `SkyrimSE.exe` à cet endroit ne désigne aucun mod à lui seul.
- **PROBABLE CALL STACK** liste le code qui s'exécutait, l'appel le plus récent en premier. Une DLL de mod dans les premières lignes est une piste sérieuse.
- **POSSIBLE RELEVANT OBJECTS** (quand la section existe), **REGISTERS** et **STACK** nomment les objets du jeu en cours d'utilisation, avec le plugin (`.esp`, `.esm`, `.esl`) d'où vient chacun et les plugins qui le modifient. Un plugin qui revient sans cesse est le suspect habituel.
- **MODULES**, **SKSE PLUGINS** et **PLUGINS**, à la fin, listent tout ce qui était chargé. Tous les mods y figurent : ces listes ne disent rien de la cause.

{: .note }
Un mod cité dans un journal n'est pas toujours coupable : il peut subir un autre mod, un manque de mémoire ou le pilote graphique. Un fichier d'échange réglé comme l'indique la configuration requise et un pilote à jour règlent beaucoup de plantages.

</div>

<div lang="en" markdown="1">

## Read Your Crash Log

Paste a log below to see which mods of the list it names, where, and how often. It is a lead, not a verdict.

</div>
<div lang="fr" markdown="1">

## Lire votre journal de crash

Collez un journal ci-dessous pour voir quels mods de la liste il cite, où et combien de fois. C'est une piste, pas un verdict.

</div>

{{ modlist.id | crash_reader }}

<div lang="en" markdown="1">

## Reporting a Crash

When you ask for help on [Discord](https://discord.gg/vKuB7nazBk), send:

- the log file itself (drag it into the message), not a screenshot;
- the list version and the profile you play;
- what you were doing when it crashed, and whether it happens every time.

</div>
<div lang="fr" markdown="1">

## Signaler un plantage

Quand vous demandez de l'aide sur [Discord](https://discord.gg/vKuB7nazBk), envoyez :

- le fichier du journal lui-même (glissez-le dans le message), pas une capture d'écran ;
- la version de la liste et le profil utilisé ;
- ce que vous faisiez au moment du plantage, et si cela arrive à chaque fois.

</div>
