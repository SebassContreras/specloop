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

open

## Fix

Not yet fixed. Plan: re-examine whether `worker-cli` needs to be asked at
all, versus having `skills/loop`/`skills/loop-setup` detect the running
session's own provider directly and only fall back to asking when detection
fails or the user explicitly wants a different provider than the one
running the interview. Needs design review before changing
`question-bank.md` — the question's current answers also feed
`.specloop/loop.config.json`'s fallback list (worker-context-injection, see
`014`), so removing it outright would need a replacement source for that
list.

## Date

2026-09-15
