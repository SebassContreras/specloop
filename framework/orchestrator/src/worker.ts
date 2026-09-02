import { spawnSync } from 'node:child_process';
import { assertSafePath } from './security.js';
import type { LoopConfig } from './config.js';
import type { TaskRow } from './tasks.js';

export interface WorkerResult {
  ok: boolean;
  log: string;
}

/** No worker CLI should need more than this to finish one task headlessly. */
const WORKER_TIMEOUT_MS = 30 * 60 * 1000;

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
      // Never let the worker sit on an interactive prompt: with stdin left
      // as an open, unfed pipe (the spawnSync default), a CLI that isn't
      // told it's running headlessly (e.g. plain `claude "<prompt>"`
      // without `-p`) blocks indefinitely waiting for terminal input, and
      // the whole loop hangs with it. `workerArgs` is where a CLI's
      // non-interactive flag belongs (specloop:loop-setup asks for it);
      // this is a backstop, not a substitute for that.
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: WORKER_TIMEOUT_MS,
    },
  );
  if (result.error) {
    return {
      ok: false,
      log: `${result.stdout ?? ''}${result.stderr ?? ''}[loop] worker failed to run: ${result.error.message}`,
    };
  }
  if (result.signal) {
    return {
      ok: false,
      log: `${result.stdout ?? ''}${result.stderr ?? ''}[loop] worker killed by signal ${result.signal} (likely the ${WORKER_TIMEOUT_MS / 60000}min timeout — check workerArgs for a headless/non-interactive flag).`,
    };
  }
  return {
    ok: result.status === 0,
    log: `${result.stdout ?? ''}${result.stderr ?? ''}`,
  };
}
