/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import { Meter } from '../src/meter';

describe('Meter (ui)', () => {
  it('renders with meter role and value attributes', () => {
    render(() => <Meter value={30} aria-label="Battery" />);
    const meter = screen.getByRole('meter', { name: 'Battery' });
    expect(meter).toHaveAttribute('aria-valuenow', '30');
    expect(meter).toHaveAttribute('aria-valuemin', '0');
    expect(meter).toHaveAttribute('aria-valuemax', '100');
  });

  it('handles equal min and max without NaN', () => {
    render(() => <Meter value={10} minValue={10} maxValue={10} aria-label="Fixed" />);
    const meter = screen.getByRole('meter', { name: 'Fixed' });
    expect(meter.getAttribute('aria-valuetext')).not.toContain('NaN');
  });
});
