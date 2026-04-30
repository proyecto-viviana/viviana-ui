import {
  reactSpectrumCatalogue,
  reactSpectrumCatalogueSource,
  type ReactSpectrumCatalogueCategory,
} from "./react-spectrum-catalogue";

export type ComparisonLayerId = "styled" | "components" | "headless" | "state";
export type ComponentStatus =
  | "parity"
  | "composition"
  | "silapse-native"
  | "tracked-gap";
export type ComparisonSlug = string;
export type ParityStatus = "matched" | "partial" | "gap";
export type DemoStatus = "live" | "tracked" | "missing" | "na";
export type CatalogueSource = "react-spectrum-v3" | "legacy-solidaria";

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

export const layerOrder: ComparisonLayerId[] = [
  "styled",
  "components",
  "headless",
  "state",
];

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
    summary: `${input.title} is listed in the official React Spectrum v3 catalogue and is on the comparison roadmap.`,
    parity: "gap",
    priority: "tracked",
    docsUrl: input.docsUrl,
    catalogueSource: "react-spectrum-v3",
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
      docsUrl: `${reactSpectrumCatalogueSource.url.replace("/index.html", "")}/${input.title}.html`,
    }),
    componentStatus: "parity",
    summary: input.summary,
    parity: "partial",
    priority: "live",
    gapSummary: [
      "Styled React Spectrum and Solid comparison islands are mounted.",
      "Default screenshots are committed; exhaustive state coverage and strict pair diff remain open.",
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
      category: "Application",
      docsUrl: `${reactSpectrumCatalogueSource.url.replace("/index.html", "")}/Provider.html`,
    }),
    componentStatus: "parity",
    summary:
      "Root-scoped theming, inherited props, locale, direction, and overlay containment.",
    parity: "matched",
    priority: "live",
    gapSummary: [
      "Styled provider parity is implemented in both ecosystems.",
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
      category: "Buttons",
      docsUrl: `${reactSpectrumCatalogueSource.url.replace("/index.html", "")}/Button.html`,
    }),
    componentStatus: "parity",
    summary:
      "Baseline parity probe across styled, component, and headless layers with inherited provider props.",
    parity: "matched",
    priority: "live",
    gapSummary: [
      "Styled, component, and headless button demos are all live.",
      "Next work is exhaustive variant/state screenshot coverage.",
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
    category: "Buttons",
    summary:
      "Task-oriented ActionButton reference mounted with React Spectrum and the Solid Spectrum skin.",
    styledSummary: "React Spectrum ActionButton vs Solid action button behavior with Spectrum-shaped styling.",
    styledNote:
      "React uses @adobe/react-spectrum ActionButton directly; Solid uses solidaria button behavior under the comparison Spectrum skin.",
  }),

  actiongroup: styledLiveOfficialEntry({
    slug: "actiongroup",
    title: "ActionGroup",
    category: "Buttons",
    summary:
      "Related action collection with single selection and action tracking on both stacks.",
    styledSummary: "React Spectrum ActionGroup vs Solid action group behavior with the comparison Spectrum skin.",
    styledNote:
      "React uses @adobe/react-spectrum ActionGroup directly; Solid uses solidaria collection behavior under the comparison Spectrum skin.",
  }),

  buttongroup: styledLiveOfficialEntry({
    slug: "buttongroup",
    title: "ButtonGroup",
    category: "Buttons",
    summary:
      "Grouped related buttons mounted on both stacks for layout and overflow parity work.",
    styledSummary: "React Spectrum ButtonGroup vs Solid grouped Spectrum-skinned buttons.",
    styledNote:
      "React uses @adobe/react-spectrum ButtonGroup directly; Solid uses the Silapse grouping wrapper with Spectrum-skinned buttons.",
  }),

  filetrigger: styledLiveOfficialEntry({
    slug: "filetrigger",
    title: "FileTrigger",
    category: "Buttons",
    summary:
      "File picker trigger mounted with a pressable Spectrum action trigger on both stacks.",
    styledSummary: "React Spectrum FileTrigger vs Solid FileTrigger with a Spectrum-skinned trigger.",
    styledNote:
      "React uses @adobe/react-spectrum FileTrigger directly; Solid uses the Silapse FileTrigger wrapper around solidaria behavior.",
  }),

  logicbutton: styledLiveOfficialEntry({
    slug: "logicbutton",
    title: "LogicButton",
    category: "Buttons",
    summary:
      "Boolean operator buttons mounted for visual parity of the compact AND/OR surface.",
    styledSummary: "React Spectrum LogicButton vs Solid Spectrum-skinned logic button.",
    styledNote:
      "React uses @adobe/react-spectrum LogicButton directly; Solid renders matching logic operators with solidaria button behavior.",
  }),

  togglebutton: styledLiveOfficialEntry({
    slug: "togglebutton",
    title: "ToggleButton",
    category: "Buttons",
    summary:
      "Selectable action button mounted on both stacks with controlled selected-state data.",
    styledSummary: "React Spectrum ToggleButton vs Solid toggle button behavior with Spectrum-shaped styling.",
    styledNote:
      "React uses @adobe/react-spectrum ToggleButton directly; Solid uses solidaria toggle behavior under the comparison Spectrum skin.",
  }),

  tabs: {
    ...createGapEntry({
      slug: "tabs",
      title: "Tabs",
      category: "Navigation",
      docsUrl: `${reactSpectrumCatalogueSource.url.replace("/index.html", "")}/Tabs.html`,
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
        "React Spectrum Tabs vs Silapse Tabs.",
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
    ([
      ["textfield", "TextField", "Forms"],
      ["checkbox", "Checkbox", "Forms"],
      ["dialog", "Dialog", "Overlays"],
      ["datepicker", "DatePicker", "Date and Time"],
      ["searchfield", "SearchField", "Forms"],
      ["tooltip", "Tooltip", "Overlays"],
      ["toast", "Toast", "Status"],
    ] as const).map(([slug, title, category]) => [
      slug,
      {
        ...createGapEntry({
          slug,
          title,
          category: category as ReactSpectrumCatalogueCategory,
          docsUrl: `${reactSpectrumCatalogueSource.url.replace("/index.html", "")}/${title}.html`,
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
    slug: "popover",
    title: "Popover",
    category: "Overlays",
    summary:
      "Legacy lower-layer overlay route retained until official DialogTrigger/ContextualHelp coverage replaces it.",
    gapSummary: [
      "React Spectrum v3 does not list Popover as a top-level component.",
      "Keep this route for lower-layer overlay debugging while official overlay entries are implemented.",
    ],
    layers: {
      styled: layerTrack(
        "Styled Popover",
        "Legacy styled popover parity target.",
        "tracked",
        "tracked",
        "Use official DialogTrigger and ContextualHelp entries for React Spectrum styled parity.",
      ),
      components: layerTrack(
        "Component Popover",
        "react-aria-components Popover vs solidaria-components Popover.",
        "live",
        "live",
        "React and Solid both render the scoped popover comparison directly in the app runtime.",
      ),
      headless: layerTrack(
        "Headless Overlay",
        "Overlay hooks and positioning primitives.",
        "tracked",
        "tracked",
        "Planned for a dedicated overlay-behavior page.",
      ),
      state: layerTrack(
        "Overlay State",
        "Overlay trigger state and dismissal mechanics.",
        "tracked",
        "tracked",
        "Useful later, but not the first visual comparison priority.",
      ),
    },
  }),
  legacyEntry({
    slug: "select",
    title: "Select",
    category: "Legacy",
    summary:
      "Legacy Solidaria Select route retained while official React Spectrum Picker coverage is added.",
    gapSummary: [
      "React Spectrum v3 calls this surface Picker.",
      "Migrate this route into the official Picker entry before treating it as complete.",
    ],
    layers: createLegacyLiveLayers("Select"),
  }),
  legacyEntry({
    slug: "radio",
    title: "Radio",
    category: "Legacy",
    summary:
      "Legacy route retained while official React Spectrum RadioGroup coverage is added.",
    gapSummary: [
      "React Spectrum v3 exposes RadioGroup as the catalogue component.",
      "Migrate the current demo into the official RadioGroup entry.",
    ],
    layers: createLegacyLiveLayers("Radio"),
  }),
  legacyEntry({
    slug: "table",
    title: "Table",
    category: "Legacy",
    summary:
      "Legacy route retained while official React Spectrum TableView coverage is added.",
    gapSummary: [
      "React Spectrum v3 exposes TableView as the catalogue component.",
      "Migrate collection fixtures into the official TableView entry.",
    ],
    layers: createLegacyTrackedLayers("Table"),
  }),
  legacyEntry({
    slug: "tree",
    title: "Tree",
    category: "Legacy",
    summary:
      "Legacy route retained while official React Spectrum TreeView coverage is added.",
    gapSummary: [
      "React Spectrum v3 exposes TreeView as the catalogue component.",
      "Migrate hierarchical fixtures into the official TreeView entry.",
    ],
    layers: createLegacyTrackedLayers("Tree"),
  }),
  legacyEntry({
    slug: "toolbar",
    title: "Toolbar",
    category: "Legacy",
    summary:
      "Legacy route retained for lower-layer toolbar behavior while official ActionGroup coverage is expanded.",
    gapSummary: [
      "React Spectrum v3 exposes ActionGroup, not Toolbar, as the styled catalogue surface.",
      "Keep this route for lower-layer parity until ActionGroup is complete.",
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
      "Legacy live route retained for continuity while official v3 catalogue routes are filled.",
    ),
    components: layerTrack(
      `Component ${title}`,
      "Component-layer parity target.",
      "live",
      "tracked",
      "Tracked until the official v3 catalogue component owns this surface.",
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
      "Tracked until the official v3 catalogue component owns this surface.",
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

export const comparisonEntries: ComparisonEntry[] = [
  ...officialEntries,
  ...legacyEntries,
];

export const officialComparisonEntries = comparisonEntries.filter(
  (entry) => entry.catalogueSource === "react-spectrum-v3",
);

export const missingOfficialComparisonEntries = officialComparisonEntries.filter(
  (entry) =>
    entry.layers.styled.react !== "live" || entry.layers.styled.solid !== "live",
);

export function getComparisonEntry(
  slug: string,
): ComparisonEntry | undefined {
  return comparisonEntries.find((entry) => entry.slug === slug);
}
