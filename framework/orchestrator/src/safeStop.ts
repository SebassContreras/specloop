import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { LoopConfig } from './config.js';
import { writeTaskStatus } from './tasks.js';

function stopFlagPath(config: LoopConfig, cwd: string): string {
  return join(cwd, config.logDir, 'stop.flag');
}

/** `loop stop` from another terminal, or Ctrl+C on the master itself, both call this. */
export function requestStop(
  config: LoopConfig,
  cwd: string = process.cwd(),
): void {
  mkdirSync(join(cwd, config.logDir), { recursive: true });
  writeFileSync(stopFlagPath(config, cwd), new Date().toISOString());
}

export function isStopRequested(
  config: LoopConfig,
  cwd: string = process.cwd(),
): boolean {
  return existsSync(stopFlagPath(config, cwd));
}

export function clearStop(
  config: LoopConfig,
  cwd: string = process.cwd(),
): void {
  const path = stopFlagPath(config, cwd);
  if (existsSync(path)) unlinkSync(path);
}

export function markInterrupted(
  tasksFile: string,
  taskId: string,
  lastLogLine: string,
): void {
  const pointer = `interrupted ${new Date().toISOString()} — ${lastLogLine.slice(0, 120)}`;
  writeTaskStatus(tasksFile, taskId, 'interrupted', pointer);
}
