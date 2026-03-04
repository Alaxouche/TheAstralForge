// User Gallery System
const GALLERY_VERSION = 'v3';

class UserGallery {
  constructor() {
    this.gallery = this.loadGallery();
    this.currentFilter = 'all';
    this.init();
  }

  init() {
    this.render();
    this.attachEventListeners();
  }

  loadGallery() {
    // Version-based cache busting — clear old data if version mismatch
    const savedVersion = localStorage.getItem('astralforge_user_gallery_version');
    if (savedVersion !== GALLERY_VERSION) {
      localStorage.removeItem('astralforge_user_gallery');
      localStorage.setItem('astralforge_user_gallery_version', GALLERY_VERSION);
    }

    const saved = localStorage.getItem('astralforge_user_gallery');
    if (saved) {
      return JSON.parse(saved);
    }

    // Default gallery items
    return [
      { id: 1, title: 'Dragon Hunt',          author: 'Alaxouche',  modlist: 'wunduniik',            image: '/assets/Images/Skyrim/enb_2026-2-28_18-36-11_274.png',    likes: 68, date: '2026-02-28' },
      { id: 2, title: 'Northern Lights',       author: 'SkySeer',    modlist: 'wunduniik',            image: '/assets/Images/Skyrim/enb_2026-1-30_10-36-32_139.png',    likes: 54, date: '2026-01-30' },
      { id: 3, title: 'Tundra Dawn',           author: 'NordWalker', modlist: 'krentoraan',           image: '/assets/Images/Skyrim/enb_2026-2-28_18-36-25_572.png',    likes: 47, date: '2026-02-28' },
      { id: 4, title: 'Ancient Ruins',         author: 'Explorer99', modlist: 'krentoraan',           image: '/assets/Images/Skyrim/enb2025_12_6_14_19_46.png',          likes: 41, date: '2025-12-06' },
      { id: 5, title: 'Night City Rain',       author: 'GridRunner', modlist: 'ghost-of-the-grid',   image: '/assets/Images/Cyberpunk/photomode_22022026_172726.png',   likes: 73, date: '2026-02-22' },
      { id: 6, title: 'Neon Streets',          author: 'NetRunner',  modlist: 'ghost-of-the-grid',   image: '/assets/Images/Cyberpunk/photomode_06122025_154631.png',   likes: 59, date: '2025-12-06' },
      { id: 7, title: 'Blade Runner Vibes',    author: 'V_Corpo',    modlist: 'ghost-of-the-grid',   image: '/assets/Images/Cyberpunk/photomode_28112025_154634.png',   likes: 45, date: '2025-11-28' },
      { id: 8, title: 'Space Station View',    author: 'Wanderer',   modlist: 'no-mans-sky-explorer', image: '/assets/Images/generic_background.jpg',                   likes: 31, date: '2026-02-05' },
    ];
  }

  saveGallery() {
    localStorage.setItem('astralforge_user_gallery', JSON.stringify(this.gallery));
  }

  render() {
    const container = document.getElementById('user-gallery-container');
    if (!container) return;

    const filtered = this.currentFilter === 'all' 
      ? this.gallery 
      : this.gallery.filter(item => item.modlist === this.currentFilter);

    const sorted = filtered.sort((a, b) => b.likes - a.likes);

    container.innerHTML = sorted.map(item => `
      <div class="gallery-item" data-id="${item.id}">
        <div class="gallery-image" style="background-image: url('${item.image}')">
          <div class="gallery-overlay">
            <button class="gallery-like-btn ${this.hasLiked(item.id) ? 'liked' : ''}" data-id="${item.id}">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="${this.hasLiked(item.id) ? 'currentColor' : 'none'}" stroke="currentColor">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>${item.likes}</span>
            </button>
          </div>
        </div>
        <div class="gallery-info">
          <h3 class="gallery-title">${item.title}</h3>
          <div class="gallery-meta">
            <span class="gallery-author">${item.author}</span>
            <span class="gallery-modlist-tag">${this.formatModlistName(item.modlist)}</span>
          </div>
        </div>
      </div>
    `).join('');

    this.attachGalleryListeners();
  }

  attachEventListeners() {
    // Filter buttons
    document.querySelectorAll('.gallery-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentFilter = btn.dataset.filter;
        document.querySelectorAll('.gallery-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.render();
      });
    });
  }

  attachGalleryListeners() {
    document.querySelectorAll('.gallery-like-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.dataset.id);
        this.toggleLike(id);
      });
    });
  }

  toggleLike(id) {
    const item = this.gallery.find(i => i.id === id);
    if (!item) return;

    const liked = this.hasLiked(id);
    if (liked) {
      item.likes--;
      this.removeLike(id);
    } else {
      item.likes++;
      this.addLike(id);
    }

    this.saveGallery();
    this.render();
  }

  hasLiked(id) {
    const likes = JSON.parse(localStorage.getItem('astralforge_gallery_likes') || '[]');
    return likes.includes(id);
  }

  addLike(id) {
    const likes = JSON.parse(localStorage.getItem('astralforge_gallery_likes') || '[]');
    likes.push(id);
    localStorage.setItem('astralforge_gallery_likes', JSON.stringify(likes));
  }

  removeLike(id) {
    let likes = JSON.parse(localStorage.getItem('astralforge_gallery_likes') || '[]');
    likes = likes.filter(likeId => likeId !== id);
    localStorage.setItem('astralforge_gallery_likes', JSON.stringify(likes));
  }

  formatModlistName(modlist) {
    const names = {
      'wunduniik': 'Wunduniik',
      'ghost-of-the-grid': 'Ghost of the Grid',
      'krentoraan': 'Krentoraan',
      'no-mans-sky-explorer': 'NMS Explorer'
    };
    return names[modlist] || modlist;
  }
}

// Initialize on page load
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.UserGallery = new UserGallery();
  });
}
