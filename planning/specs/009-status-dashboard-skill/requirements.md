# 009 — status-dashboard-skill

## What's being built

A new skill, `specloop:status` — **read-only**, never writes to any file except the
dashboard artifact itself (see below), no exceptions. Reads the target repo's
`planning/roadmap.md` plus every listed spec's `tasks.md` and reports: active spec(s),
task counts by status, any `blocked`/`interrupted` rows that need attention, and a
one-line "next suggested action" (which skill to run next, per the fixed pipeline
order: `start` → `design-closing` → `task-breakdown` → `loop-setup` → `loop`).

Reformulated 2026-09-13 (was plain-text-only): also **writes a static
`planning/dashboard.html`** — the same information, rendered visually (per-spec
progress, color-coded status, a `blocked`/`interrupted` callout) instead of only a
chat/terminal summary. Regenerated fresh, in full, every time the skill runs — it is a
snapshot, not a live view. **Deliberately not auto-refreshing or server-backed**: this
project has twice reverted a standing background process for a visual affordance
(`windowsTerminal`/`tmux` split-pane, 2026-09-11; the standalone `loop run` CLI,
2026-09-12 — see `planning/architecture.md`'s Fixed rules and Declined table). A
dashboard that updates itself without the skill being re-invoked would need exactly
that kind of process (a file watcher + local server), which stays out of scope here on
the same grounds. "Real-time" in practice means: run `specloop:status` again, the file
gets rewritten, refresh the browser tab.

## Who/what it serves

Anyone in the target repo who wants "what's the state of this project, and what's
next" without opening `roadmap.md` and every `tasks.md` by hand — today's only way to
answer that question.

## Hard constraints

- **Reads `roadmap.md`'s `Stage` column directly rather than re-deriving pipeline
  position from scratch** (decided `015` T015, 2026-09-12) — this skill has no writer
  of its own for it; `Stage` is written by whichever pipeline skill completes that
  transition.
- **Reports a `Stage`/`Status` cell that looks inconsistent with the spec's own files**
  (e.g. `tasks_ready` but `tasks.md` is still the header-only stub; or `done` with a
  `Stage` that isn't `—` — see `planning/fix/002-stage-not-reset-on-done`, found
  2026-09-13, exactly the kind of drift nothing else in the repo checks for) rather
  than trusting either column blindly.
- Must work standalone without `.specloop/loop.config.json` written yet — a repo that
  hasn't reached `loop-setup` should still get a useful report and dashboard.
- Pure Markdown-table reads of `planning/`, same parsing contract `skills/loop` uses —
  no new roadmap/tasks grammar invented for this skill.
- The HTML file is self-contained (inline CSS, no external assets/CDN, no build step)
  so it opens correctly from a plain `file://` path with no server.

## Acceptance criteria

- Running `specloop:status` on a repo with several specs at different pipeline stages
  prints the terminal summary described above and writes/overwrites
  `planning/dashboard.html` in the same run.
- The dashboard visually distinguishes `done`/`in_progress`/`blocked`/`interrupted`/
  `todo` specs and surfaces any `Stage`/`Status` drift as a visible warning, not just
  in the chat summary.
- Running it again after a spec's state changes on disk fully replaces the previous
  dashboard content — no stale rows left over from a prior run.
- Running it on a repo with no `.specloop/loop.config.json` yet still succeeds.

## Out of scope

- Any write/mutation path beyond the dashboard file itself (fixing a stuck `blocked`
  row, editing `roadmap.md`/`tasks.md`, etc.) — that's `012-spec-amend-skill`'s job.
- Auto-refresh, a local server, file watching, or any standing process — see the
  reasoning above; would reopen a rule this project has already settled twice.
- Multi-repo or cross-project dashboards — one target repo per run, same scope as
  every other specloop skill.

## Dependencies

`001` (per `planning/roadmap.md`'s `009` row).

## Owner split

(none stated)
