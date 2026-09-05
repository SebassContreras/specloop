#!/usr/bin/env node
/**
 * Static cross-reference check over the four SKILL.md files and the question bank.
 *
 * A skill's "implementation" is its instructions, so it has no compiler and no unit
 * tests — the failure mode is a skill that promises something no other file delivers.
 * That has happened twice in this repo and both were expensive:
 *
 *  - `skills/start` claimed `planning/architecture.md` "fills in progressively as designs
 *    get closed" while no file anywhere wrote it, leaving target repos with a permanent
 *    TBD stub and two downstream read-gates permanently inert.
 *  - `skills/design-closing` began gating on a `requirements.md` header that 0 of this
 *    repo's 15 requirements files use, so it refused on every spec in its own
 *    reference repo.
 *
 * Both were mechanically detectable. This is that check. It does NOT validate the
 * interview itself — only that the skills agree with each other and with what's on
 * disk. Run from the repo root: `node scripts/check-skill-consistency.mjs`
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

let failed = 0;
const ok = (cond, msg) => {
  console.log(`  ${cond ? 'PASS' : 'FAIL'}  ${msg}`);
  if (!cond) failed++;
};
const group = (name) => console.log(`\n${name}`);
const read = (p) => readFileSync(p, 'utf8');

const start = read('skills/start/SKILL.md');
const designClosing = read('skills/design-closing/SKILL.md');
const taskBreakdown = read('skills/task-breakdown/SKILL.md');
const loopSetup = read('skills/loop-setup/SKILL.md');
const questionBank = read('skills/start/references/question-bank.md');
const allSkills = [start, designClosing, taskBreakdown, loopSetup, questionBank];

group('[1] Files referenced by a skill actually exist');
const refs = new Set();
for (const src of allSkills) {
  for (const m of src.matchAll(/`(skills\/[^`]+\.md|framework\/[^`]+|scripts\/[^`]+)`/g)) {
    refs.add(m[1]);
  }
}
for (const ref of [...refs].sort()) {
  ok(existsSync(ref.replace(/\/$/, '')), `referenced: ${ref}`);
}

group('[2] Templates start writes match what downstream skills parse');
for (const h of [
  "## What's being built",
  '## Who/what it serves',
  '## Hard constraints',
  '## Acceptance criteria',
  '## Out of scope',
]) {
  ok(start.includes(h), `start's requirements template writes "${h}"`);
}
ok(
  designClosing.includes("## What's being built") && designClosing.includes('## Acceptance criteria'),
  'design-closing gates on the current template headers',
);
ok(
  designClosing.includes('## Requirements'),
  'design-closing also accepts the legacy "## Requirements" layout still on disk',
);
ok(taskBreakdown.includes('## Acceptance criteria'), 'task-breakdown consumes acceptance criteria');
const legendLine =
  'Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`';
const ownerLine = 'Owner: `agent` (loop-runnable) · `human` (skipped by the loop)';
ok(
  start.includes(legendLine) &&
    start.includes(ownerLine) &&
    taskBreakdown.includes(legendLine) &&
    taskBreakdown.includes(ownerLine),
  'start and task-breakdown write an identical tasks.md legend',
);
ok(
  taskBreakdown.includes('- [ ] T001 [agent] [status:todo]'),
  'task-breakdown writes the checkbox/owner/status checklist grammar',
);

group('[3] Legacy requirements files are still readable by design-closing');
const specsDir = 'planning/specs';
const specs = readdirSync(specsDir).filter((d) => /^\d{3}-/.test(d));
const legacy = specs.filter((s) => {
  const p = join(specsDir, s, 'requirements.md');
  return existsSync(p) && !read(p).includes("## What's being built");
});
ok(
  legacy.length === 0 || designClosing.includes('## Requirements'),
  `${legacy.length} spec(s) use the legacy header; design-closing accepts it`,
);

group('[4] Every stated objective has a phase in start');
const objectives = {
  '1  roadmap structure': /planning\/roadmap\.md/,
  '1b loop folder': /\.specloop\/logs\/\.gitkeep/,
  '2  project type': /Type & vision/,
  '3  technologies/architecture/tools': /Technologies, architecture & tools/,
  '4  skill recommendation': /Helper skills & agent tooling/,
  '5  AGENTS.md + CLAUDE.md': /AGENTS\.md[\s\S]*?@AGENTS\.md/,
  '6  styles & preferences': /Styles & preferences/,
  '★  no fixed question count': /no fixed question count|No phase ends on a fixed question count/i,
};
for (const [name, re] of Object.entries(objectives)) {
  ok(re.test(start), `objective ${name}`);
}

group('[5] Interview contract is stated coherently');
ok(/\.specloop\/interview\.md/.test(start), 'ledger path is named');
ok(/covered/.test(start) && /skipped/.test(start) && /open/.test(start), 'ledger states covered/skipped/open');
ok(/twice in a row/.test(start) && /twice in a row/.test(questionBank), 'sweep stop-rule agrees across both files');
ok(/Phase F/.test(start), 'start defers to the question bank sweep');

group('[6] Question bank covers every phase and project-type branch');
for (const p of ['Phase A', 'Phase B', 'Phase C', 'Phase D', 'Phase E', 'Phase F']) {
  ok(questionBank.includes(p), `question-bank defines ${p}`);
}
for (const b of ['B-software', 'B-marketing-content', 'B-operations-process', 'B-research', 'B-other']) {
  ok(questionBank.includes(b), `type branch ${b}`);
}

group("[7] start's owned-file list matches its scope rule");
for (const f of [
  'CLAUDE.md',
  'AGENTS.md',
  'planning/product.md',
  'planning/architecture.md',
  'planning/roadmap.md',
  'planning/styles.md',
  'planning/specs/**',
  '.specloop/',
]) {
  ok(start.includes(f), `owned-file list names ${f}`);
}
ok(/Never scaffold a file this skill doesn't own/.test(start), 'never-scaffold rule present');
ok(!/`README\.md`\s*—\s*section headers/.test(start), 'start does not scaffold README.md');

group('[8] No skill promises a writer that does not exist');
ok(
  /architecture\.md/.test(designClosing) && /[Aa]ppend/.test(designClosing),
  'design-closing appends to planning/architecture.md, as start promises it will',
);
ok(/AGENTS\.md/.test(designClosing), 'design-closing also maintains AGENTS.md');

group('[9] loop-setup gates execution, not scaffolding');
ok(/Do not refuse on an empty `tasks\.md`/.test(loopSetup), 'refusal moved to execution');
ok(!/Refuse and stop/.test(loopSetup), 'no leftover hard refusal');
ok(/contextFiles/.test(loopSetup), 'loop-setup confirms contextFiles');

console.log(`\n${failed === 0 ? 'All checks passed.' : `${failed} check(s) FAILED.`}`);
process.exit(failed === 0 ? 0 : 1);
