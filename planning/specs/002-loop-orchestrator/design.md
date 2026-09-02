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
`pnpm install && pnpm link --global` inside the generated package so `loop` resolves
directly on PATH in that shell — no `pnpm exec`/`npx` prefix needed, matching the
target shape (`loop run`). Document the direct-invocation fallback
(`pnpm --dir .specloop/orchestrator exec loop run`) for a shell where global linking
isn't wanted.

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
  "workerCli": "claude",
  "workerArgs": [],
  "splitMode": "windowsTerminal",
  "logDir": ".specloop/logs"
}
```

- `workerCli` — which installed CLI to spawn per task (`claude`, `codex`, `opencode`,
  or any other command on PATH). Configurable per repo/run, never hardcoded.
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

## Skill: `specloop:loop-setup`

**Frontmatter:** `context: fork`, `background: false` (guided Q&A, same reasoning as
001/004).

1. Refuse if no spec in `planning/roadmap.md` has a populated `tasks.md` yet (nothing to
   run) — point the user at `specloop:task-breakdown` instead.
2. Ask, one at a time: which worker CLI to use (`workerCli`), extra args if any, and
   which `splitMode` (explain the three options and their tradeoffs, default-suggest
   `"none"` if the user is unsure).
3. Copy `framework/orchestrator/` into the target repo at `.specloop/orchestrator/`.
4. Write `.specloop/loop.config.json` from the answers.
5. Run `pnpm install && pnpm link --global` inside `.specloop/orchestrator/`.
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
    ├── worker.ts           # spawn the configured workerCli for one task
    ├── safeStop.ts         # stop-flag read/write, interrupted-row writer
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
