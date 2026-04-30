import { type JSX, splitProps, mergeProps as solidMergeProps } from "solid-js";
import {
  Button as HeadlessButton,
  type ButtonRenderProps,
} from "@proyecto-viviana/solidaria-components";
import type { ButtonFillStyle, ButtonProps, ButtonSize, ButtonVariant } from "./types";
import { useProviderProps } from "../provider";

/**
 * Buttons allow users to perform an action or to navigate to another page.
 */
export function Button(props: ButtonProps): JSX.Element {
  const providerProps = useProviderProps(props);
  const defaultProps: Partial<ButtonProps> = {
    variant: "primary",
    size: "M",
  };

  const merged = solidMergeProps(defaultProps, providerProps);

  const [local, headlessProps] = splitProps(merged, [
    "variant",
    "fillStyle",
    "buttonStyle",
    "size",
    "fullWidth",
    "staticColor",
    "class",
  ]);

  const fillStyle = (): ButtonFillStyle => local.fillStyle ?? local.buttonStyle ?? "fill";
  const variantClass = () => normalizeVariantClass(local.variant ?? "primary");
  const sizeClass = () => normalizeSizeClass(local.size ?? "M");

  const getClassName = (renderProps: ButtonRenderProps): string => {
    const classList = [
      "vui-button",
      `vui-button--${fillStyle()}`,
      `vui-button--${variantClass()}`,
      `vui-button--${sizeClass()}`,
    ];

    if (renderProps.isPressed) {
      classList.push("is-pressed");
    }

    if (local.fullWidth) {
      classList.push("vui-button--full-width");
    }

    if (local.class) {
      classList.push(local.class);
    }

    return classList.join(" ");
  };

  return (
    <HeadlessButton
      {...headlessProps}
      class={getClassName}
      data-variant={local.variant}
      data-style={fillStyle()}
      data-static-color={local.staticColor || undefined}
    >
      {props.children}
    </HeadlessButton>
  );
}

function normalizeVariantClass(variant: ButtonVariant): string {
  if (variant === "danger") {
    return "negative";
  }

  if (variant === "success") {
    return "positive";
  }

  return variant;
}

function normalizeSizeClass(size: ButtonSize): string {
  if (size === "S" || size === "sm") {
    return "sm";
  }

  if (size === "L" || size === "lg") {
    return "lg";
  }

  if (size === "XL") {
    return "xl";
  }

  return "md";
}
