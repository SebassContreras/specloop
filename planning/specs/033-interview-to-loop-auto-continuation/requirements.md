# 033 — interview-to-loop-auto-continuation

Raised 2026-09-15 as two related GitHub issues, filed together here since
both describe the same underlying gap from two angles, and closed once this
spec existed:

- Issue #9 (`Preguntas dentro de las specs`): after the interview phase,
  `specloop:start` keeps asking questions per spec's requirements instead of
  moving straight through.
- Issue #10 (`Al terminar interview`): after the interview phase finishes,
  no single command carries the work forward through every spec's
  design/tasks phases without the user invoking each skill separately per
  spec.

Scope corrected 2026-09-15 (same conversation, after the first filing): this
is **not** about auto-running `specloop:loop` — that stays the user's
explicit call, unchanged. It's specifically that `specloop:design-closing`
and `specloop:task-breakdown` should run **without human intervention**
for every spec right after the interview finishes, using the decisions
already made during the interview — not stopping to ask again per spec
where the interview already settled the answer. Deferred — not designed
yet, no coding.

## What's being built

After `specloop:start`'s interview finishes, `specloop:design-closing` and
`specloop:task-breakdown` run automatically and unattended, in turn, for
every spec the interview seeded — driven by the decisions already made in
the interview (Phases A–E), not by re-asking. Every seeded spec ends at
`tasks_ready`, right up to (not including) starting the loop, which remains
a separate, explicit user action.

## Who/what it serves

A user who has just finished the interview and wants every roadmap spec
pushed all the way to `tasks_ready` in one go, instead of manually running
`specloop:design-closing` then `specloop:task-breakdown` once per spec in
turn.

## Hard constraints

- Explicit go-ahead given 2026-09-15 (this conversation) to narrow the
  Declined-table row in `planning/architecture.md` that previously kept
  design-closing/task-breakdown "separate, deliberate per-spec steps" — see
  that row's 2026-09-15 scope note. *Auto-running `specloop:loop` itself*
  and *folding `loop-setup`'s Q&A into `start`* remain fully Declined and
  are out of scope here.
- `skills/design-closing/SKILL.md`'s Q&A (stack/convention questions per
  spec) must be re-examined question by question: which are already
  answerable from interview-phase answers (Phase B technologies/
  architecture, Phase D styles) versus genuinely spec-specific and still
  needing a live decision even when unattended.
- `skills/task-breakdown/SKILL.md`'s own draft-confirm-write flow has the
  same problem — its confirmation step needs a defined default/inference
  path when run unattended, not just a skip.
- Must define what happens when a design-closing/task-breakdown question
  genuinely can't be inferred from the interview: falling back to asking
  breaks "no human intervention" for that spec. Options to weigh: block
  only that spec's row and continue with the rest, surface a single batched
  question at the end covering every spec that hit this, or something else
  — not yet decided.
- `skills/design-closing/SKILL.md` Phase 3 is currently titled "Stop. Do not
  chain into task-breakdown." and `planning/architecture.md`'s Container
  section describes both skills as run "separately per spec" — both need
  updating if/when this ships.
- Issue #9's original complaint (per-spec Q&A feels redundant) is expected
  to resolve as a side effect once genuinely-inferable answers stop being
  re-asked, rather than needing a separate fix.

## Acceptance criteria

- [ ] `specloop:advance` (`skills/advance/`) exists as its own skill and is
      also auto-chained from `specloop:start`'s Phase 7 immediately after
      the per-spec requirements Q&A — no separate invocation needed for the
      first pass over a freshly-seeded set of specs.
- [ ] For each spec at `Stage: requirements`, `specloop:advance` derives
      `design-closing`'s 5 Q&A answers from the interview's own answers and
      produces the real `design.md` draft (not a shortened synthesis),
      showing it to the user with three options: yes / changes / defer.
- [ ] On yes, the spec's `design.md` is written and `Stage` becomes
      `design_closed`, then `task-breakdown`'s own draft-confirm-write flow
      runs the same way (draft shown, yes/changes/defer), landing the spec
      at `Stage: tasks_ready`.
- [ ] If a `design-closing` or `task-breakdown` question can't be
      confidently derived from the interview, `specloop:advance` stops and
      asks that one specific question live instead of guessing.
- [ ] Re-running `specloop:advance` later only processes specs still short
      of `tasks_ready` — deferred specs from an earlier run get picked up
      without re-processing already-closed ones.
- [ ] `design-closing` (`004`) and `task-breakdown` (`003`) remain
      independently invokable on a single spec, unchanged, outside the
      batch flow.
- [ ] `specloop:advance` never chains into `specloop:loop` — starting the
      loop stays a separate, explicit user action.

## Out of scope

- Auto-running `specloop:loop` itself — stays the user's explicit call
  (Declined, unchanged).
- Folding `loop-setup`'s worker-CLI Q&A into `start` — stays Declined,
  unchanged.

## Dependencies

`001` (scaffold-and-spec-skill), `002` (loop-orchestrator), `003`
(task-breakdown-skill), `004` (design-closing-skill) — this changes how
`003`/`004` get invoked relative to `001`'s interview; `002` only insofar as
the boundary right before the loop starts must stay intact.

## Owner split

(none stated)
