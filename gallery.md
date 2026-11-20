---
title: Community Gallery
layout: page
permalink: /gallery/
description: "Screenshots shared by the community on Discord."
---
{%- comment %} Header picture: the newest screenshot of the gallery (the Discord sync keeps the 24 newest and deletes the rest) {% endcomment %}
{%- assign newest = site.data.community_gallery.items | first -%}
{% include page_hero.html eyebrow="Community" eyebrow_fr="Communauté" title_en="Gallery" title_fr="Galerie" lead_en="Screenshots shared by players on Discord." lead_fr="Des captures partagées par les joueurs sur Discord." image=newest.image %}

<section class="wrap section">
  {% include components/community_gallery.html %}
</section>
