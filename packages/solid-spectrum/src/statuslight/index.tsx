import { type JSX, Show, splitProps } from "solid-js";

export type StatusLightVariant = "neutral" | "positive" | "notice" | "negative" | "info";
export type StatusLightSize = "sm" | "md" | "lg";

export interface StatusLightProps {
  /** Visual status variant. @default 'neutral' */
  variant?: StatusLightVariant;
  /** Indicator size. @default 'md' */
  size?: StatusLightSize;
  /** Optional visible text. */
  children?: JSX.Element;
  /** Additional CSS class for root container. */
  class?: string;
  /** Additional CSS class for the indicator dot. */
  indicatorClass?: string;
}

const variantStyles: Record<StatusLightVariant, string> = {
  neutral: "bg-primary-400",
  positive: "bg-green-500",
  notice: "bg-yellow-500",
  negative: "bg-danger-400",
  info: "bg-accent",
};

const sizeStyles: Record<StatusLightSize, { dot: string; text: string }> = {
  sm: { dot: "h-2 w-2", text: "text-xs" },
  md: { dot: "h-2.5 w-2.5", text: "text-sm" },
  lg: { dot: "h-3 w-3", text: "text-base" },
};

export function StatusLight(props: StatusLightProps): JSX.Element {
  const [local] = splitProps(props, ["variant", "size", "children", "class", "indicatorClass"]);
  const variant = () => local.variant ?? "neutral";
  const size = () => local.size ?? "md";

  return (
    <span
      class={`inline-flex items-center gap-2 text-primary-200 ${sizeStyles[size()].text} ${local.class ?? ""}`}
    >
      <span
        aria-hidden="true"
        class={`inline-block rounded-full ${sizeStyles[size()].dot} ${variantStyles[variant()]} ${local.indicatorClass ?? ""}`}
      />
      <Show when={local.children}>{local.children}</Show>
    </span>
  );
}
