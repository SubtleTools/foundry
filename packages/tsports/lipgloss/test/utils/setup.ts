/**
 * Test setup configuration for bun test
 *
 * Ensures consistent testing environment with colors enabled
 */

// Force color support in tests
process.env.FORCE_COLOR = '3';
// Use a TERM that supports TrueColor (24-bit color)
process.env.TERM = 'xterm-truecolor';
process.env.COLORTERM = 'truecolor';  // Additional hint for TrueColor support

// Disable CI mode that might interfere with color detection
process.env.CI = 'false';

// CRITICAL: Mock terminal width to match golden file generation
// Golden files were generated with a specific terminal width (195 columns)
// We must ensure tests run with the same width to get matching output
const GOLDEN_TERMINAL_WIDTH = 195;
const GOLDEN_TERMINAL_HEIGHT = 50;

// Mock process.stdout.columns and rows
Object.defineProperty(process.stdout, 'columns', {
  value: GOLDEN_TERMINAL_WIDTH,
  writable: true,
  configurable: true,
});

Object.defineProperty(process.stdout, 'rows', {
  value: GOLDEN_TERMINAL_HEIGHT,
  writable: true,
  configurable: true,
});

// Optional: Set up any global test configuration
// This file is automatically loaded by bun test
