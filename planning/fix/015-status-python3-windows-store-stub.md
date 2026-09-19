# 015 — status-python3-windows-store-stub

## Scope

030

## Found

`skills/status/SKILL.md` Phase 0 hard-codes `python3` and prescribes an exact stop
message ("requires python3, which was not found on PATH") when it isn't found. On
Windows, `python3` typically resolves to the Microsoft Store app-execution alias — a
stub that exits with a localized "Python was not found" message instead of running.
Observed 2026-09-19 during the `014` OpenCode verification (Windows 11, OpenCode
1.18.31, model `muse-spark-1.2-contributor-free`): `python3 <script>` failed with the
stub's message, and the model silently retried with `python <script>`, which worked,
instead of printing the prescribed stop message. So the skill's behavior on this case
is undefined: the stop rule says to halt, the run recovered by improvising, and a
different model or harness could equally halt or loop. `build_dashboard.py` itself
was fine — the failure is in how the skill names the interpreter.

## Status

resolved

## Fix

`skills/status/SKILL.md` Phase 0 now picks the interpreter before running the script:
`python3 --version`, then `python --version`, using the first that prints `Python 3.x`.
Probing the version (not an error string) is language-independent, so it handles the
localized Store stub, and rejects `python` where it's Python 2. If neither qualifies,
the same prescribed stop message is printed, unchanged. `README.md` now says Python 3
as `python3` or `python`. Verified 2026-09-19 on this Windows machine (`python3` =
Store stub, `python` = 3.14.3): OpenCode 1.18.31 probed both, chose `python`, wrote
`planning/dashboard.html`; Claude Code 2.1.278 loaded via `--plugin-dir` in a fixture
with no skills copy did the same, producing a byte-identical 31998-byte dashboard.
Not exercised: a machine with neither interpreter (stop-message branch), and macOS/
Linux. `planning/architecture.md`'s Fixed rule still says "a missing `python3` on
`PATH` is a hard failure" — still true in spirit, literal wording left unedited
pending the user's go-ahead.

## Date

2026-09-19
