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
    { "cli": "claude", "args": [] }
  ],
  "splitMode": "windowsTerminal",
  "logDir": ".specloop/logs"
}
```

- `workers` — one or more `{cli, args}` entries; which installed CLI(s) to spawn per
  task (`claude`, `codex`, `opencode`, or any other command on PATH). Configurable
  per repo/run, never hardcoded. With more than one entry, the loop round-robins
  across them by task order (`worker.ts`'s `pickWorker`) — across all specs worked in
  one `loop run` call, not reset per spec. A config on disk with the legacy single
  `workerCli`/`workerArgs` shape still loads: `config.ts` normalizes it to a
  one-element `workers` array, so `workers` is the only field code reads after load.
- `splitMode` — one of `"windowsTerminal"`, `"tmux"`, `"none"`. **Chosen by the user
  during `loop-setup`'s Q&A** (ask, don't assume — not every OS supports every
  mechanism). `"none"` runs sequentially in the master terminal with log-file output
  instead of live split panes; it's the only mode guaranteed to work everywhere and
  is what `loop-setup` suggests by default if the user isn't sure.
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

- **`splitMode: "none"`**: master runs the worker CLI as a synchronous child process
  per task, streaming its stdout/stderr inline, updating `tasks.md`'s row
  (`todo` → `in_progress` → `done`) around the call.
- **`splitMode: "windowsTerminal"` / `"tmux"`**: master spawns a detached child
  process per task and opens it in a new split pane (`wt split-pane …` /
  `tmux split-window …` respectively) running a small worker script that does the
  same status-flip on `tasks.md` and writes its own log file. Master polls active
  specs' `tasks.md` files on an interval and renders an aggregated status table —
  it does not need a private IPC channel, `tasks.md` itself is the shared state.

## Safe stop

- Triggered by `Ctrl+C` on a pane, or `loop stop` from another terminal (writes
  `<logDir>/stop.flag`; every running process — master and children — polls for it).
- On trigger: stop accepting new tasks, let the in-flight worker call be
  interrupted (kill the child process), set that task's row to `Status = interrupted`
  in its `tasks.md`, and write to `Notes` a short pointer to where it stopped (task
  ID + timestamp + last log line), plus a full log at `<logDir>/<spec>-<task>.log`.
- A stop on the master propagates: it writes the same flag, so any active child
  panes (already polling it) stop the same way independently — no direct
  parent→child signaling required, keeping the split-pane processes decoupled.

## Stale `in_progress` recovery (`taskLock.ts`)

Safe stop only covers a clean shutdown. A process killed some other way (an
enclosing shell's own command timeout, a crash, `kill -9`) leaves its current task
at `in_progress` with nothing left to ever move it — `nextRunnableTask` deliberately
won't resume an `in_progress` row on its own, since a live owner might still be
working it.

- Whichever process actually blocks on a task's worker registers its own PID in
  `<logDir>/task-pids.json` (keyed `<specId>-<taskId>`) before starting it, and
  clears the entry when it finishes: the master itself under `splitMode: "none"`
  (`cli.ts`'s `run()`), or the detached pane's own process under
  `windowsTerminal`/`tmux` (`cli.ts`'s `runTask()`, invoked via `_run-task`) — never
  the master for a detached task, since the master moves on immediately and would
  go stale itself while the pane is still genuinely working.
- Before `run()`'s dispatch loop starts (`recoverStaleTasks`, called **exactly
  once** per invocation, never inside the loop), it checks any `in_progress` task's
  registered PID (`process.kill(pid, 0)`, a portable liveness probe on both POSIX
  and Windows): a live PID is left alone; a dead or missing one is flipped to
  `interrupted` (same recovery path `nextRunnableTask` already gives an interrupted
  task) so the dispatch loop picks it up like any other runnable task.
- **Why exactly once, and before the loop rather than inside it**: a task already
  `in_progress` when `run()` starts necessarily predates this invocation, so judging
  it by its registered PID is safe. A task *this* call dispatches into a detached
  pane is a different story — the master writes `in_progress` and moves on
  immediately, before the pane has had any chance to register its own PID. Checking
  on every loop iteration (an earlier version of this code did) reads that
  just-dispatched task as already-dead a moment later, and re-dispatches it — every
  iteration, forever, each one spawning a fresh pane. Found live testing `006` T012
  (`windowsTerminal`): 13 iterations, 9 real stray `cmd` windows each running a real
  worker, before one finally won the race. `splitMode: "none"` was never affected
  (synchronous, no such gap).
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
2. Ask, one at a time: which worker CLI to use (`workerCli`), extra args if any, and
   which `splitMode` (explain the three options and their tradeoffs, default-suggest
   `"none"` if the user is unsure).
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
    ├── cli.ts              # argv dispatch: run / stop / status
    ├── config.ts           # loads .specloop/loop.config.json
    ├── roadmap.ts          # parse planning/roadmap.md, pick next eligible spec
    ├── tasks.ts            # parse/write a spec's tasks.md (fixed contract)
    ├── worker.ts           # pick a worker (round-robin) and spawn it for one task
    ├── safeStop.ts         # stop-flag read/write, interrupted-row writer
    ├── taskLock.ts         # per-task PID registry, stale-in_progress recovery
    ├── security.ts         # assertSafePath(): refuse to spawn if PATH has a
                             # world-writable dir (POSIX only — see note below)
    └── splitPane/
        ├── index.ts        # dispatch on config.splitMode
        ├── none.ts         # sequential, inline, log-file fallback (always works)
        ├── windowsTerminal.ts
        └── tmux.ts
```

## Open questions / deferred

- Multi-spec parallelism (running two independent, dependency-satisfied specs at
  once) — out of scope for the first cut; `loop run` processes one spec at a time
  even if several are eligible.
- `iTerm2`/other terminal-specific split backends beyond Windows Terminal and tmux —
  add later if actually needed; `"none"` covers every OS in the meantime.
- `security.ts`'s PATH-hijacking check (Sonar S4036) is POSIX-only: `fs.stat`'s
  `mode` bits aren't real permission data on Windows (Node fakes them from the
  read-only attribute), so every directory reads as "world-writable" there —
  enforcing it on Windows would just make the tool unusable, not safer. A real
  Windows check would mean parsing `icacls` output; not worth the fragility
  unless this actually becomes a problem in practice.
