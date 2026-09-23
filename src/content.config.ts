// ============================================================================
// ACSS website — content schema (the project's safety net)
// ----------------------------------------------------------------------------
// Defines the required shape of every data file under src/content/. A file that
// doesn't match (missing field, unknown option, malformed link) fails the build
// instead of silently breaking a page.
//
// Keep in sync: this schema, the recipes in CLAUDE.md §3, and — once it exists —
// the web admin config (public/admin/config.yml).
//
// Location matters: Astro only reads this file at src/content.config.ts.
// ============================================================================

import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// ----------------------------------------------------------------------------
// Shared field types
// ----------------------------------------------------------------------------

/** Text shown in both languages. */
const bilingual = z.object({ en: z.string(), ko: z.string() });

/** Internal path (`/team/`), in-page anchor, external URL, or mailto link. */
const href = z
  .string()
  .regex(/^(https?:\/\/|\/|#|mailto:)/, 'Link must start with "/", "#", "http(s)://" or "mailto:"');

/** Year and month, written `2026-03`. */
const yearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Write the date as year-month, e.g. 2026-03');

/** Path of a file under public/, e.g. `/images/team/gildong-hong.jpg`. */
const imagePath = z.string().regex(/^\/images\/.+\.(jpe?g|png|webp|avif|gif)$/i, 'Image path must look like /images/<folder>/<file>.jpg');

/** A collection backed by one settings file instead of a folder of items. */
const singleton = (folder: string, file: string) =>
  glob({ pattern: `${file}.yaml`, base: `./src/content/${folder}` });

/** A folder where one file is one item. Files starting with "_" (templates) are skipped. */
const folder = (name: string) => glob({ pattern: '[^_]*.yaml', base: `./src/content/${name}` });

// ----------------------------------------------------------------------------
// site — lab identity and contact details shared by every page
// ----------------------------------------------------------------------------
const site = defineCollection({
  loader: singleton('site', 'site'),
  schema: z.object({
    name: z.string(),
    shortName: z.string(),
    affiliation: z.string(),
    affiliationShort: z.string(),
    description: z.string(), // default <meta name="description">
    labEmail: z.email(),
    adminEmail: z.email(),
    address: bilingual,
    map: z.object({
      google: z.object({ embedUrl: z.url().startsWith('https://www.google.com/maps/embed') }),
      kakao: z.object({ timestamp: z.string().regex(/^\d+$/), key: z.string() }),
    }),
    copyright: z.string(), // rendered as "© <current year> <copyright>"
    credit: z.object({ label: z.string(), url: z.url() }).optional(),
  }),
});

// ----------------------------------------------------------------------------
// navigation — the header menu, in display order
// ----------------------------------------------------------------------------
const navLink = z.object({ label: z.string(), href });

const navigation = defineCollection({
  loader: singleton('site', 'navigation'),
  schema: z.object({
    // `group`: neighboring children with the same group share one tab in the page banner.
    items: z
      .array(navLink.extend({ children: z.array(navLink.extend({ group: z.string().optional() })).optional() }))
      .min(1),
  }),
});

// ----------------------------------------------------------------------------
// ui — short interface labels shared by every page (page copy lives elsewhere)
// ----------------------------------------------------------------------------
const ui = defineCollection({
  loader: singleton('site', 'ui'),
  schema: z.object({
    nav: z.object({ label: z.string() }),
    language: z.object({ label: z.string(), en: z.string(), ko: z.string() }),
    carousel: z.object({ previous: z.string(), next: z.string() }),
    person: z.object({
      email: z.string(),
      links: z.object({ homepage: z.string(), linkedin: z.string(), scholar: z.string() }),
      photoNote: z.string().includes('{path}'),
    }),
  }),
});

// ----------------------------------------------------------------------------
// areas — research-area taxonomy used to tag publications and members
// ----------------------------------------------------------------------------
// Adding a code to a family is a content change. Adding a family is a design
// change: each family id has a matching color token (`--area-<id>`).
export const areaFamilyIds = [
  'control',
  'uncertainty',
  'learning',
  'modeling',
  'estimation',
  'applications',
] as const;

const areas = defineCollection({
  loader: singleton('taxonomy', 'areas'),
  schema: z.object({
    families: z
      .array(
        z.object({
          id: z.enum(areaFamilyIds),
          label: z.string(),
          codes: z
            .array(
              z.object({
                code: z.string().regex(/^[A-Za-z][A-Za-z0-9]*$/, 'Code must be letters/digits only'),
                label: z.string(),
              }),
            )
            .min(1),
        }),
      )
      .min(1),
  }),
});

// ----------------------------------------------------------------------------
// team — everyone in the lab, past and present. `group` decides which page
// section a person appears in and which extra fields they need.
// ----------------------------------------------------------------------------
const person = z.object({
  name: z.string(),
  nameKo: z.string().optional(),
  photo: imagePath.optional(),
  email: z.email().optional(),
  links: z
    .object({
      homepage: z.url().optional(),
      linkedin: z.url().optional(),
      scholar: z.url().optional(),
    })
    .optional(),
  order: z.number().optional(), // lower first; only to override the default sorting
});

const team = defineCollection({
  loader: folder('team'),
  schema: z.discriminatedUnion('group', [
    person.extend({
      group: z.literal('pi'),
      title: z.string(),
    }),
    person.extend({
      group: z.literal('visiting'),
      title: z.string(),
      home: z.string(), // home institution
      period: z.string().optional(),
    }),
    person.extend({
      group: z.literal('staff'),
    }),
    person.extend({
      group: z.literal('member'),
      role: z.enum(['postdoc', 'phd', 'ms']),
      joined: yearMonth,
      topics: z.array(z.string()), // area codes from taxonomy/areas.yaml
      representative: z.boolean().default(false),
    }),
    person.extend({
      group: z.literal('intern'),
      year: z.number().int(),
      term: z.enum(['spring', 'summer', 'fall', 'winter']),
      topics: z.array(z.string()).min(1), // free text
    }),
    person.extend({
      group: z.literal('alumni'),
      degree: z.enum(['PhD', 'MS']),
      joined: yearMonth,
      graduated: yearMonth,
      note: z.string().optional(),
      now: z.string().optional(), // current affiliation
    }),
  ]),
});

// ----------------------------------------------------------------------------
// publications — one file per paper; the file name is the paper's permanent id
// ----------------------------------------------------------------------------
export const publicationTypes = ['journal', 'conference', 'preprint', 'patent'] as const;
/** Also the order in which a paper's links are shown. */
export const publicationLinkTypes = ['project', 'venue', 'paper', 'slides', 'video', 'code'] as const;

const publications = defineCollection({
  loader: folder('publications'),
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()).min(1), // published order; * equal first author, † corresponding author
    venue: z.string(),
    venueShort: z.string().optional(),
    type: z.enum(publicationTypes),
    year: z.number().int().min(1900).max(2100),
    month: z.number().int().min(1).max(12),
    selected: z.boolean().default(false),
    areas: z.array(z.string()).min(1), // area codes from taxonomy/areas.yaml
    summary: z.string(),
    links: z.array(z.object({ type: z.enum(publicationLinkTypes), url: href, label: z.string().optional() })).default([]),
    figure: z
      .object({
        ratio: z.string().regex(/^\d+\/\d+$/, 'Write the ratio as width/height, e.g. 4/3').default('4/3'),
        image: imagePath.optional(),
        alt: z.string().optional(),
      })
      .refine((f) => !f.image || f.alt, { message: 'A figure with an `image` needs `alt` text describing it.' })
      .default({ ratio: '4/3' }),
  }),
});

// ----------------------------------------------------------------------------
// researchAreas — the areas on the Research Areas page, shown in file-name order
// ----------------------------------------------------------------------------
const researchAreas = defineCollection({
  loader: folder('research-areas'),
  schema: z.object({
    title: z.string(),
    image: imagePath.optional(),
    subs: z
      .array(
        z.object({
          title: z.string(),
          problem: bilingual,
          goal: bilingual,
          applications: z.array(z.string()).min(1),
          papers: z.array(z.string()).default([]), // publication ids
        }),
      )
      .min(1),
  }),
});

// ----------------------------------------------------------------------------
// tracks — application tracks on the Contact page; flip `open` to start/stop recruiting
// ----------------------------------------------------------------------------
const tracks = defineCollection({
  loader: singleton('contact', 'tracks'),
  schema: z.object({
    tracks: z
      .array(
        z.object({
          label: z.string(),
          open: z.boolean(),
          subject: z.string(), // pre-filled e-mail subject
          items: z.array(z.string()).min(1), // what the applicant must include
        }),
      )
      .min(1),
  }),
});

// ----------------------------------------------------------------------------
// projects — funded research projects; one file per project, newest first
// ----------------------------------------------------------------------------
const projects = defineCollection({
  loader: folder('projects'),
  schema: z
    .object({
      title: z.string(),
      status: z.enum(['ongoing', 'done']),
      agency: z.string(),
      start: yearMonth,
      end: yearMonth, // planned end for an ongoing project
      role: z.string(),
      cover: imagePath.optional(), // 16:9
      overview: z.string(),
      papers: z.array(z.string()).default([]), // publication ids
    })
    .refine((p) => p.end >= p.start, { message: '`end` is earlier than `start`.' }),
});

// ----------------------------------------------------------------------------
// pages — the wording of each page (titles, section names, button labels).
// One file per page; `page` must equal the file name.
// ----------------------------------------------------------------------------

/** Dark banner at the top of a page. `note` describes the intended background image until one exists. */
const hero = z.object({ title: z.string(), note: z.string().optional() });

/** An image slot: `image` once the file exists; until then `note` is shown in a striped placeholder. */
const figure = z.object({
  image: imagePath.optional(),
  alt: z.string(),
  note: z.string().optional(),
  caption: z.string().optional(),
});

const cta = z.object({ label: z.string(), href });

const pages = defineCollection({
  loader: folder('pages'),
  schema: z.discriminatedUnion('page', [
    z.object({
      page: z.literal('professor'),
      title: z.string(), // browser tab title
      hero,
      labels: z.object({
        pi: z.string(),
        visiting: z.string(),
        staff: z.string(),
        homeInstitution: z.string(),
      }),
    }),
    z.object({
      page: z.literal('vision'),
      title: z.string(),
      hero: z.object({
        headline: z.string(), // *word* = italic; line breaks are kept
        typing: z.object({
          enabled: z.boolean().default(true),
          intro: z.string(),
          speed: z.number().int().min(10).max(120).default(42), // ms per character
        }),
        note: z.string().optional(),
        lede: bilingual,
        columns: z.array(z.object({ heading: bilingual, body: bilingual, cta })).length(2),
      }),
      // Long text of each section: src/content/prose/vision/<id>/en.md and ko.md
      sections: z.array(z.object({ id: z.string().regex(/^[a-z0-9-]+$/), heading: bilingual, figure })),
    }),
    z.object({
      page: z.literal('contact'),
      title: z.string(),
      join: z.object({
        title: z.string(),
        lead: z.string(),
        body: z.string(),
        tracks: z.object({
          openBadge: z.string(),
          closedBadge: z.string(),
          checklist: z.string(),
          cta: z.string(),
          closedTitle: z.string(),
          closedNote: z.string().includes('{label}'),
        }),
      }),
      visit: z.object({
        title: z.string(),
        admin: z.object({ name: z.string(), badge: z.string(), bullets: z.array(z.string()) }),
        office: z.object({ title: z.string(), toggleLabel: z.string(), copyLabel: z.string(), copiedMessage: z.string() }),
        map: z.object({ frameTitle: z.string().includes('{provider}'), naverNote: z.string() }),
      }),
      collaboration: z.object({
        enabled: z.boolean(),
        title: z.string(),
        lead: z.string(),
        body: z.string(),
        noticeLabel: z.string(),
        notice: z.string(),
        cta: z.string(),
        subject: z.string(),
      }),
    }),
    z.object({
      page: z.literal('research-areas'),
      title: z.string(),
      hero,
      heading: bilingual,
      hint: bilingual,
      labels: z.object({
        problem: z.string(),
        goal: z.string(),
        applications: z.string(),
        papers: z.string(),
        readPaper: z.string(),
        imageNote: z.string().includes('{path}'),
      }),
    }),
  ]),
});

// ----------------------------------------------------------------------------
// prose — long bilingual text, written in Markdown: prose/<page>/<section>/en.md + ko.md
// ----------------------------------------------------------------------------
const prose = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/prose' }),
  schema: z.object({}),
});

// ============================================================================
// Register collections — a folder not listed here is ignored by Astro.
// ============================================================================
export const collections = { site, navigation, ui, areas, team, publications, projects, researchAreas, tracks, pages, prose };
