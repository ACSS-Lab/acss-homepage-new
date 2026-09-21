// Content access layer. Pages and components read data through these getters
// only — never through `getCollection`/`getEntry` directly — so cross-file rules
// the schema can't express (unique codes, references that must exist) are
// checked in one place and fail the build with a readable message.

import { getEntry, type CollectionEntry } from 'astro:content';

/** Stop the build with a message a content editor can act on. */
function fail(file: string, message: string): never {
  throw new Error(`[content] ${file}: ${message}`);
}

/** Settings-file collections hold a single entry whose id equals the collection name. */
async function loadSingleton<C extends 'site' | 'navigation' | 'ui' | 'areas'>(
  collection: C,
  file: string,
): Promise<CollectionEntry<C>['data']> {
  const entry = await getEntry(collection, collection);
  if (!entry) fail(file, 'file is missing or empty.');
  return entry.data;
}

// ----------------------------------------------------------------------------
// site / navigation / ui
// ----------------------------------------------------------------------------

export type Site = CollectionEntry<'site'>['data'];
export type NavItem = CollectionEntry<'navigation'>['data']['items'][number];

export const getSite = () => loadSingleton('site', 'src/content/site/site.yaml');

export const getNavigation = async () =>
  (await loadSingleton('navigation', 'src/content/site/navigation.yaml')).items;

export const getUi = () => loadSingleton('ui', 'src/content/site/ui.yaml');

// ----------------------------------------------------------------------------
// research-area taxonomy
// ----------------------------------------------------------------------------

export type AreaFamily = CollectionEntry<'areas'>['data']['families'][number];
export type AreaFamilyId = AreaFamily['id'];

export interface Area {
  code: string;
  label: string;
  family: AreaFamilyId;
}

const AREAS_FILE = 'src/content/taxonomy/areas.yaml';

/** Families in display order, each with its codes. */
export async function getAreaFamilies(): Promise<AreaFamily[]> {
  const { families } = await loadSingleton('areas', AREAS_FILE);

  const seenFamilies = new Set<string>();
  const seenCodes = new Set<string>();
  for (const family of families) {
    if (seenFamilies.has(family.id)) fail(AREAS_FILE, `family "${family.id}" is listed twice.`);
    seenFamilies.add(family.id);
    for (const { code } of family.codes) {
      if (seenCodes.has(code)) fail(AREAS_FILE, `code "${code}" is used more than once.`);
      seenCodes.add(code);
    }
  }
  return families;
}

/** Lookup from area code to its label and family. */
export async function getAreaIndex(): Promise<Map<string, Area>> {
  const index = new Map<string, Area>();
  for (const family of await getAreaFamilies()) {
    for (const { code, label } of family.codes) index.set(code, { code, label, family: family.id });
  }
  return index;
}
