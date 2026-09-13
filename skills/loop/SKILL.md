---
name: loop
description: >
  Loop orchestration: this chat session becomes the master. Reads
  planning/roadmap.md and the next eligible spec's tasks.md, runs each
  agent-owned task with a configured worker — always this session's own
  native sub-agent tool first when its provider matches the worker's, a
  subprocess CLI only otherwise — and asks the user directly, in this
  conversation, when a worker looks like it hit a usage/rate limit. This is
  the only way to run the loop — there is no separate script or CLI.
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
Codex CLI, or another) — nothing here is specific to one provider.

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

Eligibility: a row already `in_progress` (resume that one first), else the
lowest-`Priority` `todo` row whose every `Depends on` entry is itself `done`
**and** that has at least one runnable task (see Phase 2) — a `todo` spec
with an empty or all-`human` `tasks.md` isn't eligible yet, so it can't block
a later spec that actually has work. `—` in `Priority` sorts last. If none is
eligible, say so plainly and stop.

The first time you pick a `todo` row this session, write `looping` into its
`Stage` cell (leave an `in_progress` resume's `Stage` alone — it's already
`looping`).

## Phase 2 — Pick the next task

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
- Take the first `[agent]` row whose status is `todo` or `interrupted` —
  never re-run a `done` row.
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
  again). Report any still-open `[human]` tasks by name. Then either stop, or
  go back to Phase 1 for the next eligible spec if the user wants to keep
  going.

## Phase 3 — Run one task

1. Flip the task's row to `in_progress` (edit only the checkbox/status tag,
   leave the rest of the line untouched).
2. Pick a worker from `config.workers` — round-robin by task order, unless
   the user already told you to prefer a specific one this run.
3. **If your own harness offers a native way to hand off work to a sub-agent
   and its provider matches the picked worker's, use that — always, before
   falling back to a CLI subprocess.** This takes priority over shelling out
   whenever it's available for the matching provider; only fall back to a
   subprocess when it isn't (a different provider, or a harness with no
   native mechanism). It runs in-process and gives you a structured result
   instead of an opaque subprocess. **Live-verified under Claude Code
   (`024`, 2026-09-12): this mechanism is asynchronous** — you dispatch it
   and get a completion notification later with the result, not a live
   stream. That's still "watching it happen" in Phase 3.4's sense (you get
   and read the real result before deciding the outcome) — just not
   synchronously. Don't wait for real-time output from a native sub-agent
   the way you would from a subprocess; wait for its completion signal
   instead. For any other provider, launch that CLI as a
   subprocess: `<cli> <args...> "<briefing>"` — the configured `args` first,
   the whole briefing text last, as one argument (same convention the
   deleted `worker.ts` used, so an existing `args` entry like `["-p"]` still
   means what whoever configured it expects). Give the subprocess a bounded
   timeout (~30 minutes is what the deleted code used) and never feed it
   anything on stdin — a CLI not told it's headless (missing its
   non-interactive flag in `args`) will otherwise hang waiting for input
   until that timeout kills it. Either way, build the same briefing:
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
   - Tell it to do only this task, not start the next one, and not to touch
     the `[owner]`/`[status:...]` tags in `tasks.md` itself — you own those.
4. Read the result — live, streamed output for a CLI subprocess; a
   completion notification for a native sub-agent (see step 3). Decide **with
   your own judgement** whether it succeeded, genuinely failed, or looks like
   it hit a usage/rate limit — there is no fixed pattern-match for this on
   purpose. Read what the worker actually said, the same way you'd read any
   other tool output.
5. Write a record to `<logDir>/<specId>-<taskId>.log` (create the directory
   if needed), even though you already read the result — it's the audit
   trail for anyone reading this later.
6. Decide the outcome:
   - **Succeeded** → flip the row to `done`, with a short note.
   - **Genuinely failed** (not quota-related) → flip to `blocked`, with a
     note naming what actually went wrong.
   - **Looks like a usage/rate limit** → **stop and ask the user, in this
     chat**, which configured worker to retry with, or whether to add a new
     one. Never guess, never silently retry the same exhausted worker, never
     switch providers on your own initiative. Once told, retry this task with
     the chosen worker, and keep using it for subsequent tasks too until told
     otherwise.
7. Go back to Phase 2 for the next task.

## Phase 4 — Stopping

The user can just tell you to stop mid-run — a plain message in this same
conversation, no separate stop-flag file needed, you're not a detached
process. When you stop, report what's left undone (in progress, blocked, or
still todo) so nothing is silently dropped.

## Style rules

- Terse and structural, no filler prose.
- Never invent a different `tasks.md` status-transition rule than the one
  above.
- Never guess which provider to switch to on a suspected usage-limit hit —
  always ask.
