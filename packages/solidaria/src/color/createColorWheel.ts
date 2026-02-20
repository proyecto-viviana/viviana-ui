/**
 * createColorWheel hook.
 *
 * Provides ARIA attributes and keyboard/pointer handling for a circular hue selector.
 */

import { createMemo, type Accessor } from 'solid-js';
import type { ColorWheelState } from '@proyecto-viviana/solid-stately';
import { createId } from '../ssr';
import type { AriaColorWheelOptions, ColorWheelAria } from './types';

/**
 * Creates ARIA props for a color wheel.
 */
export function createColorWheel(
  props: Accessor<AriaColorWheelOptions>,
  state: Accessor<ColorWheelState>,
  wheelRef: Accessor<HTMLDivElement | null>
): ColorWheelAria {
  const getProps = () => props();
  const getState = () => state();

  // Generate IDs
  const inputId = createId();

  // Calculate angle from pointer position
  const getAngleFromEvent = (e: MouseEvent | PointerEvent) => {
    const wheel = wheelRef();
    if (!wheel) return null;

    const rect = wheel.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;

    return Math.atan2(-dy, dx); // Negative dy because Y is inverted in screen coords
  };

  // Handle pointer down
  const onPointerDown = (e: PointerEvent) => {
    if (getProps().isDisabled || getState().isDisabled) return;

    const angle = getAngleFromEvent(e);
    if (angle === null) return;

    getState().setHueFromAngle(angle);
    getState().setDragging(true);

    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  // Handle pointer move
  const onPointerMove = (e: PointerEvent) => {
    if (!getState().isDragging) return;

    const angle = getAngleFromEvent(e);
    if (angle === null) return;

    getState().setHueFromAngle(angle);
  };

  // Handle pointer up
  const onPointerUp = (e: PointerEvent) => {
    if (getState().isDragging) {
      getState().setDragging(false);
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    }
  };

  // Handle keyboard
  const onKeyDown = (e: KeyboardEvent) => {
    if (getProps().isDisabled || getState().isDisabled) return;

    const s = getState();
    let handled = true;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        s.increment();
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        s.decrement();
        break;
      case 'PageUp':
        s.increment(s.pageStep);
        break;
      case 'PageDown':
        s.decrement(s.pageStep);
        break;
      case 'Home':
        s.setHue(0);
        break;
      case 'End':
        s.setHue(359);
        break;
      default:
        handled = false;
    }

    if (handled) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // Hue spectrum conic gradient
  const conicGradient = `conic-gradient(from 90deg, hsl(0, 100%, 50%), hsl(30, 100%, 50%), hsl(60, 100%, 50%), hsl(90, 100%, 50%), hsl(120, 100%, 50%), hsl(150, 100%, 50%), hsl(180, 100%, 50%), hsl(210, 100%, 50%), hsl(240, 100%, 50%), hsl(270, 100%, 50%), hsl(300, 100%, 50%), hsl(330, 100%, 50%), hsl(360, 100%, 50%))`;

  // Track props (the wheel container)
  const trackProps = createMemo(() => {
    const s = getState();
    const p = getProps();

    return {
      role: 'presentation' as const,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      style: {
        position: 'relative' as const,
        'touch-action': 'none',
        'border-radius': '50%',
        background: conicGradient,
        // Use radial-gradient mask to cut out center hole (creates ring shape)
        // 35% inner radius leaves a nice thick ring
        '-webkit-mask-image': 'radial-gradient(circle, transparent 35%, black 36%)',
        'mask-image': 'radial-gradient(circle, transparent 35%, black 36%)',
        'forced-color-adjust': 'none',
      },
      'data-disabled': s.isDisabled || p.isDisabled || undefined,
    };
  });

  // Thumb props
  const thumbProps = createMemo(() => {
    const s = getState();
    const p = getProps();
    const angle = s.getThumbAngle();

    // Calculate thumb position on the wheel edge
    // Assumes wheel is circular and thumb is at the outer edge
    // Angle 0 = right (3 o'clock)
    const thumbX = Math.cos(angle);
    const thumbY = -Math.sin(angle); // Negative because CSS Y is inverted

    return {
      role: 'presentation' as const,
      style: {
        position: 'absolute' as const,
        // Position relative to center, scaled to radius
        // These will be overridden by the component with actual radius
        left: `calc(50% + ${thumbX * 50}%)`,
        top: `calc(50% + ${thumbY * 50}%)`,
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
      min: 0,
      max: 360,
      step: s.step,
      value: s.getHue(),
      disabled: s.isDisabled || p.isDisabled,
      'aria-label': p['aria-label'] ?? 'Hue',
      'aria-labelledby': p['aria-labelledby'],
      'aria-describedby': p['aria-describedby'],
      'aria-valuetext': `${s.getHue()}°`,
      onKeyDown,
      onChange: (e: Event) => {
        const target = e.target as HTMLInputElement;
        s.setHue(parseFloat(target.value));
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
  };
}
