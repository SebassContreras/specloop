# 019 — public-showcase — Tasks

Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`
Owner: `agent` (loop-runnable) · `human` (skipped by the loop)

- [x] T001 [agent] [status:done] Write `.github/assets/demo-loop.tape` (VHS script for `loop status` + `loop run`)
      └─ **Retired 2026-09-12**: the deterministic `loop run`/`loop status` CLI this tape demoed was deleted (see `002-loop-orchestrator`, `planning/handoff.md`). The tape file itself was deleted with it. `README.md`'s `## Demo` section no longer references it or its output images.
- [x] T002 [agent] [status:done] Add the Mermaid flow diagram to `README.md`'s new `## Demo` section
      └─ Updated 2026-09-12 to end at `/specloop:loop` instead of naming the retired `loop run`.
- [x] T003 [agent] [status:done] Add the badges row and the `## Demo` section skeleton (image tags pointing at the not-yet-captured files) to `README.md`
      └─ The `demo-loop.gif`/`demo-loop-status.png`/`demo-loop-run.png` tags were removed 2026-09-12 along with the CLI they'd have shown — never captured (T005 was still `todo`), so nothing shipped had to be walked back.
- [ ] T004 [human] [status:in_progress] Capture `demo-interview.gif`/`demo-interview.png` from a real `/specloop:start` session in a throwaway repo (ScreenToGif)
      └─ Can't be scripted — the interview's content varies run to run. Same reasoning as `001` T30. Decided 2026-09-08: capture from the live `opecode-test` OpenCode session (already in progress for `022` T003 / `001` T30 / `006` T010) instead of a separate Claude Code run — reinforces the now-verified cross-CLI claim. `README.md`'s caption and intro paragraph updated accordingly so it doesn't read as contradicting the "Built for Claude Code" badge.
- [ ] T005 [human] [status:todo] Capture a demo of `/specloop:loop` actually working a task (chat transcript or screen recording — not a VHS terminal tape, there's no CLI left to script) and add it to `README.md`'s `## Demo` section
      └─ Replaces the old VHS-based T005 (`vhs demo-loop.tape`), moot since the CLI it drove no longer exists. Not yet designed how to capture a chat session legibly (full transcript screenshot? an annotated excerpt?) — whoever picks this up decides the format.
- [ ] T006 [human] [status:todo] Copy the captured interview files (and T005's new loop demo, once decided) into `.github/assets/` and verify `README.md` renders correctly
      └─ Visual check — confirm the images actually show what they claim to.
