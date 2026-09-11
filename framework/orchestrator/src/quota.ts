/**
 * Best-effort detection of a worker CLI hitting its own usage/rate limit,
 * from the text it wrote to stdout/stderr. There is no shared protocol
 * across CLIs for this — each vendor prints its own wording — so this is a
 * heuristic substring match over the captured log, not a guarantee.
 *
 * Not verified live against a real exhausted quota for any worker yet
 * (`claude`, `codex`, `opencode` included) — same "don't claim otherwise"
 * status `tmux`'s split-pane backend had before it got a real run. Extend
 * this list once a real message is actually seen; a miss just means the
 * task gets marked `blocked` as before instead of offering a worker switch.
 */
const QUOTA_PATTERNS: RegExp[] = [
  /usage limit/i,
  /rate.?limit/i,
  /quota exceeded/i,
  /\b429\b/,
  /too many requests/i,
  /overloaded/i,
];

export function looksLikeQuotaExhausted(log: string): boolean {
  return QUOTA_PATTERNS.some((re) => re.test(log));
}
