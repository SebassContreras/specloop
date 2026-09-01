import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { LoopConfig } from "../config.js";
import type { TaskRow } from "../tasks.js";
import { runWorkerSync } from "../worker.js";

export interface RunResult {
  ok: boolean;
  lastLogLine: string;
}

/** Always-works fallback: runs the task inline in the master terminal. */
export function runNone(config: LoopConfig, task: TaskRow, cwd: string): RunResult {
  console.log(`[loop] running task ${task.id}: ${task.task}`);
  const { ok, log } = runWorkerSync(config, task);
  mkdirSync(join(cwd, config.logDir), { recursive: true });
  writeFileSync(join(cwd, config.logDir, `${task.id}.log`), log);
  const lines = log.trim().split("\n");
  return { ok, lastLogLine: lines[lines.length - 1] ?? "" };
}
