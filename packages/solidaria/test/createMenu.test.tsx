/**
 * Tests for createMenu, createMenuItem, and createMenuTrigger hooks
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { createRoot } from 'solid-js';
import { cleanup } from '@solidjs/testing-library';
import { createMenuState, createOverlayTriggerState } from '../../solid-stately/src';
import { createMenu, createMenuItem, createMenuTrigger } from '../src/menu';

describe('createMenu', () => {
  afterEach(() => {
    cleanup();
  });

  it('returns menu props with role="menu"', () => {
    createRoot((dispose) => {
      const items = [
        { key: 'copy', label: 'Copy' },
        { key: 'paste', label: 'Paste' },
      ];

      const state = createMenuState({
        items,
        getKey: (item) => item.key,
      });

      const { menuProps } = createMenu({}, state);

      expect(menuProps.role).toBe('menu');
      dispose();
    });
  });

  it('sets aria-disabled when disabled', () => {
    createRoot((dispose) => {
      const items = [
        { key: 'copy', label: 'Copy' },
      ];

      const state = createMenuState({
        items,
        getKey: (item) => item.key,
      });

      const { menuProps } = createMenu({ isDisabled: true }, state);

      expect(menuProps['aria-disabled']).toBe(true);
      dispose();
    });
  });

  it('has tabIndex 0 when not disabled', () => {
    createRoot((dispose) => {
      const items = [
        { key: 'copy', label: 'Copy' },
      ];

      const state = createMenuState({
        items,
        getKey: (item) => item.key,
      });

      const { menuProps } = createMenu({}, state);

      expect(menuProps.tabIndex).toBe(0);
      dispose();
    });
  });

  it('calls onAction when Enter is pressed', () => {
    createRoot((dispose) => {
      const onAction = vi.fn();
      const items = [
        { key: 'copy', label: 'Copy' },
        { key: 'paste', label: 'Paste' },
      ];

      const state = createMenuState({
        items,
        getKey: (item) => item.key,
      });

      state.setFocusedKey('copy');

      const { menuProps } = createMenu({ onAction }, state);

      const onKeyDown = menuProps.onKeyDown as (e: KeyboardEvent) => void;
      onKeyDown({
        key: 'Enter',
        preventDefault: vi.fn(),
      } as unknown as KeyboardEvent);

      expect(onAction).toHaveBeenCalledWith('copy');
      dispose();
    });
  });

  it('calls onClose when Escape is pressed', () => {
    createRoot((dispose) => {
      const onClose = vi.fn();
      const items = [
        { key: 'copy', label: 'Copy' },
      ];

      const state = createMenuState({
        items,
        getKey: (item) => item.key,
      });

      const { menuProps } = createMenu({ onClose }, state);

      const onKeyDown = menuProps.onKeyDown as (e: KeyboardEvent) => void;
      onKeyDown({
        key: 'Escape',
        preventDefault: vi.fn(),
      } as unknown as KeyboardEvent);

      expect(onClose).toHaveBeenCalled();
      dispose();
    });
  });
});

describe('createMenuItem', () => {
  afterEach(() => {
    cleanup();
  });

  it('returns menuitem props with role="menuitem"', () => {
    createRoot((dispose) => {
      const items = [
        { key: 'copy', label: 'Copy' },
      ];

      const state = createMenuState({
        items,
        getKey: (item) => item.key,
      });

      const { menuItemProps } = createMenuItem({ key: 'copy' }, state);

      expect(menuItemProps.role).toBe('menuitem');
      dispose();
    });
  });

  it('sets aria-disabled when disabled', () => {
    createRoot((dispose) => {
      const items = [
        { key: 'copy', label: 'Copy' },
      ];

      const state = createMenuState({
        items,
        getKey: (item) => item.key,
        disabledKeys: ['copy'],
      });

      const { menuItemProps, isDisabled } = createMenuItem({ key: 'copy' }, state);

      expect(menuItemProps['aria-disabled']).toBe(true);
      expect(isDisabled()).toBe(true);
      dispose();
    });
  });

  it('tracks focused state', () => {
    createRoot((dispose) => {
      const items = [
        { key: 'copy', label: 'Copy' },
        { key: 'paste', label: 'Paste' },
      ];

      const state = createMenuState({
        items,
        getKey: (item) => item.key,
      });

      const { isFocused: isFocusedCopy } = createMenuItem({ key: 'copy' }, state);
      const { isFocused: isFocusedPaste } = createMenuItem({ key: 'paste' }, state);

      expect(isFocusedCopy()).toBe(false);
      expect(isFocusedPaste()).toBe(false);

      state.setFocusedKey('copy');
      expect(isFocusedCopy()).toBe(true);
      expect(isFocusedPaste()).toBe(false);
      dispose();
    });
  });

  it('has tabIndex based on focus state', () => {
    createRoot((dispose) => {
      const items = [
        { key: 'copy', label: 'Copy' },
        { key: 'paste', label: 'Paste' },
      ];

      const state = createMenuState({
        items,
        getKey: (item) => item.key,
      });

      const { menuItemProps: copyProps } = createMenuItem({ key: 'copy' }, state);
      const { menuItemProps: pasteProps } = createMenuItem({ key: 'paste' }, state);

      expect(copyProps.tabIndex).toBe(-1);
      expect(pasteProps.tabIndex).toBe(-1);

      state.setFocusedKey('copy');

      const { menuItemProps: copyPropsAfter } = createMenuItem({ key: 'copy' }, state);
      expect(copyPropsAfter.tabIndex).toBe(0);
      dispose();
    });
  });
});

describe('createMenu - disabled key navigation', () => {
  afterEach(() => {
    cleanup();
  });

  it('skips disabled keys when navigating with ArrowDown', () => {
    createRoot((dispose) => {
      const items = [
        { key: 'item1', label: 'Item 1' },
        { key: 'item2', label: 'Item 2' },
        { key: 'item3', label: 'Item 3' },
        { key: 'item4', label: 'Item 4' },
      ];

      const state = createMenuState({
        items,
        getKey: (item) => item.key,
        disabledKeys: ['item2', 'item3'],
      });

      const { menuProps } = createMenu({ 'aria-label': 'Test menu' }, state);

      // Start at item1
      state.setFocusedKey('item1');
      expect(state.focusedKey()).toBe('item1');

      // Press ArrowDown - should skip item2 and item3, land on item4
      const onKeyDown = menuProps.onKeyDown as (e: KeyboardEvent) => void;
      onKeyDown({
        key: 'ArrowDown',
        preventDefault: vi.fn(),
      } as unknown as KeyboardEvent);

      expect(state.focusedKey()).toBe('item4');
      dispose();
    });
  });

  it('skips disabled keys when navigating with ArrowUp', () => {
    createRoot((dispose) => {
      const items = [
        { key: 'item1', label: 'Item 1' },
        { key: 'item2', label: 'Item 2' },
        { key: 'item3', label: 'Item 3' },
        { key: 'item4', label: 'Item 4' },
      ];

      const state = createMenuState({
        items,
        getKey: (item) => item.key,
        disabledKeys: ['item2', 'item3'],
      });

      const { menuProps } = createMenu({ 'aria-label': 'Test menu' }, state);

      // Start at item4
      state.setFocusedKey('item4');
      expect(state.focusedKey()).toBe('item4');

      // Press ArrowUp - should skip item3 and item2, land on item1
      const onKeyDown = menuProps.onKeyDown as (e: KeyboardEvent) => void;
      onKeyDown({
        key: 'ArrowUp',
        preventDefault: vi.fn(),
      } as unknown as KeyboardEvent);

      expect(state.focusedKey()).toBe('item1');
      dispose();
    });
  });

  it('skips disabled keys when navigating to Home', () => {
    createRoot((dispose) => {
      const items = [
        { key: 'item1', label: 'Item 1' },
        { key: 'item2', label: 'Item 2' },
        { key: 'item3', label: 'Item 3' },
      ];

      const state = createMenuState({
        items,
        getKey: (item) => item.key,
        disabledKeys: ['item1'],
      });

      const { menuProps } = createMenu({ 'aria-label': 'Test menu' }, state);

      // Start at item3
      state.setFocusedKey('item3');

      // Press Home - should skip item1, land on item2
      const onKeyDown = menuProps.onKeyDown as (e: KeyboardEvent) => void;
      onKeyDown({
        key: 'Home',
        preventDefault: vi.fn(),
      } as unknown as KeyboardEvent);

      expect(state.focusedKey()).toBe('item2');
      dispose();
    });
  });

  it('skips disabled keys when navigating to End', () => {
    createRoot((dispose) => {
      const items = [
        { key: 'item1', label: 'Item 1' },
        { key: 'item2', label: 'Item 2' },
        { key: 'item3', label: 'Item 3' },
      ];

      const state = createMenuState({
        items,
        getKey: (item) => item.key,
        disabledKeys: ['item3'],
      });

      const { menuProps } = createMenu({ 'aria-label': 'Test menu' }, state);

      // Start at item1
      state.setFocusedKey('item1');

      // Press End - should skip item3, land on item2
      const onKeyDown = menuProps.onKeyDown as (e: KeyboardEvent) => void;
      onKeyDown({
        key: 'End',
        preventDefault: vi.fn(),
      } as unknown as KeyboardEvent);

      expect(state.focusedKey()).toBe('item2');
      dispose();
    });
  });

  it('does not activate disabled items on Enter', () => {
    createRoot((dispose) => {
      const onAction = vi.fn();
      const items = [
        { key: 'item1', label: 'Item 1' },
        { key: 'item2', label: 'Item 2' },
      ];

      const state = createMenuState({
        items,
        getKey: (item) => item.key,
        disabledKeys: ['item1'],
      });

      const { menuProps } = createMenu({ 'aria-label': 'Test menu', onAction }, state);

      // Focus disabled item1
      state.setFocusedKey('item1');

      // Press Enter - should NOT call onAction
      const onKeyDown = menuProps.onKeyDown as (e: KeyboardEvent) => void;
      onKeyDown({
        key: 'Enter',
        preventDefault: vi.fn(),
      } as unknown as KeyboardEvent);

      expect(onAction).not.toHaveBeenCalled();
      dispose();
    });
  });

  it('wraps to first non-disabled key when shouldFocusWrap is true', () => {
    createRoot((dispose) => {
      const items = [
        { key: 'item1', label: 'Item 1' },
        { key: 'item2', label: 'Item 2' },
        { key: 'item3', label: 'Item 3' },
      ];

      const state = createMenuState({
        items,
        getKey: (item) => item.key,
        disabledKeys: ['item1'],
      });

      const { menuProps } = createMenu({ 'aria-label': 'Test menu', shouldFocusWrap: true }, state);

      // Start at item3 (last item)
      state.setFocusedKey('item3');

      // Press ArrowDown - should wrap and skip item1, land on item2
      const onKeyDown = menuProps.onKeyDown as (e: KeyboardEvent) => void;
      onKeyDown({
        key: 'ArrowDown',
        preventDefault: vi.fn(),
      } as unknown as KeyboardEvent);

      expect(state.focusedKey()).toBe('item2');
      dispose();
    });
  });
});

describe('createMenu - accessibility warnings', () => {
  afterEach(() => {
    cleanup();
  });

  it('should warn when no label is provided in development', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    createRoot((dispose) => {
      const items = [
        { key: 'copy', label: 'Copy' },
      ];

      const state = createMenuState({
        items,
        getKey: (item) => item.key,
      });

      // Create menu without label, aria-label, or aria-labelledby
      createMenu({}, state);

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Menu requires')
      );
      dispose();
    });

    warnSpy.mockRestore();
  });

  it('should not warn when aria-label is provided', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    createRoot((dispose) => {
      const items = [
        { key: 'copy', label: 'Copy' },
      ];

      const state = createMenuState({
        items,
        getKey: (item) => item.key,
      });

      createMenu({ 'aria-label': 'Actions menu' }, state);

      expect(warnSpy).not.toHaveBeenCalled();
      dispose();
    });

    warnSpy.mockRestore();
  });
});

describe('createMenuTrigger', () => {
  afterEach(() => {
    cleanup();
  });

  it('returns trigger props with aria-haspopup', () => {
    createRoot((dispose) => {
      const state = createOverlayTriggerState();
      const { menuTriggerProps } = createMenuTrigger({ type: 'menu' }, state);

      expect(menuTriggerProps['aria-haspopup']).toBe('menu');
      dispose();
    });
  });

  it('sets aria-expanded based on state', () => {
    createRoot((dispose) => {
      const state = createOverlayTriggerState();
      const { menuTriggerProps } = createMenuTrigger({}, state);

      expect(menuTriggerProps['aria-expanded']).toBe(false);

      state.open();
      const { menuTriggerProps: triggerPropsAfter } = createMenuTrigger({}, state);
      expect(triggerPropsAfter['aria-expanded']).toBe(true);
      dispose();
    });
  });

  it('sets aria-controls when open', () => {
    createRoot((dispose) => {
      const state = createOverlayTriggerState();
      const { menuTriggerProps, menuProps } = createMenuTrigger({}, state);

      expect(menuTriggerProps['aria-controls']).toBeUndefined();

      state.open();
      const { menuTriggerProps: triggerPropsAfter, menuProps: menuPropsAfter } = createMenuTrigger({}, state);
      expect(triggerPropsAfter['aria-controls']).toBe(menuPropsAfter.id);
      dispose();
    });
  });

  it('onPress toggles state', () => {
    createRoot((dispose) => {
      const state = createOverlayTriggerState();
      const { menuTriggerProps } = createMenuTrigger({}, state);

      expect(state.isOpen()).toBe(false);

      menuTriggerProps.onPress();
      expect(state.isOpen()).toBe(true);

      menuTriggerProps.onPress();
      expect(state.isOpen()).toBe(false);
      dispose();
    });
  });

  it('does not toggle when disabled', () => {
    createRoot((dispose) => {
      const state = createOverlayTriggerState();
      const { menuTriggerProps } = createMenuTrigger({ isDisabled: true }, state);

      menuTriggerProps.onPress();
      expect(state.isOpen()).toBe(false);
      dispose();
    });
  });

  it('opens on ArrowDown key', () => {
    createRoot((dispose) => {
      const state = createOverlayTriggerState();
      const { menuTriggerProps } = createMenuTrigger({}, state);

      menuTriggerProps.onKeyDown({
        key: 'ArrowDown',
        preventDefault: vi.fn(),
      } as unknown as KeyboardEvent);

      expect(state.isOpen()).toBe(true);
      dispose();
    });
  });

  it('opens on Enter key', () => {
    createRoot((dispose) => {
      const state = createOverlayTriggerState();
      const { menuTriggerProps } = createMenuTrigger({}, state);

      menuTriggerProps.onKeyDown({
        key: 'Enter',
        preventDefault: vi.fn(),
      } as unknown as KeyboardEvent);

      expect(state.isOpen()).toBe(true);
      dispose();
    });
  });

  it('opens on Space key', () => {
    createRoot((dispose) => {
      const state = createOverlayTriggerState();
      const { menuTriggerProps } = createMenuTrigger({}, state);

      menuTriggerProps.onKeyDown({
        key: ' ',
        preventDefault: vi.fn(),
      } as unknown as KeyboardEvent);

      expect(state.isOpen()).toBe(true);
      dispose();
    });
  });
});
