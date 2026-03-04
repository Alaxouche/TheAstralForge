// Stats System — fetches live data from modlist.json
const MODLIST_JSON_URL = 'https://raw.githubusercontent.com/Alaxouche/Wunduniik/main/modlist.json';

// Maps page modlist_id → "title" field in modlist.json
const MODLIST_TITLE_MAP = {
  'wunduniik':            'Wunduniik',
  'krentoraan':           'Krentoraan',
  'ghost-of-the-grid':    'Ghost of the Grid',
  'no-mans-sky-explorer': "No Man's Sky - Explorer"
};

class StatsSystem {
  constructor() {
    this.init();
  }

  async init() {
    const elements = document.querySelectorAll('[data-stats-modlist]');
    if (!elements.length) return;

    try {
      const response = await fetch(MODLIST_JSON_URL);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      this.render(elements, data);
    } catch (err) {
      console.warn('[StatsSystem] Could not load modlist data:', err);
    }
  }

  render(elements, data) {
    elements.forEach(el => {
      const modlistId = el.dataset.statsModlist;
      const title = MODLIST_TITLE_MAP[modlistId];
      if (!title) return;

      const entry = data.find(item => item.title === title);
      if (!entry) return;

      const version     = entry.version || '—';
      const mods        = entry.download_metadata?.NumberOfArchives ?? '—';
      const totalBytes  = entry.download_metadata?.TotalSize;
      const size        = totalBytes != null ? this.formatBytes(totalBytes) : '—';
      const dateUpdated = entry.dateUpdated ? this.formatDate(entry.dateUpdated) : '—';

      el.innerHTML = `
        <div class="project-stat">
          <span class="project-stat__value">${version}</span>
          <span class="project-stat__label">Version</span>
        </div>
        <div class="project-stat">
          <span class="project-stat__value">${typeof mods === 'number' ? mods.toLocaleString() : mods}</span>
          <span class="project-stat__label">Mods</span>
        </div>
        <div class="project-stat">
          <span class="project-stat__value">${size}</span>
          <span class="project-stat__label">Total Size</span>
        </div>
        <div class="project-stat">
          <span class="project-stat__value">${dateUpdated}</span>
          <span class="project-stat__label">Last Update</span>
        </div>
      `;
    });
  }

  formatBytes(bytes) {
    const gb = bytes / (1024 ** 3);
    if (gb >= 1) return `${gb.toFixed(1)} GB`;
    const mb = bytes / (1024 ** 2);
    return `${mb.toFixed(0)} MB`;
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const now  = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7)  return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}

// Initialize on page load
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.StatsSystem = new StatsSystem();
  });
}
