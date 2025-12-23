/**
 * createHover hook for Solidaria
 *
 * Handles pointer hover interactions for an element. Normalizes behavior
 * across browsers and platforms, and ignores emulated mouse events on touch devices.
 *
 * Port of @react-aria/interactions useHover.
 */
import { type JSX, type Accessor } from 'solid-js';
import { type MaybeAccessor } from '../utils/reactivity';
export interface HoverEvent {
    /** The type of hover event being fired. */
    type: 'hoverstart' | 'hoverend';
    /** The pointer type that triggered the hover event. */
    pointerType: 'mouse' | 'pen';
    /** The target element of the hover event. */
    target: Element;
}
export interface HoverEvents {
    /** Handler called when the hover starts. */
    onHoverStart?: (e: HoverEvent) => void;
    /** Handler called when the hover ends. */
    onHoverEnd?: (e: HoverEvent) => void;
    /** Handler called when the hover state changes. */
    onHoverChange?: (isHovering: boolean) => void;
}
export interface CreateHoverProps extends HoverEvents {
    /** Whether the hover events should be disabled. */
    isDisabled?: boolean;
}
export interface HoverResult {
    /** Props to spread on the target element. */
    hoverProps: JSX.HTMLAttributes<HTMLElement>;
    /** Whether the element is currently hovered. */
    isHovered: Accessor<boolean>;
}
/**
 * Handles pointer hover interactions for an element.
 */
export declare function createHover(props?: MaybeAccessor<CreateHoverProps>): HoverResult;
//# sourceMappingURL=createHover.d.ts.map