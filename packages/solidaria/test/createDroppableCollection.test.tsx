import { describe, it, expect } from 'vitest';
import { render, fireEvent, screen, cleanup } from '@solidjs/testing-library';
import { afterEach } from 'vitest';
import { createDroppableCollection } from '../src/dnd/createDroppableCollection';
import type { DropTarget, DroppableCollectionState } from '@proyecto-viviana/solid-stately';

afterEach(() => {
  cleanup();
});

describe('createDroppableCollection keyboard behavior', () => {
  it('navigates targets with arrow keys and supports enter/escape', () => {
    const calls: string[] = [];
    let currentTarget: DropTarget | null = { type: 'root' };
    const state = {
      get target() {
        return currentTarget;
      },
      get isDropTarget() {
        return currentTarget != null;
      },
      get isDisabled() {
        return false;
      },
      setTarget(target: DropTarget | null) {
        currentTarget = target;
        calls.push(`set:${target?.type ?? 'null'}`);
      },
      activateTarget() {
        calls.push('activate');
      },
      exitTarget() {
        currentTarget = null;
        calls.push('exit');
      },
      getDropOperation() {
        return 'move' as const;
      },
      enterTarget() {},
      moveToTarget() {},
      drop() {},
      isAccepted() {
        return true;
      },
      shouldAcceptItemDrop() {
        return true;
      },
    } satisfies Partial<DroppableCollectionState> as DroppableCollectionState;

    function TestComponent() {
      const { collectionProps } = createDroppableCollection(
        () => ({
          ref: () => document.getElementById('drop-root') as HTMLElement | null,
          dropTargetDelegate: {
            getDropTargetFromPoint() {
              return null;
            },
            getKeyboardNavigationTarget(target, direction) {
              if (direction === 'next') {
                return { type: 'item', key: 1, dropPosition: 'on' };
              }
              if (target?.type === 'item') {
                return { type: 'root' };
              }
              return null;
            },
          },
        }),
        state
      );

      return <div id="drop-root" tabIndex={0} data-testid="drop-root" {...collectionProps} />;
    }

    render(() => <TestComponent />);
    const root = screen.getByTestId('drop-root');

    fireEvent.keyDown(root, { key: 'ArrowDown' });
    expect(calls.at(-1)).toBe('set:item');

    fireEvent.keyDown(root, { key: 'ArrowUp' });
    expect(calls.at(-1)).toBe('set:root');

    fireEvent.keyDown(root, { key: 'Enter' });
    expect(calls.at(-1)).toBe('activate');

    fireEvent.keyDown(root, { key: 'Escape' });
    expect(calls.at(-1)).toBe('exit');
  });
});
