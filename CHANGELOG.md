# Changelog

`docs/roadmap.md` owns direction, status, and dependencies between specs. This file
owns what has actually shipped, in delivery order — one entry per spec once its
`tasks.md` is fully `done`, not one entry per commit.

No version has been tagged/released yet (see `.claude-plugin/plugin.json`'s
`0.1.0`) — everything below is `Unreleased`. Add a dated section here once a
version is actually tagged.

## Unreleased

- **005 — open-source-release**: MIT `LICENSE`, public-facing root `README.md`,
  `license`/`repository` fields in `plugin.json`, root `CONTRIBUTING.md`. Repo
  visibility flip to public is deliberately left for the author (`T7`, still
  `todo`).
- **004 — design-closing-skill**: `specloop:design-closing` — guided Q&A that
  closes a spec's `design.md` (`Approach` / `Components / files touched` /
  optional `Open questions`).
- **003 — task-breakdown-skill**: `specloop:task-breakdown` — drafts, confirms
  with the user, and writes a spec's `tasks.md` from a closed `design.md`, using
  the fixed `ID | Task | Status | Notes` contract.
- **002 — loop-orchestrator**: `framework/orchestrator/` reference implementation
  (Node.js/TypeScript via `tsx`) + `specloop:loop-setup` skill. `loop run` /
  `loop stop` / `loop status`; safe stop (stop-flag, `interrupted` status,
  resume log); `windowsTerminal` / `tmux` / `none` split-pane backends; ESLint +
  Prettier tooling; Sonar S8786 (ReDoS) and S4036 (unsafe `PATH`, POSIX-only)
  fixes.
- **001 — scaffold-and-spec-skill**: `specloop:start` — scaffolds `CLAUDE.md` +
  `docs/{product,architecture,roadmap}.md` + `README.md` + `CONTRIBUTING.md`;
  first-run vision/MVP/skill-suggestion/license Q&A; per-spec `requirements.md`
  Q&A with idempotent re-entry; stack Q&A into `docs/architecture.md`.

## Format

- Group by spec ID, not by individual commit or PR.
- State what shipped, not implementation detail — that lives in the spec's
  `design.md`/`tasks.md` notes.
- A spec only gets an entry once every task in its `tasks.md` is `done` (an
  `interrupted` local-test task still blocks the entry — see each spec's open
  tasks in `docs/roadmap.md`).
