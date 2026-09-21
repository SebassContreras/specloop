# Handoff — 2026-09-21

## 036 closed 2026-09-21 — lean distribution implemented

`035` (`wshobson-agents-research`) completed its six research tasks and produced
`planning/specs/035-wshobson-agents-research/research.md`. It verified the upstream
architecture, registries, capability degradation, installation flows, quality gates,
and the scale-based recommendation for specloop.

`036` (`lean-distribution`) then implemented the agreed lean surface: committed
`.claude-plugin/marketplace.json`, root `install.sh` and `install.ps1`, and the
tag-triggered `.github/workflows/release-skills.yml` that builds and uploads a
deterministic `specloop-skills.tar.gz` plus SHA-256 checksum. README and
CONTRIBUTING now document marketplace, `.tar` installer, and manual-copy paths;
`.gitignore` excludes the local archive. The historical marketplace Declined row
in `planning/architecture.md` records its supersession by `036` with the user's
2026-09-21 go-ahead.

The PowerShell installer passed a controlled empty-fixture test, including nested
`status/references` and `status/scripts`, repeated-install hash equality, and
absence of `planning/`/`.github/assets`. `claude plugin validate .` passed with one
non-blocking missing marketplace-description warning. Bash execution was not
completed because the Windows Bash service returned `E_ACCESSDENIED`; GNU tar
deterministic flags were not available in Windows `tar.exe` and still need CI/Linux
verification. Global-path testing was intentionally not redirected into a fixture.

There are no branches or worktrees beyond `main`; the completed changes are being
committed on `main`. After push, create a `v0.x.y` tag and verify the GitHub Actions
release assets and the Bash installer on Linux. `019` remains `in_progress` with
human-only showcase work; no agent-runnable spec is currently next.

Supersedes 2026-09-13 on two points: **`022`** is closed (below), and **"Next, picking
this back up"** is stale — `026`, `012`, `030`, `032`, `033`, `034` and others have
shipped since; `planning/roadmap.md` and `AGENTS.md`'s current-state paragraph are the
live source for what's next. Everything below still holds except where a line says
otherwise. Branch: `main`.

## `022` closed 2026-09-19 — six harnesses verified, and what that doesn't cover

Every harness on the roster passed the spec's four audit checks. The state per harness
lives only in `README.md`'s support matrix, the evidence in `022`'s `tasks.md`. The README
also gained an install/usage section per harness, and `skills/loop-setup` a known-flags map
for their headless commands.

A same-day alignment pass then swept the skills and docs for stale harness lists and
contradictions (`README.md`, `AGENTS.md`, `planning/product.md`, `skills/{start,advance,
task-breakdown,status,loop-setup}`, the examples, `SECURITY.md`): wording that predated the
interactive loop (`orchestrator`), task ids leaked into skill text, `status`'s script-probe
list missing three harnesses' skill directories, an example `design.md` with non-canonical
headers. `scripts/check-skill-consistency.mjs` gained group `[14]` (the roster, flags map,
sample config and probe list against the matrix) and `[15]` (no `orchestrator` wording or
leaked task ids in a skill) so none of that can quietly return.

**What "verified" does not mean:**

- **`skills/loop` as master under a non-Claude harness ran once, under `agy`, and only up to
  the dispatch** (2026-09-19, throwaway fixture). The audits covered skill discovery,
  auto-trigger, `when_to_use` tolerance and the `start` interview's opening phase; the `agy`
  run then showed it reading the skill, config, roadmap and tasks, writing `Stage: looping` and
  `in_progress`, and dispatching its native sub-agent (`invoke_subagent`) with the loop's
  briefing — the task completed once an allow rule was in place. Its master turn then ended
  (headless `-p`), and both continuation turns hit the account's quota (HTTP 429, about 7 days),
  so verify, log and roll-up were never observed. Codex CLI, Copilot CLI and Cursor as masters:
  still never run.
- **Worker-style subprocess check** (the loop's `<cli> <args> "<briefing>"` form, one
  create-a-file task): `copilot` and `cursor-agent` wrote the file; `agy` exited 0 with
  nothing written — its headless mode auto-denied the shell command the agent used. With
  `permissions.allow` = `command(regex:...)` in `~/.gemini/antigravity-cli/settings.json` the
  same task wrote the file, so allow rules *are* honored in headless mode (agy 1.2.7, Windows),
  contrary to google-antigravity/antigravity-cli #548; a plain `command(<text>)` matches only
  the whole command. Without rules a sub-agent died at its first denied command and the
  master's next response degenerated into a repeated token. `--dangerously-skip-permissions`
  works but let the agent read outside the fixture in the audit. `agy`'s entry in this repo's
  own `.specloop/loop.config.json` uses a `{repoRoot}` placeholder that `skills/loop` replaces
  with the repo's absolute path (decided 2026-09-19). The substitution itself was not
  exercised: `agy` has a native sub-agent, so the loop never took the subprocess path — only
  the substituted command form (absolute `--add-dir`) was, and it worked. `copilot`,
  `cursor-agent` and `agy` were added to the config by hand.
- The `claude`, `codex` and `opencode` subprocess forms were not re-run today.

## Judgement calls found in that pass — all resolved 2026-09-19

Each picked between two things the user had stated, or edited a Fixed rule, so each was put
to the user one by one:

1. **Resolved 2026-09-19 — roadmap "carries no other content"** (Fixed rule, `015`).
   `skills/start` Phase 6 no longer writes a `## How this gets built` section (it gives that
   walkthrough in chat), and the retired-specs paragraph left `planning/roadmap.md` (it lives
   in the section further down and in `AGENTS.md`). `001`'s requirements and design carry an
   amendment note.
2. **Resolved 2026-09-19 — loop status roll-up.** `interrupted` is now a task state only (a
   stopped spec stays `in_progress`; the dead roll-up bullet and the spec-level legend entries
   are gone). `skills/loop` Phase 1 names every `blocked` spec and, if the user says the cause
   is fixed, resets its blocked tasks to `todo` and the row to `in_progress`. Drift rule 5
   (`stuck-task-but-status-not-blocked`) now fires only when a task is blocked and nothing
   else is left to run.
3. **Resolved 2026-09-19 — `architecture.md` Fixed rules** (user's go-ahead in the same
   conversation). `Stage` no longer says "exactly once" and names `advance` and `amend` as
   writers; `Status` says "exactly one writer once a row exists" (`start` only creates
   rows); and the harness-context rules say every harness in the matrix reads `AGENTS.md`,
   with the "works for `claude` only" sentence replaced by what the audits showed. The
   rule they support (project context goes through the worker's prompt) still stands.
4. **Resolved 2026-09-19 — `agy` in the tracked config.** Included, with `{repoRoot}` in place
   of a machine-specific path; `skills/loop` (Phase 3, subprocess form) and
   `skills/loop-setup`'s known-flags map define it, `check-skill-consistency` group `[15]`
   fails if a config uses the placeholder and `skills/loop` doesn't. The substitution was not
   exercised live (see the worker-check bullet above).

---

*Everything below is 2026-09-13 and earlier. It supersedes 2026-09-12 on three points —
`018` and `009` are `done`, and `026` was filed then (built since) — and still holds except
where a line says otherwise.*

## Repo-wide alignment pass, 2026-09-13

Every time something shipped today, swept the rest of the repo for the same
"reflected everywhere" gap the Fixed rules warn about, rather than assuming one
edit was enough:

- `planning/architecture.md`'s Plugin components gained the Status Skill entry
  it was missing; `planning/product.md` gained a line for the "available any
  time" status skill.
- `README.md`'s Quickstart, `.github/ISSUE_TEMPLATE/bug-report.yml`'s dropdown,
  and `SECURITY.md` (the new `dashboard.html`/`<script>`-injection attack
  surface, and why it's escaped) all updated for `specloop:status` existing.
- `CHANGELOG.md` gained the `009` (partial — `T012` still open) and `018`
  entries it was missing; also found (not fixed) a pre-existing gap: `016`/
  `017`/`022` are `done` with no entry either, predates today, left alone.
- `CLAUDE.md`'s current-state paragraph updated three times as work landed
  (`018` done → `009` done → `026` filed), not just once at the end.
- `planning/roadmap.md`'s own `Status` column note still cited `loop status`
  as a gap `009` "would" fill — now says it does.
- Decided and recorded: `planning/dashboard.html` is committed on purpose (not
  gitignored like `test/`/`.specloop/`) — it's this repo's live example/demo
  material, candidate content for `019`'s README showcase work, not per-run
  throwaway state. See `architecture.md`'s Fixed rules for the exact carve-out.

## `009` closed 2026-09-13 — designed, built, and live-verified in one session

Reformulated first (user request, mid-session): the original plain-text-only
`specloop:status` gained a static, self-contained HTML dashboard
(`planning/dashboard.html`) — deliberately **not** auto-refreshing or
server-backed, since this project has twice already reverted a standing
background process for a visual affordance (split-pane terminal, the standalone
loop CLI). Went through `design-closing` (fixed template in
`skills/status/references/template.html`, separate from `SKILL.md`, same pattern
as `question-bank.md`) and `task-breakdown` (12 tasks) normally, then ran
`specloop:loop` on it for real, in this repo, against its own backlog — required
first running `specloop:loop-setup` here for the first time ever (this repo never
had its own `.specloop/loop.config.json`, since it was never scaffolded by its own
`specloop:start`; only `claude -p` configured, `contextFiles: ["planning/
architecture.md"]` since `AGENTS.md`/`planning/styles.md` don't exist for this repo
either, same underlying reason).

Built `skills/status/SKILL.md` (Phase 0-5: read roadmap+tasks like `skills/loop`
does, compute summary/next-actions, detect `Stage`/`Status` drift — including the
exact `fix/002` scenario as one of five concrete rules, print the chat summary,
read `planning/fix/`, substitute into the template and write the dashboard) and
`skills/status/references/template.html` (self-contained HTML/CSS/JS, light+dark,
status color-coding, click-to-expand roadmap/fix-log drill-downs, a
warning-styled drift banner shown only when drift exists). Every task dispatched
to a native Claude Code sub-agent (harness-synergy, same as `024`) and verified
against the actual file on disk afterward, not just the worker's own report.

Live-verified end-to-end against `test/status-verify-fixture/` (7 specs
deliberately covering all 5 drift rules + one clean baseline, one fix-log entry,
no `.specloop/loop.config.json`): ran the skill twice, second run after mutating
the fixture, confirmed the dashboard fully regenerates with no stale data (AC3)
and both runs succeed without any loop config existing (AC4). Browser automation
wasn't available in this environment, so AC2 (visual distinction + drift warning)
was verified programmatically instead — extracted and read the generated
dashboard's actual renderer JS and CSS rather than a screenshot. **`T012`
(open the dashboard in a real browser, confirm it actually renders/expands
correctly) is `[human]` and still `todo`** — genuinely needs a person with a
browser, not skipped out of laziness. Spec rolled up to `done` regardless, since a
remaining `[human]` task doesn't hold a spec open, per `skills/loop`'s own rule.

**This file is not the source of truth and must not become one.** `planning/roadmap.md`
owns order and status; each spec's `tasks.md` owns the work.

## `018` closed 2026-09-13 — turned out to be already built, just unverified

Opening `018`'s design-closing session surfaced that its three parts (capture,
storage, delivery of style preferences) were **already fully implemented** —
`001` T024/T025 wrote the Phase D question-bank + `skills/start`'s Phase 5 styles
Q&A, and `014` already delivers any `contextFiles` entry (including
`planning/styles.md`) into a worker's prompt. Nobody had traced the finished work
back to close `018`'s own roadmap row. Given that, skipped `design-closing`'s
normal Q&A/`task-breakdown` and instead **live-verified the existing chain
end-to-end under a real non-Claude-Code harness** (OpenCode) — see `018`'s own
`tasks.md` T001 for the full run. Confirmed genuinely working: the Phase 5
interview (all 10 dimensions, `help-me-decide` with real web search for
`palette`/`typography`, `preference-strength` asked and recorded), `planning/
styles.md` + `AGENTS.md`'s Style section written correctly, and — the part `018`
existed to prove — a real worker (OpenCode's native sub-agent) received
`planning/styles.md` in its prompt and produced a component that genuinely
honored every hard rule in it (exact color tokens, correct fonts/fallback,
computed contrast ratios, accessible markup).

Two real, unrelated gaps surfaced along the way and were fixed the same session
(not this spec's own bugs, but found by its verification — same pattern as `024`):

- **`planning/fix/001-language-field-format`**: `.specloop/loop.config.json`'s
  `language` field had no specified format — one fixture wrote `"Spanish"`,
  another wrote `"es"`. Researched the actual industry standard (BCP 47 / ISO
  639-1 lowercase codes) rather than guessing, fixed `skills/start/SKILL.md`'s
  Phase 6, and added a general `planning/architecture.md` Fixed rule: any future
  coded field a skill writes uses its standard body's format, not a spelled-out
  label, and every scaffolded file is UTF-8 without a BOM.
- **`planning/fix/002-stage-not-reset-on-done`**: `skills/loop`'s Phase 2 roll-up
  wrote `Status: done` but left `Stage` at `looping` — contradicts
  `architecture.md`'s own "`—` once `done`" rule. Fixed: the roll-up step now
  resets `Stage` to `—` in the same edit whenever it writes `done`.

Also corrected `018`'s own `requirements.md` AC #2, which was wrong as written:
a no-visual-surface project still gets `planning/styles.md` (for `tone`/
`code-conventions`/`anti-preferences`), it just skips the *visual* dimensions —
confirmed against a real prior fixture (`test/architecture-absent-fixture`)
rather than guessed.

The verification fixture (`style-verify-fixture/`) lives **outside** this repo
entirely, with its own `.git` — same reason `022` T003's OpenCode audit moved
its fixture out: a fixture nested in `specloop/test/` without its own `.git`
lets a harness's directory walk-up read *this* repo's own `AGENTS.md`/`planning/`
instead of the fixture's. Not committed anywhere; purely local.

## `026` filed and design-closed same day — real output drove real feedback

After publishing this repo's own dogfooded `dashboard.html` (see above) and
actually looking at it, the user asked for visual/informational additions —
progress bars (overall + per-spec, segmented by status proportion), richer
per-task badges (ID/owner/status, plus the spec's own `Priority` shown near its
task list), a KPI strip, clickable `dependsOn` badges, a "next eligible"
highlight (reusing `skills/status` Phase 1.1's existing eligibility calc, not a
second one), and client-side filter/search. Filed as its own spec, **`026`**,
rather than reopening `009` — `009`'s own acceptance criteria are still fully
met as shipped; this is new scope, not a fix. Went through a real (if brisk)
`design-closing` pass: settled that `dependsOn` becomes a list and a new
`nextEligible` boolean gets added to the existing JSON contract (extend, not a
second data structure), and that per-spec/repo-wide task counts move
server-side into the JSON too. `Stage: design_closed`, `Priority: 11` (ahead of
`012`'s `13`). Not yet task-broken or built.

## Next, picking this back up

> Superseded 2026-09-19: `026`, `012`, `030`, `032`, `033`, `034` and others have shipped
> since. Read `planning/roadmap.md` for what's next; this section is the 2026-09-13 record.

No `todo` spec has a populated `tasks.md` right now, so `/specloop:loop` has
nothing to run. By `Priority`, the next candidate is **`026`
(dashboard-visual-enhancements)** — design already closed, needs
`/specloop:task-breakdown` next. `012` (spec-amend-skill) is next after it,
`requirements` stage, still fully undesigned. `025` (deferred, unranked) sits
behind both until someone gives it a `Priority`. `019` (public-showcase) is
`in_progress` but everything left in it is `[human]` (screenshot/demo capture)
— not blocked on any agent work. `009`'s own `[human]` task (`T012`, open
`planning/dashboard.html` in a real browser) is still open too, unrelated to
what's "next" in `Priority` order.

This repo now has its own `.specloop/loop.config.json` (worker `claude -p`,
`contextFiles: ["planning/architecture.md"]`) — written this session, since it
never existed before. `specloop:loop` can run directly on this repo's own
backlog from here on, same as any target repo.

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
  own harness's native way of spawning a sub-agent" reads correctly to a
  session under any other harness is still open. `022`'s audits (closed
  2026-09-19) covered skill loading and the interview under five non-Claude
  harnesses, not the loop as master — see the `022` section at the top.
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

The 2026-09-11 history that used to be kept here in full (three passes in one
day to get to `skills/loop` existing: a live split-pane terminal built,
confirmed working, then rejected on sight; a regex-based quota heuristic that
followed, then itself reverted once "the master" was correctly understood as a
chat session, not a script) is preserved in exactly one place now:
`002-loop-orchestrator/design.md`'s `## No split panes` and `## Quota
exhaustion` sections. See `planning/architecture.md`'s Declined table for the
one-line index entry.
