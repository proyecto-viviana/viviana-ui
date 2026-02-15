/**
 * createDateRangePicker hook for Solidaria
 *
 * Provides behavior and accessibility wiring for range date pickers.
 * Compatibility target: @react-aria/datepicker useDateRangePicker.
 */

import { createMemo } from 'solid-js';
import { createId } from '../ssr';
import { createLabel } from '../label/createLabel';
import { access, type MaybeAccessor } from '../utils/reactivity';
import { mergeProps } from '../utils/mergeProps';
import { useLocale } from '../i18n';
import type { RangeCalendarState } from '@proyecto-viviana/solid-stately';
import type { DatePickerState } from './createDatePicker';

export interface AriaDateRangePickerProps {
  id?: string;
  label?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
  isInvalid?: boolean;
  description?: string;
  errorMessage?: string;
  buttonAriaLabel?: string;
  dialogAriaLabel?: string;
  calendarAriaLabel?: string;
}

export interface DateRangePickerAria {
  groupProps: Record<string, unknown>;
  labelProps: Record<string, unknown>;
  startFieldProps: Record<string, unknown>;
  endFieldProps: Record<string, unknown>;
  buttonProps: Record<string, unknown>;
  dialogProps: Record<string, unknown>;
  calendarProps: Record<string, unknown>;
  descriptionProps: Record<string, unknown>;
  errorMessageProps: Record<string, unknown>;
}

export function createDateRangePicker<T extends RangeCalendarState>(
  props: MaybeAccessor<AriaDateRangePickerProps>,
  state: T,
  overlayState: DatePickerState
): DateRangePickerAria {
  const locale = useLocale();
  const getProps = () => access(props);
  const id = createId(getProps().id);
  const startFieldId = createId();
  const endFieldId = createId();
  const descriptionId = createId();
  const errorMessageId = createId();
  const dialogId = createId();

  const { labelProps, fieldProps: labelFieldProps } = createLabel({
    get label() { return getProps().label; },
    get 'aria-label'() { return getProps()['aria-label']; },
    get 'aria-labelledby'() { return getProps()['aria-labelledby']; },
    labelElementType: 'span',
  });

  const getAriaDescribedBy = () => {
    const p = getProps();
    const ids: string[] = [];
    if (p['aria-describedby']) ids.push(p['aria-describedby']);
    if (p.description) ids.push(descriptionId);
    if (p.isInvalid && p.errorMessage) ids.push(errorMessageId);
    return ids.length > 0 ? ids.join(' ') : undefined;
  };

  const groupProps = createMemo(() => {
    const p = getProps();
    return mergeProps(labelFieldProps as Record<string, unknown>, {
      id,
      role: 'group',
      'aria-disabled': p.isDisabled || state.isDisabled() || undefined,
      'aria-describedby': getAriaDescribedBy(),
    });
  });

  const startFieldProps = createMemo(() => ({
    id: startFieldId,
    'aria-haspopup': 'dialog' as const,
    'aria-expanded': overlayState.isOpen,
    'aria-controls': overlayState.isOpen ? dialogId : undefined,
  }));

  const endFieldProps = createMemo(() => ({
    id: endFieldId,
    'aria-haspopup': 'dialog' as const,
    'aria-expanded': overlayState.isOpen,
    'aria-controls': overlayState.isOpen ? dialogId : undefined,
  }));

  const buttonProps = createMemo(() => {
    const p = getProps();
    const defaults = getDateRangePickerLabelDefaults(locale().locale);
    const isDisabled = p.isDisabled || state.isDisabled();
    return {
      'aria-label': p.buttonAriaLabel ?? defaults.button,
      'aria-haspopup': 'dialog' as const,
      'aria-expanded': overlayState.isOpen,
      'aria-controls': overlayState.isOpen ? dialogId : undefined,
      disabled: isDisabled,
      tabIndex: -1,
      onClick: () => {
        if (!isDisabled) overlayState.toggle();
      },
    };
  });

  const dialogProps = createMemo(() => {
    const defaults = getDateRangePickerLabelDefaults(locale().locale);
    return {
      id: dialogId,
      role: 'dialog',
      'aria-modal': true,
      'aria-label': getProps().dialogAriaLabel ?? defaults.dialog,
    };
  });

  const calendarProps = createMemo(() => {
    const defaults = getDateRangePickerLabelDefaults(locale().locale);
    return {
      'aria-label': getProps().calendarAriaLabel ?? getProps().dialogAriaLabel ?? defaults.calendar,
    };
  });

  const descriptionProps = createMemo(() => ({ id: descriptionId }));
  const errorMessageProps = createMemo(() => ({ id: errorMessageId, role: 'alert' }));

  return {
    get groupProps() {
      return groupProps();
    },
    get labelProps() {
      return labelProps as Record<string, unknown>;
    },
    get startFieldProps() {
      return startFieldProps();
    },
    get endFieldProps() {
      return endFieldProps();
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

function getDateRangePickerLabelDefaults(locale: string): {
  button: string;
  dialog: string;
  calendar: string;
} {
  const language = locale.toLowerCase().split('-')[0] ?? 'en';

  if (language === 'es') {
    return {
      button: 'Abrir calendario de rango',
      dialog: 'Calendario de rango',
      calendar: 'Calendario de rango',
    };
  }

  return {
    button: 'Open range calendar',
    dialog: 'Range calendar',
    calendar: 'Range calendar',
  };
}
