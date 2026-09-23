---
name: checking-responsive
description: Checks that the built site fits phone, tablet, laptop and desktop widths without horizontal overflow, and drives headless Chrome for interaction probes (menus, carousels, dialogs). Use after any visual change, before reporting a UI task done, or when the user asks to verify mobile or responsive layout.
argument-hint: [routes] [widths]
---

# Checking responsive layout

Request, if given: $ARGUMENTS

The site must never be wider than the viewport, down to 360px.
`DESIGN.md` section 6 lists the breakpoints and what stacks at each one.

## 1. Overflow check on every page

```bash
nvm use && npm run build && nvm use && npm run responsive
```

`npm run responsive` serves `dist/`, opens every route at 360, 768, 1024 and 1440px and prints one line per route and width.
A line that says `OVERFLOW` names the widest elements past the viewport edge; fix those and rerun.
Options: `--widths 360,640`, `--routes /,/team/`, `--shots <dir>` to save a full-page screenshot per route and width.
The command exits non-zero while any page overflows, so it can be the last step before reporting done.

## 2. Look at the pages

Save screenshots (`--shots`) and read the phone-width and tablet-width ones for every route the change touched.
Check that stacked sections keep their order, nothing is clipped, text is not squeezed into a narrow column, and touch targets are 44px.

## 3. Interaction probes

`scripts/browser.mjs` runs a probe file against a page with real clicks, keys and viewport changes:

```bash
nvm use && node scripts/browser.mjs my-probe.mjs
```

A probe exports `default async (page) => {}` and uses `page.goto(url, { width, height })`, `page.click(selector)`, `page.key('Escape')`, `page.resize(width)`, `page.eval(expression)`, `page.screenshot(path)` and `page.media([...])`.
Start a preview server first with `nvm use && npm run preview` and point `goto` at it; the server that `npm run responsive` starts is not reusable.
Write probes into the scratchpad, not the repo.

Things to probe when the change touched them:

- the header drawer at 360px: opens on the button, focus lands on the close button, Escape and the backdrop close it and focus returns, it closes when the width grows past 768px
- carousels at 360px and 1440px: one card per view under 768px, dots hidden beyond the reachable positions, next disabled at the end
- dialogs at 360px: the window fits the viewport, Escape closes it
- `prefers-reduced-motion`: `page.media([{ name: 'prefers-reduced-motion', value: 'reduce' }])`, then check that autoplay and entrance animations are off

## 4. Reduced motion and accessibility

Run the checklist in `DESIGN.md` section 7 for the elements the change touched.
