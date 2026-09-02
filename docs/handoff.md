# Handoff — 2026-09-02

Written at the end of the session that restored the six stated objectives and
implemented `014`. Branch: `restore-stated-objectives` (4 commits, pushed, not merged).

**This file is not the source of truth and must not become one.** `docs/roadmap.md` owns
order and status; each spec's `tasks.md` owns the work. Duplicating them here would
recreate the exact defect this session removed — two unsynchronised records of the same
fact. What's below is only the part *not* on record: why things are the way they are,
which traps to avoid, and where judgement is still needed.

To see what's actually open:

```bash
node scripts/check-skill-consistency.mjs        # 38 static checks over the 4 skills
cd framework/orchestrator && pnpm exec tsc --noEmit && pnpm exec eslint src
grep -rn "| todo \|| in_progress \|| blocked \|| interrupted " docs/specs/*/tasks.md
```

---

## The one thing to read before touching scope

On 2026-09-02 an uncommitted change narrowed `skills/start` and recorded the removals in
`docs/architecture.md`'s "Declined" table, citing a `docs/product.md` clause **that the
same change had written**. `docs/product.md:15` had said *"Asks questions to choose the
stack/tooling"* since the initial commit; the change deleted that line, wrote *"the
roadmap structure and the loop, nothing else"* in its place, then rejected four of the
user's six stated objectives as "scope creep past `docs/product.md`". Spec `001`'s T15
justified itself "per docs/product.md" while T17 — a *later* task — is what wrote the
clause being cited. The offered escape hatch ("it becomes a spec instead") was never
exercised: no such roadmap rows existed.

Two rules now exist because of it (`docs/architecture.md`, `CLAUDE.md`):

1. **A Declined row may not overrule a stated user objective**, nor cite a
   `product.md` clause edited in the same change. Declining something the user asked
   for needs a dated decision from the user.
2. **Don't assert a rule the code doesn't honor.** `skills/start` once promised
   `docs/architecture.md` "fills in progressively as designs get closed" while no file
   anywhere wrote it. If a fixed rule isn't implemented, name the spec that owns it.

The distinction that actually holds, and that the revert got wrong: **a file the loop's
own workers read is infrastructure `skills/start` owns** (`AGENTS.md`, `CLAUDE.md`,
`docs/styles.md`, `.specloop/`); **a file the project ships is a deliverable the roadmap
decides** (`README.md`, `CONTRIBUTING.md`, `LICENSE`, CI config). The second half of the
revert was correct and still stands.

---

## What's next, in order

Build order lives in `docs/roadmap.md`. The short version, with the reasoning:

1. **`001` T30 — the live interactive run. Human-only, and the biggest open risk.**
   Everything else is gated on what it reveals. See "Why an agent can't do this" below.
2. **`016` interview-engine** — enforces the coverage contract `001` currently only
   *states*. `skills/start` describes the ledger, follow-up triggers and closing sweep;
   nothing verifies a run obeyed them. Do this after T30, because T30 may change the
   contract (see T31).
3. **`017` project-type-genericity** — the classifier and branching are in; what remains
   is type-keyed `architecture.md` headers, tolerating its absence downstream, and
   **a non-software fixture** (`006` T11). That fixture is the point: the generality
   claim being untested is how it broke the first time.
4. **`018` styles** — now actually deliverable, since `014` shipped.
5. **`007` unit tests** — then fold in `014` T11 and `015` T14, which are ad-hoc scratch
   checks today, not a regression suite.
6. **`015` T12/T13** — add the `Priority` column (the parser tolerates it now) and
   retire the `## Priority: N` header convention that exists only because it couldn't.

`006` T2–T7 are `blocked` as superseded by `006` T10; `001` T8 likewise by T30. They're
kept rather than deleted so the history stays readable — don't try to run them.

---

## Why an agent can't do `001` T30 / `006` T10

The interview's entire purpose is to elicit *the user's* answers. An agent running
`/specloop:start` would invent the project's goal, stack and colour preferences, then
validate its own fabrications and report success — worse than leaving it untested,
because it would *look* tested.

What that run must establish is behavioural, not structural:

- Is an 8-phase interview actually bearable to sit through?
- Does the closing sweep converge, or nag? ("nothing new twice" is its only brake)
- Do the follow-up triggers fire on genuinely vague real answers?
- Does a real worker CLI *honor* the briefing? A stub proves delivery, not obedience.

```bash
claude --plugin-dir "C:\Users\scontreras\Documents\GitHub\specloop"
# then /specloop:start in a throwaway repo
```

`001` T31 records the decision it should settle: the contract deliberately removes the
ceiling on questions, which is what the objective demands. If it nags in practice, add a
per-phase "that's enough for now" exit — but only with evidence, since the whole point
of the meta-requirement was that the old fixed script left points unaddressed.

---

## Traps

Each of these cost real time this session.

- **The `Plan` cell is a path component.** `tasks.ts` concatenates `NNN` + `Plan` into
  `docs/specs/NNN-name/`. A human-readable label there breaks the loop silently.
- **Escape pipes in task text as `\|`.** Rows describing the `ID | Task | Status |
  Notes` contract shredded the parser. It now splits on unescaped pipes only and warns
  on a malformed row, but write them escaped.
- **`loop status` shows two values when they disagree** — the roadmap cell and what
  `tasks.md` actually says. Believe the second.
- **`.specloop/loop.config.json` on Windows**: use `/` or `\\` in paths. A raw `\U`
  makes it invalid JSON; the error now says so, but it's still easy to hit.
- **The orchestrator only runs from a target repo**, never from here.
  `framework/orchestrator/` is reference source; `loop-setup` copies it.
- **Don't add a roadmap column without checking the parser** — it now reads the first
  four cells positionally and ignores the rest, so this is safe, but that was *not* true
  before this session and the failure mode was silent ("nothing eligible to run").

## Not verified — don't claim otherwise

- The live interactive interview (above). **Nothing in the 8-phase flow has ever run.**
- `windowsTerminal`/`tmux` backends — they detach, so the master can't observe the
  outcome. Needs a real terminal per OS (`006` T12).
- Whether a real model obeys the worker briefing (`014` T9 proves it's delivered).
- Non-software project types end-to-end (`006` T11).
- The prompt is English-only. `question-bank.md`'s `tone` dimension can record a working
  language; nothing consumes it (`014` T10).

## Suggestions

- **Merge the branch before starting `016`.** It's 4 commits deep and touches
  everything; rebasing later against further work will be unpleasant.
  `git checkout main && git merge --ff-only restore-stated-objectives`
- **Run `scripts/check-skill-consistency.mjs` before every skill edit.** It caught the
  `design-closing` header bug class, and it's verified to actually fail (I re-introduced
  two bugs to check). Wire it into `008`'s CI as the first job.
- **Do `006` T11 (non-software fixture) early, not last.** It's agent-runnable and
  independent of the live run, and it's the only thing that would catch software
  assumptions creeping back into the skills.
- **Resist re-narrowing `skills/start`.** The interview is long *by requirement*. If it
  feels bloated, the fix is T31's escape hatch, not deleting phases — that's what
  happened last time.
- **`015` T15 needs a decision**: does the `Stage` column belong in `015` or `009`? Both
  want to answer "which skill runs next". Two writers of one fact is what produced the
  priority split between row order and `## Priority: N`.
- **Consider whether `docs/architecture.md` should be renamed** for non-software
  projects. Type-keyed headers (`017`) address the mismatch; the filename still reads
  oddly for a marketing project. Deliberately not done — it touches every spec and
  skill, and it's a naming preference, not a defect.
