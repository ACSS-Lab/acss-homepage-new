---
name: updating-admin-config
description: Mirrors a change of the content schema in public/admin/config.yml, the web admin's field definitions. Use when a field is added, renamed, made required or given new options in src/content.config.ts, when a new item collection is added, or when the admin shows a config error on its login screen.
argument-hint: [collection] [field or change]
---

# Updating the admin config

Request, if given: $ARGUMENTS

`public/admin/config.yml` is the Sveltia CMS configuration; it restates the item collections of `src/content.config.ts` field by field.
The rule in `.claude/rules/content.md` applies: a field change lands in the schema, the folder's `_template.yaml`, the skill for that collection, `MAINTAINING.md` section 3 and this file in the same commit.
Covered collections: publications, projects, research_areas, members, interns, alumni, pi, visiting, staff, notices, news, gallery, tracks.
Pages, site settings, taxonomy and prose are not in the admin.

## Zod to widget

| schema | config.yml |
|---|---|
| `z.string()` short | `widget: string` |
| `z.string()` paragraph | `widget: text` |
| `.email()` | `widget: string, type: email` |
| `.url()` | `widget: string, type: url` |
| `z.enum([...])` | `widget: select, options: [...]` (or `{ label, value }` pairs) |
| `z.number().int().min(a).max(b)` | `widget: number, value_type: int, min: a, max: b` |
| `z.boolean().default(false)` | `widget: boolean, default: false` |
| `isoDate` | `widget: datetime, type: date, format: YYYY-MM-DD` |
| `yearMonth`, `href`, a regex | `widget: string, pattern: ['<same regex>', '<same message>']` |
| `imagePath` | `widget: image, media_folder: /src/assets/images/<folder>, public_folder: /images/<folder>, accept: image/jpeg,image/png,image/webp,image/avif,image/heic` |
| `mediaPath` (image or mp4) | `widget: file` with the same folders and `accept` plus `video/mp4` |
| `z.array(z.string())` | `widget: list, field: { name, widget: string }` |
| `z.array(z.object(...))` | `widget: list, fields: [...]` |
| `z.object(...)` | `widget: object, fields: [...]` |
| `bilingual` | `widget: object` with `en` and `ko` text fields |
| an id of another collection | `widget: relation, collection: <name>, value_field: '{{slug}}', display_fields: ['{{title}}'], search_fields: [title]` |

## Rules

- `.optional()` or `.default(...)` means `required: false`; a required field has no `required` key.
- Every `hint` is one English sentence that says the same thing as the comment in `_template.yaml`.
- The regex in `pattern` is copied from the schema, and the message too.
- Collections whose folder holds a `_template.yaml` keep `filter: { field: template, value: null }` and a first field `{ name: template, widget: hidden, required: false }`; the template file starts with `template: true`.
- A team collection sets `group` as a hidden field with the group as `default`, and `folder` to the matching subfolder.
- Cross-field rules the admin cannot check (for example "image needs alt") go into a `hint`; the build enforces them.
- Never put a token, key or URL with a secret into the file; it is public.
- In a one-line `{ ... }` field, quote the `hint` (a comma would start a new key) and any value with `: ` in it; a hidden field takes only `default`, never `required`.
- Every file in a collection folder must be valid YAML, `_template.yaml` included; the admin reads them all and `npm run guard` parses them.

## Verify

1. `nvm use && npm run build && nvm use && npm run guard`.
2. `nvm use && npm run preview`, then in Chrome open `http://localhost:4321/admin/`: the login screen must show no red config error, and the browser console no "is not defined in the Sveltia CMS configuration schema" warning.
   A headless check of that screen: `node scripts/browser.mjs <probe>` with a probe that reads `document.body.innerText`.
3. Ask the user to click **Work with Local Repository**, open the changed collection, and confirm the field shows and a saved entry builds.
4. Run `nvm use && npm run guard` again after the user's test and revert any test entries (`git checkout -- src/content && git clean -fd src/content src/assets/images`).
