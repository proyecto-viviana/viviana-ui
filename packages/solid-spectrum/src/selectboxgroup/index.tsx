import {
  children as resolveChildren,
  createContext,
  type JSX,
  splitProps,
  useContext,
} from "solid-js";
import {
  ListBox as HeadlessListBox,
  ListBoxOption as HeadlessListBoxOption,
  type ListBoxOptionProps as HeadlessListBoxOptionProps,
  type ListBoxOptionRenderProps,
  type ListBoxProps as HeadlessListBoxProps,
  type ListBoxRenderProps,
} from "@proyecto-viviana/solidaria-components";
import type { Key } from "@proyecto-viviana/solid-stately";
import type { StyleString } from "../s2-style";
import { focusRing, style } from "../s2-style";
import { mergeStyles } from "../s2-style/runtime";
import { useProviderProps } from "../provider";

export type SelectBoxOrientation = "horizontal" | "vertical";

export interface SelectBoxGroupProps<T> extends Omit<
  HeadlessListBoxProps<T>,
  "class" | "style" | "children" | "layout" | "orientation"
> {
  /** The SelectBox elements contained within the SelectBoxGroup. */
  children: (item: T) => JSX.Element;
  /** The layout direction of the content in each SelectBox. @default 'vertical' */
  orientation?: SelectBoxOrientation;
  /** Whether the SelectBoxGroup is disabled. */
  isDisabled?: boolean;
  /** Spectrum-defined generated classes. */
  styles?: StyleString;
  /** Additional CSS class name. Use only as a last resort. */
  UNSAFE_className?: string;
  /** Additional inline styles. Use only as a last resort. */
  UNSAFE_style?: JSX.CSSProperties;
  /** Backward-compatible class alias. Prefer UNSAFE_className for S2 parity. */
  class?: string;
}

export interface SelectBoxProps extends Omit<
  HeadlessListBoxOptionProps<unknown>,
  "class" | "style" | "children"
> {
  /** The unique id of the SelectBox. */
  id: Key;
  /** The contents of the SelectBox. */
  children?: JSX.Element;
  /** Spectrum-defined generated classes. */
  styles?: StyleString;
  /** Additional CSS class name. Use only as a last resort. */
  UNSAFE_className?: string;
  /** Additional inline styles. Use only as a last resort. */
  UNSAFE_style?: JSX.CSSProperties;
  /** Backward-compatible class alias. Prefer UNSAFE_className for S2 parity. */
  class?: string;
}

interface SelectBoxContextValue {
  orientation?: SelectBoxOrientation;
  isDisabled?: boolean;
}

const SelectBoxContext = createContext<SelectBoxContextValue>({ orientation: "vertical" });

const selectBoxGroupStyles = style<{ orientation?: SelectBoxOrientation }>({
  display: "grid",
  gridAutoRows: "1fr",
  gap: 24,
  justifyContent: "center",
  gridTemplateColumns: {
    orientation: {
      vertical: "[repeat(auto-fit,minmax(144px,min(170px,100%)))]",
      horizontal: "[repeat(auto-fit,minmax(188px,min(368px,100%)))]",
    },
  },
});

const selectBoxStyles = style<ListBoxOptionRenderProps & { orientation?: SelectBoxOrientation }>({
  ...focusRing(),
  display: "grid",
  position: "relative",
  boxSizing: "border-box",
  overflow: "hidden",
  width: {
    default: 170,
    orientation: {
      horizontal: 368,
    },
  },
  minWidth: {
    default: 144,
    orientation: {
      horizontal: 188,
    },
  },
  minHeight: {
    default: 144,
    orientation: {
      horizontal: 80,
    },
  },
  padding: {
    default: 24,
    orientation: {
      horizontal: 16,
    },
  },
  borderRadius: "lg",
  borderStyle: "solid",
  borderWidth: 2,
  borderColor: {
    default: "transparent",
    isSelected: "[#222222]",
  },
  backgroundColor: {
    default: "layer-2",
    isDisabled: "disabled",
  },
  color: {
    isDisabled: "disabled",
  },
  boxShadow: {
    default: "emphasized",
    isHovered: "elevated",
    isSelected: "elevated",
    isDisabled: "none",
  },
  cursor: {
    default: "default",
    isDisabled: "not-allowed",
  },
  transition: "default",
});

const selectBoxContent = style<{ orientation?: SelectBoxOrientation }>({
  display: "grid",
  gap: {
    default: 8,
    orientation: {
      horizontal: 2,
    },
  },
  alignContent: {
    default: "center",
    orientation: {
      horizontal: "start",
    },
  },
  justifyItems: {
    default: "center",
    orientation: {
      horizontal: "start",
    },
  },
  textAlign: {
    default: "center",
    orientation: {
      horizontal: "start",
    },
  },
  minWidth: 0,
});

/**
 * SelectBoxGroup allows users to select one or more options from a list.
 */
export function SelectBoxGroup<T>(props: SelectBoxGroupProps<T>): JSX.Element {
  const mergedProps = useProviderProps(props);
  const [local, headlessProps] = splitProps(mergedProps, [
    "children",
    "orientation",
    "isDisabled",
    "selectionMode",
    "styles",
    "UNSAFE_className",
    "UNSAFE_style",
    "class",
  ]);
  const orientation = (): SelectBoxOrientation => local.orientation ?? "vertical";
  const contextValue = {
    get orientation() {
      return orientation();
    },
    get isDisabled() {
      return local.isDisabled;
    },
  };
  const className = (_renderProps: ListBoxRenderProps): string =>
    [
      local.UNSAFE_className,
      local.class,
      mergeStyles(selectBoxGroupStyles({ orientation: orientation() }), local.styles),
    ]
      .filter(Boolean)
      .join(" ");

  return (
    <SelectBoxContext.Provider value={contextValue}>
      <HeadlessListBox
        {...headlessProps}
        isDisabled={local.isDisabled}
        selectionMode={local.selectionMode ?? "single"}
        layout="grid"
        orientation={orientation()}
        class={className}
        style={local.UNSAFE_style}
        data-orientation={orientation()}
        data-disabled={local.isDisabled ? "true" : undefined}
      >
        {(item: T) => local.children(item)}
      </HeadlessListBox>
    </SelectBoxContext.Provider>
  );
}

/**
 * SelectBox is a single selectable item in a SelectBoxGroup.
 */
export function SelectBox(props: SelectBoxProps): JSX.Element {
  const context = useContext(SelectBoxContext);
  const [local, headlessProps] = splitProps(props, [
    "children",
    "styles",
    "UNSAFE_className",
    "UNSAFE_style",
    "class",
  ]);
  const orientation = (): SelectBoxOrientation => context.orientation ?? "vertical";
  const isDisabled = () => !!headlessProps.isDisabled || !!context.isDisabled;
  const getClassName = (renderProps: ListBoxOptionRenderProps): string =>
    [
      local.UNSAFE_className,
      local.class,
      mergeStyles(
        selectBoxStyles({
          ...renderProps,
          isDisabled: renderProps.isDisabled || isDisabled(),
          orientation: orientation(),
        }),
        local.styles,
      ),
    ]
      .filter(Boolean)
      .join(" ");
  const getStyle = (_renderProps: ListBoxOptionRenderProps): JSX.CSSProperties => ({
    ...(local.UNSAFE_style ?? {}),
  });

  function SelectBoxContent() {
    const resolvedChildren = resolveChildren(() => local.children);
    return (
      <div class={selectBoxContent({ orientation: orientation() })} data-rsp-slot="content">
        {resolvedChildren()}
      </div>
    );
  }

  return (
    <HeadlessListBoxOption
      {...headlessProps}
      isDisabled={isDisabled()}
      class={getClassName}
      style={getStyle}
      data-select-box=""
    >
      <SelectBoxContent />
    </HeadlessListBoxOption>
  );
}
