# Contributing

This repo follows the spec-driven workflow it also ships as a plugin (dogfooding):

- Check [`docs/roadmap.md`](docs/roadmap.md) for the index of specs, their status,
  and dependencies before proposing anything new.
- Each feature lives in `docs/specs/NNN-name/`: `requirements.md` first, then a
  closed `design.md`, then a populated `tasks.md`. Open a spec's requirements before
  writing code for it.
- Skills live in `skills/<name>/SKILL.md`. The loop-orchestrator's reference
  implementation lives in `framework/orchestrator/` (Node/TypeScript, run via `tsx`).

## Local dev

- `claude plugin validate .` — checks the plugin manifest/skills.
- `claude --plugin-dir .` from a separate target-repo checkout — exercises the
  skills end-to-end against a real repo.
- `framework/orchestrator/`: `pnpm install`, `pnpm exec tsc --noEmit` to type-check.

## Status

Personal project, shared as-is — no support SLA. Issues and PRs are welcome; for
anything nontrivial, open an issue first so the direction can be agreed on before
you put work into it.
