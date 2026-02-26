/**
 * createColorArea hook.
 *
 * Provides ARIA attributes and keyboard/pointer handling for a 2D color area.
 */

import { createMemo, type Accessor } from 'solid-js';
import type { Color, ColorAreaState, ColorChannel } from '@proyecto-viviana/solid-stately';
import { parseColor } from '@proyecto-viviana/solid-stately';
import { createId } from '../ssr';
import type { AriaColorAreaOptions, ColorAreaAria } from './types';

/**
 * Creates ARIA props for a color area.
 */
export function createColorArea(
  props: Accessor<AriaColorAreaOptions>,
  state: Accessor<ColorAreaState>,
  areaRef: Accessor<HTMLDivElement | null>
): ColorAreaAria {
  const getProps = () => props();
  const getState = () => state();

  // Generate IDs
  const xInputId = createId();
  const yInputId = createId();

  // Calculate position from pointer event
  const getPositionFromEvent = (e: MouseEvent | PointerEvent) => {
    const area = areaRef();
    if (!area) return null;

    const rect = area.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    return { x, y };
  };

  // Handle pointer down
  const onPointerDown = (e: PointerEvent) => {
    if (getProps().isDisabled || getState().isDisabled) return;

    const pos = getPositionFromEvent(e);
    if (!pos) return;

    getState().setColorFromPoint(pos.x, pos.y);
    getState().setDragging(true);

    // Capture pointer for dragging
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  // Handle pointer move
  const onPointerMove = (e: PointerEvent) => {
    if (!getState().isDragging) return;

    const pos = getPositionFromEvent(e);
    if (!pos) return;

    getState().setColorFromPoint(pos.x, pos.y);
  };

  // Handle pointer up
  const onPointerUp = (e: PointerEvent) => {
    if (getState().isDragging) {
      getState().setDragging(false);
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    }
  };

  // Handle keyboard for X axis
  const onKeyDownX = (e: KeyboardEvent) => {
    if (getProps().isDisabled || getState().isDisabled) return;

    const s = getState();
    let handled = true;

    switch (e.key) {
      case 'ArrowRight':
        s.incrementX();
        break;
      case 'ArrowLeft':
        s.decrementX();
        break;
      case 'ArrowUp':
        s.incrementY();
        break;
      case 'ArrowDown':
        s.decrementY();
        break;
      case 'PageUp':
        s.incrementY(s.yChannelPageStep);
        break;
      case 'PageDown':
        s.decrementY(s.yChannelPageStep);
        break;
      case 'Home':
        if (e.ctrlKey) {
          s.setXValue(0);
          s.setYValue(100);
        } else {
          s.setXValue(0);
        }
        break;
      case 'End':
        if (e.ctrlKey) {
          s.setXValue(100);
          s.setYValue(0);
        } else {
          s.setXValue(100);
        }
        break;
      default:
        handled = false;
    }

    if (handled) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // Handle keyboard for Y axis
  const onKeyDownY = (e: KeyboardEvent) => {
    if (getProps().isDisabled || getState().isDisabled) return;

    const s = getState();
    let handled = true;

    switch (e.key) {
      case 'ArrowUp':
        s.incrementY();
        break;
      case 'ArrowDown':
        s.decrementY();
        break;
      case 'ArrowRight':
        s.incrementX();
        break;
      case 'ArrowLeft':
        s.decrementX();
        break;
      case 'PageUp':
        s.incrementY(s.yChannelPageStep);
        break;
      case 'PageDown':
        s.decrementY(s.yChannelPageStep);
        break;
      case 'Home':
        s.setYValue(100);
        break;
      case 'End':
        s.setYValue(0);
        break;
      default:
        handled = false;
    }

    if (handled) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // Color area props
  const colorAreaProps = createMemo(() => {
    const s = getState();
    const p = getProps();

    return {
      role: 'group' as const,
      'aria-label': p['aria-label'],
      'aria-labelledby': p['aria-labelledby'],
      'aria-describedby': p['aria-describedby'],
      'aria-disabled': s.isDisabled || p.isDisabled || undefined,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      style: {
        position: 'relative' as const,
        'touch-action': 'none',
      },
      'data-disabled': s.isDisabled || p.isDisabled || undefined,
    };
  });

  // Generate gradient background for the color area
  const generateGradient = (): Record<string, string> => {
    const s = getState();
    const value = s.value;
    const xCh = s.xChannel;
    const yCh = s.yChannel;
    const zCh = s.zChannel;
    const zValue = value.getChannelValue(zCh);
    const end = 'right';

    const hue = (color: Color) =>
      [0, 60, 120, 180, 240, 300, 360].map(h => color.withChannelValue('hue', h).toString('css')).join(', ');

    const hslChannels: Record<string, (c: Color) => string> = {
      hue,
      saturation: (color) => `${color.withChannelValue('saturation', 0).toString('css')}, transparent`,
      lightness: () => 'black, transparent, white',
    };

    const hsbChannels: Record<string, (c: Color) => string> = {
      hue,
      saturation: (color) => `${color.withChannelValue('saturation', 0).toString('css')}, transparent`,
      brightness: () => 'black, transparent',
    };

    switch (value.getColorSpace()) {
      case 'rgb': {
        const rgb = parseColor('rgb(0, 0, 0)');
        return {
          background: [
            `linear-gradient(to ${end}, ${rgb.withChannelValue(xCh, 0).toString('css')}, ${rgb.withChannelValue(xCh, 255).toString('css')})`,
            `linear-gradient(to top, ${rgb.withChannelValue(yCh, 0).toString('css')}, ${rgb.withChannelValue(yCh, 255).toString('css')})`,
            rgb.withChannelValue(zCh, zValue).toString('css'),
          ].join(','),
          'background-blend-mode': 'screen',
        };
      }
      case 'hsl': {
        const channels = value.getColorChannels();
        const base = parseColor('hsl(0, 100%, 50%)').withChannelValue(zCh, zValue);
        const bg = channels
          .filter((c: ColorChannel) => c !== zCh)
          .map((c: ColorChannel) => `linear-gradient(to ${c === xCh ? end : 'top'}, ${hslChannels[c]?.(base) ?? ''})`)
          .reverse();
        if (zCh === 'hue') bg.push(base.toString('css'));
        return { background: bg.join(', ') };
      }
      case 'hsb': {
        const channels = value.getColorChannels();
        const base = parseColor('hsb(0, 100%, 100%)').withChannelValue(zCh, zValue);
        const bg = channels
          .filter((c: ColorChannel) => c !== zCh)
          .map((c: ColorChannel) => `linear-gradient(to ${c === xCh ? end : 'top'}, ${hsbChannels[c]?.(base) ?? ''})`)
          .reverse();
        if (zCh === 'hue') bg.push(base.toString('css'));
        return { background: bg.join(', ') };
      }
      default:
        return {};
    }
  };

  // Gradient props (the visual area)
  const gradientProps = createMemo(() => {
    const gradientStyles = generateGradient();
    return {
      role: 'presentation' as const,
      style: {
        width: '100%',
        height: '100%',
        'forced-color-adjust': 'none' as const,
        ...gradientStyles,
      },
    };
  });

  // Thumb props
  const thumbProps = createMemo(() => {
    const s = getState();
    const p = getProps();
    const pos = s.getThumbPosition();

    return {
      role: 'presentation' as const,
      style: {
        position: 'absolute' as const,
        left: `${pos.x * 100}%`,
        top: `${pos.y * 100}%`,
        transform: 'translate(-50%, -50%)',
        'touch-action': 'none',
      },
      'data-dragging': s.isDragging || undefined,
      'data-disabled': s.isDisabled || p.isDisabled || undefined,
    };
  });

  // X input props (hidden, for accessibility)
  const xInputProps = createMemo(() => {
    const s = getState();
    const p = getProps();
    const xRange = s.value.getChannelRange(s.xChannel);
    const xName = s.value.getChannelName(s.xChannel, 'en-US');

    return {
      type: 'range',
      id: xInputId,
      'aria-label': `${xName}`,
      'aria-valuetext': `${xName}: ${s.getXValue()}`,
      min: xRange.minValue,
      max: xRange.maxValue,
      step: xRange.step,
      value: s.getXValue(),
      disabled: s.isDisabled || p.isDisabled,
      onKeyDown: onKeyDownX,
      onChange: (e: Event) => {
        const target = e.target as HTMLInputElement;
        s.setXValue(parseFloat(target.value));
      },
      onBlur: () => {
        if (s.isDragging) {
          s.setDragging(false);
        }
      },
      tabIndex: 0,
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

  // Y input props (hidden, for accessibility)
  const yInputProps = createMemo(() => {
    const s = getState();
    const p = getProps();
    const yRange = s.value.getChannelRange(s.yChannel);
    const yName = s.value.getChannelName(s.yChannel, 'en-US');

    return {
      type: 'range',
      id: yInputId,
      'aria-label': `${yName}`,
      'aria-valuetext': `${yName}: ${s.getYValue()}`,
      min: yRange.minValue,
      max: yRange.maxValue,
      step: yRange.step,
      value: s.getYValue(),
      disabled: s.isDisabled || p.isDisabled,
      onKeyDown: onKeyDownY,
      onChange: (e: Event) => {
        const target = e.target as HTMLInputElement;
        s.setYValue(parseFloat(target.value));
      },
      tabIndex: -1, // Only first input is in tab order
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
    get colorAreaProps() {
      return colorAreaProps();
    },
    get gradientProps() {
      return gradientProps();
    },
    get thumbProps() {
      return thumbProps();
    },
    get xInputProps() {
      return xInputProps();
    },
    get yInputProps() {
      return yInputProps();
    },
  };
}
