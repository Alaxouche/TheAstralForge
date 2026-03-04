// Rating System
class RatingSystem {
  constructor() {
    this.storageKey = 'astralforge_ratings';
    this.init();
  }

  init() {
    this.loadRatings();
    this.attachEventListeners();
  }

  loadRatings() {
    const stored = localStorage.getItem(this.storageKey);
    this.ratings = stored ? JSON.parse(stored) : {};
  }

  saveRatings() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.ratings));
  }

  getRating(modlistId) {
    return this.ratings[modlistId] || { userRating: 0, averageRating: 0, totalVotes: 0 };
  }

  setRating(modlistId, rating) {
    if (!this.ratings[modlistId]) {
      this.ratings[modlistId] = { userRating: 0, averageRating: 0, totalVotes: 0 };
    }
    
    const data = this.ratings[modlistId];
    const oldRating = data.userRating;
    
    // Update average
    if (oldRating > 0) {
      data.averageRating = ((data.averageRating * data.totalVotes) - oldRating + rating) / data.totalVotes;
    } else {
      data.totalVotes++;
      data.averageRating = ((data.averageRating * (data.totalVotes - 1)) + rating) / data.totalVotes;
    }
    
    data.userRating = rating;
    this.saveRatings();
    return data;
  }

  attachEventListeners() {
    document.addEventListener('click', (e) => {
      if (e.target.matches('.rating-star')) {
        const container = e.target.closest('.rating-container');
        const modlistId = container.dataset.modlistId;
        const rating = parseInt(e.target.dataset.value);
        
        const data = this.setRating(modlistId, rating);
        this.updateDisplay(container, data);
      }
    });
  }

  updateDisplay(container, data) {
    const stars = container.querySelectorAll('.rating-star');
    stars.forEach((star, index) => {
      if (index < data.userRating) {
        star.classList.add('active');
      } else {
        star.classList.remove('active');
      }
    });
    
    const avgDisplay = container.querySelector('.rating-average');
    const votesDisplay = container.querySelector('.rating-votes');
    
    if (avgDisplay) {
      avgDisplay.textContent = data.averageRating.toFixed(1);
    }
    if (votesDisplay) {
      votesDisplay.textContent = `${data.totalVotes} vote${data.totalVotes !== 1 ? 's' : ''}`;
    }
  }

  renderRating(modlistId) {
    const data = this.getRating(modlistId);
    return `
      <div class="rating-container" data-modlist-id="${modlistId}">
        <div class="rating-stars">
          ${[1,2,3,4,5].map(i => `
            <span class="rating-star ${i <= data.userRating ? 'active' : ''}" data-value="${i}">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </span>
          `).join('')}
        </div>
        <div class="rating-info">
          <span class="rating-average">${data.averageRating.toFixed(1)}</span>
          <span class="rating-votes">${data.totalVotes} vote${data.totalVotes !== 1 ? 's' : ''}</span>
        </div>
      </div>
    `;
  }
}

// Initialize on page load
if (typeof window !== 'undefined') {
  window.RatingSystem = new RatingSystem();
  
  // Auto-render ratings on page load
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-rating-placeholder]').forEach(el => {
      const modlistId = el.dataset.ratingPlaceholder;
      el.innerHTML = window.RatingSystem.renderRating(modlistId);
      const data = window.RatingSystem.getRating(modlistId);
      window.RatingSystem.updateDisplay(el.querySelector('.rating-container'), data);
    });
  });
}
