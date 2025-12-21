import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { RadioGroup, Radio } from '../src/radio';

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

describe('RadioGroup', () => {
  let onChangeSpy = vi.fn();
  let user: ReturnType<typeof setupUser>;

  beforeEach(() => {
    user = setupUser();
  });

  afterEach(() => {
    onChangeSpy.mockClear();
  });

  describe('basic functionality', () => {
    it('renders with role="radiogroup"', () => {
      render(() => (
        <RadioGroup aria-label="Test group">
          <Radio value="a">Option A</Radio>
          <Radio value="b">Option B</Radio>
        </RadioGroup>
      ));
      const group = screen.getByRole('radiogroup');
      expect(group).toBeInTheDocument();
    });

    it('renders radio buttons with role="radio"', () => {
      render(() => (
        <RadioGroup aria-label="Test group">
          <Radio value="a">Option A</Radio>
          <Radio value="b">Option B</Radio>
        </RadioGroup>
      ));
      const radios = screen.getAllByRole('radio');
      expect(radios).toHaveLength(2);
    });

    it('handles defaults (none selected)', () => {
      render(() => (
        <RadioGroup aria-label="Test group">
          <Radio value="a">Option A</Radio>
          <Radio value="b">Option B</Radio>
        </RadioGroup>
      ));
      const radios = screen.getAllByRole('radio');
      expect(radios[0]).not.toBeChecked();
      expect(radios[1]).not.toBeChecked();
    });

    it('selects on click', async () => {
      render(() => (
        <RadioGroup aria-label="Test group" onChange={onChangeSpy}>
          <Radio value="a">Option A</Radio>
          <Radio value="b">Option B</Radio>
        </RadioGroup>
      ));
      const radios = screen.getAllByRole('radio');

      // Click second radio
      await user.click(radios[1]);
      expect(onChangeSpy).toHaveBeenCalledWith('b');
    });

    it('supports defaultValue', () => {
      render(() => (
        <RadioGroup aria-label="Test group" defaultValue="b">
          <Radio value="a">Option A</Radio>
          <Radio value="b">Option B</Radio>
        </RadioGroup>
      ));
      const radios = screen.getAllByRole('radio');
      expect(radios[0]).not.toBeChecked();
      expect(radios[1]).toBeChecked();
    });

    it('only allows one selection at a time', async () => {
      render(() => (
        <RadioGroup aria-label="Test group" onChange={onChangeSpy}>
          <Radio value="a">Option A</Radio>
          <Radio value="b">Option B</Radio>
          <Radio value="c">Option C</Radio>
        </RadioGroup>
      ));
      const radios = screen.getAllByRole('radio');

      await user.click(radios[0]);
      expect(onChangeSpy).toHaveBeenCalledWith('a');

      onChangeSpy.mockClear();
      await user.click(radios[2]);
      expect(onChangeSpy).toHaveBeenCalledWith('c');
    });
  });

  describe('controlled mode', () => {
    it('reflects controlled value', () => {
      render(() => (
        <RadioGroup aria-label="Test group" value="b">
          <Radio value="a">Option A</Radio>
          <Radio value="b">Option B</Radio>
        </RadioGroup>
      ));
      const radios = screen.getAllByRole('radio');
      expect(radios[0]).not.toBeChecked();
      expect(radios[1]).toBeChecked();
    });

    it('calls onChange in controlled mode', async () => {
      render(() => (
        <RadioGroup aria-label="Test group" value="a" onChange={onChangeSpy}>
          <Radio value="a">Option A</Radio>
          <Radio value="b">Option B</Radio>
        </RadioGroup>
      ));
      const radios = screen.getAllByRole('radio');

      await user.click(radios[1]);
      expect(onChangeSpy).toHaveBeenCalledWith('b');
    });
  });

  describe('disabled state', () => {
    it('does not select when group is disabled', async () => {
      render(() => (
        <RadioGroup aria-label="Test group" isDisabled onChange={onChangeSpy}>
          <Radio value="a">Option A</Radio>
          <Radio value="b">Option B</Radio>
        </RadioGroup>
      ));
      const radios = screen.getAllByRole('radio');

      expect(radios[0]).toBeDisabled();
      await user.click(radios[0]);
      expect(onChangeSpy).not.toHaveBeenCalled();
    });

    it('does not select when individual radio is disabled', async () => {
      render(() => (
        <RadioGroup aria-label="Test group" onChange={onChangeSpy}>
          <Radio value="a" isDisabled>Option A</Radio>
          <Radio value="b">Option B</Radio>
        </RadioGroup>
      ));
      const radios = screen.getAllByRole('radio');

      expect(radios[0]).toBeDisabled();
      await user.click(radios[0]);
      expect(onChangeSpy).not.toHaveBeenCalled();

      // But non-disabled radio should work
      await user.click(radios[1]);
      expect(onChangeSpy).toHaveBeenCalledWith('b');
    });
  });

  describe('keyboard interaction', () => {
    it('selects via click interaction', async () => {
      render(() => (
        <RadioGroup aria-label="Test group" onChange={onChangeSpy}>
          <Radio value="a">Option A</Radio>
          <Radio value="b">Option B</Radio>
          <Radio value="c">Option C</Radio>
        </RadioGroup>
      ));
      const radios = screen.getAllByRole('radio') as HTMLInputElement[];

      await user.click(radios[0]);
      expect(onChangeSpy).toHaveBeenCalledWith('a');

      // Clear spy, then click second radio
      onChangeSpy.mockClear();
      await user.click(radios[1]);
      expect(onChangeSpy).toHaveBeenCalledWith('b');
    });

    // Note: Arrow key navigation is tested in solidaria/createRadioGroup.test.tsx
    // Native arrow key behavior relies on browser implementation that JSDOM doesn't fully support
  });

  describe('orientation', () => {
    it('renders with vertical orientation by default', () => {
      render(() => (
        <RadioGroup aria-label="Test group">
          <Radio value="a">Option A</Radio>
          <Radio value="b">Option B</Radio>
        </RadioGroup>
      ));
      const group = screen.getByRole('radiogroup');
      expect(group).toHaveAttribute('aria-orientation', 'vertical');
    });

    it('renders with horizontal orientation', () => {
      render(() => (
        <RadioGroup aria-label="Test group" orientation="horizontal">
          <Radio value="a">Option A</Radio>
          <Radio value="b">Option B</Radio>
        </RadioGroup>
      ));
      const group = screen.getByRole('radiogroup');
      expect(group).toHaveAttribute('aria-orientation', 'horizontal');
    });
  });

  describe('sizes', () => {
    it('renders with default md size', () => {
      render(() => (
        <RadioGroup aria-label="Test group">
          <Radio value="a">Option A</Radio>
        </RadioGroup>
      ));
      const group = screen.getByRole('radiogroup');
      expect(group).toHaveAttribute('data-size', 'md');
    });

    it('renders with sm size', () => {
      render(() => (
        <RadioGroup aria-label="Test group" size="sm">
          <Radio value="a">Option A</Radio>
        </RadioGroup>
      ));
      const group = screen.getByRole('radiogroup');
      expect(group).toHaveAttribute('data-size', 'sm');
    });

    it('renders with lg size', () => {
      render(() => (
        <RadioGroup aria-label="Test group" size="lg">
          <Radio value="a">Option A</Radio>
        </RadioGroup>
      ));
      const group = screen.getByRole('radiogroup');
      expect(group).toHaveAttribute('data-size', 'lg');
    });
  });

  describe('label and description', () => {
    it('renders with label', () => {
      render(() => (
        <RadioGroup label="Choose an option">
          <Radio value="a">Option A</Radio>
          <Radio value="b">Option B</Radio>
        </RadioGroup>
      ));
      expect(screen.getByText('Choose an option')).toBeInTheDocument();
    });

    it('renders with description', () => {
      render(() => (
        <RadioGroup aria-label="Test group" description="Select your preference">
          <Radio value="a">Option A</Radio>
          <Radio value="b">Option B</Radio>
        </RadioGroup>
      ));
      expect(screen.getByText('Select your preference')).toBeInTheDocument();
    });

    it('renders with error message when invalid', () => {
      render(() => (
        <RadioGroup aria-label="Test group" isInvalid errorMessage="Please select an option">
          <Radio value="a">Option A</Radio>
          <Radio value="b">Option B</Radio>
        </RadioGroup>
      ));
      expect(screen.getByText('Please select an option')).toBeInTheDocument();
    });
  });

  describe('touch interaction', () => {
    it('handles touch press', async () => {
      render(() => (
        <RadioGroup aria-label="Test group" onChange={onChangeSpy}>
          <Radio value="a">Option A</Radio>
          <Radio value="b">Option B</Radio>
        </RadioGroup>
      ));
      const radios = screen.getAllByRole('radio');

      await user.pointer([
        { keys: '[TouchA>]', target: radios[0] },
        { keys: '[/TouchA]', target: radios[0] },
      ]);

      expect(onChangeSpy).toHaveBeenCalledWith('a');
    });
  });

  describe('aria attributes', () => {
    it('supports aria-label on group', () => {
      render(() => (
        <RadioGroup aria-label="Custom label">
          <Radio value="a">Option A</Radio>
        </RadioGroup>
      ));
      const group = screen.getByRole('radiogroup');
      expect(group).toHaveAttribute('aria-label', 'Custom label');
    });
  });
});
