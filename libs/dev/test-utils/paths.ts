/**
 * Path utilities for resolving monorepo and upstream reference directories.
 *
 * All TSPort packages share a common layout:
 *   - Packages live at `packages/tsports/<pkg>/`
 *   - Upstream Go sources live at `upstream/<pkg>/`
 *
 * These helpers resolve those locations reliably from anywhere in the repo.
 */

import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

let _repoRoot: string | undefined;

/**
 * Walk up from `startDir` until we find the monorepo root
 * (identified by the `upstream/` directory).
 */
function findRepoRoot(startDir: string): string {
  let dir = resolve(startDir);
  while (dir !== dirname(dir)) {
    if (existsSync(join(dir, 'upstream'))) {
      return dir;
    }
    dir = dirname(dir);
  }
  throw new Error(
    'Could not find monorepo root (looked for upstream/ directory). ' +
      'Are you running from inside the tsports repo?'
  );
}

/**
 * Returns the absolute path to the monorepo root.
 * Result is cached after first call.
 */
export function repoRoot(startDir?: string): string {
  if (!_repoRoot) {
    _repoRoot = findRepoRoot(startDir ?? process.cwd());
  }
  return _repoRoot;
}

/**
 * Returns the absolute path to `upstream/<packageName>`.
 *
 * @example
 * ```ts
 * upstreamDir('lipgloss')  // => '/path/to/tsports/upstream/lipgloss'
 * ```
 */
export function upstreamDir(packageName: string, startDir?: string): string {
  const root = repoRoot(startDir);
  const dir = join(root, 'upstream', packageName);
  if (!existsSync(dir)) {
    throw new Error(
      `Upstream submodule not found: ${dir}\n` +
        `Run: git submodule update --init upstream/${packageName}`
    );
  }
  return dir;
}
