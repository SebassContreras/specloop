---
name: status
description: >
  Reports what state this repo's roadmap is in and what to run next: reads
  planning/roadmap.md and every listed spec's tasks.md, then prints a chat
  summary (active spec(s), task counts by status, any blocked/interrupted rows,
  a one-line next-suggested-action) and writes planning/dashboard.html, a
  self-contained visual dashboard with the same information. Read-only beyond
  that one file — it never edits roadmap.md, a spec's tasks.md, or anything
  else, and dashboard.html is fully regenerated from scratch each run, not
  patched.
when_to_use: >
  Use when the user wants a snapshot of project state without opening
  roadmap.md and every tasks.md by hand. Trigger on phrasing like "what's the
  status", "where are we", "show me the dashboard", "what's next", "give me a
  status report". Works even before .specloop/loop.config.json exists.
---

# specloop: status

**Read-only.** This phase and every phase after it only reads files — never
edits `planning/roadmap.md`, any spec's `tasks.md`, or anything else. The only
file this skill ever writes is `planning/dashboard.html` (later phases).

## Phase 0 — Read the roadmap and every spec's tasks

Read `planning/roadmap.md`'s table yourself, same positional contract as
`skills/loop`: `| ID | Plan | Status | Depends on | Stage | Priority |` — the
first four cells are `ID`/`Plan`/`Status`/`Depends on`; `Stage` and `Priority`
follow in that order. Ignore any further trailing cell you don't recognize.

For every row, read that spec's `planning/specs/<id>-<name>/tasks.md`. Same
grammar as `skills/loop`, never reformat or write to it:

```
- [ ] T001 [agent] [status:todo] Task text here
      └─ optional note line, exactly 6 spaces then └─
```

The checkbox reflects `done` vs. not; `[status:...]` carries the other four
states (`todo` · `in_progress` · `blocked` · `interrupted` · `done`). A task
line is identified only by starting at column 0 — a `└─` note line is a
continuation of the task above it, not a task of its own.

This is purely a read pass: no row in `roadmap.md` and no line in any
`tasks.md` is edited here or in any later phase of this skill.

## Phase 1 — Compute the summary

From the data Phase 0 already read, derive four things. This skill never runs
anything — it only reports what `skills/loop` would do.

**1. Active spec(s).** Any row already `Status: in_progress`. If none, the
next eligible `todo` row per `skills/loop` Phase 1's own rule, applied
read-only here: lowest-`Priority` row whose every `Depends on` entry is
itself `done` **and** that has at least one runnable task (a task whose
`[status:...]` is `todo` or `interrupted`) — a `todo` spec with an empty or
all-`human` `tasks.md` isn't eligible. `—` in `Priority` sorts last. If
nothing is eligible, report that plainly instead of naming a spec.

**2. Task counts by status.** For every spec, count its tasks across the five
states (`todo` / `in_progress` / `blocked` / `interrupted` / `done`) —
`done` is the checked box, the other four come from `[status:...]`. Report
per-spec counts plus a repo-wide total per state.

**3. `blocked`/`interrupted` rows.** Walk every spec's `tasks.md` and list
each task whose `[status:...]` is `blocked` or `interrupted`, one line per
task: spec ID, task ID, and its task text (plus its note line, if present).
Empty list is fine — say there are none rather than omitting the section.

**4. Next-suggested-action.** For every spec whose `Status` isn't `done`, map
its `Stage` cell to one line naming the skill to run next:

| `Stage` | Suggested next skill |
|---|---|
| `requirements` | `specloop:design-closing` |
| `design_closed` | `specloop:task-breakdown` |
| `tasks_ready` | `specloop:loop-setup` if `.specloop/loop.config.json` doesn't exist yet, else `specloop:loop` |
| `looping` | resume `specloop:loop` |

A spec with `Stage: —` and `Status: done` needs no action — omit it, or mark
it done, rather than giving it a suggestion line.

## Phase 2 — Detect Stage/Status drift

From the same Phase 0 read, cross-check each spec's `Stage`/`Status` cell
against its own files. `Stage` orders low to high as `requirements` <
`design_closed` < `tasks_ready` < `looping` < `—` (done). Each rule below is a
concrete, checkable disagreement between the recorded cell and what the
spec's own files show — this phase never rewrites `roadmap.md` or any
`tasks.md`, only flags rows where they disagree; fixing one is
`012-spec-amend-skill`'s job, not this skill's.

1. **`Status: done` but `Stage` isn't `—`.** The exact bug in
   `planning/fix/002-stage-not-reset-on-done`: `skills/loop`'s Phase 2
   roll-up flipped `Status` to `done` but left `Stage` at `looping`. Flag any
   row where `Status` is `done` and `Stage` is anything but `—`.

2. **`Stage` is `tasks_ready` or `looping` but `tasks.md` is still the
   header-only stub** — zero `- [ ] T...` lines at column 0 in the file
   Phase 0 already read. `Stage` claims tasks exist to run; they don't.

3. **`Stage` is `design_closed`, `tasks_ready`, or `looping` but `design.md`
   is still the `TBD` stub** (same stub `skills/design-closing` checks for
   before it will run: no real content past the placeholder). `Stage` claims
   design is closed; the file disagrees.

4. **`Status: done` but not every `[agent]` task in `tasks.md` is actually
   checked `[x]`/`status:done`.** The roadmap claims the spec is finished
   while at least one agent-owned task's checkbox or `[status:...]` says
   otherwise (`[human]`-owned tasks don't count here — only agent-run tasks
   feed `skills/loop`'s own roll-up). Flag the spec ID and the specific task
   ID(s) that disagree.

5. **`Status` is anything other than `blocked` while some `[agent]` task
   carries `[status:blocked]` or `[status:interrupted]`.** Per `skills/loop`'s
   own roll-up rule the roadmap should show `blocked` whenever a task is
   stuck. Flag the spec ID, its recorded `Status`, and the stuck task ID(s).

**Reporting.** Collect every hit from checks 1-5 into one distinct
"Stage/Status drift found" list in the chat summary, separate from Phase 1's
counts and its `blocked`/`interrupted` task list. Each entry names the spec
ID, which rule fired, and the specific disagreement (e.g. "015: Status done,
Stage looping — expected —"). An empty result is fine — say no drift was
found rather than omitting the section, same convention as Phase 1's own
empty-list handling. This is a report only: a flagged row means the recorded
`Stage`/`Status` can't be trusted at face value, not that this skill has
changed anything.

## Phase 3 — Print the chat summary

Print the report directly in the conversation. Nothing here is new data —
every number and row below was already computed in Phase 1 or Phase 2; this
phase only arranges it for a few seconds' read. Print this summary on every
run, whether or not `planning/dashboard.html` also gets written in a later
phase — the two are not alternatives, and neither one being produced excuses
skipping the other.

Fixed order, terse — one line per item, not prose:

1. **Active spec(s).** Phase 1.1's result: the `in_progress` row(s), or the
   next eligible `todo` spec, or the plain statement that nothing is
   eligible.
2. **Task counts by status.** Phase 1.2's per-spec counts (one line per
   spec: todo/in_progress/blocked/interrupted/done) followed by the
   repo-wide total line.
3. **Blocked/interrupted.** Phase 1.3's list, one line per task (spec ID,
   task ID, task text, note if present), or "none" if empty.
4. **Stage/Status drift found.** Phase 2's list, one line per flagged row
   (spec ID, rule, disagreement), or "none found" if empty.
5. **Next suggested action(s).** Phase 1.4's line(s), one per non-`done`
   spec.

Skip a numbered section header only if this skill is also emitting the
section immediately after it with no gap — otherwise keep all five headers
even when a section's body is just "none". Don't restate Phase 0/1/2's
reasoning or re-derive anything here; this phase is presentation only.

## Phase 4 — Read the fix log

Check whether `planning/fix/` exists. If it doesn't, the fix-log data is an
empty list — that's a normal outcome, not an error or a warning, and nothing
here or later should treat it as one.

If it exists, list its `NNN-name.md` files and read each one — every file in that
folder matches that pattern (`skills/fix/SKILL.md` is the only writer and never
creates anything else).

From each file, extract:

- `id` — the `NNN` from the file name.
- `name` — the `short-name` from the file name, the part after `NNN-` and before
  `.md`.
- `scope` — the trimmed body text under that file's `## Scope` header.
- `found` — the trimmed body text under `## Found`.
- `status` — the trimmed body text under `## Status` (one of `open`/`in_progress`/
  `resolved`/`wontfix`; empty string if the entry predates this field — never
  invent one).
- `fix` — the trimmed body text under `## Fix`.
- `date` — the trimmed body text under `## Date`.

Produce one object per entry as `{"id", "name", "scope", "status", "date", "found",
"fix"}` — all string values, same key names `skills/status/references/template.html`'s
header comment documents for its `fixes[]` array. Order the objects by `id`
ascending, matching the fix log's own numbering.

## Phase 5 — Write the dashboard

This phase never reads or requires `.specloop/loop.config.json` — nothing in
this skill depends on loop configuration at all, so it must succeed
identically whether or not that file exists in the target repo.

**1. Assemble the JSON.** Build one object matching the exact shape documented
in `skills/status/references/template.html`'s header comment:

- `generatedAt` — the current timestamp, ISO 8601.
- `specs` — one entry per row read in Phase 0, every spec in
  `planning/roadmap.md`, not just the active one: `id`/`plan`/`status`/
  `stage`/`priority` from that roadmap row, plus `tasks`: every task already
  parsed from that spec's `tasks.md` in Phase 0, each as `{"id", "owner",
  "status", "text", "note"}`.
- `dependsOn` — that row's `Depends on` cell, parsed into a list of spec ID
  strings rather than passed through as display text: split on commas, trim
  each piece, drop anything empty. An empty cell or `—` becomes `[]`. E.g.
  `"001, 003"` -> `["001", "003"]`; `"—"` -> `[]`.
- `nextEligible` — boolean, `true` for at most one spec: the one Phase 1.1's
  eligibility rule already identifies (the `in_progress` row if one exists,
  else the lowest-`Priority` `todo` row whose every `Depends on` entry is
  itself `done` and that has at least one runnable task), `false` for every
  other spec. Reuse that same computation here rather than re-deriving
  eligibility a second time — if Phase 1.1 finds nothing eligible, every spec
  gets `false`.
- `counts` — per spec, alongside `id`/`plan`/`status`/`stage`/`priority` in
  that same entry: an object `{"todo", "in_progress", "blocked",
  "interrupted", "done"}`, that spec's own task counts by status. Reuse
  Phase 1.2's already-computed per-spec counts — don't recount `tasks.md`
  again here.
- `totals` — one object, same shape as each spec's `counts`
  (`{"todo", "in_progress", "blocked", "interrupted", "done"}`), summed across
  every spec. Sits at the top level alongside `generatedAt`/`specs`, not
  nested inside a spec entry. Reuse Phase 1.2's already-computed repo-wide
  total — don't re-sum here.
- `drift` — Phase 2's flagged list, each as `{"specId", "rule", "message"}`.
- `fixes` — Phase 4's list, already in the right shape; `[]` if
  `planning/fix/` doesn't exist.

No new data-gathering here — every field comes from Phase 0/2/4's already-read
values.

**2. Substitute into the template.** Read
`skills/status/references/template.html` and find the single occurrence of the
placeholder token `__DASHBOARD_DATA_JSON__` inside the
`<script type="application/json" id="dashboard-data">` tag. Replace only that
token with the assembled JSON, serialized and escaped so it's safe to sit
inside a `<script>` tag verbatim: after stringifying, escape every literal
`</script` sequence (case-insensitively, wherever it appears inside a string
value — e.g. `</Script` or `</SCRIPT` too) as `<\/script`, so untrusted task
text or fix-log notes can never close the tag early and break out into the
surrounding HTML. Do not alter any other part of the template.

**3. Write `planning/dashboard.html`.** Write the substituted result to
`planning/dashboard.html` in the target repo, full overwrite every run — not
an edit or patch — so no row from a previous run survives even if a spec was
since removed or renamed. Same path every time, regardless of which specs
exist this run.

**4. Tell the user where it is.** Alongside Phase 3's printed chat summary,
state the dashboard's path as `planning/dashboard.html` (relative — this is
the target repo, not `specloop` itself) so the user knows where to open it.
