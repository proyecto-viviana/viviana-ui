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

// Tabs
export {
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabsContext,
  TabsStateContext,
  type TabsProps,
  type TabsRenderProps,
  type TabListProps,
  type TabListRenderProps,
  type TabProps,
  type TabRenderProps,
  type TabPanelProps,
  type TabPanelRenderProps,
} from './Tabs';

// Breadcrumbs
export {
  Breadcrumbs,
  BreadcrumbItem,
  BreadcrumbsContext,
  type BreadcrumbsProps,
  type BreadcrumbsRenderProps,
  type BreadcrumbItemProps,
  type BreadcrumbItemRenderProps,
} from './Breadcrumbs';

// NumberField
export {
  NumberField,
  NumberFieldLabel,
  NumberFieldGroup,
  NumberFieldInput,
  NumberFieldIncrementButton,
  NumberFieldDecrementButton,
  NumberFieldContext,
  type NumberFieldProps,
  type NumberFieldRenderProps,
  type NumberFieldInputProps,
  type NumberFieldInputRenderProps,
  type NumberFieldIncrementButtonProps,
  type NumberFieldDecrementButtonProps,
  type NumberFieldButtonRenderProps,
} from './NumberField';

// SearchField
export {
  SearchField,
  SearchFieldLabel,
  SearchFieldInput,
  SearchFieldClearButton,
  SearchFieldContext,
  type SearchFieldProps,
  type SearchFieldRenderProps,
  type SearchFieldInputProps,
  type SearchFieldInputRenderProps,
  type SearchFieldClearButtonProps,
  type SearchFieldClearButtonRenderProps,
} from './SearchField';

// Slider
export {
  Slider,
  SliderTrack,
  SliderThumb,
  SliderOutput,
  SliderContext,
  type SliderProps,
  type SliderRenderProps,
  type SliderTrackProps,
  type SliderTrackRenderProps,
  type SliderThumbProps,
  type SliderThumbRenderProps,
  type SliderOutputProps,
  type SliderOutputRenderProps,
} from './Slider';

// Tooltip
export {
  Tooltip,
  TooltipTrigger,
  type TooltipProps,
  type TooltipRenderProps,
  type TooltipTriggerComponentProps,
  type TooltipTriggerState,
} from './Tooltip';

// ComboBox
export {
  ComboBox,
  ComboBoxInput,
  ComboBoxButton,
  ComboBoxListBox,
  ComboBoxOption,
  ComboBoxContext,
  ComboBoxStateContext,
  defaultContainsFilter,
  type ComboBoxProps,
  type ComboBoxRenderProps,
  type ComboBoxInputProps,
  type ComboBoxInputRenderProps,
  type ComboBoxButtonProps,
  type ComboBoxButtonRenderProps,
  type ComboBoxListBoxProps,
  type ComboBoxListBoxRenderProps,
  type ComboBoxOptionProps,
  type ComboBoxOptionRenderProps,
} from './ComboBox';

// Dialog
export {
  Dialog,
  DialogTrigger,
  DialogContext,
  DialogTriggerContext,
  useDialogTrigger,
  Heading,
  DialogHeading,
  type DialogProps,
  type DialogRenderProps,
  type DialogTriggerProps,
  type HeadingProps,
} from './Dialog';

// Modal
export {
  Modal,
  ModalOverlay,
  OverlayTriggerStateContext,
  useOverlayTriggerState,
  type ModalProps,
  type ModalOverlayProps,
  type ModalRenderProps,
  type OverlayTriggerState,
} from './Modal'

// Popover
export {
  Popover,
  PopoverTrigger,
  PopoverContext,
  PopoverTriggerContext,
  usePopoverTrigger,
  OverlayArrow,
  type PopoverProps,
  type PopoverRenderProps,
  type PopoverTriggerProps,
  type PopoverTriggerContextValue,
  type OverlayArrowProps,
} from './Popover';
