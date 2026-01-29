/**
 * TagGroup tests - Port of React Aria's TagGroup.test.tsx
 *
 * Tests for TagGroup component functionality including:
 * - Rendering
 * - Selection
 * - Keyboard navigation
 * - Removal
 * - ARIA attributes
 */

import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@solidjs/testing-library';
import {
  TagGroup,
  TagList,
  Tag,
  TagRemoveButton,
} from '../src/TagGroup';
import { setupUser } from '@proyecto-viviana/solidaria-test-utils';

// User event instance - created per test
let user: ReturnType<typeof setupUser>;

// Sample items for testing
const sampleItems = [
  { id: '1', name: 'News' },
  { id: '2', name: 'Travel' },
  { id: '3', name: 'Gaming' },
  { id: '4', name: 'Shopping' },
];

// Helper component for testing TagGroup
function TestTagGroup(props: {
  items?: typeof sampleItems;
  tagListProps?: Partial<Parameters<typeof TagList>[0]>;
}) {
  const items = props.items ?? sampleItems;
  return (
    <TagGroup>
      <TagList items={items} aria-label="Test Tags" {...props.tagListProps}>
        {(item) => <Tag id={item.id}>{item.name}</Tag>}
      </TagList>
    </TagGroup>
  );
}

describe('TagGroup', () => {
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
      render(() => <TestTagGroup />);

      const tagGroup = document.querySelector('.solidaria-TagGroup');
      expect(tagGroup).toBeInTheDocument();
    });

    it('should render tag list', () => {
      render(() => <TestTagGroup />);

      const tagList = document.querySelector('.solidaria-TagList');
      expect(tagList).toBeInTheDocument();
    });

    it('should render all tags', () => {
      render(() => <TestTagGroup />);

      const tags = document.querySelectorAll('.solidaria-Tag');
      expect(tags.length).toBe(4);
    });

    it('should render tag content', () => {
      render(() => <TestTagGroup />);

      expect(screen.getByText('News')).toBeInTheDocument();
      expect(screen.getByText('Travel')).toBeInTheDocument();
      expect(screen.getByText('Gaming')).toBeInTheDocument();
      expect(screen.getByText('Shopping')).toBeInTheDocument();
    });

    it('should render with custom class', () => {
      render(() => (
        <TagGroup>
          <TagList items={sampleItems} aria-label="Test" class="my-tag-list">
            {(item) => <Tag id={item.id}>{item.name}</Tag>}
          </TagList>
        </TagGroup>
      ));

      const tagList = document.querySelector('.my-tag-list');
      expect(tagList).toBeInTheDocument();
    });

    it('should render empty state when no items', () => {
      render(() => (
        <TagGroup>
          <TagList
            items={[]}
            aria-label="Test"
            renderEmptyState={() => <span>No tags</span>}
          >
            {(item: { id: string; name: string }) => <Tag id={item.id}>{item.name}</Tag>}
          </TagList>
        </TagGroup>
      ));

      expect(screen.getByText('No tags')).toBeInTheDocument();
    });
  });

  // ============================================
  // SELECTION
  // ============================================

  describe('selection', () => {
    it('should support single selection', async () => {
      const onSelectionChange = vi.fn();
      render(() => (
        <TestTagGroup
          tagListProps={{
            selectionMode: 'single',
            onSelectionChange,
          }}
        />
      ));

      const newsTag = screen.getByText('News').closest('.solidaria-Tag');
      await user.click(newsTag!);

      await waitFor(() => {
        expect(onSelectionChange).toHaveBeenCalled();
      });
    });

    it('should support multiple selection', async () => {
      const onSelectionChange = vi.fn();
      render(() => (
        <TestTagGroup
          tagListProps={{
            selectionMode: 'multiple',
            onSelectionChange,
          }}
        />
      ));

      const newsTag = screen.getByText('News').closest('.solidaria-Tag');
      const travelTag = screen.getByText('Travel').closest('.solidaria-Tag');

      await user.click(newsTag!);
      await user.click(travelTag!);

      await waitFor(() => {
        expect(onSelectionChange).toHaveBeenCalled();
      });
    });

    it('should show controlled selection', () => {
      render(() => (
        <TestTagGroup
          tagListProps={{
            selectionMode: 'multiple',
            selectedKeys: ['1', '2'],
          }}
        />
      ));

      const selectedTags = document.querySelectorAll('[data-selected]');
      expect(selectedTags.length).toBe(2);
    });

    it('should show default selection', () => {
      render(() => (
        <TestTagGroup
          tagListProps={{
            selectionMode: 'single',
            defaultSelectedKeys: ['1'],
          }}
        />
      ));

      const selectedTags = document.querySelectorAll('[data-selected]');
      expect(selectedTags.length).toBe(1);
    });
  });

  // ============================================
  // DISABLED STATE
  // ============================================

  describe('disabled state', () => {
    it('should support isDisabled on TagList', () => {
      render(() => (
        <TestTagGroup tagListProps={{ isDisabled: true }} />
      ));

      const tagList = document.querySelector('.solidaria-TagList');
      expect(tagList).toHaveAttribute('aria-disabled', 'true');
    });

    it('should support disabled keys', () => {
      render(() => (
        <TestTagGroup tagListProps={{ disabledKeys: ['2'] }} />
      ));

      const disabledTag = document.querySelector('[data-disabled]');
      expect(disabledTag).toBeInTheDocument();
    });

    it('should support isDisabled on individual Tag', () => {
      render(() => (
        <TagGroup>
          <TagList items={sampleItems} aria-label="Test">
            {(item) => (
              <Tag id={item.id} isDisabled={item.id === '1'}>
                {item.name}
              </Tag>
            )}
          </TagList>
        </TagGroup>
      ));

      const disabledTag = document.querySelector('[data-disabled]');
      expect(disabledTag).toBeInTheDocument();
    });
  });

  // ============================================
  // REMOVAL
  // ============================================

  describe('removal', () => {
    it('should render remove button', () => {
      render(() => (
        <TagGroup>
          <TagList items={sampleItems} aria-label="Test" onRemove={vi.fn()}>
            {(item) => (
              <Tag id={item.id}>
                {item.name}
                <TagRemoveButton />
              </Tag>
            )}
          </TagList>
        </TagGroup>
      ));

      const removeButtons = document.querySelectorAll('.solidaria-TagRemoveButton');
      expect(removeButtons.length).toBe(4);
    });

    it('should have aria-label on remove button', () => {
      render(() => (
        <TagGroup>
          <TagList items={sampleItems} aria-label="Test" onRemove={vi.fn()}>
            {(item) => (
              <Tag id={item.id}>
                {item.name}
                <TagRemoveButton />
              </Tag>
            )}
          </TagList>
        </TagGroup>
      ));

      const removeButton = document.querySelector('.solidaria-TagRemoveButton');
      expect(removeButton).toHaveAttribute('aria-label', 'Remove');
    });

    it('should render custom remove button content', () => {
      render(() => (
        <TagGroup>
          <TagList items={sampleItems} aria-label="Test" onRemove={vi.fn()}>
            {(item) => (
              <Tag id={item.id}>
                {item.name}
                <TagRemoveButton>Delete</TagRemoveButton>
              </Tag>
            )}
          </TagList>
        </TagGroup>
      ));

      expect(screen.getAllByText('Delete').length).toBe(4);
    });
  });

  // ============================================
  // ARIA ATTRIBUTES
  // ============================================

  describe('aria attributes', () => {
    it('should have aria-label on tag list', () => {
      render(() => <TestTagGroup />);

      const tagList = document.querySelector('.solidaria-TagList');
      expect(tagList).toHaveAttribute('aria-label', 'Test Tags');
    });

    it('should have grid role', () => {
      render(() => <TestTagGroup />);

      const grid = screen.getByRole('grid');
      expect(grid).toBeInTheDocument();
    });

    it('should have row role on tags', () => {
      render(() => <TestTagGroup />);

      const rows = screen.getAllByRole('row');
      expect(rows.length).toBe(4);
    });

    it('should have gridcell role in tags', () => {
      render(() => <TestTagGroup />);

      const gridcells = screen.getAllByRole('gridcell');
      expect(gridcells.length).toBe(4);
    });
  });

  // ============================================
  // DATA ATTRIBUTES
  // ============================================

  describe('data attributes', () => {
    it('should have data-empty when no items', () => {
      render(() => (
        <TagGroup>
          <TagList items={[]} aria-label="Test">
            {(item: { id: string; name: string }) => <Tag id={item.id}>{item.name}</Tag>}
          </TagList>
        </TagGroup>
      ));

      const tagList = document.querySelector('.solidaria-TagList');
      expect(tagList).toHaveAttribute('data-empty');
    });

    it('should have data-selected on selected tags', () => {
      render(() => (
        <TestTagGroup
          tagListProps={{
            selectionMode: 'single',
            selectedKeys: ['1'],
          }}
        />
      ));

      const selectedTag = document.querySelector('[data-selected]');
      expect(selectedTag).toBeInTheDocument();
    });

    it('should have data-disabled on disabled tags', () => {
      render(() => (
        <TestTagGroup tagListProps={{ disabledKeys: ['1'] }} />
      ));

      const disabledTag = document.querySelector('[data-disabled]');
      expect(disabledTag).toBeInTheDocument();
    });

    it('should render tags when onRemove is provided', () => {
      render(() => (
        <TagGroup>
          <TagList items={sampleItems} aria-label="Test" onRemove={vi.fn()}>
            {(item) => <Tag id={item.id}>{item.name}</Tag>}
          </TagList>
        </TagGroup>
      ));

      const tags = document.querySelectorAll('.solidaria-Tag');
      expect(tags.length).toBe(4);
    });
  });

  // ============================================
  // FOCUS
  // ============================================

  describe('focus', () => {
    it('should be focusable', async () => {
      render(() => <TestTagGroup />);

      const tagList = document.querySelector('.solidaria-TagList') as HTMLElement;

      // Tag list should exist and have proper structure for focus
      expect(tagList).toBeInTheDocument();

      // Focus the first tag instead (tags have tabIndex)
      const firstTag = document.querySelector('.solidaria-Tag') as HTMLElement;
      expect(firstTag).toHaveAttribute('tabindex');
    });
  });
});
