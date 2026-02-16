// @tsports/go-osc52 - TypeScript port of go-osc52
// This is the main export file for the TypeScript-native API

// Export the main classes and functions
export {
  clearSequence,
  newSequence,
  querySequence,
  Sequence,
} from './core.js';

// Export all types and enums
export {
  Clipboard,
  Mode,
  Operation,
  type Stringer,
  type Writer,
  type WriterTo,
} from './types.js';

// Import for convenience aliases
import { clearSequence, newSequence, querySequence } from './core.js';

// Convenience aliases for common operations
export const New = newSequence;
export const Query = querySequence;
export const Clear = clearSequence;
