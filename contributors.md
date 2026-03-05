---
layout: skyground_readme
title: Contributors
permalink: /contributors/
---

# Contributors

Thank you to everyone who supports The Astral Forge. Your support keeps the modlists updated, tested, and documented.

<div class="contributors-actions">
  <a class="contributors-btn contributors-btn--patreon" href="https://patreon.com/Alaxouche" target="_blank" rel="noopener noreferrer">Join on Patreon</a>
  <a class="contributors-btn contributors-btn--kofi" href="https://ko-fi.com/alaxouche" target="_blank" rel="noopener noreferrer">Support on Ko-fi</a>
</div>

## Why contribute?

<ul class="contributors-list">
  {% for benefit in site.data.contributors.benefits %}
    <li>{{ benefit }}</li>
  {% endfor %}
</ul>

## How your support helps development

Your contributions fund:

<ul class="contributors-list">
  {% for impact in site.data.contributors.impact %}
    <li>{{ impact }}</li>
  {% endfor %}
</ul>

## Patreon tiers

<div class="contributors-grid">
  {% for tier in site.data.contributors.tiers %}
    <div class="contributors-card">
      <img class="contributors-tier-image" src="{{ '/assets/Images/generic_background.webp' | relative_url }}" alt="Tier art placeholder">
      <h3>{{ tier.name }}</h3>
      <p class="contributors-amount">{{ tier.amount }}</p>
      <ul>
        {% for perk in tier.perks %}
          <li>{{ perk }}</li>
        {% endfor %}
      </ul>
    </div>
  {% endfor %}
</div>

## Recent supporters

<div class="contributors-table">
  <div class="contributors-row contributors-row--header">
    <span>Name</span>
    <span>Platform</span>
    <span>Amount</span>
    <span>Date</span>
  </div>
  {% for supporter in site.data.contributors.recent %}
    <div class="contributors-row">
      <span>{{ supporter.name }}</span>
      <span>{{ supporter.platform }}</span>
      <span>{{ supporter.amount }}</span>
      <span>{{ supporter.date }}</span>
    </div>
  {% endfor %}
</div>

## Top 10 supporters (all time)

<ol class="contributors-top">
  {% for supporter in site.data.contributors.top %}
    <li>{{ supporter.name }} — {{ supporter.platform }} — {{ supporter.total }}</li>
  {% endfor %}
</ol>

<p class="contributors-note">Contributor data is currently managed in <code>_data/contributors.yml</code>. Update that file whenever you want to refresh the lists.</p>
