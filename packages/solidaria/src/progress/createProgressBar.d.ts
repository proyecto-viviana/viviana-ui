/**
 * ProgressBar hook for Solidaria
 *
 * Provides the accessibility implementation for a progress bar component.
 * Progress bars show either determinate or indeterminate progress of an operation
 * over time.
 *
 * This is a 1:1 port of @react-aria/progress's useProgressBar hook.
 */
import { type MaybeAccessor } from '../utils/reactivity';
export interface AriaProgressBarProps {
    /** The current value (controlled). */
    value?: number;
    /** The smallest value allowed for the input. @default 0 */
    minValue?: number;
    /** The largest value allowed for the input. @default 100 */
    maxValue?: number;
    /** The content to display as the value's label (e.g. 1 of 4). */
    valueLabel?: string;
    /** Whether presentation is indeterminate when progress isn't known. */
    isIndeterminate?: boolean;
    /** The display format of the value label. */
    formatOptions?: Intl.NumberFormatOptions;
    /** The content to display as the label. */
    label?: string;
    /** An accessibility label for this item. */
    'aria-label'?: string;
    /** Identifies the element (or elements) that labels the current element. */
    'aria-labelledby'?: string;
    /** Identifies the element (or elements) that describes the object. */
    'aria-describedby'?: string;
    /** Identifies the element (or elements) that provide a detailed, extended description for the object. */
    'aria-details'?: string;
}
export interface ProgressBarAria {
    /** Props for the progress bar container element. */
    progressBarProps: Record<string, unknown>;
    /** Props for the progress bar's visual label element (if any). */
    labelProps: Record<string, unknown>;
}
/**
 * Provides the accessibility implementation for a progress bar component.
 * Progress bars show either determinate or indeterminate progress of an operation
 * over time.
 */
export declare function createProgressBar(props?: MaybeAccessor<AriaProgressBarProps>): ProgressBarAria;
//# sourceMappingURL=createProgressBar.d.ts.map