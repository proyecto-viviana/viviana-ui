/**
 * Tree component tests
 *
 * Tests for Tree component functionality including:
 * - Rendering
 * - Expansion
 * - Selection
 * - Keyboard navigation
 * - ARIA attributes
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@solidjs/testing-library';
import { Tree, TreeItem } from '../src/Tree';
import { useDragAndDrop } from '../src/useDragAndDrop';
import type {
  TreeItemData,
  DraggableCollectionState,
  DroppableCollectionState,
  DropTarget,
  DragTypes,
  DropOperation,
} from '@proyecto-viviana/solid-stately';
import { setupUser } from '@proyecto-viviana/solidaria-test-utils';

interface TestItem {
  name: string;
}

function createTestItems(): TreeItemData<TestItem>[] {
  return [
    {
      key: 'item-1',
      value: { name: 'Item 1' },
      textValue: 'Item 1',
      children: [
        { key: 'item-1-1', value: { name: 'Item 1.1' }, textValue: 'Item 1.1' },
        { key: 'item-1-2', value: { name: 'Item 1.2' }, textValue: 'Item 1.2' },
      ],
    },
    {
      key: 'item-2',
      value: { name: 'Item 2' },
      textValue: 'Item 2',
    },
    {
      key: 'item-3',
      value: { name: 'Item 3' },
      textValue: 'Item 3',
      children: [
        { key: 'item-3-1', value: { name: 'Item 3.1' }, textValue: 'Item 3.1' },
      ],
    },
  ];
}

describe('Tree', () => {
  afterEach(() => {
    cleanup();
  });

  describe('rendering', () => {
    it('should render with treegrid role', () => {
      render(() => (
        <Tree items={createTestItems()} aria-label="Test Tree">
          {(item) => <TreeItem id={item.key}>{item.textValue}</TreeItem>}
        </Tree>
      ));

      const tree = screen.getByRole('treegrid');
      expect(tree).toBeInTheDocument();
      expect(tree).toHaveAttribute('aria-label', 'Test Tree');
    });

    it('should render items with row role', () => {
      render(() => (
        <Tree items={createTestItems()} aria-label="Test Tree">
          {(item) => <TreeItem id={item.key}>{item.textValue}</TreeItem>}
        </Tree>
      ));

      const rows = screen.getAllByRole('row');
      expect(rows.length).toBe(3); // Only root items visible initially
    });

    it('should render with default class', () => {
      render(() => (
        <Tree items={createTestItems()} aria-label="Test Tree">
          {(item) => <TreeItem id={item.key}>{item.textValue}</TreeItem>}
        </Tree>
      ));

      const tree = screen.getByRole('treegrid');
      expect(tree).toHaveClass('solidaria-Tree');
    });

    it('should render items with default class', () => {
      render(() => (
        <Tree items={createTestItems()} aria-label="Test Tree">
          {(item) => <TreeItem id={item.key}>{item.textValue}</TreeItem>}
        </Tree>
      ));

      const rows = screen.getAllByRole('row');
      expect(rows[0]).toHaveClass('solidaria-Tree-item');
    });

    it('should render empty state when no items', () => {
      render(() => (
        <Tree
          items={[]}
          aria-label="Test Tree"
          renderEmptyState={() => <div data-testid="empty">No items</div>}
        >
          {(item) => <TreeItem id={item.key}>{item.textValue}</TreeItem>}
        </Tree>
      ));

      expect(screen.getByTestId('empty')).toHaveTextContent('No items');
    });

    it('should trigger onLoadMore from load more sentinel', () => {
      const onLoadMore = vi.fn();
      render(() => (
        <Tree
          items={createTestItems()}
          aria-label="Test Tree"
          hasMore
          onLoadMore={onLoadMore}
        >
          {(item) => <TreeItem id={item.key}>{item.textValue}</TreeItem>}
        </Tree>
      ));

      fireEvent.focus(screen.getByText('Load more'));
      expect(onLoadMore).toHaveBeenCalled();
    });

    it('should apply draggable item semantics when drag hooks are provided', () => {
      const items = createTestItems();
      const dndItems = items.map((item) => ({ key: String(item.key), name: item.value.name }));
      const { dragAndDropHooks } = useDragAndDrop<{ key: string; name: string }>({
        items: dndItems,
        getItems: (keys, sourceItems) =>
          sourceItems
            .filter((item) => keys.has(item.key))
            .map((item) => ({ 'text/plain': item.name })),
      });

      render(() => (
        <Tree items={items} aria-label="Test Tree" dragAndDropHooks={dragAndDropHooks}>
          {(item) => <TreeItem id={item.key}>{item.textValue}</TreeItem>}
        </Tree>
      ));

      const rows = screen.getAllByRole('row');
      expect(rows[0]).toHaveAttribute('draggable', 'true');
    });

    it('should prevent self/descendant on-drops for internal tree drags', () => {
      const dragState: DraggableCollectionState = {
        isDragging: true,
        draggingKeys: new Set(['item-1']),
        isDisabled: false,
        preview: undefined,
        startDrag: () => {},
        moveDrag: () => {},
        endDrag: () => {},
        cancelDrag: () => {},
        getItems: () => [],
        getAllowedDropOperations: () => ['move'],
      };
      const dropState: DroppableCollectionState = {
        isDropTarget: false,
        target: null,
        isDisabled: false,
        setTarget: () => {},
        isAccepted: () => true,
        enterTarget: () => {},
        moveToTarget: () => {},
        exitTarget: () => {},
        activateTarget: () => {},
        drop: () => {},
        shouldAcceptItemDrop: () => true,
        getDropOperation: () => 'move',
      };

      const dragAndDropHooks = {
        useDraggableCollectionState: () => dragState,
        useDraggableCollection: () => ({ state: dragState }),
        useDraggableItem: () => ({ dragProps: {}, dragButtonProps: {}, isDragging: false }),
        useDroppableCollectionState: () => dropState,
        useDroppableCollection: () => ({ collectionProps: {} }),
        useDroppableItem: () => ({ dropProps: {}, dropButtonProps: {}, isDropTarget: false }),
        dropTargetDelegate: {
          getDropTargetFromPoint: () => null,
        },
      };

      render(() => (
        <Tree
          items={createTestItems()}
          aria-label="Test Tree"
          defaultExpandedKeys={['item-1']}
          dragAndDropHooks={dragAndDropHooks as any}
        >
          {(item) => <TreeItem id={item.key}>{item.textValue}</TreeItem>}
        </Tree>
      ));

      const alwaysAccepted: DragTypes = { has: () => true };
      const allowed: DropOperation[] = ['move'];
      const selfTarget: DropTarget = { type: 'item', key: 'item-1', dropPosition: 'on' };
      const descendantTarget: DropTarget = { type: 'item', key: 'item-1-1', dropPosition: 'on' };

      expect(dropState.getDropOperation(selfTarget, alwaysAccepted, allowed)).toBe('cancel');
      expect(dropState.getDropOperation(descendantTarget, alwaysAccepted, allowed)).toBe('cancel');
    });

    it('should expand a collapsed branch on drop activate', () => {
      const dropState: DroppableCollectionState = {
        isDropTarget: false,
        target: null,
        isDisabled: false,
        setTarget: () => {},
        isAccepted: () => true,
        enterTarget: () => {},
        moveToTarget: () => {},
        exitTarget: () => {},
        activateTarget: () => {},
        drop: () => {},
        shouldAcceptItemDrop: () => true,
        getDropOperation: () => 'move',
      };

      const dragAndDropHooks = {
        useDroppableCollectionState: () => dropState,
        useDroppableCollection: (props: {
          onDropActivate?: (event: { target: DropTarget; x: number; y: number }) => void;
        }) => {
          props.onDropActivate?.({
            target: { type: 'item', key: 'item-1', dropPosition: 'on' },
            x: 0,
            y: 0,
          });
          return { collectionProps: {} };
        },
        useDroppableItem: () => ({ dropProps: {}, dropButtonProps: {}, isDropTarget: false }),
        dropTargetDelegate: {
          getDropTargetFromPoint: () => null,
        },
      };

      render(() => (
        <Tree
          items={createTestItems()}
          aria-label="Test Tree"
          dragAndDropHooks={dragAndDropHooks as any}
        >
          {(item) => <TreeItem id={item.key}>{item.textValue}</TreeItem>}
        </Tree>
      ));

      // Item 1 is expanded by drop-activate, so children become visible.
      expect(screen.getByText('Item 1.1')).toBeInTheDocument();
      expect(screen.getByText('Item 1.2')).toBeInTheDocument();
    });

    it('should resolve ambiguous tree boundary drop targets using pointer direction', () => {
      const dropState: DroppableCollectionState = {
        isDropTarget: false,
        target: null,
        isDisabled: false,
        setTarget: () => {},
        isAccepted: () => true,
        enterTarget: () => {},
        moveToTarget: () => {},
        exitTarget: () => {},
        activateTarget: () => {},
        drop: () => {},
        shouldAcceptItemDrop: () => true,
        getDropOperation: () => 'move',
      };

      let wrappedDelegate:
        | {
          getDropTargetFromPoint: (
            x: number,
            y: number,
            isValidDropTarget: (target: DropTarget) => boolean
          ) => DropTarget | null;
        }
        | undefined;
      const baseDelegate = {
        getDropTargetFromPoint: () =>
          ({ type: 'item', key: 'item-1-2', dropPosition: 'after' } as const),
      };

      const dragAndDropHooks = {
        useDroppableCollectionState: () => dropState,
        useDroppableCollection: (props: {
          dropTargetDelegate: {
            getDropTargetFromPoint: (
              x: number,
              y: number,
              isValidDropTarget: (target: DropTarget) => boolean
            ) => DropTarget | null;
          };
        }) => {
          wrappedDelegate = props.dropTargetDelegate;
          return { collectionProps: {} };
        },
        useDroppableItem: () => ({ dropProps: {}, dropButtonProps: {}, isDropTarget: false }),
        dropTargetDelegate: baseDelegate,
      };

      render(() => (
        <Tree
          items={createTestItems()}
          aria-label="Test Tree"
          defaultExpandedKeys={['item-1']}
          dragAndDropHooks={dragAndDropHooks as any}
        >
          {(item) => <TreeItem id={item.key}>{item.textValue}</TreeItem>}
        </Tree>
      ));

      expect(wrappedDelegate).toBeDefined();
      const isValidDropTarget = (target: DropTarget) =>
        target.type === 'item' &&
        (
          (target.key === 'item-1-2' && target.dropPosition === 'after') ||
          (target.key === 'item-1' && target.dropPosition === 'after')
        );

      const innerTarget = wrappedDelegate!.getDropTargetFromPoint(30, 50, isValidDropTarget);
      const outerTarget = wrappedDelegate!.getDropTargetFromPoint(0, 50, isValidDropTarget);

      expect(innerTarget).toMatchObject({ type: 'item', key: 'item-1-2', dropPosition: 'after' });
      expect(outerTarget).toMatchObject({ type: 'item', key: 'item-1', dropPosition: 'after' });
    });
  });

  describe('expansion', () => {
    it('should show children when defaultExpandedKeys is set', () => {
      render(() => (
        <Tree
          items={createTestItems()}
          aria-label="Test Tree"
          defaultExpandedKeys={['item-1']}
        >
          {(item) => <TreeItem id={item.key}>{item.textValue}</TreeItem>}
        </Tree>
      ));

      const rows = screen.getAllByRole('row');
      // Root items (3) + expanded children of item-1 (2) = 5
      expect(rows.length).toBe(5);
    });

    it('should have aria-expanded on expandable items', () => {
      render(() => (
        <Tree items={createTestItems()} aria-label="Test Tree">
          {(item) => <TreeItem id={item.key}>{item.textValue}</TreeItem>}
        </Tree>
      ));

      const rows = screen.getAllByRole('row');
      // Item 1 is expandable
      expect(rows[0]).toHaveAttribute('aria-expanded', 'false');
      // Item 2 is a leaf (no aria-expanded)
      expect(rows[1]).not.toHaveAttribute('aria-expanded');
      // Item 3 is expandable
      expect(rows[2]).toHaveAttribute('aria-expanded', 'false');
    });

    it('should have aria-expanded=true when expanded', () => {
      render(() => (
        <Tree
          items={createTestItems()}
          aria-label="Test Tree"
          defaultExpandedKeys={['item-1']}
        >
          {(item) => <TreeItem id={item.key}>{item.textValue}</TreeItem>}
        </Tree>
      ));

      const expandedRow = screen.getAllByRole('row')[0];
      expect(expandedRow).toHaveAttribute('aria-expanded', 'true');
    });

    it('should have aria-level on items', () => {
      render(() => (
        <Tree
          items={createTestItems()}
          aria-label="Test Tree"
          defaultExpandedKeys={['item-1']}
        >
          {(item) => <TreeItem id={item.key}>{item.textValue}</TreeItem>}
        </Tree>
      ));

      const rows = screen.getAllByRole('row');
      expect(rows[0]).toHaveAttribute('aria-level', '1'); // Root level
      expect(rows[1]).toHaveAttribute('aria-level', '2'); // Child level
    });

    it('should support controlled expansion via expandedKeys prop', () => {
      // Test that controlled expansion works
      render(() => (
        <Tree
          items={createTestItems()}
          aria-label="Test Tree"
          expandedKeys={['item-1']}
        >
          {(item) => <TreeItem id={item.key}>{item.textValue}</TreeItem>}
        </Tree>
      ));

      // With controlled expandedKeys=['item-1'], children should be visible
      const rows = screen.getAllByRole('row');
      expect(rows.length).toBe(5); // 3 root + 2 children of item-1
    });
  });

  describe('selection', () => {
    it('should have aria-selected when selection mode is set', () => {
      render(() => (
        <Tree
          items={createTestItems()}
          aria-label="Test Tree"
          selectionMode="single"
        >
          {(item) => <TreeItem id={item.key}>{item.textValue}</TreeItem>}
        </Tree>
      ));

      const rows = screen.getAllByRole('row');
      expect(rows[0]).toHaveAttribute('aria-selected', 'false');
    });

    it('should have aria-multiselectable when multiple selection', () => {
      render(() => (
        <Tree
          items={createTestItems()}
          aria-label="Test Tree"
          selectionMode="multiple"
        >
          {(item) => <TreeItem id={item.key}>{item.textValue}</TreeItem>}
        </Tree>
      ));

      const tree = screen.getByRole('treegrid');
      expect(tree).toHaveAttribute('aria-multiselectable', 'true');
    });

    it('should call onSelectionChange when selection changes', async () => {
      const onSelectionChange = vi.fn();
      const user = setupUser();

      render(() => (
        <Tree
          items={createTestItems()}
          aria-label="Test Tree"
          selectionMode="single"
          onSelectionChange={onSelectionChange}
        >
          {(item) => <TreeItem id={item.key}>{item.textValue}</TreeItem>}
        </Tree>
      ));

      const rows = screen.getAllByRole('row');
      await user.click(rows[0]);

      expect(onSelectionChange).toHaveBeenCalled();
    });

    it('should show selected state via data attribute', async () => {
      const user = setupUser();

      render(() => (
        <Tree
          items={createTestItems()}
          aria-label="Test Tree"
          selectionMode="single"
          defaultSelectedKeys={['item-1']}
        >
          {(item) => <TreeItem id={item.key}>{item.textValue}</TreeItem>}
        </Tree>
      ));

      const rows = screen.getAllByRole('row');
      expect(rows[0]).toHaveAttribute('data-selected');
    });
  });

  describe('data attributes', () => {
    it('should have data-expandable on expandable items', () => {
      render(() => (
        <Tree items={createTestItems()} aria-label="Test Tree">
          {(item) => <TreeItem id={item.key}>{item.textValue}</TreeItem>}
        </Tree>
      ));

      const rows = screen.getAllByRole('row');
      expect(rows[0]).toHaveAttribute('data-expandable');
      expect(rows[1]).not.toHaveAttribute('data-expandable');
    });

    it('should have data-expanded when expanded', () => {
      render(() => (
        <Tree
          items={createTestItems()}
          aria-label="Test Tree"
          defaultExpandedKeys={['item-1']}
        >
          {(item) => <TreeItem id={item.key}>{item.textValue}</TreeItem>}
        </Tree>
      ));

      const rows = screen.getAllByRole('row');
      expect(rows[0]).toHaveAttribute('data-expanded');
    });

    it('should have data-level attribute', () => {
      render(() => (
        <Tree
          items={createTestItems()}
          aria-label="Test Tree"
          defaultExpandedKeys={['item-1']}
        >
          {(item) => <TreeItem id={item.key}>{item.textValue}</TreeItem>}
        </Tree>
      ));

      const rows = screen.getAllByRole('row');
      expect(rows[0]).toHaveAttribute('data-level', '0');
      expect(rows[1]).toHaveAttribute('data-level', '1');
    });

    it('should have data-disabled on tree when disabled', () => {
      render(() => (
        <Tree items={createTestItems()} aria-label="Test Tree" isDisabled>
          {(item) => <TreeItem id={item.key}>{item.textValue}</TreeItem>}
        </Tree>
      ));

      const tree = screen.getByRole('treegrid');
      expect(tree).toHaveAttribute('data-disabled');
    });
  });

  describe('disabled state', () => {
    it('should have aria-disabled on tree when disabled', () => {
      render(() => (
        <Tree items={createTestItems()} aria-label="Test Tree" isDisabled>
          {(item) => <TreeItem id={item.key}>{item.textValue}</TreeItem>}
        </Tree>
      ));

      const tree = screen.getByRole('treegrid');
      expect(tree).toHaveAttribute('aria-disabled', 'true');
    });

    it('should support disabledKeys', () => {
      render(() => (
        <Tree
          items={createTestItems()}
          aria-label="Test Tree"
          disabledKeys={['item-1']}
        >
          {(item) => <TreeItem id={item.key}>{item.textValue}</TreeItem>}
        </Tree>
      ));

      const rows = screen.getAllByRole('row');
      expect(rows[0]).toHaveAttribute('aria-disabled', 'true');
      expect(rows[1]).not.toHaveAttribute('aria-disabled');
    });
  });

  describe('keyboard navigation', () => {
    it('should have tabIndex on tree for keyboard access', () => {
      render(() => (
        <Tree items={createTestItems()} aria-label="Test Tree">
          {(item) => <TreeItem id={item.key}>{item.textValue}</TreeItem>}
        </Tree>
      ));

      const tree = screen.getByRole('treegrid');
      expect(tree).toHaveAttribute('tabIndex', '0');
    });

    it('should have tabIndex -1 on items (managed focus)', () => {
      render(() => (
        <Tree items={createTestItems()} aria-label="Test Tree">
          {(item) => <TreeItem id={item.key}>{item.textValue}</TreeItem>}
        </Tree>
      ));

      const rows = screen.getAllByRole('row');
      // Items have tabIndex -1 when not focused (roving tabindex pattern)
      expect(rows[0]).toHaveAttribute('tabIndex', '-1');
    });

    it('should not have tabIndex on tree when disabled', () => {
      render(() => (
        <Tree items={createTestItems()} aria-label="Test Tree" isDisabled>
          {(item) => <TreeItem id={item.key}>{item.textValue}</TreeItem>}
        </Tree>
      ));

      const tree = screen.getByRole('treegrid');
      expect(tree).not.toHaveAttribute('tabIndex');
    });
  });
});
