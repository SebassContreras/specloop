# 008 — ci-pipeline

## Priority: 3

## Requirements (draft — to be reviewed)

- Add `.github/workflows/` CI for **this** repo (specloop itself) — target repos get
  their own generated orchestrator copy and are out of scope here.
- Run on every push/PR: `lint`, `typecheck`, `format:check`, and `test` (once
  `007-orchestrator-unit-tests` lands) for `framework/orchestrator/`.
- Now that `005-open-source-release` is prepping the repo to go public, this is the
  gate that actually enforces the standards `CONTRIBUTING.md` already documents but
  nothing checks today.
- Run on at least Windows + one POSIX runner — `security.ts`'s PATH-safety check is
  POSIX-only (see `011-windows-path-safety`); CI on both platforms surfaces that gap
  instead of hiding it.

## Out of scope

- Testing the skills themselves (`skills/*/SKILL.md`) — those are Q&A instructions
  run by an interactive agent, not scriptable in a CI job. Covered by
  `006-e2e-smoke-testing` as a manual process instead.
