# 035 — wshobson/agents research

## T001 — distribution architecture

Fetched from `https://raw.githubusercontent.com/wshobson/agents/main/` on
2026-09-21. The repository uses one canonical content tree and generates
harness-specific projections from it; generated output is not the source of
truth.

### Architecture map

```text
plugins/<plugin>/
  .claude-plugin/plugin.json
  agents/
  commands/
  skills/
        |
        v
tools/adapters/base.py
  shared paths, source models, frontmatter parsing, HarnessAdapter
        +-----------------------------+
        v                             v
tools/adapters/capabilities.py   tools/generate.py
  capability registry             CLI: select harness/plugin(s),
  + tool/model mappings            emit, clean, prune
        |                             |
        +-------------+---------------+
                      v
  codex.py | cursor.py | opencode.py | antigravity.py | copilot.py | pi.py
                      |
                      v
  committed registries/manifests where native installation needs them;
  gitignored transformed trees for generated harness artifacts
```

`plugins/` is the source-of-truth in the upstream README and in
`docs/harnesses.md`. A plugin is auto-discovered from its directory structure;
the source contains Claude-style agents, commands, and skills. The adapters do
not form a second content authoring system: they parse the source plugin and
emit the target harness's native shape.

`tools/adapters/base.py` defines the shared worktree/plugins paths, plugin
source models, tolerant frontmatter parsing, and the adapter base class.
`tools/adapters/capabilities.py` is the shared capability matrix consumed by
adapters, documentation generation, and plugin evaluation. It records native
component support, orchestration/tool flags, context-file limits, skill-size
limits, tool-name casing, and model-alias behavior.

`tools/generate.py` accepts one of `codex`, `copilot`, `cursor`, `opencode`,
`antigravity`, or `pi`, plus an optional plugin, `--all`, `--clean`, and
`--prune`. It lazy-loads the selected adapter, loads plugin directories from
`plugins/`, emits each plugin, aggregates warnings/errors, and uses explicit
per-harness output targets for cleaning/pruning. The generator's target map
also shows the ownership boundary: Pi owns only `.pi/skills`, `.pi/prompts`,
and `.pi/agents`; it does not delete unrelated `.pi/` content.

### Adapter responsibilities

| Adapter | Native projection verified in source |
|---|---|
| `codex.py` | `.codex/skills/` and `.codex/agents/` transformed trees; committed `plugins/*/.codex-plugin/plugin.json` and `.agents/plugins/marketplace.json`; enforces the Codex skill/context limits. |
| `cursor.py` | `.cursor-plugin/plugin.json`, root marketplace metadata, and curated `.cursor/rules/*.mdc`; reuses Claude-compatible content discovered under `.claude/`. |
| `opencode.py` | `.opencode/agents/`, `.opencode/commands/`, `.opencode/skills/`, and `opencode.json`; converts Claude `tools:` intent into OpenCode `permission:` and normalizes names/tool references. |
| `antigravity.py` | One self-contained `.antigravity/plugins/<plugin>/` per source plugin, with native `skills/`, `agents/`, `commands/`, and model-tier aliases. |
| `copilot.py` | `.copilot/agents/`, `.copilot/skills/`, and `.copilot/commands/`; maps source tool names and turns commands into runnable skills. |
| `pi.py` | `.pi/skills/<plugin>/<skill>/`, flat namespaced prompts, and flat namespaced agent files; Pi core's subagent format is treated as an extension/package contract. |

The upstream README describes Claude Code as the source-of-truth harness and
the other six as generated target harnesses. `gh skill` and `npx skills` are a
separate skills-only path: they read `plugins/*/skills/` directly from GitHub,
so they do not require a clone, marketplace registry, or generation step.

### Make targets

The verified Makefile sets `HARNESSES := codex copilot cursor opencode
antigravity pi` and runs the Python tooling through the `plugins/plugin-eval`
`uv` project:

```text
make generate HARNESS=<h> [PLUGIN=<p>]
  -> tools/generate.py --harness <h> --plugin <p>
     or --harness <h> --all --prune

make generate-all
  -> generate --all --prune once for each harness

make validate [HARNESS=<h>] [STRICT=1]
  -> tools/validate_generated.py

make garden [STRICT=1]
  -> tools/doc_gardener.py
```

`generate` requires `HARNESS`; without `PLUGIN` it generates all plugins for
that harness. `generate-all` loops over all six harnesses. `validate` performs
structural checks, optionally scoped to one harness; `garden` runs the
documentation/drift gardener. These targets are repository build gates around
the source-to-adapter pipeline, not additional sources of generated content.

### Raw-URL verification ledger

All paths below returned successfully from the upstream `main` branch during
this task:

- `README.md`
- `Makefile`
- `tools/generate.py`
- `tools/adapters/base.py`
- `tools/adapters/capabilities.py`
- `tools/adapters/codex.py`
- `tools/adapters/cursor.py`
- `tools/adapters/opencode.py`
- `tools/adapters/antigravity.py`
- `tools/adapters/copilot.py`
- `tools/adapters/pi.py`
- `docs/harnesses.md`
- `docs/usage.md`
- `.gitignore`
- `.claude-plugin/marketplace.json`
- `.agents/plugins/marketplace.json`

The raw URLs use the stable pattern
`https://raw.githubusercontent.com/wshobson/agents/main/<path>`. This ledger
records path existence and the architecture map only; capability limits,
registry differences, installation trade-offs, and quality-gate details are
separate T002–T005 research tasks.

## T002 — committed registries vs generated trees

The upstream `.gitignore` makes the ownership boundary explicit: commit small
JSON registries/manifests that let a native installer resolve source content,
and ignore generated harness trees that can be recreated from `plugins/`.

### Committed registry shapes

- `.claude-plugin/marketplace.json` is the Claude marketplace catalog. It has
  top-level `name`, `owner`, `metadata`, and `plugins`; each plugin entry points
  at a source directory such as `./plugins/code-documentation`.
- `.agents/plugins/marketplace.json` is the Codex-side marketplace registry. It
  has the same catalog name and plugin list, but its entries use a structured
  local source (`{"source":"local","path":"./plugins/<name>"}`) plus
  installation/authentication policy fields.
- `plugins/*/.codex-plugin/plugin.json` is a small per-plugin Codex manifest
  stored beside the source tree. The verified `code-documentation` example
  contains identity/version/description, `skills: "./skills/"`, author/license,
  and a small display interface; it is not a generated copy of the skills.
- `.cursor-plugin/` is also a committed native registry/manifest surface. The
  upstream tree contains `.cursor-plugin/marketplace.json`; it is separate from
  the generated `.cursor/` rules projection.

The raw files verified for these shapes are
[`.claude-plugin/marketplace.json`](https://raw.githubusercontent.com/wshobson/agents/main/.claude-plugin/marketplace.json),
[`.agents/plugins/marketplace.json`](https://raw.githubusercontent.com/wshobson/agents/main/.agents/plugins/marketplace.json),
[`plugins/code-documentation/.codex-plugin/plugin.json`](https://raw.githubusercontent.com/wshobson/agents/main/plugins/code-documentation/.codex-plugin/plugin.json),
and
[`.cursor-plugin/marketplace.json`](https://raw.githubusercontent.com/wshobson/agents/main/.cursor-plugin/marketplace.json).

### Ignored output and the exception

The verified upstream `.gitignore` ignores generated `.codex/`, `.opencode/`,
and `.antigravity/` trees. It also ignores local `.agent/` content broadly,
then re-includes `!.agents/plugins/` after `.agents/*` so the committed Codex
marketplace remains visible to Git. The file comments state the rule directly:
registries stay committed and point back to `plugins/`; transformed trees are
regenerated and must not be hand-edited.

`.pi/` is not ignored by the current upstream `.gitignore`. Therefore the
portable rule is not “ignore every non-Claude harness directory”: commit only
small native registries/manifests, ignore generated trees where the upstream
project explicitly does so, and verify each harness-specific policy. In
particular, do not claim that `.pi/` is gitignored without a separate upstream
change proving it.

### Lean rule for specloop

For a one-plugin repository, keep the registry surface to the minimum native
installers require: small JSON files committed, each referring to the canonical
`skills/` or plugin source path. Gitignore any large generated harness tree and
preserve an explicit `!.agents/plugins/`-style exception whenever a parent
ignore rule would hide a committed registry. This brings the distribution
boundary, not the upstream seven-adapter generation pipeline, and scales the
pattern to specloop's nine skills and one plugin.

Evidence: [upstream `.gitignore`](https://raw.githubusercontent.com/wshobson/agents/main/.gitignore).

## T003 — capability matrix and mechanical degradation

Verified against upstream `main` on 2026-09-21. The capability source is
[`tools/adapters/capabilities.py`](https://raw.githubusercontent.com/wshobson/agents/main/tools/adapters/capabilities.py);
the generated explanation is
[`docs/harnesses.md`](https://raw.githubusercontent.com/wshobson/agents/main/docs/harnesses.md).
The matrix is operational, not descriptive: adapters use the booleans and maps
to decide which source features to emit, drop, or rewrite.

### Capability matrix

| Harness | Skills | Subagents / parallel | Tool restriction | `TodoWrite` | `Task` / `Agent` | Context file | Skill body cap |
|---|---|---|---|---|---|---|---|
| Claude Code | native | native / yes | `tools:` | native | native | `CLAUDE.md` | none |
| Codex | native | native / yes | `sandbox_mode` only | no | prose delegation | `AGENTS.md` | **8 KB** |
| Cursor | native | native / yes | `readonly:` only | no | `subagent` | `AGENTS.md` | none |
| OpenCode | native | native / yes | `permission:` block | yes | `task` | `AGENTS.md` | none |
| Antigravity (`agy`) | native | native / yes | `tools:` with agy names | no | `invoke_subagent` / `define_subagent` | `AGENTS.md` | none |
| Pi | native | extension / yes | `tools:` via extension | no | `subagent` extension only | `AGENTS.md` | none |

Every harness has a 150-line recommended context-file cap in the generated
matrix. Codex additionally documents a hard 32 KiB `AGENTS.md` traversal cap;
the source records the authoring cap as 150 lines. These are separate limits:
the former applies to context discovery, while Codex's 8 KB limit applies to a
single generated skill body. Codex also lacks a marketplace, hooks, and
per-agent tool allowlists; its committed `.agents/plugins/marketplace.json`
and per-plugin `.codex-plugin/plugin.json` are installation metadata, not a
replacement for those capabilities.

### Tool and feature degradation

The canonical source uses Claude-style names and frontmatter. Adapters apply
these mechanical rules when emitting another harness:

| Source input | Codex | Cursor | OpenCode | Antigravity | Pi |
|---|---|---|---|---|---|
| `tools: Read, Grep` | drop allowlist; use `sandbox_mode = "read-only"` heuristic | drop; only coarse `readonly:` exists | convert to `permission:` deny block | rewrite to agy-native names | rewrite to Pi names; empty `tools:` expands to `read, grep, find, ls` |
| `TodoWrite` in body | leave unchanged; no equivalent | leave unchanged; no equivalent | works unchanged | leave unchanged; no equivalent | leave unchanged; no equivalent |
| `model: opus` | `gpt-5.5` | `inherit` | `anthropic/claude-opus-4-8` | `pro` | `anthropic/claude-opus-4-8` |
| Skill body over 8 KB | split into `references/details.md` | pass through | pass through | pass through | pass through |
| `commands/<name>.md` | convert to skill | pass through | emit `.opencode/commands/` | inline into TOML; no `@{path}` injection | copy to namespaced prompt template |

Tool-name rewrites are explicit maps, not a general synonym heuristic. For
example, Codex maps `Read`/`Edit`/`Write`/`Bash` to action prose, OpenCode maps
them to lowercase `read`/`edit`/`write`/`bash`, and Antigravity maps them to
`view_file`/`replace_file_content`/`write_file`/`run_command`; `Agent` and
`Task` become `invoke_subagent` in agy. Unconfirmed agy names such as
`TodoWrite`, `Glob`, `WebFetch`, and `WebSearch` are intentionally not mapped
and therefore pass through unchanged. Pi maps the core file/shell/search tools
to `read`, `write`, `edit`, `bash`, `grep`, and `find`; its `subagent` name is
available only when the reference extension is loaded.

The Codex 8 KB split is the only hard skill-body truncation rule in the matrix.
For specloop's nine small skills, the reusable pattern is a tiny guard that
moves overflow to `references/details.md`; the seven-adapter mapping layer and
per-harness capability registry are overkill until portability is an active
product requirement. The important lean invariant is to author portable prose
and treat missing `TodoWrite`/spawn features as graceful degradation, rather
than requiring every harness to emulate Claude Code.

Evidence: [`capabilities.py`](https://raw.githubusercontent.com/wshobson/agents/main/tools/adapters/capabilities.py),
[`docs/harnesses.md`](https://raw.githubusercontent.com/wshobson/agents/main/docs/harnesses.md),
[`codex.py`](https://raw.githubusercontent.com/wshobson/agents/main/tools/adapters/codex.py),
[`opencode.py`](https://raw.githubusercontent.com/wshobson/agents/main/tools/adapters/opencode.py),
[`antigravity.py`](https://raw.githubusercontent.com/wshobson/agents/main/tools/adapters/antigravity.py),
and [`pi.py`](https://raw.githubusercontent.com/wshobson/agents/main/tools/adapters/pi.py).

## T004 — installation flows and one-step URL trade-off

Verified against upstream `main` on 2026-09-21. There are two materially
different distribution paths.

### Skills-only, no clone

`gh skill` (GitHub CLI 2.90+) and `npx skills` install only Agent Skills from
GitHub. They discover `plugins/<plugin>/skills/<skill>/` remotely, so the user
does not clone the repository, register a marketplace, run `make generate`, or
receive the plugin's agents, commands, or hooks.

```bash
gh skill install wshobson/agents python-testing-patterns
npx skills add wshobson/agents --skill python-testing-patterns -a claude-code
```

Selection uses the bare skill name (`python-testing-patterns`) or, for
`gh skill`, the exact source path (`plugins/python-development/skills/python-testing-patterns`).
The plugin prefix shown in `gh skill`'s listing is display-only. Both tools
install under the bare skill name, `<agent>/skills/<skill>/`; therefore the
skill directory name must equal the skill name and must be unique across
plugins or installs collide. This is the upstream `name == directory` gate,
not a namespaced install layout.

The versioning behavior differs between the two concerns often conflated as
"GitHub install": `gh skill` uses the latest GitHub release when the
repository has one, and falls back to `main` only when it has no releases.
`wshobson/agents` currently publishes no releases, so its installs track
`main`; creating a release would make subsequent `gh skill` installs track
that tag until another release is published. `gh skill --pin <sha>` provides
an explicit immutable revision. `npx skills` is documented here as a GitHub
source installer but the upstream document does not promise the same
release-versus-`main` selection rule, so specloop should not generalize the
`gh skill` rule to it without separate verification.

This path is the one-step-URL trade-off documented under **Native install**:
it is low-friction and portable across supported agents, but deliberately
skills-only. It cannot deliver multi-file plugin behavior (agents, commands,
hooks, generated harness-native projections, or global symlink management).

### Full native harness installation, clone required

OpenCode, Antigravity, and Pi have no one-step-from-URL install in the
upstream matrix. Their documented flow is:

```bash
gh repo clone wshobson/agents
cd agents
make generate HARNESS=<harness>
make install-<harness>
```

`make generate` emits the harness-native tree from `plugins/`; the install
target then links that generated tree into the user's global discovery
directory. The verified targets are:

| Target | Generated source | Global symlink destination |
|---|---|---|
| `make install-opencode` | `.opencode/` | `~/.config/opencode/` |
| `make install-copilot` | `.copilot/` | `~/.copilot/` |
| `make install-antigravity` | `.antigravity/plugins/<plugin>/` | `~/.gemini/antigravity-cli/plugins/<plugin>/` |
| `make install-pi` | `.pi/skills/`, `.pi/prompts/`, `.pi/agents/` | `~/.pi/agent/` |

The targets regenerate all plugins before invoking the corresponding
installer, and accept `FORCE=1` for conflicting symlinks where supported.
This route preserves the full native surface and gives the checkout a
repeatable regeneration/update point, but costs a clone, the repository's
generation runtime, and global filesystem state. Running a harness from the
clone as well as installing its generated artifacts globally can also create
duplicate discovery; upstream calls this out explicitly for Pi.

### Scaled recommendation for specloop

Use the skills-only path as the one-step URL experience when the requested
unit is one of specloop's nine skills. Preserve the clone-plus-generation
route only if specloop chooses to support full harness-native projections or
global installs. A lean `036` installer should not promise that a URL can
install the complete plugin surface: upstream's own docs make that boundary
explicit by listing skills-only installers separately from native install.

Evidence: [`docs/harnesses.md`](https://raw.githubusercontent.com/wshobson/agents/main/docs/harnesses.md),
[`docs/usage.md`](https://raw.githubusercontent.com/wshobson/agents/main/docs/usage.md),
[`README.md`](https://raw.githubusercontent.com/wshobson/agents/main/README.md),
and [`Makefile`](https://raw.githubusercontent.com/wshobson/agents/main/Makefile).

## T005 — quality gates

Verified against upstream `main` on 2026-09-21. The requested historical paths
[`tools/validate_generated.py`](https://raw.githubusercontent.com/wshobson/agents/main/tools/validate_generated.py)
and [`tools/doc_gardener.py`](https://raw.githubusercontent.com/wshobson/agents/main/tools/doc_gardener.py)
return 404, so they are not current raw-file paths and are not treated as
source-of-truth here. Their externally visible contracts remain documented by
[`CONTRIBUTING.md`](https://raw.githubusercontent.com/wshobson/agents/main/CONTRIBUTING.md)
and [`ARCHITECTURE.md`](https://raw.githubusercontent.com/wshobson/agents/main/ARCHITECTURE.md):

- `make validate [STRICT=1]` is the structural gate over generated artifacts.
  It checks generated output for structural validity; errors block CI, while
  warnings are advisory unless `STRICT=1` is supplied.
- `make garden [STRICT=1]` is the repository consistency gate. Its findings
  include `STALE_ARTIFACT`, `DEAD_LINK`, `SKILL_OVER_CODEX_CAP` (a skill body
  over 8 KB without `references/`), and marketplace-orphan/drift findings.
  Upstream explicitly says the current ten `SKILL_OVER_CODEX_CAP` warnings are
  readable warnings rather than a clean pass/fail baseline; `STRICT=1` promotes
  warnings to failures.
- `make smoke-test` is separate from the deterministic gates. It launches real
  CLI subprocess checks across the generated harnesses and also exercises
  `gh skill` and `npx skills`; the CI description includes the
  `gh skill publish --dry-run` agentskills.io check.

`plugin-eval` is a heavier, optional evaluation layer rather than a replacement
for the repository gates. Its documented `score` depths form three layers:

1. **Static**: deterministic structural analysis in under two seconds, covering
   frontmatter, wiring, progressive disclosure, completeness, token efficiency,
   ecosystem coherence, harness portability, and anti-patterns such as
   `SKILL_OVER_CODEX_CAP`.
2. **LLM judge**: four concurrent semantic assessments — triggering accuracy,
   orchestration fitness, output quality, and scope calibration — using four
   LLM calls.
3. **Monte Carlo**: 50–100 simulated runs measuring activation, consistency,
   failure rate, and token efficiency with confidence intervals; the documented
   runtime is roughly two to five minutes and requires the LLM extra.

`quick` runs only static analysis, `standard` combines static plus judge, and
`deep` runs all three. `--threshold` turns the resulting score into a CI-style
exit gate. For specloop's nine skills and one plugin, reuse the cheap invariant
checks (TOML/format validity, 8 KB cap, `name == directory`, dead links and
generated drift) and a small real-CLI smoke check. The three-layer
`plugin-eval` pipeline is overkill until the catalog is large enough to justify
LLM-call cost, corpus management, and statistical calibration.

Evidence: [`CONTRIBUTING.md`](https://raw.githubusercontent.com/wshobson/agents/main/CONTRIBUTING.md),
[`ARCHITECTURE.md`](https://raw.githubusercontent.com/wshobson/agents/main/ARCHITECTURE.md),
[`docs/plugin-eval.md`](https://raw.githubusercontent.com/wshobson/agents/main/docs/plugin-eval.md),
and [`docs/authoring.md`](https://raw.githubusercontent.com/wshobson/agents/main/docs/authoring.md).

## T006 — scaled classification and recommendation for 036

The upstream patterns separate into a small reusable distribution boundary and a
large-repository generation system. The scale difference is material: specloop
has 9 skills in 1 plugin, while `wshobson/agents` has 94 plugins and uses six
generated target harnesses in addition to its Claude-oriented source layout.
The recommendation below therefore preserves invariants that protect a small
catalog without importing machinery whose value comes from cross-plugin and
cross-harness multiplication.

### Reusable at specloop's scale

| Pattern | Lean form to retain | Why it scales to 9 skills / 1 plugin |
|---|---|---|
| Native registry metadata | One `.claude-plugin/marketplace.json`; add only a second or third small JSON registry if a supported installer genuinely requires it | A registry is a small, committed index and gives native discovery a stable source path. One plugin does not justify parallel generated catalogs. |
| Codex skill-size protection | A standard-library-only guard of roughly 10 lines that checks each skill body against the 8 KB limit and points oversized content to `references/` | The limit is a concrete compatibility invariant. A tiny check prevents a known failure mode without a dependency graph or adapter framework. |
| Skill identity | Enforce `name == directory` | Both skills-only installers resolve the bare skill name into a directory; the equality prevents ambiguous lookup and install collisions. |
| Structural consistency | Lightweight `validate` and `garden` checks for JSON/TOML or frontmatter validity, dead links, stale/generated drift, marketplace orphans, and the 8 KB cap | These are deterministic checks over a one-plugin tree and can run cheaply in local development or CI. |

The reusable subset is intentionally invariant-oriented: it checks the source
tree and its small registries, but does not generate another copy of every
skill for every harness. If a future native installer needs another registry,
it should remain a small committed JSON file pointing at the canonical source,
with generated trees kept out of version control.

### Overkill for the current catalog

Do not bring the following upstream machinery into specloop's initial
distribution implementation:

- The seven-adapter source and capability layer (shared base/capability code
  plus six harness adapters, approximately 3k LOC as an order-of-magnitude
  comparison). It pays for systematic translation across 94 plugins and six
  generated targets; specloop currently needs portable skill prose, not seven
  projections of one plugin.
- The `plugins/plugin-eval` `uv` project and virtual-environment workflow. A
  Python environment and dependency-managed evaluation package add setup and
  maintenance cost before a one-plugin catalog has a corpus or statistical
  comparison problem.
- Four `make install-*` targets for OpenCode, Copilot, Antigravity, and Pi.
  They regenerate harness trees and create global symlinks, which is useful
  for a multi-harness catalog but expands the installer's filesystem surface
  and duplicates native discovery for specloop.
- The complete `plugin-eval` pipeline. Its static, LLM-judge, and Monte Carlo
  layers address quality comparison across a large plugin corpus. They are
  disproportionate to 9 skills and would introduce LLM-call cost, corpus
  management, and calibration work beyond the current product need.

This is a scale decision, not a claim that the omitted mechanisms are poor
engineering. Reconsider them if specloop reaches 5 or more plugins, or if
full cross-harness native projections become an explicit product requirement.
Until then, a lightweight smoke run plus deterministic invariant checks is the
appropriate quality boundary. The deferred multi-plugin expansion is the
input for a future `037` rather than scope for `036`.

### Hybrid lean recommendation for 036

`036` should implement a hybrid distribution surface:

1. Commit `.claude-plugin/marketplace.json` as the small native registry,
   pointing at the canonical plugin/skill source. Verify its exact schema and
   Claude installer behavior during `036`; this research records the upstream
   pattern, not a license to guess a local manifest format.
2. Provide an `install.sh` that downloads a pinned or explicitly selected
   repository archive with `curl`, extracts it with `tar`, and installs the
   canonical skills/plugin files into the requested destination. The script
   should be small, fail on download/extraction errors, and avoid global
   symlink management or harness-specific generation.
3. Run the lean `validate`/`garden` checks and the 8 KB/name-directory guards
   against the checked-out source. The URL path is a convenience for obtaining
   the same source tree, not a promise to materialize all upstream harness
   projections.

This gives native marketplace discovery and a one-step URL install while
keeping one source of truth. It deliberately leaves out the seven adapters,
`uv` environment, four global `make install-*` flows, and full `plugin-eval`;
those belong behind the deferred 5+ plugin threshold or a separately approved
cross-harness requirement.
