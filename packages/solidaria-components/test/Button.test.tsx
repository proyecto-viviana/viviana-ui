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
import { createSignal } from 'solid-js';
import { Button, ButtonContext, type ButtonRenderProps } from '../src/Button';
import { ToggleButton } from '../src/ToggleButton';
import { setupUser, firePointerDown, firePointerUp, assertNoA11yViolations, assertAriaIdIntegrity } from '@proyecto-viviana/solidaria-test-utils';

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

    it('should support custom render function', () => {
      render(() => (
        <Button
          render={(props) => (
            <button {...props} data-custom="bar" />
          )}
        >
          Test
        </Button>
      ));

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-custom', 'bar');
    });

    it('should render children', () => {
      render(() => <Button>Click Me</Button>);
      expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('should support form props', () => {
      render(() => (
        <form id="foo">
          <Button form="foo" formMethod="post">Test</Button>
        </form>
      ));
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('form', 'foo');
      expect(button).toHaveAttribute('formmethod', 'post');
    });

    it('should support accessibility props', () => {
      render(() => <Button aria-current="page">Test</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-current', 'page');
    });

    it('should not have aria-disabled defined by default', () => {
      render(() => <Button>Test</Button>);
      expect(screen.getByRole('button')).not.toHaveAttribute('aria-disabled');
    });

    it('should support aria-disabled passthrough', () => {
      render(() => <Button aria-disabled="true">Test</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
    });

    it('should support slot', () => {
      render(() => (
        <ButtonContext.Provider value={{ slots: { test: { 'aria-label': 'test' } } }}>
          <Button slot="test">Test</Button>
        </ButtonContext.Provider>
      ));
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('slot', 'test');
      expect(button).toHaveAttribute('aria-label', 'test');
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

    it('should support hover', async () => {
      const hoverStartSpy = vi.fn();
      const hoverChangeSpy = vi.fn();
      const hoverEndSpy = vi.fn();
      render(() => (
        <Button
          class={({ isHovered }) => isHovered ? 'hover' : ''}
          onHoverStart={hoverStartSpy}
          onHoverChange={hoverChangeSpy}
          onHoverEnd={hoverEndSpy}
        >
          Test
        </Button>
      ));
      const button = screen.getByRole('button');

      expect(button).not.toHaveAttribute('data-hovered');
      expect(button).not.toHaveClass('hover');

      await user.hover(button);
      expect(button).toHaveAttribute('data-hovered');
      expect(button).toHaveClass('hover');
      expect(hoverStartSpy).toHaveBeenCalledTimes(1);
      expect(hoverChangeSpy).toHaveBeenCalledTimes(1);

      await user.unhover(button);
      expect(button).not.toHaveAttribute('data-hovered');
      expect(button).not.toHaveClass('hover');
      expect(hoverEndSpy).toHaveBeenCalledTimes(1);
      expect(hoverChangeSpy).toHaveBeenCalledTimes(2);
    });

    it('should support focus ring', async () => {
      render(() => (
        <Button class={({ isFocusVisible }) => isFocusVisible ? 'focus' : ''}>
          Test
        </Button>
      ));
      const button = screen.getByRole('button');

      expect(button).not.toHaveAttribute('data-focus-visible');
      expect(button).not.toHaveClass('focus');

      await user.tab();
      expect(document.activeElement).toBe(button);
      expect(button).toHaveAttribute('data-focus-visible');
      expect(button).toHaveClass('focus');

      await user.tab();
      expect(button).not.toHaveAttribute('data-focus-visible');
      expect(button).not.toHaveClass('focus');
    });

    it('should support press state', () => {
      const onPress = vi.fn();
      const onClick = vi.fn();
      const onClickCapture = vi.fn();
      render(() => (
        <Button
          class={({ isPressed }) => isPressed ? 'pressed' : ''}
          onPress={onPress}
          onClick={onClick}
          onClickCapture={onClickCapture}
        >
          Test
        </Button>
      ));
      const button = screen.getByRole('button');

      expect(button).not.toHaveAttribute('data-pressed');
      expect(button).not.toHaveClass('pressed');

      firePointerDown(button);
      expect(button).toHaveAttribute('data-pressed');
      expect(button).toHaveClass('pressed');

      firePointerUp(button);
      fireEvent.click(button, { detail: 1 });
      expect(button).not.toHaveAttribute('data-pressed');
      expect(button).not.toHaveClass('pressed');
      expect(onPress).toHaveBeenCalledTimes(1);
      expect(onClick).toHaveBeenCalledTimes(1);
      expect(onClickCapture).not.toHaveBeenCalled();
    });

    it('should support disabled state', () => {
      render(() => (
        <Button isDisabled class={({ isDisabled }) => isDisabled ? 'disabled' : ''}>
          Test
        </Button>
      ));
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('disabled');
    });

    it('should support render props', () => {
      render(() => (
        <Button>{({ isPressed }) => isPressed ? 'Pressed' : 'Test'}</Button>
      ));
      const button = screen.getByRole('button');

      expect(button).toHaveTextContent('Test');
      firePointerDown(button);
      expect(button).toHaveTextContent('Pressed');
      firePointerUp(button);
      fireEvent.click(button, { detail: 1 });
      expect(button).toHaveTextContent('Test');
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

    it('displays a spinner when isPending prop is true', async () => {
      const onPressSpy = vi.fn();

      function TestComponent() {
        const [pending, setPending] = createSignal(false);
        return (
          <Button
            onPress={() => {
              setPending(true);
              onPressSpy();
            }}
            isPending={pending()}
          >
            {({ isPending }) => (
              <>
                <span style={{ opacity: isPending ? '0' : undefined }}>Test</span>
                <span role="progressbar" aria-label="loading" style={{ opacity: isPending ? undefined : '0' }}>
                  loading
                </span>
              </>
            )}
          </Button>
        );
      }

      render(() => <TestComponent />);
      const button = screen.getByRole('button');
      expect(button).not.toHaveAttribute('data-pending');
      await user.click(button);
      expect(button).toHaveAttribute('data-pending');
      expect(screen.getByRole('progressbar', { name: 'loading' })).toBeInTheDocument();
      await user.click(button);
      expect(onPressSpy).toHaveBeenCalledTimes(1);
    });

    it('removes href attribute from anchor element when isPending is true', () => {
      render(() => (
        <Button href="//example.com" isPending>
          {({ isPending }) => (
            <>
              <span style={{ visibility: isPending ? 'hidden' : undefined }}>Click me</span>
              <span role="progressbar" aria-label="loading" style={{ visibility: isPending ? undefined : 'hidden' }}>
                loading
              </span>
            </>
          )}
        </Button>
      ));

      expect(screen.getByRole('button')).not.toHaveAttribute('href');
    });

    it('should prevent explicit mouse form submission when isPending', () => {
      const onSubmitSpy = vi.fn((event: SubmitEvent) => event.preventDefault());
      render(() => (
        <form onSubmit={onSubmitSpy}>
          <Button type="submit" isPending>Test</Button>
        </form>
      ));

      fireEvent.click(screen.getByRole('button'));
      expect(onSubmitSpy).not.toHaveBeenCalled();
    });

    it('should prevent explicit keyboard form submission when isPending', async () => {
      const onSubmitSpy = vi.fn((event: SubmitEvent) => event.preventDefault());
      render(() => (
        <form onSubmit={onSubmitSpy}>
          <Button type="submit" isPending>Test</Button>
        </form>
      ));

      await user.tab();
      await user.keyboard('{Enter}');
      expect(onSubmitSpy).not.toHaveBeenCalled();
    });

    it('should prevent implicit form submission when isPending', async () => {
      const onSubmitSpy = vi.fn((event: SubmitEvent) => event.preventDefault());
      render(() => (
        <form onSubmit={onSubmitSpy}>
          <label for="foo">Test</label>
          <input id="foo" type="text" />
          <input id="bar" type="text" />
          <Button type="submit" isPending>Test</Button>
        </form>
      ));

      screen.getByLabelText('Test').focus();
      await user.keyboard('{Enter}');
      expect(onSubmitSpy).not.toHaveBeenCalled();
    });

    it('disables press when in pending state for context', async () => {
      const onPress = vi.fn();
      render(() => (
        <ButtonContext.Provider value={{ isPending: true, onPress }}>
          <Button>Delete</Button>
        </ButtonContext.Provider>
      ));

      await user.click(screen.getByRole('button'));
      expect(onPress).not.toHaveBeenCalled();
      expect(screen.getByRole('button')).toHaveAttribute('data-pending');
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

  describe('a11y validation', () => {
    it('axe: default state', async () => {
      const { container } = render(() => <Button>Click me</Button>);
      await assertNoA11yViolations(container);
    });

    it('axe: disabled', async () => {
      const { container } = render(() => <Button isDisabled>Click me</Button>);
      await assertNoA11yViolations(container);
    });

    it('axe: icon-only with aria-label', async () => {
      const { container } = render(() => <Button aria-label="Close">✕</Button>);
      await assertNoA11yViolations(container);
    });

    it('axe: pending state', async () => {
      const { container } = render(() => <Button isPending>Save</Button>);
      await assertNoA11yViolations(container);
    });

    it('ARIA ID: no dangling refs with aria-describedby', () => {
      render(() => (
        <>
          <span id="btn-desc">Help text</span>
          <Button aria-describedby="btn-desc">Action</Button>
        </>
      ));
      assertAriaIdIntegrity(document.body);
    });

    it('DOM: aria-label forwards', () => {
      render(() => <Button aria-label="Save file">Save</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Save file');
    });

    it('DOM: id forwards', () => {
      render(() => <Button id="my-btn">Test</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('id', 'my-btn');
    });
  });
});

describe('ToggleButton a11y validation', () => {
  it('axe: default', async () => {
    const { container } = render(() => <ToggleButton>Bold</ToggleButton>);
    await assertNoA11yViolations(container);
  });

  it('axe: selected', async () => {
    const { container } = render(() => <ToggleButton isSelected>Bold</ToggleButton>);
    await assertNoA11yViolations(container);
  });

  it('axe: disabled', async () => {
    const { container } = render(() => <ToggleButton isDisabled>Bold</ToggleButton>);
    await assertNoA11yViolations(container);
  });

  it('ARIA ID: no dangling refs', () => {
    render(() => <ToggleButton>Bold</ToggleButton>);
    assertAriaIdIntegrity(document.body);
  });
});
