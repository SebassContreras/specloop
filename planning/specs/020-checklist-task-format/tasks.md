# 020 — checklist-task-format — Tasks

Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`
Owner: `agent` (loop-runnable) · `human` (skipped by the loop)

- [x] T001 [agent] [status:done] Add `src/checklist.ts`: `parseChecklistLine`, `renderTaskLine`, `renderNoteLine`, `sanitizeNote`
- [x] T002 [agent] [status:done] Rewrite `src/tasks.ts` onto the checklist grammar, keeping `TaskRow`'s external shape and every other exported function's signature unchanged
- [x] T003 [agent] [status:done] Write a migration script with per-row owner detection (mirroring the old `toRow`'s `cells.length >= 5 && isOwner(cells[2])`), and run it over every `planning/specs/*/tasks.md` and `examples/hello-cli-spec/tasks.md`
      └─ Caught and fixed one pre-existing 4-column legacy row (`002` T13) that a naive uniform-column assumption would have misread.
- [x] T004 [agent] [status:done] Verify: round-trip every migrated file through the new `parseTasks` (132 rows, 0 malformed-row warnings), verify `writeTaskStatus`'s surgical rewrite leaves untouched rows and untouched parts of the touched line byte-for-byte identical, `pnpm run typecheck` and `pnpm run lint` clean
- [x] T005 [agent] [status:done] Update `skills/task-breakdown/SKILL.md`'s Phase 3 authoring template and `skills/start/SKILL.md`'s stub template to the new grammar
- [x] T006 [agent] [status:done] Update `examples/hello-cli-spec/tasks.md`, `examples/README.md`, and `planning/handoff.md`'s stale pipe-table trap/grep command
- [x] T007 [agent] [status:done] Add the Fixed rule + two Declined rows to `planning/architecture.md`, and this spec's `requirements.md`/`design.md`
- [x] T008 [agent] [status:done] Add the `020`/`021` rows + build-order note to `planning/roadmap.md`, and create `021-harness-worker-backend`'s `requirements.md` (design/tasks stay `TBD` stubs — not designed yet)
- [ ] T009 [agent] [status:todo] Update `README.md` (the new `tasks.md` format, and pointers to `020`/`021`) and add a `CHANGELOG.md` entry
