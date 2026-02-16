#!/usr/bin/env bun
/**
 * Migration script to rename golden files to semantic color profile naming
 *
 * Old naming:
 * - {test}_no_color.golden -> {test}_ascii.golden
 * - {test}_color.golden -> {test}_truecolor.golden
 *
 * New naming:
 * - {test}_ascii.golden - Ascii profile (NO_COLOR=1)
 * - {test}_ansi.golden - ANSI profile (16 colors)
 * - {test}_ansi256.golden - ANSI256 profile (256 colors)
 * - {test}_truecolor.golden - TrueColor profile (FORCE_COLOR=3, 24-bit RGB)
 */

import { readdirSync, renameSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const testdataDir = join(__dirname, 'testdata');

interface Migration {
  from: string;
  to: string;
  reason: string;
}

function collectMigrations(): Migration[] {
  const migrations: Migration[] = [];

  if (!existsSync(testdataDir)) {
    console.log('No testdata directory found');
    return migrations;
  }

  const files = readdirSync(testdataDir);

  for (const file of files) {
    const filePath = join(testdataDir, file);

    // Skip directories
    if (statSync(filePath).isDirectory()) {
      continue;
    }

    // Skip non-golden files
    if (!file.endsWith('.golden')) {
      continue;
    }

    // Migrate _no_color.golden to _ascii.golden
    if (file.endsWith('_no_color.golden')) {
      const newName = file.replace('_no_color.golden', '_ascii.golden');
      migrations.push({
        from: file,
        to: newName,
        reason: 'NO_COLOR=1 maps to Ascii profile',
      });
    }
    // Migrate _color.golden to _truecolor.golden
    else if (file.endsWith('_color.golden')) {
      const newName = file.replace('_color.golden', '_truecolor.golden');
      migrations.push({
        from: file,
        to: newName,
        reason: 'FORCE_COLOR=3 maps to TrueColor profile',
      });
    }
    // Check for old naming patterns that don't have profile suffixes
    else if (
      file.endsWith('.golden') &&
      !file.endsWith('_ascii.golden') &&
      !file.endsWith('_ansi.golden') &&
      !file.endsWith('_ansi256.golden') &&
      !file.endsWith('_truecolor.golden')
    ) {
      // These might be legacy files without proper suffixes
      // We'll leave them for manual review
      console.log(
        `⚠️  Found golden file without color profile suffix: ${file}`
      );
      console.log(
        `   This might be a legacy file. Please review and rename manually.`
      );
    }
  }

  return migrations;
}

function performMigration(dryRun: boolean = true): void {
  const migrations = collectMigrations();

  if (migrations.length === 0) {
    console.log('✅ No golden files need migration');
    return;
  }

  console.log(`Found ${migrations.length} golden files to migrate:\n`);

  for (const migration of migrations) {
    const fromPath = join(testdataDir, migration.from);
    const toPath = join(testdataDir, migration.to);

    console.log(`  ${migration.from}`);
    console.log(`    → ${migration.to}`);
    console.log(`    Reason: ${migration.reason}`);

    if (existsSync(toPath)) {
      console.log(`    ⚠️  WARNING: Target file already exists!`);
    }

    if (!dryRun) {
      if (existsSync(toPath)) {
        console.log(`    ❌ SKIPPED: Target file exists`);
      } else {
        try {
          renameSync(fromPath, toPath);
          console.log(`    ✅ Migrated`);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.log(`    ❌ ERROR: ${errorMessage}`);
        }
      }
    }

    console.log('');
  }

  if (dryRun) {
    console.log('\n📋 This was a dry run. No files were changed.');
    console.log('Run with --apply to perform the migration:\n');
    console.log('  bun run test/migrate-golden-files.ts --apply\n');
  } else {
    console.log('\n✅ Migration complete!');
    console.log(
      'You may need to update your test cases to use the new naming scheme.'
    );
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = !args.includes('--apply');

console.log('Golden File Migration Tool');
console.log('==========================\n');

if (dryRun) {
  console.log('🔍 Running in DRY RUN mode\n');
} else {
  console.log('⚠️  Running in APPLY mode - files will be renamed!\n');
}

performMigration(dryRun);
