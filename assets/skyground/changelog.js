/**
 * changelog.js
 * Filter and bulk expand/collapse for changelog pages.
 *
 * A changelog runs to two dozen <details> blocks and several thousand mod
 * names, which is fine to publish and miserable to search by eye. This adds a
 * filter that matches version numbers and mod names alike, opening the entries
 * that contain a hit so the match is actually visible.
 *
 * It attaches itself only when the page really is a changelog — a run of
 * <details> whose summaries carry version numbers — so it can be loaded
 * alongside the other readme scripts without a layout flag.
 */
(() => {
  const VERSION_RE = /v?\d+\.\d+[\w.]*/i;

  const init = () => {
    const content = document.querySelector('.readme-content');
    if (!content) return;

    const entries = Array.from(content.querySelectorAll('details')).filter((d) => {
      const summary = d.querySelector('summary');
      return summary && VERSION_RE.test(summary.textContent || '');
    });
    if (entries.length < 3) return;

    const t = (key, fallback) => {
      const dict = (window.SG_I18N || {});
      let lang = 'en';
      try { lang = localStorage.getItem('sg-lang') || 'en'; } catch (_) { /* default */ }
      const table = dict[lang] || dict.en || {};
      const base = dict.en || {};
      return table[key] || base[key] || fallback;
    };

    /* ── Controls ─────────────────────────────────────────────────── */

    const bar = document.createElement('div');
    bar.className = 'changelog-tools';
    bar.innerHTML = `
      <label class="changelog-tools__search">
        <span class="visually-hidden" data-i18n-key="changelog.filter_label">Filter changelog</span>
        <input type="search" class="changelog-tools__input"
               data-i18n-placeholder="changelog.filter"
               placeholder="Filter by version or mod name…">
      </label>
      <div class="changelog-tools__actions">
        <button type="button" class="changelog-tools__btn" data-cl-expand data-i18n-key="changelog.expand">Expand all</button>
        <button type="button" class="changelog-tools__btn" data-cl-collapse data-i18n-key="changelog.collapse">Collapse all</button>
      </div>
      <p class="changelog-tools__count" role="status" aria-live="polite"></p>
    `;

    const first = entries[0];
    first.parentNode.insertBefore(bar, first);

    const input = bar.querySelector('.changelog-tools__input');
    const count = bar.querySelector('.changelog-tools__count');

    // Cache the haystacks once: re-reading textContent of a 200KB page on
    // every keystroke is what makes this kind of filter feel sluggish.
    const haystacks = entries.map((d) => (d.textContent || '').toLowerCase());
    const summaries = entries.map((d) => {
      const s = d.querySelector('summary');
      return (s ? s.textContent : '').toLowerCase();
    });

    const setCount = (shown) => {
      if (!input.value.trim()) {
        count.textContent = '';
        return;
      }
      const label = shown === 1
        ? t('changelog.count_one', '1 entry')
        : t('changelog.count_many', '{n} entries').replace('{n}', shown);
      count.textContent = label;
    };

    const apply = () => {
      const q = input.value.trim().toLowerCase();
      let shown = 0;

      entries.forEach((entry, i) => {
        if (!q) {
          entry.hidden = false;
          entry.open = false;
          shown += 1;
          return;
        }
        const hit = haystacks[i].includes(q);
        entry.hidden = !hit;
        // Open on a body match so the reader can see what matched; a version
        // match alone leaves the entry closed, which is the useful shape when
        // someone types "7.3" to find one release.
        if (hit) {
          shown += 1;
          entry.open = !summaries[i].includes(q);
        }
      });

      setCount(shown);
    };

    let debounce;
    input.addEventListener('input', () => {
      clearTimeout(debounce);
      debounce = setTimeout(apply, 120);
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        input.value = '';
        apply();
      }
    });

    bar.querySelector('[data-cl-expand]').addEventListener('click', () => {
      entries.forEach((d) => { if (!d.hidden) d.open = true; });
    });

    bar.querySelector('[data-cl-collapse]').addEventListener('click', () => {
      entries.forEach((d) => { d.open = false; });
    });

    document.addEventListener('sg:langchange', () => setCount(
      entries.filter((d) => !d.hidden).length
    ));
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
