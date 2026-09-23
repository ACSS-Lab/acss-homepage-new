// Headless Chrome driver over the DevTools Protocol, with no dependencies
// (Node 22: global fetch and WebSocket). Used by check-responsive.mjs and for
// one-off interaction probes:
//
//   node scripts/browser.mjs my-probe.mjs      (the probe exports `default async (page) => {}`)
//
// page.goto(url, { width, height, mobile })   load a URL in a viewport of that size
// page.eval(expression)                       run JS in the page, return the JSON-able result
// page.click(selector) / page.clickAt(x, y)   real mouse clicks
// page.key(key)                               a key press, e.g. 'Escape'
// page.resize(width, height)                  change the viewport
// page.screenshot(path, fullPage)             save a PNG
// page.media([{ name, value }])               emulate media features, e.g. prefers-reduced-motion
// page.sleep(ms)

import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function launch() {
  const port = 9333 + Math.floor(Math.random() * 500);
  const chrome = spawn(
    CHROME,
    ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${port}`, `--user-data-dir=${join(tmpdir(), `acss-browser-${process.pid}`)}`, 'about:blank'],
    { stdio: 'ignore' },
  );

  let socket;
  for (let i = 0; i < 40 && !socket; i++) {
    await wait(250);
    try {
      const targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
      const target = targets.find((t) => t.type === 'page');
      if (target) socket = new WebSocket(target.webSocketDebuggerUrl);
    } catch {
      // Chrome is still starting
    }
  }
  if (!socket) {
    chrome.kill();
    throw new Error(`Chrome did not start (${CHROME})`);
  }
  await new Promise((resolve) => (socket.onopen = resolve));

  let nextId = 0;
  const pending = new Map();
  const listeners = new Set();
  socket.onmessage = (message) => {
    const msg = JSON.parse(message.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    } else if (msg.method) {
      listeners.forEach((listener) => listener(msg));
    }
  };
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = ++nextId;
      pending.set(id, (msg) => (msg.error ? reject(new Error(`${method}: ${JSON.stringify(msg.error)}`)) : resolve(msg.result)));
      socket.send(JSON.stringify({ id, method, params }));
    });
  await send('Page.enable');
  await send('Runtime.enable');

  const page = {
    async goto(url, { width = 1440, height = 900, mobile = width < 768 } = {}) {
      await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile });
      const loaded = new Promise((resolve) => {
        const listener = (msg) => {
          if (msg.method === 'Page.loadEventFired') {
            listeners.delete(listener);
            resolve();
          }
        };
        listeners.add(listener);
      });
      await send('Page.navigate', { url });
      await loaded;
      await wait(150);
    },
    async eval(expression) {
      const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
      if (result.exceptionDetails) throw new Error(`${result.exceptionDetails.text} ${result.exceptionDetails.exception?.description ?? ''}`);
      return result.result.value;
    },
    async click(selector) {
      const box = await page.eval(
        `(() => { const el = document.querySelector(${JSON.stringify(selector)}); if (!el) return null; el.scrollIntoView({ block: 'center' }); const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; })()`,
      );
      if (!box) throw new Error(`no element matches ${selector}`);
      await page.clickAt(box.x, box.y);
    },
    async clickAt(x, y) {
      for (const type of ['mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, x, y, button: 'left', clickCount: 1 });
      await wait(80);
    },
    async key(key) {
      const code = { Escape: 27, Enter: 13, ArrowLeft: 37, ArrowRight: 39, ArrowDown: 40, ArrowUp: 38, Tab: 9 }[key] ?? 0;
      await send('Input.dispatchKeyEvent', { type: 'keyDown', key, windowsVirtualKeyCode: code });
      await send('Input.dispatchKeyEvent', { type: 'keyUp', key, windowsVirtualKeyCode: code });
      await wait(80);
    },
    async resize(width, height = 900, mobile = width < 768) {
      await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile });
      await wait(150);
    },
    async screenshot(path, fullPage = false) {
      const result = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: fullPage });
      writeFileSync(path, Buffer.from(result.data, 'base64'));
    },
    async media(features) {
      await send('Emulation.setEmulatedMedia', { features });
    },
    sleep: wait,
  };

  const close = () => {
    socket.close();
    chrome.kill();
  };
  return { page, close };
}

// Run a probe file when invoked directly.
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())) {
  const probe = process.argv[2];
  if (!probe) {
    console.error('usage: node scripts/browser.mjs <probe.mjs>');
    process.exit(1);
  }
  const { page, close } = await launch();
  try {
    const mod = await import(new URL(probe, `file://${process.cwd()}/`).href);
    await mod.default(page);
  } finally {
    close();
  }
}
