/**
 * RangeSlider component for proyecto-viviana-silapse
 *
 * A dual-thumb range slider for selecting value ranges.
 * Self-contained component that manages its own dual-value state,
 * since the headless Slider only supports single-value.
 */

import { type JSX, createSignal, createMemo, Show, onCleanup } from 'solid-js';

// ============================================
// TYPES
// ============================================

export type RangeSliderSize = 'sm' | 'md' | 'lg';

export interface RangeValue {
  start: number;
  end: number;
}

export interface RangeSliderProps {
  /** The current value (controlled). */
  value?: RangeValue;
  /** The default value (uncontrolled). */
  defaultValue?: RangeValue;
  /** Handler called when the value changes. */
  onChange?: (value: RangeValue) => void;
  /** Handler called when the user stops dragging. */
  onChangeEnd?: (value: RangeValue) => void;
  /** The minimum value. @default 0 */
  minValue?: number;
  /** The maximum value. @default 100 */
  maxValue?: number;
  /** The step value. @default 1 */
  step?: number;
  /** The size of the slider. @default 'md' */
  size?: RangeSliderSize;
  /** Additional CSS class name. */
  class?: string;
  /** Label text for the slider. */
  label?: string;
  /** Whether to show the value output. @default true */
  showOutput?: boolean;
  /** Whether the slider is disabled. */
  isDisabled?: boolean;
  /** Number format options for the output. */
  formatOptions?: Intl.NumberFormatOptions;
  /** Accessible label. */
  'aria-label'?: string;
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
// HELPERS
// ============================================

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function snapToStep(value: number, min: number, max: number, step: number): number {
  const snapped = Math.round((value - min) / step) * step + min;
  const decimalPlaces = (step.toString().split('.')[1] || '').length;
  const rounded = parseFloat(snapped.toFixed(decimalPlaces));
  return clamp(rounded, min, max);
}

// ============================================
// COMPONENT
// ============================================

/**
 * A dual-thumb slider for selecting a range of values.
 */
export function RangeSlider(props: RangeSliderProps): JSX.Element {
  const minValue = () => props.minValue ?? 0;
  const maxValue = () => props.maxValue ?? 100;
  const step = () => props.step ?? 1;
  const size = () => sizeStyles[props.size ?? 'md'];
  const isDisabled = () => props.isDisabled ?? false;

  // Internal state for uncontrolled mode
  const defaultStart = () => props.defaultValue?.start ?? minValue();
  const defaultEnd = () => props.defaultValue?.end ?? maxValue();
  const [internalStart, setInternalStart] = createSignal(
    snapToStep(defaultStart(), minValue(), maxValue(), step())
  );
  const [internalEnd, setInternalEnd] = createSignal(
    snapToStep(defaultEnd(), minValue(), maxValue(), step())
  );

  // Controlled vs uncontrolled
  const startValue = createMemo(() => {
    if (props.value !== undefined) {
      return snapToStep(props.value.start, minValue(), maxValue(), step());
    }
    return internalStart();
  });

  const endValue = createMemo(() => {
    if (props.value !== undefined) {
      return snapToStep(props.value.end, minValue(), maxValue(), step());
    }
    return internalEnd();
  });

  // Percentages for positioning
  const startPercent = createMemo(() =>
    (startValue() - minValue()) / (maxValue() - minValue())
  );
  const endPercent = createMemo(() =>
    (endValue() - minValue()) / (maxValue() - minValue())
  );

  // Formatted values
  const formatter = createMemo(() => new Intl.NumberFormat(undefined, props.formatOptions));
  const formattedOutput = createMemo(() => {
    return `${formatter().format(startValue())} – ${formatter().format(endValue())}`;
  });

  // Set range value
  const setRange = (start: number, end: number) => {
    if (isDisabled()) return;
    const s = snapToStep(start, minValue(), maxValue(), step());
    const e = snapToStep(end, minValue(), maxValue(), step());
    // Ensure start <= end
    const newStart = Math.min(s, e);
    const newEnd = Math.max(s, e);

    if (props.value === undefined) {
      setInternalStart(newStart);
      setInternalEnd(newEnd);
    }
    props.onChange?.({ start: newStart, end: newEnd });
  };

  // Dragging state
  const [draggingThumb, setDraggingThumb] = createSignal<'start' | 'end' | null>(null);
  const [focusedThumb, setFocusedThumb] = createSignal<'start' | 'end' | null>(null);

  let trackRef: HTMLDivElement | undefined;

  // Get value from pointer position
  const getValueFromPointer = (clientX: number): number => {
    if (!trackRef) return minValue();
    const rect = trackRef.getBoundingClientRect();
    const percent = clamp((clientX - rect.left) / rect.width, 0, 1);
    return snapToStep(
      percent * (maxValue() - minValue()) + minValue(),
      minValue(),
      maxValue(),
      step()
    );
  };

  // Determine which thumb is closer to a value
  const closerThumb = (value: number): 'start' | 'end' => {
    const distToStart = Math.abs(value - startValue());
    const distToEnd = Math.abs(value - endValue());
    if (distToStart < distToEnd) return 'start';
    if (distToEnd < distToStart) return 'end';
    // Equal distance: prefer the one in the direction of the value
    return value < startValue() ? 'start' : 'end';
  };

  // Pointer handlers
  const onPointerDown = (e: PointerEvent) => {
    if (isDisabled()) return;
    e.preventDefault();
    const value = getValueFromPointer(e.clientX);
    const thumb = closerThumb(value);
    setDraggingThumb(thumb);

    if (thumb === 'start') {
      setRange(value, endValue());
    } else {
      setRange(startValue(), value);
    }

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent) => {
    const thumb = draggingThumb();
    if (!thumb) return;
    const value = getValueFromPointer(e.clientX);
    if (thumb === 'start') {
      setRange(value, endValue());
    } else {
      setRange(startValue(), value);
    }
  };

  const onPointerUp = () => {
    if (draggingThumb()) {
      setDraggingThumb(null);
      props.onChangeEnd?.({ start: startValue(), end: endValue() });
    }
  };

  // Keyboard handler for thumbs
  const onKeyDown = (thumb: 'start' | 'end', e: KeyboardEvent) => {
    if (isDisabled()) return;
    const s = step();
    const pageStep = Math.max(s, snapToStep((maxValue() - minValue()) / 10, 0, maxValue() - minValue(), s));
    const current = thumb === 'start' ? startValue() : endValue();
    let newValue = current;
    let handled = true;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        newValue = current + s;
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        newValue = current - s;
        break;
      case 'PageUp':
        newValue = current + pageStep;
        break;
      case 'PageDown':
        newValue = current - pageStep;
        break;
      case 'Home':
        newValue = minValue();
        break;
      case 'End':
        newValue = maxValue();
        break;
      default:
        handled = false;
    }

    if (handled) {
      e.preventDefault();
      e.stopPropagation();
      newValue = snapToStep(newValue, minValue(), maxValue(), s);
      if (thumb === 'start') {
        setRange(newValue, endValue());
      } else {
        setRange(startValue(), newValue);
      }
    }
  };

  // Thumb style classes
  const thumbClasses = (isDragging: boolean, isFocused: boolean): string => {
    const base = 'absolute rounded-full shadow-md transition-all top-1/2 -translate-y-1/2 -translate-x-1/2 outline-none';
    const sizeClass = size().thumb;

    let stateClass: string;
    if (isDisabled()) {
      stateClass = 'bg-primary-400 cursor-not-allowed';
    } else if (isDragging) {
      stateClass = 'bg-accent-400 scale-110 cursor-grabbing';
    } else {
      stateClass = 'bg-accent cursor-grab hover:bg-accent-400 hover:scale-105';
    }

    const focusClass = isFocused ? 'ring-2 ring-accent ring-offset-2 ring-offset-bg-100' : '';
    return [base, sizeClass, stateClass, focusClass].filter(Boolean).join(' ');
  };

  return (
    <div
      class={`flex flex-col w-full ${isDisabled() ? 'opacity-60' : ''} ${props.class ?? ''}`}
      role="group"
      aria-label={props['aria-label'] ?? props.label}
    >
      <Show when={props.label || (props.showOutput ?? true)}>
        <div class="flex justify-between items-center mb-2">
          <Show when={props.label}>
            <span class={`font-medium text-primary-200 ${size().label}`}>{props.label}</span>
          </Show>
          <Show when={props.showOutput ?? true}>
            <output class={`font-medium text-primary-100 ${size().label}`} aria-live="off">
              {formattedOutput()}
            </output>
          </Show>
        </div>
      </Show>
      <div class="relative w-full">
        <div
          ref={trackRef!}
          class={`relative rounded-full bg-bg-300 w-full ${size().track} ${isDisabled() ? '' : 'cursor-pointer'}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          style={{ 'touch-action': 'none' }}
        >
          {/* Filled range between thumbs */}
          <div
            class="absolute h-full rounded-full bg-accent"
            style={{
              left: `${startPercent() * 100}%`,
              width: `${(endPercent() - startPercent()) * 100}%`,
            }}
          />
          {/* Start thumb */}
          <div
            class={thumbClasses(draggingThumb() === 'start', focusedThumb() === 'start')}
            style={{ left: `${startPercent() * 100}%` }}
            tabIndex={isDisabled() ? undefined : 0}
            role="slider"
            aria-label={`${props.label ?? 'Range'} start`}
            aria-valuemin={minValue()}
            aria-valuemax={endValue()}
            aria-valuenow={startValue()}
            aria-valuetext={formatter().format(startValue())}
            onKeyDown={(e) => onKeyDown('start', e)}
            onFocus={() => setFocusedThumb('start')}
            onBlur={() => setFocusedThumb(null)}
          />
          {/* End thumb */}
          <div
            class={thumbClasses(draggingThumb() === 'end', focusedThumb() === 'end')}
            style={{ left: `${endPercent() * 100}%` }}
            tabIndex={isDisabled() ? undefined : 0}
            role="slider"
            aria-label={`${props.label ?? 'Range'} end`}
            aria-valuemin={startValue()}
            aria-valuemax={maxValue()}
            aria-valuenow={endValue()}
            aria-valuetext={formatter().format(endValue())}
            onKeyDown={(e) => onKeyDown('end', e)}
            onFocus={() => setFocusedThumb('end')}
            onBlur={() => setFocusedThumb(null)}
          />
        </div>
      </div>
    </div>
  );
}
