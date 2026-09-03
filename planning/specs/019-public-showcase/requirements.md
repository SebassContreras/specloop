# 019 — public-showcase — Requirements

## What's being built

A public-facing presentation pass for the now-public `specloop` repo, so a visitor
landing on it sees proof it works and enough material to understand it, not just prose.
Adds to `README.md`:

- Screenshots of a real run (`/specloop:start`'s interview, `loop run` working through
  a spec) — actual terminal captures, not mockups.
- An architecture/flow diagram showing how `specloop:start` → `design-closing` →
  `task-breakdown` → `loop-setup` → `loop run` fit together.
- A short demo GIF of the flow end to end.
- A project banner/logo for the README header.

Plus whatever supporting docs the design phase decides are missing beyond a single
README (e.g. a longer "how it works" page, FAQ) — left open here, resolved in
`design.md`.

## Who/what it serves

Anyone landing on the public GitHub repo cold — a prospective user or contributor
deciding whether this is worth their time — without having to read through `planning/`.

## Hard constraints

- No fabricated screenshots or invented UI — every capture is from an actual run
  (this repo dogfooding itself, or a throwaway target repo).
- Doesn't block or get blocked by any other spec — `005` already shipped the repo as
  public; this fills it in afterward.

## Acceptance criteria

- `README.md` shows at least one real screenshot of the interview and one of `loop run`
  executing a task.
- A diagram exists showing the five-skill flow and is linked from `README.md`.
- A short demo GIF exists and is linked from `README.md`.
- A banner/logo image exists and is used in `README.md`'s header.

## Out of scope

- A dedicated docs site (GitHub Pages, VitePress, etc.) — a richer `README.md` plus
  whatever `design.md` adds is the target for this pass, not a new toolchain.
- Marketing copy rewrites of files `specloop:start` owns (`planning/product.md`,
  `planning/architecture.md`) — this spec only touches public-facing presentation.
