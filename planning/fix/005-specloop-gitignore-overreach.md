# 005 — specloop-gitignore-overreach

## Scope

—

## Found

`planning/architecture.md`'s Fixed rule claimed `.specloop/` was local-only and
never committed (gitignored, whole folder), and the repo root's own `.gitignore`
enforced exactly that with a blanket `.specloop/` line. Neither ever matched what
`skills/start` Phase 1 actually scaffolds: `.specloop/.gitignore` containing only
`logs/` — meaning `loop.config.json` (a project-level default: `workers`,
`contextFiles`, `language`) and `interview.md` were always meant to be tracked,
with only the per-run `logs/` directory excluded. The stricter root-level rule and
Fixed-rule wording predate `skills/start`'s current design and were never brought
back in line with it — the exact "asserting a rule the code doesn't honor" gap
`AGENTS.md` already warns about.

## Status

resolved

## Fix

Removed the blanket `.specloop/` line from the root `.gitignore` (only
`.specloop/logs/` stays untracked, via `.specloop/.gitignore`). Corrected
`planning/architecture.md`'s Fixed rule to state that `.specloop/` is committed
except its `logs/` subdirectory. Scaffolded the missing
`.specloop/logs/.gitkeep` and `.specloop/.gitignore` (`logs/`) for this repo,
since `.specloop/` had never actually been created here before.

## Date

2026-09-14
