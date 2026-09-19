#!/usr/bin/env node
/**
 * Repo-wide markdown convention check: canonical requirements.md headers, and
 * sentence-case headings everywhere.
 *
 * `031-markdown-convention-retrofit` brought every git-tracked `.md` file into
 * compliance by hand, but left no automated guard — drift (a missing/reordered
 * canonical header, a re-introduced Title-Case heading) went back to being
 * something only a human happens to notice. This is that guard.
 *
 * Two independent groups:
 *  [1] Every `planning/specs/NNN-name/requirements.md` has exactly the 7 canonical
 *      `## ` headers, in order, no extras, none missing.
 *  [2] Every git-tracked `.md` file's headings are sentence case (first word
 *      and allowed proper nouns/acronyms only).
 *
 * Run from the repo root: `node scripts/check-markdown-conventions.mjs`
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { CANONICAL_HEADERS } from './shared/canonical-headers.mjs';

let failed = 0;
const ok = (cond, msg) => {
  console.log(`  ${cond ? 'PASS' : 'FAIL'}  ${msg}`);
  if (!cond) failed++;
};
const group = (name) => console.log(`\n${name}`);
const read = (p) => readFileSync(p, 'utf8');

// Words allowed to start with a capital letter in a heading, even though they
// aren't the heading's first word and aren't a fully-uppercase acronym. Seeded
// by actually running this script and grepping the real failures against this
// repo's own already-compliant headings (post-031) — never guessed ahead of
// time (`git grep -n "^#\{1,6\} " -- "*.md"`, cross-checked against each FAIL
// this script printed before the word was added here). A genuinely new word
// not yet in this set will false-positive until added — see design.md's
// "Heading-case detection rule" section for why that's an accepted, mitigated
// tradeoff rather than a solved problem.
const ALLOWED_WORDS = new Set([
  // `# NNN — name — <Suffix>` title suffixes, used across every spec's
  // design.md/tasks.md/requirements.md.
  'Design',
  'Tasks',
  'Requirements',

  // Product names in the README's per-harness Install headings
  // (`### Claude Code`, `### GitHub Copilot CLI`): proper nouns, not sentence text.
  'Code',
  'Copilot',

  // `### Phase N — <Clause>` / `### Step N — <Clause>` sub-headings: this
  // repo's own established convention (predates this check, left untouched
  // by 031) capitalizes the clause after the em dash like a mini-title, not
  // as a continuation of the "Phase N" sentence. Each of these is the first
  // word of one such clause, in a currently-compliant heading.
  'Phase',
  'Ask',
  'Choose',
  'Compute',
  'Confirm',
  'Coverage',
  'Defer',
  'Detect',
  'Draft',
  'Guided',
  'Pick',
  'Preconditions',
  'Print',
  'Read',
  'Report',
  'Resolve',
  'Run',
  'Scaffold',
  'Staleness',
  'Stop',
  'Stopping',
  'Write',

  // Hyphenated skill/domain-name references used the same way (first word of
  // a clause after an em dash, or a spec/skill name that is itself proper).
  'Design-closing',
  'Task-breakdown',
  'Per-spec',
  'C/D',

  // Domain nouns/abbreviations named as part of a Phase/Step clause title.
  'Q&A',
  'Type',
  'Technologies',
  'Styles',
  'Helper',
  'Roadmap',
  'Spec',
  'Closing',
  // `roadmap.md`'s `Stage` column, named exactly as its own field.
  'Stage',
  // A second sentence within one heading (e.g. "Stop. Do not chain...") —
  // "Do" legitimately starts that second sentence, same as any first word.
  'Do',

  // Single-letter phase identifiers (`skills/start/references/question-bank.md`
  // names its phases `Phase A` .. `Phase F`).
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'Phases',
]);

group('[1] Canonical requirements.md headers, in order');
const specsDir = 'planning/specs';
const specDirs = readdirSync(specsDir).filter((d) => /^\d{3}-/.test(d));
for (const dir of specDirs) {
  const p = join(specsDir, dir, 'requirements.md');
  if (!existsSync(p)) continue;
  const lines = read(p).split(/\r?\n/);
  const headers = lines.filter((l) => /^## /.test(l));
  if (headers.length === headers.filter((h, i) => h === CANONICAL_HEADERS[i]).length && headers.length === CANONICAL_HEADERS.length) {
    ok(true, `${dir}/requirements.md has all 7 canonical headers, in order`);
    continue;
  }
  const missing = CANONICAL_HEADERS.filter((h) => !headers.includes(h));
  const extra = headers.filter((h) => !CANONICAL_HEADERS.includes(h));
  const outOfOrder =
    missing.length === 0 &&
    extra.length === 0 &&
    headers.some((h, i) => h !== CANONICAL_HEADERS[i]);
  let reason;
  if (missing.length > 0) {
    reason = `missing header(s): ${missing.join(', ')}`;
  } else if (extra.length > 0) {
    reason = `extra header(s) not in the canonical set: ${extra.join(', ')}`;
  } else if (outOfOrder) {
    reason = `headers present but out of order: found [${headers.join(', ')}], expected [${CANONICAL_HEADERS.join(', ')}]`;
  } else {
    reason = `found [${headers.join(', ')}], expected [${CANONICAL_HEADERS.join(', ')}]`;
  }
  ok(false, `${dir}/requirements.md: ${reason}`);
}

group('[2] Sentence-case headings across every git-tracked .md file');
const files = execFileSync('git', ['ls-files', '--', '*.md'], { encoding: 'utf8' })
  .split(/\r?\n/)
  .filter(Boolean);

const stripInlineCode = (s) => s.replace(/`[^`]*`/g, '');
const stripPunctuation = (w) => w.replace(/^[:,()`"'.\-—–]+|[:,()`"'.\-—–]+$/g, '');
const isAcronym = (w) => /^[A-Z]{2,}$/.test(w);
const startsUppercase = (w) => /^[A-Z]/.test(w);

let headingsChecked = 0;
for (const file of files) {
  if (!existsSync(file)) continue; // git ls-files can list a removed-but-staged path
  const lines = read(file).split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^#{1,6}\s+(.*)$/);
    if (!m) continue;
    const text = stripInlineCode(m[1]).trim();
    if (!text) continue;
    headingsChecked++;
    const words = text.split(/\s+/).map(stripPunctuation).filter(Boolean);
    for (let i = 1; i < words.length; i++) {
      const w = words[i];
      if (!startsUppercase(w)) continue;
      if (isAcronym(w)) continue;
      if (ALLOWED_WORDS.has(w)) continue;
      ok(
        false,
        `${file}: heading "${m[1].trim()}" flags word "${w}" — starts with a capital letter but ` +
          `isn't the first word, an acronym, or in ALLOWED_WORDS. If "${w}" is a legitimate proper ` +
          `noun, add it to ALLOWED_WORDS in scripts/check-markdown-conventions.mjs; otherwise fix the heading's casing.`,
      );
    }
  }
}
ok(true, `scanned ${headingsChecked} headings across ${files.length} git-tracked .md files`);

console.log(`\n${failed === 0 ? 'All checks passed.' : `${failed} check(s) FAILED.`}`);
process.exit(failed === 0 ? 0 : 1);
