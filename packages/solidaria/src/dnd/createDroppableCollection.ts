/**
 * createDroppableCollection - ARIA hook for droppable collection targets.
 *
 * Provides accessibility support for dropping items into a collection
 * component like ListBox, GridList, or Table.
 */

import { createMemo, onCleanup, type Accessor } from 'solid-js';
import type { JSX } from 'solid-js';
import type {
  DroppableCollectionState,
  DropTarget,
  DropOperation,
  DropItem,
  DragTypes,
} from '@proyecto-viviana/solid-stately';
import { createDrop } from './createDrop';
import { getGlobalDraggingCollectionRef } from './createDraggableCollection';

// Global state for tracking the drop collection
let globalDropCollectionRef: HTMLElement | null = null;

export function setGlobalDropCollectionRef(ref: HTMLElement | null): void {
  globalDropCollectionRef = ref;
}

export function getGlobalDropCollectionRef(): HTMLElement | null {
  return globalDropCollectionRef;
}

export interface DropTargetDelegate {
  /**
   * Returns a drop target from a point within the collection.
   */
  getDropTargetFromPoint(
    x: number,
    y: number,
    isValidDropTarget: (target: DropTarget) => boolean
  ): DropTarget | null;
  /**
   * Returns the next keyboard-navigable drop target.
   */
  getKeyboardNavigationTarget?(
    target: DropTarget | null,
    direction: 'next' | 'previous',
    isValidDropTarget: (target: DropTarget) => boolean
  ): DropTarget | null;
  /**
   * Returns the next page-navigable drop target.
   */
  getKeyboardPageNavigationTarget?(
    target: DropTarget | null,
    direction: 'next' | 'previous',
    isValidDropTarget: (target: DropTarget) => boolean
  ): DropTarget | null;
}

export interface DroppableCollectionOptions {
  /** Reference to the collection element. */
  ref: Accessor<HTMLElement | null>;
  /** A delegate that provides drop targets for pointer coordinates. */
  dropTargetDelegate: DropTargetDelegate;
  /** Handler called when items are dropped to be inserted. */
  onInsert?: (e: {
    items: DropItem[];
    target: DropTarget;
    dropOperation: DropOperation;
  }) => void;
  /** Handler called when items are dropped on the root. */
  onRootDrop?: (e: { items: DropItem[]; dropOperation: DropOperation }) => void;
  /** Handler called when items are dropped on an item. */
  onItemDrop?: (e: {
    items: DropItem[];
    target: DropTarget;
    dropOperation: DropOperation;
    isInternal: boolean;
  }) => void;
  /** Handler called when items are reordered within the collection. */
  onReorder?: (e: {
    keys: Set<string | number>;
    target: DropTarget;
    dropOperation: DropOperation;
  }) => void;
  /** Handler called when items are moved within/between collections. */
  onMove?: (e: {
    keys: Set<string | number>;
    target: DropTarget;
    dropOperation: DropOperation;
  }) => void;
  /** Handler called when the drop target is activated (held over). */
  onDropActivate?: (e: { target: DropTarget; x: number; y: number }) => void;
  /** Whether the collection is disabled for dropping. */
  isDisabled?: boolean;
  /** Accepted drag types. 'all' accepts any type. */
  acceptedDragTypes?: 'all' | string[];
}

export interface DroppableCollectionAria {
  /** Props to spread on the collection element. */
  collectionProps: JSX.HTMLAttributes<HTMLElement>;
}

/**
 * Creates ARIA support for a droppable collection.
 *
 * @param options - Collection options accessor
 * @param state - Droppable collection state
 * @returns Droppable collection ARIA result
 */
export function createDroppableCollection(
  options: Accessor<DroppableCollectionOptions>,
  state: DroppableCollectionState
): DroppableCollectionAria {
  const getOptions = createMemo(() => options());

  // Track the next target during drag operations
  let nextTarget: DropTarget | null = null;
  let currentDropOperation: DropOperation | null = null;

  const isInternalDropOperation = (): boolean => {
    const ref = getOptions().ref();
    const draggingRef = getGlobalDraggingCollectionRef();
    return ref !== null && draggingRef === ref;
  };

  const getDropOperationForTarget = (
    target: DropTarget,
    types: DragTypes,
    allowedOperations: DropOperation[]
  ): DropOperation => {
    return state.getDropOperation(target, types, allowedOperations);
  };

  // Create base drop behavior
  const drop = createDrop(() => ({
    isDisabled: getOptions().isDisabled,
    getDropOperationForPoint: (types, allowedOperations, x, y) => {
      const opts = getOptions();
      const isValidDropTarget = (target: DropTarget) =>
        getDropOperationForTarget(target, types, allowedOperations) !== 'cancel';

      const target = opts.dropTargetDelegate.getDropTargetFromPoint(
        x,
        y,
        isValidDropTarget
      );

      if (!target) {
        currentDropOperation = 'cancel';
        nextTarget = null;
        return 'cancel';
      }

      currentDropOperation = getDropOperationForTarget(
        target,
        types,
        allowedOperations
      );

      // If target doesn't accept, try root
      if (currentDropOperation === 'cancel') {
        const rootTarget: DropTarget = { type: 'root' };
        const rootOp = getDropOperationForTarget(
          rootTarget,
          types,
          allowedOperations
        );
        if (rootOp !== 'cancel') {
          nextTarget = rootTarget;
          currentDropOperation = rootOp;
          return currentDropOperation;
        }
      }

      // Update drop collection ref
      const ref = opts.ref();
      if (target && currentDropOperation !== 'cancel' && ref !== globalDropCollectionRef) {
        setGlobalDropCollectionRef(ref);
      }

      nextTarget = currentDropOperation === 'cancel' ? null : target;
      return currentDropOperation;
    },
    onDropEnter: () => {
      if (nextTarget) {
        state.setTarget(nextTarget);
      }
    },
    onDropMove: () => {
      if (nextTarget) {
        state.setTarget(nextTarget);
      }
    },
    onDropExit: () => {
      setGlobalDropCollectionRef(null);
      state.setTarget(null);
    },
    onDropActivate: (e) => {
      const opts = getOptions();
      if (state.target?.type === 'item' && typeof opts.onDropActivate === 'function') {
        opts.onDropActivate({
          target: state.target,
          x: e.x,
          y: e.y,
        });
      }
    },
    onDrop: (e) => {
      const opts = getOptions();
      setGlobalDropCollectionRef(opts.ref());

      if (state.target) {
        handleDrop(e.items, state.target, e.dropOperation);
      }
    },
  }));

  const handleDrop = async (
    items: DropItem[],
    target: DropTarget,
    dropOperation: DropOperation
  ) => {
    const opts = getOptions();
    const isInternal = isInternalDropOperation();

    // Filter items by accepted types
    let filteredItems = items;
    const acceptedTypes = opts.acceptedDragTypes;
    if (acceptedTypes && acceptedTypes !== 'all') {
      filteredItems = items.filter((item) => {
        const itemTypes =
          item.kind === 'file'
            ? new Set([item.type])
            : item.kind === 'text'
              ? item.types
              : new Set<string>();
        return acceptedTypes.some((type) => itemTypes.has(type));
      });
    }

    if (filteredItems.length === 0) return;

    // Call appropriate handlers based on target type
    if (target.type === 'root' && opts.onRootDrop) {
      await opts.onRootDrop({ items: filteredItems, dropOperation });
    }

    if (target.type === 'item') {
      if (target.dropPosition === 'on' && opts.onItemDrop) {
        await opts.onItemDrop({
          items: filteredItems,
          target,
          dropOperation,
          isInternal,
        });
      }

      // Handle move for internal operations
      if (opts.onMove && isInternal) {
        // Would get dragging keys from global state
        await opts.onMove({
          keys: new Set(),
          target,
          dropOperation,
        });
      }

      if (target.dropPosition !== 'on') {
        if (!isInternal && opts.onInsert) {
          await opts.onInsert({
            items: filteredItems,
            target,
            dropOperation,
          });
        }

        if (isInternal && opts.onReorder) {
          // Would get dragging keys from global state
          await opts.onReorder({
            keys: new Set(),
            target,
            dropOperation,
          });
        }
      }
    }
  };

  // Clean up on unmount
  onCleanup(() => {
    const ref = getOptions().ref();
    if (globalDropCollectionRef === ref) {
      setGlobalDropCollectionRef(null);
    }
  });

  const collectionProps = createMemo(() => {
    const baseDropProps = drop.dropProps;
    const onKeyDownBase = baseDropProps.onKeyDown as ((e: KeyboardEvent) => void) | undefined;
    const onKeyDown = (e: KeyboardEvent): void => {
      onKeyDownBase?.(e);
      const opts = getOptions();
      if (opts.isDisabled) return;
      const isValidDropTarget = (target: DropTarget) =>
        state.getDropOperation(target, { has: () => true }, ['copy', 'move', 'link']) !== 'cancel';
      if (
        (e.key === 'PageDown' || e.key === 'PageUp') &&
        opts.dropTargetDelegate.getKeyboardPageNavigationTarget
      ) {
        const direction = e.key === 'PageDown' ? 'next' : 'previous';
        const nextTarget = opts.dropTargetDelegate.getKeyboardPageNavigationTarget(
          state.target,
          direction,
          isValidDropTarget
        );
        if (nextTarget) {
          e.preventDefault();
          state.setTarget(nextTarget);
        }
        return;
      }
      if (
        (e.key === 'ArrowDown' ||
          e.key === 'ArrowUp' ||
          e.key === 'ArrowRight' ||
          e.key === 'ArrowLeft' ||
          e.key === 'Home' ||
          e.key === 'End') &&
        opts.dropTargetDelegate.getKeyboardNavigationTarget
      ) {
        const direction = e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'Home'
          ? 'next'
          : 'previous';
        const navigationStart = e.key === 'Home' || e.key === 'End'
          ? ({ type: 'root' } as DropTarget)
          : state.target;
        const nextTarget = opts.dropTargetDelegate.getKeyboardNavigationTarget(
          navigationStart,
          direction,
          isValidDropTarget
        );
        if (nextTarget) {
          e.preventDefault();
          state.setTarget(nextTarget);
        }
        return;
      }
      if (e.key === 'Enter' && state.target) {
        e.preventDefault();
        state.activateTarget(0, 0);
        return;
      }
      if (e.key === 'Escape' && state.target) {
        e.preventDefault();
        state.exitTarget(0, 0);
      }
    };
    return {
      ...baseDropProps,
      onKeyDown,
    };
  });

  return {
    get collectionProps() {
      return collectionProps() as DroppableCollectionAria['collectionProps'];
    },
  };
}
