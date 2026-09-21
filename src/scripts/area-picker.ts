// Research-area picker: a row of cards selects which detail panel is shown.
//
//   [data-area-picker]            root
//     [data-area-tab="<id>"]      card button; aria-pressed marks the selection
//     [data-area-panel="<id>"]    detail panel; all but the selected one are `hidden`
//
// A panel's entrance animation replays on its own each time it is un-hidden.

export function initAreaPicker(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('[data-area-picker]').forEach((picker) => {
    const tabs = picker.querySelectorAll<HTMLElement>('[data-area-tab]');
    const panels = picker.querySelectorAll<HTMLElement>('[data-area-panel]');

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const id = tab.dataset.areaTab;
        tabs.forEach((t) => t.setAttribute('aria-pressed', String(t === tab)));
        panels.forEach((panel) => (panel.hidden = panel.dataset.areaPanel !== id));
      });
    });
  });
}
