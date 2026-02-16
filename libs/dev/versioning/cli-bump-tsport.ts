#!/usr/bin/env bun

import { join } from 'node:path';
import { bumpTsportVersion } from './bump-tsport';

try {
  bumpTsportVersion(join(process.cwd(), 'package.json'));
} catch (error) {
  console.error('Error:', error instanceof Error ? error.message : error);
  process.exit(1);
}
