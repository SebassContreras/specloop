---
name: loop
description: >
  Loop orchestration: this chat session becomes the master. Reads
  planning/roadmap.md and works through eligible specs' tasks.md files,
  always via this session's own harness/provider (never round-robinning to a
  different configured CLI), dispatching independent tasks as parallel
  sub-agents when their scopes don't overlap, and asks the user directly, in
  this conversation, when it looks like it hit a usage/rate limit. Runs every
  eligible spec in turn unless the user names one. The user can also
  explicitly direct a different spec/task to a different configured provider
  to run alongside the master's own work. This is the only way to run the
  loop — there is no separate script or CLI.
when_to_use: >
  Use when the user wants to actually work the backlog now, in this chat —
  phrasing like "let's run the loop", "start working through the backlog",
  "/specloop:loop". Requires specloop:loop-setup to have already run
  (.specloop/loop.config.json must exist) — refuse and point there if not.
  Different from specloop:loop-setup, which only asks Q&A and writes that
  config: this is the skill that does the work.
---

# specloop: loop

**You are the master.** There is no separate orchestrator process, script, or
CLI watching over you, and none to install — you read the state, launch the
workers, and decide, right here, in this conversation. This holds under
whichever compatible harness is running this skill (Claude Code, OpenCode,
Codex CLI, GitHub Copilot CLI, Cursor, Antigravity CLI, or another) — nothing here is
specific to one provider.

## Phase 0 — Preconditions

Refuse and point at `specloop:loop-setup` if `.specloop/loop.config.json`
doesn't exist. Read it: `workers` (array of `{cli, args}`), `logDir`,
`contextFiles`, `language`. A config still written in the legacy single
`"workerCli"`/`"workerArgs"` shape (predates the `workers` array) is
equivalent to a one-element `workers` array — treat `{cli: workerCli, args:
workerArgs}` as `workers[0]` rather than refusing or asking the user to
rewrite it.

## Phase 1 — Pick the next spec

Read `planning/roadmap.md`'s table yourself: `| ID | Plan | Status | Depends
on | Stage | Priority |`, positional — the first four cells are `ID`/`Plan`/
`Status`/`Depends on`; `Stage` and `Priority` follow them in that order, used
below. Ignore any further trailing cell you don't recognize.

**If the user named a specific spec, work only that one** — run Phases 2-4 on
it, then stop and report, never moving on to a different spec on your own.

**Otherwise, eligibility:** a row already `in_progress` (resume that one
first), else the lowest-`Priority` `todo` row whose every `Depends on` entry
is itself `done` **and** that has at least one runnable task (see Phase 2) —
a `todo` spec with an empty or all-`human` `tasks.md` isn't eligible yet, so
it can't block a later spec that actually has work. `—` in `Priority` sorts
last. Once a spec resolves (Phase 2's roll-up reaches `done`, `blocked`, or
`interrupted`, or its only remaining work is `[human]`), **come back to this
phase automatically and pick the next eligible spec** — keep going until
none is eligible, rather than stopping after one. This is the default; the
user can still tell you to stop at any point (Phase 4). If none is eligible
when you reach this phase, say so plainly and stop.

The first time you pick a `todo` row this session, write `looping` into its
`Stage` cell (leave an `in_progress` resume's `Stage` alone — it's already
`looping`).

## Cross-provider dispatch (optional, only when the user explicitly asks)

Everything above is your own work, always through your own matched provider
(Phase 3) — never a different configured one. Separately, **the user can
explicitly direct a different spec or task to a different configured
provider, to run alongside your own work** — e.g. "do `007` yourself, send
`008` to `codex`." When they do:

1. Confirm that provider has a matching entry in `config.workers`; if not,
   ask before doing anything — never invent one.
2. Launch it as a subprocess for that spec/task using that entry's `cli`/
   `args` (same briefing-building and subprocess rules as Phase 3 step 2),
   as a background process — it runs concurrently with your own Phase 1-4
   work, not instead of it, and doesn't block it either way.
3. Keep working your own assigned spec via Phase 1-4 in the meantime.
4. When the dispatched work completes, apply Phase 3's same result-handling
   (verify against disk, log, decide outcome, write status) before reporting
   it, whenever that happens to be relative to your own progress.

This is always explicit and user-initiated — a named spec/task **and** a
named provider, both from the user. Never start a second stream on your own
initiative, and never use this to offload your *own* assigned work onto
another provider just to go faster — that's not what it's for; a suspected
usage-limit hit on your own work is still Phase 3 step 5's territory (ask
first, same as always).

## Phase 2 — Pick the next batch of tasks

Read that spec's `planning/specs/<id>-<name>/tasks.md`. Grammar (fixed, never
reformat a line you're not changing):

```
- [ ] T001 [agent] [status:todo] Task text here
      └─ optional note line, exactly 6 spaces then └─
```

The checkbox reflects `done` vs. not; `[status:...]` carries the other four
states (`todo` · `in_progress` · `blocked` · `interrupted` · `done`). A task
line is identified only by starting at column 0.

- Never touch a `[human]` row — report it, skip it, move on.
- Consider `[agent]` rows whose status is `todo` or `interrupted` — never
  re-run a `done` row.
- If none remain: roll this spec's status up —
  - any `[agent]` task `blocked` → `blocked`
  - else any `[agent]` task `interrupted` → `interrupted`
  - else every `[agent]` task `done` → `done`
  - else → `in_progress`

  (`[human]` tasks don't hold a spec open — a spec whose only remaining work
  is the user's counts as done from the loop's side and is reported
  separately.) Write that status into `planning/roadmap.md`'s matching row.
  **If the status you're writing is `done`, also write `—` into that same
  row's `Stage` cell** in the same edit — `Stage` tracks which skill a spec
  still needs, and a `done` spec needs none. Leave `Stage` untouched for every
  other status (`blocked`/`interrupted`/`in_progress` all still need `loop`
  again). Report any still-open `[human]` tasks by name, then go back to
  Phase 1 (it decides whether to continue to another spec or stop).

**Otherwise, build a batch to run together**, starting from the first
runnable row: add the next runnable row to the batch only while it's
genuinely independent of every task already in the batch — no ordering the
spec's own `design.md` (its Sequencing section, if it has one) implies
between them, **and no overlap in the file(s)/section(s) each one's task text
says it touches** (two tasks editing the same file are not safe to
parallelize even with no stated logical dependency — they can overwrite each
other). Stop extending the batch at the first row that fails either check;
run that row in the next batch instead. **When independence is genuinely
unclear, don't guess — treat it as not independent** and give it its own
batch. A batch of one is the normal, expected outcome whenever a spec's
tasks mostly touch shared files — not a failure to parallelize.

## Phase 3 — Run the batch

**Pick the worker once per batch, not per task: the `config.workers` entry
whose `cli` matches this session's own harness/provider** (e.g. `claude`
under Claude Code, `opencode` under OpenCode, `codex` under Codex CLI, `copilot` under
GitHub Copilot CLI, `cursor-agent` under Cursor, `agy` under Antigravity CLI) —
**never round-robin across the other configured entries.** The rest of
`config.workers` exists for portability (a different session, under a
different harness, finds its own matching entry in the same file) and for
the explicit exception in step 5, not for splitting load within one run. If
no entry matches this session's own provider, say so plainly and ask the
user how to proceed (add a matching entry, or use an existing one as a
subprocess anyway) — never silently pick one.

1. Flip every task's row in the batch to `in_progress` (edit only the
   checkbox/status tag on each line, leave the rest untouched).
2. **If your own harness offers a native way to hand off work to a sub-agent,
   use that for every task in the batch, dispatched together so independent
   ones actually run concurrently** — this is the default and expected path
   whenever the matched worker is this session's own provider. It runs
   in-process and gives you a structured result instead of an opaque
   subprocess. **Live-verified under Claude Code (`024`, 2026-09-12): this
   mechanism is asynchronous** — you dispatch it and get a completion
   notification later with the result, not a live stream. That's still
   "watching it happen" in step 4's sense (you get and read the real result
   before deciding the outcome) — just not synchronously, and not
   simultaneously across a batch either: read and act on each completion as
   its own notification arrives. Don't wait for real-time output the way you
   would from a subprocess. If this harness has no native sub-agent
   mechanism at all, launch the matched worker's `cli` as a subprocess
   instead — still the same provider as the master's own, launched once per
   task in the batch (background processes, not one at a time) so
   independent tasks still run concurrently: `<cli> <args...> "<briefing>"`,
   configured `args` first, the whole briefing text last as one argument
   (same convention the deleted `worker.ts` used). Give each subprocess a
   bounded timeout (~30 minutes is what the deleted code used) and never
   feed it anything on stdin — a CLI not told it's headless (missing its
   non-interactive flag in `args`) will otherwise hang waiting for input
   until that timeout kills it. Either way, build each task's own briefing:
   - Name the repo's working directory and the task: `Task <id> of spec
     <specId>-<specName>: <task text>`.
   - Tell it to read `planning/specs/<specId>-<specName>/requirements.md` and
     `design.md` before starting.
   - If `contextFiles` has any entries that exist on disk, tell it to read
     those too — the project's stack, conventions and style rules — and
     follow them. Skip any entry that doesn't exist; don't tell a worker to
     read a file that isn't there.
   - If `config.language` is set, tell it to write all user-facing text,
     comments, and commit/PR messages in that language.
   - Tell it to do only this one task, not start any other, and not to touch
     the `[owner]`/`[status:...]` tags in `tasks.md` itself — you own those.
3. For each task's result as it arrives — live, streamed output for a CLI
   subprocess; a completion notification for a native sub-agent (see step
   2) — decide **with your own judgement** whether it succeeded, genuinely
   failed, or looks like it hit a usage/rate limit — there is no fixed
   pattern-match for this on purpose. Read what the worker actually said,
   the same way you'd read any other tool output, and **verify the actual
   change against the file(s) on disk before trusting the worker's own
   report of what it did.**
4. Append a record for each task to `<logDir>/<specId>.log` — **one log file
   per spec, not per task** (create the directory, and the file if it
   doesn't exist yet, adding a header line naming the spec). Each task gets
   its own dated section within that file, in the order it resolved. Always
   written by you, the master — never delegate this to a sub-agent, even
   when a batch ran concurrently, so two tasks finishing near-simultaneously
   never race on the same append. This is the audit trail for anyone reading
   later, letting them read one spec's whole run in order rather than
   piecing it together from separate per-task files.
5. Decide each task's outcome independently — one task's outcome never
   blocks writing another's:
   - **Succeeded** → flip that row to `done`, with a short note.
   - **Genuinely failed** (not quota-related) → flip to `blocked`, with a
     note naming what actually went wrong.
   - **Looks like a usage/rate limit** → **stop and ask the user, in this
     chat**, what to do — retry, wait, or (only if the user explicitly
     directs it) run this one task through a different configured provider's
     CLI as a one-off exception. Never guess, never silently retry the same
     exhausted worker, and never switch away from the master's own provider
     on your own initiative even here. Once told, follow that instruction for
     this task and say whether it applies going forward too.
6. Once every task in the batch has resolved, go back to Phase 2 for the
   next batch.

## Phase 4 — Stopping

The user can just tell you to stop mid-run — a plain message in this same
conversation, no separate stop-flag file needed, you're not a detached
process. Flip every task still `in_progress` at that moment to `interrupted`
in its `tasks.md` — with batching, that can be more than one task at once,
not just a single in-flight row. Report what's left undone (interrupted,
blocked, or still todo) so nothing is silently dropped.

## Style rules

- Terse and structural, no filler prose.
- Never invent a different `tasks.md` status-transition rule than the one
  above.
- Never guess which provider to switch to on a suspected usage-limit hit —
  always ask.
