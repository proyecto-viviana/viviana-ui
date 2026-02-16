/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { ListDropTargetDelegate } from '../src/ListDropTargetDelegate';
import type { DropTarget } from '@proyecto-viviana/solid-stately';

describe('ListDropTargetDelegate', () => {
  it('returns root when collection is empty', () => {
    const root = document.createElement('div');
    const delegate = new ListDropTargetDelegate([], () => root);
    expect(delegate.getDropTargetFromPoint(0, 0, () => true)).toEqual({ type: 'root' });
  });

  it('returns root when element reference is unavailable', () => {
    const delegate = new ListDropTargetDelegate([{ type: 'item', key: 'a' }], () => null);
    expect(delegate.getDropTargetFromPoint(0, 0, () => true)).toEqual({ type: 'root' });
  });

  it('resolves in-item drop target and edge insertion positions', () => {
    const root = document.createElement('div');
    root.getBoundingClientRect = () =>
      ({ left: 0, right: 100, top: 0, bottom: 100 } as unknown as DOMRect);
    const item = document.createElement('div');
    item.dataset.key = 'a';
    item.getBoundingClientRect = () =>
      ({ left: 0, right: 100, top: 0, bottom: 40 } as unknown as DOMRect);
    root.append(item);

    const delegate = new ListDropTargetDelegate([{ type: 'item', key: 'a' }], () => root);
    const allowAll = (_target: DropTarget) => true;

    expect(delegate.getDropTargetFromPoint(10, 20, allowAll)).toEqual({
      type: 'item',
      key: 'a',
      dropPosition: 'on',
    });
    expect(delegate.getDropTargetFromPoint(10, 2, allowAll)).toEqual({
      type: 'item',
      key: 'a',
      dropPosition: 'before',
    });
    expect(delegate.getDropTargetFromPoint(10, 39, allowAll)).toEqual({
      type: 'item',
      key: 'a',
      dropPosition: 'after',
    });
  });

  it('falls back to before/after when on-target is invalid', () => {
    const root = document.createElement('div');
    root.getBoundingClientRect = () =>
      ({ left: 0, right: 100, top: 0, bottom: 100 } as unknown as DOMRect);
    const item = document.createElement('div');
    item.dataset.key = 'a';
    item.getBoundingClientRect = () =>
      ({ left: 0, right: 100, top: 0, bottom: 40 } as unknown as DOMRect);
    root.append(item);

    const delegate = new ListDropTargetDelegate([{ type: 'item', key: 'a' }], () => root);
    const allowOnlyBefore = (target: DropTarget) =>
      target.type === 'item' && target.dropPosition === 'before';

    expect(delegate.getDropTargetFromPoint(10, 10, allowOnlyBefore)).toEqual({
      type: 'item',
      key: 'a',
      dropPosition: 'before',
    });
  });
});
