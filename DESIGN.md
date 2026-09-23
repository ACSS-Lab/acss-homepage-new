# DESIGN.md — ACSS Design System

> Visual-language reference: **Toss**. Two goals:
> ① **Strip the "AI-generated smell"** — avoid clichéd gradients, habitual blue everywhere, uniform 3-column grids, and repeated formulaic sections.
> ② **Carry ACSS's character** — as an academic research lab, prioritize trust, clarity, and depth. Not a consumer-marketing tone.
>
> Audience: prospective grad/intern applicants, researchers seeking collaboration, academic peers.
> Every screen uses the **design tokens** below only (what must be a token vs. what may be a literal is defined in §9). Tokens live in `src/styles/tokens.css` as CSS variables — the only file allowed to contain color literals.

---

## 0. Design attitude for ACSS

- **Calm authority** — order over flash. The credibility of the research should read visually.
- **Content that reads** — publications, research overviews, and bios are meant to be *read*. Legibility beats decoration.
- **Deliberate restraint** — navy is the brand color but used sparingly (6:3:1). Black/white neutrals own the screen.
- **Honest graphics** — icons, illustrations, and research figures only when they carry meaning. No decorative filler.

---

## 1. Color

### Principles
- **6 : 3 : 1 ratio** — background : sub-background : accent. Base tones are **black/white (neutral)**.
  - 6 = light background (white / off-white)
  - 3 = sub-background (light-gray sections, or deep-navy sections for "brand moments" like hero/footer)
  - 1 = **navy accent** — only on CTAs, links, selected filters, key emphasis
- ⚠️ **Don't lay down blue by habit.** Navy is a *deliberately chosen* brand color, used only in that 1/10 accent slot. Don't wash cards/sections in blue.
- **Use gradients sparingly.** Use solid fills except in the one place emphasis is genuinely needed (e.g. the hero background). No rainbow / purple-blue gradients.
- **Dark sections aren't pure black** — use a deep tone with navy mixed in (`--navy-900`).

### Tokens
```css
/* Accent (the 1/10) — Navy */
--navy-900: #0A1B3D;  /* dark-section background (hero/footer), strongest emphasis */
--navy-700: #143B84;
--navy-600: #0A1B3D;  /* Primary — links/active states/brand emphasis. Deliberately frozen to the
                         same value as --navy-900 (the accent the design drafts were reviewed with) */
--navy-500: #2E64C7;  /* hover/active, focus ring */
--navy-100: #E7EEFA;  /* very light accent bg (selected chip, callout) — minimal use */

/* Base (the 6+3) — neutrals own the screen */
--ink:      #17181C;  /* strongest body text (not pure black) */
--gray-700: #4E5968;  /* secondary text */
--gray-500: #66707E;  /* caption / meta (5.0:1 on white — passes AA) */
--gray-300: #D1D6DB;  /* dividers (keep borders minimal) */
--gray-100: #F2F4F6;  /* sub-background (the 3) */
--white:    #FFFFFF;  /* base background (the 6) */
--bg:       #FCFCFD;  /* default page background */

/* Semantic (minimal) */
--success: #12B886;  --warning: #F59F00;  --danger: #E03131;
--link:    var(--navy-600);

--ink-muted: rgba(23,24,28,.66);  /* small notes over imagery */
--ink-faint: rgba(23,24,28,.28);  /* idle dots */
--ink-rule:  rgba(23,24,28,.18);  /* progress-bar track on light imagery */
--ink-fill:  rgba(23,24,28,.08);  /* hover fill on glass controls */

/* On-dark — translucent whites for text/lines/fills on --navy-900 sections */
--on-dark-strong: rgba(255,255,255,.85);  /* hover text */
--on-dark:        rgba(255,255,255,.72);  /* body text */
--on-dark-muted:  rgba(255,255,255,.62);  /* meta text */
--on-dark-faint:  rgba(255,255,255,.55);
--on-dark-rule:   rgba(255,255,255,.12);  /* dividers */
--on-dark-border: rgba(255,255,255,.16);
--on-dark-fill:   rgba(255,255,255,.09);  /* pill/segmented-control background */
--on-dark-fill-hover: rgba(255,255,255,.1);
--on-dark-fill-strong: rgba(255,255,255,.2);   /* button hover on dark */
--on-dark-border-strong: rgba(255,255,255,.22);

/* Textures */
--ph:          repeating-linear-gradient(135deg,#EDEFF2 0 9px,#E4E8EC 9px 18px);  /* image placeholder */
--ph-dark:     repeating-linear-gradient(135deg,rgba(255,255,255,.09) 0 10px,rgba(255,255,255,.035) 10px 20px);
--stripe-dark: repeating-linear-gradient(135deg,rgba(255,255,255,.05) 0 14px,rgba(255,255,255,.015) 14px 28px);  /* dark hero overlay */
--scrim-hero:  linear-gradient(180deg,rgba(10,27,61,.72) 0%,rgba(10,27,61,.88) 55%,rgba(10,27,61,.97) 100%);  /* tall hero: keeps text readable over a background image */
--overlay:         rgba(10,27,61,.72);  /* page dimmed behind a modal */
--overlay-dark:    rgba(6,14,32,.92);   /* full-screen photo viewer */
--glass:           rgba(255,255,255,.9); /* frosted chip over imagery */
--scrim-card:      linear-gradient(to top,rgba(10,27,61,.88) 0%,rgba(10,27,61,.42) 46%,rgba(10,27,61,.06) 100%);  /* image card, selected */
--scrim-card-idle: linear-gradient(to top,rgba(10,27,61,.9) 0%,rgba(10,27,61,.58) 52%,rgba(10,27,61,.3) 100%);    /* image card, idle */
```

> **Research-area chips**: each family in `taxonomy/areas.yaml` has a fill token, white text on top:
> `--area-control #2B4C9B` · `--area-uncertainty #C0453F` · `--area-learning #6F5EA0` · `--area-modeling #B93E93` · `--area-estimation #C97A12` · `--area-applications #79828E`.
> Adding a family means adding a token here and in `tokens.css`. (`estimation` and `applications` measure below 4.5:1 with 12px white text; darken them when the taxonomy is next revised.)
>
> **Image placeholders**: until a real photo/figure exists, its slot shows the `--ph` stripes (`--ph-dark` on dark surfaces) with a short mono note describing the intended image. The slot keeps its final aspect ratio so the layout doesn't shift when the asset arrives.
>
> **Feel in practice**: most screens (publication lists, member lists) are white bg + black text + gray meta, with navy dotted in only on links, selected states, and primary buttons. The home hero and footer use `--navy-900` dark sections as "brand moments."

---

## 2. Typography

- **Font**: avoid system fonts; use **Pretendard** (Korean + Latin, free). Self-hosted from the pinned `pretendard` npm package — no font CDN.
  ```css
  --font-sans: "Pretendard Variable", "Pretendard", "Spoqa Han Sans Neo", "Noto Sans KR", sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, monospace;  /* placeholder notes, venue lines */
  ```
- **Baseline feel**: Toss uses a dense 13px baseline, but we have lots of *reading* content, so **body is 16px** for legibility. Only dense areas (lists/meta) drop to 13–14px.
- **12px is for low-priority info only** (captions, footnotes, disclaimers).

| Token | Size (mobile/desktop) | Weight | Line-height | Use |
|---|---|---|---|---|
| `--fs-display` | 36 / 48px | 700 | 1.15 | hero headline (home + every dark page banner) |
| `--fs-h1` | 28 / 32px | 700 | 1.25 | page title on light pages |
| `--fs-title` | 27px | 700 | 1.25 | featured name (PI card) |
| `--fs-h2` | 22 / 24px | 600 | 1.3 | section title |
| `--fs-h3` | 18 / 20px | 600 | 1.4 | card/block title |
| `--fs-wordmark` | 19px | 700 | 1 | header wordmark |
| `--fs-lg` | 18px | 600 | 1.4 | small card title |
| `--fs-body` | 16px | 400 | 1.65 | body (abstracts, intros) |
| `--fs-ui` | 15px | 500–600 | 1 | nav items, buttons |
| `--fs-sm` | 14px | 400 | 1.5 | list rows, meta |
| `--fs-meta` | 13px | 400–600 | 1.5 | footer, dense meta, inline CTAs |
| `--fs-caption` | 12px | 500 | 1.4 | captions, badges |

- `tokens.css` currently holds the **desktop** values only; the mobile column is the target for the responsive pass.
- Slightly tighten heading letter-spacing (-0.01em … -0.03em as size grows). Constrain long body (abstracts, research intros) to `--container-narrow` for readable line length.
- **Korean prose is set looser than English**: `--lh-prose-en: 1.75`, `--lh-prose-ko: 1.85`.

---

## 3. Layout

### Do
- **Vary the rhythm across sections.** Alternate image position (left/right); slip a card-grid section between plain-text sections. (About's Research Direction is the prime case — figure and text alternating left/right.)
- **Match density to content type.**
  - *Browse/search* (Publications, Team): light filters + a **dense list**. Scannable rows over showy cards.
  - *Editorial* (Home, About): a hero, then long-form rows or a few large cards. Not a uniform grid.
- **Keep the footer structurally identical across all subpages** — the one element that stays fixed as a nav anchor.

### Don't
- Force everything into a uniform 3–4 column grid.
- Repeat the same **"headline → title → description → button → content" section formula.** It pads whitespace and buries the key info.

### Per-page density
- **Home**: one desktop screen (min 1400×1170): a navy hero that fills the space above a white band. Hero: logo slot top-left, headline + lede + CTA bottom-left, a floating Notice card bottom-right. Band: the Highlights feed (dense rows) on the left, a 16:9 gallery carousel (512px) on the right.
- **Publications**: filter chips + publication **list rows** (title, authors, venue, year). Don't turn these into cards.
- **Team**: filter sidebar + two-column **person cards** grouped by role; interns as ruled summary rows; alumni as cards grouped by degree.
- **About**: Our Vision is a tall hero plus editorial rows (label / prose / figure); Research Areas is three image cards that switch a detail panel below.

---

## 4. Components

### Card
**Do**
- **Borderless cards.** No border, and no partial accents (e.g. a colored top edge) either. Separate with **subtle shadow + background contrast** only.
- Keep corner radius **moderate** (not overly rounded).
- Use cards **only to group related info**.
- **Card and list side by side**: the same item appears as a card where it is browsed (project cards, gallery covers, person cards) and as a dense row where it is scanned (the home Highlights feed, publication rows). Keep both in step.

**Don't**
- Wrap standalone info that needs no grouping in a card — scatter it in a grid instead.

### Home: Notice card, Highlights feed, Gallery preview
- **Notice card**: 520px white `--radius-lg` card with `--shadow-lg` floating over the hero; ruled rows of date (72px, caption gray) / title / optional accent badge.
- **Highlights feed**: rows that stretch to share the column height: uppercase navy kind label (56px), title, ellipsized meta (176px), month (52px); `--bg` hover. Heading has a "Go to Research" arrow link.
- **Gallery preview**: 16:9 slides with a `--glass` caption chip (title, then note · tag · month) and a glass control pill bottom-right: 22px chevron buttons, compact dots (4px, current one a 28px bar that fills navy over the interval), and a play/pause toggle. Autoplays every 3s; paused shows a static 40% bar; reduced motion starts paused.

### Graphic highlights (icons / figures)
- Icons/illustrations/research figures **only where they carry real symbolic meaning.** No decoration.
- **Icons come from [lucide](https://lucide.dev/icons) only** — one consistent 2px-stroke set, colored with `currentColor`. Never hand-draw an SVG or use a text glyph (▾, →) as an icon. Brand logos lucide doesn't ship (LinkedIn) are the single exception and come from the pinned `simple-icons` package.
- **Never use emojis unless explicitly requested.**
- Research figures (About) are information, not decoration — always attach caption + alt text.

### Navigation
- **Home variant (`overlay`)**: fixed over the hero and transparent; white text and mark. Over the first 160px of scroll it fades to white in 1/20 steps, text turns dark past the midpoint and `--shadow-sm` appears past 75%.
- Sticky top, `--header-h` tall, white bg + `--shadow-sm`. Brand lockup (navy mark, wordmark, affiliation) left; menu right. Menu entries come from `navigation.yaml`.
- Current section: `--navy-100` pill, `--navy-600` text, weight 600. Hover: `--gray-100` pill.
- **Dropdown on mouseover and on keyboard focus.** Full keyboard operation: Tab/Enter, arrows to move through a menu, Esc to close it.

### Page banner + section tabs
- Every page except Home and Contact opens with a dark banner (`PageHero`): `--navy-900` + `--stripe-dark`, centered `--fs-display` title. Until a background image exists, a mono note top-right describes the intended image.
- Under the title sits a segmented pill (`HeroTabs`) listing the sibling pages of the current menu section — it is generated from `navigation.yaml`, not authored per page. Current tab: white pill, `--navy-900` text. A grouped tab opens a rounded dropdown (`--radius-lg`, `--shadow-lg`) on hover/focus, with optional counts.

- **Tall variant** (Our Vision): more padding plus `--scrim-hero`, carrying a lede and two text columns with CTAs. Its headline types itself in a loop (intro word, then the headline, italics preserved); under `prefers-reduced-motion` the static headline is shown.

### Image card picker + detail panel (Research Areas)
- Three 260px image cards (`--radius-lg`, navy base, title bottom-left in white) act as toggle buttons. Selected: lifted 2px with `--shadow-md`, full-opacity image, `--scrim-card`. Idle: 72% image, heavier `--scrim-card-idle`; hover lifts it and slowly zooms the image (`--dur-loop`, off under reduced motion).
- The selected area's text appears below: each sub-topic is a two-column grid (132px gray label, content) with lettered headings, neutral chips for application areas, and related-paper tiles (`--gray-100`, hover `--navy-100`) that deep-link to the paper. Sub-topics rise in each time a card is picked.

### Team page
- Three tabs selected by the URL fragment (`#current`, `#interns`, `#alumni`) from the banner's Members dropdown, whose entries carry counts and highlight the tab in view. The header menu links to the same fragments.
- **Current members**: role sections (dot-and-rule heading with a gray count), two `PersonCard`s per row with join date top-right, an uppercase "Research interest" label and `AreaChip`s (family-colored code chips; full name on hover). A lab representative gets an uppercase `--navy-100` badge next to the name.
- **Undergraduate interns**: a 280px intro column and a ruled list (name + Korean name / topic / term) instead of cards.
- **Alumni**: degree sections of `PersonCard`s showing years in the lab, degree title, an optional note and "Current affiliation".
- A `--gray-100` join banner with a primary button closes the page except on the Alumni tab.

### Contact page
- The only page without a dark banner: a plain `--fs-h1` title with a rule. Below, titled bands (`132px` label rail + content) separated by `--gray-300` rules.
- **Track cards**: white `--radius-lg` cards, two visible at a time, in a carousel (bar dots left, round 44px `--gray-100` arrow buttons right; arrows dim to 40% and disable at the ends). An open track shows an accent badge, a ruled checklist and a "draft this email" text link; a closed one is grayed with a `circle-slash` notice.
- **Map card**: full-bleed map with floating provider pills (active `--navy-600`). Only the default provider loads with the page; others load on first use.
- **Address card**: inline EN/KR segmented switch (white active pill on `--gray-100`) and a round copy button whose icon turns into a check for 1.6s.

### Badges (status)
- `Badge`: `--radius-full`, `--fs-caption` 500. Tones: `solid` (`--navy-600` fill, white, 600), `accent` (`--navy-100` / `--navy-700`), `neutral` (`--gray-100` / `--gray-700`), `muted` (`--gray-100` / `--gray-500`).

### Editorial row (long-form text)
- Three columns: a 180px label rail, prose capped at `--container-narrow`, and a 268px figure (3:4, `--radius-lg`) with a caption. A `--gray-300` rule on top separates rows. The template for any future long-form page.

### Language switch
- Bilingual pages render both languages and show one. A floating EN/KR pill (bottom-right, `--shadow-md`) switches them; the active side is `--navy-900` on white. English is the default; the choice is not remembered between pages.

### Person card
- Photo (3:4, `--radius-xs`) left; name, gray subtitle, e-mail, group-specific details right; link pills pinned to the card bottom. White surface + `--shadow-sm`, square corners. The PI uses the larger featured layout (`--fs-title` name, eyebrow label).
- **Link pills**: icon-only `--navy-100` squares (44px tall) that slide open to show their label on hover/focus and fill `--navy-600`. Only links present in the person's data are shown.

### Filters (Team / Publications)
- **Layout**: a `--container-wide` two-column grid (292px sidebar + list, 36px gap). The sidebar sticks below the header; under 1180px it disappears and a compact filter bar at the top of the list takes over.
- **Sidebar** (`FilterPanel`, white + `--shadow-md`): a rounded `--gray-100` search box; a "Filter / All" header whose reset button is `--navy-600` while nothing is filtered and gray once something is; then facet accordions (uppercase label, the selected option's badge, a chevron that rotates when open). Options are 38px rows with a gray count; the selected one is `--gray-100` with `--navy-600` 600 text. Research areas are grouped by family, each with its color dot.
- **Mobile bar**: 44px search, 44px pill options (`--navy-600` when selected), a `list-filter` legend toggle, and "Filtered by" + the active chip beside the reset.
- **Behavior**: search + single-select facets (click again to clear); an option's count is what choosing it would yield given the other filters; results reveal `pageSize` at a time as a skeleton sentinel scrolls into view (person-card skeletons on Team, a year-row skeleton on Publications). An empty result shows the `EmptyState` card with a large reset button. Instant client-side updates; URL query sharing is a follow-up.
- Team filters by Degree + area; Publications by Type + area. Both sidebars start with their facet sections collapsed except Team's area section.

### Selected publications carousel
- Above the list: one paper per slide in a white `--radius-lg` card with `--shadow-md` — 320px figure left, badges (accent "Selected" + type), venue · date, `--fs-h3` title, authors, area chips and link chips right. Under it, 36px round arrows around progress dots: the current dot stretches to 36px and fills navy over the autoplay interval; hovering the card pauses it. Slides loop; reduced motion stops autoplay (the dot shows a static 40% fill).

### Figure thumbnails + window
- Every paper's 4:3 thumbnail is a button (zooms 6% on hover with a `--glass` maximize badge) that opens a 920px card `Modal` showing venue · date, the title, and the figure at its own aspect ratio (`--ph` until the image exists).

### Deep links
- `#pub-<id>` (used by Projects and Research Areas) clears the filters, reveals and expands the row, scrolls it to `--scroll-offset` under the header, and tints it `--navy-100` for 3s.

### Publication list
- Year-grouped rows under an "All publications" heading with the author-marker footnote right-aligned. Each year is a sticky `--fs-h1` label with a paper count in a 104px gutter; rows sit on `--gray-300` rules and tint `--gray-100` on hover.
- A row: meta line (type `Badge`, venue, month/year, "Selected" accent badge, a 28px round chevron that turns navy and flips when open), `--fs-body` 600 title, authors, `AreaChip`s in taxonomy order; a 176px 4:3 figure on the right. Clicking the text expands the summary and the link chips (36px `--gray-100` pills with a lucide icon per link type, `--navy-600` on hover).

### Status tabs + pagination (Projects / Gallery)
- `UnderlineTabs`: an uppercase label in a 76px rail, then text tabs with a gray count; the active tab is `--ink` 600 on a 2px `--navy-600` underline, idle tabs `--gray-500`.
- `Pagination`: 44px square buttons (`--radius-sm`, `--gray-300` border), current page `--navy-600` filled, arrows disabled at the ends; sits under a `--gray-300` rule. Page changes replay the cards' `.rise` entrance.
- `EmptyState`: a centered white card with the "nothing here" sentence.

### Gallery
- Four 4:3 cover cards per row, borderless: cover (`--radius-sm`, zooms 4.5% on hover while the card lifts 3px), a `--glass` photo-count chip top-right, `--fs-body` 600 title, `--fs-caption` date, neutral tag chips. Tag filter and pagination reuse the Projects parts.
- **Photo viewer**: the `fullscreen` Modal variant on `--overlay-dark`. Header with title, date and translucent tag chips; a 3:2 stage (`--ph-dark` until the photo exists, `object-fit: cover` after) between 52px round arrows; a caption line; and an 84x56 thumbnail strip where the current thumb has a 2px white border and the rest sit at 50% opacity. Left/right arrow keys step through; photos wrap around.

### Modal window
- Native `<dialog>` (`Modal`): white `--radius-lg` card, max 840px / 88vh, `--shadow-lg`, over an `--overlay` backdrop; pops in (280ms) with a fading backdrop. Escape, focus trapping and focus return come from the browser; page scroll is locked while open; backdrop click closes when the window opts in. A 40px round `--gray-100` close button (lucide `x`) sits top-right.
- **Project card** (opens the window): white `--radius-lg` card, status `Badge` (`solid` for ongoing), `--fs-lg` title, 16:9 cover (`--radius-md`, zooms 5% on hover while the card lifts 3px with `--shadow-md`), then an uppercase-label / value grid. Two cards per row.

### Buttons
- Buttons are links styled by `Button` (`variant`: `primary` | `on-dark`).
- **On-dark** (navy sections): white bg / `--navy-900` text, hover `--navy-100`. `--radius-md`, `--fs-ui` 600. A trailing arrow is the lucide `arrow-right` icon, never a typed character.
- **Primary**: `--navy-600` bg / white text, hover `--navy-500`. **Secondary**: `--gray-100` bg / `--ink`. **Ghost**: transparent / `--navy-600`.
- 2px focus-visible ring (`--navy-500`).

### Badges (venue/type)
- `--radius-full`, `--fs-caption`, neutral by default (`--gray-100`/`--gray-700`). Use `--navy-100` only when type distinction is needed.

### Footer
- `--navy-900` dark section. Address, email, map. Identical structure on every page.

---

## 5. Copywriting tone

**Do**
- **Two layers**: a mission/value headline first, then a concrete, functional subline.
  - But ACSS is an academic lab. Not consumer copy ("easy/free/no worries") — carry the **research's direction and identity**.
  - e.g. headline "We study control that decides on its own amid uncertainty" → subline "Autonomous control for stochastic systems, from theory to real systems." *(Placeholder copy; finalize after PI review.)*
  - e.g. recruiting "We're looking for people to research with" → "We recruit MS/PhD students and undergraduate interns. Reach out with your CV."
- Vary sentence length/tone between sections so the **copy itself creates rhythm**.

**Don't**
- Lead with feature/fact lists before the emotional entry point (why it matters).
- Overuse hype/buzzwords — it undercuts academic credibility.

---

## 6. Spacing · Radius · Shadow · Motion (tokens)

```css
/* Spacing (4px base, generous whitespace) */
--space-1:4px; --space-2:8px; --space-3:12px; --space-4:16px; --space-5:20px;
--space-6:24px; --space-8:32px; --space-10:40px; --space-12:48px; --space-14:56px;
--space-16:64px; --space-24:96px;

/* Radius — moderate (not overly rounded) */
--radius-xs:5px;  --radius-sm:8px;  --radius-md:12px;  --radius-lg:14px;  --radius-full:9999px;
/* logo mark/photos xs, buttons md, cards lg, chips/badges full */

/* Shadow — separate via subtle shadow instead of borders */
--shadow-sm:0 1px 2px rgba(10,27,61,.06);
--shadow-md:0 6px 20px rgba(10,27,61,.08);
--shadow-lg:0 14px 36px rgba(10,27,61,.12);

/* Motion — short and soft; respect prefers-reduced-motion */
--ease:cubic-bezier(.2,.8,.2,1); --dur-fast:150ms; --dur:200ms; --dur-slow:300ms;
--dur-enter:420ms;  /* entrance animations, expanding pills */
--dur-emph:620ms;   /* image zoom, carousel slide */
--dur-loop:5s;      /* looping hover animation */

/* Layout */
--container:1120px;          /* max body width */
--container-narrow:720px;    /* text-heavy (abstracts/intros) — limit line length */
--container-wide:1424px;     /* list pages with a filter sidebar (Team, Publications) */
--header-h:68px;
--scroll-offset:96px;        /* scroll-margin for anchor targets under the sticky header */

/* Layering */
--z-header:20; --z-dropdown:30; --z-fab:40;   /* modals use native <dialog> (top layer) */
```

- **Entrance animation**: one global `.rise` (12px rise, `--dur-enter`), siblings staggered 70ms apart via an inline `--i` index. Disabled under `prefers-reduced-motion`.
- Autoplay intervals (carousels) are *behaviour settings*, not tokens — they live in the site config data.

Breakpoints: `640 / 768 / 1024 / 1280`. Vertical section gaps: `--space-24` desktop, `--space-12` mobile.

> The pages ported from the design drafts are desktop-first and only carry the drafts' own `760 / 900 / 1180` breakpoints for now; the responsive pass will reconcile them with the scale above.

---

## 7. Accessibility checklist

- [ ] Text/background contrast AA (body 4.5:1, large text 3:1) or better
- [ ] `focus-visible` ring on every interactive element
- [ ] `alt` on images & research figures (empty alt for decorative)
- [ ] Full keyboard operation for dropdowns/filters
- [ ] No color-only information (pair with text/icons)
- [ ] Respect `prefers-reduced-motion`

---

## 8. Logo (slated for redesign)

- The logo is being redesigned (confirmed). No logo file is in the repo yet: the header uses a plain navy mark and the home hero shows a placeholder slot until the new one ships.
- Store assets in `public/images/logo/` as SVG (preferred) + PNG. Separate light/dark (navy/white) and horizontal/symbol variants.
- The large hero logo and the left "logo-image button" reuse the same symbol asset.

---

## 9. Change rules

- **What must be a token**: color (including translucent whites/navies and gradients), font family, font size, radius, shadow, easing/duration, and z-index. Spacing tokens govern the rhythm *between* blocks.
- **Page column**: use the global `.container` class (content width `--container` plus a `--space-6` gutter each side) instead of re-declaring max-width/padding per section.
- **What may be a literal**: a component's intrinsic geometry — grid track widths, fixed sizes, aspect ratios, one-off paddings, line-height, letter-spacing, font-weight — and only inside that component's scoped `<style>`.
- Inline `style=` may only pass `--custom-properties` (e.g. `--i` for stagger, `--ratio`), never color or font values.
- If a new color/font/spacing is needed, **add the token here first** → reflect in `tokens.css` → then use it. No one-off hardcoding.
- When adding a color, check it doesn't break the 6:3:1 ratio or let navy bleed past its accent (1/10) role.
- When a component's visuals change, update the matching section here too.
