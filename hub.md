---
title: Modlists
layout: page
permalink: /hub/
description: "Every modlist hosted on The Astral Forge."
---
{%- comment -%}
  The orrery (Nov 2026): the site emblem in the middle, one list per ring, each list's emblem as a planet. Markup order is copy, stage, plates (the reading and Tab order on phones).
  Choosing a planet is a radio button (works without script, arrow keys move between lists); the CSS
  turns the rings so the chosen planet comes to the front and shows its catalogue plate. All plates
  are in the HTML and share one grid cell, so nothing moves when the choice changes.
  CSS layer "Hub: the orrery" at the end of site.css.
{%- endcomment -%}
{%- assign n = site.modlists | size -%}
<section class="orrery" style="--n: {{ n }}">
  <img class="orrery__bg theme-d" src="{{ '/assets/Images/forge-hex-dark.webp' | relative_url }}" srcset="{{ '/assets/Images/forge-hex-dark.webp' | srcset }}" sizes="100vw" alt="" fetchpriority="high" decoding="async">
  <img class="orrery__bg theme-l" src="{{ '/assets/Images/forge-hex-light.webp' | relative_url }}" srcset="{{ '/assets/Images/forge-hex-light.webp' | srcset }}" sizes="100vw" alt="" loading="lazy" decoding="async">
  {%- comment %} rings of lit tiles pulsing out from the orrery, as on the home's first section; site.js centres them and sets the pictures after load {% endcomment %}
  <div class="orrery__pulse" aria-hidden="true" data-src-d="{{ '/assets/Images/forge-hex-pulse.webp' | relative_url }}" data-src-l="{{ '/assets/Images/forge-hex-light-pulse.webp' | relative_url }}"><i></i><i></i><i></i><i></i></div>

  <div class="orrery__wrap">
    <div class="orrery__copy">
      <span class="eyebrow"><span class="diamond is-full"></span>The Astral Forge</span>
      <h1 class="orrery__title">Modlists</h1>
      <p class="orrery__lead"><span lang="en">Five lists across four games. Pick one on the orrery: its install guide, troubleshooting page, load order and full mod list are one click away.</span><span lang="fr">Cinq listes sur quatre jeux. Choisissez-en une sur le planétaire : son guide d'installation, sa page de dépannage, son ordre de chargement et la liste complète de ses mods sont à un clic.</span></p>
    </div>

    <div class="orrery__stage">
      <div class="orrery__fixed" aria-hidden="true">
        <svg class="orrery__scale" viewBox="-100 -100 200 200" focusable="false">
          <circle r="99" class="o-line"/>
          <circle r="93.5" class="o-line o-faint"/>
          {%- for t in (0..71) %}{% assign d = t | times: 5 %}{% assign m6 = t | modulo: 6 %}
          <line x1="0" y1="-99" x2="0" y2="{% if m6 == 0 %}-93.5{% else %}-96.5{% endif %}" transform="rotate({{ d }})" class="o-tick{% if m6 == 0 %} o-tick--major{% endif %}"/>
          {%- endfor %}
          <path class="o-pointer" d="M0 101 L-3 106 L3 106 Z"/>
        </svg>
      </div>

      <div class="orrery__disc">
        <svg class="orrery__rings" viewBox="-100 -100 200 200" aria-hidden="true" focusable="false">
          <circle r="22" class="o-hub"/>
          {%- for m in site.modlists %}{% assign i = forloop.index0 %}{% assign r = i | times: 11 | plus: 44 %}{% assign a = i | times: 360 | divided_by: n | plus: 90 %}
          <circle r="{{ r }}" class="o-ring o-ring--{{ i }}"/>
          <circle r="{{ r }}" class="o-teeth"/>
          <line x1="20" y1="0" x2="{{ r }}" y2="0" transform="rotate({{ a }})" class="o-arm o-arm--{{ i }}"/>
          {%- endfor %}
        </svg>
        <span class="orrery__sun" aria-hidden="true"><img src="{{ '/assets/logos/emblem.webp' | relative_url }}" alt="" width="512" height="512" decoding="async"></span>
        <div class="orrery__arms" role="radiogroup" aria-label="Choose a modlist" data-aria-fr="Choisir une liste">
          {%- for m in site.modlists %}{% assign i = forloop.index0 %}
          <div class="orrery__arm" style="--i: {{ i }}; --rr: {{ i | times: 11 | plus: 44 }}">
            <input class="orrery__radio sr-only" type="radio" name="orrery" id="orb-{{ m.id }}" value="{{ m.id }}"{% if forloop.first %} checked{% endif %}>
            <label class="planet" for="orb-{{ m.id }}">
              <span class="planet__disc">{% if m.emblem %}<img src="{{ m.emblem | relative_url }}" alt="" width="640" height="640" decoding="async">{% endif %}</span>
              <span class="planet__name">{{ m.title }}</span>
            </label>
          </div>
          {%- endfor %}
        </div>
      </div>
    </div>

    <div class="orrery__plates">
      {%- for m in site.modlists %}
      {%- case m.game -%}
        {%- when 'Skyrim SE' -%}{%- assign code = 'SSE' -%}
        {%- when 'Cyberpunk 2077' -%}{%- assign code = 'CP77' -%}
        {%- when "No Man's Sky" -%}{%- assign code = 'NMS' -%}
        {%- when 'Starfield' -%}{%- assign code = 'SF' -%}
        {%- else -%}{%- assign code = m.game | slice: 0, 3 | upcase -%}
      {%- endcase -%}
      {%- assign install = nil -%}
      {%- for item in m.nav %}{% if install == nil and item.title contains 'Install' %}{% assign install = item.url %}{% endif %}{% endfor %}
      <article class="plate" id="list-{{ m.id }}" aria-labelledby="plate-t-{{ m.id }}" data-tilt>
        <img class="plate__bg" src="{{ m.image | thumb: 960 }}" srcset="{{ m.image | srcset }}" sizes="(max-width: 1100px) 100vw, 640px" alt="" loading="lazy" decoding="async">
        <span class="plate__shade" aria-hidden="true"></span>
        <p class="plate__no"><span lang="en">Catalogue</span><span lang="fr">Catalogue</span> <b>TAF·{{ code }}·0{{ forloop.index }}</b><span class="fresh" data-fresh="{{ m.title }}" hidden><span class="pulse"></span><span lang="en">Updated</span><span lang="fr">Mis à jour</span></span></p>
        <h2 class="plate__name" id="plate-t-{{ m.id }}">{{ m.title }}</h2>
        <p class="plate__game">{{ m.game }}</p>
        {%- if m.subtitle != '' %}
        <p class="plate__desc">{% if m.subtitle_fr != '' %}<span lang="en">{{ m.subtitle }}</span><span lang="fr">{{ m.subtitle_fr }}</span>{% else %}{{ m.subtitle }}{% endif %}</p>
        {%- endif %}
        <dl class="plate__obs">
          <div><dt>Version</dt><dd>v<span data-live="{{ m.title }}" data-field="version">{{ m.live.version }}</span></dd></div>
          <div><dt><span lang="en">Updated</span><span lang="fr">Mise à jour</span></dt><dd><time data-live="{{ m.title }}" data-field="updated" datetime="{{ m.live.updated }}">{{ m.live.updated | reltime }}</time></dd></div>
          {%- if m.live.size != '' %}
          <div><dt><span lang="en">Total size</span><span lang="fr">Taille totale</span></dt><dd><span data-live="{{ m.title }}" data-field="size">{{ m.live.size }}</span>&nbsp;<span lang="en">GB</span><span lang="fr">Go</span></dd></div>
          {%- endif %}
          {%- if m.mods %}
          <div><dt>Mods</dt><dd>{{ m.mods }}</dd></div>
          {%- endif %}
          {%- if m.live.archives != '' %}
          <div><dt>Archives</dt><dd><span data-live="{{ m.title }}" data-field="archives">{{ m.live.archives }}</span></dd></div>
          {%- endif %}
        </dl>
        <div class="actions">
          <a class="btn btn--solid" href="{{ m.url | relative_url }}"><span lang="en">Open the docs</span><span lang="fr">Voir la doc</span></a>
          {%- if install %}
          <a class="btn" href="{{ install | relative_url }}"><span lang="en">Install guide</span><span lang="fr">Guide d'installation</span></a>
          {%- endif %}
        </div>
        <span class="plate__bar" aria-hidden="true"></span>
      </article>
      {%- endfor %}
    </div>
  </div>
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
