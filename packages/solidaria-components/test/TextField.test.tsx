/**
 * Tests for solidaria-components TextField
 *
 * These tests verify the headless TextField component follows
 * react-aria-components patterns.
 *
 * The Label, Input, and TextArea sub-components automatically wire up to
 * TextField context for proper accessibility and focus tracking.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { PointerEventsCheckLevel } from '@testing-library/user-event';
import {
  TextField,
  Input,
  Label,
  type TextFieldRenderProps,
} from '../src/TextField';

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

describe('TextField', () => {
  let user: ReturnType<typeof setupUser>;

  beforeEach(() => {
    user = setupUser();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('rendering', () => {
    it('should render a text field with default class', () => {
      render(() => (
        <TextField aria-label="Name">
          <input />
        </TextField>
      ));
      const wrapper = screen.getByRole('textbox').closest('div');
      expect(wrapper).toHaveClass('solidaria-TextField');
    });

    it('should render a text field with custom class', () => {
      render(() => (
        <TextField aria-label="Name" class="custom-field">
          <input />
        </TextField>
      ));
      const wrapper = screen.getByRole('textbox').closest('div');
      expect(wrapper).toHaveClass('custom-field');
    });

    it('should render children', () => {
      render(() => (
        <TextField aria-label="Name">
          <input placeholder="Enter name" />
        </TextField>
      ));

      expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
    });
  });

  describe('render props', () => {
    it('should support render props for children', () => {
      render(() => (
        <TextField aria-label="Name" isDisabled>
          {(props: TextFieldRenderProps) => (
            <div data-testid="content">
              {props.isDisabled ? 'Disabled' : 'Enabled'}
              <input />
            </div>
          )}
        </TextField>
      ));

      expect(screen.getByText('Disabled')).toBeInTheDocument();
    });

    it('should support render props for class with focus', async () => {
      render(() => (
        <TextField aria-label="Name" class={(props: TextFieldRenderProps) => props.isFocused ? 'focused' : 'not-focused'}>
          <Input />
        </TextField>
      ));

      const wrapper = screen.getByRole('textbox').closest('div');
      expect(wrapper).toHaveClass('not-focused');

      await user.click(screen.getByRole('textbox'));
      expect(wrapper).toHaveClass('focused');
    });

    it('should provide isHovered in render props', async () => {
      render(() => (
        <TextField aria-label="Name" class={(props: TextFieldRenderProps) => props.isHovered ? 'hovered' : 'not-hovered'}>
          <input />
        </TextField>
      ));

      const wrapper = screen.getByRole('textbox').closest('div')!;
      expect(wrapper).toHaveClass('not-hovered');

      await user.hover(wrapper);
      expect(wrapper).toHaveClass('hovered');
    });

    it('should provide isInvalid in render props', () => {
      render(() => (
        <TextField aria-label="Name" isInvalid>
          {(props: TextFieldRenderProps) => (
            <div data-testid="content">
              {props.isInvalid ? 'Invalid' : 'Valid'}
              <input />
            </div>
          )}
        </TextField>
      ));

      expect(screen.getByText('Invalid')).toBeInTheDocument();
    });

    it('should provide isRequired in render props', () => {
      render(() => (
        <TextField aria-label="Name" isRequired>
          {(props: TextFieldRenderProps) => (
            <div data-testid="content">
              {props.isRequired ? 'Required' : 'Optional'}
              <input />
            </div>
          )}
        </TextField>
      ));

      expect(screen.getByText('Required')).toBeInTheDocument();
    });

    it('should provide isReadOnly in render props', () => {
      render(() => (
        <TextField aria-label="Name" isReadOnly>
          {(props: TextFieldRenderProps) => (
            <div data-testid="content">
              {props.isReadOnly ? 'ReadOnly' : 'Editable'}
              <input />
            </div>
          )}
        </TextField>
      ));

      expect(screen.getByText('ReadOnly')).toBeInTheDocument();
    });
  });

  describe('data attributes', () => {
    it('should set data-disabled when disabled', () => {
      render(() => (
        <TextField aria-label="Name" isDisabled>
          <input />
        </TextField>
      ));

      const wrapper = screen.getByRole('textbox').closest('div');
      expect(wrapper).toHaveAttribute('data-disabled');
    });

    it('should set data-invalid when invalid', () => {
      render(() => (
        <TextField aria-label="Name" isInvalid>
          <input />
        </TextField>
      ));

      const wrapper = screen.getByRole('textbox').closest('div');
      expect(wrapper).toHaveAttribute('data-invalid');
    });

    it('should set data-readonly when readonly', () => {
      render(() => (
        <TextField aria-label="Name" isReadOnly>
          <input />
        </TextField>
      ));

      const wrapper = screen.getByRole('textbox').closest('div');
      expect(wrapper).toHaveAttribute('data-readonly');
    });

    it('should set data-required when required', () => {
      render(() => (
        <TextField aria-label="Name" isRequired>
          <input />
        </TextField>
      ));

      const wrapper = screen.getByRole('textbox').closest('div');
      expect(wrapper).toHaveAttribute('data-required');
    });

    it('should set data-hovered when hovered', async () => {
      render(() => (
        <TextField aria-label="Name">
          <input />
        </TextField>
      ));

      const wrapper = screen.getByRole('textbox').closest('div')!;
      expect(wrapper).not.toHaveAttribute('data-hovered');

      await user.hover(wrapper);
      expect(wrapper).toHaveAttribute('data-hovered');
    });

    it('should set data-focused when focused', async () => {
      render(() => (
        <TextField aria-label="Name">
          <Input />
        </TextField>
      ));

      const wrapper = screen.getByRole('textbox').closest('div')!;
      expect(wrapper).not.toHaveAttribute('data-focused');

      await user.click(screen.getByRole('textbox'));
      expect(wrapper).toHaveAttribute('data-focused');
    });

    it('should set data-focus-visible on keyboard focus', async () => {
      render(() => (
        <TextField aria-label="Name">
          <Input />
        </TextField>
      ));

      const wrapper = screen.getByRole('textbox').closest('div')!;
      expect(wrapper).not.toHaveAttribute('data-focus-visible');

      await user.tab();
      expect(wrapper).toHaveAttribute('data-focus-visible');
    });
  });

  describe('keyboard interaction', () => {
    it('should focus input with Tab', async () => {
      render(() => (
        <TextField aria-label="Name">
          <input />
        </TextField>
      ));

      await user.tab();
      expect(document.activeElement).toBe(screen.getByRole('textbox'));
    });

    it('should allow typing', async () => {
      render(() => (
        <TextField aria-label="Name">
          <input />
        </TextField>
      ));

      const input = screen.getByRole('textbox');
      await user.type(input, 'Hello World');
      expect(input).toHaveValue('Hello World');
    });
  });

  describe('input types', () => {
    it('should support type="email"', () => {
      render(() => (
        <TextField aria-label="Email">
          <input type="email" />
        </TextField>
      ));

      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
    });

    it('should support type="password"', () => {
      render(() => (
        <TextField aria-label="Password">
          <input type="password" />
        </TextField>
      ));

      // Password inputs don't have a textbox role
      const input = document.querySelector('input[type="password"]');
      expect(input).toBeInTheDocument();
    });

    it('should support placeholder', () => {
      render(() => (
        <TextField aria-label="Search">
          <input placeholder="Search..." />
        </TextField>
      ));

      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });
  });
});
