// EN/KR switch. Both languages are in the page; a [data-lang-toggle] button flips
// the `data-lang-scope` value on its nearest scope element, and global.css hides
// the other language. The choice is not remembered between pages.

export function initLangToggle(root: ParentNode = document): void {
  root.querySelectorAll<HTMLButtonElement>('[data-lang-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const scope = button.closest<HTMLElement>('[data-lang-scope]');
      if (scope) scope.dataset.langScope = scope.dataset.langScope === 'ko' ? 'en' : 'ko';
    });
  });
}
