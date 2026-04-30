import { type JSX, splitProps } from "solid-js";

export interface GridProps {
  /** The number of columns, or a grid-template-columns value. */
  columns?: number | string;
  /** The number of rows, or a grid-template-rows value. */
  rows?: number | string;
  /** The gap between items. Accepts Tailwind gap values. */
  gap?: string | number;
  /** The column gap. */
  columnGap?: string | number;
  /** The row gap. */
  rowGap?: string | number;
  /** Named grid areas (grid-template-areas). */
  areas?: string[];
  /** The alignment of items. */
  alignItems?: "start" | "center" | "end" | "stretch";
  /** The justification of items. */
  justifyItems?: "start" | "center" | "end" | "stretch";
  /** Whether the grid is inline. */
  inline?: boolean;
  /** Additional CSS class name. */
  class?: string;
  /** Additional inline styles. */
  style?: JSX.CSSProperties;
  /** The content. */
  children?: JSX.Element;
}

/**
 * A CSS Grid layout component.
 */
export function Grid(props: GridProps): JSX.Element {
  const [local, rest] = splitProps(props, [
    "columns",
    "rows",
    "gap",
    "columnGap",
    "rowGap",
    "areas",
    "alignItems",
    "justifyItems",
    "inline",
    "class",
    "style",
    "children",
  ]);

  const gridStyle = (): JSX.CSSProperties => {
    const s: JSX.CSSProperties = { ...local.style };

    if (local.columns !== undefined) {
      s["grid-template-columns"] =
        typeof local.columns === "number" ? `repeat(${local.columns}, 1fr)` : local.columns;
    }
    if (local.rows !== undefined) {
      s["grid-template-rows"] =
        typeof local.rows === "number" ? `repeat(${local.rows}, 1fr)` : local.rows;
    }
    if (local.areas) {
      s["grid-template-areas"] = local.areas.map((a) => `"${a}"`).join(" ");
    }

    return s;
  };

  const classes = (): string => {
    const parts: string[] = [local.inline ? "inline-grid" : "grid"];

    if (local.gap !== undefined) parts.push(`gap-${local.gap}`);
    if (local.columnGap !== undefined) parts.push(`gap-x-${local.columnGap}`);
    if (local.rowGap !== undefined) parts.push(`gap-y-${local.rowGap}`);

    if (local.alignItems) {
      const map: Record<string, string> = {
        start: "items-start",
        center: "items-center",
        end: "items-end",
        stretch: "items-stretch",
      };
      parts.push(map[local.alignItems] ?? "");
    }
    if (local.justifyItems) {
      const map: Record<string, string> = {
        start: "justify-items-start",
        center: "justify-items-center",
        end: "justify-items-end",
        stretch: "justify-items-stretch",
      };
      parts.push(map[local.justifyItems] ?? "");
    }
    if (local.class) parts.push(local.class);

    return parts.filter(Boolean).join(" ");
  };

  return (
    <div {...rest} class={classes()} style={gridStyle()}>
      {local.children}
    </div>
  );
}
