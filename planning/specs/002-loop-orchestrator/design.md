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

- `workers` — one or more `{cli, args}` entries; which installed CLI(s) might ever
  run this loop (`claude`, `codex`, `opencode`, or any other command on PATH).
  Configurable per repo/run, never hardcoded. `skills/loop` always picks whichever
  entry's `cli` matches the harness actually running it — **never round-robins
  across the rest within one run** (corrected 2026-09-14; an earlier version did,
  which wasted the native-sub-agent path on every task that didn't happen to land
  on the matching entry). More than one entry exists for portability across
  whichever harness ends up running the loop, and is also what its interactive
  worker-switch prompt reads and appends to for an explicit fallback. A config on
  disk with the legacy single
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

**Corrected 2026-09-14 — worker selection was never meant to be per-task
round-robin.** The original wording above ("a task whose configured worker
is the same provider...") assumed each task got assigned a worker by
round-robin first, then checked for a harness match — so with more than one
`workers` entry configured, only a fraction of tasks ever actually hit the
native path, even when the master's own provider was configured and
available for every task. Found live, dogfooding this repo's own loop run
against `026` (a `claude`/`codex`/`opencode` config, master = Claude Code):
task 2 round-robinned onto `codex` and shelled out to a subprocess for no
reason, when the native path could have run it in-process the whole time.
The rule is now: pick the master-matching `workers` entry **once per run**
(or per batch — see the Parallel batching section below), never round-robin
across the rest — those exist for portability to a different master, or as
an explicit, user-directed fallback, not for load-splitting within one run.

## Parallel batching (`skills/loop`'s Phase 2) — added 2026-09-14

Serial one-task-at-a-time execution left real concurrency on the table:
Claude Code's own native sub-agent mechanism (and a CLI subprocess, for that
matter) supports dispatching several independent tasks at once. `skills/loop`'s
Phase 2 now builds a batch of consecutive runnable tasks, stopping the batch
at the first task that either the spec's `design.md` orders after an earlier
one in the batch, or that touches a file/section another batch member
already touches — two tasks editing the same file are not safe to run
concurrently even with no stated logical dependency, since one can silently
overwrite the other's edit. When independence is genuinely unclear, the rule
is to not guess: treat it as dependent and start a new batch. In practice,
many specs' tasks cluster around one or two shared files (`026`'s own
`tasks.md` is a real example — most of its tasks touch `skills/status/
references/template.html`), so batches of one remain common; that's the
correct, conservative outcome, not a failure to parallelize. No new field
was added to `tasks.md`'s grammar for this — dependency signal comes from
`design.md`'s existing Sequencing prose plus each task's own stated scope,
not a formal per-task dependency list, to avoid a second, driftable source
of truth alongside `design.md`.

## Cross-provider dispatch — resolved 2026-09-14

The "multi-spec parallelism" question below is now partly resolved: the user
can explicitly send a different spec/task to a **different configured
provider**, running as a background subprocess alongside the master's own
Phase 1-4 work on its own pick — e.g. "do `007` yourself, send `008` to
`codex`." Always explicit (both the spec/task and the provider named by the
user), never inferred, and never a way for the master to offload its *own*
assigned work faster without being asked — that stays Phase 3 step 5's
reactive, ask-first territory. Genuinely useful because it's cross-*provider*:
the dispatched stream doesn't compete with the master's own native-sub-agent
capacity at all, it runs as an entirely separate subprocess.

## Open questions / deferred

- Multi-spec parallelism **on the master's own provider** (running two
  independent, dependency-satisfied specs at once, both via the master's own
  native sub-agent mechanism rather than a different configured provider) —
  still not designed. Cross-provider dispatch (above) covers the case where a
  second provider is available and named; this is the harder case of the
  master managing two concurrent spec-tracks itself.
