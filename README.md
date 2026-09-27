# ACSS homepage

Website of the Autonomous Control and Stochastic Systems Research Lab (ACSS), School of Electrical Engineering, KAIST.

A static site built with [Astro](https://astro.build).
Content (publications, members, projects, gallery, notices) lives in YAML files under `src/content/` and is validated against a schema at build time, so adding or changing content never requires touching page code.

## Which document do I need?

| You want to... | Start here | Then |
|---|---|---|
| Ask for a change without editing anything: a new paper, your profile, a broken link | [CONTRIBUTING.md](.github/CONTRIBUTING.md) (한국어: [CONTRIBUTING.ko.md](.github/CONTRIBUTING.ko.md)) | Open a GitHub Issue with the matching template and ping the maintainer |
| Maintain the content yourself: add papers, members, notices, photos | [MAINTAINING.md](MAINTAINING.md) | Copy the folder's `_template.yaml`, or use the "Ask Claude" prompt in the recipe |
| Change code or design | [Development](#development) below, then [DESIGN.md](DESIGN.md) | Read [CLAUDE.md](CLAUDE.md) for the project rules, and run `build`, `check` and `guard` before committing |
| Work on this repo with Claude Code | [CLAUDE.md](CLAUDE.md) | Rules and skills under [.claude/](.claude/) load on their own |

## Documents

- [MAINTAINING.md](MAINTAINING.md): the maintainer's guide.
  Section 2-1 explains the web admin at `/admin/`, whose field definitions are [public/admin/config.yml](public/admin/config.yml).
  How the site is built, which page reads which content folder, step-by-step recipes (add a paper, add a member, post a notice, open or close recruiting), and what to do when a build fails.
- [.github/CONTRIBUTING.md](.github/CONTRIBUTING.md) and [CONTRIBUTING.ko.md](.github/CONTRIBUTING.ko.md): how lab members request an update through a GitHub Issue.
  The templates are in [.github/ISSUE_TEMPLATE/](.github/ISSUE_TEMPLATE/).
- [DESIGN.md](DESIGN.md): the design system.
  Tokens, typography, layout, every component, copywriting tone, the accessibility checklist, and the change rules in section 9.
  `src/styles/tokens.css` is its single source of truth.
- [CLAUDE.md](CLAUDE.md): the rules Claude Code follows in this repo, which are also the project rules for any developer.
  Static site only, content out of code, tokens and lucide only, English docs and commits, one sentence per line, and what "done" means.
- [.claude/rules/](.claude/rules/): rules that apply to specific paths (the content model, UI code).
  [.claude/skills/](.claude/skills/): the content recipes as procedures Claude runs.
- `src/content/<collection>/_template.yaml`: one per content folder.
  It documents every field of that collection and is the file you copy to add an item.

## Development

Requires Node.js 22 or newer.
The default shell may have an older Node, so always run `nvm use` (it reads `.nvmrc`) in the same command, as shown below.

```bash
nvm use && npm install
nvm use && npm run dev      # local preview at http://localhost:4321
nvm use && npm run build    # static build into dist/ (includes the content schema check)
nvm use && npm run preview  # serve the build output
nvm use && npm run check    # type check
nvm use && npm run guard    # project rules (lucide-only icons, colors only in tokens.css, content via src/lib/content.ts, no CDNs, media through Figure and within the file rules)
nvm use && npm run responsive  # after a build: every page at 360/768/1024/1440px must fit its viewport
```

The web admin is `/admin/` on the preview server; the dev server reloads it on every content save, so test it after a build with `npm run preview`.
Before opening a pull request, `nvm use && npm run build`, `nvm use && npm run check` and `nvm use && npm run guard` must pass.
When the design or the content model changes, update `DESIGN.md`, `MAINTAINING.md` or the affected `_template.yaml` in the same change.

### Branches

`main` is the deployed site; nobody commits on it directly.
Content updates go on `dev` and are merged into `main` after a passing build, with no pull request needed.
Development work (features, design, code) goes on a branch off `dev` and reaches `dev` through a pull request that passes `build`, `check` and `guard`; `dev` is then merged into `main`.
[MAINTAINING.md](MAINTAINING.md) section 4 has the exact commands.
