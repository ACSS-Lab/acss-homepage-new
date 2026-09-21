// The tab switcher in a page's dark banner mirrors the header menu: it lists the
// siblings of the current page (the children of its top-level menu item).
// Neighboring children that share a `group` collapse into one dropdown tab.

import type { NavItem } from './content';
import { isCurrentPage, link, pathOf } from './url';

export interface SectionTab {
  label: string;
  href: string;
  current: boolean;
  /** Present for a grouped tab: the entries of its dropdown. */
  menu?: { label: string; href: string; count?: number }[];
}

/**
 * @param counts optional numbers shown next to dropdown entries, keyed by the entry's href as written in navigation.yaml
 */
export function sectionTabs(items: NavItem[], pathname: string, counts: Record<string, number> = {}): SectionTab[] {
  const section = items.find((item) => item.children?.some((child) => pathOf(child.href) === pathname));
  const tabs: SectionTab[] = [];

  for (const child of section?.children ?? []) {
    const last = tabs.at(-1);
    const entry = { label: child.label, href: link(child.href), count: counts[child.href] };

    if (child.group && last?.menu && last.label === child.group) {
      last.menu.push(entry);
      last.current ||= pathOf(child.href) === pathname;
    } else if (child.group) {
      tabs.push({ label: child.group, href: entry.href, current: pathOf(child.href) === pathname, menu: [entry] });
    } else {
      tabs.push({ label: child.label, href: entry.href, current: isCurrentPage(child.href, pathname) });
    }
  }
  return tabs;
}
