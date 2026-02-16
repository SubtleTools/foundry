import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

try {
  const output = execSync('bun run examples/table/pokemon/main.ts', {
    env: { ...process.env, FORCE_COLOR: '3' },
    encoding: 'utf8'
  });

  function escapeSeqs(s: string): string {
    return s
      .replace(/\x1b/g, '\\x1b')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t');
  }

  const escaped = escapeSeqs(output);

  writeFileSync(
    'test/testdata/example_table_pokemon_table_color.golden.fixed',
    escaped
  );
  writeFileSync(
    'test/testdata/critical_table_pokemon_table.golden.fixed',
    escaped
  );
  console.log('Generated fixed golden files for Pokemon Table.');

  // Layout Example
  const layoutOutput = execSync('bun run examples/layout/main.ts', {
    env: { ...process.env, FORCE_COLOR: '3' },
    encoding: 'utf8'
  });
  const layoutEscaped = escapeSeqs(layoutOutput);

  writeFileSync(
    'test/testdata/example_layout_layout_example_color.golden.fixed',
    layoutEscaped
  );
  writeFileSync(
    'test/testdata/critical_layout_layout_example.golden.fixed',
    layoutEscaped
  );
  console.log('Generated fixed golden files for Layout Example.');
} catch (e) {
  console.error(e);
  process.exit(1);
}
