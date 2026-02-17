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
  DEFAULT_SLOT,
  Provider,
  composeRenderProps,
  useRenderProps,
  useContextProps,
  useSlottedContext,
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
  ToggleSwitch as Switch,
  ToggleSwitchContext as SwitchContext,
  type ToggleSwitchProps,
  type ToggleSwitchRenderProps,
  type ToggleSwitchProps as SwitchProps,
  type ToggleSwitchRenderProps as SwitchRenderProps,
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
  ToggleGroupStateContext,
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
  LabelContext,
  InputContext,
  TextAreaContext,
  FieldInputContext,
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

export {
  Text,
  TextContext,
  type TextProps,
} from './Text';

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
  ListLayout,
  GridLayout,
  WaterfallLayout,
  TableLayout,
  type VirtualizerProps,
  type VirtualizerLayout,
  type VirtualizerLayoutClass,
  type VirtualizerContextValue,
  type LayoutOptionsDelegate,
  type VirtualizerVisibleRange,
  type VirtualizerDropTarget,
  type VirtualizerDropOperationResolver,
  type VirtualizerDropTargetResolver,
  type VirtualizerRangeContext,
  type DefaultVirtualizerLayoutOptions,
  type GridLayoutOptions,
  type WaterfallLayoutOptions,
  type LayoutInfo,
  type Rect,
  type Size,
  type Point,
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
  ListBoxOption as ListBoxItem,
  ListBoxSection,
  ListBoxLoadMoreItem,
  ListBoxContext,
  ListBoxStateContext,
  ListStateContext,
  type ListBoxProps,
  type ListBoxRenderProps,
  type ListBoxOptionProps,
  type ListBoxOptionRenderProps,
  type ListBoxOptionProps as ListBoxItemProps,
  type ListBoxOptionRenderProps as ListBoxItemRenderProps,
  type ListBoxSectionProps,
  type ListBoxLoadMoreItemProps,
} from './ListBox';

// Menu
export {
  Menu,
  MenuItem,
  MenuSection,
  MenuTrigger,
  SubmenuTrigger,
  MenuButton,
  MenuContext,
  MenuStateContext,
  MenuTriggerContext,
  RootMenuTriggerStateContext,
  type MenuProps,
  type MenuRenderProps,
  type MenuItemProps,
  type MenuItemRenderProps,
  type MenuSectionProps,
  type MenuTriggerProps,
  type SubmenuTriggerProps,
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
  SelectValueContext,
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
  TabPanel as TabPanels,
  TabPanel,
  TabsContext,
  TabsStateContext,
  TabsStateContext as TabListStateContext,
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
  Collection,
  CollectionBuilder,
  createLeafComponent,
  createBranchComponent,
  CollectionRendererContext,
  SelectableCollectionContext,
  DefaultCollectionRenderer,
  GroupContext,
  HeaderContext,
  HeadingContext,
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
  type CollectionDropTargetDelegate,
  type CollectionRenderer,
  type CollectionRootProps,
  type CollectionBranchProps,
  type CollectionRendererContextValue,
  type CollectionPrimitiveRenderProps,
} from './Collection';

// Drag and Drop
export {
  DragAndDropContext,
  DropIndicator,
  DropIndicatorContext,
  useDndPersistedKeys,
  useRenderDropIndicator,
  type DragAndDropContextValue,
  type DropIndicatorProps,
  type DropIndicatorRenderProps,
  type DropTargetDelegate,
} from './DragAndDrop';
export {
  useDragAndDrop,
  type DragAndDropOptions,
  type DragAndDropHooks,
} from './useDragAndDrop';

// Breadcrumbs
export {
  Breadcrumbs,
  BreadcrumbItem,
  BreadcrumbItem as Breadcrumb,
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
  NumberFieldStateContext,
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
  SliderStateContext,
  SliderTrackContext,
  SliderOutputContext,
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
  TooltipContext,
  TooltipTriggerStateContext,
  type TooltipProps,
  type TooltipRenderProps,
  type TooltipTriggerComponentProps,
  type TooltipTriggerState,
} from './Tooltip';

// ComboBox
export {
  ComboBox,
  ComboBoxValue,
  ComboBoxInput,
  ComboBoxLabel,
  ComboBoxDescription,
  ComboBoxErrorMessage,
  ComboBoxButton,
  ComboBoxListBox,
  ComboBoxOption,
  ComboBoxContext,
  ComboBoxStateContext,
  ComboBoxValueContext,
  defaultContainsFilter,
  type ComboBoxProps,
  type ComboBoxRenderProps,
  type ComboBoxValueProps,
  type ComboBoxValueRenderProps,
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
  ModalContext,
  OverlayTriggerStateContext,
  useOverlayTriggerState,
  type ModalProps,
  type ModalOverlayProps,
  type ModalRenderProps,
  type OverlayTriggerState,
} from './Modal';

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
  Toast as UNSTABLE_Toast,
  ToastRegion as UNSTABLE_ToastRegion,
  ToastRegion as UNSTABLE_ToastList,
  Toast as UNSTABLE_ToastContent,
  ToastRegion,
  ToastProvider,
  ToastContext,
  ToastContext as UNSTABLE_ToastStateContext,
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
  DisclosureStateContext,
  DisclosureGroupStateContext,
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
  TagListStateContext as TagListContext,
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
  CalendarGridHeader,
  CalendarGridBody,
  CalendarHeaderCell,
  CalendarCell,
  CalendarContext,
  CalendarContext as CalendarStateContext,
  useCalendarContext,
  type CalendarProps,
  type CalendarRenderProps,
  type CalendarHeadingProps,
  type CalendarButtonProps,
  type CalendarGridProps,
  type CalendarGridHeaderProps,
  type CalendarGridBodyProps,
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
  RangeCalendarStateContext,
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
  DateFieldStateContext,
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
  TimeFieldStateContext,
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
  DateRangePicker,
  DatePickerButton,
  DateRangePickerButton,
  DatePickerContent,
  DateRangePickerContent,
  DatePickerContext,
  DateRangePickerContext,
  DatePickerStateContext,
  DateRangePickerStateContext,
  useDatePickerContext,
  useDateRangePickerContext,
  type DatePickerProps,
  type DateRangePickerProps,
  type DatePickerRenderProps,
  type DateRangePickerRenderProps,
  type DatePickerButtonProps,
  type DateRangePickerButtonProps,
  type DatePickerButtonRenderProps,
  type DatePickerContentProps,
  type DateRangePickerContentProps,
  type DatePickerContextValue,
  type DateRangePickerContextValue,
} from './DatePicker';

// Table
export {
  Table,
  TableHeader,
  TableColumn,
  TableColumn as Column,
  ColumnResizer,
  TableBody,
  TableLoadMoreItem,
  TableRow,
  TableRow as Row,
  TableCell,
  TableCell as Cell,
  ResizableTableContainer,
  useTableOptions,
  TableSelectionCheckbox,
  TableSelectAllCheckbox,
  TableContext,
  TableStateContext,
  TableColumnResizeStateContext,
  TableRowContext,
  type TableProps,
  type TableRenderProps,
  type TableHeaderProps,
  type TableHeaderRenderProps,
  type TableColumnProps,
  type TableColumnRenderProps,
  type ColumnResizerProps,
  type TableBodyProps,
  type TableBodyRenderProps,
  type ResizableTableContainerProps,
  type TableLoadMoreItemProps,
  type TableRowProps,
  type TableRowRenderProps,
  type TableCellProps,
  type TableCellRenderProps,
} from './Table';

// GridList
export {
  GridList,
  GridListHeader,
  GridListItem,
  GridListSection,
  GridListSelectionCheckbox,
  GridListLoadMoreItem,
  GridListContext,
  GridListHeaderContext,
  GridListStateContext,
  type GridListProps,
  type GridListRenderProps,
  type GridListItemProps,
  type GridListItemRenderProps,
  type GridListHeaderProps,
  type GridListSectionProps,
  type GridListLoadMoreItemProps,
} from './GridList';

// Tree
export {
  Tree,
  TreeItem,
  TreeItemContent,
  TreeHeader,
  TreeSection,
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
  type TreeItemContentProps,
  type TreeItemContentRenderProps,
  type TreeHeaderProps,
  type TreeSectionProps,
  type TreeExpandButtonProps,
  type TreeLoadMoreItemProps,
} from './Tree';

// Color
export {
  // ColorSlider
  ColorSlider,
  ColorSliderTrack,
  ColorSliderThumb,
  ColorThumb,
  ColorSliderContext,
  ColorSliderStateContext,
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
  ColorAreaStateContext,
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
  ColorWheelStateContext,
  ColorWheelTrackContext,
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
  ColorFieldStateContext,
  ColorPicker,
  ColorPickerContext,
  ColorPickerStateContext,
  type ColorFieldProps,
  type ColorFieldRenderProps,
  type ColorFieldInputProps,
  type ColorFieldInputRenderProps,
  type ColorPickerProps,
  type ColorPickerRenderProps,
  // ColorSwatch
  ColorSwatch,
  ColorSwatchContext,
  ColorSwatchPicker,
  ColorSwatchPickerItem,
  ColorSwatchPickerContext,
  type ColorSwatchProps,
  type ColorSwatchRenderProps,
  type ColorSwatchPickerProps,
  type ColorSwatchPickerItemProps,
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

// Alert
export {
  Alert,
  AlertContext,
  AlertDismissButton,
  type AlertProps,
  type AlertRenderProps,
  type AlertVariant,
  type AlertContextValue,
  type AlertDismissButtonProps,
} from './Alert';

// Icon
export {
  Icon,
  IconContext,
  type IconProps,
  type IconRenderProps,
} from './Icon';
