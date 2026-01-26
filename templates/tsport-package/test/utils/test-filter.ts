/**
 * Re-export filtering utilities from shared library
 * This provides backward compatibility for existing packages while
 * delegating to the shared @dev/test-utils library.
 */

export { getTestFilter, applyFilter, logFilterInfo } from '@dev/test-utils/filtering';
