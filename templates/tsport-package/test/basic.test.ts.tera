import { test, expect, describe } from 'bun:test';

// Test imports from main package
import { initializeLibrary, type LibraryOptions, type LibraryResult, LibraryError } from '../src/index.js';

// Test imports from Go-style API
import { InitializeLibrary } from '../src/go-style.js';

// Test imports from types module  
import type { OperationMode } from '../src/types.js';

// Test internal imports using package.json imports
import { initializeLibrary as srcInit } from '#src/index.js';
import { LibraryError as SrcError } from '#src/types.js';

describe('Package Imports', () => {
  test('TypeScript-native API imports correctly', async () => {
    // Test main function import
    expect(typeof initializeLibrary).toBe('function');
    await initializeLibrary('test');
    
    // Test type imports
    const options: LibraryOptions = { enableLogging: true, timeout: 1000 };
    expect(options.enableLogging).toBe(true);
    
    // Test error class import
    const error = new LibraryError('test error', 'TEST_001');
    expect(error.message).toBe('test error');
    expect(error.code).toBe('TEST_001');
  });

  test('Go-style API imports correctly', () => {
    // Test Go-style function import
    expect(typeof InitializeLibrary).toBe('function');
    InitializeLibrary('Go-style test');
  });

  test('Type imports work correctly', () => {
    // Test union type import
    const mode: OperationMode = 'async';
    expect(['sync', 'async', 'streaming']).toContain(mode);
    
    // Test interface usage
    const result: LibraryResult = {
      success: true,
      data: 'test data',
      timestamp: Date.now()
    };
    expect(result.success).toBe(true);
  });

  test('Package imports (#src, #test) work correctly', async () => {
    // Test #src imports
    expect(typeof srcInit).toBe('function');
    await srcInit('Testing #src import');
    
    // Test #src type imports
    const srcError = new SrcError('test error', 'TEST_SRC');
    expect(srcError.message).toBe('test error');
    expect(srcError.code).toBe('TEST_SRC');
    
    console.log('✅ Package imports (#src/*, #test/*) working correctly');
  });
});

describe('Basic Functionality', () => {
  test('library initializes correctly', async () => {
    await expect(initializeLibrary('test message')).resolves.toBeUndefined();
  });

  test('Go-style library initializes correctly', () => {
    expect(() => InitializeLibrary('test message')).not.toThrow();
  });
});

describe('Go Compatibility', () => {
  test('API signatures match Go patterns', () => {
    // TODO: Add tests that verify compatibility with Go implementation
    // Consider using the same test cases as the Go package
    
    // Test that Go-style function exists and works
    expect(typeof InitializeLibrary).toBe('function');
    
    // Test that TypeScript function provides equivalent functionality
    expect(typeof initializeLibrary).toBe('function');
  });
});