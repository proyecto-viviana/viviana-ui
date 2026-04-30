import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@solidjs/testing-library';
import { DateField } from '../src/calendar/DateField';

async function waitForHydration() {
  await waitFor(() => {
    expect(screen.getAllByRole('spinbutton').length).toBeGreaterThan(0);
  });
}

describe('DateField (solid-spectrum)', () => {
  it('wires visible label to field aria-labelledby', async () => {
    render(() => <DateField label="Birth date" />);
    await waitForHydration();

    const group = document.querySelector('[role="group"]') as HTMLElement;
    const label = screen.getByText('Birth date');

    expect(label.tagName).toBe('SPAN');
    expect(label).toHaveAttribute('id');
    expect(group).toHaveAttribute('aria-labelledby');
    expect(group.getAttribute('aria-labelledby')).toContain(label.getAttribute('id'));
  });

  it('wires error message to aria-describedby when invalid', async () => {
    render(() => (
      <DateField
        aria-label="Date"
        isInvalid
        errorMessage="Date is required"
      />
    ));
    await waitForHydration();

    const group = document.querySelector('[role="group"]') as HTMLElement;
    const error = screen.getByText('Date is required');

    expect(error.tagName).toBe('P');
    expect(error).toHaveAttribute('id');
    expect(group).toHaveAttribute('aria-describedby');
    expect(group.getAttribute('aria-describedby')).toContain(error.getAttribute('id'));
  });
});
