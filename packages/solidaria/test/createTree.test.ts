/**
 * Tests for createTree, createTreeItem, createTreeSelectionCheckbox
 */

import { describe, it, expect, vi } from 'vitest';
import { createRoot, createSignal } from 'solid-js';
import {
  createTree,
  createTreeItem,
  createTreeSelectionCheckbox,
  getTreeData,
} from '../src/tree';
import {
  createTreeState,
  createTreeCollection,
  type TreeState,
  type TreeItemData,
  type TreeCollection,
} from '@proyecto-viviana/solid-stately';

interface TestItem {
  name: string;
}

function createTestItems(): TreeItemData<TestItem>[] {
  return [
    {
      key: '1',
      value: { name: 'Item 1' },
      textValue: 'Item 1',
      children: [
        { key: '1.1', value: { name: 'Item 1.1' }, textValue: 'Item 1.1' },
        {
          key: '1.2',
          value: { name: 'Item 1.2' },
          textValue: 'Item 1.2',
          children: [
            { key: '1.2.1', value: { name: 'Item 1.2.1' }, textValue: 'Item 1.2.1' },
          ],
        },
      ],
    },
    {
      key: '2',
      value: { name: 'Item 2' },
      textValue: 'Item 2',
    },
  ];
}

function createState(
  options: {
    expandedKeys?: Iterable<string | number>;
    defaultExpandedKeys?: Iterable<string | number>;
    selectionMode?: 'none' | 'single' | 'multiple';
    disabledKeys?: Iterable<string | number>;
  } = {}
): TreeState<TestItem, TreeCollection<TestItem>> {
  const items = createTestItems();
  return createTreeState<TestItem, TreeCollection<TestItem>>(() => ({
    collectionFactory: (expandedKeys) =>
      createTreeCollection(items, expandedKeys),
    ...options,
  }));
}

describe('createTree', () => {
  it('should return treeProps with correct role', () => {
    createRoot((dispose) => {
      const state = createState();
      const [ref, setRef] = createSignal<HTMLDivElement | null>(null);

      const { treeProps } = createTree(
        () => ({ 'aria-label': 'Test Tree' }),
        () => state,
        ref
      );

      expect(treeProps.role).toBe('treegrid');
      expect(treeProps['aria-label']).toBe('Test Tree');

      dispose();
    });
  });

  it('should have tabIndex 0 when not disabled', () => {
    createRoot((dispose) => {
      const state = createState();
      const [ref] = createSignal<HTMLDivElement | null>(null);

      const { treeProps } = createTree(
        () => ({}),
        () => state,
        ref
      );

      expect(treeProps.tabIndex).toBe(0);

      dispose();
    });
  });

  it('should not have tabIndex when disabled', () => {
    createRoot((dispose) => {
      const state = createState();
      const [ref] = createSignal<HTMLDivElement | null>(null);

      const { treeProps } = createTree(
        () => ({ isDisabled: true }),
        () => state,
        ref
      );

      expect(treeProps.tabIndex).toBeUndefined();
      expect(treeProps['aria-disabled']).toBe(true);

      dispose();
    });
  });

  it('should have aria-multiselectable when selection mode is multiple', () => {
    createRoot((dispose) => {
      const state = createState({ selectionMode: 'multiple' });
      const [ref] = createSignal<HTMLDivElement | null>(null);

      const { treeProps } = createTree(
        () => ({}),
        () => state,
        ref
      );

      expect(treeProps['aria-multiselectable']).toBe(true);

      dispose();
    });
  });

  it('should store tree data accessible via getTreeData', () => {
    createRoot((dispose) => {
      const onAction = vi.fn();
      const state = createState();
      const [ref] = createSignal<HTMLDivElement | null>(null);

      createTree(
        () => ({ onAction }),
        () => state,
        ref
      );

      const treeData = getTreeData(state);
      expect(treeData).toBeDefined();
      expect(treeData?.actions.onAction).toBe(onAction);

      dispose();
    });
  });
});

describe('createTreeItem', () => {
  it('should return rowProps with correct role', () => {
    createRoot((dispose) => {
      const state = createState({ defaultExpandedKeys: ['1'] });
      const [ref] = createSignal<HTMLDivElement | null>(null);
      const node = state.collection.getItem('1')!;

      const { rowProps } = createTreeItem(
        () => ({ node }),
        () => state,
        ref
      );

      expect(rowProps.role).toBe('row');

      dispose();
    });
  });

  it('should return gridCellProps with correct role', () => {
    createRoot((dispose) => {
      const state = createState();
      const [ref] = createSignal<HTMLDivElement | null>(null);
      const node = state.collection.getItem('1')!;

      const { gridCellProps } = createTreeItem(
        () => ({ node }),
        () => state,
        ref
      );

      expect(gridCellProps.role).toBe('gridcell');

      dispose();
    });
  });

  it('should have aria-expanded for expandable items', () => {
    createRoot((dispose) => {
      const state = createState({ defaultExpandedKeys: ['1'] });
      const [ref] = createSignal<HTMLDivElement | null>(null);
      const node = state.collection.getItem('1')!;

      const { rowProps, isExpanded, isExpandable } = createTreeItem(
        () => ({ node }),
        () => state,
        ref
      );

      expect(rowProps['aria-expanded']).toBe(true);
      expect(isExpanded).toBe(true);
      expect(isExpandable).toBe(true);

      dispose();
    });
  });

  it('should not have aria-expanded for leaf items', () => {
    createRoot((dispose) => {
      const state = createState();
      const [ref] = createSignal<HTMLDivElement | null>(null);
      const node = state.collection.getItem('2')!;

      const { rowProps, isExpanded, isExpandable } = createTreeItem(
        () => ({ node }),
        () => state,
        ref
      );

      expect(rowProps['aria-expanded']).toBeUndefined();
      expect(isExpanded).toBe(false);
      expect(isExpandable).toBe(false);

      dispose();
    });
  });

  it('should have aria-level attribute', () => {
    createRoot((dispose) => {
      const state = createState({ defaultExpandedKeys: ['1'] });
      const [ref] = createSignal<HTMLDivElement | null>(null);

      const node1 = state.collection.getItem('1')!;
      const item1 = createTreeItem(
        () => ({ node: node1 }),
        () => state,
        ref
      );
      expect(item1.rowProps['aria-level']).toBe(1); // level 0 + 1 = 1

      const node11 = state.collection.getItem('1.1')!;
      const item11 = createTreeItem(
        () => ({ node: node11 }),
        () => state,
        ref
      );
      expect(item11.rowProps['aria-level']).toBe(2); // level 1 + 1 = 2

      dispose();
    });
  });

  it('should track selection state', () => {
    createRoot((dispose) => {
      const state = createState({ selectionMode: 'single' });
      const [ref] = createSignal<HTMLDivElement | null>(null);
      const node = state.collection.getItem('1')!;

      const item = createTreeItem(
        () => ({ node }),
        () => state,
        ref
      );

      expect(item.isSelected).toBe(false);
      expect(item.rowProps['aria-selected']).toBe(false);

      state.toggleSelection('1');

      expect(item.isSelected).toBe(true);
      expect(item.rowProps['aria-selected']).toBe(true);

      dispose();
    });
  });

  it('should track disabled state', () => {
    createRoot((dispose) => {
      const state = createState({ disabledKeys: ['1'] });
      const [ref] = createSignal<HTMLDivElement | null>(null);
      const node = state.collection.getItem('1')!;

      const { isDisabled, rowProps } = createTreeItem(
        () => ({ node }),
        () => state,
        ref
      );

      expect(isDisabled).toBe(true);
      expect(rowProps['aria-disabled']).toBe(true);

      dispose();
    });
  });

  it('should provide expandButtonProps', () => {
    createRoot((dispose) => {
      const state = createState();
      const [ref] = createSignal<HTMLDivElement | null>(null);
      const node = state.collection.getItem('1')!;

      const { expandButtonProps, isExpanded } = createTreeItem(
        () => ({ node }),
        () => state,
        ref
      );

      expect(expandButtonProps.type).toBe('button');
      expect(expandButtonProps['aria-label']).toBe('Expand');
      expect(isExpanded).toBe(false);

      dispose();
    });
  });

  it('should update expandButtonProps aria-label when expanded', () => {
    createRoot((dispose) => {
      const state = createState({ defaultExpandedKeys: ['1'] });
      const [ref] = createSignal<HTMLDivElement | null>(null);
      const node = state.collection.getItem('1')!;

      const { expandButtonProps, isExpanded } = createTreeItem(
        () => ({ node }),
        () => state,
        ref
      );

      expect(expandButtonProps['aria-label']).toBe('Collapse');
      expect(isExpanded).toBe(true);

      dispose();
    });
  });

  it('should track level', () => {
    createRoot((dispose) => {
      const state = createState({ defaultExpandedKeys: ['1', '1.2'] });
      const [ref] = createSignal<HTMLDivElement | null>(null);

      const node1 = state.collection.getItem('1')!;
      expect(
        createTreeItem(
          () => ({ node: node1 }),
          () => state,
          ref
        ).level
      ).toBe(0);

      const node11 = state.collection.getItem('1.1')!;
      expect(
        createTreeItem(
          () => ({ node: node11 }),
          () => state,
          ref
        ).level
      ).toBe(1);

      const node121 = state.collection.getItem('1.2.1')!;
      expect(
        createTreeItem(
          () => ({ node: node121 }),
          () => state,
          ref
        ).level
      ).toBe(2);

      dispose();
    });
  });
});

describe('createTreeSelectionCheckbox', () => {
  it('should return checkboxProps', () => {
    createRoot((dispose) => {
      const state = createState({ selectionMode: 'multiple' });

      const { checkboxProps } = createTreeSelectionCheckbox(
        () => ({ key: '1' }),
        () => state
      );

      expect(checkboxProps.type).toBe('checkbox');
      expect(checkboxProps['aria-label']).toBe('Select');

      dispose();
    });
  });

  it('should track checked state', () => {
    createRoot((dispose) => {
      const state = createState({ selectionMode: 'multiple' });

      const checkbox = createTreeSelectionCheckbox(
        () => ({ key: '1' }),
        () => state
      );

      expect(checkbox.checkboxProps.checked).toBe(false);

      state.toggleSelection('1');

      // Re-access the getter to get updated props
      expect(checkbox.checkboxProps.checked).toBe(true);

      dispose();
    });
  });

  it('should track disabled state', () => {
    createRoot((dispose) => {
      const state = createState({
        selectionMode: 'multiple',
        disabledKeys: ['1'],
      });

      const { checkboxProps } = createTreeSelectionCheckbox(
        () => ({ key: '1' }),
        () => state
      );

      expect(checkboxProps.disabled).toBe(true);

      dispose();
    });
  });
});
