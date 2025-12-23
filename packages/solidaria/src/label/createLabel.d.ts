/**
 * Label hook for Solidaria
 *
 * Provides the accessibility implementation for labels and their associated elements.
 * Labels provide context for user inputs.
 *
 * This is a 1:1 port of @react-aria/label's useLabel hook.
 */
import { JSX } from 'solid-js';
import { type MaybeAccessor } from '../utils/reactivity';
export interface AriaLabelingProps {
    /** Defines a string value that labels the current element. */
    'aria-label'?: string;
    /** Identifies the element (or elements) that labels the current element. */
    'aria-labelledby'?: string;
    /** Identifies the element (or elements) that describes the object. */
    'aria-describedby'?: string;
    /** Identifies the element (or elements) that provide a detailed, extended description for the object. */
    'aria-details'?: string;
}
export interface LabelableProps {
    /** The content to display as the label. */
    label?: JSX.Element;
}
export interface DOMProps {
    /** The element's unique identifier. */
    id?: string;
}
export interface LabelAriaProps extends LabelableProps, DOMProps, AriaLabelingProps {
    /**
     * The HTML element used to render the label, e.g. 'label', or 'span'.
     * @default 'label'
     */
    labelElementType?: 'label' | 'span' | 'div';
}
export interface LabelAria {
    /** Props to apply to the label container element. */
    labelProps: JSX.LabelHTMLAttributes<HTMLLabelElement> | JSX.HTMLAttributes<HTMLSpanElement>;
    /** Props to apply to the field container element being labeled. */
    fieldProps: AriaLabelingProps & DOMProps;
}
/**
 * Provides the accessibility implementation for labels and their associated elements.
 * Labels provide context for user inputs.
 *
 * @param props - The props for labels and fields.
 */
export declare function createLabel(props: MaybeAccessor<LabelAriaProps>): LabelAria;
//# sourceMappingURL=createLabel.d.ts.map