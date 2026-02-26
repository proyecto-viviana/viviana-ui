import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@solidjs/testing-library';
import { createDatePicker } from '../src/datepicker/createDatePicker';
import { I18nProvider } from '../src/i18n';

function createMockFieldState(overrides: Partial<{
  isDisabled: () => boolean;
  isReadOnly: () => boolean;
  isRequired: () => boolean;
  isInvalid: () => boolean;
}> = {}) {
  return {
    isDisabled: () => false,
    isReadOnly: () => false,
    isRequired: () => false,
    isInvalid: () => false,
    ...overrides,
  };
}

function createMockOverlayState() {
  return {
    isOpen: false,
    open: () => {},
    close: () => {},
    toggle: () => {},
  };
}

function TestDatePickerAria(props: {
  'aria-label'?: string;
  isRequired?: boolean;
  isInvalid?: boolean;
  buttonAriaLabel?: string;
  dialogAriaLabel?: string;
  calendarAriaLabel?: string;
  stateIsRequired?: boolean;
  stateIsInvalid?: boolean;
}) {
  const aria = createDatePicker(
    () => props,
    createMockFieldState({
      isRequired: () => props.stateIsRequired ?? false,
      isInvalid: () => props.stateIsInvalid ?? false,
    }) as any,
    createMockOverlayState()
  );

  return (
    <>
      <div data-testid="group" {...aria.groupProps} />
      <div data-testid="field" {...aria.fieldProps} />
      <button data-testid="button" {...aria.buttonProps} />
      <div data-testid="dialog" {...aria.dialogProps} />
      <div data-testid="calendar" {...aria.calendarProps} />
    </>
  );
}

describe('createDatePicker', () => {
  afterEach(() => {
    cleanup();
  });

  it('supports custom aria labels for button, dialog, and calendar', () => {
    render(() => (
      <TestDatePickerAria
        aria-label="Date"
        buttonAriaLabel="Choose date"
        dialogAriaLabel="Date chooser"
        calendarAriaLabel="Month grid"
      />
    ));

    expect(screen.getByTestId('button')).toHaveAttribute('aria-label', 'Choose date');
    expect(screen.getByTestId('dialog')).toHaveAttribute('aria-label', 'Date chooser');
    expect(screen.getByTestId('calendar')).toHaveAttribute('aria-label', 'Month grid');
  });

  it('falls back to dialog label for calendar when calendar label is not provided', () => {
    render(() => (
      <TestDatePickerAria aria-label="Date" dialogAriaLabel="Picker dialog" />
    ));

    expect(screen.getByTestId('dialog')).toHaveAttribute('aria-label', 'Picker dialog');
    expect(screen.getByTestId('calendar')).toHaveAttribute('aria-label', 'Picker dialog');
  });

  it('uses localized default labels for spanish locale', () => {
    render(() => (
      <I18nProvider locale="es-ES">
        <TestDatePickerAria aria-label="Fecha" />
      </I18nProvider>
    ));

    expect(screen.getByTestId('button')).toHaveAttribute('aria-label', 'Abrir calendario');
    expect(screen.getByTestId('dialog')).toHaveAttribute('aria-label', 'Calendario');
    expect(screen.getByTestId('calendar')).toHaveAttribute('aria-label', 'Calendario');
  });

  it('applies aria-required and aria-invalid on group from props/state', () => {
    render(() => (
      <TestDatePickerAria
        aria-label="Date"
        isRequired
        stateIsInvalid
      />
    ));

    const group = screen.getByTestId('group');
    expect(group).toHaveAttribute('aria-required', 'true');
    expect(group).toHaveAttribute('aria-invalid', 'true');
  });
});
