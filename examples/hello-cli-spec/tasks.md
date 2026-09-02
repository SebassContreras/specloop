# 001 — hello-cli — Tasks

> Example output of `specloop:task-breakdown`, drafted and confirmed from the
> design above. See `examples/README.md`.

Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`

| ID | Task | Status | Notes |
|----|------|--------|-------|
| T1 | Create `bin/hello.mjs`: parse `process.argv.slice(2)`, print `Hello, <name>!` (default `World`) | done | |
| T2 | Handle the &gt;1-argument error case: exit `1`, one-line usage message on stderr | done | |
| T3 | Add `package.json`'s `bin.hello` entry | done | |
| T4 | Manual smoke test: `hello`, `hello Ada`, `hello a b` (error case) | done | Matches this repo's own `006-e2e-smoke-testing` convention — a manual run recorded here, not a hidden step. |
