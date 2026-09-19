# 017 — open-questions-asked-as-fake-option-menus

## Scope

001

## Found

Under OpenCode 1.18.31 (model: Muse Spark 1.2 Free) `skills/start` asked open-ended
interview questions (`goal`, `audience`, `mvp`) through the harness's `question` tool.
That tool takes a header, the question text and a list of options, and adds its own
"Type your own answer"; with no real alternatives to offer, the model filled the list
with filler ("Type your answer", "Describe audience", "Skip for now"). The first option
is preselected, so a stray Enter recorded `skipped` for `goal`, `audience` and `mvp`.
`SKILL.md` said nothing about how to ask, so the delivery was left to the model.

## Status

resolved

## Fix

`skills/start/SKILL.md`, interview contract: ask in plain chat text by default; never
call a structured-question tool for an open-ended dimension (it needs a list of options,
an open question has none, and whatever goes there is filler beside the free-text choice
the harness already adds); use it only for a closed choice with 2-6 real alternatives
(`project-type`, a yes/no confirmation), every option an actual answer and none a skip;
never preselect a skip. Worded harness-neutrally (the skill runs under six harnesses).
Rationale added to `001`'s `design.md`.

Verified live under OpenCode 1.18.31 (Muse Spark 1.2 Free), question tool still allowed.
A first wording ("use it only for a closed choice") did not hold: `goal` still came as a
menu, with filler "Answer in own words" instead of "Type your answer". The firmer wording
above made `project-type` and `goal` plain chat questions, and the ledger recorded both
answers verbatim. One run per wording, on one model, so this is evidence, not a
guarantee. Independently of the skill, OpenCode's own config does it at harness level:
`{"permission": {"question": "deny"}}` in the project's `opencode.json` made every
question plain text (tested; the docs only show the `allow` value).

Not done: the same rule for `design-closing`, `amend`, `loop-setup` and `fix`, which
also ask one question at a time and were left unchanged.

## Date

2026-09-19
