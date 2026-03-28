/**
 * State management for step list components.
 * Tracks selected step, completion status, and selectability.
 */

import { createMemo, createSignal, type Accessor } from 'solid-js';
import type { Key } from '../collections/types';

export interface StepListStateProps {
  /** The currently selected step key (controlled). */
  selectedKey?: Key;
  /** The default selected step key (uncontrolled). */
  defaultSelectedKey?: Key;
  /** Called when the selected step changes. */
  onSelectionChange?: (key: Key) => void;
  /** The last completed step key (controlled). */
  lastCompletedStep?: Key;
  /** The default last completed step key (uncontrolled). */
  defaultLastCompletedStep?: Key;
  /** Called when last completed step changes. */
  onLastCompletedStepChange?: (key: Key | null) => void;
  /** Whether all steps are disabled. */
  isDisabled?: boolean;
  /** Whether all steps are read-only. */
  isReadOnly?: boolean;
  /** Keys of individually disabled steps. */
  disabledKeys?: Iterable<Key>;
  /** The step items. */
  items: Array<{ key: Key; [key: string]: any }>;
}

export interface StepListState {
  readonly selectedKey: Accessor<Key | null>;
  readonly lastCompletedStep: Accessor<Key | null>;
  readonly items: Accessor<Array<{ key: Key }>>;
  setSelectedKey(key: Key): void;
  setLastCompletedStep(key: Key): void;
  isCompleted(key: Key): boolean;
  isSelectable(key: Key): boolean;
  isDisabled: Accessor<boolean>;
  isReadOnly: Accessor<boolean>;
}

/**
 * Creates state for a step list component.
 */
export function createStepListState(props: StepListStateProps): StepListState {
  const items = () => props.items;

  // Build an index map: Key -> index
  const indexMap = createMemo(() => {
    const map = new Map<Key, number>();
    const currentItems = items();
    for (let i = 0; i < currentItems.length; i++) {
      map.set(currentItems[i].key, i);
    }
    return map;
  });

  // Disabled keys set
  const disabledKeysSet = createMemo(() => new Set<Key>(props.disabledKeys ?? []));

  const isDisabled: Accessor<boolean> = () => props.isDisabled ?? false;
  const isReadOnly: Accessor<boolean> = () => props.isReadOnly ?? false;

  // Last completed step signal (uncontrolled)
  const [lastCompletedStepInternal, setLastCompletedStepInternal] = createSignal<Key | null>(
    props.defaultLastCompletedStep ?? null
  );

  const lastCompletedStep: Accessor<Key | null> = () => {
    if (props.lastCompletedStep !== undefined) {
      return props.lastCompletedStep;
    }
    return lastCompletedStepInternal();
  };

  const setLastCompletedStep = (key: Key) => {
    const currentIndex = indexMap().get(key);
    const prevIndex = lastCompletedStep() !== null ? indexMap().get(lastCompletedStep()!) : -1;

    // Only advance completion, never go back
    if (currentIndex !== undefined && (prevIndex === undefined || currentIndex > (prevIndex ?? -1))) {
      if (props.lastCompletedStep === undefined) {
        setLastCompletedStepInternal(key);
      }
      props.onLastCompletedStepChange?.(key);
    }
  };

  const isCompleted = (key: Key): boolean => {
    const completed = lastCompletedStep();
    if (completed === null) return false;
    const keyIndex = indexMap().get(key);
    const completedIndex = indexMap().get(completed);
    if (keyIndex === undefined || completedIndex === undefined) return false;
    return keyIndex <= completedIndex;
  };

  const isStepDisabled = (key: Key): boolean => {
    if (isDisabled()) return true;
    return disabledKeysSet().has(key);
  };

  const isSelectable = (key: Key): boolean => {
    if (isDisabled() || isReadOnly() || isStepDisabled(key)) return false;
    // Completed steps are always selectable
    if (isCompleted(key)) return true;
    // First step is always selectable
    const keyIndex = indexMap().get(key);
    if (keyIndex === 0) return true;
    // A step is selectable if the previous step is completed OR is the currently selected step
    const currentItems = items();
    if (keyIndex !== undefined && keyIndex > 0) {
      const prevKey = currentItems[keyIndex - 1].key;
      if (isCompleted(prevKey)) return true;
      // Allow advancing to the step immediately after the selected step
      if (prevKey === selectedKey()) return true;
    }
    return false;
  };

  // Find the first selectable non-completed step
  const findDefaultSelectedKey = (): Key | null => {
    const currentItems = items();
    for (const item of currentItems) {
      if (!isCompleted(item.key) && !isStepDisabled(item.key)) {
        return item.key;
      }
    }
    // All completed - select first non-disabled
    for (const item of currentItems) {
      if (!isStepDisabled(item.key)) {
        return item.key;
      }
    }
    return currentItems.length > 0 ? currentItems[0].key : null;
  };

  // Selected key signal (uncontrolled)
  const [selectedKeyInternal, setSelectedKeyInternal] = createSignal<Key | null>(
    props.defaultSelectedKey ?? findDefaultSelectedKey()
  );

  const selectedKey: Accessor<Key | null> = () => {
    if (props.selectedKey !== undefined) {
      return props.selectedKey;
    }
    return selectedKeyInternal();
  };

  const setSelectedKey = (key: Key) => {
    if (isReadOnly() || isDisabled()) return;
    if (!isSelectable(key)) return;

    // Mark previous selected step as completed if advancing
    const currentSelected = selectedKey();
    if (currentSelected !== null) {
      const currentIndex = indexMap().get(currentSelected);
      const newIndex = indexMap().get(key);
      if (
        currentIndex !== undefined &&
        newIndex !== undefined &&
        newIndex > currentIndex &&
        !isCompleted(currentSelected)
      ) {
        setLastCompletedStep(currentSelected);
      }
    }

    if (props.selectedKey === undefined) {
      setSelectedKeyInternal(key);
    }
    props.onSelectionChange?.(key);
  };

  return {
    selectedKey,
    lastCompletedStep,
    items,
    setSelectedKey,
    setLastCompletedStep,
    isCompleted,
    isSelectable,
    isDisabled,
    isReadOnly,
  };
}
