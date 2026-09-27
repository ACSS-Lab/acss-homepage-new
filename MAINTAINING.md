# ACSS Website Maintenance Guide

> For the person who maintains the site.
> No technical background needed.
> When you hit an unfamiliar term, ask Claude "what does this mean?"
>
> Claude's own working rules live in `CLAUDE.md`, `.claude/rules/` and `.claude/skills/`.
> You don't need to read those; the "Ask Claude" prompts below are all you need.

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

### Pages and where their content lives

| Page | Address | Content files (under `src/content/`) |
|---|---|---|
| Home | `/` | `notices/`, `news/`, newest `gallery/` posts; wording in `pages/home.yaml` |
| Our Vision | `/about/vision/` | `pages/vision.yaml` + long text in `prose/vision/` |
| Research Areas | `/about/research-areas/` | `research-areas/` (papers linked from `publications/`) |
| Publications | `/research/publications/` | `publications/`, tags from `taxonomy/areas.yaml` |
| Projects | `/research/projects/` | `projects/` (papers linked from `publications/`) |
| PI & Staffs | `/team/professor/` | `team/pi_and_staff/` |
| Team | `/team/` (`#current`, `#interns`, `#alumni`) | `team/current/`, `team/undergrad_interns/`, `team/alumni/` |
| Gallery | `/gallery/` | `gallery/` |
| Contact | `/contact/` | `contact/tracks.yaml`, `site/site.yaml` (address, maps, e-mails) |

Every page's headings and labels are in `pages/<page>.yaml`; the header menu in `site/navigation.yaml`.

---

## 2. Setup (one time)

- **GitHub account** — to get edit access, ask the current admin to "add me as a collaborator."
- Admin URL: `https://acss.kaist.ac.kr/admin`
- (Only if you want to edit/preview locally) install dev tools on your laptop — see section 4. Not needed for web-only editing.

> ⚠️ Never write **secrets** (passwords, tokens) into files or paste them into chat. If one is needed, Claude will guide you.

---

## 3. Common task recipes

Each task, until the web admin exists: open the folder named in the recipe → **copy `_template.yaml`** (it explains every field) → fill it in → save and push (section 4). With the web admin it will be: log into `/admin` → pick the collection → **New/Edit** → **Save/Publish**.
If you're unsure which field takes what, copy the "Ask Claude" prompt below.

### 3-1. Add a publication (Publications)
- Files: `src/content/publications/` — one file per paper. **Copy `_template.yaml`** and name it with a short id (`tro26.yaml`). The id is the paper's permanent link (`#pub-tro26`) and how projects and research areas refer to it, so don't rename it later.
- Required: title, authors (a list, in published order; mark equal first authors with `*` and the corresponding author with `†`), venue, type (`journal`/`conference`/`preprint`/`patent`), year, month, areas (area codes from 3-9), summary.
- Optional: `venueShort`, `selected: true` (features it in the Selected publications carousel), `links` (project / venue / paper / slides / video / code — only the ones you list are shown), `figure` (image, alt text, width/height ratio).
- Figure: put the image at `src/assets/images/publications/<id>.png` (or a short silent `<id>.mp4` loop), then set `figure.image: /images/publications/<id>.png` and `figure.alt`. Until then the row shows a placeholder.
- Order is automatic: newest first, by year then month.
- **Ask Claude**:
  > Add this BibTeX (or DOI) as a Publications entry. Leave Selected off.
  > `paste BibTeX/DOI here`

### 3-2. Add/edit a member (Team)
- Files: `src/content/team/` — one file per person, filed in a subfolder by status. **Copy `_template.yaml`** into the right subfolder, name it `firstname-lastname.yaml`, and fill it in. The template lists every field with an example.
- `group` decides where the person appears, and the subfolder must match it (the build stops otherwise):
  - `current/` — `member` (current postdoc/PhD/MS)
  - `undergrad_interns/` — `intern`
  - `alumni/` — `alumni`
  - `pi_and_staff/` — `pi`, `visiting`, `staff`
- Required for a member: name, role (`postdoc`/`phd`/`ms`), joined (`2026-03`), topics (area codes from 3-9; `[]` if none yet).
- Optional for everyone: Korean name, email, photo, links (homepage / LinkedIn / Google Scholar). **A link or email that is left out is simply not shown.**
- Photo: put a 3:4 image at `src/assets/images/team/<file name>.jpg`, then add `photo: /images/team/<file name>.jpg`. Until then the card shows a placeholder.
- **Graduation**: move their file from `current/` to `alumni/`, change `group: member` to `group: alumni`, replace `role` with `degree` (`PhD`/`MS`), add `graduated` (`2026-02`), and `now` (current affiliation) once known. The file name (and so the photo path) stays the same.
- Order is automatic (members by role then join date; interns and alumni newest first). To pin someone, add `order: 1`.
- **Ask Claude**:
  > Add a new PhD student "Hong Gildong" to Team. Email is ..., research topics are ...

### 3-3. Post a notice (Notice)
- **Notice** = announcements like grad recruiting or open positions. The home page shows the newest few (pinned ones first).
- Files: `src/content/notices/` — **copy `_template.yaml`**. Required: title, date (`2026-04-28`). Optional: `pinned: true`, `badge` (short label such as "Recruiting"), `link`.
- **Ask Claude**:
  > Post a notice "2027 Spring MS/PhD applicants" dated today, pinned, badge Recruiting, linking to the Contact page.

### 3-4. Post to the gallery (Gallery)
- Files: `src/content/gallery/` — one file per post. **Copy `_template.yaml`** and name it with a short id (`welcome-2026.yaml`).
- Required: title, date (`2026-03-06`), tags (lowercase words joined with hyphens, e.g. `new-member`; the tag filter on the page is built from whatever tags the posts use).
- Photos: put them in `src/assets/images/gallery/<id>/` (`01.jpg`, `02.jpg`, ...) and list them under `photos` as `/images/gallery/<id>/01.jpg` in viewing order. The first one is the cover unless `cover` is set. Until the files are uploaded, set `placeholderCount` to the number of photos instead.
- Order is automatic: newest date first.
- **Ask Claude**:
  > Add the 2026 New Year party photos to Gallery as event. Date 2026-01-02.

### 3-5. Post news (Home Highlights)
- **News** = awards, grants, paper accepts, media mentions. The home page's Highlights list shows the newest items.
- Files: `src/content/news/` — **copy `_template.yaml`**. Required: kind (`paper`/`award`/`grant`/`media`), date. Then either write `title` (+ optional `meta`, `link`) yourself, or point at an existing entry with `publication: <id>` or `project: <id>` and its title and link are used automatically.
- **Ask Claude**:
  > Add a "Best Paper Award" item to News. Date today, kind award.

### 3-6. Add a project (Projects)
- Files: `src/content/projects/` — one file per project. **Copy `_template.yaml`** and name it with a short id (`uam-safety.yaml`).
- Required: title, status (`ongoing`/`done`), agency, start and end (`2026-03`; the planned end for an ongoing project), role, overview.
- `papers` lists publication ids (file names from 3-1); their title, venue and year are pulled in automatically and link to the paper. `[]` if none yet. A wrong id stops the build.
- Cover (16:9): put it at `src/assets/images/projects/<id>.jpg` (or a short silent `<id>.mp4` loop) and add `cover: /images/projects/<id>.jpg`.
- Order is automatic: newest start date first. When a project ends, change `status` to `done`.
- **Ask Claude**:
  > Add a project "..." funded by ..., 2026.03 to 2029.02, ongoing.

### 3-7. Change contact info, address, etc.
- **Site config** — `src/content/site/site.yaml`: lab name, lab/admin email, address (English + Korean), map embeds (Google / Kakao), footer credit. Edit once; the header, footer, and Contact page all follow.
- **Ask Claude**:
  > Change the lab email to ... in the site config.

### 3-12. Open or close recruiting (Contact page)
- **Application tracks** — `src/content/contact/tracks.yaml`: the Postdoc / Ph.D. / M.S. / intern cards. To start or stop recruiting for a track, change only its `open: true` / `open: false`. `items` is the checklist applicants see; `subject` pre-fills the e-mail subject.
- The rest of the page's wording is in `src/content/pages/contact.yaml`. Its `collaboration` block is a finished but hidden section: set `enabled: true` to show it.
- **Ask Claude**:
  > Close the Ph.D. track on the Contact page.

### 3-8. Change the header menu
- **Menu** — `src/content/site/navigation.yaml`: the menu items in display order. An item with `children` becomes a dropdown.
- Links to pages on this site start and end with `/` (e.g. `/gallery/`).

### 3-9. Add a research-area tag
- **Research areas** — `src/content/taxonomy/areas.yaml`: the tags used to label publications and members, grouped into families. Add a `{ code, label }` line under the right family; codes are letters/digits only and must be unique.
- Adding a whole new *family* also needs a color, which is a design change — ask Claude.

### 3-10. Change the wording on a page
- **Page text** — `src/content/pages/<page>.yaml` (e.g. `professor.yaml`): the page's titles, section names and labels. Lists of items (people, publications, ...) are not here; they come from their own folders.
- **Long text** (the paragraphs on Our Vision) is Markdown, one file per language: `src/content/prose/<page>/<section>/en.md` and `ko.md`. Write paragraphs separated by a blank line; `**bold**` and `*italic*` work. Both languages are required — the build stops if one is missing.
- Bilingual fields in YAML are written as `en:` / `ko:` pairs. In a headline, `*word*` sets the word in italics.
- Short labels shared by many pages ("E-mail", "Homepage", screen-reader labels) are in `src/content/site/ui.yaml`.
- **Home hero background** (`pages/home.yaml`, `hero.background`): put an image or a short silent `.mp4` loop at `src/assets/images/home/hero.jpg` or `hero.mp4` and set `background: /images/home/hero.mp4`. With a loop, a same-named `hero.jpg` next to it is shown until it plays. Until `background` is set, `backgroundNote` is shown instead.

### 3-11. Edit the Research Areas page
- Files: `src/content/research-areas/` — one file per area, shown in **file-name order** (keep the number prefix: `01-...`, `02-...`). Copy `_template.yaml` to add one. The page lays the cards out three to a row.
- Each area has a title and a list of sub-topics (`subs`): title, `problem` and `goal` (each with `en:` and `ko:`), `applications` (a list), and `papers`.
- `papers` lists publication ids (file names from 3-1). Title, authors and venue are pulled from the publication automatically; `[]` hides the "Related Papers" row. A wrong id stops the build.
- Card image: put it at `src/assets/images/research/<file name>.jpg` and add `image: /images/research/<file name>.jpg`.

> After saving, the live site **updates in a few minutes**. If you don't see it, hard-refresh (clear cache).

---

## 4. (Optional) Preview / edit on your own laptop

Skip this section if web editing is enough. Useful for larger changes or reviewing code with Claude.

```bash
# 1) One time: clone the repo
git clone <repo URL> && cd acss-homepage

# 2) Install tools. Requires Node.js 22 or newer: `nvm use` picks it (reads .nvmrc),
#    so always put it in front of npm commands as shown.
nvm use && npm install

# 3) Run the preview server → open http://localhost:4321 in a browser
nvm use && npm run dev

# 4) Edit content/code and save → the browser reloads automatically
```

### Branches: where to work, and how a change reaches the live site

`main` is what visitors see.
Never edit or commit on `main` directly.

**Content updates** (files under `src/content/` and `src/assets/images/`): work on `dev`, check that the site builds, then merge `dev` into `main`.
No pull request is needed.

```bash
# 1) Start from the latest dev
git checkout dev && git pull

# 2) Edit, then check that the site still builds
nvm use && npm run build

# 3) Commit and push to dev
git add -A
git commit -m "content: one line on what changed and why (in English)"
git push

# 4) Publish: merge dev into main and push. Pushing main is what updates the live site.
git checkout main && git pull
git merge dev
git push
git checkout dev
```

**Development work** (new features, design changes, anything under `src/` other than `src/content/`): a pull request is the rule.
Create a branch from `dev` (for example `feat/mobile-nav`), push it, and open a pull request into `dev` on GitHub.
Merge it only after `build`, `check` and `guard` pass and the preview looks right.
Then publish as above by merging `dev` into `main`.
When you work with Claude, tell it which branch you are on; its own rules in `CLAUDE.md` say the same thing.

> **Mistakes are fine.** Every change is recorded and **can be reverted**. Don't be afraid — if you're stuck, ask Claude.

---

## 5. When something breaks

- **The site isn't updating**: check that your change was merged into `main` and pushed (section 4), and that the deploy finished.
  Clear your browser cache.
- **The build failed (a red X on GitHub)** → usually a missing required field, a mistyped option, or an id that points at a file that doesn't exist. The error names the file. Copy it to Claude:
  > Fix this build error: `paste error message`
- **`npm run guard` failed** → a project rule was broken in code (a hand-drawn icon, a color outside `tokens.css`, ...). The message says which file and rule.
- **Admin login fails** → confirm with the current admin that you're a GitHub collaborator.
- **Posted something wrong** → tell Claude "revert my last change" to restore the previous state.

---

