/**
 * createColorSwatch hook.
 *
 * Provides ARIA attributes for a color swatch display.
 */

import { createMemo, type Accessor } from "solid-js";
import { normalizeColor } from "@proyecto-viviana/solid-stately";
import type { AriaColorSwatchOptions, ColorSwatchAria } from "./types";

/**
 * Creates ARIA props for a color swatch.
 */
export function createColorSwatch(props: Accessor<AriaColorSwatchOptions>): ColorSwatchAria {
  const getProps = () => props();

  // Swatch props
  const swatchProps = createMemo(() => {
    const p = getProps();
    const color = normalizeColor(p.color);
    const colorName = color.getColorName("en-US");

    return {
      role: "img" as const,
      "aria-label": p["aria-label"] ?? colorName,
      "aria-roledescription": "color swatch",
      style: {
        "background-color": color.toString("css"),
      },
    };
  });

  return {
    get swatchProps() {
      return swatchProps();
    },
  };
}
