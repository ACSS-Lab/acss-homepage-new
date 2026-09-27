---
name: preparing-media
description: Resizes a photo or converts a GIF or screen recording to a short silent MP4 loop, puts the file in src/assets/images/ and sets the content field. Use when the user provides an image, figure, cover, poster or animation for the site, or asks how to shrink or convert one.
argument-hint: [team | publication | project | research | gallery | vision | home] [file]
---

# Preparing media

Request, if given: $ARGUMENTS

Media files live in `src/assets/images/<folder>/`; content refers to them as `/images/<folder>/<file>`.
Astro resizes every image at build time (WebP, several widths), so a file only needs to be big enough, never small.
A photo uploaded through the web admin (`/admin/`) is converted to WebP and shrunk to 2048 px in the browser, so the steps below are for files added by hand.
`npm run guard` enforces the file rules; `MAINTAINING.md` section 3 ("Before you add a photo, figure or video") is the maintainer's version of this page.

## Rules the build checks

- File name: lowercase letters, digits, `-` and `_`; a lowercase extension.
  Rename the user's file if needed (`IMG_1234.JPG` becomes `gildong-hong.jpg`).
- Formats: `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`; `.mp4` only for the three slots below.
  Never `.gif`; convert it.
- Size: images up to 3 MB, videos up to 15 MB.
- Every file must be referenced from a content file; a leftover fails `npm run guard`.

## Where each kind goes

| slot | folder and name | shape | source size (long side) | mp4 |
|---|---|---|---|---|
| team photo | `team/<id>.jpg` | 3:4 portrait | 640 px or more | no |
| publication figure | `publications/<id>.png` (or `.jpg`) | free; set `figure.ratio` | 1400 px or more | yes |
| project cover | `projects/<id>.jpg` | 16:9 | 1400 px or more | yes |
| research area card | `research/<file name>.jpg` | roughly 3:2 | 1100 px or more | no |
| gallery photo | `gallery/<post id>/01.jpg`, `02.jpg`, ... | 3:2 to 4:3 | 2000 px or more | no |
| vision figure | `vision/<section id>.jpg` | 3:4 | 640 px or more | no |
| home hero background | `home/hero.jpg` or `home/hero.mp4` | fills the screen | 2560 px or more | yes |

## Steps

1. Identify the slot and the target file name from the table; check the content file exists and which field takes the path (`photo`, `figure.image`, `cover`, `image`, `photos`, `background`).
2. Shrink an image that is over 3 MB or far larger than needed (macOS, in place, so copy first):
   ```bash
   sips -Z 2048 photo.jpg
   ```
   Convert HEIC or PNG screenshots the same way with `sips -s format jpeg in.heic --out out.jpg`.
3. For an animation, make a short silent H.264 loop.
   With ffmpeg installed:
   ```bash
   ffmpeg -i in.gif -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -an out.mp4
   ```
   Without ffmpeg, point the user to a GIF-to-MP4 converter such as ezgif.com and ask for the resulting `.mp4`.
   Optional but recommended: a same-named `.jpg` or `.webp` next to the `.mp4` (the first frame works) is shown until the loop plays and whenever the visitor prefers reduced motion.
4. Copy the file into place and set the field in the content file (publication figures also need `alt`).
5. Run `nvm use && npm run guard` and `nvm use && npm run build`; both name the file when something is wrong.
6. Content-only change: commit on `dev` with the content file and the media file together.
