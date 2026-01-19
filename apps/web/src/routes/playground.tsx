import { createFileRoute } from '@tanstack/solid-router'
import { createSignal, JSX, onMount, Show, For, createContext, useContext, Accessor } from 'solid-js'
import {
  Button,
  Badge,
  Chip,
  Alert,
  Avatar,
  AvatarGroup,
  TabSwitch,
  ToggleSwitch,
  Checkbox,
  RadioGroup,
  Radio,
  Dialog,
  DialogTrigger,
  DialogFooter,
  ProfileCard,
  EventCard,
  CalendarCard,
  ConversationPreview,
  ConversationBubble,
  TimelineItem,
  PageLayout,
  TextField,
  Link,
  ProgressBar,
  Separator,
  // New styled collection components
  Select as StyledSelect,
  SelectTrigger as StyledSelectTrigger,
  SelectValue as StyledSelectValue,
  SelectListBox as StyledSelectListBox,
  SelectOption as StyledSelectOption,
  Menu as StyledMenu,
  MenuItem as StyledMenuItem,
  MenuTrigger as StyledMenuTrigger,
  MenuButton as StyledMenuButton,
  ListBox as StyledListBox,
  ListBoxOption as StyledListBoxOption,
  // Tabs
  Tabs as StyledTabs,
  TabList as StyledTabList,
  Tab as StyledTab,
  TabPanel as StyledTabPanel,
  // Breadcrumbs
  Breadcrumbs as StyledBreadcrumbs,
  BreadcrumbItem as StyledBreadcrumbItem,
  // NumberField
  NumberField as StyledNumberField,
  // SearchField
  SearchField as StyledSearchField,
  // Slider
  Slider as StyledSlider,
  // ComboBox
  ComboBox as StyledComboBox,
  ComboBoxInputGroup as StyledComboBoxInputGroup,
  ComboBoxInput as StyledComboBoxInput,
  ComboBoxButton as StyledComboBoxButton,
  ComboBoxListBox as StyledComboBoxListBox,
  ComboBoxOption as StyledComboBoxOption,
  defaultContainsFilter,
  // Tooltip
  Tooltip,
  TooltipTrigger,
  // Popover
  Popover,
  PopoverTrigger,
  PopoverHeader,
  PopoverFooter,
  // Toast
  ToastProvider,
  ToastRegion,
  addToast,
  toastSuccess,
  toastError,
  toastWarning,
  toastInfo,
  // Disclosure
  Disclosure,
  DisclosureGroup,
  DisclosureTrigger,
  DisclosurePanel,
  // Meter
  Meter,
  // TagGroup
  TagGroup,
  // Calendar/DatePicker
  Calendar,
  DatePicker,
  // RangeCalendar, DateField, TimeField
  RangeCalendar,
  DateField,
  TimeField,
} from '@proyecto-viviana/ui'
import {
  createButton,
  createCheckboxGroup,
  createCheckboxGroupItem,
  createCheckboxGroupState,
  type CheckboxGroupState,
} from '@proyecto-viviana/solidaria'
import {
  ListBox,
  ListBoxOption,
  Menu,
  MenuItem,
  MenuTrigger,
  MenuButton,
  Select,
  SelectTrigger,
  SelectValue,
  SelectListBox,
  SelectOption,
  Disclosure as HeadlessDisclosure,
  DisclosureTrigger as HeadlessDisclosureTrigger,
  DisclosurePanel as HeadlessDisclosurePanel,
  // Table
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  TableSelectionCheckbox,
  TableSelectAllCheckbox,
  // GridList
  GridList,
  GridListItem,
  GridListSelectionCheckbox,
  // Tree
  Tree,
  TreeItem,
  TreeExpandButton,
  TreeSelectionCheckbox,
  // Color
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
} from '@proyecto-viviana/solidaria-components'
import {
  CalendarDateClass as CalendarDate,
  type DateValue,
  type CalendarDate as CalendarDateType,
  type RangeValue,
  type TimeValue,
  parseColor,
  type Color,
} from '@proyecto-viviana/solid-stately'
import { Header, ThemeCreator } from '@/components'
// Fire gif for event card decoration
const fireGif = '/fire.gif'

export const Route = createFileRoute('/playground')({
  component: Playground,
})

// ============================================
// Section visibility system for lazy loading
// ============================================

// All available section IDs - these match the Section component id props
const SECTION_IDS = [
  'button', 'badge', 'chip', 'alert', 'tooltip', 'popover', 'avatar',
  'switch', 'checkbox', 'textfield', 'link', 'progressbar', 'separator',
  'radiogroup', 'profilecard', 'eventcard', 'calendarcard', 'conversation',
  'timelineitem', 'dialog', 'createbutton-hook', 'createcheckboxgroup-hook',
  'listbox', 'menu', 'select', 'styled-select', 'styled-menu', 'styled-listbox',
  'styled-tabs', 'styled-breadcrumbs', 'styled-numberfield', 'styled-searchfield',
  'styled-slider', 'styled-combobox', 'disclosure', 'meter', 'taggroup',
  'calendar', 'datepicker', 'toast',
  // New components (Phases 8-11)
  'table', 'gridlist', 'tree', 'rangecalendar', 'datefield', 'timefield',
  'colorslider', 'colorarea', 'colorwheel', 'colorfield', 'colorswatch',
] as const;

type SectionId = typeof SECTION_IDS[number];

// Pretty display names for sections
const SECTION_NAMES: Record<SectionId, string> = {
  'button': 'Button',
  'badge': 'Badge',
  'chip': 'Chip',
  'alert': 'Alert',
  'tooltip': 'Tooltip',
  'popover': 'Popover',
  'avatar': 'Avatar',
  'switch': 'Switch',
  'checkbox': 'Checkbox',
  'textfield': 'Text Field',
  'link': 'Link',
  'progressbar': 'Progress Bar',
  'separator': 'Separator',
  'radiogroup': 'Radio Group',
  'profilecard': 'Profile Card',
  'eventcard': 'Event Card',
  'calendarcard': 'Calendar Card',
  'conversation': 'Conversation',
  'timelineitem': 'Timeline Item',
  'dialog': 'Dialog',
  'createbutton-hook': 'createButton Hook',
  'createcheckboxgroup-hook': 'createCheckboxGroup Hook',
  'listbox': 'ListBox',
  'menu': 'Menu',
  'select': 'Select',
  'styled-select': 'Styled Select',
  'styled-menu': 'Styled Menu',
  'styled-listbox': 'Styled ListBox',
  'styled-tabs': 'Styled Tabs',
  'styled-breadcrumbs': 'Styled Breadcrumbs',
  'styled-numberfield': 'Number Field',
  'styled-searchfield': 'Search Field',
  'styled-slider': 'Slider',
  'styled-combobox': 'ComboBox',
  'disclosure': 'Disclosure',
  'meter': 'Meter',
  'taggroup': 'Tag Group',
  'calendar': 'Calendar',
  'datepicker': 'Date Picker',
  'toast': 'Toast',
  // New components (Phases 8-11)
  'table': 'Table',
  'gridlist': 'GridList',
  'tree': 'Tree',
  'rangecalendar': 'Range Calendar',
  'datefield': 'Date Field',
  'timefield': 'Time Field',
  'colorslider': 'Color Slider',
  'colorarea': 'Color Area',
  'colorwheel': 'Color Wheel',
  'colorfield': 'Color Field',
  'colorswatch': 'Color Swatch',
};

// Context for section visibility
const SectionVisibilityContext = createContext<{
  isVisible: (id: SectionId) => boolean;
  toggle: (id: SectionId) => void;
  showAll: () => void;
  hideAll: () => void;
}>();

// Section control panel component
function SectionControlPanel(props: {
  visibleSections: Accessor<Set<SectionId>>;
  setVisibleSections: (fn: (prev: Set<SectionId>) => Set<SectionId>) => void;
}) {
  const toggle = (id: SectionId) => {
    props.setVisibleSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const showAll = () => {
    props.setVisibleSections(() => new Set(SECTION_IDS));
  };

  const hideAll = () => {
    props.setVisibleSections(() => new Set());
  };

  return (
    <div class="mb-8 p-4 rounded-xl border border-primary-600 bg-bg-300">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-primary-200">Section Visibility</h3>
        <div class="flex gap-2">
          <button
            class="px-3 py-1 text-sm rounded bg-primary-600 text-primary-100 hover:bg-primary-500"
            onClick={showAll}
            data-testid="show-all-sections"
          >
            Show All
          </button>
          <button
            class="px-3 py-1 text-sm rounded bg-primary-600 text-primary-100 hover:bg-primary-500"
            onClick={hideAll}
            data-testid="hide-all-sections"
          >
            Hide All
          </button>
        </div>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        <For each={SECTION_IDS as unknown as SectionId[]}>
          {(id) => (
            <label
              class="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-bg-400 transition-colors"
              data-testid={`section-toggle-${id}`}
            >
              <input
                type="checkbox"
                checked={props.visibleSections().has(id)}
                onChange={() => toggle(id)}
                class="w-4 h-4 accent-accent"
              />
              <span class="text-sm text-primary-300 truncate">{SECTION_NAMES[id]}</span>
            </label>
          )}
        </For>
      </div>
    </div>
  );
}

// Component that only renders on client (for testing SSR bypass)
function ClientOnlyDisclosure() {
  const [mounted, setMounted] = createSignal(false);
  onMount(() => {
    console.log('[ClientOnlyDisclosure] onMount fired!');
    setMounted(true);
  });

  return (
    <Show when={mounted()} fallback={<div class="p-3 text-primary-400" data-testid="client-only-loading">Loading...</div>}>
      <HeadlessDisclosure>
        <HeadlessDisclosureTrigger class="w-full text-left p-3 bg-accent-600 text-white rounded hover:bg-accent-500 transition-colors">
          Client-Only Toggle
        </HeadlessDisclosureTrigger>
        <HeadlessDisclosurePanel class="p-3 mt-1 bg-accent-700 text-white rounded">
          This disclosure was rendered client-side only (no SSR).
        </HeadlessDisclosurePanel>
      </HeadlessDisclosure>
    </Show>
  );
}

// Very simple test component - just a basic reactive button with no dependencies
function SimpleDiagnosticButton() {
  const [count, setCount] = createSignal(0);
  onMount(() => {
    console.log('[SimpleDiagnosticButton] onMount fired!');
  });

  return (
    <button
      data-testid="simple-diagnostic-button"
      class="p-3 bg-success-500 text-white rounded"
      onClick={() => {
        console.log('[SimpleDiagnosticButton] clicked, count was:', count());
        setCount(c => c + 1);
      }}
    >
      Simple Button: {count()}
    </button>
  );
}

function Playground() {
  const [count, setCount] = createSignal(0)
  const [lastAction, setLastAction] = createSignal('None')
  const [switchValue, setSwitchValue] = createSignal('trending')
  const [toggleOn, setToggleOn] = createSignal(false)
  const [checkboxChecked, setCheckboxChecked] = createSignal(false)
  const [radioValue, setRadioValue] = createSignal<string | null>(null)
  const [themeVars, setThemeVars] = createSignal<Record<string, string>>({})

  // Section visibility - starts with all sections HIDDEN for faster hydration
  const [visibleSections, setVisibleSections] = createSignal<Set<SectionId>>(new Set())

  // Apply theme CSS variables to the playground container
  const themeStyle = () => {
    const vars = themeVars()
    return Object.entries(vars)
      .map(([key, value]) => `${key}: ${value}`)
      .join('; ')
  }

  return (
    <ToastProvider useGlobalQueue>
    <PageLayout>
      <Header />

      <div class="mx-auto max-w-6xl px-6 py-12">
        <header class="mb-8">
          <h1 class="text-4xl font-bold text-primary-100">Component Playground</h1>
          <p class="mt-2 text-lg text-primary-300">
            Interactive showcase of proyecto-viviana-ui components
          </p>
          <p class="mt-1 text-sm text-primary-400">Last action: {lastAction()}</p>
        </header>

        {/* Theme Creator */}
        <div class="mb-8 p-4 rounded-xl border border-primary-600 bg-bg-300">
          <ThemeCreator onThemeChange={setThemeVars} />
        </div>

        {/* Theme Preview Area */}
        <div class="p-6 rounded-xl bg-bg-200 border border-bg-300 mb-8" style={themeStyle()}>
          <h3 class="text-lg font-semibold text-primary-200 mb-4">Theme Preview</h3>
          <div class="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="accent">Accent</Button>
            <Chip text="Chip" variant="primary" />
          </div>
        </div>

        {/* Section Visibility Control Panel */}
        <SectionControlPanel
          visibleSections={visibleSections}
          setVisibleSections={setVisibleSections}
        />

        {/* Diagnostic button - always visible for testing hydration */}
        <div class="mb-8 p-4 rounded-xl border border-success-600 bg-bg-300">
          <h3 class="text-lg font-semibold text-primary-200 mb-4">Hydration Test</h3>
          <SimpleDiagnosticButton />
        </div>

        <div class="grid gap-8 lg:grid-cols-2">
          {/* DEBUG: Testing just Button section */}
          <Section id="button" visibleSections={visibleSections} title="Button" description="Primary interactive element with variants and styles">
            <div class="space-y-4">
              <div class="flex flex-wrap gap-3">
                <Button onPress={() => setCount((c) => c + 1)}>Count: {count()}</Button>
                <Button variant="secondary" onPress={() => setLastAction('Secondary clicked!')}>
                  Secondary
                </Button>
                <Button variant="danger" onPress={() => setLastAction('Danger clicked!')}>
                  Danger
                </Button>
                <Button variant="success" onPress={() => setLastAction('Success clicked!')}>
                  Success
                </Button>
                <Button isDisabled>Disabled</Button>
              </div>
              <div class="flex flex-wrap gap-3">
                <Button style="outline" variant="primary">Outline Primary</Button>
                <Button style="outline" variant="secondary">Outline Secondary</Button>
                <Button style="outline" variant="danger">Outline Danger</Button>
                <Button style="outline" variant="success">Outline Success</Button>
              </div>
            </div>
          </Section>

          {/* DEBUG: Testing Badge alone */}
          <Section id="badge" visibleSections={visibleSections} title="Badge" description="Notification indicators and counts">
            <div class="flex flex-wrap items-center gap-4">
              <div class="flex items-center gap-2">
                <Badge count={5} variant="primary" />
                <span class="text-sm text-primary-300">Primary</span>
              </div>
              <div class="flex items-center gap-2">
                <Badge count={12} variant="accent" />
                <span class="text-sm text-primary-300">Accent</span>
              </div>
              <div class="flex items-center gap-2">
                <Badge count={3} variant="success" />
                <span class="text-sm text-primary-300">Success</span>
              </div>
              <div class="flex items-center gap-2">
                <Badge count={99} variant="warning" />
                <span class="text-sm text-primary-300">Warning</span>
              </div>
              <div class="flex items-center gap-2">
                <Badge count={1} variant="danger" />
                <span class="text-sm text-primary-300">Danger</span>
              </div>
            </div>
          </Section>

          {/* Chip with both string and function icons (SSR-safe) */}
          <Section id="chip" visibleSections={visibleSections} title="Chip" description="Small labels and tag buttons">
            <div class="flex flex-wrap gap-3">
              <Chip text="Primary" variant="primary" onClick={() => setLastAction('Primary chip')} />
              <Chip text="Secondary" variant="secondary" onClick={() => setLastAction('Secondary chip')} />
              <Chip text="Accent" variant="accent" onClick={() => setLastAction('Accent chip')} />
              <Chip text="Outline" variant="outline" onClick={() => setLastAction('Outline chip')} />
              <Chip text="String Icon" variant="primary" icon="★" onClick={() => setLastAction('String icon chip')} />
              <Chip text="Function Icon" variant="accent" icon={() => <span>🎉</span>} onClick={() => setLastAction('Function icon chip')} />
            </div>
          </Section>

          {/* DEBUG: Testing Alert */}
          <Section id="alert" visibleSections={visibleSections} title="Alert" description="Contextual feedback messages">
            <div class="space-y-3">
              <Alert variant="info" title="Information">
                This is an informational message.
              </Alert>
              <Alert variant="success" title="Success">
                Operation completed successfully!
              </Alert>
              <Alert variant="warning" title="Warning">
                Please review before continuing.
              </Alert>
              <Alert variant="error" title="Error" dismissible onDismiss={() => setLastAction('Alert dismissed')}>
                Something went wrong.
              </Alert>
            </div>
          </Section>

          {/* Tooltip */}
          <Section id="tooltip" visibleSections={visibleSections} title="Tooltip" description="Contextual information on hover/focus">
            <div class="space-y-6">
              {/* Placement variants */}
              <div>
                <p class="text-sm text-primary-300 mb-3">Placements</p>
                <div class="flex flex-wrap gap-4">
                  <TooltipTrigger>
                    <Button variant="secondary">Top</Button>
                    <Tooltip placement="top">Tooltip on top</Tooltip>
                  </TooltipTrigger>
                  <TooltipTrigger>
                    <Button variant="secondary">Bottom</Button>
                    <Tooltip placement="bottom">Tooltip on bottom</Tooltip>
                  </TooltipTrigger>
                  <TooltipTrigger>
                    <Button variant="secondary">Left</Button>
                    <Tooltip placement="left">Tooltip on left</Tooltip>
                  </TooltipTrigger>
                  <TooltipTrigger>
                    <Button variant="secondary">Right</Button>
                    <Tooltip placement="right">Tooltip on right</Tooltip>
                  </TooltipTrigger>
                </div>
              </div>
              {/* With arrow */}
              <div>
                <p class="text-sm text-primary-300 mb-3">With Arrow</p>
                <div class="flex flex-wrap gap-4">
                  <TooltipTrigger>
                    <Button variant="primary">Hover me</Button>
                    <Tooltip placement="top" showArrow>Tooltip with arrow</Tooltip>
                  </TooltipTrigger>
                  <TooltipTrigger>
                    <Button variant="accent">Focus me</Button>
                    <Tooltip placement="bottom" showArrow variant="info">Info variant with arrow</Tooltip>
                  </TooltipTrigger>
                </div>
              </div>
              {/* Delay */}
              <div>
                <p class="text-sm text-primary-300 mb-3">Custom Delay (500ms)</p>
                <TooltipTrigger delay={500}>
                  <Button variant="secondary" style="outline">Delayed tooltip</Button>
                  <Tooltip>This tooltip has a 500ms delay</Tooltip>
                </TooltipTrigger>
              </div>
            </div>
          </Section>

          {/* Popover */}
          <Section id="popover" visibleSections={visibleSections} title="Popover" description="Positioned overlay content triggered by user action">
            <div class="space-y-6">
              {/* Basic placements */}
              <div>
                <p class="text-sm text-primary-300 mb-3">Placement Options</p>
                <div class="flex flex-wrap gap-3">
                  <PopoverTrigger>
                    <Button variant="secondary" style="outline" data-testid="popover-bottom-trigger">Bottom</Button>
                    <Popover placement="bottom" data-testid="popover-bottom">
                      <PopoverHeader title="Bottom Popover" description="This popover opens below the trigger" />
                      <p class="text-sm">Content positioned at the bottom.</p>
                    </Popover>
                  </PopoverTrigger>
                  <PopoverTrigger>
                    <Button variant="secondary" style="outline">Top</Button>
                    <Popover placement="top">
                      <PopoverHeader title="Top Popover" />
                      <p class="text-sm">Content positioned at the top.</p>
                    </Popover>
                  </PopoverTrigger>
                  <PopoverTrigger>
                    <Button variant="secondary" style="outline">Left</Button>
                    <Popover placement="left">
                      <PopoverHeader title="Left Popover" />
                      <p class="text-sm">Content on the left side.</p>
                    </Popover>
                  </PopoverTrigger>
                  <PopoverTrigger>
                    <Button variant="secondary" style="outline">Right</Button>
                    <Popover placement="right">
                      <PopoverHeader title="Right Popover" />
                      <p class="text-sm">Content on the right side.</p>
                    </Popover>
                  </PopoverTrigger>
                </div>
              </div>
              {/* With footer actions */}
              <div>
                <p class="text-sm text-primary-300 mb-3">With Footer Actions</p>
                <PopoverTrigger>
                  <Button variant="primary" data-testid="popover-actions-trigger">Open with Actions</Button>
                  <Popover placement="bottom" size="md" data-testid="popover-actions">
                    <PopoverHeader
                      title="Confirm Action"
                      description="Are you sure you want to proceed with this action?"
                    />
                    <PopoverFooter>
                      <Button variant="secondary" style="outline" size="sm">Cancel</Button>
                      <Button variant="primary" size="sm">Confirm</Button>
                    </PopoverFooter>
                  </Popover>
                </PopoverTrigger>
              </div>
              {/* Size variants */}
              <div>
                <p class="text-sm text-primary-300 mb-3">Size Variants</p>
                <div class="flex flex-wrap gap-3">
                  <PopoverTrigger>
                    <Button variant="secondary" style="outline">Small</Button>
                    <Popover placement="bottom" size="sm">
                      <p class="text-sm">Small popover content.</p>
                    </Popover>
                  </PopoverTrigger>
                  <PopoverTrigger>
                    <Button variant="secondary" style="outline">Medium</Button>
                    <Popover placement="bottom" size="md">
                      <p class="text-sm">Medium popover content with more room for details.</p>
                    </Popover>
                  </PopoverTrigger>
                  <PopoverTrigger>
                    <Button variant="secondary" style="outline">Large</Button>
                    <Popover placement="bottom" size="lg">
                      <p class="text-sm">Large popover content with maximum width for longer content sections.</p>
                    </Popover>
                  </PopoverTrigger>
                </div>
              </div>
            </div>
          </Section>

          <Section id="avatar" visibleSections={visibleSections} title="Avatar" description="User profile images with status">
            <div class="space-y-4">
              <div class="flex items-center gap-4">
                <Avatar size="xs" alt="XS" />
                <Avatar size="sm" alt="SM" />
                <Avatar size="md" alt="MD" online />
                <Avatar size="lg" alt="LG" online={false} />
                <Avatar size="xl" alt="XL" fallback="VV" />
              </div>
              <div class="flex items-center gap-2">
                <span class="text-sm text-primary-300">Avatar Group:</span>
                <AvatarGroup>
                  <Avatar size="sm" alt="User 1" />
                  <Avatar size="sm" alt="User 2" />
                  <Avatar size="sm" alt="User 3" />
                </AvatarGroup>
              </div>
            </div>
          </Section>

          <Section id="switch" visibleSections={visibleSections} title="Switch" description="Toggle and tab switch controls">
            <div class="space-y-4">
              <div class="flex items-center gap-4">
                <span class="text-sm text-primary-200">Toggle:</span>
                <ToggleSwitch checked={toggleOn()} onChange={setToggleOn} />
                <span class="text-sm text-primary-300">{toggleOn() ? 'On' : 'Off'}</span>
              </div>
              <div>
                <span class="text-sm text-primary-200 block mb-2">Tab Switch:</span>
                <TabSwitch
                  options={[
                    { label: 'TRENDING', value: 'trending' },
                    { label: 'LATEST', value: 'latest' },
                  ]}
                  value={switchValue()}
                  onChange={setSwitchValue}
                />
                <p class="text-sm text-primary-300 mt-2">Selected: {switchValue()}</p>
              </div>
            </div>
          </Section>

          <Section id="checkbox" visibleSections={visibleSections} title="Checkbox" description="Toggle selection with accessible checkbox">
            <div class="space-y-4">
              <div class="space-y-3">
                <Checkbox
                  checked={checkboxChecked()}
                  onChange={(checked) => {
                    setCheckboxChecked(checked)
                    setLastAction(`Checkbox: ${checked ? 'checked' : 'unchecked'}`)
                  }}
                >
                  Accept terms and conditions
                </Checkbox>
                <Checkbox defaultChecked>
                  Newsletter subscription
                </Checkbox>
                <Checkbox isDisabled>
                  Disabled option
                </Checkbox>
                <Checkbox isIndeterminate>
                  Indeterminate state
                </Checkbox>
              </div>
              <div class="flex items-center gap-4 pt-2">
                <span class="text-sm text-primary-300">Sizes:</span>
                <Checkbox size="sm" aria-label="Small checkbox" />
                <Checkbox size="md" aria-label="Medium checkbox" />
                <Checkbox size="lg" aria-label="Large checkbox" />
              </div>
            </div>
          </Section>

          <Section id="textfield" visibleSections={visibleSections} title="TextField" description="Text input with label, description, and validation">
            <div class="space-y-4">
              <TextField
                label="Email"
                placeholder="Enter your email"
                description="We'll never share your email"
              />
              <TextField
                label="Password"
                type="password"
                placeholder="Enter your password"
                isRequired
              />
              <TextField
                label="Username"
                placeholder="Choose a username"
                isInvalid
                errorMessage="Username is already taken"
              />
              <div class="flex gap-4">
                <TextField
                  label="Small"
                  size="sm"
                  placeholder="Small input"
                />
                <TextField
                  label="Large"
                  size="lg"
                  placeholder="Large input"
                />
              </div>
              <TextField
                label="Disabled"
                value="Can't edit this"
                isDisabled
              />
              <TextField
                label="Filled variant"
                variant="filled"
                placeholder="With filled style"
              />
            </div>
          </Section>

          <Section id="link" visibleSections={visibleSections} title="Link" description="Accessible link with hover and press states">
            <div class="space-y-4">
              <div class="flex flex-wrap gap-4">
                <Link href="https://example.com" target="_blank">External Link</Link>
                <Link variant="secondary" onPress={() => setLastAction('Secondary link pressed')}>Secondary Link</Link>
                <Link variant="subtle" onPress={() => setLastAction('Subtle link pressed')}>Subtle Link</Link>
              </div>
              <div class="flex flex-wrap gap-4">
                <Link isDisabled>Disabled Link</Link>
                <Link href="https://example.com" aria-current="page">Current Page Link</Link>
              </div>
              <p class="text-sm text-primary-400">
                Links support keyboard navigation (Enter key), hover states, and press feedback.
              </p>
            </div>
          </Section>

          <Section id="progressbar" visibleSections={visibleSections} title="ProgressBar" description="Shows progress of an operation over time">
            <div class="space-y-6">
              <div class="space-y-4">
                <ProgressBar value={25} label="Uploading..." />
                <ProgressBar value={50} label="Processing" variant="accent" />
                <ProgressBar value={75} label="Almost done" variant="success" />
                <ProgressBar value={100} label="Complete" variant="success" />
              </div>
              <div class="space-y-4">
                <span class="text-sm text-primary-300 block">Indeterminate:</span>
                <ProgressBar isIndeterminate label="Loading..." />
              </div>
              <div class="space-y-4">
                <span class="text-sm text-primary-300 block">Sizes:</span>
                <ProgressBar value={60} size="sm" label="Small" />
                <ProgressBar value={60} size="md" label="Medium" />
                <ProgressBar value={60} size="lg" label="Large" />
              </div>
              <div class="space-y-4">
                <span class="text-sm text-primary-300 block">Variants:</span>
                <ProgressBar value={40} variant="primary" aria-label="Primary progress" />
                <ProgressBar value={40} variant="accent" aria-label="Accent progress" />
                <ProgressBar value={40} variant="success" aria-label="Success progress" />
                <ProgressBar value={40} variant="warning" aria-label="Warning progress" />
                <ProgressBar value={40} variant="danger" aria-label="Danger progress" />
              </div>
              <div>
                <span class="text-sm text-primary-300 block mb-2">Custom value label:</span>
                <ProgressBar value={2} minValue={0} maxValue={5} valueLabel="Step 2 of 5" label="Setup Progress" />
              </div>
            </div>
          </Section>

          <Section id="separator" visibleSections={visibleSections} title="Separator" description="Visual divider between groups of content">
            <div class="space-y-6">
              <div class="space-y-4">
                <span class="text-sm text-primary-300 block">Horizontal (default):</span>
                <Separator />
                <p class="text-sm text-primary-400">Content above and below the separator.</p>
              </div>
              <div>
                <span class="text-sm text-primary-300 block mb-2">Vertical:</span>
                <div class="flex items-center gap-4 h-8">
                  <span class="text-primary-200">Item 1</span>
                  <Separator orientation="vertical" />
                  <span class="text-primary-200">Item 2</span>
                  <Separator orientation="vertical" />
                  <span class="text-primary-200">Item 3</span>
                </div>
              </div>
              <div class="space-y-4">
                <span class="text-sm text-primary-300 block">Sizes:</span>
                <div class="space-y-2">
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-primary-400 w-8">sm:</span>
                    <Separator size="sm" class="flex-1" />
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-primary-400 w-8">md:</span>
                    <Separator size="md" class="flex-1" />
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-primary-400 w-8">lg:</span>
                    <Separator size="lg" class="flex-1" />
                  </div>
                </div>
              </div>
              <div class="space-y-4">
                <span class="text-sm text-primary-300 block">Variants:</span>
                <div class="space-y-2">
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-primary-400 w-16">default:</span>
                    <Separator variant="default" class="flex-1" />
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-primary-400 w-16">subtle:</span>
                    <Separator variant="subtle" class="flex-1" />
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-primary-400 w-16">strong:</span>
                    <Separator variant="strong" class="flex-1" />
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* RadioGroup temporarily disabled - styled Radio component needs SSR-compatible redesign */}
          {/*
          <Section id="radiogroup" visibleSections={visibleSections} title="RadioGroup" description="Single selection from multiple options">
            <div class="space-y-6">
              <RadioGroup
                label="Choose your plan"
                value={radioValue()}
                onChange={(value) => {
                  setRadioValue(value)
                  setLastAction(`Radio selected: ${value}`)
                }}
              >
                <Radio value="free">Free Plan</Radio>
                <Radio value="pro">Pro Plan</Radio>
                <Radio value="enterprise">Enterprise Plan</Radio>
              </RadioGroup>

              <div class="border-t border-bg-100 pt-4">
                <RadioGroup
                  label="Horizontal layout"
                  orientation="horizontal"
                  defaultValue="option2"
                >
                  <Radio value="option1">Option 1</Radio>
                  <Radio value="option2">Option 2</Radio>
                  <Radio value="option3">Option 3</Radio>
                </RadioGroup>
              </div>

              <div class="border-t border-bg-100 pt-4">
                <span class="text-sm text-primary-300 block mb-2">Sizes:</span>
                <div class="flex gap-8">
                  <RadioGroup aria-label="Small size" size="sm" defaultValue="a">
                    <Radio value="a">Small</Radio>
                  </RadioGroup>
                  <RadioGroup aria-label="Medium size" size="md" defaultValue="a">
                    <Radio value="a">Medium</Radio>
                  </RadioGroup>
                  <RadioGroup aria-label="Large size" size="lg" defaultValue="a">
                    <Radio value="a">Large</Radio>
                  </RadioGroup>
                </div>
              </div>

              <div class="border-t border-bg-100 pt-4">
                <RadioGroup
                  label="With validation"
                  isInvalid
                  errorMessage="Please select an option"
                  description="This field is required"
                >
                  <Radio value="a">Option A</Radio>
                  <Radio value="b">Option B</Radio>
                </RadioGroup>
              </div>
            </div>
          </Section>
          */}

          <Section id="profilecard" visibleSections={visibleSections} title="ProfileCard" description="User profile display cards">
            <ProfileCard
              username="@viviana_dev"
              bio="Building accessible SolidJS components. React Aria patterns for Solid."
              followers={1234}
              following={567}
              actions={() => (
                <div class="flex gap-2">
                  <Button variant="primary" onPress={() => setLastAction('Followed!')}>Follow</Button>
                  <Button variant="secondary" style="outline" onPress={() => setLastAction('Message!')}>Message</Button>
                </div>
              )}
            />
          </Section>

          <Section id="eventcard" visibleSections={visibleSections} title="EventCard" description="Event display with attendees">
            <EventCard
              title="Fiesta de Taylor 2021 todos invitados"
              date="2 días"
              author="taylorswift"
              decorationImage={fireGif}
              attendees={[
                { name: 'Alice' },
                { name: 'Bob' },
                { name: 'Carol' },
              ]}
              attendeeCount={42}
              actions={() => (
                <Button variant="primary" onPress={() => setLastAction('RSVP!')}>
                  RSVP
                </Button>
              )}
            />
          </Section>

          <Section id="calendarcard" visibleSections={visibleSections} title="CalendarCard" description="Calendar event with followers">
            <CalendarCard
              title="Component Design Workshop"
              tags={['Design', 'UI/UX']}
              followers={[
                { name: 'Alice' },
                { name: 'Bob' },
              ]}
              followerCount={15}
            />
          </Section>

          <Section id="conversation" visibleSections={visibleSections} title="Conversation" description="Chat and messaging UI">
            <div class="space-y-4">
              <ConversationPreview
                user={{ name: 'Alice', online: true }}
                lastMessage="Hey! Have you seen the new components?"
                timestamp="2m ago"
                unreadCount={3}
                onClick={() => setLastAction('Opened conversation with Alice')}
              />
              <div class="rounded-lg bg-bg-300 p-4 space-y-2">
                <ConversationBubble content="Hi there!" sender="other" timestamp="10:30 AM" />
                <ConversationBubble content="Hello! How are you?" sender="user" timestamp="10:31 AM" />
                <ConversationBubble content="Great! Love the new UI" sender="other" timestamp="10:32 AM" />
              </div>
            </div>
          </Section>

          <Section id="timelineitem" visibleSections={visibleSections} title="TimelineItem" description="Social activity timeline">
            <div class="flex flex-wrap gap-4">
              <TimelineItem
                type="follow"
                leftUser={{ name: 'Alice' }}
                rightUser={{ name: 'Bob' }}
                icon={() => <span class="text-2xl">👋</span>}
              />
              <TimelineItem
                type="like"
                leftUser={{ name: 'Carol' }}
                rightUser={{ name: 'Dave' }}
                icon={() => <span class="text-2xl">❤️</span>}
              />
            </div>
          </Section>

          <Section id="dialog" visibleSections={visibleSections} title="Dialog" description="Modal dialog with overlay and backdrop" class="lg:col-span-2">
            <div class="flex gap-4">
              <DialogTrigger
                trigger={<Button variant="primary">Open Dialog</Button>}
                content={(close) => (
                  <Dialog
                    title="Welcome!"
                    size="md"
                    isDismissable={true}
                    onClose={close}
                  >
                    <p class="mb-4">
                      Welcome to Proyecto Viviana! A collection of accessible,
                      beautifully styled SolidJS components inspired by React Spectrum.
                    </p>
                    <DialogFooter>
                      <Button variant="primary" buttonStyle="outline" onPress={close}>
                        Cancel
                      </Button>
                      <Button variant="primary" onPress={() => {
                        setLastAction('Dialog: Get Started')
                        close()
                      }}>
                        Get Started
                      </Button>
                    </DialogFooter>
                  </Dialog>
                )}
              />

              <DialogTrigger
                trigger={<Button variant="accent">Small Dialog</Button>}
                content={(close) => (
                  <Dialog
                    title="Confirmation"
                    size="sm"
                    isDismissable={true}
                    onClose={close}
                  >
                    <p class="mb-4">
                      Are you sure you want to continue?
                    </p>
                    <DialogFooter>
                      <Button variant="primary" buttonStyle="outline" onPress={close}>
                        No
                      </Button>
                      <Button variant="danger" onPress={() => {
                        setLastAction('Dialog: Confirmed')
                        close()
                      }}>
                        Yes, Continue
                      </Button>
                    </DialogFooter>
                  </Dialog>
                )}
              />

              <DialogTrigger
                trigger={<Button variant="secondary">Large Dialog</Button>}
                content={(close) => (
                  <Dialog
                    title="Settings"
                    size="lg"
                    isDismissable={true}
                    onClose={close}
                  >
                    <div class="space-y-4">
                      <p>Configure your application settings below.</p>
                      <TextField label="Username" placeholder="Enter username" />
                      <TextField label="Email" placeholder="Enter email" type="email" />
                    </div>
                    <DialogFooter>
                      <Button variant="primary" buttonStyle="outline" onPress={close}>
                        Cancel
                      </Button>
                      <Button variant="primary" onPress={() => {
                        setLastAction('Dialog: Settings Saved')
                        close()
                      }}>
                        Save Changes
                      </Button>
                    </DialogFooter>
                  </Dialog>
                )}
              />
            </div>
          </Section>

          <Section id="createbutton-hook" visibleSections={visibleSections} title="createButton Hook" description="Low-level hook for custom implementations" class="lg:col-span-2">
            <div class="flex flex-wrap gap-4">
              <CustomGradientButton onPress={() => setLastAction('Gradient button pressed!')}>
                Custom Gradient Button
              </CustomGradientButton>
              <CustomOutlineButton onPress={() => setLastAction('Outline button pressed!')}>
                Custom Outline Button
              </CustomOutlineButton>
            </div>
          </Section>

          <Section id="createcheckboxgroup-hook" visibleSections={visibleSections} title="createCheckboxGroup Hook" description="Accessible checkbox group with ARIA support" class="lg:col-span-2">
            <CheckboxGroupDemo onSelectionChange={(values) => setLastAction(`Selected: ${values.join(', ') || 'none'}`)} />
          </Section>

          <Section id="listbox" visibleSections={visibleSections} title="ListBox" description="Accessible list with keyboard navigation and selection">
            <ListBoxDemo onSelectionChange={(key) => setLastAction(`ListBox selected: ${key}`)} />
          </Section>

          <Section id="menu" visibleSections={visibleSections} title="Menu" description="Dropdown menu with keyboard navigation">
            <MenuDemo onAction={(action) => setLastAction(`Menu action: ${action}`)} />
          </Section>

          {/* Select (headless) works fine */}
          <Section id="select" visibleSections={visibleSections} title="Select" description="Accessible dropdown select with keyboard support" class="lg:col-span-2">
            <SelectDemo onSelectionChange={(key) => setLastAction(`Select changed: ${key}`)} />
          </Section>

          {/* TESTING: Styled Select re-enabled after fixing inline arrow functions */}
          <Section id="styled-select" visibleSections={visibleSections} title="Styled Select (ui)" description="Pre-styled select with size variants">
            <StyledSelectDemo onSelectionChange={(key) => setLastAction(`Styled Select: ${key}`)} />
          </Section>

          <Section id="styled-menu" visibleSections={visibleSections} title="Styled Menu (ui)" description="Pre-styled dropdown menu with variants">
            <StyledMenuDemo onAction={(action) => setLastAction(`Styled Menu: ${action}`)} />
          </Section>

          <Section id="styled-listbox" visibleSections={visibleSections} title="Styled ListBox (ui)" description="Pre-styled list with selection" class="lg:col-span-2">
            <StyledListBoxDemo onSelectionChange={(key) => setLastAction(`Styled ListBox: ${key}`)} />
          </Section>

          <Section id="styled-tabs" visibleSections={visibleSections} title="Styled Tabs (ui)" description="Pre-styled tabs with variants" class="lg:col-span-2">
            <StyledTabsDemo onSelectionChange={(key) => setLastAction(`Styled Tab: ${key}`)} />
          </Section>

          <Section id="styled-breadcrumbs" visibleSections={visibleSections} title="Styled Breadcrumbs (ui)" description="Pre-styled navigation breadcrumbs" class="lg:col-span-2">
            <StyledBreadcrumbsDemo onNavigate={(path) => setLastAction(`Navigate: ${path}`)} />
          </Section>

          <Section id="styled-numberfield" visibleSections={visibleSections} title="Styled NumberField (ui)" description="Number input with increment/decrement buttons" class="lg:col-span-2">
            <StyledNumberFieldDemo onChange={(value) => setLastAction(`NumberField: ${value}`)} />
          </Section>

          <Section id="styled-searchfield" visibleSections={visibleSections} title="Styled SearchField (ui)" description="Search input with clear button" class="lg:col-span-2">
            <StyledSearchFieldDemo onSearch={(value) => setLastAction(`Search: ${value}`)} />
          </Section>

          <Section id="styled-slider" visibleSections={visibleSections} title="Styled Slider (ui)" description="Range input with draggable thumb" class="lg:col-span-2">
            <StyledSliderDemo onChange={(value) => setLastAction(`Slider: ${value}`)} />
          </Section>

          <Section id="styled-combobox" visibleSections={visibleSections} title="Styled ComboBox (ui)" description="Filterable dropdown with text input" class="lg:col-span-2">
            <StyledComboBoxDemo onSelectionChange={(key) => setLastAction(`ComboBox: ${key}`)} />
          </Section>

          {/* Disclosure Section */}
          <Section id="disclosure" visibleSections={visibleSections} title="Disclosure" description="Expandable/collapsible content panels" class="lg:col-span-2">
            <div class="space-y-6">
              {/* Headless Disclosure (for testing hydration) */}
              <div>
                <h4 class="text-sm font-medium text-primary-300 mb-2">Headless Disclosure (Test)</h4>
                <HeadlessDisclosure>
                  <HeadlessDisclosureTrigger class="w-full text-left p-3 bg-bg-400 rounded hover:bg-bg-300 transition-colors">
                    Headless Toggle Test
                  </HeadlessDisclosureTrigger>
                  <HeadlessDisclosurePanel class="p-3 mt-1 bg-bg-300 rounded">
                    This is a headless disclosure panel. If you can see this after clicking, it works!
                  </HeadlessDisclosurePanel>
                </HeadlessDisclosure>
              </div>

              {/* Client-only Disclosure (for testing without SSR) */}
              <div>
                <h4 class="text-sm font-medium text-primary-300 mb-2">Client-Only Disclosure</h4>
                <ClientOnlyDisclosure />
              </div>

              {/* Simple diagnostic button to test basic SolidJS reactivity */}
              <div>
                <h4 class="text-sm font-medium text-primary-300 mb-2">Diagnostic Button</h4>
                <SimpleDiagnosticButton />
              </div>

              {/* Single Disclosure */}
              <div>
                <h4 class="text-sm font-medium text-primary-300 mb-2">Single Disclosure (Styled)</h4>
                <Disclosure variant="bordered">
                  <DisclosureTrigger>What is a Disclosure?</DisclosureTrigger>
                  <DisclosurePanel>
                    A disclosure is a widget that can be toggled to show or hide content.
                    It's useful for FAQs, collapsible sections, and progressive disclosure patterns.
                  </DisclosurePanel>
                </Disclosure>
              </div>

              {/* Accordion (DisclosureGroup) */}
              <div>
                <h4 class="text-sm font-medium text-primary-300 mb-2">Accordion (Single Expand)</h4>
                <DisclosureGroup variant="bordered">
                  <Disclosure id="section-1">
                    <DisclosureTrigger>Section 1: Introduction</DisclosureTrigger>
                    <DisclosurePanel>
                      This is the content for section 1. Only one section can be expanded at a time
                      in this accordion mode.
                    </DisclosurePanel>
                  </Disclosure>
                  <Disclosure id="section-2">
                    <DisclosureTrigger>Section 2: Features</DisclosureTrigger>
                    <DisclosurePanel>
                      This is the content for section 2. When you expand this, section 1 will collapse
                      automatically.
                    </DisclosurePanel>
                  </Disclosure>
                  <Disclosure id="section-3">
                    <DisclosureTrigger>Section 3: Conclusion</DisclosureTrigger>
                    <DisclosurePanel>
                      This is the content for section 3. The accordion pattern is great for FAQs and
                      settings pages.
                    </DisclosurePanel>
                  </Disclosure>
                </DisclosureGroup>
              </div>

              {/* Multiple Expand Accordion */}
              <div>
                <h4 class="text-sm font-medium text-primary-300 mb-2">Accordion (Multiple Expand)</h4>
                <DisclosureGroup allowsMultipleExpanded variant="filled">
                  <Disclosure id="multi-1">
                    <DisclosureTrigger>Panel A</DisclosureTrigger>
                    <DisclosurePanel>Multiple panels can be open at once in this mode.</DisclosurePanel>
                  </Disclosure>
                  <Disclosure id="multi-2">
                    <DisclosureTrigger>Panel B</DisclosureTrigger>
                    <DisclosurePanel>Try opening both panels!</DisclosurePanel>
                  </Disclosure>
                </DisclosureGroup>
              </div>

              {/* Variants */}
              <div>
                <h4 class="text-sm font-medium text-primary-300 mb-2">Variants</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Disclosure variant="default">
                    <DisclosureTrigger>Default Variant</DisclosureTrigger>
                    <DisclosurePanel>Simple border-bottom style.</DisclosurePanel>
                  </Disclosure>
                  <Disclosure variant="bordered">
                    <DisclosureTrigger>Bordered Variant</DisclosureTrigger>
                    <DisclosurePanel>Full border with rounded corners.</DisclosurePanel>
                  </Disclosure>
                  <Disclosure variant="filled">
                    <DisclosureTrigger>Filled Variant</DisclosureTrigger>
                    <DisclosurePanel>Background fill style.</DisclosurePanel>
                  </Disclosure>
                  <Disclosure variant="ghost">
                    <DisclosureTrigger>Ghost Variant</DisclosureTrigger>
                    <DisclosurePanel>Minimal style with hover effects.</DisclosurePanel>
                  </Disclosure>
                </div>
              </div>
            </div>
          </Section>

          {/* Meter Section */}
          <Section id="meter" visibleSections={visibleSections} title="Meter" description="Display a quantity within a known range">
            <div class="space-y-6">
              {/* Primary variant */}
              <div>
                <h4 class="text-sm font-medium text-primary-300 mb-2">Primary Variant</h4>
                <div class="space-y-3">
                  <Meter label="Storage Used" value={75} showValue />
                  <Meter label="Memory" value={45} size="sm" showValue />
                  <Meter label="CPU" value={90} size="lg" showValue />
                </div>
              </div>

              {/* Color variants */}
              <div>
                <h4 class="text-sm font-medium text-primary-300 mb-2">Color Variants</h4>
                <div class="space-y-3">
                  <Meter label="Success" value={30} variant="success" showValue />
                  <Meter label="Warning" value={65} variant="warning" showValue />
                  <Meter label="Danger" value={85} variant="danger" showValue />
                  <Meter label="Info" value={50} variant="info" showValue />
                  <Meter label="Accent" value={40} variant="accent" showValue />
                </div>
              </div>

              {/* Without label */}
              <div>
                <h4 class="text-sm font-medium text-primary-300 mb-2">Without Label</h4>
                <Meter value={60} aria-label="Progress" />
              </div>
            </div>
          </Section>

          {/* TagGroup Section */}
          <Section id="taggroup" visibleSections={visibleSections} title="TagGroup" description="Selectable and removable tag collections">
            <div class="space-y-6">
              {/* Basic removable tags */}
              <div>
                <h4 class="text-sm font-medium text-primary-300 mb-2">Removable Tags</h4>
                <TagGroupDemo />
              </div>

              {/* Selection */}
              <div>
                <h4 class="text-sm font-medium text-primary-300 mb-2">Selectable Tags</h4>
                <TagGroupSelectionDemo />
              </div>

              {/* Variants */}
              <div>
                <h4 class="text-sm font-medium text-primary-300 mb-2">Tag Variants</h4>
                <div class="space-y-4">
                  <TagGroup
                    items={[{ id: '1', name: 'Default' }, { id: '2', name: 'Style' }]}
                    variant="default"
                    size="md"
                  >
                    {(item) => item.name}
                  </TagGroup>
                  <TagGroup
                    items={[{ id: '1', name: 'Outline' }, { id: '2', name: 'Style' }]}
                    variant="outline"
                    size="md"
                  >
                    {(item) => item.name}
                  </TagGroup>
                  <TagGroup
                    items={[{ id: '1', name: 'Solid' }, { id: '2', name: 'Style' }]}
                    variant="solid"
                    size="md"
                  >
                    {(item) => item.name}
                  </TagGroup>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h4 class="text-sm font-medium text-primary-300 mb-2">Tag Sizes</h4>
                <div class="space-y-4">
                  <TagGroup
                    items={[{ id: '1', name: 'Small' }, { id: '2', name: 'Tags' }]}
                    size="sm"
                  >
                    {(item) => item.name}
                  </TagGroup>
                  <TagGroup
                    items={[{ id: '1', name: 'Medium' }, { id: '2', name: 'Tags' }]}
                    size="md"
                  >
                    {(item) => item.name}
                  </TagGroup>
                  <TagGroup
                    items={[{ id: '1', name: 'Large' }, { id: '2', name: 'Tags' }]}
                    size="lg"
                  >
                    {(item) => item.name}
                  </TagGroup>
                </div>
              </div>
            </div>
          </Section>

          {/* Calendar Section */}
          <Section id="calendar" visibleSections={visibleSections} title="Calendar" description="Date selection calendars with navigation">
            <CalendarDemo />
          </Section>

          {/* DatePicker Section */}
          <Section id="datepicker" visibleSections={visibleSections} title="DatePicker" description="Date field with calendar popup">
            <DatePickerDemo />
          </Section>

          {/* Toast Section */}
          <Section id="toast" visibleSections={visibleSections} title="Toast" description="Toast notifications with auto-dismiss and variants" class="lg:col-span-2">
            <div class="space-y-4">
              <p class="text-sm text-primary-300 mb-3">Click buttons to show toast notifications</p>
              <div class="flex flex-wrap gap-3">
                <Button
                  variant="primary"
                  onPress={() => toastSuccess('Changes saved successfully!')}
                >
                  Success Toast
                </Button>
                <Button
                  variant="danger"
                  onPress={() => toastError('Something went wrong. Please try again.')}
                >
                  Error Toast
                </Button>
                <Button
                  variant="secondary"
                  onPress={() => toastWarning('Your session will expire in 5 minutes.')}
                >
                  Warning Toast
                </Button>
                <Button
                  variant="secondary"
                  style="outline"
                  onPress={() => toastInfo('New features are available!')}
                >
                  Info Toast
                </Button>
              </div>
              <div class="flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  style="outline"
                  onPress={() => addToast({
                    title: 'Custom Toast',
                    description: 'This toast has both title and description with a longer timeout.',
                    type: 'info',
                  }, { timeout: 10000 })}
                >
                  With Description
                </Button>
                <Button
                  variant="secondary"
                  style="outline"
                  onPress={() => addToast({
                    title: 'Action Required',
                    description: 'Click the button below to take action.',
                    type: 'warning',
                    action: {
                      label: 'Take Action',
                      onAction: () => setLastAction('Toast action clicked!'),
                    },
                  }, { timeout: 15000 })}
                >
                  With Action
                </Button>
              </div>
            </div>
          </Section>

          {/* ============================================ */}
          {/* NEW COMPONENTS (Phases 8-11) */}
          {/* ============================================ */}

          {/* Table Section */}
          <Section id="table" visibleSections={visibleSections} title="Table" description="Data tables with sorting, selection, and keyboard navigation" class="lg:col-span-2">
            <TableDemo />
          </Section>

          {/* GridList Section */}
          <Section id="gridlist" visibleSections={visibleSections} title="GridList" description="Keyboard-navigable grid of selectable items">
            <GridListDemo />
          </Section>

          {/* Tree Section */}
          <Section id="tree" visibleSections={visibleSections} title="Tree" description="Hierarchical tree view with expand/collapse">
            <TreeDemo />
          </Section>

          {/* RangeCalendar Section */}
          <Section id="rangecalendar" visibleSections={visibleSections} title="Range Calendar" description="Select a date range">
            <RangeCalendarDemo />
          </Section>

          {/* DateField Section */}
          <Section id="datefield" visibleSections={visibleSections} title="Date Field" description="Keyboard-editable date input with segments">
            <DateFieldDemo />
          </Section>

          {/* TimeField Section */}
          <Section id="timefield" visibleSections={visibleSections} title="Time Field" description="Keyboard-editable time input with segments">
            <TimeFieldDemo />
          </Section>

          {/* ColorSlider Section */}
          <Section id="colorslider" visibleSections={visibleSections} title="Color Slider" description="Adjust a single color channel">
            <ColorSliderDemo />
          </Section>

          {/* ColorArea Section */}
          <Section id="colorarea" visibleSections={visibleSections} title="Color Area" description="2D color picker for saturation and brightness">
            <ColorAreaDemo />
          </Section>

          {/* ColorWheel Section */}
          <Section id="colorwheel" visibleSections={visibleSections} title="Color Wheel" description="Circular hue selector">
            <ColorWheelDemo />
          </Section>

          {/* ColorField Section */}
          <Section id="colorfield" visibleSections={visibleSections} title="Color Field" description="Text input for color values">
            <ColorFieldDemo />
          </Section>

          {/* ColorSwatch Section */}
          <Section id="colorswatch" visibleSections={visibleSections} title="Color Swatch" description="Display a color preview">
            <ColorSwatchDemo />
          </Section>
        </div>
      </div>
      <ToastRegion placement="bottom-end" />
    </PageLayout>
    </ToastProvider>
  )
}

function Section(props: {
  id: SectionId;
  title: string;
  description: string;
  children: any;
  class?: string;
  visibleSections: Accessor<Set<SectionId>>;
}) {
  // Completely remove from DOM when not visible
  return (
    <Show when={props.visibleSections().has(props.id)}>
      <section
        class={`vui-feature-card ${props.class ?? ''}`}
        data-testid={`section-${props.id}`}
      >
        <h3 class="vui-feature-card__title">{props.title}</h3>
        <p class="vui-feature-card__description" style={{ "margin-bottom": "1rem" }}>{props.description}</p>
        {props.children}
      </section>
    </Show>
  )
}

function CustomGradientButton(props: { onPress?: () => void; children: string }) {
  const { buttonProps, isPressed } = createButton({
    onPress: props.onPress,
  })

  return (
    <button
      {...buttonProps}
      class={`rounded-lg bg-gradient-to-r from-primary-500 to-accent px-6 py-3 font-medium text-white shadow-md transition-all hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
        isPressed() ? 'scale-[0.98] shadow-sm' : ''
      }`}
    >
      {props.children}
    </button>
  )
}

function CustomOutlineButton(props: { onPress?: () => void; children: string }) {
  const { buttonProps, isPressed } = createButton({
    onPress: props.onPress,
  })

  return (
    <button
      {...buttonProps}
      class={`rounded-lg border-2 border-primary-500 bg-transparent px-6 py-3 font-medium text-primary-200 transition-all hover:bg-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
        isPressed() ? 'scale-[0.98] bg-primary-700' : ''
      }`}
    >
      {props.children}
    </button>
  )
}

// ============================================
// Checkbox Group Demo Components
// ============================================

function CheckboxGroupDemo(props: { onSelectionChange?: (values: string[]) => void }) {
  const state = createCheckboxGroupState(() => ({
    defaultValue: ['notifications'],
    onChange: props.onSelectionChange,
  }))

  const { groupProps, labelProps } = createCheckboxGroup(
    () => ({ label: 'Preferences' }),
    state
  )

  return (
    <div class="space-y-6">
      {/* Basic Checkbox Group */}
      <div>
        <h3 class="text-sm font-medium text-primary-200 mb-3">Basic Group</h3>
        <div {...groupProps} class="space-y-2">
          <span {...labelProps} class="text-sm font-medium text-primary-100 block mb-2">
            Notification Settings
          </span>
          <CustomCheckbox value="notifications" state={state}>
            Enable notifications
          </CustomCheckbox>
          <CustomCheckbox value="emails" state={state}>
            Email updates
          </CustomCheckbox>
          <CustomCheckbox value="marketing" state={state}>
            Marketing communications
          </CustomCheckbox>
        </div>
        <p class="mt-2 text-xs text-primary-400">
          Selected: {state.value().join(', ') || 'none'}
        </p>
      </div>

      {/* Disabled & Read-only Examples */}
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <h3 class="text-sm font-medium text-primary-200 mb-3">Disabled Checkbox</h3>
          <DisabledCheckboxDemo />
        </div>
        <div>
          <h3 class="text-sm font-medium text-primary-200 mb-3">Read-only Checkbox</h3>
          <ReadonlyCheckboxDemo />
        </div>
      </div>
    </div>
  )
}

function CustomCheckbox(props: {
  value: string
  state: CheckboxGroupState
  children: JSX.Element
  isDisabled?: boolean
  isReadOnly?: boolean
}) {
  let inputRef: HTMLInputElement | null = null

  const result = createCheckboxGroupItem(
    () => ({
      value: props.value,
      isDisabled: props.isDisabled,
      isReadOnly: props.isReadOnly,
      children: props.children,
    }),
    props.state,
    () => inputRef
  )

  const isChecked = () => props.state.value().includes(props.value)
  const getInputProps = () => result.inputProps

  return (
    <label
      class={`flex items-center gap-3 cursor-pointer group ${
        props.isDisabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <div class="relative">
        <input
          ref={(el) => (inputRef = el)}
          type="checkbox"
          value={props.value}
          checked={isChecked()}
          disabled={getInputProps().disabled}
          aria-readonly={getInputProps()['aria-readonly']}
          onChange={getInputProps().onChange}
          class="peer sr-only"
        />
        <div
          class={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center
            ${isChecked()
              ? 'bg-accent border-accent'
              : 'border-primary-400 group-hover:border-primary-200'
            }
            ${props.isDisabled ? '' : 'peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-bg-200'}
          `}
        >
          {isChecked() && (
            <svg class="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 6L5 9L10 3"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          )}
        </div>
      </div>
      <span class="text-sm text-primary-200">{props.children}</span>
    </label>
  )
}

function DisabledCheckboxDemo() {
  const state = createCheckboxGroupState(() => ({
    defaultValue: ['option1'],
    isDisabled: true,
  }))

  const { groupProps } = createCheckboxGroup(() => ({}), state)

  return (
    <div {...groupProps} class="space-y-2">
      <CustomCheckbox value="option1" state={state} isDisabled>
        Disabled (checked)
      </CustomCheckbox>
      <CustomCheckbox value="option2" state={state} isDisabled>
        Disabled (unchecked)
      </CustomCheckbox>
    </div>
  )
}

function ReadonlyCheckboxDemo() {
  const state = createCheckboxGroupState(() => ({
    defaultValue: ['readonly1'],
    isReadOnly: true,
  }))

  const { groupProps } = createCheckboxGroup(() => ({}), state)

  return (
    <div {...groupProps} class="space-y-2">
      <CustomCheckbox value="readonly1" state={state} isReadOnly>
        Read-only (checked)
      </CustomCheckbox>
      <CustomCheckbox value="readonly2" state={state} isReadOnly>
        Read-only (unchecked)
      </CustomCheckbox>
    </div>
  )
}

// ============================================
// ListBox Demo
// ============================================

const listBoxItems = [
  { id: 'react', name: 'React', description: 'A JavaScript library for building user interfaces' },
  { id: 'solid', name: 'SolidJS', description: 'Simple and performant reactivity for building user interfaces' },
  { id: 'vue', name: 'Vue', description: 'The progressive JavaScript framework' },
  { id: 'svelte', name: 'Svelte', description: 'Cybernetically enhanced web apps' },
  { id: 'angular', name: 'Angular', description: 'Platform for building mobile and desktop web applications' },
]

function ListBoxDemo(props: { onSelectionChange?: (key: string | number) => void }) {
  return (
    <div class="space-y-4">
      <ListBox
        items={listBoxItems}
        getKey={(item) => item.id}
        selectionMode="single"
        onSelectionChange={(keys) => {
          const key = [...keys][0]
          if (key) props.onSelectionChange?.(key)
        }}
        aria-label="Choose a framework"
        class="border border-primary-600 rounded-lg overflow-hidden bg-bg-300 max-h-64 overflow-y-auto"
      >
        {(item) => (
          <ListBoxOption
            id={item.id}
            item={item}
            class="px-4 py-3 cursor-pointer outline-none transition-colors data-selected:bg-accent/20 data-focused:bg-primary-700"
          >
            <div class="flex items-center justify-between">
              <div>
                <div class="font-medium text-primary-100">{item.name}</div>
                <div class="text-sm text-primary-400">{item.description}</div>
              </div>
            </div>
          </ListBoxOption>
        )}
      </ListBox>
      <p class="text-xs text-primary-400">
        Use arrow keys to navigate, Enter/Space to select
      </p>
    </div>
  )
}

// ============================================
// Menu Demo
// ============================================

const menuItems = [
  { id: 'edit', label: 'Edit', variant: 'default' },
  { id: 'duplicate', label: 'Duplicate', variant: 'default' },
  { id: 'share', label: 'Share', variant: 'default' },
  { id: 'delete', label: 'Delete', variant: 'danger' },
]

function MenuDemo(props: { onAction?: (action: string) => void }) {
  return (
    <div class="space-y-4">
      <MenuTrigger>
        <MenuButton class="px-4 py-2 bg-primary-700 hover:bg-primary-600 text-primary-100 rounded-lg border border-primary-500 transition-colors flex items-center gap-2">
          Actions
          <span class="text-xs">▼</span>
        </MenuButton>
        <Menu
          items={menuItems}
          getKey={(item) => item.id}
          onAction={(key) => props.onAction?.(String(key))}
          aria-label="Actions menu"
          class="absolute mt-1 min-w-48 bg-bg-200 border border-primary-600 rounded-lg shadow-xl overflow-hidden z-50"
        >
          {(item) => (
            <MenuItem
              id={item.id}
              class={`px-4 py-2 cursor-pointer outline-none transition-colors ${
                item.variant === 'danger'
                  ? 'data-focused:bg-danger/20 text-danger'
                  : 'data-focused:bg-primary-700 text-primary-100'
              }`}
            >
              {item.label}
            </MenuItem>
          )}
        </Menu>
      </MenuTrigger>
      <p class="text-xs text-primary-400">
        Click button to open, use arrow keys to navigate, Enter to select, Escape to close
      </p>
    </div>
  )
}

// ============================================
// Select Demo
// ============================================

const selectItems = [
  { id: 'sm', label: 'Small', size: '640px' },
  { id: 'md', label: 'Medium', size: '768px' },
  { id: 'lg', label: 'Large', size: '1024px' },
  { id: 'xl', label: 'Extra Large', size: '1280px' },
  { id: '2xl', label: '2X Large', size: '1536px' },
]

function SelectDemo(props: { onSelectionChange?: (key: string | number | null) => void }) {
  const [selectedKey, setSelectedKey] = createSignal<string | number | null>('md')

  const handleChange = (key: string | number | null) => {
    setSelectedKey(key)
    props.onSelectionChange?.(key)
  }

  return (
    <div class="space-y-6">
      <div class="grid gap-6 sm:grid-cols-2">
        {/* Basic Select */}
        <div>
          <h4 class="text-sm font-medium text-primary-200 mb-2">Basic Select</h4>
          <Select
            items={selectItems}
            getKey={(item) => item.id}
            selectedKey={selectedKey()}
            onSelectionChange={handleChange}
            aria-label="Choose a breakpoint"
          >
            <SelectTrigger class="w-full px-4 py-2 bg-bg-300 border border-primary-600 rounded-lg text-primary-100 flex items-center justify-between hover:border-primary-400 transition-colors">
              <SelectValue placeholder="Select a size..." />
              <span class="text-primary-400">▼</span>
            </SelectTrigger>
            <SelectListBox class="absolute mt-1 w-full bg-bg-200 border border-primary-600 rounded-lg shadow-xl overflow-hidden z-50">
              {(item) => (
                <SelectOption
                  id={item.id}
                  item={item}
                  class="px-4 py-2 cursor-pointer outline-none transition-colors data-selected:bg-accent/20 data-selected:text-accent data-focused:bg-primary-700 text-primary-100"
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <span class="font-medium">{item.label}</span>
                      <span class="text-sm text-primary-400 ml-2">({item.size})</span>
                    </div>
                  </div>
                </SelectOption>
              )}
            </SelectListBox>
          </Select>
        </div>

        {/* Disabled Select */}
        <div>
          <h4 class="text-sm font-medium text-primary-200 mb-2">Disabled Select</h4>
          <Select
            items={selectItems}
            getKey={(item) => item.id}
            defaultSelectedKey="lg"
            isDisabled
            aria-label="Disabled select"
          >
            <SelectTrigger class="w-full px-4 py-2 bg-bg-300 border border-primary-600 rounded-lg text-primary-400 flex items-center justify-between opacity-50 cursor-not-allowed">
              <SelectValue placeholder="Select..." />
              <span class="text-primary-400">▼</span>
            </SelectTrigger>
            <SelectListBox class="hidden">
              {(item) => <SelectOption id={item.id} item={item}>{item.label}</SelectOption>}
            </SelectListBox>
          </Select>
        </div>
      </div>

      <div>
        <p class="text-xs text-primary-400">
          Click to open dropdown, use arrow keys to navigate options, Enter/Space to select, Escape to close.
          The selected value is: <strong class="text-primary-200">{selectedKey() || 'none'}</strong>
        </p>
      </div>
    </div>
  )
}

// ============================================
// Styled Select Demo (ui package)
// ============================================

interface FruitItem {
  id: string
  label: string
}

const styledSelectItems: FruitItem[] = [
  { id: 'apple', label: 'Apple' },
  { id: 'banana', label: 'Banana' },
  { id: 'cherry', label: 'Cherry' },
  { id: 'date', label: 'Date' },
  { id: 'elderberry', label: 'Elderberry' },
]

function StyledSelectDemo(props: { onSelectionChange?: (key: string | number | null) => void }) {
  const [selectedKey, setSelectedKey] = createSignal<string | number | null>(null)

  const handleChange = (key: string | number | null) => {
    setSelectedKey(key)
    props.onSelectionChange?.(key)
  }

  return (
    <div class="space-y-6">
      <div class="grid gap-6 sm:grid-cols-3">
        {/* Small size */}
        <StyledSelect<FruitItem>
          items={styledSelectItems}
          getKey={(item: FruitItem) => item.id}
          getTextValue={(item: FruitItem) => item.label}
          selectedKey={selectedKey()}
          onSelectionChange={handleChange}
          size="sm"
          label="Small"
          placeholder="Pick a fruit..."
        >
          <StyledSelectTrigger>
            <StyledSelectValue />
          </StyledSelectTrigger>
          <StyledSelectListBox>
            {(item: FruitItem) => (
              <StyledSelectOption id={item.id}>{item.label}</StyledSelectOption>
            )}
          </StyledSelectListBox>
        </StyledSelect>

        {/* Medium size (default) */}
        <StyledSelect<FruitItem>
          items={styledSelectItems}
          getKey={(item: FruitItem) => item.id}
          getTextValue={(item: FruitItem) => item.label}
          selectedKey={selectedKey()}
          onSelectionChange={handleChange}
          size="md"
          label="Medium"
          placeholder="Pick a fruit..."
        >
          <StyledSelectTrigger>
            <StyledSelectValue />
          </StyledSelectTrigger>
          <StyledSelectListBox>
            {(item: FruitItem) => (
              <StyledSelectOption id={item.id}>{item.label}</StyledSelectOption>
            )}
          </StyledSelectListBox>
        </StyledSelect>

        {/* Large size */}
        <StyledSelect<FruitItem>
          items={styledSelectItems}
          getKey={(item: FruitItem) => item.id}
          getTextValue={(item: FruitItem) => item.label}
          selectedKey={selectedKey()}
          onSelectionChange={handleChange}
          size="lg"
          label="Large"
          placeholder="Pick a fruit..."
        >
          <StyledSelectTrigger>
            <StyledSelectValue />
          </StyledSelectTrigger>
          <StyledSelectListBox>
            {(item: FruitItem) => (
              <StyledSelectOption id={item.id}>{item.label}</StyledSelectOption>
            )}
          </StyledSelectListBox>
        </StyledSelect>
      </div>
      <p class="text-xs text-primary-400">
        Pre-styled Select with size variants. Selected: <strong class="text-primary-200">{selectedKey() || 'none'}</strong>
      </p>
    </div>
  )
}

// ============================================
// Styled Menu Demo (ui package)
// ============================================

interface MenuItemData {
  id: string
  label: string
  shortcut?: string
  isSeparator?: boolean
  isDestructive?: boolean
}

const styledMenuItems: MenuItemData[] = [
  { id: 'new', label: 'New File', shortcut: '⌘N' },
  { id: 'open', label: 'Open...', shortcut: '⌘O' },
  { id: 'save', label: 'Save', shortcut: '⌘S' },
  { id: 'separator', label: '', isSeparator: true },
  { id: 'delete', label: 'Delete', isDestructive: true },
]

interface SimpleMenuItem {
  id: string
  label: string
}

function StyledMenuDemo(props: { onAction?: (action: string) => void }) {
  return (
    <div class="space-y-4">
      <div class="flex gap-4 flex-wrap">
        {/* Primary variant */}
        <StyledMenuTrigger size="md">
          <StyledMenuButton variant="primary">
            File Menu
          </StyledMenuButton>
          <StyledMenu<MenuItemData>
            items={styledMenuItems.filter((i: MenuItemData) => !i.isSeparator)}
            getKey={(item: MenuItemData) => item.id}
            onAction={(key: string | number) => props.onAction?.(String(key))}
            aria-label="File menu"
          >
            {(item: MenuItemData) => (
              <StyledMenuItem
                id={item.id}
                shortcut={item.shortcut}
                isDestructive={item.isDestructive}
              >
                {item.label}
              </StyledMenuItem>
            )}
          </StyledMenu>
        </StyledMenuTrigger>

        {/* Secondary variant */}
        <StyledMenuTrigger size="md">
          <StyledMenuButton variant="secondary">
            Edit Menu
          </StyledMenuButton>
          <StyledMenu<SimpleMenuItem>
            items={[
              { id: 'cut', label: 'Cut' },
              { id: 'copy', label: 'Copy' },
              { id: 'paste', label: 'Paste' },
            ]}
            getKey={(item: SimpleMenuItem) => item.id}
            onAction={(key: string | number) => props.onAction?.(String(key))}
            aria-label="Edit menu"
          >
            {(item: SimpleMenuItem) => (
              <StyledMenuItem id={item.id}>
                {item.label}
              </StyledMenuItem>
            )}
          </StyledMenu>
        </StyledMenuTrigger>

        {/* Quiet variant */}
        <StyledMenuTrigger size="sm">
          <StyledMenuButton variant="quiet">
            More
          </StyledMenuButton>
          <StyledMenu<SimpleMenuItem>
            items={[
              { id: 'settings', label: 'Settings' },
              { id: 'help', label: 'Help' },
            ]}
            getKey={(item: SimpleMenuItem) => item.id}
            onAction={(key: string | number) => props.onAction?.(String(key))}
            aria-label="More options"
          >
            {(item: SimpleMenuItem) => (
              <StyledMenuItem id={item.id}>
                {item.label}
              </StyledMenuItem>
            )}
          </StyledMenu>
        </StyledMenuTrigger>
      </div>
      <p class="text-xs text-primary-400">
        Pre-styled Menu with button variants (primary, secondary, quiet) and size options.
      </p>
    </div>
  )
}

// ============================================
// Styled ListBox Demo (ui package)
// ============================================

interface MailboxItem {
  id: string
  label: string
  description: string
}

const styledListBoxItems: MailboxItem[] = [
  { id: 'inbox', label: 'Inbox', description: '24 unread messages' },
  { id: 'drafts', label: 'Drafts', description: '3 draft messages' },
  { id: 'sent', label: 'Sent', description: '156 sent messages' },
  { id: 'archive', label: 'Archive', description: '1,234 archived' },
  { id: 'trash', label: 'Trash', description: '12 items' },
]

type SelectionKeys = 'all' | Set<string | number>

function StyledListBoxDemo(props: { onSelectionChange?: (key: string | number) => void }) {
  return (
    <div class="grid gap-6 sm:grid-cols-3">
      {/* Small size */}
      <StyledListBox<MailboxItem>
        items={styledListBoxItems}
        getKey={(item: MailboxItem) => item.id}
        getTextValue={(item: MailboxItem) => item.label}
        selectionMode="single"
        size="sm"
        label="Small ListBox"
        onSelectionChange={(keys: SelectionKeys) => {
          if (keys !== 'all') {
            const key = [...keys][0]
            if (key) props.onSelectionChange?.(key)
          }
        }}
      >
        {(item: MailboxItem) => (
          <StyledListBoxOption id={item.id} description={item.description}>
            {item.label}
          </StyledListBoxOption>
        )}
      </StyledListBox>

      {/* Medium size */}
      <StyledListBox<MailboxItem>
        items={styledListBoxItems}
        getKey={(item: MailboxItem) => item.id}
        getTextValue={(item: MailboxItem) => item.label}
        selectionMode="single"
        size="md"
        label="Medium ListBox"
        onSelectionChange={(keys: SelectionKeys) => {
          if (keys !== 'all') {
            const key = [...keys][0]
            if (key) props.onSelectionChange?.(key)
          }
        }}
      >
        {(item: MailboxItem) => (
          <StyledListBoxOption id={item.id} description={item.description}>
            {item.label}
          </StyledListBoxOption>
        )}
      </StyledListBox>

      {/* Large size */}
      <StyledListBox<MailboxItem>
        items={styledListBoxItems}
        getKey={(item: MailboxItem) => item.id}
        getTextValue={(item: MailboxItem) => item.label}
        selectionMode="single"
        size="lg"
        label="Large ListBox"
        onSelectionChange={(keys: SelectionKeys) => {
          if (keys !== 'all') {
            const key = [...keys][0]
            if (key) props.onSelectionChange?.(key)
          }
        }}
      >
        {(item: MailboxItem) => (
          <StyledListBoxOption id={item.id} description={item.description}>
            {item.label}
          </StyledListBoxOption>
        )}
      </StyledListBox>
    </div>
  )
}

// ============================================
// Styled Tabs Demo (ui package)
// ============================================

interface TabItem {
  id: string
  label: string
  content: string
}

const tabItems: TabItem[] = [
  { id: 'overview', label: 'Overview', content: 'This is the overview panel content. It provides a summary of all features.' },
  { id: 'features', label: 'Features', content: 'Explore the rich features including accessibility, keyboard navigation, and customization.' },
  { id: 'specs', label: 'Specifications', content: 'Technical specifications and requirements for integration.' },
  { id: 'reviews', label: 'Reviews', content: 'User reviews and testimonials about the component library.' },
]

function StyledTabsDemo(props: { onSelectionChange?: (key: string | number) => void }) {
  const [selectedKey, setSelectedKey] = createSignal<string | number>('overview')

  const handleChange = (key: string | number) => {
    setSelectedKey(key)
    props.onSelectionChange?.(key)
  }

  return (
    <div class="space-y-8">
      {/* Underline variant (default) */}
      <div>
        <h4 class="text-sm font-medium text-primary-200 mb-3">Underline Variant</h4>
        <StyledTabs<TabItem>
          items={tabItems}
          getKey={(item: TabItem) => item.id}
          getTextValue={(item: TabItem) => item.label}
          selectedKey={selectedKey()}
          onSelectionChange={handleChange}
          variant="underline"
        >
          <StyledTabList>
            {(item: TabItem) => (
              <StyledTab id={item.id}>{item.label}</StyledTab>
            )}
          </StyledTabList>
          <StyledTabPanel>
            {() => {
              const selected = tabItems.find((item: TabItem) => item.id === selectedKey())
              return <p class="text-primary-300">{selected?.content}</p>
            }}
          </StyledTabPanel>
        </StyledTabs>
      </div>

      {/* Pill variant */}
      <div>
        <h4 class="text-sm font-medium text-primary-200 mb-3">Pill Variant</h4>
        <StyledTabs<TabItem>
          items={tabItems}
          getKey={(item: TabItem) => item.id}
          getTextValue={(item: TabItem) => item.label}
          defaultSelectedKey="features"
          variant="pill"
        >
          <StyledTabList>
            {(item: TabItem) => (
              <StyledTab id={item.id}>{item.label}</StyledTab>
            )}
          </StyledTabList>
          <StyledTabPanel>
            <p class="text-primary-300">{tabItems[1].content}</p>
          </StyledTabPanel>
        </StyledTabs>
      </div>

      {/* Boxed variant with sizes */}
      <div>
        <h4 class="text-sm font-medium text-primary-200 mb-3">Boxed Variant with Sizes</h4>
        <div class="grid gap-6 sm:grid-cols-3">
          {/* Small */}
          <StyledTabs<TabItem>
            items={tabItems.slice(0, 3)}
            getKey={(item: TabItem) => item.id}
            getTextValue={(item: TabItem) => item.label}
            defaultSelectedKey="overview"
            variant="boxed"
            size="sm"
          >
            <StyledTabList>
              {(item: TabItem) => (
                <StyledTab id={item.id}>{item.label}</StyledTab>
              )}
            </StyledTabList>
            <StyledTabPanel>
              <p class="text-primary-400 text-sm">Small tabs content</p>
            </StyledTabPanel>
          </StyledTabs>

          {/* Medium */}
          <StyledTabs<TabItem>
            items={tabItems.slice(0, 3)}
            getKey={(item: TabItem) => item.id}
            getTextValue={(item: TabItem) => item.label}
            defaultSelectedKey="overview"
            variant="boxed"
            size="md"
          >
            <StyledTabList>
              {(item: TabItem) => (
                <StyledTab id={item.id}>{item.label}</StyledTab>
              )}
            </StyledTabList>
            <StyledTabPanel>
              <p class="text-primary-300">Medium tabs content</p>
            </StyledTabPanel>
          </StyledTabs>

          {/* Large */}
          <StyledTabs<TabItem>
            items={tabItems.slice(0, 3)}
            getKey={(item: TabItem) => item.id}
            getTextValue={(item: TabItem) => item.label}
            defaultSelectedKey="overview"
            variant="boxed"
            size="lg"
          >
            <StyledTabList>
              {(item: TabItem) => (
                <StyledTab id={item.id}>{item.label}</StyledTab>
              )}
            </StyledTabList>
            <StyledTabPanel>
              <p class="text-primary-200">Large tabs content</p>
            </StyledTabPanel>
          </StyledTabs>
        </div>
      </div>

      <p class="text-xs text-primary-400">
        Pre-styled Tabs with variants (underline, pill, boxed) and sizes (sm, md, lg). Use arrow keys to navigate between tabs.
      </p>
    </div>
  )
}

// ============================================
// Styled Breadcrumbs Demo (ui package)
// ============================================

interface BreadcrumbData {
  id: string
  label: string
  href?: string
  isCurrent?: boolean
}

const breadcrumbItems: BreadcrumbData[] = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'products', label: 'Products', href: '/products' },
  { id: 'category', label: 'Electronics', href: '/products/electronics' },
  { id: 'item', label: 'Smartphones', isCurrent: true },
]

function StyledBreadcrumbsDemo(props: { onNavigate?: (path: string) => void }) {
  return (
    <div class="space-y-8">
      {/* Default variant */}
      <div>
        <h4 class="text-sm font-medium text-primary-200 mb-3">Default Variant</h4>
        <StyledBreadcrumbs<BreadcrumbData>
          items={breadcrumbItems}
          getKey={(item: BreadcrumbData) => item.id}
        >
          {(item: BreadcrumbData) => (
            <StyledBreadcrumbItem
              isCurrent={item.isCurrent}
              href={item.href}
              onPress={() => props.onNavigate?.(item.href ?? item.label)}
            >
              {item.label}
            </StyledBreadcrumbItem>
          )}
        </StyledBreadcrumbs>
      </div>

      {/* Subtle variant */}
      <div>
        <h4 class="text-sm font-medium text-primary-200 mb-3">Subtle Variant</h4>
        <StyledBreadcrumbs<BreadcrumbData>
          items={breadcrumbItems}
          getKey={(item: BreadcrumbData) => item.id}
          variant="subtle"
        >
          {(item: BreadcrumbData) => (
            <StyledBreadcrumbItem
              isCurrent={item.isCurrent}
              href={item.href}
              onPress={() => props.onNavigate?.(item.href ?? item.label)}
            >
              {item.label}
            </StyledBreadcrumbItem>
          )}
        </StyledBreadcrumbs>
      </div>

      {/* Size variants */}
      <div>
        <h4 class="text-sm font-medium text-primary-200 mb-3">Size Variants</h4>
        <div class="space-y-4">
          {/* Small */}
          <div>
            <span class="text-xs text-primary-400 block mb-1">Small:</span>
            <StyledBreadcrumbs<BreadcrumbData>
              items={breadcrumbItems.slice(0, 3)}
              getKey={(item: BreadcrumbData) => item.id}
              size="sm"
            >
              {(item: BreadcrumbData) => (
                <StyledBreadcrumbItem
                  isCurrent={item.id === 'category'}
                  href={item.href}
                >
                  {item.label}
                </StyledBreadcrumbItem>
              )}
            </StyledBreadcrumbs>
          </div>

          {/* Medium */}
          <div>
            <span class="text-xs text-primary-400 block mb-1">Medium:</span>
            <StyledBreadcrumbs<BreadcrumbData>
              items={breadcrumbItems.slice(0, 3)}
              getKey={(item: BreadcrumbData) => item.id}
              size="md"
            >
              {(item: BreadcrumbData) => (
                <StyledBreadcrumbItem
                  isCurrent={item.id === 'category'}
                  href={item.href}
                >
                  {item.label}
                </StyledBreadcrumbItem>
              )}
            </StyledBreadcrumbs>
          </div>

          {/* Large */}
          <div>
            <span class="text-xs text-primary-400 block mb-1">Large:</span>
            <StyledBreadcrumbs<BreadcrumbData>
              items={breadcrumbItems.slice(0, 3)}
              getKey={(item: BreadcrumbData) => item.id}
              size="lg"
            >
              {(item: BreadcrumbData) => (
                <StyledBreadcrumbItem
                  isCurrent={item.id === 'category'}
                  href={item.href}
                >
                  {item.label}
                </StyledBreadcrumbItem>
              )}
            </StyledBreadcrumbs>
          </div>
        </div>
      </div>

      <p class="text-xs text-primary-400">
        Pre-styled Breadcrumbs with variants (default, subtle) and sizes (sm, md, lg). Click items to navigate.
      </p>
    </div>
  )
}

// ============================================
// Styled NumberField Demo (ui package)
// ============================================

function StyledNumberFieldDemo(props: { onChange?: (value: number) => void }) {
  const [value, setValue] = createSignal(50)
  const [currencyValue, setCurrencyValue] = createSignal(99.99)

  const handleChange = (newValue: number) => {
    setValue(newValue)
    props.onChange?.(newValue)
  }

  return (
    <div class="space-y-8">
      {/* Basic NumberField */}
      <div>
        <h4 class="text-sm font-medium text-primary-200 mb-3">Basic NumberField</h4>
        <div class="max-w-xs">
          <StyledNumberField
            label="Quantity"
            value={value()}
            onChange={handleChange}
            minValue={0}
            maxValue={100}
            step={1}
          />
        </div>
      </div>

      {/* Size variants */}
      <div>
        <h4 class="text-sm font-medium text-primary-200 mb-3">Size Variants</h4>
        <div class="grid gap-6 sm:grid-cols-3">
          <StyledNumberField
            label="Small"
            defaultValue={10}
            size="sm"
            minValue={0}
            maxValue={50}
          />
          <StyledNumberField
            label="Medium (default)"
            defaultValue={25}
            size="md"
            minValue={0}
            maxValue={50}
          />
          <StyledNumberField
            label="Large"
            defaultValue={40}
            size="lg"
            minValue={0}
            maxValue={50}
          />
        </div>
      </div>

      {/* With min/max constraints */}
      <div>
        <h4 class="text-sm font-medium text-primary-200 mb-3">With Min/Max Constraints (0-10)</h4>
        <div class="max-w-xs">
          <StyledNumberField
            label="Rating"
            defaultValue={5}
            minValue={0}
            maxValue={10}
            step={1}
            description="Enter a rating from 0 to 10"
          />
        </div>
      </div>

      {/* Currency formatting */}
      <div>
        <h4 class="text-sm font-medium text-primary-200 mb-3">Currency Formatting</h4>
        <div class="max-w-xs">
          <StyledNumberField
            label="Price"
            value={currencyValue()}
            onChange={setCurrencyValue}
            minValue={0}
            step={0.01}
            formatOptions={{
              style: 'currency',
              currency: 'USD',
            }}
          />
        </div>
      </div>

      {/* Percent formatting */}
      <div>
        <h4 class="text-sm font-medium text-primary-200 mb-3">Percent Formatting</h4>
        <div class="max-w-xs">
          <StyledNumberField
            label="Discount"
            defaultValue={0.15}
            minValue={0}
            maxValue={1}
            step={0.01}
            formatOptions={{
              style: 'percent',
            }}
          />
        </div>
      </div>

      {/* Disabled state */}
      <div>
        <h4 class="text-sm font-medium text-primary-200 mb-3">States</h4>
        <div class="grid gap-6 sm:grid-cols-2">
          <StyledNumberField
            label="Disabled"
            defaultValue={42}
            isDisabled
          />
          <StyledNumberField
            label="Invalid"
            defaultValue={-5}
            isInvalid
            errorMessage="Value must be positive"
          />
        </div>
      </div>

      {/* Hidden stepper */}
      <div>
        <h4 class="text-sm font-medium text-primary-200 mb-3">Hidden Stepper (keyboard only)</h4>
        <div class="max-w-xs">
          <StyledNumberField
            label="Amount"
            defaultValue={100}
            hideStepper
            description="Use arrow keys to adjust"
          />
        </div>
      </div>

      <p class="text-xs text-primary-400">
        NumberField with increment/decrement buttons. Supports keyboard navigation (arrows, Page Up/Down, Home/End),
        number formatting (currency, percent), min/max constraints, and step values.
      </p>
    </div>
  )
}

// ============================================
// Styled SearchField Demo (ui package)
// ============================================

function StyledSearchFieldDemo(props: { onSearch?: (value: string) => void }) {
  const [value, setValue] = createSignal('')

  const handleSubmit = (searchValue: string) => {
    props.onSearch?.(searchValue)
  }

  return (
    <div class="space-y-8">
      {/* Basic SearchField */}
      <div>
        <h4 class="text-sm font-medium text-primary-200 mb-3">Basic SearchField</h4>
        <div class="max-w-md">
          <StyledSearchField
            label="Search"
            placeholder="Search for items..."
            value={value()}
            onChange={setValue}
            onSubmit={handleSubmit}
            onClear={() => setValue('')}
          />
        </div>
      </div>

      {/* Size variants */}
      <div>
        <h4 class="text-sm font-medium text-primary-200 mb-3">Size Variants</h4>
        <div class="grid gap-6 sm:grid-cols-3">
          <StyledSearchField
            label="Small"
            placeholder="Search..."
            size="sm"
            onSubmit={handleSubmit}
          />
          <StyledSearchField
            label="Medium (default)"
            placeholder="Search..."
            size="md"
            onSubmit={handleSubmit}
          />
          <StyledSearchField
            label="Large"
            placeholder="Search..."
            size="lg"
            onSubmit={handleSubmit}
          />
        </div>
      </div>

      {/* Variant styles */}
      <div>
        <h4 class="text-sm font-medium text-primary-200 mb-3">Variants</h4>
        <div class="grid gap-6 sm:grid-cols-2">
          <StyledSearchField
            label="Outline (default)"
            placeholder="Search..."
            variant="outline"
            onSubmit={handleSubmit}
          />
          <StyledSearchField
            label="Filled"
            placeholder="Search..."
            variant="filled"
            onSubmit={handleSubmit}
          />
        </div>
      </div>

      {/* With description */}
      <div>
        <h4 class="text-sm font-medium text-primary-200 mb-3">With Description</h4>
        <div class="max-w-md">
          <StyledSearchField
            label="Product Search"
            placeholder="Enter product name or SKU..."
            description="Press Enter to search, Escape to clear"
            onSubmit={handleSubmit}
          />
        </div>
      </div>

      {/* States */}
      <div>
        <h4 class="text-sm font-medium text-primary-200 mb-3">States</h4>
        <div class="grid gap-6 sm:grid-cols-2">
          <StyledSearchField
            label="Disabled"
            placeholder="Can't search..."
            defaultValue="disabled search"
            isDisabled
          />
          <StyledSearchField
            label="Invalid"
            placeholder="Search..."
            defaultValue="invalid query"
            isInvalid
            errorMessage="Invalid search query"
          />
        </div>
      </div>

      {/* Without search icon */}
      <div>
        <h4 class="text-sm font-medium text-primary-200 mb-3">Hidden Search Icon</h4>
        <div class="max-w-md">
          <StyledSearchField
            label="Filter"
            placeholder="Filter items..."
            hideSearchIcon
            onSubmit={handleSubmit}
          />
        </div>
      </div>

      <p class="text-xs text-primary-400">
        SearchField with clear button. Press Enter to submit, Escape to clear.
        The clear button appears when there's text in the field.
      </p>
    </div>
  )
}

// ============================================
// Styled Slider Demo (ui package)
// ============================================

// ============================================
// Styled ComboBox Demo (ui package)
// ============================================

interface ComboBoxItem {
  id: string
  name: string
  category: string
}

const comboBoxItems: ComboBoxItem[] = [
  { id: 'apple', name: 'Apple', category: 'Fruit' },
  { id: 'banana', name: 'Banana', category: 'Fruit' },
  { id: 'cherry', name: 'Cherry', category: 'Fruit' },
  { id: 'carrot', name: 'Carrot', category: 'Vegetable' },
  { id: 'celery', name: 'Celery', category: 'Vegetable' },
  { id: 'cucumber', name: 'Cucumber', category: 'Vegetable' },
  { id: 'date', name: 'Date', category: 'Fruit' },
  { id: 'elderberry', name: 'Elderberry', category: 'Fruit' },
]

function StyledComboBoxDemo(props: { onSelectionChange?: (key: string | number | null) => void }) {
  const [selectedKey, setSelectedKey] = createSignal<string | number | null>(null)
  const [requiredKey, setRequiredKey] = createSignal<string | number | null>(null)
  const [requiredTouched, setRequiredTouched] = createSignal(false)

  const handleChange = (key: string | number | null) => {
    setSelectedKey(key)
    props.onSelectionChange?.(key)
  }

  const handleRequiredChange = (key: string | number | null) => {
    setRequiredKey(key)
  }

  const handleRequiredBlur = () => {
    setRequiredTouched(true)
  }

  const isRequiredInvalid = () => requiredTouched() && !requiredKey()

  return (
    <div class="space-y-8">
      {/* Basic ComboBox */}
      <div>
        <h4 class="text-sm font-medium text-primary-200 mb-3">Basic ComboBox with Filtering</h4>
        <div class="max-w-md">
          <StyledComboBox<ComboBoxItem>
            items={comboBoxItems}
            getKey={(item: ComboBoxItem) => item.id}
            getTextValue={(item: ComboBoxItem) => item.name}
            selectedKey={selectedKey()}
            onSelectionChange={handleChange}
            defaultFilter={defaultContainsFilter}
            label="Select a food"
            placeholder="Type to filter..."
          >
            <StyledComboBoxInputGroup>
              <StyledComboBoxInput />
              <StyledComboBoxButton />
            </StyledComboBoxInputGroup>
            <StyledComboBoxListBox>
              {(item: ComboBoxItem) => (
                <StyledComboBoxOption id={item.id}>
                  <div class="flex justify-between items-center w-full">
                    <span>{item.name}</span>
                    <span class="text-xs text-primary-400">{item.category}</span>
                  </div>
                </StyledComboBoxOption>
              )}
            </StyledComboBoxListBox>
          </StyledComboBox>
        </div>
      </div>

      {/* Size variants */}
      <div>
        <h4 class="text-sm font-medium text-primary-200 mb-3">Size Variants</h4>
        <div class="grid gap-6 sm:grid-cols-3">
          <StyledComboBox<ComboBoxItem>
            items={comboBoxItems}
            getKey={(item: ComboBoxItem) => item.id}
            getTextValue={(item: ComboBoxItem) => item.name}
            defaultFilter={defaultContainsFilter}
            size="sm"
            label="Small"
            placeholder="Filter..."
          >
            <StyledComboBoxInputGroup>
              <StyledComboBoxInput />
              <StyledComboBoxButton />
            </StyledComboBoxInputGroup>
            <StyledComboBoxListBox>
              {(item: ComboBoxItem) => (
                <StyledComboBoxOption id={item.id}>{item.name}</StyledComboBoxOption>
              )}
            </StyledComboBoxListBox>
          </StyledComboBox>

          <StyledComboBox<ComboBoxItem>
            items={comboBoxItems}
            getKey={(item: ComboBoxItem) => item.id}
            getTextValue={(item: ComboBoxItem) => item.name}
            defaultFilter={defaultContainsFilter}
            size="md"
            label="Medium"
            placeholder="Filter..."
          >
            <StyledComboBoxInputGroup>
              <StyledComboBoxInput />
              <StyledComboBoxButton />
            </StyledComboBoxInputGroup>
            <StyledComboBoxListBox>
              {(item: ComboBoxItem) => (
                <StyledComboBoxOption id={item.id}>{item.name}</StyledComboBoxOption>
              )}
            </StyledComboBoxListBox>
          </StyledComboBox>

          <StyledComboBox<ComboBoxItem>
            items={comboBoxItems}
            getKey={(item: ComboBoxItem) => item.id}
            getTextValue={(item: ComboBoxItem) => item.name}
            defaultFilter={defaultContainsFilter}
            size="lg"
            label="Large"
            placeholder="Filter..."
          >
            <StyledComboBoxInputGroup>
              <StyledComboBoxInput />
              <StyledComboBoxButton />
            </StyledComboBoxInputGroup>
            <StyledComboBoxListBox>
              {(item: ComboBoxItem) => (
                <StyledComboBoxOption id={item.id}>{item.name}</StyledComboBoxOption>
              )}
            </StyledComboBoxListBox>
          </StyledComboBox>
        </div>
      </div>

      {/* With description and validation */}
      <div>
        <h4 class="text-sm font-medium text-primary-200 mb-3">With Description & Validation</h4>
        <div class="grid gap-6 sm:grid-cols-2">
          <StyledComboBox<ComboBoxItem>
            items={comboBoxItems}
            getKey={(item: ComboBoxItem) => item.id}
            getTextValue={(item: ComboBoxItem) => item.name}
            defaultFilter={defaultContainsFilter}
            label="Favorite Food"
            placeholder="Start typing..."
            description="Choose your favorite food from the list"
          >
            <StyledComboBoxInputGroup>
              <StyledComboBoxInput />
              <StyledComboBoxButton />
            </StyledComboBoxInputGroup>
            <StyledComboBoxListBox>
              {(item: ComboBoxItem) => (
                <StyledComboBoxOption id={item.id}>{item.name}</StyledComboBoxOption>
              )}
            </StyledComboBoxListBox>
          </StyledComboBox>

          <StyledComboBox<ComboBoxItem>
            items={comboBoxItems}
            getKey={(item: ComboBoxItem) => item.id}
            getTextValue={(item: ComboBoxItem) => item.name}
            defaultFilter={defaultContainsFilter}
            selectedKey={requiredKey()}
            onSelectionChange={handleRequiredChange}
            onBlur={handleRequiredBlur}
            label="Required Food"
            placeholder="Select one..."
            isInvalid={isRequiredInvalid()}
            errorMessage={isRequiredInvalid() ? "Please select a food item" : undefined}
          >
            <StyledComboBoxInputGroup>
              <StyledComboBoxInput />
              <StyledComboBoxButton />
            </StyledComboBoxInputGroup>
            <StyledComboBoxListBox>
              {(item: ComboBoxItem) => (
                <StyledComboBoxOption id={item.id}>{item.name}</StyledComboBoxOption>
              )}
            </StyledComboBoxListBox>
          </StyledComboBox>
        </div>
      </div>

      {/* Disabled state */}
      <div>
        <h4 class="text-sm font-medium text-primary-200 mb-3">Disabled</h4>
        <div class="max-w-md">
          <StyledComboBox<ComboBoxItem>
            items={comboBoxItems}
            getKey={(item: ComboBoxItem) => item.id}
            getTextValue={(item: ComboBoxItem) => item.name}
            defaultSelectedKey="apple"
            isDisabled
            label="Disabled ComboBox"
          >
            <StyledComboBoxInputGroup>
              <StyledComboBoxInput />
              <StyledComboBoxButton />
            </StyledComboBoxInputGroup>
            <StyledComboBoxListBox>
              {(item: ComboBoxItem) => (
                <StyledComboBoxOption id={item.id}>{item.name}</StyledComboBoxOption>
              )}
            </StyledComboBoxListBox>
          </StyledComboBox>
        </div>
      </div>

      <p class="text-xs text-primary-400">
        ComboBox combines a text input with a filterable listbox. Type to filter options, use arrow keys to navigate,
        Enter to select, Escape to close. Selected: <strong class="text-primary-200">{selectedKey() || 'none'}</strong>
      </p>
    </div>
  )
}

function StyledSliderDemo(props: { onChange?: (value: number) => void }) {
  const [value, setValue] = createSignal(50)

  const handleChange = (newValue: number) => {
    setValue(newValue)
    props.onChange?.(newValue)
  }

  return (
    <div class="space-y-8">
      {/* Basic Slider */}
      <div>
        <h4 class="text-sm font-medium text-primary-200 mb-3">Basic Slider</h4>
        <div class="max-w-md">
          <StyledSlider
            label="Volume"
            value={value()}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Size variants */}
      <div>
        <h4 class="text-sm font-medium text-primary-200 mb-3">Size Variants</h4>
        <div class="grid gap-6">
          <StyledSlider
            label="Small"
            defaultValue={30}
            size="sm"
            onChange={props.onChange}
          />
          <StyledSlider
            label="Medium (default)"
            defaultValue={50}
            size="md"
            onChange={props.onChange}
          />
          <StyledSlider
            label="Large"
            defaultValue={70}
            size="lg"
            onChange={props.onChange}
          />
        </div>
      </div>

      {/* Variant styles */}
      <div>
        <h4 class="text-sm font-medium text-primary-200 mb-3">Variants</h4>
        <div class="grid gap-6">
          <StyledSlider
            label="Default"
            defaultValue={40}
            variant="default"
            onChange={props.onChange}
          />
          <StyledSlider
            label="Accent"
            defaultValue={60}
            variant="accent"
            onChange={props.onChange}
          />
        </div>
      </div>

      {/* Custom range and step */}
      <div>
        <h4 class="text-sm font-medium text-primary-200 mb-3">Custom Range and Step</h4>
        <div class="grid gap-6">
          <StyledSlider
            label="Temperature (°C)"
            defaultValue={22}
            minValue={16}
            maxValue={30}
            step={0.5}
            showMinMax
            onChange={props.onChange}
          />
          <StyledSlider
            label="Rating"
            defaultValue={3}
            minValue={1}
            maxValue={5}
            step={1}
            showMinMax
            onChange={props.onChange}
          />
        </div>
      </div>

      {/* With formatting */}
      <div>
        <h4 class="text-sm font-medium text-primary-200 mb-3">With Formatting</h4>
        <div class="grid gap-6">
          <StyledSlider
            label="Price"
            defaultValue={500}
            minValue={0}
            maxValue={1000}
            step={50}
            formatOptions={{ style: 'currency', currency: 'USD' }}
            onChange={props.onChange}
          />
          <StyledSlider
            label="Discount"
            defaultValue={25}
            minValue={0}
            maxValue={100}
            formatOptions={{ style: 'percent', maximumFractionDigits: 0 }}
            onChange={(v) => props.onChange?.(v / 100)}
          />
        </div>
      </div>

      {/* Disabled */}
      <div>
        <h4 class="text-sm font-medium text-primary-200 mb-3">Disabled</h4>
        <div class="max-w-md">
          <StyledSlider
            label="Disabled Slider"
            defaultValue={50}
            isDisabled
          />
        </div>
      </div>

      {/* Without output */}
      <div>
        <h4 class="text-sm font-medium text-primary-200 mb-3">Without Output</h4>
        <div class="max-w-md">
          <StyledSlider
            label="Brightness"
            defaultValue={75}
            showOutput={false}
            onChange={props.onChange}
          />
        </div>
      </div>

      <p class="text-xs text-primary-400">
        Slider with keyboard support (arrows, Page Up/Down, Home/End) and drag functionality.
        Supports custom ranges, steps, and number formatting.
      </p>
    </div>
  )
}

// TagGroup Demo Components
interface TagItem {
  id: string
  name: string
}

function TagGroupDemo() {
  const [tags, setTags] = createSignal<TagItem[]>([
    { id: '1', name: 'React' },
    { id: '2', name: 'SolidJS' },
    { id: '3', name: 'Vue' },
    { id: '4', name: 'Angular' },
    { id: '5', name: 'Svelte' },
  ])

  const handleRemove = (keys: Set<string | number>) => {
    setTags((prev) => prev.filter((tag) => !keys.has(tag.id)))
  }

  return (
    <TagGroup
      label="Frameworks"
      items={tags()}
      onRemove={handleRemove}
    >
      {(item) => item.name}
    </TagGroup>
  )
}

function TagGroupSelectionDemo() {
  const [selectedKeys, setSelectedKeys] = createSignal<Set<string | number>>(new Set(['ts']))

  const items: TagItem[] = [
    { id: 'ts', name: 'TypeScript' },
    { id: 'js', name: 'JavaScript' },
    { id: 'rust', name: 'Rust' },
    { id: 'go', name: 'Go' },
    { id: 'py', name: 'Python' },
  ]

  const handleSelectionChange = (keys: 'all' | Set<string | number>) => {
    if (keys === 'all') {
      setSelectedKeys(new Set(items.map((i) => i.id)))
    } else {
      setSelectedKeys(keys)
    }
  }

  return (
    <div class="space-y-2">
      <TagGroup
        label="Languages"
        items={items}
        selectionMode="multiple"
        selectedKeys={selectedKeys()}
        onSelectionChange={handleSelectionChange}
        variant="outline"
      >
        {(item) => item.name}
      </TagGroup>
      <p class="text-xs text-primary-400">
        Selected: {Array.from(selectedKeys()).join(', ') || 'None'}
      </p>
    </div>
  )
}

// ============================================
// CALENDAR DEMOS
// ============================================

function CalendarDemo() {
  const [selectedDate, setSelectedDate] = createSignal<DateValue | null>(null)

  console.log('[CalendarDemo] Rendering CalendarDemo component');

  return (
    <div class="space-y-2">
      <Calendar
        aria-label="Select a date"
        value={selectedDate()}
        onChange={setSelectedDate}
      />
      <p class="text-xs text-primary-400">
        Selected: {selectedDate()?.toString() || 'None'}
      </p>
    </div>
  )
}

function CalendarDisabledDemo() {
  const today = new CalendarDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())

  // Disable weekends
  const isDateUnavailable = (date: DateValue) => {
    const d = date as CalendarDateType
    const jsDate = new Date(d.year, d.month - 1, d.day)
    const day = jsDate.getDay()
    return day === 0 || day === 6 // Sunday = 0, Saturday = 6
  }

  return (
    <Calendar
      aria-label="Select a weekday"
      isDateUnavailable={isDateUnavailable}
      defaultValue={today}
    />
  )
}

// ============================================
// DATEPICKER DEMOS
// ============================================

function DatePickerDemo() {
  const [selectedDate, setSelectedDate] = createSignal<DateValue | null>(null)

  return (
    <div class="space-y-2">
      <DatePicker
        label="Event Date"
        value={selectedDate()}
        onChange={setSelectedDate}
      />
      <p class="text-xs text-primary-400">
        Selected: {selectedDate()?.toString() || 'None'}
      </p>
    </div>
  )
}

function DatePickerRangeDemo() {
  const today = new CalendarDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())
  const minDate = today
  const maxDate = new CalendarDate(today.year, today.month + 3, today.day)

  return (
    <DatePicker
      label="Booking Date"
      minValue={minDate}
      maxValue={maxDate}
      placeholderValue={today}
    />
  )
}

// ============================================
// TABLE DEMO
// ============================================

function TableDemo() {
  const columns = [
    { key: 'name', name: 'Name' },
    { key: 'role', name: 'Role' },
    { key: 'status', name: 'Status' },
  ];

  const rows = [
    { id: '1', name: 'Alice Johnson', role: 'Developer', status: 'Active' },
    { id: '2', name: 'Bob Smith', role: 'Designer', status: 'Active' },
    { id: '3', name: 'Carol White', role: 'Manager', status: 'Away' },
    { id: '4', name: 'David Brown', role: 'Developer', status: 'Active' },
    { id: '5', name: 'Eve Davis', role: 'QA Engineer', status: 'Offline' },
  ];

  const [selectedKeys, setSelectedKeys] = createSignal<Set<string>>(new Set());

  return (
    <div class="space-y-2">
      <Table
        aria-label="Team members"
        items={rows}
        columns={columns}
        getKey={(item) => item.id}
        selectionMode="multiple"
        selectedKeys={selectedKeys()}
        onSelectionChange={(keys) => setSelectedKeys(keys as Set<string>)}
        class="w-full border-collapse text-sm"
      >
        {() => (
          <>
            <TableHeader class="bg-bg-300">
              {() => (
                <For each={columns}>
                  {(column) => (
                    <TableColumn
                      id={column.key}
                      class="px-4 py-2 text-left font-medium text-primary-200 border-b border-bg-400"
                    >
                      {column.name}
                    </TableColumn>
                  )}
                </For>
              )}
            </TableHeader>
            <TableBody class="divide-y divide-bg-400">
              {(row) => (
                <TableRow
                  id={row.id}
                  class="hover:bg-bg-300 transition-colors data-[selected]:bg-accent-600/20"
                >
                  {() => (
                    <>
                      <TableCell class="px-4 py-2 text-primary-100">{row.name}</TableCell>
                      <TableCell class="px-4 py-2 text-primary-300">{row.role}</TableCell>
                      <TableCell class="px-4 py-2">
                        <span class={`px-2 py-0.5 rounded-full text-xs ${
                          row.status === 'Active' ? 'bg-success-600/20 text-success-400' :
                          row.status === 'Away' ? 'bg-warning-600/20 text-warning-400' :
                          'bg-bg-400 text-primary-400'
                        }`}>
                          {row.status}
                        </span>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              )}
            </TableBody>
          </>
        )}
      </Table>
      <p class="text-xs text-primary-400">
        Selected: {selectedKeys().size > 0 ? Array.from(selectedKeys()).join(', ') : 'None'}
      </p>
    </div>
  );
}

// ============================================
// GRIDLIST DEMO
// ============================================

function GridListDemo() {
  const items = [
    { id: 'photos', label: 'Photos', icon: '📷' },
    { id: 'videos', label: 'Videos', icon: '🎬' },
    { id: 'music', label: 'Music', icon: '🎵' },
    { id: 'documents', label: 'Documents', icon: '📄' },
    { id: 'downloads', label: 'Downloads', icon: '⬇️' },
    { id: 'projects', label: 'Projects', icon: '📁' },
  ];

  const [selectedKeys, setSelectedKeys] = createSignal<Set<string>>(new Set());

  return (
    <div class="space-y-2">
      <GridList
        aria-label="File categories"
        items={items}
        getKey={(item) => item.id}
        getTextValue={(item) => item.label}
        selectionMode="multiple"
        selectedKeys={selectedKeys()}
        onSelectionChange={(keys) => setSelectedKeys(keys as Set<string>)}
        class="grid grid-cols-3 gap-2"
      >
        {(item) => (
          <GridListItem
            id={item.id}
            class="flex flex-col items-center justify-center p-3 rounded-lg border border-bg-400 hover:border-accent-500 hover:bg-bg-300 cursor-pointer transition-colors data-[selected]:border-accent-500 data-[selected]:bg-accent-600/20"
          >
            <span class="text-2xl mb-1">{item.icon}</span>
            <span class="text-xs text-primary-200">{item.label}</span>
          </GridListItem>
        )}
      </GridList>
      <p class="text-xs text-primary-400">
        Selected: {selectedKeys().size > 0 ? Array.from(selectedKeys()).join(', ') : 'None'}
      </p>
    </div>
  );
}

// ============================================
// TREE DEMO
// ============================================

function TreeDemo() {
  // Tree data with hierarchical structure
  const treeData = [
    {
      key: 'src',
      name: 'src',
      icon: '📁',
      children: [
        {
          key: 'components',
          name: 'components',
          icon: '📁',
          children: [
            { key: 'Button.tsx', name: 'Button.tsx', icon: '📄' },
            { key: 'Dialog.tsx', name: 'Dialog.tsx', icon: '📄' },
          ],
        },
        {
          key: 'utils',
          name: 'utils',
          icon: '📁',
          children: [
            { key: 'helpers.ts', name: 'helpers.ts', icon: '📄' },
          ],
        },
        { key: 'index.ts', name: 'index.ts', icon: '📄' },
      ],
    },
    { key: 'package.json', name: 'package.json', icon: '📄' },
  ];

  const [expandedKeys, setExpandedKeys] = createSignal<Set<string>>(new Set(['src', 'components']));
  const [selectedKeys, setSelectedKeys] = createSignal<Set<string>>(new Set());

  return (
    <div class="space-y-2">
      <Tree
        aria-label="Project structure"
        items={treeData}
        selectionMode="multiple"
        selectedKeys={selectedKeys()}
        onSelectionChange={(keys) => setSelectedKeys(keys as Set<string>)}
        expandedKeys={expandedKeys()}
        onExpandedChange={(keys) => setExpandedKeys(keys as Set<string>)}
        class="text-sm"
      >
        {(item, state) => (
          <TreeItem
            id={item.key}
            class="group"
          >
            {() => (
              <div
                class="flex items-center gap-1 px-2 py-1 rounded hover:bg-bg-300 data-[selected]:bg-accent-600/20"
                style={{ "padding-left": `${state.level * 16 + 8}px` }}
              >
                {state.isExpandable ? (
                  <TreeExpandButton class="w-4 h-4 text-primary-400 hover:text-primary-200" />
                ) : (
                  <span class="w-4" />
                )}
                <span class="text-primary-300">{item.icon}</span>
                <span class="text-primary-200">{item.name}</span>
              </div>
            )}
          </TreeItem>
        )}
      </Tree>
      <p class="text-xs text-primary-400">
        Selected: {selectedKeys().size > 0 ? Array.from(selectedKeys()).join(', ') : 'None'}
      </p>
    </div>
  );
}

// ============================================
// RANGE CALENDAR DEMO
// ============================================

function RangeCalendarDemo() {
  const [range, setRange] = createSignal<RangeValue<DateValue> | null>(null);

  return (
    <div class="space-y-2">
      <RangeCalendar
        aria-label="Select date range"
        value={range()}
        onChange={setRange}
      />
      <p class="text-xs text-primary-400">
        Range: {range() ? `${range()!.start?.toString()} - ${range()!.end?.toString()}` : 'None'}
      </p>
    </div>
  );
}

// ============================================
// DATEFIELD DEMO
// ============================================

function DateFieldDemo() {
  const [date, setDate] = createSignal<DateValue | null>(null);

  return (
    <div class="space-y-4">
      <DateField
        label="Birth Date"
        value={date()}
        onChange={setDate}
      />
      <p class="text-xs text-primary-400">
        Value: {date()?.toString() || 'None'}
      </p>
    </div>
  );
}

// ============================================
// TIMEFIELD DEMO
// ============================================

function TimeFieldDemo() {
  const [time, setTime] = createSignal<TimeValue | null>(null);

  return (
    <div class="space-y-4">
      <TimeField
        label="Meeting Time"
        value={time()}
        onChange={setTime}
      />
      <p class="text-xs text-primary-400">
        Value: {time()?.toString() || 'None'}
      </p>
    </div>
  );
}

// ============================================
// COLOR SLIDER DEMO
// ============================================

function ColorSliderDemo() {
  const [color, setColor] = createSignal(parseColor('hsl(200, 100%, 50%)'));

  return (
    <div class="space-y-4">
      <ColorSlider
        channel="hue"
        value={color()}
        onChange={setColor}
        class="w-full"
      >
        {() => (
          <>
            <div class="flex justify-between text-sm text-primary-300 mb-1">
              <span>Hue</span>
              <span>{Math.round(color().getChannelValue('hue'))}°</span>
            </div>
            <ColorSliderTrack class="h-6 rounded-md">
              {() => (
                <ColorSliderThumb class="w-4 h-4 rounded-full border-2 border-white shadow-md transform -translate-y-1/2 top-1/2" />
              )}
            </ColorSliderTrack>
          </>
        )}
      </ColorSlider>
      <ColorSlider
        channel="saturation"
        value={color()}
        onChange={setColor}
        class="w-full"
      >
        {() => (
          <>
            <div class="flex justify-between text-sm text-primary-300 mb-1">
              <span>Saturation</span>
              <span>{Math.round(color().getChannelValue('saturation'))}%</span>
            </div>
            <ColorSliderTrack class="h-6 rounded-md">
              {() => (
                <ColorSliderThumb class="w-4 h-4 rounded-full border-2 border-white shadow-md transform -translate-y-1/2 top-1/2" />
              )}
            </ColorSliderTrack>
          </>
        )}
      </ColorSlider>
      <ColorSlider
        channel="lightness"
        value={color()}
        onChange={setColor}
        class="w-full"
      >
        {() => (
          <>
            <div class="flex justify-between text-sm text-primary-300 mb-1">
              <span>Lightness</span>
              <span>{Math.round(color().getChannelValue('lightness'))}%</span>
            </div>
            <ColorSliderTrack class="h-6 rounded-md">
              {() => (
                <ColorSliderThumb class="w-4 h-4 rounded-full border-2 border-white shadow-md transform -translate-y-1/2 top-1/2" />
              )}
            </ColorSliderTrack>
          </>
        )}
      </ColorSlider>
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded border border-bg-400" style={{ background: color().toString('css') }} />
        <span class="text-xs text-primary-400">{color().toString('css')}</span>
      </div>
    </div>
  );
}

// ============================================
// COLOR AREA DEMO
// ============================================

function ColorAreaDemo() {
  const [color, setColor] = createSignal(parseColor('hsb(200, 100%, 100%)'));

  return (
    <div class="space-y-4">
      <ColorArea
        value={color()}
        onChange={setColor}
        xChannel="saturation"
        yChannel="brightness"
        class="w-48 h-48 rounded-lg overflow-hidden"
      >
        {() => (
          <>
            <ColorAreaGradient class="w-full h-full" />
            <ColorAreaThumb class="w-4 h-4 rounded-full border-2 border-white shadow-md" />
          </>
        )}
      </ColorArea>
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded border border-bg-400" style={{ background: color().toString('css') }} />
        <span class="text-xs text-primary-400">{color().toString('css')}</span>
      </div>
    </div>
  );
}

// ============================================
// COLOR WHEEL DEMO
// ============================================

function ColorWheelDemo() {
  const [color, setColor] = createSignal(parseColor('hsl(200, 100%, 50%)'));

  return (
    <div class="space-y-4">
      <ColorWheel
        value={color()}
        onChange={setColor}
        outerRadius={80}
        innerRadius={60}
      >
        {() => (
          <>
            <ColorWheelTrack class="rounded-full" />
            <ColorWheelThumb class="w-4 h-4 rounded-full border-2 border-white shadow-md" />
          </>
        )}
      </ColorWheel>
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded border border-bg-400" style={{ background: color().toString('css') }} />
        <span class="text-xs text-primary-400">Hue: {Math.round(color().getChannelValue('hue'))}°</span>
      </div>
    </div>
  );
}

// ============================================
// COLOR FIELD DEMO
// ============================================

function ColorFieldDemo() {
  const [color, setColor] = createSignal<Color | null>(parseColor('#3b82f6'));

  return (
    <div class="space-y-4">
      <ColorField
        label="Color"
        value={color()}
        onChange={setColor}
      >
        {() => (
          <>
            <div class="text-sm text-primary-300 mb-1">Color</div>
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded border border-bg-400" style={{ background: color()?.toString('css') || 'transparent' }} />
              <ColorFieldInput class="flex-1 px-3 py-2 rounded-md border border-bg-400 bg-bg-200 text-primary-100 focus:outline-none focus:border-accent-500" />
            </div>
          </>
        )}
      </ColorField>
      <p class="text-xs text-primary-400">
        Value: {color()?.toString('css') || 'None'}
      </p>
    </div>
  );
}

// ============================================
// COLOR SWATCH DEMO
// ============================================

function ColorSwatchDemo() {
  const colors = [
    '#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6',
    '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280', '#000000',
  ];

  const [selectedColor, setSelectedColor] = createSignal(colors[5]);

  return (
    <div class="space-y-4">
      <div class="flex flex-wrap gap-2">
        <For each={colors}>
          {(color) => (
            <button
              onClick={() => setSelectedColor(color)}
              class={`rounded-lg overflow-hidden transition-transform ${selectedColor() === color ? 'ring-2 ring-accent-500 ring-offset-2 ring-offset-bg-200 scale-110' : ''}`}
            >
              <ColorSwatch
                color={parseColor(color)}
                class="w-8 h-8"
              />
            </button>
          )}
        </For>
      </div>
      <div class="flex items-center gap-2">
        <ColorSwatch
          color={parseColor(selectedColor())}
          class="w-12 h-12 rounded-lg"
        />
        <span class="text-sm text-primary-300">{selectedColor()}</span>
      </div>
    </div>
  );
}
