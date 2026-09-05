# Changelog

`planning/roadmap.md` owns direction, status, and dependencies between specs. This file
owns what has actually shipped, in delivery order — one entry per spec once its
`tasks.md` is fully `done`, not one entry per commit.

No version has been tagged/released yet (see `.claude-plugin/plugin.json`'s
`0.1.0`) — everything below is `Unreleased`. Add a dated section here once a
version is actually tagged.

## Unreleased

### 023 — fix-log

`planning/fix/` — a flat, hand-authored log for anything a developer finds wrong
after the fact, naming which spec (`Scope`) generated it and what changed. Not
loop-runnable, not roadmap-tracked, no guided skill — deliberately lighter-weight than
a spec, since a one-paragraph correction doesn't need a requirements/design/tasks
pipeline. See `planning/fix/README.md`.

### 020 — checklist-task-format

`tasks.md` is now a GFM checkbox list (`- [ ] T001 [agent] [status:todo] ...`),
zero-padded IDs matching GitHub spec-kit's own convention, replacing the pipe table.
Raised by asking whether specloop's specs should interoperate with spec-kit — its file
format has no owner (agent/human) concept and no 5-state status, so wholesale adoption
was declined (`planning/architecture.md`), but its checkbox convention is the genuinely
industry-familiar part and now carries specloop's own owner/status tags instead.

- **Added** `src/checklist.ts` (the new grammar) and rewrote `src/tasks.ts` onto it.
  `TaskRow`'s external shape is unchanged, so no other file in the orchestrator needed
  to change. A task line is identified only by starting at column 0 — no more
  delimiter-escaping hazard like the old table's unescaped-`|` bug.
- **Migrated** every `tasks.md` in this repo (specs `001`–`019`, 128 rows) and
  `examples/hello-cli-spec/tasks.md` to the new grammar. No dual-format reader kept —
  per-row owner detection during migration caught one pre-existing 4-column legacy row
  (`002` T13) that a naive uniform-column assumption would have misread.
- **Updated** `skills/task-breakdown/SKILL.md` and `skills/start/SKILL.md`'s authoring
  templates to match.
- **New spec `021`** reserved (not designed): an in-process Claude-Agent-SDK worker
  kind, additive alongside today's CLI-spawning workers.

### 2026-09-02 — scope restoration

An earlier change the same day narrowed `specloop:start` and recorded the removals in
`planning/architecture.md`'s "Declined" table, citing a `planning/product.md` clause that the
*same* change had written. Four of the project's six stated objectives were rejected on
that circular authority, and the "it becomes a spec instead" escape hatch was never
exercised — no such rows existed. Undone, and the mechanism closed:

- **Restored** the technologies/architecture/tools Q&A (now its own phase, branched by
  project type, writing a decision register into `planning/architecture.md` and the
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
- **Added** the styles/preferences phase and `planning/styles.md`.
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

### 014 — worker-context-injection

Closes the gap the scope restoration left open: objectives 5 and 6 were captured but
never reached the agent doing the work.

- The worker prompt is now a briefing. It names the task and its spec, the spec's
  `requirements.md`/`design.md`, and the `contextFiles` that actually exist on disk —
  filtered at prompt-build time, since a project can gain `planning/styles.md` between runs.
  Previously it was `Work on this task: <table cell>`, with the spec itself dropped at
  every call site, so a worker could not read what it was implementing and learned the
  project's stack only by accident (`claude` auto-loading `CLAUDE.md` from the inherited
  cwd; `codex`/`opencode` got nothing).
- `SpecRef` moved to `roadmap.ts` — `worker.ts` needed it and was importing it from
  `splitPane/`, inverting the layering.

Two bugs found by the live run, not by inspection:

- **Logs collided across specs.** `none` split-mode wrote `T1.log`; every spec has a
  `T1`, so each spec silently overwrote the previous one's logs. The split-pane path
  already prefixed with the spec id. Fixable only once the spec was threaded through.
- **A malformed `loop.config.json` was undiagnosable** — a bare `SyntaxError` with a
  byte offset and a stack trace into the orchestrator. Now names the file and the
  likely Windows cause, preserving `cause`.

### 015 — roadmap-status-writer (partial)

Later additions, both found while migrating this repo's own tables:

- **Rows now split on unescaped pipes only**, and cells are unescaped;
  `sanitizeCell` escapes idempotently instead of substituting `/`. Two task rows here
  describe the `ID | Task | Status | Notes` contract in their own text — one escaped,
  one not — and the naive splitter shredded both. This reverses a decision recorded in
  015's design; real content contains pipes, and markdown already defines the escape.
- **A row whose status cell isn't a real status is now rejected with a warning.**
  Returning it was the dangerous option: the bogus status is neither `done` nor
  runnable, so the loop skipped the task while the spec could never roll up to `done`.

### Testing

- `scripts/check-skill-consistency.mjs` — 38 static cross-reference checks over the
  four skills and the question bank: template agreement, objective coverage,
  owned-file scope, no-phantom-writer, question-bank completeness. Verified it actually
  fails by re-introducing the `design-closing` header bug and by deleting the styles
  phase. This is the mechanically-checkable half of the four `interrupted` local tests.
- Orchestrator end-to-end run against a fixture repo with a stub worker CLI: 17
  behaviours verified, including that the loop now **advances from one spec to the next**
  on its own — previously impossible. See `014`'s `tasks.md`.
- All 18 specs / 114 task rows migrated to the 5-column `Owner` layout and re-parsed
  with zero warnings.

**Still unverified, and human-only:** the live interactive interview. An agent running
it would be inventing the user's project goals and preferences and then validating its
own fabrications. What it must establish is behavioural — whether the 8-phase flow is
bearable, whether the closing sweep converges or nags. See `001` T30/T31 and `006` T10.

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
  `CLAUDE.md` + `planning/{product,architecture,roadmap}.md` + `.specloop/`; the full
  interview (project type → vision → technologies/architecture/tools → skill
  recommendation → styles) under the coverage contract; roadmap seeding from the
  recorded answers; per-spec `requirements.md` Q&A with idempotent re-entry. Does not
  scaffold `README.md`/`CONTRIBUTING.md`/`LICENSE`/CI config — those are project
  deliverables the roadmap decides (see `planning/architecture.md`'s "Declined" table).
  Still `in_progress`: the end-to-end local test needs re-running against the new
  interview shape (`T29`).

## Format

- Group by spec ID, not by individual commit or PR.
- State what shipped, not implementation detail — that lives in the spec's
  `design.md`/`tasks.md` notes.
- A spec only gets an entry once every task in its `tasks.md` is `done` (an
  `interrupted` local-test task still blocks the entry — see each spec's open
  tasks in `planning/roadmap.md`).
