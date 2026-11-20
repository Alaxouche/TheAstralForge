# Workers Cloudflare du site

Trois morceaux de code qui tournent chez Cloudflare. Deux sont des **Pages Functions**
(dossier `functions/` à la racine du dépôt) : ils sont publiés automatiquement avec le site,
à la même adresse. Le troisième est un **Worker** séparé, avec une tâche planifiée.

| | Fichier | Adresse | Réglage nécessaire |
|---|---|---|---|
| Données en direct | `functions/api/live.js` | `theastralforge.com/api/live` | aucun |
| Rapports de bug vers Discord | `functions/api/report.js` | `theastralforge.com/api/report` | le secret `DISCORD_WEBHOOK_URL` |
| Rebuild automatique | `workers/rebuild/worker.js` | sa propre adresse `*.workers.dev` | un deploy hook + `wrangler deploy` |

Les quotas gratuits de Cloudflare (100 000 requêtes de Workers par jour) couvrent largement le site :
chaque visiteur appelle `/api/live` au plus une fois toutes les 10 minutes par onglet.

## 1. Données en direct (`/api/live`)

Rien à faire : il part avec le prochain déploiement du site. Les pages demandent alors versions,
tailles, dates et nombre de membres Discord en ligne à `/api/live` au lieu d'appeler GitHub et Discord
chacune de leur côté. Si l'adresse ne répond pas (serveur local, panne), `site.js` revient aux
appels directs, comme avant.

Vérifier après le déploiement : ouvrir `https://theastralforge.com/api/live`, on doit voir du JSON.

## 2. Rapports de bug vers Discord (`/api/report`)

1. Sur Discord, dans le salon qui doit recevoir les rapports : **Modifier le salon > Intégrations >
   Webhooks > Nouveau webhook**, puis **Copier l'URL du webhook**.
2. Sur Cloudflare : **Workers & Pages**, l'entrée **Pages** du site (icône éclair), **Settings >
   Variables and Secrets > Add**. Nom : `DISCORD_WEBHOOK_URL`, valeur : l'URL copiée, cocher
   **Encrypt**, environnement **Production**, enregistrer.
3. Relancer un déploiement du site (un push suffit) : un secret ne s'applique qu'aux déploiements
   faits après lui.
4. Tester sur `theastralforge.com/report-a-bug/` : le rapport arrive dans le salon.

Tant que le secret n'est pas posé, le bouton « Envoyer sur Discord » affiche un message qui
renvoie vers le copier-coller de l'aperçu : rien ne casse.

Protections : le formulaire n'est accepté que depuis le site, un champ caché piège les robots,
un envoi en moins de 4 secondes est refusé, les textes sont limités en taille et aucune mention
(`@everyone`, rôles) ne peut notifier qui que ce soit. Si le webhook est un jour spammé, supprime-le
sur Discord et recrée-en un (étapes 1 à 3).

## 3. Rebuild automatique (`workers/rebuild/`)

Toutes les heures, il compare le `modlist.json` de GitHub avec `/build-info.json` (publié par chaque
build du site : les versions avec lesquelles il a été construit). Si une liste a changé, il relance
la construction du site. Les pages affichent alors la nouvelle version, la taille et la date sans
que tu aies à pousser quoi que ce soit.

1. **Créer le deploy hook** : **Workers & Pages**, l'entrée **Worker** du site (celle qui construit
   le site), **Settings > Builds > Deploy Hooks**. Nom : `modlist update`, branche : `main`,
   **Create**, puis copier l'URL.
2. **Publier le Worker**, depuis ce dossier :
   ```
   cd workers/rebuild
   npx wrangler login
   npx wrangler deploy
   npx wrangler secret put DEPLOY_HOOK_URL
   ```
   (la dernière commande demande l'URL du deploy hook : colle-la).
3. **Vérifier** : ouvrir l'adresse `taf-rebuild.<ton-sous-domaine>.workers.dev` affichée par
   `wrangler deploy`. Elle montre ce que le Worker ferait (`"up to date"` ou `"a modlist changed"`)
   sans rien déclencher.

L'heure de passage se règle dans `wrangler.jsonc` (`"crons"`, en heure UTC), puis `npx wrangler deploy`.
