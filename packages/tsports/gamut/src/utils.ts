/**
 * Wagner-Fischer algorithm for calculating Levenshtein distance with custom costs.
 *
 * Ported from github.com/xrash/smetrics
 */

export function wagnerFischer(
  s1: string,
  s2: string,
  icost: number,
  dcost: number,
  scost: number
): number {
  const m = s1.length;
  const n = s2.length;

  const d: number[][] = Array.from({ length: m + 1 }, () => []);

  for (let i = 0; i <= m; i++) {
    const row = d[i];
    if (row) {
      row[0] = i * dcost; // deletion cost
    }
  }

  const firstRow = d[0];
  if (firstRow) {
    for (let j = 0; j <= n; j++) {
      firstRow[j] = j * icost; // insertion cost (if we consider s1 -> s2 translation)
      // actually standard WF:
      // d[i][0] = i deletions (from s1 to empty)
      // d[0][j] = j insertions (from empty to s2)
    }
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      let cost = 0;
      if (s1[i - 1] !== s2[j - 1]) {
        cost = scost;
      }

      const currentRow = d[i];
      const prevRow = d[i - 1];

      if (currentRow && prevRow) {
        const deletion = (prevRow[j] ?? 0) + dcost;
        const insertion = (currentRow[j - 1] ?? 0) + icost;
        const substitution = (prevRow[j - 1] ?? 0) + cost;

        currentRow[j] = Math.min(deletion, insertion, substitution);
      }
    }
  }

  const lastRow = d[m];
  return lastRow?.[n] ?? 0;
}
