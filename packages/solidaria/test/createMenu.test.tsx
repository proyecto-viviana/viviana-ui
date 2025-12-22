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
