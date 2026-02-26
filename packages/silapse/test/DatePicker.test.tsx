import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@solidjs/testing-library';
import { DatePicker } from '../src/calendar/DatePicker';

async function waitForHydration() {
  await waitFor(() => {
    expect(screen.getAllByRole('spinbutton').length).toBeGreaterThan(0);
  });
}

describe('DatePicker (silapse)', () => {
  it('links visible label to picker group semantics', async () => {
    render(() => (
      <DatePicker
        label="Event date"
        description="Select an event day"
      />
    ));
    await waitForHydration();

    const group = screen.getByRole('group', { name: 'Event date' });
    const description = screen.getByText('Select an event day');
    const describedby = group.getAttribute('aria-describedby') ?? '';

    expect(group).toBeInTheDocument();
    expect(description.id).toBeTruthy();
    expect(describedby.split(' ')).toContain(description.id);
  });

  it('links error message when invalid', async () => {
    render(() => (
      <DatePicker
        label="Birth date"
        isInvalid
        errorMessage="Date is required"
      />
    ));
    await waitForHydration();

    const group = screen.getByRole('group', { name: 'Birth date' });
    const error = screen.getByText('Date is required');
    const describedby = group.getAttribute('aria-describedby') ?? '';

    expect(error.id).toBeTruthy();
    expect(describedby.split(' ')).toContain(error.id);
  });

  it('shows required indicator when isRequired is set', async () => {
    render(() => (
      <DatePicker
        label="Appointment"
        isRequired
      />
    ));
    await waitForHydration();

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('forwards custom button aria-label', async () => {
    render(() => (
      <DatePicker
        aria-label="Date picker"
        buttonAriaLabel="Choose date"
      />
    ));
    await waitForHydration();

    expect(screen.getByRole('button', { name: 'Choose date' })).toBeInTheDocument();
  });
});
