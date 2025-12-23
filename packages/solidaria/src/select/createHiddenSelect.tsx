/**
 * Provides a hidden native select element for form integration.
 * Based on @react-aria/select useHiddenSelect.
 */

import { type JSX, For } from 'solid-js';
import { access, type MaybeAccessor } from '../utils/reactivity';
import type { SelectState, Key } from '@proyecto-viviana/solid-stately';

export interface AriaHiddenSelectProps<T> {
  /** The state object for the select. */
  state: SelectState<T>;
  /** The name attribute for the hidden select. */
  name?: string;
  /** Whether the select is disabled. */
  isDisabled?: boolean;
  /** Describes the type of autocomplete functionality the select should provide. */
  autoComplete?: string;
}

export interface HiddenSelectAria {
  /** Props for the container element. */
  containerProps: JSX.HTMLAttributes<HTMLDivElement>;
  /** Props for the hidden select element. */
  selectProps: JSX.SelectHTMLAttributes<HTMLSelectElement>;
  /** Props for the hidden input element (for form submission). */
  inputProps: JSX.InputHTMLAttributes<HTMLInputElement>;
}

/**
 * Provides the accessibility implementation for a hidden select.
 * This is used for native form submission and accessibility on mobile devices.
 */
export function createHiddenSelect<T>(
  props: MaybeAccessor<AriaHiddenSelectProps<T>>
): HiddenSelectAria {
  const getProps = () => access(props);

  return {
    get containerProps() {
      return {
        'aria-hidden': true,
        'data-a11y-ignore': 'aria-hidden-focus',
      } as JSX.HTMLAttributes<HTMLDivElement>;
    },
    get selectProps() {
      const p = getProps();
      const state = p.state;
      const selectedKey = state.selectedKey();

      return {
        tabIndex: -1,
        autoComplete: p.autoComplete,
        disabled: p.isDisabled ?? state.isDisabled,
        name: p.name,
        value: selectedKey != null ? String(selectedKey) : '',
        onChange: (e: Event) => {
          const target = e.target as HTMLSelectElement;
          state.setSelectedKey(target.value as Key);
        },
        style: {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
          'font-size': '16px', // Prevents zoom on iOS
          border: 'none',
          cursor: 'default',
          margin: 0,
          padding: 0,
          'pointer-events': 'none',
        },
      } as JSX.SelectHTMLAttributes<HTMLSelectElement>;
    },
    get inputProps() {
      const p = getProps();
      const state = p.state;
      const selectedKey = state.selectedKey();

      return {
        type: 'hidden',
        name: p.name,
        value: selectedKey != null ? String(selectedKey) : '',
        disabled: p.isDisabled ?? state.isDisabled,
      } as JSX.InputHTMLAttributes<HTMLInputElement>;
    },
  };
}

export interface HiddenSelectProps<T> {
  /** The state object for the select. */
  state: SelectState<T>;
  /** The name attribute for the hidden select. */
  name?: string;
  /** Whether the select is disabled. */
  isDisabled?: boolean;
  /** A ref to the trigger element. */
  triggerRef?: () => HTMLElement | null;
  /** Label for the select. */
  label?: string;
  /** Describes the type of autocomplete functionality the select should provide. */
  autoComplete?: string;
}

/**
 * A component that renders a hidden native select for form submission.
 * This is useful on mobile devices where native select behavior is preferred.
 */
export function HiddenSelect<T>(props: HiddenSelectProps<T>): JSX.Element {
  const { containerProps, selectProps } = createHiddenSelect({
    get state() {
      return props.state;
    },
    get name() {
      return props.name;
    },
    get isDisabled() {
      return props.isDisabled;
    },
    get autoComplete() {
      return props.autoComplete;
    },
  });

  const collection = () => props.state.collection();
  const selectedKey = () => props.state.selectedKey();

  return (
    <div {...containerProps}>
      <select {...selectProps}>
        <option />
        <For each={Array.from(collection())}>
          {(item) => (
            <option value={String(item.key)} selected={item.key === selectedKey()}>
              {item.textValue}
            </option>
          )}
        </For>
      </select>
    </div>
  );
}
