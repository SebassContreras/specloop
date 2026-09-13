# specloop

Entry point. Everything else lives under `planning/`:

- [`planning/handoff.md`](planning/handoff.md) — **start here if you're new to this repo.**
  Point-in-time notes from the last session: what's next and why, the traps, what is
  *not* verified, and the open judgement calls. Not a source of truth — the roadmap and
  each spec's `tasks.md` are.
- [`planning/product.md`](planning/product.md) — what this is, who uses it (stable).
- [`planning/architecture.md`](planning/architecture.md) — stack, conventions, fixed rules,
  and the "Declined" table (read it before re-proposing something).
- [`planning/roadmap.md`](planning/roadmap.md) — index of specs: order, status, dependencies,
  and the real build order.
- `planning/specs/NNN-name/` — one spec per feature: `requirements.md`, `design.md`,
  `tasks.md`.
- [`planning/fix/`](planning/fix/) — a flat, hand-authored log of post-hoc corrections.
  Not a spec, not loop-runnable — see its own `README.md`.

Current state (2026-09-13): `001`–`006`, `009`, `014`–`018`, `020`, `022`–`024` are `done`.
`001`/`003`/`004` are working skills under `skills/`; `002` is now a single
interactive skill, `skills/loop/SKILL.md` — the chat session running it is the
master: reads `roadmap.md`/`tasks.md` itself, runs workers (any compatible harness,
not just Claude), and asks the user directly on a suspected usage/rate-limit hit.
**There is no standalone script or CLI** — the earlier deterministic `loop run`
(`framework/orchestrator/`) was retired 2026-09-12, along with the six specs that
existed only for it (`007`, `008`, `010`, `011`, `013`, `021` — all deleted, none
had gotten past `requirements.md`). See `planning/handoff.md` for why. `014`
(worker-context-injection) flipped to `done` the same day — its worker-language
feed (T10) now lives in `skills/loop`'s prompt-building step rather than the
deleted `worker.ts`; its one remaining task (T11) depended on the now-deleted `007`
and was dropped as moot. **`024` (loop-skill-verification) also closed the same
day** — a real live run (real `claude`/`opencode` workers, not a stub, per an
explicit mid-run redirect) against a throwaway fixture confirmed the rewritten
`skills/loop`/`skills/loop-setup` text actually works, and found/fixed two real
gaps in `skills/loop`'s Phase 3 (how a briefing reaches a CLI subprocess; the
native sub-agent path being asynchronous, not a live stream). A few branches
stayed stub-only or unexercised (genuine-failure/quota-suspicion with a real CLI,
a roadmap-level `in_progress` resume, harness-synergy wording under a
non-Claude-Code harness) — see `planning/handoff.md`'s "Not verified" section.
`022`'s acceptance criteria only required one
non-Claude-Code harness verified — OpenCode passed a live audit 2026-09-08, so
`planning/architecture.md`'s Container section names it; Cursor and Codex CLI
audits (`022` T001/T002) remain open as optional follow-up, not blocking. **`018`
(project-style-preferences) closed 2026-09-13** — its capture/storage/delivery
turned out to already be built (`001` T024/T025, `014`), just never traced back to
close the spec; closed via a live verification under OpenCode against an external
fixture instead of a fresh design/build pass. That run also surfaced and fixed two
unrelated gaps, logged as `planning/fix/001-language-field-format` and
`planning/fix/002-stage-not-reset-on-done`. **`009` (status-dashboard-skill) also
closed 2026-09-13** — reformulated first to add a static, self-contained HTML
dashboard (`planning/dashboard.html`, regenerated fresh each run, no server/watcher
— see its `requirements.md` for why a live-updating one is deliberately out of
scope), then built and live-verified (`skills/status/SKILL.md` +
`skills/status/references/template.html`) against a throwaway multi-drift-scenario
fixture (`test/status-verify-fixture/`). One task, `T012` (opening the generated
dashboard in a real browser), is `[human]` and stays `todo` — the loop skips it,
report it to the user each time this spec's row is touched, but it doesn't hold the
spec's `Status` open. **`026` (dashboard-visual-enhancements) filed and
design-closed the same day**, after actually seeing `009`'s output rendered
against this repo's own data (a real dogfood run) — progress bars, richer
per-task badges, a KPI strip, clickable `dependsOn` badges, a "next eligible"
highlight, and client-side filter/search, all as edits to the same two `009`
files, no new files. Not started. `012` is `todo`, unstarted, still
undesigned. `019` (public-showcase) is `in_progress`,
not unstarted — its first three tasks are `done`, but T001's `demo-loop.tape`
demoed the now-deleted CLI and was deleted with it; T005 (screenshot capture) needs
a fresh interactive-skill demo, not a VHS terminal recording. Check
`planning/roadmap.md` before touching anything — it's the single source for
status/dependencies/pipeline-stage/priority and carries nothing else;
`planning/handoff.md` carries the point-in-time detail this paragraph doesn't.
`skills/*/SKILL.md` target the open Agent Skills format, not a Claude-Code-only one —
see `planning/architecture.md`'s Container section.

`planning/roadmap.md` was restructured 2026-09-12: gained `Stage` (pipeline phase,
written by whichever skill completes that transition) and made `Priority` a live,
human-edited ordering number instead of a historical record — its old "Build order"
prose section is gone, ported into each spec's own docs first where not already
there. See `planning/architecture.md`'s roadmap Fixed rules; both columns are now
written/consulted in exactly one place (`skills/loop`), since the deterministic
`loop run` CLI path that once lagged behind on this no longer exists.

## Two rules that exist because they were broken once

- **A "Declined" row may not overrule a stated user objective**, and may not cite a
  `planning/product.md` clause edited in the same change. On 2026-09-02 that circularity
  rejected four of the project's six objectives; the restoration is in `001`'s
  `tasks.md` (T15–T27).
- **Don't assert a rule the code doesn't honor.** `skills/start` once promised that
  `planning/architecture.md` "fills in progressively as designs get closed" while no file
  in the repo ever wrote it. If a fixed rule isn't implemented yet, name the spec that
  owns it.
