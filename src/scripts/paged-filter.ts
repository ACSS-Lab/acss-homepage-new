// Filter chips + page numbers over a list rendered at build time.
//
//   [data-paged data-per-page="4"]           root
//     [data-filter-chip data-value="all"]    chips; aria-pressed marks the active one; "all" matches everything
//     [data-item data-filter="a b"]          list items, in display order; space-separated values
//     [data-filter-empty]                    shown when nothing matches
//     [data-pagination]                      hidden when nothing matches
//       [data-page="0"]                      one button per page, rendered for the largest possible count
//       [data-page-prev] [data-page-next]
//
// Items outside the current page are `hidden`. Whenever the page changes, the
// visible items get a fresh `--i` index and their `.rise` animation replays.

export function initPagedFilter(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('[data-paged]').forEach((paged) => {
    const perPage = Math.max(1, Number(paged.dataset.perPage) || 4);
    const chips = paged.querySelectorAll<HTMLElement>('[data-filter-chip]');
    const items = Array.from(paged.querySelectorAll<HTMLElement>('[data-item]'));
    const empty = paged.querySelector<HTMLElement>('[data-filter-empty]');
    const pagination = paged.querySelector<HTMLElement>('[data-pagination]');
    const pageButtons = Array.from(paged.querySelectorAll<HTMLElement>('[data-page]'));
    const prev = paged.querySelector<HTMLButtonElement>('[data-page-prev]');
    const next = paged.querySelector<HTMLButtonElement>('[data-page-next]');

    let filter = 'all';
    let page = 0;

    const render = () => {
      const matched = items.filter((item) => filter === 'all' || (item.dataset.filter ?? '').split(/\s+/).includes(filter));
      const pages = Math.max(1, Math.ceil(matched.length / perPage));
      page = Math.min(page, pages - 1);
      const first = page * perPage;

      items.forEach((item) => (item.hidden = true));
      matched.slice(first, first + perPage).forEach((item, i) => {
        item.hidden = false;
        item.style.setProperty('--i', String(i));
        // Restart the entrance animation.
        item.classList.remove('rise');
        void item.offsetWidth;
        item.classList.add('rise');
      });

      if (empty) empty.hidden = matched.length > 0;
      if (pagination) pagination.hidden = matched.length === 0;
      pageButtons.forEach((button, i) => {
        button.hidden = i >= pages;
        button.setAttribute('aria-current', i === page ? 'page' : 'false');
      });
      if (prev) prev.disabled = page === 0;
      if (next) next.disabled = page >= pages - 1;
    };

    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        filter = chip.dataset.value ?? 'all';
        page = 0;
        chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
        render();
      });
    });
    pageButtons.forEach((button, i) => button.addEventListener('click', () => ((page = i), render())));
    prev?.addEventListener('click', () => ((page -= 1), render()));
    next?.addEventListener('click', () => ((page += 1), render()));

    render();
  });
}
