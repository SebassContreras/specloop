import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export type SplitMode = 'windowsTerminal' | 'tmux' | 'none';

export interface WorkerSpec {
  cli: string;
  args: string[];
}

export interface LoopConfig {
  /**
   * One or more worker CLIs. With more than one, the loop round-robins across
   * them by task order (`worker.ts`'s `pickWorker`). A config on disk with the
   * legacy single `workerCli`/`workerArgs` shape is normalized into a
   * one-element array at load time — `workers` is the only field code reads
   * after that, so there is exactly one source of truth once loaded.
   */
  workers: WorkerSpec[];
  splitMode: SplitMode;
  logDir: string;
  /**
   * Files a worker must read before working — the project's context channel.
   * Only `claude` auto-loads a memory file (`CLAUDE.md`); `codex`/`opencode`
   * read `AGENTS.md`, and neither learns the project's stack, conventions or
   * styles from the task text alone. Consumed by spec `014`.
   */
  contextFiles: string[];
}

const DEFAULT_CONTEXT_FILES = [
  'AGENTS.md',
  'planning/architecture.md',
  'planning/styles.md',
];

const CONFIG_PATH = join('.specloop', 'loop.config.json');

export function loadConfig(cwd: string = process.cwd()): LoopConfig {
  const path = join(cwd, CONFIG_PATH);
  let raw: string;
  try {
    raw = readFileSync(path, 'utf8');
  } catch {
    throw new Error(
      `No ${CONFIG_PATH} found. Run the specloop:loop-setup skill in this repo first.`,
    );
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    // Raw JSON.parse output here is a bare SyntaxError with a byte offset and a
    // stack trace into the orchestrator — useless for someone who has just
    // hand-edited this file (on Windows, most often an unescaped backslash in a
    // path).
    throw new Error(
      `${CONFIG_PATH} is not valid JSON: ${err instanceof Error ? err.message : String(err)}\n` +
        'On Windows, check for unescaped backslashes in paths — use "/" or "\\\\".',
      { cause: err },
    );
  }
  const workers = normalizeWorkers(parsed);
  return {
    workers,
    splitMode: parsed.splitMode ?? 'none',
    logDir: parsed.logDir ?? '.specloop/logs',
    contextFiles: parsed.contextFiles ?? DEFAULT_CONTEXT_FILES,
  };
}

function normalizeWorkers(parsed: {
  workers?: unknown;
  workerCli?: unknown;
  workerArgs?: unknown;
}): WorkerSpec[] {
  if (Array.isArray(parsed.workers) && parsed.workers.length > 0) {
    return parsed.workers.map((w, i) => {
      const worker = w as { cli?: unknown; args?: unknown };
      if (!worker.cli || typeof worker.cli !== 'string') {
        throw new Error(
          `${CONFIG_PATH}'s "workers[${i}]" is missing a string "cli".`,
        );
      }
      return {
        cli: worker.cli,
        args: Array.isArray(worker.args) ? (worker.args as string[]) : [],
      };
    });
  }
  if (typeof parsed.workerCli === 'string' && parsed.workerCli) {
    return [
      {
        cli: parsed.workerCli,
        args: Array.isArray(parsed.workerArgs)
          ? (parsed.workerArgs as string[])
          : [],
      },
    ];
  }
  throw new Error(
    `${CONFIG_PATH} is missing "workers" (or the legacy "workerCli").`,
  );
}
