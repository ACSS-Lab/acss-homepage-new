// Project rule checks that the compiler can't enforce. Run with `npm run guard`.
// Every rule must report zero matches; any match fails with file:line.
//
//   - Icons come from lucide via src/lib/icons.ts — never hand-drawn or glyph characters.
//   - Colors live in src/styles/tokens.css only.
//   - Inline `style` may only pass CSS custom properties.
//   - Content is read through src/lib/content.ts only.
//   - No third-party CDNs.
//   - Media renders through src/components/ui/Figure.astro only; no GIF anywhere.
//   - Media files live in src/assets/images: lowercase names, jpg/png/webp/avif/mp4,
//     within the size caps below, and each one referenced from content.
//   - The `template: true` marker that hides a _template.yaml from the web admin stays there.
//   - Every YAML file under src/content parses, templates included (the web admin reads them all).

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

const root = fileURLToPath(new URL('..', import.meta.url));
const CODE = /\.(astro|ts|css|mjs)$/;
const CONTENT = /\.(ya?ml|md|json)$/;

// Media files (src/assets/images). Astro resizes images at build time, so these caps
// protect the repository and the build, not the visitor.
const MEDIA_DIR = 'src/assets/images';
const MEDIA_NAME = /^[a-z0-9][a-z0-9/_-]*\.(jpe?g|png|webp|avif|mp4)$/;
const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
const MAX_VIDEO_BYTES = 15 * 1024 * 1024;

/** @type {{ name: string, files: RegExp, pattern: RegExp, except?: string[] }[]} */
const rules = [
  {
    name: 'Hand-drawn SVG. Use <Icon name="…" /> (lucide) instead.',
    files: CODE,
    pattern: /<svg[\s>]/,
    except: ['src/components/ui/BrandIcon.astro'], // brand logos from the simple-icons package
  },
  {
    name: 'Glyph used as an icon. Use <Icon name="…" /> (chevron-down, arrow-right, …) instead.',
    files: /\.astro$/,
    pattern: /[▾▴▸◂→←]/,
  },
  {
    name: 'Icon imported outside the registry. Add it to src/lib/icons.ts and use <Icon />.',
    files: CODE,
    pattern: /from\s+['"]@lucide\/astro/,
    except: ['src/lib/icons.ts'],
  },
  {
    name: 'Color literal outside tokens.css. Add a token (DESIGN.md first) and use var(--…).',
    files: CODE,
    pattern: /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b|\b(?:rgba?|hsla?)\(/,
    except: ['src/styles/tokens.css'],
  },
  {
    name: 'Color literal in a content file. Colors are design tokens, not content.',
    files: CONTENT,
    pattern: /#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b|\b(?:rgba?|hsla?)\(/,
  },
  {
    name: 'Inline style with real declarations. Only custom properties (style="--i: 2") are allowed.',
    files: /\.astro$/,
    pattern: /\sstyle=(?!["'{`]\s*`?--)/,
  },
  {
    name: '!important outside global.css.',
    files: CODE,
    pattern: /!important/,
    except: ['src/styles/global.css'],
  },
  {
    name: 'Third-party CDN reference. Install the package and pin it instead.',
    files: /./,
    pattern: /unpkg\.com|jsdelivr\.net|lucide-static/,
  },
  {
    name: 'Direct collection access. Read content through src/lib/content.ts.',
    files: CODE,
    pattern: /\bget(?:Collection|Entry|Entries)\(/,
    except: ['src/lib/content.ts'],
  },
  {
    name: 'Raw media element. Render images and video through <Figure /> (src/components/ui/Figure.astro).',
    files: /\.astro$/,
    pattern: /<(?:img|video|picture)[\s>]/,
    except: ['src/components/ui/Figure.astro'],
  },
  {
    name: 'astro:assets imported outside Figure. Media goes through <Figure /> and src/lib/media.ts.',
    files: CODE,
    pattern: /from\s+['"]astro:assets/,
    except: ['src/components/ui/Figure.astro'],
  },
  {
    name: 'GIF referenced. GIF is not used; convert it to a short MP4 loop (MAINTAINING.md).',
    files: /\.(astro|ts|css|mjs|ya?ml|md|json)$/,
    pattern: /\.gif\b/i,
  },
  {
    name: 'Template marker in a content file. Delete the "template: true" line copied from _template.yaml; the web admin would hide the entry.',
    files: /^src\/content\/(?:[^/]+\/)*[^_/][^/]*\.ya?ml$/,
    pattern: /^template:\s*true\b/,
  },
];

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* walk(path);
    else yield path;
  }
}

const violations = [];
for (const path of walk(join(root, 'src'))) {
  const file = relative(root, path);
  const active = rules.filter((rule) => rule.files.test(file) && !rule.except?.includes(file));
  if (active.length === 0) continue;

  readFileSync(path, 'utf8')
    .split('\n')
    .forEach((line, index) => {
      for (const rule of active) {
        if (rule.pattern.test(line)) violations.push({ rule: rule.name, where: `${file}:${index + 1}`, line: line.trim() });
      }
    });
}

// Every YAML file under src/content must parse. The build skips the _template.yaml files, but the
// web admin reads every file in a collection folder and a broken template blocks the whole list.
for (const path of walk(join(root, 'src/content'))) {
  if (!/\.ya?ml$/.test(path)) continue;
  try {
    parseYaml(readFileSync(path, 'utf8'));
  } catch (error) {
    violations.push({ rule: 'YAML file does not parse. Quote a value that contains ": " or starts with a special character.', where: relative(root, path), line: String(error.message).split('\n')[0] });
  }
}

// Media files: names, formats, sizes and the old location.
const mediaFiles = existsSync(join(root, MEDIA_DIR)) ? [...walk(join(root, MEDIA_DIR))].filter((path) => !path.endsWith('.gitkeep')) : [];
for (const path of mediaFiles) {
  const file = relative(root, path);
  const name = relative(join(root, MEDIA_DIR), path);
  const size = statSync(path).size;
  if (!MEDIA_NAME.test(name)) {
    violations.push({ rule: 'Media file name. Lowercase letters, digits, "-" and "_" only, ending in .jpg, .jpeg, .png, .webp, .avif or .mp4.', where: file, line: '' });
    continue;
  }
  const cap = name.endsWith('.mp4') ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (size > cap) {
    violations.push({ rule: `Media file too large. Images up to ${MAX_IMAGE_BYTES / 1024 / 1024} MB, videos up to ${MAX_VIDEO_BYTES / 1024 / 1024} MB (MAINTAINING.md says how to shrink them).`, where: file, line: `${(size / 1024 / 1024).toFixed(1)} MB` });
  }
}
if (existsSync(join(root, 'public/images'))) {
  for (const path of walk(join(root, 'public/images'))) {
    violations.push({ rule: `File under public/images. Media lives in ${MEDIA_DIR}/ and is written as /images/... in content.`, where: relative(root, path), line: '' });
  }
}

// Every media file must be referenced from content (a same-named .jpg or .webp next to a referenced .mp4 is its poster).
// An unreferenced file would still ship in dist/ as is, since Astro only cleans up originals it transformed.
const contentText = [...walk(join(root, 'src/content'))]
  .filter((path) => CONTENT.test(path))
  .map((path) => readFileSync(path, 'utf8').replace(/(^|\s)#.*$/gm, ''))
  .join('\n');
const referenced = (name) => contentText.includes(`/images/${name}`);
for (const path of mediaFiles) {
  const name = relative(join(root, MEDIA_DIR), path);
  if (!MEDIA_NAME.test(name)) continue;
  const poster = /\.(jpg|webp)$/.test(name) && referenced(name.replace(/\.(jpg|webp)$/, '.mp4'));
  if (!referenced(name) && !poster) {
    violations.push({ rule: 'Media file not referenced by any content file. Remove it or point a field at /images/... (it would ship unused).', where: relative(root, path), line: '' });
  }
}

if (violations.length === 0) {
  console.log('guard: all project rules pass.');
} else {
  const byRule = Map.groupBy(violations, (v) => v.rule);
  for (const [rule, hits] of byRule) {
    console.error(`\n${rule}`);
    for (const hit of hits) console.error(`  ${hit.where}  ${hit.line.slice(0, 100)}`);
  }
  console.error(`\nguard: ${violations.length} violation(s).`);
  process.exit(1);
}
