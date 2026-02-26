/**
 * Provides the behavior and accessibility implementation for an option in a listbox.
 * Based on @react-aria/listbox useOption.
 */

import { type JSX, type Accessor } from 'solid-js';
import { createPress } from '../interactions/createPress';
import { createHover } from '../interactions/createHover';
import { createFocusRing } from '../interactions/createFocusRing';
import { mergeProps } from '../utils/mergeProps';
import { access, type MaybeAccessor } from '../utils/reactivity';
import { getListBoxData } from './createListBox';
import type { ListState, Key } from '@proyecto-viviana/solid-stately';

export interface AriaOptionProps {
  /** The unique key for the option. */
  key: Key;
  /** Whether the option is disabled. */
  isDisabled?: boolean;
  /** An accessible label for the option. */
  'aria-label'?: string;
  /** Whether selection should occur on press up. */
  shouldSelectOnPressUp?: boolean;
  /** Whether to focus the option on hover. */
  shouldFocusOnHover?: boolean;
}

export interface OptionAria {
  /** Props for the option element. */
  optionProps: JSX.HTMLAttributes<HTMLElement>;
  /** Props for the label text inside the option. */
  labelProps: JSX.HTMLAttributes<HTMLElement>;
  /** Props for the description text inside the option. */
  descriptionProps: JSX.HTMLAttributes<HTMLElement>;
  /** Whether the option is currently selected. */
  isSelected: Accessor<boolean>;
  /** Whether the option is currently focused. */
  isFocused: Accessor<boolean>;
  /** Whether the option is keyboard focused. */
  isFocusVisible: Accessor<boolean>;
  /** Whether the option is currently pressed. */
  isPressed: Accessor<boolean>;
  /** Whether the option is disabled. */
  isDisabled: Accessor<boolean>;
}

/**
 * Provides the behavior and accessibility implementation for an option in a listbox.
 */
export function createOption<T>(
  props: MaybeAccessor<AriaOptionProps>,
  state: ListState<T>,
  _ref?: () => HTMLElement | null
): OptionAria {
  const getProps = () => access(props);

  // Get shared data from listbox
  const getData = () => getListBoxData(state);

  // Computed states
  const isDisabled: Accessor<boolean> = () => {
    return Boolean(getData()?.isDisabled || getProps().isDisabled || state.isDisabled(getProps().key));
  };

  const isSelected: Accessor<boolean> = () => {
    return state.isSelected(getProps().key);
  };

  const isFocused: Accessor<boolean> = () => {
    return state.focusedKey() === getProps().key;
  };

  const shouldSelectOnPressUp = () => {
    return getProps().shouldSelectOnPressUp ?? getData()?.shouldSelectOnPressUp ?? true;
  };

  const selectAndAction = () => {
    const key = getProps().key;
    if (state.selectionMode() !== 'none') {
      state.select(key);
    }
    getData()?.onAction?.(key);
  };

  // Handle press
  const { pressProps, isPressed } = createPress({
    get isDisabled() {
      return isDisabled();
    },
    onPressStart(e) {
      if (!shouldSelectOnPressUp() && e.pointerType !== 'keyboard' && e.pointerType !== 'virtual') {
        selectAndAction();
      }
    },
    onPress(e) {
      if (shouldSelectOnPressUp() || e.pointerType === 'keyboard' || e.pointerType === 'virtual') {
        selectAndAction();
      }
    },
  });

  // Handle hover
  const { hoverProps, isHovered } = createHover({
    get isDisabled() {
      return isDisabled();
    },
    onHoverStart() {
      const shouldFocus = getProps().shouldFocusOnHover ?? getData()?.shouldFocusOnHover;
      if (shouldFocus) {
        state.setFocusedKey(getProps().key);
      }
    },
  });

  // Handle focus ring
  const { isFocusVisible, focusProps } = createFocusRing();

  // Generate unique IDs for label and description
  const labelId = `${getProps().key}-label`;
  const descriptionId = `${getProps().key}-desc`;

  return {
    get optionProps() {
      const key = getProps().key;
      const selectionMode = state.selectionMode();
      const ariaLabel = getProps()['aria-label'];

      return mergeProps(
        pressProps as Record<string, unknown>,
        hoverProps as Record<string, unknown>,
        focusProps as Record<string, unknown>,
        {
          role: 'option',
          id: String(key),
          'aria-selected': selectionMode !== 'none' ? isSelected() : undefined,
          'aria-disabled': isDisabled() || undefined,
          'aria-label': ariaLabel,
          'aria-labelledby': !ariaLabel ? labelId : undefined,
          'aria-describedby': descriptionId,
          tabIndex: isFocused() ? 0 : -1,
          'data-selected': isSelected() || undefined,
          'data-focused': isFocused() || undefined,
          'data-focus-visible': isFocusVisible() || undefined,
          'data-pressed': isPressed() || undefined,
          'data-disabled': isDisabled() || undefined,
          'data-hovered': isHovered() || undefined,
        } as Record<string, unknown>
      ) as JSX.HTMLAttributes<HTMLElement>;
    },
    labelProps: {
      id: labelId,
    },
    descriptionProps: {
      id: descriptionId,
    },
    isSelected,
    isFocused,
    isFocusVisible: () => isFocused() && isFocusVisible(),
    isPressed,
    isDisabled,
  };
}
