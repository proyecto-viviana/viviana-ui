/**
 * createFormReset - Handles form reset events for form fields.
 *
 * Resets the field value to its default when the containing form is reset.
 * Port of @react-aria/utils useFormReset.
 */

import { type Accessor, createEffect, onCleanup } from 'solid-js';

export interface FormResetOptions<T> {
  /** The default value to reset to. */
  defaultValue: T;
  /** Function to set the current value. */
  onReset: (value: T) => void;
}

/**
 * Listens for form reset events and resets the field value to its default.
 *
 * @example
 * ```tsx
 * createFormReset(
 *   () => inputRef,
 *   { label: 'Default' },
 *   (value) => state.setSelectedKey(value.key)
 * );
 * ```
 */
export function createFormReset<T>(
  ref: Accessor<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | undefined>,
  defaultValue: T,
  onReset: (value: T) => void
): void {
  createEffect(() => {
    const element = ref();
    if (!element) return;

    const form = element.form;
    if (!form) return;

    const handleReset = () => {
      onReset(defaultValue);
    };

    form.addEventListener('reset', handleReset);

    onCleanup(() => {
      form.removeEventListener('reset', handleReset);
    });
  });
}
