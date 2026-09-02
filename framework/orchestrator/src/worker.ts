import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { assertSafePath } from './security.js';
import type { LoopConfig } from './config.js';
import type { TaskRow } from './tasks.js';
import type { SpecRef } from './roadmap.js';

export interface WorkerResult {
  ok: boolean;
  log: string;
}

/** No worker CLI should need more than this to finish one task headlessly. */
const WORKER_TIMEOUT_MS = 30 * 60 * 1000;

/**
 * Filtered at prompt-build time rather than at config load: a project can gain
 * `planning/styles.md` between two runs, and telling a worker to read a file that
 * was never created wastes a turn and invites it to invent the contents.
 */
export function existingContextFiles(
  config: LoopConfig,
  cwd: string,
): string[] {
  return config.contextFiles.filter((f) => existsSync(join(cwd, f)));
}

/**
 * The worker's whole briefing. It previously received `Work on this task: <cell>`
 * and nothing else — not even which spec the task belonged to — so it could not
 * read that spec's requirements/design, and learned the project's stack and
 * conventions only by accident: `claude` auto-loads `CLAUDE.md` from the
 * inherited cwd, while `codex`/`opencode` read `AGENTS.md` and got nothing.
 *
 * Files are named, not inlined. Inlining would put the entire architecture
 * register into every task's prompt and grow without bound.
 */
export function promptFor(
  spec: SpecRef,
  task: TaskRow,
  config: LoopConfig,
  cwd: string,
): string {
  const specDir = `planning/specs/${spec.id}-${spec.name}`;
  const context = existingContextFiles(config, cwd);
  const lines = [
    `You are working in the repo at ${cwd}.`,
    '',
    `Task ${task.id} of spec ${spec.id}-${spec.name}: ${task.task}`,
    '',
    'Before you start, read:',
    `- ${specDir}/requirements.md and ${specDir}/design.md — what this spec is and how it was decided it would work.`,
  ];
  if (context.length > 0) {
    lines.push(
      `- ${context.join(', ')} — the project's stack, conventions and style rules. Follow them.`,
    );
  }
  lines.push(
    '',
    'Do only this task. Do not start the next one.',
    `Do not edit any Status or Owner column in ${specDir}/tasks.md — the orchestrator owns those.`,
  );
  return lines.join('\n');
}

/** Runs the configured worker CLI for one task and blocks until it exits. */
export function runWorkerSync(
  config: LoopConfig,
  spec: SpecRef,
  task: TaskRow,
  cwd: string,
): WorkerResult {
  assertSafePath();
  const result = spawnSync(
    config.workerCli,
    [...config.workerArgs, promptFor(spec, task, config, cwd)],
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
