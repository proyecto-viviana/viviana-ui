/**
 * Provides a hidden native select element for form integration.
 * Based on @react-aria/select useHiddenSelect.
 */
import { type JSX } from 'solid-js';
import { type MaybeAccessor } from '../utils/reactivity';
import type { SelectState } from '@proyecto-viviana/solid-stately';
export interface AriaHiddenSelectProps<T> {
    /** The state object for the select. */
    state: SelectState<T>;
    /** The name attribute for the hidden select. */
    name?: string;
    /** Whether the select is disabled. */
    isDisabled?: boolean;
    /** Describes the type of autocomplete functionality the select should provide. */
    autoComplete?: string;
}
export interface HiddenSelectAria {
    /** Props for the container element. */
    containerProps: JSX.HTMLAttributes<HTMLDivElement>;
    /** Props for the hidden select element. */
    selectProps: JSX.SelectHTMLAttributes<HTMLSelectElement>;
    /** Props for the hidden input element (for form submission). */
    inputProps: JSX.InputHTMLAttributes<HTMLInputElement>;
}
/**
 * Provides the accessibility implementation for a hidden select.
 * This is used for native form submission and accessibility on mobile devices.
 */
export declare function createHiddenSelect<T>(props: MaybeAccessor<AriaHiddenSelectProps<T>>): HiddenSelectAria;
export interface HiddenSelectProps<T> {
    /** The state object for the select. */
    state: SelectState<T>;
    /** The name attribute for the hidden select. */
    name?: string;
    /** Whether the select is disabled. */
    isDisabled?: boolean;
    /** A ref to the trigger element. */
    triggerRef?: () => HTMLElement | null;
    /** Label for the select. */
    label?: string;
    /** Describes the type of autocomplete functionality the select should provide. */
    autoComplete?: string;
}
/**
 * A component that renders a hidden native select for form submission.
 * This is useful on mobile devices where native select behavior is preferred.
 */
export declare function HiddenSelect<T>(props: HiddenSelectProps<T>): JSX.Element;
//# sourceMappingURL=createHiddenSelect.d.ts.map