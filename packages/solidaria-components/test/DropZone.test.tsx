/**
 * Tests for solidaria-components DropZone
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@solidjs/testing-library';
import { DropZone } from '../src/DropZone';

function createDataTransferStub(): DataTransfer {
  return {
    items: [] as unknown as DataTransferItemList,
    types: [],
    files: [] as unknown as FileList,
    dropEffect: 'copy',
    effectAllowed: 'copy',
    getData: () => '',
    setData: () => {},
    clearData: () => {},
    setDragImage: () => {},
  } as unknown as DataTransfer;
}

describe('DropZone', () => {
  it('renders with default class', () => {
    render(() => <DropZone>Drop files</DropZone>);
    const zone = screen.getByRole('group');
    expect(zone).toHaveClass('solidaria-DropZone');
  });

  it('calls onDrop handler on drop event', () => {
    const onDrop = vi.fn();
    render(() => (
      <DropZone onDrop={onDrop}>
        Drop files
      </DropZone>
    ));

    const zone = screen.getByRole('group');
    const dataTransfer = createDataTransferStub();
    fireEvent.drop(zone, {
      dataTransfer,
      clientX: 0,
      clientY: 0,
    });

    expect(onDrop).toHaveBeenCalled();
  });

  it('sets disabled state attributes', () => {
    render(() => <DropZone isDisabled>Drop files</DropZone>);
    const zone = screen.getByRole('group');
    expect(zone).toHaveAttribute('data-disabled');
    expect(zone).toHaveAttribute('tabindex', '-1');
  });
});
