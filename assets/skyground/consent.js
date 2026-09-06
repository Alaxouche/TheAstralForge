/**
 * consent.js
 * Consent gate for advertising.
 *
 * The rule this enforces: no third-party ad request leaves the browser until
 * the visitor has actively accepted. The tag is not in the HTML — its
 * parameters sit on data attributes and the <script> is built here, after
 * consent. Refusing means the request is never made at all, which is the only
 * version of "refuse" that means anything.
 *
 * The stored answer is a plain local value, not a TCF consent string. A
 * certified CMP (Axeptio, Sirdata, Google Funding Choices…) can drive this
 * same gate later by calling window.TAFConsent.allow() / .deny() from its own
 * callback — the loading logic below does not need to change.
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

  function loadAds(banner) {
    if (loaded) return;
    const src = banner.dataset.adSrc;
    const zone = banner.dataset.adZone;
    if (!src || !zone) return;

    const tag = document.createElement('script');
    // Order matters to Monetag: their own snippet sets the zone before the
    // src, because the tag reads its zone off currentScript as it executes.
    // Nothing fetches until the element is appended, so this is safe either
    // way — it just matches their documented shape.
    tag.dataset.zone = zone;
    // theastralforge.com sits behind Cloudflare with Rocket Loader switched
    // on, and Rocket Loader defers scripts in ways that break ad tags.
    // data-cfasync="false" is Monetag's documented opt-out.
    tag.setAttribute('data-cfasync', 'false');
    tag.async = true;
    tag.src = src;
    document.body.appendChild(tag);
    loaded = true;
  }

  function init() {
    const banner = document.getElementById('consent-banner');
    // No banner in the DOM means ads are switched off in _data/ads.yml.
    if (!banner) return;

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
      if (value === ALLOW) loadAds(banner);
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
      loadAds(banner);
    } else if (stored !== DENY) {
      show();
    }

    // Lets the footer link reopen the choice, and gives a future CMP a handle.
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
