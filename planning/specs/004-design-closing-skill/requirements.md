# 004 — design-closing-skill

## What's being built

Closes the other gap found while dogfood-testing the pipeline end-to-end: nothing
today formalizes turning a spec's `requirements.md` into a closed `design.md` — it
has happened as an ad hoc conversation every time so far, including for this
repo's own specs (001, 003).

Guided Q&A skill, invoked per spec, **after** `requirements.md` exists and
**before** 003 (task-breakdown-skill) can run on that spec — mirrors the same
one-question-at-a-time, write-as-you-go pattern already used by 001's requirements
Q&A.

Reads the spec's `requirements.md` (and, if present, `planning/architecture.md`) as
context, asks the user through the open design decisions, writes the result into
that spec's `design.md`, replacing the `TBD` stub.

Separate, deliberate invocation from 001's scaffold entry point — a repo can sit
scaffolded with several specs at `requirements.md`-only for a while before any of
them get a closed design; this skill is not chained automatically after 001.

## Who/what it serves

Whoever is closing a spec's design before task breakdown can start — this is the
skill that turns a spec's `requirements.md` into a closed `design.md`, unblocking
`003-task-breakdown-skill` (which cannot run on that spec until a design exists).

## Hard constraints

- Must refuse to run on a spec whose `requirements.md` is still empty/unreviewed —
  requirements come first.

## Acceptance criteria

- Running the skill against a spec whose `requirements.md` is empty or still
  unreviewed refuses to proceed.
- Running the skill against a spec with a reviewed `requirements.md` walks the
  user through the open design decisions one at a time, write-as-you-go.
- The skill writes the resulting design into that spec's `design.md`, replacing
  the `TBD` stub.
- Decisions made during the Q&A that affect repo-wide conventions get appended to
  `planning/architecture.md`/`AGENTS.md`, not left only in the spec's `design.md`.
- Verified live end-to-end via `006-e2e-smoke-testing`; this spec is `done`.

## Out of scope

- Any judgment about design *quality* — the skill guides the conversation, it
  doesn't validate or critique the resulting design.
- Breaking the closed design into tasks — that's 003, runs after this one.

## Dependencies

`001` (scaffold-and-spec-skill — owns the `requirements.md` this skill reads and
the scaffolded `design.md` stub this skill replaces).

## Owner split

(none stated)
