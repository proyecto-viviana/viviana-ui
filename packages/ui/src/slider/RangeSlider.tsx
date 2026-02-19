/**
 * RangeSlider component for proyecto-viviana-ui
 *
 * A dual-thumb range slider for selecting value ranges.
 */

import { type JSX, splitProps, Show } from 'solid-js';
import {
  Slider as HeadlessSlider,
  SliderTrack as HeadlessSliderTrack,
  SliderThumb as HeadlessSliderThumb,
  SliderOutput as HeadlessSliderOutput,
  type SliderProps as HeadlessSliderProps,
  type SliderRenderProps,
  type SliderTrackRenderProps,
  type SliderThumbRenderProps,
} from '@proyecto-viviana/solidaria-components';

// ============================================
// TYPES
// ============================================

export type RangeSliderSize = 'sm' | 'md' | 'lg';

export interface RangeSliderProps extends Omit<HeadlessSliderProps, 'class' | 'style' | 'children' | 'label'> {
  /** The size of the slider. @default 'md' */
  size?: RangeSliderSize;
  /** Additional CSS class name. */
  class?: string;
  /** Label text for the slider. */
  label?: string;
  /** Whether to show the value output. @default true */
  showOutput?: boolean;
}

// ============================================
// STYLES
// ============================================

const sizeStyles: Record<RangeSliderSize, { track: string; thumb: string; label: string }> = {
  sm: { track: 'h-1', thumb: 'w-3 h-3', label: 'text-sm' },
  md: { track: 'h-2', thumb: 'w-4 h-4', label: 'text-sm' },
  lg: { track: 'h-3', thumb: 'w-5 h-5', label: 'text-base' },
};

// ============================================
// COMPONENT
// ============================================

/**
 * A dual-thumb slider for selecting a range of values.
 */
export function RangeSlider(props: RangeSliderProps): JSX.Element {
  const [local, headlessProps] = splitProps(props, ['size', 'class', 'label', 'showOutput']);
  const size = () => sizeStyles[local.size ?? 'md'];

  const thumbClasses = (renderProps: SliderThumbRenderProps): string => {
    const base = 'absolute rounded-full shadow-md transition-all';
    const sizeClass = size().thumb;

    let stateClass: string;
    if (renderProps.isDisabled) {
      stateClass = 'bg-primary-400 cursor-not-allowed';
    } else if (renderProps.isDragging) {
      stateClass = 'bg-accent-400 scale-110 cursor-grabbing';
    } else if (renderProps.isHovered) {
      stateClass = 'bg-accent-400 scale-105 cursor-grab';
    } else {
      stateClass = 'bg-accent cursor-grab';
    }

    const focusClass = renderProps.isFocusVisible ? 'ring-2 ring-accent ring-offset-2 ring-offset-bg-100' : '';
    return [base, sizeClass, stateClass, focusClass].filter(Boolean).join(' ');
  };

  return (
    <HeadlessSlider
      {...headlessProps}
      aria-label={headlessProps['aria-label'] ?? local.label}
      class={`flex flex-col w-full ${headlessProps.isDisabled ? 'opacity-60' : ''} ${local.class ?? ''}`}
      children={(_renderProps: SliderRenderProps) => (
        <>
          <Show when={local.label || (local.showOutput ?? true)}>
            <div class="flex justify-between items-center mb-2">
              <Show when={local.label}>
                <span class={`font-medium text-primary-200 ${size().label}`}>{local.label}</span>
              </Show>
              <Show when={local.showOutput ?? true}>
                <HeadlessSliderOutput class={`font-medium text-primary-100 ${size().label}`} />
              </Show>
            </div>
          </Show>
          <div class="relative w-full">
            <HeadlessSliderTrack
              class={(_trackRenderProps: SliderTrackRenderProps) => {
                const base = 'relative rounded-full bg-bg-300 w-full';
                return [base, size().track, headlessProps.isDisabled ? '' : 'cursor-pointer'].filter(Boolean).join(' ');
              }}
            >
              {() => (
                <>
                  <HeadlessSliderThumb class={thumbClasses} />
                  <HeadlessSliderThumb class={thumbClasses} />
                </>
              )}
            </HeadlessSliderTrack>
          </div>
        </>
      )}
    />
  );
}
