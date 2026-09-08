# Roadmap

Index of all specs: order, status, dependencies.

| ID  | Plan                  | Status | Depends on |
|-----|-----------------------|--------|------------|
| 001 | launch-announcement   | done   | —          |
| 002 | brand-style-refresh   | todo   | 001        |

Possible statuses: `todo` · `in_progress` · `blocked` · `interrupted` · `done`.

## How this gets built, step by step

1. **`001` launch-announcement** — the MVP: get the "Instant Export" launch out the
   door for the "Loopwell 3.0" event week. Run `specloop:design-closing`, then
   `specloop:task-breakdown`, then `specloop:loop-setup` + `loop run` for its `agent`
   tasks (drafting); the `human` tasks (contractor, Legal, live publish) are done
   outside the loop.
2. **`002` brand-style-refresh** — deferred past the launch: refresh the brand
   guidelines this launch had to work within as-is. Added mainly to give
   `specloop:loop-setup` a second spec to read; every task in it is `human`-owned (a
   brand workshop, external agency selection), so it also exercises the
   all-`human`-backlog check `loop-setup` reports before asking its worker-CLI
   question.
