---
layout: skyground_readme
title: Report a Bug
permalink: /report-a-bug/
---

# Report a Bug

Use this form to draft a clear bug report. Copy the preview and post it in the support channel with any logs or screenshots.

<div class="contribution-panel" data-contribution-form>
  <form class="contribution-form">
    <div class="contribution-field">
      <label for="contrib-title">Summary</label>
      <input id="contrib-title" name="contrib-title" type="text" placeholder="Short issue summary">
    </div>
    <div class="contribution-field">
      <label for="contrib-type">Type</label>
      <select id="contrib-type" name="contrib-type">
        <option value="Bug report">Bug report</option>
        <option value="Crash">Crash</option>
        <option value="Install issue">Install issue</option>
        <option value="Load order issue">Load order issue</option>
      </select>
    </div>
    <div class="contribution-field">
      <label for="contrib-project">Project</label>
      <input id="contrib-project" name="contrib-project" type="text" placeholder="Wunduniik, Ghost of the Grid, NMS Explorer...">
    </div>
    <div class="contribution-field">
      <label for="contrib-details">Details</label>
      <textarea id="contrib-details" name="contrib-details" placeholder="Steps to reproduce, what you expected, and what happened."></textarea>
    </div>
    <div class="contribution-field">
      <label for="contrib-links">Links (optional)</label>
      <textarea id="contrib-links" name="contrib-links" placeholder="Paste logs or screenshots, one per line."></textarea>
    </div>
  </form>
  <div class="contribution-preview">
    <div class="contribution-preview__header">
      <h3>Report preview</h3>
      <button class="contribution-copy" type="button" data-contribution-copy>Copy report</button>
    </div>
    <pre class="contribution-preview__body" data-contribution-preview></pre>
  </div>
</div>

<p class="contributors-note">Copy the draft above and paste it in the support channel or a GitHub issue.</p>
