/**
 * Link hook for Solidaria
 *
 * Provides the behavior and accessibility implementation for a link component.
 * A link allows a user to navigate to another page or resource within a web page
 * or application.
 *
 * This is a 1:1 port of @react-aria/link's useLink hook.
 */
import { type Accessor } from 'solid-js';
import { type MaybeAccessor } from '../utils/reactivity';
import { type PressEvent } from '../interactions/PressEvent';
export interface AriaLinkProps {
    /** Whether the link is disabled. */
    isDisabled?: boolean;
    /** The HTML element used to render the link, e.g. 'a', or 'span'. @default 'a' */
    elementType?: string;
    /** The URL to link to. */
    href?: string;
    /** The target window for the link. */
    target?: string;
    /** The relationship between the linked resource and the current page. */
    rel?: string;
    /** Handler that is called when the press is released over the target. */
    onPress?: (e: PressEvent) => void;
    /** Handler that is called when a press interaction starts. */
    onPressStart?: (e: PressEvent) => void;
    /** Handler that is called when a press interaction ends. */
    onPressEnd?: (e: PressEvent) => void;
    /** Handler that is called when the element is clicked. */
    onClick?: (e: MouseEvent) => void;
    /** Handler that is called when the element receives focus. */
    onFocus?: (e: FocusEvent) => void;
    /** Handler that is called when the element loses focus. */
    onBlur?: (e: FocusEvent) => void;
    /** Handler that is called when the element's focus status changes. */
    onFocusChange?: (isFocused: boolean) => void;
    /** Handler that is called when a key is pressed. */
    onKeyDown?: (e: KeyboardEvent) => void;
    /** Handler that is called when a key is released. */
    onKeyUp?: (e: KeyboardEvent) => void;
    /** Whether to autofocus the element. */
    autoFocus?: boolean;
    /** Indicates the current "page" or state within a set of related elements. */
    'aria-current'?: 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false' | boolean;
    /** Defines a string value that labels the current element. */
    'aria-label'?: string;
    /** Identifies the element (or elements) that labels the current element. */
    'aria-labelledby'?: string;
    /** Identifies the element (or elements) that describes the object. */
    'aria-describedby'?: string;
}
export interface LinkAria {
    /** Props for the link element. */
    linkProps: Record<string, unknown>;
    /** Whether the link is currently pressed. */
    isPressed: Accessor<boolean>;
}
/**
 * Provides the behavior and accessibility implementation for a link component.
 * A link allows a user to navigate to another page or resource within a web page
 * or application.
 */
export declare function createLink(props?: MaybeAccessor<AriaLinkProps>): LinkAria;
//# sourceMappingURL=createLink.d.ts.map