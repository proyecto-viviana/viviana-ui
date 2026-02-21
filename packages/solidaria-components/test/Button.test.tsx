/**
 * Tests for solidaria-components Button
 *
 * These tests verify the headless Button component follows
 * react-aria-components patterns:
 * - Render props for state-based children/class/style
 * - Data attributes for styling hooks
 * - Context for slot composition
 * - Full accessibility
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@solidjs/testing-library';
import { Button, type ButtonRenderProps } from '../src/Button';
import { setupUser, firePointerDown, firePointerUp } from '@proyecto-viviana/solidaria-test-utils';

// setupUser and pointer helpers are consolidated in solidaria-test-utils.

describe('Button', () => {
  let user: ReturnType<typeof setupUser>;

  beforeEach(() => {
    user = setupUser();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('rendering', () => {
    it('should render a button with default class', () => {
      render(() => <Button>Test</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('solidaria-Button');
    });

    it('should render a button with custom class', () => {
      render(() => <Button class="custom-class">Test</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    it('should support DOM props', () => {
      render(() => <Button data-testid="my-button">Test</Button>);
      const button = screen.getByTestId('my-button');
      expect(button).toBeInTheDocument();
    });

    it('should render children', () => {
      render(() => <Button>Click Me</Button>);
      expect(screen.getByText('Click Me')).toBeInTheDocument();
    });
  });

  describe('render props', () => {
    it('should support render props for children', async () => {
      render(() => (
        <Button>
          {(props: ButtonRenderProps) => (
            <span data-pressed={props.isPressed}>{props.isPressed ? 'Pressed' : 'Not Pressed'}</span>
          )}
        </Button>
      ));

      const button = screen.getByRole('button');
      expect(screen.getByText('Not Pressed')).toBeInTheDocument();

      // Press and hold
      firePointerDown(button);
      expect(screen.getByText('Pressed')).toBeInTheDocument();

      // Release
      firePointerUp(button);
      fireEvent.click(button, { detail: 1 });
      expect(screen.getByText('Not Pressed')).toBeInTheDocument();
    });

    it('should support render props for class', async () => {
      render(() => (
        <Button class={(props: ButtonRenderProps) => props.isPressed ? 'pressed' : 'not-pressed'}>
          Test
        </Button>
      ));

      const button = screen.getByRole('button');
      expect(button).toHaveClass('not-pressed');

      firePointerDown(button);
      expect(button).toHaveClass('pressed');

      firePointerUp(button);
      fireEvent.click(button, { detail: 1 });
      expect(button).toHaveClass('not-pressed');
    });

    it('should provide isHovered in render props', async () => {
      render(() => (
        <Button class={(props: ButtonRenderProps) => props.isHovered ? 'hovered' : 'not-hovered'}>
          Test
        </Button>
      ));

      const button = screen.getByRole('button');
      expect(button).toHaveClass('not-hovered');

      await user.hover(button);
      expect(button).toHaveClass('hovered');

      await user.unhover(button);
      expect(button).toHaveClass('not-hovered');
    });

    it('should provide isDisabled in render props', () => {
      render(() => (
        <Button isDisabled class={(props: ButtonRenderProps) => props.isDisabled ? 'disabled' : 'enabled'}>
          Test
        </Button>
      ));

      const button = screen.getByRole('button');
      expect(button).toHaveClass('disabled');
    });
  });

  describe('data attributes', () => {
    it('should set data-pressed when pressed', async () => {
      render(() => <Button>Test</Button>);
      const button = screen.getByRole('button');

      expect(button).not.toHaveAttribute('data-pressed');

      firePointerDown(button);
      expect(button).toHaveAttribute('data-pressed');

      firePointerUp(button);
      fireEvent.click(button, { detail: 1 });
      expect(button).not.toHaveAttribute('data-pressed');
    });

    it('should set data-hovered when hovered', async () => {
      render(() => <Button>Test</Button>);
      const button = screen.getByRole('button');

      expect(button).not.toHaveAttribute('data-hovered');

      await user.hover(button);
      expect(button).toHaveAttribute('data-hovered');

      await user.unhover(button);
      expect(button).not.toHaveAttribute('data-hovered');
    });

    it('should set data-disabled when disabled', () => {
      render(() => <Button isDisabled>Test</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-disabled');
    });

    it('should set data-focus-visible on keyboard focus', async () => {
      render(() => <Button>Test</Button>);
      const button = screen.getByRole('button');

      expect(button).not.toHaveAttribute('data-focus-visible');

      await user.tab();
      expect(document.activeElement).toBe(button);
      expect(button).toHaveAttribute('data-focus-visible');
    });
  });

  describe('press events', () => {
    it('should call onPress on click', async () => {
      const onPress = vi.fn();
      render(() => <Button onPress={onPress}>Test</Button>);

      await user.click(screen.getByRole('button'));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('should call onPressStart and onPressEnd', async () => {
      const onPressStart = vi.fn();
      const onPressEnd = vi.fn();
      render(() => (
        <Button onPressStart={onPressStart} onPressEnd={onPressEnd}>
          Test
        </Button>
      ));

      const button = screen.getByRole('button');
      await user.click(button);

      expect(onPressStart).toHaveBeenCalledTimes(1);
      expect(onPressEnd).toHaveBeenCalledTimes(1);
    });

    it('should call onPressUp', async () => {
      const onPressUp = vi.fn();
      render(() => <Button onPressUp={onPressUp}>Test</Button>);

      await user.click(screen.getByRole('button'));
      expect(onPressUp).toHaveBeenCalledTimes(1);
    });

    it('should call onPressChange', async () => {
      const onPressChange = vi.fn();
      render(() => <Button onPressChange={onPressChange}>Test</Button>);

      await user.click(screen.getByRole('button'));
      // Called twice: once for press start (true), once for press end (false)
      expect(onPressChange).toHaveBeenCalledTimes(2);
      expect(onPressChange).toHaveBeenNthCalledWith(1, true);
      expect(onPressChange).toHaveBeenNthCalledWith(2, false);
    });

    it('should not call press events when disabled', async () => {
      const onPress = vi.fn();
      render(() => <Button isDisabled onPress={onPress}>Test</Button>);

      await user.click(screen.getByRole('button'));
      expect(onPress).not.toHaveBeenCalled();
    });
  });

  describe('keyboard interaction', () => {
    it('should trigger onPress on Enter key', async () => {
      const onPress = vi.fn();
      render(() => <Button onPress={onPress}>Test</Button>);

      await user.tab();
      await user.keyboard('{Enter}');
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('should trigger onPress on Space key', async () => {
      const onPress = vi.fn();
      render(() => <Button onPress={onPress}>Test</Button>);

      await user.tab();
      await user.keyboard('{ }');
      expect(onPress).toHaveBeenCalledTimes(1);
    });
  });

  describe('touch interaction', () => {
    it('should handle touch press', async () => {
      const onPress = vi.fn();
      render(() => <Button onPress={onPress}>Test</Button>);

      const button = screen.getByRole('button');
      await user.pointer([
        { keys: '[TouchA>]', target: button },
        { keys: '[/TouchA]', target: button },
      ]);

      expect(onPress).toHaveBeenCalledTimes(1);
    });
  });

  describe('disabled state', () => {
    it('should be disabled when isDisabled is true', () => {
      render(() => <Button isDisabled>Test</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should not call onPress when disabled', async () => {
      const onPress = vi.fn();
      render(() => <Button isDisabled onPress={onPress}>Test</Button>);

      await user.click(screen.getByRole('button'));
      expect(onPress).not.toHaveBeenCalled();
    });
  });

  describe('pending state', () => {
    it('should expose pending state via data attribute and render props', () => {
      render(() => (
        <Button
          isPending
          class={(props: ButtonRenderProps) => props.isPending ? 'pending' : 'ready'}
        >
          Test
        </Button>
      ));

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-pending');
      expect(button).toHaveClass('pending');
    });

    it('should disable press interaction while pending', async () => {
      const onPress = vi.fn();
      render(() => <Button isPending onPress={onPress}>Test</Button>);

      const button = screen.getByRole('button');
      await user.click(button);
      expect(onPress).not.toHaveBeenCalled();
      expect(button).toBeDisabled();
    });
  });

  describe('button type', () => {
    it('should default to type="button"', () => {
      render(() => <Button>Test</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('should support type="submit"', () => {
      render(() => <Button type="submit">Test</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('should support type="reset"', () => {
      render(() => <Button type="reset">Test</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'reset');
    });
  });

  describe('accessibility', () => {
    it('should support aria-label', () => {
      render(() => <Button aria-label="Close dialog">X</Button>);
      const button = screen.getByRole('button', { name: 'Close dialog' });
      expect(button).toBeInTheDocument();
    });

    it('should support aria-describedby', () => {
      render(() => (
        <>
          <span id="desc">This button does something</span>
          <Button aria-describedby="desc">Test</Button>
        </>
      ));
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-describedby', 'desc');
    });

    it('should support aria-pressed for toggle buttons', () => {
      render(() => <Button aria-pressed={true}>Toggle</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });

    it('should support aria-expanded', () => {
      render(() => <Button aria-expanded={true}>Expand</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });
  });
});
