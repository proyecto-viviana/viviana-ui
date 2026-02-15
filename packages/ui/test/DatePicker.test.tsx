import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@solidjs/testing-library';
import { DatePicker } from '../src/calendar/DatePicker';

async function waitForHydration() {
  await waitFor(() => {
    expect(screen.getAllByRole('spinbutton').length).toBeGreaterThan(0);
  });
}

describe('DatePicker (ui)', () => {
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
