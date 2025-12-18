import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { PointerEventsCheckLevel } from '@testing-library/user-event';
import { createSignal } from 'solid-js';
import { createButton } from '../src/button';

// Pointer map matching react-spectrum's test setup
// Ensures pointer events have realistic dimensions so they aren't mistaken for virtual clicks
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

      await user.pointer({ keys: '[MouseLeft>]', target: button });

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
});
