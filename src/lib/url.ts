// Link helpers. Content files write internal links as site-root paths
// ("/team/#alumni"); `link()` makes them work even if the site is ever deployed
// under a sub-path (Astro's `base` option).

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Resolve an href from content for use in markup. External, mailto and "#" links pass through. */
export const link = (href: string): string => (href.startsWith('/') ? base + href : href);

/** Whether `href` points at the page being rendered. Links to a section of a page ("/team/#alumni") never match. */
export const isCurrentPage = (href: string, pathname: string): boolean =>
  href.startsWith('/') && !href.includes('#') && link(href) === pathname;
