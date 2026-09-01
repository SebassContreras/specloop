---
name: loop-setup
description: >
  One-time setup that generates the loop-orchestrator into the current repo:
  copies the reference framework, asks which worker CLI and split-pane
  mechanism to use, writes .specloop/loop.config.json, and wires up the `loop`
  console command.
when_to_use: >
  Use when the user wants to start running their backlog automatically — at
  least one spec in docs/roadmap.md must already have a populated tasks.md.
  Trigger on phrasing like "set up the loop orchestrator", "let's get the loop
  running here", "wire up specloop's loop in this repo". This is a separate,
  deliberate step — never chain it automatically after specloop:start,
  specloop:design-closing, or specloop:task-breakdown.
context: fork
background: false
---

# specloop: loop-setup

You are setting up the loop orchestrator **inside the target repo**. This is a
one-time, deliberately-invoked step — do not run it as a side effect of any other
specloop skill.

## Phase 0 — Refuse if there's nothing to run

Read `docs/roadmap.md` and each listed spec's `tasks.md`. **Refuse and stop** if no
spec has a populated `tasks.md` (every one is still the header-only stub) — tell the
user to run `specloop:task-breakdown` on a spec first.

## Phase 1 — Guided config Q&A

Ask, one at a time, waiting for each reply:

1. **Worker CLI** — "Which CLI should sub-agents run as? (`claude`, `codex`,
   `opencode`, or another command on PATH)" → `workerCli`. Ask for extra fixed args
   if any → `workerArgs` (default `[]`).
2. **Split mode** — explain the tradeoffs plainly, then ask which to use:
   - `"windowsTerminal"` — live split panes via the `wt` CLI (Windows only).
   - `"tmux"` — live split panes via `tmux` (Mac/Linux, needs tmux installed).
   - `"none"` — sequential execution in the master terminal with log-file output
     instead of live panes. Works everywhere; suggest this by default if the user
     is unsure or on an OS/setup without `wt`/`tmux`.
3. Default `logDir` to `.specloop/logs` unless the user wants something else.

## Phase 2 — Generate

1. Copy this plugin's `framework/orchestrator/` directory into the target repo at
   `.specloop/orchestrator/`.
2. Write `.specloop/orchestrator/../loop.config.json` (i.e. `.specloop/loop.config.json`)
   from the Phase 1 answers:
   ```json
   {
     "workerCli": "<answer>",
     "workerArgs": [],
     "splitMode": "<answer>",
     "logDir": ".specloop/logs"
   }
   ```
3. Run, inside `.specloop/orchestrator/`: `pnpm install && pnpm link --global`.
   This puts `loop` directly on PATH for this shell. If the user doesn't want a
   global link, tell them the fallback: `pnpm --dir .specloop/orchestrator exec loop run`.

## Phase 3 — Stop. Do not run it.

Tell the user setup is done and that `loop run` is ready whenever they choose to
start it — plus `loop stop` (safe stop from another terminal) and `loop status`.
**Do not invoke `loop run` automatically.**

## Style rules

- Terse and structural, no filler prose.
- Never guess `workerCli`/`splitMode` — always ask; these are explicitly
  user-configurable per the orchestrator's requirements.
