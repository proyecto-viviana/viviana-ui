/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@solidjs/testing-library';
import { DateRangePicker } from '../src/calendar/DateRangePicker';

async function waitForHydration() {
  await waitFor(() => {
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
}

describe('DateRangePicker (ui)', () => {
  describe('basic rendering', () => {
    it('renders start and end date display fields', async () => {
      const { container } = render(() => <DateRangePicker aria-label="Date range" />);
      await waitForHydration();
      expect(container.textContent).toContain('Start date');
      expect(container.textContent).toContain('End date');
    });

    it('renders range separator', async () => {
      const { container } = render(() => <DateRangePicker aria-label="Date range" />);
      await waitForHydration();
      expect(container.textContent).toContain('–');
    });

    it('renders calendar trigger button', async () => {
      render(() => <DateRangePicker aria-label="Date range" />);
      await waitForHydration();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('button contains calendar SVG icon', async () => {
      render(() => <DateRangePicker aria-label="Date range" />);
      await waitForHydration();
      const button = screen.getByRole('button');
      expect(button.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('label/description/error', () => {
    it('renders label', async () => {
      render(() => <DateRangePicker label="Trip dates" />);
      await waitForHydration();
      expect(screen.getByText('Trip dates')).toBeInTheDocument();
    });

    it('renders description', async () => {
      render(() => (
        <DateRangePicker
          aria-label="Date range"
          description="Select your travel dates"
        />
      ));
      await waitForHydration();
      expect(screen.getByText('Select your travel dates')).toBeInTheDocument();
    });

    it('renders error message when invalid', async () => {
      render(() => (
        <DateRangePicker
          aria-label="Date range"
          isInvalid
          errorMessage="End date must be after start date"
        />
      ));
      await waitForHydration();
      expect(screen.getByText('End date must be after start date')).toBeInTheDocument();
    });
  });

  describe('size variants', () => {
    it('applies sm size styles', async () => {
      const { container } = render(() => (
        <DateRangePicker aria-label="Date range" size="sm" />
      ));
      await waitForHydration();
      expect(container.firstElementChild!.className).toContain('text-sm');
    });

    it('applies md size by default', async () => {
      const { container } = render(() => (
        <DateRangePicker aria-label="Date range" />
      ));
      await waitForHydration();
      expect(container.firstElementChild!.className).toContain('text-base');
    });

    it('applies lg size styles', async () => {
      const { container } = render(() => (
        <DateRangePicker aria-label="Date range" size="lg" />
      ));
      await waitForHydration();
      expect(container.firstElementChild!.className).toContain('text-lg');
    });
  });

  describe('states', () => {
    it('renders disabled state', async () => {
      render(() => <DateRangePicker aria-label="Date range" isDisabled />);
      await waitForHydration();
      const button = screen.getByRole('button');
      expect(button.className).toContain('cursor-not-allowed');
    });
  });

  describe('accessibility', () => {
    it('has a group role container', async () => {
      const { container } = render(() => (
        <DateRangePicker aria-label="Date range" />
      ));
      await waitForHydration();
      expect(container.querySelector('[role="group"]')).toBeInTheDocument();
    });
  });
});
