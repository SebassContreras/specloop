# 037 — readme-onboarding

## What's being built

An onboarding and discoverability pass for the public `specloop` README. The
pass adds the explanatory material that is still missing after the existing
showcase work:

- a five-minute quickstart from installation to the first `/specloop:start`
  invocation;
- a short, realistic text transcript showing how a user interacts with the
  interview and the loop;
- a compact skills reference explaining what each shipped skill does and when
  to use it;
- a small FAQ covering harness support, installation modes, runtime
  requirements, and interrupted sessions;
- useful repository and release badges, where each badge points to a real
  maintained source.

The result must make the project understandable to a first-time visitor
without requiring them to read `planning/` first.

## Who/what it serves

Visitors and prospective users landing on the public repository who want to
understand the product, install it in a target repository, and decide which
skill to run next.

## Hard constraints

- Write all new README content in concise technical English.
- Keep `README.md` as the primary public entry point; do not create a separate
  documentation site or introduce a documentation toolchain.
- Describe only behavior and support already verified in this repository's
  documentation and support matrix. Do not imply that every harness has been
  verified as a loop master.
- The transcript must be clearly labeled as illustrative unless it is captured
  from a real session; it must not present invented output as evidence.
- Keep installation commands aligned with the existing marketplace and
  installer instructions. There must remain one authoritative command for
  each supported installation path.
- Preserve the existing image, dashboard, diagram, and `019` showcase scope;
  this spec adds explanatory text and navigation around them rather than
  replacing them.

## Acceptance criteria

- [ ] A new user can follow the README from prerequisites through installation,
      launching Claude Code in a target repository, and invoking
      `/specloop:start` without consulting another repository file.
- [ ] The README contains a concise text walkthrough covering the progression
      from `start` to requirements, design, tasks, and `loop`, with commands
      matching the actual skill names.
- [ ] The README contains a complete table or equivalent compact reference for
      every shipped skill, including its purpose and its normal invocation.
- [ ] The FAQ answers at least: supported harnesses, Claude Code versus
      vendor-neutral installation, whether a server is required, the Python
      requirement for the dashboard, and how interrupted work resumes.
- [ ] Badges link to real repository metadata or workflows and do not add a
      badge whose source is unmaintained or unavailable.
- [ ] Existing showcase assets, dashboard links, support-matrix claims, and
      installation commands remain internally consistent after the edit.
- [ ] Markdown convention and skill-consistency checks pass after the README
      changes.

## Out of scope

- Capturing or editing screenshots, GIFs, videos, or logos; those remain in
  `019-public-showcase`.
- Changes to any shipped skill's behavior or frontmatter.
- A generated documentation site, wiki, blog, or API reference.
- Re-auditing harness compatibility or changing the support matrix.
- Rewriting stable product or architecture documentation solely to improve
  public copy.

## Dependencies

`019` (public-showcase), `022` (cross-agent-skill-compat), `030`
(dashboard-build-script), and `036` (lean-distribution).

## Owner split

All implementation tasks are `agent`; visual verification of the rendered
README remains `human` if the task breakdown determines that a real browser
check is needed.
