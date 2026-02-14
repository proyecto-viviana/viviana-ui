/**
 * createDatePicker hook for Solidaria
 *
 * Provides the behavior and accessibility implementation for a date picker component.
 * Based on @react-aria/datepicker useDatePicker
 */

import { createMemo } from 'solid-js';
import { createId } from '../ssr';
import { createLabel } from '../label/createLabel';
import { access, type MaybeAccessor } from '../utils/reactivity';
import { mergeProps } from '../utils/mergeProps';
import { useLocale } from '../i18n';
import type { DateFieldState, CalendarState } from '@proyecto-viviana/solid-stately';

// ============================================
// TYPES
// ============================================

export interface AriaDatePickerProps {
  /** An ID for the date picker. */
  id?: string;
  /** A visible label for the date picker. */
  label?: string;
  /** An accessible label for the date picker. */
  'aria-label'?: string;
  /** The ID of an element that labels the date picker. */
  'aria-labelledby'?: string;
  /** The ID of an element that describes the date picker. */
  'aria-describedby'?: string;
  /** Whether the date picker is disabled. */
  isDisabled?: boolean;
  /** Whether the date picker is read-only. */
  isReadOnly?: boolean;
  /** Whether the date picker is required. */
  isRequired?: boolean;
  /** Whether the date picker is invalid. */
  isInvalid?: boolean;
  /** Description text. */
  description?: string;
  /** Error message. */
  errorMessage?: string;
  /** Accessible label for the calendar trigger button. */
  buttonAriaLabel?: string;
  /** Accessible label for the calendar dialog. */
  dialogAriaLabel?: string;
  /** Accessible label for the calendar grid region. */
  calendarAriaLabel?: string;
}

export interface DatePickerState {
  /** Whether the calendar is open. */
  isOpen: boolean;
  /** Open the calendar. */
  open: () => void;
  /** Close the calendar. */
  close: () => void;
  /** Toggle the calendar. */
  toggle: () => void;
}

export interface DatePickerAria {
  /** Props for the group container. */
  groupProps: Record<string, unknown>;
  /** Props for the label element. */
  labelProps: Record<string, unknown>;
  /** Props for the date field container. */
  fieldProps: Record<string, unknown>;
  /** Props for the button that opens the calendar. */
  buttonProps: Record<string, unknown>;
  /** Props for the calendar dialog. */
  dialogProps: Record<string, unknown>;
  /** Props for the calendar. */
  calendarProps: Record<string, unknown>;
  /** Props for the description element. */
  descriptionProps: Record<string, unknown>;
  /** Props for the error message element. */
  errorMessageProps: Record<string, unknown>;
}

// ============================================
// IMPLEMENTATION
// ============================================

/**
 * Provides the behavior and accessibility implementation for a date picker component.
 */
export function createDatePicker<T extends DateFieldState, C extends CalendarState>(
  props: MaybeAccessor<AriaDatePickerProps>,
  state: T,
  overlayState: DatePickerState,
  _calendarState?: C
): DatePickerAria {
  const locale = useLocale();
  const getProps = () => access(props);
  const id = createId(getProps().id);
  const descriptionId = createId();
  const errorMessageId = createId();
  const dialogId = createId();

  // Create label handling
  const { labelProps, fieldProps: labelFieldProps } = createLabel({
    get label() { return getProps().label; },
    get 'aria-label'() { return getProps()['aria-label']; },
    get 'aria-labelledby'() { return getProps()['aria-labelledby']; },
    labelElementType: 'span',
  });

  // Build aria-describedby
  const getAriaDescribedBy = () => {
    const p = getProps();
    const ids: string[] = [];
    if (p['aria-describedby']) {
      ids.push(p['aria-describedby']);
    }
    if (p.description) {
      ids.push(descriptionId);
    }
    if (p.isInvalid && p.errorMessage) {
      ids.push(errorMessageId);
    }
    return ids.length > 0 ? ids.join(' ') : undefined;
  };

  // Group props
  const groupProps = createMemo(() => {
    const p = getProps();

    return mergeProps(labelFieldProps as Record<string, unknown>, {
      id,
      role: 'group',
      'aria-disabled': p.isDisabled || state.isDisabled() || undefined,
      'aria-describedby': getAriaDescribedBy(),
    });
  });

  // Field props
  const fieldProps = createMemo(() => ({
    'aria-haspopup': 'dialog' as const,
    'aria-expanded': overlayState.isOpen,
    'aria-controls': overlayState.isOpen ? dialogId : undefined,
  }));

  // Button props
  const buttonProps = createMemo(() => {
    const p = getProps();
    const isDisabled = p.isDisabled || state.isDisabled();
    const defaults = getDatePickerLabelDefaults(locale().locale);

    return {
      'aria-label': p.buttonAriaLabel ?? defaults.button,
      'aria-haspopup': 'dialog' as const,
      'aria-expanded': overlayState.isOpen,
      'aria-controls': overlayState.isOpen ? dialogId : undefined,
      disabled: isDisabled,
      tabIndex: -1,
      onClick: () => {
        if (!isDisabled) {
          overlayState.toggle();
        }
      },
    };
  });

  // Dialog props
  const dialogProps = createMemo(() => {
    const defaults = getDatePickerLabelDefaults(locale().locale);
    return {
      id: dialogId,
      role: 'dialog',
      'aria-modal': true,
      'aria-label': getProps().dialogAriaLabel ?? defaults.dialog,
    };
  });

  // Calendar props
  const calendarProps = createMemo(() => {
    const defaults = getDatePickerLabelDefaults(locale().locale);
    return {
      'aria-label': getProps().calendarAriaLabel ?? getProps().dialogAriaLabel ?? defaults.calendar,
    };
  });

  // Description props
  const descriptionProps = createMemo(() => ({
    id: descriptionId,
  }));

  // Error message props
  const errorMessageProps = createMemo(() => ({
    id: errorMessageId,
    role: 'alert',
  }));

  return {
    get groupProps() {
      return groupProps();
    },
    get labelProps() {
      return labelProps as Record<string, unknown>;
    },
    get fieldProps() {
      return fieldProps();
    },
    get buttonProps() {
      return buttonProps();
    },
    get dialogProps() {
      return dialogProps();
    },
    get calendarProps() {
      return calendarProps();
    },
    get descriptionProps() {
      return descriptionProps();
    },
    get errorMessageProps() {
      return errorMessageProps();
    },
  };
}

function getDatePickerLabelDefaults(locale: string): {
  button: string;
  dialog: string;
  calendar: string;
} {
  const language = locale.toLowerCase().split('-')[0] ?? 'en';

  if (language === 'es') {
    return {
      button: 'Abrir calendario',
      dialog: 'Calendario',
      calendar: 'Calendario',
    };
  }

  return {
    button: 'Open calendar',
    dialog: 'Calendar',
    calendar: 'Calendar',
  };
}
