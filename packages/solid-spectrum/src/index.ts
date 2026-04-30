// ============================================
// SPECTRUM-BASED COMPONENTS
// ============================================

// Button
export { Button } from './button';
export type {
  ButtonFillStyle,
  ButtonProps,
  ButtonSize,
  ButtonStyle,
  ButtonVariant,
  LegacyButtonSize,
  LegacyButtonVariant,
  SpectrumButtonSize,
  SpectrumButtonVariant,
  StaticColor,
} from './button';

// Badge
export { Badge } from './badge';
export type { BadgeProps, BadgeVariant, BadgeSize } from './badge';

// Alert
export { Alert } from './alert';
export type { AlertProps, AlertVariant } from './alert';

// InlineAlert
export { InlineAlert } from './inlinealert';
export type { InlineAlertProps, InlineAlertVariant } from './inlinealert';

// Avatar
export { Avatar, AvatarGroup } from './avatar';
export type { AvatarProps, AvatarGroupProps, AvatarSize } from './avatar';

// Switch
export { TabSwitch, ToggleSwitch, ToggleSwitch as Switch } from './switch';
export type { TabSwitchProps, ToggleSwitchProps, ToggleSwitchProps as SwitchProps, SwitchSize } from './switch';

// Checkbox
export { Checkbox, CheckboxGroup } from './checkbox';
export type { CheckboxProps, CheckboxGroupProps, CheckboxSize } from './checkbox';

// Radio
export { RadioGroup, Radio } from './radio';
export type { RadioGroupProps, RadioProps, RadioGroupOrientation, RadioGroupSize } from './radio';

// Dialog
export { Dialog, DialogTrigger, DialogFooter } from './dialog';
export type { DialogProps, DialogTriggerProps, DialogFooterProps, DialogSize } from './dialog';

// Icon
export { Icon, GitHubIcon } from './icon';
export type { IconProps, GitHubIconProps } from './icon';

// Tooltip
export { Tooltip, TooltipTrigger, SimpleTooltip } from './tooltip';
export type { TooltipProps, TooltipTriggerProps, TooltipPlacement, TooltipVariant, SimpleTooltipProps } from './tooltip';

// Overlays
export {
  Dialog as OverlayDialog,
  DialogTrigger as OverlayDialogTrigger,
  DialogFooter as OverlayDialogFooter,
  Popover as OverlayPopover,
  PopoverTrigger as OverlayPopoverTrigger,
  PopoverHeader as OverlayPopoverHeader,
  PopoverFooter as OverlayPopoverFooter,
  Tooltip as OverlayTooltip,
  TooltipTrigger as OverlayTooltipTrigger,
  SimpleTooltip as OverlaySimpleTooltip,
} from './overlays';
export type {
  DialogProps as OverlayDialogProps,
  DialogTriggerProps as OverlayDialogTriggerProps,
  DialogFooterProps as OverlayDialogFooterProps,
  DialogSize as OverlayDialogSize,
  PopoverProps as OverlayPopoverProps,
  PopoverTriggerProps as OverlayPopoverTriggerProps,
  PopoverHeaderProps as OverlayPopoverHeaderProps,
  PopoverFooterProps as OverlayPopoverFooterProps,
  PopoverPlacement as OverlayPopoverPlacement,
  PopoverSize as OverlayPopoverSize,
  PopoverRenderProps as OverlayPopoverRenderProps,
  TooltipProps as OverlayTooltipProps,
  TooltipTriggerProps as OverlayTooltipTriggerProps,
  TooltipPlacement as OverlayTooltipPlacement,
  TooltipVariant as OverlayTooltipVariant,
  SimpleTooltipProps as OverlaySimpleTooltipProps,
} from './overlays';

// Popover
export { Popover, PopoverTrigger, PopoverHeader, PopoverFooter } from './popover';
export type { PopoverProps, PopoverTriggerProps, PopoverHeaderProps, PopoverFooterProps, PopoverPlacement, PopoverSize, PopoverRenderProps } from './popover';

// TextField
export { TextField } from './textfield';
export type { TextFieldProps, TextFieldSize, TextFieldVariant } from './textfield';

// TextArea
export { TextArea } from './textfield/TextArea';
export type { TextAreaProps, TextAreaSize, TextAreaVariant } from './textfield/TextArea';

// Link
export { Link } from './link';
export type { LinkProps, LinkVariant } from './link';

// ProgressBar
export { ProgressBar, ProgressBar as ProgressBarBase } from './progress-bar';
export type { ProgressBarProps, ProgressBarSize, ProgressBarVariant } from './progress-bar';

// Progress
export { ProgressBar as Progress } from './progress';
export type { ProgressBarProps as ProgressProps, ProgressBarSize as ProgressSize, ProgressBarVariant as ProgressVariant } from './progress';

// Separator
export { Separator } from './separator';
export type { SeparatorProps, SeparatorVariant, SeparatorSize } from './separator';

// Divider
export { Divider } from './divider';
export type { DividerProps, DividerVariant, DividerSize } from './divider';

// Text
export { Text } from './text';
export type { TextProps, TextVariant, TextSize } from './text';

// Label
export { Label } from './label';
export type { LabelProps, LabelSize } from './label';

// Form
export { Form, FieldError as FormFieldError } from './form';
export type { FormProps, FieldErrorProps } from './form';

// Toolbar
export { Toolbar } from './toolbar';
export type { ToolbarProps, ToolbarSize, ToolbarVariant } from './toolbar';

// ActionBar
export { ActionBar, ActionBarContainer } from './actionbar';
export type { ActionBarProps, ActionBarContainerProps } from './actionbar';

// ActionGroup
export { ActionGroup } from './actiongroup';
export type { ActionGroupProps } from './actiongroup';

// ButtonGroup
export { ButtonGroup } from './buttongroup';
export type { ButtonGroupProps } from './buttongroup';

// Autocomplete
export { SearchAutocomplete } from './autocomplete';
export type { SearchAutocompleteProps, SearchAutocompleteItem, SearchAutocompleteSize } from './autocomplete';

// Select
export { Select, SelectTrigger, SelectValue, SelectListBox, SelectOption } from './select';
export type { SelectProps, SelectTriggerProps, SelectValueProps, SelectListBoxProps, SelectOptionProps, SelectSize } from './select';

// Picker
export { Picker, PickerTrigger, PickerValue, PickerListBox, PickerItem } from './picker';
export type {
  PickerProps,
  PickerTriggerProps,
  PickerValueProps,
  PickerListBoxProps,
  PickerItemProps,
  PickerSize,
} from './picker';

// Menu
export { Menu, MenuItem, MenuTrigger, MenuButton, MenuSeparator } from './menu';
export type { MenuProps, MenuItemProps, MenuTriggerProps, MenuButtonProps, MenuSeparatorProps, MenuSize } from './menu';

// ListBox
export { ListBox, ListBoxOption } from './listbox';
export type { ListBoxProps, ListBoxOptionProps, ListBoxSize } from './listbox';

// List
export { ListView, ListViewItem, ListViewSelectionCheckbox } from './list';
export type {
  ListViewProps,
  ListViewItemProps,
  ListViewSize,
  ListViewVariant,
  ListViewLayout,
} from './list';

// Tabs
export { Tabs, TabList, Tab, TabPanels, TabPanel } from './tabs';
export type { TabsProps, TabListProps, TabProps, TabPanelsProps, TabPanelProps, TabsSize, TabsVariant, TabOrientation } from './tabs';

// Breadcrumbs
export { Breadcrumbs, BreadcrumbItem } from './breadcrumbs';
export type { BreadcrumbsProps, BreadcrumbItemProps, BreadcrumbsSize, BreadcrumbsVariant } from './breadcrumbs';

// NumberField
export { NumberField } from './numberfield';
export type { NumberFieldProps, NumberFieldSize, NumberFieldVariant } from './numberfield';

// DropZone
export { DropZone } from './dropzone';
export type { DropZoneProps } from './dropzone';

// FileTrigger
export { FileTrigger } from './filetrigger';
export type { FileTriggerProps } from './filetrigger';

// SearchField
export { SearchField } from './searchfield';
export type { SearchFieldProps, SearchFieldSize, SearchFieldVariant } from './searchfield';

// ContextualHelp
export { ContextualHelp } from './contextualhelp';
export type { ContextualHelpProps } from './contextualhelp';

// Slider
export { Slider } from './slider';
export type { SliderProps, SliderSize, SliderVariant } from './slider';

// ComboBox
export { ComboBox, ComboBoxInputGroup, ComboBoxInput, ComboBoxButton, ComboBoxListBox, ComboBoxOption, defaultContainsFilter } from './combobox';
export type { ComboBoxProps, ComboBoxInputProps, ComboBoxButtonProps, ComboBoxListBoxProps, ComboBoxOptionProps, ComboBoxSize, FilterFn, MenuTriggerAction } from './combobox';

// Toast
export {
  Toast,
  ToastContainer,
  ToastRegion,
  ToastProvider,
  ToastContext,
  ToastQueue,
  addToast,
  toastSuccess,
  toastError,
  toastWarning,
  toastInfo,
  globalToastQueue,
  useToastContext,
} from './toast';
export type {
  ToastProps,
  ToastRegionProps,
  ToastProviderProps,
  ToastPlacement,
  ToastVariant,
  ToastContent,
  ToastRenderProps,
  ToastRegionRenderProps,
  QueuedToast,
  ToastOptions,
} from './toast';

// Disclosure
export {
  Disclosure,
  DisclosureGroup,
  DisclosureTrigger,
  DisclosurePanel,
} from './disclosure';
export type {
  DisclosureProps,
  DisclosureGroupProps,
  DisclosureTriggerProps,
  DisclosurePanelProps,
  DisclosureSize,
  DisclosureVariant,
} from './disclosure';

// Accordion
export {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionPanel,
} from './accordion';
export type {
  AccordionProps,
  AccordionItemProps,
  AccordionHeaderProps,
  AccordionPanelProps,
  AccordionSize,
  AccordionVariant,
} from './accordion';

// Meter
export { Meter } from './meter';
export type { MeterProps, MeterSize, MeterVariant } from './meter';

// TagGroup
export { TagGroup } from './tag-group';
export type { TagGroupProps, TagProps, TagGroupSize, TagGroupVariant } from './tag-group';

// LabeledValue
export { LabeledValue } from './labeledvalue';
export type { LabeledValueProps, LabeledValueOrientation } from './labeledvalue';

// StatusLight
export { StatusLight } from './statuslight';
export type { StatusLightProps, StatusLightSize, StatusLightVariant } from './statuslight';

// Calendar
export { Calendar } from './calendar';
export type { CalendarProps, CalendarSize, CalendarDate, DateValue } from './calendar';

// RangeCalendar
export { RangeCalendar } from './calendar/RangeCalendar';
export type { RangeCalendarProps, RangeCalendarSize, RangeValue } from './calendar/RangeCalendar';

// DateField
export { DateField } from './calendar/DateField';
export type { DateFieldProps, DateFieldSize } from './calendar/DateField';

// TimeField
export { TimeField } from './calendar/TimeField';
export type { TimeFieldProps, TimeFieldSize, TimeValue } from './calendar/TimeField';

// DatePicker
export { DatePicker } from './calendar/DatePicker';
export type { DatePickerProps, DatePickerSize } from './calendar/DatePicker';

// DateRangePicker
export { DateRangePicker } from './calendar/DateRangePicker';
export type { DateRangePickerProps, DateRangePickerSize } from './calendar/DateRangePicker';

// Table
export {
  Table,
  TableView,
  TableHeader,
  TableColumn,
  TableBody,
  TableFooter,
  TableRow,
  TableCell,
  TableSelectionCheckbox,
  TableSelectAllCheckbox,
} from './table';
export type {
  TableProps,
  TableHeaderProps,
  TableColumnProps,
  TableBodyProps,
  TableFooterProps,
  TableRowProps,
  TableCellProps,
  TableSize,
  TableVariant,
} from './table';

// GridList
export {
  GridList,
  GridListItem,
  GridListSelectionCheckbox,
} from './gridlist';
export type {
  GridListProps,
  GridListItemProps,
  GridListSize,
  GridListVariant,
  GridListLayout,
} from './gridlist';

// Tree
export {
  Collection,
  Tree,
  TreeView,
  TreeItem,
  TreeItemContent,
  TreeViewItem,
  TreeViewItemContent,
  TreeExpandButton,
  TreeSelectionCheckbox,
} from './tree';
export type {
  TreeProps,
  TreeItemProps,
  TreeItemContentProps,
  TreeExpandButtonProps,
  TreeSize,
  TreeVariant,
} from './tree';

// Color
export {
  ColorSlider,
  ColorSliderTrack,
  ColorSliderThumb,
  ColorArea,
  ColorAreaGradient,
  ColorAreaThumb,
  ColorWheel,
  ColorWheelTrack,
  ColorWheelThumb,
  ColorField,
  ColorFieldInput,
  ColorSwatch,
  ColorPicker,
} from './color';
export type {
  ColorSliderProps,
  ColorAreaProps,
  ColorWheelProps,
  ColorFieldProps,
  ColorSwatchProps,
  ColorPickerProps,
  ColorSize,
} from './color';

// ColorEditor
export { ColorEditor } from './color/ColorEditor';
export type { ColorEditorProps } from './color/ColorEditor';

// ColorSwatchPicker
export { ColorSwatchPicker, ColorSwatchPickerItem } from './color/ColorSwatchPicker';
export type { ColorSwatchPickerProps, ColorSwatchPickerItemProps, SwatchPickerSize, SwatchPickerDensity, SwatchPickerRounding } from './color/ColorSwatchPicker';

// Landmark
export {
  Landmark,
  SkipLink,
  LandmarkNavigator,
  useLandmarkController,
} from './landmark';
export type {
  LandmarkProps,
  SkipLinkProps,
  LandmarkNavigatorProps,
  AriaLandmarkRole,
  LandmarkController,
} from './landmark';

// View
export { View } from './view';
export type { ViewProps } from './view';

// Well
export { Well } from './well';
export type { WellProps } from './well';

// Card
export { Card } from './card';
export type { CardProps } from './card';

// Image
export { Image } from './image';
export type { ImageProps } from './image';

// Layout
export { Layout } from './layout';
export type { LayoutProps } from './layout';

// IllustratedMessage
export { IllustratedMessage } from './illustratedmessage';
export type { IllustratedMessageProps } from './illustratedmessage';

// Skeleton
export { Skeleton, SkeletonCollection } from './skeleton';
export type { SkeletonProps, SkeletonCollectionProps, SkeletonShape, SkeletonSize, SkeletonGap } from './skeleton';

// StepList
export { StepList, Step } from './steplist';
export type { StepListProps, StepProps, StepListSize } from './steplist';

// Drag and Drop
export {
  DragAndDropContext,
  DropIndicator,
  DropIndicatorContext,
  useDndPersistedKeys,
  useRenderDropIndicator,
  useDragAndDrop,
} from './dnd';
export type {
  DragAndDropContextValue,
  DropIndicatorProps,
  DropIndicatorRenderProps,
  DropTargetDelegate,
  DragAndDropOptions,
  DragAndDropHooks,
} from './dnd';

// Shared Element
export { SharedElement, SharedElementTransition } from './shared-element';
export type { SharedElementProps, SharedElementTransitionProps } from './shared-element';

// Heading
export { Heading } from './text/Heading';
export type { HeadingProps, HeadingLevel } from './text/Heading';

// Keyboard
export { StyledKeyboard } from './text/Keyboard';
export { StyledKeyboard as Keyboard } from './text/Keyboard';
export type { KeyboardProps as StyledKeyboardProps } from './text/Keyboard';

// ToggleButton
export { ToggleButton } from './button/ToggleButton';
export type { ToggleButtonProps, ToggleButtonSize } from './button/ToggleButton';

// ActionButton
export { ActionButton } from './button/ActionButton';
export type { ActionButtonProps, ActionButtonSize } from './button/ActionButton';

// ClearButton
export { ClearButton } from './button/ClearButton';
export type { ClearButtonProps, ClearButtonSize } from './button/ClearButton';

// FieldButton
export { FieldButton } from './button/FieldButton';
export type { FieldButtonProps } from './button/FieldButton';

// LogicButton
export { LogicButton } from './button/LogicButton';
export type { LogicButtonProps } from './button/LogicButton';

// AlertDialog
export { AlertDialog } from './dialog/AlertDialog';
export type { AlertDialogProps, AlertDialogVariant } from './dialog/AlertDialog';

// ActionMenu
export { ActionMenu } from './menu/ActionMenu';
export type { ActionMenuProps } from './menu/ActionMenu';

// SubmenuTrigger
export { SubmenuTrigger } from './menu/SubmenuTrigger';
export type { SubmenuTriggerProps } from './menu/SubmenuTrigger';

// ContextualHelpTrigger
export { ContextualHelpTrigger } from './menu/ContextualHelpTrigger';
export type { ContextualHelpTriggerProps } from './menu/ContextualHelpTrigger';

// ProgressCircle
export { ProgressCircle } from './progress/ProgressCircle';
export type { ProgressCircleProps, ProgressCircleSize, ProgressCircleVariant } from './progress/ProgressCircle';

// RangeSlider
export { RangeSlider } from './slider/RangeSlider';
export type { RangeSliderProps, RangeSliderSize } from './slider/RangeSlider';

// Field
export { Field } from './form/Field';
export type { FieldProps, FieldSize } from './form/Field';

// HelpText
export { HelpText } from './form/HelpText';
export type { HelpTextProps } from './form/HelpText';

// StyledModal
export { StyledModal } from './overlays/Modal';
export type { StyledModalProps, ModalSize } from './overlays/Modal';

// Overlay
export { Overlay } from './overlays/Overlay';
export type { OverlayProps } from './overlays/Overlay';

// Tray
export { Tray } from './overlays/Tray';
export type { TrayProps } from './overlays/Tray';

// OpenTransition
export { OpenTransition } from './overlays/OpenTransition';
export type { OpenTransitionProps } from './overlays/OpenTransition';

// View Slots
export { Content, ViewHeader, ViewFooter } from './view/Content';
export type { ContentProps, ViewHeaderProps, ViewFooterProps } from './view/Content';

// Illustration
export { Illustration } from './icon/Illustration';
export type { IllustrationProps, IllustrationSize } from './icon/Illustration';

// UIIcon
export { UIIcon } from './icon/UIIcon';
export type { UIIconProps, UIIconSize } from './icon/UIIcon';

// Virtualizer
export {
  Virtualizer,
  VirtualizerContext,
  useVirtualizerContext,
  ListLayout,
  GridLayout,
  WaterfallLayout,
  TableLayout,
} from '@proyecto-viviana/solidaria-components';
export type {
  VirtualizerProps,
  VirtualizerLayout,
  VirtualizerLayoutClass,
  VirtualizerContextValue,
  VirtualizerVisibleRange,
  VirtualizerDropTarget,
  VirtualizerDropOperationResolver,
  VirtualizerDropTargetResolver,
  VirtualizerRangeContext,
  DefaultVirtualizerLayoutOptions,
  GridLayoutOptions,
  WaterfallLayoutOptions,
} from '@proyecto-viviana/solidaria-components';

// Flex Layout
export { Flex } from './layout/Flex';
export type { FlexProps } from './layout/Flex';

// Grid Layout
export { Grid } from './layout/Grid';
export type { GridProps } from './layout/Grid';

// CSS Utilities
export { fitContent, minmax, repeat } from './layout/css-utils';

// Story utilities
export { cx } from './story-utils';
export { StoryErrorBoundary } from './story-utils/ErrorBoundary';
export type { StoryErrorBoundaryProps } from './story-utils/ErrorBoundary';
export { generatePowerset } from './story-utils/generatePowerset';
export type { PropValues, PowersetItem } from './story-utils/generatePowerset';

// Style macro compatibility
export { s1 } from './style-macro-s1';

// Provider
export { Provider, useProvider, useProviderProps, useTheme, ThemeContext } from './provider';
export type {
  ProviderProps,
  ProviderContextValue,
  ProviderInheritedProps,
  ThemeContextValue,
  ColorScheme,
  Scale,
  ValidationState,
} from './provider';

// Theme compatibility (legacy)
export { themeLightClass, lightTheme } from './theme-light';
export { themeDarkClass, darkTheme } from './theme-dark';
export { themeDefaultClass, defaultTheme } from './theme-default';
export type { Theme } from './theme/types';

// Theme system
export {
  // OKLCH utilities
  hexToOklch,
  oklchToHex,
  oklchToCss,
  hexToRgba,
  // Generator
  generateTheme,
  applyThemeVars,
  themeToCssString,
  // Viviana preset
  viviana,
  VIVIANA_PRIMARY,
  VIVIANA_ACCENT,
  // Reactive hook
  createSolidSpectrumTheme,
} from './theme';
export type {
  OKLCH,
  ThemeInput,
  CSSVarMap,
  GeneratedTheme,
  SolidSpectrumThemeResult,
  ColorScheme as ThemeColorScheme,
} from './theme';

// ============================================
// CUSTOM COMPONENTS
// ============================================

// Chip
export { Chip } from './custom/chip';
export type { ChipProps, ChipVariant } from './custom/chip';

// NavHeader
export { NavHeader } from './custom/nav-header';
export type { NavHeaderProps } from './custom/nav-header';

// Header
export { Header } from './custom/header';
export type { HeaderProps } from './custom/header';

// LateralNav
export { LateralNav, NavItem, NavLink, NavSection } from './custom/lateral-nav';
export type { LateralNavProps, NavItemProps, NavLinkProps, NavSectionProps } from './custom/lateral-nav';

// TimelineItem
export { TimelineItem } from './custom/timeline-item';
export type { TimelineItemProps, TimelineEventType } from './custom/timeline-item';

// Conversation
export { Conversation, ConversationPreview, ConversationBubble } from './custom/conversation';
export type { ConversationProps, ConversationPreviewProps, ConversationBubbleProps, Message } from './custom/conversation';

// ProfileCard
export { ProfileCard } from './custom/profile-card';
export type { ProfileCardProps } from './custom/profile-card';

// EventCard
export { EventCard, EventListItem } from './custom/event-card';
export type { EventCardProps, EventListItemProps } from './custom/event-card';

// CalendarCard
export { CalendarCard } from './custom/calendar-card';
export type { CalendarCardProps } from './custom/calendar-card';

// Logo
export { Logo } from './custom/logo';
export type { LogoProps, LogoSize } from './custom/logo';

// ProjectCard
export { ProjectCard } from './custom/project-card';
export type { ProjectCardProps, ProjectCardSize } from './custom/project-card';

// PageLayout
export { PageLayout } from './custom/page-layout';
export type { PageLayoutProps } from './custom/page-layout';
