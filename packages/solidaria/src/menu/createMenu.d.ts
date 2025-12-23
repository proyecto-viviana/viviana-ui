/**
 * Provides the behavior and accessibility implementation for a menu component.
 * A menu displays a list of actions or options that a user can choose.
 * Based on @react-aria/menu useMenu.
 */
import { type JSX } from 'solid-js';
import { type MaybeAccessor } from '../utils/reactivity';
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
interface MenuData {
    id: string;
    onAction?: (key: Key) => void;
    onClose?: () => void;
}
export declare function getMenuData(state: MenuState): MenuData | undefined;
/**
 * Provides the behavior and accessibility implementation for a menu component.
 * A menu displays a list of actions or options that a user can choose.
 */
export declare function createMenu<T>(props: MaybeAccessor<AriaMenuProps>, state: MenuState<T>, _ref?: () => HTMLElement | null): MenuAria;
export {};
//# sourceMappingURL=createMenu.d.ts.map