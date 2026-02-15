/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@solidjs/testing-library';
import { createListState } from '../../solid-stately/src';
import { createActionGroup, createActionGroupItem } from '../src/actiongroup';

function ActionGroupExample(props: { selectionMode?: 'none' | 'single' | 'multiple' }) {
  const state = createListState({
    selectionMode: props.selectionMode ?? 'none',
    items: [
      { id: 'a', label: 'A' },
      { id: 'b', label: 'B' },
    ],
    getKey: (item) => item.id,
    getTextValue: (item) => item.label,
  });

  const { actionGroupProps } = createActionGroup({ 'aria-label': 'Actions' }, state);
  const itemA = createActionGroupItem({ key: 'a' }, state);
  const itemB = createActionGroupItem({ key: 'b' }, state);

  return (
    <div {...actionGroupProps} data-testid="action-group">
      <button {...itemA.buttonProps}>A</button>
      <button {...itemB.buttonProps}>B</button>
      <output data-testid="selected-keys">{JSON.stringify(state.selectedKeys() === 'all' ? 'all' : [...state.selectedKeys()])}</output>
    </div>
  );
}

describe('createActionGroup', () => {
  it('renders toolbar role for none selection mode', () => {
    render(() => <ActionGroupExample selectionMode="none" />);
    expect(screen.getByRole('toolbar')).toBeInTheDocument();
  });

  it('renders radiogroup/radio semantics for single selection mode', () => {
    render(() => <ActionGroupExample selectionMode="single" />);
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    const a = screen.getByRole('radio', { name: 'A' });
    const b = screen.getByRole('radio', { name: 'B' });
    expect(a).toHaveAttribute('aria-checked', 'false');
    expect(b).toHaveAttribute('aria-checked', 'false');
  });

  it('selects item on press', () => {
    render(() => <ActionGroupExample selectionMode="single" />);
    const a = screen.getByRole('radio', { name: 'A' });
    fireEvent.click(a);
    expect(screen.getByTestId('selected-keys').textContent).toContain('"a"');
  });

  it('moves focus with arrow keys in horizontal orientation', () => {
    render(() => <ActionGroupExample selectionMode="none" />);
    const a = screen.getByRole('button', { name: 'A' });
    const b = screen.getByRole('button', { name: 'B' });
    a.focus();
    fireEvent.keyDown(a, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(b);
  });

  it('wraps focus at boundaries with arrow navigation', () => {
    render(() => <ActionGroupExample selectionMode="none" />);
    const a = screen.getByRole('button', { name: 'A' });
    const b = screen.getByRole('button', { name: 'B' });
    a.focus();
    fireEvent.keyDown(a, { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(b);
  });

  it('uses group role when nested inside a toolbar', async () => {
    render(() => (
      <div role="toolbar">
        <ActionGroupExample selectionMode="none" />
      </div>
    ));

    await waitFor(() => {
      expect(screen.getByTestId('action-group')).toHaveAttribute('role', 'group');
    });
  });
});
