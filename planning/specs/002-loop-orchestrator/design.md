# 002 — loop-orchestrator — Design

## Three deliverables, not one

1. **`framework/orchestrator/`** in *this* repo — the reference implementation. A
   real, runnable Node/TypeScript package, not just a spec.
2. **`skills/loop-setup/SKILL.md`** — a new skill (part of this spec, not 001) that
   copies/configures that framework **into the target repo** as a one-time,
   deliberately-invoked step. It does not run automatically after `specloop:start`.
3. **`skills/loop/SKILL.md`** (added 2026-09-11) — the interactive alternative to
   `loop run`: the chat session running it *is* the master. See "Quota exhaustion:
   two answers, not one" below for why this exists alongside, not instead of, the
   deterministic CLI.

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
  one `loop run` call, not reset per spec — and is also what `skills/loop`'s
  interactive worker-switch prompt reads and appends to. A config on disk with
  the legacy single
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

## Quota exhaustion: two answers, not one — reversed again 2026-09-11

A worker CLI hitting its own usage/rate limit looks, from `runWorker`'s own
side, like any other failed task (`{ok: false, ...}`). A first pass (`002`
T024) added `quota.ts` (a regex heuristic over the captured log) and a
blocking `node:readline/promises` prompt right in `cli.ts`, reasoning that
the master always holds the terminal now that split panes are gone, so it's
safe to block on `stdin`.

**That reasoning had a hole**: "the master" isn't necessarily a plain Node
process someone is sitting in front of. The user's actual intent is to open
a chat session and have *that conversation* be the master — actively reading
logs, launching workers, and deciding. A detached/unattended `loop run`
(CI, or a run nobody is watching) has nobody to answer `readline` either way.
So this split into two genuinely different answers instead of one shared
mechanism:

- **`loop run` (this package, deterministic)**: reverted to no judgement at
  all. `quota.ts` and `promptForWorkerSwitch` were deleted. A failed task is
  just `blocked`, exit-code only, same as any other failure — correct for an
  unattended/CI context where nothing could answer a prompt anyway.
- **`skills/loop/SKILL.md` (new, interactive)**: the chat session running
  this skill *is* the master. It reads `roadmap.md`/`tasks.md` itself, spawns
  each task's worker itself, and decides success/failure/quota-exhaustion by
  actually reading the output — no regex, real judgement. On a suspected
  usage-limit hit it asks the user directly in the conversation which worker
  to switch to, then retries. See that file for the full flow.

Nothing here bans `quota.ts`'s heuristic-over-log-text approach forever —
it was simply the wrong layer for it. A regex can't tell "the CLI printed a
rate-limit error" from "the CLI printed a stack trace mentioning the words
rate limit" as reliably as an agent reading it can, and the readline prompt
assumed an attended terminal that a background/CI run doesn't have.

## Harness synergy (`skills/loop/SKILL.md` Phase 3, informs `021`)

Because the master is now a live agent session, not a Node script, a task
whose configured worker is the **same provider as the harness currently
running the skill** doesn't need to shell out to that provider's CLI at all
— the skill instructs preferring that harness's own native way of spawning a
sub-agent instead (in-process, structured result, watchable live), falling
back to a CLI subprocess only for a different provider. Phrased generically
("your own harness", not "Claude Code's X tool") so the instruction stays
true under whichever compatible harness is actually running it, per `022`'s
open-format rule. This achieves the efficiency goal `021`
(harness-worker-backend) was designed around, but only for the interactive
skill path — `loop run` has no "harness" of its own (it's a plain script, it
can only shell out), so `021`'s original scope — an in-process
Claude-Agent-SDK worker kind for that deterministic path specifically —
still stands as genuinely separate, undesigned work. See `021`'s
`requirements.md`.

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
   Mention that naming more than one here also matters for `skills/loop` (the
   interactive alternative to `loop run`): it can ask the user, mid-run, to switch
   to a different configured worker on a suspected usage-limit hit.
3. Copy `framework/orchestrator/` into the target repo at `.specloop/orchestrator/`.
4. Write `.specloop/loop.config.json` from the answers.
5. Run `<manager> install && <manager> link --global` inside `.specloop/orchestrator/`,
   using the target repo's own package manager (never a hardcoded `pnpm`).
6. Tell the user it's ready: name both `specloop:loop` (interactive) and `loop run`
   (deterministic) as the two ways to actually start it. **Do not run either
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
                             # sequential dispatch loop (no judgement — see design)
    ├── config.ts           # loads .specloop/loop.config.json
    ├── roadmap.ts          # parse planning/roadmap.md, pick next eligible spec
    ├── tasks.ts            # parse/write a spec's tasks.md (fixed contract)
    ├── worker.ts           # pick a worker (round-robin) and spawn it for one task
    ├── safeStop.ts         # stop-flag read/write, interrupted-row writer
    ├── taskLock.ts         # per-task PID registry, stale-in_progress recovery
    └── security.ts         # assertSafePath(): refuse to spawn if PATH has a
                             # world-writable dir (POSIX only — see note below)
```

`skills/loop/SKILL.md` (the interactive alternative) reads/writes the same
`planning/roadmap.md`/`tasks.md`/`.specloop/loop.config.json` files directly —
it has no code of its own in this layout, by design; it's instructions for
whatever agent runs it, not a program.

## Open questions / deferred

- Multi-spec parallelism (running two independent, dependency-satisfied specs at
  once) — out of scope for the first cut; `loop run` processes one spec at a time
  even if several are eligible. `skills/loop` inherits the same one-spec-at-a-time
  shape for now, though nothing structurally prevents a future version working
  more than one.
- `security.ts`'s PATH-hijacking check (Sonar S4036) is POSIX-only: `fs.stat`'s
  `mode` bits aren't real permission data on Windows (Node fakes them from the
  read-only attribute), so every directory reads as "world-writable" there —
  enforcing it on Windows would just make the tool unusable, not safer. A real
  Windows check would mean parsing `icacls` output; not worth the fragility
  unless this actually becomes a problem in practice.
