/**
 * Select tests - Port of React Aria's Select.test.tsx
 *
 * Tests for Select component functionality including:
 * - Rendering
 * - Trigger behavior
 * - Selection
 * - Keyboard navigation
 * - Disabled states
 * - ARIA attributes
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@solidjs/testing-library';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectListBox,
  SelectOption,
} from '../src/Select';
import { SelectionIndicator } from '../src/SelectionIndicator';
import type { Key } from '@proyecto-viviana/solid-stately';
import { setupUser } from '@proyecto-viviana/solidaria-test-utils';

// Setup userEvent
const user = setupUser();

// Test data
interface TestItem {
  id: string;
  name: string;
}

const testItems: TestItem[] = [
  { id: 'cat', name: 'Cat' },
  { id: 'dog', name: 'Dog' },
  { id: 'kangaroo', name: 'Kangaroo' },
];

// Helper component for testing Select
function TestSelect(props: {
  selectProps?: Partial<Parameters<typeof Select<TestItem>>[0]>;
  items?: TestItem[];
}) {
  const items = props.items || testItems;
  return (
    <Select<TestItem>
      aria-label="Test Select"
      items={items}
      getKey={(item) => item.id}
      getTextValue={(item) => item.name}
      {...props.selectProps}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectListBox>
        {(item) => <SelectOption id={item.id}>{item.name}</SelectOption>}
      </SelectListBox>
    </Select>
  );
}

describe('Select', () => {
  afterEach(() => {
    cleanup();
  });

  // ============================================
  // RENDERING
  // ============================================

  describe('rendering', () => {
    it('should render with default class', () => {
      render(() => <TestSelect />);

      const select = document.querySelector('.solidaria-Select');
      expect(select).toBeInTheDocument();
    });

    it('should render trigger with default class', () => {
      render(() => <TestSelect />);

      // Select trigger uses combobox role, not button
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('solidaria-Select-trigger');
    });

    it('should render with custom class', () => {
      render(() => <TestSelect selectProps={{ class: 'my-select' }} />);

      const select = document.querySelector('.my-select');
      expect(select).toBeInTheDocument();
    });

    it('should render placeholder when no selection', () => {
      render(() => <TestSelect />);

      expect(screen.getByText('Select an option')).toBeInTheDocument();
    });

    it('should have combobox role on trigger', () => {
      render(() => <TestSelect />);

      // Select trigger uses combobox role per ARIA spec
      const trigger = screen.getByRole('combobox');
      expect(trigger).toBeInTheDocument();
    });
  });

  // ============================================
  // TRIGGER BEHAVIOR
  // ============================================

  describe('trigger behavior', () => {
    it('should open listbox on trigger click', async () => {
      render(() => <TestSelect />);

      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('should open listbox on Enter', async () => {
      render(() => <TestSelect />);

      const trigger = screen.getByRole('combobox');
      fireEvent.keyDown(trigger, { key: 'Enter' });

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('should open listbox on Space', async () => {
      render(() => <TestSelect />);

      const trigger = screen.getByRole('combobox');
      fireEvent.keyDown(trigger, { key: ' ' });

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('should display selected value in trigger', async () => {
      render(() => (
        <TestSelect selectProps={{ defaultSelectedKey: 'cat' }} />
      ));

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveTextContent('Cat');
    });

    it('should not render listbox initially', () => {
      render(() => <TestSelect />);

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('should support defaultOpen', () => {
      render(() => <TestSelect selectProps={{ defaultOpen: true }} />);

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
  });

  // ============================================
  // SELECTION
  // ============================================

  describe('selection', () => {
    it('should select item on click', async () => {
      render(() => <TestSelect selectProps={{ defaultOpen: true }} />);

      const options = screen.getAllByRole('option');
      await user.click(options[1]);

      // Check that the value is displayed in trigger
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveTextContent('Dog');
    });

    it('should fire onSelectionChange', async () => {
      const onSelectionChange = vi.fn();
      render(() => (
        <TestSelect
          selectProps={{ defaultOpen: true, onSelectionChange }}
        />
      ));

      const options = screen.getAllByRole('option');
      await user.click(options[0]);

      expect(onSelectionChange).toHaveBeenCalledWith('cat');
    });

    it('should support controlled selectedKey', () => {
      render(() => (
        <TestSelect selectProps={{ selectedKey: 'dog' }} />
      ));

      // The trigger should show the selected value
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveTextContent('Dog');
    });

    it('should support defaultSelectedKey', () => {
      render(() => (
        <TestSelect selectProps={{ defaultSelectedKey: 'kangaroo' }} />
      ));

      // The trigger should show the selected value
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveTextContent('Kangaroo');
    });

    it('should close on selection', async () => {
      render(() => <TestSelect selectProps={{ defaultOpen: true }} />);

      const options = screen.getAllByRole('option');
      await user.click(options[0]);

      // Listbox should be closed after selection
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('should set aria-selected on selected item', async () => {
      render(() => (
        <TestSelect selectProps={{ defaultOpen: true, defaultSelectedKey: 'cat' }} />
      ));

      const options = screen.getAllByRole('option');
      const catOption = options.find((o) => o.textContent === 'Cat');
      expect(catOption).toHaveAttribute('aria-selected', 'true');
    });

    it('should set data-selected on selected item', async () => {
      render(() => (
        <TestSelect selectProps={{ defaultOpen: true, defaultSelectedKey: 'cat' }} />
      ));

      const options = screen.getAllByRole('option');
      const catOption = options.find((o) => o.textContent === 'Cat');
      expect(catOption).toHaveAttribute('data-selected');
    });

    it('should support multiple selection mode', async () => {
      const onSelectionChangeKeys = vi.fn();
      render(() => (
        <TestSelect
          selectProps={{
            selectionMode: 'multiple',
            defaultOpen: true,
            defaultSelectedKeys: ['cat'],
            onSelectionChangeKeys,
          }}
        />
      ));

      const options = screen.getAllByRole('option');
      const dogOption = options.find((o) => o.textContent === 'Dog')!;
      await user.click(dogOption);

      expect(screen.getByRole('combobox')).toHaveTextContent('Cat, Dog');
      expect(screen.getByRole('listbox')).toBeInTheDocument();
      expect(onSelectionChangeKeys).toHaveBeenCalled();
    });

    it('should render SelectionIndicator only for selected option', async () => {
      render(() => (
        <Select<TestItem>
          aria-label="Test Select"
          items={testItems}
          getKey={(item) => item.id}
          getTextValue={(item) => item.name}
          defaultOpen
          defaultSelectedKey="cat"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectListBox>
            {(item) => (
              <SelectOption id={item.id}>
                {() => (
                  <>
                    {item.name}
                    <SelectionIndicator>Selected</SelectionIndicator>
                  </>
                )}
              </SelectOption>
            )}
          </SelectListBox>
        </Select>
      ));

      expect(screen.getAllByText('Selected')).toHaveLength(1);
      await user.click(screen.getByRole('option', { name: 'Dog' }));
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  // ============================================
  // KEYBOARD NAVIGATION
  // ============================================

  describe('keyboard navigation', () => {
    it('should move focus with Arrow Down', async () => {
      render(() => <TestSelect selectProps={{ defaultOpen: true }} />);

      const listbox = screen.getByRole('listbox');
      listbox.focus();

      await user.keyboard('{ArrowDown}');

      const options = screen.getAllByRole('option');
      expect(options[0]).toHaveAttribute('data-focused');
    });

    it('should move focus with Arrow Up', async () => {
      render(() => <TestSelect selectProps={{ defaultOpen: true }} />);

      const listbox = screen.getByRole('listbox');
      listbox.focus();

      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowUp}');

      const options = screen.getAllByRole('option');
      expect(options[0]).toHaveAttribute('data-focused');
    });

    it('should open and focus first on Arrow Down from trigger', async () => {
      render(() => <TestSelect />);

      await user.tab();
      await user.keyboard('{ArrowDown}');

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
  });

  // ============================================
  // DISABLED STATES
  // ============================================

  describe('disabled states', () => {
    it('should support disabledKeys', () => {
      render(() => (
        <TestSelect
          selectProps={{ defaultOpen: true, disabledKeys: ['dog'] }}
        />
      ));

      const options = screen.getAllByRole('option');
      const dogOption = options.find((o) => o.textContent === 'Dog');
      expect(dogOption).toHaveAttribute('aria-disabled', 'true');
    });

    it('should set data-disabled on disabled items', () => {
      render(() => (
        <TestSelect
          selectProps={{ defaultOpen: true, disabledKeys: ['dog'] }}
        />
      ));

      const options = screen.getAllByRole('option');
      const dogOption = options.find((o) => o.textContent === 'Dog');
      expect(dogOption).toHaveAttribute('data-disabled');
    });

    it('should not select disabled items', async () => {
      const onSelectionChange = vi.fn();
      render(() => (
        <TestSelect
          selectProps={{
            defaultOpen: true,
            disabledKeys: ['dog'],
            onSelectionChange,
          }}
        />
      ));

      const options = screen.getAllByRole('option');
      const dogOption = options.find((o) => o.textContent === 'Dog')!;
      await user.click(dogOption);

      expect(onSelectionChange).not.toHaveBeenCalled();
    });

    it('should support isDisabled on Select', () => {
      render(() => (
        <TestSelect selectProps={{ isDisabled: true }} />
      ));

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('data-disabled');
    });
  });

  // ============================================
  // OPEN/CLOSE STATE
  // ============================================

  describe('open/close state', () => {
    it('should call onOpenChange when opening', async () => {
      const onOpenChange = vi.fn();
      render(() => (
        <TestSelect selectProps={{ onOpenChange }} />
      ));

      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it('should set data-open when open', async () => {
      render(() => <TestSelect />);

      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      expect(trigger).toHaveAttribute('data-open');
    });

    it('should support controlled isOpen', () => {
      render(() => <TestSelect selectProps={{ isOpen: true }} />);

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
  });

  // ============================================
  // FOCUS/HOVER STATE
  // ============================================

  describe('focus and hover state', () => {
    it('should set data-focused on trigger focus', async () => {
      render(() => <TestSelect />);

      await user.tab();

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('data-focused');
    });

    it('should set data-focus-visible on keyboard focus', async () => {
      render(() => <TestSelect />);

      await user.tab();

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('data-focus-visible');
    });

    it('should set data-hovered on hover', async () => {
      render(() => <TestSelect selectProps={{ defaultOpen: true }} />);

      const options = screen.getAllByRole('option');
      await user.hover(options[0]);

      expect(options[0]).toHaveAttribute('data-hovered');
    });
  });

  // ============================================
  // ARIA ATTRIBUTES
  // ============================================

  describe('aria attributes', () => {
    it('should have listbox role on popup', () => {
      render(() => <TestSelect selectProps={{ defaultOpen: true }} />);

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('should have option role on items', () => {
      render(() => <TestSelect selectProps={{ defaultOpen: true }} />);

      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(3);
    });
  });
});
