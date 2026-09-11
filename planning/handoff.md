# Handoff — 2026-09-11

Written after closing `001`, `002`, `003`, `004`, `016`, `017` and most of `006` in one
long session, all via live runs (OpenCode + a real interactive PowerShell), not just
static checks. Branch: `main`.

**This file is not the source of truth and must not become one.** `planning/roadmap.md`
owns order and status; each spec's `tasks.md` owns the work. What's below is only the
part *not* on record: why things are the way they are, which traps to avoid, and where
judgement is still needed.

To see what's actually open:

```bash
node scripts/check-skill-consistency.mjs        # 54 static checks over the skills
cd framework/orchestrator && pnpm exec tsc --noEmit && pnpm exec eslint src
grep -rnE "\[status:(todo|in_progress|blocked|interrupted)\]" planning/specs/*/tasks.md
```

---

## What just happened

Starting point: `001` T033 (a Phase E coverage gap — `dependencies`/`owner-split`
never asked) was the one open item. From there, one thing kept leading to the next:

1. **`001` T033** — fixed (`dependencies` now asked from Phase 7 step 2 regardless of
   whether the spec was newly created or Phase-6-seeded; `owner-split` added).
   Verified live under OpenCode against `test/ops-onboarding-repo/` spec `002`.
   `001` closed (T8 was also just a stale checkbox — already superseded by T30).
2. **`016` (interview-engine)** — closed the design, and added real new scope the
   user asked for mid-session: the **help-me-decide protocol** (answering "no sé" on
   a researchable dimension gets 3–5 web-researched options; on a non-researchable
   one gets a narrower question instead). Verified live in a fresh throwaway fixture
   (`test/choice-protocol-fixture/`) — both branches confirmed, including a real web
   search.
3. **`017`** — closed the last open item: a live run against a repo with
   `planning/architecture.md` *completely absent* (not just header-only). Both
   `design-closing` and `task-breakdown` tolerated it correctly; `design-closing`
   even created the file gracefully mid-run. Filed `004` T13 as a small follow-up —
   it used improvised headers instead of `start`'s type-keyed template.
4. **`006` T010 — the big one.** Ran the full live pipeline (`start` →
   `design-closing` → `task-breakdown` → `loop-setup` → `loop run`, real `claude -p`
   worker) against `test/architecture-absent-fixture/`. Found and fixed a real bug:
   `pickNextSpec` picked the first `todo` roadmap row regardless of whether it had
   any tasks yet, so an unstarted spec sitting first in row order blocked a
   ready one forever. Also found `loop-setup` hardcoding `pnpm` (which silently fell
   back to `npm` when `pnpm link --global` failed) — now asks/reads the manager.
   Flipped `002`/`003`/`004`'s local-test tasks to done, pointing here.
5. **`002` T21** — a task killed externally (not via clean `safeStop`) stayed stuck
   `in_progress` forever. Fixed with a per-task PID registry (`taskLock.ts`).
   **First version had a real bug**, found live testing `006` T12
   (`windowsTerminal`): the recovery check ran on *every* loop iteration, so a task
   the master had just dispatched into a detached pane — before that pane registered
   its own PID — read as already-dead and got re-dispatched, every iteration,
   spawning a fresh `wt` window each time. 13 iterations, 9 real stray `cmd`
   processes, before one finally won the race. Fixed by moving the sweep to run
   **exactly once**, before the dispatch loop starts. Killed the stray processes.
6. **`004` T13** — `design-closing` now reuses `start`'s type-keyed
   `architecture.md` header template instead of improvising when it has to create
   the file from scratch.
7. **`006` T12 (partial)** — `windowsTerminal` confirmed end-to-end live, by the
   user, in a real PowerShell 7 window, after the race-condition fix: one pane
   opens, runs the task, completes cleanly. `tmux` (Mac/Linux) stays open — no such
   machine in this session.
8. **`002` T22** — the user watched the `windowsTerminal` pane and correctly
   objected: it printed "running task X" once and then went silent until the whole
   task finished — not actually watching the agent work, just a delayed final
   result. `worker.ts` used `spawnSync` with piped (buffered) stdio; replaced with
   async `spawn`, relaying each output chunk live while still capturing it for the
   `.log` file. No cost/speed change to the worker CLI call itself — purely how the
   parent process reads the same output. Verified with a fast dummy worker showing
   genuine interleaved timing.

The user's last reaction ("no me gustó del todo") was to this last fix specifically —
see **Open judgement call** below before assuming `002` T22 is the end of this thread.

---

## Open judgement call — streaming isn't fully solved

`002` T22 fixed *our own* buffering (real bug, confirmed fixed). But what the pane
actually shows beyond that depends on whether `claude -p` (headless/print mode)
streams its own output token-by-token or only writes once when its response is
ready — that's the CLI's own behavior, not something `runWorker`'s relay controls.
The user said the result "no me gustó del todo" right after seeing the fixed
version (one summary line appearing in the pane, not a token-by-token stream) and
said they're about to add/modify things next — **it's not confirmed whether their
dissatisfaction is with this streaming granularity specifically, or something else
entirely.** Don't assume "make `claude -p` stream more" is the ask until they say
so explicitly next session — ask rather than guess. If it is that: look for a
verbose/streaming flag on the worker CLI itself (e.g. `claude`'s own output-format
options) that `loop-setup`'s Phase 1 could ask about and add to `workers[].args` —
`runWorker`'s relay would pass any such output through live already, unchanged.

---

## Traps

- **`test/*` fixtures are local-only (gitignored) and were actively used as live
  test beds this session**: `test/ops-onboarding-repo/`, `test/
  choice-protocol-fixture/`, `test/architecture-absent-fixture/` (has a
  `005-splitpane-test` throwaway spec, currently reset to `todo` for whoever next
  tests `tmux`). Each has its own `.agents/skills/` copy of this repo's `skills/` —
  **these copies go stale on every skill edit and must be `cp -r skills/*
  <fixture>/.agents/skills/` again before the next live test**, or you're testing an
  old version without knowing it (nearly happened once this session).
- **Killing stray processes**: if a live split-pane test goes wrong again, check
  `Get-CimInstance Win32_Process -Filter "Name='cmd.exe'"` for the exact command
  line before killing anything — don't assume PIDs from a prior check are still the
  same processes.
- **`pickNextSpec`/`recoverStaleTasks` now both take extra parameters** — anyone
  writing orchestrator unit tests (`007`, still `todo`) needs the new signatures:
  `pickNextSpec(rows, hasRunnableWork)`, and the recovery sweep lives in its own
  `recoverStaleTasks()`, called once per `run()`, never inside the dispatch loop.
- Same older traps still apply (the `Plan`-cell path invariant, `tasks.md`'s
  column-0-only checkbox parsing, `.specloop/loop.config.json` path escaping on
  Windows) — not repeating them here since nothing this session touched them.

## Not verified — don't claim otherwise

- `tmux` split-pane backend — no Mac/Linux machine available this session.
- Whether the user's dissatisfaction with the streaming fix is fully resolved, or
  wants something more (see the judgement call above) — this is what they said
  they'd get into next.
- Cursor / Codex CLI harness audits (`022` T001/T002) — optional follow-up, still
  open, untouched this session.
- `007` (orchestrator-unit-tests), `009`–`013`, `018`, `019`, `021` — roadmap says
  `todo`, nothing this session changed that.
