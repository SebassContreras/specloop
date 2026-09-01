# Architecture

## Container

**Claude Code Plugin** (not a standalone skill) — packages Skills (and eventually
Subagents) into a single installable/versionable repo.

## Plugin components

- **Bootstrap Skill** (`001`): scaffold the folder structure + spec Q&A + stack Q&A,
  invocable from inside any target repo, with a single entry point ("I need to set up
  X").
- **Design-closing Skill** (`004`): guided Q&A, run separately per spec once its
  `requirements.md` is ready, closes `design.md`.
- **Task-breakdown Skill** (`003`): run separately per spec once its `design.md` is
  closed, populates `tasks.md`.
- **No hooks of its own yet** — defined per target repo, not shipped by the plugin.
- **No orchestrator of its own** in this repo — the orchestrator is **generated/
  configured inside the target repo** (see spec `002-loop-orchestrator`), it does not
  run from here, and setup is a separate one-time step, not chained after the
  scaffold Skill.

## Fixed rules

- The folder structure scaffolded in the target repo is the same one documented by
  `docs/roadmap.md` in this repo (dogfooding): `CLAUDE.md`, `docs/product.md`,
  `docs/architecture.md`, `docs/roadmap.md`, `docs/specs/NNN-name/{requirements,
  design,tasks}.md`.
- `roadmap.md` is always an index table (ID | Plan | Status | Depends on) — without
  this, an agent dropped into the repo has no idea what's next.
- The loop orchestrator (spec 002) is **CLI-agnostic** (not tied to Claude Code's
  native `Workflow` tool): it must be able to invoke `claude`, `codex`, `opencode`, or
  another CLI, configurable per repo/run.
- The terminal-splitting mechanism used to watch sub-agents live is **configurable by
  the user at run time** — no fixed mechanism is assumed (not every OS supports the
  same tooling).
- **Safe stop** (master or child pane): stop, do not start a new task, mark the task in
  progress as `interrupted` in its `tasks.md`, leave a log of where it stopped. A safe
  stop on the master propagates to all active child panes.

## Still to define

- Final plugin name / `plugin.json`.
- Orchestrator language/runtime.
- Exact format of the per-target-repo config file (which CLI to use, split mechanism,
  etc.).
- Optional subagents (stack research, etc.).
