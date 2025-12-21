/**
 * ProgressBar component for proyecto-viviana-ui
 *
 * Styled progress bar component built on top of the solidaria hook directly.
 */

import { type JSX, splitProps, Show, createMemo } from 'solid-js';
import { createProgressBar } from '@proyecto-viviana/solidaria';

// ============================================
// TYPES
// ============================================

export type ProgressBarSize = 'sm' | 'md' | 'lg';
export type ProgressBarVariant = 'primary' | 'accent' | 'success' | 'warning' | 'danger';

export interface ProgressBarProps {
  /** The current value (controlled). @default 0 */
  value?: number;
  /** The smallest value allowed. @default 0 */
  minValue?: number;
  /** The largest value allowed. @default 100 */
  maxValue?: number;
  /** The content to display as the value's label (e.g. "1 of 4"). */
  valueLabel?: string;
  /** Whether presentation is indeterminate when progress isn't known. */
  isIndeterminate?: boolean;
  /** The size of the progress bar. @default 'md' */
  size?: ProgressBarSize;
  /** The visual style variant. @default 'primary' */
  variant?: ProgressBarVariant;
  /** The label to display above the progress bar. */
  label?: string;
  /** Whether to show the value text. @default true for determinate progress */
  showValueLabel?: boolean;
  /** Additional CSS class name. */
  class?: string;
  /** An accessibility label. */
  'aria-label'?: string;
}

// ============================================
// STYLES
// ============================================

const sizeStyles = {
  sm: {
    track: 'h-1',
    text: 'text-xs',
  },
  md: {
    track: 'h-2',
    text: 'text-sm',
  },
  lg: {
    track: 'h-3',
    text: 'text-base',
  },
};

const variantStyles = {
  primary: 'bg-primary-500',
  accent: 'bg-accent',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  danger: 'bg-red-500',
};

// ============================================
// UTILITIES
// ============================================

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// ============================================
// PROGRESSBAR COMPONENT
// ============================================

/**
 * Progress bars show either determinate or indeterminate progress of an operation
 * over time.
 *
 * @example
 * ```tsx
 * <ProgressBar value={50} label="Loading..." />
 *
 * // Indeterminate
 * <ProgressBar isIndeterminate label="Processing..." />
 *
 * // Different variants
 * <ProgressBar value={75} variant="success" />
 * ```
 */
export function ProgressBar(props: ProgressBarProps): JSX.Element {
  const [local, ariaProps] = splitProps(props, [
    'size',
    'variant',
    'label',
    'showValueLabel',
    'class',
  ]);

  const size = () => local.size ?? 'md';
  const variant = () => local.variant ?? 'primary';
  const isIndeterminate = () => ariaProps.isIndeterminate ?? false;
  const showValueLabel = () => local.showValueLabel ?? !isIndeterminate();

  // Create progress bar aria props
  const progressAria = createProgressBar({
    get value() { return ariaProps.value; },
    get minValue() { return ariaProps.minValue; },
    get maxValue() { return ariaProps.maxValue; },
    get valueLabel() { return ariaProps.valueLabel; },
    get isIndeterminate() { return ariaProps.isIndeterminate; },
    get label() { return local.label; },
    get 'aria-label'() { return ariaProps['aria-label']; },
  });

  // Calculate percentage
  const percentage = createMemo(() => {
    if (isIndeterminate()) {
      return undefined;
    }
    const value = ariaProps.value ?? 0;
    const minValue = ariaProps.minValue ?? 0;
    const maxValue = ariaProps.maxValue ?? 100;
    const clampedValue = clamp(value, minValue, maxValue);
    return ((clampedValue - minValue) / (maxValue - minValue)) * 100;
  });

  // Get value text from aria props
  const valueText = () => progressAria.progressBarProps['aria-valuetext'] as string | undefined;

  const sizeConfig = () => sizeStyles[size()];

  return (
    <div
      {...progressAria.progressBarProps}
      class={`w-full ${local.class ?? ''}`}
    >
      {/* Label and value row */}
      <Show when={local.label || showValueLabel()}>
        <div class={`flex justify-between items-center mb-1 ${sizeConfig().text}`}>
          <Show when={local.label}>
            <span class="text-primary-200 font-medium">{local.label}</span>
          </Show>
          <Show when={showValueLabel() && !isIndeterminate()}>
            <span class="text-primary-300">{valueText()}</span>
          </Show>
        </div>
      </Show>

      {/* Track */}
      <div class={`w-full ${sizeConfig().track} bg-bg-300 rounded-full overflow-hidden`}>
        {/* Fill */}
        <div
          class={`h-full rounded-full transition-all duration-300 ${variantStyles[variant()]} ${
            isIndeterminate() ? 'animate-progress-indeterminate' : ''
          }`}
          style={{
            width: isIndeterminate() ? '30%' : `${percentage()}%`,
          }}
        />
      </div>
    </div>
  );
}
