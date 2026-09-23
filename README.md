# ACSS homepage

Website of the Autonomous Control and Stochastic Systems Research Lab (ACSS), School of Electrical Engineering, KAIST.

A static site built with [Astro](https://astro.build). Content (publications, members, projects, gallery, notices) lives in YAML files under `src/content/` and is validated against a schema at build time, so adding or changing content never requires touching page code.

## Which document do I need?

| You want to... | Start here | Then |
|---|---|---|
| Ask for a change without editing anything: a new paper, your profile, a broken link | [CONTRIBUTING.md](.github/CONTRIBUTING.md) (한국어: [CONTRIBUTING.ko.md](.github/CONTRIBUTING.ko.md)) | Open a GitHub Issue with the matching template and ping the maintainer |
| Maintain the content yourself: add papers, members, notices, photos | [MAINTAINING.md](MAINTAINING.md) | Copy the folder's `_template.yaml`, or use the "Ask Claude" prompt in the recipe |
| Change code or design | [Development](#development) below, then [DESIGN.md](DESIGN.md) | Read [CLAUDE.md](CLAUDE.md) for the project rules, and run `build`, `check` and `guard` before committing |
| Work on this repo with Claude Code | [CLAUDE.md](CLAUDE.md) | Rules and skills under [.claude/](.claude/) load on their own |

## Documents

- [MAINTAINING.md](MAINTAINING.md): the maintainer's guide. How the site is built, which page reads which content folder, step-by-step recipes (add a paper, add a member, post a notice, open or close recruiting), what to do when a build fails.
- [.github/CONTRIBUTING.md](.github/CONTRIBUTING.md) and [CONTRIBUTING.ko.md](.github/CONTRIBUTING.ko.md): how lab members request an update through a GitHub Issue. The templates are in [.github/ISSUE_TEMPLATE/](.github/ISSUE_TEMPLATE/).
- [DESIGN.md](DESIGN.md): the design system. Tokens, typography, layout, every component, copywriting tone, the accessibility checklist, and the change rules in section 9. `src/styles/tokens.css` is its single source of truth.
- [CLAUDE.md](CLAUDE.md): the rules Claude Code follows in this repo, which are also the project rules for any developer. Static site only, content out of code, tokens and lucide only, English docs and commits, what "done" means.
- [.claude/rules/](.claude/rules/): rules that apply to specific paths (the content model, UI code). [.claude/skills/](.claude/skills/): the content recipes as procedures Claude runs.
- `src/content/<collection>/_template.yaml`: one per content folder. Documents every field of that collection and is the file you copy to add an item.

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

Before opening a pull request: `npm run build`, `npm run check` and `npm run guard` must pass, and `DESIGN.md`, `MAINTAINING.md` or the affected `_template.yaml` are updated in the same change when the design or the content model changes.
