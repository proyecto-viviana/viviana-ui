/**
 * Tests for createListBox and createOption hooks
 */

import { describe, it, expect, vi } from 'vitest';
import { createRoot } from 'solid-js';
import { render, fireEvent, screen, cleanup } from '@solidjs/testing-library';
import { createListState, createListCollection } from '../../solid-stately/src';
import { createListBox, createOption } from '../src/listbox';

describe('createListBox', () => {
  afterEach(() => {
    cleanup();
  });

  it('returns listbox props with role="listbox"', () => {
    createRoot((dispose) => {
      const items = [
        { key: 'a', label: 'Apple' },
        { key: 'b', label: 'Banana' },
      ];

      const state = createListState({
        items,
        getKey: (item) => item.key,
        selectionMode: 'single',
      });

      const { listBoxProps } = createListBox({}, state);

      expect(listBoxProps.role).toBe('listbox');
      dispose();
    });
  });

  it('sets aria-multiselectable for multiple selection', () => {
    createRoot((dispose) => {
      const items = [
        { key: 'a', label: 'Apple' },
        { key: 'b', label: 'Banana' },
      ];

      const state = createListState({
        items,
        getKey: (item) => item.key,
        selectionMode: 'multiple',
      });

      const { listBoxProps } = createListBox({}, state);

      expect(listBoxProps['aria-multiselectable']).toBe(true);
      dispose();
    });
  });

  it('sets aria-disabled when disabled', () => {
    createRoot((dispose) => {
      const items = [
        { key: 'a', label: 'Apple' },
        { key: 'b', label: 'Banana' },
      ];

      const state = createListState({
        items,
        getKey: (item) => item.key,
        selectionMode: 'single',
      });

      const { listBoxProps } = createListBox({ isDisabled: true }, state);

      expect(listBoxProps['aria-disabled']).toBe(true);
      dispose();
    });
  });

  it('has tabIndex 0 when not disabled', () => {
    createRoot((dispose) => {
      const items = [
        { key: 'a', label: 'Apple' },
      ];

      const state = createListState({
        items,
        getKey: (item) => item.key,
        selectionMode: 'single',
      });

      const { listBoxProps } = createListBox({}, state);

      expect(listBoxProps.tabIndex).toBe(0);
      dispose();
    });
  });

  it('calls onAction when action occurs', () => {
    createRoot((dispose) => {
      const onAction = vi.fn();
      const items = [
        { key: 'a', label: 'Apple' },
        { key: 'b', label: 'Banana' },
      ];

      const state = createListState({
        items,
        getKey: (item) => item.key,
        selectionMode: 'single',
      });

      state.setFocusedKey('a');

      const { listBoxProps } = createListBox({ onAction }, state);

      // Simulate Enter key
      const onKeyDown = listBoxProps.onKeyDown as (e: KeyboardEvent) => void;
      onKeyDown({
        key: 'Enter',
        preventDefault: vi.fn(),
      } as unknown as KeyboardEvent);

      expect(onAction).toHaveBeenCalledWith('a');
      dispose();
    });
  });
});

describe('createOption', () => {
  afterEach(() => {
    cleanup();
  });

  it('returns option props with role="option"', () => {
    createRoot((dispose) => {
      const items = [
        { key: 'a', label: 'Apple' },
      ];

      const state = createListState({
        items,
        getKey: (item) => item.key,
        selectionMode: 'single',
      });

      const { optionProps } = createOption({ key: 'a' }, state);

      expect(optionProps.role).toBe('option');
      dispose();
    });
  });

  it('sets aria-selected when selected', () => {
    createRoot((dispose) => {
      const items = [
        { key: 'a', label: 'Apple' },
        { key: 'b', label: 'Banana' },
      ];

      const state = createListState({
        items,
        getKey: (item) => item.key,
        selectionMode: 'single',
        defaultSelectedKeys: ['a'],
      });

      const { optionProps: optionPropsA } = createOption({ key: 'a' }, state);
      const { optionProps: optionPropsB } = createOption({ key: 'b' }, state);

      expect(optionPropsA['aria-selected']).toBe(true);
      expect(optionPropsB['aria-selected']).toBe(false);
      dispose();
    });
  });

  it('sets aria-disabled when disabled', () => {
    createRoot((dispose) => {
      const items = [
        { key: 'a', label: 'Apple' },
      ];

      const state = createListState({
        items,
        getKey: (item) => item.key,
        selectionMode: 'single',
        disabledKeys: ['a'],
      });

      const { optionProps, isDisabled } = createOption({ key: 'a' }, state);

      expect(optionProps['aria-disabled']).toBe(true);
      expect(isDisabled()).toBe(true);
      dispose();
    });
  });

  it('tracks selection state', () => {
    createRoot((dispose) => {
      const items = [
        { key: 'a', label: 'Apple' },
      ];

      const state = createListState({
        items,
        getKey: (item) => item.key,
        selectionMode: 'single',
      });

      const { isSelected } = createOption({ key: 'a' }, state);

      expect(isSelected()).toBe(false);

      state.select('a');
      expect(isSelected()).toBe(true);
      dispose();
    });
  });

  it('tracks focused state', () => {
    createRoot((dispose) => {
      const items = [
        { key: 'a', label: 'Apple' },
        { key: 'b', label: 'Banana' },
      ];

      const state = createListState({
        items,
        getKey: (item) => item.key,
        selectionMode: 'single',
      });

      const { isFocused: isFocusedA } = createOption({ key: 'a' }, state);
      const { isFocused: isFocusedB } = createOption({ key: 'b' }, state);

      expect(isFocusedA()).toBe(false);
      expect(isFocusedB()).toBe(false);

      state.setFocusedKey('a');
      expect(isFocusedA()).toBe(true);
      expect(isFocusedB()).toBe(false);
      dispose();
    });
  });
});
