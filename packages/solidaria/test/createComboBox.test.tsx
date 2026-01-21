import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createRoot, createSignal } from 'solid-js';
import { createComboBox } from '../src/combobox';
import { createComboBoxState } from '@proyecto-viviana/solid-stately';
import * as liveAnnouncer from '../src/live-announcer';
import * as platform from '../src/utils/platform';

interface TestItem {
  id: string;
  name: string;
  disabled?: boolean;
}

const items: TestItem[] = [
  { id: '1', name: 'Apple' },
  { id: '2', name: 'Banana' },
  { id: '3', name: 'Cherry' },
  { id: '4', name: 'Date' },
  { id: '5', name: 'Elderberry' },
];

describe('createComboBox', () => {
  describe('input props', () => {
    it('should provide correct ARIA attributes for input', () => {
      createRoot((dispose) => {
        let inputRef: HTMLInputElement | null = null;

        const state = createComboBoxState({
          items,
          getKey: (item) => item.id,
          getTextValue: (item) => item.name,
        });

        const comboBox = createComboBox(
          { label: 'Fruit' },
          state,
          () => inputRef
        );

        expect(comboBox.inputProps.role).toBe('combobox');
        expect(comboBox.inputProps.type).toBe('text');
        expect(comboBox.inputProps['aria-haspopup']).toBe('listbox');
        expect(comboBox.inputProps['aria-expanded']).toBe(false);
        expect(comboBox.inputProps['aria-autocomplete']).toBe('list');
        expect(comboBox.inputProps.autoComplete).toBe('off');
        dispose();
      });
    });

    it('should update aria-expanded when open', () => {
      createRoot((dispose) => {
        let inputRef: HTMLInputElement | null = null;

        const state = createComboBoxState({
          items,
          getKey: (item) => item.id,
          getTextValue: (item) => item.name,
        });

        const comboBox = createComboBox(
          {},
          state,
          () => inputRef
        );

        expect(comboBox.inputProps['aria-expanded']).toBe(false);

        state.open();
        expect(comboBox.inputProps['aria-expanded']).toBe(true);

        state.close();
        expect(comboBox.inputProps['aria-expanded']).toBe(false);
        dispose();
      });
    });

    it('should provide aria-controls when open', () => {
      createRoot((dispose) => {
        let inputRef: HTMLInputElement | null = null;

        const state = createComboBoxState({
          items,
          getKey: (item) => item.id,
          getTextValue: (item) => item.name,
        });

        const comboBox = createComboBox(
          {},
          state,
          () => inputRef
        );

        expect(comboBox.inputProps['aria-controls']).toBeUndefined();

        state.open();
        expect(comboBox.inputProps['aria-controls']).toBe(comboBox.listBoxProps.id);
        dispose();
      });
    });

    it('should set aria-disabled when disabled', () => {
      createRoot((dispose) => {
        let inputRef: HTMLInputElement | null = null;

        const state = createComboBoxState({
          items,
          getKey: (item) => item.id,
          getTextValue: (item) => item.name,
          isDisabled: true,
        });

        const comboBox = createComboBox(
          {},
          state,
          () => inputRef
        );

        expect(comboBox.inputProps['aria-disabled']).toBe(true);
        expect(comboBox.inputProps.disabled).toBe(true);
        dispose();
      });
    });

    it('should set readOnly when read-only', () => {
      createRoot((dispose) => {
        let inputRef: HTMLInputElement | null = null;

        const state = createComboBoxState({
          items,
          getKey: (item) => item.id,
          getTextValue: (item) => item.name,
          isReadOnly: true,
        });

        const comboBox = createComboBox(
          {},
          state,
          () => inputRef
        );

        expect(comboBox.inputProps.readOnly).toBe(true);
        dispose();
      });
    });

    it('should bind input value to state', () => {
      createRoot((dispose) => {
        let inputRef: HTMLInputElement | null = null;

        const state = createComboBoxState({
          items,
          getKey: (item) => item.id,
          getTextValue: (item) => item.name,
        });

        const comboBox = createComboBox(
          {},
          state,
          () => inputRef
        );

        expect(comboBox.inputProps.value).toBe('');

        state.setInputValue('App');
        expect(comboBox.inputProps.value).toBe('App');
        dispose();
      });
    });

    it('should provide aria-activedescendant when focused key exists', () => {
      createRoot((dispose) => {
        let inputRef: HTMLInputElement | null = null;

        const state = createComboBoxState({
          items,
          getKey: (item) => item.id,
          getTextValue: (item) => item.name,
        });

        const comboBox = createComboBox(
          {},
          state,
          () => inputRef
        );

        expect(comboBox.inputProps['aria-activedescendant']).toBeUndefined();

        state.open();
        expect(comboBox.inputProps['aria-activedescendant']).toBeUndefined();

        state.setFocusedKey('2');
        expect(comboBox.inputProps['aria-activedescendant']).toBe(`${comboBox.listBoxProps.id}-option-2`);
        dispose();
      });
    });
  });

  describe('button props', () => {
    it('should provide correct attributes for button', () => {
      createRoot((dispose) => {
        let inputRef: HTMLInputElement | null = null;

        const state = createComboBoxState({
          items,
          getKey: (item) => item.id,
          getTextValue: (item) => item.name,
        });

        const comboBox = createComboBox(
          {},
          state,
          () => inputRef
        );

        expect(comboBox.buttonProps.type).toBe('button');
        expect(comboBox.buttonProps.tabIndex).toBe(-1);
        expect(comboBox.buttonProps['aria-haspopup']).toBe('listbox');
        expect(comboBox.buttonProps['aria-label']).toBe('Show suggestions');
        dispose();
      });
    });

    it('should update aria-expanded when open', () => {
      createRoot((dispose) => {
        let inputRef: HTMLInputElement | null = null;

        const state = createComboBoxState({
          items,
          getKey: (item) => item.id,
          getTextValue: (item) => item.name,
        });

        const comboBox = createComboBox(
          {},
          state,
          () => inputRef
        );

        expect(comboBox.buttonProps['aria-expanded']).toBe(false);

        state.open();
        expect(comboBox.buttonProps['aria-expanded']).toBe(true);
        dispose();
      });
    });
  });

  describe('listbox props', () => {
    it('should provide correct attributes for listbox', () => {
      createRoot((dispose) => {
        let inputRef: HTMLInputElement | null = null;

        const state = createComboBoxState({
          items,
          getKey: (item) => item.id,
          getTextValue: (item) => item.name,
        });

        const comboBox = createComboBox(
          {},
          state,
          () => inputRef
        );

        expect(comboBox.listBoxProps.role).toBe('listbox');
        expect(comboBox.listBoxProps['aria-labelledby']).toBe(comboBox.inputProps.id);
        expect(comboBox.listBoxProps.tabIndex).toBe(-1);
        dispose();
      });
    });
  });

  describe('label props', () => {
    it('should provide label props', () => {
      createRoot((dispose) => {
        let inputRef: HTMLInputElement | null = null;

        const state = createComboBoxState({
          items,
          getKey: (item) => item.id,
          getTextValue: (item) => item.name,
        });

        const comboBox = createComboBox(
          { label: 'Fruit' },
          state,
          () => inputRef
        );

        expect(comboBox.labelProps.id).toBeDefined();
        expect(comboBox.inputProps.id).toBeDefined();
        dispose();
      });
    });
  });

  describe('state accessors', () => {
    it('should expose isFocused', () => {
      createRoot((dispose) => {
        let inputRef: HTMLInputElement | null = null;

        const state = createComboBoxState({
          items,
          getKey: (item) => item.id,
          getTextValue: (item) => item.name,
        });

        const comboBox = createComboBox(
          {},
          state,
          () => inputRef
        );

        expect(comboBox.isFocused()).toBe(false);

        state.setFocused(true);
        expect(comboBox.isFocused()).toBe(true);
        dispose();
      });
    });

    it('should expose isOpen', () => {
      createRoot((dispose) => {
        let inputRef: HTMLInputElement | null = null;

        const state = createComboBoxState({
          items,
          getKey: (item) => item.id,
          getTextValue: (item) => item.name,
        });

        const comboBox = createComboBox(
          {},
          state,
          () => inputRef
        );

        expect(comboBox.isOpen()).toBe(false);

        state.open();
        expect(comboBox.isOpen()).toBe(true);
        dispose();
      });
    });

    it('should expose selectedItem', () => {
      createRoot((dispose) => {
        let inputRef: HTMLInputElement | null = null;

        const state = createComboBoxState({
          items,
          getKey: (item) => item.id,
          getTextValue: (item) => item.name,
          defaultSelectedKey: '2',
        });

        const comboBox = createComboBox(
          {},
          state,
          () => inputRef
        );

        expect(comboBox.selectedItem()?.textValue).toBe('Banana');
        dispose();
      });
    });
  });

  describe('data attributes', () => {
    it('should set data-open when open', () => {
      createRoot((dispose) => {
        let inputRef: HTMLInputElement | null = null;

        const state = createComboBoxState({
          items,
          getKey: (item) => item.id,
          getTextValue: (item) => item.name,
        });

        const comboBox = createComboBox(
          {},
          state,
          () => inputRef
        );

        expect(comboBox.inputProps['data-open']).toBeUndefined();

        state.open();
        expect(comboBox.inputProps['data-open']).toBe(true);
        dispose();
      });
    });

    it('should set data-disabled when disabled', () => {
      createRoot((dispose) => {
        let inputRef: HTMLInputElement | null = null;

        const state = createComboBoxState({
          items,
          getKey: (item) => item.id,
          getTextValue: (item) => item.name,
          isDisabled: true,
        });

        const comboBox = createComboBox(
          {},
          state,
          () => inputRef
        );

        expect(comboBox.inputProps['data-disabled']).toBe(true);
        dispose();
      });
    });

    it('should set data-readonly when read-only', () => {
      createRoot((dispose) => {
        let inputRef: HTMLInputElement | null = null;

        const state = createComboBoxState({
          items,
          getKey: (item) => item.id,
          getTextValue: (item) => item.name,
          isReadOnly: true,
        });

        const comboBox = createComboBox(
          {},
          state,
          () => inputRef
        );

        expect(comboBox.inputProps['data-readonly']).toBe(true);
        dispose();
      });
    });
  });

  describe('description and error props', () => {
    it('should provide description and error message props', () => {
      createRoot((dispose) => {
        let inputRef: HTMLInputElement | null = null;

        const state = createComboBoxState({
          items,
          getKey: (item) => item.id,
          getTextValue: (item) => item.name,
        });

        const comboBox = createComboBox(
          {},
          state,
          () => inputRef
        );

        expect(comboBox.descriptionProps.id).toBeDefined();
        expect(comboBox.errorMessageProps.id).toBeDefined();
        dispose();
      });
    });
  });

  describe('placeholder', () => {
    it('should pass placeholder to input props', () => {
      createRoot((dispose) => {
        let inputRef: HTMLInputElement | null = null;

        const state = createComboBoxState({
          items,
          getKey: (item) => item.id,
          getTextValue: (item) => item.name,
        });

        const comboBox = createComboBox(
          { placeholder: 'Select a fruit...' },
          state,
          () => inputRef
        );

        expect(comboBox.inputProps.placeholder).toBe('Select a fruit...');
        dispose();
      });
    });
  });

  describe('name', () => {
    it('should pass name to input props', () => {
      createRoot((dispose) => {
        let inputRef: HTMLInputElement | null = null;

        const state = createComboBoxState({
          items,
          getKey: (item) => item.id,
          getTextValue: (item) => item.name,
        });

        const comboBox = createComboBox(
          { name: 'fruit-select' },
          state,
          () => inputRef
        );

        expect(comboBox.inputProps.name).toBe('fruit-select');
        dispose();
      });
    });
  });

  describe('autoComplete option', () => {
    it('should default aria-autocomplete to list', () => {
      createRoot((dispose) => {
        let inputRef: HTMLInputElement | null = null;

        const state = createComboBoxState({
          items,
          getKey: (item) => item.id,
          getTextValue: (item) => item.name,
        });

        const comboBox = createComboBox(
          {},
          state,
          () => inputRef
        );

        expect(comboBox.inputProps['aria-autocomplete']).toBe('list');
        dispose();
      });
    });

    it('should allow custom aria-autocomplete', () => {
      createRoot((dispose) => {
        let inputRef: HTMLInputElement | null = null;

        const state = createComboBoxState({
          items,
          getKey: (item) => item.id,
          getTextValue: (item) => item.name,
        });

        const comboBox = createComboBox(
          { autoComplete: 'both' },
          state,
          () => inputRef
        );

        expect(comboBox.inputProps['aria-autocomplete']).toBe('both');
        dispose();
      });
    });
  });

  describe('required', () => {
    it('should set aria-required when required', () => {
      createRoot((dispose) => {
        let inputRef: HTMLInputElement | null = null;

        const state = createComboBoxState({
          items,
          getKey: (item) => item.id,
          getTextValue: (item) => item.name,
        });

        const comboBox = createComboBox(
          { isRequired: true },
          state,
          () => inputRef
        );

        expect(comboBox.inputProps['aria-required']).toBe(true);
        dispose();
      });
    });
  });

  describe('accessibility warnings', () => {
    it('should warn when no label is provided in development', () => {
      // Mock console.warn
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      createRoot((dispose) => {
        let inputRef: HTMLInputElement | null = null;

        const state = createComboBoxState({
          items,
          getKey: (item) => item.id,
          getTextValue: (item) => item.name,
        });

        // Create combobox without label, aria-label, or aria-labelledby
        createComboBox(
          {},
          state,
          () => inputRef
        );

        expect(warnSpy).toHaveBeenCalledWith(
          expect.stringContaining('ComboBox requires a label')
        );
        dispose();
      });

      warnSpy.mockRestore();
    });

    it('should not warn when aria-label is provided', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      createRoot((dispose) => {
        let inputRef: HTMLInputElement | null = null;

        const state = createComboBoxState({
          items,
          getKey: (item) => item.id,
          getTextValue: (item) => item.name,
        });

        createComboBox(
          { 'aria-label': 'Select fruit' },
          state,
          () => inputRef
        );

        expect(warnSpy).not.toHaveBeenCalled();
        dispose();
      });

      warnSpy.mockRestore();
    });

    it('should not warn when aria-labelledby is provided', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      createRoot((dispose) => {
        let inputRef: HTMLInputElement | null = null;

        const state = createComboBoxState({
          items,
          getKey: (item) => item.id,
          getTextValue: (item) => item.name,
        });

        createComboBox(
          { 'aria-labelledby': 'my-label-id' },
          state,
          () => inputRef
        );

        expect(warnSpy).not.toHaveBeenCalled();
        dispose();
      });

      warnSpy.mockRestore();
    });

    it('should not warn when label prop is provided', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      createRoot((dispose) => {
        let inputRef: HTMLInputElement | null = null;

        const state = createComboBoxState({
          items,
          getKey: (item) => item.id,
          getTextValue: (item) => item.name,
        });

        createComboBox(
          { label: 'Fruit' },
          state,
          () => inputRef
        );

        expect(warnSpy).not.toHaveBeenCalled();
        dispose();
      });

      warnSpy.mockRestore();
    });
  });

  describe('VoiceOver announcements', () => {
    let announceSpy: ReturnType<typeof vi.spyOn>;
    let isAppleDeviceSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      // Mark as test environment
      (globalThis as Record<string, unknown>).IS_SOLIDARIA_TEST = true;

      announceSpy = vi.spyOn(liveAnnouncer, 'announce').mockImplementation(() => {});
      isAppleDeviceSpy = vi.spyOn(platform, 'isAppleDevice');
    });

    afterEach(() => {
      announceSpy.mockRestore();
      isAppleDeviceSpy.mockRestore();
      delete (globalThis as Record<string, unknown>).IS_SOLIDARIA_TEST;
    });

    it('should not announce on non-Apple devices', () => {
      isAppleDeviceSpy.mockReturnValue(false);

      createRoot((dispose) => {
        let inputRef: HTMLInputElement | null = null;

        const state = createComboBoxState({
          items,
          getKey: (item) => item.id,
          getTextValue: (item) => item.name,
        });

        createComboBox(
          { label: 'Fruit' },
          state,
          () => inputRef
        );

        // Open the combobox and set focused key
        state.open();
        state.setFocusedKey('1');

        // announcements should not happen on non-Apple (checked synchronously)
        expect(announceSpy).not.toHaveBeenCalled();
        dispose();
      });
    });
  });
});
