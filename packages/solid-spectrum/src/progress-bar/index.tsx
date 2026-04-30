import { type JSX, splitProps, Show, createUniqueId } from "solid-js";
import {
  ProgressBar as HeadlessProgressBar,
  type ProgressBarRenderProps as HeadlessProgressBarRenderProps,
} from "@proyecto-viviana/solidaria-components";

export type ProgressBarSize = "sm" | "md" | "lg";
export type ProgressBarVariant = "primary" | "accent" | "success" | "warning" | "danger";

export interface ProgressBarProps {
  /** The current value (controlled). @default 0 */
  value?: number;
  /** The smallest value allowed. @default 0 */
  minValue?: number;
  /** The largest value allowed. @default 100 */
  maxValue?: number;
  /** The content to display as the value's label (e.g. "1 of 4"). */
  valueLabel?: string;
  /** Whether presentation is indeterminate when progress isn't known. */
  isIndeterminate?: boolean;
  /** The size of the progress bar. @default 'md' */
  size?: ProgressBarSize;
  /** The visual style variant. @default 'primary' */
  variant?: ProgressBarVariant;
  /** The label to display above the progress bar. */
  label?: string;
  /** Whether to show the value text. @default true for determinate progress */
  showValueLabel?: boolean;
  /** Additional CSS class name. */
  class?: string;
  /** An accessibility label. */
  "aria-label"?: string;
  /** Reference to external label element. */
  "aria-labelledby"?: string;
}

const sizeStyles = {
  sm: {
    track: "h-1",
    text: "text-xs",
  },
  md: {
    track: "h-2",
    text: "text-sm",
  },
  lg: {
    track: "h-3",
    text: "text-base",
  },
};

const variantStyles = {
  primary: "bg-primary-500",
  accent: "bg-accent",
  success: "bg-green-500",
  warning: "bg-yellow-500",
  danger: "bg-red-500",
};

/**
 * Progress bars show either determinate or indeterminate progress of an operation
 * over time.
 *
 * @example
 * ```tsx
 * <ProgressBar value={50} label="Loading..." />
 *
 * // Indeterminate
 * <ProgressBar isIndeterminate label="Processing..." />
 *
 * // Different variants
 * <ProgressBar value={75} variant="success" />
 * ```
 */
export function ProgressBar(props: ProgressBarProps): JSX.Element {
  const [local, headlessProps] = splitProps(props, [
    "size",
    "variant",
    "label",
    "showValueLabel",
    "class",
  ]);

  const size = () => local.size ?? "md";
  const variant = () => local.variant ?? "primary";
  const sizeConfig = () => sizeStyles[size()];
  const labelId = createUniqueId();
  const renderChildren = ({
    valueText,
    percentage,
    isIndeterminate,
  }: HeadlessProgressBarRenderProps) => {
    const showValueLabel = local.showValueLabel ?? !isIndeterminate;
    const fillWidth = isIndeterminate ? "30%" : `${percentage ?? 0}%`;

    return (
      <>
        <Show when={local.label || showValueLabel}>
          <div class={`flex justify-between items-center mb-1 ${sizeConfig().text}`}>
            <Show when={local.label}>
              <span id={labelId} class="text-primary-200 font-medium">
                {local.label}
              </span>
            </Show>
            <Show when={showValueLabel && !isIndeterminate}>
              <span class="text-primary-300">{valueText}</span>
            </Show>
          </div>
        </Show>

        <div class={`w-full ${sizeConfig().track} bg-bg-300 rounded-full overflow-hidden`}>
          <div
            class={`h-full rounded-full transition-all duration-300 ${variantStyles[variant()]} ${
              isIndeterminate ? "animate-progress-indeterminate" : ""
            }`}
            style={{ width: fillWidth }}
          />
        </div>
      </>
    );
  };

  return (
    <HeadlessProgressBar
      {...headlessProps}
      aria-labelledby={
        headlessProps["aria-labelledby"] ??
        (!headlessProps["aria-label"] && local.label ? labelId : undefined)
      }
      aria-label={headlessProps["aria-label"]}
      class={`w-full ${local.class ?? ""}`}
      children={renderChildren}
    />
  );
}
