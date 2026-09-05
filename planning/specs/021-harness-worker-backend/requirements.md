# 021 — harness-worker-backend

## Priority: 9 (lowest, speculative)

## What's being built

A second `WorkerSpec` kind, additive alongside today's CLI-spawn one
(`{cli, args}`): an in-process worker that runs a task through the Claude Agent SDK
(`@anthropic-ai/claude-agent-sdk`) instead of `spawnSync`-ing a CLI. Raised alongside
`020` — "make the interview's output plannable in a way an actual agent harness can
execute" — but deliberately not designed in the same pass: it's a different piece of
work (execution backend, not spec format) with real open questions of its own.

Findings from initial research (2026-09-05), to save re-deriving them at design time:

- The SDK ships built-in `Read`/`Write`/`Edit`/`Bash` tools and runs headless via
  `query({ prompt, options: { cwd, maxTurns } })`, returning a structured result
  comparable to today's captured stdout/stderr.
- It is **Claude-only** — no equivalent exists for `codex`/`opencode`. Those keep
  CLI-spawning; this is one more worker *kind*, never a replacement for the existing
  one.
- Headless mode has **no interactive permission prompts** — `allowedTools`/
  `permissionMode`/`canUseTool` must be pre-configured. That's a real decision
  `loop-setup`'s Q&A doesn't ask for yet, and must never default silently (matches
  this repo's existing "never install/configure silently" rule).
- Isolation wrinkle: today every task is either its own OS process (split-pane modes)
  or, under `splitMode: 'none'` (`splitPane/none.ts`), still a `spawnSync` subprocess
  of the master — a crash or hang in the worker can't take the master down with it. An
  in-process SDK call under `'none'` would remove that boundary unless it's
  deliberately wrapped in its own child process too. Design must decide this, not lose
  it by accident.
- The call chain (`worker.ts`'s `runWorkerSync` → `splitPane/none.ts` → `cli.ts`'s
  `runTask`) is synchronous today; an SDK branch is async (`query()` is an async
  generator), so this is an async branch alongside the sync CLI path, not a rewrite of
  it.

## Who/what it serves

Projects whose only configured worker is Claude, wanting tighter integration (no
subprocess overhead, structured results) without losing `codex`/`opencode` support for
projects that mix workers.

## Hard constraints

- **Additive, not a replacement.** Existing CLI-spawn workers must keep working
  unchanged; nothing about `WorkerSpec`'s current `{cli, args}` shape may break.
- **No silent permission defaults.** `allowedTools`/`permissionMode` must be an
  explicit, confirmed `.specloop/loop.config.json` field.
- **Don't lose crash isolation** that `runNone` gets for free today under
  `splitMode: 'none'` — decide deliberately how an SDK worker preserves an equivalent
  boundary.
- Worker-context injection (`014`) must be honored the same way for an SDK worker as
  for a CLI one — the prompt still names the spec directory and context files; the SDK
  doesn't get a shortcut to skip that contract.

## Acceptance criteria

*(To be made concrete at design time — not yet designed.)*

- An SDK-backed worker can complete a real task end-to-end against a fixture repo,
  producing a result comparable to what a stub CLI worker produces today (see `014`
  T9's verification table for the bar to match).
- A mixed `workers` config (one CLI worker, one SDK worker) round-robins correctly.
- `codex`/`opencode`-only configs are provably unaffected (no new required fields,
  no behavior change).

## Out of scope

- Building an SDK-equivalent for `codex`/`opencode` — none exists to build against.
- Replacing CLI-spawning as the default or only worker kind.
- Anything about `tasks.md`'s file format — that's `020`, already done; this spec
  only concerns the execution backend.
