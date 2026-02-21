import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import { Button } from '../src/button';
import { setupUser } from '@proyecto-viviana/ui-test-utils';

// setupUser is consolidated in ui-test-utils.

describe('Button', () => {
  let onPressSpy = vi.fn();
  let onPressStartSpy = vi.fn();
  let onPressEndSpy = vi.fn();
  let onPressUpSpy = vi.fn();
  let onPressChangeSpy = vi.fn();
  let user: ReturnType<typeof setupUser>;

  beforeEach(() => {
    user = setupUser();
  });

  afterEach(() => {
    onPressSpy.mockClear();
    onPressStartSpy.mockClear();
    onPressEndSpy.mockClear();
    onPressUpSpy.mockClear();
    onPressChangeSpy.mockClear();
  });

  it('handles defaults', async () => {
    render(() => <Button onPress={onPressSpy}>Click Me</Button>);

    const button = screen.getByRole('button');
    await user.click(button);
    expect(onPressSpy).toHaveBeenCalledTimes(1);

    const text = screen.getByText('Click Me');
    expect(text).not.toBeNull();
  });

  it('supports press events', async () => {
    render(() => (
      <Button
        onPress={onPressSpy}
        onPressStart={onPressStartSpy}
        onPressEnd={onPressEndSpy}
        onPressUp={onPressUpSpy}
        onPressChange={onPressChangeSpy}
      >
        Click Me
      </Button>
    ));

    const button = screen.getByRole('button');
    await user.click(button);

    expect(onPressStartSpy).toHaveBeenCalledTimes(1);
    expect(onPressSpy).toHaveBeenCalledTimes(1);
    expect(onPressEndSpy).toHaveBeenCalledTimes(1);
    expect(onPressUpSpy).toHaveBeenCalledTimes(1);
    expect(onPressChangeSpy).toHaveBeenCalledTimes(2);
  });

  it('keyboard press with Enter key', async () => {
    render(() => (
      <Button
        onPress={onPressSpy}
        onPressStart={onPressStartSpy}
        onPressEnd={onPressEndSpy}
        onPressUp={onPressUpSpy}
        onPressChange={onPressChangeSpy}
      >
        Click Me
      </Button>
    ));

    const button = screen.getByRole('button');
    await user.tab();
    expect(document.activeElement).toBe(button);

    await user.keyboard('{Enter}');
    expect(onPressStartSpy).toHaveBeenCalledTimes(1);
    expect(onPressSpy).toHaveBeenCalledTimes(1);
    expect(onPressEndSpy).toHaveBeenCalledTimes(1);
    expect(onPressUpSpy).toHaveBeenCalledTimes(1);
    expect(onPressChangeSpy).toHaveBeenCalledTimes(2);
  });

  it('keyboard press with Space key', async () => {
    render(() => (
      <Button
        onPress={onPressSpy}
        onPressStart={onPressStartSpy}
        onPressEnd={onPressEndSpy}
        onPressUp={onPressUpSpy}
        onPressChange={onPressChangeSpy}
      >
        Click Me
      </Button>
    ));

    const button = screen.getByRole('button');
    await user.tab();
    expect(document.activeElement).toBe(button);

    await user.keyboard('{ }');
    expect(onPressStartSpy).toHaveBeenCalledTimes(1);
    expect(onPressSpy).toHaveBeenCalledTimes(1);
    expect(onPressEndSpy).toHaveBeenCalledTimes(1);
    expect(onPressUpSpy).toHaveBeenCalledTimes(1);
    expect(onPressChangeSpy).toHaveBeenCalledTimes(2);
  });

  // autoFocus works via onMount + focusSafely() which calls element.focus()
  // We verify autoFocus works by spying on the focus method
  it('supports autoFocus', () => {
    // Create a spy on HTMLElement.prototype.focus before rendering
    const focusSpy = vi.spyOn(HTMLElement.prototype, 'focus');

    render(() => <Button autoFocus>Click Me</Button>);

    const button = screen.getByRole('button');
    // Verify focus was called on the button element
    expect(focusSpy).toHaveBeenCalled();
    expect(focusSpy.mock.calls.some(call => call[0]?.preventScroll === true || focusSpy.mock.instances.includes(button))).toBe(true);

    focusSpy.mockRestore();
  });

  it('handles touch press', async () => {
    render(() => <Button onPress={onPressSpy}>Touch Me</Button>);

    const button = screen.getByRole('button');
    await user.pointer([
      { keys: '[TouchA>]', target: button },
      { keys: '[/TouchA]', target: button },
    ]);

    expect(onPressSpy).toHaveBeenCalledTimes(1);
  });

  it('allows custom props to be passed through to the button', () => {
    render(() => <Button data-foo="bar">Click Me</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-foo', 'bar');
  });

  it('supports aria-label', () => {
    render(() => <Button aria-label="Test" />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Test');
  });

  it('supports aria-labelledby', () => {
    render(() => (
      <>
        <span id="test">Test</span>
        <Button aria-labelledby="test" />
      </>
    ));

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-labelledby', 'test');
  });

  it('supports aria-describedby', () => {
    render(() => (
      <>
        <span id="test">Test</span>
        <Button aria-describedby="test">Hi</Button>
      </>
    ));

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-describedby', 'test');
  });

  it('does not respond when disabled', async () => {
    render(() => (
      <Button onPress={onPressSpy} isDisabled>
        Click Me
      </Button>
    ));

    const button = screen.getByRole('button');
    await user.click(button);
    expect(button).toBeDisabled();
    expect(onPressSpy).not.toHaveBeenCalled();
  });

  describe('variants', () => {
    it('renders with primary variant by default', () => {
      render(() => <Button>Click Me</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-variant', 'primary');
    });

    it('renders with secondary variant', () => {
      render(() => <Button variant="secondary">Click Me</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-variant', 'secondary');
    });

    it('renders with danger variant', () => {
      render(() => <Button variant="danger">Click Me</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-variant', 'danger');
    });

    it('renders with success variant', () => {
      render(() => <Button variant="success">Click Me</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-variant', 'success');
    });

    it('renders with ghost variant', () => {
      render(() => <Button variant="ghost">Click Me</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-variant', 'ghost');
    });

    it('renders with link variant', () => {
      render(() => <Button variant="link">Click Me</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-variant', 'link');
    });
  });

  describe('styles', () => {
    it('renders with fill style by default', () => {
      render(() => <Button>Click Me</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-style', 'fill');
    });

    it('renders with outline style', () => {
      render(() => <Button buttonStyle="outline">Click Me</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-style', 'outline');
    });
  });

  describe('static colors', () => {
    it('renders with white static color', () => {
      render(() => <Button staticColor="white">Click Me</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-static-color', 'white');
    });

    it('renders with black static color', () => {
      render(() => <Button staticColor="black">Click Me</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-static-color', 'black');
    });
  });

  describe('button type', () => {
    it('defaults to type="button"', () => {
      render(() => <Button>Click Me</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('supports type="submit"', () => {
      render(() => <Button type="submit">Submit</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('supports type="reset"', () => {
      render(() => <Button type="reset">Reset</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'reset');
    });
  });

  describe('excludeFromTabOrder', () => {
    it('removes button from tab order when excludeFromTabOrder is true', () => {
      render(() => <Button excludeFromTabOrder>Click Me</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('tabindex', '-1');
    });
  });

  describe('pending', () => {
    it('sets data-pending when isPending is true', () => {
      render(() => <Button isPending>Loading</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-pending');
    });

    it('does not call onPress while pending', async () => {
      render(() => <Button isPending onPress={onPressSpy}>Loading</Button>);
      const button = screen.getByRole('button');

      await user.click(button);
      expect(onPressSpy).not.toHaveBeenCalled();
    });
  });
});
