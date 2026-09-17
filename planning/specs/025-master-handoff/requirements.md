# 025 — master-handoff

Raised 2026-09-12, right after `024` live-verified `skills/loop`. Deferred —
not designed yet, no coding.

## What's being built

The asymmetry this is about: `skills/loop` already handles a **worker**
running low on usage — the master watches the worker's output from outside,
notices a suspected rate limit, and asks the user which configured worker to
switch to (Phase 3.6). There is no equivalent for the **master itself**
running low on its own usage — the chat session running `specloop:loop` has
no reliable way to notice this before a call to it simply fails. Unlike a
worker's exhaustion (observed from outside, after the fact), the master
can't watch itself the same way.

What already works, without any new mechanism: because all loop state lives
on disk — `planning/roadmap.md`, every spec's `tasks.md`,
`.specloop/loop.config.json` — the master is already trivially replaceable:
any fresh chat session, under any compatible harness (same provider or a
different one), can invoke `specloop:loop` and resume exactly where the
previous one left off. Phase 1's eligibility rule already resumes an
`in_progress` spec; Phase 2 already resumes an `interrupted` task first.
**No live "handoff" between two running masters is needed or possible** —
once a master is actually out of usage, it can't act to hand off anything.
The only real gap is that nobody tells the user *proactively* that this
resume path exists and is safe, before the master fails outright.

What this spec would add (not yet designed): a best-effort instruction,
likely a new phase or a note in Phase 3/4: if the master notices signs it
may be approaching its own usage limit (whatever signal — if any — its own
harness actually exposes to it; this needs research, not assumed), say so
plainly to the user and name the resume path explicitly: open a fresh
session (same or a different provider/harness) and invoke `specloop:loop`
again — nothing else to do, state is already on disk.

## Who/what it serves

Whoever is running `specloop:loop` as the master, when their own usage
might be running low.

## Hard constraints

- **No guaranteed detection.** Whether a harness exposes any self-usage
  signal to the model running inside it is unknown and probably varies by
  harness (`opencode stats` exists as a CLI command, but that's a separate
  invocation, not something the model sees mid-conversation). This is
  advisory/best-effort, not a monitored threshold — must not be documented
  as if it reliably fires.
- Must not invent a live cross-session handoff protocol — the resume path
  already works today via shared on-disk state; this spec is about
  *announcing* that path proactively, not building a new one.

## Acceptance criteria

None — closed without one. Design-closing (2026-09-17) found the gap this
spec was filed to cover already fully resolved by `skills/loop`'s existing
Phase 1/Phase 2 resume rules (on-disk state, no live handoff needed), and
confirmed via research that no harness exposes a self-usage-limit signal to
the model to detect in the first place. See `design.md` for the full
finding. The user explicitly declined even a documentation-only addition
(a proactive note in `skills/loop/SKILL.md`) as more plugin surface than
warranted — no file changes at all.

## Out of scope

- Detecting or handling a **worker's** usage exhaustion — already covered
  by `002-loop-orchestrator`'s existing Phase 3.6.
- Automating the actual handoff (e.g., auto-starting a new session under a
  different harness) — always the user's explicit next action, same
  deliberate-step rule as every other loop trigger in this repo.

## Dependencies

`002` (loop-orchestrator) — this is about the resume/self-usage behavior of
`skills/loop`'s master role, which `002` defines.

## Owner split

(none stated)
