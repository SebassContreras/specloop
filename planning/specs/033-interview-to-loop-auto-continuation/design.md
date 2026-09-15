# 033 — interview-to-loop-auto-continuation — Design

## Approach

A new, thin orchestrating skill, `specloop:advance` (`skills/advance/`).
It does **not** merge `design-closing` (`004`) or `task-breakdown` (`003`)'s
own logic — both keep their existing `SKILL.md`, Q&A phases and refusal
conditions untouched. It just chains them per spec.

**Trigger: automatic, not a command the user has to remember to run.**
`specloop:start`'s Phase 7 (per-spec requirements Q&A) chains directly into
`specloop:advance`'s logic the moment the interview/seeding finishes — no
separate invocation needed for the first pass. `specloop:advance` also
stays independently invokable as its own skill, for the one case that
genuinely needs a manual re-entry: resuming specs the user chose to defer
on the first pass (see step 2 below) — at that point there's no
just-finished interview to chain from, so the user (or a later session)
calls `specloop:advance` directly.

For every spec still at `Stage: requirements` (or a subset the user names):

1. Derive `design-closing`'s Phase 1 answers (Approach/Deliverables/
   Sequencing/Decisions/Risks) from the interview's own answers
   (`.specloop/interview.md`, `planning/product.md`/`architecture.md`) —
   never live-asking the user — and produce the same real `design.md` draft
   `design-closing` would write, not a shortened synthesis.
2. Show that concrete draft to the user as the "summary" (the actual
   Approach/Deliverables text, so a "yes" is an informed confirmation, not a
   blank signature). Options: **yes** (proceed), **changes** (revise then
   re-show), or **defer** (skip this spec, come back later).
3. On yes: run `design-closing`'s Phase 2 (coverage gate against
   `requirements.md`) and Phase 3 (write `design_closed` into `Stage`)
   exactly as that skill already does, then immediately continue into
   `task-breakdown`'s own draft-confirm-write flow the same way — same
   three options, landing the spec at `Stage: tasks_ready`.
4. **Escape hatch**: if any of `design-closing`'s or `task-breakdown`'s own
   questions can't be confidently derived from the interview/project
   context, stop and ask the user that one specific question live, instead
   of guessing — this is what makes "unattended" safe (see Hard constraint
   in `requirements.md` about not leaving a blocking question with nobody to
   answer it).
5. Does **not** chain into `specloop:loop` — starting the loop stays the
   user's separate, explicit call, unchanged (see `planning/architecture.md`'s
   Declined-table scope note, 2026-09-15).

Re-runnable: a later run only processes specs still short of
`tasks_ready` (via `Stage`), so deferring some specs at one run doesn't
block reprocessing them later, and doesn't require new state beyond the
`Stage` column that already exists.

## Deliverables

- A new skill (`skills/<name>/SKILL.md`, name TBD) that orchestrates `003`
  and `004` per spec, per the Approach above. `003`/`004` themselves are
  unchanged and stay independently invokable.
- `skills/start/SKILL.md`'s Phase 7 gains a step that chains into
  `specloop:advance` automatically once the per-spec requirements Q&A ends
  — not just a mention that the user can run it.
- A new bullet in `planning/architecture.md`'s Container section listing
  the new skill alongside `003`/`004`/etc.
- `skills/design-closing/SKILL.md`'s Phase 3 ("Stop. Do not chain into
  task-breakdown.") gains a qualifying note: that's still the default for a
  direct, standalone invocation — `specloop:advance` is the one caller
  allowed to chain past it.

## Sequencing

Cross-spec order stays governed by `Depends on` exactly as today — the new
skill doesn't decide that order, it just runs `design-closing`→
`task-breakdown` per eligible spec. It refuses a spec whose `requirements.md`
is still a stub (same refusal `004` already applies) — that spec must go
through `specloop:start` first.

## Decisions settled

The new skill is named `specloop:advance` (`skills/advance/`), auto-chained
from `specloop:start`'s Phase 7. No new stack/tooling decision — this is
process design over existing skills, not a stack choice.

## Open questions / deferred

- The exact criteria for "this question can't be confidently derived from
  the interview, ask the user live" (the escape hatch in Approach step 4)
  stays a case-by-case judgment call, not a fixed rule — resolve with real
  examples as they come up during implementation/task-breakdown, not
  guessed now.
