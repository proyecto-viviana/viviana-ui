/**
 * Tests for solidaria-components RadioGroup and Radio
 *
 * These tests verify the headless RadioGroup/Radio components follow
 * react-aria-components patterns.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { PointerEventsCheckLevel } from '@testing-library/user-event';
import {
  Radio,
  RadioGroup,
  type RadioRenderProps,
  type RadioGroupRenderProps,
} from '../src/RadioGroup';

const pointerMap = [
  { name: 'MouseLeft', pointerType: 'mouse', button: 'primary', height: 1, width: 1, pressure: 0.5 },
  { name: 'TouchA', pointerType: 'touch', height: 1, width: 1 },
];

function setupUser() {
  return userEvent.setup({
    delay: null,
    pointerMap: pointerMap as any,
    pointerEventsCheck: PointerEventsCheckLevel.Never,
  });
}

describe('RadioGroup', () => {
  let user: ReturnType<typeof setupUser>;

  beforeEach(() => {
    user = setupUser();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('rendering', () => {
    it('should render a radio group with default class', () => {
      render(() => (
        <RadioGroup aria-label="Options">
          <Radio value="a">Option A</Radio>
          <Radio value="b">Option B</Radio>
        </RadioGroup>
      ));

      const group = screen.getByRole('radiogroup');
      expect(group).toHaveClass('solidaria-RadioGroup');
    });

    it('should render a radio group with custom class', () => {
      render(() => (
        <RadioGroup aria-label="Options" class="custom-group">
          <Radio value="a">Option A</Radio>
        </RadioGroup>
      ));

      const group = screen.getByRole('radiogroup');
      expect(group).toHaveClass('custom-group');
    });

    it('should render children radios', () => {
      render(() => (
        <RadioGroup aria-label="Options">
          <Radio value="a">Option A</Radio>
          <Radio value="b">Option B</Radio>
        </RadioGroup>
      ));

      expect(screen.getByText('Option A')).toBeInTheDocument();
      expect(screen.getByText('Option B')).toBeInTheDocument();
    });

    it('should render radios with default class', () => {
      render(() => (
        <RadioGroup aria-label="Options">
          <Radio value="a">Option A</Radio>
        </RadioGroup>
      ));

      const radio = screen.getByRole('radio');
      const label = radio.closest('label');
      expect(label).toHaveClass('solidaria-Radio');
    });

    it('should render radios with custom class', () => {
      render(() => (
        <RadioGroup aria-label="Options">
          <Radio value="a" class="custom-radio">Option A</Radio>
        </RadioGroup>
      ));

      const radio = screen.getByRole('radio');
      const label = radio.closest('label');
      expect(label).toHaveClass('custom-radio');
    });
  });

  describe('selection', () => {
    it('should select a radio on click', async () => {
      render(() => (
        <RadioGroup aria-label="Options">
          <Radio value="a">Option A</Radio>
          <Radio value="b">Option B</Radio>
        </RadioGroup>
      ));

      const radios = screen.getAllByRole('radio');
      const labelA = radios[0].closest('label')!;
      const labelB = radios[1].closest('label')!;

      expect(labelA).not.toHaveAttribute('data-selected');
      expect(labelB).not.toHaveAttribute('data-selected');

      await user.click(radios[0]);
      expect(labelA).toHaveAttribute('data-selected');
      expect(labelB).not.toHaveAttribute('data-selected');
    });

    it('should only allow one selection', async () => {
      render(() => (
        <RadioGroup aria-label="Options">
          <Radio value="a">Option A</Radio>
          <Radio value="b">Option B</Radio>
        </RadioGroup>
      ));

      const radios = screen.getAllByRole('radio');
      const labelA = radios[0].closest('label')!;
      const labelB = radios[1].closest('label')!;

      await user.click(radios[0]);
      expect(labelA).toHaveAttribute('data-selected');
      expect(labelB).not.toHaveAttribute('data-selected');

      await user.click(radios[1]);
      expect(labelA).not.toHaveAttribute('data-selected');
      expect(labelB).toHaveAttribute('data-selected');
    });

    it('should support defaultValue', () => {
      render(() => (
        <RadioGroup aria-label="Options" defaultValue="b">
          <Radio value="a">Option A</Radio>
          <Radio value="b">Option B</Radio>
        </RadioGroup>
      ));

      // Verify via data attribute that the second radio is selected
      const radios = screen.getAllByRole('radio');
      const labelA = radios[0].closest('label')!;
      const labelB = radios[1].closest('label')!;
      expect(labelA).not.toHaveAttribute('data-selected');
      expect(labelB).toHaveAttribute('data-selected');
    });

    it('should support controlled value', () => {
      render(() => (
        <RadioGroup aria-label="Options" value="a">
          <Radio value="a">Option A</Radio>
          <Radio value="b">Option B</Radio>
        </RadioGroup>
      ));

      // Verify via data attribute that the first radio is selected
      const radios = screen.getAllByRole('radio');
      const labelA = radios[0].closest('label')!;
      const labelB = radios[1].closest('label')!;
      expect(labelA).toHaveAttribute('data-selected');
      expect(labelB).not.toHaveAttribute('data-selected');
    });

    it('should call onChange when selection changes', async () => {
      const onChange = vi.fn();
      render(() => (
        <RadioGroup aria-label="Options" onChange={onChange}>
          <Radio value="a">Option A</Radio>
          <Radio value="b">Option B</Radio>
        </RadioGroup>
      ));

      await user.click(screen.getAllByRole('radio')[0]);
      expect(onChange).toHaveBeenCalledWith('a');

      await user.click(screen.getAllByRole('radio')[1]);
      expect(onChange).toHaveBeenCalledWith('b');
    });
  });

  describe('render props', () => {
    // Note: These tests use render props without nested Radio components
    // because SolidJS's JSX evaluation order can cause context lookup issues
    // when Radio is defined inside a render prop function that's evaluated
    // before the context provider renders.
    it('should support render props for RadioGroup children', () => {
      render(() => (
        <RadioGroup aria-label="Options" isDisabled>
          {(props: RadioGroupRenderProps) => (
            <div data-testid="content">
              {props.isDisabled ? 'Disabled Group' : 'Enabled Group'}
            </div>
          )}
        </RadioGroup>
      ));

      expect(screen.getByText('Disabled Group')).toBeInTheDocument();
    });

    it('should provide state in RadioGroup render props', () => {
      render(() => (
        <RadioGroup aria-label="Options" defaultValue="b">
          {(props: RadioGroupRenderProps) => (
            <div data-testid="content">
              Selected: {props.state.selectedValue() ?? 'none'}
            </div>
          )}
        </RadioGroup>
      ));

      expect(screen.getByText('Selected: b')).toBeInTheDocument();
    });

    it('should support render props for Radio children', async () => {
      render(() => (
        <RadioGroup aria-label="Options">
          <Radio value="a">
            {(props: RadioRenderProps) => (
              <span>{props.isSelected ? 'Selected' : 'Not Selected'}</span>
            )}
          </Radio>
        </RadioGroup>
      ));

      expect(screen.getByText('Not Selected')).toBeInTheDocument();

      await user.click(screen.getByRole('radio'));
      expect(screen.getByText('Selected')).toBeInTheDocument();
    });

    it('should support render props for Radio class', async () => {
      render(() => (
        <RadioGroup aria-label="Options">
          <Radio value="a" class={(props: RadioRenderProps) => props.isSelected ? 'selected' : 'unselected'}>
            Option A
          </Radio>
        </RadioGroup>
      ));

      const label = screen.getByRole('radio').closest('label');
      expect(label).toHaveClass('unselected');

      await user.click(screen.getByRole('radio'));
      expect(label).toHaveClass('selected');
    });

    it('should provide isHovered in Radio render props', async () => {
      render(() => (
        <RadioGroup aria-label="Options">
          <Radio value="a" class={(props: RadioRenderProps) => props.isHovered ? 'hovered' : 'not-hovered'}>
            Option A
          </Radio>
        </RadioGroup>
      ));

      const label = screen.getByRole('radio').closest('label')!;
      expect(label).toHaveClass('not-hovered');

      await user.hover(label);
      expect(label).toHaveClass('hovered');
    });
  });

  describe('data attributes', () => {
    it('should set data-orientation on group', () => {
      render(() => (
        <RadioGroup aria-label="Options" orientation="horizontal">
          <Radio value="a">Option A</Radio>
        </RadioGroup>
      ));

      const group = screen.getByRole('radiogroup');
      expect(group).toHaveAttribute('data-orientation', 'horizontal');
    });

    it('should default to vertical orientation', () => {
      render(() => (
        <RadioGroup aria-label="Options">
          <Radio value="a">Option A</Radio>
        </RadioGroup>
      ));

      const group = screen.getByRole('radiogroup');
      expect(group).toHaveAttribute('data-orientation', 'vertical');
    });

    it('should set data-disabled on group when disabled', () => {
      render(() => (
        <RadioGroup aria-label="Options" isDisabled>
          <Radio value="a">Option A</Radio>
        </RadioGroup>
      ));

      const group = screen.getByRole('radiogroup');
      expect(group).toHaveAttribute('data-disabled');
    });

    it('should set data-readonly on group when readonly', () => {
      render(() => (
        <RadioGroup aria-label="Options" isReadOnly>
          <Radio value="a">Option A</Radio>
        </RadioGroup>
      ));

      const group = screen.getByRole('radiogroup');
      expect(group).toHaveAttribute('data-readonly');
    });

    it('should set data-required on group when required', () => {
      render(() => (
        <RadioGroup aria-label="Options" isRequired>
          <Radio value="a">Option A</Radio>
        </RadioGroup>
      ));

      const group = screen.getByRole('radiogroup');
      expect(group).toHaveAttribute('data-required');
    });

    it('should set data-invalid on group when invalid', () => {
      render(() => (
        <RadioGroup aria-label="Options" isInvalid>
          <Radio value="a">Option A</Radio>
        </RadioGroup>
      ));

      const group = screen.getByRole('radiogroup');
      expect(group).toHaveAttribute('data-invalid');
    });

    it('should set data-selected on radio when selected', async () => {
      render(() => (
        <RadioGroup aria-label="Options">
          <Radio value="a">Option A</Radio>
        </RadioGroup>
      ));

      const label = screen.getByRole('radio').closest('label')!;
      expect(label).not.toHaveAttribute('data-selected');

      await user.click(screen.getByRole('radio'));
      expect(label).toHaveAttribute('data-selected');
    });

    it('should set data-disabled on radio when radio is disabled', () => {
      render(() => (
        <RadioGroup aria-label="Options">
          <Radio value="a" isDisabled>Option A</Radio>
        </RadioGroup>
      ));

      const label = screen.getByRole('radio').closest('label')!;
      expect(label).toHaveAttribute('data-disabled');
    });

    it('should set data-focus-visible on radio on keyboard focus', async () => {
      render(() => (
        <RadioGroup aria-label="Options">
          <Radio value="a">Option A</Radio>
          <Radio value="b">Option B</Radio>
        </RadioGroup>
      ));

      const label = screen.getAllByRole('radio')[0].closest('label')!;
      expect(label).not.toHaveAttribute('data-focus-visible');

      await user.tab();
      expect(label).toHaveAttribute('data-focus-visible');
    });
  });

  describe('disabled state', () => {
    it('should disable all radios when group is disabled', async () => {
      const onChange = vi.fn();
      render(() => (
        <RadioGroup aria-label="Options" isDisabled onChange={onChange}>
          <Radio value="a">Option A</Radio>
          <Radio value="b">Option B</Radio>
        </RadioGroup>
      ));

      const radios = screen.getAllByRole('radio');
      expect(radios[0]).toBeDisabled();
      expect(radios[1]).toBeDisabled();

      await user.click(radios[0]);
      expect(onChange).not.toHaveBeenCalled();
    });

    it('should disable individual radio when isDisabled is set', async () => {
      const onChange = vi.fn();
      render(() => (
        <RadioGroup aria-label="Options" onChange={onChange}>
          <Radio value="a" isDisabled>Option A</Radio>
          <Radio value="b">Option B</Radio>
        </RadioGroup>
      ));

      const radios = screen.getAllByRole('radio');
      expect(radios[0]).toBeDisabled();
      expect(radios[1]).not.toBeDisabled();

      await user.click(radios[0]);
      expect(onChange).not.toHaveBeenCalled();

      await user.click(radios[1]);
      expect(onChange).toHaveBeenCalledWith('b');
    });
  });

  describe('readonly state', () => {
    it('should not allow selection changes when readonly', async () => {
      const onChange = vi.fn();
      render(() => (
        <RadioGroup aria-label="Options" isReadOnly defaultValue="a" onChange={onChange}>
          <Radio value="a">Option A</Radio>
          <Radio value="b">Option B</Radio>
        </RadioGroup>
      ));

      const radios = screen.getAllByRole('radio');
      const labelA = radios[0].closest('label')!;
      // Verify selection via data attribute
      expect(labelA).toHaveAttribute('data-selected');

      await user.click(radios[1]);
      expect(onChange).not.toHaveBeenCalled();
      // Should still be selected
      expect(labelA).toHaveAttribute('data-selected');
    });
  });

  describe('keyboard interaction', () => {
    it('should focus on first radio with Tab', async () => {
      render(() => (
        <RadioGroup aria-label="Options">
          <Radio value="a">Option A</Radio>
          <Radio value="b">Option B</Radio>
        </RadioGroup>
      ));

      await user.tab();
      const radios = screen.getAllByRole('radio');
      expect(document.activeElement).toBe(radios[0]);
    });

    // Skip: JSDOM doesn't correctly set up initial checked state before first interaction
    it.skip('should focus on selected radio with Tab', async () => {
      render(() => (
        <RadioGroup aria-label="Options" defaultValue="b">
          <Radio value="a">Option A</Radio>
          <Radio value="b">Option B</Radio>
        </RadioGroup>
      ));

      await user.tab();
      const radios = screen.getAllByRole('radio');
      expect(document.activeElement).toBe(radios[1]);
    });

    it('should navigate with arrow keys', async () => {
      render(() => (
        <RadioGroup aria-label="Options">
          <Radio value="a">Option A</Radio>
          <Radio value="b">Option B</Radio>
          <Radio value="c">Option C</Radio>
        </RadioGroup>
      ));

      await user.tab();
      const radios = screen.getAllByRole('radio');
      expect(document.activeElement).toBe(radios[0]);

      await user.keyboard('{ArrowDown}');
      expect(document.activeElement).toBe(radios[1]);

      await user.keyboard('{ArrowDown}');
      expect(document.activeElement).toBe(radios[2]);

      await user.keyboard('{ArrowUp}');
      expect(document.activeElement).toBe(radios[1]);
    });

    // Skip: JSDOM doesn't trigger native radio selection on arrow keys
    // Arrow key navigation works in real browsers but JSDOM only moves focus
    it.skip('should select and navigate with arrow keys', async () => {
      render(() => (
        <RadioGroup aria-label="Options">
          <Radio value="a">Option A</Radio>
          <Radio value="b">Option B</Radio>
        </RadioGroup>
      ));

      await user.tab();
      const radios = screen.getAllByRole('radio');

      // Arrow keys move focus and trigger selection via native radio behavior
      await user.keyboard('{ArrowDown}');
      // Verify via data attribute since JSDOM's checked state may not sync
      const labelB = radios[1].closest('label')!;
      expect(labelB).toHaveAttribute('data-selected');
      expect(document.activeElement).toBe(radios[1]);
    });

    it('should wrap around with arrow keys', async () => {
      render(() => (
        <RadioGroup aria-label="Options">
          <Radio value="a">Option A</Radio>
          <Radio value="b">Option B</Radio>
        </RadioGroup>
      ));

      await user.tab();
      const radios = screen.getAllByRole('radio');

      await user.keyboard('{ArrowUp}');
      expect(document.activeElement).toBe(radios[1]);
    });
  });

  describe('accessibility', () => {
    it('should have proper aria-label', () => {
      render(() => (
        <RadioGroup aria-label="Test Options">
          <Radio value="a">Option A</Radio>
        </RadioGroup>
      ));

      const group = screen.getByRole('radiogroup');
      expect(group).toHaveAttribute('aria-label', 'Test Options');
    });

    it('should set data-required on group when required', () => {
      render(() => (
        <RadioGroup aria-label="Options" isRequired>
          <Radio value="a">Option A</Radio>
        </RadioGroup>
      ));

      // Required state is indicated on the group via data attribute
      const group = screen.getByRole('radiogroup');
      expect(group).toHaveAttribute('data-required');
    });

    it('should set data-invalid on group when invalid', () => {
      render(() => (
        <RadioGroup aria-label="Options" isInvalid>
          <Radio value="a">Option A</Radio>
        </RadioGroup>
      ));

      // Invalid state is indicated on the group via data attribute
      const group = screen.getByRole('radiogroup');
      expect(group).toHaveAttribute('data-invalid');
    });
  });

  describe('Radio outside RadioGroup', () => {
    it('should throw error when Radio is used outside RadioGroup', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(() => <Radio value="a">Option A</Radio>);
      }).toThrow('Radio must be used within a RadioGroup');

      consoleSpy.mockRestore();
    });
  });
});
