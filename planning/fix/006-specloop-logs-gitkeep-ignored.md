# 006 — specloop-logs-gitkeep-ignored

## Scope

001

## Found

`skills/start/SKILL.md` Phase 1 scaffolds `.specloop/logs/.gitkeep` alongside
`.specloop/.gitignore` containing a bare `logs/` line — but that line ignores
everything under `logs/`, `.gitkeep` included, since it has no exception.
`.gitkeep`'s entire purpose (keeping an otherwise-empty directory tracked) was
defeated by the very `.gitignore` scaffolded next to it: `logs/` never
actually survives a commit in any repo `specloop:start` scaffolds. Found while
verifying this repo's own newly-un-blanket-ignored `.specloop/` with
`git add -n` (`planning/fix/005`'s follow-up check).

## Status

resolved

## Fix

Changed `.specloop/.gitignore`'s content to `logs/*` + `!logs/.gitkeep` (the
standard idiom for ignoring a directory's contents while keeping one file
tracked) in `skills/start/SKILL.md`'s Phase 1 template, `skills/loop-setup/
SKILL.md`'s Phase 2 verification step, and this repo's own `.specloop/
.gitignore`. Verified with `git add -n .specloop/` that `logs/.gitkeep` is now
actually staged.

## Date

2026-09-14
