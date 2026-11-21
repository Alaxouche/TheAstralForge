/* Troubleshooting page widgets (_<id>/troubleshooting.md):
     {{ modlist.id | troubleshooter }}   guided questions from _data/troubleshoot.yml
     {{ modlist.id | crash_reader }}     paste a crash log, see which mods of the list it names (site.js)
   Links point at sections of the list's own pages: the build resolves page titles and heading ids
   (resolveLink, passed in by build.mjs), so a renamed heading only loses its anchor, never breaks a page. */

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
const escA = (s) => esc(s).replace(/"/g, '&quot;');
const bi = (en, fr) => (en === fr ? en : `<span lang="en">${en}</span><span lang="fr">${fr}</span>`);
// Inline code for paths and file names written in plain text in the YAML
const fmt = (s) => esc(s).replace(/((?:[A-Za-z]:)?[\w.-]*\\[\w.\\-]+|\b[\w-]+\.(?:MXML|exe|ini|log|esp|esm|esl|dll)\b|\[NoDelete\])/g, '<code>$1</code>');

export const GAME_OF = {
  wunduniik: 'skyrim', krentoraan: 'skyrim', 'ghost-of-the-grid': 'cyberpunk',
  'no-mans-sky-explorer': 'nms', 'extrasolar-containment-protocol': 'starfield',
};
const DISCORD = 'https://discord.gg/vKuB7nazBk';

export function troubleshooterHtml(tree, id, resolveLink) {
  if (!tree || !tree.start) return '';
  const game = GAME_OF[id];
  const ok = (x) => !x.only || x.only.includes(id) || x.only.includes(game);
  // Nodes reachable for this list only
  const seen = new Set();
  const walk = (k) => {
    if (seen.has(k) || !tree[k]) return;
    seen.add(k);
    (tree[k].opts || []).filter(ok).forEach((o) => walk(o.go));
  };
  walk('start');

  const nodes = [...seen].map((k) => {
    const n = tree[k];
    if (n.q) {
      const opts = n.opts.filter(ok).map((o) => `<button type="button" class="ts__opt" data-go="${escA(o.go)}">${bi(esc(o.l.en), esc(o.l.fr))}</button>`).join('');
      return `<div class="ts__node" data-node="${escA(k)}"${k === 'start' ? '' : ' hidden'}><p class="ts__q">${bi(esc(n.q.en), esc(n.q.fr))}</p><div class="ts__opts">${opts}</div></div>`;
    }
    const paras = [n.a, ...(n.extra || []).filter(ok)].map((p) => `<p>${bi(fmt(p.en), fmt(p.fr))}</p>`).join('');
    const seenLinks = new Set();
    const links = (n.links || []).filter(ok).map((l) => resolveLink(id, l)).filter((l) => {
      if (!l) return false;
      const key = l.hrefEn + '|' + l.hrefFr;
      if (seenLinks.has(key)) return false;
      seenLinks.add(key);
      return true;
    }).map((l) => `<li><a href="${escA(l.hrefEn)}" lang="en">${esc(l.labelEn)}</a><a href="${escA(l.hrefFr)}" lang="fr">${esc(l.labelFr)}</a></li>`).join('');
    return `<div class="ts__node ts__node--a" data-node="${escA(k)}" hidden><p class="ts__kicker">${bi('Try this', 'Essayez ceci')}</p>` +
      `<div class="ts__a">${paras}</div>${links ? `<ul class="ts__links">${links}</ul>` : ''}` +
      `<p class="ts__more">${bi(`Still stuck? Ask on <a href="${DISCORD}" target="_blank" rel="noopener">Discord</a> or <a href="/report-a-bug/">report a bug</a>.`,
        `Toujours bloqué ? Demandez sur <a href="${DISCORD}" target="_blank" rel="noopener">Discord</a> ou <a href="/report-a-bug/">signalez un bug</a>.`)}</p></div>`;
  }).join('');

  return `<div class="ts" data-ts>` +
    `<ol class="ts__path" data-ts-path aria-label="Your answers" data-aria-fr="Vos réponses"></ol>` +
    nodes +
    `<div class="ts__nav"><button type="button" class="ts__btn" data-ts-back hidden>${bi('← Back', '← Retour')}</button>` +
    `<button type="button" class="ts__btn" data-ts-restart hidden>${bi('Start over', 'Recommencer')}</button></div>` +
    `<noscript><style>.ts [hidden]{display:block!important}</style></noscript></div>`;
}

export function crashReaderHtml(id) {
  const game = GAME_OF[id];
  if (!game || game === 'nms') return '';
  const what = {
    skyrim: ['a Crash Logger log (crash-….log)', 'un journal de Crash Logger (crash-….log)'],
    starfield: ['a Trainwreck log', 'un journal de Trainwreck'],
    cyberpunk: ['a RED4ext, redscript or Cyber Engine Tweaks log', 'un journal de RED4ext, redscript ou Cyber Engine Tweaks'],
  }[game];
  const tid = `cr-${id}`;
  return `<div class="cr" data-crash="${escA(id)}" data-game="${game}">` +
    `<label class="cr__l" for="${tid}">${bi(`Paste ${what[0]}`, `Collez ${what[1]}`)}</label>` +
    `<textarea id="${tid}" class="cr__in" rows="7" spellcheck="false" autocomplete="off" data-cr-in placeholder="Paste the whole file here, or open it below." data-ph-fr="Collez le fichier entier ici, ou ouvrez-le ci-dessous."></textarea>` +
    `<div class="cr__bar"><label class="cr__file"><input type="file" accept=".log,.txt,text/plain" data-cr-file>${bi('Open a file', 'Ouvrir un fichier')}</label>` +
    `<button type="button" class="cr__go" data-cr-go>${bi('Read the log', 'Lire le journal')}</button>` +
    `<span class="cr__priv">${bi('Read in your browser: nothing is sent anywhere.', 'Lu dans votre navigateur : rien n\'est envoyé.')}</span></div>` +
    `<div class="cr__out" data-cr-out aria-live="polite"></div>` +
    `<noscript><p>${bi('The reader needs JavaScript.', 'Le lecteur a besoin de JavaScript.')}</p></noscript></div>`;
}

/* Heading ids of a Markdown page body, computed like the Markdown renderer in build.mjs
   (slugify + "-1", "-2" for repeats), in document order. */
export function headingIds(body, slugify) {
  const out = [];
  const used = new Map();
  let fence = false;
  for (const line of String(body).split('\n')) {
    if (/^\s*```/.test(line)) { fence = !fence; continue; }
    if (fence) continue;
    const m = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!m) continue;
    const text = m[2].replace(/\*\*|__|`/g, '');
    // marked escapes the heading text before build.mjs slugifies it ("d'Installation" -> "d39installation")
    const html = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    let hid = slugify(html) || 'section';
    const n = used.get(hid) || 0;
    used.set(hid, n + 1);
    if (n) hid = `${hid}-${n}`;
    out.push({ text, id: hid });
  }
  return out;
}
