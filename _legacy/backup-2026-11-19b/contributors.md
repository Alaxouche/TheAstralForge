---
title: Contributors
layout: page
permalink: /contributors/
description: "The people who keep The Astral Forge alive."
---
{% include page_hero.html eyebrow="Support" title_en="Supporters" title_fr="Soutiens" lead_en="Patreon and Ko-fi pay for test hardware, licences and the hours spent fixing things after every game update. Thanks to everyone listed here." lead_fr="Patreon et Ko-fi financent le matériel de test, les licences et les heures passées à tout réparer après chaque mise à jour du jeu. Merci à tous ceux qui sont listés ici." image="/assets/Images/Skyrim/enb_2026-2-7_22-12-03_248.webp" %}

<section class="wrap section">
  <div class="actions" style="margin-bottom:72px">
    <a class="btn btn--solid" href="https://patreon.com/Alaxouche" target="_blank" rel="noopener noreferrer"><span lang="en">Join on Patreon</span><span lang="fr">Rejoindre sur Patreon</span></a>
    <a class="btn" href="https://ko-fi.com/alaxouche" target="_blank" rel="noopener noreferrer"><span lang="en">Support on Ko-fi</span><span lang="fr">Soutenir sur Ko-fi</span></a>
  </div>

  <h2 class="section-title"><span class="diamond"></span><span lang="en">Patreon tiers</span><span lang="fr">Niveaux Patreon</span></h2>
  <div class="tiers">
    {%- for tier in site.data.contributors.tiers %}
    <div class="tier">
      <h3>{{ tier.name }}</h3>
      <p class="tier__price">{{ tier.amount }}</p>
      <ul>{% for perk in tier.perks %}<li>{{ perk }}</li>{% endfor %}</ul>
    </div>
    {%- endfor %}
  </div>

  <div class="two-col" style="margin-top:100px">
    <div>
      <h2 class="section-title"><span class="diamond"></span><span lang="en">Why contribute</span><span lang="fr">Pourquoi contribuer</span></h2>
      <ul class="list list--diamond">{% for b in site.data.contributors.benefits %}<li>{{ b }}</li>{% endfor %}</ul>
    </div>
    <div>
      <h2 class="section-title"><span class="diamond"></span><span lang="en">What it funds</span><span lang="fr">Ce que ça finance</span></h2>
      <ul class="list list--diamond">{% for i in site.data.contributors.impact %}<li>{{ i }}</li>{% endfor %}</ul>
    </div>
  </div>

  <div class="two-col" style="margin-top:100px">
    <div>
      <h2 class="section-title"><span class="diamond"></span><span lang="en">Recent supporters</span><span lang="fr">Soutiens récents</span></h2>
      <div class="table-wrap">
        <table>
          <thead><tr><th><span lang="en">Name</span><span lang="fr">Nom</span></th><th><span lang="en">Platform</span><span lang="fr">Plateforme</span></th><th><span lang="en">Amount</span><span lang="fr">Montant</span></th><th>Date</th></tr></thead>
          <tbody>
            {%- for s in site.data.contributors.recent %}
            <tr><td>{{ s.name }}</td><td class="muted">{{ s.platform }}</td><td>{{ s.amount }}</td><td class="muted">{{ s.date }}</td></tr>
            {%- endfor %}
          </tbody>
        </table>
      </div>
    </div>
    {%- if site.data.contributors.top %}
    <div>
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
