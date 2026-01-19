/**
 * createColorField hook.
 *
 * Provides ARIA attributes and keyboard handling for a color input field.
 */

import { createMemo, type Accessor } from 'solid-js';
import type { ColorFieldState } from '@proyecto-viviana/solid-stately';
import { createId } from '../ssr';
import type { AriaColorFieldOptions, ColorFieldAria } from './types';

/**
 * Creates ARIA props for a color field.
 */
export function createColorField(
  props: Accessor<AriaColorFieldOptions>,
  state: Accessor<ColorFieldState>,
  _inputRef: Accessor<HTMLInputElement | null>
): ColorFieldAria {
  const getProps = () => props();
  const getState = () => state();

  // Generate IDs
  const inputId = createId();
  const labelId = createId();

  // Handle keyboard
  const onKeyDown = (e: KeyboardEvent) => {
    const s = getState();
    const p = getProps();

    if (p.isDisabled || s.isDisabled || p.isReadOnly || s.isReadOnly) return;

    // Only handle special keys for channel mode
    if (!s.channel) return;

    let handled = true;

    switch (e.key) {
      case 'ArrowUp':
        s.increment();
        break;
      case 'ArrowDown':
        s.decrement();
        break;
      case 'PageUp':
        s.incrementToMax();
        break;
      case 'PageDown':
        s.decrementToMin();
        break;
      case 'Home':
        if (e.ctrlKey) {
          s.decrementToMin();
        } else {
          handled = false;
        }
        break;
      case 'End':
        if (e.ctrlKey) {
          s.incrementToMax();
        } else {
          handled = false;
        }
        break;
      default:
        handled = false;
    }

    if (handled) {
      e.preventDefault();
    }
  };

  // Label props
  const labelProps = createMemo(() => {
    return {
      id: labelId,
      for: inputId,
    };
  });

  // Input props
  const inputProps = createMemo(() => {
    const s = getState();
    const p = getProps();

    // Get channel name if in channel mode
    const channelLabel = s.channel && s.value
      ? s.value.getChannelName(s.channel, 'en-US')
      : undefined;

    return {
      id: inputId,
      type: 'text',
      value: s.inputValue,
      disabled: p.isDisabled || s.isDisabled,
      readOnly: p.isReadOnly || s.isReadOnly,
      'aria-label': p['aria-label'] ?? channelLabel,
      'aria-labelledby': p['aria-labelledby'],
      'aria-describedby': p['aria-describedby'],
      'aria-invalid': s.isInvalid || undefined,
      // For spinbutton role in channel mode
      role: s.channel ? ('spinbutton' as const) : undefined,
      'aria-valuenow': s.channel && s.value
        ? s.value.getChannelValue(s.channel)
        : undefined,
      'aria-valuemin': s.channel && s.value
        ? s.value.getChannelRange(s.channel).minValue
        : undefined,
      'aria-valuemax': s.channel && s.value
        ? s.value.getChannelRange(s.channel).maxValue
        : undefined,
      onInput: (e: InputEvent) => {
        const target = e.target as HTMLInputElement;
        s.setInputValue(target.value);
      },
      onChange: () => {
        // onChange fires on blur or enter
        s.commit();
      },
      onBlur: () => {
        s.commit();
      },
      onKeyDown,
    };
  });

  return {
    get labelProps() {
      return labelProps();
    },
    get inputProps() {
      return inputProps();
    },
  };
}
