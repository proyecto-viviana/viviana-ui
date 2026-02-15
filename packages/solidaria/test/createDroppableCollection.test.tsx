import { describe, it, expect } from 'vitest';
import { render, fireEvent, screen, cleanup } from '@solidjs/testing-library';
import { afterEach } from 'vitest';
import { createDroppableCollection } from '../src/dnd/createDroppableCollection';
import { setGlobalDraggingCollectionRef, setGlobalDraggingKeys } from '../src/dnd/createDraggableCollection';
import type { DropTarget, DroppableCollectionState } from '@proyecto-viviana/solid-stately';

afterEach(() => {
  setGlobalDraggingCollectionRef(null);
  setGlobalDraggingKeys(new Set());
  document.dir = '';
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
          keyboardDelegate: {
            getFirstKey: () => 1,
            getLastKey: () => 9,
            getKeyBelow: (key) => (key === 1 ? 2 : null),
            getKeyAbove: (key) => (key === 2 ? 1 : null),
            getKeyPageBelow: (key) => (key === 9 ? 9 : Number(key) + 1),
            getKeyPageAbove: (key) => (key === 1 ? 1 : Number(key) - 1),
            getKeyRightOf: (key) => (key === 1 ? 2 : null),
            getKeyLeftOf: (key) => (key === 2 ? 1 : null),
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
          keyboardDelegate: {
            getFirstKey: () => 1,
            getLastKey: () => 3,
            getKeyBelow: (key) => (key < 3 ? key + 1 : null),
            getKeyAbove: (key) => (key > 1 ? key - 1 : null),
            getKeyPageBelow: (key) => (key < 3 ? key + 1 : null),
            getKeyPageAbove: (key) => (key > 1 ? key - 1 : null),
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

  it('ignores horizontal keys when keyboardDelegate does not provide horizontal getters', () => {
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
          ref: () => document.getElementById('drop-root-no-horizontal') as HTMLElement | null,
          dropTargetDelegate: {
            getDropTargetFromPoint() {
              return null;
            },
            getKeyboardNavigationTarget(_target, direction) {
              if (direction === 'next') {
                return { type: 'item', key: 1, dropPosition: 'on' };
              }
              return { type: 'item', key: 9, dropPosition: 'on' };
            },
          },
          keyboardDelegate: {
            getFirstKey: () => 1,
            getLastKey: () => 9,
            getKeyBelow: (key) => (key === 1 ? 2 : null),
            getKeyAbove: (key) => (key === 2 ? 1 : null),
          },
        }),
        state
      );

      return (
        <div
          id="drop-root-no-horizontal"
          tabIndex={0}
          data-testid="drop-root-no-horizontal"
          {...collectionProps}
        />
      );
    }

    render(() => <TestComponent />);
    const root = screen.getByTestId('drop-root-no-horizontal');

    fireEvent.keyDown(root, { key: 'ArrowRight' });
    expect(calls).toHaveLength(0);

    fireEvent.keyDown(root, { key: 'ArrowLeft' });
    expect(calls).toHaveLength(0);

    fireEvent.keyDown(root, { key: 'ArrowDown' });
    expect(calls.at(-1)).toBe('set:item:1');
  });

  it('ignores vertical and boundary keys when keyboardDelegate methods are missing', () => {
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
          ref: () => document.getElementById('drop-root-no-vertical') as HTMLElement | null,
          dropTargetDelegate: {
            getDropTargetFromPoint() {
              return null;
            },
            getKeyboardNavigationTarget(_target, direction) {
              if (direction === 'next') {
                return { type: 'item', key: 1, dropPosition: 'on' };
              }
              return { type: 'item', key: 9, dropPosition: 'on' };
            },
          },
          keyboardDelegate: {
            getKeyRightOf: (key) => (key === 1 ? 2 : null),
            getKeyLeftOf: (key) => (key === 2 ? 1 : null),
          },
        }),
        state
      );

      return (
        <div
          id="drop-root-no-vertical"
          tabIndex={0}
          data-testid="drop-root-no-vertical"
          {...collectionProps}
        />
      );
    }

    render(() => <TestComponent />);
    const root = screen.getByTestId('drop-root-no-vertical');

    fireEvent.keyDown(root, { key: 'ArrowDown' });
    fireEvent.keyDown(root, { key: 'ArrowUp' });
    fireEvent.keyDown(root, { key: 'Home' });
    fireEvent.keyDown(root, { key: 'End' });
    expect(calls).toHaveLength(0);

    fireEvent.keyDown(root, { key: 'ArrowRight' });
    expect(calls.at(-1)).toBe('set:item:1');
  });

  it('ignores page keys when keyboardDelegate page methods are missing', () => {
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
          ref: () => document.getElementById('drop-root-no-page') as HTMLElement | null,
          dropTargetDelegate: {
            getDropTargetFromPoint() {
              return null;
            },
            getKeyboardPageNavigationTarget(target, direction) {
              if (target?.type !== 'item') return null;
              return {
                type: 'item',
                key: direction === 'next' ? Number(target.key) + 1 : Number(target.key) - 1,
                dropPosition: 'on',
              };
            },
          },
          keyboardDelegate: {
            getFirstKey: () => 1,
            getLastKey: () => 3,
            getKeyBelow: (key) => (key < 3 ? key + 1 : null),
            getKeyAbove: (key) => (key > 1 ? key - 1 : null),
          },
        }),
        state
      );

      return <div id="drop-root-no-page" tabIndex={0} data-testid="drop-root-no-page" {...collectionProps} />;
    }

    render(() => <TestComponent />);
    const root = screen.getByTestId('drop-root-no-page');

    fireEvent.keyDown(root, { key: 'PageDown' });
    expect(calls).toHaveLength(0);

    fireEvent.keyDown(root, { key: 'PageUp' });
    expect(calls).toHaveLength(0);

    fireEvent.keyDown(root, { key: 'ArrowDown' });
    expect(calls.at(-1)).toBe('set:item:2');
  });

  it('uses keyboardDelegate fallback when drop target delegate has no keyboard methods', () => {
    const calls: string[] = [];
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
        if (target?.type === 'item') {
          calls.push(`set:item:${String(target.key)}:${target.dropPosition}`);
        } else {
          calls.push(`set:${target?.type ?? 'null'}`);
        }
      },
      activateTarget() {},
      exitTarget() {},
      getDropOperation(target: DropTarget) {
        if (target.type === 'item' && target.key === 2 && target.dropPosition === 'on') {
          return 'cancel' as const;
        }
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
          ref: () => document.getElementById('drop-root-kbd-fallback') as HTMLElement | null,
          dropTargetDelegate: {
            getDropTargetFromPoint() {
              return null;
            },
          },
          keyboardDelegate: {
            getFirstKey: () => 1,
            getLastKey: () => 3,
            getKeyBelow: (key) => (key < 3 ? key + 1 : null),
            getKeyAbove: (key) => (key > 1 ? key - 1 : null),
            getKeyPageBelow: (key) => (key < 3 ? key + 1 : null),
            getKeyPageAbove: (key) => (key > 1 ? key - 1 : null),
          },
        }),
        state
      );

      return <div id="drop-root-kbd-fallback" tabIndex={0} data-testid="drop-root-kbd-fallback" {...collectionProps} />;
    }

    render(() => <TestComponent />);
    const root = screen.getByTestId('drop-root-kbd-fallback');

    fireEvent.keyDown(root, { key: 'ArrowDown' });
    expect(calls.at(-1)).toBe('set:item:1:on');

    fireEvent.keyDown(root, { key: 'PageDown' });
    expect(calls.at(-1)).toBe('set:item:2:before');

    fireEvent.keyDown(root, { key: 'End' });
    expect(calls.at(-1)).toBe('set:item:3:on');
  });

  it('falls back to keyboardDelegate when delegate keyboard method returns null', () => {
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
          calls.push(`set:item:${String(target.key)}:${target.dropPosition}`);
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
          ref: () => document.getElementById('drop-root-kbd-null-fallback') as HTMLElement | null,
          dropTargetDelegate: {
            getDropTargetFromPoint() {
              return null;
            },
            getKeyboardNavigationTarget() {
              return null;
            },
          },
          keyboardDelegate: {
            getFirstKey: () => 1,
            getLastKey: () => 3,
            getKeyBelow: (key) => (key < 3 ? key + 1 : null),
            getKeyAbove: (key) => (key > 1 ? key - 1 : null),
          },
        }),
        state
      );

      return (
        <div id="drop-root-kbd-null-fallback" tabIndex={0} data-testid="drop-root-kbd-null-fallback" {...collectionProps} />
      );
    }

    render(() => <TestComponent />);
    const root = screen.getByTestId('drop-root-kbd-null-fallback');

    fireEvent.keyDown(root, { key: 'ArrowDown' });
    expect(calls.at(-1)).toBe('set:item:2:on');
  });

  it('iteratively skips invalid keyboard targets until a valid target is found', () => {
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
          calls.push(`set:item:${String(target.key)}:${target.dropPosition}`);
        } else {
          calls.push(`set:${target?.type ?? 'null'}`);
        }
      },
      activateTarget() {},
      exitTarget() {},
      getDropOperation(target: DropTarget) {
        if (target.type === 'item' && (target.key === 1 || target.key === 2)) {
          return 'cancel' as const;
        }
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
          ref: () => document.getElementById('drop-root-iterative') as HTMLElement | null,
          dropTargetDelegate: {
            getDropTargetFromPoint() {
              return null;
            },
            getKeyboardNavigationTarget(target, direction) {
              if (direction !== 'next') return null;
              if (!target || target.type === 'root') {
                return { type: 'item', key: 1, dropPosition: 'on' };
              }
              if (target.type === 'item' && target.key === 1) {
                return { type: 'item', key: 2, dropPosition: 'on' };
              }
              if (target.type === 'item' && target.key === 2) {
                return { type: 'item', key: 3, dropPosition: 'on' };
              }
              return null;
            },
          },
          keyboardDelegate: {
            getKeyBelow: (key) => (key < 3 ? key + 1 : null),
          },
        }),
        state
      );

      return (
        <div
          id="drop-root-iterative"
          tabIndex={0}
          data-testid="drop-root-iterative"
          {...collectionProps}
        />
      );
    }

    render(() => <TestComponent />);
    const root = screen.getByTestId('drop-root-iterative');

    fireEvent.keyDown(root, { key: 'ArrowDown' });
    expect(calls.at(-1)).toBe('set:item:3:on');
  });

  it('uses rtl-aware horizontal direction for delegate keyboard navigation', () => {
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
        } else {
          calls.push(`set:${target?.type ?? 'null'}`);
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
          ref: () => document.getElementById('drop-root-rtl') as HTMLElement | null,
          dropTargetDelegate: {
            getDropTargetFromPoint() {
              return null;
            },
            getKeyboardNavigationTarget(_target, direction) {
              if (direction === 'next') {
                return { type: 'item', key: 2, dropPosition: 'on' };
              }
              return { type: 'item', key: 8, dropPosition: 'on' };
            },
          },
          keyboardDelegate: {
            getKeyLeftOf: (key) => (key === 2 ? 1 : null),
            getKeyRightOf: (key) => (key === 8 ? 9 : null),
          },
        }),
        state
      );

      return <div id="drop-root-rtl" dir="rtl" tabIndex={0} data-testid="drop-root-rtl" {...collectionProps} />;
    }

    render(() => <TestComponent />);
    const root = screen.getByTestId('drop-root-rtl');

    fireEvent.keyDown(root, { key: 'ArrowLeft' });
    expect(calls.at(-1)).toBe('set:item:2');

    fireEvent.keyDown(root, { key: 'ArrowRight' });
    expect(calls.at(-1)).toBe('set:item:8');
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
