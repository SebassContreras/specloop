import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export type SplitMode = 'windowsTerminal' | 'tmux' | 'none';

export interface LoopConfig {
  workerCli: string;
  workerArgs: string[];
  splitMode: SplitMode;
  logDir: string;
}

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
  const parsed = JSON.parse(raw);
  if (!parsed.workerCli) {
    throw new Error(`${CONFIG_PATH} is missing "workerCli".`);
  }
  return {
    workerCli: parsed.workerCli,
    workerArgs: parsed.workerArgs ?? [],
    splitMode: parsed.splitMode ?? 'none',
    logDir: parsed.logDir ?? '.specloop/logs',
  };
}
