// Usage: node scripts/bench.mjs <url> [label] ["css to inject, to test a change"]
// Needs the dev server running. Compare runs against each other, not against real hardware.
// Launches headless Edge with CDP. On the home page it strikes a new forge section every 1.1 s for 6 s
// (the 3D hammer, the circle reveal, the text effects); on other pages it scrolls. Reports frame stats (rAF)
// and main-thread metrics deltas.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

import { findBrowser } from './browser.mjs';
const EDGE = findBrowser();
const url = process.argv[2] || 'http://localhost:4000/';
const label = process.argv[3] || url;
const port = 9300 + Math.floor(Math.random() * 500);
const prof = path.join(os.tmpdir(), 'taf-edge-prof-' + port);

const edge = spawn(EDGE, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`,
  '--window-size=1440,900', '--no-first-run', '--enable-gpu-rasterization', '--ignore-gpu-blocklist', 'about:blank'], { stdio: 'ignore' });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let ws, id = 0; const pending = new Map();
async function connect() {
  for (let i = 0; i < 50; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
      const page = list.find((t) => t.type === 'page');
      if (page) { ws = new WebSocket(page.webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r)); break; }
    } catch {}
    await sleep(200);
  }
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } };
}
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const evalJs = async (expr) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;

await connect();
await send('Performance.enable');
await send('Page.enable');
await send('Page.navigate', { url });
await sleep(4000);
if (process.argv[4]) await evalJs(`(() => { const s = document.createElement("style"); s.textContent = ${JSON.stringify(process.argv[4])}; document.head.appendChild(s); })()`);
await sleep(300);
const m0 = Object.fromEntries((await send('Performance.getMetrics')).result.metrics.map((m) => [m.name, m.value]));
const res = await evalJs(`new Promise((done) => {
  const rail = [...document.querySelectorAll('.forge__rail a')];
  let frames = 0, long = 0, worst = 0, last = performance.now(), t0 = last, k = 0;
  function frame(t) {
    const dt = t - last; last = t; frames++; if (dt > 34) long++; if (dt > worst) worst = dt;
    if (!rail.length) window.scrollBy(0, 6);
    if (t - t0 < 6000) requestAnimationFrame(frame);
    else done({ fps: +(frames / ((t - t0) / 1000)).toFixed(1), long, worst: Math.round(worst) });
  }
  if (rail.length) {
    const it = setInterval(() => { k++; rail[k % rail.length].click(); }, 1100);
    setTimeout(() => clearInterval(it), 6000);
  }
  requestAnimationFrame(frame);
})`);
const m1 = Object.fromEntries((await send('Performance.getMetrics')).result.metrics.map((m) => [m.name, m.value]));
const d = (k) => ((m1[k] - m0[k]) * 1000).toFixed(0);
console.log(`${label}: fps=${res?.fps} long>34ms=${res?.long} worst=${res?.worst}ms | task=${d('TaskDuration')}ms script=${d('ScriptDuration')}ms layout=${d('LayoutDuration')}ms style=${d('RecalcStyleDuration')}ms`);
ws.close(); edge.kill();
await sleep(500);
try { fs.rmSync(prof, { recursive: true, force: true }); } catch {}
process.exit(0);
