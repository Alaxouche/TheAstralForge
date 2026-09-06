/**
 * check-ads.mjs
 * Verifies the advertising setup without loading a single ad.
 *
 *   node scripts/check-ads.mjs                         # against the local _site build
 *   node scripts/check-ads.mjs --url https://theastralforge.com   # against the live deploy
 *
 * What it proves:
 *   - the config in _data/ads.yml is coherent (no half-filled setup);
 *   - ads.txt is actually served and carries real seller lines;
 *   - the consent banner ships when ads are on, and not when they are off;
 *   - the ad tag is NOT hardcoded in the HTML — the gate is intact.
 *
 * What it cannot prove: that ads render. Networks only fill on a verified
 * domain, and every ad blocker in existence will stop the tag. See the
 * manual steps printed at the end.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const args = process.argv.slice(2);
const urlIdx = args.indexOf('--url');
const BASE = urlIdx !== -1 ? args[urlIdx + 1].replace(/\/$/, '') : null;
const SITE = '_site';

let pass = 0, fail = 0, warn = 0;
const ok = (m) => { pass++; console.log("  " + "✓" + " " + m); };
const bad = (m, d = "") => { fail++; console.log("  " + "✗" + " " + m + (d ? '\n      ' + d : '')); };
const meh = (m, d = "") => { warn++; console.log("  " + "!" + " " + m + (d ? '\n      ' + d : '')); };

/* ── Fetch a path from wherever we are checking ─────────────────────── */
async function get(p) {
  if (BASE) {
    const res = await fetch(BASE + p, { redirect: 'follow' });
    return res.ok ? await res.text() : null;
  }
  // Local build: /foo/ maps to _site/foo/index.html
  const rel = p.endsWith('/') ? p + 'index.html' : p;
  try {
    return await readFile(path.join(SITE, rel), 'utf8');
  } catch {
    return null;
  }
}

/* ── Read the config without pulling in a YAML parser ───────────────── */
function readConfig(text) {
  const grab = (key) => {
    const m = text.match(new RegExp('^\\s{2}' + key + ':\\s*(.*)$', 'm'));
    if (!m) return '';
    return m[1].trim().replace(/^["']|["']$/g, '');
  };
  return {
    enabled: /^\s{2}enabled:\s*true\s*$/m.test(text),
    requireConsent: /^\s{2}require_consent:\s*true\s*$/m.test(text),
    script_src: grab('script_src'),
    zone: grab('zone'),
  };
}

console.log(`\nVérification publicité — ${BASE || 'build local (_site)'}\n`);

/* ── 1. Configuration ───────────────────────────────────────────────── */
console.log('CONFIGURATION (_data/ads.yml)');
const cfgText = await readFile('_data/ads.yml', 'utf8').catch(() => null);
if (!cfgText) {
  bad('_data/ads.yml introuvable');
  process.exit(1);
}
const cfg = readConfig(cfgText);

let adHost = null;
if (!cfg.enabled) {
  ok('ads désactivés (enabled: false) — rien ne doit être servi');
  if (cfg.script_src || cfg.zone) {
    meh('script_src / zone sont remplis mais enabled est false',
        'Le site ne chargera aucune pub tant que enabled reste false.');
  }
} else {
  if (!cfg.script_src || !cfg.zone) {
    bad('enabled: true mais script_src ou zone est vide',
        `script_src="${cfg.script_src}" zone="${cfg.zone}" — la bannière ne sera pas rendue.`);
  } else {
    try {
      adHost = new URL(cfg.script_src).host;
      ok(`ads activés — zone ${cfg.zone} sur ${adHost}`);
      if (cfg.requireConsent) {
        ok('consentement requis — rien ne charge avant acceptation');
      } else {
        meh('consentement NON requis — le tag charge pour tout le monde',
            'Choix assumé. Sur du trafic UE, c\'est le point d\'exposition RGPD.');
      }
    } catch {
      bad('script_src n\'est pas une URL valide', cfg.script_src);
    }
  }
}

/* ── 2. ads.txt ─────────────────────────────────────────────────────── */
console.log('\nADS.TXT');
const adsTxt = await get('/ads.txt');
if (adsTxt === null) {
  bad('/ads.txt non servi');
} else {
  ok('/ads.txt est servi');
  const sellers = adsTxt.split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'));
  if (sellers.length === 0) {
    // Not an error: Monetag verifies by file/meta tag, not ads.txt, and sells
    // mostly direct. This only becomes blocking with AdSense, which enforces
    // ads.txt strictly.
    meh('aucune ligne de vendeur déclarée (que des commentaires)',
        'Sans objet pour Monetag seul. Obligatoire en revanche si tu remets AdSense.');
  } else {
    ok(`${sellers.length} ligne(s) de vendeur déclarée(s)`);
    const malformed = sellers.filter((l) => l.split(',').length < 3);
    if (malformed.length) {
      bad(`${malformed.length} ligne(s) mal formée(s)`,
          'Format attendu : domaine, ID éditeur, DIRECT|RESELLER[, ID TAG]\n      ' + malformed[0]);
    } else {
      ok('toutes les lignes ont le format attendu');
    }
  }
}

/* ── 3. Pages servies ───────────────────────────────────────────────── */
console.log('\nPAGES');
const pages = ['/', '/hub/', '/wunduniik/'];
let checked = 0;

for (const p of pages) {
  const html = await get(p);
  if (html === null) { meh(`${p} introuvable, ignorée`); continue; }
  checked++;

  const hasBanner = html.includes('id="consent-banner"');
  const hasConfig = html.includes('id="ad-config"');

  if (cfg.enabled && adHost) {
    if (!hasConfig) { bad(`${p} : bloc #ad-config absent — aucune pub ne chargera`); continue; }
    if (!html.includes(`data-ad-zone="${cfg.zone}"`)) {
      bad(`${p} : data-ad-zone ne correspond pas à la config`);
      continue;
    }

    // In both modes the tag is injected by JS, never written into the HTML:
    // an inline <script> would be rewritten by Cloudflare Rocket Loader, which
    // Monetag documents as breaking their tags.
    const scriptTag = new RegExp('<script[^>]*src="[^"]*' + adHost.replace(/\./g, '\\.'), 'i');
    if (scriptTag.test(html)) {
      bad(`${p} : le tag est en dur dans le HTML`,
          'Rocket Loader le réécrira. Il doit rester injecté par consent.js.');
      continue;
    }

    if (cfg.requireConsent) {
      if (!hasBanner) bad(`${p} : consentement requis mais bannière absente`);
      else ok(`${p} : bannière présente, tag non chargé avant consentement`);
    } else {
      if (hasBanner) bad(`${p} : bannière rendue alors que le consentement n'est pas requis`);
      else ok(`${p} : config présente, tag injecté au chargement`);
    }
  } else if (hasBanner || hasConfig) {
    bad(`${p} : markup publicitaire présent alors que les ads sont désactivés`);
  } else {
    ok(`${p} : aucun markup publicitaire (ads off)`);
  }
}

if (checked === 0) {
  bad('aucune page vérifiée',
      BASE ? 'Le site est-il en ligne ?' : 'Lance d\'abord : bundle exec jekyll build');
}

/* ── Verdict ────────────────────────────────────────────────────────── */
console.log(`\n${pass} ok, ${warn} avertissement(s), ${fail} erreur(s)`);

if (cfg.enabled && fail === 0) {
  console.log(`
Le plombage est bon. Ce qui ne peut PAS être vérifié ici :

  1. Bloqueurs de pub — uBlock, Brave Shields et consorts bloquent ${adHost || 'le tag'}.
     Teste dans une fenêtre privée, boucliers désactivés, sinon tu croiras
     à une panne.
  2. Remplissage — les régies ne servent que sur le domaine validé. Sur
     127.0.0.1, le tag part mais ne renverra probablement aucune pub.
     C'est normal : relance ce script avec --url https://theastralforge.com
     une fois déployé.
  3. Dans l'onglet Réseau des devtools, fenêtre privée, filtre sur
     "${adHost || 'ton-domaine-pub'}" : la requête doit partir au chargement.`);
}

process.exit(fail ? 1 : 0);
