# 041 — advance-skill-split — Requirements

Raised 2026-09-23: `skills/advance/SKILL.md` grew to 426 lines with Phase 0.5
(`planning/fix/018`), close to the 500-line body limit the Agent Skills guidance sets
before detail should move to `references/`.

## What's being built

`skills/advance/SKILL.md` restructured so its body stays well under 500 lines: the
per-phase detail that is reference material (Phase 0.5's section-by-section
derivation and marker rules, Phase 1's can/cannot-derive tests) moves to
`skills/advance/references/`, loaded when that phase runs; `SKILL.md` keeps the flow.

## Who/what it serves

- Every agent running `advance` — a shorter entry file costs less context per
  invocation under every harness.
- Maintainers — one place per rule, not a 400-line file.

## Hard constraints

- SKILL.md body under 500 lines, detail in `references/`
  _(standard: Anthropic, skill authoring best practices — progressive disclosure —
  https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)_.
- No behavior change: the same phases, markers, gates and report groups. The six
  `test/advance-evals/` scenarios (local-only) pass the same way after the split.
- `scripts/check-skill-consistency.mjs` group `[16]` and every other group still
  pass; a guard that reads `advance`'s text follows the moved text (read the
  reference file too), never loosened.
- References resolve under every harness the way `skills/start/references/` and
  `skills/status/references/` already do — relative to the skill's own folder.
- Edited through `skill-architect`, per `AGENTS.md`'s rules for agents.

## Acceptance criteria

- `skills/advance/SKILL.md` body is under 400 lines.
- The six `test/advance-evals/` scenarios give the same outcomes as before the split.
- `node scripts/check-skill-consistency.mjs` and
  `node scripts/check-markdown-conventions.mjs` pass.
- The release archive (`036`) contains the new `references/` file.

## Out of scope

- Splitting any other skill (`start` is 440+ lines too — its own spec if needed).
- Changing what `advance` does.

## Dependencies

`033` (`advance`), `planning/fix/018` (Phase 0.5).

## Owner split

All `agent`.
