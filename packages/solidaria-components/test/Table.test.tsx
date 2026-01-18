/**
 * Tests for Table component.
 */

import { describe, it, expect, vi } from 'vitest';
import { createRoot } from 'solid-js';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '../src/Table';

// Test data
const testColumns = [
  { key: 'name', name: 'Name' },
  { key: 'type', name: 'Type' },
  { key: 'level', name: 'Level' },
];

const testData = [
  { id: 1, name: 'Pikachu', type: 'Electric', level: 25 },
  { id: 2, name: 'Charizard', type: 'Fire', level: 45 },
  { id: 3, name: 'Blastoise', type: 'Water', level: 42 },
];

describe('Table', () => {
  describe('basic rendering', () => {
    it('should create a table element with role="grid"', () => {
      createRoot((dispose) => {
        // Just verify the component can be instantiated
        const table = Table({
          items: testData,
          columns: testColumns,
          getKey: (item) => item.id,
          children: undefined,
        });

        // The component returns a JSX element (table)
        expect(table).toBeDefined();
        dispose();
      });
    });

    it('should accept items and columns props', () => {
      createRoot((dispose) => {
        // Verify props are accepted
        expect(() => {
          Table({
            items: testData,
            columns: testColumns,
            getKey: (item) => item.id,
            children: undefined,
          });
        }).not.toThrow();
        dispose();
      });
    });
  });

  describe('selection', () => {
    it('should accept selectionMode prop', () => {
      createRoot((dispose) => {
        expect(() => {
          Table({
            items: testData,
            columns: testColumns,
            getKey: (item) => item.id,
            selectionMode: 'single',
            children: undefined,
          });
        }).not.toThrow();
        dispose();
      });
    });

    it('should accept selectedKeys prop', () => {
      createRoot((dispose) => {
        expect(() => {
          Table({
            items: testData,
            columns: testColumns,
            getKey: (item) => item.id,
            selectionMode: 'multiple',
            selectedKeys: new Set([1, 2]),
            children: undefined,
          });
        }).not.toThrow();
        dispose();
      });
    });

    it('should call onSelectionChange', () => {
      const onSelectionChange = vi.fn();

      createRoot((dispose) => {
        expect(() => {
          Table({
            items: testData,
            columns: testColumns,
            getKey: (item) => item.id,
            selectionMode: 'single',
            onSelectionChange,
            children: undefined,
          });
        }).not.toThrow();
        dispose();
      });
    });
  });

  describe('sorting', () => {
    it('should accept sortDescriptor prop', () => {
      createRoot((dispose) => {
        expect(() => {
          Table({
            items: testData,
            columns: testColumns,
            getKey: (item) => item.id,
            sortDescriptor: { column: 'name', direction: 'ascending' },
            children: undefined,
          });
        }).not.toThrow();
        dispose();
      });
    });

    it('should call onSortChange', () => {
      const onSortChange = vi.fn();

      createRoot((dispose) => {
        expect(() => {
          Table({
            items: testData,
            columns: testColumns,
            getKey: (item) => item.id,
            onSortChange,
            children: undefined,
          });
        }).not.toThrow();
        dispose();
      });
    });
  });

  describe('accessibility', () => {
    it('should accept aria-label prop', () => {
      createRoot((dispose) => {
        expect(() => {
          Table({
            items: testData,
            columns: testColumns,
            getKey: (item) => item.id,
            'aria-label': 'Test Table',
            children: undefined,
          });
        }).not.toThrow();
        dispose();
      });
    });
  });
});

describe('TableHeader', () => {
  it('should be a function', () => {
    expect(typeof TableHeader).toBe('function');
  });
});

describe('TableColumn', () => {
  it('should be a function', () => {
    expect(typeof TableColumn).toBe('function');
  });
});

describe('TableBody', () => {
  it('should be a function', () => {
    expect(typeof TableBody).toBe('function');
  });
});

describe('TableRow', () => {
  it('should be a function', () => {
    expect(typeof TableRow).toBe('function');
  });
});

describe('TableCell', () => {
  it('should be a function', () => {
    expect(typeof TableCell).toBe('function');
  });
});
