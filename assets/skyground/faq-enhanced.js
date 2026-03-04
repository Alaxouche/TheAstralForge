// Intelligent FAQ System with Suggestions and Voting
class SmartFAQ {
  constructor() {
    this.storageKey = 'faq-votes';
    this.votes = this.loadVotes();
    this.faqData = [];
    this.init();
  }

  init() {
    this.loadFAQData();
    this.setupSearch();
    this.setupVoting();
  }

  loadVotes() {
    const saved = localStorage.getItem(this.storageKey);
    return saved ? JSON.parse(saved) : {};
  }

  saveVotes() {
    localStorage.setItem(this.storageKey,JSON.stringify(this.votes));
  }

  async loadFAQData() {
    // In production, load from YAML or API
    // For now, fetch from data attribute or inline
    try {
      const faqContainer = document.querySelector('[data-faq-source]');
      if (faqContainer) {
        const source = faqContainer.dataset.faqSource;
        const response = await fetch(source);
        this.faqData = await response.json();
      } else {
        // Use inline FAQ data
        this.loadInlineFAQ();
      }
    } catch (error) {
      this.loadInlineFAQ();
    }
  }

  loadInlineFAQ() {
    // Parse existing FAQ from DOM or use default data
    const faqElements = document.querySelectorAll('.faq-item');
    this.faqData = Array.from(faqElements).map((el, index) => {
      const question = el.querySelector('.faq-question')?.textContent || '';
      const answer = el.querySelector('.faq-answer')?.innerHTML || '';
      const category = el.dataset.category || 'general';
      const tags = el.dataset.tags ? el.dataset.tags.split(',') : [];
      
      return {
        id: `faq-${index}`,
        question,
        answer,
        category,
        tags,
        votes: this.votes[`faq-${index}`] || { up: 0, down: 0 }
      };
    });

    // If no FAQs found, use sample data
    if (this.faqData.length === 0) {
      this.faqData = this.getSampleFAQs();
    }
  }

  getSampleFAQs() {
    return [
      {
        id: 'faq-1',
        question: 'How do I install the modlist?',
        answer: 'Use Wabbajack to automatically download and install all mods. See our <a href="#installation">installation guide</a> for detailed steps.',
        category: 'installation',
        tags: ['installation', 'wabbajack', 'getting-started'],
        votes: { up: 42, down: 2 }
      },
      {
        id: 'faq-2',
        question: 'What are the system requirements?',
        answer: 'Minimum: i5-8400, GTX 1060 6GB, 16GB RAM. Recommended: i7-9700K, RTX 3060, 32GB RAM. See <a href="#requirements">full specifications</a>.',
        category: 'technical',
        tags: ['requirements', 'performance', 'hardware'],
        votes: { up: 38, down: 1 }
      },
      {
        id: 'faq-3',
        question: 'Can I add my own mods?',
        answer: 'We do not support adding custom mods as it may break compatibility. However, you can suggest mods in our Discord.',
        category: 'customization',
        tags: ['mods', 'customization', 'support'],
        votes: { up: 15, down: 8 }
      }
    ];
  }

  // Smart Search with Fuzzy Matching
  setupSearch() {
    const searchInput = document.getElementById('faq-search');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      this.searchFAQs(query);
    });
  }

  searchFAQs(query) {
    if (!query) {
      this.renderAllFAQs();
      return;
    }

    // Score each FAQ by relevance
    const scored = this.faqData.map(faq => {
      let score = 0;
      const qLower = faq.question.toLowerCase();
      const aLower = faq.answer.toLowerCase();

      // Exact match in question (highest priority)
      if (qLower.includes(query)) score += 10;

      // Word match in question
      const queryWords = query.split(' ');
      queryWords.forEach(word => {
        if (qLower.includes(word)) score += 5;
        if (aLower.includes(word)) score += 2;
      });

      // Tag match
      faq.tags.forEach(tag => {
        if (tag.toLowerCase().includes(query)) score += 7;
      });

      // Category match
      if (faq.category.toLowerCase().includes(query)) score += 6;

      return { ...faq, score };
    });

    // Filter and sort by score
    const results = scored
      .filter(faq => faq.score > 0)
      .sort((a, b) => b.score - a.score);

    this.renderSearchResults(results, query);
  }

  renderSearchResults(results, query) {
    const container = document.getElementById('faq-container');
    if (!container) return;

    if (results.length === 0) {
      container.innerHTML = `
        <div class="faq-no-results">
          <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <h3>No results found for "${query}"</h3>
          <p>Try different keywords or browse all FAQs below.</p>
          <button class="btn-primary" onclick="window.SmartFAQ.clearSearch()">Show All FAQs</button>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="faq-results-header">
        <p>Found ${results.length} result${results.length !== 1 ? 's' : ''} for "<strong>${query}</strong>"</p>
        <button class="btn-clear" onclick="window.SmartFAQ.clearSearch()">Clear Search</button>
      </div>
      ${results.map(faq => this.renderFAQItem(faq, query)).join('')}
    `;
  }

  renderAllFAQs() {
    const container = document.getElementById('faq-container');
    if (!container) return;

    // Sort by vote score and category
    const sorted = [...this.faqData].sort((a, b) => {
      const scoreA = (a.votes.up - a.votes.down);
      const scoreB = (b.votes.up - b.votes.down);
      return scoreB - scoreA;
    });

    // Group by category
    const categories = {};
    sorted.forEach(faq => {
      if (!categories[faq.category]) {
        categories[faq.category] = [];
      }
      categories[faq.category].push(faq);
    });

    container.innerHTML = Object.entries(categories).map(([category, faqs]) => `
      <div class="faq-category">
        <h3 class="category-title">${this.formatCategoryName(category)}</h3>
        ${faqs.map(faq => this.renderFAQItem(faq)).join('')}
      </div>
    `).join('');
  }

  renderFAQItem(faq, highlightQuery = '') {
    const voteScore = (faq.votes.up - faq.votes.down);
    const userVote = this.votes[faq.id]?.userVote || null;

    let question = faq.question;
    let answer = faq.answer;

    // Highlight search terms
    if (highlightQuery) {
      const regex = new RegExp(`(${highlightQuery})`, 'gi');
      question = question.replace(regex, '<mark>$1</mark>');
    }

    return `
      <details class="faq-item" data-faq-id="${faq.id}">
        <summary class="faq-summary">
          <div class="faq-question-wrapper">
            <span class="faq-question">${question}</span>
            <div class="faq-meta">
              ${faq.tags.slice(0, 3).map(tag => `<span class="faq-tag">#${tag}</span>`).join('')}
            </div>
          </div>
          <div class="faq-votes">
            <span class="vote-score ${voteScore >= 0 ? 'positive' : 'negative'}">${voteScore >= 0 ? '+' : ''}${voteScore}</span>
          </div>
        </summary>
        <div class="faq-content">
          <div class="faq-answer">${answer}</div>
          <div class="faq-actions">
            <button class="btn-vote vote-up ${userVote === 'up' ? 'active' : ''}" 
                    onclick="window.SmartFAQ.vote('${faq.id}', 'up')">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
              </svg>
              Helpful (${faq.votes.up})
            </button>
            <button class="btn-vote vote-down ${userVote === 'down' ? 'active' : ''}" 
                    onclick="window.SmartFAQ.vote('${faq.id}', 'down')">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
              Not Helpful (${faq.votes.down})
            </button>
          </div>
        </div>
      </details>
    `;
  }

  setupVoting() {
    // Voting is handled by inline onclick handlers
  }

  vote(faqId, type) {
    const faq = this.faqData.find(f => f.id === faqId);
    if (!faq) return;

    // Initialize vote record for this FAQ if not exists
    if (!this.votes[faqId]) {
      this.votes[faqId] = { up: faq.votes.up, down: faq.votes.down, userVote: null };
    }

    const currentVote = this.votes[faqId].userVote;

    // Remove previous vote
    if (currentVote === 'up') {
      this.votes[faqId].up--;
      faq.votes.up--;
    } else if (currentVote === 'down') {
      this.votes[faqId].down--;
      faq.votes.down--;
    }

    // Apply new vote (or remove if clicking same button)
    if (currentVote === type) {
      this.votes[faqId].userVote = null;
    } else {
      if (type === 'up') {
        this.votes[faqId].up++;
        faq.votes.up++;
      } else {
        this.votes[faqId].down++;
        faq.votes.down++;
      }
      this.votes[faqId].userVote = type;
    }

    this.saveVotes();
    
    // Re-render the specific FAQ item
    const faqElement = document.querySelector(`[data-faq-id="${faqId}"]`);
    if (faqElement) {
      const wasOpen = faqElement.hasAttribute('open');
      const newElement = document.createElement('div');
      newElement.innerHTML = this.renderFAQItem(faq);
      faqElement.replaceWith(newElement.firstElementChild);
      
      // Restore open state
      if (wasOpen) {
        document.querySelector(`[data-faq-id="${faqId}"]`).setAttribute('open', '');
      }
    }

    // Show toast
    const message = currentVote === type ? 'Vote removed' : 'Thanks for your feedback!';
    this.showToast(message, 'success');
  }

  clearSearch() {
    const searchInput = document.getElementById('faq-search');
    if (searchInput) searchInput.value = '';
    this.renderAllFAQs();
  }

  formatCategoryName(category) {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  showToast(message, type = 'info') {
    if (window.ToastSystem) {
      window.ToastSystem.show(message, type);
    }
  }
}

// Initialize on page load
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.SmartFAQ = new SmartFAQ();
    window.SmartFAQ.renderAllFAQs();
  });
}
