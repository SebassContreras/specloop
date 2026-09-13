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

- the affected skill (`skills/*/SKILL.md`), and the exact commit;
- a minimal reproduction;
- the security impact and conditions required to trigger it;
- a suggested mitigation, if you have one.

## Scope

There is no orchestrator code — the loop runs entirely as `skills/loop/SKILL.md`,
instructions followed by whatever agent session invokes it, inside the target
repo. The most relevant attack surface is that skill directing the agent to
launch a **user-configured worker CLI as a subprocess** (or its own harness's
native sub-agent tool). A prompt- or config-driven command-injection issue
there is the most likely class of real vulnerability — review any change to
`skills/loop`'s Phase 3 (worker invocation) with that in mind.

The skills themselves (`skills/*/SKILL.md`) are Q&A instructions run by an
interactive agent inside the target repo — they write files, never execute
arbitrary shell commands outside of running a user-configured worker, and
never install anything without explicit confirmation (see each skill's
"Style rules").

`skills/status` writes `planning/dashboard.html`, a static file embedding
repo-sourced text (task text, fix-log notes) inside a `<script type="application/
json">` tag that a browser then parses and renders. The relevant risk there is a
crafted string breaking out of that tag — `skills/status/SKILL.md`'s substitution
step escapes every `</script` occurrence for exactly this reason; review any
change to that step with the same care as `skills/loop`'s Phase 3.

## Non-security bugs

Use regular GitHub issues for functional problems that don't have a security
impact.
