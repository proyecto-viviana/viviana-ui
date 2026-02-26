/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import { render, cleanup, waitFor, screen } from '@solidjs/testing-library';
import { setupUser } from '@proyecto-viviana/solidaria-test-utils';
import {
  DateRangePicker,
  DateRangePickerLabel,
  DateRangePickerDescription,
  DateRangePickerErrorMessage,
  DateRangePickerButton,
  DateRangePickerContent,
  useDateRangePickerContext,
} from '../src/DatePicker';
import {
  RangeCalendar,
  RangeCalendarGrid,
  RangeCalendarCell,
} from '../src/RangeCalendar';

let user: ReturnType<typeof setupUser>;

async function waitForHydration() {
  await waitFor(() => {
    const picker = document.querySelector(
      '.solidaria-DateRangePicker:not(.solidaria-DateRangePicker--placeholder)'
    );
    expect(picker).toBeInTheDocument();
  });
}

function DateRangeFields() {
  const context = useDateRangePickerContext();
  return (
    <div>
      <div data-testid="start-field" {...context.pickerAria.startFieldProps}>
        Start
      </div>
      <div data-testid="end-field" {...context.pickerAria.endFieldProps}>
        End
      </div>
    </div>
  );
}

function TestDateRangePicker(props: {
  pickerProps?: Partial<Parameters<typeof DateRangePicker>[0]>;
}) {
  return (
    <DateRangePicker aria-label="Range" {...props.pickerProps}>
      <DateRangePickerLabel>Trip dates</DateRangePickerLabel>
      <DateRangeFields />
      <DateRangePickerButton>Open</DateRangePickerButton>
      <DateRangePickerDescription>Choose a start and end date</DateRangePickerDescription>
      <DateRangePickerErrorMessage>Invalid range</DateRangePickerErrorMessage>
      <DateRangePickerContent>
        <RangeCalendar>
          <RangeCalendarGrid>
            {(date) => <RangeCalendarCell date={date} />}
          </RangeCalendarGrid>
        </RangeCalendar>
      </DateRangePickerContent>
    </DateRangePicker>
  );
}

describe('DateRangePicker', () => {
  beforeEach(() => {
    user = setupUser();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders and opens content via trigger button', async () => {
    render(() => <TestDateRangePicker />);

    await waitForHydration();
    const trigger = document.querySelector(
      '.solidaria-DateRangePickerButton'
    ) as HTMLElement;
    expect(trigger).toBeInTheDocument();

    await user.click(trigger);

    await waitFor(() => {
      const content = document.querySelector('.solidaria-DateRangePickerContent');
      expect(content).toBeInTheDocument();
    });
  });

  it('sets required and invalid data attributes from props', async () => {
    render(() => (
      <TestDateRangePicker
        pickerProps={{ isRequired: true, isInvalid: true }}
      />
    ));

    await waitForHydration();
    const picker = document.querySelector('.solidaria-DateRangePicker');
    expect(picker).toHaveAttribute('data-required');
    expect(picker).toHaveAttribute('data-invalid');
  });

  it('applies default localized labels to start/end fields', async () => {
    render(() => <TestDateRangePicker />);
    await waitForHydration();

    expect(screen.getByTestId('start-field')).toHaveAttribute('aria-label', 'Start date');
    expect(screen.getByTestId('end-field')).toHaveAttribute('aria-label', 'End date');
  });

  it('opens popup from start/end fields via keyboard', async () => {
    render(() => <TestDateRangePicker />);
    await waitForHydration();

    const start = screen.getByTestId('start-field');
    start.focus();
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(document.querySelector('.solidaria-DateRangePickerContent')).toBeInTheDocument();
    });
  });

  it('keeps trigger button keyboard-focusable', async () => {
    render(() => <TestDateRangePicker />);
    await waitForHydration();

    const button = document.querySelector('.solidaria-DateRangePickerButton');
    expect(button).toHaveAttribute('tabindex', '0');
  });
});
