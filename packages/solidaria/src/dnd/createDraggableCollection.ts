/**
 * createDraggableCollection - ARIA hook for draggable collection items.
 *
 * Provides accessibility support for dragging items from a collection
 * component like ListBox, GridList, or Table.
 */

import { createMemo, createEffect, onCleanup, type Accessor } from 'solid-js';
import type { DraggableCollectionState } from '@proyecto-viviana/solid-stately';

// Global state for tracking the dragging collection
let globalDraggingCollectionRef: HTMLElement | null = null;
let globalDraggingKeys: Set<string | number> = new Set();

export function setGlobalDraggingCollectionRef(ref: HTMLElement | null): void {
  globalDraggingCollectionRef = ref;
}

export function getGlobalDraggingCollectionRef(): HTMLElement | null {
  return globalDraggingCollectionRef;
}

export function setGlobalDraggingKeys(keys: Set<string | number>): void {
  globalDraggingKeys = new Set(keys);
}

export function getGlobalDraggingKeys(): Set<string | number> {
  return new Set(globalDraggingKeys);
}

export interface DraggableCollectionOptions {
  /** Reference to the collection element. */
  ref: Accessor<HTMLElement | null>;
}

export interface DraggableCollectionAria {
  /** The draggable collection state. */
  state: DraggableCollectionState;
}

/**
 * Creates ARIA support for a draggable collection.
 *
 * @param _options - Collection options
 * @param state - Draggable collection state
 * @returns Draggable collection ARIA result
 */
export function createDraggableCollection(
  options: DraggableCollectionOptions,
  state: DraggableCollectionState
): DraggableCollectionAria {
  const ref = createMemo(() => options.ref());

  // Track dragging state globally
  createEffect(() => {
    const currentRef = ref();
    if (state.draggingKeys.size > 0) {
      if (globalDraggingCollectionRef !== currentRef) {
        setGlobalDraggingCollectionRef(currentRef);
      }
      setGlobalDraggingKeys(state.draggingKeys);
      return;
    }

    // Clear global drag tracking when this collection is no longer dragging.
    if (globalDraggingCollectionRef === currentRef) {
      setGlobalDraggingCollectionRef(null);
      setGlobalDraggingKeys(new Set());
    }
  });

  // Clean up on unmount
  onCleanup(() => {
    if (globalDraggingCollectionRef === ref()) {
      setGlobalDraggingCollectionRef(null);
      setGlobalDraggingKeys(new Set());
    }
  });

  return {
    state,
  };
}
