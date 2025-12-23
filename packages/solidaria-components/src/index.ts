/**
 * solidaria-components
 *
 * Pre-wired headless components for SolidJS.
 * Port of react-aria-components.
 *
 * These components combine state management + accessibility hooks into
 * ready-to-style components using the render props pattern and data attributes.
 */

// Utilities
export {
  type RenderChildren,
  type ClassNameOrFunction,
  type StyleOrFunction,
  type RenderPropsBase,
  type SlotProps,
  useRenderProps,
  filterDOMProps,
  removeDataAttributes,
  createDataAttributes,
  dataAttr,
} from './utils';

// VisuallyHidden
export {
  VisuallyHidden,
  type VisuallyHiddenProps,
} from './VisuallyHidden';

// Button
export {
  Button,
  ButtonContext,
  type ButtonProps,
  type ButtonRenderProps,
} from './Button';

// ToggleSwitch (named to avoid conflict with SolidJS's Switch)
export {
  ToggleSwitch,
  ToggleSwitchContext,
  type ToggleSwitchProps,
  type ToggleSwitchRenderProps,
} from './Switch';

// Checkbox
export {
  Checkbox,
  CheckboxGroup,
  CheckboxContext,
  CheckboxGroupContext,
  CheckboxGroupStateContext,
  type CheckboxProps,
  type CheckboxRenderProps,
  type CheckboxGroupProps,
  type CheckboxGroupRenderProps,
} from './Checkbox';

// Radio
export {
  Radio,
  RadioGroup,
  RadioContext,
  RadioGroupContext,
  RadioGroupStateContext,
  type RadioProps,
  type RadioRenderProps,
  type RadioGroupProps,
  type RadioGroupRenderProps,
  type Orientation,
} from './RadioGroup';

// TextField
export {
  TextField,
  TextFieldContext,
  Label,
  Input,
  TextArea,
  type TextFieldProps,
  type TextFieldRenderProps,
  type TextFieldContextValue,
  type LabelProps,
  type InputProps,
  type TextAreaProps,
} from './TextField';

// Link
export {
  Link,
  LinkContext,
  type LinkProps,
  type LinkRenderProps,
} from './Link';

// ProgressBar
export {
  ProgressBar,
  ProgressBarContext,
  type ProgressBarProps,
  type ProgressBarRenderProps,
} from './ProgressBar';

// Separator
export {
  Separator,
  SeparatorContext,
  type SeparatorProps,
  type SeparatorRenderProps,
} from './Separator';

// ListBox
export {
  ListBox,
  ListBoxOption,
  ListBoxContext,
  ListBoxStateContext,
  type ListBoxProps,
  type ListBoxRenderProps,
  type ListBoxOptionProps,
  type ListBoxOptionRenderProps,
} from './ListBox';

// Menu
export {
  Menu,
  MenuItem,
  MenuTrigger,
  MenuButton,
  MenuContext,
  MenuStateContext,
  MenuTriggerContext,
  type MenuProps,
  type MenuRenderProps,
  type MenuItemProps,
  type MenuItemRenderProps,
  type MenuTriggerProps,
  type MenuTriggerRenderProps,
  type MenuButtonProps,
} from './Menu';

// Select
export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectListBox,
  SelectOption,
  SelectContext,
  SelectStateContext,
  type SelectProps,
  type SelectRenderProps,
  type SelectTriggerProps,
  type SelectTriggerRenderProps,
  type SelectValueProps,
  type SelectValueRenderProps,
  type SelectListBoxProps,
  type SelectListBoxRenderProps,
  type SelectOptionProps,
  type SelectOptionRenderProps,
} from './Select';
