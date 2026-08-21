// Site search.
//
// Primary engine is Pagefind, which indexes the built HTML after `jekyll build`
// (see scripts in package.json) and searches the actual body text — so a mod
// name, an error message or an INI setting now returns something. It loads its
// index in fragments, so nothing large is downloaded up front.
//
// Fallback is the build-time assets/data/search-index.json, which only knows
// page titles and h2/h3 headings. It exists so `jekyll serve` on its own still
// has a working search box without anyone having to run Pagefind first.
class SearchSystem {
  constructor() {
    this.pagefind = null;
    this.fallbackData = [];
    this.mode = 'pending';
    this.init();
  }

  async init() {
    this.attachEventListeners();
    await this.loadEngine();
  }

  async loadEngine() {
    try {
      // Held in a variable so no bundler tries to resolve it: the file is
      // generated into _site well after any build step runs.
      const url = '/pagefind/pagefind.js';
      this.pagefind = await import(url);
      await this.pagefind.options({ excerptLength: 25 });
      this.mode = 'pagefind';
      return;
    } catch {
      // Pagefind was not built into this copy of the site — expected during
      // plain `jekyll serve`, so drop to the headings index without noise.
      this.mode = 'fallback';
    }

    try {
      const res = await fetch('/assets/data/search-index.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      this.fallbackData = await res.json();
    } catch (err) {
      console.warn('[SearchSystem] no search index available:', err);
      this.fallbackData = [];
    }
  }

  async search(query) {
    if (!query || query.trim().length < 2) return [];

    if (this.mode === 'pagefind' && this.pagefind) {
      const search = await this.pagefind.search(query);
      const top = await Promise.all(search.results.slice(0, 8).map((r) => r.data()));
      return top.map((d) => ({
        url: d.url,
        title: (d.meta && d.meta.title) || d.url,
        excerpt: d.excerpt || '',
      }));
    }

    return this.searchFallback(query);
  }

  searchFallback(query) {
    const q = query.toLowerCase();
    const results = [];

    for (const item of this.fallbackData) {
      // Front matter is not guaranteed to be a string — `title: 404` parses as
      // a number, and one such entry used to throw and kill the whole loop,
      // taking every result with it.
      const title = String(item.title ?? '');
      const category = String(item.category ?? '');
      const titleHit = title.toLowerCase().includes(q);
      const categoryHit = category.toLowerCase().includes(q);
      const headingHit = (item.headings || [])
        .map((h) => String(h ?? ''))
        .find((h) => h.toLowerCase().includes(q));

      if (titleHit || categoryHit || headingHit) {
        results.push({
          url: item.url,
          title,
          // Rank title matches above section matches
          score: titleHit ? 2 : headingHit ? 1 : 0,
          excerpt: !titleHit && headingHit
            ? `${this.escape(category)} › ${this.escape(headingHit)}`
            : this.escape(category),
        });
      }
    }

    return results.sort((a, b) => b.score - a.score).slice(0, 8);
  }

  attachEventListeners() {
    const searchInput = document.getElementById('global-search-input');
    const searchResults = document.getElementById('search-results');

    // Both halves are required: without the results panel there is nowhere
    // to render, and every handler below would dereference null.
    if (!searchInput || !searchResults) return;

    // ".active" is the class the stylesheet actually shows the panel with.
    const open = () => searchResults.classList.add('active');
    const close = () => searchResults.classList.remove('active');

    let debounceTimer;
    let sequence = 0;

    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      const query = e.target.value;
      debounceTimer = setTimeout(async () => {
        if (query.trim().length < 2) {
          close();
          return;
        }
        // Searches resolve asynchronously, so a slow one must not overwrite
        // the results of a query the visitor typed after it.
        const ticket = ++sequence;
        let results = [];
        try {
          results = await this.search(query);
        } catch (err) {
          console.warn('[SearchSystem] search failed:', err);
        }
        if (ticket !== sequence) return;
        this.displayResults(results, searchResults);
      }, 250);
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-container')) close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });

    searchInput.addEventListener('focus', () => {
      if (searchInput.value.trim().length >= 2) open();
    });
  }

  escape(text) {
    return String(text).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[c]);
  }

  displayResults(results, container) {
    if (results.length === 0) {
      container.innerHTML = '<div class="search-no-results">No results found</div>';
      container.classList.add('active');
      return;
    }

    // Titles are escaped; excerpts are trusted markup — Pagefind builds them
    // from the page's own text and wraps the hits in <mark>.
    container.innerHTML = results.map((result) => `
      <a href="${this.escape(result.url)}" class="search-result-item">
        <div class="search-result-title">${this.escape(result.title)}</div>
        ${result.excerpt ? `<div class="search-result-excerpt">${result.excerpt}</div>` : ''}
      </a>
    `).join('');

    container.classList.add('active');
  }
}

// Initialize on page load
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.SearchSystem = new SearchSystem();
  });
}
