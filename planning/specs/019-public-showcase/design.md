# 019 — public-showcase — Design

## Approach (VHS half retired 2026-09-12)

Originally two different capture methods for two different kinds of content:
VHS (scriptable, reproducible) for anything the deterministic `loop run`/
`loop status` CLI produced, and a native screen recorder (ScreenToGif) for
the one thing that can't be scripted — a real `/specloop:start` interview,
since the questions and replies vary run to run. **The CLI half no longer
applies** — `framework/orchestrator/` and `demo-loop.tape` were both deleted
when the deterministic loop path was retired (see `002-loop-orchestrator`,
`planning/handoff.md`). `/specloop:loop` (the only remaining way to run the
loop) is itself an interactive chat session, so a demo of it needs the same
kind of hand capture the interview does, not a VHS script — see `tasks.md`
T005 for what that still needs deciding.

## Deliverables

- `.github/assets/demo-interview.gif` and `demo-interview.png` — captured by hand from
  a real `/specloop:start` session in a throwaway repo, via ScreenToGif.
- A demo of `/specloop:loop` actually working a task — format not yet decided
  (`tasks.md` T005).
- A Mermaid flowchart (`start → design-closing → task-breakdown → loop-setup →
  loop`) embedded directly in `README.md`'s new `## Demo` section.
- A badges row (license, "built for Claude Code") under `README.md`'s title.

## Sequencing

The Mermaid diagram, badges, and the `## Demo` section's structure don't
depend on a live session — done. The interview capture needs a real terminal
session in a throwaway repo and can't be scripted by an agent — same
reasoning as `001` T30's live-interview requirement. The loop demo has the
same constraint (it's a live chat session, not scriptable), plus an
undecided capture format.

## Open questions / deferred

None — a dedicated docs site is explicitly out of scope per `requirements.md`.
