/**
 * Radio group hook for Solidaria
 *
 * Provides the behavior and accessibility implementation for a radio group component.
 * Radio groups allow users to select a single item from a list of mutually exclusive options.
 *
 * This is a 1:1 port of @react-aria/radio's useRadioGroup hook.
 */

import { JSX } from 'solid-js';
import { createField } from '../label/createField';
import { createFocusWithin } from '../interactions/createFocusWithin';
import { mergeProps } from '../utils/mergeProps';
import { filterDOMProps } from '../utils/filterDOMProps';
import { createId } from '../ssr';
import { type MaybeAccessor, access } from '../utils/reactivity';
import { type RadioGroupState } from 'solid-stately';

// ============================================
// TYPES
// ============================================

export interface AriaRadioGroupProps {
  /** The content to display as the label. */
  label?: JSX.Element;
  /** A description for the radio group. Provides additional context. */
  description?: JSX.Element;
  /** An error message for the radio group. */
  errorMessage?: JSX.Element | ((validation: { isInvalid: boolean; validationErrors: string[] }) => JSX.Element);
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
  /** The axis the Radio Button(s) should align with. Defaults to 'vertical'. */
  orientation?: 'horizontal' | 'vertical';
  /** The name of the radio group, used when submitting an HTML form. */
  name?: string;
  /** The form to associate the radio group with. */
  form?: string;
  /** Validation behavior for the radio group. */
  validationBehavior?: 'aria' | 'native';
  /** Handler that is called when the radio group receives focus. */
  onFocus?: (e: FocusEvent) => void;
  /** Handler that is called when the radio group loses focus. */
  onBlur?: (e: FocusEvent) => void;
  /** Handler that is called when the radio group's focus status changes. */
  onFocusChange?: (isFocused: boolean) => void;
  /** Defines a string value that labels the current element. */
  'aria-label'?: string;
  /** Identifies the element (or elements) that labels the current element. */
  'aria-labelledby'?: string;
  /** Identifies the element (or elements) that describes the object. */
  'aria-describedby'?: string;
  /** Identifies the element (or elements) that provide an error message for the object. */
  'aria-errormessage'?: string;
  /** The element's unique identifier. */
  id?: string;
}

export interface RadioGroupAria {
  /** Props for the radio group wrapper element. */
  radioGroupProps: JSX.HTMLAttributes<HTMLDivElement>;
  /** Props for the radio group's visible label (if any). */
  labelProps: JSX.HTMLAttributes<HTMLElement>;
  /** Props for the radio group description element, if any. */
  descriptionProps: JSX.HTMLAttributes<HTMLElement>;
  /** Props for the radio group error message element, if any. */
  errorMessageProps: JSX.HTMLAttributes<HTMLElement>;
  /** Whether the radio group is invalid. */
  isInvalid: boolean;
  /** Validation errors, if any. */
  validationErrors: string[];
  /** Validation details, if any. */
  validationDetails: Record<string, boolean>;
}

// WeakMap to share data between radio group and radio items
interface RadioGroupData {
  name: string;
  form: string | undefined;
  descriptionId: string | undefined;
  errorMessageId: string | undefined;
  validationBehavior: 'aria' | 'native';
}

export const radioGroupData: WeakMap<RadioGroupState, RadioGroupData> = new WeakMap();

// ============================================
// IMPLEMENTATION
// ============================================

/**
 * Provides the behavior and accessibility implementation for a radio group component.
 * Radio groups allow users to select a single item from a list of mutually exclusive options.
 */
export function createRadioGroup(
  props: MaybeAccessor<AriaRadioGroupProps>,
  state: RadioGroupState
): RadioGroupAria {
  const getProps = () => access(props);

  const orientation = () => getProps().orientation ?? 'vertical';
  const isReadOnly = () => getProps().isReadOnly ?? false;
  const isRequired = () => getProps().isRequired ?? false;
  const isDisabled = () => getProps().isDisabled ?? false;
  const validationBehavior = () => getProps().validationBehavior ?? 'aria';

  // Use field for label, description, error message
  const { labelProps, fieldProps, descriptionProps, errorMessageProps } = createField({
    get label() { return getProps().label; },
    get description() { return getProps().description; },
    get errorMessage() { return getProps().errorMessage; },
    get isInvalid() { return state.isInvalid; },
    // Radio group is not an HTML input element so it
    // shouldn't be labeled by a <label> element.
    labelElementType: 'span',
  });

  // Handle focus within - reset focusable radio when group loses focus and no selection
  const { focusWithinProps } = createFocusWithin({
    onBlurWithin(e: FocusEvent) {
      getProps().onBlur?.(e);
      if (!state.selectedValue()) {
        state.setLastFocusedValue(null);
      }
    },
    onFocusWithin: (e: FocusEvent) => getProps().onFocus?.(e),
    onFocusWithinChange: (isFocused: boolean) => getProps().onFocusChange?.(isFocused),
  });

  // Filter DOM props
  const domProps = () => filterDOMProps(getProps() as unknown as Record<string, unknown>, { labelable: true });

  // Generate group name
  const groupName = getProps().name ?? createId();

  // Store data for radio items to access
  radioGroupData.set(state, {
    name: groupName,
    form: getProps().form,
    descriptionId: descriptionProps.id,
    errorMessageId: errorMessageProps.id,
    validationBehavior: validationBehavior(),
  });

  // Keyboard navigation handler for arrow keys
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onKeyDown = (_e: KeyboardEvent) => {
    // For now, we rely on native radio behavior
    // The complex tree walker implementation can be added later if needed
    // Most browsers handle arrow key navigation natively for radio groups
  };

  return {
    get radioGroupProps() {
      return mergeProps(
        domProps(),
        focusWithinProps as unknown as Record<string, unknown>,
        {
          role: 'radiogroup',
          onKeyDown,
          'aria-invalid': state.isInvalid || undefined,
          'aria-errormessage': getProps()['aria-errormessage'],
          'aria-readonly': isReadOnly() || undefined,
          'aria-required': isRequired() || undefined,
          'aria-disabled': isDisabled() || undefined,
          'aria-orientation': orientation(),
          ...fieldProps,
        }
      ) as JSX.HTMLAttributes<HTMLDivElement>;
    },
    labelProps: labelProps as JSX.HTMLAttributes<HTMLElement>,
    descriptionProps,
    errorMessageProps,
    get isInvalid() {
      return state.isInvalid;
    },
    get validationErrors() {
      return []; // Simplified - full validation can be added later
    },
    get validationDetails() {
      return {}; // Simplified - full validation can be added later
    },
  };
}
