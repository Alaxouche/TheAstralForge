---
layout: skyground_readme
title: Ships, Travel and Money
title_fr: Vaisseaux, voyages et argent
parent: Game Guide
nav_order: 6
---

<div lang="en" markdown="1">

# Ships, Travel and Money

{: .short }
> **In short**
> - Grav jumps burn Helium-3. Refuel from the Cargo panel, at Ship Services, at starstations or from your outposts. An empty tank keeps you in the system.
> - By default you travel between planets and systems only from the pilot seat or in space. Fast jumps in a row trigger a cooldown; jumping on low fuel can overheat the drive.
> - Ship building limits are gone (reactor, shields, weapons, engines, grav drive weight, cockpits, landing gear).
> - Enemies can board your ship, collisions hurt a lot more, and enemy engines are much easier to disable.
> - Spaceports charge dues on landing, then a mooring fee each local day, and your ship needs paid upkeep.
> - Loot sells at 10 % of its value (vanilla 12.5 %) and vendors restock every 5 days, but quests and missions pay much more.

## Fuel and grav jumps

[Real Fuel](https://www.nexusmods.com/starfield/mods/13306) turns on when you first sit in the pilot seat. Its Help menu entry explains everything; the essentials:

- Each grav jump draws Helium-3 from your tanks. Bigger ships need bigger tanks; as fuel drops, your jump range shrinks.
- With empty or critical tanks you cannot leave the system until you refuel.
- **Refuel** from the [REFUEL] option of the Cargo panel (it uses Ship Fuel items or Helium-3 in your hold), from any Ship Services technician in a settlement (market price of He-3), when docked to a starstation that offers it, or from an outpost harvester or container holding Helium-3.
- **Simulation mode** (the default): travel between planets and systems only from the pilot seat, the navigation console or in space. Streamlined mode also allows it from your ship interior or settlements.
- Some areas of the star map do not allow fast travel straight back to cities.
- Several jumps in quick succession put the drive into **Cooldown** for some minutes. Jumping on low fuel can **Overheat** it and damage the ship; repair it by applying power from the pilot seat.
- An **Emergency Jump** is possible on empty tanks but severely damages your ship on arrival.
- You can siphon fuel from a docked ship with malware items (Siphon Protocol). It is illegal on non-combat ships. Loose fuel stored in your hold can detonate and damage the ship.

[Astrogate](https://www.nexusmods.com/starfield/mods/9363) makes jumps started from the pilot seat take time, so you can walk around your ship during the trip. Set the duration in Gameplay Options ("Grav Jump Duration"), skip it by sleeping or waiting, pick where you arrive (near the planet, the system edge or the star), and cancel by cutting engine power. [Configurable Limited Fast Travel](https://www.nexusmods.com/starfield/mods/13290) can restrict fast travel further: Normal, Inside Ship, In Space, or In Pilot Seat. Every cockpit has a navigation console ([All Cockpits Have Nav Consoles](https://www.nexusmods.com/starfield/mods/7960)).

## Building and running a ship

- Ship builder limits are removed: no limit on reactors, shields, weapon power or count, engine power, cockpits, landing bays or dockers; no reactor class requirement, no minimum landing gear, no grav drive weight limit (keep jump range above 0 LY), no "unattached module" or "build below bay" errors.
- The builder works on floors from -50 to +50 and snaps and rotates faster.
- Cockpits hold more cargo and cargo halls are bigger and heavier ([Cargo Reconsidered](https://www.nexusmods.com/starfield/mods/15103)).
- Hab control stations, engineering and computer core habs include a Ship Optimization Terminal ([Integrated Ship Optimization Terminal](https://www.nexusmods.com/starfield/mods/16412)).
- Landing bays have their own cargo panel ([Landing Bay Cargo Access](https://www.nexusmods.com/starfield/mods/11972)). B-variant landing bays keep the ramp closed until you open it ([Immersive Landing Ramps](https://www.nexusmods.com/starfield/mods/8093)).
- Crew can be assigned to furniture and work markers on a schedule once you turn on Assignment Mode in Gameplay Options ([Ship Crew Assignments](https://www.nexusmods.com/starfield/mods/12744)).
- Sit in the pilot seat of a captured ship to add it to your fleet without making it your home ship ([Sit To Add Ship to Fleet](https://www.nexusmods.com/starfield/mods/6493)). Restricted ships can be taken too, after a warning ([Seizure Of Ships](https://www.nexusmods.com/starfield/mods/5212)).
- New ships for sale: UC Pegasus at Deimos Staryard (Sol), plus the UC Misthios, Myrmidon, Sabre and Warglaive. From level 45 you can buy an Antares Armiger weapons hab that builds and launches combat drones from your ammo ([Antares Armiger](https://www.nexusmods.com/starfield/mods/17678)).

## Space combat

| Change | Detail | Mod |
| --- | --- | --- |
| Boarding parties | Enemies dock and board you during combat. Crimson Fleet try hardest; Va'ruun and Spacers prefer to destroy you | [Enemies Boarding My Ship](https://www.nexusmods.com/starfield/mods/13999) |
| Hazards on enemy ships | Reactor leaks, no gravity or a crew counter-boarding you; a hazard makes boarding more likely | [Better Boarding Encounters](https://www.nexusmods.com/starfield/mods/13964), [Hazardous ship boarding](https://www.nexusmods.com/starfield/mods/4702) |
| Collisions | Max collision damage 1,000 (vanilla 100), for you and for NPC ships; debris from a ship you destroy up close can wreck you | [Deadly Ramming and Debris Fields](https://www.nexusmods.com/starfield/mods/12940), GRiNDTerra |
| Disabling engines | Chance to damage untargeted engines 24 (vanilla 3) | Royal Galaxy |
| Enemy ships | UC Vigilance is now aggressive; veteran ships turn while boosting | [Improved Enemy Ship AI](https://www.nexusmods.com/starfield/mods/11404) |
| More enemies | More space encounters and more enemies per fight; capital ships and stations roam the systems | Royal Galaxy, [Orbital Defense](https://www.nexusmods.com/starfield/mods/17343) |
| Docking range | 200 (vanilla 500) | list ini settings |

## Vehicles

- Vehicles run on charge or fuel ([Roverhaul](https://www.nexusmods.com/starfield/mods/14008)). Power cells (normal, emergency, high-efficiency), combustible fuel and a vehicle charger keep them going. Garage habs (Nova Galactic 2x1 and 3x1, HopeTech 2x1) and StorMax vehicle stowage carry the vehicle and recharge it. A Vehicle Management option lets you deploy on landing, keep it aboard, or convert it to fuel or electric.
- Every vehicle has a 150-capacity trunk shared between vehicles, +10 to +50 % with Payloads; no contraband in it ([All Vehicles Have Storage](https://www.nexusmods.com/starfield/mods/13993)).
- Driving: see your body in the seat, slow time with Space while aiming, rear view on Q, no forced handbrake, no mouse magnetism, no O2 penalty for aiming the mounted gun ([Controls]({{ '/extrasolar-containment-protocol/game-guide/controls/' | relative_url }})).

## Fees and upkeep

Four mods charge you for living in space. Keep a buffer of credits.

### Harbor: port dues and upkeep

[Harbor](https://www.nexusmods.com/starfield/mods/17667) takes payment automatically when you land or step out of your ship at a valid spaceport.

| Cost | Rule |
| --- | --- |
| Port dues | Administrative fee everywhere, plus a Visitor's Levy at most major spaceports |
| Discounts | UC citizens -600 on levies in UC settlements, Freestar Rangers -240 in their space, Neon Voucher -1,800 in Neon |
| Mooring | 50 % of the port dues, once per local day in port |
| Upkeep | Scales with total mass, drive thrust and reactor power; paying it restores Vessel Condition |
| Frontier | All Harbor costs halved |
| Unpaid dues | Leaving the planet without paying adds a bounty: 150 % of the amount + 1,000 (dues), 120 % + 250 (mooring) |

The Neon Voucher comes from the quest *Back to the Grind* (cannot be lost) or can be bought from Kolman Lang at the Neon Trade Authority. Spacefarer Mode in the options doubles every cost.

### Cost of Spacing and Cost of Living

- [Cost Of Spacing](https://www.nexusmods.com/starfield/mods/11726) adds registration checks and maintenance bills for your ship. Constellation covers the costs of the Frontier. Freestar space is generally cheaper than UC space, Neon is expensive, Akila is a cheap stopover. Crimson Fleet captains pay tribute.
- [Cost Of Living](https://www.nexusmods.com/starfield/mods/12136) charges a one-time registration fee when you build an outpost in settled space, and residence taxes on your homes, with late fees if you don't pay.

## Earning and spending

| Setting | Vanilla | This list |
| --- | --- | --- |
| Sell price | 12.5 % of value | 10 % |
| Vendor restock | 2 days | 5 days |
| Ship registration | 84 % of ship value | 65 % |

- [Spacefaring Economy](https://www.nexusmods.com/starfield/mods/12022): ships, parts and rare resources cost far more; common resources and junk are worth less; Exotic resources are very valuable. Hopetech and Nova Galactic parts are budget, Deimos mid-range, Stroud-Eklund and Taiyo premium. Class B and C parts and large habs are a long-term investment. Quest rewards and bounties are much higher; cargo missions pay by weight; smuggling and piracy missions pay very well. Choosing the "easy option" in a quest can cost you money.
- GRiNDTerra pays faction, misc, radiant and settlement quests by size: 6,000 (large, companion quests included), 4,000 (medium), 2,500 (small), 1,000 (smallest). Spacefaring Economy also raises quest rewards, so some payouts can differ. Credits are no longer tied to your level; most loot no longer contains resources (you may find a primer or a random object instead); less ammo, med kits and digipicks in loot. Credits found in loot are about 50 % higher than vanilla ([Loot Overhaul](https://www.nexusmods.com/starfield/mods/5181)).
- [Vendor Overhaul](https://www.nexusmods.com/starfield/mods/5179): vendors carry about twice the repair kits, grenades, mines and medical supplies, and 100 to 300 % more ammo. [Richer Vendors](https://www.nexusmods.com/starfield/mods/5624) gives merchants more credits.
- [Faction Requisition Kiosks](https://www.nexusmods.com/starfield/mods/9012) sell faction gear in faction headquarters (Constellation's is in the Lodge basement after *One Small Step*). They buy nothing.
- Contraband sells for 3x more where you get scanned (New Atlantis, Akila City, Neon except Aurora, Cydonia, Hopetown, Gagarin Landing, New Homestead) and little elsewhere ([Variable Contraband Prices - Redux](https://www.nexusmods.com/starfield/mods/12205)).
- Looting: "Strip" an NPC to loot their worn gear, "Loot All" to send everything to your ship or party, "Take All to Ship" on any container or body ([Shades Immersive Looting](https://www.nexusmods.com/starfield/mods/8383), [Take All to Ship](https://www.nexusmods.com/starfield/mods/8810)).

### Banking with GalBank

[Gallion](https://www.nexusmods.com/starfield/mods/17626) makes GalBank ATMs work. You can also build a GalBank Terminal at an outpost or a GalBank Mobile on your ship or in a home (Miscellaneous).

- **Loans** from 25,000 to 1,000,000 credits in six tiers, paid back automatically each cycle.
- **Savings** earn 0.40 % per cycle at Basic standing up to 0.75 % at Premier, and cover a missed loan payment.
- **Investments** in 33 businesses in New Atlantis, Akila City, Neon and Orbital, rated Stable, Balanced, Turbulent or Venture. A position runs 12 days and pays every 3 days; closing early returns 85 %. Turbulent and Venture businesses can enter receivership: pay 40 % of your stake to save them or face a 50 % chance of collapse (you recover about 40 % if it folds).
- Market booms and busts move returns by region and sector. Finishing the UC, Freestar Ranger or Ryujin questlines permanently boosts their region.
- **Standing** rises from Basic to Preferred, Priority and Premier when you carry a loan and repay it on time.

{: .warning }
Miss enough loan payments and GalBank sends Ecliptic hunters after you in growing waves until the debt is cleared. Cities are safe; the open world is not.

### Crafting

- Weapon and armor quality upgrades cost resources instead of credits, with rarer materials at higher tiers ([Stellar Crafting](https://www.nexusmods.com/starfield/mods/16665)).
- GRiNDTerra groups resources into categories for crafting and research: GEO (geological), BIO (biological), MFG01 to MFG03 (manufactured tiers) and Unique. The industrial workbench has recipes to convert between them.
- Resources appear as solid, liquid or gas depending on the planet's temperature and pressure ([States of Matter](https://www.nexusmods.com/starfield/mods/13686)).

</div>
<div lang="fr" markdown="1">

# Vaisseaux, voyages et argent

{: .short }
> **En bref**
> - Les sauts consomment de l'Hélium-3. Ravitaillez depuis le panneau de soute, auprès des Ship Services, en station ou depuis vos avant-postes. Réservoir vide : vous restez dans le système.
> - Par défaut, vous voyagez entre planètes et systèmes uniquement depuis le poste de pilotage ou dans l'espace. Des sauts rapprochés déclenchent un refroidissement ; sauter avec peu de carburant peut faire surchauffer le moteur.
> - Les limites de construction des vaisseaux disparaissent (réacteur, boucliers, armes, moteurs, poids du moteur de saut, cockpits, trains d'atterrissage).
> - Les ennemis peuvent aborder votre vaisseau, les collisions font beaucoup plus mal, et les moteurs ennemis se neutralisent bien plus facilement.
> - Les spatioports prélèvent des droits à l'atterrissage, puis des frais d'amarrage chaque jour local, et votre vaisseau demande un entretien payant.
> - Le butin se revend à 10 % de sa valeur (12,5 % en vanilla) et les marchands se réapprovisionnent tous les 5 jours, mais les quêtes et missions paient beaucoup plus.

## Carburant et sauts

[Real Fuel](https://www.nexusmods.com/starfield/mods/13306) s'active la première fois que vous vous asseyez au poste de pilotage. Sa rubrique dans le menu Aide explique tout ; l'essentiel :

- Chaque saut puise de l'Hélium-3 dans vos réservoirs. Plus le vaisseau est gros, plus il lui faut de réservoirs ; quand le carburant baisse, votre portée diminue.
- Réservoirs vides ou à un niveau critique : impossible de quitter le système avant de ravitailler.
- **Ravitaillez** avec l'option [REFUEL] du panneau de soute (elle utilise les objets Ship Fuel ou l'Hélium-3 de votre soute), auprès de n'importe quel technicien Ship Services d'une ville (au prix du marché), en station spatiale si elle propose ce service, ou depuis un extracteur ou un conteneur d'avant-poste contenant de l'Hélium-3.
- **Mode Simulation** (par défaut) : voyage entre planètes et systèmes seulement depuis le poste de pilotage, la console de navigation ou dans l'espace. Le mode Streamlined l'autorise aussi depuis l'intérieur du vaisseau ou une ville.
- Certaines zones de la carte n'autorisent pas le voyage rapide direct vers les villes.
- Plusieurs sauts rapprochés mettent le moteur en **Cooldown** pendant quelques minutes. Sauter avec peu de carburant peut provoquer une **surchauffe** et endommager le vaisseau ; réparez en envoyant de l'énergie depuis le poste de pilotage.
- Un **saut d'urgence** reste possible réservoirs vides, mais il endommage gravement le vaisseau à l'arrivée.
- Vous pouvez siphonner le carburant d'un vaisseau amarré avec des logiciels malveillants (Siphon Protocol). C'est illégal sur un vaisseau non combattant. Du carburant en vrac stocké dans votre soute peut exploser et endommager le vaisseau.

[Astrogate](https://www.nexusmods.com/starfield/mods/9363) donne une durée aux sauts lancés depuis le poste de pilotage : vous pouvez circuler dans le vaisseau pendant le trajet. Réglez la durée dans Gameplay Options (« Grav Jump Duration »), passez-la en dormant ou en attendant, choisissez l'arrivée (près de la planète, en bordure du système ou près de l'étoile), et annulez en coupant l'énergie des moteurs. [Configurable Limited Fast Travel](https://www.nexusmods.com/starfield/mods/13290) peut restreindre encore le voyage rapide : Normal, Inside Ship, In Space ou In Pilot Seat. Chaque cockpit a une console de navigation ([All Cockpits Have Nav Consoles](https://www.nexusmods.com/starfield/mods/7960)).

## Construire et faire tourner un vaisseau

- Les limites de construction sont levées : pas de limite de réacteurs, boucliers, puissance ou nombre d'armes, puissance moteur, cockpits, baies d'atterrissage ou sas d'amarrage ; plus d'exigence de classe de réacteur, de train d'atterrissage minimum ou de poids du moteur de saut (gardez une portée supérieure à 0 AL), plus d'erreurs « module non attaché » ou « construction sous la baie ».
- Le chantier naval travaille sur des étages de -50 à +50 et aimante et pivote plus vite.
- Les cockpits contiennent plus de cargaison et les halls de soute sont plus grands et plus lourds ([Cargo Reconsidered](https://www.nexusmods.com/starfield/mods/15103)).
- Les modules poste de contrôle, ingénierie et cœur informatique contiennent un Ship Optimization Terminal ([Integrated Ship Optimization Terminal](https://www.nexusmods.com/starfield/mods/16412)).
- Les baies d'atterrissage ont leur propre panneau de soute ([Landing Bay Cargo Access](https://www.nexusmods.com/starfield/mods/11972)). Les baies variante B gardent la rampe fermée jusqu'à ce que vous l'ouvriez ([Immersive Landing Ramps](https://www.nexusmods.com/starfield/mods/8093)).
- L'équipage peut être affecté à des meubles et à des postes de travail selon un horaire, une fois l'Assignment Mode activé dans Gameplay Options ([Ship Crew Assignments](https://www.nexusmods.com/starfield/mods/12744)).
- Asseyez-vous au poste de pilotage d'un vaisseau capturé pour l'ajouter à votre flotte sans en faire votre vaisseau principal ([Sit To Add Ship to Fleet](https://www.nexusmods.com/starfield/mods/6493)). Les vaisseaux protégés peuvent aussi être pris, après un avertissement ([Seizure Of Ships](https://www.nexusmods.com/starfield/mods/5212)).
- Nouveaux vaisseaux en vente : UC Pegasus au chantier Deimos (Sol), ainsi que les UC Misthios, Myrmidon, Sabre et Warglaive. Dès le niveau 45, vous pouvez acheter un module d'armement Antares Armiger qui fabrique et lance des drones de combat à partir de vos munitions ([Antares Armiger](https://www.nexusmods.com/starfield/mods/17678)).

## Combat spatial

| Changement | Détail | Mod |
| --- | --- | --- |
| Abordages | Les ennemis s'amarrent et vous abordent en plein combat. Le Crimson Fleet insiste le plus ; Va'ruun et Spacers préfèrent vous détruire | [Enemies Boarding My Ship](https://www.nexusmods.com/starfield/mods/13999) |
| Dangers à bord des vaisseaux ennemis | Fuite du réacteur, absence de gravité ou équipage qui contre-attaque chez vous ; un danger rend l'abordage plus probable | [Better Boarding Encounters](https://www.nexusmods.com/starfield/mods/13964), [Hazardous ship boarding](https://www.nexusmods.com/starfield/mods/4702) |
| Collisions | Dégâts de collision jusqu'à 1 000 (100 en vanilla), pour vous comme pour les PNJ ; les débris d'un vaisseau détruit de près peuvent vous achever | [Deadly Ramming and Debris Fields](https://www.nexusmods.com/starfield/mods/12940), GRiNDTerra |
| Moteurs ennemis | Chance d'endommager les moteurs non ciblés : 24 (3 en vanilla) | Royal Galaxy |
| Vaisseaux ennemis | Le UC Vigilance devient agressif ; les vaisseaux vétérans tournent en boostant | [Improved Enemy Ship AI](https://www.nexusmods.com/starfield/mods/11404) |
| Plus d'ennemis | Plus de rencontres spatiales et plus d'ennemis par combat ; des vaisseaux capitaux et des stations parcourent les systèmes | Royal Galaxy, [Orbital Defense](https://www.nexusmods.com/starfield/mods/17343) |
| Distance d'amarrage | 200 (500 en vanilla) | réglages ini de la liste |

## Véhicules

- Les véhicules roulent à la charge électrique ou au carburant ([Roverhaul](https://www.nexusmods.com/starfield/mods/14008)). Cellules d'énergie (normale, d'urgence, haut rendement), carburant et chargeur de véhicule les font tourner. Les modules garage (Nova Galactic 2x1 et 3x1, HopeTech 2x1) et le StorMax Vehicle Stowage transportent le véhicule et le rechargent. Une option Vehicle Management permet de le déployer à l'atterrissage, de le garder à bord ou de le convertir au carburant ou à l'électrique.
- Chaque véhicule a un coffre de 150, partagé entre véhicules, +10 à +50 % avec Payloads ; pas de contrebande dedans ([All Vehicles Have Storage](https://www.nexusmods.com/starfield/mods/13993)).
- Conduite : votre corps est visible sur le siège, Espace ralentit le temps en visée, Q donne la vue arrière, plus de frein à main forcé ni de magnétisme de la souris, plus de pénalité d'O2 en visant avec l'arme montée ([Commandes]({{ '/extrasolar-containment-protocol/game-guide/controls/' | relative_url }})).

## Frais et entretien

Quatre mods vous font payer la vie dans l'espace. Gardez une réserve de crédits.

### Harbor : droits de port et entretien

[Harbor](https://www.nexusmods.com/starfield/mods/17667) prélève automatiquement quand vous vous posez ou sortez de votre vaisseau dans un spatioport concerné.

| Coût | Règle |
| --- | --- |
| Droits de port | Frais administratifs partout, plus une taxe de visiteur dans la plupart des grands spatioports |
| Réductions | Citoyens UC -600 sur la taxe dans les villes UC, Freestar Rangers -240 sur leur territoire, Neon Voucher -1 800 à Neon |
| Amarrage | 50 % des droits de port, une fois par jour local au port |
| Entretien | Dépend de la masse totale, de la poussée et de la puissance du réacteur ; le payer remet la Vessel Condition au maximum |
| Frontier | Tous les frais de Harbor divisés par deux |
| Impayés | Quitter la planète sans payer vous vaut une prime : 150 % de la somme + 1 000 (droits), 120 % + 250 (amarrage) |

Le Neon Voucher s'obtient avec la quête *Back to the Grind* (il ne peut pas être perdu) ou s'achète à Kolman Lang, à la Neon Trade Authority. Le Spacefarer Mode des options double tous les coûts.

### Cost of Spacing et Cost of Living

- [Cost Of Spacing](https://www.nexusmods.com/starfield/mods/11726) ajoute des contrôles d'immatriculation et des factures d'entretien pour votre vaisseau. Constellation prend en charge les frais du Frontier. L'espace Freestar est en général moins cher que celui des UC, Neon est chère, Akila est une escale économique. Les capitaines du Crimson Fleet versent un tribut.
- [Cost Of Living](https://www.nexusmods.com/starfield/mods/12136) facture des frais d'enregistrement uniques quand vous construisez un avant-poste dans l'espace colonisé, et des taxes d'habitation sur vos logements, avec des pénalités de retard si vous ne payez pas.

## Gagner et dépenser

| Réglage | Vanilla | Cette liste |
| --- | --- | --- |
| Prix de revente | 12,5 % de la valeur | 10 % |
| Réapprovisionnement des marchands | 2 jours | 5 jours |
| Immatriculation d'un vaisseau | 84 % de sa valeur | 65 % |

- [Spacefaring Economy](https://www.nexusmods.com/starfield/mods/12022) : vaisseaux, pièces et ressources rares coûtent bien plus cher ; les ressources courantes et le bric-à-brac valent moins ; les ressources exotiques valent très cher. Les pièces Hopetech et Nova Galactic sont d'entrée de gamme, Deimos de milieu de gamme, Stroud-Eklund et Taiyo haut de gamme. Les pièces de classe B et C et les grands modules sont un investissement à long terme. Récompenses de quête et primes sont bien plus élevées ; les missions de cargo paient au poids ; la contrebande et la piraterie paient très bien. Choisir « l'option facile » dans une quête peut vous coûter de l'argent.
- GRiNDTerra paie les quêtes de faction, diverses, radiantes et de colonie selon leur taille : 6 000 (grande, quêtes de compagnon comprises), 4 000 (moyenne), 2 500 (petite), 1 000 (minime). Spacefaring Economy relève aussi les récompenses : certains montants peuvent donc varier. Les crédits ne dépendent plus de votre niveau ; la plupart des butins ne contiennent plus de ressources (à la place, parfois un manuel ou un objet au hasard) ; moins de munitions, de trousses de soins et de digicrochets dans le butin. Les crédits trouvés sont environ 50 % plus élevés qu'en vanilla ([Loot Overhaul](https://www.nexusmods.com/starfield/mods/5181)).
- [Vendor Overhaul](https://www.nexusmods.com/starfield/mods/5179) : les marchands ont environ deux fois plus de kits de réparation, grenades, mines et fournitures médicales, et 100 à 300 % de munitions en plus. [Richer Vendors](https://www.nexusmods.com/starfield/mods/5624) leur donne plus de crédits.
- Les [Faction Requisition Kiosks](https://www.nexusmods.com/starfield/mods/9012) vendent l'équipement de chaque faction dans son quartier général (celui de Constellation est au sous-sol du Lodge après *One Small Step*). Ils n'achètent rien.
- La contrebande se vend 3 fois plus cher là où l'on vous scanne (New Atlantis, Akila City, Neon sauf l'Aurora, Cydonia, Hopetown, Gagarin Landing, New Homestead) et peu ailleurs ([Variable Contraband Prices - Redux](https://www.nexusmods.com/starfield/mods/12205)).
- Pillage : « Strip » déshabille un PNJ pour récupérer ce qu'il porte, « Loot All » envoie tout vers votre vaisseau ou votre groupe, « Take All to Ship » fonctionne sur n'importe quel conteneur ou corps ([Shades Immersive Looting](https://www.nexusmods.com/starfield/mods/8383), [Take All to Ship](https://www.nexusmods.com/starfield/mods/8810)).

### La banque GalBank

[Gallion](https://www.nexusmods.com/starfield/mods/17626) rend les distributeurs GalBank fonctionnels. Vous pouvez aussi construire un GalBank Terminal dans un avant-poste ou un GalBank Mobile dans votre vaisseau ou un logement (Miscellaneous).

- **Prêts** de 25 000 à 1 000 000 crédits en six paliers, remboursés automatiquement à chaque cycle.
- **Épargne** rémunérée de 0,40 % par cycle au statut Basic à 0,75 % au statut Premier ; elle couvre une échéance de prêt manquée.
- **Investissements** dans 33 entreprises à New Atlantis, Akila City, Neon et en orbite, classées Stable, Balanced, Turbulent ou Venture. Une position dure 12 jours et verse tous les 3 jours ; une sortie anticipée rend 85 %. Les entreprises Turbulent et Venture peuvent passer en redressement : payez 40 % de votre mise pour les sauver, ou acceptez 50 % de risque de faillite (vous récupérez environ 40 % si elle coule).
- Les hausses et baisses de marché font varier les gains par région et par secteur. Terminer les quêtes des UC, des Freestar Rangers ou de Ryujin améliore durablement leur région.
- Le **statut** monte de Basic à Preferred, Priority puis Premier si vous portez un prêt et le remboursez à temps.

{: .warning }
Manquez trop d'échéances et GalBank envoie des chasseurs Ecliptic à vos trousses, par vagues de plus en plus fortes, jusqu'à ce que la dette soit réglée. Les villes sont sûres ; le reste de la galaxie ne l'est pas.

### Fabrication

- Les améliorations de qualité des armes et armures coûtent des ressources au lieu de crédits, avec des matériaux plus rares aux paliers élevés ([Stellar Crafting](https://www.nexusmods.com/starfield/mods/16665)).
- GRiNDTerra regroupe les ressources en catégories pour la fabrication et la recherche : GEO (géologiques), BIO (biologiques), MFG01 à MFG03 (paliers manufacturés) et Unique. L'établi industriel propose des recettes de conversion entre elles.
- Les ressources apparaissent à l'état solide, liquide ou gazeux selon la température et la pression de la planète ([States of Matter](https://www.nexusmods.com/starfield/mods/13686)).

</div>
