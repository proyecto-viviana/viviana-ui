/**
 * createColorSlider hook.
 *
 * Provides ARIA attributes and keyboard handling for a color slider.
 */

import { createMemo, type Accessor } from 'solid-js';
import type { ColorSliderState } from '@proyecto-viviana/solid-stately';
import { createId } from '../ssr';
import type { AriaColorSliderOptions, ColorSliderAria } from './types';

/**
 * Creates ARIA props for a color slider.
 */
export function createColorSlider(
  props: Accessor<AriaColorSliderOptions>,
  state: Accessor<ColorSliderState>,
  trackRef: Accessor<HTMLDivElement | null>
): ColorSliderAria {
  const getProps = () => props();
  const getState = () => state();

  // Generate IDs
  const inputId = createId();
  const labelId = createId();

  // Get channel name for ARIA label
  const channelName = createMemo(() => {
    const p = getProps();
    if (p.channelName) return p.channelName;
    const s = getState();
    return s.value.getChannelName(s.channel, 'en-US');
  });

  // Handle track click
  const onTrackMouseDown = (e: MouseEvent) => {
    if (getProps().isDisabled || getState().isDisabled) return;

    const track = trackRef();
    if (!track) return;

    const rect = track.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    getState().setThumbPercent(Math.max(0, Math.min(1, percent)));
    getState().setDragging(true);
  };

  // Handle keyboard
  const onKeyDown = (e: KeyboardEvent) => {
    if (getProps().isDisabled || getState().isDisabled) return;

    const s = getState();
    let handled = true;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        s.incrementThumb();
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        s.decrementThumb();
        break;
      case 'PageUp':
        s.incrementThumb(s.pageSize);
        break;
      case 'PageDown':
        s.decrementThumb(s.pageSize);
        break;
      case 'Home':
        s.setThumbValue(s.minValue);
        break;
      case 'End':
        s.setThumbValue(s.maxValue);
        break;
      default:
        handled = false;
    }

    if (handled) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // Track props
  const trackProps = createMemo(() => {
    const s = getState();
    return {
      role: 'presentation' as const,
      onMouseDown: onTrackMouseDown,
      style: {
        position: 'relative' as const,
        'touch-action': 'none',
      },
      'data-disabled': s.isDisabled || undefined,
    };
  });

  // Thumb props
  const thumbProps = createMemo(() => {
    const s = getState();
    const p = getProps();
    const percent = s.getThumbPercent();

    return {
      role: 'presentation' as const,
      style: {
        position: 'absolute' as const,
        left: `${percent * 100}%`,
        top: '50%',
        transform: 'translate(-50%, -50%)',
        'touch-action': 'none',
      },
      'data-dragging': s.isDragging || undefined,
      'data-disabled': s.isDisabled || p.isDisabled || undefined,
    };
  });

  // Input props (hidden, for accessibility)
  const inputProps = createMemo(() => {
    const s = getState();
    const p = getProps();

    return {
      type: 'range',
      id: inputId,
      min: s.minValue,
      max: s.maxValue,
      step: s.step,
      value: s.getThumbValue(),
      disabled: s.isDisabled || p.isDisabled,
      'aria-label': p['aria-label'] ?? channelName(),
      'aria-labelledby': p['aria-labelledby'],
      'aria-describedby': p['aria-describedby'],
      'aria-valuetext': s.getThumbValueLabel(),
      onKeyDown,
      onChange: (e: Event) => {
        const target = e.target as HTMLInputElement;
        s.setThumbValue(parseFloat(target.value));
      },
      onFocus: () => {
        // Focus handling
      },
      onBlur: () => {
        if (s.isDragging) {
          s.setDragging(false);
        }
      },
      style: {
        position: 'absolute' as const,
        width: '1px',
        height: '1px',
        padding: '0',
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        'white-space': 'nowrap',
        border: '0',
      },
    };
  });

  // Output props
  const outputProps = createMemo(() => {
    return {
      'aria-live': 'off' as const,
      for: inputId,
    };
  });

  // Label props
  const labelProps = createMemo(() => {
    return {
      id: labelId,
      for: inputId,
    };
  });

  return {
    get trackProps() {
      return trackProps();
    },
    get thumbProps() {
      return thumbProps();
    },
    get inputProps() {
      return inputProps();
    },
    get outputProps() {
      return outputProps();
    },
    get labelProps() {
      return labelProps();
    },
  };
}
