/**
 * Picker module compatibility entrypoint for proyecto-viviana-silapse.
 */

export {
  Select as Picker,
  SelectTrigger as PickerTrigger,
  SelectValue as PickerValue,
  SelectListBox as PickerListBox,
  SelectOption as PickerItem,
  SelectOption as Item,
} from '../select';
export type {
  SelectProps as PickerProps,
  SelectTriggerProps as PickerTriggerProps,
  SelectValueProps as PickerValueProps,
  SelectListBoxProps as PickerListBoxProps,
  SelectOptionProps as PickerItemProps,
  SelectSize as PickerSize,
} from '../select';
