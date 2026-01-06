/**
 * DatePicker tests - Port of React Aria's DatePicker.test.tsx
 *
 * Tests for DatePicker component functionality including:
 * - Rendering
 * - Opening/closing calendar
 * - Date selection
 * - Validation
 * - Disabled/readonly states
 * - ARIA attributes
 */

import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, cleanup, fireEvent, waitFor } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { DatePicker, DatePickerButton, DatePickerContent } from '../src/DatePicker';
import { DateInput, DateSegment } from '../src/DateField';
import { Calendar, CalendarGrid, CalendarCell, CalendarButton, CalendarHeading } from '../src/Calendar';
import { CalendarDate } from '@internationalized/date';

// User event instance - created per test
let user: ReturnType<typeof userEvent.setup>;

// Helper to wait for DatePicker to hydrate (it uses client-only rendering)
async function waitForDatePickerHydration() {
  await waitFor(() => {
    const picker = document.querySelector('.solidaria-DatePicker:not(.solidaria-DatePicker--placeholder)');
    expect(picker).toBeInTheDocument();
  });
}

// Helper component for testing DatePicker
function TestDatePicker(props: {
  pickerProps?: Partial<Parameters<typeof DatePicker>[0]>;
}) {
  return (
    <DatePicker aria-label="Test Date Picker" {...props.pickerProps}>
      <DateInput>
        {(segment) => <DateSegment segment={segment} />}
      </DateInput>
      <DatePickerButton>📅</DatePickerButton>
      <DatePickerContent>
        <Calendar>
          <header>
            <CalendarButton slot="previous">◀</CalendarButton>
            <CalendarHeading />
            <CalendarButton slot="next">▶</CalendarButton>
          </header>
          <CalendarGrid>
            {(date) => <CalendarCell date={date} />}
          </CalendarGrid>
        </Calendar>
      </DatePickerContent>
    </DatePicker>
  );
}

describe('DatePicker', () => {
  beforeEach(() => {
    user = userEvent.setup();
  });

  afterEach(() => {
    cleanup();
  });

  // ============================================
  // RENDERING
  // ============================================

  describe('rendering', () => {
    it('should render with default class', async () => {
      render(() => <TestDatePicker />);
      await waitForDatePickerHydration();

      const picker = document.querySelector('.solidaria-DatePicker');
      expect(picker).toBeInTheDocument();
    });

    it('should render date segments', async () => {
      render(() => <TestDatePicker />);
      await waitForDatePickerHydration();

      const segments = screen.getAllByRole('spinbutton');
      expect(segments.length).toBe(3); // month, day, year
    });

    it('should render DateInput with presentation role', async () => {
      render(() => <TestDatePicker />);
      await waitForDatePickerHydration();

      const input = document.querySelector('.solidaria-DateInput');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('role', 'presentation');
    });

    it('should render picker button', async () => {
      render(() => <TestDatePicker />);
      await waitForDatePickerHydration();

      const button = document.querySelector('.solidaria-DatePickerButton');
      expect(button).toBeInTheDocument();
    });

    it('should render with custom class', async () => {
      render(() => <TestDatePicker pickerProps={{ class: 'my-date-picker' }} />);

      // Custom class replaces default, so wait for the custom class
      await waitFor(() => {
        const picker = document.querySelector('.my-date-picker');
        expect(picker).toBeInTheDocument();
      });
    });

    it('should not render calendar content by default', async () => {
      render(() => <TestDatePicker />);
      await waitForDatePickerHydration();

      const content = document.querySelector('.solidaria-DatePickerContent');
      expect(content).not.toBeInTheDocument();
    });
  });

  // ============================================
  // OPENING/CLOSING CALENDAR
  // ============================================

  describe('opening/closing calendar', () => {
    it('should open calendar on button click', async () => {
      render(() => <TestDatePicker />);
      await waitForDatePickerHydration();

      const button = document.querySelector('.solidaria-DatePickerButton') as HTMLElement;
      await user.click(button);

      await waitFor(() => {
        const content = document.querySelector('.solidaria-DatePickerContent');
        expect(content).toBeInTheDocument();
      });
    });

    it('should set data-open attribute when open', async () => {
      render(() => <TestDatePicker />);
      await waitForDatePickerHydration();

      const button = document.querySelector('.solidaria-DatePickerButton') as HTMLElement;
      await user.click(button);

      await waitFor(() => {
        const picker = document.querySelector('.solidaria-DatePicker');
        expect(picker).toHaveAttribute('data-open');
      });
    });

    it('should show calendar grid when open', async () => {
      render(() => <TestDatePicker />);
      await waitForDatePickerHydration();

      const button = document.querySelector('.solidaria-DatePickerButton') as HTMLElement;
      await user.click(button);

      await waitFor(() => {
        const grid = document.querySelector('[role="grid"]');
        expect(grid).toBeInTheDocument();
      });
    });
  });

  // ============================================
  // DATE SELECTION
  // ============================================

  describe('date selection', () => {
    it('should have interactive calendar cells when opened', async () => {
      // Note: Full date selection involves complex pointer events that
      // don't work reliably in jsdom. This test verifies the calendar
      // renders with interactive cells.
      render(() => (
        <TestDatePicker
          pickerProps={{
            defaultValue: new CalendarDate(2024, 6, 15),
          }}
        />
      ));
      await waitForDatePickerHydration();

      // Open calendar
      const button = document.querySelector('.solidaria-DatePickerButton') as HTMLElement;
      await user.click(button);

      await waitFor(() => {
        const grid = document.querySelector('[role="grid"]');
        expect(grid).toBeInTheDocument();
      });

      // Verify calendar cells are rendered
      const cells = document.querySelectorAll('.solidaria-CalendarCell');
      expect(cells.length).toBeGreaterThan(0);

      // Each cell should have gridcell role
      const gridcells = document.querySelectorAll('[role="gridcell"]');
      expect(gridcells.length).toBeGreaterThan(0);
    });

    it('should display value when provided', async () => {
      render(() => (
        <TestDatePicker
          pickerProps={{ value: new CalendarDate(2024, 6, 15) }}
        />
      ));
      await waitForDatePickerHydration();

      const segments = screen.getAllByRole('spinbutton');
      const segmentTexts = segments.map(s => s.textContent);

      expect(segmentTexts.join(' ')).toContain('15');
      expect(segmentTexts.join(' ')).toContain('2024');
    });

    it('should display defaultValue', async () => {
      render(() => (
        <TestDatePicker
          pickerProps={{ defaultValue: new CalendarDate(2024, 3, 20) }}
        />
      ));
      await waitForDatePickerHydration();

      const segments = screen.getAllByRole('spinbutton');
      const segmentTexts = segments.map(s => s.textContent);

      expect(segmentTexts.join(' ')).toContain('20');
      expect(segmentTexts.join(' ')).toContain('2024');
    });
  });

  // ============================================
  // VALIDATION
  // ============================================

  describe('validation', () => {
    it('should support isInvalid state', async () => {
      render(() => (
        <TestDatePicker
          pickerProps={{
            value: new CalendarDate(2024, 6, 15),
            validationState: 'invalid',
          }}
        />
      ));
      await waitForDatePickerHydration();

      const picker = document.querySelector('.solidaria-DatePicker');
      expect(picker).toHaveAttribute('data-invalid');
    });

    it('should mark picker as invalid when value is below minValue', async () => {
      render(() => (
        <TestDatePicker
          pickerProps={{
            value: new CalendarDate(2024, 6, 5),
            minValue: new CalendarDate(2024, 6, 10),
          }}
        />
      ));
      await waitForDatePickerHydration();

      const picker = document.querySelector('.solidaria-DatePicker');
      expect(picker).toHaveAttribute('data-invalid');
    });
  });

  // ============================================
  // DISABLED STATE
  // ============================================

  describe('disabled state', () => {
    it('should support isDisabled on DatePicker', async () => {
      render(() => <TestDatePicker pickerProps={{ isDisabled: true }} />);
      await waitForDatePickerHydration();

      const picker = document.querySelector('.solidaria-DatePicker');
      expect(picker).toHaveAttribute('data-disabled');
    });

    it('should disable button when picker is disabled', async () => {
      render(() => <TestDatePicker pickerProps={{ isDisabled: true }} />);
      await waitForDatePickerHydration();

      const button = document.querySelector('.solidaria-DatePickerButton');
      expect(button).toBeDisabled();
    });

    it('should not open calendar when disabled', async () => {
      render(() => <TestDatePicker pickerProps={{ isDisabled: true }} />);
      await waitForDatePickerHydration();

      const button = document.querySelector('.solidaria-DatePickerButton') as HTMLElement;
      await user.click(button);

      // Calendar should not open
      const content = document.querySelector('.solidaria-DatePickerContent');
      expect(content).not.toBeInTheDocument();
    });
  });

  // ============================================
  // READ ONLY STATE
  // ============================================

  describe('read only state', () => {
    it('should support isReadOnly on DatePicker', async () => {
      render(() => <TestDatePicker pickerProps={{ isReadOnly: true }} />);
      await waitForDatePickerHydration();

      const picker = document.querySelector('.solidaria-DatePicker');
      expect(picker).toHaveAttribute('data-readonly');
    });
  });

  // ============================================
  // REQUIRED STATE
  // ============================================

  describe('required state', () => {
    it('should support isRequired on DatePicker', async () => {
      render(() => <TestDatePicker pickerProps={{ isRequired: true }} />);
      await waitForDatePickerHydration();

      const picker = document.querySelector('.solidaria-DatePicker');
      expect(picker).toHaveAttribute('data-required');
    });
  });

  // ============================================
  // ARIA ATTRIBUTES
  // ============================================

  describe('aria attributes', () => {
    it('should have spinbutton role on editable segments', async () => {
      render(() => <TestDatePicker />);
      await waitForDatePickerHydration();

      const spinbuttons = screen.getAllByRole('spinbutton');
      expect(spinbuttons.length).toBe(3);
    });

    it('should have aria-label on picker', async () => {
      render(() => <TestDatePicker />);
      await waitForDatePickerHydration();

      const picker = document.querySelector('.solidaria-DatePicker');
      expect(picker).toHaveAttribute('aria-label', 'Test Date Picker');
    });
  });
});
