/**
 * createDateSegment hook for Solidaria
 *
 * Provides the behavior and accessibility implementation for a date segment.
 * Based on @react-aria/datepicker useDateSegment
 */

import { createSignal, createMemo } from 'solid-js';
import { access, type MaybeAccessor } from '../utils/reactivity';
import type { DateFieldState, DateSegment, DateSegmentType } from '@proyecto-viviana/solid-stately';

// ============================================
// TYPES
// ============================================

export interface AriaDateSegmentProps {
  /** The segment data. */
  segment: DateSegment;
}

export interface DateSegmentAria {
  /** Props for the segment element. */
  segmentProps: Record<string, unknown>;
  /** Whether the segment is focused. */
  isFocused: boolean;
  /** Whether the segment is editable. */
  isEditable: boolean;
  /** Whether the segment is a placeholder. */
  isPlaceholder: boolean;
  /** The text to display. */
  text: string;
}

// ============================================
// IMPLEMENTATION
// ============================================

/**
 * Provides the behavior and accessibility implementation for a date segment.
 */
export function createDateSegment<T extends DateFieldState>(
  props: MaybeAccessor<AriaDateSegmentProps>,
  state: T,
  _ref?: () => HTMLElement | null
): DateSegmentAria {
  const getProps = () => access(props);
  const [isFocused, setIsFocused] = createSignal(false);
  const [enteredKeys, setEnteredKeys] = createSignal('');

  // Get the segment from props
  const segment = createMemo(() => getProps().segment);

  // Check if editable
  const isEditable = createMemo(() => {
    const seg = segment();
    return seg.isEditable && !state.isDisabled() && !state.isReadOnly();
  });

  // Handle keyboard input
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isEditable()) return;

    const seg = segment();
    const type = seg.type;

    if (type === 'literal') return;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        state.incrementSegment(type);
        break;
      case 'ArrowDown':
        e.preventDefault();
        state.decrementSegment(type);
        break;
      case 'Backspace':
      case 'Delete':
        e.preventDefault();
        state.clearSegment(type);
        setEnteredKeys('');
        break;
      default:
        // Handle numeric input
        if (/^\d$/.test(e.key)) {
          e.preventDefault();
          handleNumericInput(e.key, type, seg);
        }
        break;
    }
  };

  // Handle numeric input
  const handleNumericInput = (
    key: string,
    type: DateSegmentType,
    seg: DateSegment
  ) => {
    const newKeys = enteredKeys() + key;
    const numValue = parseInt(newKeys, 10);
    const maxValue = seg.maxValue ?? 99;
    const minValue = seg.minValue ?? 0;

    // Check if we should accept more digits
    if (numValue <= maxValue) {
      state.setSegment(type, numValue);

      // If entering more digits wouldn't make sense, clear entered keys
      const potentialNextValue = parseInt(newKeys + '0', 10);
      if (potentialNextValue > maxValue || newKeys.length >= String(maxValue).length) {
        setEnteredKeys('');
        // Move to next segment (would need focus management)
      } else {
        setEnteredKeys(newKeys);
      }
    } else {
      // Start fresh with just this key
      const singleValue = parseInt(key, 10);
      if (singleValue >= minValue && singleValue <= maxValue) {
        state.setSegment(type, singleValue);
      }
      setEnteredKeys(key);
    }
  };

  // Handle focus
  const handleFocus = () => {
    setIsFocused(true);
    setEnteredKeys('');
  };

  const handleBlur = () => {
    setIsFocused(false);
    setEnteredKeys('');
    state.confirmPlaceholder();
  };

  // Segment props
  const segmentProps = createMemo(() => {
    const seg = segment();
    const type = seg.type;

    // Literal segments don't need interaction props
    if (type === 'literal') {
      return {
        'aria-hidden': true,
      };
    }

    return {
      role: 'spinbutton',
      tabIndex: isEditable() ? 0 : -1,
      'aria-label': getSegmentLabel(type),
      'aria-valuenow': seg.value,
      'aria-valuemin': seg.minValue,
      'aria-valuemax': seg.maxValue,
      'aria-valuetext': seg.isPlaceholder ? seg.placeholder : seg.text,
      'aria-readonly': state.isReadOnly() || undefined,
      'aria-disabled': state.isDisabled() || undefined,
      'aria-invalid': state.isInvalid() || undefined,
      contentEditable: isEditable(),
      suppressContentEditableWarning: true,
      inputMode: 'numeric' as const,
      autoCorrect: 'off',
      enterKeyHint: 'next' as const,
      spellCheck: false,
      onKeyDown: handleKeyDown,
      onFocus: handleFocus,
      onBlur: handleBlur,
      onMouseDown: (e: MouseEvent) => {
        // Prevent cursor positioning in the middle of the segment
        e.preventDefault();
      },
    };
  });

  // Text to display
  const text = createMemo(() => {
    const seg = segment();
    return seg.isPlaceholder ? seg.placeholder : seg.text;
  });

  return {
    get segmentProps() {
      return segmentProps();
    },
    get isFocused() {
      return isFocused();
    },
    get isEditable() {
      return isEditable();
    },
    get isPlaceholder() {
      return segment().isPlaceholder;
    },
    get text() {
      return text();
    },
  };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getSegmentLabel(type: DateSegmentType): string {
  switch (type) {
    case 'year':
      return 'Year';
    case 'month':
      return 'Month';
    case 'day':
      return 'Day';
    case 'hour':
      return 'Hour';
    case 'minute':
      return 'Minute';
    case 'second':
      return 'Second';
    case 'dayPeriod':
      return 'AM/PM';
    case 'era':
      return 'Era';
    case 'timeZoneName':
      return 'Time zone';
    default:
      return '';
  }
}
