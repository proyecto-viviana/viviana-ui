/**
 * Link component for solidaria-components
 *
 * Pre-wired headless link component that combines aria hooks.
 * Port of react-aria-components/src/Link.tsx
 */

import {
  type JSX,
  type ParentProps,
  createContext,
  createMemo,
  splitProps,
} from 'solid-js';
import { Dynamic } from 'solid-js/web';
import {
  createLink,
  createFocusRing,
  createHover,
  type AriaLinkProps,
  type HoverEvents,
} from '@proyecto-viviana/solidaria';
import {
  type RenderChildren,
  type ClassNameOrFunction,
  type StyleOrFunction,
  type SlotProps,
  useRenderProps,
  filterDOMProps,
} from './utils';
import { handleLinkClick, useRouter } from './RouterProvider';

// ============================================
// TYPES
// ============================================

export interface LinkRenderProps {
  /** Whether the link is the current item within a list. */
  isCurrent: boolean;
  /** Whether the link is currently hovered with a mouse. */
  isHovered: boolean;
  /** Whether the link is currently in a pressed state. */
  isPressed: boolean;
  /** Whether the link is focused, either via a mouse or keyboard. */
  isFocused: boolean;
  /** Whether the link is keyboard focused. */
  isFocusVisible: boolean;
  /** Whether the link is disabled. */
  isDisabled: boolean;
}

export interface LinkProps
  extends Omit<AriaLinkProps, 'elementType'>,
    HoverEvents,
    SlotProps {
  /** The children of the component. A function may be provided to receive render props. */
  children?: RenderChildren<LinkRenderProps>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<LinkRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<LinkRenderProps>;
}

// ============================================
// CONTEXT
// ============================================

export const LinkContext = createContext<LinkProps | null>(null);

// ============================================
// LINK COMPONENT
// ============================================

/**
 * A link allows a user to navigate to another page or resource within a web page
 * or application.
 *
 * @example
 * ```tsx
 * <Link href="https://example.com">Visit Example</Link>
 *
 * // With render props
 * <Link href="/about">
 *   {({ isHovered, isFocusVisible }) => (
 *     <span class={isHovered ? 'underline' : ''}>
 *       About Us
 *     </span>
 *   )}
 * </Link>
 * ```
 */
export function Link(props: ParentProps<LinkProps>): JSX.Element {
  const [local, ariaProps] = splitProps(props, [
    'children',
    'class',
    'style',
    'slot',
    'onHoverStart',
    'onHoverEnd',
    'onHoverChange',
  ]);
  const router = useRouter();
  const resolvedHref = createMemo(() => ariaProps.href ? router.useHref(ariaProps.href) : undefined);

  // Determine element type - use 'a' if href is provided and not disabled
  const elementType = () => {
    if (ariaProps.href && !ariaProps.isDisabled) {
      return 'a';
    }
    return 'span';
  };

  // Create link aria props
  const linkAria = createLink({
    get elementType() { return elementType(); },
    get isDisabled() { return ariaProps.isDisabled; },
    get href() { return resolvedHref(); },
    get hrefLang() { return ariaProps.hrefLang; },
    get target() { return ariaProps.target; },
    get rel() { return ariaProps.rel; },
    get download() { return ariaProps.download; },
    get ping() { return ariaProps.ping; },
    get referrerPolicy() { return ariaProps.referrerPolicy; },
    get onPress() { return ariaProps.onPress; },
    get onPressStart() { return ariaProps.onPressStart; },
    get onPressEnd() { return ariaProps.onPressEnd; },
    get onClick() { return ariaProps.onClick; },
    get onFocus() { return ariaProps.onFocus; },
    get onBlur() { return ariaProps.onBlur; },
    get onFocusChange() { return ariaProps.onFocusChange; },
    get onKeyDown() { return ariaProps.onKeyDown; },
    get onKeyUp() { return ariaProps.onKeyUp; },
    get autoFocus() { return ariaProps.autoFocus; },
    get 'aria-current'() { return ariaProps['aria-current']; },
    get 'aria-label'() { return ariaProps['aria-label']; },
    get 'aria-labelledby'() { return ariaProps['aria-labelledby']; },
    get 'aria-describedby'() { return ariaProps['aria-describedby']; },
  });

  // Create focus ring
  const { isFocused, isFocusVisible, focusProps } = createFocusRing();

  // Create hover
  const { isHovered, hoverProps } = createHover({
    get isDisabled() { return ariaProps.isDisabled ?? false; },
    get onHoverStart() { return local.onHoverStart; },
    get onHoverEnd() { return local.onHoverEnd; },
    get onHoverChange() { return local.onHoverChange; },
  });

  // Render props values
  const renderValues = createMemo<LinkRenderProps>(() => ({
    isCurrent: !!ariaProps['aria-current'],
    isHovered: isHovered(),
    isPressed: linkAria.isPressed(),
    isFocused: isFocused(),
    isFocusVisible: isFocusVisible(),
    isDisabled: ariaProps.isDisabled ?? false,
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      children: props.children,
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-Link',
    },
    renderValues
  );

  // Filter DOM props
  const domProps = createMemo(() => filterDOMProps(ariaProps, { global: true }));

  // Remove ref from spread props to avoid type conflicts
  const cleanLinkProps = () => {
    const { ref: _ref1, ...rest } = linkAria.linkProps as Record<string, unknown>;
    return rest;
  };
  const cleanHoverProps = () => {
    const { ref: _ref2, ...rest } = hoverProps as Record<string, unknown>;
    return rest;
  };
  const cleanFocusProps = () => {
    const { ref: _ref3, ...rest } = focusProps as Record<string, unknown>;
    return rest;
  };
  const onLinkClick = (event: MouseEvent) => {
    const onClick = cleanLinkProps().onClick as ((event: MouseEvent) => void) | undefined;
    onClick?.(event);
    handleLinkClick(event, router, ariaProps.href, ariaProps.routerOptions);
  };

  return (
    <Dynamic
      component={elementType()}
      {...domProps()}
      {...cleanLinkProps()}
      {...cleanHoverProps()}
      {...cleanFocusProps()}
      onClick={onLinkClick}
      class={renderProps.class()}
      style={renderProps.style()}
      data-hovered={isHovered() || undefined}
      data-pressed={linkAria.isPressed() || undefined}
      data-focused={isFocused() || undefined}
      data-focus-visible={isFocusVisible() || undefined}
      data-current={!!ariaProps['aria-current'] || undefined}
      data-disabled={ariaProps.isDisabled || undefined}
    >
      {renderProps.renderChildren()}
    </Dynamic>
  );
}
