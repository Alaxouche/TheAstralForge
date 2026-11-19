---
title: Modlists
layout: page
permalink: /hub/
description: "Every modlist hosted on The Astral Forge."
---
{% include page_hero.html eyebrow="The Astral Forge" title_en="Modlists" title_fr="Modlists" lead_en="Five lists across four games. Each one has an install guide, a changelog, its load order and the known issues." lead_fr="Cinq listes sur quatre jeux. Pour chacune : un guide d'installation, un changelog, l'ordre de chargement et les problèmes connus." image="/assets/Images/Skyrim/enb_2026-2-28_18-36-25_572.webp" %}

<section class="bands">
  {%- for m in site.modlists %}
  <a class="band" data-tilt href="{{ m.url | relative_url }}" style="--accent: {{ m.accent }}">
    <img class="band__bg" src="{{ m.image | relative_url }}" srcset="{{ m.image | srcset }}" sizes="100vw" alt="" loading="lazy" decoding="async">
    <span class="band__body">
      <span class="band__n">0{{ forloop.index }}</span>
      <span>
        <span class="band__kicker">{{ m.game }} <span class="sep"></span> v<span data-live="{{ m.title }}" data-field="version">{{ m.live.version }}</span> <span class="sep"></span> <time data-live="{{ m.title }}" data-field="updated" datetime="{{ m.live.updated }}">{{ m.live.updated | date: "%d/%m/%Y" }}</time><span class="fresh fresh--band" data-fresh="{{ m.title }}" hidden><span class="pulse"></span><span lang="en">Updated</span><span lang="fr">Mis à jour</span></span></span>
        <span class="band__name">{{ m.title }}</span>
        <span class="band__desc">{% if m.subtitle_fr %}<span lang="en">{{ m.subtitle }}</span><span lang="fr">{{ m.subtitle_fr }}</span>{% else %}{{ m.subtitle }}{% endif %}</span>
      </span>
      <span class="band__go"><span lang="en">Open the docs</span><span lang="fr">Voir la doc</span> →</span>
    </span>
    <span class="band__bar"></span>
  </a>
  {%- endfor %}
</section>

<section class="wrap narrow section" style="padding-top:100px">
  <h2 class="section-title"><span class="diamond"></span>FAQ</h2>
  {% include components/faq.html %}
  <p style="margin-top:32px"><a class="btn btn--sm" href="{{ '/faq/' | relative_url }}"><span lang="en">All questions</span><span lang="fr">Toutes les questions</span> →</a></p>
</section>
