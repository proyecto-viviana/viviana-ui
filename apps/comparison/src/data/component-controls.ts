import {
  actionButtonDemoDefaults,
  actionButtonSizeOptions,
  actionButtonStaticColorOptions,
} from "./actionbutton-demo";
import {
  buttonDemoDefaults,
  buttonFillStyleOptions,
  buttonSizeOptions,
  buttonStaticColorOptions,
  buttonVariantOptions,
} from "./button-demo";
import type { ComparisonEntry } from "./comparison-manifest";

export type ComponentControlKind = "text" | "select" | "radio" | "switch";

export interface ComponentControlOption {
  value: string;
  label: string;
}

export interface ComponentControl {
  name: string;
  label: string;
  kind: ComponentControlKind;
  defaultValue: string | boolean;
  options?: readonly ComponentControlOption[];
}

export interface ComponentControlGroup {
  slug: string;
  title: string;
  coverage: "modeled" | "gap";
  controls: readonly ComponentControl[];
  apiProps: readonly string[];
  note: string;
}

function options(values: readonly string[]): ComponentControlOption[] {
  return values.map((value) => ({ value, label: value }));
}

const buttonControls: ComponentControlGroup = {
  slug: "button",
  title: "Button",
  coverage: "modeled",
  controls: [
    {
      name: "children",
      label: "children",
      kind: "text",
      defaultValue: buttonDemoDefaults.children,
    },
    {
      name: "variant",
      label: "variant",
      kind: "select",
      defaultValue: buttonDemoDefaults.variant,
      options: options(buttonVariantOptions),
    },
    {
      name: "staticColor",
      label: "staticColor",
      kind: "radio",
      defaultValue: "none",
      options: [{ value: "none", label: "none" }, ...options(buttonStaticColorOptions)],
    },
    {
      name: "fillStyle",
      label: "fillStyle",
      kind: "radio",
      defaultValue: buttonDemoDefaults.fillStyle,
      options: options(buttonFillStyleOptions),
    },
    {
      name: "size",
      label: "size",
      kind: "radio",
      defaultValue: buttonDemoDefaults.size,
      options: options(buttonSizeOptions),
    },
    {
      name: "isDisabled",
      label: "isDisabled",
      kind: "switch",
      defaultValue: false,
    },
    {
      name: "isPending",
      label: "isPending",
      kind: "switch",
      defaultValue: false,
    },
  ],
  apiProps: [
    "children",
    "isPending",
    "isDisabled",
    "styles",
    "variant",
    "fillStyle",
    "size",
    "staticColor",
    "onPress",
    "onPressStart",
    "onPressEnd",
    "onPressChange",
    "onPressUp",
    "onFocus",
    "onBlur",
    "onFocusChange",
    "onKeyDown",
    "onKeyUp",
    "name",
    "value",
    "type",
    "form",
    "formAction",
    "formEncType",
    "formMethod",
    "formNoValidate",
    "formTarget",
    "aria-label",
    "aria-labelledby",
    "aria-describedby",
    "excludeFromTabOrder",
    "preventFocusOnPress",
  ],
  note: "Modeled from the S2 Button docs control surface. Callback, form, and accessibility props are tracked as API coverage rather than visual controls.",
};

const actionButtonControls: ComponentControlGroup = {
  slug: "actionbutton",
  title: "ActionButton",
  coverage: "modeled",
  controls: [
    {
      name: "children",
      label: "children",
      kind: "text",
      defaultValue: actionButtonDemoDefaults.children,
    },
    {
      name: "size",
      label: "size",
      kind: "radio",
      defaultValue: actionButtonDemoDefaults.size,
      options: options(actionButtonSizeOptions),
    },
    {
      name: "staticColor",
      label: "staticColor",
      kind: "radio",
      defaultValue: "none",
      options: [{ value: "none", label: "none" }, ...options(actionButtonStaticColorOptions)],
    },
    {
      name: "isQuiet",
      label: "isQuiet",
      kind: "switch",
      defaultValue: false,
    },
    {
      name: "isDisabled",
      label: "isDisabled",
      kind: "switch",
      defaultValue: false,
    },
    {
      name: "isPending",
      label: "isPending",
      kind: "switch",
      defaultValue: false,
    },
  ],
  apiProps: [
    "children",
    "isPending",
    "isDisabled",
    "styles",
    "size",
    "staticColor",
    "isQuiet",
    "onPress",
    "onPressStart",
    "onPressEnd",
    "onPressChange",
    "onPressUp",
    "onFocus",
    "onBlur",
    "onFocusChange",
    "onKeyDown",
    "onKeyUp",
    "aria-label",
    "aria-labelledby",
    "aria-describedby",
    "excludeFromTabOrder",
    "preventFocusOnPress",
  ],
  note: "Modeled from the S2 ActionButton docs control surface. Icon, Avatar, and Badge content are tracked as visual content gaps until the comparison fixtures render those slots.",
};

export const componentControlGroups = {
  actionbutton: actionButtonControls,
  button: buttonControls,
} as const satisfies Record<string, ComponentControlGroup>;

export function getComponentControlGroup(entry: ComparisonEntry): ComponentControlGroup {
  return (
    componentControlGroups[entry.slug as keyof typeof componentControlGroups] ?? {
      slug: entry.slug,
      title: entry.title,
      coverage: "gap",
      controls: [],
      apiProps: [],
      note: "The S2 prop control model has not been imported for this component yet. This page is intentionally marked as an API-control gap.",
    }
  );
}
