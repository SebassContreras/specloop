# 031 — markdown-convention-retrofit — Tasks

Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`
Owner: `agent` (loop-runnable) · `human` (skipped by the loop)

- [x] T001 [agent] [status:done] Remap `planning/specs/001-scaffold-and-spec-skill/requirements.md` to the canonical 7-header set (`## What's being built` / `## Who/what it serves` / `## Hard constraints` / `## Acceptance criteria` / `## Out of scope` / `## Dependencies` / `## Owner split`) — preserve every existing claim, add "(none stated)"/"not yet defined" for a thin section rather than dropping it, resolve any genuine ambiguity toward the more specific header
      └─ Verified against disk. See `.specloop/logs/031.log`.
- [x] T002 [agent] [status:done] Same remap for `planning/specs/002-loop-orchestrator/requirements.md` — this one has an extra custom section ("The loop runs as a chat session — no standalone script or CLI"); fold its substance into the appropriate canonical header(s) (most likely `## What's being built`/`## Hard constraints`), don't drop any claim
      └─ Verified against disk. See `.specloop/logs/031.log`.
- [x] T003 [agent] [status:done] Same remap for `planning/specs/003-task-breakdown-skill/requirements.md`
      └─ Verified against disk. See `.specloop/logs/031.log`.
- [x] T004 [agent] [status:done] Same remap for `planning/specs/004-design-closing-skill/requirements.md`
      └─ Verified against disk. See `.specloop/logs/031.log`.
- [x] T005 [agent] [status:done] Same remap for `planning/specs/005-open-source-release/requirements.md`
      └─ Verified against disk. See `.specloop/logs/031.log`.
- [x] T006 [agent] [status:done] Same remap for `planning/specs/006-e2e-smoke-testing/requirements.md`
      └─ Verified against disk. See `.specloop/logs/031.log`.
- [x] T007 [agent] [status:done] Same remap for `planning/specs/012-spec-amend-skill/requirements.md`
      └─ Verified against disk. See `.specloop/logs/031.log`.
- [x] T008 [agent] [status:done] Same remap for `planning/specs/024-loop-skill-verification/requirements.md` — custom headers ("Why this exists", "What's being verified"); fold "Why this exists" into `## What's being built`/`## Who/what it serves`, turn "What's being verified" bullets into `## Acceptance criteria` (they already function as verification criteria)
      └─ Verified against disk. See `.specloop/logs/031.log`.
- [x] T009 [agent] [status:done] Same remap for `planning/specs/025-master-handoff/requirements.md` — a deferred spec; keep its "not yet defined"/deferred framing intact where content genuinely doesn't exist yet
      └─ Verified against disk. See `.specloop/logs/031.log`.
- [x] T010 [agent] [status:done] Heading-case sweep across every `planning/specs/*/design.md` — sentence-case any non-conforming heading; leave section names/content otherwise untouched (e.g. `002`'s history-log section names stay, only casing changes)
      └─ Genuine no-op, all 25 files already conformed (including the repo-wide `## Phase N — ...` convention, correctly recognized as established rather than a violation). Verified against disk. See `.specloop/logs/031.log`.
- [x] T011 [agent] [status:done] Heading-case sweep across every `planning/specs/*/tasks.md` — verify sentence case on each `# NNN — name — Tasks` header; report if genuinely a no-op rather than assuming
- [x] T012 [agent] [status:done] Heading-case + structure sweep across every `skills/*/SKILL.md` and `skills/start/references/question-bank.md`; re-run `node scripts/check-skill-consistency.mjs` and confirm it still passes after any edit
      └─ No changes needed, all 9 files already sentence case. Consistency script: all checks passed — group [3] now reports "0 spec(s) use the legacy header", confirming T001-T009's remap landed correctly. See `.specloop/logs/031.log`.
- [x] T013 [agent] [status:done] Heading-case sweep across root docs: `README.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CHANGELOG.md`, `.github/PULL_REQUEST_TEMPLATE.md`
      └─ Only `SECURITY.md` needed a fix ("Security Policy" → "Security policy"). Verified against disk. See `.specloop/logs/031.log`.
- [x] T014 [agent] [status:done] Heading-case sweep across `planning/product.md`, `planning/architecture.md`, `planning/roadmap.md`, `planning/handoff.md`, `planning/styles.md`
      └─ Only `styles.md` needed a fix ("Brand references / Accessibility" → "Brand references / accessibility"). Verified against disk. See `.specloop/logs/031.log`.
- [x] T015 [agent] [status:done] Retrofit `examples/hello-cli-spec/` and `examples/marketing-content-spec/` (all 3 files each — `requirements.md` to the canonical 7-header set, `design.md`/`tasks.md` heading-case only, same treatment as T010/T011)
      └─ Both requirements.md now canonical (hello-cli-spec: full remap; marketing-content-spec: only Dependencies/Owner split were missing, appended). Both design.md/tasks.md pairs already conformed, byte-identical. Verified against disk. See `.specloop/logs/031.log`.
- [x] T016 [agent] [status:done] Final verification: re-run `node scripts/check-skill-consistency.mjs`, spot-check a sample of diffs (at minimum the 9 remapped requirements.md plus both example specs) confirming no meaning was lost or invented, and confirm every acceptance criterion in `031`'s own `requirements.md` is met
      └─ First pass found a real gap (fixed by T017). Second pass: all 5 acceptance criteria PASS with direct evidence — 25/25 requirements.md files have the exact 7-header set (independently re-counted by the orchestrating session too), consistency script passes, spot-checked diffs are purely additive, both example specs conform. See `.specloop/logs/031.log`.
- [x] T017 [agent] [status:done] Fix the gap T016 found: add `## Dependencies` and `## Owner split` to the 10 `requirements.md` files missing them entirely (`009-status-dashboard-skill`, `014-worker-context-injection`, `015-roadmap-status-writer`, `016-interview-engine`, `017-project-type-genericity`, `018-project-style-preferences`, `019-public-showcase`, `020-checklist-task-format`, `022-cross-agent-skill-compat`, `023-fix-log`) — same rule as T001-T009: derive `Dependencies` from each spec's own `planning/roadmap.md` row, `Owner split` is "(none stated)" unless the file already implies an owner-specific note
      └─ All 10 fixed, additive-only (spot-checked via `git diff`, other 5 sections untouched). See `.specloop/logs/031.log`.
