---
name: managing-team
description: Adds, edits, graduates or removes a lab member, undergraduate intern, PI, visitor or staff member in src/content/team/. Use when the user asks to add someone to the team, update a profile, photo, email or link, mark a member as graduated or alumni, or change who is lab representative.
argument-hint: [add | graduate | edit] [name]
---

# Managing team members

Request, if given: $ARGUMENTS

Every person is one file at `src/content/team/<subfolder>/<firstname-lastname>.yaml`.
The subfolder must match `group`; the build stops otherwise.
Field meanings are in `src/content/team/_template.yaml`.

| subfolder | group | required beyond name |
|---|---|---|
| `current/` | `member` | `role` (postdoc, phd, ms), `joined` (YYYY-MM), `topics` (area codes; `[]` if none) |
| `undergrad_interns/` | `intern` | `year`, `term` (spring, summer, fall, winter), `topics` (free-text lines) |
| `alumni/` | `alumni` | `degree` (PhD, MS), `joined`, `graduated`; optional `note`, `now` |
| `pi_and_staff/` | `pi`, `visiting`, `staff` | `title`; visiting also `home`, optional `period` |

## Add a person

1. File name: romanized name, lowercase, hyphens (`gildong-hong.yaml`).
   Check all four subfolders for an existing file first.
2. Copy the template into the right subfolder, keep only that group's fields, and fill in what the user gave.
   Leave out `email`, `photo` and `links` that were not given; a missing one is simply not shown.
3. Korean name goes in `nameKo`.
4. `topics` for a member: codes from `src/content/taxonomy/areas.yaml` only.
5. Photo: a 3:4 image at `public/images/team/<id>.jpg`, then `photo: /images/team/<id>.jpg`.
   Do not set `photo` before the file exists; the build checks it.

## Graduate a member

1. Run `git mv src/content/team/current/<id>.yaml src/content/team/alumni/<id>.yaml`.
   The id and the photo path stay the same.
2. Set `group: alumni`, replace `role` with `degree` (phd becomes PhD, ms becomes MS), add `graduated: YYYY-MM`, add `now` if known, and drop `representative`.
3. Ask for `graduated` and `now` when they were not given; do not guess.

## Edit a profile

Change only the fields asked for.
Order is automatic (members by role then join date; interns and alumni newest first).
Use `order` only when the user asks to pin someone.

Finish with `nvm use && npm run build`.
