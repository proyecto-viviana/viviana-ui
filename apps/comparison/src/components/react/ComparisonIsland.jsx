import React, { useMemo, useRef, useState } from "react";
import { Provider as SpectrumProvider } from "@react-spectrum/provider";
import { Button as SpectrumButton } from "@react-spectrum/button";
import {
  Item as SpectrumItem,
  TabList as SpectrumTabList,
  TabPanels as SpectrumTabPanels,
  Tabs as SpectrumTabs,
} from "@react-spectrum/tabs";
import { theme as defaultTheme } from "@react-spectrum/theme-default";
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

const tabItems = [
  {
    key: "overview",
    label: "Overview",
    content: "Overlay dismissal now respects the local portal scope.",
  },
  {
    key: "parity",
    label: "Parity",
    content:
      "Collection composition is the main remaining styled-layer nuance.",
  },
  {
    key: "testing",
    label: "Testing",
    content: "This page is intended to become a Playwright and axe target.",
  },
];

export default function ComparisonIsland(props) {
  const overlayRootRef = useRef(null);

  return (
    <div className="comparison-island">
      <UNSAFE_PortalProvider
        getContainer={() => overlayRootRef.current ?? document.body}
      >
        {renderLayer(props)}
      </UNSAFE_PortalProvider>
      <div ref={overlayRootRef} className="comparison-overlay-root" />
    </div>
  );
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

  return (
    <div className="comparison-empty-state">
      This layer is tracked in the manifest but not rendered yet.
    </div>
  );
}

function renderStyled(componentSlug) {
  switch (componentSlug) {
    case "provider":
      return (
        <SpectrumProvider
          theme={defaultTheme}
          colorScheme="dark"
          UNSAFE_style={providerShellStyle}
        >
          <div className="comparison-provider-stack">
            <div className="comparison-provider-caption">
              Outer provider: dark / medium scale
            </div>
            <SpectrumButton variant="primary">Inherited Action</SpectrumButton>
            <SpectrumProvider
              theme={defaultTheme}
              colorScheme="light"
              UNSAFE_style={nestedProviderStyle}
            >
              <div className="comparison-provider-caption">
                Nested provider: local light override
              </div>
              <SpectrumButton variant="accent">Nested Override</SpectrumButton>
            </SpectrumProvider>
          </div>
        </SpectrumProvider>
      );
    case "button":
      return (
        <SpectrumProvider
          theme={defaultTheme}
          colorScheme="dark"
          UNSAFE_style={providerShellStyle}
        >
          <div className="comparison-button-row">
            <SpectrumButton variant="primary">Primary</SpectrumButton>
            <SpectrumButton variant="accent">Accent</SpectrumButton>
            <SpectrumButton variant="secondary">Secondary</SpectrumButton>
          </div>
        </SpectrumProvider>
      );
    case "tabs":
      return (
        <SpectrumProvider
          theme={defaultTheme}
          colorScheme="dark"
          UNSAFE_style={providerShellStyle}
        >
          <SpectrumTabs aria-label="React Spectrum tabs" maxWidth={360}>
            <SpectrumTabList>
              {tabItems.map((item) => (
                <SpectrumItem key={item.key}>{item.label}</SpectrumItem>
              ))}
            </SpectrumTabList>
            <SpectrumTabPanels>
              {tabItems.map((item) => (
                <SpectrumItem key={item.key}>{item.content}</SpectrumItem>
              ))}
            </SpectrumTabPanels>
          </SpectrumTabs>
        </SpectrumProvider>
      );
    default:
      return (
        <div className="comparison-empty-state">
          No styled React Spectrum demo is wired for this component yet.
        </div>
      );
  }
}

function renderComponents(componentSlug) {
  switch (componentSlug) {
    case "button":
      return (
        <div className="comparison-stack">
          <RACButton className="comparison-rac-button">
            Component Button
          </RACButton>
          <RACButton
            isDisabled
            className="comparison-rac-button comparison-rac-button--muted"
          >
            Disabled by props
          </RACButton>
        </div>
      );
    case "popover":
      return (
        <div className="comparison-stack">
          <RACDialogTrigger>
            <RACButton className="comparison-rac-button">
              Open Popover
            </RACButton>
            <RACPopover className="comparison-popover">
              <RACDialog
                aria-label="Quick audit note"
                className="comparison-popover-dialog"
              >
                <RACHeading slot="title" className="comparison-popover-title">
                  Confirm Action
                </RACHeading>
                <p>
                  Outside press and escape should dismiss this overlay without
                  escaping its local comparison root.
                </p>
              </RACDialog>
            </RACPopover>
          </RACDialogTrigger>
        </div>
      );
    case "tabs":
      return (
        <RACTabs className="comparison-rac-tabs" aria-label="React Aria tabs">
          <RACTabList className="comparison-rac-tab-list">
            {tabItems.map((item) => (
              <RACTab
                key={item.key}
                id={item.key}
                className="comparison-rac-tab"
              >
                {item.label}
              </RACTab>
            ))}
          </RACTabList>
          {tabItems.map((item) => (
            <RACTabPanel
              key={item.key}
              id={item.key}
              className="comparison-tabs-panel"
            >
              {item.content}
            </RACTabPanel>
          ))}
        </RACTabs>
      );
    default:
      return (
        <div className="comparison-empty-state">
          No component-layer React demo is wired for this component yet.
        </div>
      );
  }
}

function renderHeadless(componentSlug) {
  switch (componentSlug) {
    case "button":
      return <ReactHeadlessButtonDemo />;
    default:
      return (
        <div className="comparison-empty-state">
          No headless React demo is wired for this component yet.
        </div>
      );
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

  return (
    <div className="comparison-headless-stack">
      <button
        {...buttonProps}
        ref={ref}
        type="button"
        className="comparison-headless-button"
      >
        {label}
      </button>
      <p className="comparison-helper-copy">
        This uses the raw `useButton` hook rather than a pre-wired component.
      </p>
    </div>
  );
}

const providerShellStyle = {
  padding: 20,
  borderRadius: 18,
  background:
    "linear-gradient(180deg, rgba(7, 14, 22, 0.92), rgba(8, 22, 38, 0.78))",
};

const nestedProviderStyle = {
  padding: 16,
  marginTop: 16,
  borderRadius: 16,
};
