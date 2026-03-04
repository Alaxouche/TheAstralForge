// Enhanced Community Gallery with Upload, Likes, Tags & Metadata
class GalleryEnhanced {
  constructor() {
    this.storageKey = 'community-gallery';
    this.gallery = this.loadGallery();
    this.filters = {
      modlist: 'all',
      category: 'all',
      sort: 'latest'
    };
    this.init();
  }

  init() {
    const galleryContainer = document.getElementById('community-gallery');
    if (!galleryContainer) return;

    this.renderGallery(galleryContainer);
    this.setupUploadForm();
  }

  loadGallery() {
    const saved = localStorage.getItem(this.storageKey);
    return saved ? JSON.parse(saved) : this.getSampleGallery();
  }

  saveGallery() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.gallery));
  }

  getSampleGallery() {
    return [
      {
        id: 1,
        title: "Whiterun at Sunset",
        description: "Beautiful sunset over Whiterun with enhanced lighting",
        imageUrl: "/assets/Images/sample-gallery-1.jpg",
        author: "DragonBorn_2024",
        modlist: "wunduniik",
        category: "landscape",
        tags: ["ENB", "Lighting", "Cities"],
        likes: 24,
        likedBy: [],
        uploadDate: "2024-02-10T15:30:00Z"
      },
      {
        id: 2,
        title: "Epic Dragon Fight",
        description: "Combat screenshot with dragon near Bleak Falls Barrow",
        imageUrl: "/assets/Images/sample-gallery-2.jpg",
        author: "SkyrimEnthusiast",
        modlist: "ghost-of-the-grid",
        category: "combat",
        tags: ["Dragons", "Combat", "Action"],
        likes: 18,
        likedBy: [],
        uploadDate: "2024-02-11T10:15:00Z"
      }
    ];
  }

  addImage(imageData) {
    const newImage = {
      id: Date.now(),
      ...imageData,
      likes: 0,
      likedBy: [],
      uploadDate: new Date().toISOString()
    };
    this.gallery.unshift(newImage);
    this.saveGallery();
    return newImage;
  }

  toggleLike(imageId) {
    const image = this.gallery.find(img => img.id === imageId);
    if (!image) return;

    const userId = this.getUserId();
    const likedIndex = image.likedBy.indexOf(userId);

    if (likedIndex > -1) {
      image.likedBy.splice(likedIndex, 1);
      image.likes--;
    } else {
      image.likedBy.push(userId);
      image.likes++;
    }

    this.saveGallery();
    return image;
  }

  getUserId() {
    let userId = localStorage.getItem('gallery-user-id');
    if (!userId) {
      userId = 'user-' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('gallery-user-id', userId);
    }
    return userId;
  }

  hasUserLiked(image) {
    return image.likedBy.includes(this.getUserId());
  }

  filterGallery() {
    let filtered = [...this.gallery];

    if (this.filters.modlist !== 'all') {
      filtered = filtered.filter(img => img.modlist === this.filters.modlist);
    }

    if (this.filters.category !== 'all') {
      filtered = filtered.filter(img => img.category === this.filters.category);
    }

    // Sort
    switch (this.filters.sort) {
      case 'popular':
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.uploadDate) - new Date(b.uploadDate));
        break;
      case 'latest':
      default:
        filtered.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
    }

    return filtered;
  }

  renderGallery(container) {
    const filtered = this.filterGallery();

    container.innerHTML = `
      <div class="gallery-enhanced">
        <div class="gallery-header">
          <h2>Community Gallery</h2>
          <button class="btn-upload" onclick="window.galleryInstance.showUploadModal()">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Upload Screenshot
          </button>
        </div>

        <div class="gallery-filters">
          <select id="filter-modlist" class="filter-select">
            <option value="all">All Modlists</option>
            <option value="wunduniik">Wunduniik</option>
            <option value="ghost-of-the-grid">Ghost of the Grid</option>
            <option value="krentoraan">Krentoraan</option>
            <option value="no-mans-sky-explorer">No Man's Sky Explorer</option>
          </select>

          <select id="filter-category" class="filter-select">
            <option value="all">All Categories</option>
            <option value="landscape">Landscapes</option>
            <option value="combat">Combat</option>
            <option value="character">Characters</option>
            <option value="architecture">Architecture</option>
            <option value="other">Other</option>
          </select>

          <select id="filter-sort" class="filter-select">
            <option value="latest">Latest First</option>
            <option value="popular">Most Popular</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        <div class="gallery-grid">
          ${filtered.map(img => this.renderGalleryItem(img)).join('')}
        </div>

        ${filtered.length === 0 ? `
          <div class="gallery-empty">
            <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <p>No screenshots found with current filters</p>
            <button class="btn-primary" onclick="window.galleryInstance.resetFilters()">Reset Filters</button>
          </div>
        ` : ''}
      </div>

      <!-- Upload Modal -->
      <div id="upload-modal" class="modal-upload" style="display: none;">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Upload Screenshot</h3>
            <button class="modal-close" onclick="window.galleryInstance.closeUploadModal()">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <form id="upload-form" class="upload-form">
            <!-- Form will be rendered by setupUploadForm -->
          </form>
        </div>
      </div>
    `;

    // Setup filter event listeners
    document.getElementById('filter-modlist').addEventListener('change', (e) => {
      this.filters.modlist = e.target.value;
      this.renderGallery(container);
    });

    document.getElementById('filter-category').addEventListener('change', (e) => {
      this.filters.category = e.target.value;
      this.renderGallery(container);
    });

    document.getElementById('filter-sort').addEventListener('change', (e) => {
      this.filters.sort = e.target.value;
      this.renderGallery(container);
    });
  }

  renderGalleryItem(image) {
    const isLiked = this.hasUserLiked(image);
    const date = new Date(image.uploadDate);
    const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return `
      <div class="gallery-item" data-id="${image.id}">
        <div class="gallery-image">
          <img src="${image.imageUrl}" alt="${image.title}" loading="lazy">
          <div class="gallery-overlay">
            <button class="btn-like ${isLiked ? 'liked' : ''}" onclick="window.galleryInstance.handleLike(${image.id})">
              <svg width="24" height="24" fill="${isLiked ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
              <span>${image.likes}</span>
            </button>
          </div>
        </div>
        <div class="gallery-info">
          <h4 class="gallery-title">${image.title}</h4>
          <p class="gallery-description">${image.description}</p>
          <div class="gallery-tags">
            ${image.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
          </div>
          <div class="gallery-meta">
            <span class="author">by ${image.author}</span>
            <span class="date">${formattedDate}</span>
            <span class="modlist-badge">${image.modlist}</span>
          </div>
        </div>
      </div>
    `;
  }

  setupUploadForm() {
    const form = document.getElementById('upload-form');
    if (!form) return;

    form.innerHTML = `
      <div class="form-group">
        <label for="upload-title">Title *</label>
        <input type="text" id="upload-title" required maxlength="100">
      </div>

      <div class="form-group">
        <label for="upload-description">Description</label>
        <textarea id="upload-description" rows="3" maxlength="500"></textarea>
      </div>

      <div class="form-group">
        <label for="upload-image">Image URL *</label>
        <input type="url" id="upload-image" required placeholder="https://example.com/image.jpg">
        <small>For demo purposes, use a URL. In production, implement file upload.</small>
      </div>

      <div class="form-group">
        <label for="upload-author">Your Name *</label>
        <input type="text" id="upload-author" required maxlength="50">
      </div>

      <div class="form-group">
        <label for="upload-modlist">Modlist *</label>
        <select id="upload-modlist" required>
          <option value="">Select modlist</option>
          <option value="wunduniik">Wunduniik</option>
          <option value="ghost-of-the-grid">Ghost of the Grid</option>
          <option value="krentoraan">Krentoraan</option>
          <option value="no-mans-sky-explorer">No Man's Sky Explorer</option>
        </select>
      </div>

      <div class="form-group">
        <label for="upload-category">Category *</label>
        <select id="upload-category" required>
          <option value="">Select category</option>
          <option value="landscape">Landscape</option>
          <option value="combat">Combat</option>
          <option value="character">Character</option>
          <option value="architecture">Architecture</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div class="form-group">
        <label for="upload-tags">Tags (comma-separated)</label>
        <input type="text" id="upload-tags" placeholder="ENB, Lighting, Cities">
      </div>

      <div class="form-actions">
        <button type="button" class="btn-secondary" onclick="window.galleryInstance.closeUploadModal()">Cancel</button>
        <button type="submit" class="btn-primary">Upload</button>
      </div>
    `;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleUpload();
    });
  }

  handleUpload() {
    const imageData = {
      title: document.getElementById('upload-title').value,
      description: document.getElementById('upload-description').value,
      imageUrl: document.getElementById('upload-image').value,
      author: document.getElementById('upload-author').value,
      modlist: document.getElementById('upload-modlist').value,
      category: document.getElementById('upload-category').value,
      tags: document.getElementById('upload-tags').value
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0)
    };

    this.addImage(imageData);
    this.closeUploadModal();
    
    // Show success toast
    this.showToast('Screenshot uploaded successfully!', 'success');
    
    // Re-render gallery
    const container = document.getElementById('community-gallery');
    this.renderGallery(container);
  }

  handleLike(imageId) {
    const image = this.toggleLike(imageId);
    if (image) {
      // Update UI without full re-render
      const item = document.querySelector(`.gallery-item[data-id="${imageId}"]`);
      if (item) {
        const btn = item.querySelector('.btn-like');
        const isLiked = this.hasUserLiked(image);
        btn.classList.toggle('liked', isLiked);
        btn.querySelector('span').textContent = image.likes;
        btn.querySelector('svg').setAttribute('fill', isLiked ? 'currentColor' : 'none');
      }
    }
  }

  showUploadModal() {
    document.getElementById('upload-modal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  closeUploadModal() {
    document.getElementById('upload-modal').style.display = 'none';
    document.body.style.overflow = '';
    document.getElementById('upload-form').reset();
  }

  resetFilters() {
    this.filters = { modlist: 'all', category: 'all', sort: 'latest' };
    const container = document.getElementById('community-gallery');
    this.renderGallery(container);
  }

  showToast(message, type = 'info') {
    // Reuse existing toast system if available
    if (window.ToastSystem) {
      window.ToastSystem.show(message, type);
    } else {
      alert(message);
    }
  }
}

// Initialize on page load
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.galleryInstance = new GalleryEnhanced();
  });
}
