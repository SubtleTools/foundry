/**
 * Test filtering utilities for running selective tests
 */

/**
 * Get test filter from command line arguments or environment variable
 */
export const getTestFilter = (): string | undefined => {
  const args = process.argv;
  const filterIndex = args.indexOf('--filter');
  if (filterIndex !== -1 && filterIndex + 1 < args.length) {
    return args[filterIndex + 1];
  }
  return process.env.TEST_FILTER;
};

/**
 * Apply filter to a collection of test items
 */
export const applyFilter = <T extends { name?: string; category?: string; id?: string }>(
  items: T[],
  filter?: string
): T[] => {
  if (!filter) return items;

  const lowerFilter = filter.toLowerCase();
  return items.filter(
    (item) =>
      item.name?.toLowerCase().includes(lowerFilter) ||
      item.category?.toLowerCase().includes(lowerFilter) ||
      item.id?.toLowerCase().includes(lowerFilter)
  );
};

/**
 * Log information about applied filter
 */
export const logFilterInfo = <T extends { name?: string; id?: string }>(
  filter: string | undefined,
  originalItems: T[],
  filteredItems: T[],
  itemType: string = 'items'
): void => {
  if (filter) {
    console.log(`🔍 Filter applied: "${filter}"`);
    console.log(`📋 Found ${filteredItems.length}/${originalItems.length} matching ${itemType}`);
  }
};
