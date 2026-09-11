# Handoff — 2026-09-11 (updated, same day)

Supersedes the earlier same-day handoff. That version ended with `windowsTerminal`
confirmed live and `002`/`006` mostly closed — then the user watched it work, decided
against the whole visual-terminal approach, and had it reverted in the same session.
Branch: `main`.

**This file is not the source of truth and must not become one.** `planning/roadmap.md`
owns order and status; each spec's `tasks.md` owns the work.

To see what's actually open:

```bash
node scripts/check-skill-consistency.mjs        # 54 static checks over the skills
cd framework/orchestrator && pnpm exec tsc --noEmit && pnpm exec eslint .
grep -rnE "\[status:(todo|in_progress|blocked|interrupted)\]" planning/specs/*/tasks.md
```

---

## What just happened (the pivot)

Everything from the earlier handoff (`001` T033, `016` help-me-decide, `017`, `006`
T010's live pipeline, `002` T21's PID registry + its race-condition fix, `004` T13,
`006` T012's confirmed `windowsTerminal` pane) still stands — see git history if the
detail is needed. What's new:

1. **The user tried the split-pane experience directly** (opened a real Windows
   Terminal tab running `claude`, watched it, tried to script keystrokes into it via
   `SendKeys`). Two things fell out of that: (a) controlling another terminal's
   keyboard input blindly, with no way to read back what it shows, is not a viable
   orchestration mechanism — confirmed live, sent "hola" to the wrong tab; (b) more
   importantly, the user decided the whole "sub-agent in a visible split pane" idea
   wasn't worth it, even with `002` T22's streaming fix working correctly.
2. **`002` T023 — reverted the split-pane execution path entirely.** Deleted
   `src/splitPane/` (`index.ts`, `none.ts`, `windowsTerminal.ts`, `tmux.ts`),
   `config.ts`'s `SplitMode`/`splitMode` field, `cli.ts`'s `runTask()`/`_run-task`
   dispatch. The master is now the **only** process that ever runs a task —
   sequential, inline, always. `loop-setup`'s split-mode question is gone; only the
   worker-CLI question remains. What `002` T22 fixed (live-relaying a worker's
   stdout/stderr instead of buffering) stayed unchanged — it's still how the
   master's own terminal shows progress live, just with nothing "split" about it.
3. **`002` T024 — quota-exhaustion recovery, new scope.** With no other terminal
   watching a worker, a worker silently exhausting its usage/rate limit would just
   fail every subsequent task on that CLI forever (`blocked`, one by one). Added
   `src/quota.ts` (`looksLikeQuotaExhausted(log)` — a best-effort substring
   heuristic, unverified against any real CLI's actual wording) and `cli.ts`'s
   `promptForWorkerSwitch()`: on a detected match, before marking a task `blocked`,
   the loop pauses and asks interactively which configured worker to retry with (by
   number), or a brand-new CLI name typed on the spot, or `"skip"`/`"stop"`. Safe to
   do now specifically because the master always owns the terminal — no detached
   pane to stall.
4. **`006` T012 closed, and `006` itself closed** (roadmap flipped to `done`) — the
   `tmux` backend will never get verified because the backend no longer exists;
   documented as moot rather than left permanently `in_progress`.
5. **Live-verified** (throwaway fixture in the scratchpad, not committed): two dummy
   `node` "workers", one always printing usage-limit wording and exiting 1, one
   always succeeding. Piped `"1\n"` into `loop run`'s stdin → prompt appeared,
   switched, retried, task closed `done`. Piped `"skip\n"` in a fresh run → task
   correctly `blocked` with the detected message recorded. Both paths work.

Docs updated in the same pass (per this repo's own "align every file a mechanism
touches" rule): `002`'s `requirements.md`/`design.md`/`tasks.md`, `006`'s `tasks.md`,
`planning/roadmap.md`, `planning/architecture.md`, `skills/loop-setup/SKILL.md`,
`skills/start/SKILL.md`'s config template, `examples/loop.config.sample.json`,
`SECURITY.md`, `.github/ISSUE_TEMPLATE/bug-report.yml`, and the now-stale
split-pane mentions in `007`/`011`/`021`'s not-yet-started `requirements.md` files
(left `014`'s and `002`'s own historical *done*-task notes alone — those are
accurate records of what was true when they were written, not live requirements).

---

## Traps

- **Don't resurrect `splitMode`/`splitPane/`.** It existed, worked (`windowsTerminal`
  confirmed end-to-end), and was deliberately reverted after the user watched it
  live and didn't want it — not a regression to "fix back."
- **`quota.ts`'s detection patterns are unverified against a real worker CLI.**
  Nobody has actually watched `claude`/`codex`/`opencode` hit a real usage/rate
  limit and confirmed the exact wording matches. Treat a miss as expected until
  that happens once, live, and the pattern list gets extended from real text.
- **`cli.ts`'s `run()` now blocks on `process.stdin`** when `promptForWorkerSwitch`
  fires. That's fine for a human running `loop run` in their own foreground
  terminal (the only supported way to run it now) — but would hang forever if
  `loop run` were ever invoked non-interactively (e.g. from CI, `008`) without
  stdin connected to something that answers. Worth a guard if `008` ever lands.
- **`test/*` fixtures still have `.specloop/loop.config.json` files with a leftover
  `splitMode` key** (gitignored, untracked, not touched this pass) — harmless,
  the field is just ignored on load now, not worth cleaning up proactively.

## Not verified — don't claim otherwise

- `quota.ts`'s patterns against any real CLI's real usage-limit wording.
- Whether a non-interactive invocation of `loop run` (stdin not a TTY) hangs
  cleanly or ugly when a quota prompt fires — not exercised.
- Cursor / Codex CLI harness audits (`022` T001/T002) — optional follow-up, still
  open, untouched.
- `007` (orchestrator-unit-tests), `009`–`013`, `018`, `019`, `021` — roadmap says
  `todo`, nothing this pass changed that. `021`'s `requirements.md` was corrected
  to stop describing a `splitPane`/`splitMode` world that no longer exists, but the
  spec itself is still undesigned.
