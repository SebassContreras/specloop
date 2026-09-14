# 003 — task-breakdown-skill

## What's being built

Closes the gap found while dogfood-testing 001 end-to-end (see
`test/sample-new-repo/`): nothing currently turns a closed `design.md` into a
populated `tasks.md` — 001's Q&A only fills `requirements.md`; `design.md` and
`tasks.md` are left as `TBD` stubs by design. Given a spec whose `design.md`
has real content (not a `TBD` stub), break it down into concrete,
single-action tasks and write them into that spec's `tasks.md`, using the
table contract already fixed in 001's design (`ID | Task | Status | Notes`,
every new task starts `todo`).

## Who/what it serves

`002-loop-orchestrator` depends on this: it has nothing to execute until a
spec's `tasks.md` is actually populated, so this skill is what makes a closed
design runnable.

## Hard constraints

- Must refuse to run on a spec whose `design.md` is still `TBD` — a design
  has to be closed first.
- Tasks written must use the fixed table contract from 001's design
  (`ID | Task | Status | Notes`).
- Every new task starts in `todo` status.

## Acceptance criteria

- Running against a spec with a `TBD` `design.md` refuses rather than writing
  anything.
- Running against a spec with a closed `design.md` writes single-action,
  verifiable tasks into that spec's `tasks.md` using the `ID | Task | Status |
  Notes` table contract, each starting `todo`.
- Verified live end-to-end via `006-e2e-smoke-testing`.

## Out of scope

- Deciding how granular a "task" should be beyond "single action, verifiable
  when done" — that's a `design.md` question for this spec.
- Anything about executing the tasks once written — that's 002.

## Dependencies

001, 004 (per `planning/roadmap.md`'s `003` row).

## Owner split

(none stated)
