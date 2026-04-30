/**
 * ColorField state management.
 * Based on @react-stately/color useColorFieldState.
 */

import { createSignal, createMemo, type Accessor } from "solid-js";
import type { Color, ColorChannel, ColorFormat } from "./types";
import { normalizeColor, parseColor } from "./Color";

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
export function createColorFieldState(options: Accessor<ColorFieldStateOptions>): ColorFieldState {
  const getOptions = () => options();

  // Internal value state
  const [internalValue, setInternalValue] = createSignal<Color | null>(null);
  const [inputValue, setInputValueInternal] = createSignal("");
  const [isInvalid, setIsInvalid] = createSignal(false);

  // Initialize internal value
  const initValue = () => {
    const opts = getOptions();
    if (opts.defaultValue) {
      const color = normalizeColor(opts.defaultValue);
      return color;
    }
    return null;
  };

  // Set initial value
  if (internalValue() === null) {
    const init = initValue();
    if (init) {
      setInternalValue(init);
      setInputValueInternal(formatColorValue(init, getOptions().channel, getOptions().colorFormat));
    }
  }

  // Controlled vs uncontrolled value
  const value = createMemo(() => {
    const opts = getOptions();
    if (opts.value !== undefined) {
      if (opts.value === null) return null;
      return normalizeColor(opts.value);
    }
    return internalValue();
  });

  const channel = createMemo(() => getOptions().channel);
  const isDisabled = createMemo(() => getOptions().isDisabled ?? false);
  const isReadOnly = createMemo(() => getOptions().isReadOnly ?? false);

  // Format color value for display
  function formatColorValue(
    color: Color | null,
    chan?: ColorChannel,
    format?: ColorFormat,
  ): string {
    if (!color) return "";

    // Single channel mode
    if (chan) {
      return String(color.getChannelValue(chan));
    }

    // Full color mode
    return color.toString(format ?? "hex");
  }

  // Update value
  const updateValue = (newColor: Color | null) => {
    const opts = getOptions();

    // Controlled mode
    if (opts.value !== undefined) {
      opts.onChange?.(newColor);
      return;
    }

    // Uncontrolled mode
    setInternalValue(newColor);
    opts.onChange?.(newColor);
  };

  // Set input value
  const setInputValue = (text: string) => {
    setInputValueInternal(text);
    setIsInvalid(false);
  };

  // Commit the input value
  const commit = () => {
    const text = inputValue().trim();
    const opts = getOptions();
    const chan = channel();

    if (!text) {
      updateValue(null);
      setIsInvalid(false);
      return;
    }

    try {
      let newColor: Color;

      if (chan) {
        // Single channel mode - parse as number and update channel
        const numValue = parseFloat(text);
        if (isNaN(numValue)) {
          setIsInvalid(true);
          return;
        }

        const currentColor = value();
        if (!currentColor) {
          setIsInvalid(true);
          return;
        }

        const range = currentColor.getChannelRange(chan);
        const clamped = Math.max(range.minValue, Math.min(range.maxValue, numValue));
        newColor = currentColor.withChannelValue(chan, clamped);
      } else {
        // Full color mode - parse the color string
        newColor = parseColor(text);
        if (opts.colorFormat) {
          newColor = newColor.toFormat(opts.colorFormat);
        }
      }

      updateValue(newColor);
      setInputValueInternal(formatColorValue(newColor, chan, opts.colorFormat));
      setIsInvalid(false);
    } catch {
      setIsInvalid(true);
    }
  };

  // Increment channel value
  const increment = () => {
    const chan = channel();
    const currentColor = value();
    if (!currentColor || !chan) return;

    const currentVal = currentColor.getChannelValue(chan);
    const range = currentColor.getChannelRange(chan);
    const newVal = Math.min(range.maxValue, currentVal + range.step);
    const newColor = currentColor.withChannelValue(chan, newVal);

    updateValue(newColor);
    setInputValueInternal(formatColorValue(newColor, chan, getOptions().colorFormat));
  };

  // Decrement channel value
  const decrement = () => {
    const chan = channel();
    const currentColor = value();
    if (!currentColor || !chan) return;

    const currentVal = currentColor.getChannelValue(chan);
    const range = currentColor.getChannelRange(chan);
    const newVal = Math.max(range.minValue, currentVal - range.step);
    const newColor = currentColor.withChannelValue(chan, newVal);

    updateValue(newColor);
    setInputValueInternal(formatColorValue(newColor, chan, getOptions().colorFormat));
  };

  // Increment to max
  const incrementToMax = () => {
    const chan = channel();
    const currentColor = value();
    if (!currentColor || !chan) return;

    const range = currentColor.getChannelRange(chan);
    const newColor = currentColor.withChannelValue(chan, range.maxValue);

    updateValue(newColor);
    setInputValueInternal(formatColorValue(newColor, chan, getOptions().colorFormat));
  };

  // Decrement to min
  const decrementToMin = () => {
    const chan = channel();
    const currentColor = value();
    if (!currentColor || !chan) return;

    const range = currentColor.getChannelRange(chan);
    const newColor = currentColor.withChannelValue(chan, range.minValue);

    updateValue(newColor);
    setInputValueInternal(formatColorValue(newColor, chan, getOptions().colorFormat));
  };

  // Validate input
  const validate = () => {
    const text = inputValue().trim();
    const chan = channel();

    if (!text) return true;

    try {
      if (chan) {
        const numValue = parseFloat(text);
        return !isNaN(numValue);
      } else {
        parseColor(text);
        return true;
      }
    } catch {
      return false;
    }
  };

  return {
    get value() {
      return value();
    },
    get inputValue() {
      return inputValue();
    },
    get isInvalid() {
      return isInvalid();
    },
    get isDisabled() {
      return isDisabled();
    },
    get isReadOnly() {
      return isReadOnly();
    },
    get channel() {
      return channel();
    },
    setInputValue,
    commit,
    increment,
    decrement,
    incrementToMax,
    decrementToMin,
    validate,
  };
}
