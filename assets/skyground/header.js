(() => {
  const header = document.querySelector('header');

  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
})();

/* The header search box is owned by search-system.js, which searches the
   whole site through the build-time index. */
