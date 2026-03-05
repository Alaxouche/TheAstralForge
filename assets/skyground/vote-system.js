/**
 * vote-system.js
 * Persistent "Was this helpful?" counters — stored in localStorage.
 * Supports both page-level votes (.vote-btn) and FAQ item votes (.faq-vote).
 *
 * Data shape in localStorage (key: "af_votes"):
 * {
 *   "page:/wunduniik/": { helpful: 3, "not-helpful": 1, userVote: "helpful" },
 *   "faq:install-q1":   { helpful: 2, unhelpful: 0, userVote: null }
 * }
 */
(() => {
  const STORAGE_KEY = 'af_votes';

  /* ── Storage helpers ─────────────────────────────────────── */

  function load() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch { return {}; }
  }

  function save(data) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
    catch {}
  }

  /* ── Page-level vote section (".vote-btn") ───────────────── */

  function initPageVotes() {
    const buttons = document.querySelectorAll('.vote-btn[data-vote]');
    if (!buttons.length) return;

    const pageId = 'page:' + window.location.pathname;

    function renderButtons() {
      const data = load();
      const entry = data[pageId] || { helpful: 0, 'not-helpful': 0, userVote: null };
      buttons.forEach(btn => {
        const type = btn.dataset.vote;
        const countEl = btn.querySelector('.vote-count');
        if (countEl) countEl.textContent = entry[type] || 0;
        btn.classList.toggle('vote-btn--active', entry.userVote === type);
        btn.setAttribute('aria-pressed', String(entry.userVote === type));
      });
    }

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const type   = btn.dataset.vote;
        const data   = load();
        const entry  = data[pageId] || { helpful: 0, 'not-helpful': 0, userVote: null };
        const prev   = entry.userVote;

        // Undo previous vote if any
        if (prev !== null) {
          entry[prev] = Math.max(0, (entry[prev] || 0) - 1);
        }

        if (prev === type) {
          // Toggle off — user un-votes
          entry.userVote = null;
        } else {
          // Cast new vote
          entry[type] = (entry[type] || 0) + 1;
          entry.userVote = type;
        }

        data[pageId] = entry;
        save(data);
        renderButtons();
      });
    });

    renderButtons();
  }

  /* ── FAQ item votes (".faq-vote") ────────────────────────── */

  function initFaqVotes() {
    const items = document.querySelectorAll('[data-faq-item][data-faq-id]');
    if (!items.length) return;

    function renderItem(item, faqId) {
      const data  = load();
      const key   = 'faq:' + faqId;
      const entry = data[key] || { helpful: 0, unhelpful: 0, userVote: null };

      item.querySelectorAll('.faq-vote[data-faq-vote]').forEach(btn => {
        const type    = btn.dataset.faqVote;
        const countEl = btn.querySelector('.faq-vote-count');
        if (countEl) countEl.textContent = entry[type] || 0;
        btn.classList.toggle('faq-vote--active', entry.userVote === type);
        btn.setAttribute('aria-pressed', String(entry.userVote === type));
      });
    }

    items.forEach(item => {
      const faqId = item.dataset.faqId;
      const key   = 'faq:' + faqId;

      renderItem(item, faqId);

      item.querySelectorAll('.faq-vote[data-faq-vote]').forEach(btn => {
        btn.addEventListener('click', () => {
          const type  = btn.dataset.faqVote;
          const data  = load();
          const entry = data[key] || { helpful: 0, unhelpful: 0, userVote: null };
          const prev  = entry.userVote;

          if (prev !== null) {
            entry[prev] = Math.max(0, (entry[prev] || 0) - 1);
          }

          if (prev === type) {
            entry.userVote = null;
          } else {
            entry[type] = (entry[type] || 0) + 1;
            entry.userVote = type;
          }

          data[key] = entry;
          save(data);
          renderItem(item, faqId);
        });
      });
    });
  }

  /* ── Init ────────────────────────────────────────────────── */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initPageVotes();
      initFaqVotes();
    });
  } else {
    initPageVotes();
    initFaqVotes();
  }
})();
