import { statSync } from 'node:fs';
import { delimiter } from 'node:path';

const WORLD_WRITABLE = 0o002;

/**
 * Refuses to spawn a subprocess if PATH contains a world-writable directory —
 * anyone able to write there could plant a binary that shadows the intended
 * command (`claude`, `codex`, `wt`, `tmux`, ...) and get it executed instead.
 * Sonar S4036: "Make sure the PATH variable only contains fixed, unwriteable
 * directories." Owner-writable entries (the common case for per-user tool
 * installs) are not flagged — only entries writable by anyone.
 *
 * POSIX only: `fs.stat`'s `mode` bits are real permission data there. On
 * Windows, Node synthesizes `mode` from the read-only attribute alone, so
 * every normal directory (including e.g. `C:\Program Files\nodejs`) comes
 * back reporting as "world-writable" — checking it would just make the tool
 * unusable, not safer. Real Windows ACL writability would need parsing
 * `icacls` output, which isn't worth the fragility for this check.
 */
export function assertSafePath(env: NodeJS.ProcessEnv = process.env): void {
  if (process.platform === 'win32') return;
  const raw = env.PATH ?? env.Path ?? '';
  const unsafe = raw.split(delimiter).filter((dir) => {
    if (!dir) return false;
    try {
      return (statSync(dir).mode & WORLD_WRITABLE) !== 0;
    } catch {
      return false; // missing/inaccessible entries aren't a writability risk
    }
  });
  if (unsafe.length > 0) {
    throw new Error(
      `Refusing to spawn a subprocess: PATH contains world-writable director${
        unsafe.length === 1 ? 'y' : 'ies'
      }: ${unsafe.join(', ')}`,
    );
  }
}
