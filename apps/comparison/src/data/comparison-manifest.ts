import {
  reactSpectrumCatalogue,
  reactSpectrumCatalogueSource,
  type ReactSpectrumCatalogueCategory,
} from "./react-spectrum-catalogue";

export type ComparisonLayerId = "styled" | "components" | "headless" | "state";
export type ComponentStatus = "parity" | "composition" | "solid-spectrum-native" | "tracked-gap";
export type ComparisonSlug = string;
export type ParityStatus = "matched" | "partial" | "gap";
export type DemoStatus = "live" | "tracked" | "missing" | "na";
export type CatalogueSource = "react-spectrum-s2" | "legacy-solidaria";

export interface LayerTrack {
  label: string;
  summary: string;
  react: DemoStatus;
  solid: DemoStatus;
  note: string;
}

export interface ComparisonEntry {
  slug: ComparisonSlug;
  title: string;
  category: ReactSpectrumCatalogueCategory | "Legacy";
  componentStatus: ComponentStatus;
  summary: string;
  parity: ParityStatus;
  priority: "live" | "tracked";
  gapSummary: string[];
  docsUrl?: string;
  catalogueSource: CatalogueSource;
  layers: Record<ComparisonLayerId, LayerTrack>;
}

export const layerOrder: ComparisonLayerId[] = ["styled", "components", "headless", "state"];

function layerTrack(
  label: string,
  summary: string,
  react: DemoStatus,
  solid: DemoStatus,
  note: string,
): LayerTrack {
  return { label, summary, react, solid, note };
}

function createGapEntry(input: {
  slug: string;
  title: string;
  category: ReactSpectrumCatalogueCategory;
  docsUrl: string;
}): ComparisonEntry {
  return {
    slug: input.slug,
    title: input.title,
    category: input.category,
    componentStatus: "tracked-gap",
    summary: `${input.title} is listed in the official React Spectrum S2 catalogue and is on the comparison roadmap.`,
    parity: "gap",
    priority: "tracked",
    docsUrl: input.docsUrl,
    catalogueSource: "react-spectrum-s2",
    gapSummary: [
      "React Spectrum reference demo is not wired yet.",
      "Solid styled/component parity is marked missing until implemented and tested.",
      "State matrix and screenshot baselines are not yet captured.",
    ],
    layers: {
      styled: layerTrack(
        `Styled ${input.title}`,
        "Official React Spectrum component vs Solid styled implementation.",
        "tracked",
        "missing",
        "Roadmap entry. Wire the exact React Spectrum component first, then implement Solid parity and state screenshots.",
      ),
      components: layerTrack(
        `Component ${input.title}`,
        "Component-layer parity target where a lower-level component exists.",
        "tracked",
        "missing",
        "Tracked separately from the styled surface so missing lower-layer APIs stay visible.",
      ),
      headless: layerTrack(
        `Headless ${input.title}`,
        "ARIA behavior primitives and keyboard contract.",
        "tracked",
        "missing",
        "Use semantic queries and real user-like interactions before styling assertions.",
      ),
      state: layerTrack(
        `${input.title} State`,
        "State primitives and controlled/uncontrolled behavior.",
        "tracked",
        "missing",
        "State coverage must be component-specific rather than blindly canonical.",
      ),
    },
  };
}

function legacyEntry(input: {
  slug: string;
  title: string;
  category: string;
  summary: string;
  parity?: ParityStatus;
  componentStatus?: ComponentStatus;
  gapSummary: string[];
  layers: Record<ComparisonLayerId, LayerTrack>;
}): ComparisonEntry {
  return {
    slug: input.slug,
    title: input.title,
    category: "Legacy",
    componentStatus: input.componentStatus ?? "tracked-gap",
    summary: input.summary,
    parity: input.parity ?? "partial",
    priority: "live",
    catalogueSource: "legacy-solidaria",
    gapSummary: input.gapSummary,
    layers: input.layers,
  };
}

function styledLiveOfficialEntry(input: {
  slug: string;
  title: string;
  category: ReactSpectrumCatalogueCategory;
  summary: string;
  styledSummary: string;
  styledNote: string;
}): ComparisonEntry {
  return {
    ...createGapEntry({
      slug: input.slug,
      title: input.title,
      category: input.category,
      docsUrl: `${reactSpectrumCatalogueSource.docsBase}/${input.title.replace(/\s+/g, "")}`,
    }),
    componentStatus: "tracked-gap",
    summary: input.summary,
    parity: "partial",
    priority: "live",
    gapSummary: [
      "Styled React Spectrum and Solid comparison islands are mounted.",
      "Default screenshots and strict zero-tolerance pair-diff tests are committed.",
      "The entry remains a tracked gap until those pair-diff tests pass pixel-perfectly and exhaustive state coverage is complete.",
    ],
    layers: {
      styled: layerTrack(
        `Styled ${input.title}`,
        input.styledSummary,
        "live",
        "live",
        input.styledNote,
      ),
      components: layerTrack(
        `Component ${input.title}`,
        "Component-layer parity target.",
        "tracked",
        "tracked",
        "Tracked separately from the styled Spectrum comparison surface.",
      ),
      headless: layerTrack(
        `Headless ${input.title}`,
        "ARIA behavior hooks below the styled layer.",
        "tracked",
        "tracked",
        "Tracked for keyboard, focus, and semantic parity once the styled surface is stable.",
      ),
      state: layerTrack(
        `${input.title} State`,
        "Component-specific state coverage.",
        "tracked",
        "tracked",
        "State screenshots and assertions should be added per component rather than using a generic matrix blindly.",
      ),
    },
  };
}

const entryOverrides: Record<string, ComparisonEntry> = {
  provider: {
    ...createGapEntry({
      slug: "provider",
      title: "Provider",
      category: "Components",
      docsUrl: `${reactSpectrumCatalogueSource.docsBase}/Provider`,
    }),
    componentStatus: "tracked-gap",
    summary: "Root-scoped theming, inherited props, locale, direction, and overlay containment.",
    parity: "partial",
    priority: "live",
    gapSummary: [
      "Styled provider demos are mounted in both ecosystems.",
      "Provider is not accepted as matched until its strict pair-diff test passes pixel-perfectly.",
      "Component and headless layers are utility-level rather than end-user primitives.",
    ],
    layers: {
      styled: layerTrack(
        "Styled Provider",
        "Theme scope, inheritance, and nested overrides.",
        "live",
        "live",
        "This is the main parity target after the provider work.",
      ),
      components: layerTrack(
        "Component Utilities",
        "Provider-like utility composition for headless components.",
        "tracked",
        "tracked",
        "Not yet rendered as a first-class showcase because the parity target is the styled Provider surface.",
      ),
      headless: layerTrack(
        "ARIA Utilities",
        "Locale, direction, and modal plumbing below the styled layer.",
        "na",
        "na",
        "Tracked in source review rather than a visual comparison.",
      ),
      state: layerTrack(
        "State Layer",
        "Provider itself is not a state primitive.",
        "na",
        "na",
        "No direct state-layer equivalent to render here.",
      ),
    },
  },

  button: {
    ...createGapEntry({
      slug: "button",
      title: "Button",
      category: "Components",
      docsUrl: `${reactSpectrumCatalogueSource.docsBase}/Button`,
    }),
    componentStatus: "tracked-gap",
    summary:
      "Baseline parity probe across styled, component, and headless layers with inherited provider props.",
    parity: "partial",
    priority: "live",
    gapSummary: [
      "Styled, component, and headless button demos are all live.",
      "Styled Button is not accepted as matched until the strict S2 pair-diff test is pixel-perfect.",
      "Next work is exhaustive variant/state screenshot coverage after default styling parity is fixed.",
    ],
    layers: {
      styled: layerTrack(
        "Styled Button",
        "React Spectrum Button vs solidaria-components Button using the comparison Spectrum skin adapter.",
        "live",
        "live",
        "Solid keeps behavior in solidaria-components and maps stable classes, data states, slots, variant attributes, and CSS variables to the comparison skin.",
      ),
      components: layerTrack(
        "Component Button",
        "react-aria-components Button vs solidaria-components Button.",
        "live",
        "live",
        "Useful for parity below the design-system skin.",
      ),
      headless: layerTrack(
        "Headless Button",
        "useButton vs createButton.",
        "live",
        "live",
        "This layer validates the normalized press behavior API directly.",
      ),
      state: layerTrack(
        "State Layer",
        "Buttons do not have an independent state primitive.",
        "na",
        "na",
        "No dedicated state layer for simple press actions.",
      ),
    },
  },

  actionbutton: styledLiveOfficialEntry({
    slug: "actionbutton",
    title: "ActionButton",
    category: "Components",
    summary:
      "Task-oriented ActionButton reference mounted with React Spectrum and the Solid Spectrum skin.",
    styledSummary:
      "React Spectrum ActionButton vs Solid action button behavior with Spectrum-shaped styling.",
    styledNote:
      "React uses @react-spectrum/s2 ActionButton directly; Solid uses solidaria button behavior under the comparison Spectrum skin.",
  }),

  actionbuttongroup: styledLiveOfficialEntry({
    slug: "actionbuttongroup",
    title: "ActionButtonGroup",
    category: "Components",
    summary: "Related action collection with single selection and action tracking on both stacks.",
    styledSummary:
      "React Spectrum ActionButtonGroup vs Solid action group behavior with the comparison Spectrum skin.",
    styledNote:
      "React uses @react-spectrum/s2 ActionButtonGroup and ActionButton directly; Solid uses solidaria collection behavior under the comparison Spectrum skin.",
  }),

  buttongroup: styledLiveOfficialEntry({
    slug: "buttongroup",
    title: "ButtonGroup",
    category: "Components",
    summary: "Grouped related buttons mounted on both stacks for layout and overflow parity work.",
    styledSummary: "React Spectrum ButtonGroup vs Solid grouped Spectrum-skinned buttons.",
    styledNote:
      "React uses @react-spectrum/s2 ButtonGroup directly; Solid uses the Solid Spectrum grouping wrapper with Spectrum-skinned buttons.",
  }),

  togglebutton: styledLiveOfficialEntry({
    slug: "togglebutton",
    title: "ToggleButton",
    category: "Components",
    summary: "Selectable action button mounted on both stacks with controlled selected-state data.",
    styledSummary:
      "React Spectrum ToggleButton vs Solid toggle button behavior with Spectrum-shaped styling.",
    styledNote:
      "React uses @react-spectrum/s2 ToggleButton directly; Solid uses solidaria toggle behavior under the comparison Spectrum skin.",
  }),

  tabs: {
    ...createGapEntry({
      slug: "tabs",
      title: "Tabs",
      category: "Components",
      docsUrl: `${reactSpectrumCatalogueSource.docsBase}/Tabs`,
    }),
    componentStatus: "parity",
    summary:
      "Strong parity slice because it spans styled and component layers and relies on collection semantics.",
    parity: "partial",
    priority: "live",
    gapSummary: [
      "React and Solid styled tab demos are both mounted directly in the comparison app.",
      "State matrix and visual baselines still need expansion.",
    ],
    layers: {
      styled: layerTrack(
        "Styled Tabs",
        "React Spectrum Tabs vs Solid Spectrum Tabs.",
        "live",
        "live",
        "React and Solid styled tab demos are both mounted directly in the comparison app.",
      ),
      components: layerTrack(
        "Component Tabs",
        "react-aria-components Tabs vs solidaria-components Tabs.",
        "live",
        "live",
        "React and Solid component tab demos are both mounted and comparable in the app runtime.",
      ),
      headless: layerTrack(
        "Headless Tabs",
        "Tabs behavior hooks below the component layer.",
        "tracked",
        "tracked",
        "Planned after the first comparison app slice is stable.",
      ),
      state: layerTrack(
        "Tabs State",
        "react-stately tabs state vs solid-stately tabs state.",
        "tracked",
        "tracked",
        "Valuable, but not yet visualized.",
      ),
    },
  },

  ...Object.fromEntries(
    (
      [
        ["textfield", "TextField"],
        ["checkbox", "Checkbox"],
        ["dialog", "Dialog"],
        ["datepicker", "DatePicker"],
        ["searchfield", "SearchField"],
        ["tooltip", "Tooltip"],
        ["toast", "Toast"],
      ] as const
    ).map(([slug, title]) => [
      slug,
      {
        ...createGapEntry({
          slug,
          title,
          category: "Components",
          docsUrl: `${reactSpectrumCatalogueSource.docsBase}/${title}`,
        }),
        componentStatus: "parity",
        summary: `${title} has an initial live comparison island. Exhaustive states remain open.`,
        parity: "partial",
        priority: "live",
        gapSummary: [
          "Initial live island added for comparison coverage.",
          "Detailed state matrices and strict visual assertions remain incomplete.",
        ],
        layers: {
          styled: layerTrack(
            `Styled ${title}`,
            `React Spectrum ${title} vs Solid styled implementation.`,
            title === "Toast" ? "tracked" : "live",
            "live",
            title === "Toast"
              ? "React Spectrum Toast reference remains tracked while Solid styled toast is live."
              : "Both runtime islands are mounted for parity review.",
          ),
          components: layerTrack(
            `Component ${title}`,
            "Component-layer parity target.",
            title === "Toast" ? "tracked" : "live",
            "tracked",
            "Solid component comparison is still tracked separately from the styled island.",
          ),
          headless: layerTrack(
            `Headless ${title}`,
            "ARIA behavior hooks below the component layer.",
            "tracked",
            "tracked",
            "Tracked for later keyboard and screen reader parity work.",
          ),
          state: layerTrack(
            `${title} State`,
            "State-layer parity where a dedicated state primitive exists.",
            "tracked",
            "tracked",
            "Tracked in source/test parity rather than this initial visual island.",
          ),
        },
      } satisfies ComparisonEntry,
    ]),
  ),
};

const legacyEntries: ComparisonEntry[] = [
  legacyEntry({
    slug: "select",
    title: "Select",
    category: "Legacy",
    summary:
      "Legacy Solidaria Select route retained while official React Spectrum Picker coverage is added.",
    gapSummary: [
      "React Spectrum S2 calls this surface Picker.",
      "Migrate this route into the official Picker entry before treating it as complete.",
    ],
    layers: createLegacyLiveLayers("Select"),
  }),
  legacyEntry({
    slug: "radio",
    title: "Radio",
    category: "Legacy",
    summary: "Legacy route retained while official React Spectrum RadioGroup coverage is added.",
    gapSummary: [
      "React Spectrum S2 exposes RadioGroup as the catalogue component.",
      "Migrate the current demo into the official RadioGroup entry.",
    ],
    layers: createLegacyLiveLayers("Radio"),
  }),
  legacyEntry({
    slug: "table",
    title: "Table",
    category: "Legacy",
    summary: "Legacy route retained while official React Spectrum TableView coverage is added.",
    gapSummary: [
      "React Spectrum S2 exposes TableView as the catalogue component.",
      "Migrate collection fixtures into the official TableView entry.",
    ],
    layers: createLegacyTrackedLayers("Table"),
  }),
  legacyEntry({
    slug: "tree",
    title: "Tree",
    category: "Legacy",
    summary: "Legacy route retained while official React Spectrum TreeView coverage is added.",
    gapSummary: [
      "React Spectrum S2 exposes TreeView as the catalogue component.",
      "Migrate hierarchical fixtures into the official TreeView entry.",
    ],
    layers: createLegacyTrackedLayers("Tree"),
  }),
  legacyEntry({
    slug: "toolbar",
    title: "Toolbar",
    category: "Legacy",
    summary:
      "Legacy route retained for lower-layer toolbar behavior while official ActionButtonGroup coverage is expanded.",
    gapSummary: [
      "React Spectrum S2 exposes ActionButtonGroup, not Toolbar, as the styled catalogue surface.",
      "Keep this route for lower-layer parity until ActionButtonGroup is complete.",
    ],
    layers: createLegacyLiveLayers("Toolbar"),
  }),
];

function createLegacyLiveLayers(title: string): Record<ComparisonLayerId, LayerTrack> {
  return {
    styled: layerTrack(
      `Styled ${title}`,
      `Existing ${title} comparison island.`,
      "live",
      "live",
      "Legacy live route retained for continuity while official S2 catalogue routes are filled.",
    ),
    components: layerTrack(
      `Component ${title}`,
      "Component-layer parity target.",
      "live",
      "tracked",
      "Tracked until the official S2 catalogue component owns this surface.",
    ),
    headless: layerTrack(
      `Headless ${title}`,
      "ARIA behavior hooks below the component layer.",
      "tracked",
      "tracked",
      "Tracked.",
    ),
    state: layerTrack(
      `${title} State`,
      "State-layer parity where a dedicated state primitive exists.",
      "tracked",
      "tracked",
      "Tracked.",
    ),
  };
}

function createLegacyTrackedLayers(title: string): Record<ComparisonLayerId, LayerTrack> {
  return {
    styled: layerTrack(
      `Styled ${title}`,
      `Legacy ${title} comparison placeholder.`,
      "tracked",
      "tracked",
      "Tracked until the official S2 catalogue component owns this surface.",
    ),
    components: layerTrack(
      `Component ${title}`,
      "Component-layer parity target.",
      "tracked",
      "tracked",
      "Tracked.",
    ),
    headless: layerTrack(
      `Headless ${title}`,
      "ARIA behavior hooks below the component layer.",
      "tracked",
      "tracked",
      "Tracked.",
    ),
    state: layerTrack(
      `${title} State`,
      "State-layer parity where a dedicated state primitive exists.",
      "tracked",
      "tracked",
      "Tracked.",
    ),
  };
}

const officialEntries = reactSpectrumCatalogue.map((catalogueEntry) => {
  const baseEntry = createGapEntry({
    slug: catalogueEntry.slug,
    title: catalogueEntry.title,
    category: catalogueEntry.category,
    docsUrl: catalogueEntry.docsPath,
  });

  return entryOverrides[catalogueEntry.slug] ?? baseEntry;
});

export const comparisonEntries: ComparisonEntry[] = [...officialEntries, ...legacyEntries];

export const officialComparisonEntries = comparisonEntries.filter(
  (entry) => entry.catalogueSource === "react-spectrum-s2",
);

export const missingOfficialComparisonEntries = officialComparisonEntries.filter(
  (entry) => entry.layers.styled.react !== "live" || entry.layers.styled.solid !== "live",
);

export function getComparisonEntry(slug: string): ComparisonEntry | undefined {
  return comparisonEntries.find((entry) => entry.slug === slug);
}
