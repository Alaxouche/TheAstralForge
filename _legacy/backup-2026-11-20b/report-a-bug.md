---
title: Report a Bug
layout: page
permalink: /report-a-bug/
description: "Draft a clear bug report to post on Discord or GitHub."
---
{% include page_hero.html eyebrow="Support" eyebrow_fr="Assistance" title_en="Report a bug" title_fr="Signaler un bug" lead_en="Fill in the form, copy the preview and post it in the support channel with any logs or screenshots." lead_fr="Remplissez le formulaire, copiez l'aperçu et publiez-le dans le canal de support avec les logs ou captures d'écran." image="/assets/Images/Cyberpunk/photomode_12092025_110731.webp" %}

<section class="wrap narrow section" data-bug>
  <form class="form">
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
    <label><span><span lang="en">Links (optional)</span><span lang="fr">Liens (optionnel)</span></span><textarea class="input" name="links" rows="3" placeholder="Logs or screenshots, one per line." data-ph-fr="Logs ou captures, un lien par ligne."></textarea></label>
  </form>
  <div class="preview">
    <div class="preview__bar">
      <span class="eyebrow"><span lang="en">Preview</span><span lang="fr">Aperçu</span></span>
      <button class="btn btn--sm" type="button" data-bug-copy><span lang="en">Copy</span><span lang="fr">Copier</span></button>
    </div>
    <pre data-bug-preview></pre>
  </div>
</section>
