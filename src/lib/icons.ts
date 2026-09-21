// Icon registry — the single inventory of icons used on the site, and the only
// file that imports from @lucide/astro. Icons are never drawn by hand: to use a
// new one, find it on https://lucide.dev/icons, import it here, and add it to
// the map under its lucide name.

import ChevronDown from '@lucide/astro/icons/chevron-down';
import GraduationCap from '@lucide/astro/icons/graduation-cap';
import House from '@lucide/astro/icons/house';

export const icons = {
  'chevron-down': ChevronDown,
  'graduation-cap': GraduationCap,
  house: House,
} as const;

export type IconName = keyof typeof icons;
