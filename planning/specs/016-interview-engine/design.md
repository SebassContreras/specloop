# 016 — interview-engine — Design

## Approach

The ledger, question bank, follow-up triggers, closing sweep, termination contract,
skip protocol, downstream coverage gates and answer fan-out are already implemented
as skill instructions in `skills/start/SKILL.md` and
`skills/start/references/question-bank.md`, and already verified live twice (T030,
and the T033 regression run). The one gap this design closes is the "help me decide"
protocol: when the user expresses genuine uncertainty on any dimension, in any
phase — natural language ("no sé", "not sure"), not a special command — the skill
first judges whether the dimension is the kind researched options can actually help
with (technical/stylistic: `runtime`, `framework`, `palette`, `typography`, and the
like) versus one that's inherently a fact about the user's own project or business
(`audience`, `stakeholders`, `mvp`), where a generic web answer wouldn't help.

For a researchable dimension: search for current, fitting options (a web-search tool
if the session has one) and present 3–5 ranked options with a one-line reason each,
tailored to what's already been answered (goal, constraints, audience, etc.). With no
web-search tool available in-session, say so explicitly and offer options from the
model's own knowledge instead — never silently pass one off as researched. For a
non-researchable dimension: say plainly that a generic search wouldn't help, and ask
a narrower follow-up question instead of manufacturing an options list.

The user picks one, asks for more options, or leaves the dimension `open` — the
engine never infers a choice to close it, same as every other dimension. The final
answer, once picked, is recorded `covered` in `.specloop/interview.md` with a note
that it was resolved via researched options, so it stays distinguishable from an
answer the user arrived at on their own.

## Deliverables

- `skills/start/SKILL.md` — add the "help me decide" trigger and protocol to "The
  interview contract" section, so it applies uniformly across every phase rather than
  being special-cased per phase.
- `skills/start/references/question-bank.md` — document the protocol, with examples
  of researchable vs. non-researchable dimensions per phase, so the skill has a
  concrete basis for the judgment call rather than inventing the distinction each run.
- `scripts/check-skill-consistency.mjs` — a check that the protocol is named in both
  files, following the same drift-guard pattern `T033` added for Phase E coverage.
