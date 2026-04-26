import { Fragment, jsx, jsxs } from "react/jsx-runtime";
// Keep this module JSX-free. Vite dev import-analysis currently sees this
// client-script dependency before Astro's React JSX transform runs.
import { useMemo, useRef, useState } from "react";
import { Provider as SpectrumProvider } from "@react-spectrum/provider";
import { Button as SpectrumButton } from "@react-spectrum/button";
import {
  Item as SpectrumItem,
  TabList as SpectrumTabList,
  TabPanels as SpectrumTabPanels,
  Tabs as SpectrumTabs
} from "@react-spectrum/tabs";
import { theme as defaultTheme } from "@react-spectrum/theme-default";
import {
  Button as RACButton,
  Calendar as RACCalendar,
  CalendarCell as RACCalendarCell,
  CalendarGrid as RACCalendarGrid,
  Checkbox as RACCheckbox,
  DateInput as RACDateInput,
  DatePicker as RACDatePicker,
  DateSegment as RACDateSegment,
  Dialog as RACDialog,
  DialogTrigger as RACDialogTrigger,
  Group as RACGroup,
  Heading as RACHeading,
  Input as RACInput,
  Label as RACLabel,
  ListBox as RACListBox,
  ListBoxItem as RACListBoxItem,
  Modal as RACModal,
  ModalOverlay as RACModalOverlay,
  Popover as RACPopover,
  Radio as RACRadio,
  RadioGroup as RACRadioGroup,
  SearchField as RACSearchField,
  Select as RACSelect,
  SelectValue as RACSelectValue,
  Tab as RACTab,
  TabList as RACTabList,
  TabPanel as RACTabPanel,
  Tabs as RACTabs,
  TextField as RACTextField,
  Toolbar as RACToolbar,
  Tooltip as RACTooltip,
  TooltipTrigger as RACTooltipTrigger,
  ToggleButton as RACToggleButton
} from "react-aria-components";
import { UNSAFE_PortalProvider, useButton } from "react-aria";
const tabItems = [
  {
    key: "overview",
    label: "Overview",
    content: "Overlay dismissal now respects the local portal scope."
  },
  {
    key: "parity",
    label: "Parity",
    content: "Collection composition is the main remaining styled-layer nuance."
  },
  {
    key: "testing",
    label: "Testing",
    content: "This page is intended to become a Playwright and axe target."
  }
];
const selectItems = [
  { id: "alpha", label: "Alpha" },
  { id: "bravo", label: "Bravo" },
  { id: "charlie", label: "Charlie" }
];
function ComparisonIsland(props) {
  const overlayRootRef = useRef(null);
  return /* @__PURE__ */ jsxs("div", { className: "comparison-island", children: [
    /* @__PURE__ */ jsx(
      UNSAFE_PortalProvider,
      {
        getContainer: () => overlayRootRef.current ?? document.body,
        children: renderLayer(props)
      }
    ),
    /* @__PURE__ */ jsx("div", { ref: overlayRootRef, className: "comparison-overlay-root" })
  ] });
}
function renderLayer({ componentSlug, layer }) {
  if (layer === "styled") {
    return renderStyled(componentSlug);
  }
  if (layer === "components") {
    return renderComponents(componentSlug);
  }
  if (layer === "headless") {
    return renderHeadless(componentSlug);
  }
  return /* @__PURE__ */ jsx("div", { className: "comparison-empty-state", children: "This layer is tracked in the manifest but not rendered yet." });
}
function renderStyled(componentSlug) {
  switch (componentSlug) {
    case "provider":
      return /* @__PURE__ */ jsx(
        SpectrumProvider,
        {
          theme: defaultTheme,
          colorScheme: "dark",
          UNSAFE_style: providerShellStyle,
          children: /* @__PURE__ */ jsxs("div", { className: "comparison-provider-stack", children: [
            /* @__PURE__ */ jsx("div", { className: "comparison-provider-caption", children: "Outer provider: dark / medium scale" }),
            /* @__PURE__ */ jsx(SpectrumButton, { variant: "primary", children: "Inherited Action" }),
            /* @__PURE__ */ jsxs(
              SpectrumProvider,
              {
                theme: defaultTheme,
                colorScheme: "light",
                UNSAFE_style: nestedProviderStyle,
                children: [
                  /* @__PURE__ */ jsx("div", { className: "comparison-provider-caption", children: "Nested provider: local light override" }),
                  /* @__PURE__ */ jsx(SpectrumButton, { variant: "accent", children: "Nested Override" })
                ]
              }
            )
          ] })
        }
      );
    case "button":
      return /* @__PURE__ */ jsx(
        SpectrumProvider,
        {
          theme: defaultTheme,
          colorScheme: "dark",
          UNSAFE_style: providerShellStyle,
          children: /* @__PURE__ */ jsxs("div", { className: "comparison-button-row", children: [
            /* @__PURE__ */ jsx(SpectrumButton, { variant: "primary", children: "Primary" }),
            /* @__PURE__ */ jsx(SpectrumButton, { variant: "accent", children: "Accent" }),
            /* @__PURE__ */ jsx(SpectrumButton, { variant: "secondary", children: "Secondary" })
          ] })
        }
      );
    case "tabs":
      return /* @__PURE__ */ jsx(
        SpectrumProvider,
        {
          theme: defaultTheme,
          colorScheme: "dark",
          UNSAFE_style: providerShellStyle,
          children: /* @__PURE__ */ jsxs(SpectrumTabs, { "aria-label": "React Spectrum tabs", maxWidth: 360, children: [
            /* @__PURE__ */ jsx(SpectrumTabList, { children: tabItems.map((item) => /* @__PURE__ */ jsx(SpectrumItem, { children: item.label }, item.key)) }),
            /* @__PURE__ */ jsx(SpectrumTabPanels, { children: tabItems.map((item) => /* @__PURE__ */ jsx(SpectrumItem, { children: item.content }, item.key)) })
          ] })
        }
      );
    case "textfield":
      return /* @__PURE__ */ jsx(ReactTextFieldDemo, {});
    case "select":
      return /* @__PURE__ */ jsx(ReactSelectDemo, {});
    case "checkbox":
      return /* @__PURE__ */ jsx(RACCheckbox, { className: "comparison-check", children: "Enable alerts" });
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
      return /* @__PURE__ */ jsx("div", { className: "comparison-empty-state", children: "React Aria Components 1.15.1 does not expose Toast." });
    default:
      return /* @__PURE__ */ jsx("div", { className: "comparison-empty-state", children: "No styled React Spectrum demo is wired for this component yet." });
  }
}
function ReactTextFieldDemo() {
  return /* @__PURE__ */ jsxs(RACTextField, { className: "comparison-form-control", defaultValue: "Quarterly report", children: [
    /* @__PURE__ */ jsx(RACLabel, { children: "Name" }),
    /* @__PURE__ */ jsx(RACInput, {})
  ] });
}
function ReactSelectDemo() {
  return /* @__PURE__ */ jsxs(RACSelect, { className: "comparison-form-control", defaultSelectedKey: "bravo", children: [
    /* @__PURE__ */ jsx(RACLabel, { children: "Channel" }),
    /* @__PURE__ */ jsx(RACButton, { className: "comparison-field-button", children: /* @__PURE__ */ jsx(RACSelectValue, {}) }),
    /* @__PURE__ */ jsx(RACPopover, { className: "comparison-popover", children: /* @__PURE__ */ jsx(RACListBox, { className: "comparison-listbox", children: selectItems.map((item) => /* @__PURE__ */ jsx(RACListBoxItem, { id: item.id, className: "comparison-listbox-item", children: item.label }, item.id)) }) })
  ] });
}
function ReactDialogDemo() {
  return /* @__PURE__ */ jsx("div", { className: "comparison-spectrum-skin", children: /* @__PURE__ */ jsxs(RACDialogTrigger, { children: [
    /* @__PURE__ */ jsx(RACButton, { className: "comparison-spectrum-Button", "data-variant": "primary", "data-style": "outline", children: "Open Dialog" }),
    /* @__PURE__ */ jsx(RACModalOverlay, { className: "comparison-dialog-underlay", isDismissable: true, children: /* @__PURE__ */ jsx("div", { className: "comparison-dialog-positioner", children: /* @__PURE__ */ jsx(RACModal, { className: "comparison-dialog-modal", children: /* @__PURE__ */ jsx(RACDialog, { className: "comparison-dialog-surface comparison-spectrum-Dialog", children: ({ close }) => /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(RACHeading, { slot: "title", className: "comparison-spectrum-Dialog-title", children: "Review Changes" }),
      /* @__PURE__ */ jsx("p", { className: "comparison-spectrum-Dialog-body", children: "Dialog focus and dismissal are compared from this island." }),
      /* @__PURE__ */ jsx(RACButton, { className: "comparison-spectrum-Dialog-closeButton", "aria-label": "Close dialog", onPress: close, children: /* @__PURE__ */ jsx("svg", { "aria-hidden": "true", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("path", { d: "M18 6 6 18" }),
        /* @__PURE__ */ jsx("path", { d: "m6 6 12 12" })
      ] }) }) })
    ] }) }) }) }) })
  ] }) });
}
function ReactRadioDemo() {
  return /* @__PURE__ */ jsxs(RACRadioGroup, { className: "comparison-form-control", defaultValue: "compact", "aria-label": "Density", children: [
    /* @__PURE__ */ jsx(RACLabel, { children: "Density" }),
    /* @__PURE__ */ jsx(RACRadio, { value: "compact", className: "comparison-check", children: "Compact" }),
    /* @__PURE__ */ jsx(RACRadio, { value: "comfortable", className: "comparison-check", children: "Comfortable" })
  ] });
}
function ReactDatePickerDemo() {
  const [value, setValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  return /* @__PURE__ */ jsx("div", { className: "comparison-stack", "data-comparison-value": value, "data-comparison-open": String(isOpen), children: /* @__PURE__ */ jsxs(RACDatePicker, { className: "comparison-form-control", "aria-label": "Due date", onChange: (nextValue) => setValue(nextValue == null ? "" : String(nextValue)), onOpenChange: setIsOpen, children: [
    /* @__PURE__ */ jsx(RACLabel, { children: "Due date" }),
    /* @__PURE__ */ jsxs(RACGroup, { children: [
      /* @__PURE__ */ jsx(RACDateInput, { className: "comparison-date-input", children: (segment) => /* @__PURE__ */ jsx(RACDateSegment, { segment }) }),
      /* @__PURE__ */ jsx(RACButton, { className: "comparison-field-button", children: "Calendar" })
    ] }),
    /* @__PURE__ */ jsx(RACPopover, { className: "comparison-popover", children: /* @__PURE__ */ jsx(RACDialog, { className: "comparison-popover-dialog", children: /* @__PURE__ */ jsxs(RACCalendar, { children: [
      /* @__PURE__ */ jsxs("header", { children: [
        /* @__PURE__ */ jsx(RACButton, { slot: "previous", className: "comparison-rac-button", children: "Previous" }),
        /* @__PURE__ */ jsx(RACHeading, { className: "comparison-popover-title" }),
        /* @__PURE__ */ jsx(RACButton, { slot: "next", className: "comparison-rac-button", children: "Next" })
      ] }),
      /* @__PURE__ */ jsx(RACCalendarGrid, { children: (date) => /* @__PURE__ */ jsx(RACCalendarCell, { date }) })
    ] }) }) })
  ] }) });
}
function ReactSearchFieldDemo() {
  const [value, setValue] = useState("status");
  const [clearCount, setClearCount] = useState(0);
  return /* @__PURE__ */ jsx("div", { className: "comparison-stack", "data-comparison-input-value": value, "data-comparison-clear-count": String(clearCount), children: /* @__PURE__ */ jsxs(RACSearchField, { className: "comparison-form-control", defaultValue: "status", onChange: setValue, onClear: () => {
    setValue("");
    setClearCount((count) => count + 1);
  }, children: [
    /* @__PURE__ */ jsx(RACLabel, { children: "Search" }),
    /* @__PURE__ */ jsx(RACInput, {}),
    /* @__PURE__ */ jsx(RACButton, { className: "comparison-rac-button", children: "Clear search" })
  ] }) });
}
function ReactTooltipDemo() {
  return /* @__PURE__ */ jsxs(RACTooltipTrigger, { isOpen: true, children: [
    /* @__PURE__ */ jsx(RACButton, { className: "comparison-rac-button", children: "Inspect" }),
    /* @__PURE__ */ jsx(RACTooltip, { className: "comparison-tooltip", children: "Tooltip content" })
  ] });
}
function ReactToolbarDemo() {
  const [boldPressed, setBoldPressed] = useState(false);
  const [actionCount, setActionCount] = useState(0);
  return /* @__PURE__ */ jsx("div", { className: "comparison-stack", "data-comparison-pressed": String(boldPressed), "data-comparison-action-count": String(actionCount), children: /* @__PURE__ */ jsxs(RACToolbar, { className: "comparison-toolbar", "aria-label": "Formatting tools", children: [
    /* @__PURE__ */ jsx(RACToggleButton, { className: "comparison-rac-button", isSelected: boldPressed, onChange: (selected) => {
      setBoldPressed(selected);
      setActionCount((count) => count + 1);
    }, children: "Bold" }),
    /* @__PURE__ */ jsx(RACButton, { className: "comparison-rac-button", children: "Italic" })
  ] }) });
}
function renderComponents(componentSlug) {
  switch (componentSlug) {
    case "button":
      return /* @__PURE__ */ jsxs("div", { className: "comparison-stack", children: [
        /* @__PURE__ */ jsx(RACButton, { className: "comparison-rac-button", children: "Component Button" }),
        /* @__PURE__ */ jsx(
          RACButton,
          {
            isDisabled: true,
            className: "comparison-rac-button comparison-rac-button--muted",
            children: "Disabled by props"
          }
        )
      ] });
    case "popover":
      return /* @__PURE__ */ jsx("div", { className: "comparison-stack", children: /* @__PURE__ */ jsxs(RACDialogTrigger, { children: [
        /* @__PURE__ */ jsx(RACButton, { className: "comparison-rac-button", children: "Open Popover" }),
        /* @__PURE__ */ jsx(RACPopover, { className: "comparison-popover", children: /* @__PURE__ */ jsxs(
          RACDialog,
          {
            "aria-label": "Quick audit note",
            className: "comparison-popover-dialog",
            children: [
              /* @__PURE__ */ jsx(RACHeading, { slot: "title", className: "comparison-popover-title", children: "Confirm Action" }),
              /* @__PURE__ */ jsx("p", { children: "Outside press and escape should dismiss this overlay without escaping its local comparison root." })
            ]
          }
        ) })
      ] }) });
    case "tabs":
      return /* @__PURE__ */ jsxs(RACTabs, { className: "comparison-rac-tabs", "aria-label": "React Aria tabs", children: [
        /* @__PURE__ */ jsx(RACTabList, { className: "comparison-rac-tab-list", children: tabItems.map((item) => /* @__PURE__ */ jsx(
          RACTab,
          {
            id: item.key,
            className: "comparison-rac-tab",
            children: item.label
          },
          item.key
        )) }),
        tabItems.map((item) => /* @__PURE__ */ jsx(
          RACTabPanel,
          {
            id: item.key,
            className: "comparison-tabs-panel",
            children: item.content
          },
          item.key
        ))
      ] });
    default:
      return /* @__PURE__ */ jsx("div", { className: "comparison-empty-state", children: "No component-layer React demo is wired for this component yet." });
  }
}
function renderHeadless(componentSlug) {
  switch (componentSlug) {
    case "button":
      return /* @__PURE__ */ jsx(ReactHeadlessButtonDemo, {});
    default:
      return /* @__PURE__ */ jsx("div", { className: "comparison-empty-state", children: "No headless React demo is wired for this component yet." });
  }
}
function ReactHeadlessButtonDemo() {
  const ref = useRef(null);
  const [pressCount, setPressCount] = useState(0);
  const { buttonProps, isPressed } = useButton(
    {
      onPress: () => setPressCount((count) => count + 1),
      "aria-label": "Headless action"
    },
    ref
  );
  const label = useMemo(() => {
    if (isPressed) {
      return "Pressed";
    }
    return `Pressed ${pressCount} times`;
  }, [isPressed, pressCount]);
  return /* @__PURE__ */ jsxs("div", { className: "comparison-headless-stack", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        ...buttonProps,
        ref,
        type: "button",
        className: "comparison-headless-button",
        children: label
      }
    ),
    /* @__PURE__ */ jsx("p", { className: "comparison-helper-copy", children: "This uses the raw `useButton` hook rather than a pre-wired component." })
  ] });
}
const providerShellStyle = {
  padding: 20,
  borderRadius: 18,
  background: "linear-gradient(180deg, rgba(7, 14, 22, 0.92), rgba(8, 22, 38, 0.78))"
};
const nestedProviderStyle = {
  padding: 16,
  marginTop: 16,
  borderRadius: 16
};
export {
  ComparisonIsland as default
};
