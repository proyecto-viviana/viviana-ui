/**
 * Provides the behavior and accessibility implementation for a menu component.
 * A menu displays a list of actions or options that a user can choose.
 * Based on @react-aria/menu useMenu.
 */

import { createEffect, onCleanup, type JSX } from 'solid-js';
import { createFocusWithin } from '../interactions/createFocusWithin';
import { createLabel } from '../label/createLabel';
import { filterDOMProps } from '../utils/filterDOMProps';
import { mergeProps } from '../utils/mergeProps';
import { createId } from '../ssr';
import { access, type MaybeAccessor } from '../utils/reactivity';
import type { MenuState, Key } from '@proyecto-viviana/solid-stately';

export interface AriaMenuProps {
  /** An ID for the menu. */
  id?: string;
  /** Whether the menu is disabled. */
  isDisabled?: boolean;
  /** The label for the menu. */
  label?: JSX.Element;
  /** An accessible label for the menu when no visible label is provided. */
  'aria-label'?: string;
  /** The ID of an element that labels the menu. */
  'aria-labelledby'?: string;
  /** The ID of an element that describes the menu. */
  'aria-describedby'?: string;
  /** Handler called when focus moves into the menu. */
  onFocus?: (e: FocusEvent) => void;
  /** Handler called when focus moves out of the menu. */
  onBlur?: (e: FocusEvent) => void;
  /** Handler called when the focus state changes. */
  onFocusChange?: (isFocused: boolean) => void;
  /** Handler called when an item is activated (pressed). */
  onAction?: (key: Key) => void;
  /** Handler called when the menu should close. */
  onClose?: () => void;
  /** Whether focus should automatically wrap around. */
  shouldFocusWrap?: boolean;
  /** Whether to auto-focus the first item when the menu opens. */
  autoFocus?: boolean | 'first' | 'last';
}

export interface MenuAria {
  /** Props for the menu element. */
  menuProps: JSX.HTMLAttributes<HTMLElement>;
  /** Props for the menu's label element (if any). */
  labelProps: JSX.HTMLAttributes<HTMLElement>;
}

// Shared data between menu and menu items
const menuData = new WeakMap<object, MenuData>();

interface MenuData {
  id: string;
  onAction?: (key: Key) => void;
  onClose?: () => void;
}

export function getMenuData(state: MenuState): MenuData | undefined {
  return menuData.get(state);
}

/**
 * Provides the behavior and accessibility implementation for a menu component.
 * A menu displays a list of actions or options that a user can choose.
 */
export function createMenu<T>(
  props: MaybeAccessor<AriaMenuProps>,
  state: MenuState<T>,
  _ref?: () => HTMLElement | null
): MenuAria {
  const getProps = () => access(props);
  const id = createId(getProps().id);

  // Filter DOM props
  const domProps = () => filterDOMProps(getProps() as unknown as Record<string, unknown>, { labelable: true });

  // Share data with child menu items
  createEffect(() => {
    const p = getProps();
    menuData.set(state, {
      id,
      onAction: p.onAction,
      onClose: p.onClose,
    });

    onCleanup(() => {
      menuData.delete(state);
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
    const p = getProps();

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        const currentKey = state.focusedKey();
        const nextKey = currentKey ? collection.getKeyAfter(currentKey) : collection.getFirstKey();
        if (nextKey) {
          state.setFocusedKey(nextKey);
        } else if (p.shouldFocusWrap) {
          const firstKey = collection.getFirstKey();
          if (firstKey) {
            state.setFocusedKey(firstKey);
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
        } else if (p.shouldFocusWrap) {
          const lastKey = collection.getLastKey();
          if (lastKey) {
            state.setFocusedKey(lastKey);
          }
        }
        break;
      }
      case 'Home': {
        e.preventDefault();
        const firstKey = collection.getFirstKey();
        if (firstKey) {
          state.setFocusedKey(firstKey);
        }
        break;
      }
      case 'End': {
        e.preventDefault();
        const lastKey = collection.getLastKey();
        if (lastKey) {
          state.setFocusedKey(lastKey);
        }
        break;
      }
      case ' ':
      case 'Enter': {
        e.preventDefault();
        const focusedKey = state.focusedKey();
        if (focusedKey != null) {
          p.onAction?.(focusedKey);
          p.onClose?.();
        }
        break;
      }
      case 'Escape': {
        e.preventDefault();
        p.onClose?.();
        break;
      }
    }
  };

  return {
    get labelProps() {
      return labelProps as JSX.HTMLAttributes<HTMLElement>;
    },
    get menuProps() {
      const p = getProps();

      return mergeProps(
        domProps(),
        focusWithinProps as Record<string, unknown>,
        fieldProps as Record<string, unknown>,
        {
          role: 'menu',
          tabIndex: p.isDisabled ? undefined : 0,
          'aria-disabled': p.isDisabled || undefined,
          onKeyDown,
        } as Record<string, unknown>
      ) as JSX.HTMLAttributes<HTMLElement>;
    },
  };
}
