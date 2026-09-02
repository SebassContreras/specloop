# 016 — interview-engine

## Priority: 4

## What's being built

The machinery that makes specloop's interview exhaustive **by contract rather than by
script** — the user's overriding requirement: *"the skill must be capable of asking
questions at all times to generate as many points as possible and leave no points
unaddressed."*

Before this, every Q&A was a fixed, closed, non-adaptive script of roughly 16 asks,
only 8 of them per-spec content questions. `start`'s 4-section requirements template
was a hard ceiling on the requirements interview, not a floor. There was no
completeness check, no coverage loop, no "what haven't we covered?" pass, and no
adaptive branching anywhere — while every skill carried an explicit anti-expansion
rule ("don't pad the list", "leave TBD rather than guess") and none carried a depth
rule. The 2026-09-02 pass added `skills/start/references/question-bank.md` and wrote
the contract into `skills/start/SKILL.md`; this spec makes it real and enforced.

- **`.specloop/interview.md` ledger** — one row per dimension:
  `| dimension | status | answer summary or skip reason |`, written after every answer.
  This is what makes an interrupted interview resumable and an explicit skip
  distinguishable from an oversight.
- **Question bank** as the coverage source, branched by project type (`017` supplies
  the branches).
- **Follow-up triggers** — any noun the user names but doesn't specify ("the
  dashboard", "the integration", "our brand guidelines") becomes a new open dimension.
- **Closing sweep** — re-read what was written, ask about every still-`open` dimension,
  ask "what haven't we covered?", and repeat until a full sweep yields nothing new
  twice in a row.
- **Termination contract** — no phase may end on a fixed question count.
- **Skip protocol** — a declined dimension is recorded as `skipped` with its reason.
- **Downstream coverage gates** — `design-closing` refuses to close a design that
  doesn't address every requirement bullet and acceptance criterion; `task-breakdown`
  asks what the design contains that no task covers.
- **Answer fan-out** — one answer may yield several roadmap rows; seeding reads the
  ledger rather than re-inferring from the goal.

## Who/what it serves

The user, who wants the interview to surface points they hadn't thought of rather than
ratify a list the agent inferred. Also every downstream skill, which currently has no
way to tell "the user said no" from "nobody asked".

## Hard constraints

- One question at a time; write to disk after every answer.
- Must never infer an answer to close a dimension — `open` and re-asked beats guessed.
- Must not become an interrogation no human will sit through: the sweep asks about
  what's open, it doesn't re-ask what's settled, and a project type's irrelevant
  dimensions are never asked at all.
- A resumed run must not re-ask a covered dimension.
- The ledger lives in `.specloop/` (git-ignored) — it is working state, not a
  deliverable.

## Acceptance criteria

- Running `specloop:start`, answering three questions, and killing the session leaves a
  ledger from which a second invocation resumes at the first `open` dimension without
  re-asking the first three.
- A dimension the user declines appears as `skipped` with its reason, and is listed in
  the Phase 8 report rather than disappearing.
- Naming an unspecified noun in an answer produces a follow-up question about it.
- No Q&A phase terminates while any dimension is still `open`.
- `design-closing` refuses to close a design that leaves an acceptance criterion
  unaddressed.

## Out of scope

- The per-project-type question sets themselves (`017` owns the branching; this spec
  owns the engine that consumes them).
- Style/preference dimensions (`018`).
- Re-planning an existing roadmap mid-flight (`012-spec-amend-skill`).
