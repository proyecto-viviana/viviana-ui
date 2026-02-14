/**
 * ToggleButton component for solidaria-components
 *
 * A pre-wired headless toggle button that combines pressed + selected state.
 * Port direction: react-aria-components/src/ToggleButton.tsx
 */

import {
  type JSX,
  createContext,
  createMemo,
  splitProps,
} from 'solid-js';
import {
  createToggleButton,
  createFocusRing,
  createHover,
  type AriaToggleButtonProps,
} from '@proyecto-viviana/solidaria';
import {
  type RenderChildren,
  type ClassNameOrFunction,
  type StyleOrFunction,
  type SlotProps,
  useRenderProps,
  filterDOMProps,
} from './utils';

export interface ToggleButtonRenderProps {
  isHovered: boolean;
  isPressed: boolean;
  isFocused: boolean;
  isFocusVisible: boolean;
  isDisabled: boolean;
  isSelected: boolean;
}

export interface ToggleButtonProps
  extends Omit<AriaToggleButtonProps, 'children'>,
    SlotProps {
  children?: RenderChildren<ToggleButtonRenderProps>;
  class?: ClassNameOrFunction<ToggleButtonRenderProps>;
  style?: StyleOrFunction<ToggleButtonRenderProps>;
}

export const ToggleButtonContext = createContext<ToggleButtonProps | null>(null);

export function ToggleButton(props: ToggleButtonProps): JSX.Element {
  const [local, ariaProps] = splitProps(props, ['children', 'class', 'style', 'slot']);

  const resolveDisabled = (): boolean => {
    const disabled = ariaProps.isDisabled;
    if (typeof disabled === 'function') return disabled();
    return !!disabled;
  };

  const toggleAria = createToggleButton({
    ...ariaProps,
    get isDisabled() {
      return resolveDisabled();
    },
  });

  const { isFocused, isFocusVisible, focusProps } = createFocusRing();
  const { isHovered, hoverProps } = createHover({
    get isDisabled() {
      return resolveDisabled();
    },
  });

  const renderValues = createMemo<ToggleButtonRenderProps>(() => ({
    isHovered: isHovered(),
    isPressed: toggleAria.isPressed(),
    isFocused: isFocused(),
    isFocusVisible: isFocusVisible(),
    isDisabled: resolveDisabled(),
    isSelected: toggleAria.isSelected(),
  }));

  const renderProps = useRenderProps(
    {
      children: props.children,
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-ToggleButton',
    },
    renderValues
  );

  const domProps = createMemo(() => {
    const filtered = filterDOMProps(ariaProps, { global: true });
    delete (filtered as Record<string, unknown>).onClick;
    return filtered;
  });

  const cleanButtonProps = () => {
    const { ref: _ref1, ...rest } = toggleAria.buttonProps as Record<string, unknown>;
    return rest;
  };
  const cleanFocusProps = () => {
    const { ref: _ref2, ...rest } = focusProps as Record<string, unknown>;
    return rest;
  };
  const cleanHoverProps = () => {
    const { ref: _ref3, ...rest } = hoverProps as Record<string, unknown>;
    return rest;
  };

  return (
    <button
      {...domProps()}
      {...cleanButtonProps()}
      {...cleanFocusProps()}
      {...cleanHoverProps()}
      class={renderProps.class()}
      style={renderProps.style()}
      data-pressed={toggleAria.isPressed() || undefined}
      data-hovered={isHovered() || undefined}
      data-focused={isFocused() || undefined}
      data-focus-visible={isFocusVisible() || undefined}
      data-disabled={resolveDisabled() || undefined}
      data-selected={toggleAria.isSelected() || undefined}
    >
      {renderProps.renderChildren()}
    </button>
  );
}
