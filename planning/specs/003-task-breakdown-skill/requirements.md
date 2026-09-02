# 003 — task-breakdown-skill

## Requirements (draft — to be reviewed)

- Closes the gap found while dogfood-testing 001 end-to-end (see
  `test/sample-new-repo/`): nothing currently turns a closed `design.md` into a
  populated `tasks.md` — 001's Q&A only fills `requirements.md`; `design.md` and
  `tasks.md` are left as `TBD` stubs by design.
- Given a spec whose `design.md` has real content (not a `TBD` stub), break it down
  into concrete, single-action tasks and write them into that spec's `tasks.md`,
  using the table contract already fixed in 001's design
  (`ID | Task | Status | Notes`, every new task starts `todo`).
- Must refuse to run on a spec whose `design.md` is still `TBD` — a design has to be
  closed first.
- 002 (loop-orchestrator) depends on this: it has nothing to execute until a spec's
  `tasks.md` is actually populated.

## Out of scope

- Deciding how granular a "task" should be beyond "single action, verifiable when
  done" — that's a `design.md` question for this spec.
- Anything about executing the tasks once written — that's 002.
