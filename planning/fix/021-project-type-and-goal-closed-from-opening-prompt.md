# 021 — project-type-and-goal-closed-from-opening-prompt

## Scope

001, 017

## Found

`planning/fix/020`'s `idea-detail` ran after `project-type` and `goal`, and nothing
stopped the agent from closing those two from the opening request. Codex in `merca`
wrote `project-type=covered "una aplcacion"` and `goal=covered "hacer la compra en mi
super de confianza…"` verbatim from the triggering prompt, then asked `idea-detail`
after the fact. Two gaps: (1) `question-bank.md`'s "skip what the conversation has
already answered" let the opening prompt count as an answer, so the goal was fixed
before the user had described the project; (2) `project-type` accepted a generic "an
app", with no mobile/web/desktop/service form, and nothing in Phase B asks for the form
later. `020` also added Spanish-only prompt text to both English skill files.

## Status

resolved

## Fix

`skills/start/references/question-bank.md` Phase A reordered to `idea-detail` →
`project-type` → `goal`. A new intro line says the opening request seeds `idea-detail`
but never closes `project-type`/`goal`. For software, `project-type` now requires the
concrete form (mobile app + platforms, web app, desktop app, backend service/API, CLI,
library, or a combination); "an app" alone isn't an answer. `goal` is drafted from the
narrative + type and covered only on the user's yes or edit. `skills/start/SKILL.md`
Phase 2 was rewritten to match, the header-set note clarifies that only the category
picks `architecture.md`'s headers, and Phase 0 migration now puts `idea-detail` first
and resets `project-type`/`goal` to `open` when they were covered while `idea-detail`
was still open. `020`'s Spanish text was replaced with English ("asked in the user's
language"). Copied to `merca/.agents/skills/start/`. `check-skill-consistency` and
`check-markdown-conventions` PASS. A live re-run in `merca` is not verified yet.

## Date

2026-09-24
