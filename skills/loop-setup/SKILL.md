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

**Check for an all-`human` backlog before Phase 1.** Look at the specs `loop run` would
actually consider next: `planning/roadmap.md` rows with status `todo`/`in_progress`
whose dependencies are satisfied, or already `in_progress`. Read each one's
`tasks.md`. If every task in all of them is `[human]` — no `[agent]` task is currently
runnable anywhere — say so plainly before asking the worker-CLI question: a worker CLI
has nothing to run yet, so setup would configure a loop that never fires this round.
Ask whether to continue anyway (e.g. to have it ready for when an agent task becomes
eligible, such as once a dependency clears) or stop here. This is common for a project
whose current spec is mostly human-owned work (research, approvals, physical steps) —
not a bug, just worth naming before walking through a Q&A whose answer won't be
exercised yet.

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
5. **Package manager** for installing the orchestrator's own dependencies — never
   assume `pnpm`. Check `planning/architecture.md`'s decision register first (a
   software project's `toolchain` dimension may have already settled this); if it
   has, use that and don't re-ask. Otherwise ask: "Which package manager should
   install the loop orchestrator's dependencies — `pnpm`, `npm`, `yarn`, or another
   on PATH?", defaulting to whichever lockfile (if any) already exists at the
   target repo's root.

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
     "contextFiles": ["AGENTS.md", "planning/architecture.md", "planning/styles.md"],
     "language": "<preserve if already set by specloop:start>"
   }
   ```
   A single-worker config still works with the legacy `"workerCli"`/`"workerArgs"`
   shape — the orchestrator normalizes it to a one-element `workers` array at load
   time — but write the `workers` array form here going forward. **Never drop an
   existing `"language"` field** when rewriting this file — this skill doesn't ask
   about it (that's `specloop:start`'s Phase 5), it only must not silently erase it.
3. Verify `.specloop/.gitignore` exists and ignores `orchestrator/` and `logs/`
   (`specloop:start` writes it) — create it if the repo was scaffolded before that
   existed, so an install doesn't get committed.
4. Run, inside `.specloop/orchestrator/`, install then link with the **chosen**
   package manager only — e.g. `pnpm install && pnpm link --global`. This puts
   `loop` directly on PATH for this shell. **If the global-link step fails or the
   package manager doesn't support it** (e.g. `pnpm link --global` erroring on some
   pnpm versions), do not silently retry with a *different* package manager — that
   changes what installed the dependencies without telling the user. Report the
   failure and offer the documented fallback with the *same* manager instead:
   `pnpm --dir .specloop/orchestrator exec loop run` (or the equivalent for
   whichever manager was chosen). If the user wants `loop` on PATH regardless, ask
   before reaching for a different package manager's link command.

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
