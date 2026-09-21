# DESIGN.md — ACSS Design System

> Visual-language reference: **Toss**. Two goals:
> ① **Strip the "AI-generated smell"** — avoid clichéd gradients, habitual blue everywhere, uniform 3-column grids, and repeated formulaic sections.
> ② **Carry ACSS's character** — as an academic research lab, prioritize trust, clarity, and depth. Not a consumer-marketing tone.
>
> Audience: prospective grad/intern applicants, researchers seeking collaboration, academic peers.
> Every screen uses the **design tokens** below only (what must be a token vs. what may be a literal is defined in §9). Tokens live in `src/styles/tokens.css` as CSS variables — the only file allowed to contain colour literals.

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

/* On-dark — translucent whites for text/lines/fills on --navy-900 sections */
--on-dark-strong: rgba(255,255,255,.85);  /* hover text */
--on-dark:        rgba(255,255,255,.72);  /* body text */
--on-dark-muted:  rgba(255,255,255,.62);  /* meta text */
--on-dark-faint:  rgba(255,255,255,.55);
--on-dark-rule:   rgba(255,255,255,.12);  /* dividers */
--on-dark-border: rgba(255,255,255,.16);
--on-dark-fill:   rgba(255,255,255,.09);  /* pill/segmented-control background */
--on-dark-fill-hover: rgba(255,255,255,.1);

/* Textures */
--ph:          repeating-linear-gradient(135deg,#EDEFF2 0 9px,#E4E8EC 9px 18px);  /* image placeholder */
--ph-dark:     repeating-linear-gradient(135deg,rgba(255,255,255,.09) 0 10px,rgba(255,255,255,.035) 10px 20px);
--stripe-dark: repeating-linear-gradient(135deg,rgba(255,255,255,.05) 0 14px,rgba(255,255,255,.015) 14px 28px);  /* dark hero overlay */
```

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
  - *Editorial* (Home, About): hero + a **curated card grid**.
- **Keep the footer structurally identical across all subpages** — the one element that stays fixed as a nav anchor.

### Don't
- Force everything into a uniform 3–4 column grid.
- Repeat the same **"headline → title → description → button → content" section formula.** It pads whitespace and buries the key info.

### Per-page density
- **Home**: dark hero (large logo) → Notice/News (dense lists, 5 recent each) → Highlights (3 cards, rhythm shift) → Gallery preview.
- **Publications**: filter chips + publication **list rows** (title, authors, venue, year). Don't turn these into cards.
- **Team**: **full card + compact list pairing** (see §4). Interns as summary rows.
- **About**: text ↔ figure alternating left/right. No uniform grid.

---

## 4. Components

### Card
**Do**
- **Borderless cards.** No border, and no partial accents (e.g. a colored top edge) either. Separate with **subtle shadow + background contrast** only.
- Keep corner radius **moderate** (not overly rounded).
- Use cards **only to group related info**.
- **Full card + compact list pairing**: present the same info as a full card (thumbnail + title + 1–2 line description + tag/CTA) in one place and as a list elsewhere, so users can both scan and read in depth. → **Team page** (featured member cards + full roster list), **Home Highlights** (cards) ↔ the full list on each page.

**Don't**
- Wrap standalone info that needs no grouping in a card — scatter it in a grid instead.

### Home Highlights cards
- 3 cards (Selected Pub 1 + Project 1 + Award 1). **Whole card clickable** + a "See more" text link at the bottom-right.
- Borderless, `--shadow-sm`; on hover `--shadow-md` + `translateY(-2px)` (200ms). No blue wash on the neutral card — navy only on link/tag.

### Graphic highlights (icons / figures)
- Icons/illustrations/research figures **only where they carry real symbolic meaning.** No decoration.
- **Never use emojis unless explicitly requested.**
- Research figures (About) are information, not decoration — always attach caption + alt text.

### Navigation
- Fixed top, white bg (`--shadow-sm` on scroll). **Dropdown on mouseover.** Full keyboard operation (Tab/Enter/Esc/arrows).

### Filters (Team / Publications)
- **Chips / segmented control.** Only the selected chip is `--navy-600` + white text; unselected is `--gray-100` + `--gray-700` (minimize blue). Instant client-side updates + shareable via URL query.

### Buttons
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

- The current logo (`assets/acss_logo.png`) needs a redesign (confirmed). Use it as interim until the new one ships.
- Store assets in `public/images/logo/` as SVG (preferred) + PNG. Separate light/dark (navy/white) and horizontal/symbol variants.
- The large hero logo and the left "logo-image button" reuse the same symbol asset.

---

## 9. Change rules

- **What must be a token**: colour (including translucent whites/navies and gradients), font family, font size, radius, shadow, easing/duration, and z-index. Spacing tokens govern the rhythm *between* blocks.
- **What may be a literal**: a component's intrinsic geometry — grid track widths, fixed sizes, aspect ratios, one-off paddings, line-height, letter-spacing, font-weight — and only inside that component's scoped `<style>`.
- Inline `style=` may only pass `--custom-properties` (e.g. `--i` for stagger, `--ratio`), never colour or font values.
- If a new color/font/spacing is needed, **add the token here first** → reflect in `tokens.css` → then use it. No one-off hardcoding.
- When adding a color, check it doesn't break the 6:3:1 ratio or let navy bleed past its accent (1/10) role.
- When a component's visuals change, update the matching section here too.
