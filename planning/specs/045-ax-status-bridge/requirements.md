# 045 — ax-status-bridge — Requirements

Raised 2026-09-24 — `ax` necesita stream de eventos observable y suspend/resume; `specloop:loop` hoy solo deja `.specloop/logs/<id>.log` y `roadmap.md` poll.

## What's being built

- Puente `ax` status: append de eventos estructurados (`spec_started`, `task_completed`, `task_blocked`, `task_interrupted`, `drift_detected`, `suspended`, `resumed`) a `.specloop/logs/events.jsonl` (y mirror a `.ax/events/` si `ax` lo verifica) — `jsonl` append-only, sin server.
- Marker `suspend` (`.specloop/suspend` o path `ax` verificado) que `skills/loop` honra en Phase 2 entry: flip `in_progress` → `interrupted`, log `suspended`, no pisa nueva spec, reporta.
- Extensión `skills/status/scripts/build_dashboard.py` dashboard JSON `bridge` field (`eventsTail`, `suspendState`, `lastEvent`) — trailing field ignorable por consumers viejos (positional trailing safety como `Stage`/`Priority`).
- Helper stdlib `skills/loop/scripts/append_event.py` (master-only append, una línea por outcome).

## Who/what it serves

- Harness `ax` / orchestrator externo que observa un `jsonl` en lugar de scrapear `roadmap.md`/`tasks.md`/`dashboard.html`.
- Humano que quiere `specloop:status` paridad en UI `ax` (`ax watch`).
- Quien necesita `suspend` explícito desde `ax` (`ax suspend task`) además de safe-stop por chat.

## Hard constraints

- Sin proceso/servidor standalone (misma Declined que `030` dashboard no-watcher); loop sigue chat-session master, bridge corre inline en `skills/loop` Phase 3 step 4 — master appenda, nunca sub-agent (evita races sobre mismo `jsonl`, misma regla que `logs/<id>.log`).
- `Stage`/`Status` solo los escriben pipeline skills (`start`/`design-closing`/`task-breakdown`/`loop`); bridge nunca los edita; `interrupted` sigue task-state only (`022` handoff).
- Safe-stop por mensaje sigue primario — marker es vía adicional harness-initiated.
- Stdlib-only, hard fail si `python3` falta; `open(encoding="utf-8", newline="\n")`, `ensure_ascii=False`, `sort_keys` determinístico para `bridge` JSON.
- `.specloop/logs/` ya gitignored vía `.specloop/.gitignore` `logs/*` + `!logs/.gitkeep` — `events.jsonl` vive ahí, no nuevo gitignore.

## Acceptance criteria

- [ ] `append_event.py` appende una línea `{"ts": "...", "specId": "...", "taskId": "...", "event": "...", "harness": "...", "stage": "...", "status": "..."}` por task outcome (master-only, serial tras cada resolución, incluye parallel batch).
- [ ] Marker `.specloop/suspend` hace que próximo Phase 2 entry flipee batch `in_progress` → `interrupted`, logue `suspended`, vuelva a Phase 1 sin nuevo pick y reporte; resume limpia marker y re-queues `interrupted` → `todo` + row `in_progress` (misma UX que `blocked` unblock).
- [ ] Dashboard JSON añade `bridge: {version:"1", eventsTail:[...last 20], suspendState:"active|none", lastEvent:{...}}` — byte-identical si events sin cambios (no timestamp wall-clock en HTML).
- [ ] Guard `check-skill-consistency.mjs` grupo 18 aserta bridge nunca escribe `roadmap.md`/`tasks.md` y append es master-only.
- [ ] `events.jsonl` es append-only, retry no duplica (id `ts+taskId+event` unique); `ax` mirror opcional no symlink (expande surface según `wshobson`).
- [ ] `planning/architecture.md` Fixed rule safe-stop + suspend marker y Resolved helper tercero documentados con scope note.

## Out of scope

- Split-pane / `Workflow` tool (Declined), regex quota (judgement only), multi-spec parallelism on same provider (sigue `002` open question).
- Worktree isolation (`029` declined) — batching file-overlap basta.
- `planning/fix/` status en bridge — ya en dashboard JSON.

## Dependencies

`044` (manifests for spec shape), `009`+`030` (status truth), `042` (harness identity para `harness` field), `002` (loop master).

## Owner split

Todo `agent` salvo `[human]` verify suspend-resume bajo `claude` native + `agy` subprocess real (allow rule) — dispatch async notification debe honrar marker.
