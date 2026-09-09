# Handoff — 2026-09-09

Written after closing `001` T030 — the live interactive interview run that was the last
thing blocking `001` from `done`. Branch: `main`.

**This file is not the source of truth and must not become one.** `planning/roadmap.md`
owns order and status; each spec's `tasks.md` owns the work. What's below is only the
part *not* on record: why things are the way they are, which traps to avoid, and where
judgement is still needed.

To see what's actually open:

```bash
node scripts/check-skill-consistency.mjs        # 38 static checks over the 4 skills
cd framework/orchestrator && pnpm exec tsc --noEmit && pnpm exec eslint src
grep -rnE "\[status:(todo|in_progress|blocked|interrupted)\]" planning/specs/*/tasks.md
```

---

## What just happened: `001` T030

Ran `/specloop:start` for real, against a throwaway repo (`test/ops-onboarding-repo/`,
local-only, gitignored — full script and results in its `NOTES.md`), using a scripted
operations/process persona (vendor onboarding at a logistics company) with deliberately
planted edge cases rather than free improvisation, so the run would actually exercise the
things T030 needed evidence for instead of leaving it to chance.

Full pass: bearability (whole arc, no fatigue point, stopped voluntarily), closing-sweep
convergence (5/5 phases ended after exactly two clean rounds), follow-up triggers (2/2
planted vague answers got a follow-up question), skip protocol (2/2 planted declines
recorded with reason), the `visual-surface` gate, and the stop-anytime + handoff rule
(`T032`) — this very file is proof of the last one working correctly at the meta level.
Bonus: the run was answered in Spanish throughout and `tone`'s language field correctly
propagated to `.specloop/loop.config.json` and every written doc — closes an old open
question from the 2026-09-02 handoff ("prompt is English-only, nothing consumes it").
Full detail, including the exact planted markers and what they proved, is in `001`'s
`tasks.md` T030 note and `test/ops-onboarding-repo/NOTES.md`.

One real defect surfaced — see below.

---

## What's next, in order

1. **`001` T033 — fix the Phase E coverage gap this run found.** The per-spec
   requirements loop (`skills/start/SKILL.md` Phase 7) never asked `dependencies` or
   `owner-split` for the one spec drafted (`question-bank.md`'s Phase E has 7
   dimensions; only 5 got a ledger row). `dependencies` was confirmed verbally
   ("sin dependencias") at spec-creation time but never written to
   `.specloop/interview.md` or `requirements.md`; `owner-split` was never asked at all.
   Cross-reference `SKILL.md`'s Phase 7 step list against `question-bank.md`'s Phase E
   table and make sure all 7 get asked and logged. **Don't invent a new fixture to
   verify the fix** — `test/ops-onboarding-repo/` still has specs `002`–`004` sitting at
   `requirements.md` not started; running one of those through the fixed skill is a
   ready-made regression check with no new persona-writing needed.
2. **`016` interview-engine** — still `todo`. Now has a real passing run behind it as
   evidence the coverage contract *can* work; still needs to become something that
   verifies it did, rather than relying on another live run each time.
3. **`017`'s last deferred item** — the second non-software fixture is now done (this
   run doubles as it — see its `design.md`), but the **absent-`architecture.md` live
   run** is still open.
4. **`006` stays `blocked`.** T030 closing doesn't move it — `006`'s own T007 (flip
   `001` T8/`002` T11/`003` T7/`004` T7 to done) is gated on the full pipeline run
   (`006` T010: `start` → `design-closing` → `task-breakdown` → `loop-setup` → `loop
   run`), which needs the equivalent live-interactive proof for `002`/`003`/`004`, not
   just `001`. Don't assume this run unblocks it.

---

## Traps

- **T033's fix must touch `skills/start/SKILL.md`, not just `question-bank.md`.** The
  question bank already lists all 7 Phase E dimensions correctly — the bug is that the
  skill's actual per-spec loop doesn't walk all 7. If the omission turns out to be
  structural (the step list in `SKILL.md` literally enumerates 5, not 7), add a
  `scripts/check-skill-consistency.mjs` check so this can't silently regress again —
  that script already catches this *class* of bug for other things.
- **`test/ops-onboarding-repo/` is a live, valid fixture with 3 specs still at
  `requirements.md`-not-started.** Don't discard it to "start clean" — continuing it is
  exactly what verifies T033's fix without redoing the persona work.
- Same traps as before still apply (the `Plan`-cell path invariant, `tasks.md`'s
  column-0-only checkbox parsing, `.specloop/loop.config.json` path escaping on Windows,
  the orchestrator only running from a target repo) — see git history if any of those
  come up; not repeating them here since nothing this session touched them.

## Not verified — don't claim otherwise

- Whether `001` T033's actual fix works — it's filed, not yet done.
- Cursor / Codex CLI harness audits (`022` T001/T002) — optional follow-up, still open.
- The full pipeline live run (`006` T010) and the `windowsTerminal`/`tmux` backends
  (`006` T012) — unaffected by this session, still nothing.
- `B-other`'s generic dimensions — still exercised by neither an example nor a fixture
  (per `017`'s `design.md`); the ops-onboarding run covered `B-operations-process`, not
  `B-other`.
