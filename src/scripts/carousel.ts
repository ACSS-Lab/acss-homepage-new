// Sliding carousel. The script only tracks the position; the component's CSS
// turns `--slide` into the track offset, so layout stays in the stylesheet.
//
//   [data-carousel]                 root; receives the `--slide` custom property
//     [data-carousel-prev|next]     buttons; disabled at the ends, or wrapping with data-loop
//     [data-carousel-dot]           one per position; the current one gets `data-current`;
//                                   clicking one jumps to it
//       [data-carousel-fill]        optional progress bar inside a dot: its CSS animation runs
//                                   while current, and when it ends the carousel advances
//                                   (that is the autoplay clock; reduced motion disables the
//                                   animation and therefore autoplay)
//
// The number of positions is the number of dots rendered by the component.

export function initCarousel(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('[data-carousel]').forEach((carousel) => {
    const prev = carousel.querySelector<HTMLButtonElement>('[data-carousel-prev]');
    const next = carousel.querySelector<HTMLButtonElement>('[data-carousel-next]');
    const dots = Array.from(carousel.querySelectorAll<HTMLElement>('[data-carousel-dot]'));
    const loop = carousel.hasAttribute('data-loop');
    const last = Math.max(0, dots.length - 1);
    let slide = 0;

    const go = (to: number) => {
      slide = loop ? (to + dots.length) % Math.max(1, dots.length) : Math.min(last, Math.max(0, to));
      carousel.style.setProperty('--slide', String(slide));
      dots.forEach((dot, i) => dot.toggleAttribute('data-current', i === slide));
      if (prev) prev.disabled = !loop && slide === 0;
      if (next) next.disabled = !loop && slide === last;
    };

    prev?.addEventListener('click', () => go(slide - 1));
    next?.addEventListener('click', () => go(slide + 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => go(i)));
    carousel.addEventListener('animationend', (event) => {
      if ((event.target as HTMLElement).hasAttribute('data-carousel-fill')) go(slide + 1);
    });
    go(0);
  });
}
