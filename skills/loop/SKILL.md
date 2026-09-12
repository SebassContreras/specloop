---
name: loop
description: >
  Interactive loop orchestration: this chat session becomes the master. Reads
  planning/roadmap.md and the next eligible spec's tasks.md, runs each
  agent-owned task with a configured worker (a subprocess CLI, or this
  session's own native sub-agent tool when the provider matches), and asks
  the user directly, in this conversation, when a worker looks like it hit a
  usage/rate limit.
when_to_use: >
  Use when the user wants to actually work the backlog now, in this chat —
  phrasing like "let's run the loop", "start working through the backlog",
  "/specloop:loop". Requires specloop:loop-setup to have already run
  (.specloop/loop.config.json must exist) — refuse and point there if not.
  Different from specloop:loop-setup, which only installs/configures: this is
  the skill that does the work.
---

# specloop: loop

**You are the master.** There is no separate orchestrator process watching
over you — you read the state, launch the workers, and decide, right here,
in this conversation. `framework/orchestrator/`'s `loop run` is a different,
deterministic alternative for when nobody is watching (see the end of this
file) — this skill is the version for a chat someone is actually in.

## Phase 0 — Preconditions

Refuse and point at `specloop:loop-setup` if `.specloop/loop.config.json`
doesn't exist. Read it: `workers` (array of `{cli, args}`), `logDir`,
`contextFiles`, `language`.

## Phase 1 — Pick the next spec

Read `planning/roadmap.md`'s table yourself. Same eligibility rule the
deterministic orchestrator uses (`framework/orchestrator/src/roadmap.ts`'s
`pickNextSpec` — read it if the table's shape is ever ambiguous, don't invent
a different rule): a `todo` row whose every `Depends on` entry is itself
`done`, or a row already `in_progress` (resume that one first). If none is
eligible, say so plainly and stop. Among multiple eligible `todo` rows, prefer
the lower `Priority` number (`—` sorts last); `pickNextSpec` itself doesn't do
this yet (`015` T019), but you're not bound by its code, only its eligibility
rule.

The first time you pick a `todo` row this session, write `looping` into its
`Stage` cell (leave `in_progress` resumes alone — it's already `looping`).

## Phase 2 — Pick the next task

Read that spec's `planning/specs/<id>-<name>/tasks.md`. Grammar (fixed, from
`framework/orchestrator/src/checklist.ts` — never reformat a line you're not
changing):

```
- [ ] T001 [agent] [status:todo] Task text here
      └─ optional note line, exactly 6 spaces then └─
```

- Never touch a `[human]` row — report it, skip it, move on.
- Take the first `[agent]` row whose status is `todo` or `interrupted`.
- If none remain: roll this spec's status up the same way the deterministic
  orchestrator does (`blocked` if any `[agent]` task is `blocked`,
  `interrupted` if any is `interrupted`, `done` if every `[agent]` task is
  `done`, else `in_progress`) and write that into `planning/roadmap.md`'s
  matching row. Report any still-open `[human]` tasks by name. Then either
  stop, or go back to Phase 1 for the next eligible spec if the user wants to
  keep going.

## Phase 3 — Run one task

1. Flip the task's row to `in_progress` (edit only the checkbox/status tag,
   leave the rest of the line untouched).
2. Pick a worker from `config.workers` — round-robin by task order, unless
   the user already told you to prefer a specific one this run.
3. **Prefer your own native way of spawning a sub-agent over shelling out a
   CLI, when your own harness already is the same provider as the picked
   worker.** E.g. if this conversation is itself running under a harness
   whose provider matches `workers[i].cli`, and that harness offers a native
   way to hand off a task to a sub-agent, prefer that — it runs in-process,
   gives you a structured result, and you can watch it as it works, instead
   of an opaque subprocess. For any other provider, launch that CLI as a
   subprocess with its configured headless/non-interactive flag from
   `args`, using the same prompt shape
   `framework/orchestrator/src/worker.ts`'s `promptFor()` builds: name the
   spec directory, tell it to read `requirements.md`/`design.md` and any
   existing `contextFiles`, give it the task text, and tell it not to start
   the next task or touch `tasks.md`'s Status/Owner columns itself.
4. Watch the output as it happens. Decide **with your own judgement** whether
   it succeeded, genuinely failed, or looks like it hit a usage/rate limit —
   there is no fixed pattern-match for this on purpose. Read what the worker
   actually said, the same way you'd read any other tool output.
5. Write a record to `<logDir>/<specId>-<taskId>.log` (create the directory
   if needed) — even though you watched it live, keep the same audit trail
   the deterministic orchestrator leaves.
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

## Relationship to `loop run` (the Node CLI)

`framework/orchestrator/`'s `loop run` still exists as the **deterministic,
unattended** alternative — for CI, or a run genuinely nobody is watching. It
has no judgement: it matches a worker's success/failure by exit code alone,
and never asks anything — a suspected usage-limit hit there just becomes an
ordinary `blocked` task for a human to resolve later, the same as any other
failure. This skill is the interactive alternative, for a chat someone is
actually in: no separate process, no split panes, judgement instead of a
fixed pattern, and it can ask instead of only ever blocking.

## Style rules

- Terse and structural, no filler prose.
- Never invent a different `tasks.md` status-transition rule than the one
  above — when unsure, read `framework/orchestrator/src/checklist.ts` and
  `tasks.ts` rather than guessing.
- Never guess which provider to switch to on a suspected usage-limit hit —
  always ask.
