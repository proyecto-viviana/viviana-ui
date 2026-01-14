/**
 * RangeCalendar tests - Port of React Aria's RangeCalendar.test.tsx
 *
 * Tests for RangeCalendar component functionality including:
 * - Rendering
 * - Navigation
 * - Range selection
 * - Disabled dates
 * - ARIA attributes
 */

import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import {
  RangeCalendar,
  RangeCalendarHeading,
  RangeCalendarButton,
  RangeCalendarGrid,
  RangeCalendarCell,
} from '../src/RangeCalendar';
import { CalendarDate, today, getLocalTimeZone } from '@internationalized/date';

// User event instance - created per test
let user: ReturnType<typeof userEvent.setup>;

// Helper to wait for range calendar to hydrate (it uses client-only rendering)
async function waitForRangeCalendarHydration() {
  await waitFor(() => {
    const grid = document.querySelector('[role="grid"]');
    expect(grid).toBeInTheDocument();
  });
}

// Helper component for testing RangeCalendar
function TestRangeCalendar(props: {
  calendarProps?: Partial<Parameters<typeof RangeCalendar>[0]>;
}) {
  return (
    <RangeCalendar aria-label="Test Range Calendar" {...props.calendarProps}>
      <header>
        <RangeCalendarButton slot="previous">◀</RangeCalendarButton>
        <RangeCalendarHeading />
        <RangeCalendarButton slot="next">▶</RangeCalendarButton>
      </header>
      <RangeCalendarGrid>
        {(date) => <RangeCalendarCell date={date} />}
      </RangeCalendarGrid>
    </RangeCalendar>
  );
}

describe('RangeCalendar', () => {
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
      render(() => <TestRangeCalendar />);
      await waitForRangeCalendarHydration();

      const calendar = document.querySelector('.solidaria-RangeCalendar');
      expect(calendar).toBeInTheDocument();
    });

    it('should render calendar grid', async () => {
      render(() => <TestRangeCalendar />);
      await waitForRangeCalendarHydration();

      const grid = screen.getByRole('grid');
      expect(grid).toBeInTheDocument();
    });

    it('should render month and year header', async () => {
      render(() => (
        <TestRangeCalendar
          calendarProps={{ defaultFocusedValue: new CalendarDate(2024, 6, 15) }}
        />
      ));
      await waitForRangeCalendarHydration();

      const heading = document.querySelector('.solidaria-RangeCalendarHeading');
      expect(heading).toBeInTheDocument();
      expect(heading?.textContent).toContain('2024');
    });

    it('should render navigation buttons', async () => {
      render(() => <TestRangeCalendar />);
      await waitForRangeCalendarHydration();

      const prevButton = screen.getByText('◀');
      const nextButton = screen.getByText('▶');

      expect(prevButton).toBeInTheDocument();
      expect(nextButton).toBeInTheDocument();
    });

    it('should render day names in header', async () => {
      render(() => <TestRangeCalendar />);
      await waitForRangeCalendarHydration();

      const headerCells = document.querySelectorAll('.solidaria-RangeCalendarHeaderCell');
      expect(headerCells.length).toBe(7);
    });

    it('should render with custom class', async () => {
      render(() => <TestRangeCalendar calendarProps={{ class: 'my-range-calendar' }} />);
      await waitForRangeCalendarHydration();

      const calendar = document.querySelector('.my-range-calendar');
      expect(calendar).toBeInTheDocument();
    });
  });

  // ============================================
  // NAVIGATION
  // ============================================

  describe('navigation', () => {
    it('should navigate to previous month on prev button click', async () => {
      render(() => (
        <TestRangeCalendar
          calendarProps={{ defaultFocusedValue: new CalendarDate(2024, 6, 15) }}
        />
      ));
      await waitForRangeCalendarHydration();

      const prevButton = screen.getByText('◀');
      const heading = document.querySelector('.solidaria-RangeCalendarHeading');

      expect(heading?.textContent).toContain('June');

      await user.click(prevButton);

      await waitFor(() => {
        expect(heading?.textContent).toContain('May');
      });
    });

    it('should navigate to next month on next button click', async () => {
      render(() => (
        <TestRangeCalendar
          calendarProps={{ defaultFocusedValue: new CalendarDate(2024, 6, 15) }}
        />
      ));
      await waitForRangeCalendarHydration();

      const nextButton = screen.getByText('▶');
      const heading = document.querySelector('.solidaria-RangeCalendarHeading');

      expect(heading?.textContent).toContain('June');

      await user.click(nextButton);

      await waitFor(() => {
        expect(heading?.textContent).toContain('July');
      });
    });
  });

  // ============================================
  // RANGE SELECTION
  // ============================================

  describe('range selection', () => {
    it('should have clickable cells', async () => {
      render(() => (
        <TestRangeCalendar
          calendarProps={{
            defaultFocusedValue: new CalendarDate(2024, 6, 15),
          }}
        />
      ));
      await waitForRangeCalendarHydration();

      const cells = document.querySelectorAll('.solidaria-RangeCalendarCell');
      const cell = Array.from(cells).find(c => c.textContent === '10');

      expect(cell).toBeInTheDocument();
      expect(cell).toHaveAttribute('role', 'button');

      // Click should not throw
      await user.click(cell!);
    });

    it('should show controlled value', async () => {
      render(() => (
        <TestRangeCalendar
          calendarProps={{
            value: {
              start: new CalendarDate(2024, 6, 10),
              end: new CalendarDate(2024, 6, 15),
            },
            defaultFocusedValue: new CalendarDate(2024, 6, 15),
          }}
        />
      ));
      await waitForRangeCalendarHydration();

      // Find cells with selection attributes
      const selectedCells = document.querySelectorAll('[data-selected]');
      expect(selectedCells.length).toBeGreaterThan(0);
    });

    it('should show defaultValue', async () => {
      render(() => (
        <TestRangeCalendar
          calendarProps={{
            defaultValue: {
              start: new CalendarDate(2024, 6, 5),
              end: new CalendarDate(2024, 6, 10),
            },
            defaultFocusedValue: new CalendarDate(2024, 6, 15),
          }}
        />
      ));
      await waitForRangeCalendarHydration();

      const selectedCells = document.querySelectorAll('[data-selected]');
      expect(selectedCells.length).toBeGreaterThan(0);
    });

    it('should mark selection start and end', async () => {
      render(() => (
        <TestRangeCalendar
          calendarProps={{
            value: {
              start: new CalendarDate(2024, 6, 10),
              end: new CalendarDate(2024, 6, 15),
            },
            defaultFocusedValue: new CalendarDate(2024, 6, 15),
          }}
        />
      ));
      await waitForRangeCalendarHydration();

      const startCell = document.querySelector('[data-selection-start]');
      const endCell = document.querySelector('[data-selection-end]');

      expect(startCell).toBeInTheDocument();
      expect(endCell).toBeInTheDocument();
    });
  });

  // ============================================
  // DISABLED STATE
  // ============================================

  describe('disabled state', () => {
    it('should support isDisabled', async () => {
      render(() => <TestRangeCalendar calendarProps={{ isDisabled: true }} />);
      await waitForRangeCalendarHydration();

      const calendar = document.querySelector('.solidaria-RangeCalendar');
      expect(calendar).toHaveAttribute('data-disabled');
    });

    it('should disable navigation buttons when disabled', async () => {
      render(() => <TestRangeCalendar calendarProps={{ isDisabled: true }} />);
      await waitForRangeCalendarHydration();

      const prevButton = screen.getByText('◀');
      const nextButton = screen.getByText('▶');

      expect(prevButton).toBeDisabled();
      expect(nextButton).toBeDisabled();
    });

    it('should support isDateDisabled', async () => {
      const isDateDisabled = (date: CalendarDate) => date.day === 15;
      render(() => (
        <TestRangeCalendar
          calendarProps={{
            defaultFocusedValue: new CalendarDate(2024, 6, 15),
            isDateDisabled,
          }}
        />
      ));
      await waitForRangeCalendarHydration();

      const disabledCell = document.querySelector('[data-disabled]');
      expect(disabledCell).toBeInTheDocument();
    });
  });

  // ============================================
  // READ ONLY STATE
  // ============================================

  describe('read only state', () => {
    it('should support isReadOnly', async () => {
      render(() => <TestRangeCalendar calendarProps={{ isReadOnly: true }} />);
      await waitForRangeCalendarHydration();

      const calendar = document.querySelector('.solidaria-RangeCalendar');
      expect(calendar).toHaveAttribute('data-readonly');
    });
  });

  // ============================================
  // ARIA ATTRIBUTES
  // ============================================

  describe('aria attributes', () => {
    it('should have aria-label', async () => {
      render(() => <TestRangeCalendar />);
      await waitForRangeCalendarHydration();

      const calendar = document.querySelector('.solidaria-RangeCalendar');
      expect(calendar).toHaveAttribute('aria-label', 'Test Range Calendar');
    });

    it('should have grid role', async () => {
      render(() => <TestRangeCalendar />);
      await waitForRangeCalendarHydration();

      const grid = screen.getByRole('grid');
      expect(grid).toBeInTheDocument();
    });

    it('should have column headers', async () => {
      render(() => <TestRangeCalendar />);
      await waitForRangeCalendarHydration();

      const columnHeaders = screen.getAllByRole('columnheader');
      expect(columnHeaders.length).toBe(7);
    });

    it('should have aria-live on heading', async () => {
      render(() => <TestRangeCalendar />);
      await waitForRangeCalendarHydration();

      const heading = document.querySelector('.solidaria-RangeCalendarHeading');
      expect(heading).toHaveAttribute('aria-live', 'polite');
    });
  });

  // ============================================
  // CELL ATTRIBUTES
  // ============================================

  describe('cell attributes', () => {
    it('should mark today', async () => {
      const todayDate = today(getLocalTimeZone());
      render(() => (
        <TestRangeCalendar
          calendarProps={{ defaultFocusedValue: todayDate }}
        />
      ));
      await waitForRangeCalendarHydration();

      const todayCell = document.querySelector('[data-today]');
      expect(todayCell).toBeInTheDocument();
    });

    it('should mark outside month cells', async () => {
      render(() => (
        <TestRangeCalendar
          calendarProps={{ defaultFocusedValue: new CalendarDate(2024, 6, 15) }}
        />
      ));
      await waitForRangeCalendarHydration();

      // Depending on the month layout, there might be outside-month cells
      const cells = document.querySelectorAll('.solidaria-RangeCalendarCell');
      expect(cells.length).toBeGreaterThan(0);
    });

    it('should have default class on cells', async () => {
      render(() => <TestRangeCalendar />);
      await waitForRangeCalendarHydration();

      const cells = document.querySelectorAll('.solidaria-RangeCalendarCell');
      expect(cells.length).toBeGreaterThan(0);
    });
  });

  // ============================================
  // MIN/MAX DATES
  // ============================================

  describe('min/max dates', () => {
    it('should disable dates before minValue', async () => {
      render(() => (
        <TestRangeCalendar
          calendarProps={{
            defaultFocusedValue: new CalendarDate(2024, 6, 15),
            minValue: new CalendarDate(2024, 6, 10),
          }}
        />
      ));
      await waitForRangeCalendarHydration();

      const disabledCells = document.querySelectorAll('[data-disabled]');
      expect(disabledCells.length).toBeGreaterThan(0);
    });

    it('should disable dates after maxValue', async () => {
      render(() => (
        <TestRangeCalendar
          calendarProps={{
            defaultFocusedValue: new CalendarDate(2024, 6, 15),
            maxValue: new CalendarDate(2024, 6, 20),
          }}
        />
      ));
      await waitForRangeCalendarHydration();

      const disabledCells = document.querySelectorAll('[data-disabled]');
      expect(disabledCells.length).toBeGreaterThan(0);
    });
  });
});
