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

/** A collection backed by one settings file instead of a folder of items. */
const singleton = (folder: string, file: string) =>
  glob({ pattern: `${file}.yaml`, base: `./src/content/${folder}` });

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

// ============================================================================
// Register collections — a folder not listed here is ignored by Astro.
// ============================================================================
export const collections = { site, navigation, ui, areas };
