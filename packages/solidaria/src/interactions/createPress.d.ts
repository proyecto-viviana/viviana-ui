/**
 * createPress - Handles press interactions across mouse, touch, keyboard, and virtual clicks.
 *
 * This is a 1-1 port of React-Aria's usePress hook adapted for SolidJS.
 * All behaviors, edge cases, and platform-specific handling are preserved.
 */
import { JSX, Accessor } from 'solid-js';
import { PressEvent } from './PressEvent';
export { PressEvent, type PointerType } from './PressEvent';
export type { IPressEvent, PressEventType } from './PressEvent';
export interface CreatePressProps {
    /** Whether the target is currently disabled. */
    isDisabled?: Accessor<boolean> | boolean;
    /** Handler called when the press is released over the target. */
    onPress?: (e: PressEvent) => void;
    /** Handler called when a press interaction starts. */
    onPressStart?: (e: PressEvent) => void;
    /**
     * Handler called when a press interaction ends, either
     * over the target or when the pointer leaves the target.
     */
    onPressEnd?: (e: PressEvent) => void;
    /** Handler called when a press is released over the target, regardless of whether it started on the target. */
    onPressUp?: (e: PressEvent) => void;
    /** Handler called when the press state changes. */
    onPressChange?: (isPressed: boolean) => void;
    /** Whether the press should be visual only, not triggering onPress. */
    isPressed?: Accessor<boolean> | boolean;
    /** Whether to prevent focus when pressing. */
    preventFocusOnPress?: boolean;
    /** Whether long press should cancel when pointer moves out of target. */
    shouldCancelOnPointerExit?: boolean;
    /** Whether text selection should be allowed during press. */
    allowTextSelectionOnPress?: boolean;
}
export interface PressResult {
    /** Whether the target is currently pressed. */
    isPressed: Accessor<boolean>;
    /** Props to spread on the target element. */
    pressProps: JSX.HTMLAttributes<HTMLElement>;
}
/**
 * Handles press interactions across mouse, touch, keyboard, and screen readers.
 * Provides consistent press behavior regardless of input method.
 *
 * Based on react-aria's usePress but adapted for SolidJS.
 */
export declare function createPress(props?: CreatePressProps): PressResult;
//# sourceMappingURL=createPress.d.ts.map