// Hash-driven tabs: the URL fragment (#current, #interns, #alumni) selects the
// panel. Works on load and whenever the hash changes, including from links in
// the header menu while already on the page.
//
//   [data-tabs data-default="current"]   root
//     [data-tab-panel="current"]         panels; all but the selected one are `hidden`
//     [data-hide-on-tab="alumni"]        anything hidden while that tab is selected
//   [data-tab-links] a[href$="#current"] links anywhere on the page get aria-current="true"
//
// Panels carry no id, so the browser does not scroll to them.

export function initTabs(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('[data-tabs]').forEach((tabs) => {
    const panels = Array.from(tabs.querySelectorAll<HTMLElement>('[data-tab-panel]'));
    const names = panels.map((panel) => panel.dataset.tabPanel ?? '');
    const fallback = tabs.dataset.default ?? names[0];

    const select = () => {
      const wanted = location.hash.slice(1);
      const tab = names.includes(wanted) ? wanted : fallback;
      panels.forEach((panel) => (panel.hidden = panel.dataset.tabPanel !== tab));
      tabs.querySelectorAll<HTMLElement>('[data-hide-on-tab]').forEach((el) => (el.hidden = el.dataset.hideOnTab === tab));
      document.querySelectorAll<HTMLAnchorElement>('[data-tab-links] a').forEach((link) => {
        const target = link.hash.slice(1);
        if (names.includes(target)) link.setAttribute('aria-current', target === tab ? 'true' : 'false');
      });
    };

    window.addEventListener('hashchange', select);
    select();
  });
}
