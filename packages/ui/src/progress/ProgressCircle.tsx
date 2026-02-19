/**
 * ProgressCircle component for proyecto-viviana-ui
 *
 * A circular SVG progress indicator.
 */

import { type JSX, splitProps, Show } from 'solid-js';
import {
  ProgressBar as HeadlessProgressBar,
  type ProgressBarRenderProps,
} from '@proyecto-viviana/solidaria-components';

// ============================================
// TYPES
// ============================================

export type ProgressCircleSize = 'sm' | 'md' | 'lg';
export type ProgressCircleVariant = 'primary' | 'accent';

export interface ProgressCircleProps {
  /** The current value. @default 0 */
  value?: number;
  /** The smallest value allowed. @default 0 */
  minValue?: number;
  /** The largest value allowed. @default 100 */
  maxValue?: number;
  /** Whether presentation is indeterminate. */
  isIndeterminate?: boolean;
  /** The size of the progress circle. @default 'md' */
  size?: ProgressCircleSize;
  /** The visual variant. @default 'primary' */
  variant?: ProgressCircleVariant;
  /** Additional CSS class name. */
  class?: string;
  /** An accessibility label. */
  'aria-label'?: string;
}

// ============================================
// STYLES
// ============================================

const sizeConfig: Record<ProgressCircleSize, { size: number; stroke: number }> = {
  sm: { size: 24, stroke: 3 },
  md: { size: 36, stroke: 3 },
  lg: { size: 48, stroke: 4 },
};

const variantColors: Record<ProgressCircleVariant, string> = {
  primary: 'stroke-primary-400',
  accent: 'stroke-accent',
};

// ============================================
// COMPONENT
// ============================================

/**
 * A circular progress indicator using SVG.
 */
export function ProgressCircle(props: ProgressCircleProps): JSX.Element {
  const [local, headlessProps] = splitProps(props, ['size', 'variant', 'class']);

  const size = () => local.size ?? 'md';
  const config = () => sizeConfig[size()];
  const variant = () => local.variant ?? 'primary';

  const radius = () => (config().size - config().stroke) / 2;
  const circumference = () => 2 * Math.PI * radius();
  const center = () => config().size / 2;

  return (
    <HeadlessProgressBar
      {...headlessProps}
      class={`inline-flex ${local.class ?? ''}`}
    >
      {(renderProps: ProgressBarRenderProps) => {
        const offset = () => renderProps.isIndeterminate
          ? circumference() * 0.75
          : circumference() - ((renderProps.percentage ?? 0) / 100) * circumference();

        return (
          <svg
            width={config().size}
            height={config().size}
            viewBox={`0 0 ${config().size} ${config().size}`}
            class={renderProps.isIndeterminate ? 'animate-spin' : ''}
          >
            <circle
              cx={center()}
              cy={center()}
              r={radius()}
              fill="none"
              stroke-width={String(config().stroke)}
              class="stroke-bg-300"
            />
            <circle
              cx={center()}
              cy={center()}
              r={radius()}
              fill="none"
              stroke-width={String(config().stroke)}
              stroke-dasharray={String(circumference())}
              stroke-dashoffset={String(offset())}
              stroke-linecap="round"
              class={`transition-all duration-300 ${variantColors[variant()]}`}
              transform={`rotate(-90 ${center()} ${center()})`}
            />
          </svg>
        );
      }}
    </HeadlessProgressBar>
  );
}
