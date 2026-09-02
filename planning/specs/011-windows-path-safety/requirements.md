# 011 — windows-path-safety

## Priority: 6

## Requirements (draft — to be reviewed)

- `framework/orchestrator/src/security.ts`'s `assertSafePath()` (world-writable
  `PATH` directory guard, added for Sonar S4036 in 002 T15) is POSIX-only today —
  skipped entirely on Windows, which is the author's primary OS.
- Either:
  - implement an equivalent Windows check (ACL-based writable-directory detection
    on each `PATH` entry), wired into `worker.ts`/`windowsTerminal.ts` the same way
    the POSIX check is; or
  - if a reliable Windows equivalent isn't practical, explicitly document the gap
    in `README.md`/`planning/architecture.md` as a known, deliberate tradeoff rather
    than a silent one.
- Re-run the existing `none`-mode smoke test on Windows after whichever path is
  taken, same verification bar 002 T15 already used.

## Out of scope

- Rewriting `assertSafePath()`'s POSIX behavior — that stays as-is; this is
  additive (Windows coverage) or documentation, not a POSIX regression risk.
