/* The Astral Forge, site.js (no dependencies) */
(function () {
  'use strict';
  var root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var store = {
    get: function (k, s) { try { return (s || localStorage).getItem(k); } catch (e) { return null; } },
    set: function (k, v, s) { try { (s || localStorage).setItem(k, v); } catch (e) {} }
  };
  var cssLink = document.querySelector('link[href*="/assets/site.css"]');
  var base = cssLink ? cssLink.getAttribute('href').split('/assets/site.css')[0] : '';
  var canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lang = function () { return root.getAttribute('data-lang') === 'fr' ? 'fr' : 'en'; };
  var norm = function (s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, ''); };

  var MODLIST_JSON = 'https://raw.githubusercontent.com/Alaxouche/Wunduniik/main/modlist.json';
  var DISCORD_ID = '750268919201398805';

  /* =========================================================
     Count-up numbers ("2900+", "502 GB", "4791")
     ========================================================= */
  function countUp(el) {
    if (calm) return;
    var target = el.dataset.final || el.textContent.trim();
    var m = target.match(/^(\d[\d\s,.]*)(.*)$/);
    if (!m) return;
    var n = parseFloat(m[1].replace(/[\s,]/g, ''));
    if (!isFinite(n) || n < 10) return;
    el.dataset.final = target;
    var start = performance.now(), dur = 1100;
    cancelAnimationFrame(el._cu);
    (function frame(t) {
      var k = Math.min(1, (t - start) / dur), e = 1 - Math.pow(1 - k, 3);
      var fin = el.dataset.final, mm = fin.match(/^(\d[\d\s,.]*)(.*)$/);
      if (!mm) { el.textContent = fin; return; }
      var goal = parseFloat(mm[1].replace(/[\s,]/g, ''));
      // keep the thousands separator while counting, if the final number has one (3,784)
      el.textContent = k < 1 ? (/,/.test(mm[1]) ? Math.round(goal * e).toLocaleString('en') : Math.round(goal * e)) + mm[2] : fin;
      if (k < 1) el._cu = requestAnimationFrame(frame);
    })(start);
  }
  var countIO = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { countUp(en.target); countIO.unobserve(en.target); } });
  }, { threshold: .6 }) : null;
  $$('[data-count]').forEach(function (el) { if (countIO && !el.closest('.forge')) countIO.observe(el); });

  /* =========================================================
     Rune decode effect for titles
     ========================================================= */
  var RUNES = 'ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ✦';
  function scramble(el, delay) {
    if (calm) return;
    var final = el.dataset.text || (el.dataset.text = el.textContent);
    // Screen readers keep the real title while the runes play.
    el.setAttribute('aria-label', final);
    clearTimeout(el._st); cancelAnimationFrame(el._sr);
    el._st = setTimeout(function () {
      var start = performance.now(), dur = 900;
      (function frame(t) {
        var k = Math.min(1, (t - start) / dur), out = '';
        for (var i = 0; i < final.length; i++) {
          var c = final[i];
          out += (c === ' ' || i / final.length < k * 1.2 - .2) ? c : RUNES[Math.random() * RUNES.length | 0];
        }
        el.textContent = k < 1 ? out : final;
        if (k < 1) el._sr = requestAnimationFrame(frame);
      })(start);
    }, delay || 0);
  }

  /* Run fn with the latest pointer event once per frame (one layout read per frame at most) */
  function pointerFrame(el, fn) {
    var ev = null, queued = false;
    el.addEventListener('pointermove', function (e) {
      ev = e;
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () { queued = false; fn(ev); });
    }, { passive: true });
  }

  /* =========================================================
     Home: the forge (theme/assets/forge/forge.js, a module loaded by home.liquid) runs the page
     and reuses the two text effects above
     ========================================================= */
  var hero = $('[data-hero]');
  window.TAF = { scramble: scramble, countUp: countUp };

  /* =========================================================
     Nav, drawer, reading progress, parallax
     ========================================================= */
  var nav = $('[data-nav]'), progress = $('[data-progress]'), prose = $('.prose'), plx = $$('[data-parallax]');
  var ticking = false;
  // Reads (scroll position, prose box) come before every write, and the first run waits for the
  // next frame: reading scrollY while the page is still being built forced a full layout of long
  // pages (about 150 ms on a 3000-line changelog), then the scripts below dirtied it again.
  function onScroll() {
    ticking = false;
    var y = scrollY, ih = innerHeight, r = progress && prose ? prose.getBoundingClientRect() : null;
    if (nav && !hero) nav.classList.toggle('is-solid', y > 40);
    if (r) {
      var total = r.height - ih * .6;
      var p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
      progress.style.transform = 'scaleX(' + p + ')';
    }
    if (plx.length && !calm && y < ih) plx.forEach(function (el) { el.style.transform = 'translate3d(0,' + (y * .35) + 'px,0) scale(1.06)'; });
    if (toTop) toTop.classList.toggle('is-on', y > ih * 1.5);
  }
  addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  requestAnimationFrame(onScroll);

  /* Overlays (mobile menu, mobile docs sidebar): Escape closes, focus moves in on
     open and back to the button on close, Tab stays inside while open. */
  function overlay(panel, opener, onToggle) {
    var last = null;
    function set(open) {
      if (panel.classList.contains('is-open') === open) return;
      panel.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      $$('[aria-controls="' + panel.id + '"]').forEach(function (b) { b.setAttribute('aria-expanded', open); });
      if (onToggle) onToggle(open);
      if (open) {
        last = document.activeElement;
        var first = $('a, button', panel);
        if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, 60);
      } else if (last && document.contains(last) && last.offsetParent !== null) last.focus({ preventScroll: true });
    }
    panel.addEventListener('keydown', function (e) {
      if (!panel.classList.contains('is-open')) return;
      if (e.key === 'Escape') { e.preventDefault(); set(false); return; }
      if (e.key !== 'Tab') return;
      var f = $$('a[href], button:not([disabled]), input', panel).filter(function (x) { return x.offsetParent !== null; });
      if (!f.length) return;
      var a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    });
    return set;
  }

  var drawer = $('[data-drawer]'), menuBtn = $('[data-menu-toggle]');
  if (drawer && menuBtn) {
    var setDrawer = overlay(drawer, menuBtn);
    menuBtn.addEventListener('click', function () { setDrawer(!drawer.classList.contains('is-open')); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) setDrawer(false);
    });
    drawer.addEventListener('click', function (e) { if (e.target.closest('a')) setDrawer(false); });
    // The drawer only exists below 900px: close it if the window grows past that.
    matchMedia('(min-width: 901px)').addEventListener('change', function (m) { if (m.matches) setDrawer(false); });
  }

  /* Back to top (long changelogs, guides) */
  var toTop = $('[data-totop]');
  if (toTop) {
    toTop.addEventListener('click', function () {
      scrollTo({ top: 0, behavior: calm ? 'auto' : 'smooth' });
      var m = $('#main'); if (m) m.focus({ preventScroll: true });
    });
  }

  /* Hub bands follow the cursor */
  if (canHover && !calm) $$('[data-tilt]').forEach(function (b) {
    var img = $('.band__bg', b);
    pointerFrame(b, function (e) {
      var r = b.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      img.style.setProperty('--tx', (x * -24) + 'px'); img.style.setProperty('--ty', (y * -16) + 'px');
    });
    b.addEventListener('pointerleave', function () { img.style.setProperty('--tx', '0px'); img.style.setProperty('--ty', '0px'); });
  });

  /* =========================================================
     Language
     ========================================================= */
  /* Attributes can't hold <span lang> pairs: the English value is in the attribute,
     the French one in data-ph-fr (placeholder), data-aria-fr (aria-label), data-title-fr (title). */
  var ATTRS = [['placeholder', 'phFr', 'phEn'], ['aria-label', 'ariaFr', 'ariaEn'], ['title', 'titleFr', 'titleEn'], ['alt', 'altFr', 'altEn']];
  function localizeAttrs() {
    var fr = lang() === 'fr';
    $$('[data-ph-fr], [data-aria-fr], [data-title-fr], [data-alt-fr]').forEach(function (el) {
      ATTRS.forEach(function (a) {
        if (!el.dataset[a[1]]) return;
        if (el.dataset[a[2]] == null) el.dataset[a[2]] = el.getAttribute(a[0]) || '';
        el.setAttribute(a[0], fr ? el.dataset[a[1]] : el.dataset[a[2]]);
      });
    });
    // Elements that cannot hold <span lang> (e.g. <option>): French text in data-text-fr
    $$('[data-text-fr]').forEach(function (el) {
      if (el.dataset.textEn == null) el.dataset.textEn = el.textContent;
      el.textContent = fr ? el.dataset.textFr : el.dataset.textEn;
    });
  }
  localizeAttrs();

  $$('[data-lang-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var next = lang() === 'fr' ? 'en' : 'fr';
      root.setAttribute('data-lang', next); root.lang = next;
      store.set('sg-lang', next);
      buildToc(); renderTimes(); localizeAttrs();
    });
  });

  /* Theme: dark by default, light when the visitor picks it (localStorage['taf-theme']).
     The <head> script applies the stored choice before the first paint. */
  var themeMeta = $('meta[name="theme-color"]');
  function syncTheme() {
    var light = root.getAttribute('data-theme') === 'light';
    $$('[data-theme-toggle]').forEach(function (b) { b.setAttribute('aria-pressed', light); });
    if (themeMeta) themeMeta.content = light ? '#f2ece3' : '#0d0a08';
  }
  $$('[data-theme-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      store.set('taf-theme', next);
      syncTheme();
    });
  });
  syncTheme();

  /* =========================================================
     Live data: modlist.json (version, size, last update)
     ========================================================= */
  function relTime(iso) {
    var d = new Date(iso);
    if (isNaN(d)) return '';
    var s = (d - Date.now()) / 1000, a = Math.abs(s);
    var rtf = new Intl.RelativeTimeFormat(lang(), { numeric: 'auto' });
    if (a < 3600) return rtf.format(Math.round(s / 60), 'minute');
    if (a < 86400) return rtf.format(Math.round(s / 3600), 'hour');
    if (a < 86400 * 30) return rtf.format(Math.round(s / 86400), 'day');
    if (a < 86400 * 365) return rtf.format(Math.round(s / (86400 * 30.4)), 'month');
    return rtf.format(Math.round(s / (86400 * 365)), 'year');
  }
  function renderTimes() {
    $$('time[data-field="updated"]').forEach(function (t) {
      var iso = t.getAttribute('datetime');
      if (!iso) return;
      t.textContent = relTime(iso);
      t.title = new Date(iso).toLocaleDateString(lang(), { day: 'numeric', month: 'long', year: 'numeric' });
    });
  }
  renderTimes();

  function applyLive(list) {
    var byTitle = {};
    list.forEach(function (e) { byTitle[norm(e.title)] = e; });
    $$('[data-live]').forEach(function (el) {
      var e = byTitle[norm(el.dataset.live)];
      if (!e) return;
      var meta = e.download_metadata || {}, f = el.dataset.field, v = null;
      if (f === 'updated') { if (e.dateUpdated) el.setAttribute('datetime', e.dateUpdated); return; }
      if (f === 'version') v = e.version;
      if (f === 'size' && meta.TotalSize) v = String(Math.round(meta.TotalSize / 1e9));
      if (f === 'archives' && meta.NumberOfArchives) v = String(meta.NumberOfArchives);
      if (v == null) return;
      if (el.hasAttribute('data-count')) el.dataset.final = v;
      if (el.textContent !== v) {
        el.textContent = v;
        el.classList.remove('is-fresh-value');
        requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add('is-fresh-value'); }); });
      }
    });
    $$('[data-fresh]').forEach(function (el) {
      var e = byTitle[norm(el.dataset.fresh)];
      if (e && e.dateUpdated && (Date.now() - new Date(e.dateUpdated)) < 45 * 86400000) el.hidden = false;
    });
    renderTimes();
  }
  /* Discord members online */
  // The count now shows in the nav on every page: cache it 5 minutes per tab.
  function showDiscord(n) {
    $$('[data-discord-count]').forEach(function (el) { el.textContent = n.toLocaleString(lang()); });
    $$('[data-discord-online]').forEach(function (el) { el.hidden = false; });
    $$('[data-discord-fallback]').forEach(function (el) { el.hidden = true; });
    $$('.nav__cta').forEach(function (a) {
      a.setAttribute('aria-label', 'Discord, ' + n + (lang() === 'fr' ? ' membres en ligne' : ' members online'));
    });
  }
  /* Live data: /api/live (functions/api/live.js on Cloudflare) answers with the lists and the
     Discord count in one same-site request; GitHub and Discord are only called directly when it is
     missing (local dev server) or fails. Cached per tab: lists 10 min, Discord 5 min. */
  var slimLists = function (d) {
    return d.map(function (e) { return { title: e.title, version: e.version, dateUpdated: e.dateUpdated, download_metadata: e.download_metadata }; });
  };
  var gotLists = function (list) { store.set('taf-live', JSON.stringify({ t: Date.now(), d: list }), sessionStorage); applyLive(list); };
  var gotDiscord = function (n) { store.set('taf-discord', JSON.stringify({ t: Date.now(), n: n }), sessionStorage); showDiscord(n); };
  var needLists = false, needDiscord = false;
  if ($('[data-live], [data-fresh]')) {
    var cached = store.get('taf-live', sessionStorage);
    try { cached = cached && JSON.parse(cached); } catch (e) { cached = null; }
    if (cached && Date.now() - cached.t < 10 * 60 * 1000) applyLive(cached.d); else needLists = true;
  }
  if ($('[data-discord-online]')) {
    var dc = null;
    try { dc = JSON.parse(store.get('taf-discord', sessionStorage)); } catch (e) {}
    if (dc && Date.now() - dc.t < 5 * 60 * 1000) showDiscord(dc.n); else needDiscord = true;
  }
  var direct = function () {
    if (needLists) fetch(MODLIST_JSON, { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { if (Array.isArray(d)) gotLists(slimLists(d)); }).catch(function () {});
    if (needDiscord) fetch('https://discord.com/api/guilds/' + DISCORD_ID + '/widget.json')
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { if (d && d.presence_count) gotDiscord(d.presence_count); }).catch(function () {});
  };
  if (needLists || needDiscord) fetch(base + '/api/live')
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (d) {
      if (!d) return direct();
      if (needLists && Array.isArray(d.modlists)) { gotLists(slimLists(d.modlists)); needLists = false; }
      if (needDiscord && d.discord && d.discord.online) { gotDiscord(d.discord.online); needDiscord = false; }
      if (needLists || needDiscord) direct();
    }).catch(direct);

  /* =========================================================
     Docs sidebar + section outline
     ========================================================= */
  var side = $('[data-side]');
  if (side) {
    var toggleSide = overlay(side);
    matchMedia('(min-width: 961px)').addEventListener('change', function (m) { if (m.matches) toggleSide(false); });
    $$('[data-side-open]').forEach(function (b) { b.addEventListener('click', function () { toggleSide(true); }); });
    $$('[data-side-close]').forEach(function (b) { b.addEventListener('click', function () { toggleSide(false); }); });
    side.addEventListener('click', function (e) { if (e.target.closest('a')) toggleSide(false); });
  }
  var tocObserver;
  function buildToc() {
    var list = $('[data-side-toc]');
    if (!list) return;
    // No offsetParent / innerText here: both force a layout of the whole page
    var cur = lang();
    var heads = $$('.prose h2[id]').filter(function (h) {
      var block = h.parentNode.closest('[lang]');
      return (!block || block === root || block.getAttribute('lang') === cur) && !h.classList.contains('is-dup') && !h.closest('details, .doc-cta');
    });
    list.innerHTML = '';
    if (tocObserver) tocObserver.disconnect();
    var map = {};
    heads.forEach(function (h) {
      var a = document.createElement('a');
      // Heading text without the other language's span and the anchor (no layout read, unlike innerText)
      var c = h.cloneNode(true);
      $$('[lang]:not([lang="' + cur + '"]), .anchor', c).forEach(function (x) { x.remove(); });
      a.href = '#' + h.id; a.textContent = c.textContent.replace(/\s+/g, ' ').trim();
      var li = document.createElement('li'); li.appendChild(a); list.appendChild(li);
      map[h.id] = a;
    });
    if (!heads.length) return;
    tocObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        $$('a', list).forEach(function (a) { a.classList.remove('is-active'); a.removeAttribute('aria-current'); });
        if (map[en.target.id]) { map[en.target.id].classList.add('is-active'); map[en.target.id].setAttribute('aria-current', 'location'); }
      });
    }, { rootMargin: '-90px 0px -65% 0px' });
    heads.forEach(function (h) { tocObserver.observe(h); });
  }
  buildToc();

  /* =========================================================
     Search (Ctrl+K or /)
     ========================================================= */
  var dlg = $('#search'), input = $('#search-input'), results = $('#search-results'), status = $('#search-status'), index = null, active = 0;
  var say = function (msg) { if (status) status.textContent = msg; };
  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var low = function (s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };
  function openSearch() {
    if (!dlg) return;
    if (drawer) drawer.classList.remove('is-open');
    dlg.showModal(); input.value = ''; results.innerHTML = ''; input.focus();
    var qk = $('[data-search-quick]'); if (qk) qk.hidden = false;
    if (!index) fetch(base + '/search.json').then(function (r) { return r.json(); }).then(function (d) { index = d; run(); });
  }
  function run() {
    var q = low(input.value.trim());
    var quick = $('[data-search-quick]');
    if (quick) quick.hidden = !!q;
    if (!index || !q) { results.innerHTML = ''; say(''); return; }
    // Score: a term in the title, list name or URL counts most, then how often it appears in the text
    // of the visitor's language; pages of the list being read come first.
    var terms = q.split(/\s+/), hits = [], fr = lang() === 'fr';
    var here = (location.pathname.slice(base.length).match(/^\/([^/]+)\//) || [])[1];
    index.forEach(function (p, n) {
      var body = fr && p.y ? p.y : p.x, title = fr && p.f ? p.f : p.t;
      var t = low(p.t + ' ' + (p.f || '') + ' ' + p.s + ' ' + p.u.replace(/[/_-]/g, ' ')), x = low(body), score = 0;
      for (var i = 0; i < terms.length; i++) {
        // titles also match on a rough stem ("update" finds "Updating the List")
        var stem = terms[i].length > 4 ? terms[i].replace(/(?:ing|es|e|s)$/, '') : terms[i];
        var inT = t.indexOf(stem) !== -1, c = x.split(terms[i]).length - 1;
        if (!inT && !c) return;
        score += (inT ? 10 : 0) + (c ? 1 + Math.min(5, Math.log2(c)) : 0);
      }
      if (here && p.u.indexOf('/' + here + '/') === 0) score += 4;
      var pos = x.indexOf(terms[0]);
      var snip = pos === -1 ? body.slice(0, 120) : (pos > 40 ? '…' : '') + body.slice(Math.max(0, pos - 40), pos + 100);
      hits.push({ p: p, title: title, score: score, snip: snip, n: n });
    });
    hits.sort(function (a, b) { return b.score - a.score || a.n - b.n; });
    active = 0;
    var re = new RegExp('(' + terms.map(function (t) { return t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('|') + ')', 'gi');
    results.innerHTML = hits.length ? hits.slice(0, 12).map(function (h, i) {
      return '<li><a href="' + base + h.p.u + '"' + (i === 0 ? ' class="is-active"' : '') + '><span class="r-title">' + esc(h.title) + '</span>' +
        (h.p.s ? '<span class="r-sec">' + esc(h.p.s) + '</span>' : '') +
        '<span class="r-snip">' + esc(h.snip).replace(re, '<mark>$1</mark>') + '</span></a></li>';
    }).join('') : '<li class="r-empty">' + (lang() === 'fr' ? 'Rien trouvé.' : 'Nothing found.') + '</li>';
    var n = Math.min(hits.length, 12);
    say(lang() === 'fr' ? (n ? n + ' résultat' + (n > 1 ? 's' : '') + ', flèches haut et bas pour choisir' : 'Aucun résultat')
      : (n ? n + ' result' + (n > 1 ? 's' : '') + ', use up and down arrows to choose' : 'No results'));
  }
  if (dlg) {
    input.addEventListener('input', run);
    input.addEventListener('keydown', function (e) {
      var items = $$('a', results);
      if (!items.length) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        items[active].classList.remove('is-active');
        active = (active + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
        items[active].classList.add('is-active');
        items[active].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter') { location.href = items[active].href; }
    });
    dlg.addEventListener('click', function (e) {
      if (e.target === dlg) dlg.close();
      var q = e.target.closest('[data-q]');
      if (q) { input.value = q.getAttribute('data-q'); run(); input.focus(); }
    });
  }
  $$('[data-search-open]').forEach(function (b) { b.addEventListener('click', openSearch); });
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openSearch(); }
    else if (e.key === '/' && !/input|textarea|select/i.test(document.activeElement.tagName)) { e.preventDefault(); openSearch(); }
  });

  /* =========================================================
     FAQ search, gallery filters, embeds, bug report
     ========================================================= */
  var faqSearch = $('[data-faq-search]');
  if (faqSearch) faqSearch.addEventListener('input', function () {
    var q = low(faqSearch.value.trim()), shown = 0;
    $$('.faq__item').forEach(function (it) {
      var ok = !q || low(it.textContent).indexOf(q) !== -1;
      it.hidden = !ok;
      if (ok && it.offsetParent !== null) shown++;
    });
    var empty = $('[data-faq-empty]');
    if (empty) empty.hidden = shown > 0;
  });

  $$('[data-filter-group]').forEach(function (group) {
    var items = $$('[data-modlist]', group.nextElementSibling);
    group.addEventListener('click', function (e) {
      var b = e.target.closest('[data-filter]');
      if (!b) return;
      $$('[data-filter]', group).forEach(function (x) { x.classList.toggle('is-active', x === b); });
      var f = b.getAttribute('data-filter');
      items.forEach(function (it) { it.hidden = f !== 'all' && it.getAttribute('data-modlist') !== f; });
    });
  });

  $$('[data-embed-full]').forEach(function (b) {
    b.addEventListener('click', function () {
      var el = b.closest('[data-embed]');
      if (document.fullscreenElement) document.exitFullscreen();
      else if (el.requestFullscreen) el.requestFullscreen();
    });
  });

  var bug = $('[data-bug]');
  if (bug) {
    var form = $('form', bug), pre = $('[data-bug-preview]', bug);
    var render = function () {
      var f = form.elements;
      pre.textContent = '**' + (f.type.value || 'Bug report') + (f.project.value ? ' / ' + f.project.value : '') + '**\n' +
        (f.contact.value ? 'From: ' + f.contact.value + '\n' : '') +
        (f.title.value ? 'Summary: ' + f.title.value + '\n' : '') +
        (f.details.value ? '\n' + f.details.value + '\n' : '') +
        (f.links.value ? '\nLinks:\n' + f.links.value.split('\n').filter(Boolean).map(function (l) { return '- ' + l; }).join('\n') : '');
    };
    form.addEventListener('input', render);
    // Send: POST /api/report (functions/api/report.js) forwards the report to the Discord channel.
    // When it is not available (local server, not configured), the preview below stays the way out.
    var opened = Date.now(), sending = false;
    var bugStatus = $('[data-bug-status]', bug), sendBtn = $('[data-bug-send]', bug);
    var bugSay = function (en, fr, kind) { bugStatus.textContent = lang() === 'fr' ? fr : en; bugStatus.dataset.kind = kind || ''; };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (sending) return;
      var f = form.elements;
      if (f.title.value.trim().length < 5 || f.details.value.trim().length < 20) {
        bugSay('Add a summary (5 characters or more) and some details (20 or more).', 'Ajoutez un résumé (5 caractères ou plus) et des détails (20 ou plus).', 'error');
        return;
      }
      sending = true; sendBtn.disabled = true;
      bugSay('Sending…', 'Envoi…');
      fetch(base + '/api/report', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: f.title.value, type: f.type.value, project: f.project.value, contact: f.contact.value,
          details: f.details.value, links: f.links.value, website: f.website.value, elapsed: Date.now() - opened })
      }).then(function (r) { return r.json().catch(function () { return { ok: false }; }).then(function (d) { return { status: r.status, d: d }; }); })
        .then(function (res) {
          if (res.d && res.d.ok) {
            bugSay('Sent. Thanks! Answers come in the support channel on Discord.', 'Envoyé, merci ! Les réponses arrivent dans le canal de support du Discord.', 'ok');
            form.reset(); render(); opened = Date.now();
          } else if (res.status === 429) {
            bugSay('Too many reports right now. Wait a minute and send again.', 'Trop d\'envois pour le moment. Attendez une minute puis renvoyez.', 'error');
          } else {
            bugSay('Sending is not available. Copy the preview below and post it in the support channel.', 'L\'envoi n\'est pas disponible. Copiez l\'aperçu ci-dessous et publiez-le dans le canal de support.', 'error');
          }
        })
        .catch(function () { bugSay('Sending failed. Copy the preview below and post it on Discord.', 'L\'envoi a échoué. Copiez l\'aperçu ci-dessous et publiez-le sur Discord.', 'error'); })
        .then(function () { sending = false; sendBtn.disabled = false; });
    });
    render();
    $('[data-bug-copy]', bug).addEventListener('click', function (e) {
      var btn = e.currentTarget, label = btn.innerHTML;
      if (navigator.clipboard) navigator.clipboard.writeText(pre.textContent).then(function () {
        btn.textContent = '✓';
        setTimeout(function () { btn.innerHTML = label; }, 1500);
      });
    });
  }

  /* Reveal on scroll */
  if ('IntersectionObserver' in window && !calm) {
    var els = $$('.band, .tier, .cta, .masonry__item, .shots, .section-title, .stats');
    els.forEach(function (el) { el.classList.add('reveal'); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* The previous site registered a caching service worker: remove it. */
  if ('serviceWorker' in navigator) navigator.serviceWorker.getRegistrations().then(function (rs) { rs.forEach(function (r) { r.unregister(); }); }).catch(function () {});
})();

/* =====================================================================
   Enhancements: lightbox, anchors, code copy, changelog tools,
   guide progress, page transitions
   ===================================================================== */
(function () {
  'use strict';
  var root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lang = function () { return root.getAttribute('data-lang') === 'fr' ? 'fr' : 'en'; };
  var tr = function (en, fr) { return lang() === 'fr' ? fr : en; };
  var low = function (s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };
  var refreshers = [];
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-lang-toggle]')) setTimeout(function () { refreshers.forEach(function (f) { f(); }); }, 0);
  });

  /* Toast */
  function toast(msg) {
    var t = $('[data-toast]');
    if (!t) return;
    t.textContent = msg; t.classList.add('is-on');
    clearTimeout(t._t); t._t = setTimeout(function () { t.classList.remove('is-on'); }, 1800);
  }

  /* ---------- Lightbox with navigation ---------- */
  $$('.prose img').forEach(function (img) {
    if (img.closest('a, button, .shots, .doc-cta')) return;
    // Thumbnails carry their full-size original in data-zoom already
    if (!img.hasAttribute('data-zoom')) img.setAttribute('data-zoom', img.getAttribute('src'));
    img.classList.add('is-zoomable');
  });
  var lb = $('#lightbox');
  if (lb && lb.showModal) {
    var lbImg = $('[data-lb-img]', lb), lbCap = $('[data-lb-cap]', lb), lbCount = $('[data-lb-count]', lb);
    var group = [], idx = 0;
    var altOf = function (el) { return el.tagName === 'IMG' ? el.alt : (($('img', el) || {}).alt || ''); };
    var show = function (i) {
      idx = (i + group.length) % group.length;
      var el = group[idx], src = el.getAttribute('data-zoom');
      lbImg.classList.remove('is-in');
      var pre = new Image();
      pre.onload = pre.onerror = function () {
        lbImg.src = src; lbImg.alt = altOf(el);
        requestAnimationFrame(function () { lbImg.classList.add('is-in'); });
      };
      pre.src = src;
      // Caption: the picture's text, then author, list and Discord link for community screenshots
      lbCap.textContent = '';
      var capT = document.createElement('span'); capT.className = 'lightbox__title'; capT.textContent = altOf(el); lbCap.appendChild(capT);
      var who = el.getAttribute('data-lb-author'), list = el.getAttribute('data-lb-list'), link = el.getAttribute('data-lb-link');
      if (who || list || link) {
        var meta = document.createElement('span'); meta.className = 'lightbox__meta';
        if (who) { var a1 = document.createElement('span'); a1.textContent = tr('By ', 'Par ') + who; meta.appendChild(a1); }
        if (list) { var a2 = document.createElement('span'); a2.textContent = list; meta.appendChild(a2); }
        if (link && /^https:\/\/discord\.com\//.test(link)) {
          var a3 = document.createElement('a'); a3.href = link; a3.target = '_blank'; a3.rel = 'noopener noreferrer';
          a3.textContent = tr('See on Discord', 'Voir sur Discord') + ' \u2197'; meta.appendChild(a3);
        }
        lbCap.appendChild(meta);
      }
      lbCount.textContent = (idx + 1) + ' / ' + group.length;
      lb.classList.toggle('is-single', group.length < 2);
      [idx + 1, idx - 1].forEach(function (j) { var n = group[(j + group.length) % group.length]; if (n) new Image().src = n.getAttribute('data-zoom'); });
    };
    document.addEventListener('click', function (e) {
      var z = e.target.closest('[data-zoom]');
      if (!z) return;
      e.preventDefault();
      var scope = z.closest('.masonry, .shots__grid, .prose') || document;
      group = $$('[data-zoom]', scope).filter(function (x) { return x.offsetParent !== null; });
      if (!group.length) group = [z];
      lb.showModal(); show(Math.max(0, group.indexOf(z)));
    });
    $('[data-lb-prev]', lb).addEventListener('click', function () { show(idx - 1); });
    $('[data-lb-next]', lb).addEventListener('click', function () { show(idx + 1); });
    $('[data-lb-close]', lb).addEventListener('click', function () { lb.close(); });
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('lightbox__stage')) lb.close(); });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
    var sx = null;
    lb.addEventListener('pointerdown', function (e) { sx = e.clientX; });
    lb.addEventListener('pointerup', function (e) {
      if (sx === null) return;
      var dx = e.clientX - sx; sx = null;
      if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
    });
  }

  /* ---------- Section anchors (click = copy link) ---------- */
  var anchorLabel = function () {
    $$('.anchor').forEach(function (a) { a.setAttribute('aria-label', tr('Copy the link to this section', 'Copier le lien de cette section')); });
  };
  refreshers.push(anchorLabel);
  $$('.prose h2[id], .prose h3[id]').forEach(function (h) {
    if (h.closest('details, .doc-cta') || h.classList.contains('is-dup')) return;
    var a = document.createElement('a');
    a.href = '#' + h.id; a.className = 'anchor';
    a.addEventListener('click', function (e) {
      e.preventDefault();
      history.replaceState(null, '', '#' + h.id);
      h.scrollIntoView({ behavior: calm ? 'auto' : 'smooth' });
      if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(function () { toast(tr('Link copied', 'Lien copié')); });
    });
    h.appendChild(a);
  });
  anchorLabel();

  /* ---------- Copy buttons on code blocks ---------- */
  $$('.prose pre').forEach(function (pre) {
    var text = pre.textContent;
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'copy';
    var label = function () { b.textContent = tr('Copy', 'Copier'); };
    label(); refreshers.push(label);
    b.addEventListener('click', function () {
      if (navigator.clipboard) navigator.clipboard.writeText(text.trim()).then(function () { toast(tr('Copied', 'Copié')); });
    });
    pre.appendChild(b);
  });

  /* ---------- Changelog tools ---------- */
  // Summaries, the open latest version and the tools bar are rendered by build.mjs
  // (changelogStatic), so nothing moves after load; this only wires search and expand-all.
  var tools = $('[data-cl-tools]');
  var logs = tools ? $$('details', tools.parentNode).filter(function (d) { return d.parentNode === tools.parentNode; }) : [];
  if (tools && logs.length) {
    var q = $('[data-cl-q]', tools), found = $('[data-cl-found]', tools), all = $('[data-cl-all]', tools), allOpen = false;
    var labels = function () {
      q.placeholder = tr('Find a mod in the changelog…', 'Chercher un mod dans le changelog…');
      q.setAttribute('aria-label', q.placeholder);
      all.setAttribute('aria-expanded', allOpen);
      all.textContent = allOpen ? tr('Collapse all', 'Tout replier') : tr('Expand all', 'Tout déplier');
    };
    labels(); refreshers.push(labels);
    all.addEventListener('click', function () {
      allOpen = !allOpen;
      logs.forEach(function (d, i) { if (!d.hidden) d.open = allOpen || (!q.value && i === 0); });
      labels();
    });
    var filter = function () {
      var v = low(q.value.trim()), n = 0;
      $$('.cl-hit', tools.parentNode).forEach(function (x) { x.classList.remove('cl-hit'); });
      logs.forEach(function (d, i) {
        if (!v) { d.hidden = false; d.open = allOpen || i === 0; return; }
        var lis = $$('li', d).filter(function (li) { return low(li.textContent).indexOf(v) !== -1; });
        var ok = lis.length > 0 || low($('summary', d).textContent).indexOf(v) !== -1;
        d.hidden = !ok; d.open = ok;
        lis.forEach(function (li) { li.classList.add('cl-hit'); });
        if (ok) n++;
      });
      found.textContent = v ? (n ? n + ' ' + tr(n > 1 ? 'versions' : 'version', n > 1 ? 'versions' : 'version') : tr('No match', 'Aucun résultat')) : '';
    };
    var tq;
    q.addEventListener('input', function () { clearTimeout(tq); tq = setTimeout(filter, 120); });
    refreshers.push(filter);
  }


  /* ---------- YouTube: load the player only when asked (see youtubeFacade in build.mjs) ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a.yt[data-yt]');
    if (!a || e.ctrlKey || e.metaKey || e.shiftKey || e.button > 0) return;
    e.preventDefault();
    var f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(a.getAttribute('data-yt')) + '?autoplay=1&rel=0';
    f.title = tr('YouTube video', 'Vidéo YouTube');
    f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    f.allowFullscreen = true;
    f.className = 'yt yt--live';
    a.replaceWith(f);
    f.focus();
  });


  /* Read marks and step ticks were removed (Nov 2026): clear what older versions stored */
  try { localStorage.removeItem('taf-read'); localStorage.removeItem('taf-ticks'); } catch (e) {}

  /* ---------- Glossary tooltips: keep the bubble in the window, Escape closes it ----------
     Layout is only read when a term is hovered or focused, never while the page loads. */
  var placeTip = function (gl) {
    var t = $('.gl__tip', gl);
    if (!t) return;
    t.style.setProperty('--dx', '0px'); gl.classList.remove('is-below', 'is-off');
    var r = t.getBoundingClientRect(), pad = 12, dx = 0;
    if (r.left < pad) dx = pad - r.left;
    else if (r.right > innerWidth - pad) dx = innerWidth - pad - r.right;
    if (dx) t.style.setProperty('--dx', Math.round(dx) + 'px');
    if (r.top < 84) gl.classList.add('is-below');
  };
  document.addEventListener('mouseover', function (e) {
    var g = e.target.closest && e.target.closest('.gl');
    if (g && !g.contains(e.relatedTarget)) placeTip(g);
  });
  document.addEventListener('focusin', function (e) { if (e.target.classList && e.target.classList.contains('gl')) placeTip(e.target); });
  document.addEventListener('mouseout', function (e) {
    var g = e.target.closest && e.target.closest('.gl');
    if (g && !g.contains(e.relatedTarget)) g.classList.remove('is-off');
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    $$('.gl:hover, .gl:focus').forEach(function (g) { g.classList.add('is-off'); });
  });

  /* ---------- Keyboard maps: the legend buttons show one category at a time ---------- */
  $$('[data-kbmap]').forEach(function (map) {
    map.addEventListener('click', function (e) {
      var b = e.target.closest('[data-kb-cat]');
      if (!b) return;
      var cat = b.getAttribute('data-kb-cat');
      if (cat && map.getAttribute('data-show') === cat) cat = ''; // a second click shows everything again
      if (cat) map.setAttribute('data-show', cat); else map.removeAttribute('data-show');
      $$('[data-kb-cat]', map).forEach(function (x) { x.setAttribute('aria-pressed', String(x.getAttribute('data-kb-cat') === cat)); });
    });
  });
  /* ---------- Mod contents, install estimator, authors wall (layouts and figures from scripts/contents.mjs) ---------- */
  var fmtB = function (b, L) {
    var fr = (L || lang()) === 'fr', v, u;
    if (b >= 999.5e6) { v = b / 1e9; u = fr ? 'Go' : 'GB'; } else if (b >= 999.5e3) { v = b / 1e6; u = fr ? 'Mo' : 'MB'; } else { v = b / 1e3; u = fr ? 'ko' : 'KB'; }
    var s = v >= 100 ? String(Math.round(v)) : v.toFixed(1).replace(/\.0$/, '');
    return (fr ? s.replace('.', ',') : s) + ' ' + u;
  };
  var fmtN = function (n, L) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, (L || lang()) === 'fr' ? ' ' : ','); };
  var escH = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); };
  var nexusUrl = function (s) { return 'https://www.nexusmods.com/' + s.replace('/', '/mods/'); };
  var getJson = function (url) { return fetch(url).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }); };

  $$('[data-tmap]').forEach(function (w) {
    var map = $('.tm', w), panel = $('[data-tm-panel]', w), id = w.getAttribute('data-tmap');
    var data = null, loading = null, cur = null, timer = 0;
    // Labels only where they fit: all reads first, then all writes
    function fit() {
      var cells = $$('.tm__c', map);
      var sizes = cells.map(function (c) { return [c.offsetWidth, c.offsetHeight]; });
      cells.forEach(function (c, i) {
        var s = sizes[i], f = s[0] >= 78 && s[1] >= 40 ? 2 : s[0] >= 46 && s[1] >= 20 ? 1 : 0;
        c.classList.toggle('is-lab', f === 2); c.classList.toggle('is-name', f === 1);
      });
    }
    requestAnimationFrame(fit);
    addEventListener('resize', function () { clearTimeout(timer); timer = setTimeout(fit, 150); });
    $$('.tm-seg', w).forEach(function (b) {
      b.addEventListener('click', function () {
        map.classList.add('is-anim');
        map.setAttribute('data-m', b.getAttribute('data-metric'));
        $$('.tm-seg', w).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        setTimeout(fit, calm ? 0 : 600);
      });
    });
    function render() {
      if (!data || !cur) return;
      var g = data.g[cur[0]], s = g && g.s[cur[1]];
      if (!s) return;
      var bytes = 0;
      var items = s.m.map(function (m) {
        bytes += m[3];
        var name = m[2] ? '<a href="' + nexusUrl(m[2]) + '" target="_blank" rel="noopener">' + escH(m[0]) + '</a>' : escH(m[0]);
        return '<li><span>' + name + '</span><span class="tm-mods__s">' + fmtB(m[3]) + '</span>' +
          (m[1] ? '<span class="tm-mods__a">' + escH(m[1]) + '</span>' : '') + '</li>';
      }).join('');
      panel.innerHTML = '<p class="tm-panel__crumb">' + escH(g.n) + '</p><h3>' + escH(s.n === g.n && g.s.length === 1 ? tr('All mods', 'Tous les mods') : s.n) + '</h3>' +
        '<p class="tm-panel__meta">' + fmtN(s.m.length) + ' mods · ' + fmtB(bytes) + ' · ' + tr('in Mod Organizer order', 'dans l’ordre de Mod Organizer') + '</p>' +
        '<ul class="tm-mods">' + items + '</ul>';
    }
    function show(gi, si, scroll) {
      cur = [gi, si];
      $$('.tm__c.is-sel', map).forEach(function (x) { x.classList.remove('is-sel'); });
      var cell = $('.tm__c[data-g="' + gi + '"][data-s="' + si + '"]', map);
      if (cell) cell.classList.add('is-sel');
      if (!loading) loading = getJson('/assets/data/contents-' + id + '.json');
      loading.then(function (d) {
        data = d; render();
        if (scroll) panel.scrollIntoView({ block: 'start', behavior: calm ? 'auto' : 'smooth' });
      }).catch(function () {
        loading = null;
        panel.innerHTML = '<p class="tm-panel__hint">' + tr('The mod list could not be loaded. Try again in a moment.', 'La liste des mods n’a pas pu être chargée. Réessayez dans un instant.') + '</p>';
      });
    }
    w.addEventListener('click', function (e) {
      var b = e.target.closest('.tm__c, .tm-list__s');
      if (!b) return;
      var fromList = b.classList.contains('tm-list__s');
      show(+b.getAttribute('data-g'), +b.getAttribute('data-s'), fromList || panel.getBoundingClientRect().top > innerHeight * 0.75);
    });
    refreshers.push(render);
  });

  /* Install time estimator: same formula as estimate() in scripts/contents.mjs */
  var ests = $$('[data-est]');
  if (ests.length) {
    var EST_KEY = 'taf-est';
    var state = { mbit: 100, acc: 'premium', disk: 'nvme' };
    try { var saved = JSON.parse(localStorage.getItem(EST_KEY) || 'null'); if (saved && saved.mbit) state = saved; } catch (e) { /* storage blocked */ }
    var dur = function (sec, L) {
      var fr = L === 'fr';
      if (sec < 3600) return Math.max(1, Math.round(sec / 60)) + ' min';
      var h = sec / 3600;
      if (h >= 48) { var dd = (h / 24).toFixed(1).replace(/\.0$/, ''); return (fr ? dd.replace('.', ',') : dd) + ' ' + (fr ? 'jours' : 'days'); }
      var hh = Math.floor(h), mm = Math.round((h - hh) * 60 / 5) * 5;
      return mm === 60 ? (hh + 1) + ' h' : mm ? hh + ' h ' + (mm < 10 ? '0' : '') + mm : hh + ' h';
    };
    var paint = function (el) {
      var c = JSON.parse(el.getAttribute('data-est')), L = el.getAttribute('data-lang');
      var d = { nxN: +el.getAttribute('data-nxn'), nxB: +el.getAttribute('data-nxb'), otB: +el.getAttribute('data-otb'), inst: +el.getAttribute('data-inst') };
      var line = state.mbit / 8 * (c.e || 0.85) * 1e6, total = d.nxB + d.otB, dl, cap = 0;
      if (state.acc === 'premium') dl = total / line;
      else {
        cap = (state.acc === 'adblock' ? c.a : c.f) * 1e6;
        dl = Math.max(d.nxB / Math.min(cap, line), total / line, d.nxN * (c.k || 10));
      }
      var inst = d.inst / ((c.i[state.disk] || 30) * 1e6);
      $('[data-est-dl]', el).textContent = '≈ ' + dur(dl, L);
      $('[data-est-in]', el).textContent = '≈ ' + dur(inst, L);
      $('[data-est-tot]', el).textContent = '≈ ' + dur(dl + inst, L);
      var capTxt = String(cap / 1e6).replace('.', L === 'fr' ? ',' : '.');
      $('[data-est-note]', el).textContent = state.acc === 'premium'
        ? (L === 'fr' ? 'Les ' + fmtN(d.nxN, L) + ' fichiers Nexus se téléchargent tout seuls.' : 'All ' + fmtN(d.nxN, L) + ' Nexus files download on their own.')
        : (L === 'fr' ? 'Sans Premium, vous cliquez sur « Slow download » une fois par fichier Nexus : ' + fmtN(d.nxN, L) + ' clics, avec un débit Nexus limité à ' + capTxt + ' Mo/s.'
          : 'Without Premium you click "Slow download" once per Nexus file: ' + fmtN(d.nxN, L) + ' clicks, with Nexus downloads capped at ' + capTxt + ' MB/s.');
      var sp = $('[data-est-speed]', el);
      if (document.activeElement !== sp) sp.value = state.mbit;
      $$('input[type=radio]', el).forEach(function (r) { r.checked = state[r.name.split('-').pop()] === r.value; });
    };
    var paintAll = function () { ests.forEach(paint); };
    var save = function () { try { localStorage.setItem(EST_KEY, JSON.stringify(state)); } catch (e) { /* storage blocked */ } };
    ests.forEach(function (el) {
      el.addEventListener('input', function (e) {
        var t = e.target;
        if (t.matches('[data-est-speed]')) { var v = parseFloat(t.value); if (!(v > 0)) return; state.mbit = Math.min(10000, v); }
        else if (t.type === 'radio') state[t.name.split('-').pop()] = t.value;
        else return;
        save(); paintAll();
      });
      el.addEventListener('click', function (e) {
        var b = e.target.closest('[data-est-preset]');
        if (!b) return;
        state.mbit = +b.getAttribute('data-est-preset');
        save(); paintAll();
      });
    });
    paintAll();
  }

  /* Authors wall: search, filter by list, the mods of one author in a dialog */
  var aw = $('[data-authors]');
  if (aw) {
    var q = $('[data-aw-q]', aw), countEl = $('[data-aw-count]', aw), dlg = $('[data-aw-dlg]', aw);
    var people = $$('.aw__grid .aw__a', aw), secs = $$('.aw__sec', aw), chips = $$('.aw-chip', aw);
    var pick = 'all', authors = null, loadingA = null, openIdx = -1;
    people.forEach(function (b) { b._k = low($('.aw__name', b).textContent); b._l = ' ' + b.getAttribute('data-l') + ' '; });
    var filter = function () {
      var term = low(q.value.trim()), n = 0;
      people.forEach(function (b) {
        var ok = (!term || b._k.indexOf(term) !== -1) && (pick === 'all' || b._l.indexOf(' ' + pick + ' ') !== -1);
        b.hidden = !ok; if (ok) n++;
      });
      secs.forEach(function (s) { s.hidden = !$('.aw__a:not([hidden])', s); });
      countEl.textContent = fmtN(n) + ' ' + (n === 1 ? tr('author', 'auteur') : tr('authors', 'auteurs'));
    };
    var choose = function (chip) {
      pick = chip.getAttribute('data-list');
      chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
      var id = chip.getAttribute('data-id');
      try { history.replaceState(null, '', id ? '?list=' + encodeURIComponent(id) : location.pathname); } catch (e) { /* file:// */ }
      filter();
    };
    chips.forEach(function (c) { c.addEventListener('click', function () { choose(c); }); });
    q.addEventListener('input', filter);
    var want = new URLSearchParams(location.search).get('list');
    var preset = want && chips.filter(function (c) { return c.getAttribute('data-id') === want; })[0];
    if (preset) choose(preset); else filter();

    var renderDlg = function () {
      if (openIdx < 0 || !authors) return;
      var a = authors.a[openIdx];
      $('[data-aw-t]', dlg).textContent = a[0];
      var html = '<p>' + fmtN(a[1].length) + ' ' + (a[1].length === 1 ? tr('mod page on Nexus Mods', 'page de mod sur Nexus Mods') : tr('mod pages on Nexus Mods', 'pages de mods sur Nexus Mods')) + '</p>';
      authors.l.forEach(function (title, li) {
        var mods = a[1].filter(function (m) { return m[2].indexOf(li) !== -1; });
        if (!mods.length) return;
        html += '<p class="aw-dlg__list">' + escH(title) + '</p><ul>' + mods.map(function (m) {
          return '<li><a href="' + nexusUrl(m[1]) + '" target="_blank" rel="noopener">' + escH(m[0]) + '</a></li>';
        }).join('') + '</ul>';
      });
      $('[data-aw-body]', dlg).innerHTML = html;
    };
    var openDlg = function (idx, name) {
      openIdx = idx;
      $('[data-aw-t]', dlg).textContent = name;
      $('[data-aw-body]', dlg).innerHTML = '<p>' + tr('Loading…', 'Chargement…') + '</p>';
      if (dlg.showModal) { if (!dlg.open) dlg.showModal(); } else dlg.setAttribute('open', '');
      if (!loadingA) loadingA = getJson('/assets/data/authors.json');
      loadingA.then(function (d) { authors = d; renderDlg(); }).catch(function () {
        loadingA = null;
        $('[data-aw-body]', dlg).innerHTML = '<p>' + tr('The list could not be loaded. Try again in a moment.', 'La liste n’a pas pu être chargée. Réessayez dans un instant.') + '</p>';
      });
    };
    var closeDlg = function () { openIdx = -1; if (dlg.close) dlg.close(); else dlg.removeAttribute('open'); };
    aw.addEventListener('click', function (e) {
      var b = e.target.closest('.aw__a');
      if (b) { openDlg(+b.getAttribute('data-a'), $('.aw__name', b).textContent); return; }
      if (e.target.closest('[data-aw-close]') || e.target === dlg) closeDlg();
    });
    dlg.addEventListener('close', function () { openIdx = -1; });
    refreshers.push(filter, renderDlg);
  }
  /* ---------- Guided troubleshooting (scripts/troubleshoot.mjs renders every node; this shows one at a time) ---------- */
  $$('[data-ts]').forEach(function (ts) {
    var path = $('[data-ts-path]', ts), back = $('[data-ts-back]', ts), restart = $('[data-ts-restart]', ts);
    var hist = []; // [{node, label}]
    var show = function (id, focus) {
      $$('.ts__node', ts).forEach(function (n) { n.hidden = n.getAttribute('data-node') !== id; });
      path.innerHTML = hist.map(function (h) { return '<li>' + h.label + '</li>'; }).join('');
      back.hidden = !hist.length; restart.hidden = !hist.length;
      var cur = $('.ts__node[data-node="' + id + '"]', ts);
      if (focus && cur) {
        var target = $('.ts__q, .ts__kicker', cur);
        if (target) { target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); }
        var r = ts.getBoundingClientRect();
        if (r.top < 70 || r.top > innerHeight * 0.6) ts.scrollIntoView({ block: 'start', behavior: calm ? 'auto' : 'smooth' });
      }
    };
    ts.addEventListener('click', function (e) {
      var o = e.target.closest('[data-go]');
      if (o) {
        var from = o.closest('.ts__node').getAttribute('data-node');
        hist.push({ node: from, label: o.innerHTML });
        show(o.getAttribute('data-go'), true);
        return;
      }
      if (e.target.closest('[data-ts-back]') && hist.length) { show(hist.pop().node, true); return; }
      if (e.target.closest('[data-ts-restart]')) { hist = []; show('start', true); }
    });
  });

  /* ---------- Crash log reader: names in the log -> mods of the list (/assets/data/files-<id>.json) ---------- */
  $$('[data-crash]').forEach(function (box) {
    var id = box.getAttribute('data-crash'), game = box.getAttribute('data-game');
    var input = $('[data-cr-in]', box), out = $('[data-cr-out]', box), fileIn = $('[data-cr-file]', box);
    var index = null, lastText = '';
    var load = function () {
      if (!index) index = Promise.all([getJson('/assets/data/files-' + id + '.json'), getJson('/assets/data/contents-' + id + '.json')])
        .then(function (r) {
          var mods = {};
          r[1].g.forEach(function (g) { g.s.forEach(function (s) { s.m.forEach(function (m) { mods[m[0]] = { a: m[1], u: m[2], g: g.n }; }); }); });
          return { files: r[0], mods: mods };
        }).catch(function (e) { index = null; throw e; });
      return index;
    };
    // Game, system and logger files: never a lead by themselves
    var BASE = /^(skyrimse\.exe|skyrim\.esm|update\.esm|dawnguard\.esm|hearthfires\.esm|dragonborn\.esm|cc[a-z]{3}sse\d{3}.*\.es[lm]|skse64_.*\.dll|skse64_loader\.exe|crashlogger\.dll|starfield\.exe|starfield\.esm|constellation\.esm|oldmars\.esm|shatteredspace\.esm|sfbgs.*\.esm|blueprintships-starfield\.esm|sfse_.*\.dll|trainwreck\.dll|cyberpunk2077\.exe|ntdll\.dll|kernel32\.dll|kernelbase\.dll|ucrtbase\.dll|msvcp\d.*\.dll|vcruntime\d.*\.dll|concrt\d+\.dll|user32\.dll|gdi32\.dll|win32u\.dll|combase\.dll|ole32\.dll|oleaut32\.dll|rpcrt4\.dll|sechost\.dll|advapi32\.dll|ws2_32\.dll|bcrypt.*\.dll|crypt.*\.dll|d3d\d+\.dll|d3dcompiler.*\.dll|dxcore\.dll|xinput.*\.dll|dinput8\.dll|winmm\.dll|shell32\.dll|shlwapi\.dll|cfgmgr32\.dll|setupapi\.dll|wintrust\.dll|imm32\.dll|version\.dll|uxtheme\.dll|dwmapi\.dll|powrprof\.dll|dbghelp\.dll|nvapi64\.dll|steam_api64\.dll|gameoverlayrenderer64\.dll|xaudio2_\d\.dll|mf.*\.dll|winhttp\.dll|iphlpapi\.dll|nsi\.dll|msvcrt\.dll|apphelp\.dll|clbcatq\.dll|wldp\.dll|amsi\.dll|dbgcore\.dll|textinputframework\.dll|coremessaging\.dll|coreuicomponents\.dll|wininet\.dll|hid\.dll|devobj\.dll|bink.*\.dll|ffx_.*\.dll|amd_.*\.dll|nvngx.*\.dll|sl\.\w+\.dll|libxess.*\.dll)$/i;
    var GPU = /^(nvwgf2umx|nvwgf2um|nvoglv64|nvgpucomp64|nvldumdx|amdxx64|atidxx64|amdxc64|amdihk64|igd10iumd64|igdumdim64|igc64|igdgmm64)\.dll$/i;
    var WEIGHT = { 'PROBABLE CALL STACK': 5, 'POSSIBLE RELEVANT OBJECTS': 4, 'REGISTERS': 3, 'STACK': 1, HEAD: 4 };
    var LIST_SECTIONS = /^(MODULES|SKSE PLUGINS|PLUGINS|SCRIPT EXTENDER PLUGINS|SFSE PLUGINS|GAME PLUGINS|SYSTEM SPECS|SETTINGS)$/;
    var LABEL = {
      'PROBABLE CALL STACK': ['call stack', 'pile d’appels'], 'POSSIBLE RELEVANT OBJECTS': ['relevant objects', 'objets concernés'],
      REGISTERS: ['registers', 'registres'], STACK: ['stack', 'pile'], HEAD: ['error line', 'ligne d’erreur'], LOG: ['error or warning lines', 'lignes d’erreur ou d’avertissement']
    };

    function analyse(text, idx) {
      var lines = text.split(/\r?\n/), sec = 'HEAD', frame = 0;
      var structured = /^\s*PROBABLE CALL STACK:?\s*$/m.test(text);
      var ERR = /\b(error|errors|warn|warning|fail|failed|fatal|exception|crash|could not|unable)\b|\[(E|W|ERR|WARN)\]/i;
      var hits = {}, head = [], gpu = false, pageFile = null, ram = null, exception = '';
      var add = function (key, where, w) {
        var k = key.toLowerCase().replace(/^.*[\\/]/, '');
        if (GPU.test(k)) { if (where === 'PROBABLE CALL STACK' || where === 'HEAD') gpu = true; return; }
        // A proxy DLL such as dxgi.dll can be a mod (ReShade, ENB): only skip system names the list does not ship
        if (!idx.files[k] && (BASE.test(k) || /^(dxgi|d3d11|d3d12|dinput8|version|winmm)\.dll$/.test(k))) return;
        var h = hits[k] || (hits[k] = { name: key.replace(/^.*[\\/]/, ''), score: 0, where: {} });
        h.score += w; h.where[where] = (h.where[where] || 0) + 1;
      };
      lines.forEach(function (line) {
        var m = structured && /^\s*([A-Z][A-Z0-9 _\-\/]+?)(?:\s*\(\d+\))?:\s*$/.exec(line);
        if (m) { sec = m[1].trim(); frame = 0; return; }
        if (structured && sec === 'HEAD' && head.length < 4 && line.trim()) head.push(line.trim());
        if (/Unhandled exception/i.test(line) && !exception) exception = line.trim();
        if (sec === 'SYSTEM SPECS') {
          var pf = /PAGE FILE:\s*([\d.]+)\s*GiB\s*\/\s*([\d.]+)\s*GiB/i.exec(line); if (pf) pageFile = [+pf[1], +pf[2]];
          var rm = /RAM:\s*([\d.]+)\s*GiB\s*\/\s*([\d.]+)\s*GiB/i.exec(line); if (rm) ram = [+rm[1], +rm[2]];
        }
        if (LIST_SECTIONS.test(sec)) return;
        // Crash logger logs: weight by section. Other logs (RED4ext, redscript, CET) also list every file they
        // load, so only their error and warning lines count.
        var where = structured ? (WEIGHT[sec] != null ? sec : null) : (ERR.test(line) ? 'LOG' : null);
        if (!where) return;
        var w = WEIGHT[where] || 3;
        if (where === 'PROBABLE CALL STACK' && /^\s*\[\s*\d+\s*\]/.test(line)) { frame++; if (frame <= 3) w = 8; }
        // quoted plugin names, names after a path separator (they may hold spaces), bare names, CET mod folders
        var re = /"([^"\r\n]+?\.(?:esp|esm|esl))"|[\\\/]([^\\\/\r\n:"<>|]+?\.(?:dll|asi|esp|esm|esl|archive|reds|xl))\b|([A-Za-z0-9_\-+.]+\.(?:dll|asi|esp|esm|esl|archive|reds|xl))\b|cyber_engine_tweaks[\\\/]mods[\\\/]([^\\\/\r\n]+)[\\\/]/gi, t;
        while ((t = re.exec(line))) add(t[1] || t[2] || t[3] || t[4], where, w);
      });
      var mods = {}, loose = [];
      Object.keys(hits).forEach(function (k) {
        var h = hits[k], folder = idx.files[k];
        if (!folder) { loose.push(h); return; }
        var mo = mods[folder] || (mods[folder] = { folder: folder, score: 0, files: [], where: {} });
        mo.score += h.score; mo.files.push(h.name);
        Object.keys(h.where).forEach(function (s) { mo.where[s] = (mo.where[s] || 0) + h.where[s]; });
      });
      var list = Object.keys(mods).map(function (k) { return mods[k]; }).sort(function (a, b) { return b.score - a.score; });
      loose.sort(function (a, b) { return b.score - a.score; });
      return { structured: structured, head: head, exception: exception, gpu: gpu, pageFile: pageFile, ram: ram, mods: list.slice(0, 10), loose: loose.slice(0, 6), total: list.length };
    }

    function render(r, idx) {
      var fr = lang() === 'fr', h = '';
      if (!r.structured && !r.mods.length && !r.loose.length) {
        out.innerHTML = '<p class="cr__none">' + tr('No crash log section found, and no error or warning line names a file of the list. For a crash log, paste the whole file from the first line.',
          'Aucune section de journal de crash, et aucune ligne d’erreur ou d’avertissement ne cite un fichier de la liste. Pour un journal de crash, collez le fichier entier depuis la première ligne.') + '</p>';
        return;
      }
      if (r.head.length) h += '<div class="cr__head">' + r.head.map(function (l) { return '<code>' + escH(l) + '</code>'; }).join('') + (r.exception && r.head.indexOf(r.exception) === -1 ? '<code>' + escH(r.exception) + '</code>' : '') + '</div>';
      var hints = [];
      if (r.gpu) hints.push(tr('The graphics driver is in the call stack: update it with a clean install, and remove any overclock while you test.',
        'Le pilote graphique est dans la pile d’appels : mettez-le à jour en installation propre, et retirez tout overclocking pendant vos tests.'));
      if (r.pageFile && r.pageFile[1] && r.pageFile[0] / r.pageFile[1] > 0.9) hints.push(tr('The page file was ' + Math.round(r.pageFile[0] / r.pageFile[1] * 100) + '% full: set it as the system requirements page says.',
        'Le fichier d’échange était plein à ' + Math.round(r.pageFile[0] / r.pageFile[1] * 100) + ' % : réglez-le comme l’indique la configuration requise.'));
      if (r.ram && r.ram[1] && r.ram[0] / r.ram[1] > 0.92) hints.push(tr('RAM was almost full when the game crashed.', 'La RAM était presque pleine au moment du plantage.'));
      if (r.structured && !r.mods.length) hints.push(tr('No mod of the list is named in the parts that matter. Such crashes often come from memory, the graphics driver or a broken save: check the page file and the driver, then ask on Discord with the log.',
        'Aucun mod de la liste n’est cité dans les parties utiles. Ces plantages viennent souvent de la mémoire, du pilote graphique ou d’une sauvegarde abîmée : vérifiez le fichier d’échange et le pilote, puis demandez sur Discord avec le journal.'));
      if (hints.length) h += '<ul class="cr__hints">' + hints.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>';
      if (r.mods.length) {
        var max = r.mods[0].score;
        h += '<h3 class="cr__h">' + tr('Mods of the list named in the log', 'Mods de la liste cités dans le journal') + '</h3><ol class="cr__mods">' + r.mods.map(function (m) {
          var info = idx.mods[m.folder] || {};
          var name = info.u ? '<a href="' + nexusUrl(info.u) + '" target="_blank" rel="noopener">' + escH(m.folder) + '</a>' : escH(m.folder);
          var where = Object.keys(m.where).map(function (s) { var l = LABEL[s] || [s, s]; return (fr ? l[1] : l[0]) + ' ×' + m.where[s]; }).join(', ');
          return '<li><span class="cr__score" aria-hidden="true"><i style="width:' + Math.max(6, Math.round(m.score / max * 100)) + '%"></i></span>' +
            '<span class="cr__name">' + name + '</span><span class="cr__meta">' + escH(m.files.slice(0, 4).join(', ')) + (m.files.length > 4 ? '…' : '') +
            (info.g ? ' · ' + escH(info.g) : '') + (info.a ? ' · ' + escH(info.a) : '') + '</span><span class="cr__where">' + where + '</span></li>';
        }).join('') + '</ol>';
      }
      if (r.loose.length) h += '<p class="cr__loose">' + tr('Named in the log but not part of the list (a mod you added, or a program running next to the game): ', 'Cités dans le journal mais absents de la liste (un mod ajouté par vous, ou un programme qui tourne à côté du jeu) : ') +
        r.loose.map(function (x) { return '<code>' + escH(x.name) + '</code>'; }).join(', ') + '</p>';
      h += '<p class="cr__note">' + tr('A lead, not a verdict: the first mod here is often the one that crashed, not always the one at fault. Share the log file on Discord with the list version if you need help.',
        'Une piste, pas un verdict : le premier mod ici est souvent celui qui a planté, pas toujours le fautif. Partagez le fichier du journal sur Discord avec la version de la liste si vous avez besoin d’aide.') + '</p>';
      out.innerHTML = h;
    }

    var run = function () {
      var text = input.value;
      if (!text.trim()) { out.innerHTML = '<p class="cr__none">' + tr('Paste a log or open a file first.', 'Collez un journal ou ouvrez un fichier d’abord.') + '</p>'; return; }
      lastText = text;
      out.innerHTML = '<p class="cr__none">' + tr('Reading…', 'Lecture…') + '</p>';
      load().then(function (idx) { render(analyse(text, idx), idx); }).catch(function () {
        out.innerHTML = '<p class="cr__none">' + tr('The list data could not be loaded. Try again in a moment.', 'Les données de la liste n’ont pas pu être chargées. Réessayez dans un instant.') + '</p>';
      });
    };
    $('[data-cr-go]', box).addEventListener('click', run);
    fileIn.addEventListener('change', function () {
      var f = fileIn.files && fileIn.files[0];
      if (!f) return;
      if (f.size > 8e6) { out.innerHTML = '<p class="cr__none">' + tr('This file is too large to be a crash log.', 'Ce fichier est trop gros pour être un journal de crash.') + '</p>'; return; }
      f.text().then(function (t) { input.value = t; run(); });
    });
    box.addEventListener('dragover', function (e) { e.preventDefault(); box.classList.add('is-drop'); });
    box.addEventListener('dragleave', function () { box.classList.remove('is-drop'); });
    box.addEventListener('drop', function (e) {
      e.preventDefault(); box.classList.remove('is-drop');
      var f = e.dataTransfer.files && e.dataTransfer.files[0];
      if (f && f.size <= 8e6) f.text().then(function (t) { input.value = t; run(); });
    });
    refreshers.push(function () { if (lastText && index) index.then(function (idx) { render(analyse(lastText, idx), idx); }); });
  });
})();
