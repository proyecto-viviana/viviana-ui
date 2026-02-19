/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@solidjs/testing-library';
import { ActionGroup } from '../src/ActionGroup';

const items = [
  { id: 'bold', label: 'Bold' },
  { id: 'italic', label: 'Italic' },
  { id: 'underline', label: 'Underline' },
];

describe('ActionGroup (headless)', () => {
  describe('roles', () => {
    it('renders toolbar role for none selection mode', () => {
      render(() => (
        <ActionGroup items={items} aria-label="Formatting">
          {(item) => item.label}
        </ActionGroup>
      ));
      expect(screen.getByRole('toolbar')).toBeInTheDocument();
    });

    it('renders radiogroup role for single selection mode', () => {
      render(() => (
        <ActionGroup items={items} selectionMode="single" aria-label="Formatting">
          {(item) => item.label}
        </ActionGroup>
      ));
      expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    });

    it('renders radio roles for items in single selection', () => {
      render(() => (
        <ActionGroup items={items} selectionMode="single" aria-label="Formatting">
          {(item) => item.label}
        </ActionGroup>
      ));
      expect(screen.getAllByRole('radio')).toHaveLength(3);
    });

    it('renders toolbar role for multiple selection mode', () => {
      render(() => (
        <ActionGroup items={items} selectionMode="multiple" aria-label="Formatting">
          {(item) => item.label}
        </ActionGroup>
      ));
      expect(screen.getByRole('toolbar')).toBeInTheDocument();
    });

    it('uses group role when nested inside a toolbar', async () => {
      render(() => (
        <div role="toolbar">
          <ActionGroup items={items} aria-label="Formatting">
            {(item) => item.label}
          </ActionGroup>
        </div>
      ));

      await waitFor(() => {
        const groups = screen.queryAllByRole('group');
        expect(groups.length).toBeGreaterThan(0);
      });
    });
  });

  describe('selection', () => {
    it('selects item on click in single selection mode', () => {
      const onSelectionChange = vi.fn();
      render(() => (
        <ActionGroup
          items={items}
          selectionMode="single"
          aria-label="Formatting"
          onSelectionChange={onSelectionChange}
        >
          {(item) => item.label}
        </ActionGroup>
      ));

      fireEvent.click(screen.getByRole('radio', { name: 'Bold' }));
      expect(onSelectionChange).toHaveBeenCalled();
    });

    it('supports default selected keys', () => {
      render(() => (
        <ActionGroup
          items={items}
          selectionMode="single"
          defaultSelectedKeys={['bold']}
          aria-label="Formatting"
        >
          {(item) => item.label}
        </ActionGroup>
      ));

      expect(screen.getByRole('radio', { name: 'Bold' })).toHaveAttribute('aria-checked', 'true');
    });

    it('supports controlled selected keys', () => {
      render(() => (
        <ActionGroup
          items={items}
          selectionMode="single"
          selectedKeys={['italic']}
          aria-label="Formatting"
        >
          {(item) => item.label}
        </ActionGroup>
      ));

      expect(screen.getByRole('radio', { name: 'Italic' })).toHaveAttribute('aria-checked', 'true');
    });
  });

  describe('keyboard navigation', () => {
    it('moves focus with ArrowRight', () => {
      render(() => (
        <ActionGroup items={items} aria-label="Formatting">
          {(item) => item.label}
        </ActionGroup>
      ));

      const bold = screen.getByRole('button', { name: 'Bold' });
      const italic = screen.getByRole('button', { name: 'Italic' });
      bold.focus();
      fireEvent.keyDown(bold, { key: 'ArrowRight' });
      expect(document.activeElement).toBe(italic);
    });

    it('wraps focus at boundaries', () => {
      render(() => (
        <ActionGroup items={items} aria-label="Formatting">
          {(item) => item.label}
        </ActionGroup>
      ));

      const bold = screen.getByRole('button', { name: 'Bold' });
      const underline = screen.getByRole('button', { name: 'Underline' });
      bold.focus();
      fireEvent.keyDown(bold, { key: 'ArrowLeft' });
      expect(document.activeElement).toBe(underline);
    });
  });

  describe('disabled state', () => {
    it('marks group as aria-disabled when all items disabled', () => {
      const disabledItems = items.map(i => ({ ...i, isDisabled: true }));
      render(() => (
        <ActionGroup items={disabledItems} aria-label="Formatting">
          {(item) => item.label}
        </ActionGroup>
      ));

      const group = screen.getByRole('toolbar');
      expect(group).toHaveAttribute('aria-disabled', 'true');
    });

    it('disables specific items via disabledKeys', () => {
      render(() => (
        <ActionGroup
          items={items}
          selectionMode="single"
          disabledKeys={['italic']}
          aria-label="Formatting"
        >
          {(item) => item.label}
        </ActionGroup>
      ));

      const italic = screen.getByRole('radio', { name: 'Italic' });
      expect(italic).toBeDisabled();
    });
  });

  describe('render props', () => {
    it('passes render props to item children', () => {
      render(() => (
        <ActionGroup
          items={items}
          selectionMode="single"
          defaultSelectedKeys={['bold']}
          aria-label="Formatting"
        >
          {(item, rp) => (
            <span data-testid={`item-${item.id}`}>
              {item.label} {rp.isSelected ? '(on)' : '(off)'}
            </span>
          )}
        </ActionGroup>
      ));

      expect(screen.getByTestId('item-bold')).toHaveTextContent('Bold (on)');
      expect(screen.getByTestId('item-italic')).toHaveTextContent('Italic (off)');
    });
  });

  describe('data attributes', () => {
    it('sets data-orientation', () => {
      const { container } = render(() => (
        <ActionGroup items={items} orientation="vertical" aria-label="Formatting">
          {(item) => item.label}
        </ActionGroup>
      ));

      expect(container.querySelector('[data-orientation="vertical"]')).toBeInTheDocument();
    });

    it('sets data-selected on selected items', () => {
      const { container } = render(() => (
        <ActionGroup
          items={items}
          selectionMode="single"
          defaultSelectedKeys={['bold']}
          aria-label="Formatting"
        >
          {(item) => item.label}
        </ActionGroup>
      ));

      const selected = container.querySelectorAll('[data-selected]');
      expect(selected).toHaveLength(1);
    });
  });
});
