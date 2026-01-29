import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@solidjs/testing-library';
import { createSignal } from 'solid-js';
import { createButton, createToggleButton } from '../src/button';
import { setupUser, firePointerDown, firePointerUp } from '@proyecto-viviana/solidaria-test-utils';

// setupUser and pointer helpers are consolidated in solidaria-test-utils.

afterEach(() => {
  cleanup();
});

describe('createButton', () => {
  describe('native button element', () => {
    it('returns button props with type="button" by default', () => {
      const { buttonProps } = createButton();
      expect(buttonProps.type).toBe('button');
    });

    it('respects custom type attribute', () => {
      const { buttonProps } = createButton({ type: 'submit' });
      expect(buttonProps.type).toBe('submit');
    });

    it('sets disabled attribute when isDisabled is true', () => {
      const { buttonProps } = createButton({ isDisabled: true });
      expect(buttonProps.disabled).toBe(true);
    });

    it('sets disabled attribute when isDisabled is an accessor', () => {
      const [isDisabled] = createSignal(true);
      const { buttonProps } = createButton({ isDisabled });
      expect(buttonProps.disabled).toBe(true);
    });

    it('includes form-related attributes', () => {
      const { buttonProps } = createButton({
        form: 'my-form',
        formAction: '/submit',
        name: 'submit-btn',
        value: 'submit',
      });
      expect(buttonProps.form).toBe('my-form');
      expect(buttonProps.formAction).toBe('/submit');
      expect(buttonProps.name).toBe('submit-btn');
      expect(buttonProps.value).toBe('submit');
    });
  });

  describe('non-native elements', () => {
    it('adds role="button" for div elements', () => {
      const { buttonProps } = createButton({ elementType: 'div' });
      expect(buttonProps.role).toBe('button');
    });

    it('adds role="button" for span elements', () => {
      const { buttonProps } = createButton({ elementType: 'span' });
      expect(buttonProps.role).toBe('button');
    });

    it('adds tabIndex=0 for non-disabled non-native buttons', () => {
      const { buttonProps } = createButton({ elementType: 'div' });
      expect(buttonProps.tabIndex).toBe(0);
    });

    it('removes tabIndex when disabled', () => {
      const { buttonProps } = createButton({ elementType: 'div', isDisabled: true });
      expect(buttonProps.tabIndex).toBeUndefined();
    });

    it('sets aria-disabled for disabled non-native buttons', () => {
      const { buttonProps } = createButton({ elementType: 'div', isDisabled: true });
      expect(buttonProps['aria-disabled']).toBe(true);
    });
  });

  describe('anchor elements', () => {
    it('adds role="button" for anchor elements', () => {
      const { buttonProps } = createButton({ elementType: 'a' });
      expect(buttonProps.role).toBe('button');
    });

    it('passes through href, target, and rel', () => {
      const { buttonProps } = createButton({
        elementType: 'a',
        href: 'https://example.com',
        target: '_blank',
        rel: 'noopener noreferrer',
      });
      expect(buttonProps.href).toBe('https://example.com');
      expect(buttonProps.target).toBe('_blank');
      expect(buttonProps.rel).toBe('noopener noreferrer');
    });
  });

  describe('ARIA attributes', () => {
    it('passes through aria-pressed', () => {
      const { buttonProps } = createButton({ 'aria-pressed': true });
      expect(buttonProps['aria-pressed']).toBe(true);
    });

    it('passes through aria-haspopup', () => {
      const { buttonProps } = createButton({ 'aria-haspopup': 'menu' });
      expect(buttonProps['aria-haspopup']).toBe('menu');
    });

    it('passes through aria-expanded', () => {
      const { buttonProps } = createButton({ 'aria-expanded': true });
      expect(buttonProps['aria-expanded']).toBe(true);
    });

    it('passes through aria-label', () => {
      const { buttonProps } = createButton({ 'aria-label': 'Close dialog' });
      expect(buttonProps['aria-label']).toBe('Close dialog');
    });

    it('passes through aria-labelledby', () => {
      const { buttonProps } = createButton({ 'aria-labelledby': 'label-id' });
      expect(buttonProps['aria-labelledby']).toBe('label-id');
    });

    it('passes through aria-describedby', () => {
      const { buttonProps } = createButton({ 'aria-describedby': 'desc-id' });
      expect(buttonProps['aria-describedby']).toBe('desc-id');
    });
  });

  describe('press interactions', () => {
    it('calls onPress when clicked', async () => {
      const user = setupUser();
      const onPress = vi.fn();
      const { buttonProps } = createButton({ onPress });

      render(() => <button {...buttonProps}>Click me</button>);
      await user.click(screen.getByText('Click me'));

      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('calls onPressStart on pointer down', async () => {
      const user = setupUser();
      const onPressStart = vi.fn();
      const { buttonProps } = createButton({ onPressStart });

      render(() => <button {...buttonProps}>Press me</button>);
      const button = screen.getByText('Press me');

      firePointerDown(button);

      expect(onPressStart).toHaveBeenCalledTimes(1);
    });

    it('calls onPressEnd on pointer up', async () => {
      const user = setupUser();
      const onPressEnd = vi.fn();
      const { buttonProps } = createButton({ onPressEnd });

      render(() => <button {...buttonProps}>Press me</button>);
      const button = screen.getByText('Press me');

      await user.pointer([
        { keys: '[MouseLeft>]', target: button },
        { keys: '[/MouseLeft]', target: button },
      ]);

      expect(onPressEnd).toHaveBeenCalledTimes(1);
    });

    it('does not call onPress when disabled', async () => {
      const user = setupUser();
      const onPress = vi.fn();
      const { buttonProps } = createButton({ onPress, isDisabled: true });

      render(() => <button {...buttonProps}>Click me</button>);
      await user.click(screen.getByText('Click me'));

      expect(onPress).not.toHaveBeenCalled();
    });

    it('updates isPressed state during press', async () => {
      const user = setupUser();
      const onPressChange = vi.fn();
      const { buttonProps } = createButton({ onPressChange });

      render(() => <button {...buttonProps}>Press me</button>);
      const button = screen.getByText('Press me');

      await user.pointer([
        { keys: '[MouseLeft>]', target: button },
        { keys: '[/MouseLeft]', target: button },
      ]);

      expect(onPressChange).toHaveBeenCalledWith(true);
      expect(onPressChange).toHaveBeenCalledWith(false);
    });

    it('handles keyboard activation with Enter on non-native element', async () => {
      const user = setupUser();
      const onPress = vi.fn();
      const { buttonProps } = createButton({ onPress });

      // Use a div to test keyboard handling without native button click behavior
      render(() => <div {...buttonProps} tabIndex={0}>Press me</div>);
      const button = screen.getByText('Press me');
      button.focus();

      await user.keyboard('{Enter}');

      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('handles keyboard activation with Enter on native button (should fire once)', async () => {
      const user = setupUser();
      const onPress = vi.fn();
      const { buttonProps } = createButton({ onPress });

      // Native buttons fire click on Enter keydown, which could cause double-firing
      // This test ensures we properly ignore the synthetic click
      render(() => <button {...buttonProps}>Press me</button>);
      const button = screen.getByText('Press me');
      button.focus();

      await user.keyboard('{Enter}');

      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('handles keyboard activation with Space', async () => {
      const user = setupUser();
      const onPress = vi.fn();
      const { buttonProps } = createButton({ onPress });

      render(() => <button {...buttonProps}>Press me</button>);
      const button = screen.getByText('Press me');
      button.focus();

      await user.keyboard('{ }');

      expect(onPress).toHaveBeenCalledTimes(1);
    });
  });

  describe('input element', () => {
    it('sets type and disabled for input elements', () => {
      const { buttonProps } = createButton({ elementType: 'input', isDisabled: true });
      expect(buttonProps.type).toBe('button');
      expect(buttonProps.disabled).toBe(true);
    });
  });

  describe('additional ARIA attributes', () => {
    it('passes through aria-controls', () => {
      const { buttonProps } = createButton({ 'aria-controls': 'menu-1' });
      expect(buttonProps['aria-controls']).toBe('menu-1');
    });

    it('passes through aria-current', () => {
      const { buttonProps } = createButton({ 'aria-current': 'page' });
      expect(buttonProps['aria-current']).toBe('page');
    });

    it('handles aria-current with boolean value', () => {
      const { buttonProps } = createButton({ 'aria-current': true });
      expect(buttonProps['aria-current']).toBe(true);
    });
  });

  describe('touch interactions', () => {
    it('handles touch press', async () => {
      const user = setupUser();
      const onPress = vi.fn();
      const { buttonProps } = createButton({ onPress });

      render(() => <button {...buttonProps}>Touch me</button>);
      const button = screen.getByText('Touch me');

      await user.pointer([
        { keys: '[TouchA>]', target: button },
        { keys: '[/TouchA]', target: button },
      ]);

      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('provides correct pointerType in event', async () => {
      const user = setupUser();
      const onPressStart = vi.fn();
      const { buttonProps } = createButton({ onPressStart });

      render(() => <button {...buttonProps}>Touch me</button>);
      const button = screen.getByText('Touch me');

      await user.pointer({ keys: '[TouchA>]', target: button });

      expect(onPressStart).toHaveBeenCalledWith(
        expect.objectContaining({ pointerType: 'touch' })
      );
    });
  });

  describe('press event coordinates', () => {
    it('includes x and y coordinates in press events', async () => {
      const user = setupUser();
      const onPressStart = vi.fn();
      const { buttonProps } = createButton({ onPressStart });

      render(() => <button {...buttonProps}>Click me</button>);
      const button = screen.getByText('Click me');

      firePointerDown(button, { clientX: 10, clientY: 15 });

      expect(onPressStart).toHaveBeenCalledWith(
        expect.objectContaining({
          x: expect.any(Number),
          y: expect.any(Number),
        })
      );
    });
  });

  describe('modifier keys', () => {
    it('includes modifier key state in press events', async () => {
      const user = setupUser();
      const onPress = vi.fn();
      const { buttonProps } = createButton({ onPress });

      render(() => <button {...buttonProps}>Click me</button>);
      await user.click(screen.getByText('Click me'));

      expect(onPress).toHaveBeenCalledWith(
        expect.objectContaining({
          shiftKey: expect.any(Boolean),
          ctrlKey: expect.any(Boolean),
          metaKey: expect.any(Boolean),
          altKey: expect.any(Boolean),
        })
      );
    });
  });

  describe('pointer release outside target', () => {
    it('does not fire onPress when pointer is released outside', async () => {
      const user = setupUser();
      const onPress = vi.fn();
      const onPressEnd = vi.fn();
      const { buttonProps } = createButton({ onPress, onPressEnd });

      render(() => (
        <div>
          <button {...buttonProps}>Press me</button>
          <div data-testid="outside">Outside</div>
        </div>
      ));

      const button = screen.getByText('Press me');
      const outside = screen.getByTestId('outside');

      firePointerDown(button, { pointerId: 1 });
      firePointerUp(outside, { pointerId: 1 });

      expect(onPressEnd).toHaveBeenCalled();
      expect(onPress).not.toHaveBeenCalled();
    });
  });

  describe('right click handling', () => {
    it('does not trigger press on right click', async () => {
      const user = setupUser();
      const onPress = vi.fn();
      const { buttonProps } = createButton({ onPress });

      render(() => <button {...buttonProps}>Click me</button>);
      const button = screen.getByText('Click me');

      await user.pointer({ keys: '[MouseRight]', target: button });

      expect(onPress).not.toHaveBeenCalled();
    });
  });

  describe('excludeFromTabOrder', () => {
    it('sets tabIndex=-1 when excludeFromTabOrder is true', () => {
      const { buttonProps } = createButton({ excludeFromTabOrder: true });
      expect(buttonProps.tabIndex).toBe(-1);
    });
  });

  describe('onClick passthrough', () => {
    it('calls onClick when clicked', async () => {
      const user = setupUser();
      const onClick = vi.fn();
      const { buttonProps } = createButton({ onClick });

      render(() => <button {...buttonProps}>Click me</button>);
      await user.click(screen.getByText('Click me'));

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('calls both onClick and onPress when clicked', async () => {
      const user = setupUser();
      const onClick = vi.fn();
      const onPress = vi.fn();
      const { buttonProps } = createButton({ onClick, onPress });

      render(() => <button {...buttonProps}>Click me</button>);
      await user.click(screen.getByText('Click me'));

      expect(onClick).toHaveBeenCalledTimes(1);
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', async () => {
      const user = setupUser();
      const onClick = vi.fn();
      const { buttonProps } = createButton({ onClick, isDisabled: true });

      render(() => <button {...buttonProps}>Click me</button>);
      await user.click(screen.getByText('Click me'));

      expect(onClick).not.toHaveBeenCalled();
    });

    it('passes MouseEvent to onClick handler', async () => {
      const user = setupUser();
      const onClick = vi.fn();
      const { buttonProps } = createButton({ onClick });

      render(() => <button {...buttonProps}>Click me</button>);
      await user.click(screen.getByText('Click me'));

      expect(onClick).toHaveBeenCalledWith(expect.any(MouseEvent));
    });
  });

  describe('allowFocusWhenDisabled', () => {
    it('sets tabIndex=-1 when disabled and allowFocusWhenDisabled is true', () => {
      const { buttonProps } = createButton({
        isDisabled: true,
        allowFocusWhenDisabled: true,
      });
      expect(buttonProps.tabIndex).toBe(-1);
    });

    it('allows button to be focused when disabled with allowFocusWhenDisabled', async () => {
      const user = setupUser();
      const { buttonProps } = createButton({
        isDisabled: true,
        allowFocusWhenDisabled: true,
      });

      render(() => <button {...buttonProps}>Disabled but focusable</button>);
      const button = screen.getByText('Disabled but focusable');

      button.focus();
      expect(document.activeElement).toBe(button);
    });

    it('still prevents interactions when disabled with allowFocusWhenDisabled', async () => {
      const user = setupUser();
      const onPress = vi.fn();
      const { buttonProps } = createButton({
        isDisabled: true,
        allowFocusWhenDisabled: true,
        onPress,
      });

      render(() => <button {...buttonProps}>Disabled but focusable</button>);
      await user.click(screen.getByText('Disabled but focusable'));

      expect(onPress).not.toHaveBeenCalled();
    });

    it('does not affect tabIndex when not disabled', () => {
      const { buttonProps } = createButton({
        isDisabled: false,
        allowFocusWhenDisabled: true,
      });
      // When not disabled, tabIndex is set to 0 for focusability (from createFocusable)
      expect(buttonProps.tabIndex).toBe(0);
    });

    it('works with non-native button elements', () => {
      const { buttonProps } = createButton({
        elementType: 'div',
        isDisabled: true,
        allowFocusWhenDisabled: true,
      });
      expect(buttonProps.tabIndex).toBe(-1);
      expect(buttonProps['aria-disabled']).toBe(true);
    });
  });
});

describe('createToggleButton', () => {
  describe('uncontrolled mode', () => {
    it('toggles selection state on press', async () => {
      const user = setupUser();
      const onChange = vi.fn();
      const { buttonProps, isSelected } = createToggleButton({ onChange });

      expect(isSelected()).toBe(false);

      render(() => <button {...buttonProps}>Toggle</button>);
      await user.click(screen.getByText('Toggle'));

      expect(onChange).toHaveBeenCalledWith(true);
    });

    it('respects defaultSelected', () => {
      const { isSelected } = createToggleButton({ defaultSelected: true });
      expect(isSelected()).toBe(true);
    });

    it('sets aria-pressed based on selection state', async () => {
      const user = setupUser();
      const { buttonProps } = createToggleButton();

      render(() => <button {...buttonProps}>Toggle</button>);
      const button = screen.getByText('Toggle');

      expect(button).toHaveAttribute('aria-pressed', 'false');

      await user.click(button);

      expect(button).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('controlled mode', () => {
    it('uses controlled isSelected value', () => {
      const [isSelected] = createSignal(true);
      const { isSelected: resultSelected } = createToggleButton({ isSelected });

      expect(resultSelected()).toBe(true);
    });

    it('calls onChange but does not change internal state in controlled mode', async () => {
      const user = setupUser();
      const onChange = vi.fn();
      const [isSelected] = createSignal(false);
      const { buttonProps, isSelected: resultSelected } = createToggleButton({
        isSelected,
        onChange,
      });

      render(() => <button {...buttonProps}>Toggle</button>);
      await user.click(screen.getByText('Toggle'));

      expect(onChange).toHaveBeenCalledWith(true);
      // In controlled mode, the parent controls the state
      expect(resultSelected()).toBe(false);
    });
  });

  describe('interaction with onPress', () => {
    it('calls both onChange and onPress', async () => {
      const user = setupUser();
      const onChange = vi.fn();
      const onPress = vi.fn();
      const { buttonProps } = createToggleButton({ onChange, onPress });

      render(() => <button {...buttonProps}>Toggle</button>);
      await user.click(screen.getByText('Toggle'));

      expect(onChange).toHaveBeenCalledWith(true);
      expect(onPress).toHaveBeenCalled();
    });
  });

  describe('disabled state', () => {
    it('does not toggle when disabled', async () => {
      const user = setupUser();
      const onChange = vi.fn();
      const { buttonProps } = createToggleButton({ onChange, isDisabled: true });

      render(() => <button {...buttonProps}>Toggle</button>);
      await user.click(screen.getByText('Toggle'));

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('keyboard interaction', () => {
    it('toggles on Enter key', async () => {
      const user = setupUser();
      const onChange = vi.fn();
      const { buttonProps } = createToggleButton({ onChange });

      render(() => <button {...buttonProps}>Toggle</button>);
      const button = screen.getByText('Toggle');
      button.focus();

      await user.keyboard('{Enter}');

      expect(onChange).toHaveBeenCalledWith(true);
    });

    it('toggles on Space key', async () => {
      const user = setupUser();
      const onChange = vi.fn();
      const { buttonProps } = createToggleButton({ onChange });

      render(() => <button {...buttonProps}>Toggle</button>);
      const button = screen.getByText('Toggle');
      button.focus();

      await user.keyboard('{ }');

      expect(onChange).toHaveBeenCalledWith(true);
    });
  });
});
