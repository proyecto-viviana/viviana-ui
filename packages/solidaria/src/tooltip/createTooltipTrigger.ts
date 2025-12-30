/**
 * createTooltipTrigger hook for Solidaria
 *
 * Provides the behavior and accessibility implementation for a tooltip trigger,
 * e.g. a button that shows a description when focused or hovered.
 *
 * Port of @react-aria/tooltip useTooltipTrigger.
 */

import { type JSX, createEffect, onCleanup } from 'solid-js';
import { type TooltipTriggerState } from '@proyecto-viviana/solid-stately';
import { createHover } from '../interactions/createHover';
import { createFocusable } from '../interactions/createFocusable';
import { mergeProps } from '../utils';
import { createId } from '../ssr';

// ============================================
// TYPES
// ============================================

export interface TooltipTriggerProps {
  /** Whether the tooltip should be disabled. */
  isDisabled?: boolean;
  /**
   * The trigger mechanism for the tooltip.
   * @default 'focus'
   */
  trigger?: 'focus';
  /**
   * Whether the tooltip should close when the trigger is pressed.
   * @default true
   */
  shouldCloseOnPress?: boolean;
}

export interface TooltipTriggerAria {
  /** Props to spread on the trigger element. */
  triggerProps: JSX.HTMLAttributes<HTMLElement>;
  /** Props to spread on the tooltip element (id for accessibility). */
  tooltipProps: { id: string };
}

// ============================================
// GLOBAL STATE
// ============================================

type Modality = 'keyboard' | 'pointer' | 'virtual';
let currentModality: Modality | null = null;

// Track interaction modality (pointer vs keyboard)
if (typeof document !== 'undefined') {
  document.addEventListener('keydown', () => {
    currentModality = 'keyboard';
  }, true);
  document.addEventListener('pointerdown', () => {
    currentModality = 'pointer';
  }, true);
  document.addEventListener('pointermove', () => {
    currentModality = 'pointer';
  }, true);
}

function isFocusVisible(): boolean {
  return currentModality === 'keyboard';
}

// ============================================
// IMPLEMENTATION
// ============================================

/**
 * Provides the behavior and accessibility implementation for a tooltip trigger.
 *
 * @example
 * ```tsx
 * import { createTooltipTrigger } from 'solidaria';
 * import { createTooltipTriggerState } from 'solid-stately';
 *
 * function TooltipButton(props) {
 *   let ref;
 *   const state = createTooltipTriggerState({ delay: 500 });
 *   const { triggerProps, tooltipProps } = createTooltipTrigger(
 *     { isDisabled: props.isDisabled },
 *     state,
 *     () => ref
 *   );
 *
 *   return (
 *     <>
 *       <button ref={ref} {...triggerProps}>
 *         Hover me
 *       </button>
 *       <Show when={state.isOpen()}>
 *         <div {...tooltipProps}>Tooltip content</div>
 *       </Show>
 *     </>
 *   );
 * }
 * ```
 */
export function createTooltipTrigger(
  props: TooltipTriggerProps,
  state: TooltipTriggerState,
  ref: () => HTMLElement | null | undefined
): TooltipTriggerAria {
  const {
    isDisabled = false,
    trigger,
    shouldCloseOnPress = true,
  } = props;

  const tooltipId = createId();

  // Track hover and focus state
  let isHovered = false;
  let isFocused = false;

  const handleShow = () => {
    if (isHovered || isFocused) {
      state.open(isFocused);
    }
  };

  const handleHide = (immediate?: boolean) => {
    if (!isHovered && !isFocused) {
      state.close(immediate);
    }
  };

  // Handle Escape key to dismiss tooltip
  createEffect(() => {
    if (!state.isOpen()) return;

    const onKeyDown = (e: KeyboardEvent) => {
      const element = ref();
      if (element) {
        if (e.key === 'Escape') {
          e.stopPropagation();
          state.close(true);
        }
      }
    };

    document.addEventListener('keydown', onKeyDown, true);
    onCleanup(() => {
      document.removeEventListener('keydown', onKeyDown, true);
    });
  });

  const onHoverStart = () => {
    if (trigger === 'focus') {
      return;
    }
    // Hover events (onPointerEnter) only fire from pointer interactions,
    // so we can always set isHovered to true here
    isHovered = true;
    handleShow();
  };

  const onHoverEnd = () => {
    if (trigger === 'focus') {
      return;
    }
    isFocused = false;
    isHovered = false;
    handleHide();
  };

  const onPressStart = () => {
    if (!shouldCloseOnPress) {
      return;
    }
    isFocused = false;
    isHovered = false;
    handleHide(true);
  };

  const onFocus = () => {
    const visible = isFocusVisible();
    if (visible) {
      isFocused = true;
      handleShow();
    }
  };

  const onBlur = () => {
    isFocused = false;
    isHovered = false;
    handleHide(true);
  };

  const { hoverProps } = createHover({
    isDisabled,
    onHoverStart,
    onHoverEnd,
  });

  const { focusableProps } = createFocusable({
    isDisabled,
    onFocus,
    onBlur,
  });

  const triggerProps = mergeProps(
    focusableProps,
    hoverProps,
    {
      get 'aria-describedby'() {
        return state.isOpen() ? tooltipId : undefined;
      },
      onPointerDown: onPressStart,
      onKeyDown: onPressStart,
      // Remove tabIndex set by focusableProps to avoid overriding
      tabIndex: undefined,
    }
  );

  return {
    triggerProps: triggerProps as JSX.HTMLAttributes<HTMLElement>,
    tooltipProps: {
      id: tooltipId,
    },
  };
}
