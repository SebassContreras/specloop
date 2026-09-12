# 024 — loop-skill-verification

## Why this exists

`skills/loop/SKILL.md` and `skills/loop-setup/SKILL.md` were rewritten on
2026-09-12 when `framework/orchestrator/` (the deterministic `loop run` CLI)
was deleted (`002-loop-orchestrator`). The rewrite ported real logic that used
to be code — the eligibility rule (`roadmap.ts`'s `pickNextSpec`), the
`tasks.md` checkbox grammar (`checklist.ts`), the status-rollup rule
(`cli.ts`'s `rollUpStatus`), and the worker-prompt shape (`worker.ts`'s
`promptFor`) — into the skill's own prose, since there is no code left for an
agent to defer to when the text is ambiguous. That porting was done by
reading the deleted source carefully before it was removed, not by testing
the result. **Nobody has actually opened a fresh chat, invoked
`/specloop:loop-setup` then `/specloop:loop`, and watched the rewritten text
drive a real run since.** `planning/handoff.md`'s "Not verified" section
already flags this; this spec is where that gets closed out.

This is the direct successor to what `007-orchestrator-unit-tests` and
`014-worker-context-injection` T9 verified before — both against code that no
longer exists. `007` was retired the same day (nothing to unit-test anymore);
`014` T9's own fixture/table is kept as a historical record of what the *old*
`worker.ts` did, not a substitute for re-verifying the *skill text* that
replaced it.

## What's being verified

A live run of `specloop:loop-setup` then `specloop:loop` against a scratch
fixture repo (local-only, under gitignored `test/`, same as every other
fixture in this repo — see `017`), using a stub worker CLI that records
whatever prompt it actually receives (same technique `014` T9 used: a stub is
the better instrument here because it makes the exact prompt text assertable,
not a real model's variable output).

Specifically, that the rewritten skill text alone — no code to fall back on —
correctly:

- Picks the right next spec: resumes an `in_progress` row before any `todo`
  one; among eligible `todo` rows, prefers the lower `Priority`; skips a
  `todo` row with no runnable task instead of getting stuck on it; refuses
  cleanly when nothing is eligible.
- Reads and writes the `tasks.md` checkbox grammar without touching a line
  it didn't intend to (checkbox, `[status:...]` tag, note line format).
- Skips `[human]` rows and never touches them.
- Builds the worker's prompt correctly: names the task and spec, tells the
  worker to read `requirements.md`/`design.md`, lists only the `contextFiles`
  that actually exist on disk, includes the `language` line only when
  `config.language` is set, and tells the worker not to touch
  `tasks.md`'s own status tags.
- Rolls a spec's status up correctly on task exhaustion (`blocked` beats
  `interrupted` beats `done`; a remaining `[human]` task doesn't hold it
  open) and writes it into `planning/roadmap.md`'s matching row — nothing
  else in that row.
- Writes `looping` into `Stage` the first time it picks a `todo` row, and
  leaves an `in_progress` resume's `Stage` alone.
- Handles a config still in the legacy single `workerCli`/`workerArgs` shape
  as a one-element `workers` array, per `skills/loop`'s Phase 0.
- On a worker exit that looks like a genuine failure, flips the task to
  `blocked` with a note — no prompt to the user.
- On a worker exit that looks like a usage/rate-limit hit, stops and asks the
  user, in the conversation, which configured worker to switch to — never
  guesses, never silently retries the exhausted one.
- Responds to "stop" mid-run the way Phase 4 describes: marks the in-flight
  task `interrupted`, reports what's left, starts nothing new.
- `skills/loop-setup`'s all-`human`-backlog check (Phase 0) correctly detects
  when no `[agent]` task is runnable anywhere and asks before proceeding,
  instead of silently configuring a loop with nothing to do.
- Advances to the next eligible spec on its own when the user says to keep
  going after one spec is exhausted (Phase 2's "go back to Phase 1").

## Out of scope

- The harness-synergy preference (native sub-agent vs. CLI subprocess) —
  genuinely requires a harness other than the one running this verification
  to confirm the "prefer your own harness" branch actually fires correctly
  under a different provider. Flag as still-unverified rather than fake it
  with a single-harness run; a follow-up note in `planning/handoff.md` is
  enough for now, not a blocking acceptance criterion here.
- Automating this as CI — these are Q&A instructions run by an interactive
  agent, not scriptable (same reasoning `006-e2e-smoke-testing` and `022`'s
  audits already used). Manual, human-supervised live run only.
- Re-deriving `014` T9's own historical table — that recorded what the old
  `worker.ts` did and stays as-is; this spec's table (see `design.md`) is
  independent, against the current skill text.

## Acceptance criteria

- A single annotated live-run table (see `design.md`) covers every bullet
  under "What's being verified" above, each with a concrete observed result,
  not just a checkmark.
- Any behavior that doesn't match the skill's own stated rule is fixed in
  `skills/loop`/`skills/loop-setup` directly (fix-forward, same as `006`'s
  own rule), and the fix is re-verified before this spec closes.
