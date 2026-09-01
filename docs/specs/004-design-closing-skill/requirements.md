# 004 — design-closing-skill

## Requirements (draft — to be reviewed)

- Closes the other gap found while dogfood-testing the pipeline end-to-end: nothing
  today formalizes turning a spec's `requirements.md` into a closed `design.md` — it
  has happened as an ad hoc conversation every time so far, including for this
  repo's own specs (001, 003).
- Guided Q&A skill, invoked per spec, **after** `requirements.md` exists and
  **before** 003 (task-breakdown-skill) can run on that spec — mirrors the same
  one-question-at-a-time, write-as-you-go pattern already used by 001's requirements
  Q&A.
- Reads the spec's `requirements.md` (and, if present, `docs/architecture.md`) as
  context, asks the user through the open design decisions, writes the result into
  that spec's `design.md`, replacing the `TBD` stub.
- Must refuse to run on a spec whose `requirements.md` is still empty/unreviewed —
  requirements come first.
- Separate, deliberate invocation from 001's scaffold entry point — a repo can sit
  scaffolded with several specs at `requirements.md`-only for a while before any of
  them get a closed design; this skill is not chained automatically after 001.

## Out of scope

- Any judgment about design *quality* — the skill guides the conversation, it
  doesn't validate or critique the resulting design.
- Breaking the closed design into tasks — that's 003, runs after this one.
