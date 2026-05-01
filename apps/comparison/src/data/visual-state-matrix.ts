import {
  comparisonEntries,
  officialComparisonEntries,
  type CatalogueSource,
  type ComparisonEntry,
  type ComparisonSlug,
} from "./comparison-manifest";

export type VisualStateKind = "static" | "overlay" | "interaction" | "keyboard";
export type VisualStateSideStatus = "snapshotted" | "asserted" | "planned" | "missing" | "na";
export type PairDiffStatus = "strict" | "asserted" | "planned" | "blocked" | "na";

export interface VisualStateTarget {
  id: string;
  label: string;
  kind: VisualStateKind;
  react: VisualStateSideStatus;
  solid: VisualStateSideStatus;
  pairDiff: PairDiffStatus;
  spec?: string;
  snapshots?: readonly string[];
  note: string;
}

export interface VisualStateCoverage {
  slug: ComparisonSlug;
  title: string;
  source: CatalogueSource;
  states: readonly VisualStateTarget[];
}

function plannedState(entry: ComparisonEntry): VisualStateTarget {
  const reactLive = entry.layers.styled.react === "live";
  const solidLive = entry.layers.styled.solid === "live";

  return {
    id: "styled.default",
    label: "Styled default",
    kind: "static",
    react: reactLive ? "planned" : "missing",
    solid: solidLive ? "planned" : "missing",
    pairDiff: reactLive && solidLive ? "planned" : "blocked",
    note:
      reactLive && solidLive
        ? "Route is live, but committed screenshots and strict pair diff are still missing."
        : "Blocked until both the exact React Spectrum reference and Solid styled implementation are live.",
  };
}

function snapshottedDefaultState(input: {
  slug: string;
  label?: string;
  note?: string;
}): VisualStateTarget {
  const label = input.label ?? "Styled default";

  return {
    id: "styled.default",
    label,
    kind: "static",
    react: "snapshotted",
    solid: "snapshotted",
    pairDiff: "strict",
    spec: "e2e/default-state-visual.spec.ts + e2e/default-state-pair-diff.spec.ts",
    snapshots: [
      `e2e/default-state-visual.spec.ts-snapshots/${input.slug}-default-react-chromium-linux.png`,
      `e2e/default-state-visual.spec.ts-snapshots/${input.slug}-default-solid-chromium-linux.png`,
    ],
    note:
      input.note ??
      "Committed default-state screenshots exist for both sides, and React-vs-Solid pair diff is strict zero-tolerance.",
  };
}

const officialStateOverrides: Record<string, readonly VisualStateTarget[]> = {
  provider: [
    snapshottedDefaultState({
      slug: "provider",
      note: "Provider nesting screenshots are committed for both sides, and React-vs-Solid pair diff is strict zero-tolerance.",
    }),
  ],
  button: [
    snapshottedDefaultState({
      slug: "button",
      note: "Button row screenshots are committed for both sides; default React-vs-Solid pair diff is strict zero-tolerance.",
    }),
    {
      id: "styled.default.control",
      label: "Styled default control",
      kind: "static",
      react: "snapshotted",
      solid: "snapshotted",
      pairDiff: "strict",
      spec: "e2e/button-visual.spec.ts",
      snapshots: [
        "e2e/button-visual.spec.ts-snapshots/button-default-control-react-chromium-linux.png",
        "e2e/button-visual.spec.ts-snapshots/button-default-control-solid-chromium-linux.png",
      ],
      note: "Button-specific screenshots compare the controlled React Spectrum S2 fixture against the Solid S2 skin.",
    },
    {
      id: "styled.hover",
      label: "Hover",
      kind: "interaction",
      react: "snapshotted",
      solid: "snapshotted",
      pairDiff: "strict",
      spec: "e2e/button-visual.spec.ts",
      snapshots: [
        "e2e/button-visual.spec.ts-snapshots/button-hover-react-chromium-linux.png",
        "e2e/button-visual.spec.ts-snapshots/button-hover-solid-chromium-linux.png",
      ],
      note: "Hover is snapshotted on both implementations and compared with zero pixel tolerance.",
    },
    {
      id: "styled.focus-visible",
      label: "Focus-visible",
      kind: "keyboard",
      react: "snapshotted",
      solid: "snapshotted",
      pairDiff: "strict",
      spec: "e2e/button-visual.spec.ts",
      snapshots: [
        "e2e/button-visual.spec.ts-snapshots/button-focus-visible-react-chromium-linux.png",
        "e2e/button-visual.spec.ts-snapshots/button-focus-visible-solid-chromium-linux.png",
      ],
      note: "Keyboard focus ring is snapshotted on the full canvas so the outside outline is not clipped.",
    },
    {
      id: "styled.pressed",
      label: "Pressed",
      kind: "interaction",
      react: "snapshotted",
      solid: "snapshotted",
      pairDiff: "strict",
      spec: "e2e/button-visual.spec.ts",
      snapshots: [
        "e2e/button-visual.spec.ts-snapshots/button-pressed-react-chromium-linux.png",
        "e2e/button-visual.spec.ts-snapshots/button-pressed-solid-chromium-linux.png",
      ],
      note: "Pressed state includes the S2 press-scale transform and is compared with zero pixel tolerance.",
    },
    {
      id: "styled.press-action",
      label: "Press action",
      kind: "interaction",
      react: "asserted",
      solid: "asserted",
      pairDiff: "na",
      spec: "e2e/button-family-contract.spec.ts",
      note: "Pressing the controlled Button increments the same comparison action counter on both stacks.",
    },
    {
      id: "styled.props.controls",
      label: "Interactive prop controls",
      kind: "interaction",
      react: "asserted",
      solid: "asserted",
      pairDiff: "na",
      spec: "e2e/button-visual.spec.ts",
      note: "The docs-style prop controls drive the same children, variant, fillStyle, size, staticColor, disabled, and pending props into both stacks.",
    },
    {
      id: "styled.props.visual-matrix",
      label: "Documented visual prop matrix",
      kind: "static",
      react: "snapshotted",
      solid: "snapshotted",
      pairDiff: "strict",
      spec: "e2e/button-visual.spec.ts",
      note: "Strict screenshots cover all documented Button variants in fill and outline, all sizes, staticColor white/black/auto in fill and outline, disabled, and the immediate pending state.",
    },
    {
      id: "styled.pending.spinner",
      label: "Delayed pending spinner",
      kind: "interaction",
      react: "snapshotted",
      solid: "snapshotted",
      pairDiff: "strict",
      spec: "e2e/button-visual.spec.ts",
      snapshots: [
        "e2e/button-visual.spec.ts-snapshots/button-pending-spinner-react-chromium-linux.png",
        "e2e/button-visual.spec.ts-snapshots/button-pending-spinner-solid-chromium-linux.png",
      ],
      note: "The delayed S2 pending spinner is waited for, snapshotted on both sides, and compared with zero pixel tolerance.",
    },
    {
      id: "styled.pending.behavior",
      label: "Pending focus and press suppression",
      kind: "interaction",
      react: "asserted",
      solid: "asserted",
      pairDiff: "na",
      spec: "e2e/button-family-contract.spec.ts",
      note: "Pending buttons remain focusable and suppress press actions on both React Spectrum and Solid.",
    },
  ],
  actionbutton: [
    snapshottedDefaultState({
      slug: "actionbutton",
      note: "ActionButton default screenshots are committed for both sides; exact computed S2 parity covers light/dark default, size, quiet, static-color, disabled, and pending states.",
    }),
    {
      id: "styled.props.screenshot-matrix",
      label: "Committed screenshot prop matrix",
      kind: "static",
      react: "snapshotted",
      solid: "snapshotted",
      pairDiff: "asserted",
      spec: "e2e/actionbutton-visual.spec.ts",
      note: "Committed React/Solid screenshots cover default, XS/S/M/L/XL sizes, quiet, staticColor black/white/auto, disabled, pending, hover, focus-visible, and pressed states with a dedicated text-raster drift threshold.",
    },
    {
      id: "styled.props.computed-matrix",
      label: "Computed visual prop matrix",
      kind: "static",
      react: "asserted",
      solid: "asserted",
      pairDiff: "na",
      spec: "e2e/actionbutton-visual.spec.ts",
      note: "React Spectrum and Solid Spectrum computed styles are matched across light/dark themes, XS/S/M/L/XL sizes, quiet, staticColor black/white/auto, disabled, and pending states.",
    },
    {
      id: "styled.action.press",
      label: "Press action",
      kind: "interaction",
      react: "asserted",
      solid: "asserted",
      pairDiff: "na",
      spec: "e2e/button-family-contract.spec.ts",
      note: "Press behavior updates the comparison action counter on both React Spectrum and Solid.",
    },
    {
      id: "styled.props.controls",
      label: "Interactive prop controls",
      kind: "interaction",
      react: "asserted",
      solid: "asserted",
      pairDiff: "na",
      spec: "e2e/button-family-contract.spec.ts",
      note: "The docs-style prop controls drive the same children, size, staticColor, quiet, disabled, and pending props into both stacks.",
    },
    {
      id: "styled.pending.behavior",
      label: "Pending focus and press suppression",
      kind: "interaction",
      react: "asserted",
      solid: "asserted",
      pairDiff: "na",
      spec: "e2e/button-family-contract.spec.ts",
      note: "Pending ActionButtons remain focusable and suppress press actions on both React Spectrum and Solid.",
    },
    {
      id: "styled.test-plan",
      label: "Component-specific test plan",
      kind: "static",
      react: "planned",
      solid: "planned",
      pairDiff: "planned",
      note: "Remaining ActionButton plan covers icon/avatar/badge content, light-theme screenshot baselines, and investigation into S2 text raster metrics for stricter screenshot thresholds.",
    },
  ],
  actionbuttongroup: [
    snapshottedDefaultState({
      slug: "actionbuttongroup",
      note: "ActionButtonGroup default screenshots are committed for both sides; density, quiet, orientation, disabled group, keyboard, and action states remain planned.",
    }),
    {
      id: "styled.selection.single-action",
      label: "Single action selection",
      kind: "interaction",
      react: "asserted",
      solid: "asserted",
      pairDiff: "na",
      spec: "e2e/button-family-contract.spec.ts",
      note: "Pressing an action updates both the selected key and action callback data on both stacks.",
    },
  ],
  buttongroup: [
    snapshottedDefaultState({
      slug: "buttongroup",
      note: "ButtonGroup default screenshots are committed for both sides; orientation, alignment, disabled, overflow, and grouped interaction states remain planned.",
    }),
    {
      id: "styled.grouped-actions.press",
      label: "Grouped button actions",
      kind: "interaction",
      react: "asserted",
      solid: "asserted",
      pairDiff: "na",
      spec: "e2e/button-family-contract.spec.ts",
      note: "Grouped Save and Cancel actions update state on both stacks.",
    },
  ],
  togglebutton: [
    snapshottedDefaultState({
      slug: "togglebutton",
      note: "ToggleButton default unselected screenshots are committed for both sides; selected, hover, pressed, focus-visible, emphasized, disabled, and keyboard states remain planned.",
    }),
    {
      id: "styled.toggle.selected",
      label: "Toggle selected state",
      kind: "interaction",
      react: "asserted",
      solid: "asserted",
      pairDiff: "na",
      spec: "e2e/button-family-contract.spec.ts",
      note: "Clicking the ToggleButton toggles selected-state data on both stacks.",
    },
  ],
  tabs: [
    snapshottedDefaultState({
      slug: "tabs",
      note: "Default Tabs screenshots are committed for both sides; keyboard and selected-state matrices remain planned.",
    }),
  ],
  textfield: [
    snapshottedDefaultState({
      slug: "textfield",
      note: "TextField default screenshots are committed for both sides; input, focus, invalid, disabled, and value-change states remain planned.",
    }),
  ],
  checkbox: [
    snapshottedDefaultState({
      slug: "checkbox",
      note: "Checkbox default selected screenshots are committed for both sides; hover, focus, pressed, unchecked, disabled, invalid, and indeterminate states remain planned.",
    }),
  ],
  searchfield: [
    snapshottedDefaultState({
      slug: "searchfield",
      note: "SearchField default-value screenshots are committed for both sides; clear, empty, focus, hover, and keyboard states remain planned.",
    }),
  ],
  tooltip: [
    snapshottedDefaultState({
      slug: "tooltip",
      label: "Default trigger",
      note: "Tooltip trigger screenshots are committed for both sides; open hover/focus tooltip screenshots remain planned.",
    }),
  ],
  dialog: [
    {
      id: "styled.trigger.default",
      label: "Trigger button",
      kind: "static",
      react: "snapshotted",
      solid: "snapshotted",
      pairDiff: "strict",
      spec: "e2e/dialog-visual.spec.ts",
      snapshots: [
        "e2e/dialog-visual.spec.ts-snapshots/dialog-trigger-react-chromium-linux.png",
        "e2e/dialog-visual.spec.ts-snapshots/dialog-trigger-solid-chromium-linux.png",
      ],
      note: "Committed screenshots exist for both triggers; React-vs-Solid pair diff is strict zero-tolerance.",
    },
    {
      id: "styled.dialog.open",
      label: "Open modal surface",
      kind: "overlay",
      react: "snapshotted",
      solid: "snapshotted",
      pairDiff: "strict",
      spec: "e2e/dialog-visual.spec.ts",
      snapshots: [
        "e2e/dialog-visual.spec.ts-snapshots/dialog-surface-react-chromium-linux.png",
        "e2e/dialog-visual.spec.ts-snapshots/dialog-surface-solid-chromium-linux.png",
      ],
      note: "Covers visible open state, viewport placement, occlusion, committed screenshots, and strict zero-tolerance pair diff.",
    },
    {
      id: "styled.dialog.dismiss.outside",
      label: "Outside click dismissal",
      kind: "interaction",
      react: "asserted",
      solid: "asserted",
      pairDiff: "na",
      spec: "e2e/dialog-visual.spec.ts",
      note: "Behavior assertion verifies both React Spectrum and Solid close on outside click.",
    },
    {
      id: "styled.dialog.keyboard.escape-focus",
      label: "Keyboard focus and Escape",
      kind: "keyboard",
      react: "asserted",
      solid: "asserted",
      pairDiff: "na",
      spec: "e2e/dialog-visual.spec.ts",
      note: "Focus containment, Escape dismissal, and Solid focus return are asserted.",
    },
  ],
  datepicker: [
    {
      id: "styled.field.default",
      label: "Closed field",
      kind: "static",
      react: "snapshotted",
      solid: "snapshotted",
      pairDiff: "strict",
      spec: "e2e/datepicker-visual.spec.ts",
      snapshots: [
        "e2e/datepicker-visual.spec.ts-snapshots/datepicker-field-react-chromium-linux.png",
        "e2e/datepicker-visual.spec.ts-snapshots/datepicker-field-solid-chromium-linux.png",
      ],
      note: "Committed screenshots exist for the closed field; React-vs-Solid pair diff is strict zero-tolerance.",
    },
    {
      id: "styled.calendar.open",
      label: "Open calendar popover",
      kind: "overlay",
      react: "snapshotted",
      solid: "snapshotted",
      pairDiff: "strict",
      spec: "e2e/datepicker-visual.spec.ts",
      snapshots: [
        "e2e/datepicker-visual.spec.ts-snapshots/datepicker-popover-react-chromium-linux.png",
        "e2e/datepicker-visual.spec.ts-snapshots/datepicker-popover-solid-chromium-linux.png",
      ],
      note: "Covers open calendar geometry, committed screenshots for both sides, and strict zero-tolerance pair diff.",
    },
    {
      id: "styled.calendar.select-date",
      label: "Select date",
      kind: "interaction",
      react: "asserted",
      solid: "asserted",
      pairDiff: "na",
      spec: "e2e/datepicker-visual.spec.ts",
      note: "Selection closes the popover and updates component value on both sides.",
    },
    {
      id: "styled.calendar.dismiss.outside",
      label: "Outside click dismissal",
      kind: "interaction",
      react: "asserted",
      solid: "asserted",
      pairDiff: "na",
      spec: "e2e/datepicker-visual.spec.ts",
      note: "Outside click dismissal is asserted for both implementations.",
    },
  ],
};

const legacyStateOverrides: Record<string, readonly VisualStateTarget[]> = {
  select: [
    {
      id: "styled.field.default",
      label: "Closed field",
      kind: "static",
      react: "snapshotted",
      solid: "snapshotted",
      pairDiff: "planned",
      spec: "e2e/select-visual.spec.ts",
      snapshots: [
        "e2e/select-visual.spec.ts-snapshots/select-field-react-chromium-linux.png",
        "e2e/select-visual.spec.ts-snapshots/select-field-solid-chromium-linux.png",
      ],
      note: "Legacy Select has committed per-side screenshots; migrate this coverage and pair diff to official Picker.",
    },
    {
      id: "styled.listbox.open",
      label: "Open listbox",
      kind: "overlay",
      react: "snapshotted",
      solid: "snapshotted",
      pairDiff: "planned",
      spec: "e2e/select-visual.spec.ts",
      snapshots: [
        "e2e/select-visual.spec.ts-snapshots/select-listbox-react-chromium-linux.png",
        "e2e/select-visual.spec.ts-snapshots/select-listbox-solid-chromium-linux.png",
      ],
      note: "Legacy Select popup screenshots are committed per side; official Picker remains the pair-diff target.",
    },
    {
      id: "styled.listbox.select-dismiss",
      label: "Selection and outside dismissal",
      kind: "interaction",
      react: "asserted",
      solid: "asserted",
      pairDiff: "na",
      spec: "e2e/select-visual.spec.ts",
      note: "Selection and outside dismissal are asserted for the legacy route.",
    },
  ],
};

function stateTargetsFor(entry: ComparisonEntry): readonly VisualStateTarget[] {
  const overrides =
    entry.catalogueSource === "react-spectrum-s2"
      ? officialStateOverrides[entry.slug]
      : legacyStateOverrides[entry.slug];

  return overrides ?? [plannedState(entry)];
}

export function getVisualStateTargets(entry: ComparisonEntry): readonly VisualStateTarget[] {
  return stateTargetsFor(entry);
}

export const visualStateCoverage: readonly VisualStateCoverage[] = comparisonEntries.map(
  (entry) => ({
    slug: entry.slug,
    title: entry.title,
    source: entry.catalogueSource,
    states: stateTargetsFor(entry),
  }),
);

export const officialVisualStateCoverage: readonly VisualStateCoverage[] =
  officialComparisonEntries.map((entry) => ({
    slug: entry.slug,
    title: entry.title,
    source: entry.catalogueSource,
    states: stateTargetsFor(entry),
  }));

export const officialVisualStateSummary = {
  components: officialVisualStateCoverage.length,
  states: officialVisualStateCoverage.reduce((count, entry) => count + entry.states.length, 0),
  snapshottedStates: officialVisualStateCoverage.reduce(
    (count, entry) =>
      count +
      entry.states.filter((state) => state.react === "snapshotted" && state.solid === "snapshotted")
        .length,
    0,
  ),
  strictPairDiffStates: officialVisualStateCoverage.reduce(
    (count, entry) => count + entry.states.filter((state) => state.pairDiff === "strict").length,
    0,
  ),
  blockedStates: officialVisualStateCoverage.reduce(
    (count, entry) => count + entry.states.filter((state) => state.pairDiff === "blocked").length,
    0,
  ),
} as const;
