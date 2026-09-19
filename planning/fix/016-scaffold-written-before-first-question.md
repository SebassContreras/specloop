# 016 — scaffold-written-before-first-question

## Scope

001

## Found

`skills/start` wrote the whole scaffold (`AGENTS.md`, `CLAUDE.md`, `planning/*`,
`.specloop/`) before asking the first interview question. Seen in a real OpenCode run
(model: Muse Spark 1.2 Free) recorded for `019`'s demo: files appeared before the user
had answered anything. The skill text was ambiguous rather than wrong — Phase 1
(scaffold) precedes Phase 2 (`project-type`), yet Phase 1's `planning/architecture.md`
bullet says the type is "asked in Phase 2, just before this file is written", which
only makes sense if the question comes first. Models resolved the contradiction
differently, so behaviour depended on the model.

## Status

resolved

## Fix

`skills/start/SKILL.md`: Phase 1 is now two halves — the ledger
(`.specloop/interview.md`) before the first question, everything else once Phase 2 ends,
with Phase 2's answers written from the ledger into `planning/product.md` and
`AGENTS.md`'s "Project". Phase 0 resumes a ledger with no `planning/` beside it. Phase
numbers unchanged (`design-closing`, `advance` and `scripts/check-skill-consistency.mjs`
reference "Phase 1's" header template). Updated the docs that asserted the old order:
`README.md`, `planning/product.md`, `planning/architecture.md`, `001`'s
`requirements.md` and `design.md`. `scripts/check-skill-consistency.mjs` and
`scripts/check-markdown-conventions.mjs` pass.

Verified live under OpenCode 1.18.31 (Muse Spark 1.2 Free) in a fresh fixture: with the
first question on screen the only file on disk was `.specloop/interview.md`; all eight
Phase A answers landed in the ledger verbatim; nothing else was written until the
closing sweep was answered, at which point `AGENTS.md`, `CLAUDE.md`, `planning/*` and
`.specloop/{.gitignore,logs/.gitkeep}` appeared, with `product.md` and `AGENTS.md`'s
"Project" filled from the ledger and `architecture.md` carrying the software header set
(`Container`/`Stack`/`Conventions`). Not covered: a cold resume from a brand-new session
with only a ledger on disk (the run continued the same session via `--continue`), and
any harness other than OpenCode.

## Date

2026-09-19
