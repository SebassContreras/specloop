import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadConfig } from './config.js';
import {
  parseRoadmap,
  pickNextSpec,
  writeSpecStatus,
  type SpecRef,
  type SpecStatus,
} from './roadmap.js';
import {
  parseTasks,
  tasksPath,
  nextRunnableTask,
  writeTaskStatus,
  pendingHumanTasks,
  type TaskRow,
} from './tasks.js';
import { runWorker } from './worker.js';
import {
  requestStop,
  isStopRequested,
  clearStop,
  markInterrupted,
} from './safeStop.js';
import { registerTaskPid, clearTaskPid, isTaskStillRunning } from './taskLock.js';

const cwd = process.cwd();

/**
 * Rolls a spec's task states up into the single status the roadmap records.
 * `human` tasks don't hold a spec open — the loop can't act on them, so a spec
 * whose only remaining work is the user's counts as done from the loop's side
 * and is reported separately.
 */
function rollUpStatus(tasks: TaskRow[]): SpecStatus {
  if (tasks.length === 0) return 'todo';
  const agentTasks = tasks.filter((t) => t.owner === 'agent');
  if (agentTasks.some((t) => t.status === 'blocked')) return 'blocked';
  if (agentTasks.some((t) => t.status === 'interrupted')) return 'interrupted';
  if (agentTasks.every((t) => t.status === 'done')) return 'done';
  return 'in_progress';
}

function specHasRunnableWork(spec: SpecRef): boolean {
  try {
    const tasks = parseTasks(tasksPath(cwd, spec.id, spec.name));
    return !!nextRunnableTask(tasks);
  } catch {
    return false;
  }
}

/**
 * Recovers tasks left `in_progress` by a process that's gone — a crash,
 * `kill -9`, the enclosing shell's own timeout, anything that skipped
 * safeStop's clean path. Called exactly **once**, before this `run()` call's
 * own dispatch loop starts: any task already `in_progress` at that moment
 * predates this invocation, so it's safe to judge by its registered PID.
 */
function recoverStaleTasks(
  config: ReturnType<typeof loadConfig>,
  spec: SpecRef,
  path: string,
): void {
  const tasks = parseTasks(path);
  const stuck = tasks.filter(
    (t) =>
      t.owner === 'agent' &&
      t.status === 'in_progress' &&
      !isTaskStillRunning(config, cwd, spec.id, t.id),
  );
  for (const t of stuck) {
    writeTaskStatus(
      path,
      t.id,
      'interrupted',
      'recovered — no live process was still working this task',
    );
    clearTaskPid(config, cwd, spec.id, t.id);
  }
  if (stuck.length > 0) {
    console.log(
      `[loop] recovered ${stuck.length} task(s) left in_progress by a process that's gone: ${stuck
        .map((t) => t.id)
        .join(', ')}`,
    );
  }
}

/** Runs one task inline in this process, logging its result to disk. */
async function runOne(
  config: ReturnType<typeof loadConfig>,
  spec: SpecRef,
  task: TaskRow,
  workerIndex: number,
): Promise<{ ok: boolean; lastLogLine: string }> {
  console.log(`[loop] running task ${task.id}: ${task.task}`);
  const { ok, log } = await runWorker(config, spec, task, cwd, workerIndex);
  mkdirSync(join(cwd, config.logDir), { recursive: true });
  writeFileSync(join(cwd, config.logDir, `${spec.id}-${task.id}.log`), log);
  const lines = log.trim().split('\n');
  return { ok, lastLogLine: lines.at(-1) ?? '' };
}

async function run(): Promise<void> {
  const config = loadConfig(cwd);
  clearStop(config, cwd);
  const roadmap = parseRoadmap(cwd);
  const spec = pickNextSpec(roadmap, specHasRunnableWork);
  if (!spec) {
    console.log(
      '[loop] nothing eligible to run — check planning/roadmap.md status/deps, or every eligible spec has no runnable tasks yet.',
    );
    return;
  }
  const path = tasksPath(cwd, spec.id, spec.name);
  console.log(`[loop] working spec ${spec.id}-${spec.name}`);
  recoverStaleTasks(config, spec, path);

  // Round-robins across config.workers by task order, across all specs the
  // loop works in one `run()` call.
  let workerIndex = 0;

  for (;;) {
    if (isStopRequested(config, cwd)) {
      console.log('[loop] stop requested — not starting a new task.');
      break;
    }
    const tasks = parseTasks(path);
    const task = nextRunnableTask(tasks);
    if (!task) {
      // The roadmap's Status column has no other writer: without this the row
      // stays in_progress forever, pickNextSpec keeps resuming this same spec,
      // and no todo row can ever become eligible.
      writeSpecStatus(cwd, spec.id, rollUpStatus(tasks));
      console.log(`[loop] spec ${spec.id} has no remaining runnable tasks.`);
      const human = pendingHumanTasks(tasks);
      if (human.length > 0) {
        console.log(
          `[loop] ${human.length} task(s) need you: ${human
            .map((t) => t.id)
            .join(', ')}`,
        );
      }
      break;
    }
    registerTaskPid(config, cwd, spec.id, task.id);
    writeTaskStatus(path, task.id, 'in_progress', task.notes);
    const result = await runOne(config, spec, task, workerIndex);
    workerIndex++;
    clearTaskPid(config, cwd, spec.id, task.id);

    if (isStopRequested(config, cwd)) {
      markInterrupted(path, task.id, result.lastLogLine);
      break;
    }
    writeTaskStatus(
      path,
      task.id,
      result.ok ? 'done' : 'blocked',
      result.lastLogLine,
    );
  }
}

function stop(): void {
  const config = loadConfig(cwd);
  requestStop(config, cwd);
  console.log('[loop] stop requested — active work will wind down safely.');
}

function status(): void {
  const roadmap = parseRoadmap(cwd);
  for (const spec of roadmap) {
    // Derive from tasks.md rather than echoing the roadmap cell, so a stale or
    // hand-edited Status is visible instead of being reported as truth.
    let derived = '';
    try {
      const tasks = parseTasks(tasksPath(cwd, spec.id, spec.name));
      const rolled = rollUpStatus(tasks);
      const human = pendingHumanTasks(tasks);
      if (rolled !== spec.status) derived = `  (tasks say: ${rolled})`;
      if (human.length > 0) derived += `  [${human.length} for you]`;
    } catch {
      derived = '  (no tasks.md)';
    }
    console.log(`${spec.id} ${spec.name} — ${spec.status}${derived}`);
  }
}

const [, , command] = process.argv;
switch (command) {
  case 'run':
    void run();
    break;
  case 'stop':
    stop();
    break;
  case 'status':
    status();
    break;
  default:
    console.log('Usage: loop <run|stop|status>');
    process.exitCode = 1;
}
