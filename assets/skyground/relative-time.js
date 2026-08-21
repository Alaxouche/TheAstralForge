/**
 * relative-time.js
 * Rewrites <time datetime="..." data-relative-time> as "3 weeks ago", in the
 * reader's language.
 *
 * Done in the browser on purpose: a static site would otherwise bake "2 days
 * ago" into the HTML at build time and still be claiming it three months later.
 * The absolute date stays in the markup as the fallback, so with JavaScript off
 * the page shows a real date rather than nothing.
 */
(() => {
  const MINUTE = 60;
  const HOUR = MINUTE * 60;
  const DAY = HOUR * 24;

  const pick = (seconds) => {
    if (seconds < MINUTE) return ['second', seconds];
    if (seconds < HOUR) return ['minute', Math.floor(seconds / MINUTE)];
    if (seconds < DAY) return ['hour', Math.floor(seconds / HOUR)];
    if (seconds < DAY * 7) return ['day', Math.floor(seconds / DAY)];
    if (seconds < DAY * 30) return ['week', Math.floor(seconds / (DAY * 7))];
    if (seconds < DAY * 365) return ['month', Math.floor(seconds / (DAY * 30))];
    return ['year', Math.floor(seconds / (DAY * 365))];
  };

  const currentLang = () => {
    try {
      return localStorage.getItem('sg-lang') || 'en';
    } catch (_) {
      return 'en';
    }
  };

  const render = () => {
    const nodes = document.querySelectorAll('time[datetime][data-relative-time]');
    if (!nodes.length) return;

    const lang = currentLang();
    let rtf = null;
    try {
      rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' });
    } catch (_) {
      return; // No Intl support: the absolute date already in the DOM stands.
    }

    const now = Date.now();
    nodes.forEach((node) => {
      const iso = node.getAttribute('datetime');
      const then = Date.parse(iso);
      if (Number.isNaN(then)) return;

      // Keep the exact date reachable on hover once the text goes relative.
      if (!node.title) {
        try {
          node.title = new Intl.DateTimeFormat(lang, { dateStyle: 'long' }).format(new Date(then));
        } catch (_) { /* leave the title unset */ }
      }

      const [unit, value] = pick(Math.max(0, Math.round((now - then) / 1000)));
      node.textContent = rtf.format(-value, unit);
    });
  };

  const start = () => {
    render();
    // The language switcher rewrites the page in place; follow it.
    document.addEventListener('sg:langchange', render);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
