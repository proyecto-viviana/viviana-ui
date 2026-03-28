import h from "solid-js/h";
import { createSignal } from "solid-js";
import { Provider as SilapseProvider } from "@proyecto-viviana/silapse";
import {
  Button as SilapseButton,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from "@proyecto-viviana/silapse";
import {
  Button as HeadlessButton,
  Popover as HeadlessPopover,
  PopoverTrigger as HeadlessPopoverTrigger,
  Tab as HeadlessTab,
  TabList as HeadlessTabList,
  TabPanels as HeadlessTabPanels,
  TabPanel as HeadlessTabPanel,
  Tabs as HeadlessTabs,
} from "@proyecto-viviana/solidaria-components";
import { createButton, UNSAFE_PortalProvider } from "@proyecto-viviana/solidaria";
import type {
  ComparisonLayerId,
  ComparisonSlug,
} from "@comparison/data/comparison-manifest";

interface ComparisonIslandProps {
  componentSlug: ComparisonSlug;
  layer: ComparisonLayerId;
}

interface TabItem {
  id: string;
  label: string;
  content: string;
}

const tabItems: TabItem[] = [
  {
    id: "overview",
    label: "Overview",
    content: "Overlay dismissal now respects the local portal scope.",
  },
  {
    id: "parity",
    label: "Parity",
    content:
      "Collection composition is the main remaining styled-layer nuance.",
  },
  {
    id: "testing",
    label: "Testing",
    content: "This page is intended to become a Playwright and axe target.",
  },
];

export default function ComparisonIsland(props: ComparisonIslandProps) {
  let overlayRoot: HTMLDivElement | undefined;

  return h(
    "div",
    { class: "comparison-island" },
    h(
      UNSAFE_PortalProvider,
      { getContainer: () => overlayRoot ?? null },
      renderLayer(props),
    ),
    h("div", {
      class: "comparison-overlay-root",
      ref: (element: HTMLDivElement) => {
        overlayRoot = element;
      },
    }),
  )();
}

function renderLayer(props: ComparisonIslandProps) {
  if (props.layer === "styled") {
    return renderStyled(props.componentSlug);
  }

  if (props.layer === "components") {
    return renderComponents(props.componentSlug);
  }

  if (props.layer === "headless") {
    return renderHeadless(props.componentSlug);
  }

  return emptyState("This layer is tracked in the manifest but not rendered yet.");
}

function renderStyled(componentSlug: ComparisonSlug) {
  switch (componentSlug) {
    case "provider":
      return h(
        SilapseProvider,
        { colorScheme: "dark", style: providerShellStyle },
        h(
          "div",
          { class: "comparison-provider-stack" },
          h(
            "div",
            { class: "comparison-provider-caption" },
            "Outer provider: dark / medium scale",
          ),
          h(SilapseButton, { variant: "primary" }, "Inherited Action"),
          h(
            SilapseProvider,
            { colorScheme: "light", style: nestedProviderStyle },
            h(
              "div",
              { class: "comparison-provider-caption" },
              "Nested provider: local light override",
            ),
            h(SilapseButton, { variant: "accent" }, "Nested Override"),
          ),
        ),
      );
    case "button":
      return h(
        SilapseProvider,
        { colorScheme: "dark", style: providerShellStyle },
        h(
          "div",
          { class: "comparison-button-row" },
          h(SilapseButton, { variant: "primary" }, "Primary"),
          h(SilapseButton, { variant: "accent" }, "Accent"),
          h(SilapseButton, { variant: "secondary" }, "Secondary"),
        ),
      );
    case "tabs":
      return h(
        SilapseProvider,
        { colorScheme: "dark", style: providerShellStyle },
        h(
          Tabs,
          {
            items: tabItems,
            getKey: (item: TabItem) => item.id,
            getTextValue: (item: TabItem) => item.label,
          },
          h(
            TabList,
            { "aria-label": "Silapse tabs" },
            (item: TabItem) => h(Tab, { id: item.id }, item.label),
          ),
          tabItems.map((item) => h(TabPanel, { id: item.id }, item.content)),
        ),
      );
    default:
      return emptyState("No styled Solid demo is wired for this component yet.");
  }
}

function renderComponents(componentSlug: ComparisonSlug) {
  switch (componentSlug) {
    case "button":
      return h(
        "div",
        { class: "comparison-stack" },
        h(HeadlessButton, { class: "comparison-rac-button" }, "Component Button"),
        h(
          HeadlessButton,
          {
            isDisabled: true,
            class: "comparison-rac-button comparison-rac-button--muted",
          },
          "Disabled by props",
        ),
      );
    case "popover":
      return h(
        "div",
        { class: "comparison-stack" },
        h(
          HeadlessPopoverTrigger,
          {},
          h(HeadlessButton, { class: "comparison-rac-button" }, "Open Popover"),
          h(
            HeadlessPopover,
            {
              class: "comparison-popover",
              "aria-label": "Quick audit note",
            },
            h(
              "div",
              { class: "comparison-popover-dialog" },
              h(
                "div",
                { class: "comparison-popover-title" },
                "Confirm Action",
              ),
              h(
                "p",
                {},
                "Outside press and escape should dismiss this overlay without escaping its local comparison root.",
              ),
            ),
          ),
        ),
      );
    case "tabs":
      return h(
        HeadlessTabs,
        {
          class: "comparison-rac-tabs",
          "aria-label": "solidaria-components tabs",
          items: tabItems,
          getKey: (item: TabItem) => item.id,
          getTextValue: (item: TabItem) => item.label,
        },
        h(
          HeadlessTabList,
          { class: "comparison-rac-tab-list" },
          (item: TabItem) =>
            h(
              HeadlessTab,
              { id: item.id, class: "comparison-rac-tab" },
              item.label,
            ),
        ),
        h(
          HeadlessTabPanels,
          { class: "comparison-tab-panels" },
          tabItems.map((item) =>
            h(
              HeadlessTabPanel,
              { id: item.id, class: "comparison-tabs-panel" },
              item.content,
            ),
          ),
        ),
      );
    default:
      return emptyState(
        "No component-layer Solid demo is wired for this component yet.",
      );
  }
}

function renderHeadless(componentSlug: ComparisonSlug) {
  switch (componentSlug) {
    case "button":
      return h(SolidHeadlessButtonDemo, {});
    default:
      return emptyState("No headless Solid demo is wired for this component yet.");
  }
}

function SolidHeadlessButtonDemo() {
  const [pressCount, setPressCount] = createSignal(0);
  const button = createButton({
    onPress: () => setPressCount((count) => count + 1),
    "aria-label": "Headless action",
  });

  return h(
    "div",
    { class: "comparison-headless-stack" },
    h(
      "button",
      {
        ...button.buttonProps,
        type: "button",
        class: "comparison-headless-button",
      },
      () => (button.isPressed() ? "Pressed" : `Pressed ${pressCount()} times`),
    ),
    h(
      "p",
      { class: "comparison-helper-copy" },
      "This uses the raw `createButton` primitive rather than a pre-wired component.",
    ),
  );
}

function emptyState(message: string) {
  return h("div", { class: "comparison-empty-state" }, message);
}

const providerShellStyle = {
  padding: "20px",
  "border-radius": "18px",
  background:
    "linear-gradient(180deg, rgba(7, 14, 22, 0.92), rgba(8, 22, 38, 0.78))",
};

const nestedProviderStyle = {
  padding: "16px",
  margin: "16px 0 0",
  "border-radius": "16px",
};
