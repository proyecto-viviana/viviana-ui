/**
 * Provides the behavior and accessibility implementation for a select component.
 * A select displays a collapsible list of options and allows a user to select one of them.
 * Based on @react-aria/select useSelect.
 */

import { type JSX, type Accessor, createEffect, onCleanup } from 'solid-js';
import { createPress } from '../interactions/createPress';
import { createFocusRing } from '../interactions/createFocusRing';
import { createLabel } from '../label/createLabel';
import { filterDOMProps } from '../utils/filterDOMProps';
import { mergeProps } from '../utils/mergeProps';
import { createId } from '../ssr';
import { access, type MaybeAccessor } from '../utils/reactivity';
import type { SelectState, CollectionNode } from '@proyecto-viviana/solid-stately';

export interface AriaSelectProps {
  /** An ID for the select. */
  id?: string;
  /** Whether the select is disabled. */
  isDisabled?: boolean;
  /** Whether the select is required. */
  isRequired?: boolean;
  /** The label for the select. */
  label?: JSX.Element;
  /** An accessible label for the select when no visible label is provided. */
  'aria-label'?: string;
  /** The ID of an element that labels the select. */
  'aria-labelledby'?: string;
  /** The ID of an element that describes the select. */
  'aria-describedby'?: string;
  /** Placeholder text when no option is selected. */
  placeholder?: string;
  /** Whether the select should be auto-focused. */
  autoFocus?: boolean;
  /** Handler called when focus moves to the select. */
  onFocus?: (e: FocusEvent) => void;
  /** Handler called when focus moves away from the select. */
  onBlur?: (e: FocusEvent) => void;
  /** Handler called when the focus state changes. */
  onFocusChange?: (isFocused: boolean) => void;
  /** The name of the select, used when submitting an HTML form. */
  name?: string;
}

export interface SelectAria<T> {
  /** Props for the label element. */
  labelProps: JSX.HTMLAttributes<HTMLElement>;
  /** Props for the trigger button element. */
  triggerProps: JSX.HTMLAttributes<HTMLElement>;
  /** Props for the value display element. */
  valueProps: JSX.HTMLAttributes<HTMLElement>;
  /** Props for the listbox/menu popup. */
  menuProps: JSX.HTMLAttributes<HTMLElement>;
  /** Props for the description element, if any. */
  descriptionProps: JSX.HTMLAttributes<HTMLElement>;
  /** Props for the error message element, if any. */
  errorMessageProps: JSX.HTMLAttributes<HTMLElement>;
  /** Whether the select is currently focused. */
  isFocused: Accessor<boolean>;
  /** Whether the select has keyboard focus. */
  isFocusVisible: Accessor<boolean>;
  /** Whether the select is currently open. */
  isOpen: Accessor<boolean>;
  /** The currently selected item. */
  selectedItem: Accessor<CollectionNode<T> | null>;
}

// Shared data between select and options
const selectData = new WeakMap<object, SelectData>();

interface SelectData {
  id: string;
}

export function getSelectData(state: SelectState): SelectData | undefined {
  return selectData.get(state);
}

/**
 * Provides the behavior and accessibility implementation for a select component.
 */
export function createSelect<T>(
  props: MaybeAccessor<AriaSelectProps>,
  state: SelectState<T>,
  _ref?: () => HTMLElement | null
): SelectAria<T> {
  const getProps = () => access(props);
  const id = createId(getProps().id);

  // Generate IDs for associated elements
  const buttonId = `${id}-button`;
  const listBoxId = `${id}-listbox`;
  const valueId = `${id}-value`;
  const descriptionId = `${id}-description`;
  const errorMessageId = `${id}-error`;

  // Filter DOM props
  const domProps = () =>
    filterDOMProps(getProps() as unknown as Record<string, unknown>, { labelable: true });

  // Share data with child options
  createEffect(() => {
    selectData.set(state, { id });

    onCleanup(() => {
      selectData.delete(state);
    });
  });

  // Label handling
  const { labelProps, fieldProps } = createLabel({
    get id() {
      return buttonId;
    },
    get label() {
      return getProps().label;
    },
    get 'aria-label'() {
      return getProps()['aria-label'];
    },
    get 'aria-labelledby'() {
      return getProps()['aria-labelledby'];
    },
    labelElementType: 'span',
  });

  // Focus ring for keyboard focus styling
  const { isFocusVisible, focusProps } = createFocusRing({
    get autoFocus() {
      return getProps().autoFocus;
    },
  });

  // Track focus state
  const isFocused = state.isFocused;

  // Handle press on trigger
  const { pressProps } = createPress({
    get isDisabled() {
      return getProps().isDisabled ?? state.isDisabled;
    },
    onPress() {
      state.toggle();
    },
  });

  // Keyboard navigation
  const onKeyDown: JSX.EventHandler<HTMLElement, KeyboardEvent> = (e) => {
    if (getProps().isDisabled) return;

    const collection = state.collection();
    const currentKey = state.selectedKey();

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        state.toggle();
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!state.isOpen()) {
          // Open and focus first item or currently selected item
          state.open();
          const focusKey = currentKey ?? collection.getFirstKey();
          if (focusKey) {
            state.setFocusedKey(focusKey);
          }
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!state.isOpen()) {
          // Open and focus last item or currently selected item
          state.open();
          const focusKey = currentKey ?? collection.getLastKey();
          if (focusKey) {
            state.setFocusedKey(focusKey);
          }
        }
        break;
      case 'Escape':
        if (state.isOpen()) {
          e.preventDefault();
          state.close();
        }
        break;
    }
  };

  // Handle focus events
  const handleFocus = (e: FocusEvent) => {
    state.setFocused(true);
    getProps().onFocus?.(e);
    getProps().onFocusChange?.(true);
  };

  const handleBlur = (e: FocusEvent) => {
    state.setFocused(false);
    getProps().onBlur?.(e);
    getProps().onFocusChange?.(false);
  };

  return {
    get labelProps() {
      return labelProps as JSX.HTMLAttributes<HTMLElement>;
    },
    get triggerProps() {
      const p = getProps();
      const isOpen = state.isOpen();
      const isDisabled = p.isDisabled ?? state.isDisabled;

      return mergeProps(
        domProps(),
        pressProps as Record<string, unknown>,
        focusProps as Record<string, unknown>,
        fieldProps as Record<string, unknown>,
        {
          id: buttonId,
          role: 'combobox',
          type: 'button',
          tabIndex: isDisabled ? undefined : 0,
          'aria-haspopup': 'listbox',
          'aria-expanded': isOpen,
          'aria-controls': isOpen ? listBoxId : undefined,
          'aria-disabled': isDisabled || undefined,
          'aria-required': p.isRequired || undefined,
          'aria-describedby': p['aria-describedby'] || undefined,
          onKeyDown,
          onFocus: handleFocus,
          onBlur: handleBlur,
          'data-open': isOpen || undefined,
          'data-disabled': isDisabled || undefined,
          'data-focus-visible': isFocusVisible() || undefined,
        } as Record<string, unknown>
      ) as JSX.HTMLAttributes<HTMLElement>;
    },
    get valueProps() {
      return {
        id: valueId,
      } as JSX.HTMLAttributes<HTMLElement>;
    },
    get menuProps() {
      return {
        id: listBoxId,
        role: 'listbox',
        'aria-labelledby': buttonId,
        tabIndex: -1,
      } as JSX.HTMLAttributes<HTMLElement>;
    },
    get descriptionProps() {
      return {
        id: descriptionId,
      } as JSX.HTMLAttributes<HTMLElement>;
    },
    get errorMessageProps() {
      return {
        id: errorMessageId,
      } as JSX.HTMLAttributes<HTMLElement>;
    },
    isFocused,
    isFocusVisible: () => isFocused() && isFocusVisible(),
    isOpen: state.isOpen,
    selectedItem: state.selectedItem,
  };
}
