/**
 * Tests for solidaria-components SharedElementTransition
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@solidjs/testing-library';
import { createSignal, type JSX } from 'solid-js';
import { SharedElement, SharedElementTransition } from '../src/SharedElementTransition';

describe('SharedElementTransition', () => {
  it('renders shared element inside transition scope', () => {
    render(() => (
      <SharedElementTransition>
        <SharedElement name="card">Card</SharedElement>
      </SharedElementTransition>
    ));

    expect(screen.getByText('Card')).toBeInTheDocument();
  });

  it('throws when SharedElement is outside scope', () => {
    expect(() =>
      render(() => <SharedElement name="card">Card</SharedElement>)
    ).toThrow('<SharedElement> must be rendered inside a <SharedElementTransition>');
  });

  it('does not render when hidden', () => {
    const { container } = render(() => (
      <SharedElementTransition>
        <SharedElement name="card" isVisible={false}>Card</SharedElement>
      </SharedElementTransition>
    ));

    expect(container).not.toHaveTextContent('Card');
  });

  it('sets entering state when becoming visible', async () => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      cb(0);
      return 1;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});

    function TestHarness(): JSX.Element {
      const [visible, setVisible] = createSignal(false);
      return (
        <>
          <button type="button" onClick={() => setVisible(true)}>
            Show
          </button>
          <SharedElementTransition>
            <SharedElement name="card" isVisible={visible()}>
              Card
            </SharedElement>
          </SharedElementTransition>
        </>
      );
    }

    render(() => <TestHarness />);
    fireEvent.click(screen.getByRole('button', { name: 'Show' }));
    expect(await screen.findByText('Card')).toBeInTheDocument();
  });
});
