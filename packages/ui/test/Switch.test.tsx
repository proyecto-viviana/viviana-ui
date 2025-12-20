import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { ToggleSwitch } from '../src/switch';

// Pointer map matching react-spectrum's test setup
const pointerMap = [
  { name: 'MouseLeft', pointerType: 'mouse', button: 'primary', height: 1, width: 1, pressure: 0.5 },
  { name: 'TouchA', pointerType: 'touch', height: 1, width: 1 },
];

function setupUser() {
  // Match solidaria test setup - only pointerMap, no extra options
  return userEvent.setup({
    pointerMap: pointerMap as any,
  });
}

describe('ToggleSwitch', () => {
  let onChangeSpy = vi.fn();
  let user: ReturnType<typeof setupUser>;

  beforeEach(() => {
    user = setupUser();
  });

  afterEach(() => {
    onChangeSpy.mockClear();
  });

  describe('basic functionality', () => {
    it('renders with role="switch"', () => {
      render(() => <ToggleSwitch aria-label="Test switch" />);
      const switchEl = screen.getByRole('switch');
      expect(switchEl).toBeInTheDocument();
    });

    it('handles defaults (unchecked)', () => {
      render(() => <ToggleSwitch aria-label="Test switch" />);
      const switchEl = screen.getByRole('switch');
      expect(switchEl).not.toBeChecked();
    });

    it('toggles on click', async () => {
      render(() => <ToggleSwitch aria-label="Test switch" onChange={onChangeSpy} />);
      const switchEl = screen.getByRole('switch');

      await user.click(switchEl);
      await Promise.resolve();

      expect(switchEl).toBeChecked();
      expect(onChangeSpy).toHaveBeenCalledWith(true);

      await user.click(switchEl);
      await Promise.resolve();

      expect(switchEl).not.toBeChecked();
      expect(onChangeSpy).toHaveBeenCalledWith(false);
    });

    it('supports defaultChecked', () => {
      render(() => <ToggleSwitch aria-label="Test switch" defaultChecked />);
      const switchEl = screen.getByRole('switch');
      expect(switchEl).toBeChecked();
    });
  });

  describe('controlled mode', () => {
    it('reflects controlled checked value', () => {
      render(() => <ToggleSwitch aria-label="Test switch" checked={true} />);
      const switchEl = screen.getByRole('switch');
      expect(switchEl).toBeChecked();
    });

    it('calls onChange in controlled mode', async () => {
      render(() => <ToggleSwitch aria-label="Test switch" checked={false} onChange={onChangeSpy} />);
      const switchEl = screen.getByRole('switch');

      await user.click(switchEl);
      expect(onChangeSpy).toHaveBeenCalledWith(true);
    });
  });

  describe('disabled state', () => {
    it('does not toggle when disabled', async () => {
      render(() => <ToggleSwitch aria-label="Test switch" isDisabled onChange={onChangeSpy} />);
      const switchEl = screen.getByRole('switch');

      expect(switchEl).toBeDisabled();
      await user.click(switchEl);
      expect(onChangeSpy).not.toHaveBeenCalled();
    });
  });

  describe('keyboard interaction', () => {
    it('toggles on Space key', async () => {
      render(() => <ToggleSwitch aria-label="Test switch" onChange={onChangeSpy} />);
      const switchEl = screen.getByRole('switch') as HTMLInputElement;

      // Focus and type space - use type() which simulates full keyboard interaction
      await user.click(switchEl);
      expect(document.activeElement).toBe(switchEl);

      // Clear the spy from the click, then test space key
      onChangeSpy.mockClear();
      await user.type(switchEl, ' ');
      expect(onChangeSpy).toHaveBeenCalled();
    });
  });

  describe('sizes', () => {
    it('renders with default md size', () => {
      render(() => <ToggleSwitch aria-label="Test switch" />);
      // Size is applied via classes, just check it renders
      const switchEl = screen.getByRole('switch');
      expect(switchEl).toBeInTheDocument();
    });

    it('renders with sm size', () => {
      render(() => <ToggleSwitch aria-label="Test switch" size="sm" />);
      const switchEl = screen.getByRole('switch');
      expect(switchEl).toBeInTheDocument();
    });

    it('renders with lg size', () => {
      render(() => <ToggleSwitch aria-label="Test switch" size="lg" />);
      const switchEl = screen.getByRole('switch');
      expect(switchEl).toBeInTheDocument();
    });
  });

  describe('label', () => {
    it('renders with label text', () => {
      render(() => <ToggleSwitch>Enable notifications</ToggleSwitch>);
      expect(screen.getByText('Enable notifications')).toBeInTheDocument();
    });
  });

  describe('touch interaction', () => {
    it('handles touch press', async () => {
      render(() => <ToggleSwitch aria-label="Test switch" onChange={onChangeSpy} />);
      const switchEl = screen.getByRole('switch');

      await user.pointer([
        { keys: '[TouchA>]', target: switchEl },
        { keys: '[/TouchA]', target: switchEl },
      ]);

      expect(onChangeSpy).toHaveBeenCalled();
    });
  });
});
