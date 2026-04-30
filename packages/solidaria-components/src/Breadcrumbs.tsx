/**
 * Breadcrumbs component for solidaria-components
 *
 * A pre-wired headless breadcrumbs component that combines aria hooks.
 * Port of react-aria-components Breadcrumbs.
 */

import {
  type Accessor,
  type JSX,
  createContext,
  createMemo,
  splitProps,
  useContext,
  For,
} from "solid-js";
import { Dynamic } from "solid-js/web";
import {
  createBreadcrumbs,
  createBreadcrumbItem,
  createFocusRing,
  createHover,
  mergeProps,
  type AriaBreadcrumbsProps,
  type AriaBreadcrumbItemProps,
  type PressEvent,
} from "@proyecto-viviana/solidaria";
import {
  type RenderChildren,
  type ClassNameOrFunction,
  type StyleOrFunction,
  type SlotProps,
  useRenderProps,
  filterDOMProps,
} from "./utils";

export interface BreadcrumbsRenderProps {
  /** Whether the breadcrumbs are disabled. */
  isDisabled: boolean;
}

export interface BreadcrumbsProps<T> extends Omit<AriaBreadcrumbsProps, "isDisabled">, SlotProps {
  /** The items to render in the breadcrumbs. */
  items?: T[];
  /** Function to get the key from an item. */
  getKey?: (item: T) => string | number;
  /** Whether the breadcrumbs are disabled. */
  isDisabled?: boolean;
  /** Handler called when a breadcrumb item is activated. */
  onAction?: (key: string | number) => void;
  /** The children of the component - render function for each item. */
  children: (item: T) => JSX.Element;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<BreadcrumbsRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<BreadcrumbsRenderProps>;
}

export interface BreadcrumbItemRenderProps {
  /** Whether this is the current/last item. */
  isCurrent: boolean;
  /** Whether the item is disabled. */
  isDisabled: boolean;
  /** Whether the item is pressed. */
  isPressed: boolean;
  /** Whether the item is focused. */
  isFocused: boolean;
  /** Whether the item has visible focus ring. */
  isFocusVisible: boolean;
  /** Whether the item is hovered. */
  isHovered: boolean;
}

export interface BreadcrumbItemProps
  extends Omit<AriaBreadcrumbItemProps, "isDisabled">, SlotProps {
  /** The children of the breadcrumb item. */
  children?: RenderChildren<BreadcrumbItemRenderProps>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<BreadcrumbItemRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<BreadcrumbItemRenderProps>;
  /** Whether this item is disabled. */
  isDisabled?: boolean;
}

interface BreadcrumbsContextValue {
  isDisabled: Accessor<boolean>;
  onAction?: (key: string | number) => void;
}

export const BreadcrumbsContext = createContext<BreadcrumbsContextValue | null>(null);

interface BreadcrumbItemContextValue {
  itemKey: string | number | null;
  isLast: Accessor<boolean>;
}

export const BreadcrumbItemContext = createContext<BreadcrumbItemContextValue | null>(null);

function defaultItemKey(item: unknown, index: number): string | number {
  const maybeItem = item as { key?: string | number; id?: string | number };
  return maybeItem.key ?? maybeItem.id ?? index;
}

/**
 * Breadcrumbs show hierarchy and navigational context for a user's location within an application.
 */
export function Breadcrumbs<T>(props: BreadcrumbsProps<T>): JSX.Element {
  const [local, ariaProps, rest] = splitProps(
    props,
    ["children", "class", "style", "slot", "items", "getKey", "isDisabled", "onAction"],
    ["aria-label", "aria-labelledby", "aria-describedby"],
  );

  const isDisabled = () => local.isDisabled ?? false;
  const items = () => local.items ?? [];
  const getItemKey = (item: T, index: number): string | number =>
    local.getKey?.(item) ?? defaultItemKey(item, index);

  // Create breadcrumbs aria props
  const { navProps } = createBreadcrumbs({
    get "aria-label"() {
      return ariaProps["aria-label"];
    },
    get "aria-labelledby"() {
      return ariaProps["aria-labelledby"];
    },
    get "aria-describedby"() {
      return ariaProps["aria-describedby"];
    },
    get isDisabled() {
      return isDisabled();
    },
  });

  // Render props values
  const renderValues = createMemo<BreadcrumbsRenderProps>(() => ({
    isDisabled: isDisabled(),
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      class: local.class,
      style: local.style,
      defaultClassName: "solidaria-Breadcrumbs",
    },
    renderValues,
  );

  // Filter DOM props
  const domProps = createMemo(() =>
    filterDOMProps(rest as Record<string, unknown>, { global: true }),
  );

  return (
    <BreadcrumbsContext.Provider value={{ isDisabled, onAction: local.onAction }}>
      <nav
        {...navProps}
        {...domProps()}
        class={renderProps.class()}
        style={renderProps.style()}
        data-disabled={isDisabled() || undefined}
      >
        <ol
          style={{
            display: "flex",
            "align-items": "center",
            "list-style": "none",
            margin: 0,
            padding: 0,
          }}
        >
          <For each={items()}>
            {(item, index) => {
              const itemKey = getItemKey(item, index());
              const isLast = () => index() === items().length - 1;

              return (
                <li style={{ display: "flex", "align-items": "center" }}>
                  <BreadcrumbItemContext.Provider value={{ itemKey, isLast }}>
                    {props.children(item)}
                  </BreadcrumbItemContext.Provider>
                </li>
              );
            }}
          </For>
        </ol>
      </nav>
    </BreadcrumbsContext.Provider>
  );
}

/**
 * A BreadcrumbItem represents an individual breadcrumb in the navigation trail.
 */
export function BreadcrumbItem(props: BreadcrumbItemProps): JSX.Element {
  const [local, ariaProps] = splitProps(props, ["class", "style", "slot", "isDisabled"]);

  // Get context
  const context = useContext(BreadcrumbsContext);
  const itemContext = useContext(BreadcrumbItemContext);
  const isDisabled = () => local.isDisabled ?? context?.isDisabled() ?? false;
  const isCurrent = () => ariaProps.isCurrent ?? itemContext?.isLast() ?? false;
  const itemKey = () => itemContext?.itemKey ?? null;

  const handlePress = (e: PressEvent) => {
    ariaProps.onPress?.(e);
    const key = itemKey();
    if (key !== null && !isCurrent() && !isDisabled()) {
      context?.onAction?.(key);
    }
  };

  // Create breadcrumb item aria props
  const { itemProps, isPressed } = createBreadcrumbItem({
    get id() {
      return ariaProps.id;
    },
    get isCurrent() {
      return isCurrent();
    },
    get isDisabled() {
      return isDisabled();
    },
    get href() {
      return ariaProps.href;
    },
    get target() {
      return ariaProps.target;
    },
    get rel() {
      return ariaProps.rel;
    },
    get elementType() {
      return ariaProps.elementType;
    },
    get onPress() {
      return handlePress;
    },
    get onPressStart() {
      return ariaProps.onPressStart;
    },
    get onPressEnd() {
      return ariaProps.onPressEnd;
    },
    get onClick() {
      return ariaProps.onClick;
    },
    get onFocus() {
      return ariaProps.onFocus;
    },
    get onBlur() {
      return ariaProps.onBlur;
    },
    get onFocusChange() {
      return ariaProps.onFocusChange;
    },
    get onKeyDown() {
      return ariaProps.onKeyDown;
    },
    get onKeyUp() {
      return ariaProps.onKeyUp;
    },
    get autoFocus() {
      return ariaProps.autoFocus;
    },
    get "aria-label"() {
      return ariaProps["aria-label"];
    },
    get "aria-labelledby"() {
      return ariaProps["aria-labelledby"];
    },
    get "aria-describedby"() {
      return ariaProps["aria-describedby"];
    },
    get "aria-current"() {
      return ariaProps["aria-current"];
    },
  });

  const { isFocused, isFocusVisible, focusProps } = createFocusRing();
  const { isHovered, hoverProps } = createHover({
    get isDisabled() {
      return isDisabled();
    },
  });
  const mergedItemProps = createMemo(() =>
    mergeProps(
      itemProps as Record<string, unknown>,
      focusProps as Record<string, unknown>,
      hoverProps as Record<string, unknown>,
    ),
  );
  const elementType = () => ariaProps.elementType ?? "a";

  // Render props values
  const renderValues = createMemo<BreadcrumbItemRenderProps>(() => ({
    isCurrent: isCurrent(),
    isDisabled: isDisabled(),
    isPressed: isPressed(),
    isFocused: isFocused(),
    isFocusVisible: isFocusVisible(),
    isHovered: isHovered(),
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      children: props.children,
      class: local.class,
      style: local.style,
      defaultClassName: "solidaria-BreadcrumbItem",
    },
    renderValues,
  );

  // Merge inline flex styles with user styles
  const mergedStyle = () => {
    const userStyle = renderProps.style();
    const baseStyle = { display: "inline-flex", "align-items": "center" };
    return userStyle ? { ...baseStyle, ...userStyle } : baseStyle;
  };

  return (
    <Dynamic
      component={elementType()}
      {...mergedItemProps()}
      class={renderProps.class()}
      style={mergedStyle()}
      data-current={isCurrent() || undefined}
      data-disabled={isDisabled() || undefined}
      data-pressed={isPressed() || undefined}
      data-focused={isFocused() || undefined}
      data-focus-visible={isFocusVisible() || undefined}
      data-hovered={isHovered() || undefined}
    >
      {renderProps.renderChildren()}
    </Dynamic>
  );
}

Breadcrumbs.Item = BreadcrumbItem;
