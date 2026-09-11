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
const normalize = (s) => s.toLowerCase().replace(/\s+/g, ' ');

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
  '## Dependencies',
  '## Owner split',
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
const loopSetupFlat = normalize(loopSetup);
ok(
  loopSetupFlat.includes('package manager') && loopSetupFlat.includes('never assume `pnpm`'),
  'loop-setup asks which package manager to use, rather than assuming pnpm (regression check for 002 T020)',
);
ok(
  !/^Run, inside `\.specloop\/orchestrator\/`: `pnpm install && pnpm link --global`\.$/m.test(loopSetup),
  "loop-setup's install step doesn't hardcode pnpm as the only manager",
);
ok(
  loopSetupFlat.includes('do not silently retry with a *different* package manager'),
  'loop-setup forbids silently switching package managers on a link failure',
);

group('[10] No new harness-specific assumptions in the helper-skills recommendation step');
// Legitimate Claude-Code-specific mentions (the .claude-plugin/ distribution path)
// stay out of scope here — only the recommendation step itself must be session-generic
// (022-cross-agent-skill-compat: recommending "Claude Code skills" from a session
// running under a different harness would assert something false).
const helperSkillsStep = start.match(/## Phase 4 — Helper skills[\s\S]*?(?=\n## Phase 5)/);
ok(
  !!helperSkillsStep && !/Claude Code skill/i.test(helperSkillsStep[0]),
  "start's helper-skills step (Phase 4) doesn't hardcode \"Claude Code skills\"",
);
const helperSkillsRow = questionBank.match(/\| `helper-skills` \|.*\|/);
ok(
  !!helperSkillsRow && !/Claude Code skill/i.test(helperSkillsRow[0]),
  "question-bank's helper-skills row doesn't hardcode \"Claude Code skills\"",
);

group('[11] start\'s Phase 7 walks every Phase E dimension (regression check for T033)');
const phase7 = start.match(/## Phase 7 — Spec requirements Q&A[\s\S]*?(?=\n## Phase 8)/);
ok(!!phase7, 'start defines Phase 7');
const phaseERow = questionBank.match(/## Phase E — Per-spec requirements[\s\S]*?(?=\n## Phase F)/);
const phaseEDimensions = [...(phaseERow ? phaseERow[0] : '').matchAll(/^\| `([a-z-]+)` \|/gm)].map((m) => m[1]);
ok(phaseEDimensions.length === 7, `question-bank Phase E lists 7 dimensions (found ${phaseEDimensions.length})`);
for (const dim of phaseEDimensions) {
  ok(!!phase7 && phase7[0].includes(`\`${dim}\``), `start's Phase 7 names dimension \`${dim}\``);
}

group('[12] Help-me-decide protocol (016) is documented consistently');
ok(
  /Help the user decide when they're unsure/.test(start),
  "start's interview contract states the help-me-decide rule",
);
ok(
  questionBank.includes('## Help-me-decide protocol'),
  'question-bank documents the help-me-decide protocol',
);
const startFlat = normalize(start);
const questionBankFlat = normalize(questionBank);
for (const phrase of ['researchable', 'never infer a choice', 'never pass a guess off as researched']) {
  ok(
    startFlat.includes(phrase) && questionBankFlat.includes(phrase),
    `start and question-bank agree on "${phrase}"`,
  );
}
const architecture = read('planning/architecture.md');
ok(
  /help-me-decide|genuinely unsure/i.test(architecture),
  'architecture.md\'s fixed-rules summary mentions the help-me-decide protocol',
);

group("[13] design-closing reuses start's type-keyed architecture.md header template (004 T013)");
const headerSetBlock = start.match(/Use the header set matching the answered `project-type`:[\s\S]*?(?=\n\n|\n  `design-closing`)/);
ok(!!headerSetBlock, "start's Phase 1 defines the type-keyed header sets");
const headerNames = [...(headerSetBlock ? headerSetBlock[0] : '').matchAll(/`([A-Za-z /]+)`/g)].map((m) => m[1]);
ok(headerNames.length >= 10, `found ${headerNames.length} type-keyed header names in start`);
for (const h of headerNames) {
  ok(designClosing.includes(`\`${h}\``), `design-closing also names header \`${h}\` (not an improvised one)`);
}
ok(
  normalize(designClosing).includes("skills/start/skill.md` phase 1's"),
  'design-closing points at start Phase 1 as the template source, rather than restating an independent one',
);

console.log(`\n${failed === 0 ? 'All checks passed.' : `${failed} check(s) FAILED.`}`);
process.exit(failed === 0 ? 0 : 1);
