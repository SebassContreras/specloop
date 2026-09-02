# 014 — worker-context-injection — Tasks

Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`
Owner: `agent` (loop-runnable) · `human` (skipped by the loop)

| ID | Task | Owner | Status | Notes |
|----|------|-------|--------|-------|
| T1 | Move `SpecRef` from `splitPane/index.ts` to `roadmap.ts` (re-exported for the backends) | agent | done | `worker.ts` needs the type; importing it from `splitPane/` inverted the layering. |
| T2 | Add `existingContextFiles(config, cwd)` — filter `contextFiles` to those on disk | agent | done | Filtered at prompt-build time, not config load: a project can gain `planning/styles.md` between runs. |
| T3 | Rewrite `promptFor` to take `(spec, task, config, cwd)` and emit the task, its spec directory, the context files to read, and the do-not-touch-status rule | agent | done | Files are named, not inlined. |
| T4 | Widen `runWorkerSync` to `(config, spec, task, cwd)` | agent | done | |
| T5 | Thread `spec` through `dispatchTask` → `runNone` | agent | done | `dispatchTask` already had it and passed it only to the split-pane backends. |
| T6 | Build a `SpecRef` in `cli.ts`'s `runTask` instead of dropping `specId`/`specName` | agent | done | The in-pane worker had no spec context for the same reason. |
| T7 | Spec-prefix the log filename in `runNone` | agent | done | **Bug found by T9's live run.** Every spec has a `T1`, so unprefixed logs meant each spec silently overwrote the previous one's. The split-pane path already prefixed correctly; `none` did not. Only fixable once T5 gave `runNone` the spec. |
| T8 | Wrap `JSON.parse` in `loadConfig` with a diagnosable error | agent | done | **Found by T9's run.** A malformed config previously threw a bare `SyntaxError` with a byte offset and a stack trace into the orchestrator. Now names the file and the likely Windows cause, with `cause` preserved. |
| T9 | Live end-to-end run: real `loop run` against a fixture repo with a stub worker CLI that records the prompt it receives | agent | done | See below. Verified prompt contents, context filtering, human-task skip, status roll-up, chain advance, failing worker, safe stop, resume, log naming, `loop status`. |
| T10 | Feed the project's working language into the prompt | agent | todo | `question-bank.md`'s `tone` dimension can record it; nothing consumes it. The prompt is English-only — a real gap for a non-English project. |
| T11 | Move T9's checks into `007-orchestrator-unit-tests` as committed tests | agent | todo | T9 was run from a scratch fixture; it is not a regression suite. |

## T9 — what the live run actually verified

A fixture repo (`AGENTS.md`, `planning/{architecture,styles,roadmap}.md`, two specs) plus a
stub worker CLI that appends its received argv and prompt to a file. A stub rather than
a real `claude` is the *better* instrument here: it makes the exact prompt text
assertable, which is what this spec's acceptance criteria are about, and it makes the
failing/stopping paths deterministic.

| Behaviour | Result |
|---|---|
| Prompt names task id + spec | `Task T2 of spec 001-hello-cli: Write src/greet.ts` |
| Prompt names the spec's requirements + design | both, by path |
| Prompt names existing context files | `AGENTS.md, planning/architecture.md, planning/styles.md` |
| Configured-but-absent context file omitted | `planning/nonexistent.md` correctly not mentioned |
| `workerArgs` passed as argv, prompt last | `argv: ["--headless"]` |
| `human` task skipped, not attempted | `T1` untouched; `[loop] 1 task(s) need you: T1` |
| `agent` tasks run in order → `done` | `T2`, `T3` |
| `Owner` cell and notes preserved on write | `\| T1 \| … \| human \| todo \| needs a token \|` |
| Spec status rolled up to the roadmap | `001 … done` |
| **Loop advances to the next spec** | 2nd `loop run` picked `002`, previously impossible |
| Failing worker → `blocked` + stderr note | `\| T1 \| … \| blocked \| boom: missing dependency \|`, spec `blocked` |
| Safe stop mid-run → `interrupted` + pointer | `interrupted 2026-09-02T13:36:24Z — worked, then user hit stop` |
| Safe stop starts no further task | `T2` still `todo` |
| Resume runs the `interrupted` task first | `T1` then `T2`, spec → `done` |
| Logs per spec+task | `001-T2.log`, `001-T3.log`, `002-T1.log`, `002-T2.log` |
| `loop status` derives from tasks | `001 hello-cli — done  [1 for you]` |

**Not covered by T9:** the `windowsTerminal`/`tmux` split-pane backends (they detach, so
the master can't observe the outcome — needs a real interactive terminal), and a real
worker CLI actually *honoring* the prompt. T9 proves the briefing is delivered and
correct; whether a given model obeys it is not something a stub can establish.
