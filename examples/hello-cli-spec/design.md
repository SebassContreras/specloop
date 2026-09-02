# 001 — hello-cli — Design

> Example output of `specloop:design-closing`, closed from the requirements above.
> See `examples/README.md`.

## Approach

Single Node.js script, no dependencies, no build step — matches the "no npm
install for this spec" requirement. Argument parsing is a plain `process.argv`
slice; no argument-parsing library, since there's exactly one optional positional
argument.

## Components / files touched

- `bin/hello.mjs` — the whole implementation: read `process.argv.slice(2)`,
  validate arg count, print the greeting, set `process.exitCode`.
- `package.json` — add a `bin.hello` entry pointing at `bin/hello.mjs`.

## Open questions / deferred

- Whether `hello` should trim/validate the name argument (e.g. reject an empty
  string) is deferred — out of scope per `requirements.md`, revisit only if a
  real caller hits it.
