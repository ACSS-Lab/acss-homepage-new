// Search + single-select facets + "load more" over a list rendered at build time.
// Used by the Team and Publications pages.
//
//   [data-filter-root data-page-size="4"]     root
//     [data-item data-facet-<name>="a b" data-search="haystack"]   items, in display order
//     [data-facet="<name>" data-value="x"]    option buttons (desktop and mobile copies are kept in sync);
//                                             aria-pressed marks the selection; clicking it again clears it
//       [data-count]                          the option's count
//     [data-facet-active="<name>"]            shows the selected option's badge: its child [data-value="x"]
//     [data-when-active="<name>"]             shown only while that facet has a selection
//     [data-filter-search]                    search inputs (kept in sync)
//     [data-filter-reset]                     clears everything; data-state="clean|dirty" for styling
//     [data-filter-empty]                     shown when nothing matches
//     [data-group="g"] > [data-group-count]   section wrappers around items; hidden when none of theirs show
//     [data-sentinel]                         reveals the next page when scrolled into view; hidden when done
//
// An option's count is the number of items that match the search and every
// *other* facet, so it always says how many results choosing it would give.

const readValues = (item: HTMLElement, facet: string): string[] => (item.dataset[`facet${facet[0].toUpperCase()}${facet.slice(1)}`] ?? '').split(/\s+/).filter(Boolean);

export function initFacetFilter(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('[data-filter-root]').forEach((filterRoot) => {
    const pageSize = Math.max(1, Number(filterRoot.dataset.pageSize) || 4);
    const items = Array.from(filterRoot.querySelectorAll<HTMLElement>('[data-item]'));
    const options = Array.from(filterRoot.querySelectorAll<HTMLElement>('[data-facet][data-value]'));
    const facets = [...new Set(options.map((o) => o.dataset.facet!))];
    const searches = Array.from(filterRoot.querySelectorAll<HTMLInputElement>('[data-filter-search]'));
    const resets = Array.from(filterRoot.querySelectorAll<HTMLElement>('[data-filter-reset]'));
    const empty = filterRoot.querySelector<HTMLElement>('[data-filter-empty]');
    const groups = Array.from(filterRoot.querySelectorAll<HTMLElement>('[data-group]'));
    const sentinel = filterRoot.querySelector<HTMLElement>('[data-sentinel]');

    const selected: Record<string, string | null> = Object.fromEntries(facets.map((f) => [f, null]));
    let query = '';
    let visible = pageSize;

    const matches = (item: HTMLElement, ignoreFacet?: string) =>
      (!query || (item.dataset.search ?? '').includes(query)) &&
      facets.every((f) => f === ignoreFacet || !selected[f] || readValues(item, f).includes(selected[f]!));

    const replayRise = (item: HTMLElement) => {
      item.classList.remove('rise');
      void item.offsetWidth;
      item.classList.add('rise');
    };

    const render = (animateAll: boolean) => {
      const matched = items.filter((item) => matches(item));
      let shown = 0;
      items.forEach((item) => {
        const show = matched.includes(item) && matched.indexOf(item) < visible;
        const wasHidden = item.hidden;
        item.hidden = !show;
        if (show) {
          item.style.setProperty('--i', String(shown++ % pageSize));
          if (animateAll || wasHidden) replayRise(item);
        }
      });

      groups.forEach((group) => {
        const own = items.filter((item) => group.contains(item));
        group.hidden = !own.some((item) => !item.hidden);
        const count = group.querySelector<HTMLElement>('[data-group-count]');
        if (count) count.textContent = String(own.filter((item) => matched.includes(item)).length);
      });

      options.forEach((option) => {
        const facet = option.dataset.facet!;
        const value = option.dataset.value!;
        option.setAttribute('aria-pressed', String(selected[facet] === value));
        const count = option.querySelector<HTMLElement>('[data-count]');
        if (count) count.textContent = String(items.filter((item) => matches(item, facet) && readValues(item, facet).includes(value)).length);
      });
      filterRoot.querySelectorAll<HTMLElement>('[data-facet-active]').forEach((badge) => {
        const active = selected[badge.dataset.facetActive!];
        badge.hidden = !active;
        badge.querySelectorAll<HTMLElement>('[data-value]').forEach((el) => (el.hidden = el.dataset.value !== active));
      });
      filterRoot.querySelectorAll<HTMLElement>('[data-when-active]').forEach((el) => (el.hidden = !selected[el.dataset.whenActive!]));

      const clean = !query && facets.every((f) => !selected[f]);
      resets.forEach((reset) => (reset.dataset.state = clean ? 'clean' : 'dirty'));
      if (empty) empty.hidden = matched.length > 0;
      if (sentinel) sentinel.hidden = matched.length <= visible;
    };

    const change = () => {
      visible = pageSize;
      render(true);
    };

    options.forEach((option) => {
      option.addEventListener('click', () => {
        const facet = option.dataset.facet!;
        selected[facet] = selected[facet] === option.dataset.value ? null : option.dataset.value!;
        change();
      });
    });
    searches.forEach((input) => {
      input.addEventListener('input', () => {
        query = input.value.trim().toLowerCase();
        searches.forEach((other) => other !== input && (other.value = input.value));
        change();
      });
    });
    resets.forEach((reset) => {
      reset.addEventListener('click', () => {
        facets.forEach((f) => (selected[f] = null));
        query = '';
        searches.forEach((input) => (input.value = ''));
        change();
      });
    });

    if (sentinel) {
      new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting) && !sentinel.hidden) {
            visible += pageSize;
            render(false);
          }
        },
        { rootMargin: sentinel.dataset.rootMargin ?? '200px 0px' },
      ).observe(sentinel);
    }

    render(false);
  });
}
