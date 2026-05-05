import h from "solid-js/h";
import { createSignal } from "solid-js";
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
import type { ComparisonLayerId, ComparisonSlug } from "@comparison/data/comparison-manifest";
import {
  comparisonReferenceDataset,
  comparisonTabItems as tabItems,
  getComparisonReferenceKind,
  type ComparisonFramework,
  type ComparisonReferenceKind,
} from "@comparison/data/comparison-contract";
import { solidStyledFixtures } from "./fixtures/styled";

interface ComparisonIslandProps {
  componentSlug: ComparisonSlug;
  layer: ComparisonLayerId;
}

type TabItem = (typeof tabItems)[number];

export default function ComparisonIsland(props: ComparisonIslandProps) {
  let overlayRoot: HTMLDivElement | undefined;

  return h(
    "div",
    { class: "comparison-island" },
    h(UNSAFE_PortalProvider, { getContainer: () => overlayRoot ?? null }, renderLayer(props)),
    h("div", {
      class: "comparison-overlay-root",
      ref: (element: HTMLDivElement) => {
        overlayRoot = element;
      },
    }),
  )();
}

function renderLayer(props: ComparisonIslandProps) {
  let rendered;
  if (props.layer === "styled") {
    rendered = renderStyled(props.componentSlug);
  } else if (props.layer === "components") {
    rendered = renderComponents(props.componentSlug);
  } else if (props.layer === "headless") {
    rendered = renderHeadless(props.componentSlug);
  } else {
    rendered = emptyState("This layer is tracked in the manifest but not rendered yet.");
  }

  return comparisonReferenceFrame(
    {
      componentSlug: props.componentSlug,
      framework: "solid",
      layer: props.layer,
      reference: getComparisonReferenceKind("solid", props.layer, props.componentSlug),
    },
    rendered,
  );
}

function comparisonReferenceFrame(
  input: {
    componentSlug: ComparisonSlug;
    framework: ComparisonFramework;
    layer: ComparisonLayerId;
    reference: ComparisonReferenceKind;
  },
  children: ReturnType<typeof h>,
) {
  return h(
    "div",
    {
      class: "comparison-reference-frame",
      ...comparisonReferenceDataset(input),
    },
    h("div", { class: "comparison-reference-canvas" }, children),
  );
}

function renderStyled(componentSlug: ComparisonSlug) {
  return (
    solidStyledFixtures[componentSlug]?.() ??
    emptyState(
      "Styled Solid Spectrum implementation is missing. Start from the React Spectrum S2 source and implement this component in solid-spectrum.",
    )
  );
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
              h("div", { class: "comparison-popover-title" }, "Confirm Action"),
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
        h(HeadlessTabList, { class: "comparison-rac-tab-list" }, (item: TabItem) =>
          h(HeadlessTab, { id: item.id, class: "comparison-rac-tab" }, item.label),
        ),
        h(
          HeadlessTabPanels,
          { class: "comparison-tab-panels" },
          tabItems.map((item) =>
            h(HeadlessTabPanel, { id: item.id, class: "comparison-tabs-panel" }, item.content),
          ),
        ),
      );
    default:
      return emptyState("No component-layer Solid demo is wired for this component yet.");
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
