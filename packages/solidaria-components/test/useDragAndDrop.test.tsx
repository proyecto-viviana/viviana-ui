/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { createRoot } from 'solid-js';
import { useDragAndDrop } from '../src/useDragAndDrop';

describe('useDragAndDrop', () => {
  it('returns draggable hooks when getItems is provided', () => {
    const { dragAndDropHooks } = useDragAndDrop({
      items: [{ id: 'a' }],
      getItems: (keys) => Array.from(keys).map((key) => ({ 'text/plain': String(key) })),
    });

    expect(typeof dragAndDropHooks.useDraggableCollectionState).toBe('function');
    expect(typeof dragAndDropHooks.useDraggableCollection).toBe('function');
    expect(typeof dragAndDropHooks.useDraggableItem).toBe('function');
  });

  it('returns droppable hooks when drop handlers are provided', () => {
    const { dragAndDropHooks } = useDragAndDrop({
      onInsert: () => {},
    });

    expect(typeof dragAndDropHooks.useDroppableCollectionState).toBe('function');
    expect(typeof dragAndDropHooks.useDroppableCollection).toBe('function');
    expect(typeof dragAndDropHooks.useDroppableItem).toBe('function');
  });

  it('wires renderDragPreview into draggable collection state when preview is not provided', () => {
    createRoot((dispose) => {
      const { dragAndDropHooks } = useDragAndDrop({
        items: [{ id: 'a' }],
        getItems: (keys) => Array.from(keys).map((key) => ({ 'text/plain': String(key) })),
        renderDragPreview: () => document.createElement('div'),
      });

      const dragState = dragAndDropHooks.useDraggableCollectionState?.({
        items: [{ id: 'a' }],
      });

      expect(typeof dragState?.preview?.current).toBe('function');
      dispose();
    });
  });

  it('prefers explicit preview over renderDragPreview wiring', () => {
    createRoot((dispose) => {
      const preview = { current: () => {} };
      const { dragAndDropHooks } = useDragAndDrop({
        items: [{ id: 'a' }],
        getItems: (keys) => Array.from(keys).map((key) => ({ 'text/plain': String(key) })),
        preview,
        renderDragPreview: () => document.createElement('div'),
      });

      const dragState = dragAndDropHooks.useDraggableCollectionState?.({
        items: [{ id: 'a' }],
      });

      expect(dragState?.preview).toBe(preview);
      dispose();
    });
  });
});
