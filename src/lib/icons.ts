// Icon registry — the single inventory of icons used on the site, and the only
// file that imports from @lucide/astro. Icons are never drawn by hand: to use a
// new one, find it on https://lucide.dev/icons, import it here, and add it to
// the map under its lucide name.

import ArrowRight from '@lucide/astro/icons/arrow-right';
import Check from '@lucide/astro/icons/check';
import ChevronDown from '@lucide/astro/icons/chevron-down';
import ChevronLeft from '@lucide/astro/icons/chevron-left';
import ChevronRight from '@lucide/astro/icons/chevron-right';
import CircleSlash from '@lucide/astro/icons/circle-slash';
import Copy from '@lucide/astro/icons/copy';
import GraduationCap from '@lucide/astro/icons/graduation-cap';
import House from '@lucide/astro/icons/house';

export const icons = {
  'arrow-right': ArrowRight,
  check: Check,
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'circle-slash': CircleSlash,
  copy: Copy,
  'graduation-cap': GraduationCap,
  house: House,
} as const;

export type IconName = keyof typeof icons;
