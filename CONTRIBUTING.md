# Contributing

This repo follows the spec-driven workflow it also ships as a plugin (dogfooding):

- Check [`planning/roadmap.md`](planning/roadmap.md) for the index of specs, their status,
  and dependencies before proposing anything new.
- Each feature lives in `planning/specs/NNN-name/`: `requirements.md` first, then a
  closed `design.md`, then a populated `tasks.md`. Open a spec's requirements before
  writing code for it.
- Skills live in `skills/<name>/SKILL.md`. The loop-orchestrator's reference
  implementation lives in `framework/orchestrator/` (Node/TypeScript, run via `tsx`).

## Local dev

- `claude plugin validate .` — checks the plugin manifest/skills.
- `claude --plugin-dir .` from a separate target-repo checkout — exercises the
  skills end-to-end against a real repo.
- `framework/orchestrator/`: `pnpm install`, then `pnpm run typecheck` / `pnpm run
  lint` / `pnpm run format` (ESLint + Prettier, single quotes).

## Choose the right path

- Found a bug in a skill or the orchestrator? Use
  [the bug report template](.github/ISSUE_TEMPLATE/bug-report.yml).
- Want to change a skill's contract, the orchestrator's config shape, or any other
  product behavior? Open an issue first so the direction can be agreed on before
  you put work into it.
- Found a security vulnerability? Follow [`SECURITY.md`](SECURITY.md) — do not
  open a public issue with exploit details.

New to the shape of a filled spec? See [`examples/`](examples/) for a worked
`requirements.md` → `design.md` → `tasks.md` example before running a skill for
the first time.

When a spec's `tasks.md` reaches all-`done`, add an entry to
[`CHANGELOG.md`](CHANGELOG.md) (see the PR checklist in
`.github/PULL_REQUEST_TEMPLATE.md`).

## Status

Personal project, shared as-is — no support SLA. Issues and PRs are welcome; for
anything nontrivial, open an issue first so the direction can be agreed on before
you put work into it.
