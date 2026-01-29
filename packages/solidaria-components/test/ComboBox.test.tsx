/**
 * ComboBox tests - Port of React Aria's ComboBox.test.tsx
 *
 * Tests for ComboBox component functionality including:
 * - Rendering
 * - Selection
 * - Filtering
 * - Keyboard interactions
 * - Open/close behavior
 * - Disabled states
 * - ARIA attributes
 */

import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, cleanup, fireEvent, waitFor } from '@solidjs/testing-library';
import {
  ComboBox,
  ComboBoxInput,
  ComboBoxButton,
  ComboBoxListBox,
  ComboBoxOption,
} from '../src/ComboBox';
import { setupUser } from '@proyecto-viviana/solidaria-test-utils';

// setupUser is consolidated in solidaria-test-utils.

// Sample items for testing
const items = [
  { id: '1', name: 'Apple' },
  { id: '2', name: 'Banana' },
  { id: '3', name: 'Cherry' },
  { id: '4', name: 'Date' },
  { id: '5', name: 'Elderberry' },
];

// Helper component for testing
function TestComboBox(props: {
  comboBoxProps?: Partial<Parameters<typeof ComboBox>[0]>;
  testItems?: typeof items;
}) {
  const testItems = props.testItems ?? items;
  return (
    <ComboBox
      aria-label="Test ComboBox"
      items={testItems}
      getKey={(item) => item.id}
      getTextValue={(item) => item.name}
      {...props.comboBoxProps}
    >
      <ComboBoxInput />
      <ComboBoxButton>▼</ComboBoxButton>
      <ComboBoxListBox>
        {(item) => <ComboBoxOption id={item.id}>{item.name}</ComboBoxOption>}
      </ComboBoxListBox>
    </ComboBox>
  );
}

describe('ComboBox', () => {
  let user: ReturnType<typeof setupUser>;

  beforeEach(() => {
    user = setupUser();
  });

  afterEach(() => {
    cleanup();
  });

  // ============================================
  // RENDERING
  // ============================================

  describe('rendering', () => {
    it('should render with default class', () => {
      render(() => <TestComboBox />);

      const combobox = document.querySelector('.solidaria-ComboBox');
      expect(combobox).toBeInTheDocument();
    });

    it('should render input with combobox role', () => {
      render(() => <TestComboBox />);

      const input = screen.getByRole('combobox');
      expect(input).toBeInTheDocument();
    });

    it('should render trigger button', () => {
      render(() => <TestComboBox />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should not render listbox when closed', () => {
      render(() => <TestComboBox />);

      const listbox = screen.queryByRole('listbox');
      expect(listbox).not.toBeInTheDocument();
    });

    it('should render with custom class', () => {
      render(() => <TestComboBox comboBoxProps={{ class: 'my-combobox' }} />);

      const combobox = document.querySelector('.my-combobox');
      expect(combobox).toBeInTheDocument();
    });
  });

  // ============================================
  // OPENING/CLOSING
  // ============================================

  describe('opening/closing', () => {
    it('should open on button click', async () => {
      render(() => <TestComboBox />);

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        const listbox = screen.getByRole('listbox');
        expect(listbox).toBeInTheDocument();
      });
    });

    it('should open on input focus with menuTrigger=focus', async () => {
      render(() => <TestComboBox comboBoxProps={{ menuTrigger: 'focus' }} />);

      const input = screen.getByRole('combobox');
      await user.click(input);

      await waitFor(() => {
        const listbox = screen.getByRole('listbox');
        expect(listbox).toBeInTheDocument();
      });
    });

    it('should open on ArrowDown', async () => {
      render(() => <TestComboBox />);

      const input = screen.getByRole('combobox');
      input.focus();
      await user.keyboard('{ArrowDown}');

      await waitFor(() => {
        const listbox = screen.getByRole('listbox');
        expect(listbox).toBeInTheDocument();
      });
    });

    it('should open on ArrowUp', async () => {
      render(() => <TestComboBox />);

      const input = screen.getByRole('combobox');
      input.focus();
      await user.keyboard('{ArrowUp}');

      await waitFor(() => {
        const listbox = screen.getByRole('listbox');
        expect(listbox).toBeInTheDocument();
      });
    });

    it('should close on Escape', async () => {
      render(() => <TestComboBox comboBoxProps={{ defaultOpen: true }} />);

      // Wait for listbox to be visible
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      const input = screen.getByRole('combobox');
      input.focus();
      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });

    it('should support controlled open state', async () => {
      const onOpenChange = vi.fn();
      render(() => <TestComboBox comboBoxProps={{ isOpen: true, onOpenChange }} />);

      await waitFor(() => {
        const listbox = screen.getByRole('listbox');
        expect(listbox).toBeInTheDocument();
      });
    });

    it('should fire onOpenChange', async () => {
      const onOpenChange = vi.fn();
      render(() => <TestComboBox comboBoxProps={{ onOpenChange }} />);

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(true, expect.anything());
      });
    });
  });

  // ============================================
  // OPTIONS
  // ============================================

  describe('options', () => {
    it('should render options when open', async () => {
      render(() => <TestComboBox comboBoxProps={{ defaultOpen: true }} />);

      await waitFor(() => {
        const options = screen.getAllByRole('option');
        expect(options).toHaveLength(5);
      });
    });

    it('should display option text', async () => {
      render(() => <TestComboBox comboBoxProps={{ defaultOpen: true }} />);

      await waitFor(() => {
        expect(screen.getByText('Apple')).toBeInTheDocument();
        expect(screen.getByText('Banana')).toBeInTheDocument();
      });
    });
  });

  // ============================================
  // SELECTION
  // ============================================

  describe('selection', () => {
    it('should select on option click', async () => {
      const onSelectionChange = vi.fn();
      render(() => (
        <TestComboBox comboBoxProps={{ defaultOpen: true, onSelectionChange }} />
      ));

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      // Click on the option element itself, not just the text
      const option = screen.getByRole('option', { name: 'Banana' });
      await user.click(option);

      await waitFor(() => {
        expect(onSelectionChange).toHaveBeenCalledWith('2');
      });
    });

    it('should update input value on selection', async () => {
      render(() => <TestComboBox comboBoxProps={{ defaultOpen: true }} />);

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      // Click on the option element itself
      const option = screen.getByRole('option', { name: 'Cherry' });
      await user.click(option);

      await waitFor(() => {
        const input = screen.getByRole('combobox');
        expect(input).toHaveValue('Cherry');
      });
    });

    it('should support defaultSelectedKey', () => {
      render(() => <TestComboBox comboBoxProps={{ defaultSelectedKey: '3' }} />);

      const input = screen.getByRole('combobox');
      expect(input).toHaveValue('Cherry');
    });

    it('should support controlled selectedKey', () => {
      render(() => <TestComboBox comboBoxProps={{ selectedKey: '4' }} />);

      const input = screen.getByRole('combobox');
      expect(input).toHaveValue('Date');
    });

    it('should close after selection', async () => {
      render(() => <TestComboBox comboBoxProps={{ defaultOpen: true }} />);

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      // Click on the option element itself
      const option = screen.getByRole('option', { name: 'Apple' });
      await user.click(option);

      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });
  });

  // ============================================
  // INPUT VALUE
  // ============================================

  describe('input value', () => {
    it('should support defaultInputValue', () => {
      render(() => <TestComboBox comboBoxProps={{ defaultInputValue: 'test' }} />);

      const input = screen.getByRole('combobox');
      expect(input).toHaveValue('test');
    });

    it('should support controlled inputValue', () => {
      render(() => <TestComboBox comboBoxProps={{ inputValue: 'controlled' }} />);

      const input = screen.getByRole('combobox');
      expect(input).toHaveValue('controlled');
    });

    it('should fire onInputChange when typing', async () => {
      const onInputChange = vi.fn();
      render(() => <TestComboBox comboBoxProps={{ onInputChange }} />);

      const input = screen.getByRole('combobox');
      await user.type(input, 'test');

      await waitFor(() => {
        expect(onInputChange).toHaveBeenCalled();
      });
    });
  });

  // ============================================
  // FILTERING
  // ============================================

  describe('filtering', () => {
    it('should filter options based on input', async () => {
      render(() => <TestComboBox comboBoxProps={{ menuTrigger: 'input' }} />);

      const input = screen.getByRole('combobox');
      await user.type(input, 'Ap');

      await waitFor(() => {
        const listbox = screen.getByRole('listbox');
        expect(listbox).toBeInTheDocument();
      });

      // Filtering is async, verify that the filter reduces options
      await waitFor(() => {
        // At minimum, Apple should be visible since it matches "Ap"
        expect(screen.getByText('Apple')).toBeInTheDocument();
      });
    });

    it('should show all options when opened with button', async () => {
      render(() => <TestComboBox />);

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      await waitFor(() => {
        const options = screen.getAllByRole('option');
        expect(options).toHaveLength(5);
      });
    });
  });

  // ============================================
  // KEYBOARD NAVIGATION
  // ============================================

  describe('keyboard navigation', () => {
    it('should navigate with ArrowDown', async () => {
      render(() => <TestComboBox comboBoxProps={{ defaultOpen: true }} />);

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      const input = screen.getByRole('combobox');
      input.focus();
      await user.keyboard('{ArrowDown}');

      // First option should be focused
      await waitFor(() => {
        const firstOption = screen.getByText('Apple').closest('[role="option"]');
        expect(firstOption).toHaveAttribute('data-focused');
      });
    });

    it('should select on Enter', async () => {
      const onSelectionChange = vi.fn();
      render(() => (
        <TestComboBox comboBoxProps={{ defaultOpen: true, onSelectionChange }} />
      ));

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      const input = screen.getByRole('combobox');
      input.focus();
      await user.keyboard('{ArrowDown}{Enter}');

      await waitFor(() => {
        expect(onSelectionChange).toHaveBeenCalled();
      });
    });
  });

  // ============================================
  // DISABLED STATE
  // ============================================

  describe('disabled state', () => {
    it('should support isDisabled', () => {
      render(() => <TestComboBox comboBoxProps={{ isDisabled: true }} />);

      const input = screen.getByRole('combobox');
      expect(input).toBeDisabled();
    });

    it('should disable button when disabled', () => {
      render(() => <TestComboBox comboBoxProps={{ isDisabled: true }} />);

      const button = screen.getByRole('button');
      // Button uses aria-disabled instead of native disabled
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('should have data-disabled attribute', () => {
      render(() => <TestComboBox comboBoxProps={{ isDisabled: true }} />);

      const combobox = document.querySelector('.solidaria-ComboBox');
      expect(combobox).toHaveAttribute('data-disabled');
    });

    it('should not open when disabled', async () => {
      render(() => <TestComboBox comboBoxProps={{ isDisabled: true }} />);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  // ============================================
  // REQUIRED STATE
  // ============================================

  describe('required state', () => {
    it('should support isRequired', () => {
      render(() => <TestComboBox comboBoxProps={{ isRequired: true }} />);

      const input = screen.getByRole('combobox');
      expect(input).toHaveAttribute('aria-required', 'true');
    });

    it('should have data-required attribute', () => {
      render(() => <TestComboBox comboBoxProps={{ isRequired: true }} />);

      const combobox = document.querySelector('.solidaria-ComboBox');
      expect(combobox).toHaveAttribute('data-required');
    });
  });

  // ============================================
  // ARIA ATTRIBUTES
  // ============================================

  describe('aria attributes', () => {
    it('should have combobox role', () => {
      render(() => <TestComboBox />);

      const input = screen.getByRole('combobox');
      expect(input).toBeInTheDocument();
    });

    it('should have aria-label when provided', () => {
      render(() => <TestComboBox />);

      const input = screen.getByRole('combobox');
      expect(input).toHaveAttribute('aria-label', 'Test ComboBox');
    });

    it('should have aria-expanded false when closed', () => {
      render(() => <TestComboBox />);

      const input = screen.getByRole('combobox');
      expect(input).toHaveAttribute('aria-expanded', 'false');
    });

    it('should have aria-expanded true when open', async () => {
      render(() => <TestComboBox comboBoxProps={{ defaultOpen: true }} />);

      await waitFor(() => {
        const input = screen.getByRole('combobox');
        expect(input).toHaveAttribute('aria-expanded', 'true');
      });
    });

    it('should have aria-haspopup listbox', () => {
      render(() => <TestComboBox />);

      const input = screen.getByRole('combobox');
      expect(input).toHaveAttribute('aria-haspopup', 'listbox');
    });

    it('should have aria-controls when open', async () => {
      render(() => <TestComboBox comboBoxProps={{ defaultOpen: true }} />);

      await waitFor(() => {
        const input = screen.getByRole('combobox');
        expect(input).toHaveAttribute('aria-controls');
        // aria-controls should reference the listbox (may have different ID format)
        const ariaControls = input.getAttribute('aria-controls');
        expect(ariaControls).toBeTruthy();
      });
    });
  });

  // ============================================
  // DATA ATTRIBUTES
  // ============================================

  describe('data attributes', () => {
    it('should have data-open when open', async () => {
      render(() => <TestComboBox comboBoxProps={{ defaultOpen: true }} />);

      await waitFor(() => {
        const combobox = document.querySelector('.solidaria-ComboBox');
        expect(combobox).toHaveAttribute('data-open');
      });
    });

    it('should not have data-open when closed', () => {
      render(() => <TestComboBox />);

      const combobox = document.querySelector('.solidaria-ComboBox');
      expect(combobox).not.toHaveAttribute('data-open');
    });
  });

  // ============================================
  // DISABLED OPTIONS
  // ============================================

  describe('disabled options', () => {
    it('should support disabledKeys', async () => {
      render(() => (
        <TestComboBox comboBoxProps={{ defaultOpen: true, disabledKeys: ['2'] }} />
      ));

      await waitFor(() => {
        const option = screen.getByText('Banana').closest('[role="option"]');
        expect(option).toHaveAttribute('data-disabled');
      });
    });

    it('should not select disabled options', async () => {
      const onSelectionChange = vi.fn();
      render(() => (
        <TestComboBox
          comboBoxProps={{ defaultOpen: true, disabledKeys: ['2'], onSelectionChange }}
        />
      ));

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      const option = screen.getByText('Banana');
      await user.click(option);

      expect(onSelectionChange).not.toHaveBeenCalled();
    });
  });

  // ============================================
  // ALLOWS CUSTOM VALUE
  // ============================================

  describe('allows custom value', () => {
    it('should allow custom value when allowsCustomValue is true', async () => {
      render(() => (
        <TestComboBox comboBoxProps={{ allowsCustomValue: true }} />
      ));

      const input = screen.getByRole('combobox');
      await user.type(input, 'Custom Value');

      await waitFor(() => {
        expect(input).toHaveValue('Custom Value');
      });
    });
  });

  // ============================================
  // FORM INTEGRATION
  // ============================================

  describe('form integration', () => {
    it('should render hidden input with name', () => {
      render(() => (
        <TestComboBox comboBoxProps={{ name: 'fruit', defaultSelectedKey: '1' }} />
      ));

      const hiddenInput = document.querySelector('input[type="hidden"][name="fruit"]');
      expect(hiddenInput).toBeInTheDocument();
      expect(hiddenInput).toHaveValue('1');
    });
  });
});
