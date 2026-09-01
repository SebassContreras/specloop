# 002 — loop-orchestrator

## Requirements (draft — to be reviewed)

- Lives and runs in the **target repo**, not in `specloop`. `specloop` only
  generates/configures it during scaffolding.
- **CLI-agnostic**: must be able to invoke any installed CLI as a worker —
  `claude`, `codex`, `opencode`, etc. — configurable per repo/run, not hardcoded to
  one.
- **Master terminal**: starts the orchestrator, shows an overview of what's running at
  any moment and an aggregated status summary of each active sub-agent.
- **Sub-agents in split panes**: when a sub-agent spawns, it opens its own terminal
  split (small pane) with its live execution.
- The **split mechanism is configurable by the user** at run time (no fixed mechanism
  is assumed — not every OS supports the same tooling).
- **Safe stop** (in a child pane and in the master):
  - Stop — do not start any new task.
  - Mark the task in progress as `interrupted` in its corresponding `tasks.md` (not
    `done` nor `todo`).
  - Leave a log of where it stopped, so it can be resumed later.
  - A safe stop on the master propagates the same logic to all active child panes.
- Reads the target repo's `docs/roadmap.md` as the index of which spec is next and its
  dependencies.
- **specloop ships a reference implementation**, not just a spec: a working
  orchestrator framework lives in this repo (e.g. under `framework/`) that the
  scaffold step generates/copies into the target repo — a real starting point, not
  something the user has to write from scratch per repo.
- **Single console command**: once generated into the target repo, the orchestrator
  must be startable with one command (exact name/shape decided in `design.md`) that
  reads that repo's `docs/roadmap.md`, picks the next eligible spec (status `todo`
  with satisfied `Depends on`), and starts working through its `tasks.md`.

## Notes

- Reviewed `opencode-orchestrator` (separate repo, built the same day): it solves a
  similar problem (parallel worktrees, wt split-panes, model fallback) but the user
  doesn't want to build on top of that implementation as-is ("doesn't like how it's
  made"). Evaluate recycling specific pieces later — it is not the base for this spec
  for now.

## Out of scope

- Claude Code's native `Workflow` tool (doesn't cover non-Claude CLIs).
- Deciding the split mechanism or the orchestrator's runtime right now — that's
  design, goes in `design.md` when we get to it.
