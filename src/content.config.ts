// ============================================================================
// ACSS Lab 웹사이트 — 콘텐츠 스키마 (이 프로젝트의 "안전망")
// ----------------------------------------------------------------------------
// 이 파일은 모든 콘텐츠(공지/뉴스/논문/멤버 등)의 "필수 형식"을 정의합니다.
// 형식에 맞지 않는 입력(예: 날짜 누락, 잘못된 카테고리)은 빌드 시점에 막힙니다.
//
// ★ 중요: 이 스키마 · public/admin/config.yml(CMS) · CLAUDE.md(레시피)는
//    항상 같은 필드를 가리켜야 합니다. 하나 고치면 나머지도 같이 고치세요.
//
// ★ 파일 위치: 반드시 src/content.config.ts (Astro 6 정식 위치. content 폴더 밖)
// ============================================================================

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 폴더 안의 .md 파일들을 하나의 콜렉션으로 읽어오는 헬퍼.
// 예: mdCollection('notices') → src/content/notices/ 안의 모든 .md
const mdCollection = (folder: string) =>
  glob({ pattern: '**/*.md', base: `./src/content/${folder}` });

// ----------------------------------------------------------------------------
// 1. notices — 공지 (대학원 모집 등)
// ----------------------------------------------------------------------------
const notices = defineCollection({
  loader: mdCollection('notices'),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.enum(['recruit', 'general']), // 모집 공고 / 일반 공지
    pinned: z.boolean().default(false),       // 상단 고정 여부
    deadline: z.coerce.date().optional(),     // 모집 마감일 (있을 때만)
    link: z.string().url().optional(),
    // body(본문)는 프론트매터가 아니라 마크다운 본문으로 작성 → 스키마엔 없음
  }),
});

// ----------------------------------------------------------------------------
// 2. news — 뉴스 (수상/과제/논문 게재/언론 등)
// ----------------------------------------------------------------------------
const news = defineCollection({
  loader: mdCollection('news'),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    type: z.enum(['award', 'grant', 'paper', 'media', 'etc']),
    link: z.string().url().optional(),
    image: z.string().optional(), // 예: /images/news/2026-award.jpg
  }),
});

// ----------------------------------------------------------------------------
// 3. publications — 논문
// ----------------------------------------------------------------------------
const publications = defineCollection({
  loader: mdCollection('publications'),
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()),             // 저자 목록 (순서 유지)
    year: z.number().int(),
    type: z.enum(['journal', 'conference']),
    venue: z.string(),                        // 학회/저널 전체 이름
    venueShort: z.string().optional(),        // 약칭 (예: NeurIPS)
    topics: z.array(z.string()),              // 필터용 연구 주제 태그
    doi: z.string().optional(),
    url: z.string().url().optional(),
    pdf: z.string().optional(),               // 예: /files/2026-paper.pdf
    selected: z.boolean().default(false),     // 대표 논문 강조 여부
    abstract: z.string().optional(),
  }),
});

// ----------------------------------------------------------------------------
// 4. projects — 연구 과제 (진행 / 완료)
// ----------------------------------------------------------------------------
const projects = defineCollection({
  loader: mdCollection('projects'),
  schema: z.object({
    title: z.string(),
    status: z.enum(['ongoing', 'past']),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),      // 진행 중이면 비워둠
    pi: z.string(),
    members: z.array(z.string()).optional(),
    funder: z.string().optional(),            // 지원 기관
    figure: z.string().optional(),
    link: z.string().url().optional(),
    order: z.number().optional(),             // 수동 정렬용 (작을수록 먼저)
  }),
});

// ----------------------------------------------------------------------------
// 5. team — 구성원 (PI / 멤버 / 동문)
// ----------------------------------------------------------------------------
const team = defineCollection({
  loader: mdCollection('team'),
  schema: z.object({
    name: z.string(),
    nameKo: z.string().optional(),
    role: z.enum(['pi', 'visiting', 'postdoc', 'phd', 'ms', 'intern']),
    photo: z.string().optional(),             // 예: /images/team/hong.jpg
    email: z.string().email().optional(),
    homepage: z.string().url().optional(),
    scholar: z.string().url().optional(),     // Google Scholar 링크
    topics: z.array(z.string()).optional(),
    status: z.enum(['current', 'alumni']),    // 현재 / 동문
    currentAffiliation: z.string().optional(),// 동문의 현재 소속
    joined: z.coerce.date().optional(),
    graduated: z.coerce.date().optional(),
    order: z.number().optional(),
  }),
});

// ----------------------------------------------------------------------------
// 6. awards — 수상
// ----------------------------------------------------------------------------
const awards = defineCollection({
  loader: mdCollection('awards'),
  schema: z.object({
    title: z.string(),
    recipient: z.string(),
    org: z.string().optional(),
    date: z.coerce.date(),
    link: z.string().url().optional(),
  }),
});

// ----------------------------------------------------------------------------
// 7. research — About 페이지의 Research Direction
// ----------------------------------------------------------------------------
const research = defineCollection({
  loader: mdCollection('research'),
  schema: z.object({
    title: z.string(),
    figure: z.string().optional(),
    order: z.number().optional(),
    // 설명 본문은 마크다운 본문으로 작성
  }),
});

// ----------------------------------------------------------------------------
// 8. gallery — 갤러리 (행사/신입/졸업/동문)
// ----------------------------------------------------------------------------
const gallery = defineCollection({
  loader: mdCollection('gallery'),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.enum(['event', 'new-member', 'graduate', 'alumni']),
    cover: z.string(),                        // 대표 이미지 경로
    images: z.array(z.string()),              // 나머지 이미지들
    caption: z.string().optional(),
  }),
});

// ----------------------------------------------------------------------------
// 9. highlights — 홈 화면 카드 3개 (대표논문 1 · 과제 1 · 수상 1)
// ----------------------------------------------------------------------------
// 두 가지 방식 중 하나로 채웁니다:
//  (A) refId 로 기존 항목(논문/과제/수상) 연결  → 내용은 그쪽에서 가져옴
//  (B) title + image + blurb 를 직접 입력        → 독립 카드
const highlights = defineCollection({
  loader: mdCollection('highlights'),
  schema: z
    .object({
      type: z.enum(['publication', 'project', 'award']),
      refId: z.string().optional(),           // (A) 방식: 연결할 항목의 파일명(id)
      title: z.string().optional(),           // (B) 방식
      image: z.string().optional(),           // (B) 방식
      blurb: z.string().optional(),           // (B) 방식: 짧은 설명
      seeMoreLink: z.string().optional(),     // "See more" 목적지
      order: z.number().optional(),           // 카드 노출 순서
    })
    // (A) refId 도 없고 (B) title 도 없으면 빈 카드가 되므로 빌드에서 막음
    .refine((d) => d.refId || d.title, {
      message: 'highlights: refId(기존 항목 연결) 또는 title(직접 입력) 중 하나는 필요합니다.',
    }),
});

// ============================================================================
// 콜렉션 등록 — 여기 없는 폴더는 Astro가 콜렉션으로 인식하지 않습니다.
// ============================================================================
export const collections = {
  notices,
  news,
  publications,
  projects,
  team,
  awards,
  research,
  gallery,
  highlights,
};

// ============================================================================
// site.yaml (사이트 공통 설정) — 콜렉션이 아니라 "검증되는 설정 파일"
// ----------------------------------------------------------------------------
// site.yaml 은 항목 목록이 아니라 설정 객체 1개라서 콜렉션에 넣지 않습니다.
// 대신 아래 스키마로 형식을 보장합니다. 페이지에서 이렇게 씁니다:
//
//   import siteRaw from '../content/site.yaml';
//   import { siteSchema } from '../content.config';
//   const site = siteSchema.parse(siteRaw);
//
// (site.yaml 을 import 하려면 @rollup/plugin-yaml 또는 Astro의 yaml 지원 필요 —
//  없으면 astro.config.mjs 에 vite yaml 플러그인을 한 줄 추가하면 됩니다.)
// ============================================================================
export const siteSchema = z.object({
  adminEmail: z.string().email(),
  piEmail: z.string().email(),
  address: z.string(),
  mapLat: z.number(),
  mapLng: z.number(),
  socials: z.record(z.string(), z.string().url()).optional(),
});