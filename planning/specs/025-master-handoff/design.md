# 025 — master-handoff — Design

## Approach

No new mechanism, no code change. Closed by finding — during design-closing,
2026-09-17 — that the gap this spec was filed to cover is already fully
resolved by existing behavior:

- `skills/loop`'s Phase 1 already resumes an `in_progress` spec first; Phase
  2 already resumes an `interrupted` task first. Both read exclusively from
  on-disk state (`planning/roadmap.md`, every spec's `tasks.md`,
  `.specloop/loop.config.json`).
- A fresh chat session, under any compatible harness (same provider or a
  different one), invoking `specloop:loop` therefore already resumes exactly
  where an exhausted master left off — no live handoff between the old and
  new session is needed or possible, and none is missing.

Researched rather than assumed, per this spec's own hard constraint: does
any harness expose a self-usage-limit signal to the model mid-conversation
(distinct from the conversation's own context-window budget)? For Claude
Code specifically: no — confirmed via `anthropics/claude-code` GitHub issue
#26340, an open feature request asking for exactly this, and Anthropic's
own docs, which describe only context-window accounting being surfaced to
the model, never account-level rate-limit proximity. No other harness is
known to expose this either (per this spec's own original text on
`opencode stats` being a separate CLI invocation, not something the model
sees mid-conversation). With no real signal to detect, a "notice signs of
running low" branch would never fire — asserting one would document a
capability that doesn't exist, which this repo's own conventions rule out.

**Decided explicitly, at the user's direction:** not even a proactive
one-line note in `skills/loop/SKILL.md` naming the resume path — weighed
and declined as more plugin surface than the (already-working) behavior
warrants. This design doc is the record of that reasoning; nothing in
`skills/loop` changes.

## Deliverables

None. No file changes.
