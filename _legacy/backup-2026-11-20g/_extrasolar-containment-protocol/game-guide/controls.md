---
layout: skyground_readme
title: Controls
title_fr: Commandes
parent: Game Guide
nav_order: 2
---

<div lang="en" markdown="1">

# Controls

{: .short }
> **In short**
> - F1 opens the SFSE Menu Framework (gamepad: double press START).
> - Left Alt, or a double tap on Sprint, is a dodge that costs 40 oxygen.
> - Sprint is held, not toggled. The boost pack also works in press-and-hold mode.
> - Q in the galaxy star map opens a search box for any planet or location.
> - Aim assist and aim magnetism are off; field of view is set to 103.
> - Several features are inventory items you can favorite: squad communicator, ship remote, online mission boards, surrender item.

{{ site.data.keymaps["extrasolar-containment-protocol"] | keymap: 'en' }}

## Keys added or changed

| Key | Where | Action | Mod |
| --- | --- | --- | --- |
| F1 (gamepad: START twice) | Anywhere | Open the mod control panel | [SFSE Menu Framework](https://www.nexusmods.com/starfield/mods/18201) |
| Left Alt, or double tap Sprint | On foot | Dodge: 40 O2, 0.3 s cooldown, 0.15 s of invulnerability, not in mid-air | [Dodge Framework SFSE](https://www.nexusmods.com/starfield/mods/16111) |
| Sprint (hold) | On foot | Sprint while held | [Baka Hold to Sprint](https://www.nexusmods.com/starfield/mods/8915) |
| Jump (hold) | On foot | Boost pack in press-and-hold mode | list ini settings |
| Shift (hold) | Aiming | Hold your breath to steady aim, with scopes, sights or iron sights | [Scopes Without Overlays](https://www.nexusmods.com/starfield/mods/15828) |
| Activate prompt (usually R) | Sneaking behind an unaware enemy | Takedown, lethal or knock-out; needs the Takedowns skill | [Shades Stealth Takedowns](https://www.nexusmods.com/starfield/mods/8382) |
| Q | Galaxy star map | Search a planet, station or location, then press the result's number | [Starware Search Engine](https://www.nexusmods.com/starfield/mods/13643) |
| Space (hold) | Vehicle, aiming | Slow time | [Immersive Driving](https://www.nexusmods.com/starfield/mods/11253) |
| Q (hold) | Vehicle | Rear view | Immersive Driving |
| Left Shift | Vehicle | Talk to your companion | Immersive Driving |
| 1 to 0, [ and ] | Anywhere | Quickkeys of your default favorites row (row 1) | [Favorites Menu Grid](https://www.nexusmods.com/starfield/mods/18125) |
| Arrows or D-pad | Favorites menu | Up/down change row, left/right move through slots | Favorites Menu Grid |
| Delete | Favorites menu | Clear the selected slot | Favorites Menu Grid |

{: .note }
In a vehicle you can also get out anywhere, even where a small dune or stone used to block you, and the forced handbrake is gone. No handbrake key is set by default.

## The favorites grid

Favorites Menu Grid shows 4 rows of 12 slots at once instead of a single wheel. Click a cell to use it, or click a favorite to pick it up and click another cell to move it, even to another row. The number keys always act on row 1.

## Aiming and camera

These are set by the list's own console-command files at every launch:

- Aim assist, aim magnetism and control dampening are off, in first and third person. Vehicle weapons have no forced aim assist either.
- Mouse acceleration is off.
- Field of view is 103 on foot and in the flight camera; 80 when aiming in third person.
- In third person your weapon lowers quickly after you stop aiming ([Quick Lowered Weapons](https://www.nexusmods.com/starfield/mods/6338)).
- Scopes show the real optic instead of a full-screen overlay, at x4, x6 and x8 zoom.

## Items that work as controls

These items count as weapons, so you can put them on a favorites slot.

| Item | What it does | Mod |
| --- | --- | --- |
| Squad communicator (added to your inventory) | Order all followers at once: wait, follow, return to ship, teleport to you, cycle inventories | [Swiftly Order Squad](https://www.nexusmods.com/starfield/mods/6439) |
| Ship remote control | Take off, land near you (within 200 m of a pad, or on a flat 60 x 60 m area), set interior gravity to 0, 0.1, 0.5 or 1 g | [Summoning of Ship](https://www.nexusmods.com/starfield/mods/6216) |
| Online Mission Boards | Open every mission board you have unlocked, plus Trackers Alliance bounty clearance | [Mission Boards Anywhere](https://www.nexusmods.com/starfield/mods/6570) |
| Surrender item | Force guards to accept your surrender. On land you can also holster; in space, power down all weapons | [Enhanced Surrender](https://www.nexusmods.com/starfield/mods/13793) |
| Ship Ramp Remote | Open or close a manual landing ramp (B-variant landing bays only) | [Immersive Landing Ramps](https://www.nexusmods.com/starfield/mods/8093) |
| Walk Toggle (industrial workbench, free) | Lock yourself to walking speed | [Mass Matters](https://www.nexusmods.com/starfield/mods/16044) |

## Console commands from the mods

Open the console with the usual key and type:

| Command | Effect | Mod |
| --- | --- | --- |
| `cgf "CallYourShip.Mobile"` | Call your ship; it lands near you, you can keep moving | [Call Your Ship](https://www.nexusmods.com/starfield/mods/4923) |
| `cgf "CallYourShip.Here"` | Call your ship to a landing zone placed in front of you | Call Your Ship |
| `cgf "CallYourShip.HereAndCheck"` | Same, but refuses if the ground is not flat enough | Call Your Ship |
| `CGF "TransferInventoryContentToShip.DisableMod"` / `EnableMod` | Turn the "Take All to Ship" button off or on | [Take All to Ship](https://www.nexusmods.com/starfield/mods/8810) |

</div>
<div lang="fr" markdown="1">

# Commandes

{: .short }
> **En bref**
> - F1 ouvre le SFSE Menu Framework (manette : double appui sur START).
> - Alt gauche, ou un double appui sur Sprint, déclenche une esquive qui coûte 40 d'oxygène.
> - Le sprint se maintient au lieu de s'activer. Le boost pack fonctionne aussi en mode « appuyer et maintenir ».
> - Q dans la carte galactique ouvre une recherche pour n'importe quelle planète ou lieu.
> - L'aide à la visée et le magnétisme sont coupés ; le champ de vision est réglé à 103.
> - Plusieurs fonctions sont des objets d'inventaire à mettre en favori : communicateur d'escouade, télécommande du vaisseau, tableaux de missions en ligne, objet de reddition.

{{ site.data.keymaps["extrasolar-containment-protocol"] | keymap: 'fr' }}

## Touches ajoutées ou modifiées

| Touche | Où | Action | Mod |
| --- | --- | --- | --- |
| F1 (manette : START deux fois) | Partout | Ouvrir le panneau de contrôle des mods | [SFSE Menu Framework](https://www.nexusmods.com/starfield/mods/18201) |
| Alt gauche, ou double appui sur Sprint | À pied | Esquive : 40 d'O2, 0,3 s de recharge, 0,15 s d'invulnérabilité, impossible en l'air | [Dodge Framework SFSE](https://www.nexusmods.com/starfield/mods/16111) |
| Sprint (maintenu) | À pied | Sprinter tant que la touche est enfoncée | [Baka Hold to Sprint](https://www.nexusmods.com/starfield/mods/8915) |
| Saut (maintenu) | À pied | Boost pack en mode « appuyer et maintenir » | réglages ini de la liste |
| Maj (maintenue) | En visée | Retenir son souffle pour stabiliser la visée, avec lunette, viseur ou mire | [Scopes Without Overlays](https://www.nexusmods.com/starfield/mods/15828) |
| Invite d'activation (souvent R) | Accroupi derrière un ennemi qui ne vous voit pas | Neutralisation, mortelle ou assommante ; demande la compétence Takedowns | [Shades Stealth Takedowns](https://www.nexusmods.com/starfield/mods/8382) |
| Q | Carte galactique | Chercher une planète, une station ou un lieu, puis appuyer sur le numéro du résultat | [Starware Search Engine](https://www.nexusmods.com/starfield/mods/13643) |
| Espace (maintenue) | Véhicule, en visée | Ralentir le temps | [Immersive Driving](https://www.nexusmods.com/starfield/mods/11253) |
| Q (maintenue) | Véhicule | Vue arrière | Immersive Driving |
| Maj gauche | Véhicule | Parler à votre compagnon | Immersive Driving |
| 1 à 0, [ et ] | Partout | Raccourcis de la rangée de favoris par défaut (rangée 1) | [Favorites Menu Grid](https://www.nexusmods.com/starfield/mods/18125) |
| Flèches ou croix directionnelle | Menu des favoris | Haut/bas changent de rangée, gauche/droite parcourent les cases | Favorites Menu Grid |
| Suppr | Menu des favoris | Vider la case sélectionnée | Favorites Menu Grid |

{: .note }
En véhicule, vous pouvez aussi descendre n'importe où, même là où une petite dune ou un rocher vous bloquait, et le frein à main forcé disparaît. Aucune touche de frein à main n'est définie par défaut.

## La grille des favoris

Favorites Menu Grid affiche 4 rangées de 12 cases d'un coup, au lieu d'une seule roue. Cliquez sur une case pour l'utiliser, ou cliquez sur un favori pour le prendre puis sur une autre case pour le déplacer, même vers une autre rangée. Les touches numériques agissent toujours sur la rangée 1.

## Visée et caméra

Ces réglages sont appliqués à chaque lancement par les fichiers de commandes console de la liste :

- L'aide à la visée, le magnétisme et l'amortissement des commandes sont coupés, en vue à la première comme à la troisième personne. Les armes de véhicule n'ont plus d'aide à la visée forcée non plus.
- L'accélération de la souris est coupée.
- Le champ de vision est de 103 à pied et en caméra de vol ; 80 en visée à la troisième personne.
- À la troisième personne, votre arme se baisse vite quand vous arrêtez de viser ([Quick Lowered Weapons](https://www.nexusmods.com/starfield/mods/6338)).
- Les lunettes montrent l'optique réelle au lieu d'un filtre plein écran, avec des zooms x4, x6 et x8.

## Les objets qui servent de commandes

Ces objets comptent comme des armes : vous pouvez les placer dans une case de favori.

| Objet | Rôle | Mod |
| --- | --- | --- |
| Communicateur d'escouade (ajouté à l'inventaire) | Donner un ordre à tous les compagnons : attendre, suivre, retourner au vaisseau, se téléporter vers vous, parcourir leurs inventaires | [Swiftly Order Squad](https://www.nexusmods.com/starfield/mods/6439) |
| Télécommande du vaisseau | Décoller, se poser près de vous (à moins de 200 m d'une aire, ou sur une zone plane de 60 x 60 m), régler la gravité intérieure sur 0, 0,1, 0,5 ou 1 g | [Summoning of Ship](https://www.nexusmods.com/starfield/mods/6216) |
| Online Mission Boards | Ouvrir tous les tableaux de missions débloqués, plus le service de levée de primes des Trackers Alliance | [Mission Boards Anywhere](https://www.nexusmods.com/starfield/mods/6570) |
| Objet de reddition | Forcer les gardes à accepter votre reddition. Au sol, vous pouvez aussi ranger votre arme ; dans l'espace, coupez toute l'énergie des armes | [Enhanced Surrender](https://www.nexusmods.com/starfield/mods/13793) |
| Ship Ramp Remote | Ouvrir ou fermer une rampe manuelle (baies d'atterrissage variante B uniquement) | [Immersive Landing Ramps](https://www.nexusmods.com/starfield/mods/8093) |
| Walk Toggle (établi industriel, gratuit) | Vous bloquer à la vitesse de marche | [Mass Matters](https://www.nexusmods.com/starfield/mods/16044) |

## Commandes console fournies par les mods

Ouvrez la console avec la touche habituelle et tapez :

| Commande | Effet | Mod |
| --- | --- | --- |
| `cgf "CallYourShip.Mobile"` | Appeler votre vaisseau ; il se pose près de vous, vous pouvez continuer à bouger | [Call Your Ship](https://www.nexusmods.com/starfield/mods/4923) |
| `cgf "CallYourShip.Here"` | Appeler votre vaisseau vers une zone d'atterrissage placée devant vous | Call Your Ship |
| `cgf "CallYourShip.HereAndCheck"` | Idem, mais refuse si le sol n'est pas assez plat | Call Your Ship |
| `CGF "TransferInventoryContentToShip.DisableMod"` / `EnableMod` | Couper ou rétablir le bouton « Take All to Ship » | [Take All to Ship](https://www.nexusmods.com/starfield/mods/8810) |

</div>
