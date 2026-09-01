import { spawnSync } from 'node:child_process';
import { assertSafePath } from './security.js';
import type { LoopConfig } from './config.js';
import type { TaskRow } from './tasks.js';

export interface WorkerResult {
  ok: boolean;
  log: string;
}

function promptFor(task: TaskRow): string {
  return `Work on this task: ${task.task}`;
}

/** Runs the configured worker CLI for one task and blocks until it exits. */
export function runWorkerSync(config: LoopConfig, task: TaskRow): WorkerResult {
  assertSafePath();
  const result = spawnSync(
    config.workerCli,
    [...config.workerArgs, promptFor(task)],
    {
      encoding: 'utf8',
    },
  );
  return {
    ok: result.status === 0,
    log: `${result.stdout ?? ''}${result.stderr ?? ''}`,
  };
}
