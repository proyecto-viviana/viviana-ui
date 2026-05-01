import { jsx, jsxs } from "react/jsx-runtime";
// Keep this module JSX-free. Vite dev import-analysis currently sees this
// client-script dependency before Astro's React JSX transform runs.
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActionButton as SpectrumActionButton,
  ActionButtonGroup as SpectrumActionButtonGroup,
  Button as SpectrumButton,
  ButtonGroup as SpectrumButtonGroup,
  Checkbox as SpectrumCheckbox,
  Content as SpectrumContent,
  DatePicker as SpectrumDatePicker,
  Dialog as SpectrumDialog,
  DialogTrigger as SpectrumDialogTrigger,
  Heading as SpectrumHeading,
  Picker as SpectrumPicker,
  PickerItem as SpectrumPickerItem,
  Provider as SpectrumProvider,
  Radio as SpectrumRadio,
  RadioGroup as SpectrumRadioGroup,
  SearchField as SpectrumSearchField,
  Tab as SpectrumTab,
  TabList as SpectrumTabList,
  TabPanel as SpectrumTabPanel,
  Tabs as SpectrumTabs,
  Text as SpectrumText,
  TextField as SpectrumTextField,
  Tooltip as SpectrumTooltip,
  TooltipTrigger as SpectrumTooltipTrigger,
  ToggleButton as SpectrumToggleButton,
} from "@react-spectrum/s2";
import "@react-spectrum/s2/page.css";
import {
  Button as RACButton,
  Dialog as RACDialog,
  DialogTrigger as RACDialogTrigger,
  Heading as RACHeading,
  Popover as RACPopover,
  Tab as RACTab,
  TabList as RACTabList,
  TabPanel as RACTabPanel,
  Tabs as RACTabs,
} from "react-aria-components";
import { UNSAFE_PortalProvider, useButton } from "react-aria";
import {
  actionButtonDemoPropsFromWindow,
  comparisonControlsEvent as actionButtonControlsEvent,
  serializeActionButtonDemoProps,
} from "@comparison/data/actionbutton-demo";
import {
  comparisonActionItems as actionItems,
  comparisonReferenceDataset,
  comparisonSelectItems as selectItems,
  comparisonTabItems as tabItems,
  getComparisonReferenceKind,
} from "@comparison/data/comparison-contract";
import {
  buttonDemoPropsFromWindow,
  comparisonControlsEvent,
  serializeButtonDemoProps,
} from "@comparison/data/button-demo";
import {
  comparisonThemeChangeEvent,
  getComparisonResolvedThemeFromDocument,
} from "@comparison/data/theme";
function ComparisonIsland(props) {
  const overlayRootRef = useRef(null);
  return /* @__PURE__ */ jsxs("div", {
    className: "comparison-island",
    children: [
      /* @__PURE__ */ jsx(UNSAFE_PortalProvider, {
        getContainer: () => document.body,
        children: renderLayer(props),
      }),
      /* @__PURE__ */ jsx("div", { ref: overlayRootRef, className: "comparison-overlay-root" }),
    ],
  });
}
function renderLayer({ componentSlug, layer }) {
  let rendered;
  if (layer === "styled") {
    rendered = renderStyled(componentSlug);
  } else if (layer === "components") {
    rendered = renderComponents(componentSlug);
  } else if (layer === "headless") {
    rendered = renderHeadless(componentSlug);
  } else {
    rendered = /* @__PURE__ */ jsx("div", {
      className: "comparison-empty-state",
      children: "This layer is tracked in the manifest but not rendered yet.",
    });
  }

  return /* @__PURE__ */ jsx(ComparisonReferenceFrame, {
    componentSlug,
    layer,
    children: rendered,
  });
}
function ComparisonReferenceFrame({ componentSlug, layer, children }) {
  const reference = getComparisonReferenceKind("react", layer, componentSlug);
  return /* @__PURE__ */ jsx("div", {
    className: "comparison-reference-frame",
    ...comparisonReferenceDataset({
      componentSlug,
      framework: "react",
      layer,
      reference,
    }),
    children: /* @__PURE__ */ jsx("div", { className: "comparison-reference-canvas", children }),
  });
}
function renderReactSpectrumReference(children, colorScheme = "dark") {
  return /* @__PURE__ */ jsx(SpectrumProvider, {
    colorScheme,
    background: "base",
    UNSAFE_style: providerShellStyle,
    children,
  });
}
function renderStyled(componentSlug) {
  switch (componentSlug) {
    case "provider":
      return /* @__PURE__ */ jsx(SpectrumProvider, {
        colorScheme: "dark",
        background: "base",
        UNSAFE_style: providerShellStyle,
        children: /* @__PURE__ */ jsxs("div", {
          className: "comparison-provider-stack",
          children: [
            /* @__PURE__ */ jsx("div", {
              className: "comparison-provider-caption",
              children: "Outer provider: dark / medium scale",
            }),
            /* @__PURE__ */ jsx(SpectrumButton, {
              variant: "primary",
              children: "Inherited Action",
            }),
            /* @__PURE__ */ jsxs(SpectrumProvider, {
              colorScheme: "light",
              background: "base",
              UNSAFE_style: nestedProviderStyle,
              children: [
                /* @__PURE__ */ jsx("div", {
                  className: "comparison-provider-caption",
                  children: "Nested provider: local light override",
                }),
                /* @__PURE__ */ jsx(SpectrumButton, {
                  variant: "accent",
                  children: "Nested Override",
                }),
              ],
            }),
          ],
        }),
      });
    case "button":
      return /* @__PURE__ */ jsx(ReactButtonDemo, {});
    case "actionbutton":
      return /* @__PURE__ */ jsx(ReactActionButtonDemo, {});
    case "actionbuttongroup":
      return /* @__PURE__ */ jsx(ReactActionButtonGroupDemo, {});
    case "buttongroup":
      return /* @__PURE__ */ jsx(ReactButtonGroupDemo, {});
    case "togglebutton":
      return /* @__PURE__ */ jsx(ReactToggleButtonDemo, {});
    case "tabs":
      return renderReactSpectrumReference(
        /* @__PURE__ */ jsxs(SpectrumTabs, {
          "aria-label": "React Spectrum tabs",
          children: [
            /* @__PURE__ */ jsx(SpectrumTabList, {
              items: tabItems,
              children: (item) =>
                /* @__PURE__ */ jsx(SpectrumTab, { id: item.id, children: item.label }),
            }),
            tabItems.map((item) =>
              /* @__PURE__ */ jsx(
                SpectrumTabPanel,
                { id: item.id, children: item.content },
                item.id,
              ),
            ),
          ],
        }),
      );
    case "textfield":
      return /* @__PURE__ */ jsx(ReactTextFieldDemo, {});
    case "select":
      return /* @__PURE__ */ jsx(ReactSelectDemo, {});
    case "checkbox":
      return /* @__PURE__ */ jsx(ReactCheckboxDemo, {});
    case "dialog":
      return /* @__PURE__ */ jsx(ReactDialogDemo, {});
    case "radio":
      return /* @__PURE__ */ jsx(ReactRadioDemo, {});
    case "datepicker":
      return /* @__PURE__ */ jsx(ReactDatePickerDemo, {});
    case "searchfield":
      return /* @__PURE__ */ jsx(ReactSearchFieldDemo, {});
    case "tooltip":
      return /* @__PURE__ */ jsx(ReactTooltipDemo, {});
    case "toolbar":
      return /* @__PURE__ */ jsx(ReactToolbarDemo, {});
    case "toast":
      return /* @__PURE__ */ jsx("div", {
        className: "comparison-empty-state",
        children: "React Aria Components 1.15.1 does not expose Toast.",
      });
    default:
      return /* @__PURE__ */ jsx("div", {
        className: "comparison-empty-state",
        children: "No styled React Spectrum demo is wired for this component yet.",
      });
  }
}
function ReactButtonDemo() {
  const [actionCount, setActionCount] = useState(0);
  const demoProps = useButtonDemoControls();
  const colorScheme = useComparisonResolvedTheme();
  return renderReactSpectrumReference(
    /* @__PURE__ */ jsx("div", {
      "data-comparison-action-count": String(actionCount),
      "data-comparison-button-props": serializeButtonDemoProps(demoProps),
      children: /* @__PURE__ */ jsx("div", {
        className: "comparison-button-row",
        children: /* @__PURE__ */ jsx(SpectrumButton, {
          variant: demoProps.variant,
          fillStyle: demoProps.fillStyle,
          size: demoProps.size,
          staticColor: demoProps.staticColor,
          isDisabled: demoProps.isDisabled,
          isPending: demoProps.isPending,
          onPress: () => setActionCount((count) => count + 1),
          children: demoProps.children,
        }),
      }),
    }),
    colorScheme,
  );
}
function useComparisonResolvedTheme() {
  const [colorScheme, setColorScheme] = useState(getComparisonResolvedThemeFromDocument);
  useEffect(() => {
    const handleThemeChange = (event) => {
      if (event instanceof CustomEvent && event.detail?.resolvedTheme) {
        setColorScheme(event.detail.resolvedTheme);
      }
    };
    window.addEventListener(comparisonThemeChangeEvent, handleThemeChange);
    setColorScheme(getComparisonResolvedThemeFromDocument());
    return () => window.removeEventListener(comparisonThemeChangeEvent, handleThemeChange);
  }, []);
  return colorScheme;
}
function useButtonDemoControls() {
  const [demoProps, setDemoProps] = useState(buttonDemoPropsFromWindow);
  useEffect(() => {
    const handleControlsChange = (event) => {
      if (event instanceof CustomEvent && event.detail?.component === "button") {
        setDemoProps(event.detail.props);
      }
    };
    window.addEventListener(comparisonControlsEvent, handleControlsChange);
    return () => window.removeEventListener(comparisonControlsEvent, handleControlsChange);
  }, []);
  return demoProps;
}
function ReactActionButtonDemo() {
  const [actionCount, setActionCount] = useState(0);
  const demoProps = useActionButtonDemoControls();
  const colorScheme = useComparisonResolvedTheme();
  return renderReactSpectrumReference(
    /* @__PURE__ */ jsx("div", {
      "data-comparison-action-count": String(actionCount),
      "data-comparison-actionbutton-props": serializeActionButtonDemoProps(demoProps),
      children: /* @__PURE__ */ jsx(SpectrumActionButton, {
        size: demoProps.size,
        staticColor: demoProps.staticColor,
        isQuiet: demoProps.isQuiet,
        isDisabled: demoProps.isDisabled,
        isPending: demoProps.isPending,
        onPress: () => setActionCount((count) => count + 1),
        children: demoProps.children,
      }),
    }),
    colorScheme,
  );
}
function useActionButtonDemoControls() {
  const [demoProps, setDemoProps] = useState(actionButtonDemoPropsFromWindow);
  useEffect(() => {
    const handleControlsChange = (event) => {
      if (event instanceof CustomEvent && event.detail?.component === "actionbutton") {
        setDemoProps(event.detail.props);
      }
    };
    window.addEventListener(actionButtonControlsEvent, handleControlsChange);
    return () => window.removeEventListener(actionButtonControlsEvent, handleControlsChange);
  }, []);
  return demoProps;
}
function ReactActionButtonGroupDemo() {
  const [selectedKeys, setSelectedKeys] = useState(() => /* @__PURE__ */ new Set(["bold"]));
  const [actionKey, setActionKey] = useState("");
  const selectedKeyText = Array.from(selectedKeys).join(",");
  const toggleKey = (key) => {
    setActionKey(key);
    setSelectedKeys(new Set([key]));
  };
  return renderReactSpectrumReference(
    /* @__PURE__ */ jsx("div", {
      "data-comparison-action-key": actionKey,
      "data-comparison-selected-keys": selectedKeyText,
      children: /* @__PURE__ */ jsx(SpectrumActionButtonGroup, {
        "aria-label": "Formatting actions",
        children: actionItems.map((item) =>
          /* @__PURE__ */ jsx(
            SpectrumActionButton,
            {
              "aria-pressed": selectedKeys.has(item.id),
              onPress: () => toggleKey(item.id),
              children: item.label,
            },
            item.id,
          ),
        ),
      }),
    }),
  );
}
function ReactButtonGroupDemo() {
  const [actionKey, setActionKey] = useState("");
  return renderReactSpectrumReference(
    /* @__PURE__ */ jsx("div", {
      "data-comparison-action-key": actionKey,
      children: /* @__PURE__ */ jsxs(SpectrumButtonGroup, {
        children: [
          /* @__PURE__ */ jsx(SpectrumButton, {
            variant: "primary",
            onPress: () => setActionKey("save"),
            children: "Save",
          }),
          /* @__PURE__ */ jsx(SpectrumButton, {
            variant: "secondary",
            onPress: () => setActionKey("cancel"),
            children: "Cancel",
          }),
        ],
      }),
    }),
  );
}
function ReactToggleButtonDemo() {
  const [selected, setSelected] = useState(false);
  return renderReactSpectrumReference(
    /* @__PURE__ */ jsx("div", {
      "data-comparison-selected": String(selected),
      children: /* @__PURE__ */ jsx(SpectrumToggleButton, {
        isSelected: selected,
        onChange: setSelected,
        children: "Pin",
      }),
    }),
  );
}
function ReactTextFieldDemo() {
  const [value, setValue] = useState("Quarterly report");
  return renderReactSpectrumReference(
    /* @__PURE__ */ jsx("div", {
      "data-comparison-value": value,
      children: /* @__PURE__ */ jsx(SpectrumTextField, {
        label: "Name",
        defaultValue: "Quarterly report",
        onChange: setValue,
      }),
    }),
  );
}
function ReactSelectDemo() {
  const [selectedKey, setSelectedKey] = useState("bravo");
  return renderReactSpectrumReference(
    /* @__PURE__ */ jsx("div", {
      "data-comparison-selected-key": selectedKey,
      children: /* @__PURE__ */ jsx(SpectrumPicker, {
        label: "Channel",
        defaultSelectedKey: "bravo",
        onSelectionChange: (key) => setSelectedKey(key == null ? "" : String(key)),
        items: selectItems,
        children: (item) =>
          /* @__PURE__ */ jsx(SpectrumPickerItem, { id: item.id, children: item.label }),
      }),
    }),
  );
}
function ReactDialogDemo() {
  const [isOpen, setIsOpen] = useState(false);
  return renderReactSpectrumReference(
    /* @__PURE__ */ jsx("div", {
      "data-comparison-open": String(isOpen),
      children: /* @__PURE__ */ jsxs(SpectrumDialogTrigger, {
        isDismissable: true,
        onOpenChange: setIsOpen,
        children: [
          /* @__PURE__ */ jsx(SpectrumButton, { variant: "primary", children: "Open Dialog" }),
          /* @__PURE__ */ jsxs(SpectrumDialog, {
            isDismissible: true,
            children: [
              /* @__PURE__ */ jsx(SpectrumHeading, { slot: "title", children: "Review Changes" }),
              /* @__PURE__ */ jsx(SpectrumContent, {
                children: /* @__PURE__ */ jsx(SpectrumText, {
                  children: "Dialog focus and dismissal are compared from this island.",
                }),
              }),
            ],
          }),
        ],
      }),
    }),
  );
}
function ReactCheckboxDemo() {
  const [checked, setChecked] = useState(true);
  return renderReactSpectrumReference(
    /* @__PURE__ */ jsx("div", {
      "data-comparison-checked": String(checked),
      children: /* @__PURE__ */ jsx(SpectrumCheckbox, {
        defaultSelected: true,
        onChange: setChecked,
        children: "Enable alerts",
      }),
    }),
  );
}
function ReactRadioDemo() {
  const [selectedKey, setSelectedKey] = useState("compact");
  return renderReactSpectrumReference(
    /* @__PURE__ */ jsxs("div", {
      "data-comparison-selected-key": selectedKey,
      children: [
        /* @__PURE__ */ jsxs(SpectrumRadioGroup, {
          label: "Density",
          defaultValue: "compact",
          onChange: setSelectedKey,
          children: [
            /* @__PURE__ */ jsx(SpectrumRadio, { value: "compact", children: "Compact" }),
            /* @__PURE__ */ jsx(SpectrumRadio, { value: "comfortable", children: "Comfortable" }),
          ],
        }),
      ],
    }),
  );
}
function ReactDatePickerDemo() {
  const [value, setValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  return renderReactSpectrumReference(
    /* @__PURE__ */ jsx("div", {
      "data-comparison-value": value,
      "data-comparison-open": String(isOpen),
      children: /* @__PURE__ */ jsx(SpectrumDatePicker, {
        label: "Due date",
        onChange: (nextValue) => setValue(nextValue == null ? "" : String(nextValue)),
        onOpenChange: setIsOpen,
        UNSAFE_className: "comparison-datepicker-root",
      }),
    }),
  );
}
function ReactSearchFieldDemo() {
  const [value, setValue] = useState("status");
  const [clearCount, setClearCount] = useState(0);
  return renderReactSpectrumReference(
    /* @__PURE__ */ jsx("div", {
      "data-comparison-input-value": value,
      "data-comparison-clear-count": String(clearCount),
      children: /* @__PURE__ */ jsx(SpectrumSearchField, {
        label: "Search",
        defaultValue: "status",
        onChange: setValue,
        onClear: () => {
          setValue("");
          setClearCount((count) => count + 1);
        },
      }),
    }),
  );
}
function ReactTooltipDemo() {
  return renderReactSpectrumReference(
    /* @__PURE__ */ jsxs(SpectrumTooltipTrigger, {
      delay: 0,
      children: [
        /* @__PURE__ */ jsx(SpectrumActionButton, { children: "Inspect" }),
        /* @__PURE__ */ jsx(SpectrumTooltip, { children: "Tooltip content" }),
      ],
    }),
  );
}
function ReactToolbarDemo() {
  const [actionCount, setActionCount] = useState(0);
  return renderReactSpectrumReference(
    /* @__PURE__ */ jsx("div", {
      "data-comparison-action-count": String(actionCount),
      children: /* @__PURE__ */ jsxs(SpectrumActionButtonGroup, {
        "aria-label": "Formatting tools",
        children: [
          /* @__PURE__ */ jsx(SpectrumActionButton, {
            onPress: () => setActionCount((count) => count + 1),
            children: "Bold",
          }),
          /* @__PURE__ */ jsx(SpectrumActionButton, {
            onPress: () => setActionCount((count) => count + 1),
            children: "Italic",
          }),
        ],
      }),
    }),
  );
}
function renderComponents(componentSlug) {
  switch (componentSlug) {
    case "button":
      return /* @__PURE__ */ jsxs("div", {
        className: "comparison-stack",
        children: [
          /* @__PURE__ */ jsx(RACButton, {
            className: "comparison-rac-button",
            children: "Component Button",
          }),
          /* @__PURE__ */ jsx(RACButton, {
            isDisabled: true,
            className: "comparison-rac-button comparison-rac-button--muted",
            children: "Disabled by props",
          }),
        ],
      });
    case "popover":
      return /* @__PURE__ */ jsx("div", {
        className: "comparison-stack",
        children: /* @__PURE__ */ jsxs(RACDialogTrigger, {
          children: [
            /* @__PURE__ */ jsx(RACButton, {
              className: "comparison-rac-button",
              children: "Open Popover",
            }),
            /* @__PURE__ */ jsx(RACPopover, {
              className: "comparison-popover",
              children: /* @__PURE__ */ jsxs(RACDialog, {
                "aria-label": "Quick audit note",
                className: "comparison-popover-dialog",
                children: [
                  /* @__PURE__ */ jsx(RACHeading, {
                    slot: "title",
                    className: "comparison-popover-title",
                    children: "Confirm Action",
                  }),
                  /* @__PURE__ */ jsx("p", {
                    children:
                      "Outside press and escape should dismiss this overlay without escaping its local comparison root.",
                  }),
                ],
              }),
            }),
          ],
        }),
      });
    case "tabs":
      return /* @__PURE__ */ jsxs(RACTabs, {
        className: "comparison-rac-tabs",
        "aria-label": "React Aria tabs",
        children: [
          /* @__PURE__ */ jsx(RACTabList, {
            className: "comparison-rac-tab-list",
            children: tabItems.map((item) =>
              /* @__PURE__ */ jsx(
                RACTab,
                {
                  id: item.id,
                  className: "comparison-rac-tab",
                  children: item.label,
                },
                item.id,
              ),
            ),
          }),
          tabItems.map((item) =>
            /* @__PURE__ */ jsx(
              RACTabPanel,
              {
                id: item.id,
                className: "comparison-tabs-panel",
                children: item.content,
              },
              item.id,
            ),
          ),
        ],
      });
    default:
      return /* @__PURE__ */ jsx("div", {
        className: "comparison-empty-state",
        children: "No component-layer React demo is wired for this component yet.",
      });
  }
}
function renderHeadless(componentSlug) {
  switch (componentSlug) {
    case "button":
      return /* @__PURE__ */ jsx(ReactHeadlessButtonDemo, {});
    default:
      return /* @__PURE__ */ jsx("div", {
        className: "comparison-empty-state",
        children: "No headless React demo is wired for this component yet.",
      });
  }
}
function ReactHeadlessButtonDemo() {
  const ref = useRef(null);
  const [pressCount, setPressCount] = useState(0);
  const { buttonProps, isPressed } = useButton(
    {
      onPress: () => setPressCount((count) => count + 1),
      "aria-label": "Headless action",
    },
    ref,
  );
  const label = useMemo(() => {
    if (isPressed) {
      return "Pressed";
    }
    return `Pressed ${pressCount} times`;
  }, [isPressed, pressCount]);
  return /* @__PURE__ */ jsxs("div", {
    className: "comparison-headless-stack",
    children: [
      /* @__PURE__ */ jsx("button", {
        ...buttonProps,
        ref,
        type: "button",
        className: "comparison-headless-button",
        children: label,
      }),
      /* @__PURE__ */ jsx("p", {
        className: "comparison-helper-copy",
        children: "This uses the raw `useButton` hook rather than a pre-wired component.",
      }),
    ],
  });
}
const providerShellStyle = {
  padding: 0,
  background: "transparent",
};
const nestedProviderStyle = {
  padding: 16,
  marginTop: 16,
  borderRadius: 16,
};
export { ComparisonIsland as default };
