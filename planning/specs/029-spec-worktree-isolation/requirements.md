# 029 — spec-worktree-isolation

Raised 2026-09-14 as GitHub issue #4 (`Proposal: git-worktree isolation for
spec-level sub-agents`), during this repo's own live `specloop:loop` run
against `026`; filed here and the issue closed once this spec existed.
Deferred — not designed yet, no coding, blocked on the open question below.

## What's being built

Sub-agent execution isolated in its own git worktree per task/spec: a
sub-agent creates a worktree, does its work there, then asks the master to
review and merge the worktree back into `main` — instead of every sub-agent
editing files directly in the one shared working tree, as `skills/loop` does
today.

## Who/what it serves

Loop runs where multiple tasks/specs are currently serialized purely to
avoid two sub-agents editing the same file at once — see `026`'s own run,
where T006–T012 all touched `skills/status/references/template.html` and ran
one at a time on purpose, not because they were otherwise ready to
parallelize.

## Hard constraints

- **Blocking, unresolved**: `planning/roadmap.md` is written by nearly every
  spec (each writes its own row). Two specs running in separate worktrees
  and independently merging back to `main` would very likely produce a real
  git merge conflict on that file. This spec cannot be designed further
  until one of these has an actual answer:
  - Serialize `planning/roadmap.md` writes through the master only
    (worktrees never touch it directly), or
  - Move per-spec state into something that merges mechanically (e.g. one
    file per spec), reconciled into the roadmap by the master afterward.
- Whether a sub-agent creating/managing its own worktree (branch naming,
  stale-worktree cleanup, what it reads while `main` changes underneath it)
  is expressible as plain Skill instructions at all, or needs tooling
  outside a Skill's reach, is itself an open question.
- Must clear the same bar this repo has already applied twice to similar
  proposals (live terminal split, standalone CLI, regex quota heuristic —
  all built, confirmed working, reverted for not earning their complexity;
  see `planning/architecture.md`'s Declined table): don't build until the
  roadmap-merge story is actually designed, not assumed workable.
- `026`'s own run suggests the upside may be smaller than it looks — most of
  a typical spec's tasks already share one or two files, so true
  worktree-enabled parallelism may buy less than it costs. Re-examine this
  before committing to a design, not after.

## Acceptance criteria

Not yet defined — blocked on the hard constraint above.
`specloop:design-closing` should not proceed past requirements until the
roadmap-write reconciliation question has an actual answer.

## Out of scope

- Cross-provider dispatch and file-overlap-aware batching — already
  adopted, see `002-loop-orchestrator/design.md`'s "Parallel batching" and
  "Cross-provider dispatch" sections (2026-09-14, same discussion this spec
  was split off from).
- One log file per spec, sections per task — already adopted
  (`skills/loop`'s Phase 3.4).

## Dependencies

`002` (loop-orchestrator) — this would change how its Phase 3 dispatches and
executes sub-agent work.

## Owner split

(none stated)
