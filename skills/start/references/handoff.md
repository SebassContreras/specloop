# Writing `planning/handoff.md`

Read this at any stopping point where the user said yes to a handoff. A handoff is a
point-in-time note for whoever resumes — a later session or a person. It is **not a source
of truth**: `planning/roadmap.md` owns order and status, each spec's `tasks.md` owns the
work, `.specloop/interview.md` owns the interview ledger. Point at them, don't copy them.

## Before writing

1. Overwrite the file, don't append — history lives in `git log -- planning/handoff.md`.
2. Read the ledger, `planning/roadmap.md` and each open spec's `tasks.md` first. Write
   only what you saw there or the user said; leave gaps as "unknown", never guess.
3. Get the session id (below). Do this once, before the first line is written.

## Session id

Put one line right under the title so a resume is one command.

- **Claude Code**: read `$CLAUDE_CODE_SESSION_ID` with the shell tool (`echo
  "$CLAUDE_CODE_SESSION_ID"`; PowerShell: `$env:CLAUDE_CODE_SESSION_ID`). Write
  `Session: <id> — resume with \`claude --resume <id>\` from this repo's root.`
- **Any other harness**: only if it exposes a session id you can read from its own
  environment or documentation. Otherwise omit the line entirely.
- Empty or unset variable → omit the line. Never invent, shorten or reuse an id from an
  earlier handoff. Say in the file that the session id is unavailable only if a reader
  would otherwise wonder.

A session id is only a shortcut: the handoff must still be enough to resume without it
(the transcript may be pruned, or the person may be on another machine).

## Shape

Sections in this order; drop one only when it would be empty, never pad it.

```
# Handoff — YYYY-MM-DD

Session: <id> — resume with `claude --resume <id>`      ← omit if unavailable

One paragraph: this is a point-in-time note, not a source of truth, and what owns
each thing (roadmap, tasks.md, ledger). Branch and working-tree state.

## Done this session
What changed and why, one bullet each, with the spec/fix/file it lives in.

## Next
Ordered. Each item: what, and why it's next (Priority, dependency, blocker).
Name the exact command to resume, e.g. `specloop:start` (ledger picks up at the first
`open` dimension) or `specloop:advance`.

## Open / skipped
Every ledger `open` or `skipped` dimension and every deferred spec, with the reason —
a bare `open` says *that* something is unanswered, not *why*.

## Traps
Things that already cost time or will: non-obvious ordering, files a tool owns, a
decision the user already made that shouldn't be re-litigated.

## Not verified — don't claim otherwise
What was written but never run, or only run under one harness.
```

## Rules

- Terse, structural, English, no filler (`planning/styles.md` rules apply if present).
- Dates are absolute (`2026-09-29`), never "today"/"yesterday".
- Reference code as `path:line` or a spec id, not by pasting it.
- Never record a user answer the user didn't give; quote or omit.
- If the interview is finished and only per-spec requirements remain, say so and name both
  resume paths — `specloop:advance` drafts them, `specloop:start` asks one by one — and
  which the user chose, if they did.
