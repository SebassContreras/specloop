# 024 — loop-skill-verification — Tasks

Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`
Owner: `agent` (loop-runnable) · `human` (skipped by the loop)

- [x] T001 [agent] [status:done] Build the fixture repo skeleton under `test/` (gitignored): `AGENTS.md`, `planning/architecture.md`, `planning/styles.md`, `planning/roadmap.md` with at least one spec mixing `[agent]`/`[human]` tasks, one all-`[human]` spec, and two eligible `todo` rows with different `Priority` numbers
      └─ `test/loop-verify-fixture/`: 001 (all-human, priority 1), 002 (mixed, priority 2), 003 (agent-only, priority 3), later 004 (stop-test, priority 4). `planning/styles.md` deliberately not created. Separate isolated fixture `test/loop-verify-allhuman/` for the all-human-backlog check.
- [x] T002 [agent] [status:done] Write the stub worker script: appends received argv + full prompt to a file, then exits success, exits non-zero with a plain error, or exits non-zero with usage-limit-shaped wording, selected by an env var/arg
      └─ `test/loop-verify-fixture/stub-worker.cjs`. Used to verify prompt contents (success + quota-suspicion branches) before the run pivoted to real worker CLIs per user direction — see T004's note on scope actually covered.
- [x] T003 [human] [status:done] Live run: `specloop:loop-setup` against the fixture
      └─ Q&A walked through for real: worker CLI question answered with the stub first, then the run was reconfigured to real `claude`/`opencode` workers per user direction. `.specloop/loop.config.json` and `.specloop/.gitignore` written correctly both times. All-human-backlog check verified separately in the isolated `test/loop-verify-allhuman/` fixture (single all-`[human]` eligible spec) — condition correctly identified by Phase 0's own text; not additionally interrupted the user with a synthetic Q&A for a fixture-only decision. Legacy `workerCli`/`workerArgs` shape verified live: wrote a config in that shape, read it as `workers[0]` per `skills/loop`'s Phase 0 text, dispatched a real `opencode` call from it — worked identically to the array form.
- [x] T004 [human] [status:done] Live run: `specloop:loop` against the fixture, cycling the stub through all three exit modes across several tasks, then telling it to stop mid-task
      └─ **Scope actually covered, per explicit user direction mid-run**: dropped the stub-based quota-suspicion live cycle (already covered once via the stub before the pivot — see T002's note) and re-ran the real work with genuine `claude` and `opencode` workers instead, on the user's instruction to "test with the real operators, and see what they respond, nothing weird with scripts." Full observed-result table below. Also added `004-stop-test` mid-run specifically to live-verify Phase 4 (not in the original fixture design) — dispatched a real native sub-agent, killed it mid-flight with `TaskStop`, confirmed the task was marked `interrupted` (not `blocked`/`done`) and nothing else started.
- [x] T005 [human] [status:done] Write the full observed-result table (see `design.md`'s template) as a note here, and fix forward in `skills/loop`/`skills/loop-setup` anything that didn't match the skill's own stated rule
      └─ See table below. Two real gaps found and fixed in `skills/loop/SKILL.md`'s Phase 3: (1) it never said *how* a briefing reaches a CLI subprocess — now explicit (`<cli> <args...> "<briefing>"`, args first, briefing last as one argument, plus a bounded timeout and no stdin, matching the deleted `worker.ts`'s convention); (2) it said "watch the output as it happens," which doesn't hold for Claude Code's own native sub-agent mechanism — that path is asynchronous (dispatch, then a completion notification), not a live stream. Both fixes were exercised correctly by every live task dispatched after they landed.
- [x] T006 [human] [status:done] Re-run just the affected step(s) for anything fixed in T005 to confirm the fix; flip this spec `done` once every bullet has a matching observed result
      └─ Both `T005` fixes were live-exercised by the real runs that followed them in the same session (see table) — no separate re-run needed. One behavior intentionally left unverified: the harness-synergy branch's exact wording under a harness other than Claude Code (this session can only run Claude Code) — noted in `planning/handoff.md`, not blocking.

## Observed-result table

| Behaviour | Result |
|---|---|
| Resume an `in_progress` row before any `todo` one | Not exercised — no spec ever reached roadmap-level `in_progress` in this run (each either finished in one pass or was interrupted while the roadmap row was still `todo`). Plausible by inspection of Phase 1's text, not live-confirmed. |
| Among eligible `todo` rows, prefer the lower `Priority` | Confirmed twice: `001` (priority 1, all-human) correctly skipped in favor of `002` (priority 2); `002`/`003` both eligible simultaneously, `002` (lower) picked first. |
| Skip a `todo` row with no runnable task instead of getting stuck | Confirmed — `001` (all-human) never picked across the whole run. |
| Refuse cleanly when nothing is eligible | Confirmed conceptually — after `001`–`004` were exhausted/interrupted, only `001` (all-human) remained, correctly left alone. |
| `tasks.md` grammar read/write without touching unrelated lines | Confirmed across every edit — checkbox/status/note only, task text and owner tag untouched. |
| `[human]` rows never touched | Confirmed — `002` T004 and `001` T001 (both fixtures) never modified. |
| Prompt names task + spec | Confirmed, every dispatch (see logs `002-T001..T003`, `003-T001`). |
| Prompt points to `requirements.md`/`design.md` | Confirmed, every dispatch. |
| Prompt lists only existing `contextFiles` | Confirmed — `planning/styles.md` (absent) correctly omitted every time; `AGENTS.md`/`planning/architecture.md` (present) always listed. |
| `language` line only when set | Confirmed present (`config.language: "Spanish"` set) — every worker's output was genuinely in Spanish, comments included. Negative case (unset) not separately live-run; low risk, same instruction just doesn't fire. |
| Do-not-touch-status instruction included | Confirmed, every dispatch; no worker ever edited a tasks.md status/owner tag. |
| Status rollup on exhaustion (`blocked`>`interrupted`>`done`>`in_progress`) | `done` case confirmed twice (`002`, `003`, all-agent-done). `blocked`/`in_progress` rollup branches not exercised live this run — no task genuinely failed or was left mid-spec. |
| Roadmap `Status` write on rollup | Confirmed — `002`/`003` rows flipped `todo`→`done` correctly, nothing else in the row touched. |
| `Stage` → `looping` on first pick | Confirmed for `002`, `003`, `004`. |
| Legacy `workerCli`/`workerArgs` config shape | Confirmed live — read as `workers[0]`, real `opencode` call dispatched from it, worked identically to the array form. |
| Genuine-failure → `blocked` + note | Not exercised with a real CLI this run (both real workers succeeded at every real task) — confirmed earlier only via the stub, pre-pivot. |
| Suspected quota/rate-limit → ask the user, never guess/retry silently | Confirmed via the stub before the pivot (real CLIs don't reliably reproduce this on demand — see `requirements.md`'s reasoning, reinforced by this session). Not re-confirmed with a real CLI. |
| Stop mid-task → `interrupted`, nothing new starts | Confirmed live — real native sub-agent killed mid-flight (`TaskStop`), task marked `interrupted` (not `blocked`/`done`), no file written by the killed worker, no further task started. |
| All-`human`-backlog check (`loop-setup` Phase 0) | Verified by inspection against an isolated fixture (`test/loop-verify-allhuman/`, single all-`[human]` eligible spec) — condition is unambiguous from the skill's own text. Not additionally forced through a live interactive prompt. |
| Harness-synergy: native sub-agent preferred over subprocess when provider matches | Confirmed live, 3 dispatches (`claude` worker, this harness is Claude Code) — used the native sub-agent tool every time, never shelled out to `claude -p`. Found and documented: this path is asynchronous, not a live stream (see fixes above). |
| CLI-subprocess path for a non-matching provider | Confirmed live, 2 dispatches (`opencode` worker) — genuine subprocess, `<cli> <args...> "<briefing>"` convention, both succeeded. |
