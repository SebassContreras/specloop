# Test fixture — not a real project

This folder simulates a brand-new target repo, built by manually following
`skills/start/SKILL.md`'s own instructions (Phase 1 → scaffold, Phase 2 → spec +
requirements, plus a hand-written design.md/tasks.md so there's a fully "ready"
roadmap to hand to a loop). It exists to answer one question: **does specloop, as it
stands today, provide everything needed for a new repo to define a roadmap and then
carry out everything on it?**

See the root `CLAUDE.md` conversation / `docs/specs/001-scaffold-and-spec-skill/`
for the full test report. Short version: the roadmap/spec side works; there is no
loop to execute it — `docs/specs/001-hello-cli/tasks.md` here is fully populated and
ready, and nothing in this plugin can pick it up and run it.

This was not run through a live `/specloop:start` session (that needs a real
interactive terminal); it reproduces the skill's documented behavior by hand to
validate the mechanics without spawning a nested live session.
