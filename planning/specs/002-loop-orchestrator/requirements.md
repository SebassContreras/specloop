# 002 — loop-orchestrator

## What's being built

**Reversed 2026-09-12.** This spec originally shipped a dual design: a
deterministic Node/TypeScript CLI (`framework/orchestrator/`, `loop run` /
`loop stop` / `loop status`) for unattended/CI use, alongside
`skills/loop/SKILL.md` for a chat session someone was actually in. The
deterministic CLI is retired — deleted, along with its `skills/loop-setup`
copy/install/link step. **The only way to run the loop now is
`specloop:loop`: a chat session in a compatible harness reads
`planning/roadmap.md`/that spec's `tasks.md` directly, launches each task's
worker itself, and decides success/failure/quota-exhaustion by judgement.**
This is not tied to Claude specifically — it holds under any compatible
harness (Claude Code, OpenCode, Codex CLI, or another), matching `022`'s
open-format rule.

Six dependent specs existed only for the deterministic path and were retired
the same day, never past `requirements.md`: `007` (orchestrator-unit-tests),
`008` (ci-pipeline), `010` (loop-auto-continue), `011`
(windows-path-safety), `013` (task-retry-backoff), `021`
(harness-worker-backend). See `planning/handoff.md` for why.

specloop ships two skills implementing this, not a runnable framework:
`skills/loop-setup` (asks which worker CLI(s) to use, writes
`.specloop/loop.config.json`) and `skills/loop` (does the work). Neither has
code of its own — both are instructions for whatever agent runs them. The
loop reads the target repo's `planning/roadmap.md` as the index of which spec
is next and its dependencies.

The chat session itself is the master — it runs each batch of independent
tasks as its own concurrent sub-agents, in the same conversation (narrowed
from "sequentially, one at a time" 2026-09-14 once parallel batching landed —
see `design.md`'s "Parallel batching" section). No detached windows, no split
panes, nothing else opened for the user to watch. (An earlier design spawned
a live terminal split per sub-agent — Windows Terminal / tmux — live-tested
end-to-end in `006` T012, then dropped by explicit user decision; see
`design.md`'s history.)

Reviewed `opencode-orchestrator` (separate repo, built the same day) during
design: it solves a similar problem (parallel worktrees, wt split-panes,
model fallback), but the user decided not to build on top of that
implementation as-is ("doesn't like how it's made"). Recycling specific
pieces later remains open, but it was not the base for this spec.

## Who/what it serves

specloop's core execution engine — every spec with agent-runnable tasks
depends on it to actually dispatch and run those tasks. Anyone running
`specloop:loop` against a target repo, on any compatible harness.

## Hard constraints

- **CLI-agnostic**: the loop must be able to invoke any installed CLI as a
  worker — `claude`, `codex`, `opencode`, etc. — configurable per repo/run,
  not hardcoded to one. It always picks whichever configured entry's
  provider matches the harness actually running `specloop:loop` (never
  round-robins across the rest — corrected 2026-09-14), and, when that
  harness offers a native way to spawn a sub-agent, **always uses that
  first** — a CLI subprocess is the fallback for a harness with no native
  mechanism, or an explicit user-directed exception, never the default.
- **One process, no visual terminals**: no detached windows, no split panes —
  see the chat-session description above.
- **Safe stop**: the user can just say so, in the same conversation —
  - Stop — do not start any new task.
  - Mark whichever task(s) are in progress as `interrupted` in the
    corresponding `tasks.md` (not `done` nor `todo`) — more than one when a
    batch was running in parallel.
  - Report what's left undone, so it can be resumed later.
- **Quota-exhaustion recovery is judgement, not a regex.** The agent running
  `specloop:loop` reads a worker's output itself and decides success,
  failure, or a suspected usage/rate limit by actually reading what it said —
  no fixed pattern-match. On a suspected limit, it asks the user directly, in
  the conversation, which configured worker to switch to.

## Acceptance criteria

- The loop dispatches a task's worker via whichever configured CLI matches
  the running harness's provider, preferring a native sub-agent mechanism
  over a CLI subprocess when one exists.
- A user-issued stop mid-run halts new task starts, marks in-progress
  task(s) `interrupted` (not `done`/`todo`) in `tasks.md`, and reports what's
  left undone.
- A suspected usage/rate-limit condition is surfaced to the user directly, in
  the conversation, rather than silently retried or misreported as failure.
- `planning/roadmap.md` is read as the authoritative index of which spec is
  next and its dependencies.
- Confirmed live end-to-end (real `claude`/`opencode` workers, not a stub)
  against a throwaway fixture by `024-loop-skill-verification`, which also
  found and fixed two real gaps in `skills/loop`'s Phase 3.

## Out of scope

- Claude Code's native `Workflow` tool (doesn't cover non-Claude CLIs).
- Multi-spec parallelism **on the master's own provider** — the loop still
  works one spec at a time there. Narrowed 2026-09-14: explicit
  user-directed dispatch of a *different* spec/task to a *different*
  configured provider, running alongside the master's own work, is now in
  scope — see `design.md`'s "Cross-provider dispatch" section. What's still
  out of scope is two specs running concurrently on the *same* provider.
- A standalone script or CLI of any kind for running the loop — this was
  tried, shipped, and deliberately retired (2026-09-12). See
  `planning/architecture.md`'s Declined table before re-proposing it.
- Building on `opencode-orchestrator` as a base implementation (reviewed and
  declined during design — see above); recycling specific pieces later
  remains an open, unscheduled possibility.

## Dependencies

`001` (scaffold-and-spec-skill), `003` (task-breakdown-skill) — per
`planning/roadmap.md`'s `002` row.

## Owner split

(none stated)
