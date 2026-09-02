/**
 * Markdown pipe-table row splitting, shared by roadmap.ts and tasks.ts.
 *
 * Split-based rather than regex-based on purpose. The previous exact-arity
 * `/^\|([^|]*)\|([^|]*)\|([^|]*)\|([^|]*)\|$/` matched only 4-cell rows, so
 * adding any column silently broke every row in the file — the parse returned
 * an empty list and the loop reported "nothing eligible to run" rather than an
 * error. Splitting also removes the backtracking hazard that shaped the old
 * regex, so the table contract can be extended without a parser rewrite.
 */
export function splitRow(line: string): string[] | undefined {
  const trimmed = line.trim();
  if (!trimmed.startsWith('|') || !trimmed.endsWith('|')) return undefined;
  if (trimmed.length < 2) return undefined;
  // slice(1, -1) drops the leading and trailing pipes, so the split doesn't
  // produce a phantom empty cell at each end.
  return trimmed.slice(1, -1).split('|').map((cell) => cell.trim());
}

/** True for a header row (`| ID | ... |`) or a separator (`|-----|-----|`). */
export function isHeaderOrSeparator(firstCell: string): boolean {
  return firstCell === 'ID' || /^:?-+:?$/.test(firstCell);
}

/**
 * Makes arbitrary text safe to put in a table cell. Notes come from worker log
 * output, which can contain pipes and newlines — either would corrupt the row
 * and make every later parse of the file wrong.
 */
export function sanitizeCell(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').replace(/\|/g, '/').trim();
}

/**
 * Rewrites cells of a row, preserving every other cell — including any trailing
 * columns this orchestrator version doesn't know about. Values are sanitized,
 * and the row is rebuilt in one pass so no re-parse can mis-index a cell.
 */
export function withCells(
  cells: string[],
  updates: ReadonlyArray<readonly [number, string]>,
): string {
  const next = [...cells];
  for (const [index, value] of updates) {
    next[index] = sanitizeCell(value);
  }
  return `| ${next.join(' | ')} |`;
}
