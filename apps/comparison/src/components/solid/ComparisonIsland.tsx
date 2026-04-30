import h from "solid-js/h";
import { createMemo, createSignal, onCleanup, onMount } from "solid-js";
import { hc, renderProp } from "./solid-h";
import { Provider as SilapseProvider } from "@proyecto-viviana/silapse";
import {
  ButtonGroup as SilapseButtonGroup,
  Button as SilapseButton,
  Checkbox,
  Dialog,
  Radio,
  RadioGroup,
  SearchField,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  ToastProvider,
  ToastRegion,
  Toolbar,
  Tooltip,
  TooltipTrigger,
  ToggleButton,
  addToast,
  globalToastQueue,
} from "@proyecto-viviana/silapse";
import {
  Button as HeadlessButton,
  DialogTrigger as HeadlessDialogTrigger,
  Popover as HeadlessPopover,
  PopoverTrigger as HeadlessPopoverTrigger,
  Calendar as HeadlessCalendar,
  CalendarButton as HeadlessCalendarButton,
  CalendarCell as HeadlessCalendarCell,
  CalendarGrid as HeadlessCalendarGrid,
  CalendarHeading as HeadlessCalendarHeading,
  DateInput as HeadlessDateInput,
  DatePicker as HeadlessDatePicker,
  DatePickerButton as HeadlessDatePickerButton,
  DatePickerContent as HeadlessDatePickerContent,
  DatePickerLabel as HeadlessDatePickerLabel,
  DateSegment as HeadlessDateSegment,
  Input as HeadlessInput,
  Label as HeadlessLabel,
  Modal as HeadlessModal,
  ModalOverlay as HeadlessModalOverlay,
  Select as HeadlessSelect,
  SelectListBox as HeadlessSelectListBox,
  SelectOption as HeadlessSelectOption,
  SelectTrigger as HeadlessSelectTrigger,
  SelectValue as HeadlessSelectValue,
  Tab as HeadlessTab,
  TabList as HeadlessTabList,
  TabPanels as HeadlessTabPanels,
  TabPanel as HeadlessTabPanel,
  Tabs as HeadlessTabs,
  TextField as HeadlessTextField,
  ToggleButton as HeadlessToggleButton,
} from "@proyecto-viviana/solidaria-components";
import {
  createButton,
  UNSAFE_PortalProvider,
} from "@proyecto-viviana/solidaria";
import type {
  ComparisonLayerId,
  ComparisonSlug,
} from "@comparison/data/comparison-manifest";
import {
  comparisonActionItems as actionItems,
  comparisonReferenceDataset,
  comparisonSelectItems as selectItems,
  comparisonSpectrumSkin,
  comparisonTabItems as tabItems,
  getComparisonReferenceKind,
  type ComparisonFramework,
  type ComparisonReferenceKind,
} from "@comparison/data/comparison-contract";

interface ComparisonIslandProps {
  componentSlug: ComparisonSlug;
  layer: ComparisonLayerId;
}

type TabItem = (typeof tabItems)[number];
type ActionItem = (typeof actionItems)[number];

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

  return comparisonReferenceFrame({
    componentSlug: props.componentSlug,
    framework: "solid",
    layer: props.layer,
    reference: getComparisonReferenceKind("solid", props.layer, props.componentSlug),
  }, rendered);
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
      return h(SolidariaSpectrumButtonDemo, {});
    case "actionbutton":
      return h(SolidariaSpectrumActionButtonDemo, {});
    case "actionbuttongroup":
      return h(SolidariaSpectrumActionButtonGroupDemo, {});
    case "buttongroup":
      return h(SolidariaSpectrumButtonGroupDemo, {});
    case "togglebutton":
      return h(SolidariaSpectrumToggleButtonDemo, {});
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
    case "textfield":
      return h(SolidariaSpectrumTextFieldDemo, {});
    case "select":
      return h(SolidariaSpectrumSelectDemo, {});
    case "checkbox":
      return h(SolidCheckboxDemo, {});
    case "dialog":
      return h(SolidDialogDemo, {});
    case "radio":
      return h(SolidRadioDemo, {});
    case "datepicker":
      return h(SolidDatePickerDemo, {});
    case "searchfield":
      return h(SolidSearchFieldDemo, {});
    case "tooltip":
      return h(SolidTooltipDemo, {});
    case "toolbar":
      return h(SolidToolbarDemo, {});
    case "toast":
      return h(SolidToastDemo, {});
    default:
      return emptyState("No styled Solid demo is wired for this component yet.");
  }
}

function SolidDialogDemo() {
  const [isOpen, setIsOpen] = createSignal(false);
  const [focusReturned, setFocusReturned] = createSignal(false);
  const updateOpen = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setFocusReturned(false);
    }
  };

  return hc(
    "div",
    {
      class: `${comparisonSpectrumSkin.rootClass} comparison-stack`,
      get "data-comparison-open"() {
        return String(isOpen());
      },
      get "data-comparison-focus-returned"() {
        return String(focusReturned());
      },
    },
    [
      hc(
        HeadlessDialogTrigger,
        {
          onOpenChange: updateOpen,
        },
        [
          hc(
            SilapseButton,
            {
              variant: "primary",
              buttonStyle: "fill",
              class: `${comparisonSpectrumSkin.buttonClass} comparison-spectrum-Button--trigger`,
              "data-variant": "primary",
              "data-style": "fill",
              onFocus: () => {
                if (!isOpen()) {
                  setFocusReturned(true);
                }
              },
            },
            [h("span", { class: comparisonSpectrumSkin.labelClass, "data-slot": "label" }, "Open Dialog")],
          ),
          hc(
            HeadlessModalOverlay,
            {
              isDismissable: true,
              class: "comparison-dialog-underlay",
            },
            [
              hc(
                "div",
                { class: "comparison-dialog-positioner" },
                [
                  hc(
                    HeadlessModal,
                    { class: "comparison-dialog-modal" },
                    [
                      hc(
                        Dialog,
                        {
                          title: "Review Changes",
                          isDismissable: true,
                          class: `comparison-dialog-surface ${comparisonSpectrumSkin.dialogClass}`,
                        },
                        ["Dialog focus and dismissal are compared from this island."],
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  );
}

function SolidDatePickerDemo() {
  let root: HTMLDivElement | undefined;
  const [value, setValue] = createSignal("");
  const [open, setOpen] = createSignal(false);

  onMount(() => {
    const updateOpen = () => {
      setOpen(root?.querySelector("[data-open]") != null);
    };

    updateOpen();
    const observer = new MutationObserver(updateOpen);
    if (root) {
      observer.observe(root, {
        attributes: true,
        childList: true,
        subtree: true,
      });
    }
    onCleanup(() => observer.disconnect());
  });

  return hc(
    "div",
    {
      class: "comparison-spectrum-skin comparison-stack",
      ref: (element: HTMLDivElement) => {
        root = element;
      },
      get "data-comparison-value"() {
        return value();
      },
      get "data-comparison-open"() {
        return String(open());
      },
    },
    [
      hc(
        HeadlessDatePicker,
        {
          class: "comparison-form-control comparison-datepicker-root",
          "aria-label": "Due date",
          onChange: (nextValue: unknown) => {
            setValue(nextValue == null ? "" : String(nextValue));
          },
        },
        [
          hc(
            HeadlessDatePickerLabel,
            { class: "comparison-spectrum-Field-label", "data-slot": "label" },
            ["Due date"],
          ),
          hc(
            "div",
            { class: "comparison-datepicker-group" },
            [
              hc(
                HeadlessDateInput,
                {
                  class: "comparison-date-input",
                  children: renderProp((segment: unknown) => h(HeadlessDateSegment, { segment })),
                },
              ),
              hc(
                HeadlessDatePickerButton,
                {
                  class: "comparison-field-button",
                  "aria-label": "Calendar",
                },
                [hCalendarIcon()],
              ),
            ],
          ),
          hc(
            HeadlessDatePickerContent,
            { class: "comparison-popover comparison-datepicker-popover" },
            [
              hc(
                "div",
                { class: "comparison-popover-dialog" },
                [
                  hc(
                    HeadlessCalendar,
                    {},
                    [
                      hc(
                        "header",
                        { class: "comparison-datepicker-header" },
                        [
                          hc(
                            HeadlessCalendarButton,
                            {
                              slot: "previous",
                              class: "comparison-rac-button comparison-calendar-nav-button",
                              "aria-label": "Previous",
                            },
                            [hChevronIcon("left")],
                          ),
                          hc(HeadlessCalendarHeading, { class: "comparison-popover-title" }),
                          hc(
                            HeadlessCalendarButton,
                            {
                              slot: "next",
                              class: "comparison-rac-button comparison-calendar-nav-button",
                              "aria-label": "Next",
                            },
                            [hChevronIcon("right")],
                          ),
                        ],
                      ),
                      hc(
                        HeadlessCalendarGrid,
                        {
                          children: renderProp((date: unknown) => h(HeadlessCalendarCell, { date })),
                        },
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  );
}

function hCalendarIcon() {
  return h(
    "svg",
    {
      "aria-hidden": "true",
      fill: "none",
      focusable: "false",
      viewBox: "0 0 18 18",
    },
    [
      h("path", {
        d: "M5 2.25v2.5M13 2.25v2.5M3.25 6.75h11.5M4 3.75h10A1.25 1.25 0 0 1 15.25 5v9A1.25 1.25 0 0 1 14 15.25H4A1.25 1.25 0 0 1 2.75 14V5A1.25 1.25 0 0 1 4 3.75Z",
        stroke: "currentColor",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "1.5",
      }),
    ],
  );
}

function hChevronIcon(direction: "left" | "right") {
  const path = direction === "left" ? "M11.25 3.75 6 9l5.25 5.25" : "M6.75 3.75 12 9l-5.25 5.25";

  return h(
    "svg",
    {
      "aria-hidden": "true",
      fill: "none",
      focusable: "false",
      viewBox: "0 0 18 18",
    },
    [
      h("path", {
        d: path,
        stroke: "currentColor",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "1.75",
      }),
    ],
  );
}

function SolidSearchFieldDemo() {
  const [value, setValue] = createSignal("status");
  const [clearCount, setClearCount] = createSignal(0);

  return hc(
    "div",
    {
      class: "comparison-stack",
      get "data-comparison-input-value"() {
        return value();
      },
      get "data-comparison-clear-count"() {
        return String(clearCount());
      },
    },
    [
      hc(SearchField, {
        label: "Search",
        defaultValue: "status",
        onChange: setValue,
        onInput: (event: InputEvent) => {
          setValue((event.currentTarget as HTMLInputElement).value);
        },
        onClear: () => {
          setValue("");
          setClearCount((count) => count + 1);
        },
      }),
    ],
  );
}

function SolidTooltipDemo() {
  const [isOpen, setIsOpen] = createSignal(false);
  const [focusReturned, setFocusReturned] = createSignal(false);

  return hc(
    "div",
    {
      class: "comparison-stack",
      get "data-comparison-open"() {
        return String(isOpen());
      },
      get "data-comparison-focus-returned"() {
        return String(focusReturned());
      },
    },
    [
      hc(
        TooltipTrigger,
        {
          delay: 0,
          onOpenChange: (open: boolean) => setIsOpen(open),
        },
        [
          hc(
            SilapseButton,
            {
              variant: "secondary",
              onFocus: () => setFocusReturned(false),
              onBlur: () => setFocusReturned(true),
            },
            ["Inspect"],
          ),
          hc(Tooltip, {}, ["Tooltip content"]),
        ],
      ),
    ],
  );
}

function SolidToolbarDemo() {
  const [boldPressed, setBoldPressed] = createSignal(false);
  const [actionCount, setActionCount] = createSignal(0);

  return hc(
    "div",
    {
      class: "comparison-stack",
      get "data-comparison-pressed"() {
        return String(boldPressed());
      },
      get "data-comparison-action-count"() {
        return String(actionCount());
      },
    },
    [
      hc(
        Toolbar,
        { "aria-label": "Formatting tools" },
        renderProp(() => [
          hc(
            ToggleButton,
            {
              "aria-label": "Bold",
              get isSelected() {
                return boldPressed();
              },
              onChange: (pressed: boolean) => {
                setBoldPressed(pressed);
                setActionCount((count) => count + 1);
              },
            },
            ["Bold"],
          ),
          hc(
            SilapseButton,
            {
              variant: "secondary",
              buttonStyle: "outline",
              onPress: (_event: unknown) => setActionCount((count) => count + 1),
            },
            ["Italic"],
          ),
        ]),
      ),
    ],
  );
}

function SolidToastDemo() {
  const [visibleCount, setVisibleCount] = createSignal(0);
  const [shownCount, setShownCount] = createSignal(0);
  const toastKeys: string[] = [];

  const clearToasts = () => {
    for (const key of toastKeys.splice(0)) {
      globalToastQueue.close(key);
      globalToastQueue.remove(key);
    }
  };

  onMount(() => {
    const unsubscribe = globalToastQueue.subscribe((toasts) => {
      setVisibleCount(toasts.length);
    });
    onCleanup(unsubscribe);
  });
  onCleanup(clearToasts);

  const showToast = () => {
    const count = shownCount() + 1;
    setShownCount(count);
    const key = addToast({
      title: `Saved successfully ${count}`,
      description: "Toast region renders inside the comparison island.",
      type: "success",
    }, { timeout: 0 });
    toastKeys.push(key);
  };

  const toastRegion = createMemo(() => (
    visibleCount() > 0
      ? hc(
        ToastProvider,
        { useGlobalQueue: true },
        [hc(ToastRegion, { portal: false, placement: "bottom-start" })],
      )
      : null
  ));

  return hc(
    "div",
    {
      class: "comparison-stack",
      get "data-comparison-queued-count"() {
        return String(shownCount());
      },
      get "data-comparison-visible-count"() {
        return String(visibleCount());
      },
    },
    [
      hc("button", { type: "button", class: "comparison-rac-button", onClick: showToast }, ["Show toast"]),
      toastRegion,
    ],
  );
}

function SolidariaSpectrumButtonDemo() {
  const [actionCount, setActionCount] = createSignal(0);

  return hc(
    "div",
    {
      class: comparisonSpectrumSkin.rootClass,
      get "data-comparison-action-count"() {
        return String(actionCount());
      },
    },
    [hc(
      "div",
      { class: "comparison-button-row" },
      [
        hSpectrumButton({
          variant: "primary",
          style: "outline",
          onPress: (_event: unknown) => setActionCount((count) => count + 1),
        }, "Primary"),
        hSpectrumButton({ variant: "accent", style: "fill" }, "Accent"),
        hSpectrumButton({ variant: "secondary", style: "outline" }, "Secondary"),
      ],
    )],
  );
}

function SolidariaSpectrumActionButtonDemo() {
  const [actionCount, setActionCount] = createSignal(0);

  return hc(
    "div",
    {
      class: comparisonSpectrumSkin.rootClass,
      get "data-comparison-action-count"() {
        return String(actionCount());
      },
    },
    [
      hSpectrumActionButton({
        onPress: (_event: unknown) => setActionCount((count) => count + 1),
      }, "Inspect"),
    ],
  );
}

function SolidariaSpectrumActionButtonGroupDemo() {
  const [selectedKeys, setSelectedKeys] = createSignal<Set<string>>(new Set(["bold"]));
  const [actionKey, setActionKey] = createSignal("");
  const selectedKeyText = createMemo(() => Array.from(selectedKeys()).join(","));
  const toggleKey = (key: string) => {
    setActionKey(key);
    setSelectedKeys(new Set([key]));
  };

  return hc(
    "div",
    {
      class: comparisonSpectrumSkin.rootClass,
      get "data-comparison-action-key"() {
        return actionKey();
      },
      get "data-comparison-selected-keys"() {
        return selectedKeyText();
      },
    },
    [
      hc(
        "div",
        {
          class: comparisonSpectrumSkin.actionButtonGroupClass,
          "aria-label": "Formatting actions",
        },
        actionItems.map((item: ActionItem) =>
          hc(
            HeadlessButton,
            {
              class: comparisonSpectrumSkin.actionButtonClass,
              get "aria-pressed"() {
                return selectedKeys().has(item.id);
              },
              get "data-selected"() {
                return selectedKeys().has(item.id) ? "" : undefined;
              },
              onPress: (_event: unknown) => toggleKey(item.id),
            },
            [h("span", { class: comparisonSpectrumSkin.labelClass, "data-slot": "label" }, item.label)],
          ),
        ),
      ),
    ],
  );
}

function SolidariaSpectrumButtonGroupDemo() {
  const [actionKey, setActionKey] = createSignal("");

  return hc(
    "div",
    {
      class: comparisonSpectrumSkin.rootClass,
      get "data-comparison-action-key"() {
        return actionKey();
      },
    },
    [
      hc(
        SilapseButtonGroup,
        { class: comparisonSpectrumSkin.buttonGroupClass, "aria-label": "Approval actions" },
        [
          hSpectrumButton({
            variant: "primary",
            style: "outline",
            onPress: (_event: unknown) => setActionKey("save"),
          }, "Save"),
          hSpectrumButton({
            variant: "secondary",
            style: "outline",
            onPress: (_event: unknown) => setActionKey("cancel"),
          }, "Cancel"),
        ],
      ),
    ],
  );
}

function SolidariaSpectrumToggleButtonDemo() {
  const [selected, setSelected] = createSignal(false);

  return hc(
    "div",
    {
      class: comparisonSpectrumSkin.rootClass,
      get "data-comparison-selected"() {
        return String(selected());
      },
    },
    [
      hc(
        HeadlessToggleButton,
        {
          class: comparisonSpectrumSkin.toggleButtonClass,
          "aria-label": "Pin",
          get isSelected() {
            return selected();
          },
          onChange: setSelected,
        },
        [h("span", { class: comparisonSpectrumSkin.labelClass, "data-slot": "label" }, "Pin")],
      ),
    ],
  );
}

function hSpectrumButton(
  props: {
    isDisabled?: boolean;
    variant: "primary" | "accent" | "secondary";
    style: "fill" | "outline";
    onPress?: (event: unknown) => void;
    onFocus?: () => void;
  },
  label: string,
) {
  return hc(
    HeadlessButton,
    {
      isDisabled: props.isDisabled,
      class: comparisonSpectrumSkin.buttonClass,
      "data-variant": props.variant,
      "data-style": props.style,
      onPress: props.onPress,
      onFocus: props.onFocus,
    },
    [h("span", { class: comparisonSpectrumSkin.labelClass, "data-slot": "label" }, label)],
  );
}

function hSpectrumActionButton(
  props: {
    isDisabled?: boolean;
    onPress?: (event: unknown) => void;
  },
  label: string,
) {
  return hc(
    HeadlessButton,
    {
      isDisabled: props.isDisabled,
      class: comparisonSpectrumSkin.actionButtonClass,
      onPress: props.onPress,
    },
    [h("span", { class: comparisonSpectrumSkin.labelClass, "data-slot": "label" }, label)],
  );
}

function SolidariaSpectrumTextFieldDemo() {
  const [value, setValue] = createSignal("Quarterly report");

  return hc(
    "div",
    {
      class: comparisonSpectrumSkin.rootClass,
      get "data-comparison-value"() {
        return value();
      },
    },
    [hc(
      HeadlessTextField,
      {
        class: comparisonSpectrumSkin.fieldRootClass,
        defaultValue: "Quarterly report",
        "aria-label": "Name",
        "data-size": "medium",
        "data-variant": "default",
      },
      [
        h(
          HeadlessLabel,
          {
            for: "solidaria-spectrum-textfield-name",
            class: comparisonSpectrumSkin.fieldLabelClass,
            "data-slot": "label",
          },
          "Name",
        ),
        h(HeadlessInput, {
          id: "solidaria-spectrum-textfield-name",
          class: comparisonSpectrumSkin.fieldInputClass,
          "data-slot": "input",
          onInput: (event: InputEvent) => {
            setValue((event.currentTarget as HTMLInputElement).value);
          },
        }),
      ],
    )],
  );
}

function SolidariaSpectrumSelectDemo() {
  const [selectedKey, setSelectedKey] = createSignal<string | null>("bravo");

  return hc(
    "div",
    {
      class: comparisonSpectrumSkin.rootClass,
      get "data-comparison-selected-key"() {
        return selectedKey() ?? "";
      },
    },
    [hc(
      HeadlessSelect,
      {
        class: comparisonSpectrumSkin.selectRootClass,
        items: selectItems,
        defaultSelectedKey: "bravo",
        onSelectionChange: (key: string | number | null) => {
          setSelectedKey(key == null ? null : String(key));
        },
        getKey: (item: (typeof selectItems)[number]) => item.id,
        getTextValue: (item: (typeof selectItems)[number]) => item.label,
        "data-size": "medium",
        "data-variant": "default",
      },
      [
        hc(
          HeadlessLabel,
          {
            class: comparisonSpectrumSkin.fieldLabelClass,
            "data-slot": "label",
          },
          ["Channel"],
        ),
        hc(
          HeadlessSelectTrigger,
          { class: comparisonSpectrumSkin.selectTriggerClass },
          [h(HeadlessSelectValue, {
            class: comparisonSpectrumSkin.selectValueClass,
            "data-slot": "value",
          })],
        ),
        hc(
          HeadlessSelectListBox,
          { class: comparisonSpectrumSkin.selectListBoxClass },
          renderProp((item: (typeof selectItems)[number]) =>
            h(
              HeadlessSelectOption,
              {
                id: item.id,
                class: comparisonSpectrumSkin.selectOptionClass,
              },
              item.label,
            )),
        ),
      ],
    )],
  );
}

function SolidCheckboxDemo() {
  const [checked, setChecked] = createSignal(true);

  return hc(
    "div",
    {
      class: "comparison-stack",
      get "data-comparison-checked"() {
        return String(checked());
      },
    },
    [
      hc(
        Checkbox,
        {
          defaultSelected: true,
          onChange: setChecked,
        },
        ["Enable alerts"],
      ),
    ],
  );
}

function SolidRadioDemo() {
  const [selectedKey, setSelectedKey] = createSignal("compact");

  return hc(
    "div",
    {
      class: "comparison-stack",
      get "data-comparison-selected-key"() {
        return selectedKey();
      },
    },
    [
      hc(
        RadioGroup,
        {
          label: "Density",
          defaultValue: "compact",
          onChange: setSelectedKey,
        },
        renderProp(() => [
          hc(Radio, { value: "compact" }, ["Compact"]),
          hc(Radio, { value: "comfortable" }, ["Comfortable"]),
        ]),
      ),
    ],
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
  padding: 0,
  background: "transparent",
};

const nestedProviderStyle = {
  padding: "16px",
  margin: "16px 0 0",
  "border-radius": "16px",
};
