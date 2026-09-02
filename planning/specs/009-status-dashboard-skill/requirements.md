# 009 — status-dashboard-skill

## Priority: 4

## Requirements (draft — to be reviewed)

- New skill, `specloop:status`, **read-only** — never writes to any file, no
  exceptions.
- Reads the target repo's `planning/roadmap.md` plus every listed spec's `tasks.md` and
  prints a summary: active spec(s), task counts by status, any `blocked`/
  `interrupted` rows that need attention, and a one-line "next suggested action"
  (which skill to run next, per the fixed pipeline order: start → design-closing →
  task-breakdown → loop-setup → loop run).
- Must work standalone without the loop orchestrator installed — `.specloop/` may
  not exist yet in a repo that hasn't reached `loop-setup`. Pure Markdown-table
  reads of `planning/`, same parsing contract the orchestrator's `roadmap.ts`/`tasks.ts`
  already use.
- Solves today's gap: the only way to answer "what do I do next in this repo" is to
  open `roadmap.md` and every `tasks.md` by hand.

## Out of scope

- Any write/mutation path (fixing a stuck `blocked` row, etc.) — that's a job for
  `012-spec-amend-skill` or the orchestrator, not this skill.
