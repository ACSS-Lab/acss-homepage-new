// Home-page header: transparent over the hero, fading to white over the first
// 160px of scroll. Only `--nav-p` (0-1, in 1/20 steps) and two state
// attributes are set here; SiteHeader's CSS does the colors.
//
//   [data-header="overlay"]   gets --nav-p, data-solid (above 50%), data-shadow (above 75%)

const FADE_PX = 160;
const STEPS = 20;

export function initHeaderOverlay(root: ParentNode = document): void {
  const header = root.querySelector<HTMLElement>('[data-header="overlay"]');
  if (!header) return;
  let last = -1;

  const update = () => {
    const p = Math.round(Math.min(Math.max(window.scrollY / FADE_PX, 0), 1) * STEPS) / STEPS;
    if (p === last) return;
    last = p;
    header.style.setProperty('--nav-p', String(p));
    header.toggleAttribute('data-solid', p > 0.5);
    header.toggleAttribute('data-shadow', p > 0.75);
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}
