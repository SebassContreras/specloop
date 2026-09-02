# specloop

Entry point. Everything else lives under `docs/`:

- [`docs/handoff.md`](docs/handoff.md) — **start here if you're new to this repo.**
  Point-in-time notes from the last session: what's next and why, the traps, what is
  *not* verified, and the open judgement calls. Not a source of truth — the roadmap and
  each spec's `tasks.md` are.
- [`docs/product.md`](docs/product.md) — what this is, who uses it (stable).
- [`docs/architecture.md`](docs/architecture.md) — stack, conventions, fixed rules,
  and the "Declined" table (read it before re-proposing something).
- [`docs/roadmap.md`](docs/roadmap.md) — index of specs: order, status, dependencies,
  and the real build order.
- `docs/specs/NNN-name/` — one spec per feature: `requirements.md`, `design.md`,
  `tasks.md`.

Current state: specs `001`, `003`, `004` have working skills under `skills/`; `002`'s
reference orchestrator lives under `framework/orchestrator/`; `015` is partly
implemented there too. Specs `014`, `016`–`018` are specced but unstarted. Check
`docs/roadmap.md` before touching anything.

## Two rules that exist because they were broken once

- **A "Declined" row may not overrule a stated user objective**, and may not cite a
  `docs/product.md` clause edited in the same change. On 2026-09-02 that circularity
  rejected four of the project's six objectives; the restoration is in `001`'s
  `tasks.md` (T15–T27).
- **Don't assert a rule the code doesn't honor.** `skills/start` once promised that
  `docs/architecture.md` "fills in progressively as designs get closed" while no file
  in the repo ever wrote it. If a fixed rule isn't implemented yet, name the spec that
  owns it.
