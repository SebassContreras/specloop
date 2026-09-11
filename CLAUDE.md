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

Current state (2026-09-11): `001`–`006`, `016`, `017`, `020`, `022`, `023` are `done`.
`001`/`003`/`004` are working skills under `skills/`; `002`'s reference orchestrator
lives under `framework/orchestrator/`, with two ways to actually run it — the
deterministic `loop run` CLI (unattended/CI-friendly, no judgement) and the newer
interactive `skills/loop/SKILL.md` (the chat session running it is the master: reads
`tasks.md` itself, runs workers, and asks the user directly on a suspected
usage/rate-limit hit). `014` (worker-context-injection) and `015`
(roadmap-status-writer) are `in_progress` — both partly implemented already
(`014`'s worker-language feed, T10, landed). `022`'s acceptance criteria only
required one non-Claude-Code harness verified — OpenCode passed a live audit
2026-09-08, so `planning/architecture.md`'s Container section names it; Cursor and
Codex CLI audits (`022` T001/T002) remain open as optional follow-up, not blocking.
`021` (harness-worker-backend) is `todo`, narrowed 2026-09-11 to just the
deterministic `loop run` path (the interactive skill already gets the same benefit
for free via its own harness-synergy rule) — still not designed. Specs `018`, `019`
and `007`–`013` are `todo`, unstarted (`007`/`011` requirements.md were corrected
2026-09-11 to stop describing now-removed `splitPane`/`quota.ts` modules, not
otherwise touched). Check `planning/roadmap.md` before touching anything — its own
top section and `planning/handoff.md` carry the detail this paragraph doesn't.
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
