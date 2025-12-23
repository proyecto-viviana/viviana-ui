/**
 * Provides the behavior and accessibility implementation for an option in a listbox.
 * Based on @react-aria/listbox useOption.
 */
import { type JSX, type Accessor } from 'solid-js';
import { type MaybeAccessor } from '../utils/reactivity';
import type { ListState, Key } from '@proyecto-viviana/solid-stately';
export interface AriaOptionProps {
    /** The unique key for the option. */
    key: Key;
    /** Whether the option is disabled. */
    isDisabled?: boolean;
    /** An accessible label for the option. */
    'aria-label'?: string;
    /** Whether selection should occur on press up. */
    shouldSelectOnPressUp?: boolean;
    /** Whether to focus the option on hover. */
    shouldFocusOnHover?: boolean;
}
export interface OptionAria {
    /** Props for the option element. */
    optionProps: JSX.HTMLAttributes<HTMLElement>;
    /** Props for the label text inside the option. */
    labelProps: JSX.HTMLAttributes<HTMLElement>;
    /** Props for the description text inside the option. */
    descriptionProps: JSX.HTMLAttributes<HTMLElement>;
    /** Whether the option is currently selected. */
    isSelected: Accessor<boolean>;
    /** Whether the option is currently focused. */
    isFocused: Accessor<boolean>;
    /** Whether the option is keyboard focused. */
    isFocusVisible: Accessor<boolean>;
    /** Whether the option is currently pressed. */
    isPressed: Accessor<boolean>;
    /** Whether the option is disabled. */
    isDisabled: Accessor<boolean>;
}
/**
 * Provides the behavior and accessibility implementation for an option in a listbox.
 */
export declare function createOption<T>(props: MaybeAccessor<AriaOptionProps>, state: ListState<T>, _ref?: () => HTMLElement | null): OptionAria;
//# sourceMappingURL=createOption.d.ts.map