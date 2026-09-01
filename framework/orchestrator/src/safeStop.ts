import { existsSync, mkdirSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { LoopConfig } from "./config.js";
import { writeTaskStatus } from "./tasks.js";

function stopFlagPath(config: LoopConfig, cwd: string): string {
  return join(cwd, config.logDir, "stop.flag");
}

/** Master `loop stop`, or a pane's own Ctrl+C handler, both call this. */
export function requestStop(config: LoopConfig, cwd: string = process.cwd()): void {
  mkdirSync(join(cwd, config.logDir), { recursive: true });
  writeFileSync(stopFlagPath(config, cwd), new Date().toISOString());
}

// Every running process — master and any detached split-pane child — polls
// this instead of relying on direct parent→child signaling, since split-pane
// panes are independent processes with no private IPC channel to the master.
export function isStopRequested(config: LoopConfig, cwd: string = process.cwd()): boolean {
  return existsSync(stopFlagPath(config, cwd));
}

export function clearStop(config: LoopConfig, cwd: string = process.cwd()): void {
  const path = stopFlagPath(config, cwd);
  if (existsSync(path)) unlinkSync(path);
}

export function markInterrupted(tasksFile: string, taskId: string, lastLogLine: string): void {
  const pointer = `interrupted ${new Date().toISOString()} — ${lastLogLine.slice(0, 120)}`;
  writeTaskStatus(tasksFile, taskId, "interrupted", pointer);
}
