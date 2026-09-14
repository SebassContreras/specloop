---
name: amend
description: >
  Revise an existing spec's requirements.md and/or reopen its closed design.md
  for edits. Refuses outright if any of the spec's tasks is
  [status:in_progress] — the loop may be actively working it — and requires an
  explicit confirm step before touching anything, since this writes into
  already-closed artifacts rather than a stub. Reuses specloop:start's Phase 7
  and specloop:design-closing's Phase 1 Q&A by reference instead of
  duplicating their questions, and flags (never silently auto-fixes) a
  tasks.md gone stale from the change.
when_to_use: >
  Use when the user wants to change requirements or reopen a closed design for
  a spec that's already past that stage — phrasing like "amend spec NNN",
  "revise the requirements for X", "reopen the design for spec NNN", "the
  requirements changed, update spec NNN". Deliberately invoked only — never
  chained automatically from specloop:start, specloop:design-closing,
  specloop:task-breakdown, or specloop:loop.
---

# specloop: amend

You are amending an already-scaffolded spec **inside the target repo**. This edits
artifacts other specloop skills only ever write once and leave closed — a higher bar
than `start`/`design-closing`/`task-breakdown`, which only ever write into a stub or
an in-progress file. Ask **one question at a time** and wait for the reply before
asking the next — never batch questions into a single message.

## Phase 0 — Resolve the spec, refuse if it's actively looping

1. If the user named a spec (`NNN` or a kebab-case name), resolve it against
   `planning/roadmap.md`. Otherwise show the roadmap table and ask which spec to
   amend.
2. Read that spec's `tasks.md`, if it exists. Scan for any task line carrying
   `[status:in_progress]` — the checkbox/status grammar `skills/loop/SKILL.md`'s
   Phase 2 documents (`- [ ] T001 [agent] [status:todo] <task>`, five possible
   statuses). **Refuse outright if any task is `in_progress`**: tell the user the
   loop may be actively working this spec, that amending underneath a running task
   risks a worker acting on now-stale requirements/design mid-execution, and to stop
   the loop first — safe-stop (`skills/loop/SKILL.md`'s Phase 4) marks whichever
   task(s) were in flight as `interrupted`. Ask them to retry this skill once that's
   done.

## Phase 1 — Choose the artifact(s), then an explicit confirm

1. Ask which artifact to revise: `requirements.md`, `design.md`, or both.
2. If `design.md` is chosen but it's still the `TBD` stub, say there's nothing
   closed to reopen and point at `specloop:design-closing` instead — refuse that
   choice. If `requirements.md` is chosen but it's still headers with no real
   content, point at `specloop:start` instead — refuse that choice too. Either
   refusal still allows the other artifact if it does have real content.
3. **Explicit confirm step.** State plainly what's about to change (spec ID, which
   file(s), that each already holds answered/closed content) and that this is a
   higher bar than the forward-only skills, which never touch closed content. Ask
   for an explicit yes. On anything else, stop here without writing anything.

## Phase 2 — Requirements revision (only if selected)

Name the canonical `requirements.md` header set (`planning/architecture.md`'s Fixed
rules): `## What's being built` / `## Who/what it serves` / `## Hard constraints` /
`## Acceptance criteria` / `## Out of scope` / `## Dependencies` / `## Owner split`.
Ask the user which of these dimensions they want to change — only re-ask those.

For each dimension chosen, re-run `skills/start/SKILL.md`'s Phase 7 Q&A **by
reference**: reuse its exact question text and section template for that dimension,
one question at a time, waiting for each reply. Don't duplicate that question text
here. Show the section's current content before asking whether/how to change it.
Write each answer to disk as it lands, replacing only that section's content — leave
every other section, and the file's header set, untouched.

## Phase 3 — Design reopen (only if selected)

Re-run `skills/design-closing/SKILL.md`'s Phase 1 Q&A **by reference**: the same
five questions (Approach, Deliverables, Sequencing/dependencies, Decisions settled,
Risks/open questions), one at a time, waiting for each reply — against the spec's
existing closed `design.md` content instead of a `TBD` stub. Show the current answer
for each dimension before asking whether to change it; only overwrite what the user
actually changes. Write to disk after each answer.

If an answer settles a new stack/convention decision, follow
`skills/design-closing/SKILL.md`'s Phase 2 step 3: append (never rewrite) it to
`planning/architecture.md`'s decision register and the operative form to `AGENTS.md`'s
"Stack & conventions".

## Phase 4 — Staleness check against tasks.md

If `tasks.md` already has real tasks — not the header-only stub (the same
real-content test `skills/task-breakdown/SKILL.md`'s Phase 0 uses: legend-only vs.
actual task lines) — and what just changed in requirements/design is meaningful (not
a wording-only fix), tell the user `tasks.md` may now be stale and offer to re-run
`specloop:task-breakdown`. Never leave a real mismatch unflagged, and never
auto-trigger that re-run — only on the user's explicit go-ahead.

## Phase 5 — Write Stage, report, stop

If `design.md` was touched in this run (Phase 3 ran and changed something), write
`requirements` into that spec's `Stage` cell in `planning/roadmap.md` — touch only
that cell, nothing else in the row, same convention `skills/design-closing/SKILL.md`'s
Phase 3 and `skills/start/SKILL.md` use. That value signals the design needs
re-closing via `specloop:design-closing` before `task-breakdown`/`loop` touch this
spec again — never write a `Stage` value outside the fixed set (`requirements` ·
`design_closed` · `tasks_ready` · `looping` · `—`, `planning/architecture.md`'s Fixed
rules). Leave `Stage` untouched if only `requirements.md` was revised without
touching `design.md`.

Report what changed (spec ID, which file(s), which section(s)) and stop. **Do not
chain into `specloop:design-closing`, `specloop:task-breakdown`, or `specloop:loop`
automatically** — each stays the user's own next, deliberate step, same rule
`specloop:loop-setup` and `specloop:fix` already state for themselves.

## Style rules

- Terse and structural, matching specloop's own `planning/*.md` — no filler prose,
  no marketing language.
- Never fabricate a requirements/design answer the user hasn't actually given —
  leave it as an open question instead of guessing.
- One question at a time, always wait for the reply before continuing.
- Never invoked automatically by another skill or by the loop.
