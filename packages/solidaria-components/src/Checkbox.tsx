/**
 * Checkbox and CheckboxGroup components for solidaria-components
 *
 * Pre-wired headless checkbox components that combine state + aria hooks.
 * Port of react-aria-components/src/Checkbox.tsx
 */

import {
  type JSX,
  type Accessor,
  type ParentProps,
  createContext,
  useContext,
  createMemo,
  splitProps,
} from 'solid-js';
import {
  createCheckbox,
  createCheckboxGroup,
  createCheckboxGroupItem,
  createFocusRing,
  createHover,
  type AriaCheckboxProps,
  type AriaCheckboxGroupProps,
} from 'solidaria';
import {
  createToggleState,
  createCheckboxGroupState,
  type ToggleState,
  type CheckboxGroupState,
} from 'solid-stately';
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

export interface CheckboxGroupRenderProps {
  /** Whether the checkbox group is disabled. */
  isDisabled: boolean;
  /** Whether the checkbox group is read only. */
  isReadOnly: boolean;
  /** Whether the checkbox group is required. */
  isRequired: boolean;
  /** Whether the checkbox group is invalid. */
  isInvalid: boolean;
  /** State of the checkbox group. */
  state: CheckboxGroupState;
}

export interface CheckboxRenderProps {
  /** Whether the checkbox is selected. */
  isSelected: boolean;
  /** Whether the checkbox is indeterminate. */
  isIndeterminate: boolean;
  /** Whether the checkbox is currently hovered with a mouse. */
  isHovered: boolean;
  /** Whether the checkbox is currently in a pressed state. */
  isPressed: boolean;
  /** Whether the checkbox is focused, either via a mouse or keyboard. */
  isFocused: boolean;
  /** Whether the checkbox is keyboard focused. */
  isFocusVisible: boolean;
  /** Whether the checkbox is disabled. */
  isDisabled: boolean;
  /** Whether the checkbox is read only. */
  isReadOnly: boolean;
  /** Whether the checkbox is invalid. */
  isInvalid: boolean;
  /** Whether the checkbox is required. */
  isRequired: boolean;
}

export interface CheckboxGroupProps
  extends Omit<AriaCheckboxGroupProps, 'children' | 'label' | 'description' | 'errorMessage'>,
    SlotProps {
  /** The children of the component. A function may be provided to receive render props. */
  children?: RenderChildren<CheckboxGroupRenderProps>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<CheckboxGroupRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<CheckboxGroupRenderProps>;
}

export interface CheckboxProps
  extends Omit<AriaCheckboxProps, 'children'>,
    SlotProps {
  /** The children of the component. A function may be provided to receive render props. */
  children?: RenderChildren<CheckboxRenderProps>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<CheckboxRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<CheckboxRenderProps>;
  /** Whether the checkbox is indeterminate. */
  isIndeterminate?: boolean;
}

// ============================================
// CONTEXT
// ============================================

export const CheckboxGroupContext = createContext<CheckboxGroupProps | null>(null);
export const CheckboxGroupStateContext = createContext<CheckboxGroupState | null>(null);
export const CheckboxContext = createContext<CheckboxProps | null>(null);

// ============================================
// CHECKBOX GROUP COMPONENT
// ============================================

/**
 * A checkbox group allows a user to select multiple items from a list of options.
 *
 * @example
 * ```tsx
 * <CheckboxGroup>
 *   <Checkbox value="one">Option 1</Checkbox>
 *   <Checkbox value="two">Option 2</Checkbox>
 * </CheckboxGroup>
 * ```
 */
export function CheckboxGroup(props: ParentProps<CheckboxGroupProps>): JSX.Element {
  const [local, ariaProps] = splitProps(props, [
    'children',
    'class',
    'style',
    'slot',
  ]);

  // Create checkbox group state
  const state = createCheckboxGroupState(() => ({
    value: ariaProps.value,
    defaultValue: ariaProps.defaultValue,
    onChange: ariaProps.onChange,
    isDisabled: ariaProps.isDisabled,
    isReadOnly: ariaProps.isReadOnly,
    isRequired: ariaProps.isRequired,
    isInvalid: ariaProps.isInvalid,
  }));

  // Create checkbox group aria props
  const groupAria = createCheckboxGroup(() => ariaProps, state);

  // Render props values
  const renderValues = createMemo<CheckboxGroupRenderProps>(() => ({
    isDisabled: state.isDisabled(),
    isReadOnly: state.isReadOnly(),
    isRequired: ariaProps.isRequired ?? false,
    isInvalid: groupAria.isInvalid,
    state,
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      children: local.children,
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-CheckboxGroup',
    },
    renderValues
  );

  // Filter DOM props
  const domProps = createMemo(() => filterDOMProps(ariaProps, { global: true }));

  return (
    <CheckboxGroupStateContext.Provider value={state}>
      <div
        {...domProps()}
        {...groupAria.groupProps}
        class={renderProps().class}
        style={renderProps().style}
        data-disabled={state.isDisabled() || undefined}
        data-readonly={state.isReadOnly() || undefined}
        data-required={ariaProps.isRequired || undefined}
        data-invalid={groupAria.isInvalid || undefined}
      >
        {renderProps().children}
      </div>
    </CheckboxGroupStateContext.Provider>
  );
}

// ============================================
// CHECKBOX COMPONENT
// ============================================

/**
 * A checkbox allows a user to select multiple items from a list of individual items,
 * or to mark one individual item as selected.
 *
 * @example
 * ```tsx
 * <Checkbox>
 *   {({ isSelected }) => (
 *     <>
 *       <span class={`checkbox ${isSelected ? 'checked' : ''}`}>
 *         {isSelected && '✓'}
 *       </span>
 *       <span>Accept terms</span>
 *     </>
 *   )}
 * </Checkbox>
 * ```
 */
export function Checkbox(props: CheckboxProps): JSX.Element {
  let inputRef: HTMLInputElement | null = null;

  const [local, ariaProps] = splitProps(props, [
    'children',
    'class',
    'style',
    'slot',
    'isIndeterminate',
  ]);

  // Check if we're inside a CheckboxGroup
  const groupState = useContext(CheckboxGroupStateContext);

  // Create appropriate state/aria hooks based on context
  let isSelected: Accessor<boolean>;
  let isPressed: Accessor<boolean>;
  let isDisabled: boolean;
  let isReadOnly: boolean;
  let isInvalid: boolean;
  let labelProps: JSX.LabelHTMLAttributes<HTMLLabelElement>;
  let inputProps: JSX.InputHTMLAttributes<HTMLInputElement>;

  if (groupState) {
    // Inside a CheckboxGroup - use group item
    const itemAria = createCheckboxGroupItem(
      () => ({
        ...ariaProps,
        value: ariaProps.value ?? '',
        children: typeof local.children === 'function' ? true : local.children,
      }),
      groupState,
      () => inputRef
    );
    isSelected = itemAria.isSelected;
    isPressed = itemAria.isPressed;
    isDisabled = itemAria.isDisabled;
    isReadOnly = itemAria.isReadOnly;
    isInvalid = itemAria.isInvalid;
    labelProps = itemAria.labelProps;
    inputProps = itemAria.inputProps;
  } else {
    // Standalone checkbox
    const state = createToggleState(() => ({
      isSelected: ariaProps.isSelected,
      defaultSelected: ariaProps.defaultSelected,
      onChange: ariaProps.onChange,
      isDisabled: ariaProps.isDisabled,
      isReadOnly: ariaProps.isReadOnly,
    }));

    const checkboxAria = createCheckbox(
      () => ({
        ...ariaProps,
        isIndeterminate: local.isIndeterminate,
        children: typeof local.children === 'function' ? true : local.children,
      }),
      state,
      () => inputRef
    );
    isSelected = checkboxAria.isSelected;
    isPressed = checkboxAria.isPressed;
    isDisabled = checkboxAria.isDisabled;
    isReadOnly = checkboxAria.isReadOnly;
    isInvalid = checkboxAria.isInvalid;
    labelProps = checkboxAria.labelProps;
    inputProps = checkboxAria.inputProps;
  }

  // Create focus ring
  const { isFocused, isFocusVisible, focusProps } = createFocusRing();

  // Create hover
  const { isHovered, hoverProps } = createHover({
    get isDisabled() {
      return isDisabled || isReadOnly;
    },
  });

  // Render props values
  const renderValues = createMemo<CheckboxRenderProps>(() => ({
    isSelected: isSelected(),
    isIndeterminate: local.isIndeterminate ?? false,
    isHovered: isHovered(),
    isPressed: isPressed(),
    isFocused: isFocused(),
    isFocusVisible: isFocusVisible(),
    isDisabled,
    isReadOnly,
    isInvalid,
    isRequired: ariaProps.isRequired ?? false,
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      children: local.children,
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-Checkbox',
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

  return (
    <label
      {...domProps()}
      {...labelProps}
      {...hoverProps}
      class={renderProps().class}
      style={renderProps().style}
      data-selected={isSelected() || undefined}
      data-indeterminate={local.isIndeterminate || undefined}
      data-pressed={isPressed() || undefined}
      data-hovered={isHovered() || undefined}
      data-focused={isFocused() || undefined}
      data-focus-visible={isFocusVisible() || undefined}
      data-disabled={isDisabled || undefined}
      data-readonly={isReadOnly || undefined}
      data-invalid={isInvalid || undefined}
      data-required={ariaProps.isRequired || undefined}
    >
      <VisuallyHidden>
        <input
          ref={(el) => (inputRef = el)}
          {...inputProps}
          {...focusProps}
        />
      </VisuallyHidden>
      {renderProps().children}
    </label>
  );
}
