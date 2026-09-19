# Contributing

This repo follows the spec-driven workflow it also ships as a plugin (dogfooding):

- Check [`planning/roadmap.md`](planning/roadmap.md) for the index of specs, their status,
  and dependencies before proposing anything new.
- Each feature lives in `planning/specs/NNN-name/`: `requirements.md` first, then a
  closed `design.md`, then a populated `tasks.md`. Open a spec's requirements before
  writing code for it.
- Skills live in `skills/<name>/SKILL.md`. The loop is one of them
  (`skills/loop/SKILL.md`) — instructions for whatever agent runs it, no
  separate code or package to build. One exception: `skills/status/scripts/
  build_dashboard.py` (`030`), a deterministic, judgment-free helper script —
  the only skill with an external runtime dependency (`python3`, standard
  library only).

## Code conventions

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/)
(`<type>(<scope>): <description>`, imperative mood) from 2026-09-14 onward — see
[`planning/styles.md`](planning/styles.md#code-conventions) for the full naming/
comment/commit rules. Existing history predates this and isn't rewritten.

## Local dev

- `claude plugin validate .` — checks the plugin manifest/skills.
- `claude --plugin-dir .` from a separate target-repo checkout — exercises the
  skills end-to-end against a real repo.
- `python3 /path/to/this/specloop/checkout/skills/status/scripts/build_dashboard.py`
  — run with a target repo's root as the working directory, but the script
  itself by its full path into this checkout (not a bare relative
  `skills/status/scripts/build_dashboard.py` — that only exists here, not in
  the target repo you're testing against) — to exercise `specloop:status`'s
  dashboard generation without going through the skill. The skill itself
  uses `${CLAUDE_PLUGIN_ROOT}` for this same reason under Claude Code, and
  falls back to resolving the script relative to the skill's own directory
  under other harnesses — see
  `planning/fix/012-status-script-path-not-portable.md` and
  `planning/fix/014-status-script-path-non-claude-harness.md`.

## Choose the right path

- Found a bug in a skill? Use
  [the bug report template](.github/ISSUE_TEMPLATE/bug-report.yml).
- Want to change a skill's contract, the loop's config shape, or any other
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
