# Interview question bank

Drawn from by `specloop:start` (and re-checked by `specloop:design-closing`). This file
is the source of interview *coverage*, not a script to read aloud: ask one question at a
time, in the user's own vocabulary, skipping what the conversation has already answered.

**A dimension is "covered" when the user has actually answered it, "skipped" when they
declined it (record the reason), and "open" otherwise.** Every dimension below must end
in one of those three states in `.specloop/interview.md` before a phase may terminate.
Never infer an answer to close a dimension.

---

## Phase A — Type & vision (all project types)

| Dimension | Questions |
|---|---|
| `project-type` | "What kind of thing is this — software (app, service, site), a marketing or content project, an operations/process project, a research project, or something else?" |
| `goal` | "What's the final goal — the overall purpose of this project?" |
| `audience` | "Who or what is this for?" |
| `mvp` | "What's the MVP, or first phase, you want to reach?" · "What's explicitly *not* in the first phase?" |
| `done-when` | "How will you know the whole thing is finished? What's observably true then?" |
| `constraints-hard` | "Any hard constraints — deadline, budget, a platform or vendor you must use, a rule you can't break?" |
| `stakeholders` | "Does anyone else need to review or approve work as it goes?" |
| `automatability` | "Which parts of this do you expect an agent to do unattended, and which do you want to keep in your own hands?" — drives the `Owner` column in `tasks.md` |

## Phase B — Technologies, architecture & tools

Ask the block matching `project-type`. Answers go to `planning/architecture.md` as a
decision register (one row per decision: what, why, when decided).

### B-software

| Dimension | Questions |
|---|---|
| `runtime` | "What language and runtime version?" |
| `framework` | "Which framework(s) and key libraries? Anything you specifically *don't* want used?" |
| `toolchain` | "Package manager, test runner, formatter/linter — and the exact commands to run each?" |
| `datastore` | "Where does data live? Which database, and how are schema changes managed?" |
| `data-model` | "What are the main entities and how do they relate?" |
| `interface` | "What's the interface — REST, GraphQL, RPC, CLI, library API? Any versioning rule?" |
| `identity` | "How do users authenticate, and how is authorization decided?" |
| `hosting` | "Where does this run in production, and how does it get there?" |
| `ci` | "What has to pass before a change is acceptable?" |
| `env-secrets` | "How are configuration and secrets handled? What must never be committed?" |
| `verification` | "How do you want changes verified — unit tests, integration, manual, a smoke script?" |
| `third-party` | "Any third-party services or accounts this depends on?" |
| `observability` | "How would you find out this broke in production?" |

### B-marketing-content

| Dimension | Questions |
|---|---|
| `channels` | "Which channels — site, email, social, paid, events, press? Which matter most?" |
| `positioning` | "What's the core message, and who are you positioning against?" |
| `assets` | "What assets does this need — copy, design, video, landing pages — and who makes each?" |
| `tools` | "Which tools/platforms are you working in (CMS, ESP, analytics, scheduler, ad manager)?" |
| `data-sources` | "Where does the data for measurement come from, and who has access?" |
| `measurement` | "What metric decides whether this worked, and what's the target?" |
| `calendar` | "Any fixed dates — launch, campaign window, event, embargo?" |
| `approvals` | "Who signs off on published material, and what can't go out without review?" |
| `compliance` | "Any legal, brand or regulatory constraints on what you can claim or publish?" |

### B-operations-process

| Dimension | Questions |
|---|---|
| `current-state` | "How does this get done today, step by step?" |
| `systems` | "Which systems are involved, and which can be accessed programmatically?" |
| `volume-cadence` | "How often does this run, and at what volume?" |
| `failure-cost` | "What happens if a step is done wrong or skipped? What's unrecoverable?" |
| `handoffs` | "Where does work pass between people or teams?" |
| `access` | "What credentials or permissions are needed, and who grants them?" |

### B-research

| Dimension | Questions |
|---|---|
| `question` | "What's the actual question being answered?" |
| `sources` | "What sources or datasets are in scope? Which are off-limits?" |
| `method` | "How will you analyse it, and what would falsify the conclusion?" |
| `output-form` | "What's the deliverable — a report, a dataset, a model, a decision?" |
| `rigour` | "What standard does this need to meet, and who's the audience for it?" |

### B-other

Ask the generic set: `tools`, `inputs`, `outputs`, `who-does-what`, `sequence-constraints`,
`quality-bar`. Derive further dimensions from the goal statement — this branch exists so
an unanticipated project type is interviewed properly rather than forced into B-software.

## Phase C — Helper skills & agent tooling

| Dimension | Questions |
|---|---|
| `helper-skills` | Given the Phase B answers, name the Claude Code skills/plugins (other than specloop) that would help the loop's worker agents here. Ask which, if any, to install. **Never install without explicit confirmation.** If no install mechanism resolves, print manual instructions instead of guessing a command. |
| `worker-cli` | "Which CLI should the loop's workers run as — `claude`, `codex`, `opencode`, or something else? And what's its headless/non-interactive flag?" |
| `agent-rules` | "Any rule you want every agent working in this repo to follow, or anything you want them never to do?" |

## Phase D — Styles & preferences

Gate on `visual-surface` first; skip the visual rows for a project with no visual output.

| Dimension | Questions |
|---|---|
| `visual-surface` | "Does this project have a visual surface — a UI, a site, a deck, brand artefacts?" |
| `palette` | "Any colors you want used, or an existing brand to match? Anything to avoid?" |
| `typography` | "Any typeface or type-scale preference?" |
| `density-mode` | "Dense or spacious? Light, dark, or both?" |
| `brand-refs` | "Any existing brand assets, or reference sites/products whose look you want?" |
| `tone` | "What tone should the writing take, and in which language?" |
| `accessibility` | "Any accessibility target, or devices/browsers that must work?" |
| `code-conventions` | "Naming, file layout, comment density, commit-message style — anything you want enforced?" |
| `anti-preferences` | "Anything you actively dislike and don't want to see?" |
| `preference-strength` | For each preference: "is that a hard rule or a default an agent may deviate from with reason?" |

## Phase E — Per-spec requirements

Asked once per spec, in roadmap order.

| Dimension | Questions |
|---|---|
| `what` | "What's being built in this spec?" |
| `serves` | "Who or what does it serve?" |
| `constraints` | "Hard constraints specific to this spec?" |
| `acceptance` | "How will you tell this spec is done? Give 2–5 things that must be observably true." |
| `out-of-scope` | "What's explicitly *not* in this spec?" |
| `dependencies` | "Does this need anything from another spec that the roadmap doesn't already record?" |
| `owner-split` | "Any task here that you want to do yourself rather than have an agent do?" |

## Phase F — Closing sweep

Run at the end of every phase above. Not optional, and not a formality.

1. Re-read what was just written. For every noun the user named but never specified
   ("the dashboard", "the integration", "the brand guidelines"), ask about it.
2. List the dimensions still `open` for this phase and ask about each one.
3. Ask: **"What haven't we covered that matters here?"**
4. If steps 1–3 produced anything new, write it down and run the sweep again.
5. The phase ends only when a full sweep produces nothing new **twice in a row**.
