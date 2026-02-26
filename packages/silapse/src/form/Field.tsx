/**
 * Field component for proyecto-viviana-silapse
 *
 * A compound field layout with label, input slot, help text, and error message.
 */

import { type JSX, splitProps, Show } from 'solid-js';

// ============================================
// TYPES
// ============================================

export type FieldSize = 'sm' | 'md' | 'lg';

export interface FieldProps {
  /** The label for the field. */
  label?: string;
  /** A description or help text for the field. */
  description?: string;
  /** An error message for the field. */
  errorMessage?: string;
  /** Whether the field is required. */
  isRequired?: boolean;
  /** Whether the field is disabled. */
  isDisabled?: boolean;
  /** Whether the field is invalid. */
  isInvalid?: boolean;
  /** The size of the field. @default 'md' */
  size?: FieldSize;
  /** Additional CSS class name. */
  class?: string;
  /** The field content (input element). */
  children?: JSX.Element;
  /** ID for the label's htmlFor attribute. */
  htmlFor?: string;
}

// ============================================
// STYLES
// ============================================

const sizeStyles: Record<FieldSize, { label: string; text: string; gap: string }> = {
  sm: { label: 'text-xs', text: 'text-xs', gap: 'gap-1' },
  md: { label: 'text-sm', text: 'text-sm', gap: 'gap-1.5' },
  lg: { label: 'text-base', text: 'text-sm', gap: 'gap-2' },
};

// ============================================
// COMPONENT
// ============================================

/**
 * A field layout component that provides label, help text, and error message
 * around a form input.
 */
export function Field(props: FieldProps): JSX.Element {
  const [local] = splitProps(props, [
    'label', 'description', 'errorMessage', 'isRequired', 'isDisabled',
    'isInvalid', 'size', 'class', 'children', 'htmlFor',
  ]);

  const size = () => sizeStyles[local.size ?? 'md'];
  const showError = () => local.isInvalid && local.errorMessage;

  return (
    <div class={`flex flex-col ${size().gap} ${local.isDisabled ? 'opacity-60' : ''} ${local.class ?? ''}`}>
      <Show when={local.label}>
        <label
          for={local.htmlFor}
          class={`font-medium text-primary-200 ${size().label}`}
        >
          {local.label}
          <Show when={local.isRequired}>
            <span class="text-red-400 ml-0.5">*</span>
          </Show>
        </label>
      </Show>

      {local.children}

      <Show when={showError()}>
        <p class={`text-red-400 ${size().text}`} role="alert">
          {local.errorMessage}
        </p>
      </Show>

      <Show when={!showError() && local.description}>
        <p class={`text-primary-400 ${size().text}`}>
          {local.description}
        </p>
      </Show>
    </div>
  );
}
