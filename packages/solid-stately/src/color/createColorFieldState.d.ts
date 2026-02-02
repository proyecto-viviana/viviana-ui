/**
 * ColorField state management.
 * Based on @react-stately/color useColorFieldState.
 */
import { type Accessor } from 'solid-js';
import type { Color, ColorChannel, ColorFormat } from './types';
export interface ColorFieldStateOptions {
    /** The current color value (controlled). */
    value?: Color | string | null;
    /** The default color value (uncontrolled). */
    defaultValue?: Color | string;
    /** Handler called when the color changes. */
    onChange?: (color: Color | null) => void;
    /** The color channel to edit (for single channel mode). */
    channel?: ColorChannel;
    /** The color format for parsing/displaying. */
    colorFormat?: ColorFormat;
    /** Whether the field is disabled. */
    isDisabled?: boolean;
    /** Whether the field is read-only. */
    isReadOnly?: boolean;
}
export interface ColorFieldState {
    /** The current color value (null if invalid). */
    readonly value: Color | null;
    /** The current input text. */
    readonly inputValue: string;
    /** Whether the input is invalid. */
    readonly isInvalid: boolean;
    /** Whether the field is disabled. */
    readonly isDisabled: boolean;
    /** Whether the field is read-only. */
    readonly isReadOnly: boolean;
    /** The color channel being edited (if single channel mode). */
    readonly channel: ColorChannel | undefined;
    /** Set the input text value. */
    setInputValue(value: string): void;
    /** Commit the current input value. */
    commit(): void;
    /** Increment the color channel value. */
    increment(): void;
    /** Decrement the color channel value. */
    decrement(): void;
    /** Increment by page size. */
    incrementToMax(): void;
    /** Decrement to minimum. */
    decrementToMin(): void;
    /** Validate the current input. */
    validate(): boolean;
}
/**
 * Creates state for a color field (text input for color values).
 */
export declare function createColorFieldState(options: Accessor<ColorFieldStateOptions>): ColorFieldState;
//# sourceMappingURL=createColorFieldState.d.ts.map