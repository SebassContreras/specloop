# 030 — dashboard-build-script

Raised 2026-09-14, from a live `specloop:status` run under OpenCode that
built the dashboard via ad hoc Python scratch scripts (not persisted) — real
output was correct, which raised the question of whether to standardize on
that approach instead of leaving `SKILL.md`'s Phases 0-5 as prose each
harness re-implements freehand every run. See `planning/architecture.md`'s
two Declined-table/Fixed-rule scope notes added the same day.

## What's being built

A single, stdlib-only Python script (`skills/status/scripts/build_dashboard.py`
— exact path/name confirmed at design-closing) that becomes the sole
implementation of `skills/status`'s mechanical work — currently Phases 0
through 5 of `SKILL.md`: read `planning/roadmap.md` and every spec's
`tasks.md`, compute task counts/eligibility, detect the five
`Stage`/`Status` drift rules, read `planning/fix/`, assemble the JSON
contract, substitute it into `skills/status/references/template.html`,
escape it safely, and write `planning/dashboard.html`. `SKILL.md`'s job
shrinks to: run the script, then present its output as the Phase 3 chat
summary — it no longer restates the algorithm in prose.

## Who/what it serves

Any harness running `specloop:status` gets byte-identical output for the
same inputs, without depending on how faithfully that harness manually
replicates a multi-step prose algorithm (escaping, JSON shape, positional
parsing) — removes the class of variance raised this session (OpenCode
improvising its own throwaway scripts to do this reliably).

## Hard constraints

- **Standard library only, no `pip install` step.** A script with a
  dependency-install step reintroduces exactly the friction this repo
  already removed once when `framework/orchestrator/` was retired (a
  different problem there — it had become *the master* — but the
  no-install-step property is worth keeping regardless).
- **No fallback path.** If `python3` isn't on `PATH`, `specloop:status`
  fails with a clear message naming the missing dependency —`SKILL.md` does
  not keep a parallel prose algorithm as a backup. Deliberate choice
  (confirmed 2026-09-14): a fallback would reintroduce a second source of
  truth for the same logic.
- Output must match what `SKILL.md`'s current Phase 0-5 prose already
  specifies — same JSON schema, same escaping rule (`</script` neutralized
  case-insensitively wherever it appears in a string value), same
  full-overwrite-every-run behavior. This spec replaces *how* the algorithm
  is executed, not *what* it computes.
- The script owns the JSON schema going forward — `skills/status/
  references/template.html`'s header comment either gets dropped or reduced
  to a pointer at `build_dashboard.py`, not left as a second schema
  description.
- Must still work with zero dependency on `.specloop/loop.config.json`
  existing, same as `009`'s original constraint.

## Acceptance criteria

- [ ] `skills/status/scripts/build_dashboard.py` runs standalone (exact
      invocation confirmed at design-closing) and produces
      `planning/dashboard.html` with no input beyond the files already in
      the repo.
- [ ] Running it twice against unchanged input files produces
      byte-identical `dashboard.html` output — true determinism, not just
      "looks the same".
- [ ] `SKILL.md`'s Phases 0-5 are replaced by an instruction to run the
      script and use its output; no parallel prose description of the
      algorithm remains.
- [ ] All five `Stage`/`Status` drift rules and the eligibility rule
      produce the same results the current prose algorithm does, verified
      against this repo's own real data (same approach `026` T014 used).
- [ ] Running `specloop:status` with `python3` deliberately unavailable
      (e.g. renamed off `PATH` in a throwaway fixture) fails with a clear,
      explicit error naming the missing dependency — not a silent
      fallback, not a cryptic stack trace.

## Out of scope

- Any change to `skills/loop`'s own execution model — the Declined-table
  scope note clarifies this doesn't touch the loop/master role, and this
  spec doesn't either.
- Adding Python (or any runtime) as a dependency for any skill other than
  `skills/status`.
- A fallback path for missing Python — deliberately declined above, not a
  future addition to sneak back in without revisiting this decision.

## Dependencies

`009` (status-dashboard-skill), `026` (dashboard-visual-enhancements) — this
replaces their shared implementation, not their behavior/contract.

## Owner split

(none stated)
