/**
 * createCalendar hook for Solidaria
 *
 * Provides the behavior and accessibility implementation for a calendar component.
 * Based on @react-aria/calendar useCalendar
 */

import { createMemo } from 'solid-js';
import { createId } from '../ssr';
import { access, type MaybeAccessor } from '../utils/reactivity';
import { mergeProps } from '../utils/mergeProps';
import type { CalendarState } from '@proyecto-viviana/solid-stately';

// ============================================
// TYPES
// ============================================

export interface AriaCalendarProps {
  /** An ID for the calendar. */
  id?: string;
  /** Whether the calendar is disabled. */
  isDisabled?: boolean;
  /** Whether the calendar is read-only. */
  isReadOnly?: boolean;
  /** An accessible label for the calendar. */
  'aria-label'?: string;
  /** The ID of an element that labels the calendar. */
  'aria-labelledby'?: string;
  /** The ID of an element that describes the calendar. */
  'aria-describedby'?: string;
  /** Minimum number of visible months. */
  visibleMonths?: number;
}

export interface CalendarAria {
  /** Props for the calendar container element. */
  calendarProps: Record<string, unknown>;
  /** Props for the previous button. */
  prevButtonProps: Record<string, unknown>;
  /** Props for the next button. */
  nextButtonProps: Record<string, unknown>;
  /** Props for the title/heading element. */
  titleProps: Record<string, unknown>;
  /** An accessible label for the title. */
  title: string;
}

// ============================================
// IMPLEMENTATION
// ============================================

/**
 * Provides the behavior and accessibility implementation for a calendar component.
 */
export function createCalendar<T extends CalendarState>(
  props: MaybeAccessor<AriaCalendarProps>,
  state: T
): CalendarAria {
  const getProps = () => access(props);
  const id = createId(getProps().id);
  const titleId = createId();

  // Title (e.g., "December 2024")
  const title = createMemo(() => state.title());

  // Previous button props
  const prevButtonProps = createMemo(() => {
    const p = getProps();
    const isDisabled = p.isDisabled || state.isDisabled();

    return {
      'aria-label': 'Previous month',
      onClick: () => {
        if (!isDisabled) {
          state.focusPreviousPage();
        }
      },
      disabled: isDisabled,
      tabIndex: -1,
    };
  });

  // Next button props
  const nextButtonProps = createMemo(() => {
    const p = getProps();
    const isDisabled = p.isDisabled || state.isDisabled();

    return {
      'aria-label': 'Next month',
      onClick: () => {
        if (!isDisabled) {
          state.focusNextPage();
        }
      },
      disabled: isDisabled,
      tabIndex: -1,
    };
  });

  // Title props
  const titleProps = createMemo(() => ({
    id: titleId,
    'aria-live': 'polite' as const,
  }));

  // Calendar container props
  const calendarProps = createMemo(() => {
    const p = getProps();

    return mergeProps(
      {
        id,
        role: 'group',
        'aria-labelledby': p['aria-labelledby'] ?? titleId,
        'aria-label': p['aria-label'],
        'aria-describedby': p['aria-describedby'],
      }
    );
  });

  return {
    get calendarProps() {
      return calendarProps();
    },
    get prevButtonProps() {
      return prevButtonProps();
    },
    get nextButtonProps() {
      return nextButtonProps();
    },
    get titleProps() {
      return titleProps();
    },
    get title() {
      return title();
    },
  };
}
