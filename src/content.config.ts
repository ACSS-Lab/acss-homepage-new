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
    items: z.array(navLink.extend({ children: z.array(navLink).optional() })).min(1),
  }),
});

// ----------------------------------------------------------------------------
// ui — short interface labels shared by every page (page copy lives elsewhere)
// ----------------------------------------------------------------------------
const ui = defineCollection({
  loader: singleton('site', 'ui'),
  schema: z.object({
    nav: z.object({ label: z.string() }),
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

// ============================================================================
// Register collections — a folder not listed here is ignored by Astro.
// ============================================================================
export const collections = { site, navigation, ui, areas, team };
