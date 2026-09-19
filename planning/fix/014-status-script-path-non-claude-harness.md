# 014 — status-script-path-non-claude-harness

## Scope

030

## Found

`skills/status/SKILL.md` Phase 0 (after `012`) runs the build script via
`${CLAUDE_PLUGIN_ROOT}/skills/status/scripts/build_dashboard.py`, a placeholder only
Claude Code substitutes. Under any other harness the literal text reaches the
model unsubstituted, so the command has no valid path. Not caught earlier:
`022`'s OpenCode audit (T003) exercised `start`, not `status`. Surfaced by
a 2026-09-18 cross-harness audit, whose proposed fix (`${CODEX_PLUGIN_ROOT}` /
`${OPENCODE_PLUGIN_ROOT}`) was checked and found to be invented — those names
appear in no doc consulted. The Agent Skills spec defines no placeholder for a
skill's own directory; it says bundled files are referenced by relative path from
the skill root. OpenCode's and Codex CLI's skill docs say nothing on the point.

## Status

in_progress

## Fix

`skills/status/SKILL.md` Phase 0 keeps `${CLAUDE_PLUGIN_ROOT}` as the primary path
and now adds a harness-neutral fallback for when it arrives unsubstituted: resolve
`scripts/build_dashboard.py` relative to the directory the `SKILL.md` was loaded
from, else search the standard skill directories, and run by absolute path with the
target repo as the working directory. `CONTRIBUTING.md`'s dev note updated to match.
No new per-harness variables. Not yet verified: a live `specloop:status` run under
OpenCode (external fixture, own `.git`, `.agents/skills/` copy) — this entry stays
`in_progress` until that passes. Also unverified: `fix/012` says
`${CLAUDE_SKILL_DIR}` is unsubstituted in skill text, but Claude Code's current
skills docs say it is; left alone since `${CLAUDE_PLUGIN_ROOT}` is live-verified.

## Date

2026-09-19
