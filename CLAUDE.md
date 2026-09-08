# specloop

Entry point. Everything else lives under `planning/`:

- [`planning/handoff.md`](planning/handoff.md) — **start here if you're new to this repo.**
  Point-in-time notes from the last session: what's next and why, the traps, what is
  *not* verified, and the open judgement calls. Not a source of truth — the roadmap and
  each spec's `tasks.md` are.
- [`planning/product.md`](planning/product.md) — what this is, who uses it (stable).
- [`planning/architecture.md`](planning/architecture.md) — stack, conventions, fixed rules,
  and the "Declined" table (read it before re-proposing something).
- [`planning/roadmap.md`](planning/roadmap.md) — index of specs: order, status, dependencies,
  and the real build order.
- `planning/specs/NNN-name/` — one spec per feature: `requirements.md`, `design.md`,
  `tasks.md`.
- [`planning/fix/`](planning/fix/) — a flat, hand-authored log of post-hoc corrections.
  Not a spec, not loop-runnable — see its own `README.md`.

Current state: specs `001`, `003`, `004` have working skills under `skills/`; `002`'s
reference orchestrator lives under `framework/orchestrator/`; `015` and `014` are
partly implemented there too (`014`'s worker-language feed, T10, landed). `005`, `020`
(checklist-task-format), `022` (cross-agent-skill-compat) and `023` (fix-log) are done.
`022`'s acceptance criteria only required one non-Claude-Code harness verified —
OpenCode passed a live audit 2026-09-08 (discovery/auto-trigger, `when_to_use`
tolerance, full-phase write-as-you-go), so `planning/architecture.md`'s Container
section now names it; Cursor and Codex CLI audits (`022` T001/T002) remain open as
optional follow-up, not blocking. `017` (project-type-genericity) is in progress:
type-keyed `architecture.md` headers, `loop-setup`'s all-`human`-backlog check,
`examples/marketing-content-spec/`, and a local-only `test/sample-marketing-repo/`
fixture run (untracked — `test/` is gitignored) are done; a second non-software fixture
and an absent-`architecture.md` live run are deferred (see its `tasks.md`). Specs
`016`, `018`, `019` are specced but unstarted; `021` (harness-worker-backend) is
reserved on the roadmap but not yet designed. Check `planning/roadmap.md` before
touching anything.
`skills/*/SKILL.md` target the open Agent Skills format, not a Claude-Code-only one —
see `planning/architecture.md`'s Container section.

## Two rules that exist because they were broken once

- **A "Declined" row may not overrule a stated user objective**, and may not cite a
  `planning/product.md` clause edited in the same change. On 2026-09-02 that circularity
  rejected four of the project's six objectives; the restoration is in `001`'s
  `tasks.md` (T15–T27).
- **Don't assert a rule the code doesn't honor.** `skills/start` once promised that
  `planning/architecture.md` "fills in progressively as designs get closed" while no file
  in the repo ever wrote it. If a fixed rule isn't implemented yet, name the spec that
  owns it.
