/**
 * Checkbox group item hook for Solidaria
 *
 * Provides the behavior and accessibility implementation for a checkbox component
 * contained within a checkbox group.
 *
 * This is a 1:1 port of @react-aria/checkbox's useCheckboxGroupItem hook.
 */
import { type AriaCheckboxProps, type CheckboxAria } from './createCheckbox';
import { type CheckboxGroupState } from '@proyecto-viviana/solid-stately';
import { type MaybeAccessor } from '../utils/reactivity';
export interface AriaCheckboxGroupItemProps extends Omit<AriaCheckboxProps, 'isSelected' | 'defaultSelected'> {
    /** The value of the checkbox. */
    value: string;
}
/**
 * Provides the behavior and accessibility implementation for a checkbox component
 * contained within a checkbox group.
 *
 * @param props - Props for the checkbox.
 * @param state - State for the checkbox group, as returned by `createCheckboxGroupState`.
 * @param inputRef - A ref accessor for the HTML input element.
 */
export declare function createCheckboxGroupItem(props: MaybeAccessor<AriaCheckboxGroupItemProps>, state: CheckboxGroupState, inputRef: () => HTMLInputElement | null): CheckboxAria;
//# sourceMappingURL=createCheckboxGroupItem.d.ts.map