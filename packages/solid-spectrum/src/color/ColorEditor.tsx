import { type JSX, splitProps } from "solid-js";
import {
  ColorEditor as HeadlessColorEditor,
  type ColorEditorProps as HeadlessColorEditorProps,
} from "@proyecto-viviana/solidaria-components";

export interface ColorEditorProps extends Omit<HeadlessColorEditorProps, "class" | "style"> {
  /** Additional CSS class name. */
  class?: string;
}

/**
 * A complete color editor with area, hue slider, alpha slider,
 * color space selector, and channel fields.
 */
export function ColorEditor(props: ColorEditorProps): JSX.Element {
  const [local, headlessProps] = splitProps(props, ["class"]);

  return (
    <HeadlessColorEditor
      {...headlessProps}
      class={({ colorSpace }) => {
        const base = [
          "flex flex-col gap-3",
          // Ensure readable defaults for nested native form controls
          "[&_label]:text-primary-200 [&_input]:text-primary-100",
          "[&_.solidaria-ColorEditor-top]:flex [&_.solidaria-ColorEditor-top]:gap-3",
          "[&_.solidaria-ColorEditor-bottom]:flex [&_.solidaria-ColorEditor-bottom]:gap-2 [&_.solidaria-ColorEditor-bottom]:items-end",
          "[&_.solidaria-ColorEditor-format]:h-8 [&_.solidaria-ColorEditor-format]:px-2 [&_.solidaria-ColorEditor-format]:text-sm",
          "[&_.solidaria-ColorEditor-format]:rounded-md [&_.solidaria-ColorEditor-format]:border [&_.solidaria-ColorEditor-format]:border-bg-300",
          "[&_.solidaria-ColorEditor-format]:bg-bg-400 [&_.solidaria-ColorEditor-format]:text-primary-200",
          "[&_.solidaria-ColorEditor-format]:outline-none [&_.solidaria-ColorEditor-format]:focus:ring-2 [&_.solidaria-ColorEditor-format]:focus:ring-accent",
          "[&_.solidaria-ColorField-input]:bg-bg-400 [&_.solidaria-ColorField-input]:border [&_.solidaria-ColorField-input]:border-bg-300",
          "[&_.solidaria-ColorField-input]:text-primary-100 [&_.solidaria-ColorField-input]:rounded-md",
        ].join(" ");

        return `${base} ${local.class ?? ""}`;
      }}
    />
  );
}
