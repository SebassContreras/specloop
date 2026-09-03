# 019 — public-showcase — Design

## Approach

Two different capture methods for two different kinds of content. VHS (scriptable,
reproducible) for anything the orchestrator's own CLI produces deterministically
(`loop status`, `loop run` against a populated `tasks.md`) — the tape is committed, the
GIF/PNGs are regenerated from it, never re-recorded by hand. A native screen recorder
(ScreenToGif, since the author is on Windows) for the one thing that can't be scripted —
a real `/specloop:start` interview, since the questions and Claude's replies vary run to
run. The Mermaid flow diagram and the README badges need no capture at all; they're
authored directly as text.

## Deliverables

- `.github/assets/demo-loop.tape` — VHS script. Run inside a throwaway target repo
  (after `specloop:loop-setup` has installed the orchestrator and a spec has a real
  `tasks.md`) to produce `demo-loop.gif`, `demo-loop-status.png`, `demo-loop-run.png`.
- `.github/assets/demo-interview.gif` and `demo-interview.png` — captured by hand from
  a real `/specloop:start` session in that same throwaway repo, via ScreenToGif.
- A Mermaid flowchart (`start → design-closing → task-breakdown → loop-setup →
  loop run`) embedded directly in `README.md`'s new `## Demo` section.
- A badges row (license, "built for Claude Code") under `README.md`'s title.

## Sequencing

The tape script, Mermaid diagram, badges, and the `## Demo` section's structure don't
depend on a live session — done in this pass, with `<img>` tags already pointing at
`.github/assets/demo-interview.gif`/`demo-loop.gif` so nothing else needs editing once
those files land. The two interview captures and running the tape itself both need a
real terminal session in a throwaway repo and can't be scripted by an agent — same
reasoning as `001` T30's live-interview requirement.

## Open questions / deferred

None — a dedicated docs site is explicitly out of scope per `requirements.md`.
