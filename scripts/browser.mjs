// Shared by bench.mjs and shot.mjs: find a Chromium browser, start it headless, talk to it over the DevTools protocol.
// No dependency: Node 22+ has fetch and WebSocket built in.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Edge moved between Edge/Application and EdgeCore/<version>/ over the years: try every known place.
export function findBrowser() {
  if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) return process.env.CHROME_PATH;
  const roots = [process.env['ProgramFiles(x86)'], process.env.ProgramFiles, process.env.LOCALAPPDATA].filter(Boolean);
  const found = [];
  for (const r of roots) {
    found.push(path.join(r, 'Microsoft/Edge/Application/msedge.exe'));
    const core = path.join(r, 'Microsoft/EdgeCore');
    if (fs.existsSync(core)) for (const v of fs.readdirSync(core).sort().reverse()) found.push(path.join(core, v, 'msedge.exe'));
    found.push(path.join(r, 'Google/Chrome/Application/chrome.exe'));
  }
  found.push('/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/microsoft-edge',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge');
  const hit = found.find((p) => fs.existsSync(p));
  if (!hit) throw new Error('No Edge or Chrome found. Set CHROME_PATH to the browser binary.');
  return hit;
}

// Starts the browser and returns { send, evalJs, close }.
export async function launch({ width = 1440, height = 900, args = [] } = {}) {
  const port = 9300 + Math.floor(Math.random() * 500);
  const prof = path.join(os.tmpdir(), 'taf-edge-prof-' + port);
  const proc = spawn(findBrowser(), ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`,
    `--window-size=${width},${height}`, '--no-first-run', '--hide-scrollbars', ...args, 'about:blank'], { stdio: 'ignore' });

  let ws, id = 0; const pending = new Map();
  for (let i = 0; i < 75 && !ws; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
      const page = list.find((t) => t.type === 'page');
      if (page) { ws = new WebSocket(page.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; }); }
    } catch { ws = null; }
    if (!ws) await sleep(200);
  }
  if (!ws) { proc.kill(); throw new Error('The browser did not open its DevTools port.'); }
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } };

  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const evalJs = async (expr) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;
  const close = async () => {
    try { ws.close(); } catch {}
    proc.kill();
    await sleep(500);
    try { fs.rmSync(prof, { recursive: true, force: true }); } catch {}
  };
  return { send, evalJs, close };
}
