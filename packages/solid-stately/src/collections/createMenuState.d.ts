/**
 * State management for menu components.
 * Based on @react-stately/menu.
 */
import { type MaybeAccessor } from '../utils';
import { type ListState, type ListStateProps } from './createListState';
import type { Key } from './types';
export interface MenuStateProps<T = unknown> extends Omit<ListStateProps<T>, 'selectionMode' | 'disallowEmptySelection'> {
    /** Handler called when an item is activated (pressed). */
    onAction?: (key: Key) => void;
    /** Handler called when the menu should close. */
    onClose?: () => void;
}
export interface MenuState<T = unknown> extends ListState<T> {
    /** Close the menu. */
    close(): void;
}
/**
 * Creates state for a menu component.
 * Menus are single-select lists that support actions.
 */
export declare function createMenuState<T = unknown>(props: MaybeAccessor<MenuStateProps<T>>): MenuState<T>;
export interface MenuTriggerStateProps {
    /** Whether the menu is open (controlled). */
    isOpen?: boolean;
    /** Default open state (uncontrolled). */
    defaultOpen?: boolean;
    /** Handler called when the open state changes. */
    onOpenChange?: (isOpen: boolean) => void;
}
export interface MenuTriggerState {
    /** Whether the menu is open. */
    readonly isOpen: () => boolean;
    /** Open the menu. */
    open(): void;
    /** Close the menu. */
    close(): void;
    /** Toggle the menu. */
    toggle(): void;
    /** Focus strategy for when the menu opens. */
    readonly focusStrategy: () => 'first' | 'last' | null;
    /** Set the focus strategy. */
    setFocusStrategy(strategy: 'first' | 'last' | null): void;
}
/**
 * Creates state for a menu trigger (button that opens a menu).
 * This is essentially the same as overlay trigger state but with focus strategy.
 */
export { createOverlayTriggerState as createMenuTriggerState } from '../overlays';
//# sourceMappingURL=createMenuState.d.ts.map