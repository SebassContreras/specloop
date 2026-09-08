# What this fixture is

Built for `017-project-type-genericity` / `006-e2e-smoke-testing` T011: a non-software
counterpart to `test/sample-new-repo/` (the CLI fixture), so the type-branching claim
in `planning/architecture.md`'s Fixed rules is exercised, not just asserted.

**Persona.** "Loopwell" — a fictional SaaS company — running its marketing team's
project docs through `specloop:start` → `specloop:design-closing` →
`specloop:task-breakdown`, to plan the launch of a new "Instant Export" feature.
Declared fictional up front, invented for this run rather than a real second project
of the author's.

## What this run proves

- `specloop:start`'s `project-type` classifier and the `B-marketing-content` question
  bank branch: every dimension in `.specloop/interview.md`'s Phase A/B rows traces to
  `question-bank.md`'s marketing block — no `runtime`/`framework`/`datastore`/etc.
  dimension appears anywhere, because that block doesn't define one.
- `planning/architecture.md` scaffolds with the marketing header set (`Channels` /
  `Tools` / `Data sources`), not `Container`/`Stack`/`Conventions`.
- `specloop:design-closing` phrases its deliverables question as assets/approvals, and
  the coverage gate at Phase 2 still runs against `requirements.md`'s acceptance
  criteria for a non-software spec.
- `specloop:task-breakdown` assigns `human` to anything needing a live publish action,
  a contractor, or a Legal sign-off — the `automatability` answer from Phase A driving
  the `Owner` column correctly for work that isn't code.
- `specloop:loop-setup`'s all-`human`-backlog check: this fixture's only spec has a
  mix of `agent`/`human` tasks, so that check doesn't fire here — see
  `planning/specs/002-brand-style-refresh/` (added solely to exercise the
  all-`human` path) for the case where it does.

## What this run does not prove

- **Interview bearability for a real user.** Every answer below was authored by the
  same agent running the interview, for a persona invented for this purpose — not a
  real person deciding in real time whether the questions felt reasonable, whether the
  follow-up triggers fired on genuinely vague answers, or whether the closing sweep
  felt like it converged or nagged. That evidence only comes from a live human session
  (`001` T30 / `006` T10), which this fixture does not substitute for.
- Non-software support for `B-operations-process`, `B-research`, or `B-other` — only
  `B-marketing-content` is exercised here. Deferred per `017`'s design.
