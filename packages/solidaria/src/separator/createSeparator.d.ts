/**
 * createSeparator - SolidJS implementation of React Aria's useSeparator
 *
 * A separator is a visual divider between two groups of content,
 * e.g. groups of menu items or sections of a page.
 */
import type { JSX } from 'solid-js';
import { type MaybeAccessor } from '../utils';
export type Orientation = 'horizontal' | 'vertical';
export interface AriaSeparatorProps {
    /**
     * The orientation of the separator.
     * @default 'horizontal'
     */
    orientation?: Orientation;
    /**
     * The HTML element type that will be used to render the separator.
     * @default 'hr'
     */
    elementType?: string;
    /** An accessibility label for the separator. */
    'aria-label'?: string;
    /** Identifies the element(s) that labels the separator. */
    'aria-labelledby'?: string;
    /** The element's unique identifier. */
    id?: string;
}
export interface SeparatorAria {
    /** Props for the separator element. */
    separatorProps: JSX.HTMLAttributes<HTMLElement>;
}
/**
 * Provides the accessibility implementation for a separator.
 * A separator is a visual divider between two groups of content,
 * e.g. groups of menu items or sections of a page.
 */
export declare function createSeparator(props?: MaybeAccessor<AriaSeparatorProps>): SeparatorAria;
//# sourceMappingURL=createSeparator.d.ts.map