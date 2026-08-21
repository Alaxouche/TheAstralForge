// FAQ Accordion System
class FAQAccordion {
  constructor() {
    this.init();
  }

  init() {
    this.attachEventListeners();
    this.initializeFromHash();
  }

  attachEventListeners() {
    // Skip FAQ blocks inside [data-faq] — those are wired up by features.js
    document.querySelectorAll('.faq-question').forEach(question => {
      if (question.closest('[data-faq]')) return;
      question.addEventListener('click', (e) => {
        const item = e.target.closest('.faq-item');
        if (item) this.toggle(item);
      });
    });

    // Search in FAQ
    const searchInput = document.getElementById('faq-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.filterFAQ(e.target.value);
      });
    }
  }

  toggle(item) {
    const isOpen = item.classList.contains('active');
    
    // Close all others (optional - remove for multi-open)
    document.querySelectorAll('.faq-item.active').forEach(openItem => {
      if (openItem !== item) {
        openItem.classList.remove('active');
      }
    });

    item.classList.toggle('active', !isOpen);

    // Keep the URL shareable, but with replaceState: assigning
    // window.location.hash would yank the page to the anchor and add a
    // history entry for every open/close.
    if (!isOpen) {
      const question = item.querySelector('.faq-question');
      const id = item.id ||
        (question ? question.textContent.trim().toLowerCase().replace(/\s+/g, '-') : '');
      if (id) history.replaceState(null, '', '#' + id);
    } else {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }

  filterFAQ(query) {
    const lowerQuery = query.toLowerCase();
    document.querySelectorAll('.faq-item').forEach(item => {
      const questionEl = item.querySelector('.faq-question');
      const answerEl = item.querySelector('.faq-answer');
      const question = questionEl ? questionEl.textContent.toLowerCase() : '';
      const answer = answerEl ? answerEl.textContent.toLowerCase() : '';

      if (question.includes(lowerQuery) || answer.includes(lowerQuery)) {
        item.style.display = '';
        if (query.length >= 3) {
          item.classList.add('active');
        }
      } else {
        item.style.display = 'none';
      }
    });
  }

  initializeFromHash() {
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const item = document.getElementById(id) ||
                   Array.from(document.querySelectorAll('.faq-item')).find(el => {
                     const q = el.querySelector('.faq-question');
                     return q && q.textContent.trim().toLowerCase().replace(/\s+/g, '-') === id;
                   });
      if (item) {
        item.classList.add('active');
        setTimeout(() => item.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
      }
    }
  }
}

// Initialize on page load
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.FAQAccordion = new FAQAccordion();
  });
}
