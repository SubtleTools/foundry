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

  const d: number[][] = [];

  for (let i = 0; i <= m; i++) {
    d[i] = [];
    d[i]![0] = i * dcost; // deletion cost
  }

  for (let j = 0; j <= n; j++) {
    d[0]![j] = j * icost; // insertion cost (if we consider s1 -> s2 translation)
    // actually standard WF:
    // d[i][0] = i deletions (from s1 to empty)
    // d[0][j] = j insertions (from empty to s2)
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      let cost = 0;
      if (s1[i - 1] !== s2[j - 1]) {
        cost = scost;
      }

      d[i]![j] = Math.min(
        d[i - 1]?.[j]! + dcost, // deletion
        d[i]?.[j - 1]! + icost, // insertion
        d[i - 1]?.[j - 1]! + cost // substitution
      );
    }
  }

  return d[m]?.[n]!;
}
