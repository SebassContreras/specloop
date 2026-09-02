import { spawn } from 'node:child_process';
import { assertSafePath } from '../security.js';
import type { SpecRef } from './index.js';
import type { TaskRow } from '../tasks.js';

export function runInTmux(
  spec: SpecRef,
  task: TaskRow,
  cwd: string,
  workerIndex: number,
): void {
  assertSafePath(); // mitigates PATH hijacking for the spawn below
  const runTaskCmd = `loop _run-task ${spec.id} ${spec.name} ${task.id} ${workerIndex}`;
  spawn('tmux', ['split-window', '-c', cwd, runTaskCmd], {
    stdio: 'ignore',
    detached: true,
  }).unref();
}
