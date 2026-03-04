(() => {
  const carousel = document.querySelector('.gallery-carousel');
  if (!carousel) return;

  const scrollContainer = carousel.querySelector('.carousel-scroll-container');
  const prevBtn = carousel.querySelector('.carousel-btn.prev');
  const nextBtn = carousel.querySelector('.carousel-btn.next');
  const dotsContainer = carousel.querySelector('.carousel-dots');

  if (!scrollContainer || !prevBtn || !nextBtn) return;

  let autoScrollInterval;
  let currentIndex = 0;
  const itemWidth = 300 + 16;
  const itemsCount = scrollContainer.children.length;

  const updateDots = () => {
    if (!dotsContainer) return;
    document.querySelectorAll('.carousel-dots .dot').forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  };

  const scrollToIndex = (index) => {
    currentIndex = index;
    scrollContainer.scrollLeft = index * itemWidth;
    updateDots();
  };

  const nextSlide = () => {
    currentIndex = (currentIndex + 1) % itemsCount;
    scrollToIndex(currentIndex);
  };

  const prevSlide = () => {
    currentIndex = (currentIndex - 1 + itemsCount) % itemsCount;
    scrollToIndex(currentIndex);
  };

  nextBtn.addEventListener('click', () => {
    clearInterval(autoScrollInterval);
    nextSlide();
    startAutoScroll();
  });

  prevBtn.addEventListener('click', () => {
    clearInterval(autoScrollInterval);
    prevSlide();
    startAutoScroll();
  });

  if (dotsContainer) {
    document.querySelectorAll('.carousel-dots .dot').forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        clearInterval(autoScrollInterval);
        scrollToIndex(idx);
        startAutoScroll();
      });
    });
  }

  const startAutoScroll = () => {
    autoScrollInterval = setInterval(() => {
      nextSlide();
    }, 5000);
  };

  let scrollTimeout;
  scrollContainer.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    clearInterval(autoScrollInterval);
    scrollTimeout = setTimeout(startAutoScroll, 2000);
  });

  updateDots();
  startAutoScroll();
})();
