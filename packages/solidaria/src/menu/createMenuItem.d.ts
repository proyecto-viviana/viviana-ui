/**
 * Provides the behavior and accessibility implementation for a menu item.
 * Based on @react-aria/menu useMenuItem.
 */
import { type JSX, type Accessor } from 'solid-js';
import { type MaybeAccessor } from '../utils/reactivity';
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
export declare function createMenuItem<T>(props: MaybeAccessor<AriaMenuItemProps>, state: MenuState<T>, _ref?: () => HTMLElement | null): MenuItemAria;
//# sourceMappingURL=createMenuItem.d.ts.map