/**
 * Meter component for solidaria-components
 *
 * Pre-wired headless meter component that combines aria hooks.
 * Port of react-aria-components/src/Meter.tsx
 *
 * Meters represent a quantity within a known range, or a fractional value.
 * Unlike progress bars, meters represent a current value rather than progress toward a goal.
 */

import {
  type JSX,
  type ParentProps,
  createContext,
  createMemo,
  splitProps,
} from 'solid-js';
import {
  createMeter,
  type AriaMeterProps,
} from '@proyecto-viviana/solidaria';
import {
  type RenderChildren,
  type ClassNameOrFunction,
  type StyleOrFunction,
  type SlotProps,
  useRenderProps,
  filterDOMProps,
} from './utils';

// ============================================
// TYPES
// ============================================

export interface MeterRenderProps {
  /** The value as a percentage between the minimum and maximum (0-100). */
  percentage: number;
  /** A formatted version of the value. */
  valueText: string | undefined;
}

export interface MeterProps
  extends AriaMeterProps,
    SlotProps {
  /** The children of the component. A function may be provided to receive render props. */
  children?: RenderChildren<MeterRenderProps>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<MeterRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<MeterRenderProps>;
}

// ============================================
// CONTEXT
// ============================================

export const MeterContext = createContext<MeterProps | null>(null);

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
 * A meter represents a quantity within a known range, or a fractional value.
 * Unlike progress bars, meters represent a current value rather than progress toward a goal.
 *
 * @example
 * ```tsx
 * <Meter value={75}>
 *   {({ percentage, valueText }) => (
 *     <>
 *       <Label>Storage space</Label>
 *       <span>{valueText}</span>
 *       <div class="bar" style={{ width: `${percentage}%` }} />
 *     </>
 *   )}
 * </Meter>
 * ```
 */
export function Meter(props: ParentProps<MeterProps>): JSX.Element {
  const [local, ariaProps] = splitProps(props, [
    'children',
    'class',
    'style',
    'slot',
  ]);

  // Get values for calculations
  const value = () => ariaProps.value ?? 0;
  const minValue = () => ariaProps.minValue ?? 0;
  const maxValue = () => ariaProps.maxValue ?? 100;

  // Create meter aria props
  const meterAria = createMeter({
    get value() { return ariaProps.value; },
    get minValue() { return ariaProps.minValue; },
    get maxValue() { return ariaProps.maxValue; },
    get valueLabel() { return ariaProps.valueLabel; },
    get formatOptions() { return ariaProps.formatOptions; },
    get label() { return ariaProps.label; },
    get 'aria-label'() { return ariaProps['aria-label']; },
    get 'aria-labelledby'() { return ariaProps['aria-labelledby']; },
    get 'aria-describedby'() { return ariaProps['aria-describedby']; },
    get 'aria-details'() { return ariaProps['aria-details']; },
  });

  // Calculate percentage
  const percentage = createMemo(() => {
    const clampedValue = clamp(value(), minValue(), maxValue());
    return ((clampedValue - minValue()) / (maxValue() - minValue())) * 100;
  });

  // Get value text from aria props
  const valueText = createMemo(() => {
    return meterAria.meterProps['aria-valuetext'] as string | undefined;
  });

  // Render props values
  const renderValues = createMemo<MeterRenderProps>(() => ({
    percentage: percentage(),
    valueText: valueText(),
  }));

  // Resolve render props
  const renderProps = useRenderProps(
    {
      children: props.children,
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-Meter',
    },
    renderValues
  );

  // Filter DOM props
  const domProps = createMemo(() => filterDOMProps(ariaProps, { global: true }));

  return (
    <div
      {...domProps()}
      {...meterAria.meterProps}
      class={renderProps.class()}
      style={renderProps.style()}
      slot={local.slot}
    >
      {renderProps.renderChildren()}
    </div>
  );
}
