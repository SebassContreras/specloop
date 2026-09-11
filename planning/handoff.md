# Handoff — 2026-09-11 (updated twice, same day)

Supersedes both earlier same-day handoffs. The first ended with `windowsTerminal`
confirmed live; the second reverted all of that and added a regex-based
quota-exhaustion prompt straight into the Node CLI. **This one reverts that too** —
the interactive piece now lives in a new skill instead. Branch: `main`.

**This file is not the source of truth and must not become one.** `planning/roadmap.md`
owns order and status; each spec's `tasks.md` owns the work.

To see what's actually open:

```bash
node scripts/check-skill-consistency.mjs        # 54 static checks over the skills
cd framework/orchestrator && pnpm exec tsc --noEmit && pnpm exec eslint .
grep -rnE "\[status:(todo|in_progress|blocked|interrupted)\]" planning/specs/*/tasks.md
```

---

## Where this landed (read this before touching `002` again)

`002-loop-orchestrator` now has **two ways to actually run the loop**, doing
genuinely different jobs — don't collapse them back into one:

1. **`loop run`** (`framework/orchestrator/`, unchanged from its original shape):
   a plain, deterministic Node script. Sequential, in-process, no split panes
   (reverted `002` T023 after `windowsTerminal` was confirmed working — the
   user watched it live and decided against the whole visual-terminal idea).
   No judgement: a failed task is just `blocked`, exit-code only. Correct for
   CI or any run genuinely nobody is watching.
2. **`skills/loop/SKILL.md`** (new, `002` T026): the interactive alternative.
   **The chat session running this skill *is* the master** — it reads
   `planning/roadmap.md`/that spec's `tasks.md` directly, launches each
   task's worker itself (preferring its own harness's native sub-agent
   mechanism over a CLI subprocess when the provider matches — see the
   skill's Phase 3, and `021`'s narrowed scope), and decides
   success/failure/quota-exhaustion by actually reading the output — no
   regex. On a suspected usage/rate-limit hit, it asks the user directly in
   the conversation which worker to switch to.

**Why it took three passes to get here**, in order, same day:
- Pass 1 added `splitMode`/`windowsTerminal.ts`/`tmux.ts` — confirmed working
  live, then reverted anyway (`002` T023) because the user watched it and
  didn't want a visual terminal at all, at any cost.
- Pass 2 (`002` T024) added `quota.ts` (regex heuristic) + a blocking
  `readline` prompt straight in `cli.ts`, reasoning "the master always holds
  the terminal now." **That reasoning had a hole**: the user's actual intent
  was never "a Node script is the master" — it's "I open a chat, and that
  chat is the master." A plain script has no chat to ask questions in, and an
  unattended `loop run` (CI) has nobody to answer a prompt regardless of
  where it's blocking.
- Pass 3 (`002` T025/T026, this pass): reverted T024's regex+readline
  entirely, and put the interactive piece where it actually belongs —
  `skills/loop/SKILL.md`, where "the master" genuinely is a live agent that
  can read, judge, and ask.

If a future session is tempted to add cleverness back into `cli.ts` (smarter
failure detection, an interactive prompt, anything requiring judgement): stop
and check whether it belongs in `skills/loop` instead. `cli.ts` is deliberately
dumb on purpose now — that's not an oversight to fix.

---

## Traps

- **Don't resurrect `splitMode`/`splitPane/` or `quota.ts`/`promptForWorkerSwitch`.**
  Both existed, both worked, both were deliberately reverted — not regressions
  to "fix back." `git log` has the full story on each if the reasoning is
  ever unclear.
- **`skills/loop/SKILL.md` has no code of its own, by design.** It's
  instructions for whatever agent runs it — it reads/writes the same
  `roadmap.md`/`tasks.md`/`loop.config.json` files `loop run` does, but there
  is nothing to `tsc`/`eslint` there. Don't go looking for a `loop.ts` module
  backing it.
- **The harness-synergy rule in `skills/loop`'s Phase 3 is phrased generically
  on purpose** ("your own harness's native way of spawning a sub-agent," not
  "Claude Code's Agent tool") — per `022`'s open-format rule, since this
  skill (like every other one here) must make sense under any compatible
  harness, not just the one it happened to be written in.
- **`021` (harness-worker-backend) narrowed, didn't close.** It's now
  specifically about giving the *deterministic* `loop run` path the same
  efficiency `skills/loop` already gets for free — an in-process Claude Agent
  SDK worker kind for a script that has no harness of its own to prefer.
  Still undesigned.

## Not verified — don't claim otherwise

- `skills/loop/SKILL.md` itself has not been run live yet — it was written and
  cross-checked against the same file contracts `loop run`'s code already
  encodes, but nobody has actually opened a fresh chat, invoked
  `/specloop:loop`, and watched it work a real task end-to-end. That's the
  natural next verification step for whoever picks this up.
- Whether the harness-synergy preference (native sub-agent vs. CLI subprocess)
  actually reads sensibly to an agent running under a harness other than the
  one this was written in — untested outside this session's own harness.
- `007` (orchestrator-unit-tests), `009`–`013`, `018`, `019` — roadmap says
  `todo`, nothing this pass changed that. `021`'s `requirements.md` reflects
  its narrowed scope but the spec itself is still undesigned.
- Cursor / Codex CLI harness audits (`022` T001/T002) — optional follow-up,
  still open, untouched.
