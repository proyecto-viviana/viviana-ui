/**
 * Provides the behavior and accessibility implementation for a listbox component.
 * A listbox displays a list of options and allows a user to select one or more of them.
 * Based on @react-aria/listbox useListBox.
 */

import { createEffect, onCleanup, type JSX } from 'solid-js';
import { createFocusWithin } from '../interactions/createFocusWithin';
import { createLabel } from '../label/createLabel';
import { filterDOMProps } from '../utils/filterDOMProps';
import { mergeProps } from '../utils/mergeProps';
import { createId } from '../ssr';
import { access, type MaybeAccessor } from '../utils/reactivity';
import type { ListState, Key } from '@proyecto-viviana/solid-stately';

export interface AriaListBoxProps {
  /** An ID for the listbox. */
  id?: string;
  /** Whether the listbox is disabled. */
  isDisabled?: boolean;
  /** The label for the listbox. */
  label?: JSX.Element;
  /** An accessible label for the listbox when no visible label is provided. */
  'aria-label'?: string;
  /** The ID of an element that labels the listbox. */
  'aria-labelledby'?: string;
  /** The ID of an element that describes the listbox. */
  'aria-describedby'?: string;
  /** Handler called when focus moves into the listbox. */
  onFocus?: (e: FocusEvent) => void;
  /** Handler called when focus moves out of the listbox. */
  onBlur?: (e: FocusEvent) => void;
  /** Handler called when the focus state changes. */
  onFocusChange?: (isFocused: boolean) => void;
  /** Handler called when an item is activated (pressed). */
  onAction?: (key: Key) => void;
  /** Whether focus should automatically wrap around. */
  shouldFocusWrap?: boolean;
  /** Whether selection should occur on press up. */
  shouldSelectOnPressUp?: boolean;
  /** Whether to focus items on hover. */
  shouldFocusOnHover?: boolean;
}

export interface ListBoxAria {
  /** Props for the listbox element. */
  listBoxProps: JSX.HTMLAttributes<HTMLElement>;
  /** Props for the listbox's label element (if any). */
  labelProps: JSX.HTMLAttributes<HTMLElement>;
}

// Shared data between listbox and options
const listBoxData = new WeakMap<object, ListBoxData>();

interface ListBoxData {
  id: string;
  onAction?: (key: Key) => void;
  shouldSelectOnPressUp?: boolean;
  shouldFocusOnHover?: boolean;
}

export function getListBoxData(state: ListState): ListBoxData | undefined {
  return listBoxData.get(state);
}

/**
 * Provides the behavior and accessibility implementation for a listbox component.
 * A listbox displays a list of options and allows a user to select one or more of them.
 */
export function createListBox<T>(
  props: MaybeAccessor<AriaListBoxProps>,
  state: ListState<T>,
  _ref?: () => HTMLElement | null
): ListBoxAria {
  const getProps = () => access(props);
  const id = createId(getProps().id);

  // Filter DOM props
  const domProps = () => filterDOMProps(getProps() as unknown as Record<string, unknown>, { labelable: true });

  // Share data with child options
  createEffect(() => {
    const p = getProps();
    listBoxData.set(state, {
      id,
      onAction: p.onAction,
      shouldSelectOnPressUp: p.shouldSelectOnPressUp,
      shouldFocusOnHover: p.shouldFocusOnHover,
    });

    onCleanup(() => {
      listBoxData.delete(state);
    });
  });

  // Handle focus within
  const { focusWithinProps } = createFocusWithin({
    onFocusWithin: (e) => getProps().onFocus?.(e),
    onBlurWithin: (e) => getProps().onBlur?.(e),
    onFocusWithinChange: (isFocused) => {
      getProps().onFocusChange?.(isFocused);
      state.setFocused(isFocused);
    },
  });

  // Label handling
  const { labelProps, fieldProps } = createLabel({
    get id() {
      return id;
    },
    get label() {
      return getProps().label;
    },
    get 'aria-label'() {
      return getProps()['aria-label'];
    },
    get 'aria-labelledby'() {
      return getProps()['aria-labelledby'];
    },
    labelElementType: 'span',
  });

  // Keyboard navigation
  const onKeyDown: JSX.EventHandler<HTMLElement, KeyboardEvent> = (e) => {
    if (getProps().isDisabled) return;

    const collection = state.collection();

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        const currentKey = state.focusedKey();
        const nextKey = currentKey ? collection.getKeyAfter(currentKey) : collection.getFirstKey();
        if (nextKey) {
          state.setFocusedKey(nextKey);
          if (!e.shiftKey && state.selectionMode() === 'single') {
            state.replaceSelection(nextKey);
          } else if (e.shiftKey && state.selectionMode() === 'multiple') {
            state.extendSelection(nextKey, collection);
          }
        }
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        const currentKey = state.focusedKey();
        const prevKey = currentKey ? collection.getKeyBefore(currentKey) : collection.getLastKey();
        if (prevKey) {
          state.setFocusedKey(prevKey);
          if (!e.shiftKey && state.selectionMode() === 'single') {
            state.replaceSelection(prevKey);
          } else if (e.shiftKey && state.selectionMode() === 'multiple') {
            state.extendSelection(prevKey, collection);
          }
        }
        break;
      }
      case 'Home': {
        e.preventDefault();
        const firstKey = collection.getFirstKey();
        if (firstKey) {
          state.setFocusedKey(firstKey);
          if (e.ctrlKey && e.shiftKey && state.selectionMode() === 'multiple') {
            // Select from current to first
            state.extendSelection(firstKey, collection);
          } else if (!e.shiftKey && state.selectionMode() === 'single') {
            state.replaceSelection(firstKey);
          }
        }
        break;
      }
      case 'End': {
        e.preventDefault();
        const lastKey = collection.getLastKey();
        if (lastKey) {
          state.setFocusedKey(lastKey);
          if (e.ctrlKey && e.shiftKey && state.selectionMode() === 'multiple') {
            // Select from current to last
            state.extendSelection(lastKey, collection);
          } else if (!e.shiftKey && state.selectionMode() === 'single') {
            state.replaceSelection(lastKey);
          }
        }
        break;
      }
      case ' ':
      case 'Enter': {
        e.preventDefault();
        const focusedKey = state.focusedKey();
        if (focusedKey != null) {
          if (state.selectionMode() !== 'none') {
            state.toggleSelection(focusedKey);
          }
          getProps().onAction?.(focusedKey);
        }
        break;
      }
      case 'a': {
        if (e.ctrlKey && state.selectionMode() === 'multiple') {
          e.preventDefault();
          state.selectAll();
        }
        break;
      }
      case 'Escape': {
        e.preventDefault();
        if (!state.disallowEmptySelection()) {
          state.clearSelection();
        }
        break;
      }
    }
  };

  return {
    get labelProps() {
      return labelProps as JSX.HTMLAttributes<HTMLElement>;
    },
    get listBoxProps() {
      const p = getProps();
      const selectionMode = state.selectionMode();

      return mergeProps(
        domProps(),
        focusWithinProps as Record<string, unknown>,
        fieldProps as Record<string, unknown>,
        {
          role: 'listbox',
          tabIndex: p.isDisabled ? undefined : 0,
          'aria-disabled': p.isDisabled || undefined,
          'aria-multiselectable': selectionMode === 'multiple' ? true : undefined,
          onKeyDown,
        }
      ) as JSX.HTMLAttributes<HTMLElement>;
    },
  };
}
