# 017 — project-type-genericity — Design

## Approach

Most of the branching this spec asks for already exists — the 2026-09-02 restoration
added the `project-type` classifier, the branched question bank (`B-software` /
`B-marketing-content` / `B-operations-process` / `B-research` / `B-other`),
delivery-neutral `Deliverables`/`single-action` phrasing in `design-closing`/
`task-breakdown`, and tolerance for an absent `planning/architecture.md` in both. What
was actually missing was narrower: `skills/start`'s Phase 1 scaffold described
type-keyed `architecture.md` headers in prose but never gave a concrete template (the
"don't assert a rule the code doesn't honor" trap), a stale phase-number reference
(said "Phase 4 fills it", meant Phase 3), and `loop-setup` only reported an all-`human`
backlog *after* generating, not before asking a worker-CLI question that backlog can't
use yet. Those are now fixed directly in `skills/start/SKILL.md` and
`skills/loop-setup/SKILL.md`.

What remains is proof: a non-software worked example under `examples/`, and a
non-software fixture run per `006`. The fixture is run the same way
`test/sample-new-repo/`'s was for the CLI case — the phases are followed for real
against a fresh throwaway repo — but for a fictional persona (a marketing/content
project invented for this run) rather than a real second project of the author's,
since there isn't one. It stays local-only (the gitignored `test/` dir, never
committed). That's declared plainly in the fixture's own notes: it proves
the branching logic never asks a software question and produces type-appropriate
artifacts (structural correctness), not interview *bearability* for a real user — that
remains `001` T30 / `006` T10's job, and stays human-only for the reason recorded
there.

## Deliverables

- `skills/start/SKILL.md` Phase 1 — concrete per-type `architecture.md` header
  templates (software/marketing/operations/research/other), stale phase reference
  fixed.
- `skills/loop-setup/SKILL.md` Phase 0 — all-`human`-backlog check before Phase 1's
  Q&A.
- `examples/marketing-content-spec/` — one complete spec (`requirements.md` → closed
  `design.md` → populated `tasks.md`) for a toy marketing project, mirroring
  `examples/hello-cli-spec/`'s shape, added to `examples/README.md`.
- A local-only non-software fixture run (gitignored `test/` dir, never committed):
  `specloop:start` through its first spec's `requirements.md`, that spec's closed
  `design.md`, and populated `tasks.md`, run against a declared fictional marketing
  persona. A `NOTES.md` in the fixture root states the persona and what this run
  does/doesn't prove.
- `006-e2e-smoke-testing/tasks.md` T011 flipped to `done`, pointing at this fixture.

## Sequencing

`examples/` first (pure documentation, no branching risk), then the fixture (exercises
the same phases against the real skill text, so any bug the example's hand-authoring
smoothed over still surfaces).

## Open questions / deferred

- ~~A second non-software fixture (operations or research) — deferred~~. Done as a
  side-effect of `001` T030's live human-run interview test (2026-09-09):
  `test/ops-onboarding-repo/` (local-only, gitignored), an operations/process persona,
  human-answered rather than agent-authored — a stronger version of this item than
  originally scoped, since it also proves the type branching holds up under a real
  reaction rather than an invented one. Results in that fixture's `NOTES.md` and in
  `001`'s `tasks.md` T030 note. `B-other`'s generic dimensions are still unexercised by
  any example or fixture — that part of the gap remains open.
