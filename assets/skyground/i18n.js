/**
 * i18n.js — FR/EN language switcher for The Astral Forge
 * Handles data-i18n-key (textContent), data-i18n-html (innerHTML),
 * data-i18n-placeholder (placeholder attr), and FAQ bilingual switching.
 * Preference stored in localStorage under 'sg-lang'.
 */

(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* TRANSLATIONS                                                         */
  /* ------------------------------------------------------------------ */

  const translations = {
    en: {
      /* ── Navigation ── */
      'nav.home':               'Home',
      'nav.hub':                'Hub',
      'nav.modlists':           'Modlists',
      'nav.overview':           'Overview',
      'nav.install':            'Installation Guide',
      'nav.changelog':          'Changelog',
      'nav.known_issues':       'Known Issues',
      'nav.load_order':         'Load Order',
      'nav.contributors':       'Contributors',
      'nav.faq':                'FAQ',
      'nav.discord':            'Discord',
      'nav.search_placeholder': 'Search…',
      'nav.theme_label':        'Dark',
      'nav.theme_label_light':  'Light',

      /* ── Footer ── */
      'footer.made_by': 'Website By',

      /* ── README / Install pages ── */
      'readme.reading_mode': 'Reading mode',
      'readme.prev':         'Previous',
      'readme.next':         'Next',
      'readme.step':         'Step',
      'readme.of':           'of',
      'readme.vote_question':'Was this page helpful?',
      'readme.vote_yes':     'Yes',
      'readme.vote_no':      'No',

      /* ── FAQ page ── */
      'faq.title':            'Frequently Asked Questions',
      'faq.subtitle':         'Find answers to common questions about our modlists, installation, and troubleshooting.',
      'faq.search_placeholder':'Search FAQs…',
      'faq.cta_title':        'Still Have Questions?',
      'faq.cta_body':         'Join our Discord community for direct support from our team and community members.',
      'faq.cta_btn':          'Join Discord Server',

      /* ── Contributors page ── */
      'contrib.title':        'Contributors',
      'contrib.intro':        'Thank you to everyone who supports The Astral Forge. Your support keeps the modlists updated, tested, and documented.',
      'contrib.btn_patreon':  'Join on Patreon',
      'contrib.btn_kofi':     'Support on Ko-fi',
      'contrib.why_title':    'Why contribute?',
      'contrib.how_title':    'How your support helps development',
      'contrib.how_body':     'Your contributions fund:',
      'contrib.tiers_title':  'Patreon tiers',
      'contrib.recent_title': 'Recent supporters',
      'contrib.col_name':     'Name',
      'contrib.col_platform': 'Platform',
      'contrib.col_amount':   'Amount',
      'contrib.col_date':     'Date',
      'contrib.top_title':    'Top 10 supporters (all time)',
      'contrib.note':         'Contributor data is currently managed in _data/contributors.yml. Update that file whenever you want to refresh the lists.',

      /* ── Homepage — hero ── */
      'home.hero_kicker':      'WELCOME TO',
      'home.hero_title':       'THE ASTRAL FORGE',
      'home.hero_description': 'The Astral Forge is a collective repository of curated modlists and their authors, primarily for <strong>The Elder Scrolls V: Skyrim Special Edition</strong> and <strong>Cyberpunk 2077</strong>.',
      'home.hero_cta_discord': 'Join the Discord',

      /* ── Homepage — about ── */
      'home.about_title': 'About Us',
      'home.about_p1':    'The Astral Forge was established by Alaxouche in September 2020 as the official repository for the Wunduniik modlist. Since then, it has expanded and rebranded, first to Alaxouche\'s Modding Hub and now to The Astral Forge, hosting four main modlists: <strong>Wunduniik</strong>, <strong>Krentoraan</strong>, <strong>Ghost of the Grid</strong>, and <strong>No Man\'s Sky Explorer</strong>. We welcome submissions for additional modlists to increase visibility for authors and strengthen our collective credibility.',
      'home.about_p2':    'This site replaces the former WunduniikWiki.com, offering a modern, responsive design with theme switching, a streamlined interface, and up-to-date, clearly organised information.',

      /* ── Homepage — creator ── */
      'home.creator_title':   'About Modlist Creator',
      'home.creator_tagline': '"There are never enough mods."',
      'home.creator_bio_1':   'Alaxouche is a modder, content creator and community manager primarily focused on Skyrim and Cyberpunk 2077 content. Best known for creating comprehensive modlists that transform the gaming experience.',
      'home.creator_bio_2':   'Founded The Astral Forge in 2020, starting with the Wunduniik modlist and expanding to host multiple curated lists, each crafted to provide unique and immersive gameplay experiences.',

      /* ── Homepage — features ── */
      'home.feature_discord_title':    'Join Our Discord Community',
      'home.feature_discord_body':     'Engage with our community on Alaxouche\'s Modding Hub to receive personalised modding assistance, share screenshots, discuss creative lore, and stay informed on project developments. We host dedicated channels for the <strong>Wunduniik</strong> modlist, including support, bug reporting, and announcements, and conduct regular polls and planning discussions. Join us to collaborate directly with the Wunduniik Team and our broader community.',
      'home.feature_docs_title':       'Getting Started',
      'home.feature_docs_body':        'Our documentation provides comprehensive installation guides, changelogs, load orders, and known-issue reports essential for a seamless mod installation experience. All five modlists — <strong>Wunduniik</strong>, <strong>Krentoraan</strong>, <strong>Ghost of the Grid</strong>, <strong>No Man\'s Sky Explorer</strong>, and <strong>Extrasolar Containment Protocol</strong> — now have full installation guides available.',
      'home.feature_guidelines_title': 'Community Guidelines',
      'home.feature_guidelines_body':  'The Astral Forge is committed to fostering an inclusive and respectful environment. All community members are expected to treat each other with courtesy, provide constructive feedback, and respect the work of modders and list authors.',
      'home.feature_guidelines_link':  'Join our Discord to read the server rules',

      /* ── Homepage — community pulse ── */
      'home.pulse_title':           'Community Pulse',
      'home.pulse_subtitle':        'Stay connected with support, events, and contributor activity in one place.',
      'home.pulse_support_title':   'Discord Live Support',
      'home.pulse_support_body':    'Get quick troubleshooting help, installation advice, and modlist guidance directly from the community.',
      'home.pulse_support_link':    'Join the support server',
      'home.pulse_contrib_title':   'Community Contributions',
      'home.pulse_contrib_body':    'Share screenshots, report issues, and suggest improvements to shape future list updates.',
      'home.pulse_contrib_link':    'Submit feedback',
      'home.pulse_supporters_title':'Supporter Highlights',
      'home.pulse_supporters_body': 'Thank you to everyone helping keep documentation, testing, and maintenance moving forward.',
      'home.pulse_supporters_link': 'See supporters',
      'home.pulse_recent':          'Recent Supporters',

      /* ── Homepage — gallery ── */
      'home.gallery_highlights_title':  'Gallery Highlights',
      'home.community_gallery_title':   'Community Gallery',
      'home.community_gallery_subtitle':'Explore screenshots and creations from our community members',
      'home.gallery_filter_all':        'All',
    },

    fr: {
      /* ── Navigation ── */
      'nav.home':               'Accueil',
      'nav.hub':                'Hub',
      'nav.modlists':           'Modlistes',
      'nav.overview':           'Présentation',
      'nav.install':            'Guide d\'installation',
      'nav.changelog':          'Journal des mises à jour',
      'nav.known_issues':       'Problèmes connus',
      'nav.load_order':         'Ordre de chargement',
      'nav.contributors':       'Contributeurs',
      'nav.faq':                'FAQ',
      'nav.discord':            'Discord',
      'nav.search_placeholder': 'Rechercher…',
      'nav.theme_label':        'Sombre',
      'nav.theme_label_light':  'Clair',

      /* ── Footer ── */
      'footer.made_by': 'Site par',

      /* ── README / Install pages ── */
      'readme.reading_mode': 'Mode lecture',
      'readme.prev':         'Précédent',
      'readme.next':         'Suivant',
      'readme.step':         'Étape',
      'readme.of':           'sur',
      'readme.vote_question':'Cette page vous a-t-elle été utile ?',
      'readme.vote_yes':     'Oui',
      'readme.vote_no':      'Non',

      /* ── FAQ page ── */
      'faq.title':            'Foire Aux Questions',
      'faq.subtitle':         'Trouvez des réponses aux questions fréquentes sur nos modlistes, l\'installation et le dépannage.',
      'faq.search_placeholder':'Rechercher dans la FAQ…',
      'faq.cta_title':        'Encore des questions ?',
      'faq.cta_body':         'Rejoignez notre communauté Discord pour un support direct de notre équipe et des membres de la communauté.',
      'faq.cta_btn':          'Rejoindre le serveur Discord',

      /* ── Contributors page ── */
      'contrib.title':        'Contributeurs',
      'contrib.intro':        'Merci à tous ceux qui soutiennent The Astral Forge. Votre soutien permet de maintenir les modlistes à jour, testées et documentées.',
      'contrib.btn_patreon':  'Rejoindre sur Patreon',
      'contrib.btn_kofi':     'Soutenir sur Ko-fi',
      'contrib.why_title':    'Pourquoi contribuer ?',
      'contrib.how_title':    'Comment votre soutien aide le développement',
      'contrib.how_body':     'Vos contributions financent :',
      'contrib.tiers_title':  'Niveaux Patreon',
      'contrib.recent_title': 'Soutiens récents',
      'contrib.col_name':     'Nom',
      'contrib.col_platform': 'Plateforme',
      'contrib.col_amount':   'Montant',
      'contrib.col_date':     'Date',
      'contrib.top_title':    'Top 10 soutiens (depuis toujours)',
      'contrib.note':         'Les données des contributeurs sont gérées dans _data/contributors.yml. Mettez à jour ce fichier pour actualiser les listes.',

      /* ── Homepage — hero ── */
      'home.hero_kicker':      'BIENVENUE SUR',
      'home.hero_title':       'THE ASTRAL FORGE',
      'home.hero_description': 'The Astral Forge est un dépôt collectif de modlistes et de leurs auteurs, principalement pour <strong>The Elder Scrolls V: Skyrim Special Edition</strong> et <strong>Cyberpunk 2077</strong>.',
      'home.hero_cta_discord': 'Rejoindre le Discord',

      /* ── Homepage — about ── */
      'home.about_title': 'À Propos',
      'home.about_p1':    'The Astral Forge a été fondée par Alaxouche en septembre 2020 en tant que dépôt officiel de la modliste Wunduniik. Depuis, elle s\'est agrandie et a changé de nom — d\'abord en Alaxouche\'s Modding Hub, puis en The Astral Forge — et héberge désormais quatre modlistes principales : <strong>Wunduniik</strong>, <strong>Krentoraan</strong>, <strong>Ghost of the Grid</strong> et <strong>No Man\'s Sky Explorer</strong>. Nous acceptons les soumissions de nouvelles modlistes pour accroître la visibilité des auteurs et renforcer notre crédibilité collective.',
      'home.about_p2':    'Ce site remplace l\'ancien WunduniikWiki.com, offrant un design moderne et adaptatif avec basculement de thème, une interface épurée et des informations à jour clairement organisées.',

      /* ── Homepage — creator ── */
      'home.creator_title':   'À Propos du Créateur',
      'home.creator_tagline': '« Il n\'y aura jamais assez de mods. »',
      'home.creator_bio_1':   'Alaxouche est un moddeur, créateur de contenu et gestionnaire de communauté principalement axé sur le contenu Skyrim et Cyberpunk 2077. Il est surtout connu pour ses modlistes complètes qui transforment l\'expérience de jeu.',
      'home.creator_bio_2':   'Il a fondé The Astral Forge en 2020 en commençant par la modliste Wunduniik, puis en développant l\'hébergement de multiples listes sélectionnées, chacune conçue pour offrir une expérience de jeu unique et immersive.',

      /* ── Homepage — features ── */
      'home.feature_discord_title':    'Rejoignez Notre Communauté Discord',
      'home.feature_discord_body':     'Échangez avec notre communauté sur l\'Alaxouche\'s Modding Hub pour recevoir une aide personnalisée au modding, partager des captures d\'écran, discuter du lore créatif et rester informé des développements des projets. Nous proposons des canaux dédiés à la modliste <strong>Wunduniik</strong>, notamment pour le support, le signalement de bugs et les annonces, ainsi que des sondages et discussions réguliers. Rejoignez-nous pour collaborer directement avec l\'équipe Wunduniik et notre communauté au sens large.',
      'home.feature_docs_title':       'Bien Débuter',
      'home.feature_docs_body':        'Notre documentation fournit des guides d\'installation complets, des journaux de mises à jour, des ordres de chargement et des rapports de problèmes connus, essentiels pour une installation fluide. Les cinq modlistes — <strong>Wunduniik</strong>, <strong>Krentoraan</strong>, <strong>Ghost of the Grid</strong>, <strong>No Man\'s Sky Explorer</strong> et <strong>Extrasolar Containment Protocol</strong> — disposent désormais de guides d\'installation complets.',
      'home.feature_guidelines_title': 'Règles de la Communauté',
      'home.feature_guidelines_body':  'The Astral Forge s\'engage à favoriser un environnement inclusif et respectueux. Tous les membres de la communauté sont invités à se traiter avec courtoisie, à fournir des retours constructifs et à respecter le travail des moddeurs et auteurs de listes.',
      'home.feature_guidelines_link':  'Rejoignez notre Discord pour lire les règles du serveur',

      /* ── Homepage — community pulse ── */
      'home.pulse_title':           'Pouls de la Communauté',
      'home.pulse_subtitle':        'Restez connecté avec le support, les événements et l\'activité des contributeurs, en un seul endroit.',
      'home.pulse_support_title':   'Support Discord en Direct',
      'home.pulse_support_body':    'Obtenez rapidement de l\'aide pour le dépannage, des conseils d\'installation et des orientations directement depuis la communauté.',
      'home.pulse_support_link':    'Rejoindre le serveur de support',
      'home.pulse_contrib_title':   'Contributions Communautaires',
      'home.pulse_contrib_body':    'Partagez des captures d\'écran, signalez des problèmes et proposez des améliorations pour façonner les futures mises à jour.',
      'home.pulse_contrib_link':    'Soumettre un retour',
      'home.pulse_supporters_title':'Mise en Avant des Soutiens',
      'home.pulse_supporters_body': 'Merci à tous ceux qui maintiennent la documentation, les tests et la maintenance en mouvement.',
      'home.pulse_supporters_link': 'Voir les soutiens',
      'home.pulse_recent':          'Soutiens Récents',

      /* ── Homepage — gallery ── */
      'home.gallery_highlights_title':  'Points Forts de la Galerie',
      'home.community_gallery_title':   'Galerie Communautaire',
      'home.community_gallery_subtitle':'Explorez les captures d\'écran et créations de nos membres',
      'home.gallery_filter_all':        'Tout',
    }
  };

  /* ------------------------------------------------------------------ */
  /* STATE                                                                */
  /* ------------------------------------------------------------------ */

  const STORAGE_KEY = 'sg-lang';
  const SUPPORTED   = ['en', 'fr'];

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
    const dict = translations[lang] || translations['en'];

    /* textContent elements */
    document.querySelectorAll('[data-i18n-key]').forEach(function (el) {
      const key = el.getAttribute('data-i18n-key');
      if (dict[key] !== undefined) el.textContent = dict[key];
    });

    /* innerHTML elements */
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      const key = el.getAttribute('data-i18n-html');
      if (dict[key] !== undefined) el.innerHTML = dict[key];
    });

    /* placeholder attributes */
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key] !== undefined) el.setAttribute('placeholder', dict[key]);
    });

    /* Theme toggle label — depends on current theme */
    const themeLabel = document.querySelector('.theme-toggle-label');
    if (themeLabel) {
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      const labelKey = isDark ? 'nav.theme_label' : 'nav.theme_label_light';
      if (dict[labelKey]) themeLabel.textContent = dict[labelKey];
    }

    /* Sidebar nav */
    applyNavLang(lang);

    /* FAQ bilingual items */
    applyFaqLang(lang);

    /* <html lang=""> for screen readers */
    document.documentElement.setAttribute('lang', lang);

    /* Update button label (shows the OTHER language — what clicking will switch TO) */
    const btnLabel = document.getElementById('lang-toggle-label');
    if (btnLabel) btnLabel.textContent = lang === 'fr' ? 'EN' : 'FR';

    /* Update button aria-label */
    const toggleBtn = document.getElementById('lang-toggle-btn');
    if (toggleBtn) {
      toggleBtn.setAttribute(
        'aria-label',
        lang === 'fr' ? 'Switch to English' : 'Passer en français'
      );
    }
  }

  /* ------------------------------------------------------------------ */
  /* TOGGLE                                                               */
  /* ------------------------------------------------------------------ */

  function toggleLang() {
    const next = getStoredLang() === 'fr' ? 'en' : 'fr';
    setStoredLang(next);
    applyLang(next);
  }

  /* ------------------------------------------------------------------ */
  /* INIT                                                                 */
  /* ------------------------------------------------------------------ */

  function init() {
    applyLang(getStoredLang());

    /* Toggle button */
    const btn = document.getElementById('lang-toggle-btn');
    if (btn) btn.addEventListener('click', toggleLang);

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
