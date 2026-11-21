---
layout: skyground_readme
title: Troubleshooting
title_fr: Dépannage
nav_order: 3.5
description: "Find what is wrong with your Ghost of the Grid install in a few questions, and read your crash log."
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

Cyberpunk 2077 does not write a readable crash log by itself, and the list turns off the game's crash reporter window. The useful logs come from the mod frameworks. Mod Organizer 2 puts every file the game and its mods create in the `overwrite` folder of the list, so that is where they are:

- `overwrite\red4ext\logs\`: RED4ext and its plugins, the mods that run native code.
- `overwrite\r6\logs\redscript_rCURRENT.log`: the script compiler. When a script mod fails to compile, its errors and file names are here.
- `overwrite\bin\x64\plugins\cyber_engine_tweaks\cyber_engine_tweaks.log`: Cyber Engine Tweaks. Each CET mod also writes its own log in its folder under `cyber_engine_tweaks\mods\`.

### Reading Them

Go to the end of each file, to the lines written just before the crash: errors, warnings, and the names of `.reds` files, DLLs or CET mods. The reader below spots those names and tells you which mod of the list they belong to.

</div>
<div lang="fr" markdown="1">

## Journaux de crash

Cyberpunk 2077 n'écrit pas de journal de crash lisible, et la liste désactive la fenêtre de rapport de plantage du jeu. Les journaux utiles viennent des frameworks de mods. Mod Organizer 2 range tous les fichiers créés par le jeu et ses mods dans le dossier `overwrite` de la liste : c'est là qu'ils se trouvent.

- `overwrite\red4ext\logs\` : RED4ext et ses plugins, les mods qui exécutent du code natif.
- `overwrite\r6\logs\redscript_rCURRENT.log` : le compilateur de scripts. Quand un mod de script ne compile pas, ses erreurs et les noms de fichiers sont ici.
- `overwrite\bin\x64\plugins\cyber_engine_tweaks\cyber_engine_tweaks.log` : Cyber Engine Tweaks. Chaque mod CET écrit aussi son propre journal dans son dossier, sous `cyber_engine_tweaks\mods\`.

### Les lire

Allez à la fin de chaque fichier, aux lignes écrites juste avant le plantage : erreurs, avertissements, et noms de fichiers `.reds`, de DLL ou de mods CET. Le lecteur ci-dessous repère ces noms et vous dit à quel mod de la liste ils appartiennent.

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

- the log files themselves (drag them into the message), not screenshots;
- the list version and the profile you play;
- what you were doing when it crashed, and whether it happens every time.

</div>
<div lang="fr" markdown="1">

## Signaler un plantage

Quand vous demandez de l'aide sur [Discord](https://discord.gg/vKuB7nazBk), envoyez :

- les fichiers de journaux eux-mêmes (glissez-les dans le message), pas des captures d'écran ;
- la version de la liste et le profil utilisé ;
- ce que vous faisiez au moment du plantage, et si cela arrive à chaque fois.

</div>
