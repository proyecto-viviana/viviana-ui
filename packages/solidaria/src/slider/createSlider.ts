/**
 * Provides the behavior and accessibility implementation for a slider component.
 * A slider allows users to select a value from a range.
 * Based on @react-aria/slider useSlider.
 */

import { type JSX, onCleanup, onMount } from 'solid-js';
import { createLabel } from '../label/createLabel';
import { createFocusRing } from '../interactions/createFocusRing';
import { filterDOMProps } from '../utils/filterDOMProps';
import { mergeProps } from '../utils/mergeProps';
import { createId } from '../ssr';
import { access, type MaybeAccessor } from '../utils/reactivity';
import type { SliderState, SliderOrientation } from '@proyecto-viviana/solid-stately';

export interface AriaSliderProps {
  /** An ID for the slider. */
  id?: string;
  /** Whether the slider is disabled. */
  isDisabled?: boolean;
  /** The label for the slider. */
  label?: JSX.Element;
  /** An accessible label for the slider when no visible label is provided. */
  'aria-label'?: string;
  /** The ID of an element that labels the slider. */
  'aria-labelledby'?: string;
  /** The ID of an element that describes the slider. */
  'aria-describedby'?: string;
  /** The orientation of the slider. */
  orientation?: SliderOrientation;
}

export interface SliderAria {
  /** Props for the label element. */
  labelProps: JSX.HTMLAttributes<HTMLElement>;
  /** Props for the root group element. */
  groupProps: JSX.HTMLAttributes<HTMLElement>;
  /** Props for the track element. */
  trackProps: JSX.HTMLAttributes<HTMLElement>;
  /** Props for the thumb element. */
  thumbProps: JSX.HTMLAttributes<HTMLElement>;
  /** Props for the hidden input element. */
  inputProps: JSX.InputHTMLAttributes<HTMLInputElement>;
  /** Props for the output element (showing current value). */
  outputProps: JSX.HTMLAttributes<HTMLElement>;
}

/**
 * Provides the behavior and accessibility implementation for a slider.
 */
export function createSlider(
  props: MaybeAccessor<AriaSliderProps>,
  state: SliderState,
  trackRef?: () => HTMLElement | null
): SliderAria {
  const getProps = () => access(props);
  const id = createId(getProps().id);

  // Generate IDs for associated elements
  const inputId = `${id}-input`;
  const outputId = `${id}-output`;

  // Filter DOM props
  const domProps = () =>
    filterDOMProps(getProps() as unknown as Record<string, unknown>, { labelable: true });

  // Label handling
  const { labelProps, fieldProps } = createLabel({
    get id() {
      return inputId;
    },
    get label() {
      return getProps().label;
    },
    get 'aria-label'() {
      return getProps()['aria-label'];
    },
    get 'aria-labelledby'() {
      return getProps()['aria-labelledby'];
    },
    labelElementType: 'span',
  });

  // Focus ring for keyboard focus styling
  const { isFocusVisible, focusProps } = createFocusRing({
    within: true,
  });

  // Track pointer state for drag handling
  let currentPointerId: number | null = null;

  // Calculate position from pointer event
  const getPositionFromPointer = (clientX: number, clientY: number): number => {
    const track = trackRef?.();
    if (!track) return 0;

    const rect = track.getBoundingClientRect();
    const isVertical = state.orientation === 'vertical';

    let position: number;
    if (isVertical) {
      position = (rect.bottom - clientY) / rect.height;
    } else {
      position = (clientX - rect.left) / rect.width;
    }

    return Math.max(0, Math.min(1, position));
  };

  // Handle pointer down on track
  const onTrackPointerDown = (e: PointerEvent) => {
    if (state.isDisabled || e.button !== 0) return;

    e.preventDefault();
    currentPointerId = e.pointerId;

    const track = trackRef?.();
    if (track) {
      track.setPointerCapture(e.pointerId);
    }

    const percent = getPositionFromPointer(e.clientX, e.clientY);
    state.setValuePercent(percent);
    state.setDragging(true);
  };

  // Handle pointer move for dragging
  const onTrackPointerMove = (e: PointerEvent) => {
    if (!state.isDragging() || e.pointerId !== currentPointerId) return;

    const percent = getPositionFromPointer(e.clientX, e.clientY);
    state.setValuePercent(percent);
  };

  // Handle pointer up to end drag
  const onTrackPointerUp = (e: PointerEvent) => {
    if (e.pointerId !== currentPointerId) return;

    const track = trackRef?.();
    if (track) {
      track.releasePointerCapture(e.pointerId);
    }

    currentPointerId = null;
    state.setDragging(false);
  };

  // Keyboard navigation for thumb
  const onThumbKeyDown = (e: KeyboardEvent) => {
    if (state.isDisabled) return;

    const isVertical = state.orientation === 'vertical';

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        if ((e.key === 'ArrowRight' && !isVertical) || (e.key === 'ArrowUp' && isVertical)) {
          state.increment();
        } else {
          state.decrement();
        }
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        if ((e.key === 'ArrowLeft' && !isVertical) || (e.key === 'ArrowDown' && isVertical)) {
          state.decrement();
        } else {
          state.increment();
        }
        break;
      case 'PageUp':
        e.preventDefault();
        state.increment(state.pageStep / state.step);
        break;
      case 'PageDown':
        e.preventDefault();
        state.decrement(state.pageStep / state.step);
        break;
      case 'Home':
        e.preventDefault();
        state.setValue(state.minValue);
        break;
      case 'End':
        e.preventDefault();
        state.setValue(state.maxValue);
        break;
    }
  };

  // Handle focus events
  const onFocus = () => {
    state.setFocused(true);
  };

  const onBlur = () => {
    state.setFocused(false);
  };

  // Handle pointer down on thumb (for direct thumb dragging)
  const onThumbPointerDown = (e: PointerEvent) => {
    if (state.isDisabled || e.button !== 0) return;

    e.preventDefault();
    e.stopPropagation(); // Prevent track from also handling
    currentPointerId = e.pointerId;

    // Capture pointer on document for smooth dragging
    document.body.setPointerCapture(e.pointerId);
    state.setDragging(true);
  };

  // Global pointer move handler for thumb dragging
  const onDocumentPointerMove = (e: PointerEvent) => {
    if (!state.isDragging() || e.pointerId !== currentPointerId) return;

    const percent = getPositionFromPointer(e.clientX, e.clientY);
    state.setValuePercent(percent);
  };

  // Global pointer up handler
  const onDocumentPointerUp = (e: PointerEvent) => {
    if (e.pointerId !== currentPointerId) return;

    try {
      document.body.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if capture was already released
    }

    currentPointerId = null;
    state.setDragging(false);
  };

  // Set up global listeners on mount (client-side only)
  onMount(() => {
    if (typeof document === 'undefined') return;

    document.addEventListener('pointermove', onDocumentPointerMove);
    document.addEventListener('pointerup', onDocumentPointerUp);
    document.addEventListener('pointercancel', onDocumentPointerUp);

    // Cleanup when component unmounts
    onCleanup(() => {
      document.removeEventListener('pointermove', onDocumentPointerMove);
      document.removeEventListener('pointerup', onDocumentPointerUp);
      document.removeEventListener('pointercancel', onDocumentPointerUp);
    });
  });

  return {
    get labelProps() {
      return labelProps as JSX.HTMLAttributes<HTMLElement>;
    },
    get groupProps() {
      return mergeProps(
        domProps(),
        fieldProps as Record<string, unknown>,
        {
          role: 'group',
          'data-disabled': state.isDisabled || undefined,
          'data-orientation': state.orientation,
        } as Record<string, unknown>
      ) as JSX.HTMLAttributes<HTMLElement>;
    },
    get trackProps() {
      return {
        onPointerDown: onTrackPointerDown,
        onPointerMove: onTrackPointerMove,
        onPointerUp: onTrackPointerUp,
        onPointerCancel: onTrackPointerUp,
        style: {
          position: 'relative',
          'touch-action': 'none',
        },
        'data-disabled': state.isDisabled || undefined,
        'data-orientation': state.orientation,
        'data-dragging': state.isDragging() || undefined,
      } as JSX.HTMLAttributes<HTMLElement>;
    },
    get thumbProps() {
      const percent = state.getValuePercent();
      const isVertical = state.orientation === 'vertical';

      return mergeProps(
        focusProps as Record<string, unknown>,
        {
          role: 'slider',
          tabIndex: state.isDisabled ? undefined : 0,
          'aria-valuemin': state.minValue,
          'aria-valuemax': state.maxValue,
          'aria-valuenow': state.value(),
          'aria-valuetext': state.getFormattedValue(),
          'aria-orientation': state.orientation,
          'aria-disabled': state.isDisabled || undefined,
          'aria-labelledby': (labelProps as { id?: string }).id,
          onPointerDown: onThumbPointerDown,
          onKeyDown: onThumbKeyDown,
          onFocus,
          onBlur,
          style: {
            position: 'absolute',
            [isVertical ? 'bottom' : 'left']: `${percent * 100}%`,
            transform: isVertical ? 'translateY(50%)' : 'translateX(-50%)',
          },
          'data-disabled': state.isDisabled || undefined,
          'data-dragging': state.isDragging() || undefined,
          'data-focus-visible': isFocusVisible() || undefined,
        } as Record<string, unknown>
      ) as JSX.HTMLAttributes<HTMLElement>;
    },
    get inputProps() {
      return {
        type: 'range',
        id: inputId,
        min: state.minValue,
        max: state.maxValue,
        step: state.step,
        value: state.value(),
        disabled: state.isDisabled,
        'aria-hidden': true,
        tabIndex: -1,
        style: {
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: '0',
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          'white-space': 'nowrap',
          border: '0',
        },
        onChange: (e: Event) => {
          const target = e.target as HTMLInputElement;
          state.setValue(parseFloat(target.value));
        },
      } as JSX.InputHTMLAttributes<HTMLInputElement>;
    },
    get outputProps() {
      return {
        id: outputId,
        'for': inputId,
        'aria-live': 'off',
      } as JSX.HTMLAttributes<HTMLElement>;
    },
  };
}
