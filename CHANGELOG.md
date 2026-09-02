# Changelog

`docs/roadmap.md` owns direction, status, and dependencies between specs. This file
owns what has actually shipped, in delivery order — one entry per spec once its
`tasks.md` is fully `done`, not one entry per commit.

No version has been tagged/released yet (see `.claude-plugin/plugin.json`'s
`0.1.0`) — everything below is `Unreleased`. Add a dated section here once a
version is actually tagged.

## Unreleased

### 2026-09-02 — scope restoration

An earlier change the same day narrowed `specloop:start` and recorded the removals in
`docs/architecture.md`'s "Declined" table, citing a `docs/product.md` clause that the
*same* change had written. Four of the project's six stated objectives were rejected on
that circular authority, and the "it becomes a spec instead" escape hatch was never
exercised — no such rows existed. Undone, and the mechanism closed:

- **Restored** the technologies/architecture/tools Q&A (now its own phase, branched by
  project type, writing a decision register into `docs/architecture.md` and the
  operative form into `AGENTS.md` — which nothing wrote before, leaving it a permanent
  `TBD` stub and two downstream read-gates permanently inert).
- **Restored** skill recommendation, repositioned after the stack Q&A so it keys off
  the user's actual selections rather than a guess from the goal.
- **Added** `AGENTS.md` as the single project-context source, with `CLAUDE.md` as a
  thin `@AGENTS.md` import. Required by CLI-agnosticism, not preference:
  `codex`/`opencode` read `AGENTS.md`, so a `CLAUDE.md`-only scaffold made the plugin
  Claude-only in its context layer.
- **Added** the project-type classifier as the first interview question, plus
  `skills/start/references/question-bank.md` and the interview contract (coverage
  ledger, follow-up triggers, skip protocol, closing sweep, no fixed question count).
- **Added** the styles/preferences phase and `docs/styles.md`.
- **Added** `.specloop/` static scaffolding to `start`, and moved `loop-setup`'s
  refusal from scaffolding to execution — it previously refused in exactly the
  freshly-scaffolded state the objective describes.
- **Recorded** the rule that produced the drift: a "Declined" row may not overrule a
  stated user objective, nor cite a `product.md` clause edited in the same change.
- **Fixed** `design-closing`'s readiness gate, which had begun keying on a header that
  0 of this repo's 15 `requirements.md` files use — it refused on every spec in its own
  reference repo.
- **New specs** `014`–`018`: worker context injection, roadmap status writer,
  interview engine, project-type genericity, project style preferences.

### 015 — roadmap-status-writer (partial)

- `src/mdTable.ts`: split-based row parsing shared by `roadmap.ts`/`tasks.ts`. The old
  exact-arity regex matched 4-cell rows only, so adding a column made every row fail to
  parse — surfacing as `nothing eligible to run` rather than an error.
- `roadmap.writeSpecStatus`: the roadmap's first-ever `Status` writer. Without one, a
  finished spec stayed `in_progress`, `pickNextSpec` kept resuming it, and no `todo`
  row could ever become eligible. This repo's own roadmap sat in that deadlock.
- `tasks.md` `Owner` column (`agent`/`human`), with `human` tasks skipped by the loop
  and reported instead. Pre-`Owner` 4-column tables still parse.
- `loop status` now derives from `tasks.md` and flags disagreement with the recorded
  cell instead of echoing it as truth.
- Note sanitization: a worker log line containing `|` or a newline silently corrupted
  its table before.

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
- **001 — scaffold-and-spec-skill**: `specloop:start` — scaffolds `AGENTS.md` +
  `CLAUDE.md` + `docs/{product,architecture,roadmap}.md` + `.specloop/`; the full
  interview (project type → vision → technologies/architecture/tools → skill
  recommendation → styles) under the coverage contract; roadmap seeding from the
  recorded answers; per-spec `requirements.md` Q&A with idempotent re-entry. Does not
  scaffold `README.md`/`CONTRIBUTING.md`/`LICENSE`/CI config — those are project
  deliverables the roadmap decides (see `docs/architecture.md`'s "Declined" table).
  Still `in_progress`: the end-to-end local test needs re-running against the new
  interview shape (`T29`).

## Format

- Group by spec ID, not by individual commit or PR.
- State what shipped, not implementation detail — that lives in the spec's
  `design.md`/`tasks.md` notes.
- A spec only gets an entry once every task in its `tasks.md` is `done` (an
  `interrupted` local-test task still blocks the entry — see each spec's open
  tasks in `docs/roadmap.md`).
