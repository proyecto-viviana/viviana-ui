/**
 * createTooltip hook for Solidaria
 *
 * Provides the accessibility implementation for a Tooltip component.
 *
 * Port of @react-aria/tooltip useTooltip.
 */

import { type JSX } from "solid-js";
import { type TooltipTriggerState } from "@proyecto-viviana/solid-stately";
import { createHover } from "../interactions/createHover";
import { filterDOMProps, mergeProps } from "../utils";

export interface TooltipProps {
  /** Whether the tooltip is disabled. */
  isDisabled?: boolean;
  /** Custom aria-label for the tooltip. */
  "aria-label"?: string;
  /** ID of an element that labels the tooltip. */
  "aria-labelledby"?: string;
  /** ID of an element that describes the tooltip. */
  "aria-describedby"?: string;
}

export interface TooltipAria {
  /** Props to spread on the tooltip element. */
  tooltipProps: JSX.HTMLAttributes<HTMLElement>;
}

/**
 * Provides the accessibility implementation for a Tooltip component.
 *
 * When hovering over the tooltip itself, it stays open. When the mouse leaves
 * the tooltip, it closes.
 *
 * @example
 * ```tsx
 * import { createTooltip } from 'solidaria';
 * import { createTooltipTriggerState } from 'solid-stately';
 *
 * function Tooltip(props) {
 *   const state = props.state;
 *   const { tooltipProps } = createTooltip(props, state);
 *
 *   return (
 *     <div {...tooltipProps} role="tooltip">
 *       {props.children}
 *     </div>
 *   );
 * }
 * ```
 */
export function createTooltip(props: TooltipProps = {}, state?: TooltipTriggerState): TooltipAria {
  const domProps = filterDOMProps(props, { labelable: true });

  const { hoverProps } = createHover({
    onHoverStart: () => state?.open(true),
    onHoverEnd: () => state?.close(),
  });

  return {
    tooltipProps: mergeProps<JSX.HTMLAttributes<HTMLElement>>(domProps, hoverProps, {
      role: "tooltip",
    }),
  };
}
