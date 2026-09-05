# 001 — hello-cli — Tasks

> Example output of `specloop:task-breakdown`, drafted and confirmed from the
> design above. See `examples/README.md`.

Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`
Owner: `agent` (loop-runnable) · `human` (skipped by the loop)

- [x] T001 [agent] [status:done] Create `bin/hello.mjs`: parse `process.argv.slice(2)`, print `Hello, <name>!` (default `World`)
- [x] T002 [agent] [status:done] Handle the &gt;1-argument error case: exit `1`, one-line usage message on stderr
- [x] T003 [agent] [status:done] Add `package.json`'s `bin.hello` entry
- [x] T004 [agent] [status:done] Manual smoke test: `hello`, `hello Ada`, `hello a b` (error case)
      └─ Matches this repo's own `006-e2e-smoke-testing` convention — a manual run recorded here, not a hidden step.
