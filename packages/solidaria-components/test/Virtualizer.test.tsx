/**
 * Tests for solidaria-components Virtualizer
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@solidjs/testing-library';
import { createMemo, type JSX } from 'solid-js';
import {
  GridLayout,
  Virtualizer,
  type VirtualizerLayout,
  useVirtualizerContext,
} from '../src/Virtualizer';
import { useCollectionRenderer } from '../src/Collection';
import { ListBox, ListBoxOption } from '../src/ListBox';
import { GridList, GridListItem } from '../src/GridList';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '../src/Table';
import { Tree, TreeItem } from '../src/Tree';

describe('Virtualizer', () => {
  it('renders children in virtualizer container', () => {
    const layout: VirtualizerLayout = {};
    const { container } = render(() => (
      <Virtualizer layout={layout}>
        <ul>
          <li>Item 1</li>
        </ul>
      </Virtualizer>
    ));

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(container.querySelector('[data-virtualizer]')).toBeInTheDocument();
  });

  it('instantiates class layouts and provides context', () => {
    let instances = 0;
    class TestLayout implements VirtualizerLayout<{ b?: number }> {
      useLayoutOptions() {
        instances += 1;
        return { b: 2 };
      }
    }

    function Consumer(): JSX.Element {
      const ctx = createMemo(() => useVirtualizerContext<{ a?: number; b?: number }>());
      const collection = createMemo(() => useCollectionRenderer<unknown>());
      return (
        <output data-testid="ctx">
          {JSON.stringify({
            isVirtualized: ctx()?.isVirtualized ?? false,
            hasLayout: Boolean(ctx()?.layout),
            options: ctx()?.layoutOptions ?? null,
            layoutInfo0: ctx()?.getLayoutInfo(0) ?? null,
            dropTarget0: ctx()?.getDropTargetFromPoint({ x: 2, y: 2 }, 10) ?? null,
            dropTargetEmpty: ctx()?.getDropTargetFromPoint({ x: 2, y: 2 }, 0) ?? null,
            rendererVirtualized: collection()?.isVirtualized ?? false,
            hasLayoutDelegate: Boolean(collection()?.layoutDelegate),
            hasDropTargetDelegate: Boolean(collection()?.dropTargetDelegate),
            delegateTarget:
              collection()?.dropTargetDelegate?.getDropTargetFromPoint(2, 2, () => true) ?? null,
            delegateOperation:
              collection()?.dropTargetDelegate?.getDropOperation(
                { type: 'item', key: 0, dropPosition: 'on' },
                { has: () => true },
                ['copy', 'move']
              ) ?? null,
          })}
        </output>
      );
    }

    render(() => (
      <Virtualizer layout={TestLayout} layoutOptions={{ a: 1 }}>
        <Consumer />
      </Virtualizer>
    ));

    const parsed = JSON.parse(screen.getByTestId('ctx').textContent || '{}');
    expect(parsed.isVirtualized).toBe(true);
    expect(parsed.hasLayout).toBe(true);
    expect(parsed.options).toEqual({ a: 1, b: 2 });
    expect(parsed.layoutInfo0?.index).toBe(0);
    expect(parsed.dropTarget0?.type).toBe('item');
    expect(parsed.dropTarget0?.index).toBe(0);
    expect(parsed.dropTargetEmpty?.type).toBe('root');
    expect(parsed.rendererVirtualized).toBe(true);
    expect(parsed.hasLayoutDelegate).toBe(true);
    expect(parsed.hasDropTargetDelegate).toBe(true);
    expect(parsed.delegateTarget?.type).toBe('root');
    expect(parsed.delegateOperation).toBe('move');
    expect(instances).toBeGreaterThan(0);
  });

  it('renders only visible range for listbox when virtualized', () => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      cb(0);
      return 1;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});

    const items = Array.from({ length: 100 }, (_, i) => ({
      id: `item-${i}`,
      label: `Item ${i}`,
    }));

    render(() => (
      <Virtualizer
        layout={{}}
        layoutOptions={{ itemSize: 20, viewportSize: 60, overscan: 0 }}
        style={{ height: '60px', overflow: 'auto' }}
      >
        <ListBox
          aria-label="Virtualized list"
          items={items}
          getKey={(item) => item.id}
        >
          {(item) => <ListBoxOption id={item.id}>{item.label}</ListBoxOption>}
        </ListBox>
      </Virtualizer>
    ));

    expect(screen.getByText('Item 0')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.queryByText('Item 5')).not.toBeInTheDocument();

    const container = document.querySelector('[data-virtualizer]') as HTMLDivElement;
    container.scrollTop = 80;
    fireEvent.scroll(container);

    expect(screen.getByText('Item 4')).toBeInTheDocument();
    expect(screen.getByText('Item 6')).toBeInTheDocument();
    expect(screen.queryByText('Item 0')).not.toBeInTheDocument();
  });

  it('reuses visible range result when scroll stays within same item window', () => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      cb(0);
      return 1;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});

    const items = Array.from({ length: 20 }, (_, i) => ({
      id: `item-${i}`,
      label: `Item ${i}`,
    }));
    let renderCalls = 0;

    render(() => (
      <Virtualizer
        layout={{}}
        layoutOptions={{ itemSize: 20, viewportSize: 40, overscan: 0 }}
        style={{ height: '40px', overflow: 'auto' }}
      >
        <ListBox aria-label="Stable window list" items={items} getKey={(item) => item.id}>
          {(item) => {
            renderCalls += 1;
            return <ListBoxOption id={item.id}>{item.label}</ListBoxOption>;
          }}
        </ListBox>
      </Virtualizer>
    ));

    const initialRenderCalls = renderCalls;
    const container = document.querySelector('[data-virtualizer]') as HTMLDivElement;
    container.scrollTop = 5;
    fireEvent.scroll(container);

    expect(renderCalls).toBe(initialRenderCalls);
  });

  it('uses custom layout getVisibleRange when provided', () => {
    const calls: Array<{ itemCount: number; scrollOffset: number; viewportSize: number; overscan: number }> = [];
    const layout: VirtualizerLayout = {
      getVisibleRange(ctx) {
        calls.push(ctx);
        return {
          start: 10,
          end: 11,
          offsetTop: 200,
          offsetBottom: 0,
        };
      },
    };
    const items = Array.from({ length: 20 }, (_, i) => ({
      id: `item-${i}`,
      label: `Item ${i}`,
    }));

    render(() => (
      <Virtualizer
        layout={layout}
        layoutOptions={{ viewportSize: 60 }}
        style={{ height: '60px', overflow: 'auto' }}
      >
        <ListBox
          aria-label="Custom layout list"
          items={items}
          getKey={(item) => item.id}
        >
          {(item) => <ListBoxOption id={item.id}>{item.label}</ListBoxOption>}
        </ListBox>
      </Virtualizer>
    ));

    expect(screen.getByText('Item 10')).toBeInTheDocument();
    expect(screen.queryByText('Item 0')).not.toBeInTheDocument();
    expect(calls.length).toBeGreaterThan(0);
  });

  it('grid layout computes range by rows and columns', () => {
    const layout = new GridLayout();
    const range = layout.getVisibleRange(
      { itemCount: 100, scrollOffset: 80, viewportSize: 60, overscan: 0 },
      { rowHeight: 20, columnCount: 4 }
    );
    expect(range.start).toBe(16);
    expect(range.end).toBe(28);
    expect(range.offsetTop).toBe(80);
  });

  it('propagates virtualized drop indicator renderer into listbox flow', () => {
    const items = Array.from({ length: 6 }, (_, i) => ({
      id: `item-${i}`,
      label: `Item ${i}`,
    }));

    render(() => (
      <Virtualizer
        layout={{}}
        layoutOptions={{ itemSize: 20, viewportSize: 40, overscan: 0 }}
        style={{ height: '40px', overflow: 'auto' }}
        renderDropIndicator={(index, position) => (
          <li
            role="presentation"
            data-testid={`drop-${position}-${index}`}
          />
        )}
      >
        <ListBox
          aria-label="DnD virtualized list"
          items={items}
          getKey={(item) => item.id}
        >
          {(item) => <ListBoxOption id={item.id}>{item.label}</ListBoxOption>}
        </ListBox>
      </Virtualizer>
    ));

    expect(screen.getByTestId('drop-before-0')).toBeInTheDocument();
    expect(screen.getByTestId('drop-on-0')).toBeInTheDocument();
    expect(screen.getByTestId('drop-after-1')).toBeInTheDocument();
    expect(screen.queryByTestId('drop-before-4')).not.toBeInTheDocument();
  });

  it('enriches listbox drop targets with item key metadata', () => {
    const items = Array.from({ length: 6 }, (_, i) => ({
      id: `item-${i}`,
      label: `Item ${i}`,
    }));

    function Consumer(): JSX.Element {
      const ctx = createMemo(() => useVirtualizerContext());
      const target = createMemo(() => ctx()?.getDropTargetFromPoint({ x: 1, y: 1 }, items.length) ?? null);
      return <output data-testid="listbox-target">{JSON.stringify(target())}</output>;
    }

    render(() => (
      <Virtualizer
        layout={{}}
        layoutOptions={{ itemSize: 20, viewportSize: 40, overscan: 0 }}
        style={{ height: '40px', overflow: 'auto' }}
      >
        <>
          <ListBox aria-label="Listbox drop metadata" items={items} getKey={(item) => item.id}>
            {(item) => <ListBoxOption id={item.id}>{item.label}</ListBoxOption>}
          </ListBox>
          <Consumer />
        </>
      </Virtualizer>
    ));

    const target = JSON.parse(screen.getByTestId('listbox-target').textContent || '{}');
    expect(target.index).toBe(0);
    expect(target.key).toBe('item-0');
  });

  it('virtualizes GridList item rendering', () => {
    const items = Array.from({ length: 20 }, (_, i) => ({ id: i, name: `Grid ${i}` }));

    render(() => (
      <Virtualizer
        layout={{}}
        layoutOptions={{ itemSize: 20, viewportSize: 40, overscan: 0 }}
        style={{ height: '40px', overflow: 'auto' }}
      >
        <GridList
          items={items}
          getKey={(item) => item.id}
          aria-label="Virtualized grid list"
        >
          {(item) => <GridListItem id={item.id}>{item.name}</GridListItem>}
        </GridList>
      </Virtualizer>
    ));

    expect(screen.getByText('Grid 0')).toBeInTheDocument();
    expect(screen.getByText('Grid 1')).toBeInTheDocument();
    expect(screen.queryByText('Grid 5')).not.toBeInTheDocument();
  });

  it('enriches gridlist drop targets with item key metadata', () => {
    const items = Array.from({ length: 6 }, (_, i) => ({ id: i, name: `Grid ${i}` }));

    function Consumer(): JSX.Element {
      const ctx = createMemo(() => useVirtualizerContext());
      const target = createMemo(() => ctx()?.getDropTargetFromPoint({ x: 1, y: 1 }, items.length) ?? null);
      return <output data-testid="grid-target">{JSON.stringify(target())}</output>;
    }

    render(() => (
      <Virtualizer
        layout={{}}
        layoutOptions={{ itemSize: 20, viewportSize: 40, overscan: 0 }}
        style={{ height: '40px', overflow: 'auto' }}
      >
        <>
          <GridList items={items} getKey={(item) => item.id} aria-label="Grid drop metadata">
            {(item) => <GridListItem id={item.id}>{item.name}</GridListItem>}
          </GridList>
          <Consumer />
        </>
      </Virtualizer>
    ));

    const target = JSON.parse(screen.getByTestId('grid-target').textContent || '{}');
    expect(target.index).toBe(0);
    expect(target.key).toBe(0);
  });

  it('virtualizes Table body rows', () => {
    const columns = [{ key: 'name', name: 'Name' }];
    const items = Array.from({ length: 30 }, (_, i) => ({ id: i, name: `Row ${i}` }));

    render(() => (
      <Virtualizer
        layout={{}}
        layoutOptions={{ itemSize: 20, viewportSize: 40, overscan: 0 }}
        style={{ height: '40px', overflow: 'auto' }}
      >
        <Table
          items={items}
          columns={columns}
          getKey={(item) => item.id}
          aria-label="Virtualized table"
        >
          {() => (
            <>
              <TableHeader>
                <TableColumn id="name">{() => <>Name</>}</TableColumn>
              </TableHeader>
              <TableBody>
                {(item) => (
                  <TableRow id={item.id} item={item}>
                    {() => (
                      <TableCell>{() => <>{item.name}</>}</TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </>
          )}
        </Table>
      </Virtualizer>
    ));

    expect(screen.getByText('Row 0')).toBeInTheDocument();
    expect(screen.getByText('Row 1')).toBeInTheDocument();
    expect(screen.queryByText('Row 6')).not.toBeInTheDocument();
  });

  it('enriches table drop targets with row key metadata', () => {
    const columns = [{ key: 'name', name: 'Name' }];
    const items = Array.from({ length: 6 }, (_, i) => ({ id: i, name: `Row ${i}` }));

    function Consumer(): JSX.Element {
      const ctx = createMemo(() => useVirtualizerContext());
      const target = createMemo(() => ctx()?.getDropTargetFromPoint({ x: 1, y: 1 }, items.length) ?? null);
      return <output data-testid="table-target">{JSON.stringify(target())}</output>;
    }

    render(() => (
      <Virtualizer
        layout={{}}
        layoutOptions={{ itemSize: 20, viewportSize: 40, overscan: 0 }}
        style={{ height: '40px', overflow: 'auto' }}
      >
        <>
          <Table items={items} columns={columns} getKey={(item) => item.id} aria-label="Table drop metadata">
            {() => (
              <>
                <TableHeader>
                  <TableColumn id="name">{() => <>Name</>}</TableColumn>
                </TableHeader>
                <TableBody>
                  {(item) => (
                    <TableRow id={item.id} item={item}>
                      {() => (
                        <TableCell>{() => <>{item.name}</>}</TableCell>
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </>
            )}
          </Table>
          <Consumer />
        </>
      </Virtualizer>
    ));

    const target = JSON.parse(screen.getByTestId('table-target').textContent || '{}');
    expect(target.index).toBe(0);
    expect(target.key).toBe(0);
  });

  it('virtualizes Tree visible rows', () => {
    const items = Array.from({ length: 20 }, (_, i) => ({
      key: `node-${i}`,
      value: { name: `Node ${i}` },
      textValue: `Node ${i}`,
    }));

    render(() => (
      <Virtualizer
        layout={{}}
        layoutOptions={{ itemSize: 20, viewportSize: 40, overscan: 0 }}
        style={{ height: '40px', overflow: 'auto' }}
      >
        <Tree items={items} aria-label="Virtualized tree">
          {(item) => <TreeItem id={item.key}>{item.textValue}</TreeItem>}
        </Tree>
      </Virtualizer>
    ));

    expect(screen.getByText('Node 0')).toBeInTheDocument();
    expect(screen.getByText('Node 1')).toBeInTheDocument();
    expect(screen.queryByText('Node 6')).not.toBeInTheDocument();
  });

  it('enriches tree drop targets with hierarchical metadata', () => {
    const items = [
      {
        key: 'parent',
        value: { name: 'Parent' },
        textValue: 'Parent',
        children: [
          { key: 'child', value: { name: 'Child' }, textValue: 'Child' },
        ],
      },
      { key: 'sibling', value: { name: 'Sibling' }, textValue: 'Sibling' },
    ];

    function Consumer(): JSX.Element {
      const ctx = createMemo(() => useVirtualizerContext());
      const target = createMemo(() => ctx()?.getDropTargetFromPoint({ x: 1, y: 1 }, 3) ?? null);
      return <output data-testid="tree-target">{JSON.stringify(target())}</output>;
    }

    render(() => (
      <Virtualizer
        layout={{}}
        layoutOptions={{ itemSize: 20, viewportSize: 80, overscan: 0 }}
        style={{ height: '80px', overflow: 'auto' }}
      >
        <>
          <Tree items={items} defaultExpandedKeys={['parent']} aria-label="Tree drop metadata">
            {(item) => <TreeItem id={item.key}>{item.textValue}</TreeItem>}
          </Tree>
          <Consumer />
        </>
      </Virtualizer>
    ));

    const target = JSON.parse(screen.getByTestId('tree-target').textContent || '{}');
    expect(target.index).toBe(0);
    expect(target.key).toBe('parent');
    expect(target.parentKey).toBeNull();
    expect(target.level).toBe(0);
  });

  it('renders tree after-drop indicators at branch boundaries only', () => {
    const items = [
      {
        key: 'parent',
        value: { name: 'Parent' },
        textValue: 'Parent',
        children: [
          { key: 'child', value: { name: 'Child' }, textValue: 'Child' },
        ],
      },
      { key: 'sibling', value: { name: 'Sibling' }, textValue: 'Sibling' },
    ];

    render(() => (
      <Virtualizer
        layout={{}}
        layoutOptions={{ itemSize: 20, viewportSize: 80, overscan: 0 }}
        style={{ height: '80px', overflow: 'auto' }}
        renderDropIndicator={(index, position) => (
          <li role="presentation" data-testid={`tree-drop-${position}-${index}`} />
        )}
      >
        <Tree items={items} defaultExpandedKeys={['parent']} aria-label="Tree DnD indicators">
          {(item) => <TreeItem id={item.key}>{item.textValue}</TreeItem>}
        </Tree>
      </Virtualizer>
    ));

    expect(screen.queryByTestId('tree-drop-after-0')).not.toBeInTheDocument();
    expect(screen.getByTestId('tree-drop-after-1')).toBeInTheDocument();
    expect(screen.getByTestId('tree-drop-after-2')).toBeInTheDocument();
  });

  it('skips duplicate tree after-drop indicators for same-level siblings', () => {
    const items = [
      { key: 'a', value: { name: 'A' }, textValue: 'A' },
      { key: 'b', value: { name: 'B' }, textValue: 'B' },
    ];

    render(() => (
      <Virtualizer
        layout={{}}
        layoutOptions={{ itemSize: 20, viewportSize: 80, overscan: 0 }}
        style={{ height: '80px', overflow: 'auto' }}
        renderDropIndicator={(index, position) => (
          <li role="presentation" data-testid={`tree-flat-drop-${position}-${index}`} />
        )}
      >
        <Tree items={items} aria-label="Flat tree indicators">
          {(item) => <TreeItem id={item.key}>{item.textValue}</TreeItem>}
        </Tree>
      </Virtualizer>
    ));

    expect(screen.queryByTestId('tree-flat-drop-after-0')).not.toBeInTheDocument();
    expect(screen.getByTestId('tree-flat-drop-after-1')).toBeInTheDocument();
  });

  it('renders ancestor chain after-drop indicators when closing deep branch', () => {
    const items = [
      {
        key: 'parent',
        value: { name: 'Parent' },
        textValue: 'Parent',
        children: [
          {
            key: 'child',
            value: { name: 'Child' },
            textValue: 'Child',
            children: [
              { key: 'grandchild', value: { name: 'Grandchild' }, textValue: 'Grandchild' },
            ],
          },
        ],
      },
      { key: 'sibling', value: { name: 'Sibling' }, textValue: 'Sibling' },
    ];

    render(() => (
      <Virtualizer
        layout={{}}
        layoutOptions={{ itemSize: 20, viewportSize: 120, overscan: 0 }}
        style={{ height: '120px', overflow: 'auto' }}
        renderDropIndicator={(index, position) => (
          <li role="presentation" data-testid={`tree-deep-drop-${position}-${index}`} />
        )}
      >
        <Tree items={items} defaultExpandedKeys={['parent', 'child']} aria-label="Deep tree indicators">
          {(item) => <TreeItem id={item.key}>{item.textValue}</TreeItem>}
        </Tree>
      </Virtualizer>
    ));

    expect(screen.getByTestId('tree-deep-drop-after-2')).toBeInTheDocument();
    expect(screen.getByTestId('tree-deep-drop-after-1')).toBeInTheDocument();
    expect(screen.queryByTestId('tree-deep-drop-after-0')).not.toBeInTheDocument();
  });
});
