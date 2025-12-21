/**
 * Switch component for solidaria-components
 *
 * A pre-wired headless switch that combines state + aria hooks.
 * Port of react-aria-components/src/Switch.tsx
 */

import {
  type JSX,
  createContext,
  createMemo,
  splitProps,
} from 'solid-js';
import {
  createSwitch,
  createFocusRing,
  createHover,
  type AriaSwitchProps,
} from '@proyecto-viviana/solidaria';
import { createToggleState, type ToggleState } from '@proyecto-viviana/solid-stately';
import { VisuallyHidden } from './VisuallyHidden';
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

export interface SwitchRenderProps {
  /** Whether the switch is selected. */
  isSelected: boolean;
  /** Whether the switch is currently hovered with a mouse. */
  isHovered: boolean;
  /** Whether the switch is currently in a pressed state. */
  isPressed: boolean;
  /** Whether the switch is focused, either via a mouse or keyboard. */
  isFocused: boolean;
  /** Whether the switch is keyboard focused. */
  isFocusVisible: boolean;
  /** Whether the switch is disabled. */
  isDisabled: boolean;
  /** Whether the switch is read only. */
  isReadOnly: boolean;
  /** State of the switch. */
  state: ToggleState;
}

export interface SwitchProps
  extends Omit<AriaSwitchProps, 'children'>,
    SlotProps {
  /** The children of the component. A function may be provided to receive render props. */
  children?: RenderChildren<SwitchRenderProps>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<SwitchRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<SwitchRenderProps>;
}

// ============================================
// CONTEXT
// ============================================

export const SwitchContext = createContext<SwitchProps | null>(null);

// ============================================
// COMPONENT
// ============================================

/**
 * A switch allows a user to turn a setting on or off.
 *
 * This is a headless component that provides accessibility and state management.
 * Style it using the render props pattern or data attributes.
 *
 * @example
 * ```tsx
 * <Switch>
 *   {({ isSelected }) => (
 *     <>
 *       <span class={`switch-track ${isSelected ? 'bg-blue-500' : 'bg-gray-300'}`}>
 *         <span class={`switch-thumb ${isSelected ? 'translate-x-5' : 'translate-x-0'}`} />
 *       </span>
 *       <span>Enable notifications</span>
 *     </>
 *   )}
 * </Switch>
 * ```
 */
export function Switch(props: SwitchProps): JSX.Element {
  let inputRef: HTMLInputElement | null = null;

  // Split props
  const [local, ariaProps] = splitProps(props, [
    'children',
    'class',
    'style',
    'slot',
  ]);

  // Create toggle state
  const state = createToggleState(() => ({
    isSelected: ariaProps.isSelected,
    defaultSelected: ariaProps.defaultSelected,
    onChange: ariaProps.onChange,
    isDisabled: ariaProps.isDisabled,
    isReadOnly: ariaProps.isReadOnly,
  }));

  // Create switch aria props
  const switchAria = createSwitch(
    () => ({
      ...ariaProps,
      children: typeof local.children === 'function' ? true : local.children,
    }),
    state,
    () => inputRef
  );

  // Create focus ring
  const { isFocused, isFocusVisible, focusProps } = createFocusRing();

  // Create hover
  const { isHovered, hoverProps } = createHover({
    get isDisabled() {
      return ariaProps.isDisabled || ariaProps.isReadOnly;
    },
  });

  // Render props values
  const renderValues = createMemo<SwitchRenderProps>(() => ({
    isSelected: switchAria.isSelected(),
    isHovered: isHovered(),
    isPressed: switchAria.isPressed(),
    isFocused: isFocused(),
    isFocusVisible: isFocusVisible(),
    isDisabled: switchAria.isDisabled,
    isReadOnly: switchAria.isReadOnly,
    state,
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      children: local.children,
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-Switch',
    },
    renderValues
  );

  // Filter DOM props
  const domProps = createMemo(() => {
    const filtered = filterDOMProps(ariaProps, { global: true });
    delete (filtered as Record<string, unknown>).id;
    delete (filtered as Record<string, unknown>).onClick;
    return filtered;
  });

  // Remove ref from spread props to avoid type conflicts
  const cleanLabelProps = () => {
    const { ref: _ref1, ...rest } = switchAria.labelProps as Record<string, unknown>;
    return rest;
  };
  const cleanHoverProps = () => {
    const { ref: _ref2, ...rest } = hoverProps as Record<string, unknown>;
    return rest;
  };
  const cleanInputProps = () => {
    const { ref: _ref3, ...rest } = switchAria.inputProps as Record<string, unknown>;
    return rest;
  };
  const cleanFocusProps = () => {
    const { ref: _ref4, ...rest } = focusProps as Record<string, unknown>;
    return rest;
  };

  return (
    <label
      {...domProps()}
      {...cleanLabelProps()}
      {...cleanHoverProps()}
      class={renderProps().class}
      style={renderProps().style}
      data-selected={switchAria.isSelected() || undefined}
      data-pressed={switchAria.isPressed() || undefined}
      data-hovered={isHovered() || undefined}
      data-focused={isFocused() || undefined}
      data-focus-visible={isFocusVisible() || undefined}
      data-disabled={switchAria.isDisabled || undefined}
      data-readonly={switchAria.isReadOnly || undefined}
    >
      <VisuallyHidden>
        <input
          ref={(el) => (inputRef = el)}
          {...cleanInputProps()}
          {...cleanFocusProps()}
        />
      </VisuallyHidden>
      {renderProps().children}
    </label>
  );
}
