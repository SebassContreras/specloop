# 020 — checklist-task-format

## Priority: 4

## What's being built

**Implemented 2026-09-05**, in the same session that decided it, the same way `015`
was: asserting a format the code doesn't honor is the exact defect this repo's own
rules exist to prevent, so shipping the two together was deliberate. This design was
written after the code, not before it.

Started from "is specloop an agent harness, and should its specs interoperate with
GitHub spec-kit?" — investigating spec-kit's actual templates found no owner
(agent/human) concept and no 5-state status (it assumes everything is agent-runnable),
so wholesale adoption was rejected (see `planning/architecture.md`'s Declined table).
But spec-kit's `tasks.md` convention itself — a GFM checkbox list, zero-padded `T001`
IDs — is the genuinely industry-familiar part, and there's no reason specloop's own
owner/status distinction can't ride on top of it instead of a hand-rolled pipe table.

Delivered:

- `src/checklist.ts` — the checkbox-list grammar: `parseChecklistLine`,
  `renderTaskLine`, `renderNoteLine`, `sanitizeNote`. Sibling to `mdTable.ts`, which
  stays as-is for `roadmap.ts` (no spec-kit equivalent to borrow there — there's no
  central index to map onto, and a status-across-many-specs index is what a table is
  actually good at).
- `src/tasks.ts` rewritten onto that grammar. `TaskRow`'s external shape (`id`, `task`,
  `owner`, `status`, `notes`) is unchanged, so `cli.ts`/`worker.ts`/`safeStop.ts` needed
  no changes; `statusIndex`/`cells` (table positional bookkeeping) became `lineIndex`/
  `noteLineIndex`. `writeTaskStatus` rewrites only the checkbox char and the
  `[status:...]` substring (plus the note line) — everything else on the line is
  untouched, same spirit as the old `withCells` preserving unknown trailing columns.
- Every existing `tasks.md` (specs `001`–`019`, 128 rows) and `examples/hello-cli-spec/
  tasks.md` migrated to the new grammar, IDs renumbered `T1`→`T001`-style. No dual-format
  reader kept afterward, per this repo's own no-shims rule — a stray 4-column legacy row
  found during migration (`002` T13, missing its `Owner` cell) was caught and fixed by
  per-row detection during the migration, not by keeping two parsers.
- `skills/task-breakdown/SKILL.md` (the live author of `tasks.md`) and `skills/start/
  SKILL.md`'s stub template updated to the new grammar.
- `planning/architecture.md` gained the Fixed rule documenting the grammar precisely,
  and two Declined-table rows recording what was rejected and why.

## Who/what it serves

Anyone reading a target repo's `tasks.md` on GitHub (real rendered checkboxes, not a
hand-rolled table) or arriving from spec-kit and recognizing the convention — while the
loop itself keeps the owner/status distinction that makes it safe to run unattended,
which spec-kit's own format has no room for.

## Hard constraints

- **Never lose the 5-state status or the owner distinction.** These are the actual
  safety feature (`nextRunnableTask`/`pendingHumanTasks`); a plain done/not-done
  checkbox is not enough on its own — hence the explicit `[status:...]` tag.
- **A task line is identified only by starting at column 0** with `- [ ]`/`- [x]` —
  never by counting delimiters across the line, which is what made the old pipe table
  breakable by an unescaped `|` inside a task's own text.
- **Surgical rewrite**: `writeTaskStatus` must not rewrite a line it doesn't need to —
  the owner tag and description survive a status flip byte-for-byte.
- `roadmap.md` is unaffected — it keeps the pipe-table index; nothing here changes it.

## Acceptance criteria

- Every migrated `tasks.md` round-trips through `parseTasks` with the same
  `{id, owner, status, notes}` set it had before migration. *(Verified 2026-09-05 —
  132 rows across 20 files, 0 malformed-row warnings.)*
- A status flip via `writeTaskStatus` changes only the checkbox and `[status:...]`
  substring (and the note line); every other row, and every other part of the touched
  line, is untouched. *(Verified 2026-09-05.)*
- `pnpm run typecheck` and `pnpm run lint` are clean in `framework/orchestrator/`.
  *(Verified 2026-09-05.)*
- `skills/task-breakdown` and `skills/start` author the new grammar, not the old table.

## Out of scope

- Any change to `requirements.md`/`design.md`'s own shape — only `tasks.md` was in
  scope.
- `roadmap.md`'s format.
- Executing tasks through an actual agent harness/SDK instead of CLI-spawning — that's
  `021-harness-worker-backend`, deliberately sequenced after and not designed here.
- Committed regression tests for the new parser (folds into `007-orchestrator-unit-tests`
  same as `015`'s round-trip checks did).
