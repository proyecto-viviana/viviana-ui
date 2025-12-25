/**
 * State management for NumberField.
 * Based on @react-stately/numberfield useNumberFieldState.
 */

import { createSignal, createMemo, type Accessor } from 'solid-js';
import { access, type MaybeAccessor } from '../utils';

export interface NumberFieldStateProps {
  /** The current value (controlled). */
  value?: number;
  /** The default value (uncontrolled). */
  defaultValue?: number;
  /** Handler called when the value changes. */
  onChange?: (value: number) => void;
  /** The minimum value. */
  minValue?: number;
  /** The maximum value. */
  maxValue?: number;
  /** The step value for increment/decrement. */
  step?: number;
  /** Whether the field is disabled. */
  isDisabled?: boolean;
  /** Whether the field is read-only. */
  isReadOnly?: boolean;
  /** The locale for number formatting. */
  locale?: string;
  /** Number format options. */
  formatOptions?: Intl.NumberFormatOptions;
}

export interface NumberFieldState {
  /** The current input value as a string. */
  inputValue: Accessor<string>;
  /** The current numeric value. */
  numberValue: Accessor<number>;
  /** Whether the value can be incremented. */
  canIncrement: Accessor<boolean>;
  /** Whether the value can be decremented. */
  canDecrement: Accessor<boolean>;
  /** Whether the field is disabled. */
  isDisabled: Accessor<boolean>;
  /** Whether the field is read-only. */
  isReadOnly: Accessor<boolean>;
  /** The minimum value. */
  minValue: Accessor<number | undefined>;
  /** The maximum value. */
  maxValue: Accessor<number | undefined>;
  /** Set the input value. */
  setInputValue: (value: string) => void;
  /** Validate a partial input value. */
  validate: (value: string) => boolean;
  /** Commit the current input value. */
  commit: () => void;
  /** Increment the value by step. */
  increment: () => void;
  /** Decrement the value by step. */
  decrement: () => void;
  /** Set to maximum value. */
  incrementToMax: () => void;
  /** Set to minimum value. */
  decrementToMin: () => void;
}

/**
 * Handles decimal operations to avoid floating point errors.
 */
function handleDecimalOperation(
  operator: '+' | '-',
  value1: number,
  value2: number
): number {
  // Find the number of decimal places
  const getDecimals = (n: number) => {
    const str = String(n);
    const idx = str.indexOf('.');
    return idx === -1 ? 0 : str.length - idx - 1;
  };

  const decimals = Math.max(getDecimals(value1), getDecimals(value2));
  const multiplier = Math.pow(10, decimals);

  const int1 = Math.round(value1 * multiplier);
  const int2 = Math.round(value2 * multiplier);

  const result = operator === '+' ? int1 + int2 : int1 - int2;
  return result / multiplier;
}

/**
 * Clamps a value between min and max.
 */
function clamp(value: number, min?: number, max?: number): number {
  let result = value;
  if (min != null && result < min) result = min;
  if (max != null && result > max) result = max;
  return result;
}

/**
 * Snaps a value to the nearest step.
 */
function snapToStep(value: number, step: number, min?: number): number {
  const base = min ?? 0;
  const diff = value - base;
  const steps = Math.round(diff / step);
  return handleDecimalOperation('+', base, steps * step);
}

/**
 * Creates state for a number field.
 */
export function createNumberFieldState(
  props: MaybeAccessor<NumberFieldStateProps>
): NumberFieldState {
  const getProps = () => access(props);

  // Get locale and formatter
  const locale = () => getProps().locale ?? 'en-US';
  const formatOptions = () => getProps().formatOptions ?? {};

  // Create number formatter
  const formatter = createMemo(() => {
    return new Intl.NumberFormat(locale(), formatOptions());
  });

  // Create number parser (simplified - real implementation would be more robust)
  const parseNumber = (value: string): number => {
    if (!value || value === '' || value === '-') return NaN;

    // Handle locale-specific decimal separators
    const opts = formatOptions();
    const testNumber = formatter().format(1.1);
    const decimalSeparator = testNumber.charAt(1);

    // Normalize the input
    let normalized = value;
    if (decimalSeparator !== '.') {
      normalized = normalized.replace(decimalSeparator, '.');
    }

    // Remove grouping separators and currency symbols
    normalized = normalized.replace(/[^\d.\-]/g, '');

    const parsed = parseFloat(normalized);
    return parsed;
  };

  // Format a number to string
  const formatNumber = (value: number): string => {
    if (isNaN(value)) return '';
    return formatter().format(value);
  };

  // Determine step value
  const step = createMemo(() => {
    const p = getProps();
    if (p.step != null) return p.step;
    // Default step for percent is 0.01
    if (p.formatOptions?.style === 'percent') return 0.01;
    return 1;
  });

  // Internal signals
  const [inputValue, setInputValueInternal] = createSignal<string>('');
  const [numberValue, setNumberValue] = createSignal<number>(NaN);

  // Initialize from props
  const initValue = () => {
    const p = getProps();
    const initial = p.value ?? p.defaultValue;
    if (initial != null) {
      setNumberValue(initial);
      setInputValueInternal(formatNumber(initial));
    }
  };

  // Call init on first access
  let initialized = false;
  const ensureInitialized = () => {
    if (!initialized) {
      initialized = true;
      initValue();
    }
  };

  // Controlled mode: sync with props.value
  const actualNumberValue = createMemo(() => {
    ensureInitialized();
    const p = getProps();
    if (p.value !== undefined) {
      return p.value;
    }
    return numberValue();
  });

  // Validate partial input
  const validate = (value: string): boolean => {
    if (value === '' || value === '-') return true;

    // Allow partial decimal input like "1."
    const opts = formatOptions();
    const testNumber = formatter().format(1.1);
    const decimalSeparator = testNumber.charAt(1);

    // Check if it's a valid partial number
    const pattern = new RegExp(
      `^-?\\d*${decimalSeparator === '.' ? '\\.' : decimalSeparator}?\\d*$`
    );
    return pattern.test(value);
  };

  // Set input value with validation
  const setInputValue = (value: string) => {
    ensureInitialized();
    setInputValueInternal(value);
  };

  // Commit the current input value
  const commit = () => {
    ensureInitialized();
    const p = getProps();
    const input = inputValue();

    if (input === '' || input === '-') {
      // Clear value
      setNumberValue(NaN);
      setInputValueInternal('');
      return;
    }

    let parsed = parseNumber(input);

    if (isNaN(parsed)) {
      // Invalid input - revert to current value
      setInputValueInternal(formatNumber(actualNumberValue()));
      return;
    }

    // Clamp and snap
    parsed = clamp(parsed, p.minValue, p.maxValue);
    parsed = snapToStep(parsed, step(), p.minValue);

    // Update state
    setNumberValue(parsed);
    setInputValueInternal(formatNumber(parsed));

    // Notify change
    if (p.value === undefined) {
      p.onChange?.(parsed);
    } else {
      p.onChange?.(parsed);
    }
  };

  // Check if can increment
  const canIncrement = createMemo(() => {
    ensureInitialized();
    const p = getProps();
    if (p.isDisabled || p.isReadOnly) return false;

    const current = actualNumberValue();
    if (isNaN(current)) return true; // Can start from min

    if (p.maxValue == null) return true;
    return handleDecimalOperation('+', current, step()) <= p.maxValue;
  });

  // Check if can decrement
  const canDecrement = createMemo(() => {
    ensureInitialized();
    const p = getProps();
    if (p.isDisabled || p.isReadOnly) return false;

    const current = actualNumberValue();
    if (isNaN(current)) return true; // Can start from max

    if (p.minValue == null) return true;
    return handleDecimalOperation('-', current, step()) >= p.minValue;
  });

  // Increment by step
  const increment = () => {
    ensureInitialized();
    const p = getProps();
    if (p.isDisabled || p.isReadOnly) return;

    let current = actualNumberValue();

    if (isNaN(current)) {
      // Start from min or 0
      current = p.minValue ?? 0;
    } else {
      // Snap and increment
      current = snapToStep(current, step(), p.minValue);
      current = handleDecimalOperation('+', current, step());
    }

    // Clamp
    current = clamp(current, p.minValue, p.maxValue);

    // Update
    setNumberValue(current);
    setInputValueInternal(formatNumber(current));
    p.onChange?.(current);
  };

  // Decrement by step
  const decrement = () => {
    ensureInitialized();
    const p = getProps();
    if (p.isDisabled || p.isReadOnly) return;

    let current = actualNumberValue();

    if (isNaN(current)) {
      // Start from max or 0
      current = p.maxValue ?? 0;
    } else {
      // Snap and decrement
      current = snapToStep(current, step(), p.minValue);
      current = handleDecimalOperation('-', current, step());
    }

    // Clamp
    current = clamp(current, p.minValue, p.maxValue);

    // Update
    setNumberValue(current);
    setInputValueInternal(formatNumber(current));
    p.onChange?.(current);
  };

  // Set to max
  const incrementToMax = () => {
    ensureInitialized();
    const p = getProps();
    if (p.isDisabled || p.isReadOnly) return;

    if (p.maxValue == null) return;

    const snapped = snapToStep(p.maxValue, step(), p.minValue);
    setNumberValue(snapped);
    setInputValueInternal(formatNumber(snapped));
    p.onChange?.(snapped);
  };

  // Set to min
  const decrementToMin = () => {
    ensureInitialized();
    const p = getProps();
    if (p.isDisabled || p.isReadOnly) return;

    if (p.minValue == null) return;

    setNumberValue(p.minValue);
    setInputValueInternal(formatNumber(p.minValue));
    p.onChange?.(p.minValue);
  };

  return {
    get inputValue() {
      ensureInitialized();
      return inputValue;
    },
    get numberValue() {
      return actualNumberValue;
    },
    canIncrement,
    canDecrement,
    isDisabled: () => getProps().isDisabled ?? false,
    isReadOnly: () => getProps().isReadOnly ?? false,
    minValue: () => getProps().minValue,
    maxValue: () => getProps().maxValue,
    setInputValue,
    validate,
    commit,
    increment,
    decrement,
    incrementToMax,
    decrementToMin,
  };
}
