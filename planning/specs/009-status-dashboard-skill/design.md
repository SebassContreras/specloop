# 009 — status-dashboard-skill — Design

## Approach

A fixed HTML template the skill fills with data read fresh off disk each run — not a
freely-designed layout. Structure:

- **Roadmap overview**: one row per spec (`ID`/`Plan`/`Status`/`Depends on`/`Stage`/
  `Priority`), color-coded by `Status`, with any `Stage`/`Status` drift flagged inline.
- **Per-spec drill-down**: clicking a spec's row reveals its own `tasks.md` detail —
  every task's owner/status/note, without leaving the page (single self-contained
  file, no server — see Hard constraints).
- **Fix log panel**: a separate section listing every `planning/fix/NNN-name/report.md`
  entry (title, `Scope`, `Date`) with the same drill-down pattern — expand to read
  `Found`/`Fix` inline.

All three sections come from the same read pass already required for the text summary
— no separate data-gathering path for the HTML vs. the chat report.

Every run **fully regenerates** `planning/dashboard.html` from scratch (write, not
patch) — no risk of a stale row surviving from a previous run. The skill must succeed
and produce a dashboard even when `.specloop/loop.config.json` doesn't exist yet
(it never reads that file) and even when `planning/fix/` doesn't exist at all yet (the
fix-log panel is simply empty/omitted, not an error). `template.html` itself is fully
self-contained — inline `<style>`, no external stylesheet/font/script/CDN reference,
no build step — so the generated `dashboard.html` opens correctly from a plain
`file://` path with nothing running.

## Deliverables

- `skills/status/SKILL.md` — new skill, read-only, frontmatter `name: status`.
- `skills/status/references/template.html` — the fixed HTML/CSS template (roadmap
  table, per-spec drill-down, fix-log panel), kept separate from `SKILL.md` the same
  way `skills/start/references/question-bank.md` is — the skill reads it and
  substitutes the data read off disk into it, rather than embedding a large HTML/CSS
  blob inline in the skill's own instructions.
- `planning/dashboard.html` — the generated artifact, written into the *target* repo
  each run (not shipped as part of the plugin itself).

## Sequencing

None beyond what `roadmap.md` already records (depends on `001` only, already `done`).
