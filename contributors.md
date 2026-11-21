---
title: Supporters
title_fr: Soutiens
layout: page
permalink: /contributors/
description: "Patreon and Ko-fi: the tiers, what they pay for, and the people who support The Astral Forge."
---
{% include page_hero.html eyebrow="Patreon · Ko-fi" eyebrow_fr="Patreon · Ko-fi" title_en="Supporters" title_fr="Soutiens" lead_en="Patreon and Ko-fi pay for test hardware, licences and the hours spent fixing things after every game update. Thanks to everyone listed here." lead_fr="Patreon et Ko-fi financent le matériel de test, les licences et les heures passées à tout réparer après chaque mise à jour du jeu. Merci à tous ceux qui sont listés ici." image="/assets/Images/forge-hex-dark.webp" image_light="/assets/Images/forge-hex-light.webp" hex=true glow=true %}

<section class="wrap section">
  <div class="actions" style="margin-bottom:72px">
    <a class="btn btn--solid" href="https://patreon.com/Alaxouche" target="_blank" rel="noopener noreferrer"><span lang="en">Join on Patreon</span><span lang="fr">Rejoindre sur Patreon</span></a>
    <a class="btn" href="https://ko-fi.com/alaxouche" target="_blank" rel="noopener noreferrer"><span lang="en">Support on Ko-fi</span><span lang="fr">Soutenir sur Ko-fi</span></a>
  </div>

  <h2 class="section-title"><span class="diamond"></span><span lang="en">Patreon tiers</span><span lang="fr">Niveaux Patreon</span></h2>
  <div class="tiers hexpanel">
    {%- for tier in site.data.contributors.tiers %}
    <div class="tier">
      <h3>{{ tier.name }}</h3>
      <p class="tier__price">{% if tier.amount_fr %}<span lang="en">{{ tier.amount }}</span><span lang="fr">{{ tier.amount_fr }}</span>{% else %}{{ tier.amount }}{% endif %}</p>
      {%- if tier.same_as %}
      <p class="tier__same"><span lang="en">Same perks as {{ tier.same_as }}: the higher amount is extra support.</span><span lang="fr">Mêmes avantages que {{ tier.same_as }} : le montant plus élevé est un soutien en plus.</span></p>
      {%- endif %}
      <ul>{% for perk in tier.perks %}{% assign fr = tier.perks_fr[forloop.index0] %}<li>{% if fr %}<span lang="en">{{ perk }}</span><span lang="fr">{{ fr }}</span>{% else %}{{ perk }}{% endif %}</li>{% endfor %}</ul>
    </div>
    {%- endfor %}
  </div>

  <div class="two-col" style="margin-top:100px">
    <div class="hexpanel">
      <h2 class="section-title"><span class="diamond"></span><span lang="en">Why contribute</span><span lang="fr">Pourquoi contribuer</span></h2>
      <ul class="list list--diamond">{% for b in site.data.contributors.benefits %}{% assign fr = site.data.contributors.benefits_fr[forloop.index0] %}<li>{% if fr %}<span lang="en">{{ b }}</span><span lang="fr">{{ fr }}</span>{% else %}{{ b }}{% endif %}</li>{% endfor %}</ul>
    </div>
    <div class="hexpanel">
      <h2 class="section-title"><span class="diamond"></span><span lang="en">What it funds</span><span lang="fr">Ce que ça finance</span></h2>
      <ul class="list list--diamond">{% for i in site.data.contributors.impact %}{% assign fr = site.data.contributors.impact_fr[forloop.index0] %}<li>{% if fr %}<span lang="en">{{ i }}</span><span lang="fr">{{ fr }}</span>{% else %}{{ i }}{% endif %}</li>{% endfor %}</ul>
    </div>
  </div>

  <div class="two-col" style="margin-top:100px">
    <div class="hexpanel">
      <h2 class="section-title"><span class="diamond"></span><span lang="en">Latest supporters</span><span lang="fr">Derniers soutiens</span></h2>
      <div class="table-wrap">
        <table>
          <thead><tr><th><span lang="en">Name</span><span lang="fr">Nom</span></th><th><span lang="en">Platform</span><span lang="fr">Plateforme</span></th><th><span lang="en">Total given</span><span lang="fr">Total donné</span></th></tr></thead>
          <tbody>
            {%- for s in site.data.contributors.recent %}
            <tr><td>{{ s.name }}</td><td class="muted">{{ s.platform }}</td><td>{{ s.amount }}</td></tr>
            {%- endfor %}
          </tbody>
        </table>
      </div>
    </div>
    {%- if site.data.contributors.top %}
    <div class="hexpanel">
      <h2 class="section-title"><span class="diamond"></span>Top 10</h2>
      <ol class="list">
        {%- for s in site.data.contributors.top %}
        <li><span>{{ s.name }}</span><span class="muted">{{ s.platform }} · {{ s.total }}</span></li>
        {%- endfor %}
      </ol>
    </div>
    {%- endif %}
  </div>
</section>
