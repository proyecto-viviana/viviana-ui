/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@solidjs/testing-library';
import { createSignal } from 'solid-js';
import {
  ActionBar,
  ActionBarContainer,
  ActionBarSelectionCount,
  ActionBarClearButton,
} from '../src/ActionBar';

describe('ActionBar (headless)', () => {
  describe('visibility', () => {
    it('hides when selectedItemCount is 0', () => {
      render(() => (
        <ActionBar selectedItemCount={0} onClearSelection={() => {}}>
          <span>actions</span>
        </ActionBar>
      ));
      expect(screen.queryByRole('toolbar')).not.toBeInTheDocument();
    });

    it('shows when selectedItemCount > 0', () => {
      render(() => (
        <ActionBar selectedItemCount={3} onClearSelection={() => {}}>
          <span>actions</span>
        </ActionBar>
      ));
      expect(screen.getByRole('toolbar')).toBeInTheDocument();
    });

    it('shows when selectedItemCount is "all"', () => {
      render(() => (
        <ActionBar selectedItemCount="all" onClearSelection={() => {}}>
          <span>actions</span>
        </ActionBar>
      ));
      expect(screen.getByRole('toolbar')).toBeInTheDocument();
    });

    it('hides when count changes from positive to 0', () => {
      const [count, setCount] = createSignal(3);
      render(() => (
        <ActionBar selectedItemCount={count()} onClearSelection={() => setCount(0)}>
          <span>actions</span>
        </ActionBar>
      ));

      expect(screen.getByRole('toolbar')).toBeInTheDocument();
      setCount(0);
      expect(screen.queryByRole('toolbar')).not.toBeInTheDocument();
    });
  });

  describe('roles and attributes', () => {
    it('renders with toolbar role', () => {
      render(() => (
        <ActionBar selectedItemCount={1} onClearSelection={() => {}}>
          <span>actions</span>
        </ActionBar>
      ));
      expect(screen.getByRole('toolbar')).toBeInTheDocument();
    });

    it('has default aria-label "Actions"', () => {
      render(() => (
        <ActionBar selectedItemCount={1} onClearSelection={() => {}}>
          <span>actions</span>
        </ActionBar>
      ));
      expect(screen.getByRole('toolbar')).toHaveAttribute('aria-label', 'Actions');
    });

    it('supports custom aria-label', () => {
      render(() => (
        <ActionBar selectedItemCount={1} onClearSelection={() => {}} aria-label="Bulk actions">
          <span>actions</span>
        </ActionBar>
      ));
      expect(screen.getByRole('toolbar')).toHaveAttribute('aria-label', 'Bulk actions');
    });
  });

  describe('keyboard', () => {
    it('calls onClearSelection on Escape', () => {
      const onClear = vi.fn();
      render(() => (
        <ActionBar selectedItemCount={5} onClearSelection={onClear}>
          <button>Delete</button>
        </ActionBar>
      ));

      const toolbar = screen.getByRole('toolbar');
      fireEvent.keyDown(toolbar, { key: 'Escape' });
      expect(onClear).toHaveBeenCalledOnce();
    });

    it('does not call onClearSelection on other keys', () => {
      const onClear = vi.fn();
      render(() => (
        <ActionBar selectedItemCount={5} onClearSelection={onClear}>
          <button>Delete</button>
        </ActionBar>
      ));

      const toolbar = screen.getByRole('toolbar');
      fireEvent.keyDown(toolbar, { key: 'Enter' });
      expect(onClear).not.toHaveBeenCalled();
    });
  });

  describe('SelectionCount', () => {
    it('shows count text', () => {
      render(() => (
        <ActionBar selectedItemCount={3} onClearSelection={() => {}}>
          <ActionBarSelectionCount />
        </ActionBar>
      ));
      expect(screen.getByText('3 selected')).toBeInTheDocument();
    });

    it('shows "All selected" for "all"', () => {
      render(() => (
        <ActionBar selectedItemCount="all" onClearSelection={() => {}}>
          <ActionBarSelectionCount />
        </ActionBar>
      ));
      expect(screen.getByText('All selected')).toBeInTheDocument();
    });

    it('shows "1 selected" for single item', () => {
      render(() => (
        <ActionBar selectedItemCount={1} onClearSelection={() => {}}>
          <ActionBarSelectionCount />
        </ActionBar>
      ));
      expect(screen.getByText('1 selected')).toBeInTheDocument();
    });
  });

  describe('ClearButton', () => {
    it('renders with default aria-label', () => {
      render(() => (
        <ActionBar selectedItemCount={2} onClearSelection={() => {}}>
          <ActionBarClearButton />
        </ActionBar>
      ));
      expect(screen.getByRole('button', { name: 'Clear selection' })).toBeInTheDocument();
    });

    it('calls onClearSelection on click', () => {
      const onClear = vi.fn();
      render(() => (
        <ActionBar selectedItemCount={2} onClearSelection={onClear}>
          <ActionBarClearButton />
        </ActionBar>
      ));
      fireEvent.click(screen.getByRole('button', { name: 'Clear selection' }));
      expect(onClear).toHaveBeenCalledOnce();
    });

    it('supports custom aria-label', () => {
      render(() => (
        <ActionBar selectedItemCount={2} onClearSelection={() => {}}>
          <ActionBarClearButton aria-label="Deselect all" />
        </ActionBar>
      ));
      expect(screen.getByRole('button', { name: 'Deselect all' })).toBeInTheDocument();
    });

    it('renders custom children', () => {
      render(() => (
        <ActionBar selectedItemCount={2} onClearSelection={() => {}}>
          <ActionBarClearButton>Clear</ActionBarClearButton>
        </ActionBar>
      ));
      expect(screen.getByText('Clear')).toBeInTheDocument();
    });
  });

  describe('ActionBarContainer', () => {
    it('renders children with relative positioning', () => {
      const { container } = render(() => (
        <ActionBarContainer>
          <div data-testid="collection">Table here</div>
          <ActionBar selectedItemCount={1} onClearSelection={() => {}}>
            <span>actions</span>
          </ActionBar>
        </ActionBarContainer>
      ));

      expect(screen.getByTestId('collection')).toBeInTheDocument();
      expect(screen.getByRole('toolbar')).toBeInTheDocument();
      expect(container.firstElementChild).toHaveStyle({ position: 'relative' });
    });
  });
});
