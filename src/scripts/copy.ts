// Copy-to-clipboard button.
//
//   <button data-copy data-copy-from="#office address">   selector of the text to copy; when several
//     <… data-copy-idle> <… data-copy-done hidden>         elements match (one per language), the
//   </button>                                              visible one is used
//   <span data-copy-status data-message="Copied">          optional live region for screen readers
//
// After copying, the "done" icon replaces the "idle" icon for a moment.

const FEEDBACK_MS = 1600;

export function initCopy(root: ParentNode = document): void {
  root.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((button) => {
    const idle = button.querySelector<HTMLElement>('[data-copy-idle]');
    const done = button.querySelector<HTMLElement>('[data-copy-done]');
    const status = button.parentElement?.querySelector<HTMLElement>('[data-copy-status]');
    let timer: ReturnType<typeof setTimeout> | undefined;

    const setDone = (isDone: boolean) => {
      if (idle) idle.hidden = isDone;
      if (done) done.hidden = !isDone;
      if (status) status.textContent = isDone ? (status.dataset.message ?? '') : '';
    };

    button.addEventListener('click', async () => {
      const candidates = Array.from(document.querySelectorAll<HTMLElement>(button.dataset.copyFrom ?? ''));
      const source = candidates.find((el) => el.getClientRects().length > 0);
      if (!source) return;

      await navigator.clipboard.writeText(source.innerText.replace(/\s*\n\s*/g, ' ').trim());
      setDone(true);
      clearTimeout(timer);
      timer = setTimeout(() => setDone(false), FEEDBACK_MS);
    });
  });
}
