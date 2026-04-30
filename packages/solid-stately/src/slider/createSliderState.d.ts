/**
 * Creates state for a slider component.
 * Based on @react-stately/slider useSliderState.
 */
import { type Accessor } from "solid-js";
import { type MaybeAccessor } from "../utils";
export type SliderOrientation = "horizontal" | "vertical";
export interface SliderStateProps {
  /** The current value (controlled). */
  value?: number;
  /** The default value (uncontrolled). */
  defaultValue?: number;
  /** Handler called when the value changes. */
  onChange?: (value: number) => void;
  /** Handler called when the user stops dragging. */
  onChangeEnd?: (value: number) => void;
  /** The minimum value. */
  minValue?: number;
  /** The maximum value. */
  maxValue?: number;
  /** The step value. */
  step?: number;
  /** The orientation of the slider. */
  orientation?: SliderOrientation;
  /** Whether the slider is disabled. */
  isDisabled?: boolean;
  /** The locale for number formatting. */
  locale?: string;
  /** Number format options. */
  formatOptions?: Intl.NumberFormatOptions;
}
export interface SliderState {
  /** The current value. */
  value: Accessor<number>;
  /** Sets the value. */
  setValue: (value: number) => void;
  /** Sets the value by percent (0-1). */
  setValuePercent: (percent: number) => void;
  /** Gets the value as a percent (0-1). */
  getValuePercent: Accessor<number>;
  /** Gets the formatted value string. */
  getFormattedValue: Accessor<string>;
  /** Whether the thumb is being dragged. */
  isDragging: Accessor<boolean>;
  /** Sets the dragging state. */
  setDragging: (dragging: boolean) => void;
  /** Whether the slider is focused. */
  isFocused: Accessor<boolean>;
  /** Sets the focused state. */
  setFocused: (focused: boolean) => void;
  /** Increments the value by step. */
  increment: (stepMultiplier?: number) => void;
  /** Decrements the value by step. */
  decrement: (stepMultiplier?: number) => void;
  /** The minimum value. */
  minValue: number;
  /** The maximum value. */
  maxValue: number;
  /** The step value. */
  step: number;
  /** The page step (larger step for Page Up/Down). */
  pageStep: number;
  /** The orientation. */
  orientation: SliderOrientation;
  /** Whether the slider is disabled. */
  isDisabled: boolean;
}
/**
 * Provides state management for a slider component.
 */
export declare function createSliderState(props: MaybeAccessor<SliderStateProps>): SliderState;
//# sourceMappingURL=createSliderState.d.ts.map
