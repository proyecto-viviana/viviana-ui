/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup, waitFor } from '@solidjs/testing-library';
import {
  DateRangePicker,
  DateRangePickerButton,
  DateRangePickerContent,
} from '../src/DatePicker';
import {
  RangeCalendar,
  RangeCalendarGrid,
  RangeCalendarCell,
} from '../src/RangeCalendar';

async function waitForHydration() {
  await waitFor(() => {
    const picker = document.querySelector('.solidaria-DateRangePicker:not(.solidaria-DateRangePicker--placeholder)');
    expect(picker).toBeInTheDocument();
  });
}

describe('DateRangePicker', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders and opens content via trigger button', async () => {
    render(() => (
      <DateRangePicker aria-label="Range">
        <DateRangePickerButton>Open</DateRangePickerButton>
        <DateRangePickerContent>
          <RangeCalendar>
            <RangeCalendarGrid>
              {(date) => <RangeCalendarCell date={date} />}
            </RangeCalendarGrid>
          </RangeCalendar>
        </DateRangePickerContent>
      </DateRangePicker>
    ));

    await waitForHydration();
    const trigger = document.querySelector('.solidaria-DateRangePickerButton') as HTMLElement;
    expect(trigger).toBeInTheDocument();

    trigger.click();

    await waitFor(() => {
      const content = document.querySelector('.solidaria-DateRangePickerContent');
      expect(content).toBeInTheDocument();
    });
  });
});
