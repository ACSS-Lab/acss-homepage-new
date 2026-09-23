// Responsive check: opens every built page at phone, tablet, laptop and desktop
// widths and reports horizontal overflow (the page must never be wider than the
// viewport). Run after `npm run build`:
//
//   node scripts/check-responsive.mjs                      all routes, widths 360 768 1024 1440
//   node scripts/check-responsive.mjs --widths 360,768     other widths
//   node scripts/check-responsive.mjs --routes /,/team/    only these routes
//   node scripts/check-responsive.mjs --shots ./tmp/shots  also save a full-page PNG per route and width
//
// Exits with 1 when any page overflows. Needs Google Chrome (set CHROME to another path).

import { createServer } from 'node:http';
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { launch } from './browser.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');
if (!existsSync(join(dist, 'index.html'))) {
  console.error('dist/ is missing. Run `nvm use && npm run build` first.');
  process.exit(1);
}

const args = process.argv.slice(2);
const option = (name) => {
  const i = args.indexOf(name);
  return i === -1 ? undefined : args[i + 1];
};
const widths = (option('--widths') ?? '360,768,1024,1440').split(',').map(Number);
const shotsDir = option('--shots');

// Every index.html under dist/ is a route, except redirect stubs.
function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* walk(path);
    else if (name === 'index.html' && !readFileSync(path, 'utf8').includes('http-equiv="refresh"')) yield '/' + relative(dist, dir).split('\\').join('/') + (dir === dist ? '' : '/');
  }
}
const routes = option('--routes')?.split(',') ?? [...walk(dist)].map((r) => r.replace('//', '/')).sort();

const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };
const server = createServer((req, res) => {
  let path = join(dist, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (existsSync(path) && statSync(path).isDirectory()) path = join(path, 'index.html');
  if (!existsSync(path)) {
    res.writeHead(404);
    return res.end();
  }
  res.writeHead(200, { 'content-type': MIME[extname(path)] ?? 'application/octet-stream' });
  res.end(readFileSync(path));
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
if (shotsDir) mkdirSync(shotsDir, { recursive: true });

const { page, close } = await launch();
let failures = 0;
try {
  for (const width of widths) {
    for (const route of routes) {
      await page.goto(base + route, { width, height: 900 });
      const result = await page.eval(`(() => {
        const limit = ${width} + 1;
        const wide = [...document.querySelectorAll('body *')]
          .filter((el) => { const r = el.getBoundingClientRect(); return r.right > limit && r.width > 0 && getComputedStyle(el).position !== 'fixed'; })
          .map((el) => el.tagName.toLowerCase() + (typeof el.className === 'string' && el.className ? '.' + el.className.split(' ')[0] : '') + '=' + Math.round(el.getBoundingClientRect().right));
        return { scrollWidth: document.documentElement.scrollWidth, wide: [...new Set(wide)].slice(0, 5) };
      })()`);
      const over = result.scrollWidth > width;
      if (over) failures++;
      console.log(`${String(width).padStart(5)}  ${route.padEnd(28)} ${over ? 'OVERFLOW ' + result.scrollWidth + 'px  ' + result.wide.join(' ') : 'ok'}`);
      if (shotsDir) {
        await page.sleep(700); // let entrance animations finish
        await page.screenshot(join(shotsDir, `${route === '/' ? 'home' : route.replaceAll('/', '-').replace(/^-|-$/g, '')}-${width}.png`), true);
      }
    }
  }
} finally {
  close();
  server.close();
}
console.log(failures === 0 ? '\nresponsive: no page is wider than its viewport.' : `\nresponsive: ${failures} page/width combination(s) overflow.`);
process.exit(failures === 0 ? 0 : 1);
