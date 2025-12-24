/**
 * Tabs component for solidaria-components
 *
 * A pre-wired headless tabs component that combines state + aria hooks.
 * Port of react-aria-components/src/Tabs.tsx
 */

import {
  type JSX,
  createContext,
  createMemo,
  splitProps,
  useContext,
  For,
  Show,
} from 'solid-js';
import {
  createTabList,
  createTab,
  createTabPanel,
  createFocusRing,
  createHover,
  type AriaTabListProps,
  type AriaTabProps,
  type AriaTabPanelProps,
} from '@proyecto-viviana/solidaria';
import {
  createTabListState,
  type TabListState,
  type Key,
  type TabOrientation,
  type KeyboardActivation,
} from '@proyecto-viviana/solid-stately';
import {
  type RenderChildren,
  type ClassNameOrFunction,
  type StyleOrFunction,
  type SlotProps,
  useRenderProps,
  filterDOMProps,
} from './utils';

// ============================================
// TYPES
// ============================================

export interface TabsRenderProps {
  /** The orientation of the tabs. */
  orientation: TabOrientation;
  /** Whether the tabs are disabled. */
  isDisabled: boolean;
}

export interface TabsProps<T> extends SlotProps {
  /** The items to render in the tab list. */
  items?: T[];
  /** Function to get the key from an item. */
  getKey?: (item: T) => Key;
  /** Function to get the text value from an item. */
  getTextValue?: (item: T) => string;
  /** Function to check if an item is disabled. */
  getDisabled?: (item: T) => boolean;
  /** Keys of disabled tabs. */
  disabledKeys?: Iterable<Key>;
  /** The currently selected tab key (controlled). */
  selectedKey?: Key | null;
  /** The default selected tab key (uncontrolled). */
  defaultSelectedKey?: Key;
  /** Handler for tab selection changes. */
  onSelectionChange?: (key: Key) => void;
  /** Whether the tabs are disabled. */
  isDisabled?: boolean;
  /** The keyboard activation mode. */
  keyboardActivation?: KeyboardActivation;
  /** The orientation of the tabs. */
  orientation?: TabOrientation;
  /** The children of the component. */
  children?: RenderChildren<TabsRenderProps>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<TabsRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<TabsRenderProps>;
}

export interface TabListRenderProps {
  /** The orientation of the tab list. */
  orientation: TabOrientation;
  /** Whether the tab list is disabled. */
  isDisabled: boolean;
  /** Whether the tab list has focus. */
  isFocused: boolean;
  /** Whether the tab list has visible focus. */
  isFocusVisible: boolean;
}

export interface TabListProps<T> extends Omit<AriaTabListProps, 'children'>, SlotProps {
  /** The children of the tab list - render function for each item. */
  children: (item: T) => JSX.Element;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<TabListRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<TabListRenderProps>;
}

export interface TabRenderProps {
  /** Whether the tab is selected. */
  isSelected: boolean;
  /** Whether the tab is focused. */
  isFocused: boolean;
  /** Whether the tab has visible focus ring. */
  isFocusVisible: boolean;
  /** Whether the tab is pressed. */
  isPressed: boolean;
  /** Whether the tab is hovered. */
  isHovered: boolean;
  /** Whether the tab is disabled. */
  isDisabled: boolean;
}

export interface TabProps extends Omit<AriaTabProps, 'key'>, SlotProps {
  /** The unique key for the tab. */
  id: Key;
  /** The children of the tab. */
  children?: RenderChildren<TabRenderProps>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<TabRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<TabRenderProps>;
}

export interface TabPanelRenderProps {
  /** Whether the panel is the selected one. */
  isSelected: boolean;
  /** Whether the panel is focused. */
  isFocused: boolean;
  /** Whether the panel has visible focus ring. */
  isFocusVisible: boolean;
}

export interface TabPanelProps extends AriaTabPanelProps, SlotProps {
  /** The children of the tab panel. */
  children?: RenderChildren<TabPanelRenderProps>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<TabPanelRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<TabPanelRenderProps>;
  /** Whether to keep the panel mounted when not selected. */
  shouldForceMount?: boolean;
}

// ============================================
// CONTEXT
// ============================================

interface TabsContextValue<T> {
  state: TabListState<T>;
  items: T[];
}

export const TabsContext = createContext<TabsContextValue<unknown> | null>(null);
export const TabsStateContext = createContext<TabListState<unknown> | null>(null);

// ============================================
// COMPONENTS
// ============================================

/**
 * Tabs provide a way to organize content into multiple sections, with only one section visible at a time.
 */
export function Tabs<T>(props: TabsProps<T>): JSX.Element {
  const [local, stateProps, rest] = splitProps(
    props,
    ['children', 'class', 'style', 'slot'],
    ['items', 'getKey', 'getTextValue', 'getDisabled', 'disabledKeys', 'selectedKey', 'defaultSelectedKey', 'onSelectionChange', 'isDisabled', 'keyboardActivation', 'orientation']
  );

  // Create tab list state
  const state = createTabListState<T>({
    get items() {
      return stateProps.items;
    },
    get getKey() {
      return stateProps.getKey;
    },
    get getTextValue() {
      return stateProps.getTextValue;
    },
    get getDisabled() {
      return stateProps.getDisabled;
    },
    get disabledKeys() {
      return stateProps.disabledKeys;
    },
    get selectedKey() {
      return stateProps.selectedKey;
    },
    get defaultSelectedKey() {
      return stateProps.defaultSelectedKey;
    },
    get onSelectionChange() {
      return stateProps.onSelectionChange;
    },
    get isDisabled() {
      return stateProps.isDisabled;
    },
    get keyboardActivation() {
      return stateProps.keyboardActivation;
    },
    get orientation() {
      return stateProps.orientation;
    },
  });

  // Render props values
  const renderValues = createMemo<TabsRenderProps>(() => ({
    orientation: state.orientation(),
    isDisabled: state.isDisabled(),
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      class: local.class,
      style: local.style,
      children: local.children,
      defaultClassName: 'solidaria-Tabs',
    },
    renderValues
  );

  // Filter DOM props
  const domProps = createMemo(() => filterDOMProps(rest as Record<string, unknown>, { global: true }));

  return (
    <TabsContext.Provider value={{ state, items: stateProps.items ?? [] }}>
      <TabsStateContext.Provider value={state}>
        <div
          {...domProps()}
          class={renderProps.class()}
          style={renderProps.style()}
          data-orientation={state.orientation()}
          data-disabled={state.isDisabled() || undefined}
        >
          {renderProps.children}
        </div>
      </TabsStateContext.Provider>
    </TabsContext.Provider>
  );
}

/**
 * A TabList contains Tab elements that represent the available tabs.
 */
export function TabList<T>(props: TabListProps<T>): JSX.Element {
  const [local, ariaProps] = splitProps(props, [
    'children',
    'class',
    'style',
    'slot',
  ]);

  // Get state from context
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('TabList must be used within a Tabs component');
  }
  const state = context.state as TabListState<T>;
  const items = context.items as T[];

  // Create tab list aria props
  const { tabListProps } = createTabList<T>(ariaProps, state);

  // Create focus ring
  const { isFocused, isFocusVisible, focusProps } = createFocusRing();

  // Render props values
  const renderValues = createMemo<TabListRenderProps>(() => ({
    orientation: state.orientation(),
    isDisabled: state.isDisabled(),
    isFocused: state.isFocused() || isFocused(),
    isFocusVisible: isFocusVisible(),
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-TabList',
    },
    renderValues
  );

  // Combine event handlers
  const handleKeyDown = (e: KeyboardEvent) => {
    tabListProps.onKeyDown(e);
  };

  const handleFocus = (e: FocusEvent) => {
    tabListProps.onFocus(e);
    focusProps.onFocus?.(e);
  };

  const handleBlur = (e: FocusEvent) => {
    tabListProps.onBlur(e);
    focusProps.onBlur?.(e);
  };

  return (
    <div
      role={tabListProps.role}
      aria-orientation={tabListProps['aria-orientation']}
      aria-label={tabListProps['aria-label']}
      aria-labelledby={tabListProps['aria-labelledby']}
      aria-describedby={tabListProps['aria-describedby']}
      class={renderProps.class()}
      style={renderProps.style()}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
      data-focused={state.isFocused() || undefined}
      data-focus-visible={isFocusVisible() || undefined}
      data-orientation={state.orientation()}
      data-disabled={state.isDisabled() || undefined}
    >
      <For each={items}>{(item) => local.children(item)}</For>
    </div>
  );
}

/**
 * A Tab represents an individual tab in a TabList.
 */
export function Tab(props: TabProps): JSX.Element {
  const [local, ariaProps] = splitProps(props, [
    'children',
    'class',
    'style',
    'slot',
    'id',
  ]);

  // Get state from context
  const context = useContext(TabsStateContext);
  if (!context) {
    throw new Error('Tab must be used within a Tabs component');
  }
  const state = context;

  // Create tab aria props
  const tabAria = createTab<unknown>(
    {
      key: local.id,
      get isDisabled() {
        return ariaProps.isDisabled;
      },
      get 'aria-label'() {
        return ariaProps['aria-label'];
      },
    },
    state
  );

  // Create hover
  const { isHovered, hoverProps } = createHover({
    get isDisabled() {
      return tabAria.isDisabled();
    },
  });

  // Render props values
  const renderValues = createMemo<TabRenderProps>(() => ({
    isSelected: tabAria.isSelected(),
    isFocused: tabAria.isFocused(),
    isFocusVisible: tabAria.isFocusVisible(),
    isPressed: tabAria.isPressed(),
    isHovered: isHovered(),
    isDisabled: tabAria.isDisabled(),
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      children: local.children,
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-Tab',
    },
    renderValues
  );

  return (
    <div
      id={tabAria.tabProps.id}
      role={tabAria.tabProps.role}
      aria-selected={tabAria.tabProps['aria-selected']}
      aria-disabled={tabAria.tabProps['aria-disabled']}
      aria-controls={tabAria.tabProps['aria-controls']}
      aria-label={tabAria.tabProps['aria-label']}
      tabIndex={tabAria.tabProps.tabIndex}
      class={renderProps.class()}
      style={renderProps.style()}
      onKeyDown={tabAria.tabProps.onKeyDown}
      onMouseDown={tabAria.tabProps.onMouseDown}
      onPointerDown={tabAria.tabProps.onPointerDown}
      onClick={tabAria.tabProps.onClick}
      onFocus={tabAria.tabProps.onFocus}
      onMouseEnter={hoverProps.onMouseEnter}
      onMouseLeave={hoverProps.onMouseLeave}
      data-selected={tabAria.isSelected() || undefined}
      data-focused={tabAria.isFocused() || undefined}
      data-focus-visible={tabAria.isFocusVisible() || undefined}
      data-pressed={tabAria.isPressed() || undefined}
      data-hovered={isHovered() || undefined}
      data-disabled={tabAria.isDisabled() || undefined}
    >
      {renderProps.children}
    </div>
  );
}

/**
 * A TabPanel displays the content for a selected Tab.
 */
export function TabPanel(props: TabPanelProps): JSX.Element {
  const [local, ariaProps] = splitProps(props, [
    'children',
    'class',
    'style',
    'slot',
    'shouldForceMount',
  ]);

  // Get state from context (may be null for SSR scenarios)
  const state = useContext(TabsStateContext);

  // Create tab panel aria props
  const { tabPanelProps, isSelected } = createTabPanel<unknown>(ariaProps, state);

  // Create focus ring for the panel
  const { isFocused, isFocusVisible, focusProps } = createFocusRing();

  // Render props values
  const renderValues = createMemo<TabPanelRenderProps>(() => ({
    isSelected: isSelected(),
    isFocused: isFocused(),
    isFocusVisible: isFocusVisible(),
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      children: local.children,
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-TabPanel',
    },
    renderValues
  );

  // Determine if we should render the panel
  const shouldRender = () => local.shouldForceMount || isSelected();

  return (
    <Show when={shouldRender()}>
      <div
        id={tabPanelProps.id}
        role={tabPanelProps.role}
        aria-labelledby={tabPanelProps['aria-labelledby']}
        aria-label={tabPanelProps['aria-label']}
        aria-describedby={tabPanelProps['aria-describedby']}
        tabIndex={tabPanelProps.tabIndex}
        class={renderProps.class()}
        style={renderProps.style()}
        onFocus={focusProps.onFocus}
        onBlur={focusProps.onBlur}
        data-selected={isSelected() || undefined}
        data-focused={isFocused() || undefined}
        data-focus-visible={isFocusVisible() || undefined}
        inert={!isSelected() ? '' : undefined}
        hidden={!isSelected() && !local.shouldForceMount ? true : undefined}
      >
        {renderProps.children}
      </div>
    </Show>
  );
}

// Attach sub-components
Tabs.List = TabList;
Tabs.Tab = Tab;
Tabs.Panel = TabPanel;
