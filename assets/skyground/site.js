---
# Global JS bundle — concatenated by Jekyll at build time so every page
# loads one script instead of nine. Conditional scripts (stats, loadorder,
# gallery, discord widget…) stay separate. Keep the order identical to the
# old <script> order in _layouts/skyground_base.html.
# layout: null is required — the site-wide default layout would otherwise
# wrap this file in HTML.
layout: null
---
{% include_relative lightbox.js %}
;
{% include_relative carousel.js %}
;
{% include_relative header.js %}
;
{% include_relative nav.js %}
;
{% include_relative theme-toggle.js %}
;
{% comment %}
  UI strings come from _data/i18n/*.yml and are inlined here rather than
  fetched, so the very first paint is already in the reader's language.
  Liquid reads the same files, so there is one source, not one per system.
{% endcomment %}
window.SG_I18N = {{ site.data.i18n | jsonify }};
;
{% include_relative i18n.js %}
;
{% include_relative performance.js %}
;
{% include_relative features.js %}
;
{% include_relative enhancements.js %}
;
{% include_relative search-system.js %}
;
{% include_relative faq-accordion.js %}
;
{% include_relative relative-time.js %}
