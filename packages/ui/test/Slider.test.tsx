/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import { Slider } from '../src/slider';

describe('Slider (ui)', () => {
  it('renders slider with value semantics', () => {
    render(() => <Slider label="Volume" value={40} minValue={0} maxValue={100} />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-valuenow', '40');
    expect(slider).toHaveAttribute('aria-valuemin', '0');
    expect(slider).toHaveAttribute('aria-valuemax', '100');
  });

  it('supports vertical orientation', () => {
    render(() => <Slider aria-label="Vertical slider" orientation="vertical" value={50} />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-orientation', 'vertical');
  });
});
