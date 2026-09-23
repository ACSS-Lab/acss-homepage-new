// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Production origin; the base for absolute URLs (sitemap, canonical links).
  site: 'https://acss.kaist.ac.kr',
  // Every route ends with a slash (`/team/`) so static hosts serve it without a redirect.
  trailingSlash: 'always',
  // Show Markdown text exactly as written (no automatic curly quotes or dashes).
  markdown: { smartypants: false },
  // Section roots open their first page.
  redirects: {
    '/about': '/about/vision/',
    '/research': '/research/projects/',
  },
});
