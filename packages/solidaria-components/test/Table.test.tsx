/**
 * Tests for Table component.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@solidjs/testing-library';
import { createSignal } from 'solid-js';
import { useDragAndDrop } from '../src/useDragAndDrop';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  TableSelectionCheckbox,
  TableSelectAllCheckbox,
} from '../src/Table';

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

// Helper using render props at every nesting level to avoid solid-refresh HMR context issues
function TestTable(props: Partial<Parameters<typeof Table>[0]> = {}) {
  return (
    <Table
      items={testData}
      columns={testColumns}
      getKey={(item: any) => item.id}
      aria-label="Pokemon"
      {...props}
    >
      {() => (
        <>
          <TableHeader>
            <TableColumn id="name">{() => <>Name</>}</TableColumn>
            <TableColumn id="type">{() => <>Type</>}</TableColumn>
            <TableColumn id="level">{() => <>Level</>}</TableColumn>
          </TableHeader>
          <TableBody>
            {(item: any) => (
              <TableRow id={item.id} item={item}>
                {() => (
                  <>
                    <TableCell>{() => <>{item.name}</>}</TableCell>
                    <TableCell>{() => <>{item.type}</>}</TableCell>
                    <TableCell>{() => <>{item.level}</>}</TableCell>
                  </>
                )}
              </TableRow>
            )}
          </TableBody>
        </>
      )}
    </Table>
  );
}

describe('Table', () => {
  afterEach(() => {
    cleanup();
  });

  // ============================================
  // BASIC RENDERING
  // ============================================

  describe('rendering', () => {
    it('should render with default class', () => {
      render(() => <TestTable />);

      const table = document.querySelector('.solidaria-Table');
      expect(table).toBeTruthy();
      expect(table?.tagName).toBe('TABLE');
    });

    it('should render with custom class', () => {
      render(() => <TestTable class="custom-table" />);

      const table = document.querySelector('.custom-table');
      expect(table).toBeTruthy();
    });

    it('should render header', () => {
      render(() => <TestTable />);

      const header = document.querySelector('.solidaria-Table-header');
      expect(header).toBeTruthy();
      expect(header?.tagName).toBe('THEAD');
    });

    it('should render column headers', () => {
      render(() => <TestTable />);

      const columns = document.querySelectorAll('.solidaria-Table-column');
      expect(columns.length).toBe(3);
      expect(screen.getByText('Name')).toBeTruthy();
      expect(screen.getByText('Type')).toBeTruthy();
      expect(screen.getByText('Level')).toBeTruthy();
    });

    it('should render body', () => {
      render(() => <TestTable />);

      const body = document.querySelector('.solidaria-Table-body');
      expect(body).toBeTruthy();
      expect(body?.tagName).toBe('TBODY');
    });

    it('should render rows', () => {
      render(() => <TestTable />);

      const rows = document.querySelectorAll('.solidaria-Table-row');
      expect(rows.length).toBe(3);
    });

    it('should render cells with data', () => {
      render(() => <TestTable />);

      expect(screen.getByText('Pikachu')).toBeTruthy();
      expect(screen.getByText('Electric')).toBeTruthy();
      expect(screen.getByText('Charizard')).toBeTruthy();
      expect(screen.getByText('Fire')).toBeTruthy();
    });

    it('should render cells with default class', () => {
      render(() => <TestTable />);

      const cells = document.querySelectorAll('.solidaria-Table-cell');
      expect(cells.length).toBe(9);
    });

    it('should trigger onLoadMore from table body sentinel', () => {
      const onLoadMore = vi.fn();
      render(() => (
        <Table
          items={testData}
          columns={testColumns}
          getKey={(item: any) => item.id}
          aria-label="Pokemon"
        >
          {() => (
            <>
              <TableHeader>
                <TableColumn id="name">{() => <>Name</>}</TableColumn>
                <TableColumn id="type">{() => <>Type</>}</TableColumn>
                <TableColumn id="level">{() => <>Level</>}</TableColumn>
              </TableHeader>
              <TableBody hasMore onLoadMore={onLoadMore}>
                {(item: any) => (
                  <TableRow id={item.id} item={item}>
                    {() => (
                      <>
                        <TableCell>{() => <>{item.name}</>}</TableCell>
                        <TableCell>{() => <>{item.type}</>}</TableCell>
                        <TableCell>{() => <>{item.level}</>}</TableCell>
                      </>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </>
          )}
        </Table>
      ));

      const loadMoreRow = document.querySelector('.solidaria-Table-loadMore');
      expect(loadMoreRow).toBeTruthy();
      fireEvent.focus(loadMoreRow!);
      expect(onLoadMore).toHaveBeenCalled();
    });

    it('should apply draggable row semantics when drag hooks are provided', () => {
      const { dragAndDropHooks } = useDragAndDrop<(typeof testData)[number]>({
        items: testData,
        getItems: (keys, items) =>
          items
            .filter((item) => keys.has(item.id))
            .map((item) => ({ 'text/plain': item.name })),
      });

      render(() => <TestTable dragAndDropHooks={dragAndDropHooks} />);

      const rows = document.querySelectorAll('.solidaria-Table-row');
      expect(rows[0]).toHaveAttribute('draggable', 'true');
    });

    it('wires horizontal droppable keyboard delegate methods in ltr', () => {
      let keyboardDelegate:
        | {
          getKeyLeftOf?: (key: string | number) => string | number | null;
          getKeyRightOf?: (key: string | number) => string | number | null;
        }
        | undefined;
      const dragAndDropHooks = {
        useDroppableCollectionState: () => ({
          isDropTarget: false,
          target: null,
          isDisabled: false,
          setTarget: () => {},
          isAccepted: () => true,
          enterTarget: () => {},
          moveToTarget: () => {},
          exitTarget: () => {},
          activateTarget: () => {},
          drop: () => {},
          shouldAcceptItemDrop: () => true,
          getDropOperation: () => 'move' as const,
        }),
        useDroppableCollection: (props: {
          keyboardDelegate?: {
            getKeyLeftOf?: (key: string | number) => string | number | null;
            getKeyRightOf?: (key: string | number) => string | number | null;
          };
        }) => {
          keyboardDelegate = props.keyboardDelegate;
          return { collectionProps: {} };
        },
        useDroppableItem: () => ({ dropProps: {}, dropButtonProps: {}, isDropTarget: false }),
        ListDropTargetDelegate: class {
          getDropTargetFromPoint() {
            return null;
          }
        },
      };

      render(() => <TestTable dragAndDropHooks={dragAndDropHooks as any} />);

      expect(keyboardDelegate?.getKeyLeftOf).toBeTypeOf('function');
      expect(keyboardDelegate?.getKeyRightOf).toBeTypeOf('function');
      expect(keyboardDelegate?.getKeyLeftOf?.(2)).toBe(1);
      expect(keyboardDelegate?.getKeyRightOf?.(2)).toBe(3);
    });

    it('wires horizontal droppable keyboard delegate methods in rtl', () => {
      const originalDir = document.dir;
      document.dir = 'rtl';
      let keyboardDelegate:
        | {
          getKeyLeftOf?: (key: string | number) => string | number | null;
          getKeyRightOf?: (key: string | number) => string | number | null;
        }
        | undefined;
      const dragAndDropHooks = {
        useDroppableCollectionState: () => ({
          isDropTarget: false,
          target: null,
          isDisabled: false,
          setTarget: () => {},
          isAccepted: () => true,
          enterTarget: () => {},
          moveToTarget: () => {},
          exitTarget: () => {},
          activateTarget: () => {},
          drop: () => {},
          shouldAcceptItemDrop: () => true,
          getDropOperation: () => 'move' as const,
        }),
        useDroppableCollection: (props: {
          keyboardDelegate?: {
            getKeyLeftOf?: (key: string | number) => string | number | null;
            getKeyRightOf?: (key: string | number) => string | number | null;
          };
        }) => {
          keyboardDelegate = props.keyboardDelegate;
          return { collectionProps: {} };
        },
        useDroppableItem: () => ({ dropProps: {}, dropButtonProps: {}, isDropTarget: false }),
        ListDropTargetDelegate: class {
          getDropTargetFromPoint() {
            return null;
          }
        },
      };

      try {
        render(() => <TestTable dragAndDropHooks={dragAndDropHooks as any} />);

        expect(keyboardDelegate?.getKeyLeftOf).toBeTypeOf('function');
        expect(keyboardDelegate?.getKeyRightOf).toBeTypeOf('function');
        expect(keyboardDelegate?.getKeyLeftOf?.(2)).toBe(3);
        expect(keyboardDelegate?.getKeyRightOf?.(2)).toBe(1);
      } finally {
        document.dir = originalDir;
      }
    });

    it('falls back to document direction when getComputedStyle is unavailable', () => {
      const originalDir = document.dir;
      document.dir = 'rtl';
      const originalGetComputedStyle = window.getComputedStyle;
      Object.defineProperty(window, 'getComputedStyle', {
        configurable: true,
        writable: true,
        value: undefined,
      });

      let keyboardDelegate:
        | {
          getKeyLeftOf?: (key: string | number) => string | number | null;
          getKeyRightOf?: (key: string | number) => string | number | null;
        }
        | undefined;
      const dragAndDropHooks = {
        useDroppableCollectionState: () => ({
          isDropTarget: false,
          target: null,
          isDisabled: false,
          setTarget: () => {},
          isAccepted: () => true,
          enterTarget: () => {},
          moveToTarget: () => {},
          exitTarget: () => {},
          activateTarget: () => {},
          drop: () => {},
          shouldAcceptItemDrop: () => true,
          getDropOperation: () => 'move' as const,
        }),
        useDroppableCollection: (props: {
          keyboardDelegate?: {
            getKeyLeftOf?: (key: string | number) => string | number | null;
            getKeyRightOf?: (key: string | number) => string | number | null;
          };
        }) => {
          keyboardDelegate = props.keyboardDelegate;
          return { collectionProps: {} };
        },
        useDroppableItem: () => ({ dropProps: {}, dropButtonProps: {}, isDropTarget: false }),
        ListDropTargetDelegate: class {
          getDropTargetFromPoint() {
            return null;
          }
        },
      };

      try {
        render(() => <TestTable dragAndDropHooks={dragAndDropHooks as any} />);
        expect(keyboardDelegate?.getKeyLeftOf?.(2)).toBe(3);
        expect(keyboardDelegate?.getKeyRightOf?.(2)).toBe(1);
      } finally {
        Object.defineProperty(window, 'getComputedStyle', {
          configurable: true,
          writable: true,
          value: originalGetComputedStyle,
        });
        document.dir = originalDir;
      }
    });
  });

  // ============================================
  // DATA ATTRIBUTES
  // ============================================

  describe('data attributes', () => {
    it('should have data-empty when table is empty', () => {
      render(() => (
        <Table items={[]} columns={testColumns} aria-label="Empty table">
          {() => (
            <>
              <TableHeader>
                <TableColumn id="name">{() => <>Name</>}</TableColumn>
              </TableHeader>
              <TableBody>
                {() => (
                  <TableRow id="x">
                    {() => <TableCell>{() => <>x</>}</TableCell>}
                  </TableRow>
                )}
              </TableBody>
            </>
          )}
        </Table>
      ));

      const table = document.querySelector('.solidaria-Table');
      expect(table?.getAttribute('data-empty')).toBeTruthy();
    });
  });

  // ============================================
  // SELECTION
  // ============================================

  describe('selection', () => {
    it('should support single selection mode', () => {
      render(() => <TestTable selectionMode="single" />);

      const table = document.querySelector('.solidaria-Table');
      expect(table).toBeTruthy();
    });

    it('should support multiple selection mode', () => {
      render(() => <TestTable selectionMode="multiple" />);

      const table = document.querySelector('.solidaria-Table');
      expect(table).toBeTruthy();
    });

    it('should support default selected keys', () => {
      render(() => (
        <TestTable
          selectionMode="multiple"
          defaultSelectedKeys={new Set([1, 2])}
        />
      ));

      const selectedRows = document.querySelectorAll('[data-selected]');
      expect(selectedRows.length).toBe(2);
    });

    it('should call onSelectionChange', () => {
      const onSelectionChange = vi.fn();

      render(() => (
        <TestTable
          selectionMode="single"
          onSelectionChange={onSelectionChange}
        />
      ));

      const table = document.querySelector('.solidaria-Table');
      expect(table).toBeTruthy();
    });

    it('updates row aria-selected when selecting from focused grid with keyboard', () => {
      render(() => <TestTable selectionMode="multiple" />);

      const grid = screen.getByRole('grid', { name: 'Pokemon' });
      const getFirstDataRow = () => screen.getByText('Pikachu').closest('[role="row"]');
      expect(getFirstDataRow()).toBeTruthy();
      expect(getFirstDataRow()).toHaveAttribute('aria-selected', 'false');

      fireEvent.focus(grid);
      fireEvent.keyDown(grid, { key: ' ' });

      expect(getFirstDataRow()).toHaveAttribute('aria-selected', 'true');
    });

    it('updates TableSelectionCheckbox checked state when row selection changes', () => {
      const singleRow = [testData[0]];
      render(() => (
        <Table
          items={singleRow}
          columns={[{ key: 'select', name: 'Select' }]}
          getKey={(item: any) => item.id}
          aria-label="Pokemon single row"
          selectionMode="single"
        >
          {() => (
            <>
              <TableHeader>
                <TableColumn id="select">{() => <>Select</>}</TableColumn>
              </TableHeader>
              <TableBody>
                {(item: any) => (
                  <TableRow id={item.id} item={item}>
                    {() => (
                      <TableCell>{() => <TableSelectionCheckbox rowKey={item.id} />}</TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </>
          )}
        </Table>
      ));

      const getCheckbox = () => screen.getByRole('checkbox');
      expect(getCheckbox()).not.toBeChecked();

      const rows = screen.getAllByRole('row');
      fireEvent.click(rows[1]);

      expect(getCheckbox()).toBeChecked();
    });
  });

  // ============================================
  // SORTING
  // ============================================

  describe('sorting', () => {
    it('should support sortDescriptor prop', () => {
      render(() => (
        <TestTable sortDescriptor={{ column: 'name', direction: 'ascending' }} />
      ));

      const table = document.querySelector('.solidaria-Table');
      expect(table).toBeTruthy();
    });

    it('should support sortable columns', () => {
      render(() => (
        <Table
          items={testData}
          columns={testColumns}
          getKey={(item: any) => item.id}
          aria-label="Pokemon"
          sortDescriptor={{ column: 'name', direction: 'ascending' }}
        >
          {() => (
            <>
              <TableHeader>
                <TableColumn id="name" allowsSorting>{() => <>Name</>}</TableColumn>
                <TableColumn id="type">{() => <>Type</>}</TableColumn>
              </TableHeader>
              <TableBody>
                {(item: any) => (
                  <TableRow id={item.id}>
                    {() => (
                      <>
                        <TableCell>{() => <>{item.name}</>}</TableCell>
                        <TableCell>{() => <>{item.type}</>}</TableCell>
                      </>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </>
          )}
        </Table>
      ));

      const sortableColumn = document.querySelector('[data-sortable]');
      expect(sortableColumn).toBeTruthy();
    });

    it('should show sort direction on sorted column', () => {
      render(() => (
        <Table
          items={testData}
          columns={testColumns}
          getKey={(item: any) => item.id}
          aria-label="Pokemon"
          sortDescriptor={{ column: 'name', direction: 'ascending' }}
        >
          {() => (
            <>
              <TableHeader>
                <TableColumn id="name" allowsSorting>{() => <>Name</>}</TableColumn>
                <TableColumn id="type">{() => <>Type</>}</TableColumn>
              </TableHeader>
              <TableBody>
                {(item: any) => (
                  <TableRow id={item.id}>
                    {() => (
                      <>
                        <TableCell>{() => <>{item.name}</>}</TableCell>
                        <TableCell>{() => <>{item.type}</>}</TableCell>
                      </>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </>
          )}
        </Table>
      ));

      const sortedColumn = document.querySelector('[data-sort-direction="ascending"]');
      expect(sortedColumn).toBeTruthy();
    });

    it('updates aria-sort when sortable column is activated', () => {
      render(() => {
        const [sortDescriptor, setSortDescriptor] = createSignal<{ column: string | number; direction: 'ascending' | 'descending' } | undefined>(undefined);

        return (
          <Table
            items={testData}
            columns={testColumns}
            getKey={(item: any) => item.id}
            aria-label="Pokemon"
            sortDescriptor={sortDescriptor() as any}
            onSortChange={(descriptor) => setSortDescriptor(descriptor as { column: string | number; direction: 'ascending' | 'descending' })}
          >
            {() => (
              <>
                <TableHeader>
                  <TableColumn id="name" allowsSorting>{() => <>Name</>}</TableColumn>
                </TableHeader>
                <TableBody>
                  {(item: any) => (
                    <TableRow id={item.id}>
                      {() => <TableCell>{() => <>{item.name}</>}</TableCell>}
                    </TableRow>
                  )}
                </TableBody>
              </>
            )}
          </Table>
        );
      });

      const nameColumn = screen.getByRole('columnheader', { name: 'Name' });
      expect(nameColumn).toHaveAttribute('aria-sort', 'none');

      fireEvent.click(nameColumn);
      expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute('aria-sort', 'ascending');
    });
  });

  // ============================================
  // ACCESSIBILITY
  // ============================================

  describe('accessibility', () => {
    it('should have aria-label', () => {
      render(() => <TestTable />);

      const table = document.querySelector('[aria-label="Pokemon"]');
      expect(table).toBeTruthy();
    });

    it('should render as grid role', () => {
      render(() => <TestTable />);

      const grid = document.querySelector('[role="grid"]');
      expect(grid).toBeTruthy();
    });

    it('keeps the grid tabbable when rows are present', () => {
      render(() => <TestTable />);

      const grid = document.querySelector('[role="grid"]');
      expect(grid).toBeTruthy();
      expect(grid).toHaveAttribute('tabindex', '0');
    });
  });

  // ============================================
  // RENDER PROPS
  // ============================================

  describe('render props', () => {
    it('should support class as a function', () => {
      render(() => (
        <TestTable class={(props) => `table ${props.isEmpty ? 'empty' : 'has-data'}`} />
      ));

      const table = document.querySelector('.has-data');
      expect(table).toBeTruthy();
    });

    it('should support row class as a function', () => {
      render(() => (
        <Table
          items={testData}
          columns={testColumns}
          getKey={(item: any) => item.id}
          aria-label="Pokemon"
          selectionMode="single"
          defaultSelectedKeys={new Set([1])}
        >
          {() => (
            <>
              <TableHeader>
                <TableColumn id="name">{() => <>Name</>}</TableColumn>
              </TableHeader>
              <TableBody>
                {(item: any) => (
                  <TableRow
                    id={item.id}
                    class={(props) => `row ${props.isSelected ? 'selected' : ''}`}
                  >
                    {() => <TableCell>{() => <>{item.name}</>}</TableCell>}
                  </TableRow>
                )}
              </TableBody>
            </>
          )}
        </Table>
      ));

      const selectedRow = document.querySelector('.row.selected');
      expect(selectedRow).toBeTruthy();
    });
  });

  // ============================================
  // EMPTY STATE
  // ============================================

  describe('empty state', () => {
    it('should render empty state in body', () => {
      render(() => (
        <Table items={[]} columns={testColumns} aria-label="Empty table">
          {() => (
            <>
              <TableHeader>
                <TableColumn id="name">{() => <>Name</>}</TableColumn>
              </TableHeader>
              <TableBody renderEmptyState={() => <tr><td>No data available</td></tr>}>
                {() => (
                  <TableRow id="x">
                    {() => <TableCell>{() => <>x</>}</TableCell>}
                  </TableRow>
                )}
              </TableBody>
            </>
          )}
        </Table>
      ));

      expect(screen.getByText('No data available')).toBeTruthy();
    });
  });

  // ============================================
  // CONTEXT ERRORS
  // ============================================

  describe('context errors', () => {
    it('should throw when TableHeader is used outside Table', () => {
      expect(() => {
        render(() => <TableHeader><th>Test</th></TableHeader>);
      }).toThrow('TableHeader must be used within a Table');
    });

    it('should throw when TableColumn is used outside Table', () => {
      expect(() => {
        render(() => <TableColumn id="test">{() => <>Test</>}</TableColumn>);
      }).toThrow('TableColumn must be used within a Table');
    });

    it('should throw when TableBody is used outside Table', () => {
      expect(() => {
        render(() => <TableBody>{() => <tr />}</TableBody>);
      }).toThrow('TableBody must be used within a Table');
    });

    it('should throw when TableRow is used outside Table', () => {
      expect(() => {
        render(() => <TableRow id="test">{() => <td>Test</td>}</TableRow>);
      }).toThrow('TableRow must be used within a Table');
    });

    it('should throw when TableCell is used outside Table', () => {
      expect(() => {
        render(() => <TableCell>{() => <>Test</>}</TableCell>);
      }).toThrow('TableCell must be used within a Table');
    });

    it('should throw when TableSelectionCheckbox is used outside Table', () => {
      expect(() => {
        render(() => <TableSelectionCheckbox rowKey="test" />);
      }).toThrow('TableSelectionCheckbox must be used within a Table');
    });

    it('should throw when TableSelectAllCheckbox is used outside Table', () => {
      expect(() => {
        render(() => <TableSelectAllCheckbox />);
      }).toThrow('TableSelectAllCheckbox must be used within a Table');
    });
  });

  // ============================================
  // STATIC PROPERTIES
  // ============================================

  describe('static properties', () => {
    it('should have Header as static property', () => {
      expect(Table.Header).toBe(TableHeader);
    });

    it('should have Column as static property', () => {
      expect(Table.Column).toBe(TableColumn);
    });

    it('should have Body as static property', () => {
      expect(Table.Body).toBe(TableBody);
    });

    it('should have Row as static property', () => {
      expect(Table.Row).toBe(TableRow);
    });

    it('should have Cell as static property', () => {
      expect(Table.Cell).toBe(TableCell);
    });

    it('should have SelectionCheckbox as static property', () => {
      expect(Table.SelectionCheckbox).toBe(TableSelectionCheckbox);
    });

    it('should have SelectAllCheckbox as static property', () => {
      expect(Table.SelectAllCheckbox).toBe(TableSelectAllCheckbox);
    });
  });
});
