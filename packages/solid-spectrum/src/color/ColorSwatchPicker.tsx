/**
 * ColorSwatchPicker component for proyecto-viviana-solid-spectrum
 *
 * Styled grid of selectable color swatches.
 */

import { type JSX, splitProps, createContext, createMemo, useContext } from "solid-js";
import {
  ColorSwatchPicker as HeadlessColorSwatchPicker,
  ColorSwatchPickerItem as HeadlessColorSwatchPickerItem,
  ColorSwatch as HeadlessColorSwatch,
  type ColorSwatchPickerProps as HeadlessColorSwatchPickerProps,
  type ColorSwatchPickerItemProps as HeadlessColorSwatchPickerItemProps,
  type ColorSwatchRenderProps,
} from "@proyecto-viviana/solidaria-components";
import type { Color } from "@proyecto-viviana/solid-stately";

// ============================================
// TYPES
// ============================================

export type SwatchPickerSize = "xs" | "sm" | "md" | "lg" | "XS" | "S" | "M" | "L";
export type SwatchPickerDensity = "compact" | "regular" | "spacious";
export type SwatchPickerRounding = "none" | "default" | "full";

export interface ColorSwatchPickerProps extends Omit<
  HeadlessColorSwatchPickerProps,
  "class" | "style"
> {
  /** The size of the swatches. @default 'md' */
  size?: SwatchPickerSize;
  /** The gap between swatches. @default 'regular' */
  density?: SwatchPickerDensity;
  /** The corner rounding of swatches. @default 'none' */
  rounding?: SwatchPickerRounding;
  /** Additional CSS class name. */
  class?: string;
}

export interface ColorSwatchPickerItemProps extends Omit<
  HeadlessColorSwatchPickerItemProps,
  "class" | "style"
> {
  /** The color value for this swatch. */
  color: Color | string;
  /** Additional CSS class name. */
  class?: string;
}

// ============================================
// CONTEXT
// ============================================

interface SwatchPickerContextValue {
  size: "xs" | "sm" | "md" | "lg";
  rounding: SwatchPickerRounding;
}

const SwatchPickerContext = createContext<SwatchPickerContextValue>({
  size: "md",
  rounding: "none",
});

// ============================================
// STYLES
// ============================================

const sizeMap: Record<"xs" | "sm" | "md" | "lg", string> = {
  xs: "w-5 h-5",
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-10 h-10",
};

const densityMap: Record<SwatchPickerDensity, string> = {
  compact: "gap-1",
  regular: "gap-2",
  spacious: "gap-4",
};

const roundingMap: Record<SwatchPickerRounding, string> = {
  none: "rounded-none",
  default: "rounded",
  full: "rounded-full",
};

// ============================================
// COMPONENTS
// ============================================

/**
 * A ColorSwatchPicker displays a list of color swatches and allows a user to select one.
 */
export function ColorSwatchPicker(props: ColorSwatchPickerProps): JSX.Element {
  const [local, headlessProps] = splitProps(props, ["size", "density", "rounding", "class"]);

  const normalizeSize = (size: SwatchPickerSize | undefined): "xs" | "sm" | "md" | "lg" => {
    switch (size) {
      case "XS":
        return "xs";
      case "S":
        return "sm";
      case "M":
        return "md";
      case "L":
        return "lg";
      default:
        return size ?? "md";
    }
  };

  const size = () => normalizeSize(local.size);
  const density = () => local.density ?? "regular";
  const rounding = () => local.rounding ?? "none";

  const contextValue = createMemo(
    (): SwatchPickerContextValue => ({
      size: size(),
      rounding: rounding(),
    }),
  );

  return (
    <SwatchPickerContext.Provider value={contextValue()}>
      <HeadlessColorSwatchPicker
        {...headlessProps}
        class={`flex flex-wrap ${densityMap[density()]} ${local.class ?? ""}`}
      />
    </SwatchPickerContext.Provider>
  );
}

/**
 * An item within a ColorSwatchPicker that wraps a color swatch with selection state.
 */
export function ColorSwatchPickerItem(props: ColorSwatchPickerItemProps): JSX.Element {
  const [local, headlessProps] = splitProps(props, ["color", "class"]);
  const context = useContext(SwatchPickerContext);

  const sizeClass = () => sizeMap[context.size];
  const roundingClass = () => roundingMap[context.rounding];

  return (
    <HeadlessColorSwatchPickerItem
      {...headlessProps}
      color={local.color}
      class={`
        relative inline-flex cursor-pointer
        outline-none transition-all duration-150
        focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2
        ${local.class ?? ""}
      `}
    >
      <HeadlessColorSwatch
        color={local.color}
        class={(_renderProps: ColorSwatchRenderProps) => {
          const base = `${sizeClass()} ${roundingClass()} border border-bg-300 shadow-sm`;
          return base;
        }}
      />
      <div
        aria-hidden="true"
        class={`
          absolute inset-0 pointer-events-none opacity-0 transition-opacity
          ${roundingClass()}
          ring-2 ring-accent ring-offset-2 ring-offset-bg-400
          [[data-selected]_&]:opacity-100
        `}
      />
    </HeadlessColorSwatchPickerItem>
  );
}
