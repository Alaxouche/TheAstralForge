/**
 * consent.js
 * Loads the advertising tag, and gates it behind consent when configured to.
 *
 * Two modes, set by `consent.require_consent` in _data/ads.yml:
 *
 *   false (current) — the tag is injected on page load, for everyone.
 *   true            — nothing leaves the browser until the visitor accepts;
 *                     refusing means the request is never made at all, which
 *                     is the only version of "refuse" that means anything.
 *
 * The tag is never in the HTML in either mode. Its parameters ride on
 * #ad-config and the <script> is built here, which also keeps it away from
 * Cloudflare Rocket Loader (switched on for this domain, and documented by
 * Monetag as something that breaks their tags).
 *
 * A certified CMP can drive the gated mode by calling
 * window.TAFConsent.allow() / .deny() from its own callback.
 */
(() => {
  const KEY = 'taf-ad-consent';
  const ALLOW = 'allow';
  const DENY = 'deny';

  const read = () => {
    try { return localStorage.getItem(KEY); } catch (_) { return null; }
  };

  const write = (value) => {
    try { localStorage.setItem(KEY, value); } catch (_) { /* private mode */ }
  };

  let loaded = false;

  function loadAds(config) {
    if (loaded) return;
    const src = config.dataset.adSrc;
    const zone = config.dataset.adZone;
    if (!src || !zone) return;

    const tag = document.createElement('script');
    // Order matters to Monetag: their own snippet sets the zone before the
    // src, because the tag reads its zone off currentScript as it executes.
    // Nothing fetches until the element is appended, so this is safe either
    // way — it just matches their documented shape.
    tag.dataset.zone = zone;
    // data-cfasync="false" is Monetag's documented Rocket Loader opt-out.
    tag.setAttribute('data-cfasync', 'false');
    tag.async = true;
    tag.src = src;
    document.body.appendChild(tag);
    loaded = true;
  }

  function init() {
    const config = document.getElementById('ad-config');
    // No config element means ads are switched off in _data/ads.yml.
    if (!config) return;

    // Ads on, no gate: load straight away and skip the rest.
    if (!config.hasAttribute('data-require-consent')) {
      loadAds(config);
      return;
    }

    const banner = document.getElementById('consent-banner');
    if (!banner) { loadAds(config); return; }

    let lastFocused = null;

    const hide = () => {
      banner.hidden = true;
      if (lastFocused && document.contains(lastFocused)) lastFocused.focus();
      lastFocused = null;
    };

    const show = () => {
      lastFocused = document.activeElement;
      banner.hidden = false;
      // Focus the dialog itself, not a button. Landing on "Accept" would mean
      // a stray Enter press counts as consent, which is a nudge — and consent
      // that was nudged is not freely given.
      banner.focus();
    };

    const decide = (value) => {
      write(value);
      if (value === ALLOW) loadAds(config);
      hide();
    };

    banner.querySelectorAll('[data-consent]').forEach((btn) => {
      btn.addEventListener('click', () => decide(btn.dataset.consent));
    });

    // Escape counts as "not now": it dismisses the banner without granting
    // anything, and the question comes back on the next visit.
    banner.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') hide();
    });

    const stored = read();
    if (stored === ALLOW) {
      loadAds(config);
    } else if (stored !== DENY) {
      show();
    }

    window.TAFConsent = {
      state: () => read(),
      allow: () => decide(ALLOW),
      deny: () => decide(DENY),
      reopen: show,
    };

    document.querySelectorAll('[data-consent-reopen]').forEach((el) => {
      el.hidden = false;
      el.addEventListener('click', (e) => {
        e.preventDefault();
        show();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
