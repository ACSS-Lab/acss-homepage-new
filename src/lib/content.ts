// Content access layer. Pages and components read data through these getters
// only — never through `getCollection`/`getEntry` directly — so cross-file rules
// the schema can't express (unique codes, references that must exist) are
// checked in one place and fail the build with a readable message.

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { getCollection, getEntry, render, type CollectionEntry } from 'astro:content';

/** Stop the build with a message a content editor can act on. */
function fail(file: string, message: string): never {
  throw new Error(`[content] ${file}: ${message}`);
}

/** Image paths in content point into public/; a typo would otherwise ship as a broken image. */
function assertImageExists(file: string, path: string | undefined): void {
  if (path && !existsSync(join(process.cwd(), 'public', path))) {
    fail(file, `image "${path}" was not found. Put the file at public${path} or remove the field.`);
  }
}

/** Settings-file collections hold a single entry whose id equals the collection name. */
async function loadSingleton<C extends 'site' | 'navigation' | 'ui' | 'areas' | 'tracks'>(
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

/** Application tracks for the Contact page, in display order. */
export const getTracks = async () => (await loadSingleton('tracks', 'src/content/contact/tracks.yaml')).tracks;

// ----------------------------------------------------------------------------
// pages — per-page wording
// ----------------------------------------------------------------------------

type PageData = CollectionEntry<'pages'>['data'];

export async function getPage<P extends PageData['page']>(page: P): Promise<Extract<PageData, { page: P }>> {
  const file = `src/content/pages/${page}.yaml`;
  const entry = await getEntry('pages', page);
  if (!entry) fail(file, 'file is missing or empty.');
  if (entry.data.page !== page) fail(file, `"page: ${entry.data.page}" must match the file name ("page: ${page}").`);
  return entry.data as Extract<PageData, { page: P }>;
}

/** Long bilingual text of one section, e.g. `getProse('vision/layperson')`. Both languages must exist. */
export async function getProse(section: string) {
  const load = async (lang: 'en' | 'ko') => {
    const entry = await getEntry('prose', `${section}/${lang}`);
    if (!entry) fail(`src/content/prose/${section}/${lang}.md`, 'file is missing. Every prose section needs both en.md and ko.md.');
    return (await render(entry)).Content;
  };
  return { en: await load('en'), ko: await load('ko') };
}

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

// ----------------------------------------------------------------------------
// team
// ----------------------------------------------------------------------------

type TeamData = CollectionEntry<'team'>['data'];
type PersonIn<G extends TeamData['group']> = Extract<TeamData, { group: G }> & { id: string };

export type Pi = PersonIn<'pi'>;
export type VisitingFaculty = PersonIn<'visiting'>;
export type Staff = PersonIn<'staff'>;
export type Member = PersonIn<'member'>;
export type Intern = PersonIn<'intern'>;
export type Alumnus = PersonIn<'alumni'>;

export interface Team {
  pi: Pi;
  visiting: VisitingFaculty[];
  staff: Staff[];
  /** Postdocs, then Ph.D., then M.S.; longest-serving first within each role. */
  members: Member[];
  /** Most recent term first. */
  interns: Intern[];
  /** Most recent graduates first. */
  alumni: Alumnus[];
}

const ROLE_ORDER = ['postdoc', 'phd', 'ms'] as const;
const TERM_ORDER = ['spring', 'summer', 'fall', 'winter'] as const;

/** Compare by each key in turn; an explicit `order` always wins. */
const sortPeople = <P extends { order?: number; name: string }>(people: P[], ...keys: ((p: P) => number | string)[]): P[] =>
  [...people].sort((a, b) => {
    for (const key of [(p: P) => p.order ?? Infinity, ...keys, (p: P) => p.name]) {
      const [x, y] = [key(a), key(b)];
      if (x !== y) return x < y ? -1 : 1;
    }
    return 0;
  });

/** Sort key that puts the latest `2026-03` first. */
const newestFirst = (yearMonth: string) => -Number(yearMonth.replace('-', ''));

export async function getTeam(): Promise<Team> {
  const areas = await getAreaIndex();
  const people = (await getCollection('team')).map(({ id, data }) => ({ ...data, id }));

  for (const person of people) {
    const file = `src/content/team/${person.id}.yaml`;
    assertImageExists(file, person.photo);
    if (person.group === 'member') {
      for (const code of person.topics) {
        if (!areas.has(code)) fail(file, `topic "${code}" is not an area code in ${AREAS_FILE}.`);
      }
    }
    if (person.group === 'alumni' && person.graduated < person.joined) {
      fail(file, `graduated (${person.graduated}) is earlier than joined (${person.joined}).`);
    }
  }

  const inGroup = <G extends TeamData['group']>(group: G) => people.filter((p): p is PersonIn<G> => p.group === group);

  const pis = inGroup('pi');
  if (pis.length !== 1) fail('src/content/team/', `expected exactly one file with "group: pi", found ${pis.length}.`);

  return {
    pi: pis[0],
    visiting: sortPeople(inGroup('visiting')),
    staff: sortPeople(inGroup('staff')),
    members: sortPeople(inGroup('member'), (m) => ROLE_ORDER.indexOf(m.role), (m) => m.joined),
    interns: sortPeople(inGroup('intern'), (i) => -i.year, (i) => -TERM_ORDER.indexOf(i.term)),
    alumni: sortPeople(inGroup('alumni'), (a) => newestFirst(a.graduated)),
  };
}

// ----------------------------------------------------------------------------
// publications
// ----------------------------------------------------------------------------

export type Publication = CollectionEntry<'publications'>['data'] & { id: string };

/** All publications, newest first. */
export async function getPublications(): Promise<Publication[]> {
  const areas = await getAreaIndex();
  const publications = (await getCollection('publications')).map(({ id, data }) => ({ ...data, id }));

  for (const publication of publications) {
    const file = `src/content/publications/${publication.id}.yaml`;
    assertImageExists(file, publication.figure.image);
    for (const code of publication.areas) {
      if (!areas.has(code)) fail(file, `area "${code}" is not an area code in ${AREAS_FILE}.`);
    }
  }

  return publications.sort((a, b) => b.year - a.year || b.month - a.month || a.title.localeCompare(b.title));
}

// ----------------------------------------------------------------------------
// research areas
// ----------------------------------------------------------------------------

type ResearchAreaData = CollectionEntry<'researchAreas'>['data'];
type ResearchSub = Omit<ResearchAreaData['subs'][number], 'papers'> & { papers: Publication[] };
export type ResearchArea = Omit<ResearchAreaData, 'subs'> & { id: string; subs: ResearchSub[] };

/** Research areas in file-name order, with each sub-topic's paper ids resolved to publications. */
export async function getResearchAreas(): Promise<ResearchArea[]> {
  const publications = new Map((await getPublications()).map((p) => [p.id, p]));
  const entries = (await getCollection('researchAreas')).sort((a, b) => a.id.localeCompare(b.id));

  return entries.map(({ id, data }) => {
    const file = `src/content/research-areas/${id}.yaml`;
    assertImageExists(file, data.image);
    const subs = data.subs.map((sub) => ({
      ...sub,
      papers: sub.papers.map(
        (paperId) => publications.get(paperId) ?? fail(file, `paper "${paperId}" has no file in src/content/publications/.`),
      ),
    }));
    return { ...data, id, subs };
  });
}

// ----------------------------------------------------------------------------
// projects
// ----------------------------------------------------------------------------

type ProjectData = CollectionEntry<'projects'>['data'];
export type Project = Omit<ProjectData, 'papers'> & { id: string; papers: Publication[] };

/** Projects newest first (by start date), with paper ids resolved to publications. */
export async function getProjects(): Promise<Project[]> {
  const publications = new Map((await getPublications()).map((p) => [p.id, p]));
  const entries = (await getCollection('projects')).map(({ id, data }) => ({ ...data, id }));

  return entries
    .map((project) => {
      const file = `src/content/projects/${project.id}.yaml`;
      assertImageExists(file, project.cover);
      const papers = project.papers.map(
        (paperId) => publications.get(paperId) ?? fail(file, `paper "${paperId}" has no file in src/content/publications/.`),
      );
      return { ...project, papers };
    })
    .sort((a, b) => b.start.localeCompare(a.start) || a.title.localeCompare(b.title));
}
