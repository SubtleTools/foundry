/**
 * Tests for HexColor database/JSON serialization
 * Port of Go hexcolor_test.go with identical test cases
 */

import { expect, test } from 'bun:test';
import { ErrUnsupportedType, HexColor } from '../src';

test('HexColor basic serialization', () => {
  const testCases = [
    { hc: new HexColor(0, 0, 0), s: '#000000' },
    { hc: new HexColor(1, 0, 0), s: '#ff0000' },
    { hc: new HexColor(0, 1, 0), s: '#00ff00' },
    { hc: new HexColor(0, 0, 1), s: '#0000ff' },
    { hc: new HexColor(1, 1, 1), s: '#ffffff' },
  ];

  for (const tc of testCases) {
    // Test scan method
    const gotHC = HexColor.scan(tc.s);
    expect(gotHC.r).toBeCloseTo(tc.hc.r, 5);
    expect(gotHC.g).toBeCloseTo(tc.hc.g, 5);
    expect(gotHC.b).toBeCloseTo(tc.hc.b, 5);

    // Test value method
    const gotValue = tc.hc.value();
    expect(gotValue).toBe(tc.s);

    // Test hex method
    const gotHex = tc.hc.hex();
    expect(gotHex).toBe(tc.s);
  }
});

test('HexColor instance scan method', () => {
  const hc = new HexColor();

  // Test valid hex string
  hc.scan('#ff0000');
  expect(hc.r).toBe(1);
  expect(hc.g).toBe(0);
  expect(hc.b).toBe(0);

  // Test invalid type
  expect(() => hc.scan(123)).toThrow(ErrUnsupportedType);
  expect(() => hc.scan(null)).toThrow(ErrUnsupportedType);
  expect(() => hc.scan({})).toThrow(ErrUnsupportedType);
});

test('HexColor error types', () => {
  const err = new ErrUnsupportedType(123, 'string');
  expect(err.name).toBe('ErrUnsupportedType');
  expect(err.message).toContain('unsupported type');
  expect(err.message).toContain('got number');
  expect(err.message).toContain('want a string');
});

test('HexColor JSON serialization', () => {
  const obj = {
    name: 'John',
    color: new HexColor(1, 0, 1),
  };

  // Test JSON serialization
  const jsonData = JSON.stringify(obj);
  expect(jsonData).toContain('#ff00ff');

  // Test JSON deserialization
  const obj2 = JSON.parse(jsonData);

  // Manually reconstruct HexColor from the parsed data
  const reconstructedHC = HexColor.fromHex(obj2.color);
  expect(reconstructedHC.r).toBe(obj.color.r);
  expect(reconstructedHC.g).toBe(obj.color.g);
  expect(reconstructedHC.b).toBe(obj.color.b);
});

test('HexColor fromJSON and toJSON methods', () => {
  const hc = new HexColor(0.5, 0.8, 0.2);

  // Test toJSON
  const json = hc.toJSON();
  expect(json).toBe(hc.hex());

  // Test fromJSON
  const jsonString = JSON.stringify('#ff00aa');
  const hc2 = HexColor.fromJSON(jsonString);
  expect(hc2.hex()).toBe('#ff00aa');

  // Test fromJSON with instance method
  const hc3 = new HexColor();
  hc3.fromJSON(jsonString);
  expect(hc3.hex()).toBe('#ff00aa');

  // Test invalid JSON
  expect(() => HexColor.fromJSON('invalid json')).toThrow();
});

test('HexColor decode method', () => {
  // Test static decode
  const hc1 = HexColor.decode('#00ffaa');
  expect(hc1.hex()).toBe('#00ffaa');

  // Test instance decode
  const hc2 = new HexColor();
  hc2.decode('#aa00ff');
  expect(hc2.hex()).toBe('#aa00ff');
});

test('HexColor YAML serialization', () => {
  const hc = new HexColor(0.2, 0.6, 0.9);

  // Test toYAML
  const yaml = hc.toYAML();
  expect(yaml).toBe(hc.hex());

  // Test fromYAML static method
  const hc2 = HexColor.fromYAML('#123456');
  expect(hc2.hex()).toBe('#123456');

  // Test fromYAML instance method
  const hc3 = new HexColor();
  hc3.fromYAML('#654321');
  expect(hc3.hex()).toBe('#654321');
});

test('HexColor utility methods', () => {
  const hc = new HexColor(0.3, 0.7, 0.1);

  // Test getColor and setColor
  const color = hc.getColor();
  expect(color.r).toBe(0.3);
  expect(color.g).toBe(0.7);
  expect(color.b).toBe(0.1);

  hc.setColor(color);
  expect(hc.r).toBe(0.3);
  expect(hc.g).toBe(0.7);
  expect(hc.b).toBe(0.1);

  // Test toString
  expect(hc.toString()).toBe(hc.hex());

  // Test fromHex
  const hc2 = HexColor.fromHex('#aabbcc');
  expect(hc2.hex()).toBe('#aabbcc');

  // Test fromColor
  const hc3 = HexColor.fromColor(color);
  expect(hc3.r).toBe(color.r);
  expect(hc3.g).toBe(color.g);
  expect(hc3.b).toBe(color.b);
});

test('HexColor property accessors', () => {
  const hc = new HexColor();

  // Test setters
  hc.R = 0.4;
  hc.G = 0.5;
  hc.B = 0.6;

  expect(hc.r).toBe(0.4);
  expect(hc.g).toBe(0.5);
  expect(hc.b).toBe(0.6);

  // Test getters
  expect(hc.R).toBe(0.4);
  expect(hc.G).toBe(0.5);
  expect(hc.B).toBe(0.6);
});

test('HexColor equality', () => {
  const hc1 = new HexColor(0.5, 0.6, 0.7);
  const hc2 = new HexColor(0.5, 0.6, 0.7);
  const hc3 = new HexColor(0.5, 0.6, 0.8);

  expect(hc1.equals(hc2)).toBe(true);
  expect(hc1.equals(hc3)).toBe(false);
});

test('HexColor edge cases', () => {
  // Test with floating point precision
  const hc = new HexColor(0.333333, 0.666666, 0.999999);
  expect(hc.hex()).toMatch(/^#[0-9a-f]{6}$/);

  // Test with boundary values
  const hcMin = new HexColor(0, 0, 0);
  const hcMax = new HexColor(1, 1, 1);

  expect(hcMin.hex()).toBe('#000000');
  expect(hcMax.hex()).toBe('#ffffff');

  // Test scanning invalid hex should throw
  expect(() => HexColor.scan('not a hex')).toThrow();
  expect(() => HexColor.scan('#gggggg')).toThrow();
  expect(() => HexColor.scan('#12')).toThrow();
});

test('HexColor composite type serialization', () => {
  // Match Go test case exactly
  type CompositeType = {
    name?: string;
    color?: HexColor;
  };

  const obj: CompositeType = {
    name: 'John',
    color: new HexColor(1, 0, 1),
  };

  const jsonData = JSON.stringify(obj);
  expect(jsonData).toContain('"color":"#ff00ff"');
  expect(jsonData).toContain('"name":"John"');

  const obj2: CompositeType = JSON.parse(jsonData);
  expect(obj2.name).toBe('John');
  expect(obj2.color).toBe('#ff00ff');

  // Verify we can reconstruct the HexColor
  if (obj2.color && obj.color) {
    const reconstructed = HexColor.fromHex(obj2.color);
    expect(reconstructed.equals(obj.color)).toBe(true);
  }
});
