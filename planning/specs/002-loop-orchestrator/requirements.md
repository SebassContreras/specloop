# 002 — loop-orchestrator

## Requirements (draft — to be reviewed)

- Lives and runs in the **target repo**, not in `specloop`. `specloop` only
  generates/configures it during scaffolding.
- **CLI-agnostic**: must be able to invoke any installed CLI as a worker —
  `claude`, `codex`, `opencode`, etc. — configurable per repo/run, not hardcoded to
  one.
- **One process, no visual terminals**: the master runs every task sequentially,
  inline in its own process — no split panes, no detached windows, nothing else
  opened for the user to watch. **Reversed 2026-09-11**: the original design below
  spawned a live terminal split (Windows Terminal / tmux) per sub-agent; live-tested
  end-to-end in `006` T012, then dropped by explicit user decision in favor of this
  simpler shape — see `design.md`'s "Execution model" for what stayed (streaming a
  worker's own output live to the master's terminal, from `002` T22) and what was
  removed (`splitMode`, `windowsTerminal.ts`/`tmux.ts`, `_run-task`).
- **Safe stop**:
  - Stop — do not start any new task.
  - Mark the task in progress as `interrupted` in its corresponding `tasks.md` (not
    `done` nor `todo`).
  - Leave a log of where it stopped, so it can be resumed later.
- **Quota-exhaustion recovery lives in the interactive skill, not the script.**
  First built as a regex heuristic (`quota.ts`) plus a blocking `readline`
  prompt directly in the deterministic `loop run` CLI — reasoning that the
  master always holds the terminal now that split panes are gone. **Corrected
  same day**: the user's actual intent is a chat session *being* the master,
  which may or may not be the same thing as this Node script — and an
  unattended `loop run` (CI, or nobody watching) has nobody to answer a
  prompt regardless. Split into two answers: `loop run` reverted to plain
  exit-code-only `blocked` on any failure, no judgement, nothing asked;
  `skills/loop/SKILL.md` (new) is the chat-driven alternative — the agent
  running it reads worker output itself, decides success/failure/quota-
  exhaustion with real judgement (no regex), and asks the user directly in
  the conversation which worker to switch to. See `design.md`.
- **Harness synergy**: because the interactive skill's master is a live agent
  session, a task whose worker is the same provider as whichever harness is
  running the skill can be handed to that harness's own native sub-agent
  mechanism instead of shelled out as a CLI subprocess — phrased generically
  in the skill so it holds under any compatible harness, not Claude-Code-only
  (`022`'s rule). Narrows `021` (harness-worker-backend) to just the
  deterministic `loop run` path, which has no harness of its own to prefer.
- Reads the target repo's `planning/roadmap.md` as the index of which spec is next and its
  dependencies.
- **specloop ships a reference implementation**, not just a spec: a working
  orchestrator framework lives in this repo (e.g. under `framework/`) that the
  scaffold step generates/copies into the target repo — a real starting point, not
  something the user has to write from scratch per repo.
- **Single console command**: once generated into the target repo, the orchestrator
  must be startable with one command (exact name/shape decided in `design.md`) that
  reads that repo's `planning/roadmap.md`, picks the next eligible spec (status `todo`
  with satisfied `Depends on`), and starts working through its `tasks.md`.

## Notes

- Reviewed `opencode-orchestrator` (separate repo, built the same day): it solves a
  similar problem (parallel worktrees, wt split-panes, model fallback) but the user
  doesn't want to build on top of that implementation as-is ("doesn't like how it's
  made"). Evaluate recycling specific pieces later — it is not the base for this spec
  for now.

## Out of scope

- Claude Code's native `Workflow` tool (doesn't cover non-Claude CLIs).
- Deciding the split mechanism or the orchestrator's runtime right now — that's
  design, goes in `design.md` when we get to it.
