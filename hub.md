---
title: Modlists
layout: page
permalink: /hub/
description: "Every modlist hosted on The Astral Forge."
---
{% include page_hero.html eyebrow="The Astral Forge" title_en="Modlists" title_fr="Modlists" lead_en="Five lists across four games. Each one has an install guide, a troubleshooting page, its load order and the full list of its mods." lead_fr="Cinq listes sur quatre jeux. Pour chacune : un guide d'installation, une page de dépannage, l'ordre de chargement et la liste complète de ses mods." image="/assets/Images/hex-hero.webp" image_light="/assets/Images/hex-hero-light.webp" hex=true %}

<section class="bands">
  {%- for m in site.modlists %}
  <a class="band" data-tilt href="{{ m.url | relative_url }}" style="--accent: {{ m.accent }}">
    <img class="band__bg" src="{{ m.image | relative_url }}" srcset="{{ m.image | srcset }}" sizes="100vw" alt="" loading="lazy" decoding="async">
    <span class="band__body">
      <span class="band__n">0{{ forloop.index }}</span>
      <span>
        <span class="band__kicker">{{ m.game }} <span class="sep"></span> v<span data-live="{{ m.title }}" data-field="version">{{ m.live.version }}</span> <span class="sep"></span> <time data-live="{{ m.title }}" data-field="updated" datetime="{{ m.live.updated }}">{{ m.live.updated | reltime }}</time>{% if m.live.size != '' %} <span class="sep"></span> <span data-live="{{ m.title }}" data-field="size">{{ m.live.size }}</span>&nbsp;<span lang="en">GB</span><span lang="fr">Go</span>{% endif %}{% if m.mods %} <span class="sep"></span> {{ m.mods }} mods{% endif %}<span class="fresh fresh--band" data-fresh="{{ m.title }}" hidden><span class="pulse"></span><span lang="en">Updated</span><span lang="fr">Mis à jour</span></span></span>
        <span class="band__name">{{ m.title }}</span>
        <span class="band__desc">{% if m.subtitle_fr %}<span lang="en">{{ m.subtitle }}</span><span lang="fr">{{ m.subtitle_fr }}</span>{% else %}{{ m.subtitle }}{% endif %}</span>
      </span>
      {%- if m.emblem %}<img class="band__mark" src="{{ m.emblem | relative_url }}" alt="" width="640" height="640" loading="lazy" decoding="async">{% endif %}
      <span class="band__go"><span lang="en">Open the docs</span><span lang="fr">Voir la doc</span> →</span>
    </span>
    <span class="band__bar"></span>
  </a>
  {%- endfor %}
</section>

<section class="wrap narrow section hub-help">
  <h2 class="section-title"><span class="diamond"></span><span lang="en">Need help?</span><span lang="fr">Besoin d'aide ?</span></h2>
  <p><span lang="en">Each list has a Troubleshooting page with guided questions and a crash log reader. For the rest:</span><span lang="fr">Chaque liste a une page Dépannage avec des questions guidées et un lecteur de journaux de crash. Pour le reste :</span></p>
  <div class="actions">
    <a class="btn btn--sm" href="{{ '/faq/' | relative_url }}">FAQ</a>
    <a class="btn btn--sm" href="{{ '/report-a-bug/' | relative_url }}"><span lang="en">Report a bug</span><span lang="fr">Signaler un bug</span></a>
    <a class="btn btn--sm" href="https://discord.gg/vKuB7nazBk" target="_blank" rel="noopener noreferrer">Discord</a>
  </div>
</section>
