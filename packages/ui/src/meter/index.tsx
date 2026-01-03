/**
 * Meter component for proyecto-viviana-ui
 *
 * Styled meter component built on top of the solidaria hook directly.
 * Meters represent a quantity within a known range (unlike progress bars which show progress toward a goal).
 */

import { type JSX, splitProps, Show, createMemo } from 'solid-js';
import { createMeter } from '@proyecto-viviana/solidaria';

// ============================================
// TYPES
// ============================================

export type MeterSize = 'sm' | 'md' | 'lg';
export type MeterVariant = 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'info';

export interface MeterProps {
  /** The current value (controlled). @default 0 */
  value?: number;
  /** The smallest value allowed. @default 0 */
  minValue?: number;
  /** The largest value allowed. @default 100 */
  maxValue?: number;
  /** The content to display as the value's label (e.g. "75 GB"). */
  valueLabel?: string;
  /** The size of the meter. @default 'md' */
  size?: MeterSize;
  /** The visual style variant. @default 'primary' */
  variant?: MeterVariant;
  /** The label to display above the meter. */
  label?: string;
  /** Whether to show the value text. @default true */
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
  info: 'bg-blue-500',
};

// ============================================
// UTILITIES
// ============================================

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// ============================================
// METER COMPONENT
// ============================================

/**
 * Meters represent a quantity within a known range, or a fractional value.
 * Unlike progress bars, meters represent a current value rather than progress toward a goal.
 *
 * @example
 * ```tsx
 * // Storage usage meter
 * <Meter value={75} label="Storage space" valueLabel="75 GB of 100 GB" />
 *
 * // Battery level
 * <Meter value={25} variant="warning" label="Battery" />
 *
 * // CPU usage with dynamic color
 * <Meter value={cpuUsage} variant={cpuUsage > 80 ? 'danger' : 'success'} label="CPU" />
 * ```
 */
export function Meter(props: MeterProps): JSX.Element {
  const [local, ariaProps] = splitProps(props, [
    'size',
    'variant',
    'label',
    'showValueLabel',
    'class',
  ]);

  const size = () => local.size ?? 'md';
  const variant = () => local.variant ?? 'primary';
  const showValueLabel = () => local.showValueLabel ?? true;

  // Create meter aria props
  const meterAria = createMeter({
    get value() { return ariaProps.value; },
    get minValue() { return ariaProps.minValue; },
    get maxValue() { return ariaProps.maxValue; },
    get valueLabel() { return ariaProps.valueLabel; },
    get label() { return local.label; },
    get 'aria-label'() { return ariaProps['aria-label']; },
  });

  // Calculate percentage
  const percentage = createMemo(() => {
    const value = ariaProps.value ?? 0;
    const minValue = ariaProps.minValue ?? 0;
    const maxValue = ariaProps.maxValue ?? 100;
    const clampedValue = clamp(value, minValue, maxValue);
    return ((clampedValue - minValue) / (maxValue - minValue)) * 100;
  });

  // Get value text from aria props
  const valueText = () => meterAria.meterProps['aria-valuetext'] as string | undefined;

  const sizeConfig = () => sizeStyles[size()];

  return (
    <div
      {...meterAria.meterProps}
      class={`w-full ${local.class ?? ''}`}
    >
      {/* Label and value row */}
      <Show when={local.label || showValueLabel()}>
        <div class={`flex justify-between items-center mb-1 ${sizeConfig().text}`}>
          <Show when={local.label}>
            <span class="text-primary-200 font-medium">{local.label}</span>
          </Show>
          <Show when={showValueLabel()}>
            <span class="text-primary-300">{valueText()}</span>
          </Show>
        </div>
      </Show>

      {/* Track */}
      <div class={`w-full ${sizeConfig().track} bg-bg-300 rounded-full overflow-hidden`}>
        {/* Fill */}
        <div
          class={`h-full rounded-full transition-all duration-300 ${variantStyles[variant()]}`}
          style={{
            width: `${percentage()}%`,
          }}
        />
      </div>
    </div>
  );
}
