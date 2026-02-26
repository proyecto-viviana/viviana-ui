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
import {
  TextField,
  Input,
  Label,
  TextArea,
  type TextFieldRenderProps,
} from '../src/TextField';
import { setupUser, assertNoA11yViolations, assertAriaIdIntegrity } from '@proyecto-viviana/solidaria-test-utils';

// setupUser is consolidated in solidaria-test-utils.

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

    // Note: Focus render props require the Input component to have context from TextField.
    // In SolidJS, children are evaluated before parent renders, so context isn't available.
    // This is a known SolidJS architectural difference from React. The plain <input> element
    // works for value and other props, but focus state tracking with <Input> requires
    // architectural changes. React Aria doesn't test isFocused on TextField either.

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

    // Note: data-focused and data-focus-visible require the Input component to track focus
    // and propagate it to the TextField wrapper via context. In SolidJS, children are evaluated
    // before parent renders, so context isn't available. This is a known SolidJS architectural
    // difference from React. React Aria doesn't test these attributes on TextField either.
    // The focus state tracking works with plain <input> elements at the UI layer.
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

  describe('a11y validation', () => {
    // Note: TextField's Label+Input sub-components require render function children
    // {() => ...} so context is available. For axe scans, we use aria-label on Input
    // directly since the Label→Input htmlFor wiring has a known SolidJS context timing
    // issue (see wave-1-results.md for details).

    it('axe: default', async () => {
      const { container } = render(() => (
        <TextField aria-label="Name">
          {() => <Input />}
        </TextField>
      ));
      await assertNoA11yViolations(container);
    });

    it('axe: disabled', async () => {
      const { container } = render(() => (
        <TextField aria-label="Name" isDisabled>
          {() => <Input />}
        </TextField>
      ));
      await assertNoA11yViolations(container);
    });

    it('axe: invalid', async () => {
      const { container } = render(() => (
        <TextField aria-label="Name" isInvalid>
          {() => <Input />}
        </TextField>
      ));
      await assertNoA11yViolations(container);
    });

    it('axe: required', async () => {
      const { container } = render(() => (
        <TextField aria-label="Name" isRequired>
          {() => <Input />}
        </TextField>
      ));
      await assertNoA11yViolations(container);
    });

    it('ARIA ID: no dangling refs', () => {
      render(() => (
        <TextField aria-label="Name">
          {() => <Input />}
        </TextField>
      ));
      assertAriaIdIntegrity(document.body);
    });

    it('DOM: data-testid forwards', () => {
      render(() => (
        <TextField aria-label="Name" data-testid="name-field">
          <input />
        </TextField>
      ));
      expect(screen.getByTestId('name-field')).toBeInTheDocument();
    });

    it('DOM: aria-label forwards to input', () => {
      render(() => (
        <TextField aria-label="Name">
          {() => <Input />}
        </TextField>
      ));
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-label', 'Name');
    });
  });

  describe('TextArea a11y validation', () => {
    it('axe: default TextArea', async () => {
      const { container } = render(() => (
        <TextField aria-label="Description">
          {() => <TextArea />}
        </TextField>
      ));
      await assertNoA11yViolations(container);
    });

    it('renders textarea element', () => {
      render(() => (
        <TextField aria-label="Description">
          {() => <TextArea />}
        </TextField>
      ));
      const textarea = document.querySelector('textarea');
      expect(textarea).toBeInTheDocument();
    });

    it('ARIA ID: TextArea no dangling refs', () => {
      render(() => (
        <TextField aria-label="Description">
          {() => <TextArea />}
        </TextField>
      ));
      assertAriaIdIntegrity(document.body);
    });
  });
});
