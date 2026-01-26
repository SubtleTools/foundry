/**
 * Global tolerance configuration for test comparisons
 */

import type { ToleranceConfig } from './types';

export const DEFAULT_TOLERANCE: ToleranceConfig = {
  hexColorTolerance: 1,           // ±1 per channel (0.4% error)
  ansiRgbTolerance: 1,            // ±1 per channel
  floatRelativeTolerance: 0.05,   // 5% relative error
  floatAbsoluteTolerance: 1e-10,  // Absolute error for tiny values
};

let currentConfig: ToleranceConfig = { ...DEFAULT_TOLERANCE };

/**
 * Set global tolerance configuration
 * @param config Partial configuration to merge with current settings
 */
export function setToleranceConfig(config: Partial<ToleranceConfig>): void {
  currentConfig = { ...currentConfig, ...config };
}

/**
 * Get current tolerance configuration
 * @returns Read-only copy of current configuration
 */
export function getToleranceConfig(): Readonly<ToleranceConfig> {
  return currentConfig;
}

/**
 * Reset tolerance configuration to defaults
 */
export function resetToleranceConfig(): void {
  currentConfig = { ...DEFAULT_TOLERANCE };
}

/**
 * Export default tolerance for convenience
 */
export { DEFAULT_TOLERANCE as defaultTolerance };
