import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export type SplitMode = 'windowsTerminal' | 'tmux' | 'none';

export interface LoopConfig {
  workerCli: string;
  workerArgs: string[];
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
  if (!parsed.workerCli) {
    throw new Error(`${CONFIG_PATH} is missing "workerCli".`);
  }
  return {
    workerCli: parsed.workerCli,
    workerArgs: parsed.workerArgs ?? [],
    splitMode: parsed.splitMode ?? 'none',
    logDir: parsed.logDir ?? '.specloop/logs',
    contextFiles: parsed.contextFiles ?? DEFAULT_CONTEXT_FILES,
  };
}
