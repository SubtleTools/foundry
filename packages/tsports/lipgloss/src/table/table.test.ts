/**
 * THIS FILE MUST BE STRUCTURALLY IDENTICAL TO ITS GO COUNTERPART
 * BUT WRITTEN IN IDIOMATIC TYPESCRIPT CODE STYLE
 */
/**
 * Table component tests
 *
 * This test suite verifies the functionality of the Table component,
 * including data management, styling, borders, and layout.
 */

import { describe, expect, test } from 'bun:test';
import { Borders } from '../borders';
import { Style } from '../style';
import { HorizontalAlignment } from '../types';
import { HeaderRow, newStringData, newTable, StringData, Table } from './index';

describe('Table', () => {
  describe('Basic functionality', () => {
    test('should create empty table', () => {
      const table = newTable();
      expect(table.render()).toBe('');
    });

    test('should create table with headers only', () => {
      const table = newTable().setHeaders('Name', 'Age', 'Location');

      const result = table.render();
      expect(result).toContain('Name');
      expect(result).toContain('Age');
      expect(result).toContain('Location');
    });

    test('should create table with data only', () => {
      const table = newTable().row('Alice', '25', 'New York').row('Bob', '30', 'London');

      const result = table.render();
      expect(result).toContain('Alice');
      expect(result).toContain('Bob');
    });

    test('should create table with headers and data', () => {
      const table = newTable()
        .setHeaders('Name', 'Age', 'Location')
        .row('Alice', '25', 'New York')
        .row('Bob', '30', 'London');

      const result = table.render();
      expect(result).toContain('Name');
      expect(result).toContain('Alice');
      expect(result).toContain('Bob');
    });
  });

  describe('Data management', () => {
    test('should handle StringData', () => {
      const data = newStringData([
        ['Alice', '25', 'New York'],
        ['Bob', '30', 'London'],
      ]);

      const table = newTable().setHeaders('Name', 'Age', 'Location').setData(data);

      const result = table.render();
      expect(result).toContain('Alice');
      expect(result).toContain('Bob');
    });

    test('should provide access to table data via getData()', () => {
      const data = newStringData([
        ['Alice', '25', 'New York'],
        ['Bob', '30', 'London'],
      ]);

      const table = newTable().setHeaders('Name', 'Age', 'Location').setData(data);

      const retrievedData = table.getData();
      expect(retrievedData.at(0, 0)).toBe('Alice');
      expect(retrievedData.at(1, 1)).toBe('30');
      expect(retrievedData.rows()).toBe(2);
      expect(retrievedData.columns()).toBe(3);
    });

    test('should clear rows', () => {
      const table = newTable()
        .row('Alice', '25', 'New York')
        .row('Bob', '30', 'London')
        .clearRows();

      const result = table.render();
      expect(result).toBe('');
    });

    test('should append multiple rows at once', () => {
      const table = newTable().setHeaders('Name', 'Age').rows(['Alice', '25'], ['Bob', '30']);

      const result = table.render();
      expect(result).toContain('Alice');
      expect(result).toContain('Bob');
    });
  });

  describe('Styling', () => {
    test('should apply custom style function', () => {
      const headerStyle = new Style().color('#ff0000').bold(true);
      const cellStyle = new Style().padding(1, 1);

      const table = newTable()
        .setHeaders('Name', 'Age')
        .row('Alice', '25')
        .setStyleFunc((row, col) => {
          if (row === HeaderRow) {
            return headerStyle;
          }
          return cellStyle;
        });

      const result = table.render();
      // Should contain styled content
      expect(result.length).toBeGreaterThan(0);
    });

    test('should handle alignment in style function', () => {
      const table = newTable()
        .setHeaders('Name', 'Age')
        .row('Alice', '25')
        .setStyleFunc((row, col) => {
          if (col === 1) {
            // Age column
            return new Style().align(HorizontalAlignment.Center);
          }
          return new Style();
        });

      const result = table.render();
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('Borders', () => {
    test('should render with default borders', () => {
      const table = newTable().setHeaders('Name', 'Age').row('Alice', '25');

      const result = table.render();
      // Should contain border characters
      expect(result).toContain('─'); // horizontal border
      expect(result).toContain('│'); // vertical border
    });

    test('should render with different border styles', () => {
      const table = newTable()
        .setBorder(Borders.Thick)
        .setHeaders('Name', 'Age')
        .row('Alice', '25');

      const result = table.render();
      expect(result.length).toBeGreaterThan(0);
    });

    test('should handle border configuration', () => {
      const table = newTable()
        .setHeaders('Name', 'Age')
        .row('Alice', '25')
        .setBorderTop(false)
        .setBorderBottom(false);

      const result = table.render();
      expect(result.length).toBeGreaterThan(0);
    });

    test('should handle no borders', () => {
      const table = newTable()
        .setHeaders('Name', 'Age')
        .row('Alice', '25')
        .setBorderTop(false)
        .setBorderBottom(false)
        .setBorderLeft(false)
        .setBorderRight(false)
        .setBorderHeader(false)
        .setBorderColumn(false);

      const result = table.render();
      expect(result).toContain('Name');
      expect(result).toContain('Alice');
    });
  });

  describe('Sizing', () => {
    test('should respect manual width', () => {
      const table = newTable()
        .setHeaders('Name', 'Age', 'Location')
        .row('Alice', '25', 'New York')
        .setWidth(30);

      const result = table.render();
      const lines = result.split('\n').filter((line) => line.length > 0);
      // Check that table respects width constraints
      expect(lines.some((line) => line.length <= 35)).toBe(true); // Allow some margin for borders
    });

    test('should handle height constraints', () => {
      const table = newTable()
        .setHeaders('Name', 'Age')
        .row('Alice', '25')
        .row('Bob', '30')
        .row('Charlie', '35')
        .setHeight(5);

      const result = table.render();
      const lines = result.split('\n');
      expect(lines.length).toBeLessThanOrEqual(6); // Height + newlines
    });

    test('should handle offset for scrolling', () => {
      const table = newTable()
        .setHeaders('Name', 'Age')
        .row('Alice', '25')
        .row('Bob', '30')
        .row('Charlie', '35')
        .setOffset(1);

      const result = table.render();
      expect(result).not.toContain('Alice'); // First row should be skipped
      expect(result).toContain('Bob');
    });
  });

  describe('Content wrapping', () => {
    test('should wrap long content when enabled', () => {
      const table = newTable()
        .setHeaders('Description')
        .row('This is a very long description that should wrap to multiple lines')
        .setWidth(20)
        .setWrap(true);

      const result = table.render();
      expect(result.length).toBeGreaterThan(0);
    });

    test('should truncate content when wrapping disabled', () => {
      const table = newTable()
        .setHeaders('Description')
        .row('This is a very long description that should be truncated')
        .setWidth(20)
        .setWrap(false);

      const result = table.render();
      expect(result).toContain('…'); // Should contain ellipsis
    });
  });

  describe('Edge cases', () => {
    test('should handle empty cells', () => {
      const table = newTable()
        .setHeaders('Name', 'Age', 'Location')
        .row('Alice', '', 'New York')
        .row('', '30', '');

      const result = table.render();
      expect(result).toContain('Alice');
      expect(result).toContain('New York');
    });

    test('should handle uneven row lengths', () => {
      const table = newTable()
        .setHeaders('Name', 'Age', 'Location')
        .row('Alice', '25') // Missing location
        .row('Bob', '30', 'London', 'Extra'); // Extra column

      const result = table.render();
      expect(result).toContain('Alice');
      expect(result).toContain('Bob');
    });

    test('should handle unicode content', () => {
      const table = newTable()
        .setHeaders('Language', 'Greeting')
        .row('Japanese', 'こんにちは')
        .row('Chinese', '你好')
        .row('Arabic', 'مرحبا');

      const result = table.render();
      expect(result).toContain('こんにちは');
      expect(result).toContain('你好');
      expect(result).toContain('مرحبا');
    });
  });
});

describe('StringData', () => {
  test('should create empty data', () => {
    const data = newStringData();
    expect(data.rows()).toBe(0);
    expect(data.columns()).toBe(0);
  });

  test('should create data with initial rows', () => {
    const data = newStringData([
      ['A', 'B', 'C'],
      ['1', '2', '3'],
    ]);

    expect(data.rows()).toBe(2);
    expect(data.columns()).toBe(3);
    expect(data.at(0, 0)).toBe('A');
    expect(data.at(1, 2)).toBe('3');
  });

  test('should append rows', () => {
    const data = newStringData();
    data.append(['A', 'B']);
    data.append(['1', '2', '3']); // Different length

    expect(data.rows()).toBe(2);
    expect(data.columns()).toBe(3); // Should be max length
    expect(data.at(1, 2)).toBe('3');
    expect(data.at(0, 2)).toBe(''); // Empty cell
  });

  test('should handle out of bounds access', () => {
    const data = newStringData([['A', 'B']]);

    expect(data.at(10, 10)).toBe(''); // Out of bounds
    expect(data.at(0, 10)).toBe(''); // Column out of bounds
    expect(data.at(10, 0)).toBe(''); // Row out of bounds
  });

  test('should convert to matrix', () => {
    const data = newStringData([
      ['A', 'B'],
      ['1', '2', '3'],
    ]);

    const matrix = data.toMatrix();
    expect(matrix).toEqual([
      ['A', 'B'],
      ['1', '2', '3'],
    ]);
  });
});
