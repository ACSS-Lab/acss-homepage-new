// Media files referenced from content. A content file writes a site path such as
// `/images/team/gildong-hong.jpg`; the file itself lives at
// src/assets/images/team/gildong-hong.jpg, where Astro optimises images at build
// time (see components/ui/Figure.astro). This module maps one to the other and
// fails the build for a path that has no file.
//
// Never read the fields of an ImageMetadata here or in a component (width, src,
// ...): in a static build that marks the original file as used and ships it
// into dist/ next to the optimised copies. Hand the object to <Image> untouched.

import type { ImageMetadata } from 'astro';

/** Prefix every media path in content starts with. */
const SITE_PREFIX = '/images/';
/** Folder the files live in, relative to the project root. */
export const MEDIA_DIR = 'src/assets/images';

const images = import.meta.glob<{ default: ImageMetadata }>('/src/assets/images/**/*.{jpg,jpeg,png,webp,avif}', { eager: true });
const videos = import.meta.glob<string>('/src/assets/images/**/*.mp4', { eager: true, query: '?url', import: 'default' });

export type Media =
  | { kind: 'image'; image: ImageMetadata }
  /** A silent loop; `poster` is the same-named .jpg (or .webp, as the web admin stores photos) next to the .mp4. */
  | { kind: 'video'; src: string; poster?: ImageMetadata };

/** Where the file for a content path must sit, e.g. `src/assets/images/team/gildong-hong.jpg`. */
export const mediaFile = (path: string): string => `${MEDIA_DIR}/${path.slice(SITE_PREFIX.length)}`;

const key = (path: string): string => `/${mediaFile(path)}`;

/** The media behind a content path, or undefined when no such file exists. */
export function findMedia(path: string): Media | undefined {
  if (path.endsWith('.mp4')) {
    const src = videos[key(path)];
    if (src === undefined) return undefined;
    const poster = images[key(path.replace(/\.mp4$/, '.jpg'))] ?? images[key(path.replace(/\.mp4$/, '.webp'))];
    return { kind: 'video', src, poster: poster?.default };
  }
  const image = images[key(path)]?.default;
  return image && { kind: 'image', image };
}

/** Build-time check used by src/lib/content.ts: a set path must have a file. */
export function resolveMedia(file: string, path: string | undefined): void {
  if (path && !findMedia(path)) {
    throw new Error(`[content] ${file}: media "${path}" was not found. Put the file at ${mediaFile(path)} or remove the field.`);
  }
}

/**
 * Rendered size of each media slot: the `sizes` attribute describes the box at
 * every breakpoint, `widths` are the variants generated for `srcset`. Widths
 * above the source image are dropped, so a small upload never upscales. Keep
 * these in step with the component styles they describe (DESIGN.md section 4).
 */
export const MEDIA_SLOTS = {
  teamMd: { sizes: '(max-width: 639px) 96px, 156px', widths: [160, 320] },
  teamLg: { sizes: '(max-width: 767px) 168px, 228px', widths: [230, 460] },
  pubThumb: { sizes: '(max-width: 639px) min(260px, calc(100vw - 32px)), 176px', widths: [180, 360, 520] },
  pubFeatured: { sizes: '(max-width: 767px) calc(100vw - 72px), 320px', widths: [320, 640, 960, 1400] },
  pubLightbox: { sizes: '(max-width: 767px) calc(100vw - 64px), 872px', widths: [640, 880, 1300, 1760] },
  projectCover: {
    sizes: '(max-width: 767px) calc(100vw - 64px), (max-width: 1167px) calc(50vw - 70px), 514px',
    widths: [520, 780, 1040, 1400],
  },
  areaCard: {
    sizes: '(max-width: 767px) min(280px, 78vw), (max-width: 1167px) calc(33vw - 30px), 360px',
    widths: [360, 560, 720, 1080],
  },
  albumCover: {
    sizes: '(max-width: 767px) calc(50vw - 24px), (max-width: 1023px) calc(33vw - 31px), (max-width: 1167px) calc(25vw - 29px), 263px',
    widths: [280, 400, 560, 800],
  },
  homeGallery: {
    sizes: '(max-width: 767px) calc(100vw - 32px), (max-width: 1279px) calc(100vw - 96px), 512px',
    widths: [512, 768, 1024, 1200, 1600],
  },
  galleryStage: { sizes: '(max-width: 767px) calc(100vw - 32px), min(93vh, 1020px)', widths: [720, 1080, 1440, 2040] },
  galleryThumb: { sizes: '84px', widths: [84, 168] },
  visionFigure: {
    sizes: '(max-width: 767px) min(320px, calc(100vw - 32px)), (max-width: 1023px) 220px, 268px',
    widths: [270, 320, 540, 640],
  },
  homeHero: { sizes: '100vw', widths: [1280, 1920, 2560] },
} as const satisfies Record<string, { sizes: string; widths: readonly number[] }>;

export type MediaSlot = keyof typeof MEDIA_SLOTS;
