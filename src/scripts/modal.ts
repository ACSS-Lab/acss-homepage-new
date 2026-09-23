// Modal windows built on the native <dialog>: Escape, focus trapping and focus
// return come from the browser.
//
//   <button data-modal-open="project-x">      opens <dialog id="project-x">
//   <dialog data-backdrop-close>              clicking the dimmed backdrop closes it
//     <button data-modal-close>

export function initModal(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('[data-modal-open]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const dialog = document.getElementById(trigger.dataset.modalOpen ?? '');
      if (dialog instanceof HTMLDialogElement) dialog.showModal();
    });
  });

  root.querySelectorAll<HTMLDialogElement>('dialog').forEach((dialog) => {
    dialog.querySelectorAll<HTMLElement>('[data-modal-close]').forEach((button) => {
      button.addEventListener('click', () => dialog.close());
    });
    if (dialog.hasAttribute('data-backdrop-close')) {
      // A click lands on the dialog element itself only when it is outside its content box.
      dialog.addEventListener('click', (event) => {
        if (event.target === dialog) dialog.close();
      });
    }
  });
}
