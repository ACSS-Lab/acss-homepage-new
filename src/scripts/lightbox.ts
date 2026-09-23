// Photo viewer inside a full-screen dialog: one photo shown at a time, with a
// thumbnail strip, previous/next (wrapping) and the arrow keys while open.
//
//   <dialog> ... [data-lightbox]     the viewer, anywhere inside a <dialog>
//     [data-shot="0"]            one frame per photo; all but the current one are `hidden`
//     [data-thumb="0"]           thumbnail buttons; the current one gets aria-current="true"
//     [data-lightbox-prev|next]

export function initLightbox(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('[data-lightbox]').forEach((viewer) => {
    const dialog = viewer.closest('dialog');
    const shots = Array.from(viewer.querySelectorAll<HTMLElement>('[data-shot]'));
    const thumbs = Array.from(viewer.querySelectorAll<HTMLElement>('[data-thumb]'));
    if (!dialog || shots.length === 0) return;
    let current = 0;

    const show = (index: number) => {
      current = (index + shots.length) % shots.length;
      shots.forEach((shot, i) => (shot.hidden = i !== current));
      thumbs.forEach((thumb, i) => (i === current ? thumb.setAttribute('aria-current', 'true') : thumb.removeAttribute('aria-current')));
    };

    viewer.querySelector('[data-lightbox-prev]')?.addEventListener('click', () => show(current - 1));
    viewer.querySelector('[data-lightbox-next]')?.addEventListener('click', () => show(current + 1));
    thumbs.forEach((thumb, i) => thumb.addEventListener('click', () => show(i)));

    dialog.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') show(current + 1);
      if (event.key === 'ArrowLeft') show(current - 1);
    });

    // Start from the first photo each time the viewer opens.
    new MutationObserver(() => {
      if (dialog.open) show(0);
    }).observe(dialog, { attributeFilter: ['open'] });
    show(0);
  });
}
