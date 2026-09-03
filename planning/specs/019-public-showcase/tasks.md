# 019 — public-showcase — Tasks

Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`
Owner: `agent` (loop-runnable) · `human` (skipped by the loop)

| ID | Task | Owner | Status | Notes |
|----|------|-------|--------|-------|
| T1 | Write `.github/assets/demo-loop.tape` (VHS script for `loop status` + `loop run`) | agent | done |  |
| T2 | Add the Mermaid flow diagram to `README.md`'s new `## Demo` section | agent | done |  |
| T3 | Add the badges row and the `## Demo` section skeleton (image tags pointing at the not-yet-captured files) to `README.md` | agent | done |  |
| T4 | Capture `demo-interview.gif`/`demo-interview.png` from a real `/specloop:start` session in a throwaway repo (ScreenToGif) | human | todo | Can't be scripted — the interview's content varies run to run. Same reasoning as `001` T30. |
| T5 | Run `vhs demo-loop.tape` inside that throwaway repo (after `specloop:loop-setup` + a populated `tasks.md`) to produce `demo-loop.gif`/`demo-loop-status.png`/`demo-loop-run.png` | human | todo | The `vhs` command itself is agent-runnable, but the throwaway repo it depends on only exists after T4's live session. |
| T6 | Copy all five captured files into `.github/assets/` and verify `README.md` renders correctly | human | todo | Visual check — confirm the images actually show what they claim to. |
