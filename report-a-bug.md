---
title: Report a Bug
layout: page
permalink: /report-a-bug/
description: "Send a bug report straight to the support channel on Discord."
---
{% include page_hero.html eyebrow="Help" eyebrow_fr="Aide" title_en="Report a bug" title_fr="Signaler un bug" lead_en="Fill in the form and send it: it goes straight to the support channel on Discord. Put logs and screenshots as links." lead_fr="Remplissez le formulaire et envoyez-le : il arrive directement dans le canal de support du Discord. Mettez les logs et captures sous forme de liens." image="/assets/Images/forge-hex-dark.webp" image_light="/assets/Images/forge-hex-light.webp" hex=true glow=true %}

<section class="wrap section bug" data-bug>
  <form class="form hexpanel">
    <label><span><span lang="en">Summary</span><span lang="fr">Résumé</span></span><input class="input" name="title" type="text" placeholder="Short issue summary" data-ph-fr="Résumé du problème en une ligne"></label>
    <div class="form__row">
      <label><span>Type</span>
        <select class="input" name="type"><option value="Bug report" data-text-fr="Rapport de bug">Bug report</option><option value="Crash" data-text-fr="Crash">Crash</option><option value="Install issue" data-text-fr="Problème d'installation">Install issue</option><option value="Load order issue" data-text-fr="Problème d'ordre de chargement">Load order issue</option></select>
      </label>
      <label><span>Modlist</span>
        <select class="input" name="project"><option value="">…</option>{% for m in site.modlists %}<option>{{ m.title }}</option>{% endfor %}</select>
      </label>
    </div>
    <label><span><span lang="en">Details</span><span lang="fr">Détails</span></span><textarea class="input" name="details" rows="6" placeholder="Steps to reproduce, what you expected, and what happened." data-ph-fr="Étapes pour reproduire, ce que vous attendiez et ce qui s'est passé."></textarea></label>
    <label><span><span lang="en">Your Discord name (optional, so we can answer)</span><span lang="fr">Votre pseudo Discord (optionnel, pour vous répondre)</span></span><input class="input" name="contact" type="text" maxlength="80" autocomplete="off" placeholder="name" data-ph-fr="pseudo"></label>
    <label class="hp" aria-hidden="true">Website<input name="website" type="text" tabindex="-1" autocomplete="off"></label>
    <label><span><span lang="en">Links (optional)</span><span lang="fr">Liens (optionnel)</span></span><textarea class="input" name="links" rows="3" placeholder="Logs or screenshots, one per line." data-ph-fr="Logs ou captures, un lien par ligne."></textarea></label>
    <div class="form__send">
      <button class="btn btn--solid" type="submit" data-bug-send><span lang="en">Send to Discord</span><span lang="fr">Envoyer sur Discord</span></button>
      <p class="form__status" data-bug-status role="status" aria-live="polite"></p>
    </div>
  </form>
  <div class="preview hexpanel">
    <div class="preview__bar">
      <span class="eyebrow"><span lang="en">Preview</span><span lang="fr">Aperçu</span></span>
      <button class="btn btn--sm" type="button" data-bug-copy><span lang="en">Copy</span><span lang="fr">Copier</span></button>
    </div>
    <pre data-bug-preview></pre>
  </div>
</section>
