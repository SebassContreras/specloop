# Security Policy

specloop is a personal project shared as-is — no dedicated security team, but
reports are welcome and taken seriously.

## Supported versions

Only the latest `main` is supported — there are no maintained release branches.
Report against the current commit; include it in your report.

## Reporting a vulnerability

Prefer [GitHub's private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing/privately-reporting-a-security-vulnerability)
for this repository when available. Otherwise, open an issue asking for a private
contact — do not include exploit details, secrets, tokens, or another party's data
in a public issue, PR, or commit.

Include, when known:

- the affected skill (`skills/*/SKILL.md`) or orchestrator module
  (`framework/orchestrator/src/*`), and the exact commit;
- a minimal reproduction;
- the security impact and conditions required to trigger it;
- a suggested mitigation, if you have one.

## Scope

The most relevant attack surface is `framework/orchestrator/`: it spawns a
user-configured worker CLI and split-pane processes as child processes
(`src/worker.ts`, `src/splitPane/*.ts`). A `PATH`/command-injection issue there is
the most likely class of real vulnerability. See `src/security.ts`'s
`assertSafePath()` for the existing hardening — currently POSIX-only, see
[`docs/specs/011-windows-path-safety/`](docs/specs/011-windows-path-safety/).

The skills themselves (`skills/*/SKILL.md`) are Q&A instructions run by an
interactive agent inside the target repo — they write files, never execute
arbitrary shell commands, and never install anything without explicit
confirmation (see each skill's "Style rules").

## Non-security bugs

Use regular GitHub issues for functional problems that don't have a security
impact.
