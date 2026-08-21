/**
 * lightbox.js
 * Full-screen viewer for gallery and article images.
 *
 * Only opts in images that are actually worth enlarging — it used to bind
 * every <img> on the page, so clicking the site logo opened a lightbox of the
 * logo. Gallery tiles carry data-full pointing at the 1600w derivative, so the
 * 2560px master never reaches a visitor.
 */
(() => {
  const SELECTOR = '.modlist-gallery img, .readme-content img, .carousel-item img';

  const init = () => {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    if (!lightbox || !lightboxImg) return;

    const images = Array.from(document.querySelectorAll(SELECTOR))
      .filter((img) => !img.closest('[data-no-lightbox]'));
    if (!images.length) return;

    let index = -1;
    let lastFocused = null;

    // A close button gives the overlay something focusable, which is what makes
    // it reachable — and escapable — without a mouse.
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'lightbox__close';
    closeBtn.setAttribute('aria-label', 'Close image viewer');
    closeBtn.textContent = '×';
    lightbox.appendChild(closeBtn);

    // data-full is the 1600w derivative; fall back to whatever the tile shows.
    const fullSrc = (img) => img.dataset.full || img.currentSrc || img.src;

    const show = (i) => {
      index = (i + images.length) % images.length;
      const img = images[index];
      lightboxImg.src = fullSrc(img);
      lightboxImg.alt = img.alt || '';
    };

    const open = (i) => {
      lastFocused = document.activeElement;
      show(i);
      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
      closeBtn.focus();
    };

    const close = () => {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
      lightboxImg.src = '';
      lightboxImg.alt = '';
      index = -1;
      // Send focus back where it came from, not to the top of the document.
      if (lastFocused && document.contains(lastFocused)) lastFocused.focus();
      lastFocused = null;
    };

    const isOpen = () => lightbox.classList.contains('active');

    closeBtn.addEventListener('click', (e) => { e.stopPropagation(); close(); });

    images.forEach((img, i) => {
      // Tiles are interactive, so they have to look and behave like controls.
      img.setAttribute('role', 'button');
      img.setAttribute('tabindex', '0');
      img.addEventListener('click', () => open(i));
      img.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open(i);
        }
      });
    });

    lightbox.addEventListener('click', close);
    lightboxImg.addEventListener('click', (e) => e.stopPropagation());

    document.addEventListener('keydown', (e) => {
      if (!isOpen()) return;
      if (e.key === 'Escape') { close(); return; }
      if (images.length < 2) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); show(index + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(index - 1); }
    });

    // Keep focus inside the overlay while it is open.
    lightbox.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        closeBtn.focus();
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
