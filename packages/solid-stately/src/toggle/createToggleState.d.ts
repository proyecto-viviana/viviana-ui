/**
 * Toggle state for Solid Stately
 *
 * Provides state management for toggle components like checkboxes and switches.
 *
 * This is a 1:1 port of @react-stately/toggle's useToggleState.
 */
import { Accessor } from 'solid-js';
import { type MaybeAccessor } from '../utils';
export interface ToggleStateOptions {
    /** Whether the element should be selected (controlled). */
    isSelected?: boolean;
    /** Whether the element should be selected by default (uncontrolled). */
    defaultSelected?: boolean;
    /** Handler that is called when the element's selection state changes. */
    onChange?: (isSelected: boolean) => void;
    /** Whether the element is read only. */
    isReadOnly?: boolean;
}
export interface ToggleState {
    /** Whether the toggle is selected. */
    readonly isSelected: Accessor<boolean>;
    /** Whether the toggle is selected by default. */
    readonly defaultSelected: boolean;
    /** Updates selection state. */
    setSelected(isSelected: boolean): void;
    /** Toggle the selection state. */
    toggle(): void;
}
/**
 * Provides state management for toggle components like checkboxes and switches.
 */
export declare function createToggleState(props?: MaybeAccessor<ToggleStateOptions>): ToggleState;
//# sourceMappingURL=createToggleState.d.ts.map