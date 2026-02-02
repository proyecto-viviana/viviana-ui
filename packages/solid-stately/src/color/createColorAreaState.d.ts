/**
 * ColorArea state management.
 * Based on @react-stately/color useColorAreaState.
 */
import { type Accessor } from 'solid-js';
import type { Color, ColorChannel } from './types';
export interface ColorAreaStateOptions {
    /** The current color value (controlled). */
    value?: Color | string;
    /** The default color value (uncontrolled). */
    defaultValue?: Color | string;
    /** Handler called when the color changes. */
    onChange?: (color: Color) => void;
    /** Handler called when dragging ends. */
    onChangeEnd?: (color: Color) => void;
    /** The color channel for the X axis. */
    xChannel?: ColorChannel;
    /** The color channel for the Y axis. */
    yChannel?: ColorChannel;
    /** Whether the area is disabled. */
    isDisabled?: boolean;
}
export interface ColorAreaState {
    /** The current color value. */
    readonly value: Color;
    /** The X axis channel. */
    readonly xChannel: ColorChannel;
    /** The Y axis channel. */
    readonly yChannel: ColorChannel;
    /** The Z axis channel (the third channel). */
    readonly zChannel: ColorChannel;
    /** Whether the area is being dragged. */
    readonly isDragging: boolean;
    /** Whether the area is disabled. */
    readonly isDisabled: boolean;
    /** Step for X channel. */
    readonly xChannelStep: number;
    /** Step for Y channel. */
    readonly yChannelStep: number;
    /** Page step for X channel. */
    readonly xChannelPageStep: number;
    /** Page step for Y channel. */
    readonly yChannelPageStep: number;
    /** Get the X channel value. */
    getXValue(): number;
    /** Get the Y channel value. */
    getYValue(): number;
    /** Set the X channel value. */
    setXValue(value: number): void;
    /** Set the Y channel value. */
    setYValue(value: number): void;
    /** Set color from a point (0-1, 0-1). */
    setColorFromPoint(x: number, y: number): void;
    /** Get the thumb position as percentages. */
    getThumbPosition(): {
        x: number;
        y: number;
    };
    /** Increment X value. */
    incrementX(stepSize?: number): void;
    /** Decrement X value. */
    decrementX(stepSize?: number): void;
    /** Increment Y value. */
    incrementY(stepSize?: number): void;
    /** Decrement Y value. */
    decrementY(stepSize?: number): void;
    /** Set the dragging state. */
    setDragging(isDragging: boolean): void;
    /** Get the display color (with alpha = 1). */
    getDisplayColor(): Color;
}
/**
 * Creates state for a color area (2D color picker).
 */
export declare function createColorAreaState(options: Accessor<ColorAreaStateOptions>): ColorAreaState;
//# sourceMappingURL=createColorAreaState.d.ts.map