# 033 — interview-to-loop-auto-continuation

Raised 2026-09-15 as two related GitHub issues, filed together here since
both describe the same underlying gap from two angles, and closed once this
spec existed:

- Issue #9 (`Preguntas dentro de las specs`): after the interview phase,
  `specloop:start` keeps asking questions per spec's requirements instead of
  moving straight through.
- Issue #10 (`Al terminar interview`): after the interview phase finishes,
  no single command carries the work forward through every spec's
  requirements/design/tasks — right up to (not including) starting the loop
  — without the user invoking each skill separately per spec.

Deferred — not designed yet, no coding.

## What's being built

Not yet decided — see Hard constraints below. The ask is some form of
reduced friction between finishing `specloop:start`'s interview and having
every seeded spec sit at `tasks_ready`, so the user isn't manually invoking
`specloop:design-closing` and `specloop:task-breakdown` once per spec in
turn.

## Who/what it serves

A user who has just finished the interview phase and wants every roadmap
spec pushed through design-closing and task-breakdown in one go, rather than
running a separate command per spec per phase.

## Hard constraints

- **Directly conflicts with an existing, dated Declined-table row** in
  `planning/architecture.md`: *"Auto-*running* the loop, or folding
  `loop-setup`'s worker-CLI Q&A, as a side effect of `specloop:start`"* was
  explicitly rejected — "Design-closing and task-breakdown likewise stay
  separate, deliberate per-spec steps — a repo can sit at requirements-only
  for a while." Per `AGENTS.md`'s rule, reopening this needs the user's
  explicit, dated go-ahead in the same conversation the row gets edited —
  filing this spec is not that go-ahead.
- Every relevant skill currently documents its own stop point on purpose:
  `skills/design-closing/SKILL.md` Phase 3 is literally titled "Stop. Do not
  chain into task-breakdown."; `skills/amend`, `skills/fix` and `loop-setup`
  all carry the same "deliberately invoked, never chained" language in
  `planning/architecture.md`'s Container section. Any change here touches
  that language in at least `001`, `003`, `004` and possibly `002`.
- Must distinguish issue #9's complaint (repeated per-spec Q&A feels
  redundant) from issue #10's ask (no command spans multiple specs) — they
  may have different fixes: #9 could be a UX/wording issue inside a single
  skill's phase; #10 is a cross-skill orchestration question.
- Whatever ships must still respect each skill's own gate (e.g.
  design-closing's Q&A can't be skipped just because it's now invoked in a
  loop over specs — the judgment it applies per spec doesn't disappear).

## Acceptance criteria

Not yet defined — blocked on resolving the Declined-row conflict above with
the user first.

## Out of scope

- Auto-running the loop itself as a side effect of anything — that half of
  the existing Declined row is not in question here; only the
  design-closing/task-breakdown chaining half is.

## Dependencies

`001` (scaffold-and-spec-skill), `002` (loop-orchestrator), `003`
(task-breakdown-skill), `004` (design-closing-skill) — this would change how
all four hand off to each other.

## Owner split

(none stated)
