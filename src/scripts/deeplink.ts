// Opens the publications list at one paper when the URL ends with #pub-<id>
// (from the Projects and Research Areas pages, or a shared link):
//   1. clears the filters and reveals every row (the paper may be filtered out or unloaded)
//   2. expands the row
//   3. scrolls it under the sticky header
//   4. tints it for a moment
// Runs on load and whenever the hash changes.

import { prefersReducedMotion } from './util';

const HIGHLIGHT_MS = 3000;

export function initDeepLink(root: ParentNode = document): void {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const jump = () => {
    const match = /^#pub-(.+)$/.exec(location.hash);
    const row = match && root.querySelector<HTMLElement>(`[data-item][id="pub-${CSS.escape(match[1])}"]`);
    if (!row) return;

    row.closest('[data-filter-root]')?.dispatchEvent(new CustomEvent('filter:reset', { detail: { revealAll: true } }));

    const toggle = row.querySelector<HTMLElement>('[data-accordion]');
    const details = document.getElementById(toggle?.getAttribute('aria-controls') ?? '');
    toggle?.setAttribute('aria-expanded', 'true');
    if (details) details.hidden = false;

    row.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
    root.querySelectorAll<HTMLElement>('[data-highlight]').forEach((el) => el.removeAttribute('data-highlight'));
    row.setAttribute('data-highlight', '');
    clearTimeout(timer);
    timer = setTimeout(() => row.removeAttribute('data-highlight'), HIGHLIGHT_MS);
  };

  window.addEventListener('hashchange', jump);
  jump();
}
