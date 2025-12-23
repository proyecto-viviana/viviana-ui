/**
 * Provides the behavior and accessibility implementation for a select component.
 * A select displays a collapsible list of options and allows a user to select one of them.
 * Based on @react-aria/select useSelect.
 */
import { type JSX, type Accessor } from 'solid-js';
import { type MaybeAccessor } from '../utils/reactivity';
import type { SelectState, CollectionNode } from '@proyecto-viviana/solid-stately';
export interface AriaSelectProps {
    /** An ID for the select. */
    id?: string;
    /** Whether the select is disabled. */
    isDisabled?: boolean;
    /** Whether the select is required. */
    isRequired?: boolean;
    /** The label for the select. */
    label?: JSX.Element;
    /** An accessible label for the select when no visible label is provided. */
    'aria-label'?: string;
    /** The ID of an element that labels the select. */
    'aria-labelledby'?: string;
    /** The ID of an element that describes the select. */
    'aria-describedby'?: string;
    /** Placeholder text when no option is selected. */
    placeholder?: string;
    /** Whether the select should be auto-focused. */
    autoFocus?: boolean;
    /** Handler called when focus moves to the select. */
    onFocus?: (e: FocusEvent) => void;
    /** Handler called when focus moves away from the select. */
    onBlur?: (e: FocusEvent) => void;
    /** Handler called when the focus state changes. */
    onFocusChange?: (isFocused: boolean) => void;
    /** The name of the select, used when submitting an HTML form. */
    name?: string;
}
export interface SelectAria<T> {
    /** Props for the label element. */
    labelProps: JSX.HTMLAttributes<HTMLElement>;
    /** Props for the trigger button element. */
    triggerProps: JSX.HTMLAttributes<HTMLElement>;
    /** Props for the value display element. */
    valueProps: JSX.HTMLAttributes<HTMLElement>;
    /** Props for the listbox/menu popup. */
    menuProps: JSX.HTMLAttributes<HTMLElement>;
    /** Props for the description element, if any. */
    descriptionProps: JSX.HTMLAttributes<HTMLElement>;
    /** Props for the error message element, if any. */
    errorMessageProps: JSX.HTMLAttributes<HTMLElement>;
    /** Whether the select is currently focused. */
    isFocused: Accessor<boolean>;
    /** Whether the select has keyboard focus. */
    isFocusVisible: Accessor<boolean>;
    /** Whether the select is currently open. */
    isOpen: Accessor<boolean>;
    /** The currently selected item. */
    selectedItem: Accessor<CollectionNode<T> | null>;
}
interface SelectData {
    id: string;
}
export declare function getSelectData(state: SelectState): SelectData | undefined;
/**
 * Provides the behavior and accessibility implementation for a select component.
 */
export declare function createSelect<T>(props: MaybeAccessor<AriaSelectProps>, state: SelectState<T>, _ref?: () => HTMLElement | null): SelectAria<T>;
export {};
//# sourceMappingURL=createSelect.d.ts.map