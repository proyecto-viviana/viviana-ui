/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@solidjs/testing-library';
import { ActionBar, ActionBarContainer } from '../src/actionbar';

describe('ActionBar (ui)', () => {
  describe('basic rendering', () => {
    it('renders when items are selected', () => {
      render(() => (
        <ActionBar selectedItemCount={3} onClearSelection={() => {}}>
          <button>Delete</button>
        </ActionBar>
      ));
      expect(screen.getByRole('toolbar')).toBeInTheDocument();
    });

    it('renders with vui-action-bar class', () => {
      const { container } = render(() => (
        <ActionBar selectedItemCount={1} onClearSelection={() => {}}>
          <button>Edit</button>
        </ActionBar>
      ));
      expect(container.querySelector('.vui-action-bar')).toBeInTheDocument();
    });

    it('applies custom class', () => {
      const { container } = render(() => (
        <ActionBar selectedItemCount={1} onClearSelection={() => {}} class="my-bar">
          <button>Edit</button>
        </ActionBar>
      ));
      expect(container.querySelector('.my-bar')).toBeInTheDocument();
    });

    it('hides when selectedItemCount is 0', () => {
      render(() => (
        <ActionBar selectedItemCount={0} onClearSelection={() => {}}>
          <button>Edit</button>
        </ActionBar>
      ));
      expect(screen.queryByRole('toolbar')).not.toBeInTheDocument();
    });
  });

  describe('selection count', () => {
    it('shows selection count text', () => {
      render(() => (
        <ActionBar selectedItemCount={5} onClearSelection={() => {}}>
          <button>Delete</button>
        </ActionBar>
      ));
      expect(screen.getByText('5 selected')).toBeInTheDocument();
    });

    it('shows "All selected" for all', () => {
      render(() => (
        <ActionBar selectedItemCount="all" onClearSelection={() => {}}>
          <button>Delete</button>
        </ActionBar>
      ));
      expect(screen.getByText('All selected')).toBeInTheDocument();
    });
  });

  describe('clear button', () => {
    it('renders clear selection button', () => {
      render(() => (
        <ActionBar selectedItemCount={2} onClearSelection={() => {}}>
          <button>Edit</button>
        </ActionBar>
      ));
      expect(screen.getByRole('button', { name: 'Clear selection' })).toBeInTheDocument();
    });

    it('calls onClearSelection on clear click', () => {
      const onClear = vi.fn();
      render(() => (
        <ActionBar selectedItemCount={2} onClearSelection={onClear}>
          <button>Edit</button>
        </ActionBar>
      ));
      fireEvent.click(screen.getByRole('button', { name: 'Clear selection' }));
      expect(onClear).toHaveBeenCalledOnce();
    });
  });

  describe('action children', () => {
    it('renders action buttons', () => {
      render(() => (
        <ActionBar selectedItemCount={1} onClearSelection={() => {}}>
          <button>Edit</button>
          <button>Delete</button>
        </ActionBar>
      ));
      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });
  });

  describe('keyboard', () => {
    it('clears selection on Escape', () => {
      const onClear = vi.fn();
      render(() => (
        <ActionBar selectedItemCount={3} onClearSelection={onClear}>
          <button>Delete</button>
        </ActionBar>
      ));
      const toolbar = screen.getByRole('toolbar');
      fireEvent.keyDown(toolbar, { key: 'Escape' });
      expect(onClear).toHaveBeenCalledOnce();
    });
  });

  describe('ActionBarContainer', () => {
    it('wraps collection and action bar', () => {
      const { container } = render(() => (
        <ActionBarContainer>
          <div data-testid="table">Table content</div>
          <ActionBar selectedItemCount={2} onClearSelection={() => {}}>
            <button>Delete</button>
          </ActionBar>
        </ActionBarContainer>
      ));

      expect(container.querySelector('.vui-action-bar-container')).toBeInTheDocument();
      expect(screen.getByTestId('table')).toBeInTheDocument();
      expect(screen.getByRole('toolbar')).toBeInTheDocument();
    });
  });
});
