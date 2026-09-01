# Architecture

## Container

**Claude Code Plugin** (not a standalone skill) — packages Skills (and eventually
Subagents) into a single installable/versionable repo.

## Plugin components

- **Bootstrap Skill** (`001`, `skills/start/`): scaffold the folder structure + spec
  Q&A + stack Q&A, invocable from inside any target repo, with a single entry point
  ("I need to set up X").
- **Design-closing Skill** (`004`, `skills/design-closing/`): guided Q&A, run
  separately per spec once its `requirements.md` is ready, closes `design.md`.
- **Task-breakdown Skill** (`003`, `skills/task-breakdown/`): run separately per spec
  once its `design.md` is closed, drafts + confirms + writes `tasks.md`.
- **Loop-setup Skill** (`002`, `skills/loop-setup/`): one-time, deliberately-invoked
  step that copies `framework/orchestrator/` into the target repo, asks for the
  worker CLI + split-pane mechanism, and wires up the `loop` console command there.
- **No hooks of its own yet** — defined per target repo, not shipped by the plugin.
- **No orchestrator *runtime* lives or executes in this repo** — `framework/
  orchestrator/` here is the reference implementation source; it only actually runs
  once `loop-setup` copies it into a target repo (see spec `002-loop-orchestrator`).

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

## Resolved

- Plugin name: `specloop` (`.claude-plugin/plugin.json`).
- Orchestrator runtime: Node.js + TypeScript, run via `tsx` (no build step to
  maintain). Console command: `loop` (`loop run` / `loop stop` / `loop status`),
  linked into PATH by `loop-setup` via `pnpm link --global`.
- Per-target-repo config file: `.specloop/loop.config.json` (`workerCli`,
  `workerArgs`, `splitMode`, `logDir`) — written by `loop-setup`'s guided Q&A, never
  hand-authored or hardcoded. See `002-loop-orchestrator/design.md`.

## Still to define

- Optional subagents (stack research, etc.).
- Multi-spec parallelism, and split-pane backends beyond `windowsTerminal`/`tmux`
  (see `002-loop-orchestrator/design.md`'s open questions).
