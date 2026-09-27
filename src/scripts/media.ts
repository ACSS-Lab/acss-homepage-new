// Silent video loops rendered by components/ui/Figure.astro.
//
// A `<video data-autoplay>` carries no `autoplay` attribute. This script plays it
// while it is in view and pauses it out of view, so hidden lightbox shots and
// off-screen slides cost nothing. Under prefers-reduced-motion the video stays
// on its poster (or first frame) and gets the browser's controls so it can
// still be played by hand, unless it sits inside a button or is decorative
// (`data-autoplay="decorative"`: a background loop with nothing to show).

import { prefersReducedMotion } from './util';

export function initMedia(): void {
  const videos = document.querySelectorAll<HTMLVideoElement>('video[data-autoplay]');
  if (videos.length === 0) return;

  if (prefersReducedMotion()) {
    videos.forEach((video) => {
      if (!video.closest('button') && video.dataset.autoplay !== 'decorative') video.controls = true;
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const { target, isIntersecting } of entries) {
        const video = target as HTMLVideoElement;
        if (isIntersecting) void video.play().catch(() => undefined);
        else video.pause();
      }
    },
    { threshold: 0.1 },
  );
  videos.forEach((video) => observer.observe(video));
}
