# 014 — worker-context-injection

## Priority: 2

Second only to `001`. Until this lands, nothing `001` records and nothing `018`
captures reaches the agent that needs it — a style palette or a stack convention is
decoration. It is also the fix for a stated fixed rule (`docs/architecture.md`) that
the code currently does not honor.

## What's being built

The worker prompt becomes a real briefing instead of one table cell.

Today `framework/orchestrator/src/worker.ts` builds `Work on this task: ${task.task}`
and nothing else. `runWorkerSync(config, task)` isn't even given the spec, so a worker
cannot know which `requirements.md`/`design.md` it is implementing — `cli.ts` has
`spec.id`/`spec.name` in scope and drops them. A grep across the orchestrator for
`requirements|design.md|architecture|CLAUDE|AGENTS` returns zero hits.

This spec:

- Threads the spec through `dispatchTask` → `runWorkerSync` → `promptFor`.
- Builds a prompt naming the task, its spec directory, and the `contextFiles` the
  worker must read before working (`contextFiles` already exists in `LoopConfig`).
- Filters `contextFiles` to those that actually exist, so a project with no
  `docs/styles.md` doesn't get told to read a missing file.
- Instructs the worker to update nothing but the work itself — status writes belong to
  the orchestrator.

## Who/what it serves

Every worker CLI, and non-Claude ones especially. `claude -p` accidentally gets some
context today by inheriting the repo root as cwd and auto-loading `CLAUDE.md`;
`codex` and `opencode` auto-load `AGENTS.md` and would learn nothing. Both are
first-class per `docs/architecture.md`'s CLI-agnostic rule, and
`skills/loop-setup` offers them with no warning.

## Hard constraints

- Prompt must stay CLI-agnostic — no Claude-specific syntax, no `@file` imports.
- Must not depend on the worker's cwd for correctness; ambient cwd is a convenience,
  not the channel.
- Must degrade cleanly when a context file is absent, and when `contextFiles` is `[]`.
- Must not grow the prompt without bound — name the files to read, don't inline them.

## Acceptance criteria

- `promptFor` output names the task id, the spec directory, and each existing context
  file.
- A configured context file that doesn't exist on disk is omitted from the prompt.
- `runWorkerSync` receives the spec; no call site passes a placeholder.
- A `codex`/`opencode` worker invoked on a scaffolded repo can state the project's
  stack and style rules from the prompt alone.
- `tsc --noEmit` and `eslint src` stay clean.

## Out of scope

- Inlining file contents into the prompt (files are named, not pasted).
- Per-task context selection or retrieval ranking — the whole `contextFiles` list goes
  to every task.
- Changing how the worker is spawned, timed out, or logged (that is `002`/`013`).
