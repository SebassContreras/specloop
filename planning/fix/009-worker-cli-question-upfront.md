# 009 — worker-cli-question-upfront

## Scope

016

## Found

GitHub issue #7 (bug, filed 2026-09-15): `specloop:start`'s Phase C
interview asks the user to enumerate every worker CLI/provider they might
ever run the loop with (`worker-cli` dimension in
`skills/start/references/question-bank.md`), even though the loop is
supposed to work for whichever provider is actually running it, regardless
of what the user declares upfront.

## Status

wontfix

## Fix

Kept as-is, decided 2026-09-15 (same conversation). Considered moving
`worker-cli` from an eager upfront question (`start` Phase 4 /
`loop-setup` Phase 1) to a lazy one asked only the first time
`specloop:loop` actually needs a fallback CLI (no native sub-agent
mechanism available, or an explicit provider switch on suspected
rate-limit) — the question only matters for that fallback path, not the
native-harness happy path. User decided the friction isn't worth it: having
the fallback list ready in advance is preferred over saving one question,
and it's not something that actually bothers them day to day. No change —
`worker-cli` stays an upfront question in both `start` and `loop-setup`.

## Date

2026-09-15
