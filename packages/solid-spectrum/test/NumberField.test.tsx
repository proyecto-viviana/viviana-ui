/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { render, screen, cleanup } from '@solidjs/testing-library';
import { NumberField } from '../src/numberfield';

describe('NumberField (solid-spectrum)', () => {
  it('renders spinbutton with label', () => {
    render(() => <NumberField label="Quantity" defaultValue={5} />);
    const spinbutton = screen.getByRole('spinbutton', { name: 'Quantity' });
    expect(spinbutton).toBeInTheDocument();
  });

  it('renders stepper controls and supports hiding them', () => {
    render(() => <NumberField label="Qty" defaultValue={1} />);
    expect(screen.getAllByRole('button')).toHaveLength(2);

    cleanup();
    render(() => <NumberField label="Qty" defaultValue={1} hideStepper />);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });
});
