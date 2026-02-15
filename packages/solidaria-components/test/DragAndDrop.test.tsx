/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import {
  DragAndDropContext,
  DropIndicator,
  DropIndicatorContext,
  useDndPersistedKeys,
} from '../src/DragAndDrop';

describe('DragAndDrop parity primitives', () => {
  it('DropIndicator marks active drop target', () => {
    render(() => (
      <DragAndDropContext.Provider
        value={{
          dropState: {
            isDropTarget: (target) => target.type === 'item' && target.key === 'a',
          },
        }}
      >
        <DropIndicator target={{ type: 'item', key: 'a', dropPosition: 'before' }} />
      </DragAndDropContext.Provider>
    ));

    const indicator = screen.getByRole('option');
    expect(indicator).toHaveAttribute('data-drop-target');
  });

  it('DropIndicatorContext can override rendering', () => {
    render(() => (
      <DropIndicatorContext.Provider
        value={{
          render: () => <div data-testid="custom-indicator" />,
        }}
      >
        <DropIndicator target={{ type: 'item', key: 'a', dropPosition: 'before' }} />
      </DropIndicatorContext.Provider>
    ));

    expect(screen.getByTestId('custom-indicator')).toBeInTheDocument();
  });

  it('useDndPersistedKeys returns focused and virtual drop-target keys', () => {
    function Probe() {
      const keys = useDndPersistedKeys(
        { focusedKey: 'focused' },
        { isVirtualDragging: () => true },
        { target: { type: 'item', key: 'drop', dropPosition: 'before' } }
      );
      return <output data-testid="persisted-keys">{JSON.stringify(Array.from(keys()).sort())}</output>;
    }

    render(() => <Probe />);
    expect(screen.getByTestId('persisted-keys').textContent).toBe('["drop","focused"]');
  });

  it('useDndPersistedKeys normalizes after-target to next non-descendant item key', () => {
    const collection = {
      getKeyAfter(key: string | number) {
        const order = ['a', 'a-1', 'a-2', 'b'];
        const index = order.indexOf(String(key));
        return index >= 0 && index < order.length - 1 ? order[index + 1] : null;
      },
      getItem(key: string | number) {
        const levels: Record<string, number> = {
          a: 0,
          'a-1': 1,
          'a-2': 1,
          b: 0,
        };
        if (!(String(key) in levels)) return null;
        return { type: 'item', level: levels[String(key)] };
      },
    };

    function Probe() {
      const keys = useDndPersistedKeys(
        { focusedKey: null },
        { isVirtualDragging: () => true },
        { target: { type: 'item', key: 'a', dropPosition: 'after' } },
        collection
      );
      return <output data-testid="normalized-after-key">{JSON.stringify(Array.from(keys()))}</output>;
    }

    render(() => <Probe />);
    expect(screen.getByTestId('normalized-after-key').textContent).toBe('["b"]');
  });
});
