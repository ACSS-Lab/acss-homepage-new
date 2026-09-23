# CLAUDE.md

Instructions for Claude working in this repository.
The guide for the people who maintain the site is `MAINTAINING.md`; the design system is `DESIGN.md`.
This file is loaded into every session, so it stays short: facts and rules that apply to every task.
Procedures live in `.claude/skills/`, file-specific rules in `.claude/rules/`.

## What this is

The website of the ACSS lab (School of EE, KAIST): a static site built with Astro, no server code, no UI framework.
All content is YAML and Markdown under `src/content/`, validated by the Zod schema in `src/content.config.ts` at build time.
Pages read content only through the getters in `src/lib/content.ts`, which also run the cross-file checks (unique codes, references that must exist).

## Commands

```bash
nvm use && npm run dev      # local preview at http://localhost:4321
nvm use && npm run build    # static build into dist/; runs the schema and cross-file checks
nvm use && npm run check    # type check (astro check)
nvm use && npm run guard    # project rules: lucide-only icons, colors only in tokens.css, content via src/lib/content.ts, no CDNs
```

Node 22 or newer is required, and the shell's default Node may be older.
Always chain `nvm use && ` in front of every `npm` command, in docs and when you run one; `nvm use` reads `.nvmrc`.
If `nvm` is not a function in your shell, run `source ~/.nvm/nvm.sh` first.
When you need the dev server yourself, start it detached with `npx astro dev --background` and manage it with `npx astro dev stop | status | logs`.

## Rules that always apply

- Static site only.
  Do not add a backend, database or runtime service.
  If a task seems to need one, explain the risk and an alternative first.
- Content stays out of code.
  No visible text, list of items or setting is hardcoded in `.astro` or `.ts` files; it lives in `src/content/` and is read through `src/lib/content.ts`.
- Design tokens only, lucide icons only.
  `npm run guard` enforces this.
  Read the relevant section of `DESIGN.md` before changing anything visual; section 9 defines exactly what must be a token.
- Keep the content safety net.
  A new or changed field means updating the schema, the folder's `_template.yaml`, the matching skill and `MAINTAINING.md` in the same commit.
  Never loosen the schema to make a build pass.
- No secrets in files or in chat.
  Keep HTTPS, security headers, spam protection on forms, and pinned, updated dependencies.
- No emojis in docs, code comments or commit messages.
  Emojis the user typed stay as they are.

## Language and writing

- `CLAUDE.md`, `.claude/rules/`, `.claude/skills/` and every `.md` document in this repo are written in English.
  So are code comments and commit messages.
- Exceptions: content under `src/content/` (bilingual by design) and explicit Korean translations such as `.github/CONTRIBUTING.ko.md`.
- Explain what changed and why to the user in Korean, in the conversation.
- In every `.md` file, write one sentence per line.
  Never hard-wrap a sentence across lines, and never put two sentences on one line.
  A list item that needs more than one sentence continues on indented lines, one sentence each.
  YAML frontmatter values (a skill's `description`, a rule's `paths`) are data, not prose, and stay on one line.
- Use plain ASCII punctuation only: the hyphen `-`, straight quotes `"` and `'`, three dots `...`.
  No en dash, em dash, curly quotes, ellipsis character, arrows or other typographic symbols.
  Exceptions: characters that are part of content or its notation (Korean text, the `*` and `†` author marks in publications), and code blocks that quote real output.
- When you edit an older document that does not follow these rules yet, bring the lines you touch into line; do not reformat the rest.

## Where things are

- `src/content/` is where the maintainer works.
  One file per item, in `publications/`, `projects/`, `gallery/`, `notices/`, `news/`, `research-areas/` (file-name order) and `team/` (subfolders `current/`, `undergrad_interns/`, `alumni/`, `pi_and_staff/`).
  Settings live in `site/` (identity, navigation, shared labels), `taxonomy/areas.yaml` (research-area tags), `pages/` (each page's wording and display settings), `prose/` (long bilingual Markdown) and `contact/tracks.yaml` (application tracks).
- Every item folder has a `_template.yaml` that documents each field.
  It is the source of truth for what a field means; files starting with `_` are ignored by the site.
- `src/components/`, `src/layouts/` and `src/pages/` are the screens.
  `src/scripts/` holds small vanilla-TypeScript behaviours, `src/lib/icons.ts` is the only file that imports lucide, `src/styles/tokens.css` holds the design tokens, and `scripts/guard.mjs` implements `npm run guard`.
- `public/images/` holds photos and figures referenced from content.
  Until a file exists, the page shows a striped placeholder naming the expected path.
- Planned, not set up yet: the web admin (`public/admin/`, Sveltia CMS) and automatic deployment (`.github/workflows/deploy.yml`).
- The design drafts the pages were ported from are in git history at the tag `draft-reference`.

## Definition of done

In this order: `nvm use && npm run build` passes, `nvm use && npm run check` and `nvm use && npm run guard` pass, accessibility and phone-width layout are checked for visual changes, docs are updated (`MAINTAINING.md`, `DESIGN.md`, `_template.yaml`, skills), then a clear commit message in English.

## Finishing a task

Before reporting a task as done:

1. Run `nvm use && npm run build`, `nvm use && npm run check` and `nvm use && npm run guard`.
   Report the results, including failures.
   Do not describe work as verified if a step was skipped.
2. Answer these two questions in a short paragraph at the end of the reply, even when the answer is "nothing".
   - Skill: did this task follow a multi-step procedure that will recur and that no skill in `.claude/skills/` covers, or did an existing skill miss a step?
     If so, propose the skill: name, one-line description, what it would contain.
   - CLAUDE.md and rules: did I learn a command, convention or gotcha that every future session needs and that is not written down yet?
     If so, propose the exact lines and the file.
     If an existing line proved wrong or unnecessary, propose removing it.
   A personal preference of the user belongs in auto memory, not in these files.
3. Propose; do not edit these files silently.
   Once approved, commit the doc change together with the code change it describes.
