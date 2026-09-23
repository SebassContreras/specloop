# 039 — advance-cross-harness-verification — Requirements

Raised 2026-09-23: `planning/fix/018` added `specloop:advance`'s Phase 0.5 and it was
verified only under Claude Code (`test/advance-evals/`, 6 evals). `README.md`'s support
matrix already says "verified" doesn't cover `advance` outside Claude Code.

## What's being built

A live verification of `specloop:advance` — Phase 0.5 (requirements drafting) through
Phase 2 — under every non-Claude harness on `022`'s roster, recorded per harness in
`README.md`'s support matrix, with any skill-text gap it finds fixed in the same spec.

## Who/what it serves

- Users running specloop under OpenCode, Codex CLI, Copilot CLI, Cursor or
  Antigravity CLI — the harnesses where a user most needs the "sigue solo" path to
  hold without Claude Code's tool set.
- `README.md`'s support matrix, the only place per-harness state lives (`022`).

## Hard constraints

- Same fixture shape as `test/advance-evals/fixture` (4 seeded specs, dependency
  chain, one `open` ledger dimension, one Spanish ledger row), but outside this repo
  with its own `.git` — a nested fixture lets a harness read this repo's own
  `AGENTS.md` (`018`/`022`'s finding).
- The web-search branch matters per harness: where a harness has no web-search tool,
  the run must show the `_(standard, unverified — no web search)_` path, not a
  guessed URL.
- Evidence per harness goes in this spec's `tasks.md`; `README.md` carries only the
  resulting state (`022`'s rule).
- Never claim a harness verified from a partial run — a quota hit or a stopped run is
  recorded as such (`022`'s `agy` precedent).

## Acceptance criteria

- For each harness on the roster: `requirements.md` written with the 7 canonical
  headers, every non-user line marked, no write before the user's yes, ledger rows
  replaced not duplicated — or the failing step recorded.
- For each harness: which web-search path it took (verified URL vs. unverified
  marker) is recorded.
- `README.md`'s support matrix states `advance`'s per-harness result.
- Every skill-text gap found is fixed in `skills/advance/SKILL.md` and passes
  `scripts/check-skill-consistency.mjs`.

## Out of scope

- `skills/loop` as master under non-Claude harnesses (still open from `022`/`024`).
- Changing Phase 0.5's rules beyond gaps the runs expose.

## Dependencies

`022` (harness roster, support matrix), `033` (`advance`), `planning/fix/018`
(Phase 0.5).

## Owner split

`agent` for the runs and fixes; `human` wherever a harness needs an interactive
login or a quota the agent can't obtain.
