/**
 * Tests for solidaria-components Virtualizer
 */
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@solidjs/testing-library';
import { createMemo, type JSX } from 'solid-js';
import {
  Virtualizer,
  type VirtualizerLayout,
  useVirtualizerContext,
} from '../src/Virtualizer';
import { useCollectionRenderer } from '../src/Collection';
import { ListBox, ListBoxOption } from '../src/ListBox';

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
            rendererVirtualized: collection()?.isVirtualized ?? false,
            hasLayoutDelegate: Boolean(collection()?.layoutDelegate),
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
    expect(parsed.rendererVirtualized).toBe(true);
    expect(parsed.hasLayoutDelegate).toBe(true);
    expect(instances).toBeGreaterThan(0);
  });

  it('renders only visible range for listbox when virtualized', () => {
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
});
