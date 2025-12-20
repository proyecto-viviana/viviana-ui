/**
 * Radio group state for Solidaria
 *
 * Provides state management for a radio group component.
 * Provides a name for the group, and manages selection and focus state.
 *
 * This is a 1:1 port of @react-stately/radio's useRadioGroupState.
 */

import { createSignal, Accessor, untrack } from 'solid-js';
import { type MaybeAccessor, access } from '../utils/reactivity';
import { createId } from '../ssr';

// ============================================
// TYPES
// ============================================

export interface RadioGroupProps {
  /** The current selected value (controlled). */
  value?: string | null;
  /** The default selected value (uncontrolled). */
  defaultValue?: string | null;
  /** Handler that is called when the value changes. */
  onChange?: (value: string) => void;
  /** Whether the radio group is disabled. */
  isDisabled?: boolean;
  /** Whether the radio group is read only. */
  isReadOnly?: boolean;
  /** Whether the radio group is required. */
  isRequired?: boolean;
  /** Whether the radio group is invalid. */
  isInvalid?: boolean;
  /**
   * The current validation state of the radio group.
   * @deprecated Use `isInvalid` instead.
   */
  validationState?: 'valid' | 'invalid';
  /** The name of the radio group, used when submitting an HTML form. */
  name?: string;
  /** The form to associate the radio group with. */
  form?: string;
  /** The label for the radio group. */
  label?: string;
  /** Orientation of the radio group. */
  orientation?: 'horizontal' | 'vertical';
  /** Handler that is called when the radio group receives focus. */
  onFocus?: (e: FocusEvent) => void;
  /** Handler that is called when the radio group loses focus. */
  onBlur?: (e: FocusEvent) => void;
  /** Handler that is called when the radio group's focus status changes. */
  onFocusChange?: (isFocused: boolean) => void;
}

export interface RadioGroupState {
  /**
   * The name for the group, used for native form submission.
   * @deprecated
   * @private
   */
  readonly name: string;

  /** Whether the radio group is disabled. */
  readonly isDisabled: boolean;

  /** Whether the radio group is read only. */
  readonly isReadOnly: boolean;

  /** Whether the radio group is required. */
  readonly isRequired: boolean;

  /**
   * Whether the radio group is valid or invalid.
   * @deprecated Use `isInvalid` instead.
   */
  readonly validationState: 'valid' | 'invalid' | null;

  /** Whether the radio group is invalid. */
  readonly isInvalid: boolean;

  /** The currently selected value. */
  readonly selectedValue: Accessor<string | null>;

  /** The default selected value. */
  readonly defaultSelectedValue: string | null;

  /** Sets the selected value. */
  setSelectedValue(value: string | null): void;

  /** The value of the last focused radio. */
  readonly lastFocusedValue: Accessor<string | null>;

  /** Sets the last focused value. */
  setLastFocusedValue(value: string | null): void;
}

// ============================================
// INTERNAL: SolidJS-specific sync mechanism
// ============================================

/**
 * Internal WeakMap to store sync version accessors for each radio group state.
 * This is used by createRadio to trigger DOM sync when native radio behavior
 * causes the DOM checked state to desync from our reactive state.
 *
 * This is kept separate from RadioGroupState to maintain API parity with React-Aria.
 * @internal
 */
export const radioGroupSyncVersion: WeakMap<RadioGroupState, Accessor<number>> = new WeakMap();

// ============================================
// IMPLEMENTATION
// ============================================

/**
 * Provides state management for a radio group component.
 * Provides a name for the group, and manages selection and focus state.
 */
export function createRadioGroupState(
  props: MaybeAccessor<RadioGroupProps> = {}
): RadioGroupState {
  const getProps = () => access(props);

  // Get initial props using untrack to avoid setting up dependencies
  // This ensures we capture the initial defaultValue without reactivity issues
  const initialProps = untrack(() => getProps());

  // Generate name - preserved for backward compatibility
  // React Aria now generates the name instead of stately
  const name = initialProps.name || `radio-group-${createId()}`;

  // Create internal signal for uncontrolled mode
  // Initialize with defaultValue only (not value, which is for controlled mode)
  const [internalValue, setInternalValue] = createSignal<string | null>(
    initialProps.defaultValue ?? null
  );
  const [lastFocusedValue, setLastFocusedValueInternal] = createSignal<string | null>(null);

  // SolidJS-specific: Version counter for triggering DOM sync across all radios
  // This handles the case where native radio behavior causes DOM state to desync
  // from our reactive state (e.g., clicking a radio unchecks siblings in the DOM)
  const [syncVersion, setSyncVersion] = createSignal(0);

  // Determine if controlled - must be reactive to handle dynamic props
  const isControlled = () => getProps().value !== undefined;

  // Get current value - reactive for both controlled and uncontrolled modes
  const selectedValue: Accessor<string | null> = () => {
    const p = getProps();
    // In controlled mode, always read from props.value reactively
    // In uncontrolled mode, read from internal signal
    if (p.value !== undefined) {
      return p.value ?? null;
    }
    return internalValue();
  };

  // Check if invalid
  const isInvalid = () => {
    const p = getProps();
    return p.isInvalid ?? p.validationState === 'invalid';
  };

  // Set value
  function setSelectedValue(value: string | null): void {
    const p = getProps();
    if (p.isReadOnly || p.isDisabled) {
      return;
    }

    // Always increment syncVersion to trigger DOM sync across all radios
    // This is crucial for SolidJS because:
    // 1. Native radio behavior unchecks siblings when one is checked
    // 2. In controlled mode, isSelected() may not change even though DOM changed
    // 3. We need ALL radios to re-sync their checked state after any click
    setSyncVersion((v) => v + 1);

    if (!isControlled()) {
      setInternalValue(value);
    }

    if (value != null) {
      p.onChange?.(value);
    }
  }

  // Set last focused value
  function setLastFocusedValue(value: string | null): void {
    setLastFocusedValueInternal(value);
  }

  const state: RadioGroupState = {
    name,
    selectedValue,
    defaultSelectedValue: initialProps.defaultValue ?? null,
    setSelectedValue,
    lastFocusedValue,
    setLastFocusedValue,
    get isDisabled() {
      return getProps().isDisabled ?? false;
    },
    get isReadOnly() {
      return getProps().isReadOnly ?? false;
    },
    get isRequired() {
      return getProps().isRequired ?? false;
    },
    get validationState() {
      const p = getProps();
      return p.validationState ?? (isInvalid() ? 'invalid' : null);
    },
    get isInvalid() {
      return isInvalid();
    },
  };

  // Store syncVersion in internal WeakMap (not part of public API)
  // This maintains API parity with React-Aria while supporting SolidJS's reactivity needs
  radioGroupSyncVersion.set(state, syncVersion);

  return state;
}
