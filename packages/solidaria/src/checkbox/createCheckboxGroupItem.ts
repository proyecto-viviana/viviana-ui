/**
 * Checkbox group item hook for Solidaria
 *
 * Provides the behavior and accessibility implementation for a checkbox component
 * contained within a checkbox group.
 *
 * This is a 1:1 port of @react-aria/checkbox's useCheckboxGroupItem hook.
 */

import { JSX } from 'solid-js';
import { createCheckbox, type AriaCheckboxProps, type CheckboxAria } from './createCheckbox';
import { type ToggleState } from '../toggle/createToggleState';
import { checkboxGroupData } from './createCheckboxGroup';
import { type CheckboxGroupState } from './createCheckboxGroupState';
import { type MaybeAccessor, access } from '../utils/reactivity';

// ============================================
// TYPES
// ============================================

export interface AriaCheckboxGroupItemProps extends Omit<AriaCheckboxProps, 'isSelected' | 'defaultSelected'> {
  /** The value of the checkbox. */
  value: string;
}

// ============================================
// IMPLEMENTATION
// ============================================

/**
 * Provides the behavior and accessibility implementation for a checkbox component
 * contained within a checkbox group.
 *
 * @param props - Props for the checkbox.
 * @param state - State for the checkbox group, as returned by `createCheckboxGroupState`.
 * @param inputRef - A ref accessor for the HTML input element.
 */
export function createCheckboxGroupItem(
  props: MaybeAccessor<AriaCheckboxGroupItemProps>,
  state: CheckboxGroupState,
  inputRef: () => HTMLInputElement | null
): CheckboxAria {
  const getProps = () => access(props);

  // Create toggle state that syncs with the group state
  const toggleState: ToggleState = {
    isSelected: () => state.isSelected(getProps().value),
    defaultSelected: state.defaultValue.includes(getProps().value),
    setSelected(isSelected: boolean) {
      const value = getProps().value;
      if (isSelected) {
        state.addValue(value);
      } else {
        state.removeValue(value);
      }
      getProps().onChange?.(isSelected);
    },
    toggle() {
      state.toggleValue(getProps().value);
    },
  };

  // Get group data
  const getGroupData = () => checkboxGroupData.get(state);

  // Build checkbox props
  const checkboxProps = (): AriaCheckboxProps => {
    const p = getProps();
    const groupData = getGroupData();

    return {
      ...p,
      isReadOnly: p.isReadOnly ?? state.isReadOnly,
      isDisabled: p.isDisabled ?? state.isDisabled,
      name: p.name ?? groupData?.name,
      form: p.form ?? groupData?.form,
      isRequired: p.isRequired ?? state.isRequired(),
      validationBehavior: p.validationBehavior ?? groupData?.validationBehavior ?? 'aria',
    };
  };

  // Use the checkbox hook
  const result = createCheckbox(checkboxProps, toggleState, inputRef);

  // Add group-level aria-describedby
  return {
    ...result,
    get inputProps() {
      const baseInputProps = result.inputProps;
      const groupData = getGroupData();

      const describedByIds: string[] = [];

      // Add props aria-describedby
      const propsDescribedBy = getProps()['aria-describedby'];
      if (propsDescribedBy) {
        describedByIds.push(propsDescribedBy);
      }

      // Add error message ID if group is invalid
      if (state.isInvalid && groupData?.errorMessageId) {
        describedByIds.push(groupData.errorMessageId);
      }

      // Add description ID
      if (groupData?.descriptionId) {
        describedByIds.push(groupData.descriptionId);
      }

      const ariaDescribedBy = describedByIds.length > 0 ? describedByIds.join(' ') : undefined;

      return {
        ...baseInputProps,
        'aria-describedby': ariaDescribedBy,
      } as JSX.InputHTMLAttributes<HTMLInputElement>;
    },
  };
}
