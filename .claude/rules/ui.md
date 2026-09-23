---
paths:
  - "src/components/**"
  - "src/layouts/**"
  - "src/pages/**"
  - "src/styles/**"
  - "src/scripts/**"
---

# UI code rules

`npm run guard` enforces the first three rules.
Run `nvm use && npm run guard` before reporting done.

- Color, spacing, radius, shadow, motion and font values come from the tokens in `src/styles/tokens.css`.
  `DESIGN.md` section 9 lists exactly what must be a token.
  No hardcoded values.
- Icons come from lucide only: register the icon in `src/lib/icons.ts` and render it with `<Icon name="..." />`.
  Never hand-write an `<svg>` or use a glyph character as an icon.
  The one exception is `src/components/ui/BrandIcon.astro`, which holds brand logos lucide lacks.
- No CDN scripts or stylesheets.
- No visible text, item list or setting in code.
  Labels come from `src/content/pages/<page>.yaml` or `src/content/site/ui.yaml`; items come from their collections through `src/lib/content.ts`.
  Pages never call `getCollection` or `getEntry` directly.
- Behaviour is small vanilla TypeScript in `src/scripts/`, one file per behaviour, each documenting the `data-*` attributes it expects.
  No UI framework.
- Read the relevant `DESIGN.md` section before changing a component, and update `DESIGN.md` in the same commit when the design changes.
- Check accessibility and phone-width layout before reporting done.
  `DESIGN.md` section 7 has the checklist.
