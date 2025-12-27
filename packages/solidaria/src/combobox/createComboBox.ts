/**
 * Provides the behavior and accessibility implementation for a combobox component.
 * A combobox combines a text input with a listbox, allowing users to filter a list of options.
 * Based on @react-aria/combobox useComboBox.
 */

import { type JSX, type Accessor, createEffect, onCleanup } from 'solid-js';
import { createPress } from '../interactions/createPress';
import { createFocusRing } from '../interactions/createFocusRing';
import { createLabel } from '../label/createLabel';
import { filterDOMProps } from '../utils/filterDOMProps';
import { mergeProps } from '../utils/mergeProps';
import { createId } from '../ssr';
import { access, type MaybeAccessor } from '../utils/reactivity';
import type { ComboBoxState, CollectionNode } from '@proyecto-viviana/solid-stately';

export interface AriaComboBoxProps {
  /** An ID for the combobox. */
  id?: string;
  /** Whether the combobox is disabled. */
  isDisabled?: boolean;
  /** Whether the combobox is required. */
  isRequired?: boolean;
  /** Whether the combobox is read-only. */
  isReadOnly?: boolean;
  /** The label for the combobox. */
  label?: JSX.Element;
  /** An accessible label for the combobox when no visible label is provided. */
  'aria-label'?: string;
  /** The ID of an element that labels the combobox. */
  'aria-labelledby'?: string;
  /** The ID of an element that describes the combobox. */
  'aria-describedby'?: string;
  /** Placeholder text for the input when no value is entered. */
  placeholder?: string;
  /** Whether the combobox should be auto-focused. */
  autoFocus?: boolean;
  /** Handler called when focus moves to the combobox input. */
  onFocus?: (e: FocusEvent) => void;
  /** Handler called when focus moves away from the combobox input. */
  onBlur?: (e: FocusEvent) => void;
  /** Handler called when the focus state changes. */
  onFocusChange?: (isFocused: boolean) => void;
  /** The name of the combobox, used when submitting an HTML form. */
  name?: string;
  /**
   * Describes the type of autocomplete functionality the input should provide.
   * @default 'list'
   */
  autoComplete?: 'list' | 'none' | 'inline' | 'both';
  /** Whether focus should wrap from the last item to the first. */
  shouldFocusWrap?: boolean;
}

export interface ComboBoxAria<T> {
  /** Props for the label element. */
  labelProps: JSX.HTMLAttributes<HTMLElement>;
  /** Props for the input element. */
  inputProps: JSX.InputHTMLAttributes<HTMLInputElement>;
  /** Props for the trigger button element. */
  buttonProps: JSX.HTMLAttributes<HTMLElement>;
  /** Props for the listbox popup. */
  listBoxProps: JSX.HTMLAttributes<HTMLElement>;
  /** Props for the description element, if any. */
  descriptionProps: JSX.HTMLAttributes<HTMLElement>;
  /** Props for the error message element, if any. */
  errorMessageProps: JSX.HTMLAttributes<HTMLElement>;
  /** Whether the input is currently focused. */
  isFocused: Accessor<boolean>;
  /** Whether the input has keyboard focus. */
  isFocusVisible: Accessor<boolean>;
  /** Whether the listbox is currently open. */
  isOpen: Accessor<boolean>;
  /** The currently selected item. */
  selectedItem: Accessor<CollectionNode<T> | null>;
}

// Shared data between combobox and options
const comboBoxData = new WeakMap<object, ComboBoxData>();

interface ComboBoxData {
  id: string;
}

export function getComboBoxData(state: ComboBoxState<unknown>): ComboBoxData | undefined {
  return comboBoxData.get(state);
}

/**
 * Provides the behavior and accessibility implementation for a combobox component.
 */
export function createComboBox<T>(
  props: MaybeAccessor<AriaComboBoxProps>,
  state: ComboBoxState<T>,
  inputRef: () => HTMLInputElement | null,
  buttonRef?: () => HTMLElement | null
): ComboBoxAria<T> {
  const getProps = () => access(props);
  const id = createId(getProps().id);

  // Generate IDs for associated elements
  const inputId = `${id}-input`;
  const buttonId = `${id}-button`;
  const listBoxId = `${id}-listbox`;
  const descriptionId = `${id}-description`;
  const errorMessageId = `${id}-error`;

  // Filter DOM props
  const domProps = () =>
    filterDOMProps(getProps() as unknown as Record<string, unknown>, { labelable: true });

  // Share data with child options
  createEffect(() => {
    comboBoxData.set(state, { id });

    onCleanup(() => {
      comboBoxData.delete(state);
    });
  });

  // Label handling
  const { labelProps, fieldProps } = createLabel({
    get id() {
      return inputId;
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
    labelElementType: 'label',
  });

  // Focus ring for keyboard focus styling
  const { isFocusVisible, focusProps } = createFocusRing({
    get autoFocus() {
      return getProps().autoFocus;
    },
  });

  // Track focus state from state
  const isFocused = state.isFocused;

  // Handle press on button trigger
  const { pressProps } = createPress({
    get isDisabled() {
      return getProps().isDisabled ?? state.isDisabled;
    },
    onPress() {
      state.toggle(null, 'manual');
      // Focus input after toggling
      inputRef()?.focus();
    },
  });

  // Handle input change
  const onInputChange: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
    const target = e.target as HTMLInputElement;
    state.setInputValue(target.value);
  };

  // Keyboard navigation for input
  const onInputKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (e) => {
    const p = getProps();
    if (p.isDisabled || p.isReadOnly) return;

    const collection = state.collection();
    const focusedKey = state.focusedKey();
    const shouldWrap = p.shouldFocusWrap ?? false;

    switch (e.key) {
      case 'Enter':
        if (state.isOpen() && focusedKey != null) {
          e.preventDefault();
          state.commit();
        }
        break;

      case 'Escape':
        if (state.isOpen()) {
          e.preventDefault();
          e.stopPropagation();
          state.revert();
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        if (!state.isOpen()) {
          state.open('first', 'manual');
        } else {
          // Move to next item
          if (focusedKey == null) {
            const firstKey = collection.getFirstKey();
            if (firstKey != null) {
              state.setFocusedKey(firstKey);
            }
          } else {
            let nextKey = collection.getKeyAfter(focusedKey);
            // Skip disabled keys
            while (nextKey != null && state.isKeyDisabled(nextKey)) {
              nextKey = collection.getKeyAfter(nextKey);
            }
            if (nextKey != null) {
              state.setFocusedKey(nextKey);
            } else if (shouldWrap) {
              // Wrap to first
              let firstKey = collection.getFirstKey();
              while (firstKey != null && state.isKeyDisabled(firstKey)) {
                firstKey = collection.getKeyAfter(firstKey);
              }
              if (firstKey != null) {
                state.setFocusedKey(firstKey);
              }
            }
          }
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (!state.isOpen()) {
          state.open('last', 'manual');
        } else {
          // Move to previous item
          if (focusedKey == null) {
            const lastKey = collection.getLastKey();
            if (lastKey != null) {
              state.setFocusedKey(lastKey);
            }
          } else {
            let prevKey = collection.getKeyBefore(focusedKey);
            // Skip disabled keys
            while (prevKey != null && state.isKeyDisabled(prevKey)) {
              prevKey = collection.getKeyBefore(prevKey);
            }
            if (prevKey != null) {
              state.setFocusedKey(prevKey);
            } else if (shouldWrap) {
              // Wrap to last
              let lastKey = collection.getLastKey();
              while (lastKey != null && state.isKeyDisabled(lastKey)) {
                lastKey = collection.getKeyBefore(lastKey);
              }
              if (lastKey != null) {
                state.setFocusedKey(lastKey);
              }
            }
          }
        }
        break;

      case 'Home':
        if (state.isOpen()) {
          e.preventDefault();
          let firstKey = collection.getFirstKey();
          while (firstKey != null && state.isKeyDisabled(firstKey)) {
            firstKey = collection.getKeyAfter(firstKey);
          }
          if (firstKey != null) {
            state.setFocusedKey(firstKey);
          }
        }
        break;

      case 'End':
        if (state.isOpen()) {
          e.preventDefault();
          let lastKey = collection.getLastKey();
          while (lastKey != null && state.isKeyDisabled(lastKey)) {
            lastKey = collection.getKeyBefore(lastKey);
          }
          if (lastKey != null) {
            state.setFocusedKey(lastKey);
          }
        }
        break;

      case 'Tab':
        // Commit on Tab if menu is open
        if (state.isOpen() && focusedKey != null) {
          state.commit();
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
    // Don't blur if focus is moving to the button or listbox
    const relatedTarget = e.relatedTarget as HTMLElement | null;
    const button = buttonRef?.();

    if (relatedTarget && (
      button?.contains(relatedTarget) ||
      relatedTarget.closest(`[id="${listBoxId}"]`)
    )) {
      return;
    }

    state.setFocused(false);

    // Close and revert on blur
    if (state.isOpen()) {
      state.close();
    }

    getProps().onBlur?.(e);
    getProps().onFocusChange?.(false);
  };

  return {
    get labelProps() {
      return labelProps as JSX.HTMLAttributes<HTMLElement>;
    },
    get inputProps() {
      const p = getProps();
      const isOpen = state.isOpen();
      const isDisabled = p.isDisabled ?? state.isDisabled;
      const isReadOnly = p.isReadOnly ?? state.isReadOnly;
      const focusedKey = state.focusedKey();

      return mergeProps(
        domProps(),
        focusProps as Record<string, unknown>,
        fieldProps as Record<string, unknown>,
        {
          id: inputId,
          type: 'text',
          role: 'combobox',
          get value() {
            return state.inputValue();
          },
          tabIndex: isDisabled ? undefined : 0,
          disabled: isDisabled || undefined,
          readOnly: isReadOnly || undefined,
          placeholder: p.placeholder,
          autoComplete: 'off',
          'aria-autocomplete': p.autoComplete ?? 'list',
          'aria-haspopup': 'listbox',
          'aria-expanded': isOpen,
          'aria-controls': isOpen ? listBoxId : undefined,
          'aria-activedescendant': isOpen && focusedKey != null
            ? `${listBoxId}-option-${focusedKey}`
            : undefined,
          'aria-disabled': isDisabled || undefined,
          'aria-required': p.isRequired || undefined,
          'aria-describedby': p['aria-describedby'] || undefined,
          name: p.name,
          onInput: onInputChange,
          onKeyDown: onInputKeyDown,
          onFocus: handleFocus,
          onBlur: handleBlur,
          'data-open': isOpen || undefined,
          'data-disabled': isDisabled || undefined,
          'data-readonly': isReadOnly || undefined,
          'data-focus-visible': isFocusVisible() || undefined,
        } as Record<string, unknown>
      ) as JSX.InputHTMLAttributes<HTMLInputElement>;
    },
    get buttonProps() {
      const p = getProps();
      const isOpen = state.isOpen();
      const isDisabled = p.isDisabled ?? state.isDisabled;

      return mergeProps(
        pressProps as Record<string, unknown>,
        {
          id: buttonId,
          type: 'button',
          tabIndex: -1,
          'aria-haspopup': 'listbox',
          'aria-expanded': isOpen,
          'aria-controls': isOpen ? listBoxId : undefined,
          'aria-disabled': isDisabled || undefined,
          'aria-label': 'Show suggestions',
          'data-open': isOpen || undefined,
          'data-disabled': isDisabled || undefined,
        } as Record<string, unknown>
      ) as JSX.HTMLAttributes<HTMLElement>;
    },
    get listBoxProps() {
      return {
        id: listBoxId,
        role: 'listbox',
        'aria-labelledby': inputId,
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
