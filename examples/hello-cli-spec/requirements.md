# 001 — hello-cli

> Example output of `specloop:start`'s Phase 3 (spec creation + requirements Q&A),
> for a toy target repo. See `examples/README.md`.

## Requirements (draft — to be reviewed)

- A single-file CLI, `hello`, that prints a greeting to stdout and exits `0`.
- Usage: `hello [name]`. With no argument, greets `"World"`. With one argument,
  greets that name (e.g. `hello Ada` → `Hello, Ada!`).
- No dependencies — must run with only the target repo's existing runtime (Node.js,
  per `planning/architecture.md`), no npm install step for this spec.
- Exit code `0` on success. Exit code `1` and a one-line usage message on stderr if
  called with more than one argument.

## Out of scope

- No config file, no flags (`--help`/`--version`) — first pass is the bare
  greeting behavior only. Revisit if a later spec actually needs them.
- No packaging/publishing (npm registry, binary build) — this spec only covers the
  script itself running locally.
