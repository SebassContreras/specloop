---
name: advance
description: >
  Chains design-closing then task-breakdown per spec, for every spec still short
  of tasks_ready — deriving their Q&A answers from the interview's own answers
  instead of re-asking, showing the real draft (not a shortened synthesis) for
  yes/changes/defer, and asking live only when a question genuinely can't be
  inferred from the interview.
when_to_use: >
  Auto-chained from specloop:start's Phase 7 immediately after the per-spec
  requirements Q&A ends — no separate invocation needed for the first pass over
  a freshly-seeded set of specs. Also separately invocable to resume specs
  deferred on an earlier pass, once there's no just-finished interview to chain
  from. Trigger on phrasing like "close out the seeded specs", "advance the
  specs", "/specloop:advance".
---

# specloop: advance

You are running the specloop advance flow **inside the target repo**. This skill
orchestrates `design-closing` (`004`) and `task-breakdown` (`003`) per spec — it
does not merge their logic. Both stay independently invocable, unchanged, outside
this batch flow.

## Phase 0 — Resolve eligible specs

1. If the user named a spec (`NNN` or a kebab-case name), resolve it against
   `planning/roadmap.md`'s table and skip the scan below — work only that spec.
2. Otherwise read `planning/roadmap.md`'s table (`| ID | Plan | Status | Depends on |
   Stage | Priority |`). Build the batch: every row whose `Stage` is `requirements` or
   `design_closed` (short of `tasks_ready`) AND whose every `Depends on` entry has
   `Status: done`. Skip a row blocked on an unfinished dependency — report it as
   blocked, not eligible yet. Order the batch the same way `roadmap.md` governs order
   elsewhere: `Depends on` first, `Priority` breaking ties among what's left eligible.
3. For each `Stage: requirements` spec in the batch, read its `requirements.md`.
   **Refuse that spec** (skip it, report why, keep processing the rest of the batch) if
   the file doesn't exist or has no real content under its headers — just headers, or
   an obvious placeholder. Accept **either** layout: the current template (`## What's
   being built`, `## Who/what it serves`, `## Hard constraints`, `## Acceptance
   criteria`, `## Out of scope`, `## Dependencies`, `## Owner split`) **or** the older
   single `## Requirements` heading with real bullets under it — same tolerant check
   `specloop:design-closing`'s own Phase 0 applies. Tell the user to run
   `specloop:start` on it first — never guess requirements content here.
4. For each `Stage: design_closed` spec in the batch, no requirements check applies —
   `specloop:design-closing` already gated it. It only needs the task-breakdown pass
   (Phase 2 below), not another design-closing pass.
5. **Reopened-spec check.** For each `Stage: requirements` spec that passed step 3,
   also check `design.md`: if it's still the `TBD` stub, this spec is genuinely
   fresh (never designed) — proceed normally. If `design.md` already has real,
   non-stub content, this spec was previously closed and then reopened (most likely
   by `specloop:amend`, which resets `Stage` to `requirements` without blanking
   `design.md`) — **refuse it here** (skip it, report why, keep processing the rest
   of the batch): silently re-deriving Phase 1's answers from interview/requirements
   context alone, with no live human comparing them to the existing closed design,
   risks quietly discarding content `specloop:amend` deliberately preserved. Tell the
   user to run `specloop:design-closing` directly on that spec instead, where a live
   session can see and reconcile against the current `design.md`.
6. The result is an ordered worklist for the rest of this skill to consume: specs
   needing Phase 1 (design-closing, `Stage: requirements`, passed both the stub and
   reopened-spec checks) and specs needing Phase 2 only (`Stage: design_closed`).
   Nothing in this phase writes to disk.

## Phase 1 — Design-closing pass

For each spec in the worklist needing this pass (`Stage: requirements`, passed
Phase 0's stub check):

1. Read that spec's `requirements.md`, `planning/product.md` (project type),
   `AGENTS.md`, `planning/architecture.md`, and `.specloop/interview.md` if it
   exists.
2. Derive `design-closing` Phase 1's 5 answers from that context — never ask
   live by default:
   - **Approach** — the mechanism, in plain terms. Derive from the spec's
     `## What's being built`/`## Hard constraints` plus `interview.md`'s Phase
     B (technologies/architecture) answers.
   - **Deliverables** — what it creates or changes, phrased per the project
     type (files/modules for software; assets/pages/campaigns for marketing;
     runbook steps/system changes for operations; datasets/analyses/outputs
     for research). Derive from `## Acceptance criteria` plus
     `## Dependencies`.
   - **Sequencing / dependencies** — anything inside the spec needing a
     specific order, or a need from another spec beyond what `roadmap.md`
     already records. Derive from `## Dependencies` and `## Hard constraints`;
     if neither states an internal order, the answer is "none beyond
     `roadmap.md`'s `Depends on`" — that is a real derived answer, not a gap.
   - **Decisions settled** — any stack/tooling/convention question this spec
     settles. Derive from `interview.md`'s Phase B/D answers and
     `planning/architecture.md`'s existing "Resolved"/decision register: if
     the spec's requirements don't raise a new stack question, the answer is
     "none" and the Phase 2 append step (T005) has nothing to add.
   - **Risks / open questions** — anything genuinely undecided that should be
     flagged as deferred rather than guessed at. Derive from the spec's own
     `## Hard constraints` and any dimension `interview.md` marked `open` for
     this spec. Omit the section in the draft if nothing surfaces — never
     write a placeholder "none" bullet, matching `design-closing`'s own rule.
3. **Escape hatch, per question.** If a confident, specific answer can't be
   derived for one of the 5 questions above from the sources in step 1, stop
   and ask the user that one specific question live, phrased the same way
   `design-closing` Phase 1 phrases it, then resume deriving the rest from
   context. Ask only the questions that actually can't be derived — never
   fall back to asking all 5 live just because one needed it. This is the
   batch's only live-Q&A surface for this phase.

   **Cannot derive — ask live — when any of these hold** for that question:
   - The relevant `requirements.md`/`design.md` section is empty, missing, or
     says something like "not yet defined" / "TBD" / "blocked" for that exact
     question.
   - `requirements.md`'s own `## Hard constraints` explicitly flags the thing
     this question is asking about as unresolved/blocking — e.g. `029`'s
     worktree-isolation spec: its Hard constraints flag the roadmap-write
     merge story as "Blocking, unresolved," and no answer exists anywhere in
     the spec to derive Approach or Sequencing from. Ask live (or, per Phase
     0's refusal check, refuse the spec outright if the whole design can't
     proceed).
   - `.specloop/interview.md` marks the relevant dimension `open` rather than
     `covered`/`skipped`.
   - The sources in step 1 give two plausible but conflicting answers for the
     same question, and nothing in them says which one applies to this spec.

   **Can derive — do not ask** when `requirements.md`/`design.md`/
   `architecture.md`/`interview.md` together state a specific, unambiguous
   answer for that question, even a terse one — e.g. `028`'s
   clickable-roadmap-ids spec: its Approach and Deliverables are fully
   spelled out in its own `## What's being built`/`## Hard constraints` (one
   or two sentences, but specific and unambiguous), so Phase 1 derives both
   without asking anything live. **Terseness alone is never the trigger** —
   a short but specific answer is still a derived answer; only genuine
   absence, ambiguity, or an explicit unresolved/blocked marker forces a
   live question.
4. Produce the actual `design.md` draft, `design-closing`'s own output
   template, sections omitted when empty exactly as that skill already does:

   ```markdown
   # NNN — name — Design

   ## Approach

   <derived answer 1>

   ## Deliverables

   - <derived answer 2, as bullets>

   ## Sequencing

   <derived answer 3 — omitted if there's nothing beyond what roadmap.md records>

   ## Open questions / deferred

   - <derived answer 5, as bullets — section omitted if empty>
   ```

   Do not write this draft to disk yet — writing + the Phase 2 coverage gate
   happen on "yes" (T005).
5. Show the user this real draft — the actual Approach/Deliverables/
   Sequencing/Open-questions text, not a shortened synthesis — for **this
   spec specifically**, with three options:
   - **yes** — accept, proceed to write it (coverage gate + disk write +
     `Stage: design_closed`, handled in T005), then continue into this
     spec's task-breakdown pass (Phase 2).
   - **changes** — the user describes what to change; revise the draft and
     re-show it under the same three options.
   - **defer** — skip this spec for now, move to the next spec in the
     worklist; the deferred spec is picked up on a later `specloop:advance`
     run (Phase 3/T008).
6. On **defer**, skip straight to step 11 (move to the next spec) without
   running steps 7–10 for this spec.
7. **On yes**, run `design-closing` Phase 2's coverage gate against this
   spec's `requirements.md`: re-read it and list anything it requires that
   the draft doesn't address — every bullet, and every statement under
   `## Acceptance criteria` — same check `design-closing` Phase 2 step 1
   applies. Repeat the closing-sweep question ("What haven't we covered in
   this design?") against the draft until it returns nothing new twice, same
   as `design-closing` Phase 2 step 2. Since the draft was derived, not
   live-Q&A'd, this gate is what catches anything the derivation missed.

   For each gap the gate finds, apply step 3's escape hatch: try to derive
   the missing answer from context first (same sources, same "can
   derive"/"cannot derive" tests as step 3); ask the user that one specific
   question live only if it can't be derived. Fold any derived or answered
   gap into the draft before moving on.
8. Once the coverage gate passes, write the real `design.md` to disk —
   replacing the `TBD` stub with the template from step 4, gaps folded in.
   Append anything settled under "Decisions settled" (step 2, plus anything
   surfaced by the coverage gate) to `planning/architecture.md`'s decision
   register and the operative form to `AGENTS.md`'s "Stack & conventions" —
   the same appending mechanism `design-closing` Phase 2 step 3 already uses
   (append only, never rewrite an existing decision without telling the user
   which one is changing; create `planning/architecture.md` from
   `skills/start/SKILL.md` Phase 1's type-keyed header template first if it
   doesn't exist yet).
9. Write `design_closed` into this spec's `Stage` cell in
   `planning/roadmap.md` — touch only that cell, nothing else in the row.
10. Unlike a direct `specloop:design-closing` invocation (which stops here,
    per its own Phase 3), `specloop:advance` continues immediately into this
    same spec's task-breakdown pass (Phase 2 below) — no separate
    confirmation needed to move from design-closing to task-breakdown for
    the same spec; the user's earlier "yes" already covered both.
11. Once this spec's task-breakdown pass (Phase 2) lands it at
    `Stage: tasks_ready` or defers it, move to the next spec in the
    worklist. If this was the last spec in the worklist, proceed to
    Phase 4 — Report.

## Phase 2 — Task-breakdown pass

For each spec needing this pass — reached via Phase 1 step 10 (just closed to
`design_closed`) or already `design_closed` on entry per Phase 0 step 4:

1. Read that spec's `requirements.md`, `design.md`, `planning/product.md`, and
   (if they have real content) `AGENTS.md` and `planning/architecture.md` —
   same sources `task-breakdown` Phase 1 reads.
2. Draft the numbered task list the way `task-breakdown` Phase 1 already
   does: single-action + verifiable tasks (that skill's own rule, not
   restated here), ordered per `design.md`'s sequencing, every task
   traceable to `requirements.md`/`design.md`, each `## Acceptance criteria`
   statement turned into a final verification task.
3. Assign each task's `Owner` (`agent`/`human`) from `requirements.md`'s
   `owner-split`/`automatability` answers where they state one, same as
   `task-breakdown` Phase 1. **Escape hatch, per task**: `task-breakdown`
   Phase 1 says "ask the user when unsure" for owner — that unsure case is
   this skill's escape hatch, reusing Phase 1 (above) step 3's same "cannot
   derive"/"can derive" tests, applied per task instead of per question. If
   `owner-split`/`automatability` (or the rest of `requirements.md`/
   `interview.md`) states or clearly implies an owner for that task, derive
   it — don't ask. If it's genuinely silent, ambiguous, or conflicting for
   that specific task, stop and ask live which owner it gets, naming the
   task, then resume drafting the rest — never re-ask the whole batch over
   one unclear task.
4. Before presenting, run `task-breakdown` Phase 2's closing question
   against the draft: "anything in this design that no task covers?" Fold in
   anything that surfaces.
5. Show the user the drafted list (ID + description + owner, no
   status/notes yet) for **this spec specifically**, with the same three
   options as Phase 1:
   - **yes** — accept; writing `tasks.md` and `Stage: tasks_ready` happens
     next (T007).
   - **changes** — the user says what to add/remove/reorder/re-own; revise
     and re-show under the same three options.
   - **defer** — skip this spec for now, move to the next spec in the
     worklist; picked up on a later `specloop:advance` run (Phase 3/T008).
6. On **defer**, skip straight to step 10 (move to the next spec) without
   running steps 7–9 for this spec.
7. **On yes**, write `tasks.md` to disk using `task-breakdown` Phase 3's
   exact fixed-contract template — status legend + owner legend header,
   zero-padded `T00N` IDs, `- [ ] T001 [agent] [status:todo] <task>` grammar,
   every task starting `todo`.
8. Write `tasks_ready` into this spec's `Stage` cell in
   `planning/roadmap.md` — touch only that cell, nothing else in the row.
9. Unlike a direct `specloop:task-breakdown` invocation (which stops after
   this, per its own Phase 4, and explicitly says "do not begin executing
   any task"), `specloop:advance` also stops here for this spec — running
   the list is the loop orchestrator's job (`002`/`specloop:loop`), never
   this skill's, exactly as `task-breakdown` Phase 4 already states. Tell
   the user `tasks.md` is populated and ready, and name any `[human]` tasks
   in it that the loop will skip.
10. Once this spec lands at `Stage: tasks_ready` or defers, move to the
    next spec in the worklist — whether it needed Phase 1+2 or just Phase 2.
    If this was the last spec in the worklist, proceed to Phase 4 — Report.

## Phase 3 — Defer handling

A deferred spec's `Stage` cell in `planning/roadmap.md` is left completely
untouched — not written to at all, positive or negative. No special
"deferred" marker: `design.md`'s "doesn't require new state beyond the
`Stage` column that already exists". Deferred during Phase 1: stays
`Stage: requirements`. Deferred during Phase 2: stays `Stage: design_closed`.

This is why re-running `specloop:advance` is safe without extra bookkeeping:
Phase 0's scan picks up a deferred spec again on the next run, since it's
still sitting at `Stage: requirements` or `design_closed` — nothing in the
data distinguishes "never touched" from "deferred last time," and nothing
needs to.

Track which specs got deferred this run in-conversation only (never written
to disk) so Phase 4 can name them.

## Phase 4 — Report

Once every spec in Phase 0's worklist is processed (or immediately, if the
user named a single spec), report a summary with three named groups — never
merge them into one list:

- **Reached `Stage: tasks_ready` this run** — every spec that finished Phase
  2, including ones that only needed Phase 2 because they started at
  `design_closed`. For each, name any `[human]` tasks in its `tasks.md` the
  loop will skip — this repeats Phase 2 step 9's per-spec mention as part of
  the consolidated summary. Note inline, on that spec's own line, if a live
  question had to be asked to get it there (Phase 1 step 3 / Phase 2 step 3's
  escape hatch) — that's a detail of how the spec reached `tasks_ready`, not a
  separate outcome, so it never gets its own group.
- **Deferred** — every spec Phase 3 tracked as deferred this run, with the
  `Stage` it stayed at (`requirements` or `design_closed`). Note inline, same
  as above, if a live question was asked before the defer.
- **Blocked** — every row Phase 0 step 2 skipped for an unfinished dependency.

Tell the user how to pick up deferred specs later: re-run `specloop:advance`
(optionally naming which ones) — Phase 0's scan finds them again since a
deferred spec's `Stage` cell is left untouched (Phase 3).

**`specloop:advance` does not invoke `specloop:loop`.** Starting the loop
stays the user's separate, explicit call — exactly as `specloop:task-breakdown`'s
own Phase 4 and `specloop:loop-setup`'s Phase 2 already leave it. Do not begin
executing any task here either.

Stop.
