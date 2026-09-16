---
name: status
description: >
  Reports what state this repo's roadmap is in and what to run next: runs
  skills/status/scripts/build_dashboard.py — which reads planning/roadmap.md
  and every listed spec's tasks.md — to write planning/dashboard.html, a
  self-contained visual dashboard, then prints a chat summary (active
  spec(s), task counts by status, any blocked/interrupted rows, any
  Stage/Status drift, a one-line next-suggested-action) derived from that
  same written output. Read-only beyond running that script — it never edits
  roadmap.md, a spec's tasks.md, or anything else, and dashboard.html is
  fully regenerated from scratch each run, not patched.
when_to_use: >
  Use when the user wants a snapshot of project state without opening
  roadmap.md and every tasks.md by hand. Trigger on phrasing like "what's the
  status", "where are we", "show me the dashboard", "what's next", "give me a
  status report". Works even before .specloop/loop.config.json exists.
---

# specloop: status

**Read-only.** This phase and every phase after it only reads files — never
edits `planning/roadmap.md`, any spec's `tasks.md`, or anything else. The
only file this skill ever writes is `planning/dashboard.html`, and it's the
script in Phase 0 that writes it, not this skill's own prose.

## Phase 0 — Run the build script

Run, from the target repo's root, with no arguments:

```
python3 skills/status/scripts/build_dashboard.py
```

This one script owns all of the mechanical work — reading
`planning/roadmap.md` and every spec's `tasks.md`, computing task counts and
eligibility, detecting the five `Stage`/`Status` drift rules, reading
`planning/fix/`, assembling the JSON, and writing `planning/dashboard.html`.
Nothing here restates that algorithm in prose — don't re-read
`planning/roadmap.md` or any spec's `tasks.md` directly, in this phase or any
later one, to compute or double-check anything the script already computed.

**If `python3` isn't found on `PATH`,** detect this however the failure
surfaces in this harness's command-execution — a nonzero/`127` exit code, a
thrown exception, or `not recognized`/`not found` appearing in the output —
and report exactly this, then stop:

```
specloop:status requires python3, which was not found on PATH. Install Python 3 and retry.
```

No fallback prose algorithm — this skill does not compute the dashboard by
hand when the script can't run.

**If the script fails for any other reason** (nonzero exit, a message on
stderr — e.g. `planning/roadmap.md` missing), print that error message
verbatim and stop. Don't guess a cause or substitute a different message.

## Phase 1 — Read back the dashboard JSON

Read `planning/dashboard.html`, the file Phase 0 just wrote. Find the
`<script type="application/json" id="dashboard-data">...</script>` block and
take its text content. Unescape it before parsing — the script escapes every
literal `</script` (case-insensitively) as `<\/script` on the way in, so
reverse that (`<\/script` -> `</script`, case-insensitively) before handing
the text to a JSON parser. Parse the result as JSON; this object is the sole
source for every phase below.

Never re-read or re-parse `planning/roadmap.md` or any spec's `tasks.md`
directly from here on — every fact in the chat summary comes from this
parsed JSON, exactly the object Phase 0's script assembled.

## Phase 2 — Print the chat summary

Print the report directly in the conversation. Nothing here is new data —
every field was already computed by Phase 0's script and read back in
Phase 1; this phase only re-shapes JSON fields into a few seconds' read, and
prints alongside the fact that `planning/dashboard.html` carries the same
information. Print this summary on every run, whether or not the user also
opens the dashboard file — the two are not alternatives, and neither one
being produced excuses skipping the other.

Fixed order, terse — one line per item, not prose:

1. **Active spec(s).** From the JSON's `specs` array: every spec whose
   `status` is `"in_progress"`. If none, the one spec whose `nextEligible` is
   `true`. If none of those either, state plainly that nothing is eligible.

2. **Task counts by status.** One line per spec from that spec's own
   `counts` object (`todo`/`in_progress`/`blocked`/`interrupted`/`done`),
   followed by one repo-wide total line from the JSON's top-level `totals`
   object (same shape).

3. **Blocked/interrupted.** Walk every spec's `tasks` array (any `owner`,
   not just `agent` — this list isn't the same as Phase 2 section 4's
   agent-only drift rules) and list each task whose `status` is `blocked` or
   `interrupted`: spec ID, task ID, its `text`, plus its `note` if
   non-empty. "none" if the list is empty.

4. **Stage/Status drift found.** The JSON's `drift` array directly, one line
   per entry (`specId`, `rule`, `message`). "none found" if the array is
   empty.

5. **Next suggested action(s).** For every spec in the JSON whose `status`
   isn't `"done"`, map its `stage` field to one line naming the skill to run
   next:

   | `stage` | Suggested next skill |
   |---|---|
   | `requirements` | `specloop:advance` (or `specloop:design-closing` directly, for just this one spec) |
   | `design_closed` | `specloop:advance` (or `specloop:task-breakdown` directly, for just this one spec) |
   | `tasks_ready` | `specloop:loop-setup` if `.specloop/loop.config.json` doesn't exist yet, else `specloop:loop` |
   | `looping` | resume `specloop:loop` |

   The `tasks_ready` row needs one real, on-disk check — whether
   `.specloop/loop.config.json` exists in the target repo — since that file
   isn't part of the JSON; every other row needs only the JSON's `stage`
   field. A spec whose `stage` is `—` and `status` is `done` needs no
   action — it's already excluded by the `status != "done"` filter above.

Skip a numbered section header only if this skill is also emitting the
section immediately after it with no gap — otherwise keep all five headers
even when a section's body is just "none". Don't re-derive anything beyond
reading the JSON's own fields; this phase is presentation only.

## Phase 3 — Report the dashboard path

Alongside the printed chat summary, state the dashboard's path as
`planning/dashboard.html` (relative — this is the target repo, not
`specloop` itself) so the user knows where to open it.
