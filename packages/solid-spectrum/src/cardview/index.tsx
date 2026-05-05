import { type JSX, splitProps } from "solid-js";
import {
  GridList as HeadlessGridList,
  GridListItem as HeadlessGridListItem,
  type GridListItemRenderProps,
  type GridListProps as HeadlessGridListProps,
  type GridListRenderProps,
} from "@proyecto-viviana/solidaria-components";
import type { Key } from "@proyecto-viviana/solid-stately";
import type { StyleString } from "../s2-style";
import { focusRing, style } from "../s2-style";
import { mergeStyles } from "../s2-style/runtime";
import { useProviderProps } from "../provider";

export type CardViewLayout = "grid" | "waterfall";
export type CardViewSize = "XS" | "S" | "M" | "L" | "XL";
export type CardViewDensity = "compact" | "regular" | "spacious";
export type CardViewVariant = "primary" | "secondary" | "tertiary" | "quiet";
export type CardViewSelectionStyle = "checkbox" | "highlight";

export interface CardViewProps<T extends object> extends Omit<
  HeadlessGridListProps<T>,
  "class" | "style" | "children"
> {
  /** The cards contained within the CardView. */
  children: (item: T) => JSX.Element;
  /** The layout of the cards. @default 'grid' */
  layout?: CardViewLayout;
  /** The size of the cards. @default 'M' */
  size?: CardViewSize;
  /** The amount of space between cards. @default 'regular' */
  density?: CardViewDensity;
  /** The visual style of the cards. @default 'primary' */
  variant?: CardViewVariant;
  /** How selection should be displayed. @default 'checkbox' */
  selectionStyle?: CardViewSelectionStyle;
  /** Spectrum-defined generated classes. */
  styles?: StyleString;
  /** Additional CSS class name. Use only as a last resort. */
  UNSAFE_className?: string;
  /** Additional inline styles. Use only as a last resort. */
  UNSAFE_style?: JSX.CSSProperties;
  /** Backward-compatible class alias. Prefer UNSAFE_className for S2 parity. */
  class?: string;
}

const cardViewStyles = style<
  GridListRenderProps & { size: CardViewSize; density: CardViewDensity }
>({
  ...focusRing(),
  display: "grid",
  boxSizing: "border-box",
  overflowY: "auto",
  gap: {
    density: {
      compact: 12,
      regular: 16,
      spacious: 20,
    },
  },
  gridTemplateColumns: {
    size: {
      XS: "[repeat(auto-fit,minmax(100px,140px))]",
      S: "[repeat(auto-fit,minmax(150px,210px))]",
      M: "[repeat(auto-fit,minmax(200px,280px))]",
      L: "[repeat(auto-fit,minmax(270px,370px))]",
      XL: "[repeat(auto-fit,minmax(340px,460px))]",
    },
  },
  alignItems: "stretch",
  justifyContent: "start",
  outlineStyle: {
    default: "none",
    isFocusVisible: "solid",
  },
  outlineOffset: -2,
});

const cardViewItemStyles = style<
  GridListItemRenderProps & { variant: CardViewVariant; selectionStyle: CardViewSelectionStyle }
>({
  position: "relative",
  minWidth: 0,
  minHeight: 0,
  borderRadius: "lg",
  outlineStyle: "none",
  cursor: {
    default: "default",
    isDisabled: "not-allowed",
  },
  boxShadow: {
    isSelected: {
      selectionStyle: {
        highlight: "elevated",
      },
    },
  },
});

const selectionHighlight = style<
  GridListItemRenderProps & { selectionStyle: CardViewSelectionStyle }
>({
  position: "absolute",
  inset: 0,
  zIndex: 2,
  borderRadius: "lg",
  pointerEvents: "none",
  borderWidth: 2,
  borderStyle: "solid",
  borderColor: "[#222222]",
  opacity: {
    default: 0,
    isSelected: 1,
    selectionStyle: {
      checkbox: 0,
    },
  },
});

function itemKey<T extends object>(item: T, getKey?: (item: T) => Key): Key {
  if (getKey) {
    return getKey(item);
  }

  const maybeId = (item as { id?: Key }).id;
  return maybeId ?? String(item);
}

function itemText<T extends object>(item: T, getTextValue?: (item: T) => string): string {
  if (getTextValue) {
    return getTextValue(item);
  }

  const maybeName =
    (item as { name?: string; label?: string; title?: string }).name ??
    (item as { label?: string }).label ??
    (item as { title?: string }).title;
  return maybeName ?? String(itemKey(item));
}

/**
 * A CardView displays a group of related objects with optional selection.
 */
export function CardView<T extends object>(props: CardViewProps<T>): JSX.Element {
  const mergedProps = useProviderProps(props);
  const [local, headlessProps] = splitProps(mergedProps, [
    "children",
    "layout",
    "size",
    "density",
    "variant",
    "selectionStyle",
    "styles",
    "UNSAFE_className",
    "UNSAFE_style",
    "class",
    "getKey",
    "getTextValue",
  ]);
  const size = (): CardViewSize => local.size ?? "M";
  const density = (): CardViewDensity => local.density ?? "regular";
  const variant = (): CardViewVariant => local.variant ?? "primary";
  const selectionStyle = (): CardViewSelectionStyle => local.selectionStyle ?? "checkbox";
  const className = (renderProps: GridListRenderProps): string =>
    [
      local.UNSAFE_className,
      local.class,
      mergeStyles(
        cardViewStyles({
          ...renderProps,
          size: size(),
          density: density(),
        }),
        local.styles,
      ),
    ]
      .filter(Boolean)
      .join(" ");

  return (
    <HeadlessGridList
      {...headlessProps}
      getKey={local.getKey}
      getTextValue={local.getTextValue}
      class={className}
      style={local.UNSAFE_style}
      data-layout={local.layout ?? "grid"}
      data-size={size()}
      data-density={density()}
      data-variant={variant()}
      data-selection-style={selectionStyle()}
    >
      {(item: T) => (
        <HeadlessGridListItem
          id={itemKey(item, local.getKey)}
          textValue={itemText(item, local.getTextValue)}
          class={(renderProps) =>
            cardViewItemStyles({
              ...renderProps,
              variant: variant(),
              selectionStyle: selectionStyle(),
            })
          }
        >
          {(renderProps) => (
            <>
              <span
                class={selectionHighlight({
                  ...renderProps,
                  selectionStyle: selectionStyle(),
                })}
                aria-hidden="true"
              />
              {local.children(item)}
            </>
          )}
        </HeadlessGridListItem>
      )}
    </HeadlessGridList>
  );
}
