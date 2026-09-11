# 002 — loop-orchestrator — Design

## Two deliverables, not one

1. **`framework/orchestrator/`** in *this* repo — the reference implementation. A
   real, runnable Node/TypeScript package, not just a spec.
2. **`skills/loop-setup/SKILL.md`** — a new skill (part of this spec, not 001) that
   copies/configures that framework **into the target repo** as a one-time,
   deliberately-invoked step. It does not run automatically after `specloop:start`.

## Runtime

**Node.js + TypeScript.** Cross-platform (the author works on Windows; target repos
can be any OS/stack — the orchestrator is a dev tool, orthogonal to the target
repo's own language). Run via `tsx` (no separate compile step to maintain in a
generated, personal-use tool) — `bin/loop.cjs` is a two-line shim that requires
`tsx/cjs` and executes `src/cli.ts`.

## No split panes — reversed 2026-09-11

Earlier versions of this design spawned a detached child process per task in a
live terminal split (`windowsTerminal.ts` via `wt split-pane`, `tmux.ts` via
`tmux split-window`), so the user could watch a sub-agent work in its own
visible pane. `windowsTerminal` was confirmed working end-to-end (`006` T012)
after fixing a real race condition in stale-task recovery (`002` T21's
follow-up note) and a real buffering bug (`002` T22). The user then watched it
live and decided against the whole approach — not worth the complexity for
what it bought. Dropped by explicit instruction:

- `splitMode` config field, `windowsTerminal.ts`, `tmux.ts`, `splitPane/`
  (the whole directory), `cli.ts`'s `runTask()`/`_run-task` dispatch — all
  removed.
- The master is now the **only** process that ever runs a task, sequentially,
  inline, every time. There's no per-mode branching left in `run()`.
- What `002` T22 fixed (live-relaying a worker's stdout/stderr instead of
  buffering it) stayed — it's still true whether or not anything is visually
  "split", and it's how the master's own terminal shows a worker's progress
  as it happens instead of a silent wait.
- `loop-setup`'s Q&A dropped the split-mode question entirely; only the
  worker-CLI question remains from that pair.

## The console command: `loop`

Package declares `"bin": { "loop": "./bin/loop.cjs" }`. `specloop:loop-setup` runs
`<manager> install && <manager> link --global` inside the generated package (the
target repo's own package manager — from its `toolchain` decision if one exists,
asked otherwise, never hardcoded `pnpm`) so `loop` resolves directly on PATH in that
shell — no `exec`/`npx` prefix needed, matching the target shape (`loop run`).
Document the direct-invocation fallback (`<manager> --dir .specloop/orchestrator
exec loop run`, e.g. `pnpm --dir ...`) for a shell where global linking isn't
wanted, or where the global-link step itself fails for that manager — fall back to
the same manager's local form, never switch managers silently.

Subcommands:

- **`loop run`** — start the orchestrator (master terminal). Reads
  `.specloop/loop.config.json`, reads `planning/roadmap.md`, picks the next eligible spec,
  works through its `tasks.md`.
- **`loop stop`** — trigger a safe stop from another terminal (writes a stop-flag the
  running master polls for; equivalent to `Ctrl+C` on the master itself).
- **`loop status`** — print current state: which spec/task is active, per-sub-agent
  status, without starting anything.

## Config: `.specloop/loop.config.json` (target repo)

Written by `specloop:loop-setup`'s guided Q&A, not hand-authored:

```json
{
  "workers": [
    { "cli": "claude", "args": ["-p"] }
  ],
  "logDir": ".specloop/logs"
}
```

- `workers` — one or more `{cli, args}` entries; which installed CLI(s) to spawn per
  task (`claude`, `codex`, `opencode`, or any other command on PATH). Configurable
  per repo/run, never hardcoded. With more than one entry, the loop round-robins
  across them by task order (`worker.ts`'s `pickWorker`) — across all specs worked in
  one `loop run` call, not reset per spec — and is also where a quota-exhaustion
  worker switch (below) can land. A config on disk with the legacy single
  `workerCli`/`workerArgs` shape still loads: `config.ts` normalizes it to a
  one-element `workers` array, so `workers` is the only field code reads after load.
- `logDir` — where safe-stop resume logs and per-task output land.

## Spec/task selection

- Parse `planning/roadmap.md`'s table (fixed format already established by 001).
- **Next eligible spec** = lowest `ID` where `Status` is `todo` and every ID in
  `Depends on` has `Status = done` — or a spec already `in_progress` (resume it
  before starting anything new).
- Within that spec's `tasks.md` (fixed `ID | Task | Status | Notes` contract from
  001's design): first row that is `todo`, or an `interrupted` row (resume using its
  `Notes` pointer) — never re-run a `done` row.

## Execution model

The master runs every task inline, in its own process, one at a time — no
detached children, no other terminals. `worker.ts`'s `runWorker` uses `spawn`,
not `spawnSync`, precisely so it can relay stdout/stderr to the master's own
terminal as each chunk arrives, not just buffer everything for the log
(`002` T22) — updating `tasks.md`'s row (`todo` → `in_progress` → `done`)
around the call.

## Quota-exhaustion recovery (`quota.ts`)

A worker CLI hitting its own usage/rate limit looks, from here, like any
other failed task — `runWorker` resolves `{ok: false, ...}` same as a real
bug in the worker's output. Left alone, that just marks the task `blocked`
and the loop moves to the next one, uselessly repeating the same failure on
every other task that also needs that worker.

- `quota.ts`'s `looksLikeQuotaExhausted(log)` scans a task's full captured
  output for wording that suggests a usage/rate limit was hit (`"usage
  limit"`, `"rate limit"`, `"quota exceeded"`, `429`, `"too many requests"`,
  `"overloaded"`). **This is a heuristic, not a guarantee** — there is no
  shared protocol across worker CLIs for this, each vendor prints its own
  wording, and none of `claude`/`codex`/`opencode`'s actual wording has been
  confirmed against a real exhausted quota yet. A miss just falls through to
  the existing `blocked` handling; it never blocks progress by itself.
- When it matches, `cli.ts`'s `run()` pauses **before** marking the task
  `blocked` and asks interactively (`promptForWorkerSwitch`, using
  `node:readline/promises` against `process.stdin`/`stdout`) which configured
  worker to retry with, by index — or a brand-new CLI name typed on the spot
  (with its own args), appended to `config.workers` for the rest of this run.
  Answering blank retries the same worker (e.g. if the limit was actually
  transient); `"skip"` marks the task `blocked` and continues; `"stop"` marks
  it `interrupted` and halts the loop, same as a safe stop.
- This is only safe to do now that the master is always the one holding the
  terminal (no detached panes) — blocking on `stdin` here doesn't stall
  anything else that might have been running independently under the old
  split-pane design.
- A switch made this way sticks for the rest of the `run()` call: subsequent
  tasks' round-robin continues from the new `workerIndex`, not back to the
  exhausted one, until it too gets flagged.

## Safe stop

- Triggered by `Ctrl+C` on the master, or `loop stop` from another terminal (writes
  `<logDir>/stop.flag`; the master polls for it).
- On trigger: stop accepting new tasks, let the in-flight worker call be
  interrupted (kill the child process), set that task's row to `Status = interrupted`
  in its `tasks.md`, and write to `Notes` a short pointer to where it stopped (task
  ID + timestamp + last log line), plus a full log at `<logDir>/<spec>-<task>.log`.

## Stale `in_progress` recovery (`taskLock.ts`)

Safe stop only covers a clean shutdown. A process killed some other way (an
enclosing shell's own command timeout, a crash, `kill -9`) leaves its current task
at `in_progress` with nothing left to ever move it — `nextRunnableTask` deliberately
won't resume an `in_progress` row on its own, since a live owner might still be
working it.

- The master registers its own PID in `<logDir>/task-pids.json` (keyed
  `<specId>-<taskId>`) before starting a task's worker, and clears the entry
  when it finishes.
- Before `run()`'s dispatch loop starts (`recoverStaleTasks`, called **exactly
  once** per invocation, never inside the loop), it checks any `in_progress` task's
  registered PID (`process.kill(pid, 0)`, a portable liveness probe on both POSIX
  and Windows): a live PID is left alone; a dead or missing one is flipped to
  `interrupted` (same recovery path `nextRunnableTask` already gives an interrupted
  task) so the dispatch loop picks it up like any other runnable task.
- Not a defense against PID reuse after a reboot — an unrelated process landing on
  the same PID would misread as still running. Acceptable for a local dev-loop tool,
  not a distributed lock.

## Skill: `specloop:loop-setup`

**Frontmatter:** no `context`/`background` fields — same correction as `001`/`003`/`004`:
a forked skill re-invokes fresh (full reload) on every user reply instead of holding the
Q&A loop itself, so an inline skill (loads once, then converses turn by turn as usual) is
strictly better for a guided-Q&A flow like this one. See `001`'s design for the full
reasoning and `tasks.md` T19.

1. Refuse if no spec in `planning/roadmap.md` has a populated `tasks.md` yet (nothing to
   run) — point the user at `specloop:task-breakdown` instead.
2. Ask, one at a time: which worker CLI(s) to use (`workers`), extra args for each.
   Mention that a task whose output looks like a hit usage/rate limit pauses the
   loop with an interactive prompt to switch workers (`quota.ts`) — naming more
   than one worker CLI here is useful for that, not just round-robin.
3. Copy `framework/orchestrator/` into the target repo at `.specloop/orchestrator/`.
4. Write `.specloop/loop.config.json` from the answers.
5. Run `<manager> install && <manager> link --global` inside `.specloop/orchestrator/`,
   using the target repo's own package manager (never a hardcoded `pnpm`).
6. Tell the user it's ready: run `loop run` whenever they choose. **Do not run it
   automatically** — same deliberate-step rule as every other spec here.

## `framework/orchestrator/` layout (this repo)

```
framework/orchestrator/
├── package.json           # bin: { "loop": "./bin/loop.cjs" }
├── tsconfig.json
├── eslint.config.cjs       # typescript-eslint recommended + eslint-config-prettier
├── .prettierrc.json       # singleQuote: true
├── bin/
│   └── loop.cjs             # shim: requires tsx/cjs, runs src/cli.ts
└── src/
    ├── cli.ts              # argv dispatch: run / stop / status; the whole
                             # sequential dispatch loop, incl. quota-switch prompt
    ├── config.ts           # loads .specloop/loop.config.json
    ├── roadmap.ts          # parse planning/roadmap.md, pick next eligible spec
    ├── tasks.ts            # parse/write a spec's tasks.md (fixed contract)
    ├── worker.ts           # pick a worker (round-robin) and spawn it for one task
    ├── quota.ts            # heuristic: does a task's log look like a hit usage/rate limit
    ├── safeStop.ts         # stop-flag read/write, interrupted-row writer
    ├── taskLock.ts         # per-task PID registry, stale-in_progress recovery
    └── security.ts         # assertSafePath(): refuse to spawn if PATH has a
                             # world-writable dir (POSIX only — see note below)
```

## Open questions / deferred

- Multi-spec parallelism (running two independent, dependency-satisfied specs at
  once) — out of scope for the first cut; `loop run` processes one spec at a time
  even if several are eligible.
- `quota.ts`'s detection patterns are unverified against any real worker CLI's
  actual wording — extend the list once one is actually seen hitting a limit live.
- `security.ts`'s PATH-hijacking check (Sonar S4036) is POSIX-only: `fs.stat`'s
  `mode` bits aren't real permission data on Windows (Node fakes them from the
  read-only attribute), so every directory reads as "world-writable" there —
  enforcing it on Windows would just make the tool unusable, not safer. A real
  Windows check would mean parsing `icacls` output; not worth the fragility
  unless this actually becomes a problem in practice.
