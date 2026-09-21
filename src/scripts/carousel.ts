// Sliding carousel. The script only tracks the position; the component's CSS
// turns `--slide` into the track offset, so layout stays in the stylesheet.
//
//   [data-carousel]                 root; receives the `--slide` custom property
//     [data-carousel-prev|next]     buttons; disabled at the ends
//     [data-carousel-dot]           one per position; the current one gets `data-current`
//
// The number of positions is the number of dots rendered by the component.

export function initCarousel(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('[data-carousel]').forEach((carousel) => {
    const prev = carousel.querySelector<HTMLButtonElement>('[data-carousel-prev]');
    const next = carousel.querySelector<HTMLButtonElement>('[data-carousel-next]');
    const dots = Array.from(carousel.querySelectorAll<HTMLElement>('[data-carousel-dot]'));
    const last = Math.max(0, dots.length - 1);
    let slide = 0;

    const go = (to: number) => {
      slide = Math.min(last, Math.max(0, to));
      carousel.style.setProperty('--slide', String(slide));
      dots.forEach((dot, i) => dot.toggleAttribute('data-current', i === slide));
      if (prev) prev.disabled = slide === 0;
      if (next) next.disabled = slide === last;
    };

    prev?.addEventListener('click', () => go(slide - 1));
    next?.addEventListener('click', () => go(slide + 1));
    go(0);
  });
}
