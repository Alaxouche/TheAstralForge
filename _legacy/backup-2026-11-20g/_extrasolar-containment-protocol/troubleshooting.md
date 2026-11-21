---
layout: skyground_readme
title: Troubleshooting
title_fr: Dépannage
nav_order: 3.5
description: "Find what is wrong with your Extrasolar Containment Protocol install in a few questions, and read your crash log."
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

The list includes **Trainwreck**, a crash logger. When the game crashes, it writes a log to:

`Documents\My Games\Starfield\SFSE\Crashlogs\<date>-<time>.log`

and opens it right after the crash. The script extender plugins write their own logs in `Documents\My Games\Starfield\SFSE\Logs\`.

### Reading a Trainwreck Log

- **The first lines** give the game version, the Trainwreck version and the error, such as `Unhandled exception "EXCEPTION_ACCESS_VIOLATION" at 0x... Starfield.exe+...`. `Starfield.exe` there does not point to a mod by itself.
- **SYSTEM SPECS** describes your PC, with the RAM and page file in use at the time of the crash. A page file close to full points to a memory problem.
- **PROBABLE CALL STACK** lists the code that was running, most recent call first. A mod DLL in the first lines is a strong lead.
- **REGISTERS** and **STACK** name the game objects in use, with their plugin when there is one.
- **MODULES** and **SCRIPT EXTENDER PLUGINS** at the end list everything that was loaded: they say nothing about the cause.

{: .note }
A mod named in a log is not always the culprit: it can be hit by another mod, by a lack of memory or by the graphics driver.

</div>
<div lang="fr" markdown="1">

## Journaux de crash

La liste contient **Trainwreck**, un enregistreur de plantages. Quand le jeu plante, il écrit un journal ici :

`Documents\My Games\Starfield\SFSE\Crashlogs\<date>-<heure>.log`

et l'ouvre juste après le plantage. Les plugins de l'extenseur de script écrivent leurs propres journaux dans `Documents\My Games\Starfield\SFSE\Logs\`.

### Lire un journal de Trainwreck

- **Les premières lignes** donnent la version du jeu, celle de Trainwreck et l'erreur, par exemple `Unhandled exception "EXCEPTION_ACCESS_VIOLATION" at 0x... Starfield.exe+...`. `Starfield.exe` à cet endroit ne désigne aucun mod à lui seul.
- **SYSTEM SPECS** décrit votre PC, avec la RAM et le fichier d'échange utilisés au moment du plantage. Un fichier d'échange presque plein indique un problème de mémoire.
- **PROBABLE CALL STACK** liste le code qui s'exécutait, l'appel le plus récent en premier. Une DLL de mod dans les premières lignes est une piste sérieuse.
- **REGISTERS** et **STACK** nomment les objets du jeu en cours d'utilisation, avec leur plugin quand il y en a un.
- **MODULES** et **SCRIPT EXTENDER PLUGINS**, à la fin, listent tout ce qui était chargé : ils ne disent rien de la cause.

{: .note }
Un mod cité dans un journal n'est pas toujours coupable : il peut subir un autre mod, un manque de mémoire ou le pilote graphique.

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
