// Micro-interactions and Spring Animations System
class MicroInteractions {
  constructor() {
    this.init();
  }

  init() {
    this.setupRippleEffect();
    this.setupButtonAnimations();
    this.setupCardHovers();
    this.setupScrollAnimations();
    this.setupInputFeedback();
  }

  // Ripple Effect on Buttons and Cards
  setupRippleEffect() {
    document.addEventListener('click', (e) => {
      const target = e.target.closest('.btn-primary, .btn-secondary, .card-interactive, .ripple');
      if (!target) return;

      const ripple = document.createElement('span');
      const rect = target.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.classList.add('ripple-effect');

      // Ensure position relative
      if (getComputedStyle(target).position === 'static') {
        target.style.position = 'relative';
      }
      target.style.overflow = 'hidden';

      target.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  }

  // Spring Animations on Button Press
  setupButtonAnimations() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, button, .btn');
    buttons.forEach(btn => {
      btn.addEventListener('mousedown', () => {
        btn.style.transform = 'scale(0.95)';
      });

      btn.addEventListener('mouseup', () => {
        btn.style.transform = '';
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  // Card Hover Effects with Spring
  setupCardHovers() {
    const cards = document.querySelectorAll('.card, .gallery-item, .feature-card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', (e) => {
        this.animateCard(card, e);
      });

      card.addEventListener('mousemove', (e) => {
        this.animateCard(card, e, true);
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  animateCard(card, e, isMove = false) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    if (isMove) {
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    } else {
      card.style.transform = 'translateY(-4px) scale(1.02)';
    }
  }

  // Scroll-triggered Animations
  setupScrollAnimations() {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          
          // Add stagger delay for children
          const children = entry.target.querySelectorAll('.animate-child');
          children.forEach((child, index) => {
            child.style.animationDelay = `${index * 0.1}s`;
            child.classList.add('animate-in');
          });
        }
      });
    }, observerOptions);

    // Observe elements with animate class
    const animateElements = document.querySelectorAll('.animate-on-scroll, .feature-card, .stat-item, .gallery-item');
    animateElements.forEach(el => {
      el.classList.add('animate-pending');
      observer.observe(el);
    });
  }

  // Input Field Feedback
  setupInputFeedback() {
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      // Focus glow effect
      input.addEventListener('focus', () => {
        input.parentElement?.classList.add('input-focused');
      });

      input.addEventListener('blur', () => {
        input.parentElement?.classList.remove('input-focused');
      });

      // Validation feedback
      input.addEventListener('input', () => {
        if (input.validity.valid && input.value) {
          input.classList.add('input-valid');
          input.classList.remove('input-invalid');
        } else if (!input.validity.valid && input.value) {
          input.classList.add('input-invalid');
          input.classList.remove('input-valid');
        }
      });
    });
  }

  // Smooth Number Counter Animation
  static animateNumber(element, start, end, duration = 2000) {
    const startTime = performance.now();
    const range = end - start;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = start + (range * easeProgress);
      
      element.textContent = Math.round(current).toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  // Magnetic Button Effect
  static setupMagneticButtons() {
    const magneticButtons = document.querySelectorAll('.btn-magnetic');
    magneticButtons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  // Cursor Follow Effect
  static setupCursorFollow() {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-follow';
    document.body.appendChild(cursor);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      const dx = mouseX - cursorX;
      const dy = mouseY - cursorY;
      
      cursorX += dx * 0.1;
      cursorY += dy * 0.1;
      
      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
      
      requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Scale cursor on interactive elements
    const interactives = document.querySelectorAll('a, button, .card, input, select, textarea');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
    });
  }

  // Shake Animation for Errors
  static shake(element) {
    element.classList.add('shake-animation');
    setTimeout(() => element.classList.remove('shake-animation'), 500);
  }

  // Bounce Animation
  static bounce(element) {
    element.classList.add('bounce-animation');
    setTimeout(() => element.classList.remove('bounce-animation'), 1000);
  }

  // Pulse Animation
  static pulse(element, color = 'var(--primary-color)') {
    element.style.setProperty('--pulse-color', color);
    element.classList.add('pulse-animation');
    setTimeout(() => element.classList.remove('pulse-animation'), 1500);
  }
}

// Initialize on page load
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.MicroInteractions = new MicroInteractions();
    
    // Optional: Enable magnetic buttons and cursor follow
    // MicroInteractions.setupMagneticButtons();
    // MicroInteractions.setupCursorFollow();
  });
}
