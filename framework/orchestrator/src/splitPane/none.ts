import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { LoopConfig } from '../config.js';
import type { TaskRow } from '../tasks.js';
import { runWorkerSync } from '../worker.js';
import type { SpecRef } from '../roadmap.js';

export interface RunResult {
  ok: boolean;
  lastLogLine: string;
}

/** Always-works fallback: runs the task inline in the master terminal. */
export function runNone(
  config: LoopConfig,
  spec: SpecRef,
  task: TaskRow,
  cwd: string,
  workerIndex: number,
): RunResult {
  console.log(`[loop] running task ${task.id}: ${task.task}`);
  const { ok, log } = runWorkerSync(config, spec, task, cwd, workerIndex);
  mkdirSync(join(cwd, config.logDir), { recursive: true });
  // Spec-prefixed to match the split-pane path (cli.ts's runTask). Without the
  // prefix, task ids collide across specs — every spec has a T1 — and each new
  // spec silently overwrites the previous one's logs.
  writeFileSync(join(cwd, config.logDir, `${spec.id}-${task.id}.log`), log);
  const lines = log.trim().split('\n');
  return { ok, lastLogLine: lines.at(-1) ?? '' };
}
