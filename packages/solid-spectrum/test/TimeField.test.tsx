import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@solidjs/testing-library';
import { TimeField } from '../src/calendar/TimeField';

async function waitForHydration() {
  await waitFor(() => {
    expect(screen.getAllByRole('spinbutton').length).toBeGreaterThan(0);
  });
}

describe('TimeField (solid-spectrum)', () => {
  it('wires visible label to field aria-labelledby', async () => {
    render(() => <TimeField label="Meeting time" />);
    await waitForHydration();

    const group = document.querySelector('[role="group"]') as HTMLElement;
    const label = screen.getByText('Meeting time');

    expect(label.tagName).toBe('SPAN');
    expect(label).toHaveAttribute('id');
    expect(group).toHaveAttribute('aria-labelledby');
    expect(group.getAttribute('aria-labelledby')).toContain(label.getAttribute('id'));
  });

  it('wires description to aria-describedby when valid', async () => {
    render(() => (
      <TimeField
        aria-label="Time"
        description="Choose a start time"
      />
    ));
    await waitForHydration();

    const group = document.querySelector('[role="group"]') as HTMLElement;
    const description = screen.getByText('Choose a start time');

    expect(description.tagName).toBe('P');
    expect(description).toHaveAttribute('id');
    expect(group).toHaveAttribute('aria-describedby');
    expect(group.getAttribute('aria-describedby')).toContain(description.getAttribute('id'));
  });

  it('wires error message to aria-describedby when invalid', async () => {
    render(() => (
      <TimeField
        aria-label="Time"
        isInvalid
        errorMessage="Time is required"
      />
    ));
    await waitForHydration();

    const group = document.querySelector('[role="group"]') as HTMLElement;
    const error = screen.getByText('Time is required');

    expect(error.tagName).toBe('P');
    expect(error).toHaveAttribute('id');
    expect(group).toHaveAttribute('aria-describedby');
    expect(group.getAttribute('aria-describedby')).toContain(error.getAttribute('id'));
  });
});
