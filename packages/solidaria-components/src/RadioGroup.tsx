/**
 * RadioGroup and Radio components for solidaria-components
 *
 * Pre-wired headless radio components that combine state + aria hooks.
 * Port of react-aria-components/src/RadioGroup.tsx
 */

import {
  type JSX,
  type ParentProps,
  createContext,
  useContext,
  createMemo,
  splitProps,
} from 'solid-js';
import {
  createRadio,
  createRadioGroup,
  createFocusRing,
  createHover,
  type AriaRadioProps,
  type AriaRadioGroupProps,
} from '@proyecto-viviana/solidaria';
import {
  createRadioGroupState,
  type RadioGroupState,
  type RadioGroupProps as RadioGroupStateProps,
} from '@proyecto-viviana/solid-stately';
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

export type Orientation = 'horizontal' | 'vertical';

export interface RadioGroupRenderProps {
  /** The orientation of the radio group. */
  orientation: Orientation;
  /** Whether the radio group is disabled. */
  isDisabled: boolean;
  /** Whether the radio group is read only. */
  isReadOnly: boolean;
  /** Whether the radio group is required. */
  isRequired: boolean;
  /** Whether the radio group is invalid. */
  isInvalid: boolean;
  /** State of the radio group. */
  state: RadioGroupState;
}

export interface RadioRenderProps {
  /** Whether the radio is selected. */
  isSelected: boolean;
  /** Whether the radio is currently hovered with a mouse. */
  isHovered: boolean;
  /** Whether the radio is currently in a pressed state. */
  isPressed: boolean;
  /** Whether the radio is focused, either via a mouse or keyboard. */
  isFocused: boolean;
  /** Whether the radio is keyboard focused. */
  isFocusVisible: boolean;
  /** Whether the radio is disabled. */
  isDisabled: boolean;
  /** Whether the radio is read only. */
  isReadOnly: boolean;
  /** Whether the radio is invalid. */
  isInvalid: boolean;
  /** Whether the radio is required. */
  isRequired: boolean;
}

export interface RadioGroupProps
  extends Omit<AriaRadioGroupProps, 'children' | 'label' | 'description' | 'errorMessage'>,
    Pick<RadioGroupStateProps, 'value' | 'defaultValue' | 'onChange'>,
    SlotProps {
  /** The children of the component. A function may be provided to receive render props. */
  children?: RenderChildren<RadioGroupRenderProps>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<RadioGroupRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<RadioGroupRenderProps>;
}

export interface RadioProps
  extends Omit<AriaRadioProps, 'children'>,
    SlotProps {
  /** The children of the component. A function may be provided to receive render props. */
  children?: RenderChildren<RadioRenderProps>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<RadioRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<RadioRenderProps>;
}

// ============================================
// CONTEXT
// ============================================

export const RadioGroupContext = createContext<RadioGroupProps | null>(null);
export const RadioGroupStateContext = createContext<RadioGroupState | null>(null);
export const RadioContext = createContext<RadioProps | null>(null);

// ============================================
// RADIO GROUP COMPONENT
// ============================================

/**
 * A radio group allows a user to select a single item from a list of mutually exclusive options.
 *
 * @example
 * ```tsx
 * <RadioGroup>
 *   <Radio value="one">Option 1</Radio>
 *   <Radio value="two">Option 2</Radio>
 * </RadioGroup>
 * ```
 */
export function RadioGroup(props: ParentProps<RadioGroupProps>): JSX.Element {
  const [local, ariaProps] = splitProps(props, [
    'children',
    'class',
    'style',
    'slot',
  ]);

  // Create radio group state
  // We pass a function that returns props so that createRadioGroupState
  // can access props reactively. The props object itself is a proxy in SolidJS,
  // so accessing props.value inside a reactive context will track changes.
  const state = createRadioGroupState({
    get value() { return props.value; },
    get defaultValue() { return props.defaultValue; },
    get onChange() { return props.onChange; },
    get isDisabled() { return props.isDisabled; },
    get isReadOnly() { return props.isReadOnly; },
    get isRequired() { return props.isRequired; },
    get isInvalid() { return props.isInvalid; },
  });

  // Create radio group aria props
  const groupAria = createRadioGroup(() => ariaProps, state);

  // Render props values
  const renderValues = createMemo<RadioGroupRenderProps>(() => ({
    orientation: (ariaProps.orientation as Orientation) ?? 'vertical',
    isDisabled: state.isDisabled,
    isReadOnly: state.isReadOnly,
    isRequired: state.isRequired,
    isInvalid: groupAria.isInvalid,
    state,
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      children: local.children,
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-RadioGroup',
    },
    renderValues
  );

  // Filter DOM props
  const domProps = createMemo(() => filterDOMProps(ariaProps, { global: true }));

  // Remove ref from spread props to avoid type conflicts
  const cleanGroupProps = () => {
    const { ref: _ref, ...rest } = groupAria.radioGroupProps as Record<string, unknown>;
    return rest;
  };

  return (
    <RadioGroupStateContext.Provider value={state}>
      <div
        {...domProps()}
        {...cleanGroupProps()}
        class={renderProps.class()}
        style={renderProps.style()}
        data-orientation={ariaProps.orientation ?? 'vertical'}
        data-disabled={state.isDisabled || undefined}
        data-readonly={state.isReadOnly || undefined}
        data-required={state.isRequired || undefined}
        data-invalid={groupAria.isInvalid || undefined}
      >
        {renderProps.renderChildren()}
      </div>
    </RadioGroupStateContext.Provider>
  );
}

// ============================================
// RADIO COMPONENT
// ============================================

/**
 * Internal Radio implementation that has access to RadioGroupStateContext.
 * This is rendered inside the RadioGroup's context provider.
 */
function RadioImpl(props: { radioProps: RadioProps; state: RadioGroupState }): JSX.Element {
  let inputRef: HTMLInputElement | null = null;
  const { radioProps, state } = props;

  const [local, ariaProps] = splitProps(radioProps, [
    'children',
    'class',
    'style',
    'slot',
  ]);

  // Create radio aria props
  const radioAria = createRadio(
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
      return radioAria.isDisabled || state.isReadOnly;
    },
  });

  // Render props values
  const renderValues = createMemo<RadioRenderProps>(() => ({
    isSelected: radioAria.isSelected(),
    isHovered: isHovered(),
    isPressed: radioAria.isPressed(),
    isFocused: isFocused(),
    isFocusVisible: isFocusVisible(),
    isDisabled: radioAria.isDisabled,
    isReadOnly: state.isReadOnly,
    isInvalid: state.isInvalid,
    isRequired: state.isRequired,
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      children: local.children,
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-Radio',
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
    const { ref: _ref1, ...rest } = radioAria.labelProps as Record<string, unknown>;
    return rest;
  };
  const cleanHoverProps = () => {
    const { ref: _ref2, ...rest } = hoverProps as Record<string, unknown>;
    return rest;
  };
  const cleanInputProps = () => {
    const { ref: _ref3, ...rest } = radioAria.inputProps as Record<string, unknown>;
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
      class={renderProps.class()}
      style={renderProps.style()}
      data-selected={radioAria.isSelected() || undefined}
      data-pressed={radioAria.isPressed() || undefined}
      data-hovered={isHovered() || undefined}
      data-focused={isFocused() || undefined}
      data-focus-visible={isFocusVisible() || undefined}
      data-disabled={radioAria.isDisabled || undefined}
      data-readonly={state.isReadOnly || undefined}
      data-invalid={state.isInvalid || undefined}
      data-required={state.isRequired || undefined}
    >
      <VisuallyHidden>
        <input
          ref={(el) => (inputRef = el)}
          {...cleanInputProps()}
          {...cleanFocusProps()}
        />
      </VisuallyHidden>
      {renderProps.renderChildren()}
    </label>
  );
}

/**
 * Inner wrapper component that requires context.
 * This is used instead of an IIFE to avoid SSR issues with deferred rendering.
 */
function RadioInner(props: { radioProps: RadioProps }): JSX.Element {
  const state = useContext(RadioGroupStateContext);
  if (!state) {
    throw new Error('Radio must be used within a RadioGroup');
  }
  return <RadioImpl radioProps={props.radioProps} state={state} />;
}

/**
 * A radio represents an individual option within a radio group.
 *
 * @example
 * ```tsx
 * <Radio value="option1">
 *   {({ isSelected }) => (
 *     <>
 *       <span class={`radio ${isSelected ? 'selected' : ''}`}>
 *         {isSelected && '●'}
 *       </span>
 *       <span>Option 1</span>
 *     </>
 *   )}
 * </Radio>
 * ```
 */
export function Radio(props: RadioProps): JSX.Element {
  // Use an inner component instead of an IIFE to avoid SSR hydration issues
  return <RadioInner radioProps={props} />;
}
