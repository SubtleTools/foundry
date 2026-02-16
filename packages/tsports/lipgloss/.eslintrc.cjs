module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  env: {
    node: true,
    es6: true,
  },
  rules: {
    // Allow commonly used patterns in this codebase
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'no-console': 'off', // Many examples use console
    'prefer-const': 'warn',
    'no-var': 'error',
    'no-case-declarations': 'off',
    'no-dupe-class-members': 'off', // TypeScript handles this
    'no-undef': 'off', // TypeScript handles this
    'no-unused-vars': 'off', // TypeScript handles this better
    'no-constant-condition': 'off', // Used intentionally in some loops
    'no-control-regex': 'off', // ANSI escape sequences
  },
  overrides: [
    {
      files: ['test/**/*.ts', '**/*.test.ts', '**/*.spec.ts'],
      env: {
        jest: true,
        mocha: true,
        node: true,
      },
      globals: {
        describe: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        it: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
      },
      rules: {
        // Test files can be very relaxed
      },
    },
    {
      files: ['examples/**/*.ts'],
      rules: {
        // Examples are for demonstration, allow flexibility
      },
    },
    {
      files: ['scripts/**/*.js', '*.config.js', 'rollup.config.js'],
      env: {
        node: true,
      },
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
};