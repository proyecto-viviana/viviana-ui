/**
 * Provides the behavior and accessibility implementation for a menu item.
 * Based on @react-aria/menu useMenuItem.
 */

import { type JSX, type Accessor } from 'solid-js';
import { createPress } from '../interactions/createPress';
import { createHover } from '../interactions/createHover';
import { createFocusRing } from '../interactions/createFocusRing';
import { mergeProps } from '../utils/mergeProps';
import { access, type MaybeAccessor } from '../utils/reactivity';
import { getMenuData } from './createMenu';
import type { MenuState, Key } from '@proyecto-viviana/solid-stately';

export interface AriaMenuItemProps {
  /** The unique key for the menu item. */
  key: Key;
  /** Whether the menu item is disabled. */
  isDisabled?: boolean;
  /** An accessible label for the menu item. */
  'aria-label'?: string;
  /** Handler called when the menu item is selected. */
  onAction?: () => void;
  /** Whether to close the menu when this item is selected. */
  closeOnSelect?: boolean;
}

export interface MenuItemAria {
  /** Props for the menu item element. */
  menuItemProps: JSX.HTMLAttributes<HTMLElement>;
  /** Props for the label text inside the menu item. */
  labelProps: JSX.HTMLAttributes<HTMLElement>;
  /** Props for the description text inside the menu item. */
  descriptionProps: JSX.HTMLAttributes<HTMLElement>;
  /** Props for the keyboard shortcut inside the menu item. */
  keyboardShortcutProps: JSX.HTMLAttributes<HTMLElement>;
  /** Whether the menu item is currently focused. */
  isFocused: Accessor<boolean>;
  /** Whether the menu item is keyboard focused. */
  isFocusVisible: Accessor<boolean>;
  /** Whether the menu item is currently pressed. */
  isPressed: Accessor<boolean>;
  /** Whether the menu item is disabled. */
  isDisabled: Accessor<boolean>;
}

/**
 * Provides the behavior and accessibility implementation for a menu item.
 */
export function createMenuItem<T>(
  props: MaybeAccessor<AriaMenuItemProps>,
  state: MenuState<T>,
  _ref?: () => HTMLElement | null
): MenuItemAria {
  const getProps = () => access(props);

  // Get shared data from menu
  const getData = () => getMenuData(state);

  // Computed states
  const isDisabled: Accessor<boolean> = () => {
    return Boolean(getData()?.isDisabled || getProps().isDisabled || state.isDisabled(getProps().key));
  };

  const isFocused: Accessor<boolean> = () => {
    return state.focusedKey() === getProps().key;
  };

  // Handle press
  const { pressProps, isPressed } = createPress({
    get isDisabled() {
      return isDisabled();
    },
    onPress() {
      const p = getProps();
      const key = p.key;
      const data = getData();

      // Call item-specific onAction
      p.onAction?.();

      // Call menu-level onAction
      data?.onAction?.(key);

      // Close menu if closeOnSelect is not explicitly false
      if (p.closeOnSelect !== false) {
        data?.onClose?.();
      }
    },
  });

  // Handle hover
  const { hoverProps } = createHover({
    get isDisabled() {
      return isDisabled();
    },
    onHoverStart() {
      state.setFocusedKey(getProps().key);
    },
  });

  // Handle focus ring
  const { isFocusVisible, focusProps } = createFocusRing();

  // Generate unique IDs for label and description
  const labelId = `${getProps().key}-label`;
  const descriptionId = `${getProps().key}-desc`;
  const keyboardId = `${getProps().key}-kbd`;

  return {
    get menuItemProps() {
      const key = getProps().key;
      const ariaLabel = getProps()['aria-label'];

      return mergeProps(
        pressProps as Record<string, unknown>,
        hoverProps as Record<string, unknown>,
        focusProps as Record<string, unknown>,
        {
          role: 'menuitem',
          id: String(key),
          'aria-disabled': isDisabled() || undefined,
          'aria-label': ariaLabel,
          'aria-labelledby': !ariaLabel ? labelId : undefined,
          'aria-describedby': descriptionId,
          tabIndex: isFocused() ? 0 : -1,
          'data-focused': isFocused() || undefined,
          'data-focus-visible': isFocusVisible() || undefined,
          'data-pressed': isPressed() || undefined,
          'data-disabled': isDisabled() || undefined,
        } as Record<string, unknown>
      ) as JSX.HTMLAttributes<HTMLElement>;
    },
    labelProps: {
      id: labelId,
    },
    descriptionProps: {
      id: descriptionId,
    },
    keyboardShortcutProps: {
      id: keyboardId,
      'aria-hidden': true,
    },
    isFocused,
    isFocusVisible: () => isFocused() && isFocusVisible(),
    isPressed,
    isDisabled,
  };
}
