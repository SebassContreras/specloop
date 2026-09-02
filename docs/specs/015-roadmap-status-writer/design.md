# 015 — roadmap-status-writer — Design

Closed retroactively on 2026-09-02: the parser and writer were implemented in the same
pass that rewrote `docs/architecture.md`'s fixed rules to assert them. Asserting a rule
the code doesn't honor is the defect that pass existed to remove, so shipping the two
together was deliberate — but it does mean this design was written after the code, not
before it. The remaining work (`Priority` column, `Stage` column, unit tests) is
unstarted and follows the normal order.

## Approach

Replace both exact-arity row regexes with one shared split-based parser, then give the
roadmap's `Status` column the single writer it never had.

The old `/^\|([^|]*)\|([^|]*)\|([^|]*)\|([^|]*)\|$/` in `roadmap.ts` and `tasks.ts`
matched 4-cell rows only. Adding a column made every row fail to match, and because
both parsers `continue` on a non-match, the failure surfaced as an empty task list —
i.e. `[loop] nothing eligible to run` — rather than an error. That made the "fixed
contract" un-extendable in practice.

Status roll-up is derived from `tasks.md`, not tracked separately, so the two can't
disagree. `human`-owned tasks are excluded from the roll-up: the loop can't act on
them, so a spec whose only remaining work is the user's shouldn't be held open — it's
reported separately instead.

## Deliverables

- `src/mdTable.ts` — `splitRow`, `isHeaderOrSeparator`, `sanitizeCell`, `withCells`.
- `src/roadmap.ts` — positional 4-cell read that ignores trailing columns;
  `writeSpecStatus`.
- `src/tasks.ts` — `Owner`-aware `TaskRow` (layout detected by whether cell 2 holds a
  valid owner, not by cell count, so extra trailing columns still parse);
  `nextRunnableTask` skips `human`; `pendingHumanTasks`; `allTasksSettled`;
  layout-preserving `writeTaskStatus`.
- `src/cli.ts` — `rollUpStatus`, the `writeSpecStatus` call on task exhaustion, the
  human-task report, and a `loop status` that flags roadmap/tasks disagreement instead
  of echoing the recorded cell.
- `src/config.ts` — `contextFiles` (consumed by `014`).

## Sequencing

`mdTable.ts` first; `roadmap.ts`/`tasks.ts` depend on it; `cli.ts` depends on both.

## Open questions / deferred

- Whether the `Stage` column belongs here or in `009-status-dashboard-skill` — both
  want to answer "which skill runs next". Decide before adding it; two writers of the
  same fact is what caused the priority split between row order and `## Priority: N`.
- `sanitizeCell` replaces `|` with `/` rather than escaping it. Escaping would need the
  splitter to understand `\|`, which reintroduces the parsing subtlety the split was
  meant to remove. Revisit only if a real note is mangled unacceptably.
- Whether an unparseable pipe row should warn rather than be skipped silently. Argued
  for in the audit; not implemented, because the header/separator rows are themselves
  legitimately unparseable and distinguishing them needs more than the first cell.
