/**
 * nav.js
 * Header navigation: the mobile menu button and the disclosure behaviour for
 * the Modlists menu and its per-modlist submenus.
 *
 * These menus used to open on :hover only, which left every modlist page
 * unreachable by keyboard and awkward on touch. Hover still works for pointer
 * users (see the @media (hover: hover) rules in main.css); this adds click,
 * Enter/Space, Escape and click-outside on top, and keeps aria-expanded honest
 * so assistive tech reports the real state.
 */
(() => {
  const DESKTOP = '(min-width: 901px)';

  const init = () => {
    const header = document.querySelector('header');
    const nav = document.getElementById('site-nav');
    const burger = document.getElementById('nav-burger');
    if (!header || !nav) return;

    const isDesktop = () => window.matchMedia(DESKTOP).matches;

    /* ── Disclosures ──────────────────────────────────────────────── */

    const toggles = Array.from(nav.querySelectorAll('[data-nav-toggle], [data-nav-subtoggle]'));

    const panelOf = (btn) => document.getElementById(btn.getAttribute('aria-controls'));

    const setOpen = (btn, open) => {
      btn.setAttribute('aria-expanded', String(open));
      const panel = panelOf(btn);
      if (panel) panel.classList.toggle('is-open', open);
    };

    const closeAll = (except) => {
      toggles.forEach((btn) => {
        if (btn !== except) setOpen(btn, false);
      });
    };

    toggles.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = btn.getAttribute('aria-expanded') === 'true';
        // Toggling the top-level menu takes its submenus with it, otherwise a
        // submenu stays "expanded" inside a panel nobody can see.
        if (btn.hasAttribute('data-nav-toggle')) closeAll(btn);
        setOpen(btn, !open);
      });
    });

    // Sibling submenus behave like an accordion: opening one closes the others.
    nav.querySelectorAll('[data-nav-subtoggle]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const siblings = btn.closest('.nav-dropdown-menu');
        if (!siblings) return;
        siblings.querySelectorAll('[data-nav-subtoggle]').forEach((other) => {
          if (other !== btn) setOpen(other, false);
        });
      });
    });

    /* ── Mobile menu ──────────────────────────────────────────────── */

    const setNavOpen = (open) => {
      nav.classList.toggle('is-open', open);
      if (burger) burger.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('nav-locked', open && !isDesktop());
      if (!open) closeAll(null);
    };

    if (burger) {
      burger.addEventListener('click', (e) => {
        e.stopPropagation();
        setNavOpen(!nav.classList.contains('is-open'));
      });
    }

    // Following a link should not leave the panel hanging open behind the
    // new page's scroll position.
    nav.querySelectorAll('a[href]').forEach((link) => {
      link.addEventListener('click', () => {
        if (!isDesktop()) setNavOpen(false);
      });
    });

    /* ── Dismissal ────────────────────────────────────────────────── */

    document.addEventListener('click', (e) => {
      if (header.contains(e.target)) return;
      closeAll(null);
      if (!isDesktop()) setNavOpen(false);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      const openToggle = toggles.find((b) => b.getAttribute('aria-expanded') === 'true');
      if (openToggle) {
        closeAll(null);
        openToggle.focus();
        return;
      }
      if (nav.classList.contains('is-open')) {
        setNavOpen(false);
        if (burger) burger.focus();
      }
    });

    // Resizing past the breakpoint must not strand the page in the other
    // layout's state (menu locked open, body scroll still frozen).
    window.matchMedia(DESKTOP).addEventListener('change', () => {
      setNavOpen(false);
      closeAll(null);
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
