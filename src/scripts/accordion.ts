// Collapsible sections: a button with aria-expanded toggles the `hidden` state
// of the panel it names in aria-controls.
//
//   <button data-accordion aria-expanded="false" aria-controls="panel-id">
//   <div id="panel-id" hidden>

export function initAccordion(root: ParentNode = document): void {
  root.querySelectorAll<HTMLButtonElement>('[data-accordion]').forEach((button) => {
    const panel = document.getElementById(button.getAttribute('aria-controls') ?? '');
    if (!panel) return;
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(open));
      panel.hidden = !open;
    });
  });
}
