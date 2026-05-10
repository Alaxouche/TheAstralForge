// Image Optimization Helper - WebP Conversion
class ImageOptimizer {
  constructor() {
    this.init();
  }

  init() {
    this.setupLazyLoading();
    this.setupResponsiveImages();
    this.convertImagesToWebP();
  }

  // Lazy Loading for Images
  setupLazyLoading() {
    // Use Intersection Observer for modern browsers
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            this.loadImage(img);
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px'
      });

      // Observe all images with data-src attribute
      document.querySelectorAll('img[data-src], img[loading="lazy"]').forEach(img => {
        imageObserver.observe(img);
      });
    } else {
      // Fallback for older browsers
      document.querySelectorAll('img[data-src]').forEach(img => {
        this.loadImage(img);
      });
    }
  }

  loadImage(img) {
    if (img.dataset.src) {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    }
    if (img.dataset.srcset) {
      img.srcset = img.dataset.srcset;
      img.removeAttribute('data-srcset');
    }
  }

  // Setup Responsive Images with srcset
  setupResponsiveImages() {
    document.querySelectorAll('img:not([srcset])').forEach(img => {
      const src = img.src || img.dataset.src;
      if (!src) return;

      // Generate srcset for different screen sizes
      const srcset = this.generateSrcset(src);
      if (srcset) {
        if (img.dataset.src) {
          img.dataset.srcset = srcset;
        } else {
          img.srcset = srcset;
        }
        
        // Add sizes attribute
        if (!img.sizes) {
          img.sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px';
        }
      }
    });
  }

  generateSrcset(src) {
    // Check if image is from assets folder
    if (!src.includes('/assets/') && !src.includes('/Images/')) {
      return null;
    }

    const ext = src.substring(src.lastIndexOf('.'));
    const base = src.substring(0, src.lastIndexOf('.'));

    // Generate different sizes
    const sizes = [400, 800, 1200, 1600];
    const srcset = sizes.map(size => {
      // In production, these would be pre-generated optimized images
      // For now, we'll create references assuming they exist
      return `${base}-${size}w${ext} ${size}w`;
    }).join(', ');

    return srcset;
  }

  // Convert Images to WebP Format
  convertImagesToWebP() {
    // Check WebP support
    if (!this.supportsWebP()) {
      return;
    }

    // Replace <img> tags with <picture> elements for WebP support
    document.querySelectorAll('img.optimize').forEach(img => {
      this.wrapInPicture(img);
    });
  }

  supportsWebP() {
    // Check if browser supports WebP
    const elem = document.createElement('canvas');
    if (elem.getContext && elem.getContext('2d')) {
      return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
  }

  wrapInPicture(img) {
    const src = img.src || img.dataset.src;
    if (!src) return;

    // Only convert local images
    if (!src.includes('/assets/') && !src.includes('/Images/')) {
      return;
    }

    // Skip if already wrapped
    if (img.parentElement.tagName === 'PICTURE') {
      return;
    }

    const ext = src.substring(src.lastIndexOf('.'));
    const base = src.substring(0, src.lastIndexOf('.'));
    const webpSrc = `${base}.webp`;

    const picture = document.createElement('picture');
    
    // WebP source
    const sourceWebP = document.createElement('source');
    sourceWebP.type = 'image/webp';
    if (img.dataset.src) {
      sourceWebP.dataset.srcset = webpSrc;
    } else {
      sourceWebP.srcset = webpSrc;
    }

    // Fallback to original format
    const sourceFallback = document.createElement('source');
    sourceFallback.type = `image/${ext.replace('.', '')}`;
    if (img.dataset.src) {
      sourceFallback.dataset.srcset = src;
    } else {
      sourceFallback.srcset = src;
    }

    // Clone img to preserve attributes
    const newImg = img.cloneNode(true);

    // Build picture element
    picture.appendChild(sourceWebP);
    picture.appendChild(sourceFallback);
    picture.appendChild(newImg);

    // Replace original img with picture
    img.replaceWith(picture);
  }

  // Manual Image Compression (Canvas-based)
  static async compressImage(file, maxWidth = 1920, quality = 0.8) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to blob
          canvas.toBlob((blob) => {
            resolve(blob);
          }, 'image/webp', quality);
        };

        img.onerror = reject;
        img.src = e.target.result;
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Utility: Convert all images in a container
  static optimizeContainer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.querySelectorAll('img').forEach(img => {
      img.classList.add('optimize');
      img.loading = 'lazy';
    });

    const optimizer = new ImageOptimizer();
    optimizer.setupLazyLoading();
    optimizer.convertImagesToWebP();
  }
}

// Initialize on page load
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.ImageOptimizer = new ImageOptimizer();
  });
}
