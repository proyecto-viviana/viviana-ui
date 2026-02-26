/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import { setupUser } from '@proyecto-viviana/silapse-test-utils';
import { ColorSwatch } from '../src/color';

describe('ColorSwatch (silapse)', () => {
  it('renders non-interactive swatch by default', () => {
    render(() => <ColorSwatch color="#ff0000" aria-label="Red" />);
    expect(screen.getByRole('img', { name: 'Red' })).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders as semantic toggle button when selectable', async () => {
    const user = setupUser();
    const onClick = vi.fn();

    render(() => (
      <ColorSwatch
        color="#00ff00"
        aria-label="Green"
        isSelectable
        isSelected
        onClick={onClick}
      />
    ));

    const button = screen.getByRole('button', { name: 'Green' });
    expect(button).toHaveAttribute('aria-pressed', 'true');

    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
