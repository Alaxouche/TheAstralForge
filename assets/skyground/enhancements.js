// Enhanced Features System
class EnhancedFeatures {
  constructor() {
    this.init();
  }

  init() {
    this.initReadingProgress();
    this.initCopyLinks();
    this.initKeyboardShortcuts();
    this.initToastSystem();
    this.enhanceHeadings();
  }

  // Reading Progress Bar
  initReadingProgress() {
    if (!document.querySelector('.readme-content, article')) return;

    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.innerHTML = '<div class="reading-progress-bar"></div>';
    document.body.appendChild(progressBar);

    const bar = progressBar.querySelector('.reading-progress-bar');
    
    const updateProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / documentHeight) * 100;
      bar.style.width = `${Math.min(progress, 100)}%`;
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  // Copy Link to Section
  initCopyLinks() {
    document.querySelectorAll('h1[id], h2[id], h3[id], h4[id]').forEach(heading => {
      if (!heading.id) return;

      heading.classList.add('heading-anchor');
      
      const button = document.createElement('button');
      button.className = 'copy-link-btn';
      button.setAttribute('aria-label', 'Copy link to section');
      button.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
        </svg>
      `;

      button.addEventListener('click', async () => {
        const url = `${window.location.origin}${window.location.pathname}#${heading.id}`;
        
        try {
          await navigator.clipboard.writeText(url);
          button.classList.add('copied');
          button.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          `;
          
          this.showToast('Link copied to clipboard!', 'success');
          
          setTimeout(() => {
            button.classList.remove('copied');
            button.innerHTML = `
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
            `;
          }, 2000);
        } catch (err) {
          this.showToast('Failed to copy link', 'error');
        }
      });

      heading.insertBefore(button, heading.firstChild);
    });
  }

  // Keyboard Shortcuts
  initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Cmd/Ctrl + K for search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('global-search-input');
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }

      // ESC to close search/modals
      if (e.key === 'Escape') {
        const searchResults = document.getElementById('search-results');
        if (searchResults) {
          searchResults.style.display = 'none';
        }
      }

      // / for quick search
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        e.preventDefault();
        const searchInput = document.getElementById('global-search-input');
        if (searchInput) searchInput.focus();
      }
    });
  }

  // Toast Notification System
  initToastSystem() {
    if (!document.querySelector('.toast-container')) {
      const container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
  }

  showToast(message, type = 'info', duration = 3000) {
    const container = document.querySelector('.toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    
    const icons = {
      success: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>',
      error: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>',
      info: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
    };

    toast.innerHTML = `
      <div class="toast-icon">${icons[type]}</div>
      <div class="toast-message">${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('removing');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // Enhance Headings with Smooth Scroll
  enhanceHeadings() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.pushState(null, null, href);
        }
      });
    });
  }
}

// Loading Overlay Utility
class LoadingOverlay {
  constructor() {
    this.overlay = null;
    this.create();
  }

  create() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'loading-overlay';
    this.overlay.innerHTML = '<div class="loading-spinner"></div>';
    document.body.appendChild(this.overlay);
  }

  show() {
    this.overlay.classList.add('active');
  }

  hide() {
    this.overlay.classList.remove('active');
  }
}

// Initialize on page load
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.EnhancedFeatures = new EnhancedFeatures();
    window.LoadingOverlay = new LoadingOverlay();
    
    // Show keyboard shortcut hint
    const searchInput = document.getElementById('global-search-input');
    if (searchInput && !searchInput.placeholder.includes('Cmd+K')) {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const shortcut = isMac ? '⌘K' : 'Ctrl+K';
      searchInput.placeholder = `Search... (${shortcut})`;
    }
  });
}
