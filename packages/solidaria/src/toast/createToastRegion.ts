/**
 * createToastRegion hook for Solidaria
 *
 * Provides the accessibility implementation for a ToastRegion component.
 * The region is a landmark that contains all visible toasts.
 *
 * Port of @react-aria/toast useToastRegion.
 */

import { type JSX, createMemo } from "solid-js";
import { type ToastState } from "@proyecto-viviana/solid-stately";
import { createHover } from "../interactions/createHover";

export interface AriaToastRegionProps<T> {
  /** The toast state from createToastState. */
  state: ToastState<T>;
  /** An accessible label for the region. */
  "aria-label"?: string;
}

export interface ToastRegionAria {
  /** Props for the toast region container element. */
  regionProps: JSX.HTMLAttributes<HTMLElement>;
}

/**
 * Provides the accessibility implementation for a ToastRegion component.
 *
 * The region is a landmark (role="region") that contains all visible toasts.
 * It pauses toast timers on hover or focus to give users time to read/interact.
 *
 * @example
 * ```tsx
 * import { createToastRegion } from 'solidaria';
 * import { For, Show } from 'solid-js';
 *
 * function ToastRegion(props) {
 *   let ref;
 *   const { regionProps } = createToastRegion({ state: props.state });
 *
 *   return (
 *     <Show when={props.state.visibleToasts().length > 0}>
 *       <div {...regionProps} ref={ref}>
 *         <For each={props.state.visibleToasts()}>
 *           {(toast) => <Toast toast={toast} state={props.state} />}
 *         </For>
 *       </div>
 *     </Show>
 *   );
 * }
 * ```
 */
export function createToastRegion<T>(props: AriaToastRegionProps<T>): ToastRegionAria {
  // Pause timers on hover
  const { hoverProps } = createHover({
    onHoverStart: () => {
      props.state.pauseAll();
    },
    onHoverEnd: () => {
      props.state.resumeAll();
    },
  });

  // Pause timers on focus
  const handleFocus = () => {
    props.state.pauseAll();
  };

  const handleBlur = (e: FocusEvent) => {
    // Only resume if focus moved outside the region
    const target = e.relatedTarget as HTMLElement | null;
    const currentTarget = e.currentTarget as HTMLElement;
    if (!target || !currentTarget.contains(target)) {
      props.state.resumeAll();
    }
  };

  // Region props
  const regionProps = createMemo<JSX.HTMLAttributes<HTMLElement>>(() => ({
    ...hoverProps,
    role: "region" as const,
    "aria-label": props["aria-label"] ?? "Notifications",
    tabIndex: -1,
    onFocusIn: handleFocus,
    onFocusOut: handleBlur,
  }));

  return {
    get regionProps() {
      return regionProps();
    },
  };
}
