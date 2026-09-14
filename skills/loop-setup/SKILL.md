---
name: loop-setup
description: >
  One-time setup for running the loop in this repo: asks which worker CLI(s)
  to use, confirms the context files a worker must read, and writes
  .specloop/loop.config.json. Nothing to install — specloop:loop reads this
  config directly.
when_to_use: >
  Use when the user wants to configure the loop so their backlog can run.
  Trigger on phrasing like "set up the loop", "let's get the loop running
  here", "configure specloop's loop in this repo". This is a separate,
  deliberate step — never chain it automatically after specloop:start,
  specloop:design-closing, or specloop:task-breakdown.
---

# specloop: loop-setup

You are configuring the loop **inside the target repo**. This is a one-time,
deliberately-invoked step — do not run it as a side effect of any other
specloop skill. There is nothing to install or link: `specloop:loop` reads
`.specloop/loop.config.json` directly, in whatever chat session runs it.

## Phase 0 — Read existing state

Read `.specloop/loop.config.json` if it exists — `specloop:start` writes it
during bootstrap. Anything already answered there is not re-asked; anything
left `"TBD"` is.

**Do not refuse on an empty `tasks.md`.** Configuring the loop is not
execution: nothing here runs a task, and `specloop:loop` already reports
cleanly when there's nothing to do. Gating configuration on a populated
`tasks.md` blocks a freshly-scaffolded repo from ever being set up. Report
the backlog state in Phase 2 instead.

**Check for an all-`human` backlog before Phase 1.** Look at the specs
`specloop:loop` would actually consider next: `planning/roadmap.md` rows with
status `todo`/`in_progress` whose dependencies are satisfied, or already
`in_progress`. Read each one's `tasks.md`. If every task in all of them is
`[human]` — no `[agent]` task is currently runnable anywhere — say so plainly
before asking the worker-CLI question: a worker CLI has nothing to run yet,
so setup would configure a loop that never fires this round. Ask whether to
continue anyway (e.g. to have it ready for when an agent task becomes
eligible, such as once a dependency clears) or stop here. This is common for
a project whose current spec is mostly human-owned work (research, approvals,
physical steps) — not a bug, just worth naming before walking through a Q&A
whose answer won't be exercised yet.

## Phase 1 — Guided config Q&A (only what's missing)

Ask, one at a time, waiting for each reply:

1. **Worker CLI** — "Which CLI(s) might ever run this loop — `claude`,
   `codex`, `opencode`, or another command on PATH? List every one you might
   use, even from a different machine or harness later — the loop always
   picks whichever entry matches the session actually running it, never
   splits work across the others." → `workers`, an array of `{ "cli": "...",
   "args": [...] }`. More than one entry is for portability (a different
   session, under a different harness, finds its own matching entry) and as
   an explicit fallback list the loop can ask the user, mid-run, to switch
   into if the matched one looks like it hit a usage/rate limit — never a
   round-robin split within one run. The worker always runs headlessly (no
   TTY, stdin
   closed) — a CLI invoked without its non-interactive flag will hang. **Never
   ask the user for a known CLI's headless flag — it's a fixed fact of that
   CLI, not a preference.** Use this map: `claude` → `-p`, `codex` → `exec`,
   `opencode` → `run`. Only ask "what's its headless/non-interactive flag?"
   for a CLI not in that map. Mention this once, plainly: `specloop:loop`
   always uses whichever entry's provider matches the session running it,
   and prefers that harness's own native sub-agent mechanism over this CLI
   when one's available — the `args` given here matter when the harness has
   no native mechanism, or when the user explicitly asks to fall back to a
   different configured provider (e.g. on a suspected usage limit).
2. Default `logDir` to `.specloop/logs` unless the user wants something else.
3. **Context files** — confirm `contextFiles` lists the files a worker must
   read before working (default `["AGENTS.md", "planning/architecture.md", "planning/styles.md"]`;
   non-existent entries are skipped at run time). If any configured `workers[].cli` is not
   `claude`, say plainly that `AGENTS.md` is the only context that CLI auto-loads, so
   this list is how it learns the project's stack and conventions.

## Phase 2 — Write config, report backlog state

1. Write or update `.specloop/loop.config.json` from the Phase 1 answers, preserving
   anything `specloop:start` already wrote:
   ```json
   {
     "workers": [
       { "cli": "<answer>", "args": ["<headless flag>"] }
     ],
     "logDir": ".specloop/logs",
     "contextFiles": ["AGENTS.md", "planning/architecture.md", "planning/styles.md"],
     "language": "<preserve if already set by specloop:start>"
   }
   ```
   A single-worker config also works written as the legacy `"workerCli"`/`"workerArgs"`
   shape, but write the `workers` array form here going forward. **Never drop an
   existing `"language"` field** when rewriting this file — this skill doesn't ask
   about it (that's `specloop:start`'s Phase 5), it only must not silently erase it.
2. Verify `.specloop/.gitignore` exists and reads `logs/*` + `!logs/.gitkeep`
   (`specloop:start` writes it) — create it if the repo was scaffolded before
   that existed, or fix it if it's the older bare `logs/` line (which also
   ignores `logs/.gitkeep` itself, defeating it — `planning/fix/006`).
3. Tell the user setup is done: `specloop:loop`, run in a chat session, is the
   way to actually work the backlog whenever they choose to.

Then report what the loop would actually find: if no spec has agent-runnable tasks
yet, say so and name the next step (`specloop:design-closing`, then
`specloop:task-breakdown`, on a named spec). If some specs have only `human` tasks,
name them — the loop will skip those.

**Do not invoke `specloop:loop` automatically.**

## Style rules

- Terse and structural, no filler prose.
- Never guess `workers` — always ask; explicitly user-configurable.
