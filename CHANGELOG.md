# Changelog

`planning/roadmap.md` owns direction, status, and dependencies between specs. This file
owns what has actually shipped, in delivery order — one entry per spec once its
`tasks.md` is fully `done`, not one entry per commit.

No version has been tagged/released yet (see `.claude-plugin/plugin.json`'s
`0.1.0`) — everything below is `Unreleased`. Add a dated section here once a
version is actually tagged.

## Unreleased

> Pre-existing gap, not from this session: `016`/`017` are `done` in
> `planning/roadmap.md` but have no entry below — left as-is rather than backfilled
> here, since auditing/writing two unrelated historical entries is out of scope
> for today's changes.

### 022 — cross-agent-skill-compat

Every harness on the spec's roster — six agent CLIs — passed the same four audit
checks: skills are discovered, a plain-language request activates the right one
without naming it, the `when_to_use` frontmatter key is tolerated, and `start`'s
interview holds one question per turn while writing each answer to disk first
(audited through its opening phase). Runs were agent-driven and non-interactive,
except OpenCode's (a live session), in isolated fixtures with their own `.git`;
the evidence per harness is in the spec's `tasks.md`. `README.md` gains an install
and usage section per harness and a support matrix — the only place per-harness
state is listed, including what "verified" does not cover (`start`'s later phases,
`advance`, and `skills/loop` as the master outside Claude Code). `skills/start`'s
helper-skills step no longer hardcodes Claude Code, `skills/loop-setup` carries a
known-flags map so a known CLI's headless flags are never asked for, and
`skills/status` finds its script under any of the six harnesses' skill
directories. A worker-style check of the loop's subprocess form (one create-a-file
task) passed for Copilot CLI and Cursor; Antigravity CLI's headless mode soft-denies
shell commands and wrote nothing until allow rules were added to its settings (then it
passed too), so it is documented as needing that setup.
`scripts/check-skill-consistency.mjs` gained two groups that keep the roster,
the flags map, the probe list and the skills' wording aligned.

### 033 — interview-to-loop-auto-continuation (partial)

`specloop:advance` (`skills/advance/SKILL.md`) — chains `specloop:design-closing`
then `specloop:task-breakdown` per spec, for every spec still short of
`tasks_ready`. Derives their Q&A/draft-task answers from what the interview
already established (`.specloop/interview.md`, `requirements.md`,
`planning/architecture.md`) instead of re-asking, shows the real draft (design
or task list) with a yes/changes/defer choice, and asks live only when a
question genuinely can't be inferred — concrete derivability criteria,
calibrated against `029` (a real unresolved hard constraint) and `028` (a
fully-specified spec needing no live question). Re-runnable via the existing
`Stage` column alone, no new state. `specloop:start`'s Phase 8 now auto-chains
into it after reporting, instead of only naming `design-closing`/
`task-breakdown` as manual next steps; `specloop:loop-setup`/`specloop:loop`
stay untouched, manual, deliberate steps. `design-closing`'s Phase 3 gains a
one-line exception noting `specloop:advance` is the one caller allowed to
chain past its stop; `design-closing`/`task-breakdown` themselves are
otherwise unchanged and still directly invocable. **Partial**: `T013` (a local
end-to-end test against a real multi-spec fixture) is `[human]` and still
`todo` — everything `[agent]`-owned is done and the roadmap row is `done` (a
`[human]` task doesn't hold a spec open), but this entry should be revisited
once that test actually runs.

### 030 — dashboard-build-script

`skills/status/scripts/build_dashboard.py` — a stdlib-only Python script that
becomes the sole implementation of `skills/status`'s mechanical work
(previously `SKILL.md`'s Phase 0-5 prose): reads `planning/roadmap.md` and
every spec's `tasks.md`, computes task counts/eligibility, detects the five
`Stage`/`Status` drift rules, reads `planning/fix/`, assembles the JSON,
escapes `</script`, and writes `planning/dashboard.html` — deterministic
(byte-identical output across runs on unchanged input), UTF-8 no BOM.
`skills/status/SKILL.md` rewritten to 4 phases: run the script, read back its
JSON output, print the same 5-section chat summary derived only from that
JSON, report the dashboard path — no re-parsing of `roadmap.md`/`tasks.md`
anywhere. `skills/status/references/template.html`'s duplicate JSON-schema
comment reduced to a pointer at the script. First and only plugin skill with
an external runtime dependency (Python 3, standard library only, no `pip
install`) — a missing `python3` on `PATH` fails loudly with a clear message,
no prose fallback.

### 012 — spec-amend-skill

`specloop:amend` (`skills/amend/SKILL.md`) — the first supported way to revise a
spec's `requirements.md` or reopen its closed `design.md` after `task-breakdown`
has already run. Refuses outright if any task in the spec's `tasks.md` is
`[status:in_progress]` (points at safe-stop instead), and requires an explicit
confirm before touching anything — a higher bar than the forward-only skills,
which only ever write into a stub. A requirements revision re-asks only the
dimensions the user names, reusing `specloop:start`'s Phase 7 question text by
reference and rewriting only that section; a design reopen reuses
`specloop:design-closing`'s Phase 1 five questions the same way and writes
`requirements` into the spec's roadmap `Stage` cell (only that cell) so
`design-closing` re-closes it before `task-breakdown`/`loop` touch the spec
again. Either change flags an already-populated `tasks.md` as possibly stale
and offers `specloop:task-breakdown` — never auto-triggered. Never auto-invoked
by another skill or the loop. Live-verified against a throwaway two-spec
fixture (`test/amend-verify-fixture/`): in_progress refusal, confirm-step
decline (nothing written), a single-dimension requirements revision (only
`## Hard constraints` changed, every other section byte-identical), a design
reopen (`## Sequencing` changed, `Stage` written), and the resulting staleness
flag on a populated `tasks.md`. No gaps found in `skills/amend/SKILL.md` during
verification — no fix-forward needed.

### 026 — dashboard-visual-enhancements

Extends `009`'s dashboard (`skills/status/SKILL.md` + `references/template.html`,
no new files): overall and per-spec segmented progress bars, richer per-task
badges (ID/owner/status) plus a per-spec Priority badge, a KPI strip
(specs-by-status, overall % done, drift count), clickable `dependsOn` badges
that jump to/highlight the referenced spec's row, a persistent "next eligible"
row highlight, and client-side text/status filter/search — all self-contained,
no new dependency. The JSON contract grew accordingly: `dependsOn` is now a
parsed list of spec-ID strings (was a display string), plus new `nextEligible`
(boolean) and per-spec/repo-wide `counts`/`totals` fields. Live-verified by
regenerating `planning/dashboard.html` against this repo's own real data (21
specs, 213 tasks, 6 fix entries) — all 7 items confirmed present/wired, `009`'s
original behavior (roadmap table, drill-down, drift banner, fix-log panel,
theming) unbroken. One style-hard-rule violation was caught, reverted, and
redone during the build (a worker invented a new color-token family for the
"next eligible" highlight instead of reusing `--link`).

### 009 — status-dashboard-skill (partial)

`specloop:status` — read-only, works standalone (no dependency on
`.specloop/loop.config.json`). Reports active spec(s), task counts, `blocked`/
`interrupted` rows, next-suggested-action per spec, and `Stage`/`Status` drift
against a spec's own files, as a chat summary — and writes a static,
self-contained `planning/dashboard.html` (`skills/status/references/template.html`),
regenerated fully every run, deliberately not server-backed or auto-refreshing.
Live-verified against a 7-spec fixture covering all five drift rules. **Partial**:
`T012` (open the generated dashboard in a real browser and confirm it renders) is
`[human]` and still `todo` — everything `[agent]`-owned is done and the roadmap
row is `done` (a `[human]` task doesn't hold a spec open), but this entry should
be revisited once that check actually happens.

### 018 — project-style-preferences

Closed without new implementation: its three parts (styles/preferences capture,
`planning/styles.md` + `AGENTS.md` storage, delivery via `014`'s `contextFiles`)
turned out to already exist from `001`'s scope-restoration and `014` — nobody had
traced the finished work back to close this spec's own roadmap row. Live-verified
the full chain end-to-end under OpenCode instead of a fresh design/build pass,
including a real worker producing a component that genuinely honored every style
hard-rule it was handed. Also corrected `requirements.md`'s AC #2 (a
no-visual-surface project still gets `planning/styles.md`, for `tone`/
`code-conventions`/`anti-preferences` — it only skips the visual dimensions).

### 024 — loop-skill-verification

Live-verified `skills/loop`/`skills/loop-setup` end to end against a throwaway
fixture, using real `claude` and `opencode` workers rather than a stub, since
there's no code left backing those skills to unit-test. Confirmed: spec/task
eligibility (including the lower-`Priority` tiebreak and skipping an
all-`human` `todo` row), the `tasks.md` grammar, prompt contents, status
rollup, `Stage` writes, the legacy `workerCli`/`workerArgs` config shape,
harness-synergy (native sub-agent for a matching-provider worker, real
subprocess otherwise), and safe stop (a real sub-agent killed mid-flight,
correctly marked `interrupted`). Found and fixed two real gaps in
`skills/loop/SKILL.md`'s Phase 3: it never said how a briefing reaches a CLI
subprocess (now explicit), and it assumed a live stream where Claude Code's
own native sub-agent mechanism is actually asynchronous (dispatch, then a
completion notification). See `024`'s `tasks.md` for the full table and what
stayed unverified (genuine-failure/quota-suspicion with a real CLI, a
roadmap-level `in_progress` resume).

### 023 — fix-log

`planning/fix/` — a flat, hand-authored log for anything a developer finds wrong
after the fact, naming which spec (`Scope`) generated it and what changed. Not
loop-runnable, not roadmap-tracked — deliberately lighter-weight than a spec, since a
one-paragraph correction doesn't need a requirements/design/tasks pipeline. (Its
entry shape, and hand-authoring itself, were superseded by `027`, below.)

### 027 — fix-log-skill-and-status

Two changes to `023`'s fix log: entries went from one folder per entry
(`NNN-name/report.md`) to one flat file (`planning/fix/NNN-name.md`), and every
entry now carries an explicit `## Status` (`open`/`in_progress`/`resolved`/
`wontfix`) instead of the implicit `"Not yet fixed"` string inside `## Fix`. Added
`specloop:fix` (`skills/fix/`) — and made it the *only* supported way to add an
entry: `planning/fix/README.md` is deleted, hand-authoring is dropped, and the
template now lives solely inside the skill (matching how a spec file is never
hand-started either). `skills/status`'s dashboard now reads and shows `status` per
entry. Still not loop-runnable, still not roadmap-tracked — `023`'s hard constraint
is unchanged.

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
  kind, additive alongside today's CLI-spawning workers. (Retired 2026-09-12
  alongside the deterministic CLI it targeted — see the `002` entry above.)

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
- **002 — loop-orchestrator**: `skills/loop/SKILL.md` — the loop runs as a chat
  session, which *is* the master: reads `planning/roadmap.md`/a spec's
  `tasks.md` directly and works through every eligible spec in turn (or just
  one, if named), always launching tasks through its own matched provider —
  never round-robinning across other configured ones — preferring its own
  harness's native sub-agent tool when available. Independent tasks in a
  batch run as parallel sub-agents; anything sharing a file, or unclear, runs
  one at a time. The user can also explicitly send a different spec/task to a
  different configured provider to run alongside the master's own work. Asks
  the user which provider to fall back to on a suspected usage-limit hit — no
  fixed pattern-match, real judgement. `skills/loop-setup/SKILL.md` is the
  one-time Q&A that writes `.specloop/loop.config.json`. Safe stop is just
  telling the session to stop, in the same conversation — flips every
  in-progress task to `interrupted`. (An earlier deterministic Node/TypeScript
  CLI, `loop run`/`loop stop`/`loop status`, and before that a
  `windowsTerminal`/`tmux` split-pane mode, were both built, confirmed
  working, and deliberately removed — never shipped in a tagged release, not
  listed here.)
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
