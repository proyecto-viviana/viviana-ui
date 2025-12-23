/**
 * Provides the behavior and accessibility implementation for a listbox component.
 * A listbox displays a list of options and allows a user to select one or more of them.
 * Based on @react-aria/listbox useListBox.
 */
import { type JSX } from 'solid-js';
import { type MaybeAccessor } from '../utils/reactivity';
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
interface ListBoxData {
    id: string;
    onAction?: (key: Key) => void;
    shouldSelectOnPressUp?: boolean;
    shouldFocusOnHover?: boolean;
}
export declare function getListBoxData(state: ListState): ListBoxData | undefined;
/**
 * Provides the behavior and accessibility implementation for a listbox component.
 * A listbox displays a list of options and allows a user to select one or more of them.
 */
export declare function createListBox<T>(props: MaybeAccessor<AriaListBoxProps>, state: ListState<T>, _ref?: () => HTMLElement | null): ListBoxAria;
export {};
//# sourceMappingURL=createListBox.d.ts.map