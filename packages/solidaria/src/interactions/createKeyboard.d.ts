/**
 * createKeyboard - Handles keyboard interactions for a focusable element.
 *
 * This is a 1-1 port of React-Aria's useKeyboard hook adapted for SolidJS.
 */
import { JSX } from 'solid-js';
/**
 * Keyboard event with continuePropagation support.
 * By default, keyboard events stop propagation.
 */
export interface KeyboardEvent extends globalThis.KeyboardEvent {
    /** Call this to allow the event to propagate to parent elements. */
    continuePropagation(): void;
}
export interface KeyboardEvents {
    /** Handler that is called when a key is pressed. */
    onKeyDown?: (e: KeyboardEvent) => void;
    /** Handler that is called when a key is released. */
    onKeyUp?: (e: KeyboardEvent) => void;
}
export interface CreateKeyboardProps extends KeyboardEvents {
    /** Whether the keyboard events should be disabled. */
    isDisabled?: boolean;
}
export interface KeyboardResult {
    /** Props to spread onto the target element. */
    keyboardProps: JSX.HTMLAttributes<HTMLElement>;
}
/**
 * Handles keyboard interactions for a focusable element.
 *
 * Based on react-aria's useKeyboard but adapted for SolidJS.
 */
export declare function createKeyboard(props?: CreateKeyboardProps): KeyboardResult;
//# sourceMappingURL=createKeyboard.d.ts.map