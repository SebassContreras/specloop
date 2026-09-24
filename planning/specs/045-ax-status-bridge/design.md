# 045 — ax-status-bridge — Design

## Approach

Extender `skills/loop` Phase 3 step 4 loop: tras cada task outcome (`done`/`blocked`/`interrupted`/quota-suspected) el master appenda una línea `jsonl` vía helper `skills/loop/scripts/append_event.py` (`stdlib`, `open(..., "a", encoding="utf-8", newline="\n")`, `json.dumps(ensure_ascii=False, sort_keys=True)`). Helper lee `loop.config.json` `workers` matched harness para campo `harness` y `contextFiles` para drift context pero nunca edita roadmap. `ts` es `datetime.utcnow().isoformat()+"Z"` solo en evento — el dashboard `bridge` lo copia pero el HTML principal sigue sin wall-clock para determinismo (el campo `bridge` puede tener timestamp; el resto del HTML queda byte-identical).

Suspend: en Phase 2 entry chequear `.specloop/suspend` (o path `ax` verificado e.g. `.ax/suspend`) — si existe, flipear batch's `in_progress` → `interrupted`, log `suspended`, volver a Phase 1 sin pick nuevo y reportar (análogo a safe-stop pero harness-initiated). Resume: próxima invocación `specloop:loop` ve marker, ofrece clear y flipear `interrupted` → `todo` + row `in_progress` (misma flow que `blocked` unblock en Phase 1). Observabilidad: `build_dashboard.py` añade sección `bridge` al dashboard JSON (`eventsTail` last 20 lines tail, `suspendState`, `lastEvent`) — campo trailing aditivo, consumers viejos lo ignoran (positional trailing safety como `Stage`/`Priority`). Si `ax` event log path verificado (`.ax/events/`), helper hace mirror append a ambos destinos (dos `open(a)`, no symlink — `wshobson` nota symlinks expanden surface).

## Deliverables

- Nuevo: `skills/loop/scripts/append_event.py` + `skills/status` bridge JSON extension + `skills/loop/SKILL.md` Phase 2/3 suspend-resume text + `skills/status/references/template.html` strip opcional.
- Modificados: `planning/architecture.md` Fixed (safe-stop + suspend marker) + Resolved (tercer helper, scope note bounded helper) + `.specloop/.gitignore` sin cambio (logs ya ignorado).
- Guard: `scripts/check-skill-consistency.mjs` grupo 18 (bridge nunca escribe roadmap/tasks, append master-only).

## Sequencing

1. Helper `append_event.py` + path `.specloop/logs/events.jsonl` (reuse `logDir` de loop config, fallback `.specloop/logs`).
2. Cablear `loop` suspend check + event append.
3. Extender `build_dashboard.py` `bridge` field y `template.html` render condicional.
4. Sweep docs/architecture + guard.

## Open questions / deferred

- Destino exacto `ax` event log (verificar `google/ax` docs; fallback = `logs/events.jsonl` only).
- Event batch vs per-task atomic append — elegir per-task para simplificar retry idempotencia.
- ¿Debe manifest index incluir `lastEvent`? Defer — bridge y manifest son ortogonales.
