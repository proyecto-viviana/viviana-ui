import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { PointerEventsCheckLevel } from '@testing-library/user-event';
import { Button } from '../src/button';

// Pointer map matching react-spectrum's test setup
const pointerMap = [
  { name: 'MouseLeft', pointerType: 'mouse', button: 'primary', height: 1, width: 1, pressure: 0.5 },
  { name: 'MouseRight', pointerType: 'mouse', button: 'secondary' },
  { name: 'MouseMiddle', pointerType: 'mouse', button: 'auxiliary' },
  { name: 'TouchA', pointerType: 'touch', height: 1, width: 1 },
  { name: 'TouchB', pointerType: 'touch' },
  { name: 'TouchC', pointerType: 'touch' },
];

function setupUser() {
  return userEvent.setup({
    delay: null,
    pointerMap: pointerMap as any,
    pointerEventsCheck: PointerEventsCheckLevel.Never,
  });
}

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

  it('supports autoFocus', () => {
    render(() => <Button autoFocus>Click Me</Button>);

    const button = screen.getByRole('button');
    expect(document.activeElement).toBe(button);
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
      render(() => <Button style="outline">Click Me</Button>);
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
});
