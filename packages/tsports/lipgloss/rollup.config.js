import { defineConfig } from 'rollup';
import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';

export default defineConfig([
  // ES Modules and CommonJS builds
  {
    input: 'src/index.ts',
    external: ['chalk', 'string-width', 'strip-ansi', 'supports-color'],
    plugins: [
      esbuild({
        target: 'es2020',
        minify: false,
        keepNames: true,
      }),
    ],
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
      },
      {
        file: 'dist/index.esm.js',
        format: 'es',
        sourcemap: true,
      },
    ],
  },
  // Type definitions
  {
    input: 'src/index.ts',
    external: ['chalk', 'string-width', 'strip-ansi', 'supports-color'],
    plugins: [dts()],
    output: {
      file: 'dist/index.d.ts',
      format: 'es',
    },
  },
]);
