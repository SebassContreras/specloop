# 024 — loop-skill-verification — Design

## Approach

One scratch fixture repo (local-only, under gitignored `test/` — never
committed, per `planning/architecture.md`'s fixed rule), built by hand or via
a throwaway `specloop:start` run, containing:

- `AGENTS.md`, `planning/architecture.md`, `planning/styles.md` — so
  `contextFiles`' default list has something real to filter against.
- `planning/roadmap.md` with at least two specs: one with a mix of `[agent]`
  and `[human]` tasks, one with only `[human]` tasks (to exercise
  `loop-setup`'s all-`human`-backlog check), and a `Priority` column with at
  least two eligible `todo` rows to confirm the lower one is picked first.
- `.specloop/loop.config.json` — written by actually running
  `specloop:loop-setup` against this fixture first (not hand-authored), so
  that skill gets verified too, not just `specloop:loop`.
- A stub worker CLI: a short script (e.g. `node stub-worker.js`) that appends
  its received argv and the full prompt text to a file, then exits 0 (success
  case), non-zero with a plain error (genuine-failure case), or non-zero with
  usage-limit-shaped wording in its output (quota case) — configurable via an
  env var or arg so the same stub covers all three without three separate
  scripts.

This mirrors `014` T9's fixture almost exactly (same rationale: a stub makes
the exact prompt text assertable, which is what most of `requirements.md`'s
list is actually about) — the difference is what's under test. T9 verified
`worker.ts`'s `promptFor()`, code. This verifies `skills/loop`'s Phase 3 text,
read and followed by a live agent, with no code backing it at all.

## Sequencing

Cannot be scripted or run unattended — every step needs a live agent actually
reading the skill text and making the judgement calls it describes (same
reasoning `001` T30 and `006` T010 already established for this repo's other
live-interview/live-pipeline checks). One human-supervised session, in order:

1. Run `specloop:loop-setup` against the fixture. Confirm it asks the
   worker-CLI question, confirms `contextFiles`, and — before that — correctly
   flags the all-`human` spec and asks whether to continue anyway.
2. Run `specloop:loop`. Let it pick a spec, run through several tasks hitting
   each of the stub's three exit modes in turn (edit the fixture's
   `tasks.md`/env var between tasks to force each case), then tell it to
   stop mid-task.
3. Record the actual observed behavior against each bullet in
   `requirements.md`'s list, in a table (same shape as `014` T9's):

   | Behaviour | Result |
   |---|---|
   | ... | ... |

4. Fix forward in `skills/loop`/`skills/loop-setup` for anything that didn't
   match the stated rule, then re-run just the affected step to confirm.

## Open questions / deferred

- Verifying the harness-synergy branch (native sub-agent vs. CLI subprocess)
  needs a second run under a harness whose provider actually matches a
  configured worker, which this repo's own dogfooding session may not be able
  to exercise in one sitting. Deferred — see `requirements.md`'s Out of scope.
