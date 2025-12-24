/**
 * Breadcrumbs component for solidaria-components
 *
 * A pre-wired headless breadcrumbs component that combines aria hooks.
 * Port of react-aria-components Breadcrumbs.
 */

import {
  type JSX,
  createContext,
  createMemo,
  splitProps,
  useContext,
  For,
} from 'solid-js';
import {
  createBreadcrumbs,
  createBreadcrumbItem,
  type AriaBreadcrumbsProps,
  type AriaBreadcrumbItemProps,
} from '@proyecto-viviana/solidaria';
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

export interface BreadcrumbsRenderProps {
  /** Whether the breadcrumbs are disabled. */
  isDisabled: boolean;
}

export interface BreadcrumbsProps<T> extends Omit<AriaBreadcrumbsProps, 'isDisabled'>, SlotProps {
  /** The items to render in the breadcrumbs. */
  items?: T[];
  /** Function to get the key from an item. */
  getKey?: (item: T) => string | number;
  /** Whether the breadcrumbs are disabled. */
  isDisabled?: boolean;
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

export interface BreadcrumbItemProps extends Omit<AriaBreadcrumbItemProps, 'isDisabled'>, SlotProps {
  /** The children of the breadcrumb item. */
  children?: RenderChildren<BreadcrumbItemRenderProps>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<BreadcrumbItemRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<BreadcrumbItemRenderProps>;
  /** Whether this item is disabled. */
  isDisabled?: boolean;
}

// ============================================
// CONTEXT
// ============================================

interface BreadcrumbsContextValue {
  isDisabled: boolean;
}

export const BreadcrumbsContext = createContext<BreadcrumbsContextValue | null>(null);

// ============================================
// COMPONENTS
// ============================================

/**
 * Breadcrumbs show hierarchy and navigational context for a user's location within an application.
 */
export function Breadcrumbs<T>(props: BreadcrumbsProps<T>): JSX.Element {
  const [local, ariaProps, rest] = splitProps(
    props,
    ['children', 'class', 'style', 'slot', 'items', 'getKey', 'isDisabled'],
    ['aria-label', 'aria-labelledby', 'aria-describedby']
  );

  const isDisabled = () => local.isDisabled ?? false;
  const items = () => local.items ?? [];

  // Create breadcrumbs aria props
  const { navProps } = createBreadcrumbs({
    get 'aria-label'() {
      return ariaProps['aria-label'];
    },
    get 'aria-labelledby'() {
      return ariaProps['aria-labelledby'];
    },
    get 'aria-describedby'() {
      return ariaProps['aria-describedby'];
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
      defaultClassName: 'solidaria-Breadcrumbs',
    },
    renderValues
  );

  // Filter DOM props
  const domProps = createMemo(() => filterDOMProps(rest as Record<string, unknown>, { global: true }));

  return (
    <BreadcrumbsContext.Provider value={{ isDisabled: isDisabled() }}>
      <nav
        {...navProps}
        {...domProps()}
        class={renderProps.class()}
        style={renderProps.style()}
        data-disabled={isDisabled() || undefined}
      >
        <ol class="solidaria-Breadcrumbs-list">
          <For each={items()}>
            {(item, index) => (
              <li class="solidaria-Breadcrumbs-item">
                {local.children(item)}
              </li>
            )}
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
  const [local, ariaProps] = splitProps(props, [
    'children',
    'class',
    'style',
    'slot',
    'isDisabled',
  ]);

  // Get context
  const context = useContext(BreadcrumbsContext);
  const isDisabled = () => local.isDisabled ?? context?.isDisabled ?? false;
  const isCurrent = () => ariaProps.isCurrent ?? false;

  // Create breadcrumb item aria props
  const { itemProps, isPressed } = createBreadcrumbItem({
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
      return ariaProps.onPress;
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
    get 'aria-label'() {
      return ariaProps['aria-label'];
    },
    get 'aria-current'() {
      return ariaProps['aria-current'];
    },
  });

  // Render props values
  const renderValues = createMemo<BreadcrumbItemRenderProps>(() => ({
    isCurrent: isCurrent(),
    isDisabled: isDisabled(),
    isPressed: isPressed(),
    isFocused: false, // Would need focus tracking
    isFocusVisible: false, // Would need focus visible tracking
    isHovered: false, // Would need hover tracking
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      children: local.children,
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-BreadcrumbItem',
    },
    renderValues
  );

  // Determine element type
  const ElementType = () => ariaProps.elementType ?? 'a';

  return (
    <a
      {...(itemProps as Record<string, unknown>)}
      class={renderProps.class()}
      style={renderProps.style()}
      data-current={isCurrent() || undefined}
      data-disabled={isDisabled() || undefined}
      data-pressed={isPressed() || undefined}
    >
      {renderProps.children}
    </a>
  );
}

// Attach sub-components
Breadcrumbs.Item = BreadcrumbItem;
