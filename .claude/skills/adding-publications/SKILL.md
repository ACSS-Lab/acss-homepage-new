---
name: adding-publications
description: Adds or edits a paper in src/content/publications/ from a BibTeX entry, DOI, arXiv id or plain citation. Use when the user asks to add a publication, paper, preprint or patent, mark a paper as selected, or attach a figure or links to a paper.
argument-hint: [BibTeX, DOI or citation]
---

# Adding a publication

Input, if given: $ARGUMENTS

One file per paper in `src/content/publications/`.
Field meanings are in `src/content/publications/_template.yaml`; this skill covers the decisions the template cannot make for you.

## Steps

1. Choose the id: venue abbreviation plus two-digit year, lowercase letters and digits only (`tro26`, `neurips25`, `arxiv25`).
   Check `ls src/content/publications/` for a clash; if it clashes, append a letter (`tro26b`).
   The id is permanent.
2. Copy `_template.yaml` to `<id>.yaml` and fill it in.
   Drop template comments that no longer help.
   - `authors` in published order, `*` on equal first authors, `†` on the corresponding author, in the initial-plus-surname style of existing files (`S. Han†`).
     Ask when the marks are unknown; do not guess.
   - `type` is journal, conference, preprint or patent.
     A preprint's `venue` is the arXiv id; a patent's is the patent number.
   - `areas`: only codes from `src/content/taxonomy/areas.yaml`, at least one.
     Choose from the abstract; when unsure, list the candidates for the user.
   - `summary`: one or two plain sentences for a non-specialist.
     Do not paste the abstract.
   - `selected: false` unless the user asks for the carousel.
   - `links`: only the ones the user gave.
     DOI goes under `venue`, PDF under `paper`, GitHub under `code`.
3. Figure: the row shows a placeholder until `figure.image` is set.
   When the user provides an image, put it at `public/images/publications/<id>.png`, then set `image`, a one-sentence `alt` and the `ratio`.
4. If the paper should appear on the home page, add a news item with `kind: paper` and `publication: <id>` (see the posting-updates skill).
5. Run `nvm use && npm run build`.
   It fails naming the file if a code or reference is wrong.

## Editing an existing paper

Edit the file in place; never rename it.
Order on the page is automatic (year, then month), so nothing else changes.
