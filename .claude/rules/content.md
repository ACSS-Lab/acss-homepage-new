---
paths:
  - "src/content/**"
  - "src/content.config.ts"
  - "src/lib/content.ts"
---

# Content model rules

- Files starting with `_` are templates and are ignored by the site. Every item
  folder has one; it documents every field and is the source of truth for field
  meanings. Keep it in step with the schema.
- A file's name is its id, and ids are permanent. Publications are linked as
  `#pub-<id>` and referenced by projects, research areas and news; a team
  member's photo path is derived from the id. Never rename an existing file.
- Team files must sit in the subfolder that matches their `group`:
  `current/` = member, `undergrad_interns/` = intern, `alumni/` = alumni,
  `pi_and_staff/` = pi, visiting or staff. The build stops otherwise.
- Area codes (`areas`, `topics`) must exist in `src/content/taxonomy/areas.yaml`.
  Publication ids referenced from `projects/`, `research-areas/` and `news/`
  must exist. Image paths must point at files under `public/`. These checks
  live in `src/lib/content.ts`; add new cross-file checks there, failing with a
  message that names the file.
- Bilingual fields are `en:` / `ko:` pairs. Long prose lives in
  `src/content/prose/<page>/<section>/en.md` and `ko.md`; both are required.
- Changing a field (adding, renaming, making it required) means changing all
  of these in the same commit: the Zod schema in `src/content.config.ts`, the
  folder's `_template.yaml`, the skill in `.claude/skills/` that writes that
  collection, the recipe in `MAINTAINING.md` section 3, and, once it exists,
  `public/admin/config.yml`.
- Do not loosen the schema to make a build pass. Fix the content file, or
  explain why the rule is wrong and let the user decide.
