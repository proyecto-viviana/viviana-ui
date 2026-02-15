/**
 * Menu component for solidaria-components
 *
 * A pre-wired headless menu that combines state + aria hooks.
 * Port of react-aria-components/src/Menu.tsx
 */

import {
  type JSX,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  splitProps,
  useContext,
  For,
  Show,
} from 'solid-js';
import {
  createMenu,
  createMenuItem,
  createMenuTrigger,
  createFocusRing,
  createHover,
  createButton,
  createInteractOutside,
  mergeProps,
  FocusScope,
  type AriaMenuProps,
  type AriaMenuItemProps,
  type AriaMenuTriggerProps,
} from '@proyecto-viviana/solidaria';
import {
  createMenuState,
  createMenuTriggerState,
  type MenuState,
  type OverlayTriggerState,
  type Key,
  type DropTarget,
} from '@proyecto-viviana/solid-stately';
import {
  type RenderChildren,
  type ClassNameOrFunction,
  type StyleOrFunction,
  type SlotProps,
  useRenderProps,
} from './utils';
import { type DragAndDropHooks } from './useDragAndDrop';
import {
  CollectionRendererContext,
  Section,
  Header,
  Group,
  type CollectionEntry,
  type CollectionRendererContextValue,
  type SectionProps,
  useCollectionRenderer,
  flattenCollectionEntries,
  isCollectionSection,
} from './Collection';
import { useVirtualizerContext } from './Virtualizer';
import { mergePersistedKeysIntoVirtualRange, useDndPersistedKeys } from './DragAndDrop';

// ============================================
// TYPES
// ============================================

export interface MenuRenderProps {
  /** Whether the menu is focused. */
  isFocused: boolean;
  /** Whether the menu is open. */
  isOpen: boolean;
}

export interface MenuProps<T>
  extends Omit<AriaMenuProps, 'children'>,
    SlotProps {
  /** The items to render in the menu. */
  items: CollectionEntry<T>[];
  /** Function to get the key from an item. */
  getKey?: (item: T) => Key;
  /** Function to get the text value from an item. */
  getTextValue?: (item: T) => string;
  /** Function to check if an item is disabled. */
  getDisabled?: (item: T) => boolean;
  /** Keys of disabled items. */
  disabledKeys?: Iterable<Key>;
  /** Handler called when an item is activated. */
  onAction?: (key: Key) => void;
  /** Handler called when the menu should close. */
  onClose?: () => void;
  /** The children of the component. A function may be provided to render each item. */
  children: (item: T) => JSX.Element;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<MenuRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<MenuRenderProps>;
  /** Drag and drop hooks from `useDragAndDrop`. */
  dragAndDropHooks?: DragAndDropHooks<T>;
}

export interface MenuItemRenderProps {
  /** Whether the item is selected. */
  isSelected: boolean;
  /** Whether the item is focused. */
  isFocused: boolean;
  /** Whether the item has keyboard focus. */
  isFocusVisible: boolean;
  /** Whether the item is pressed. */
  isPressed: boolean;
  /** Whether the item is hovered. */
  isHovered: boolean;
  /** Whether the item is disabled. */
  isDisabled: boolean;
}

export interface MenuItemProps<T>
  extends Omit<AriaMenuItemProps, 'children' | 'key'>,
    SlotProps {
  /** The unique key for the item. */
  id: Key;
  /** The item value. */
  item?: T;
  /** The children of the item. A function may be provided to receive render props. */
  children?: RenderChildren<MenuItemRenderProps>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<MenuItemRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<MenuItemRenderProps>;
  /** The text value of the item (for typeahead). */
  textValue?: string;
  /** Handler called when the item is activated. */
  onAction?: () => void;
}

export interface MenuTriggerRenderProps {
  /** Whether the menu is open. */
  isOpen: boolean;
  /** Whether the trigger is focused. */
  isFocused: boolean;
  /** Whether the trigger has keyboard focus. */
  isFocusVisible: boolean;
  /** Whether the trigger is pressed. */
  isPressed: boolean;
  /** Whether the trigger is hovered. */
  isHovered: boolean;
  /** Whether the trigger is disabled. */
  isDisabled: boolean;
}

export interface MenuTriggerProps extends Omit<AriaMenuTriggerProps, 'children'>, SlotProps {
  /** The children of the trigger (typically a Button and Menu). */
  children: JSX.Element;
  /** Whether the menu trigger is disabled. */
  isDisabled?: boolean;
  /** Whether the menu is open by default. */
  defaultOpen?: boolean;
  /** Whether the menu is open (controlled). */
  isOpen?: boolean;
  /** Handler called when the open state changes. */
  onOpenChange?: (isOpen: boolean) => void;
}

export interface SubmenuTriggerProps extends MenuTriggerProps {}

// ============================================
// CONTEXT
// ============================================

interface MenuContextValue<T> {
  state: MenuState<T>;
  dragAndDropHooks?: DragAndDropHooks<T>;
  dragState?: unknown;
  dropState?: unknown;
}

interface MenuTriggerContextValue {
  state: OverlayTriggerState;
  triggerProps: JSX.HTMLAttributes<HTMLElement>;
  menuProps: JSX.HTMLAttributes<HTMLElement>;
}

export const MenuContext = createContext<MenuContextValue<unknown> | null>(null);
export const MenuStateContext = createContext<MenuState<unknown> | null>(null);
export const MenuTriggerContext = createContext<MenuTriggerContextValue | null>(null);
export const RootMenuTriggerStateContext = createContext<OverlayTriggerState | null>(null);

// ============================================
// COMPONENTS
// ============================================

/**
 * A menu trigger wraps a button and menu, handling the open/close state.
 */
export function MenuTrigger(props: MenuTriggerProps): JSX.Element {
  const [local, stateProps] = splitProps(props, ['slot']);

  // Create trigger state
  const state = createMenuTriggerState({
    get isOpen() {
      return stateProps.isOpen;
    },
    get defaultOpen() {
      return stateProps.defaultOpen;
    },
    get onOpenChange() {
      return stateProps.onOpenChange;
    },
  });

  // Create trigger aria props
  const { menuTriggerProps, menuProps } = createMenuTrigger(
    {
      get isDisabled() {
        return stateProps.isDisabled;
      },
    },
    state
  );

  return (
    <RootMenuTriggerStateContext.Provider value={state}>
      <MenuTriggerContext.Provider
        value={{
          state,
          triggerProps: menuTriggerProps,
          menuProps,
        }}
      >
        {props.children}
      </MenuTriggerContext.Provider>
    </RootMenuTriggerStateContext.Provider>
  );
}

export function SubmenuTrigger(props: SubmenuTriggerProps): JSX.Element {
  return <MenuTrigger {...props} />;
}

/**
 * A button that opens a menu.
 */
export interface MenuButtonProps extends SlotProps {
  /** The children of the button. A function may be provided to receive render props. */
  children?: RenderChildren<MenuTriggerRenderProps>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<MenuTriggerRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<MenuTriggerRenderProps>;
  /** Whether the button is disabled. */
  isDisabled?: boolean;
}

export interface MenuSectionProps extends SectionProps {}

export function MenuButton(props: MenuButtonProps): JSX.Element {
  const [local] = splitProps(props, ['class', 'style', 'slot', 'isDisabled']);

  // Get trigger context
  const context = useContext(MenuTriggerContext);
  if (!context) {
    throw new Error('MenuButton must be used within a MenuTrigger');
  }
  const { state, triggerProps } = context;

  // Create button aria props for proper press handling
  const buttonAria = createButton({
    get isDisabled() {
      return local.isDisabled;
    },
    onPress() {
      state.toggle();
    },
  });

  // Create focus ring
  const { isFocused, isFocusVisible, focusProps } = createFocusRing();

  // Create hover
  const { isHovered, hoverProps } = createHover({
    get isDisabled() {
      return local.isDisabled;
    },
  });

  // Render props values
  const renderValues = createMemo<MenuTriggerRenderProps>(() => ({
    isOpen: state.isOpen(),
    isFocused: isFocused(),
    isFocusVisible: isFocusVisible(),
    isPressed: buttonAria.isPressed(),
    isHovered: isHovered(),
    isDisabled: !!local.isDisabled,
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      children: props.children,
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-MenuButton',
    },
    renderValues
  );

  // Remove ref from spread props
  const cleanTriggerProps = () => {
    const { ref: _ref1, ...rest } = triggerProps as Record<string, unknown>;
    return rest;
  };
  const cleanButtonProps = () => {
    const { ref: _ref2, ...rest } = buttonAria.buttonProps as Record<string, unknown>;
    return rest;
  };
  const cleanFocusProps = () => {
    const { ref: _ref3, ...rest } = focusProps as Record<string, unknown>;
    return rest;
  };
  const cleanHoverProps = () => {
    const { ref: _ref4, ...rest } = hoverProps as Record<string, unknown>;
    return rest;
  };

  return (
    <button
      {...cleanTriggerProps()}
      {...cleanButtonProps()}
      {...cleanFocusProps()}
      {...cleanHoverProps()}
      type="button"
      class={renderProps.class()}
      style={renderProps.style()}
      data-open={state.isOpen() || undefined}
      data-focused={isFocused() || undefined}
      data-focus-visible={isFocusVisible() || undefined}
      data-pressed={buttonAria.isPressed() || undefined}
      data-hovered={isHovered() || undefined}
      data-disabled={local.isDisabled || undefined}
    >
      {renderProps.renderChildren()}
    </button>
  );
}

/**
 * A menu displays a list of actions or options for the user to choose from.
 */
export function Menu<T>(props: MenuProps<T>): JSX.Element {
  const [local, stateProps, ariaProps] = splitProps(
    props,
    ['children', 'class', 'style', 'slot'],
    ['items', 'getKey', 'getTextValue', 'getDisabled', 'disabledKeys', 'onAction', 'onClose', 'dragAndDropHooks']
  );

  // Get trigger context if available
  const triggerContext = useContext(MenuTriggerContext);

  // Ref for the menu element (for click outside detection)
  let menuRef: HTMLUListElement | undefined;

  const flatItems = createMemo<T[]>(() => {
    return flattenCollectionEntries(stateProps.items);
  });

  const hasSections = createMemo(() => stateProps.items.some((item) => isCollectionSection(item)));

  // Create menu state
  const state = createMenuState<T>({
    get items() {
      return flatItems();
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
    get onAction() {
      return stateProps.onAction;
    },
    get onClose() {
      return stateProps.onClose ?? (() => triggerContext?.state.close());
    },
  });

  // Create menu aria props
  const { menuProps } = createMenu(
    {
      get onClose() {
        return stateProps.onClose ?? (() => triggerContext?.state.close());
      },
      get 'aria-label'() {
        return ariaProps['aria-label'];
      },
      get 'aria-labelledby'() {
        return ariaProps['aria-labelledby'];
      },
    },
    state
  );

  // Create focus ring
  const { isFocused, focusProps } = createFocusRing();

  // Handle click outside to close menu
  createInteractOutside({
    ref: () => menuRef ?? null,
    onInteractOutside: () => {
      if (triggerContext?.state.isOpen()) {
        triggerContext.state.close();
      }
    },
    get isDisabled() {
      return !triggerContext?.state.isOpen();
    },
  });

  // Render props values
  const renderValues = createMemo<MenuRenderProps>(() => ({
    isFocused: state.isFocused() || isFocused(),
    isOpen: triggerContext?.state.isOpen() ?? true,
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-Menu',
    },
    renderValues
  );

  // Remove ref from spread props
  const cleanMenuProps = () => {
    const { ref: _ref1, ...rest } = menuProps as Record<string, unknown>;
    return rest;
  };
  const cleanTriggerMenuProps = () => {
    if (!triggerContext) return {};
    const { ref: _ref2, ...rest } = triggerContext.menuProps as Record<string, unknown>;
    return rest;
  };
  const cleanFocusProps = () => {
    const { ref: _ref3, ...rest } = focusProps as Record<string, unknown>;
    return rest;
  };

  // If inside a MenuTrigger, only render when open
  // If standalone (no trigger context), always render
  const shouldRender = () => triggerContext ? triggerContext.state.isOpen() : true;
  const parentCollectionRenderer = useCollectionRenderer<unknown>();
  const virtualizer = useVirtualizerContext();
  const getItemNodes = () => Array.from(state.collection()).filter((node) => node.type === 'item');
  const getDropTargetByIndex = (index: number, position: 'before' | 'after' | 'on'): DropTarget | null => {
    const node = getItemNodes()[index];
    if (!node) return null;
    return { type: 'item', key: node.key, dropPosition: position };
  };
  const hasDroppableDnd = createMemo(() => {
    const hooks = stateProps.dragAndDropHooks;
    return Boolean(
      hooks?.useDroppableCollectionState &&
      hooks.useDroppableCollection &&
      (hooks.dropTargetDelegate || parentCollectionRenderer?.dropTargetDelegate)
    );
  });
  const hasDraggableDnd = createMemo(() => {
    const hooks = stateProps.dragAndDropHooks;
    return Boolean(hooks?.useDraggableCollectionState && hooks.useDraggableCollection);
  });
  const dragState = createMemo(() => {
    if (!hasDraggableDnd()) return undefined;
    return stateProps.dragAndDropHooks?.useDraggableCollectionState?.({
      items: flatItems(),
    });
  });
  const dropState = createMemo(() => {
    if (!hasDroppableDnd()) return undefined;
    return stateProps.dragAndDropHooks?.useDroppableCollectionState?.({});
  });
  const persistedKeys = useDndPersistedKeys(
    { focusedKey: state.focusedKey },
    stateProps.dragAndDropHooks,
    dropState(),
    state.collection()
  );
  const virtualRange = createMemo(() => {
    if (!virtualizer || !parentCollectionRenderer?.isVirtualized || hasSections()) return null;
    const baseRange = virtualizer.getVisibleRange(stateProps.items.length);
    const itemNodes = getItemNodes();
    const persistedIndexes = Array.from(persistedKeys())
      .map((key) => itemNodes.findIndex((node) => node.key === key))
      .filter((index) => index >= 0);
    const dropTarget = dropState()?.target;
    const forcedDropIndex = dropTarget?.type === 'item'
      ? itemNodes.findIndex((node) => node.key === dropTarget.key)
      : -1;
    return mergePersistedKeysIntoVirtualRange(baseRange, persistedIndexes, stateProps.items.length, virtualizer, 80, {
      forceIncludeIndexes: forcedDropIndex >= 0 ? [forcedDropIndex] : [],
      forceIncludeMaxSpan: 320,
    });
  });
  const visibleItems = createMemo(() => {
    const range = virtualRange();
    if (!range) return stateProps.items;
    return stateProps.items.slice(range.start, range.end);
  });
  createEffect(() => {
    if (!hasDraggableDnd()) return;
    const hooks = stateProps.dragAndDropHooks;
    const activeDragState = dragState();
    if (!hooks?.useDraggableCollection || !activeDragState) return;
    hooks.useDraggableCollection({}, activeDragState, () => menuRef ?? null);
  });
  const droppableCollection = createMemo(() => {
    if (!hasDroppableDnd()) return undefined;
    const hooks = stateProps.dragAndDropHooks;
    const activeDropState = dropState();
    if (!hooks?.useDroppableCollection || !activeDropState) return undefined;
    const dropTargetDelegate = hooks.dropTargetDelegate ?? parentCollectionRenderer?.dropTargetDelegate;
    if (!dropTargetDelegate) return undefined;
    return hooks.useDroppableCollection(
      {
        dropTargetDelegate,
      },
      activeDropState,
      () => menuRef ?? null
    );
  });
  const isRootDropTarget = createMemo(() => {
    return Boolean(dropState()?.target?.type === 'root');
  });
  const dndDropIndicator = (index: number, position: 'before' | 'after' | 'on') => {
    const target = getDropTargetByIndex(index, position);
    if (!target || target.type !== 'item') return undefined;
    return stateProps.dragAndDropHooks?.renderDropIndicator?.(target);
  };
  const sectionedRenderEntries = createMemo(() => {
    let globalIndex = 0;
    return stateProps.items.map((entry) => {
      if (isCollectionSection(entry)) {
        const sectionItems = entry.items.map((item) => ({
          item,
          index: globalIndex++,
        }));
        return {
          type: 'section' as const,
          section: entry,
          items: sectionItems,
        };
      }
      const indexedItem = {
        item: entry as T,
        index: globalIndex++,
      };
      return {
        type: 'item' as const,
        item: indexedItem,
      };
    });
  });
  const collectionRenderer = createMemo<CollectionRendererContextValue<unknown>>(() => ({
    ...parentCollectionRenderer,
    renderItem: (item) => props.children(item as T),
    renderDropIndicator: (index, position) =>
      dndDropIndicator(index, position) ?? parentCollectionRenderer?.renderDropIndicator?.(index, position),
  }));

  // Only use FocusScope when inside a MenuTrigger (for popover behavior)
  // Standalone menus don't need focus restoration
  const menuContent = () => (
    <MenuContext.Provider
      value={{
        state,
        dragAndDropHooks: stateProps.dragAndDropHooks,
        dragState: dragState(),
        dropState: dropState(),
      } as MenuContextValue<unknown>}
    >
      <MenuStateContext.Provider value={state}>
        <CollectionRendererContext.Provider value={collectionRenderer()}>
          <ul
            ref={(el) => (menuRef = el)}
            {...mergeProps(
              cleanMenuProps(),
              cleanTriggerMenuProps(),
              cleanFocusProps(),
              (droppableCollection()?.collectionProps as Record<string, unknown> | undefined) ?? {}
            )}
            class={renderProps.class()}
            style={renderProps.style()}
            data-focused={state.isFocused() || undefined}
            data-drop-target={isRootDropTarget() || undefined}
          >
            {hasSections()
              ? (
                <For each={sectionedRenderEntries()}>
                  {(entry) =>
                    entry.type === 'section'
                      ? (
                        <li role="presentation" data-section-wrapper>
                          <Section class="solidaria-Menu-section">
                            {entry.section.title != null && (
                              <Header class="solidaria-Menu-sectionHeader">{entry.section.title}</Header>
                            )}
                            <Group class="solidaria-Menu-sectionGroup">
                              <ul role="group" aria-label={entry.section['aria-label']}>
                                <For each={entry.items}>
                                  {(indexedItem) => (
                                    <>
                                      {collectionRenderer().renderDropIndicator?.(indexedItem.index, 'before')}
                                      {collectionRenderer().renderDropIndicator?.(indexedItem.index, 'on')}
                                      {props.children?.(indexedItem.item)}
                                      {collectionRenderer().renderDropIndicator?.(indexedItem.index, 'after')}
                                    </>
                                  )}
                                </For>
                              </ul>
                            </Group>
                          </Section>
                        </li>
                      )
                      : (
                        <>
                          {collectionRenderer().renderDropIndicator?.(entry.item.index, 'before')}
                          {collectionRenderer().renderDropIndicator?.(entry.item.index, 'on')}
                          {props.children?.(entry.item.item)}
                          {collectionRenderer().renderDropIndicator?.(entry.item.index, 'after')}
                        </>
                      )
                  }
                </For>
              )
              : (
                <>
                  {virtualRange()?.offsetTop
                    ? <li role="presentation" aria-hidden="true" style={{ height: `${virtualRange()!.offsetTop}px` }} data-virtualizer-spacer="top" />
                    : null}
                  <For each={visibleItems()}>
                    {(item, index) => {
                      const itemIndex = () => (virtualRange()?.start ?? 0) + index();
                      const beforeIndicator = () => collectionRenderer().renderDropIndicator?.(itemIndex(), 'before');
                      const onIndicator = () => collectionRenderer().renderDropIndicator?.(itemIndex(), 'on');
                      const afterIndicator = () => collectionRenderer().renderDropIndicator?.(itemIndex(), 'after');
                      return (
                        <>
                          {beforeIndicator()}
                          {onIndicator()}
                          {props.children?.(item as T)}
                          {afterIndicator()}
                        </>
                      );
                    }}
                  </For>
                  {virtualRange()?.offsetBottom
                    ? <li role="presentation" aria-hidden="true" style={{ height: `${virtualRange()!.offsetBottom}px` }} data-virtualizer-spacer="bottom" />
                    : null}
                </>
              )}
          </ul>
        </CollectionRendererContext.Provider>
      </MenuStateContext.Provider>
    </MenuContext.Provider>
  );

  return (
    <Show when={shouldRender()}>
      <Show when={triggerContext} fallback={menuContent()}>
        <FocusScope restoreFocus autoFocus>
          {menuContent()}
        </FocusScope>
      </Show>
    </Show>
  );
}

/**
 * An item in a menu.
 */
export function MenuItem<T>(props: MenuItemProps<T>): JSX.Element {
  const [local, ariaProps] = splitProps(props, [
    'class',
    'style',
    'slot',
    'id',
    'item',
    'textValue',
    'onAction',
  ]);

  // Get state from context
  const context = useContext(MenuStateContext);
  if (!context) {
    throw new Error('MenuItem must be used within a Menu');
  }
  const state = context as MenuState<T>;
  const menuContext = useContext(MenuContext) as MenuContextValue<T> | null;
  const [ref, setRef] = createSignal<HTMLLIElement | null>(null);

  // Create menu item aria props
  const itemAria = createMenuItem<T>(
    {
      key: local.id,
      get isDisabled() {
        return ariaProps.isDisabled;
      },
      get 'aria-label'() {
        return ariaProps['aria-label'];
      },
      get onAction() {
        return local.onAction;
      },
    },
    state
  );

  // Create hover
  const { isHovered, hoverProps } = createHover({
    get isDisabled() {
      return itemAria.isDisabled();
    },
  });

  // Render props values
  const renderValues = createMemo<MenuItemRenderProps>(() => ({
    isSelected: false, // Menu items don't have selection state
    isFocused: itemAria.isFocused(),
    isFocusVisible: itemAria.isFocusVisible(),
    isPressed: itemAria.isPressed(),
    isHovered: isHovered(),
    isDisabled: itemAria.isDisabled(),
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      children: props.children,
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-Menu-item',
    },
    renderValues
  );

  // Remove ref from spread props
  const cleanItemProps = () => {
    const { ref: _ref1, ...rest } = itemAria.menuItemProps as Record<string, unknown>;
    return rest;
  };
  const cleanHoverProps = () => {
    const { ref: _ref2, ...rest } = hoverProps as Record<string, unknown>;
    return rest;
  };
  const draggableItem = createMemo(() => {
    if (!menuContext?.dragAndDropHooks?.useDraggableItem || !menuContext.dragState) return undefined;
    return menuContext.dragAndDropHooks.useDraggableItem(
      {
        key: local.id as string | number,
      },
      menuContext.dragState as Parameters<NonNullable<DragAndDropHooks<T>['useDraggableItem']>>[1]
    );
  });
  const droppableItem = createMemo(() => {
    if (!menuContext?.dragAndDropHooks?.useDroppableItem || !menuContext.dropState) return undefined;
    return menuContext.dragAndDropHooks.useDroppableItem(
      {
        key: local.id as string | number,
      },
      menuContext.dropState as Parameters<NonNullable<DragAndDropHooks<T>['useDroppableItem']>>[1],
      () => ref()
    );
  });

  return (
    <li
      ref={setRef}
      {...mergeProps(
        cleanItemProps(),
        cleanHoverProps(),
        (draggableItem()?.dragProps as Record<string, unknown> | undefined) ?? {},
        (droppableItem()?.dropProps as Record<string, unknown> | undefined) ?? {}
      )}
      class={renderProps.class()}
      style={renderProps.style()}
      data-focused={itemAria.isFocused() || undefined}
      data-focus-visible={itemAria.isFocusVisible() || undefined}
      data-pressed={itemAria.isPressed() || undefined}
      data-hovered={isHovered() || undefined}
      data-disabled={itemAria.isDisabled() || undefined}
      data-dragging={draggableItem()?.isDragging || undefined}
      data-drop-target={droppableItem()?.isDropTarget || undefined}
    >
      {renderProps.renderChildren()}
    </li>
  );
}

/**
 * Section primitive alias for Menu composition parity.
 */
export function MenuSection(props: MenuSectionProps): JSX.Element {
  return <Section {...props} />;
}

// Attach Item as a static property
Menu.Item = MenuItem;
