import { describe, it, expect } from 'vitest';
import { render, fireEvent, screen, cleanup } from '@solidjs/testing-library';
import { afterEach } from 'vitest';
import { createDroppableCollection } from '../src/dnd/createDroppableCollection';
import { setGlobalDraggingCollectionRef, setGlobalDraggingKeys } from '../src/dnd/createDraggableCollection';
import type { DropTarget, DroppableCollectionState } from '@proyecto-viviana/solid-stately';

afterEach(() => {
  setGlobalDraggingCollectionRef(null);
  setGlobalDraggingKeys(new Set());
  cleanup();
});

describe('createDroppableCollection keyboard behavior', () => {
  it('navigates targets with arrows/home/end and supports enter/escape', () => {
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
        if (target?.type === 'item') {
          calls.push(`set:item:${String(target.key)}`);
          return;
        }
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
            getKeyboardPageNavigationTarget(_target, direction) {
              if (direction === 'next') {
                return { type: 'item', key: 7, dropPosition: 'on' };
              }
              return { type: 'item', key: 3, dropPosition: 'on' };
            },
            getKeyboardNavigationTarget(target, direction) {
              if (target?.type === 'root' && direction === 'next') {
                return { type: 'item', key: 1, dropPosition: 'on' };
              }
              if (target?.type === 'root' && direction === 'previous') {
                return { type: 'item', key: 9, dropPosition: 'on' };
              }
              if (target?.type === 'item' && direction === 'previous') {
                return { type: 'root' };
              }
              if (target?.type === 'item' && direction === 'next') {
                return { type: 'item', key: 2, dropPosition: 'on' };
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
    expect(calls.at(-1)).toBe('set:item:1');

    fireEvent.keyDown(root, { key: 'ArrowUp' });
    expect(calls.at(-1)).toBe('set:root');

    fireEvent.keyDown(root, { key: 'ArrowRight' });
    expect(calls.at(-1)).toBe('set:item:1');

    fireEvent.keyDown(root, { key: 'ArrowLeft' });
    expect(calls.at(-1)).toBe('set:root');

    fireEvent.keyDown(root, { key: 'Home' });
    expect(calls.at(-1)).toBe('set:item:1');

    fireEvent.keyDown(root, { key: 'End' });
    expect(calls.at(-1)).toBe('set:item:9');

    fireEvent.keyDown(root, { key: 'PageDown' });
    expect(calls.at(-1)).toBe('set:item:7');

    fireEvent.keyDown(root, { key: 'PageUp' });
    expect(calls.at(-1)).toBe('set:item:3');

    fireEvent.keyDown(root, { key: 'Enter' });
    expect(calls.at(-1)).toBe('activate');

    fireEvent.keyDown(root, { key: 'Escape' });
    expect(calls.at(-1)).toBe('exit');
  });

  it('falls back to keyboard navigation delegate for page keys', () => {
    const calls: string[] = [];
    let currentTarget: DropTarget | null = { type: 'item', key: 1, dropPosition: 'on' };
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
        if (target?.type === 'item') {
          calls.push(`set:item:${String(target.key)}`);
        }
      },
      activateTarget() {},
      exitTarget() {},
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
          ref: () => document.getElementById('drop-root-fallback') as HTMLElement | null,
          dropTargetDelegate: {
            getDropTargetFromPoint() {
              return null;
            },
            getKeyboardNavigationTarget(target, direction) {
              if (target?.type !== 'item') return null;
              if (direction === 'next') {
                return { type: 'item', key: Number(target.key) + 1, dropPosition: 'on' };
              }
              return { type: 'item', key: Number(target.key) - 1, dropPosition: 'on' };
            },
          },
        }),
        state
      );

      return <div id="drop-root-fallback" tabIndex={0} data-testid="drop-root-fallback" {...collectionProps} />;
    }

    render(() => <TestComponent />);
    const root = screen.getByTestId('drop-root-fallback');

    fireEvent.keyDown(root, { key: 'PageDown' });
    expect(calls.at(-1)).toBe('set:item:2');

    fireEvent.keyDown(root, { key: 'PageUp' });
    expect(calls.at(-1)).toBe('set:item:1');
  });

  it('passes internal dragging keys to onMove for on-item drops', () => {
    const onMoveCalls: Array<Set<string | number>> = [];
    const dropTarget: DropTarget = { type: 'item', key: 'b', dropPosition: 'on' };
    let currentTarget: DropTarget | null = null;
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
      },
      activateTarget() {},
      exitTarget() {
        currentTarget = null;
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
          ref: () => document.getElementById('drop-root-internal-move') as HTMLElement | null,
          dropTargetDelegate: {
            getDropTargetFromPoint() {
              return dropTarget;
            },
          },
          onMove: (e) => {
            onMoveCalls.push(new Set(e.keys));
          },
        }),
        state
      );

      return <div id="drop-root-internal-move" tabIndex={0} data-testid="drop-root-internal-move" {...collectionProps} />;
    }

    render(() => <TestComponent />);
    const root = screen.getByTestId('drop-root-internal-move');
    const dataTransfer = {
      effectAllowed: 'all',
      dropEffect: 'none',
      items: [{ kind: 'string', type: 'text/plain' }],
      types: ['text/plain'],
      getData: () => 'payload',
    } as unknown as DataTransfer;

    const draggingKeys = new Set<string | number>(['a', 'c']);
    setGlobalDraggingCollectionRef(root as HTMLElement);
    setGlobalDraggingKeys(draggingKeys);

    fireEvent.dragEnter(root, { dataTransfer, clientX: 1, clientY: 1 });
    fireEvent.dragOver(root, { dataTransfer, clientX: 2, clientY: 2 });
    fireEvent.drop(root, { dataTransfer, clientX: 2, clientY: 2 });

    expect(onMoveCalls).toHaveLength(1);
    expect(onMoveCalls[0]).toEqual(draggingKeys);
  });

  it('passes internal dragging keys to onReorder for insertion drops', () => {
    const onReorderCalls: Array<Set<string | number>> = [];
    const dropTarget: DropTarget = { type: 'item', key: 'b', dropPosition: 'before' };
    let currentTarget: DropTarget | null = null;
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
      },
      activateTarget() {},
      exitTarget() {
        currentTarget = null;
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
          ref: () => document.getElementById('drop-root-internal-reorder') as HTMLElement | null,
          dropTargetDelegate: {
            getDropTargetFromPoint() {
              return dropTarget;
            },
          },
          onReorder: (e) => {
            onReorderCalls.push(new Set(e.keys));
          },
        }),
        state
      );

      return <div id="drop-root-internal-reorder" tabIndex={0} data-testid="drop-root-internal-reorder" {...collectionProps} />;
    }

    render(() => <TestComponent />);
    const root = screen.getByTestId('drop-root-internal-reorder');
    const dataTransfer = {
      effectAllowed: 'all',
      dropEffect: 'none',
      items: [{ kind: 'string', type: 'text/plain' }],
      types: ['text/plain'],
      getData: () => 'payload',
    } as unknown as DataTransfer;

    const draggingKeys = new Set<string | number>(['x']);
    setGlobalDraggingCollectionRef(root as HTMLElement);
    setGlobalDraggingKeys(draggingKeys);

    fireEvent.dragEnter(root, { dataTransfer, clientX: 1, clientY: 1 });
    fireEvent.dragOver(root, { dataTransfer, clientX: 2, clientY: 2 });
    fireEvent.drop(root, { dataTransfer, clientX: 2, clientY: 2 });

    expect(onReorderCalls).toHaveLength(1);
    expect(onReorderCalls[0]).toEqual(draggingKeys);
  });
});
