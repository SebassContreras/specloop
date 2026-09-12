# Handoff — 2026-09-12

Supersedes the 2026-09-11 handoff below on the one point that changed: **the
deterministic `loop run` CLI is gone.** Everything else in that handoff (the
split-pane history, the quota-exhaustion history, the general "don't resurrect
X" traps) still holds and is kept below for context. Branch: `main`.

**This file is not the source of truth and must not become one.** `planning/roadmap.md`
owns order and status; each spec's `tasks.md` owns the work.

## Next, picking this back up

No `todo` spec has a populated `tasks.md` right now, so `/specloop:loop` has
nothing to run. By `Priority`, the next candidate is **`018`
(project-style-preferences)** — needs `/specloop:design-closing` then
`/specloop:task-breakdown` before it's loop-runnable. `009` and `012` are
next after it, same story (`requirements` stage, undesigned). `025`
(deferred, unranked) sits behind all three until someone gives it a
`Priority`. `019` (public-showcase) is `in_progress` but everything left in
it is `[human]` (screenshot/demo capture) — not blocked on any agent work.

---

## Where this landed (read this before touching `002` again)

**There is now exactly one way to run the loop: `specloop:loop`, an
interactive skill run inside a chat session.** The previous handoff described
"two ways to actually run the loop, doing genuinely different jobs — don't
collapse them back into one." That guidance is reversed: the user's actual,
restated intent is that the loop is *always* orchestrated by a live agent
session — never a standalone script or CLI — and that session is not
Claude-specific, it holds under any compatible harness (Claude Code, OpenCode,
Codex CLI, or another).

What changed, concretely:

- **`framework/orchestrator/` is deleted** — all of it: `cli.ts`, `worker.ts`,
  `roadmap.ts`, `tasks.ts`, `checklist.ts`, `mdTable.ts`, `config.ts`,
  `safeStop.ts`, `taskLock.ts`, `security.ts`, `package.json`, the lockfile.
  `loop run` / `loop stop` / `loop status` no longer exist.
- **`skills/loop/SKILL.md` rewritten to be fully self-contained.** It used to
  point at the deleted `.ts` files ("read `roadmap.ts`'s `pickNextSpec` if
  ambiguous") — there's nothing left to point at, so the eligibility rule,
  the `tasks.md` checkbox grammar, the status-rollup rule, and the
  worker-prompt shape (spec dir + `requirements.md`/`design.md` +
  `contextFiles` + `language`, ported from `worker.ts`'s `promptFor()`) are
  now written out directly in the skill's own text. It's the source of
  truth now, not a summary of code.
- **`skills/loop-setup/SKILL.md` simplified.** It used to copy
  `framework/orchestrator/` into the target repo and run `<manager> install
  && <manager> link --global`. All of that is gone — there's no package to
  copy or install. What's left is exactly the Q&A (`workers`, `logDir`,
  `contextFiles`) and writing `.specloop/loop.config.json`. Kept as its own
  separate, deliberately-invoked skill rather than folded into
  `specloop:start` — still a real decision worth its own moment, even
  without an install step.
- **Six dependent specs retired**, never past `requirements.md` (all
  `todo`, no design or tasks): `007` (orchestrator-unit-tests), `008`
  (ci-pipeline), `010` (loop-auto-continue), `011` (windows-path-safety),
  `013` (task-retry-backoff), `021` (harness-worker-backend). All six existed
  only for the deleted deterministic CLI. Folders deleted, rows removed from
  `planning/roadmap.md` — nothing was ever built against them, so nothing
  was lost. `git log` has the full history if anyone needs to see what they
  used to say.
- **`015` (roadmap-status-writer) flipped to `done`.** Its last three open
  tasks (`T014`, `T019`, `T020`) were specifically about giving the
  deterministic CLI a test suite / `Priority` tiebreak / `Stage` writer —
  `skills/loop` already does the latter two itself, and `T014` depended on
  the now-deleted `007`. Removed rather than left `todo` forever pointing at
  code that no longer exists.
- **`019` (public-showcase)**: `.github/assets/demo-loop.tape` (T001) demoed
  `loop status`/`loop run` in a terminal — deleted along with the CLI it
  demoed. `T005` (run `vhs demo-loop.tape` to produce the GIF/PNGs) is now
  moot as written. A real demo of the interactive skill (a chat transcript or
  recording, not a VHS terminal tape) is a fresh piece of content work, not
  something to improvise here — see `019`'s own files for whoever picks that
  spec back up.
- **Docs swept**: `planning/architecture.md` (Container/Plugin-components/
  Fixed rules/Declined table), root `README.md` (demo section, Quickstart,
  repo-layout list), `CONTRIBUTING.md`, `SECURITY.md`,
  `.github/PULL_REQUEST_TEMPLATE.md`, `CHANGELOG.md`'s `002` entry,
  `planning/fix/README.md`, `CLAUDE.md`'s current-state paragraph. Specs that
  only mention `loop run`/`framework/orchestrator` as historical record of
  already-`done` work (`001`, `005`, `006`, `017`, `020`, `022`, `023`) were
  deliberately left alone — same treatment the split-pane reversal notes
  already got: rewriting history there would lose the record, not clean
  anything up.

**Why this happened**, in short: `002` T026 (previous session) added
`skills/loop` alongside the deterministic CLI, reasoning both served
genuinely different needs (unattended/CI vs. an attended chat). The user
revisited that framing this session and corrected it — the CLI was never
supposed to be a permanent parallel path, and keeping both meant every rule
(eligibility, grammar, rollup, prompt shape) had to be kept in sync between
code and skill text by hand, which is exactly the kind of drift this repo's
own Fixed rules warn about ("a change to a cross-cutting mechanism must be
reflected everywhere it's documented or checked"). One master, one place the
rules live, is simpler and was the actual original intent.

---

## Traps

- **Don't resurrect a standalone script/CLI for running the loop, in any
  language.** This was tried twice now (the original `framework/
  orchestrator/`, and briefly reconsidering it during this same session)
  and reversed both times for the same reason: the master is a chat session,
  by design, not a process that can be scripted around. See
  `planning/architecture.md`'s Declined table.
- **Don't resurrect `splitMode`/`splitPane/` or `quota.ts`/
  `promptForWorkerSwitch`.** Both existed, both worked, both were
  deliberately reverted before the CLI itself was retired — not regressions
  to "fix back." `git log` has the full story if the reasoning is ever
  unclear.
- **`skills/loop/SKILL.md` and `skills/loop-setup/SKILL.md` have no code of
  their own, by design.** They read/write `roadmap.md`/`tasks.md`/
  `.specloop/loop.config.json` directly. There is no `.ts` module backing
  either one anymore — don't go looking for one, and don't add one.
- **The master is never "Claude" in the skill's own text — it's "your own
  harness."** Confirmed explicitly this session: the loop must work with
  any compatible harness, not just Claude Code, per `022`'s open-format
  rule. If a future edit to `skills/loop` slips into Claude-Code-specific
  phrasing, that's a regression to fix, not a clarification.

## `024` closed the live-verification gap — what it actually confirmed

`024-loop-skill-verification` ran live, 2026-09-12, against `test/loop-verify-fixture/`
(and a second isolated fixture, `test/loop-verify-allhuman/`) — both gitignored,
local-only. **Real worker CLIs, not a stub**: the original design planned a
stub worker CLI for determinism, but the user redirected mid-run to use real
`claude` and `opencode` (no `codex` on this machine) so we'd see what they
actually do, not simulated output. See `024`'s `tasks.md` for the full
observed-result table. Two real gaps were found in `skills/loop/SKILL.md` and
fixed the same session:

- Phase 3 never said *how* a briefing reaches a CLI subprocess — now explicit
  (`<cli> <args...> "<briefing>"`, matching the deleted `worker.ts`'s
  convention, plus a bounded timeout and no stdin).
- Phase 3/4 said "watch the output as it happens" — doesn't hold for Claude
  Code's own native sub-agent mechanism, which is asynchronous (dispatch,
  then a completion notification), not a live stream. Documented, and every
  dispatch after the fix behaved correctly under the corrected text.

Confirmed live and working: spec/task eligibility including the
lower-`Priority` tiebreak and skipping an all-`human` `todo` row even at
lower `Priority`; the `tasks.md` grammar read/write; prompt contents (task+
spec naming, requirements/design pointer, existing-only `contextFiles`,
the `language` line, do-not-touch-status instruction); status rollup to
`done` and the roadmap write; `Stage` → `looping` on first pick; the legacy
`workerCli`/`workerArgs` config shape; harness-synergy (native sub-agent used
for a `claude` worker under Claude Code, real subprocess for `opencode`);
safe stop (a real native sub-agent killed mid-flight via `TaskStop`, task
correctly marked `interrupted`, nothing else started).

## Also done 2026-09-12, after `024`: priority wording + `025` deferred

The harness-synergy rule (native sub-agent before a CLI subprocess, when the
provider matches) was always meant to be unconditional, but read as a soft
preference ("may prefer", "instructs preferring") in several places —
tightened to explicit priority language ("always uses that first, before
falling back") everywhere it's described: `skills/loop`'s own frontmatter,
`skills/loop-setup`'s Q&A (now tells the user this up front), and
`planning/architecture.md`/`002`'s `requirements.md`/`design.md`/`README.md`/
`planning/product.md`. `002`'s `design.md` also corrected to stop calling the
native path "watchable live" — `024` found it's asynchronous instead.

Also raised, during discussion of what happens if the **master** (not a
worker) runs low on its own usage: unlike a worker's exhaustion (the master
watches it from outside), the master has no reliable way to notice its own
before a call to it just fails. The mitigating fact — all loop state lives
on disk, so any fresh session under any harness can already resume via the
existing eligibility rules, no live handoff needed — means this is mostly an
*announce it proactively* problem, not a new mechanism. Filed as
**`025-master-handoff`**, requirements only, deliberately deferred (not
designed, unranked `Priority`) — see that spec for the hard constraint that
detection is best-effort at most, since no harness is known to expose a
reliable self-usage signal to the model running inside it.

## Not verified — don't claim otherwise

- **Genuine-failure → `blocked`** and **suspected quota/rate-limit → ask the
  user** were confirmed once each via a stub worker, before `024`'s run
  pivoted to real CLIs — both real workers happened to succeed at every real
  task, so neither branch got a real-CLI confirmation. Real CLIs can't be
  made to fail or hit a rate limit on demand, so this is expected to stay a
  stub-only check unless it comes up naturally in a real run someday.
- **Roadmap-level `in_progress` resume** (Phase 1: "a row already
  `in_progress`, resume that one first") was never exercised — every fixture
  spec either finished in one pass or was interrupted while its roadmap row
  was still `todo`. Correct by inspection of the skill's text, not
  live-confirmed.
- **The harness-synergy branch's exact wording under a harness other than
  Claude Code** — this session can only run Claude Code, so whether "your
  own harness's native way of spawning a sub-agent" reads correctly to an
  OpenCode or Codex CLI session is still open, same gap `022`'s own audit
  already tracks for Cursor/Codex CLI generally.
- `007`–`013`/`021`'s prior "todo" status meant literally nothing was ever
  designed against them — their retirement carries no implementation risk,
  but if anyone was relying on their `requirements.md` text for something
  else, it's now gone from the working tree (still in `git log`).
- A second self-review pass (2026-09-12, same session) cross-checked every
  roadmap row against its folder, every `Depends on` against a real ID,
  every relative link in the root/`planning/` docs, and re-read
  `skills/loop`/`skills/loop-setup` end to end for internal consistency —
  found and fixed a few things the first pass missed: `planning/product.md`
  and `skills/start/SKILL.md` still described installing/copying an
  orchestrator payload (both stable, frequently-read files — the kind of gap
  worth calling out explicitly, not just silently patching), the roadmap's
  own `Status` column note still cited the deleted `loop status` command,
  `skills/loop` never said how to handle a legacy `workerCli`/`workerArgs`
  config even though `loop-setup` promised it "still works", and
  `.github/ISSUE_TEMPLATE/bug-report.yml` (a non-`.md` file the first pass's
  grep didn't cover) still named `framework/orchestrator/`. None of this
  changes the substance of the 2026-09-12 retirement, just where it wasn't
  fully carried through yet.

---

# Handoff — 2026-09-11 (kept for the split-pane/quota history)

The first ended with `windowsTerminal` confirmed live; the second reverted
all of that and added a regex-based quota-exhaustion prompt straight into the
Node CLI. That pass reverted its own regex+prompt and put the interactive
piece in a new skill instead. All of that history — why three passes, same
day — is preserved here since it explains traps that still apply.

**Why it took three passes to get to `skills/loop` existing at all**, in
order, same day (2026-09-11):
- Pass 1 added `splitMode`/`windowsTerminal.ts`/`tmux.ts` — confirmed working
  live, then reverted anyway (`002` T023) because the user watched it and
  didn't want a visual terminal at all, at any cost.
- Pass 2 (`002` T024) added `quota.ts` (regex heuristic) + a blocking
  `readline` prompt straight in `cli.ts`, reasoning "the master always holds
  the terminal now." **That reasoning had a hole**: the user's actual intent
  was never "a Node script is the master" — it's "I open a chat, and that
  chat is the master." A plain script has no chat to ask questions in, and an
  unattended `loop run` (CI) has nobody to answer a prompt regardless of
  where it's blocking.
- Pass 3 (`002` T025/T026) reverted T024's regex+readline entirely, and put
  the interactive piece where it actually belongs — `skills/loop/SKILL.md`.
  At the time this was framed as "two ways to run the loop, both legitimate."
  The 2026-09-12 session above corrected that framing: there was only ever
  supposed to be one.

## Also done 2026-09-11, minor

A general alignment pass after the above: `CLAUDE.md`'s "current state" paragraph
was stale from *before* that whole session (still said `001` `in_progress`,
`016`/`017`/`006` unstarted) — rewritten against the actual roadmap. `CHANGELOG.md`'s
`002` entry still claimed `windowsTerminal`/`tmux` backends ship — corrected in
place. Fixed one real pre-existing bug unrelated to that day's pivot:
`loop-setup` still said "the configured `workerCli`" (singular) after the config
moved to a `workers[]` array a while ago. `scripts/check-skill-consistency.mjs`
now also loads `skills/loop/SKILL.md` so its own file references get validated.
