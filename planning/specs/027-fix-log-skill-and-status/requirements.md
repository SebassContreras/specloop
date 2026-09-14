# 027 — fix-log-skill-and-status

## What's being built

**Implemented 2026-09-14**, in the same pass it was decided, same as `023`/`026`
before it. Two changes to the fix log (`023-fix-log`), bundled because neither is
useful alone:

1. **An explicit `## Status` field** on every fix-log entry — one of `open` /
   `in_progress` / `resolved` / `wontfix` — replacing the implicit convention of
   writing the literal string `"Not yet fixed"` inside `## Fix` and hoping a reader
   (or, going forward, `skills/status`) parses it correctly.
2. **A skill, `skills/fix/` (`specloop:fix`)**, that knows the entry format without a
   human reading a README first — computes the next `NNN`, asks a short set of
   questions (scope, found, status, fix-so-far), and writes the file. `023` deferred
   exactly this ("revisit only if hand-writing proves error-prone in practice") — it
   did, once, this same day (entry `003` was written mid-format-change without the
   skill's help). Once the skill existed, hand-authoring stopped being worth keeping
   as a parallel path — `specloop:fix` is now the *only* supported way to add an
   entry, matching how every spec file is always skill-written, never hand-started.
   `planning/fix/README.md` is removed; the format now lives solely in
   `skills/fix/SKILL.md`.

## Who/what it serves

Whoever logs a fix entry — always via a deliberate `specloop:fix` invocation, same
category as `specloop:start` (a human decides to run it; nothing chains into it
automatically) — and `skills/status`'s dashboard, which can now show/filter a real
status value instead of string-matching English prose.

## Hard constraints

- **Still not loop-runnable, still not roadmap-tracked** — `023`'s hard constraint is
  untouched. `## Status` is informational, set by a human or by `specloop:fix` when
  invoked; nothing in `skills/loop` reads or rolls it up.
- **`specloop:fix` stays a quick-capture flow, not a guided interview** — no phases, no
  coverage gate, proportional to what it's replacing (a four/five-field file a
  developer used to write directly). Matching `design-closing`'s multi-phase Q&A here
  would be exactly the ceremony `023` argued against.
- `## Status` is a fixed enum, not free text — `open` / `in_progress` / `resolved` /
  `wontfix` only.
- Existing entries (`001`–`004`) must end with an explicit `## Status`, not left
  without one.
- **Hand-authoring a new entry is no longer a supported path.** `specloop:fix` is the
  only writer; this is a deliberate scope change from `023`'s original "no skill
  invocation needed," not an oversight.

## Acceptance criteria

- All four existing entries carry an explicit, accurate `## Status`.
- `skills/fix/SKILL.md` exists, computes the next `NNN` itself, and writes a
  complete entry (including `## Status`) from short answers — and is the format's
  only documentation, since `planning/fix/README.md` no longer exists.
- `skills/status/SKILL.md` Phase 4 and `references/template.html`'s documented JSON
  shape both carry `status` per fix entry; the dashboard shows it.
- The root `README.md`'s one-line mention of `planning/fix/` names `specloop:fix`
  as how entries get added, same weight as its mention of the spec pipeline.

## Out of scope

- Making fix entries loop-runnable or roadmap-tracked — still declined, per `023`.
- Automatic status transitions (e.g. inferring `resolved` from a code change) — a
  human or `specloop:fix` sets `## Status` explicitly, always.
- Rich status badge styling in the dashboard beyond a plain value in the table —
  visual polish is `026`'s territory if it's ever wanted.

## Dependencies

`023` (fix-log; this amends its shipped format) and `009`/`026` (status dashboard;
this extends the JSON contract `026` already touches).

## Owner split

Agent-runnable throughout — no human-only step.
