# CLAUDE.md — ACSS Website Maintenance Guide

> **This doc serves two readers.**
> ① The **successor** who takes over the site (non-technical is fine) — start at section 3.
> ② **Claude** working in this repo — follow the working rules in section 6.
>
> When you hit an unfamiliar term, just ask Claude "what does this mean?"

---

## 1. How this site is built (30-second summary)

- The pages are a **static website** built with **Astro** (no program runs on the server, so it's fast and secure).
- **Content** — publications, members, news — is stored as **data files** (YAML, plain text) under `src/content/`. Think: one file = one item. Page code and content are kept strictly apart: adding or changing content never requires touching code.
- Every data file is **checked against a schema** when the site builds. A missing required field or a mistyped option stops the build with a message naming the file and field, instead of quietly breaking a page.
- There are **two ways** to edit content:
  1. Log into the **web admin (`/admin`)** and edit with forms — **use this for day-to-day work.**
  2. Edit files directly — for larger changes or when working with Claude.
- When you save, the site **updates automatically** (takes a few minutes).

> **Note: the web admin (`/admin`) is planned but not set up yet.** Until it is, use way 2: edit the files under `src/content/` (on GitHub's website or on your laptop — see section 4), or ask Claude to do it. The recipes in section 3 name the form fields; the same field names are the keys in the data files.

---

## 2. Setup (one time)

- **GitHub account** — to get edit access, ask the current admin to "add me as a collaborator."
- Admin URL: `https://acss.kaist.ac.kr/admin`
- (Only if you want to edit/preview locally) install dev tools on your laptop — see section 4. Not needed for web-only editing.

> ⚠️ Never write **secrets** (passwords, tokens) into files or paste them into chat. If one is needed, Claude will guide you.

---

## 3. Common task recipes (via the web admin)

Each task: log into `/admin` → pick the collection → **New/Edit** → fill the form → **Save/Publish**.
If you're unsure which field takes what, copy the "Ask Claude" prompt below.

### 3-1. Add a publication (Publications)
- Collection: **Publications** → New
- Required: title, authors (comma-separated), year, type (Journal/Conference), venue, topics
- Optional: DOI/URL, PDF file, abstract, "Selected" (check to feature it in Home Highlights)
- **Ask Claude**:
  > Add this BibTeX (or DOI) as a Publications entry. Leave Selected off.
  > `paste BibTeX/DOI here`

### 3-2. Add/edit a member (Team)
- Files: `src/content/team/` — one file per person. **Copy `_template.yaml`**, name it `firstname-lastname.yaml`, and fill it in. The template lists every field with an example.
- `group` decides where the person appears: `member` (current postdoc/PhD/MS), `intern`, `alumni`, `pi`, `visiting`, `staff`.
- Required for a member: name, role (`postdoc`/`phd`/`ms`), joined (`2026-03`), topics (area codes from 3-9; `[]` if none yet).
- Optional for everyone: Korean name, email, photo, links (homepage / LinkedIn / Google Scholar). **A link or email that is left out is simply not shown.**
- Photo: put a 3:4 image at `public/images/team/<file name>.jpg`, then add `photo: /images/team/<file name>.jpg`. Until then the card shows a placeholder.
- **Graduation**: open their file, change `group: member` to `group: alumni`, replace `role` with `degree` (`PhD`/`MS`), add `graduated` (`2026-02`), and `now` (current affiliation) once known.
- Order is automatic (members by role then join date; interns and alumni newest first). To pin someone, add `order: 1`.
- **Ask Claude**:
  > Add a new PhD student "Hong Gildong" to Team. Email is ..., research topics are ...

### 3-3. Post news (News) / post a notice (Notice)
- **News** = awards, project results, paper accepts, etc. **Notice** = announcements like grad recruiting.
- Both show the **5 most recent** on the home page automatically (older ones drop off the list).
- Required: title, date, (News) type, body.
- **Ask Claude**:
  > Add a "Best Paper Award" item to News. Date today, type award.

### 3-4. Post to the gallery (Gallery)
- Collection: **Gallery** → New. Upload multiple photos + set a cover photo.
- Category: event / new-member / graduate / alumni
- **Ask Claude**:
  > Add the 2026 New Year party photos to Gallery as event. Date 2026-01-02.

### 3-5. Change the Home Highlights cards
- Collection: **Highlights**. Pick the 3 cards (Selected Pub 1 + Project 1 + Award 1).
- For each card, just choose which publication/project/award it points to.

### 3-6. Add a project (Projects)
- Collection: **Projects** → New. Set status to `ongoing`/`past`.

### 3-7. Change contact info, address, etc.
- **Site config** — `src/content/site/site.yaml`: lab name, lab/admin email, address (English + Korean), footer credit. Edit once; the header, footer, and Contact page all follow.
- **Ask Claude**:
  > Change the lab email to ... in the site config.

### 3-8. Change the header menu
- **Menu** — `src/content/site/navigation.yaml`: the menu items in display order. An item with `children` becomes a dropdown.
- Links to pages on this site start and end with `/` (e.g. `/gallery/`).

### 3-9. Add a research-area tag
- **Research areas** — `src/content/taxonomy/areas.yaml`: the tags used to label publications and members, grouped into families. Add a `{ code, label }` line under the right family; codes are letters/digits only and must be unique.
- Adding a whole new *family* also needs a color, which is a design change — ask Claude.

> After saving, the live site **updates in a few minutes**. If you don't see it, hard-refresh (clear cache).

---

## 4. (Optional) Preview / edit on your own laptop

Skip this section if web editing is enough. Useful for larger changes or reviewing code with Claude.

```bash
# 1) One time: clone the repo
git clone <repo URL> && cd acss-web

# 2) Install tools (requires Node.js)
npm install

# 3) Run the preview server → open http://localhost:4321 in a browser
npm run dev

# 4) Edit content/code and save → the browser reloads automatically
```

To push edits to the live site:
```bash
git add -A
git commit -m "content: one line on what changed and why"
git push
```
`push` triggers an automatic build + deploy.

> **Mistakes are fine.** Every change is recorded and **can be reverted**. Don't be afraid — if you're stuck, ask Claude.

---

## 5. When something breaks

- **The site isn't updating** → check that you saved/`push`ed and the deploy finished. Clear your browser cache.
- **The build failed (a red X on GitHub)** → usually a missing required field or a format error. Copy the error to Claude:
  > Fix this build error: `paste error message`
- **Admin login fails** → confirm with the current admin that you're a GitHub collaborator.
- **Posted something wrong** → tell Claude "revert my last change" to restore the previous state.

---

## 6. Working rules for Claude (successors can skip this)

Claude writing/editing code in this repo follows these:

- **Simple & safe first**: don't add a backend/DB on your own if it breaks the static-site principle. If needed, explain the risk and alternative first.
- **Tokens only**: use variables from `DESIGN.md`/`tokens.css` for color/spacing/font. No hardcoded values (DESIGN.md §9 defines exactly what must be a token).
- **Icons from lucide only**: never hand-draw an `<svg>` or use a glyph character (▾, →) as an icon. Register the lucide icon in `src/lib/icons.ts` and render it with `<Icon name="..." />`.
- **Keep the content safety net**: enforce required fields via the Zod schema in `src/content.config.ts`. A new field means updating the schema, this doc's recipes, and — once it exists — the CMS config (`public/admin/config.yml`) **at the same time**.
- **Content stays out of code**: no visible text, list of items, or setting is hardcoded in `.astro`/`.ts` files — it lives in `src/content/`. Pages read content only through the getters in `src/lib/content.ts`, which also run the cross-file checks the schema can't express (duplicate codes, references to items that don't exist) and fail the build with a message that names the file.
- **Security invariants**: no committed secrets, force HTTPS, least privilege, pin & update dependencies, form spam protection, keep security headers.
- **Care for non-technical readers**: explain "what & why" in Korean for each change (in conversation). **Commit messages and code comments are always written in English**, in clear plain language.
- **No emojis**: never add emojis to docs, code comments, or commit messages. Emojis the user typed themselves stay as they are — don't add new ones and don't remove theirs.
- **Doc sync**: when structure/design/content-model changes, update `CLAUDE.md`, `DESIGN.md`, and `.claude/skills/` together.
- **Definition of done**: `npm run build` succeeds (this includes the schema check) → `npm run check` and `npm run guard` pass → accessibility/responsive checked → docs updated → clear commit. Follow this order.

### Common commands
```bash
npm run dev      # local preview
npm run build    # static build (verify before deploy)
npm run preview  # preview the build output
npm run check    # type check
npm run guard    # project rules: lucide-only icons, colors only in tokens.css, content read via src/lib/content.ts, no CDNs
```

### Repo map
- `src/content/` — the actual content (YAML data files). Where the maintainer works most.
  - `site/site.yaml` (lab identity & contact), `site/navigation.yaml` (header menu), `site/ui.yaml` (short shared interface labels), `taxonomy/areas.yaml` (research-area tags).
  - `team/` (one file per person). Every item folder has a `_template.yaml` to copy; files starting with `_` are ignored by the site.
- `src/content.config.ts` — content rules (schema). Don't loosen it carelessly.
- `src/lib/content.ts` — the only place that reads content collections; cross-file integrity checks live here.
- `src/components/`, `src/pages/`, `src/layouts/` — screen structure.
- `src/lib/icons.ts` — icon registry; the only file that imports from `@lucide/astro`.
- `src/scripts/` — small vanilla-TypeScript behaviors (menus, filters, carousels). No UI framework.
- `src/styles/tokens.css` — design tokens.
- `scripts/guard.mjs` — the rule checks behind `npm run guard`.
- `public/admin/` — web admin (Sveltia CMS) config.
- `.github/workflows/deploy.yml` — automatic deployment.
