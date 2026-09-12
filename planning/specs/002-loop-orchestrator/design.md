# 002 — loop-orchestrator — Design

## One deliverable, two skills, no runnable framework

Retired 2026-09-12 (see `requirements.md`'s top section for why): there used
to be three deliverables here — a runnable `framework/orchestrator/` Node/TS
package, `skills/loop-setup/SKILL.md` to copy/install it, and
`skills/loop/SKILL.md` as the interactive alternative. The package and its
copy/install step are gone. What's left:

1. **`skills/loop-setup/SKILL.md`** — one-time, deliberately-invoked Q&A that
   asks which worker CLI(s) to use and writes `.specloop/loop.config.json`.
   Nothing to copy, install, or link.
2. **`skills/loop/SKILL.md`** — the only way to actually run the loop. The
   chat session running it *is* the master: it reads
   `planning/roadmap.md`/that spec's `tasks.md` directly, launches each
   task's worker itself, and decides success/failure/quota-exhaustion by
   reading the output, no regex. Both skills have no code of their own, by
   design — they're instructions for whatever agent runs them, reading/
   writing the same `planning/roadmap.md`/`tasks.md`/`.specloop/
   loop.config.json` files a program would have. `skills/loop/SKILL.md`
   itself is the source of truth for the eligibility rule, the `tasks.md`
   grammar, and the status-rollup rule — there is no `.ts` file to fall back
   to when the skill's own text is ambiguous.

## No split panes — reversed 2026-09-11

Earlier versions of this design spawned a detached child process per task in a
live terminal split (`windowsTerminal.ts` via `wt split-pane`, `tmux.ts` via
`tmux split-window`), so the user could watch a sub-agent work in its own
visible pane. `windowsTerminal` was confirmed working end-to-end (`006` T012)
after fixing a real race condition in stale-task recovery and a real
buffering bug. The user then watched it live and decided against the whole
approach — not worth the complexity for what it bought. Dropped by explicit
instruction, before the code that implemented it was itself retired
alongside the rest of `framework/orchestrator/` on 2026-09-12.

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
  per repo/run, never hardcoded. With more than one entry, `skills/loop` round-robins
  across them by task order, and is also what its interactive worker-switch prompt
  reads and appends to. A config on disk with the legacy single
  `workerCli`/`workerArgs` shape is read as equivalent to a one-element `workers`
  array — `skills/loop`'s Phase 0 says so directly, since there's no load-time
  normalization code left to do it silently. `skills/loop-setup` writes the
  `workers` array form going forward.
- `logDir` — where `skills/loop` writes its per-task log records.

## Quota exhaustion: judgement, not a regex — history

A worker CLI hitting its own usage/rate limit looks, on the surface, like any
other failed task. A first pass (`002` T024) added a regex heuristic over the
captured log plus a blocking `readline` prompt directly in the (now-retired)
deterministic CLI, reasoning that the master always holds the terminal now
that split panes are gone.

**That reasoning had a hole**: "the master" isn't necessarily a plain Node
process someone is sitting in front of. The user's actual intent, confirmed
again on 2026-09-12 when the deterministic CLI was retired entirely, is a
chat session *being* the master — actively reading logs, launching workers,
and deciding. `skills/loop/SKILL.md` reads a worker's output itself and
decides success/failure/quota-exhaustion with real judgement — no regex. On a
suspected usage-limit hit it asks the user directly in the conversation which
worker to switch to, then retries. See that file for the full flow.

Nothing here bans a heuristic-over-log-text approach forever — it was simply
the wrong layer for it. A regex can't tell "the CLI printed a rate-limit
error" from "the CLI printed a stack trace mentioning the words rate limit"
as reliably as an agent reading it can.

## Harness synergy (`skills/loop/SKILL.md` Phase 3) — a priority order, not a preference

Because the master is a live agent session, a task whose configured worker is
the **same provider as the harness currently running the skill** doesn't need
to shell out to that provider's CLI at all — the skill instructs **always
using** that harness's own native way of spawning a sub-agent first
(in-process, structured result), falling back to a CLI subprocess only when
the provider doesn't match or the harness has no native mechanism. Not a
soft preference either party can skip: whenever the native path is
available for the matching provider, it's the one used, every time. Phrased
generically ("your own harness", not "Claude Code's X tool") so the
instruction stays true under whichever compatible harness is actually
running it, per `022`'s open-format rule. This was `021`'s
(harness-worker-backend) whole efficiency goal, achieved here for free —
`021` was retired 2026-09-12 once the only other execution path it could
have targeted (the deterministic CLI) no longer existed.

**Live-verified under Claude Code (`024`, 2026-09-12), one correction:** the
native path is not "watchable live" as originally assumed here — it's
asynchronous (dispatch, then a completion notification arrives once the
sub-agent finishes), unlike a CLI subprocess's live-streamed stdout/stderr.
`skills/loop`'s Phase 3/4 read the result either way before deciding the
outcome; only the *how* differs. See `024`'s `tasks.md` for the full
observed-result table.

## Open questions / deferred

- Multi-spec parallelism (running two independent, dependency-satisfied specs at
  once) — `skills/loop` works one spec at a time; nothing structurally prevents
  a future version working more than one.
