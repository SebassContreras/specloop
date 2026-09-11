import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { LoopConfig } from './config.js';

/**
 * One PID per in-flight task, keyed by `<specId>-<taskId>` — the master's own
 * PID, registered before it blocks on that task's worker and cleared when it
 * finishes. This is what lets a later `loop run` tell "still genuinely
 * running" (registered PID alive) apart from "left `in_progress` by a
 * process that's gone" (PID dead or never registered) after an ungraceful
 * kill of the master itself (a crash, `kill -9`, the enclosing shell's own
 * timeout — anything that skipped safeStop's clean path).
 *
 * Not a defense against PID reuse after a reboot — an unrelated process
 * landing on the same PID would misread as "still running". Acceptable for
 * a local dev-loop tool; not a distributed lock.
 */

function registryPath(config: LoopConfig, cwd: string): string {
  return join(cwd, config.logDir, 'task-pids.json');
}

function readRegistry(config: LoopConfig, cwd: string): Record<string, number> {
  const path = registryPath(config, cwd);
  if (!existsSync(path)) return {};
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return {};
  }
}

function writeRegistry(
  config: LoopConfig,
  cwd: string,
  registry: Record<string, number>,
): void {
  mkdirSync(join(cwd, config.logDir), { recursive: true });
  writeFileSync(registryPath(config, cwd), JSON.stringify(registry));
}

function key(specId: string, taskId: string): string {
  return `${specId}-${taskId}`;
}

export function registerTaskPid(
  config: LoopConfig,
  cwd: string,
  specId: string,
  taskId: string,
): void {
  const registry = readRegistry(config, cwd);
  registry[key(specId, taskId)] = process.pid;
  writeRegistry(config, cwd, registry);
}

export function clearTaskPid(
  config: LoopConfig,
  cwd: string,
  specId: string,
  taskId: string,
): void {
  const registry = readRegistry(config, cwd);
  delete registry[key(specId, taskId)];
  writeRegistry(config, cwd, registry);
}

function isPidAlive(pid: number): boolean {
  try {
    // Signal 0 sends nothing — Node documents this as a portable liveness
    // probe on both POSIX and Windows.
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

/** True only if the task registered under this key has a still-live owner. */
export function isTaskStillRunning(
  config: LoopConfig,
  cwd: string,
  specId: string,
  taskId: string,
): boolean {
  const pid = readRegistry(config, cwd)[key(specId, taskId)];
  return typeof pid === 'number' && isPidAlive(pid);
}
