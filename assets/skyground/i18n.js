/**
 * i18n.js — language switcher for The Astral Forge (EN/FR/DE/ES/RU)
 *
 * Handles data-i18n-key (textContent), data-i18n-html (innerHTML),
 * data-i18n-placeholder and data-i18n-aria-label (attributes), plus the
 * bilingual FAQ items. Preference stored in localStorage under 'sg-lang'.
 *
 * The strings themselves are NOT in this file. They live in _data/i18n/*.yml
 * and site.js inlines them here as window.SG_I18N at build time, so Liquid and
 * the browser read the same source and a string is written exactly once.
 * Inlining rather than fetching keeps the first paint translated — a fetch
 * would show a frame of English to every French reader.
 */

(function () {
  'use strict';

  const translations = window.SG_I18N || {};

  /* Language metadata for the switcher dropdown. */
  const LANG_LABELS = {
    en: 'English',
    fr: 'Français',
    de: 'Deutsch',
    es: 'Español',
    ru: 'Русский',
  };

  /* ------------------------------------------------------------------ */
  /* STATE                                                                */
  /* ------------------------------------------------------------------ */

  const STORAGE_KEY = 'sg-lang';
  const SUPPORTED   = ['en', 'fr', 'de', 'es', 'ru'];

  /* ------------------------------------------------------------------ */
  /* SIDEBAR NAV TRANSLATIONS                                            */
  /* Maps English page titles (from Jekyll frontmatter) → French        */
  /* ------------------------------------------------------------------ */

  const SIDEBAR_TRANSLATIONS = {
    'Home':                       'Accueil',
    'Contributors':               'Contributeurs',
    'Frequently Asked Questions': 'Foire Aux Questions',
    'Report a Bug':               'Signaler un Bug',
    'Changelog':                  'Journal des mises à jour',
    'Known Issues':               'Problèmes connus',
    'Load Order':                 'Ordre de chargement',
    'Installation Guide':         "Guide d'installation",
    'System Requirements':        'Prérequis système',
    'System Requirement':         'Prérequis système',
    'Installation':               'Installation',
    'Wabbajack Installation':     'Installation Wabbajack',
    'Post Installation':          'Post-Installation',
    'Pre-Installation':           'Pré-Installation',
    'Using The List':             'Utiliser la liste',
    'Linux Installation Guide':   'Guide Linux',
    'FAQ':                        'FAQ',
  };

  function getStoredLang() {
    try {
      const l = localStorage.getItem(STORAGE_KEY);
      return SUPPORTED.includes(l) ? l : 'en';
    } catch (_) { return 'en'; }
  }

  function setStoredLang(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) {}
  }

  /* ------------------------------------------------------------------ */
  /* FAQ SWITCHING                                                        */
  /* Switch between .faq-item[data-lang="en"] and [data-lang="fr"]       */
  /* ------------------------------------------------------------------ */

  /* ------------------------------------------------------------------ */
  /* SIDEBAR NAV SWITCHING                                               */
  /* Translates .readme-nav page links by their stored English text.    */
  /* ------------------------------------------------------------------ */

  function applyNavLang(lang) {
    document.querySelectorAll('.readme-nav a').forEach(function (link) {
      if (link.getAttribute('href') === '#') return;
      if (link.classList.contains('nav-category-link')) return;
      if (!link.dataset.en) link.dataset.en = link.textContent.trim();
      var en = link.dataset.en;
      link.textContent = (lang === 'fr' && SIDEBAR_TRANSLATIONS[en]) ? SIDEBAR_TRANSLATIONS[en] : en;
    });
  }

  function applyFaqLang(lang) {
    document.querySelectorAll('.faq-item[data-lang]').forEach(function (el) {
      const itemLang = el.getAttribute('data-lang');
      // show matching lang, hide other; close any open accordion
      if (itemLang === lang) {
        el.style.display = '';
      } else {
        el.style.display = 'none';
        el.classList.remove('active');
        const answer = el.querySelector('.faq-answer');
        if (answer) { answer.style.maxHeight = null; answer.style.padding = null; }
        const question = el.querySelector('.faq-question');
        if (question) question.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* APPLY TRANSLATIONS                                                   */
  /* ------------------------------------------------------------------ */

  function applyLang(lang) {
    const base = translations['en'];
    const dict = translations[lang] || base;
    // Fall back to English for any key a language hasn't translated yet,
    // so switching languages never leaves stale text from a previous one.
    const t = function (key) {
      return dict[key] !== undefined ? dict[key] : base[key];
    };

    /* textContent elements */
    document.querySelectorAll('[data-i18n-key]').forEach(function (el) {
      const val = t(el.getAttribute('data-i18n-key'));
      if (val !== undefined) el.textContent = val;
    });

    /* innerHTML elements */
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      const val = t(el.getAttribute('data-i18n-html'));
      if (val !== undefined) el.innerHTML = val;
    });

    /* placeholder attributes */
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      const val = t(el.getAttribute('data-i18n-placeholder'));
      if (val !== undefined) el.setAttribute('placeholder', val);
    });

    /* aria-label attributes — icon-only controls carry their whole accessible
       name here, so leaving it untranslated leaves the control unnamed. */
    document.querySelectorAll('[data-i18n-aria-label]').forEach(function (el) {
      const val = t(el.getAttribute('data-i18n-aria-label'));
      if (val !== undefined) el.setAttribute('aria-label', val);
    });

    /* Theme toggle label — depends on current theme */
    const themeLabel = document.querySelector('.theme-toggle-label');
    if (themeLabel) {
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      const labelKey = isDark ? 'nav.theme_label' : 'nav.theme_label_light';
      if (t(labelKey)) themeLabel.textContent = t(labelKey);
    }

    /* Sidebar nav */
    applyNavLang(lang);

    /* FAQ bilingual items */
    applyFaqLang(lang);

    /* <html lang=""> for screen readers */
    document.documentElement.setAttribute('lang', lang);

    /* Update switcher button to show the CURRENT language code */
    const btnLabel = document.getElementById('lang-toggle-label');
    if (btnLabel) btnLabel.textContent = lang.toUpperCase();

    /* Mark the active option in the dropdown */
    document.querySelectorAll('#lang-menu [data-lang]').forEach(function (opt) {
      opt.setAttribute('aria-selected', opt.dataset.lang === lang ? 'true' : 'false');
    });

    /* Anything rendered by JS rather than by a data-i18n-* attribute — the
       relative dates on the hub, for one — needs a cue to redraw itself. */
    document.dispatchEvent(new CustomEvent('sg:langchange', { detail: { lang: lang } }));
  }

  /* ------------------------------------------------------------------ */
  /* SELECT                                                               */
  /* ------------------------------------------------------------------ */

  function selectLang(lang) {
    if (!SUPPORTED.includes(lang)) return;
    setStoredLang(lang);
    applyLang(lang);
  }

  /* ------------------------------------------------------------------ */
  /* INIT                                                                 */
  /* ------------------------------------------------------------------ */

  function init() {
    applyLang(getStoredLang());

    /* Language dropdown */
    const btn  = document.getElementById('lang-toggle-btn');
    const menu = document.getElementById('lang-menu');

    function closeMenu() {
      if (!menu) return;
      menu.hidden = true;
      if (btn) btn.setAttribute('aria-expanded', 'false');
    }
    function openMenu() {
      if (!menu) return;
      menu.hidden = false;
      if (btn) btn.setAttribute('aria-expanded', 'true');
    }

    if (btn && menu) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        menu.hidden ? openMenu() : closeMenu();
      });
      menu.querySelectorAll('[data-lang]').forEach(function (opt) {
        opt.addEventListener('click', function () {
          selectLang(opt.dataset.lang);
          closeMenu();
        });
      });
      document.addEventListener('click', function (e) {
        if (!menu.hidden && !menu.contains(e.target) && e.target !== btn) closeMenu();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeMenu();
      });
    } else if (btn) {
      // Fallback: no menu in DOM — cycle through supported languages.
      btn.addEventListener('click', function () {
        const i = SUPPORTED.indexOf(getStoredLang());
        selectLang(SUPPORTED[(i + 1) % SUPPORTED.length]);
      });
    }

    /* Re-translate theme label whenever the theme attribute changes */
    new MutationObserver(function () {
      const dict = translations[getStoredLang()] || translations['en'];
      const themeLabel = document.querySelector('.theme-toggle-label');
      if (!themeLabel) return;
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      const key = isDark ? 'nav.theme_label' : 'nav.theme_label_light';
      if (dict[key]) themeLabel.textContent = dict[key];
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
