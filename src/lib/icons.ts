// Icon registry — the single inventory of icons used on the site, and the only
// file that imports from @lucide/astro. Icons are never drawn by hand: to use a
// new one, find it on https://lucide.dev/icons, import it here, and add it to
// the map under its lucide name.

import ArrowRight from '@lucide/astro/icons/arrow-right';
import Check from '@lucide/astro/icons/check';
import ChevronDown from '@lucide/astro/icons/chevron-down';
import ChevronLeft from '@lucide/astro/icons/chevron-left';
import ChevronRight from '@lucide/astro/icons/chevron-right';
import Code from '@lucide/astro/icons/code';
import CircleSlash from '@lucide/astro/icons/circle-slash';
import Copy from '@lucide/astro/icons/copy';
import FileText from '@lucide/astro/icons/file-text';
import Globe from '@lucide/astro/icons/globe';
import GraduationCap from '@lucide/astro/icons/graduation-cap';
import House from '@lucide/astro/icons/house';
import Landmark from '@lucide/astro/icons/landmark';
import ListFilter from '@lucide/astro/icons/list-filter';
import Maximize2 from '@lucide/astro/icons/maximize-2';
import Pause from '@lucide/astro/icons/pause';
import Play from '@lucide/astro/icons/play';
import Presentation from '@lucide/astro/icons/presentation';
import Search from '@lucide/astro/icons/search';
import X from '@lucide/astro/icons/x';

export const icons = {
  'arrow-right': ArrowRight,
  check: Check,
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'circle-slash': CircleSlash,
  code: Code,
  copy: Copy,
  'file-text': FileText,
  globe: Globe,
  'graduation-cap': GraduationCap,
  house: House,
  landmark: Landmark,
  'list-filter': ListFilter,
  'maximize-2': Maximize2,
  pause: Pause,
  play: Play,
  presentation: Presentation,
  search: Search,
  x: X,
} as const;

export type IconName = keyof typeof icons;
