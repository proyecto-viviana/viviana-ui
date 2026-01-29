/**
 * Tests for solidaria-components Checkbox and CheckboxGroup
 *
 * These tests verify the headless Checkbox/CheckboxGroup components follow
 * react-aria-components patterns.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@solidjs/testing-library';
import {
  Checkbox,
  CheckboxGroup,
  type CheckboxRenderProps,
  type CheckboxGroupRenderProps,
} from '../src/Checkbox';
import { setupUser } from '@proyecto-viviana/solidaria-test-utils';

// setupUser is consolidated in solidaria-test-utils.

describe('Checkbox', () => {
  let user: ReturnType<typeof setupUser>;

  beforeEach(() => {
    user = setupUser();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('rendering', () => {
    it('should render a checkbox with default class', () => {
      render(() => <Checkbox>Test</Checkbox>);
      const checkbox = screen.getByRole('checkbox');
      const label = checkbox.closest('label');
      expect(label).toHaveClass('solidaria-Checkbox');
    });

    it('should render a checkbox with custom class', () => {
      render(() => <Checkbox class="custom-class">Test</Checkbox>);
      const checkbox = screen.getByRole('checkbox');
      const label = checkbox.closest('label');
      expect(label).toHaveClass('custom-class');
    });

    it('should render children', () => {
      render(() => <Checkbox>Accept terms</Checkbox>);
      expect(screen.getByText('Accept terms')).toBeInTheDocument();
    });
  });

  describe('render props', () => {
    it('should support render props for children', async () => {
      render(() => (
        <Checkbox>
          {(props: CheckboxRenderProps) => (
            <span>{props.isSelected ? 'Checked' : 'Unchecked'}</span>
          )}
        </Checkbox>
      ));

      expect(screen.getByText('Unchecked')).toBeInTheDocument();

      await user.click(screen.getByRole('checkbox'));
      expect(screen.getByText('Checked')).toBeInTheDocument();
    });

    it('should support render props for class', async () => {
      render(() => (
        <Checkbox class={(props: CheckboxRenderProps) => props.isSelected ? 'checked' : 'unchecked'}>
          Test
        </Checkbox>
      ));

      const label = screen.getByRole('checkbox').closest('label');
      expect(label).toHaveClass('unchecked');

      await user.click(screen.getByRole('checkbox'));
      expect(label).toHaveClass('checked');
    });

    it('should provide isHovered in render props', async () => {
      render(() => (
        <Checkbox class={(props: CheckboxRenderProps) => props.isHovered ? 'hovered' : 'not-hovered'}>
          Test
        </Checkbox>
      ));

      const label = screen.getByRole('checkbox').closest('label')!;
      expect(label).toHaveClass('not-hovered');

      await user.hover(label);
      expect(label).toHaveClass('hovered');
    });

    it('should provide isIndeterminate in render props', () => {
      render(() => (
        <Checkbox isIndeterminate>
          {(props: CheckboxRenderProps) => (
            <span>{props.isIndeterminate ? 'Indeterminate' : 'Determinate'}</span>
          )}
        </Checkbox>
      ));

      expect(screen.getByText('Indeterminate')).toBeInTheDocument();
    });
  });

  describe('data attributes', () => {
    it('should set data-selected when checked', async () => {
      render(() => <Checkbox>Test</Checkbox>);
      const label = screen.getByRole('checkbox').closest('label')!;

      expect(label).not.toHaveAttribute('data-selected');

      await user.click(screen.getByRole('checkbox'));
      expect(label).toHaveAttribute('data-selected');
    });

    it('should set data-indeterminate when indeterminate', () => {
      render(() => <Checkbox isIndeterminate>Test</Checkbox>);
      const label = screen.getByRole('checkbox').closest('label')!;
      expect(label).toHaveAttribute('data-indeterminate');
    });

    it('should set data-disabled when disabled', () => {
      render(() => <Checkbox isDisabled>Test</Checkbox>);
      const label = screen.getByRole('checkbox').closest('label')!;
      expect(label).toHaveAttribute('data-disabled');
    });

    it('should set data-readonly when readonly', () => {
      render(() => <Checkbox isReadOnly>Test</Checkbox>);
      const label = screen.getByRole('checkbox').closest('label')!;
      expect(label).toHaveAttribute('data-readonly');
    });

    it('should set data-invalid when invalid', () => {
      render(() => <Checkbox isInvalid>Test</Checkbox>);
      const label = screen.getByRole('checkbox').closest('label')!;
      expect(label).toHaveAttribute('data-invalid');
    });

    it('should set data-focus-visible on keyboard focus', async () => {
      render(() => <Checkbox>Test</Checkbox>);
      const label = screen.getByRole('checkbox').closest('label')!;

      expect(label).not.toHaveAttribute('data-focus-visible');

      await user.tab();
      expect(label).toHaveAttribute('data-focus-visible');
    });
  });

  describe('controlled/uncontrolled', () => {
    it('should work as uncontrolled with defaultSelected', async () => {
      render(() => <Checkbox defaultSelected>Test</Checkbox>);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();

      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });

    it('should work as controlled with isSelected', () => {
      render(() => <Checkbox isSelected>Test</Checkbox>);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    it('should call onChange when clicked', async () => {
      const onChange = vi.fn();
      render(() => <Checkbox onChange={onChange}>Test</Checkbox>);

      await user.click(screen.getByRole('checkbox'));
      expect(onChange).toHaveBeenCalledWith(true);

      await user.click(screen.getByRole('checkbox'));
      expect(onChange).toHaveBeenCalledWith(false);
    });
  });

  describe('disabled state', () => {
    it('should not toggle when disabled', async () => {
      const onChange = vi.fn();
      render(() => <Checkbox isDisabled onChange={onChange}>Test</Checkbox>);

      await user.click(screen.getByRole('checkbox'));
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('readonly state', () => {
    it('should not toggle when readonly', async () => {
      const onChange = vi.fn();
      render(() => <Checkbox isReadOnly defaultSelected onChange={onChange}>Test</Checkbox>);

      await user.click(screen.getByRole('checkbox'));
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('keyboard interaction', () => {
    // React Aria tests Space key for isPressed state, not for toggle.
    // The actual toggle relies on native browser behavior (tested via click).
    // This matches react-aria-components/test/Checkbox.test.js pattern.
    it('should show pressed state on Space key', async () => {
      render(() => (
        <Checkbox class={({ isPressed }: CheckboxRenderProps) => isPressed ? 'pressed' : ''}>
          Test
        </Checkbox>
      ));

      const checkbox = screen.getByRole('checkbox');
      const label = checkbox.closest('label') as HTMLElement;

      expect(label).not.toHaveAttribute('data-pressed');
      expect(label).not.toHaveClass('pressed');

      await user.tab();
      await user.keyboard('[Space>]');
      expect(label).toHaveAttribute('data-pressed', 'true');
      expect(label).toHaveClass('pressed');

      await user.keyboard('[/Space]');
      expect(label).not.toHaveAttribute('data-pressed');
      expect(label).not.toHaveClass('pressed');
    });
  });
});

describe('CheckboxGroup', () => {
  let user: ReturnType<typeof setupUser>;

  beforeEach(() => {
    user = setupUser();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('rendering', () => {
    it('should render a checkbox group with default class', () => {
      render(() => (
        <CheckboxGroup aria-label="Options">
          <Checkbox value="a">Option A</Checkbox>
          <Checkbox value="b">Option B</Checkbox>
        </CheckboxGroup>
      ));

      const group = screen.getByRole('group');
      expect(group).toHaveClass('solidaria-CheckboxGroup');
    });

    it('should render children checkboxes', () => {
      render(() => (
        <CheckboxGroup aria-label="Options">
          <Checkbox value="a">Option A</Checkbox>
          <Checkbox value="b">Option B</Checkbox>
        </CheckboxGroup>
      ));

      expect(screen.getByText('Option A')).toBeInTheDocument();
      expect(screen.getByText('Option B')).toBeInTheDocument();
    });
  });

  describe('selection', () => {
    it('should select multiple checkboxes', async () => {
      render(() => (
        <CheckboxGroup aria-label="Options">
          <Checkbox value="a">Option A</Checkbox>
          <Checkbox value="b">Option B</Checkbox>
        </CheckboxGroup>
      ));

      const checkboxes = screen.getAllByRole('checkbox');

      await user.click(checkboxes[0]);
      expect(checkboxes[0]).toBeChecked();
      expect(checkboxes[1]).not.toBeChecked();

      await user.click(checkboxes[1]);
      expect(checkboxes[0]).toBeChecked();
      expect(checkboxes[1]).toBeChecked();
    });

    it('should support controlled value', () => {
      render(() => (
        <CheckboxGroup aria-label="Options" value={['a']}>
          <Checkbox value="a">Option A</Checkbox>
          <Checkbox value="b">Option B</Checkbox>
        </CheckboxGroup>
      ));

      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes[0]).toBeChecked();
      expect(checkboxes[1]).not.toBeChecked();
    });

    it('should support defaultValue', async () => {
      render(() => (
        <CheckboxGroup aria-label="Options" defaultValue={['b']}>
          <Checkbox value="a">Option A</Checkbox>
          <Checkbox value="b">Option B</Checkbox>
        </CheckboxGroup>
      ));

      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes[0]).not.toBeChecked();
      expect(checkboxes[1]).toBeChecked();
    });

    it('should call onChange with updated values', async () => {
      const onChange = vi.fn();
      render(() => (
        <CheckboxGroup aria-label="Options" onChange={onChange}>
          <Checkbox value="a">Option A</Checkbox>
          <Checkbox value="b">Option B</Checkbox>
        </CheckboxGroup>
      ));

      const checkboxes = screen.getAllByRole('checkbox');

      await user.click(checkboxes[0]);
      expect(onChange).toHaveBeenCalledWith(['a']);

      await user.click(checkboxes[1]);
      expect(onChange).toHaveBeenCalledWith(['a', 'b']);

      await user.click(checkboxes[0]);
      expect(onChange).toHaveBeenCalledWith(['b']);
    });
  });

  describe('data attributes', () => {
    it('should set data-disabled on group when disabled', () => {
      render(() => (
        <CheckboxGroup aria-label="Options" isDisabled>
          <Checkbox value="a">Option A</Checkbox>
        </CheckboxGroup>
      ));

      const group = screen.getByRole('group');
      expect(group).toHaveAttribute('data-disabled');
    });

    it('should set data-readonly on group when readonly', () => {
      render(() => (
        <CheckboxGroup aria-label="Options" isReadOnly>
          <Checkbox value="a">Option A</Checkbox>
        </CheckboxGroup>
      ));

      const group = screen.getByRole('group');
      expect(group).toHaveAttribute('data-readonly');
    });

    it('should set data-invalid on group when invalid', () => {
      render(() => (
        <CheckboxGroup aria-label="Options" isInvalid>
          <Checkbox value="a">Option A</Checkbox>
        </CheckboxGroup>
      ));

      const group = screen.getByRole('group');
      expect(group).toHaveAttribute('data-invalid');
    });
  });

  describe('group disabled state', () => {
    it('should disable all checkboxes when group is disabled', async () => {
      const onChange = vi.fn();
      render(() => (
        <CheckboxGroup aria-label="Options" isDisabled onChange={onChange}>
          <Checkbox value="a">Option A</Checkbox>
          <Checkbox value="b">Option B</Checkbox>
        </CheckboxGroup>
      ));

      await user.click(screen.getAllByRole('checkbox')[0]);
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('render props', () => {
    it('should support render props for children', () => {
      render(() => (
        <CheckboxGroup aria-label="Options" isDisabled>
          {(props: CheckboxGroupRenderProps) => (
            <div data-testid="content">
              {props.isDisabled ? 'Disabled Group' : 'Enabled Group'}
              <Checkbox value="a">Option A</Checkbox>
            </div>
          )}
        </CheckboxGroup>
      ));

      expect(screen.getByText('Disabled Group')).toBeInTheDocument();
    });

    it('should provide state in render props', () => {
      render(() => (
        <CheckboxGroup aria-label="Options" defaultValue={['a', 'b']}>
          {(props: CheckboxGroupRenderProps) => (
            <div data-testid="content">
              Selected: {props.state.value().join(', ')}
              <Checkbox value="a">Option A</Checkbox>
              <Checkbox value="b">Option B</Checkbox>
            </div>
          )}
        </CheckboxGroup>
      ));

      expect(screen.getByText('Selected: a, b')).toBeInTheDocument();
    });
  });
});
