#!/usr/bin/env bun

import { join } from 'node:path';
import { bumpGoVersion } from './bump-go';

const goVersion = process.argv[2];

if (!goVersion) {
  console.error('Usage: bun run cli-bump-go.ts <go-version>');
  console.error('Example: bun run cli-bump-go.ts 1.2.3');
  process.exit(1);
}

try {
  bumpGoVersion(join(process.cwd(), 'package.json'), goVersion);
} catch (error) {
  console.error('Error:', error instanceof Error ? error.message : error);
  process.exit(1);
}
