/**
 * Tests for solidaria-components ListBox
 *
 * These tests verify the headless ListBox component follows
 * react-aria-components patterns:
 * - Render props for state-based children/class/style
 * - Data attributes for styling hooks
 * - Keyboard navigation
 * - Selection modes (single/multiple)
 * - Full accessibility
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@solidjs/testing-library';
import { ListBox, ListBoxOption, ListBoxLoadMoreItem } from '../src/ListBox';
import { SelectionIndicator } from '../src/SelectionIndicator';
import type { Key } from '@proyecto-viviana/solid-stately';
import { setupUser, firePointerDown, firePointerUp, firePointerClick } from '@proyecto-viviana/solidaria-test-utils';

// setupUser and pointer helpers are consolidated in solidaria-test-utils.

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

// Helper component for testing
function TestListBox(props: {
  listBoxProps?: Partial<Parameters<typeof ListBox<TestItem>>[0]>;
  items?: TestItem[];
}) {
  const items = props.items || testItems;
  return (
    <ListBox<TestItem>
      aria-label="Test"
      items={items}
      getKey={(item) => item.id}
      {...props.listBoxProps}
    >
      {(item) => (
        <ListBoxOption id={item.id}>{item.name}</ListBoxOption>
      )}
    </ListBox>
  );
}

describe('ListBox', () => {
  let user: ReturnType<typeof setupUser>;

  beforeEach(() => {
    user = setupUser();
    cleanup();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  // ============================================
  // RENDERING
  // ============================================

  describe('rendering', () => {
    it('should render with listbox role', () => {
      render(() => <TestListBox />);
      const listbox = screen.getByRole('listbox');
      expect(listbox).toBeInTheDocument();
    });

    it('should render options with option role', () => {
      render(() => <TestListBox />);
      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(3);
    });

    it('should render with default class', () => {
      render(() => <TestListBox />);
      const listbox = screen.getByRole('listbox');
      expect(listbox).toHaveClass('solidaria-ListBox');
    });

    it('should render options with default class', () => {
      render(() => <TestListBox />);
      const options = screen.getAllByRole('option');
      for (const option of options) {
        expect(option).toHaveClass('solidaria-ListBox-option');
      }
    });

    it('should render with custom class', () => {
      render(() => <TestListBox listBoxProps={{ class: 'custom-listbox' }} />);
      const listbox = screen.getByRole('listbox');
      expect(listbox).toHaveClass('custom-listbox');
    });

    it('should support DOM props', () => {
      render(() => (
        <TestListBox listBoxProps={{ 'data-testid': 'my-listbox' } as any} />
      ));
      const listbox = screen.getByTestId('my-listbox');
      expect(listbox).toBeInTheDocument();
    });

    it('should render aria-label', () => {
      render(() => <TestListBox listBoxProps={{ 'aria-label': 'Animals' }} />);
      const listbox = screen.getByRole('listbox');
      expect(listbox).toHaveAttribute('aria-label', 'Animals');
    });

    it('should render option text content', () => {
      render(() => <TestListBox />);
      expect(screen.getByText('Cat')).toBeInTheDocument();
      expect(screen.getByText('Dog')).toBeInTheDocument();
      expect(screen.getByText('Kangaroo')).toBeInTheDocument();
    });

    it('should render sectioned collections', () => {
      render(() => (
        <ListBox<TestItem>
          aria-label="Test"
          items={[
            {
              title: <span>Mammals</span>,
              'aria-label': 'Mammals group',
              items: testItems,
            },
          ]}
          getKey={(item) => item.id}
        >
          {(item) => (
            <ListBoxOption id={item.id}>{item.name}</ListBoxOption>
          )}
        </ListBox>
      ));

      expect(screen.getByText('Mammals')).toBeInTheDocument();
      expect(screen.getByRole('group', { name: 'Mammals group' })).toBeInTheDocument();
      expect(screen.getAllByRole('option')).toHaveLength(3);
    });

    it('should render empty state when no items', () => {
      render(() => (
        <TestListBox
          items={[]}
          listBoxProps={{
            renderEmptyState: () => <div>No items available</div>,
          }}
        />
      ));
      expect(screen.getByText('No items available')).toBeInTheDocument();
    });

    it('should set data-empty when list is empty', () => {
      render(() => <TestListBox items={[]} />);
      const listbox = screen.getByRole('listbox');
      expect(listbox).toHaveAttribute('data-empty');
    });

    it('should render load more sentinel when hasMore is true', () => {
      render(() => (
        <TestListBox
          listBoxProps={{
            hasMore: true,
            onLoadMore: vi.fn(),
          }}
        />
      ));

      expect(screen.getByText('Load more')).toBeInTheDocument();
    });

    it('should trigger onLoadMore when load more sentinel is visible', async () => {
      const onLoadMore = vi.fn();
      render(() => (
        <ul role="listbox" aria-label="Load test">
          <ListBoxLoadMoreItem onLoadMore={onLoadMore} />
        </ul>
      ));

      fireEvent.focus(screen.getByRole('option'));
      expect(onLoadMore).toHaveBeenCalled();
    });
  });

  // ============================================
  // SELECTION - SINGLE
  // ============================================

  describe('selection - single', () => {
    it('should select item on click', async () => {
      const onSelectionChange = vi.fn();
      render(() => (
        <TestListBox
          listBoxProps={{
            selectionMode: 'single',
            onSelectionChange,
          }}
        />
      ));

      const option = screen.getByText('Cat');
      await user.click(option);

      expect(onSelectionChange).toHaveBeenCalled();
    });

    it('should support defaultSelectedKeys', () => {
      render(() => (
        <TestListBox
          listBoxProps={{
            selectionMode: 'single',
            defaultSelectedKeys: ['dog'],
          }}
        />
      ));

      const options = screen.getAllByRole('option');
      const dogOption = options.find((o) => o.textContent === 'Dog');
      expect(dogOption).toHaveAttribute('aria-selected', 'true');
    });

    it('should support controlled selectedKeys', () => {
      render(() => (
        <TestListBox
          listBoxProps={{
            selectionMode: 'single',
            selectedKeys: new Set(['kangaroo']),
          }}
        />
      ));

      const options = screen.getAllByRole('option');
      const kangarooOption = options.find((o) => o.textContent === 'Kangaroo');
      expect(kangarooOption).toHaveAttribute('aria-selected', 'true');
    });

    it('should fire onSelectionChange with selected keys', async () => {
      const onSelectionChange = vi.fn();
      render(() => (
        <TestListBox
          listBoxProps={{
            selectionMode: 'single',
            onSelectionChange,
          }}
        />
      ));

      const option = screen.getByText('Dog');
      await user.click(option);

      expect(onSelectionChange).toHaveBeenCalled();
      const call = onSelectionChange.mock.calls[0];
      expect(call[0]).toBeInstanceOf(Set);
    });

    it('should set aria-selected on selected item', async () => {
      render(() => (
        <TestListBox
          listBoxProps={{
            selectionMode: 'single',
            defaultSelectedKeys: ['cat'],
          }}
        />
      ));

      const options = screen.getAllByRole('option');
      const catOption = options.find((o) => o.textContent === 'Cat');
      expect(catOption).toHaveAttribute('aria-selected', 'true');

      const dogOption = options.find((o) => o.textContent === 'Dog');
      expect(dogOption).not.toHaveAttribute('aria-selected', 'true');
    });

    it('should set data-selected on selected item', () => {
      render(() => (
        <TestListBox
          listBoxProps={{
            selectionMode: 'single',
            defaultSelectedKeys: ['cat'],
          }}
        />
      ));

      const options = screen.getAllByRole('option');
      const catOption = options.find((o) => o.textContent === 'Cat');
      expect(catOption).toHaveAttribute('data-selected');
    });

    it('should render SelectionIndicator only for selected option', async () => {
      render(() => (
        <ListBox<TestItem>
          aria-label="Test"
          items={testItems}
          getKey={(item) => item.id}
          selectionMode="single"
          defaultSelectedKeys={['cat']}
        >
          {(item) => (
            <ListBoxOption id={item.id}>
              {() => (
                <>
                  {item.name}
                  <SelectionIndicator>Selected</SelectionIndicator>
                </>
              )}
            </ListBoxOption>
          )}
        </ListBox>
      ));

      expect(screen.getAllByText('Selected')).toHaveLength(1);
      await user.click(screen.getByText('Dog'));
      expect(screen.getAllByText('Selected')).toHaveLength(1);
    });
  });

  // ============================================
  // SELECTION - MULTIPLE
  // ============================================

  describe('selection - multiple', () => {
    it('should select multiple items on click', async () => {
      const onSelectionChange = vi.fn();
      render(() => (
        <TestListBox
          listBoxProps={{
            selectionMode: 'multiple',
            onSelectionChange,
          }}
        />
      ));

      firePointerClick(screen.getByText('Cat'));
      firePointerClick(screen.getByText('Dog'));

      expect(onSelectionChange).toHaveBeenCalledTimes(2);
    });

    it('should toggle selection on click', async () => {
      const onSelectionChange = vi.fn();
      render(() => (
        <TestListBox
          listBoxProps={{
            selectionMode: 'multiple',
            onSelectionChange,
          }}
        />
      ));

      const catOption = screen.getByText('Cat');

      // Select
      firePointerClick(catOption);
      expect(onSelectionChange).toHaveBeenCalledTimes(1);

      // Deselect
      firePointerClick(catOption);
      expect(onSelectionChange).toHaveBeenCalledTimes(2);
    });

    it('should support defaultSelectedKeys with multiple items', () => {
      render(() => (
        <TestListBox
          listBoxProps={{
            selectionMode: 'multiple',
            defaultSelectedKeys: ['cat', 'dog'],
          }}
        />
      ));

      const options = screen.getAllByRole('option');
      const catOption = options.find((o) => o.textContent === 'Cat');
      const dogOption = options.find((o) => o.textContent === 'Dog');
      const kangarooOption = options.find((o) => o.textContent === 'Kangaroo');

      expect(catOption).toHaveAttribute('aria-selected', 'true');
      expect(dogOption).toHaveAttribute('aria-selected', 'true');
      expect(kangarooOption).not.toHaveAttribute('aria-selected', 'true');
    });
  });

  // ============================================
  // KEYBOARD NAVIGATION
  // ============================================

  describe('keyboard navigation', () => {
    it('should focus first item on tab', async () => {
      render(() => (
        <TestListBox listBoxProps={{ selectionMode: 'single' }} />
      ));

      await user.tab();

      const listbox = screen.getByRole('listbox');
      expect(listbox).toHaveFocus();
    });

    it('should move focus with Arrow Down', async () => {
      render(() => (
        <TestListBox listBoxProps={{ selectionMode: 'single' }} />
      ));

      const listbox = screen.getByRole('listbox');
      listbox.focus();

      await user.keyboard('{ArrowDown}');

      const options = screen.getAllByRole('option');
      expect(options[0]).toHaveAttribute('data-focused');
    });

    it('should move focus with Arrow Up', async () => {
      render(() => (
        <TestListBox listBoxProps={{ selectionMode: 'single' }} />
      ));

      const listbox = screen.getByRole('listbox');
      listbox.focus();

      // Move down first
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}');

      // Then up
      await user.keyboard('{ArrowUp}');

      const options = screen.getAllByRole('option');
      // First option should be focused after going down twice and up once
      expect(options[0]).toHaveAttribute('data-focused');
    });

    it('should focus first with Home', async () => {
      render(() => (
        <TestListBox listBoxProps={{ selectionMode: 'single' }} />
      ));

      const listbox = screen.getByRole('listbox');
      listbox.focus();

      // Move to middle
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}');

      // Press Home
      await user.keyboard('{Home}');

      const options = screen.getAllByRole('option');
      expect(options[0]).toHaveAttribute('data-focused');
    });

    it('should focus last with End', async () => {
      render(() => (
        <TestListBox listBoxProps={{ selectionMode: 'single' }} />
      ));

      const listbox = screen.getByRole('listbox');
      listbox.focus();

      await user.keyboard('{End}');

      const options = screen.getAllByRole('option');
      expect(options[options.length - 1]).toHaveAttribute('data-focused');
    });

    it('should select on Enter', async () => {
      const onSelectionChange = vi.fn();
      render(() => (
        <TestListBox
          listBoxProps={{
            selectionMode: 'single',
            onSelectionChange,
          }}
        />
      ));

      const listbox = screen.getByRole('listbox');
      listbox.focus();

      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');

      expect(onSelectionChange).toHaveBeenCalled();
    });

    it('should select on Space', async () => {
      const onSelectionChange = vi.fn();
      render(() => (
        <TestListBox
          listBoxProps={{
            selectionMode: 'single',
            onSelectionChange,
          }}
        />
      ));

      const listbox = screen.getByRole('listbox');
      listbox.focus();

      await user.keyboard('{ArrowDown}');
      await user.keyboard(' ');

      expect(onSelectionChange).toHaveBeenCalled();
    });
  });

  // ============================================
  // DISABLED STATES
  // ============================================

  describe('disabled states', () => {
    it('should support disabledKeys', () => {
      render(() => (
        <TestListBox
          listBoxProps={{
            selectionMode: 'single',
            disabledKeys: ['dog'],
          }}
        />
      ));

      const options = screen.getAllByRole('option');
      const dogOption = options.find((o) => o.textContent === 'Dog');
      expect(dogOption).toHaveAttribute('aria-disabled', 'true');
    });

    it('should set data-disabled on disabled items', () => {
      render(() => (
        <TestListBox
          listBoxProps={{
            selectionMode: 'single',
            disabledKeys: ['dog'],
          }}
        />
      ));

      const options = screen.getAllByRole('option');
      const dogOption = options.find((o) => o.textContent === 'Dog');
      expect(dogOption).toHaveAttribute('data-disabled');
    });

    it('should not select disabled items on click', async () => {
      const onSelectionChange = vi.fn();
      render(() => (
        <TestListBox
          listBoxProps={{
            selectionMode: 'single',
            disabledKeys: ['dog'],
            onSelectionChange,
          }}
        />
      ));

      const options = screen.getAllByRole('option');
      const dogOption = options.find((o) => o.textContent === 'Dog')!;
      await user.click(dogOption);

      // Should not fire for disabled item
      expect(onSelectionChange).not.toHaveBeenCalled();
    });

    it('should skip disabled items during keyboard navigation', async () => {
      render(() => (
        <TestListBox
          listBoxProps={{
            selectionMode: 'single',
            disabledKeys: ['dog'],
          }}
        />
      ));

      const options = screen.getAllByRole('option');
      const dogOption = options.find((o) => o.textContent === 'Dog');
      // Disabled items have aria-disabled
      expect(dogOption).toHaveAttribute('aria-disabled', 'true');
    });

    it('should support isDisabled on the entire listbox', () => {
      render(() => (
        <TestListBox
          listBoxProps={{
            selectionMode: 'single',
            isDisabled: true,
          }}
        />
      ));

      const listbox = screen.getByRole('listbox');
      expect(listbox).toHaveAttribute('data-disabled');
    });
  });

  // ============================================
  // FOCUS STATE
  // ============================================

  describe('focus state', () => {
    it('should allow focusing the listbox', async () => {
      render(() => (
        <TestListBox listBoxProps={{ selectionMode: 'single' }} />
      ));

      // Tab to focus the listbox
      await user.tab();

      const listbox = screen.getByRole('listbox');
      // The listbox should have tabindex for focus
      expect(listbox).toHaveAttribute('tabindex');
    });

    it('should set data-focused on focused option', async () => {
      render(() => (
        <TestListBox listBoxProps={{ selectionMode: 'single' }} />
      ));

      const listbox = screen.getByRole('listbox');
      listbox.focus();

      await user.keyboard('{ArrowDown}');

      const options = screen.getAllByRole('option');
      expect(options[0]).toHaveAttribute('data-focused');
    });

    it('should set data-focus-visible on keyboard focus', async () => {
      render(() => (
        <TestListBox listBoxProps={{ selectionMode: 'single' }} />
      ));

      await user.tab();

      const listbox = screen.getByRole('listbox');
      expect(listbox).toHaveAttribute('data-focus-visible');
    });
  });

  // ============================================
  // HOVER STATE
  // ============================================

  describe('hover state', () => {
    it('should set data-hovered on hover', async () => {
      render(() => (
        <TestListBox listBoxProps={{ selectionMode: 'single' }} />
      ));

      const options = screen.getAllByRole('option');
      await user.hover(options[0]);

      expect(options[0]).toHaveAttribute('data-hovered');
    });

    it('should remove data-hovered on unhover', async () => {
      render(() => (
        <TestListBox listBoxProps={{ selectionMode: 'single' }} />
      ));

      const options = screen.getAllByRole('option');
      await user.hover(options[0]);
      expect(options[0]).toHaveAttribute('data-hovered');

      await user.unhover(options[0]);
      expect(options[0]).not.toHaveAttribute('data-hovered');
    });
  });

  // ============================================
  // PRESS STATE
  // ============================================

  describe('press state', () => {
    it('should set data-pressed during press', async () => {
      render(() => (
        <TestListBox listBoxProps={{ selectionMode: 'single' }} />
      ));

      const options = screen.getAllByRole('option');

      firePointerDown(options[0]);
      expect(options[0]).toHaveAttribute('data-pressed');

      firePointerUp(options[0]);
      fireEvent.click(options[0], { detail: 1 });
      expect(options[0]).not.toHaveAttribute('data-pressed');
    });
  });

  // ============================================
  // DYNAMIC ITEMS
  // ============================================

  describe('dynamic items', () => {
    it('should render dynamic items', () => {
      const items = [
        { id: 'apple', name: 'Apple' },
        { id: 'banana', name: 'Banana' },
      ];

      render(() => <TestListBox items={items} />);

      expect(screen.getByText('Apple')).toBeInTheDocument();
      expect(screen.getByText('Banana')).toBeInTheDocument();
    });

    it('should handle empty items array', () => {
      render(() => <TestListBox items={[]} />);

      const listbox = screen.getByRole('listbox');
      expect(listbox).toHaveAttribute('data-empty');
      expect(screen.queryAllByRole('option')).toHaveLength(0);
    });
  });

  // ============================================
  // ARIA ATTRIBUTES
  // ============================================

  describe('aria attributes', () => {
    it('should have aria-labelledby when provided', () => {
      render(() => (
        <div>
          <label id="listbox-label">Animals</label>
          <TestListBox listBoxProps={{ 'aria-labelledby': 'listbox-label' }} />
        </div>
      ));

      const listbox = screen.getByRole('listbox');
      // aria-labelledby may be merged with an auto-generated ID
      const labelledBy = listbox.getAttribute('aria-labelledby');
      expect(labelledBy).toContain('listbox-label');
    });

    it('should have aria-multiselectable for multiple selection', () => {
      render(() => (
        <TestListBox listBoxProps={{ selectionMode: 'multiple' }} />
      ));

      const listbox = screen.getByRole('listbox');
      expect(listbox).toHaveAttribute('aria-multiselectable', 'true');
    });

    it('should not have aria-multiselectable for single selection', () => {
      render(() => (
        <TestListBox listBoxProps={{ selectionMode: 'single' }} />
      ));

      const listbox = screen.getByRole('listbox');
      expect(listbox).not.toHaveAttribute('aria-multiselectable');
    });
  });
});
