/**
 * Test filtering utilities for selectively running test cases.
 * Reads filter from TEST_FILTER env var or --filter CLI argument.
 */

export interface TestFilter {
  pattern: string | null;
}

export function getTestFilter(): TestFilter {
  const envFilter = process.env.TEST_FILTER ?? null;
  const argIndex = process.argv.indexOf('--filter');
  const argFilter = argIndex !== -1 ? process.argv[argIndex + 1] ?? null : null;

  return { pattern: argFilter ?? envFilter };
}

export function applyFilter<T extends { name: string }>(
  items: T[],
  filter: TestFilter,
): T[] {
  if (!filter.pattern) return items;

  const pattern = filter.pattern.toLowerCase();
  return items.filter(
    (item) => item.name.toLowerCase().includes(pattern),
  );
}

export function logFilterInfo(filter: TestFilter, totalCount: number, filteredCount: number): void {
  if (filter.pattern) {
    console.log(`Test filter: "${filter.pattern}" — ${filteredCount}/${totalCount} tests selected`);
  }
}
