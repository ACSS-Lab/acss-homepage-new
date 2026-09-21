// Project rule checks that the compiler can't enforce. Run with `npm run guard`.
// Every rule must report zero matches; any match fails with file:line.
//
//   - Icons come from lucide via src/lib/icons.ts — never hand-drawn or glyph characters.
//   - Colors live in src/styles/tokens.css only.
//   - Inline `style` may only pass CSS custom properties.
//   - Content is read through src/lib/content.ts only.
//   - No third-party CDNs.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const CODE = /\.(astro|ts|css|mjs)$/;
const CONTENT = /\.(ya?ml|md|json)$/;

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
