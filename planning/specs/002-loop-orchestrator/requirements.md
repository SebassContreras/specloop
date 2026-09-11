# 002 — loop-orchestrator

## Requirements (draft — to be reviewed)

- Lives and runs in the **target repo**, not in `specloop`. `specloop` only
  generates/configures it during scaffolding.
- **CLI-agnostic**: must be able to invoke any installed CLI as a worker —
  `claude`, `codex`, `opencode`, etc. — configurable per repo/run, not hardcoded to
  one.
- **One process, no visual terminals**: the master runs every task sequentially,
  inline in its own process — no split panes, no detached windows, nothing else
  opened for the user to watch. **Reversed 2026-09-11**: the original design below
  spawned a live terminal split (Windows Terminal / tmux) per sub-agent; live-tested
  end-to-end in `006` T012, then dropped by explicit user decision in favor of this
  simpler shape — see `design.md`'s "Execution model" for what stayed (streaming a
  worker's own output live to the master's terminal, from `002` T22) and what was
  removed (`splitMode`, `windowsTerminal.ts`/`tmux.ts`, `_run-task`).
- **Safe stop**:
  - Stop — do not start any new task.
  - Mark the task in progress as `interrupted` in its corresponding `tasks.md` (not
    `done` nor `todo`).
  - Leave a log of where it stopped, so it can be resumed later.
- **Quota-exhaustion recovery**: if a worker's output looks like it hit its own
  usage/rate limit, pause before marking the task `blocked` and ask the user
  interactively which configured worker to switch to (or name a new CLI on the
  spot), then retry the same task with it. Detection is a best-effort heuristic
  (`quota.ts`), not a guarantee — see `design.md`.
- Reads the target repo's `planning/roadmap.md` as the index of which spec is next and its
  dependencies.
- **specloop ships a reference implementation**, not just a spec: a working
  orchestrator framework lives in this repo (e.g. under `framework/`) that the
  scaffold step generates/copies into the target repo — a real starting point, not
  something the user has to write from scratch per repo.
- **Single console command**: once generated into the target repo, the orchestrator
  must be startable with one command (exact name/shape decided in `design.md`) that
  reads that repo's `planning/roadmap.md`, picks the next eligible spec (status `todo`
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
