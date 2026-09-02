# 014 — worker-context-injection — Design

## Approach

Make the worker prompt a briefing rather than a bare instruction, and pass the spec
down the dispatch chain so it can be one.

`promptFor` gains the spec, the config and the cwd, and emits four things:

1. **What to do** — the task id and text.
2. **Where it lives** — the spec directory, so the worker can read that spec's
   `requirements.md` and `design.md` and know what it's implementing.
3. **What to read first** — the `contextFiles` that actually exist on disk.
4. **What not to touch** — status columns belong to the orchestrator, not the worker.

Existence-filtering happens at prompt-build time, not config-load time: a project may
gain `planning/styles.md` between two `loop run` invocations, and a config default listing
three files shouldn't tell a worker to read one that was never created. Filtering in
`loadConfig` would freeze the answer at process start and make the default list wrong
for most projects.

The prompt names files rather than inlining them. Inlining would put the whole
architecture register into every task's prompt, grow unboundedly as the register grows,
and duplicate what every CLI already does well — read a file it's told to read.

Threading the spec is the mechanical half. `dispatchTask` already receives `SpecRef` and
passes it to the split-pane backends but not to `runNone`; `cli.ts`'s `runTask` (the
in-pane entry point) has `specId`/`specName` as arguments and drops them. Both now build
a `SpecRef` and hand it to `runWorkerSync`. No new plumbing — the values were already in
scope at every call site and simply weren't forwarded.

## Deliverables

- `src/worker.ts` — `promptFor(spec, task, config, cwd)`; `existingContextFiles`
  helper; `runWorkerSync` signature gains `spec` and `cwd`.
- `src/splitPane/none.ts` — `runNone` gains `spec` and forwards it.
- `src/splitPane/index.ts` — `dispatchTask` passes `spec` to `runNone`.
- `src/cli.ts` — `runTask` builds a `SpecRef` from its arguments instead of dropping
  them.

## Sequencing

`worker.ts` first (it defines the signature), then the two call sites. No dependency on
`015` beyond the `Owner` column already landed.

## Open questions / deferred

- Whether the prompt should also name the *roadmap* so a worker can see what comes
  next. Left out deliberately: a worker executing one task shouldn't be reasoning about
  sequencing, and `pickNextSpec` owns that. Revisit if workers start duplicating work.
- Per-task context selection (only the files a given task plausibly needs). Needs
  evidence that the full list is actually a problem; premature now.
- The prompt is English-only. `question-bank.md`'s `tone` dimension can record a
  project's working language, but nothing feeds it into the prompt yet — a real gap for
  a non-English project, deferred rather than guessed at.
