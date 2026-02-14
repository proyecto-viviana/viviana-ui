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

// ToggleButton
export {
  ToggleButton,
  ToggleButtonContext,
  type ToggleButtonProps,
  type ToggleButtonRenderProps,
} from './ToggleButton';

// ToggleButtonGroup
export {
  ToggleButtonGroup,
  ToggleButtonGroupContext,
  ToggleButtonGroupStateContext,
  useToggleButtonGroupStateContext,
  type ToggleButtonGroupProps,
  type ToggleButtonGroupRenderProps,
  type ToggleButtonGroupStateContextValue,
} from './ToggleButtonGroup';

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

// Keyboard
export {
  Keyboard,
  KeyboardContext,
  type KeyboardProps,
} from './Keyboard';

// Form
export {
  Form,
  FormContext,
  type FormProps,
  type FormRenderProps,
} from './Form';

// FieldError
export {
  FieldError,
  FieldErrorContext,
  type FieldErrorProps,
  type FieldErrorRenderProps,
} from './FieldError';

// FileTrigger
export {
  FileTrigger,
  type FileTriggerProps,
} from './FileTrigger';

// DropZone
export {
  DropZone,
  DropZoneContext,
  type DropZoneProps,
  type DropZoneRenderProps,
} from './DropZone';

// SharedElementTransition
export {
  SharedElementTransition,
  SharedElement,
  type SharedElementTransitionProps,
  type SharedElementProps,
  type SharedElementRenderProps,
} from './SharedElementTransition';

// Virtualizer
export {
  Virtualizer,
  VirtualizerContext,
  useVirtualizerContext,
  type VirtualizerProps,
  type VirtualizerLayout,
  type VirtualizerLayoutClass,
  type VirtualizerContextValue,
  type LayoutOptionsDelegate,
} from './Virtualizer';

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

// Toolbar
export {
  Toolbar,
  ToolbarContext,
  type ToolbarProps,
  type ToolbarRenderProps,
  type ToolbarContextValue,
} from './Toolbar';

// Autocomplete
export {
  Autocomplete,
  AutocompleteContext,
  AutocompleteStateContext,
  AutocompleteCollectionContext,
  useAutocompleteInput,
  useAutocompleteState,
  useAutocompleteCollection,
  type AutocompleteProps,
  type AutocompleteContextValue,
  type AutocompleteCollectionContextValue,
} from './Autocomplete';

// ListBox
export {
  ListBox,
  ListBoxOption,
  ListBoxLoadMoreItem,
  ListBoxContext,
  ListBoxStateContext,
  type ListBoxProps,
  type ListBoxRenderProps,
  type ListBoxOptionProps,
  type ListBoxOptionRenderProps,
  type ListBoxLoadMoreItemProps,
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

// SelectionIndicator
export {
  SelectionIndicator,
  SelectionIndicatorContext,
  type SelectionIndicatorProps,
  type SelectionIndicatorRenderProps,
} from './SelectionIndicator';

// Collection primitives
export {
  CollectionRendererContext,
  Section,
  Header,
  Group,
  isCollectionSection,
  flattenCollectionEntries,
  type SectionProps,
  type HeaderProps,
  type GroupProps,
  type CollectionEntry,
  type CollectionSection,
  type CollectionRendererContextValue,
  type CollectionPrimitiveRenderProps,
} from './Collection';

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
  ComboBoxLabel,
  ComboBoxDescription,
  ComboBoxErrorMessage,
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
  type ComboBoxLabelProps,
  type ComboBoxDescriptionProps,
  type ComboBoxErrorMessageProps,
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

// Toast
export {
  Toast,
  ToastRegion,
  ToastProvider,
  ToastContext,
  ToastTitle,
  ToastDescription,
  ToastCloseButton,
  DefaultToast,
  useToastContext,
  globalToastQueue,
  addToast,
  type ToastContent,
  type ToastProps,
  type ToastRenderProps,
  type ToastRegionProps,
  type ToastRegionRenderProps,
  type ToastProviderProps,
  type ToastTitleProps,
  type ToastDescriptionProps,
  type ToastCloseButtonProps,
  type DefaultToastProps,
} from './Toast';

// Disclosure
export {
  Disclosure,
  DisclosureGroup,
  DisclosureTrigger,
  DisclosurePanel,
  DisclosureContext,
  DisclosureGroupContext,
  useDisclosureContext,
  useDisclosureGroupContext,
  type DisclosureProps,
  type DisclosureRenderProps,
  type DisclosureGroupProps,
  type DisclosureGroupRenderProps,
  type DisclosureTriggerProps,
  type DisclosurePanelProps,
  type DisclosureState,
  type DisclosureGroupState,
} from './Disclosure';

// Meter
export {
  Meter,
  MeterContext,
  type MeterProps,
  type MeterRenderProps,
} from './Meter';

// TagGroup
export {
  TagGroup,
  TagList,
  Tag,
  TagRemoveButton,
  TagGroupContext,
  TagListStateContext,
  useTagGroupContext,
  type TagGroupProps,
  type TagGroupRenderProps,
  type TagListProps,
  type TagListRenderProps,
  type TagProps,
  type TagRenderProps,
  type TagRemoveButtonProps,
} from './TagGroup';

// Calendar
export {
  Calendar,
  CalendarHeading,
  CalendarButton,
  CalendarGrid,
  CalendarCell,
  CalendarContext,
  useCalendarContext,
  type CalendarProps,
  type CalendarRenderProps,
  type CalendarHeadingProps,
  type CalendarButtonProps,
  type CalendarGridProps,
  type CalendarGridRenderProps,
  type CalendarCellProps,
  type CalendarCellRenderProps,
  type CalendarHeaderCellProps,
  type CalendarState,
  type CalendarDate,
  type DateValue,
} from './Calendar';

// RangeCalendar
export {
  RangeCalendar,
  RangeCalendarHeading,
  RangeCalendarButton,
  RangeCalendarGrid,
  RangeCalendarCell,
  RangeCalendarContext,
  useRangeCalendarContext,
  type RangeCalendarProps,
  type RangeCalendarRenderProps,
  type RangeCalendarHeadingProps,
  type RangeCalendarButtonProps,
  type RangeCalendarGridProps,
  type RangeCalendarGridRenderProps,
  type RangeCalendarCellProps,
  type RangeCalendarCellRenderProps,
  type RangeCalendarState,
  type RangeValue,
} from './RangeCalendar';

// DateField
export {
  DateField,
  DateFieldLabel,
  DateFieldDescription,
  DateFieldErrorMessage,
  DateInput,
  DateSegment,
  DateFieldContext,
  useDateFieldContext,
  type DateFieldProps,
  type DateFieldRenderProps,
  type DateInputProps,
  type DateInputRenderProps,
  type DateSegmentProps,
  type DateSegmentRenderProps,
  type DateFieldLabelProps,
  type DateFieldDescriptionProps,
  type DateFieldErrorMessageProps,
  type DateFieldContextValue,
  type DateFieldState,
  type DateSegmentType,
} from './DateField';

// TimeField
export {
  TimeField,
  TimeInput,
  TimeSegment,
  TimeFieldContext,
  useTimeFieldContext,
  type TimeFieldProps,
  type TimeFieldRenderProps,
  type TimeInputProps,
  type TimeInputRenderProps,
  type TimeSegmentProps,
  type TimeSegmentRenderProps,
  type TimeFieldState,
  type TimeSegmentType,
  type TimeValue,
} from './TimeField';

// DatePicker
export {
  DatePicker,
  DatePickerButton,
  DatePickerContent,
  DatePickerContext,
  useDatePickerContext,
  type DatePickerProps,
  type DatePickerRenderProps,
  type DatePickerButtonProps,
  type DatePickerButtonRenderProps,
  type DatePickerContentProps,
  type DatePickerContextValue,
} from './DatePicker';

// Table
export {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableLoadMoreItem,
  TableRow,
  TableCell,
  TableSelectionCheckbox,
  TableSelectAllCheckbox,
  TableContext,
  TableStateContext,
  TableRowContext,
  type TableProps,
  type TableRenderProps,
  type TableHeaderProps,
  type TableHeaderRenderProps,
  type TableColumnProps,
  type TableColumnRenderProps,
  type TableBodyProps,
  type TableBodyRenderProps,
  type TableLoadMoreItemProps,
  type TableRowProps,
  type TableRowRenderProps,
  type TableCellProps,
  type TableCellRenderProps,
} from './Table';

// GridList
export {
  GridList,
  GridListItem,
  GridListSelectionCheckbox,
  GridListLoadMoreItem,
  GridListContext,
  GridListStateContext,
  type GridListProps,
  type GridListRenderProps,
  type GridListItemProps,
  type GridListItemRenderProps,
  type GridListLoadMoreItemProps,
} from './GridList';

// Tree
export {
  Tree,
  TreeItem,
  TreeExpandButton,
  TreeSelectionCheckbox,
  TreeLoadMoreItem,
  TreeContext,
  TreeStateContext,
  TreeItemContext,
  type TreeProps,
  type TreeRenderProps,
  type TreeRenderItemState,
  type TreeItemProps,
  type TreeItemRenderProps,
  type TreeExpandButtonProps,
  type TreeLoadMoreItemProps,
} from './Tree';

// Color
export {
  // ColorSlider
  ColorSlider,
  ColorSliderTrack,
  ColorSliderThumb,
  ColorSliderContext,
  type ColorSliderProps,
  type ColorSliderRenderProps,
  type ColorSliderTrackProps,
  type ColorSliderTrackRenderProps,
  type ColorSliderThumbProps,
  type ColorSliderThumbRenderProps,
  // ColorArea
  ColorArea,
  ColorAreaGradient,
  ColorAreaThumb,
  ColorAreaContext,
  type ColorAreaProps,
  type ColorAreaRenderProps,
  type ColorAreaGradientProps,
  type ColorAreaGradientRenderProps,
  type ColorAreaThumbProps,
  type ColorAreaThumbRenderProps,
  // ColorWheel
  ColorWheel,
  ColorWheelTrack,
  ColorWheelThumb,
  ColorWheelContext,
  type ColorWheelProps,
  type ColorWheelRenderProps,
  type ColorWheelTrackProps,
  type ColorWheelTrackRenderProps,
  type ColorWheelThumbProps,
  type ColorWheelThumbRenderProps,
  // ColorField
  ColorField,
  ColorFieldInput,
  ColorFieldContext,
  type ColorFieldProps,
  type ColorFieldRenderProps,
  type ColorFieldInputProps,
  type ColorFieldInputRenderProps,
  // ColorSwatch
  ColorSwatch,
  type ColorSwatchProps,
  type ColorSwatchRenderProps,
} from './Color';

// Landmark
export {
  Landmark,
  LandmarkContext,
  useLandmarkController,
  type LandmarkProps,
  type LandmarkRenderProps,
  type AriaLandmarkRole,
  type LandmarkController,
} from './Landmark';
