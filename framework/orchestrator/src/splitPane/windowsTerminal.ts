import { spawn } from 'node:child_process';
import { assertSafePath } from '../security.js';
import type { SpecRef } from './index.js';
import type { TaskRow } from '../tasks.js';

// The pane runs `loop _run-task ...` (not the raw worker CLI) so that pane's
// own process is the one that flips the task's status/notes in tasks.md when
// it finishes — the master never blocks waiting on it.
export function runInWindowsTerminal(
  spec: SpecRef,
  task: TaskRow,
  cwd: string,
  workerIndex: number,
): void {
  assertSafePath();
  const runTaskCmd = `loop _run-task ${spec.id} ${spec.name} ${task.id} ${workerIndex}`;
  spawn('wt', ['-w', '0', 'split-pane', '-d', cwd, 'cmd', '/k', runTaskCmd], {
    stdio: 'ignore',
    detached: true,
  }).unref();
}
