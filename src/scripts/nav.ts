// Keyboard support for the header dropdowns. Opening and closing on hover/focus
// is pure CSS (see NavItem.astro); this adds what CSS can't do:
//   Escape      close the menu and return focus to its top-level link
//   ArrowDown   move into the menu / to the next entry (wraps)
//   ArrowUp     move to the previous entry (wraps)

export function initNav(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('[data-nav-item]').forEach((item) => {
    const trigger = item.querySelector<HTMLElement>('[data-nav-trigger]');
    const links = Array.from(item.querySelectorAll<HTMLElement>('[data-nav-menu] a'));
    if (!trigger || links.length === 0) return;

    const reopen = () => item.removeAttribute('data-dismissed');

    item.addEventListener('pointerleave', reopen);
    item.addEventListener('focusout', (event) => {
      if (!item.contains(event.relatedTarget as Node | null)) reopen();
    });

    item.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        item.setAttribute('data-dismissed', '');
        trigger.focus();
        return;
      }
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;

      event.preventDefault();
      reopen();
      const step = event.key === 'ArrowDown' ? 1 : -1;
      const current = links.indexOf(document.activeElement as HTMLElement);
      const start = current === -1 && step === -1 ? 0 : current;
      links[(start + step + links.length) % links.length].focus();
    });
  });
}
