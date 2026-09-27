---
name: posting-updates
description: Posts a notice, a news item (award, grant, accepted paper, media mention) or a gallery post with photos. Use when the user asks to announce recruiting, a deadline or an open position, add a highlight or award to the home page, or upload event photos to the gallery.
argument-hint: [notice | news | gallery] [details]
---

# Posting updates

Request, if given: $ARGUMENTS

Pick the collection, copy its `_template.yaml`, name the copy, fill it in, and run `nvm use && npm run build`.
Dates are `YYYY-MM-DD`; use today unless the user says otherwise.
Order on the site is automatic (newest first), so nothing else changes.

| the user wants | collection | file name |
|---|---|---|
| recruiting, deadline, open position | `src/content/notices/` | `<year>-<topic>.yaml`, e.g. `2026-fall-admissions.yaml` |
| award, grant, accepted paper, press | `src/content/news/` | `<year>-<venue-or-topic>.yaml`, e.g. `2026-icra-best-paper.yaml` |
| event photos | `src/content/gallery/` | `<topic>-<year>.yaml`, e.g. `welcome-2026.yaml` |

## Notice

Required: `title`, `date`.
Recruiting notices get `pinned: true`, a short `badge` (Recruiting, Position, ...) and `link: /contact/` or an https URL.
The home page shows the newest few, so nothing needs deleting.
When the user says a round has closed, set that notice's `pinned` to false.

## News

Required: `kind` (paper, award, grant, media), `date`.
When the item is about an existing paper or project, use `publication: <id>` or `project: <id>` and leave `title` and `link` out; they follow automatically.
Otherwise write `title`, optional `meta` (who, where) and optional `link`.

## Gallery

Required: `title`, `date`, `tags`.
Reuse existing tags before inventing one:

```bash
grep -h '^tags:' src/content/gallery/*.yaml | sort | uniq -c
```

Photos go to `src/assets/images/gallery/<id>/01.jpg`, `02.jpg`, ... and are listed under `photos` as `/images/gallery/<id>/01.jpg` in viewing order; the first is the cover unless `cover` is set.
If the photos are not available yet, set `placeholderCount` instead of `photos` and tell the user where to put the files.
Remove `placeholderCount` once `photos` is filled in.
