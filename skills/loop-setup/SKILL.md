---
name: loop-setup
description: >
  One-time setup that generates the loop-orchestrator into the current repo:
  copies the reference framework, asks which worker CLI and split-pane
  mechanism to use, writes .specloop/loop.config.json, and wires up the `loop`
  console command.
when_to_use: >
  Use when the user wants to install the loop orchestrator so their backlog can
  run automatically. Trigger on phrasing like "set up the loop orchestrator",
  "let's get the loop running here", "wire up specloop's loop in this repo".
  This is a separate, deliberate step — never chain it automatically after
  specloop:start, specloop:design-closing, or specloop:task-breakdown.
---

# specloop: loop-setup

You are setting up the loop orchestrator **inside the target repo**. This is a
one-time, deliberately-invoked step — do not run it as a side effect of any other
specloop skill.

## Phase 0 — Read existing state

Read `.specloop/loop.config.json` if it exists — `specloop:start` writes it during
bootstrap. Anything already answered there is not re-asked; anything left `"TBD"` is.

**Do not refuse on an empty `tasks.md`.** Installing the orchestrator is scaffolding,
not execution: nothing in Phase 2 runs a task, and `loop run` already exits cleanly
with "no remaining runnable tasks" when there's nothing to do. Gating installation on
a populated `tasks.md` blocks a freshly-scaffolded repo from ever being set up. Report
the backlog state in Phase 3 instead.

## Phase 1 — Guided config Q&A (only what's missing)

Ask, one at a time, waiting for each reply:

1. **Worker CLI** — "Which CLI should sub-agents run as? (`claude`, `codex`,
   `opencode`, or another command on PATH — one, or several to split work across)"
   → `workers`, an array of `{ "cli": "...", "args": [...] }`. With more than one,
   the loop round-robins across them by task order. The worker always runs
   headlessly (no TTY, stdin closed) — a CLI invoked without its non-interactive
   flag will hang until the orchestrator's timeout kills it, wasting the whole
   task. Ask explicitly for each CLI's flag rather than defaulting to `[]`: for
   `claude` suggest `-p` (print mode); for another CLI, ask the user what its
   headless/non-interactive flag is.
2. **Split mode** — explain the tradeoffs plainly, then ask which to use:
   - `"windowsTerminal"` — live split panes via the `wt` CLI (Windows only).
   - `"tmux"` — live split panes via `tmux` (Mac/Linux, needs tmux installed).
   - `"none"` — sequential execution in the master terminal with log-file output
     instead of live panes. Works everywhere; suggest this by default if the user
     is unsure or on an OS/setup without `wt`/`tmux`.
3. Default `logDir` to `.specloop/logs` unless the user wants something else.
4. **Context files** — confirm `contextFiles` lists the files a worker must read
   before working (default `["AGENTS.md", "planning/architecture.md", "planning/styles.md"]`;
   non-existent entries are skipped at run time). If the configured `workerCli` is not
   `claude`, say plainly that `AGENTS.md` is the only context that CLI auto-loads, so
   this list is how it learns the project's stack and conventions.

## Phase 2 — Generate

1. Copy this plugin's `framework/orchestrator/` directory into the target repo at
   `.specloop/orchestrator/`.
2. Write or update `.specloop/loop.config.json` from the Phase 1 answers, preserving
   anything `specloop:start` already wrote:
   ```json
   {
     "workers": [
       { "cli": "<answer>", "args": ["<headless flag>"] }
     ],
     "splitMode": "<answer>",
     "logDir": ".specloop/logs",
     "contextFiles": ["AGENTS.md", "planning/architecture.md", "planning/styles.md"]
   }
   ```
   A single-worker config still works with the legacy `"workerCli"`/`"workerArgs"`
   shape — the orchestrator normalizes it to a one-element `workers` array at load
   time — but write the `workers` array form here going forward.
3. Verify `.specloop/.gitignore` exists and ignores `orchestrator/` and `logs/`
   (`specloop:start` writes it) — create it if the repo was scaffolded before that
   existed, so a `pnpm install` doesn't get committed.
4. Run, inside `.specloop/orchestrator/`: `pnpm install && pnpm link --global`.
   This puts `loop` directly on PATH for this shell. If the user doesn't want a
   global link, tell them the fallback: `pnpm --dir .specloop/orchestrator exec loop run`.

## Phase 3 — Report backlog state. Do not run it.

Tell the user setup is done and that `loop run` is ready whenever they choose to start
it — plus `loop stop` (safe stop from another terminal) and `loop status`.

Then report what the loop would actually find: if no spec has agent-runnable tasks
yet, say so and name the next step (`specloop:design-closing`, then
`specloop:task-breakdown`, on a named spec). If some specs have only `human` tasks,
name them — the loop will skip those.

**Do not invoke `loop run` automatically.**

## Style rules

- Terse and structural, no filler prose.
- Never guess `workers`/`splitMode` — always ask; these are explicitly
  user-configurable per the orchestrator's requirements.
