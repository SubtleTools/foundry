/**
 * Tests for random number generation utilities
 */
import { expect, test } from 'bun:test';
import { getDefaultGlobalRand } from '../src/rand';

test('Default global random interface', () => {
  const rand = getDefaultGlobalRand();

  // Test float64 method
  const float1 = rand.float64();
  expect(float1).toBeGreaterThanOrEqual(0);
  expect(float1).toBeLessThan(1);

  const float2 = rand.float64();
  expect(float2).toBeGreaterThanOrEqual(0);
  expect(float2).toBeLessThan(1);

  // Should produce different values (with very high probability)
  expect(float1).not.toBe(float2);

  // Test intn method
  const int1 = rand.intn(10);
  expect(int1).toBeGreaterThanOrEqual(0);
  expect(int1).toBeLessThan(10);
  expect(Number.isInteger(int1)).toBe(true);

  const int2 = rand.intn(5);
  expect(int2).toBeGreaterThanOrEqual(0);
  expect(int2).toBeLessThan(5);
  expect(Number.isInteger(int2)).toBe(true);

  // Test edge cases
  const zeroInt = rand.intn(1);
  expect(zeroInt).toBe(0);

  // Test that we can call these methods multiple times
  for (let i = 0; i < 100; i++) {
    const f = rand.float64();
    const n = rand.intn(100);
    expect(f).toBeGreaterThanOrEqual(0);
    expect(f).toBeLessThan(1);
    expect(n).toBeGreaterThanOrEqual(0);
    expect(n).toBeLessThan(100);
  }
});

test('Random interface consistency', () => {
  const rand = getDefaultGlobalRand();

  // Generate many values to test statistical properties
  const floats: number[] = [];
  const ints: number[] = [];

  for (let i = 0; i < 1000; i++) {
    floats.push(rand.float64());
    ints.push(rand.intn(10));
  }

  // Test that Float64 produces values across the range
  const minFloat = Math.min(...floats);
  const maxFloat = Math.max(...floats);
  expect(minFloat).toBeGreaterThanOrEqual(0);
  expect(maxFloat).toBeLessThan(1);
  expect(maxFloat - minFloat).toBeGreaterThan(0.5); // Should span a good range

  // Test that Intn produces all expected values
  const intSet = new Set(ints);
  expect(intSet.size).toBeGreaterThan(5); // Should have reasonable diversity
  ints.forEach((n) => {
    expect(n).toBeGreaterThanOrEqual(0);
    expect(n).toBeLessThan(10);
  });
});
