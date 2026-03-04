// Advanced Search System
class SearchSystem {
  constructor() {
    this.searchData = [];
    this.init();
  }

  async init() {
    await this.loadSearchIndex();
    this.attachEventListeners();
  }

  async loadSearchIndex() {
    // Build search index from page content
    const pages = [
      // Modlists
      { title: 'Wunduniik', url: '/wunduniik/', category: 'Skyrim SE Modlist', tags: ['skyrim', 'visual', 'gameplay', 'wabbajack'] },
      { title: 'Ghost of the Grid', url: '/ghost-of-the-grid/', category: 'Cyberpunk 2077 Modlist', tags: ['cyberpunk', 'neon', 'atmosphere', '2077'] },
      { title: 'Krentoraan', url: '/krentoraan/', category: 'Skyrim SE Modlist', tags: ['skyrim', 'balanced', 'clean'] },
      { title: 'No Man\'s Sky Explorer', url: '/no-mans-sky-explorer/', category: 'No Man\'s Sky Modlist', tags: ['exploration', 'space', 'nms'] },
      
      // Installation Guides
      { title: 'Wunduniik Installation Guide', url: '/wunduniik/installation-guide/', category: 'Installation Guide', tags: ['installation', 'wabbajack', 'setup', 'guide'] },
      { title: 'Ghost Installation Guide', url: '/ghost-of-the-grid/installation-guide/', category: 'Installation Guide', tags: ['installation', 'wabbajack', 'cyberpunk', 'guide'] },
      { title: 'Krentoraan Installation', url: '/krentoraan/k_installation-guide/', category: 'Installation Guide', tags: ['installation', 'setup', 'guide'] },
      { title: 'NMS Explorer Installation', url: '/no-mans-sky-explorer/installation-guide/', category: 'Installation Guide', tags: ['installation', 'nms', 'guide'] },
      
      // Wabbajack Pages
      { title: 'Wunduniik Wabbajack Setup', url: '/wunduniik/installation-guide/wabbajack-installation/', category: 'Wabbajack Guide', tags: ['wabbajack', 'download', 'install'] },
      { title: 'Ghost Wabbajack Setup', url: '/ghost-of-the-grid/installation-guide/g_wabbajack-installation/', category: 'Wabbajack Guide', tags: ['wabbajack', 'cyberpunk'] },
      { title: 'NMS Wabbajack Setup', url: '/no-mans-sky-explorer/installation-guide/n_wabbajack-installation/', category: 'Wabbajack Guide', tags: ['wabbajack', 'nms'] },
      
      // System Requirements
      { title: 'Wunduniik Requirements', url: '/wunduniik/installation-guide/g_system-requirements/', category: 'System Requirements', tags: ['requirements', 'specs', 'hardware'] },
      { title: 'Ghost Requirements', url: '/ghost-of-the-grid/installation-guide/g_system-requirements/', category: 'System Requirements', tags: ['requirements', 'specs', 'hardware'] },
      
      // Changelogs
      { title: 'Wunduniik Changelog', url: '/wunduniik/changelog/', category: 'Changelog', tags: ['changelog', 'updates', 'version', 'history'] },
      { title: 'Ghost Changelog', url: '/ghost-of-the-grid/changelog/', category: 'Changelog', tags: ['changelog', 'updates', 'version'] },
      { title: 'NMS Changelog', url: '/no-mans-sky-explorer/changelog/', category: 'Changelog', tags: ['changelog', 'updates', 'version'] },
      
      // Load Orders
      { title: 'Wunduniik Load Order', url: '/wunduniik/loadorder/', category: 'Load Order', tags: ['load order', 'mods', 'plugins', 'esp'] },
      { title: 'Ghost Load Order', url: '/ghost-of-the-grid/loadorder/', category: 'Load Order', tags: ['load order', 'mods', 'plugins'] },
      { title: 'Krentoraan Load Order', url: '/krentoraan/loadorder/', category: 'Load Order', tags: ['load order', 'mods', 'plugins'] },
      { title: 'NMS Load Order', url: '/no-mans-sky-explorer/loadorder/', category: 'Load Order', tags: ['load order', 'mods'] },
      
      // Known Issues
      { title: 'Wunduniik Known Issues', url: '/wunduniik/known-issues/', category: 'Troubleshooting', tags: ['bugs', 'issues', 'problems', 'fixes'] },
      { title: 'Ghost Known Issues', url: '/ghost-of-the-grid/known-issues/', category: 'Troubleshooting', tags: ['bugs', 'issues', 'problems'] },
      
      // Community Pages
      { title: 'Modlist Hub', url: '/hub/', category: 'Navigation', tags: ['hub', 'modlists', 'overview', 'home'] },
      { title: 'Contributors', url: '/contributors/', category: 'Community', tags: ['team', 'credits', 'authors', 'contributors'] },
      { title: 'FAQ - Help & Support', url: '/faq/', category: 'Support', tags: ['faq', 'questions', 'help', 'answers', 'support'] },
      { title: 'Report a Bug', url: '/report-a-bug/', category: 'Support', tags: ['bug', 'report', 'issue', 'problem'] }
    ];
    
    this.searchData = pages;
  }

  search(query) {
    if (!query || query.length < 2) return [];
    
    const lowerQuery = query.toLowerCase();
    return this.searchData.filter(item => {
      return item.title.toLowerCase().includes(lowerQuery) ||
             item.category.toLowerCase().includes(lowerQuery) ||
             item.tags.some(tag => tag.includes(lowerQuery));
    }).slice(0, 8);
  }

  attachEventListeners() {
    const searchInput = document.getElementById('global-search-input');
    const searchResults = document.getElementById('search-results');
    
    if (!searchInput) return;
    
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const query = e.target.value;
        const results = this.search(query);
        this.displayResults(results, searchResults);
      }, 300);
    });
    
    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-container')) {
        searchResults.classList.remove('show');
      }
    });
    
    searchInput.addEventListener('focus', () => {
      if (searchInput.value.length >= 2) {
        searchResults.classList.add('show');
      }
    });
  }

  displayResults(results, container) {
    if (results.length === 0) {
      container.innerHTML = '<div class="search-no-results">No results found</div>';
      container.classList.add('show');
      return;
    }
    
    container.innerHTML = results.map(result => `
      <a href="${result.url}" class="search-result-item">
        <div class="search-result-title">${this.highlightMatch(result.title, container.closest('.search-container').querySelector('input').value)}</div>
        <div class="search-result-category">${result.category}</div>
      </a>
    `).join('');
    
    container.classList.add('show');
  }

  highlightMatch(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }
}

// Initialize on page load
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.SearchSystem = new SearchSystem();
  });
}
