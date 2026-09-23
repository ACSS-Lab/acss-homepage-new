# ACSS homepage

Website of the Autonomous Control and Stochastic Systems Research Lab (ACSS), School of Electrical Engineering, KAIST.

A static site built with [Astro](https://astro.build). Content (publications, members, projects, gallery, notices) lives in YAML files under `src/content/` and is validated against a schema at build time, so adding or changing content never requires touching page code.

## Maintaining content

Start with **[CLAUDE.md](CLAUDE.md)**: it explains how the site is built, lists every page and where its content lives, and has step-by-step recipes (add a paper, add a member, post a notice, open or close recruiting, ...). Each content folder has a `_template.yaml` to copy.

## Development

Requires Node.js 22 or newer (`nvm use` reads `.nvmrc`).

```bash
npm install
npm run dev      # local preview at http://localhost:4321
npm run build    # static build into dist/ (includes the content schema check)
npm run preview  # serve the build output
npm run check    # type check
npm run guard    # project rules (lucide-only icons, colors only in tokens.css, content via src/lib/content.ts, no CDNs)
```

The design system is documented in [DESIGN.md](DESIGN.md); `src/styles/tokens.css` is its single source of truth.
