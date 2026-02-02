/**
 * ColorSlider state management.
 * Based on @react-stately/color useColorSliderState.
 */
import { type Accessor } from 'solid-js';
import type { Color, ColorChannel } from './types';
export interface ColorSliderStateOptions {
    /** The current color value (controlled). */
    value?: Color | string;
    /** The default color value (uncontrolled). */
    defaultValue?: Color | string;
    /** Handler called when the color changes. */
    onChange?: (color: Color) => void;
    /** Handler called when dragging ends. */
    onChangeEnd?: (color: Color) => void;
    /** The color channel this slider controls. */
    channel: ColorChannel;
    /** Whether the slider is disabled. */
    isDisabled?: boolean;
    /** The locale for formatting. */
    locale?: string;
}
export interface ColorSliderState {
    /** The current color value. */
    readonly value: Color;
    /** Whether the slider is being dragged. */
    readonly isDragging: boolean;
    /** The color channel being controlled. */
    readonly channel: ColorChannel;
    /** The step value for the channel. */
    readonly step: number;
    /** The page step value for the channel. */
    readonly pageSize: number;
    /** The minimum value for the channel. */
    readonly minValue: number;
    /** The maximum value for the channel. */
    readonly maxValue: number;
    /** Whether the slider is disabled. */
    readonly isDisabled: boolean;
    /** Get the current channel value. */
    getThumbValue(): number;
    /** Get the minimum percent. */
    getThumbMinValue(): number;
    /** Get the maximum percent. */
    getThumbMaxValue(): number;
    /** Get the thumb value as a percentage. */
    getThumbPercent(): number;
    /** Set the channel value. */
    setThumbValue(value: number): void;
    /** Set the thumb value from a percentage (0-1). */
    setThumbPercent(percent: number): void;
    /** Increment the channel value. */
    incrementThumb(stepSize?: number): void;
    /** Decrement the channel value. */
    decrementThumb(stepSize?: number): void;
    /** Set the dragging state. */
    setDragging(isDragging: boolean): void;
    /** Get the display color (with alpha = 1). */
    getDisplayColor(): Color;
    /** Get the formatted value label. */
    getThumbValueLabel(): string;
}
/**
 * Creates state for a color slider.
 */
export declare function createColorSliderState(options: Accessor<ColorSliderStateOptions>): ColorSliderState;
//# sourceMappingURL=createColorSliderState.d.ts.map