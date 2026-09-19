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

resolved

## Fix

`skills/status/SKILL.md` Phase 0 keeps `${CLAUDE_PLUGIN_ROOT}` as the primary path
and now adds a harness-neutral fallback for when it arrives unsubstituted: resolve
`scripts/build_dashboard.py` relative to the directory the `SKILL.md` was loaded
from, else search the standard skill directories, and run by absolute path with the
target repo as the working directory. `CONTRIBUTING.md`'s dev note updated to match.
No new per-harness variables. Verified 2026-09-19: OpenCode 1.18.31 in an external
fixture (own `.git`, `skills/` copied to `.agents/skills/`) auto-triggered `status`
from "where are we? give me the status of this project's roadmap", ran the script by
its absolute `.agents/skills/status/scripts/` path and wrote `planning/dashboard.html`
with a correct chat summary. Model `muse-spark-1.2-contributor-free`. The python3
side finding became `015`. Confirmed from OpenCode's raw `--format json` events: its
`skill` tool output carries "Base directory for this skill: <abs path>" plus
"Relative paths in this skill (e.g., scripts/, reference/) are relative to this
base directory", so under OpenCode the first branch of the fallback (relative to the
skill's own directory) is fed by the harness itself; the search list is only a
second line. Regression check the same day: Claude Code 2.1.278 via `--plugin-dir`
(fixture with no skills copy, so only the `${CLAUDE_PLUGIN_ROOT}` path could have
resolved) still ran `status` end to end. Also probed with a throwaway plugin: Claude
Code 2.1.278 substitutes both `${CLAUDE_SKILL_DIR}` and `${CLAUDE_PLUGIN_ROOT}` in
plugin skill content, so `fix/012`'s note that `${CLAUDE_SKILL_DIR}` is unsubstituted
is stale as of this version (`012` left unedited as history). Cursor and Codex CLI
still unverified.

## Date

2026-09-19
