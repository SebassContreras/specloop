# 012 — status-script-path-not-portable

## Scope

030

## Found

`skills/status/SKILL.md`'s Phase 0 ran the build script as a bare relative
path (`python3 skills/status/scripts/build_dashboard.py`), and
`build_dashboard.py`'s own `TEMPLATE_PATH` constant was likewise hardcoded
relative to the working directory (`Path("skills/status/references/template.html")`).
Both assumed the target repo's root and this plugin's own installation
directory are the same directory — true only when `specloop:status` runs
against `specloop`'s own repo. Running the skill from an unrelated target
repo (observed: `clickup-automation`) failed to find the script at all; once
worked around by copying the script to an absolute path, it failed a second
time on the template lookup, for the same underlying reason.

## Status

resolved

## Fix

`skills/status/SKILL.md` Phase 0 now invokes the script via
`${CLAUDE_PLUGIN_ROOT}/skills/status/scripts/build_dashboard.py` —
Claude Code's documented placeholder for a plugin's own installation
directory, substituted inline in skill content before the model sees it
(verified against the official plugin-reference docs; `${CLAUDE_SKILL_DIR}`
was considered and rejected — it's currently unsubstituted in skill
instructions per open `anthropics/claude-code` issues #81588/#36135).
`build_dashboard.py`'s `TEMPLATE_PATH` now resolves via
`Path(__file__).resolve().parent.parent / "references" / "template.html"`
instead of a bare relative path, since the template is a resource bundled
with the plugin, not something read from the target repo — `ROADMAP_PATH`/
`FIX_LOG_DIR`/`OUTPUT_PATH` stay relative to the working directory, since
those genuinely belong to the target repo. `CONTRIBUTING.md`'s manual
dev-invocation instructions updated to match.

## Date

2026-09-17
