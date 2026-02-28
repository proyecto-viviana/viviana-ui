export type ComparisonLayerId = "styled" | "components" | "headless" | "state";
export type ComparisonSlug =
  | "provider"
  | "button"
  | "popover"
  | "tabs"
  | "table"
  | "listbox"
  | "tree"
  | "accordion"
  | "menu"
  | "combobox";
export type ParityStatus = "matched" | "partial" | "gap";
export type DemoStatus = "live" | "tracked" | "missing" | "na";

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
  category: string;
  summary: string;
  parity: ParityStatus;
  priority: "live" | "tracked";
  gapSummary: string[];
  layers: Record<ComparisonLayerId, LayerTrack>;
}

export const layerOrder: ComparisonLayerId[] = [
  "styled",
  "components",
  "headless",
  "state",
];

export const comparisonEntries: ComparisonEntry[] = [
  {
    slug: "provider",
    title: "Provider",
    category: "Foundations",
    summary:
      "Root-scoped theming, inherited props, locale, direction, and overlay containment.",
    parity: "matched",
    priority: "live",
    gapSummary: [
      "Styled provider parity is implemented in both ecosystems.",
      "Component and headless layers are utility-level rather than end-user primitives.",
    ],
    layers: {
      styled: {
        label: "Styled Provider",
        summary: "Theme scope, inheritance, and nested overrides.",
        react: "live",
        solid: "live",
        note: "This is the main parity target after the provider work.",
      },
      components: {
        label: "Component Utilities",
        summary: "Provider-like utility composition for headless components.",
        react: "tracked",
        solid: "tracked",
        note:
          "Not yet rendered as a first-class showcase because the parity target is the styled Provider surface.",
      },
      headless: {
        label: "ARIA Utilities",
        summary:
          "Locale, direction, and modal plumbing below the styled layer.",
        react: "na",
        solid: "na",
        note: "Tracked in source review rather than a visual comparison.",
      },
      state: {
        label: "State Layer",
        summary: "Provider itself is not a state primitive.",
        react: "na",
        solid: "na",
        note: "No direct state-layer equivalent to render here.",
      },
    },
  },
  {
    slug: "button",
    title: "Button",
    category: "Actions",
    summary:
      "Good parity probe because it exists across styled, component, and headless layers with inherited provider props.",
    parity: "matched",
    priority: "live",
    gapSummary: [
      "Styled, component, and headless button demos are all live.",
      "This is the baseline sanity check for provider inheritance and press semantics.",
    ],
    layers: {
      styled: {
        label: "Styled Button",
        summary: "React Spectrum Button vs Silapse Button.",
        react: "live",
        solid: "live",
        note: "Uses each design system's real styled surface.",
      },
      components: {
        label: "Component Button",
        summary: "react-aria-components Button vs solidaria-components Button.",
        react: "live",
        solid: "live",
        note: "Useful for parity below the design-system skin.",
      },
      headless: {
        label: "Headless Button",
        summary: "useButton vs createButton.",
        react: "live",
        solid: "live",
        note:
          "This layer validates the normalized press behavior API directly.",
      },
      state: {
        label: "State Layer",
        summary: "Buttons do not have an independent state primitive.",
        react: "na",
        solid: "na",
        note: "No dedicated state layer for simple press actions.",
      },
    },
  },
  {
    slug: "popover",
    title: "Popover",
    category: "Overlays",
    summary:
      "Critical parity area because dismissal, focus containment, and portal scoping must match React Spectrum behavior.",
    parity: "partial",
    priority: "live",
    gapSummary: [
      "React component-layer popover is live with scoped portal roots.",
      "Solid component-layer popover is scaffolded but stays tracked until the comparison app moves this case onto the validated island path.",
      "Styled-layer React Spectrum popover wiring is intentionally deferred to a dedicated dialog/popover package pass.",
    ],
    layers: {
      styled: {
        label: "Styled Popover",
        summary:
          "React Spectrum dialog/popover surface vs Silapse popover styling.",
        react: "tracked",
        solid: "tracked",
        note:
          "Deferred until the styled overlay package set is brought into the app.",
      },
      components: {
        label: "Component Popover",
        summary:
          "react-aria-components Popover vs solidaria-components Popover.",
        react: "live",
        solid: "tracked",
        note:
          "React is the current parity proof here. The Solid comparison stays tracked until complex overlay wiring is validated in-browser in the comparison app itself.",
      },
      headless: {
        label: "Headless Overlay",
        summary: "Overlay hooks and positioning primitives.",
        react: "tracked",
        solid: "tracked",
        note: "Planned for a dedicated overlay-behavior page.",
      },
      state: {
        label: "State Layer",
        summary: "Overlay trigger state and dismissal mechanics.",
        react: "tracked",
        solid: "tracked",
        note: "Useful later, but not the first visual comparison priority.",
      },
    },
  },
  {
    slug: "tabs",
    title: "Tabs",
    category: "Navigation",
    summary:
      "Strong parity slice because it spans styled and component layers and relies on collection semantics.",
    parity: "partial",
    priority: "live",
    gapSummary: [
      "React styled and component layer demos are live.",
      "Solid tabs stay tracked in this first slice until context-heavy collection demos are validated in the comparison app runtime.",
      "Collection alias gaps still exist around the broader React Spectrum export surface.",
    ],
    layers: {
      styled: {
        label: "Styled Tabs",
        summary: "React Spectrum Tabs vs Silapse Tabs.",
        react: "live",
        solid: "tracked",
        note:
          "React is live. Solid stays tracked until the comparison app proves collection wiring end-to-end.",
      },
      components: {
        label: "Component Tabs",
        summary: "react-aria-components Tabs vs solidaria-components Tabs.",
        react: "live",
        solid: "tracked",
        note:
          "React is live. Solid stays tracked until the comparison app validates tab selection behavior directly.",
      },
      headless: {
        label: "Headless Tabs",
        summary: "Tabs behavior hooks below the component layer.",
        react: "tracked",
        solid: "tracked",
        note: "Planned after the first comparison app slice is stable.",
      },
      state: {
        label: "Tabs State",
        summary: "react-stately tabs state vs solid-stately tabs state.",
        react: "tracked",
        solid: "tracked",
        note: "Valuable, but not yet visualized.",
      },
    },
  },
  {
    slug: "table",
    title: "Table",
    category: "Collections",
    summary:
      "High-value parity target with the largest remaining styled-surface differences.",
    parity: "gap",
    priority: "tracked",
    gapSummary: [
      "One of the highest-priority implementation gaps in the styled layer.",
      "Will require richer collection fixtures, sorting, and overlay coordination.",
    ],
    layers: {
      styled: {
        label: "Styled Table",
        summary: "React Spectrum TableView-class parity vs Silapse Table.",
        react: "tracked",
        solid: "tracked",
        note:
          "Planned for the first major expansion after the scaffold stabilizes.",
      },
      components: {
        label: "Component Table",
        summary: "Table primitives below the skin.",
        react: "tracked",
        solid: "tracked",
        note:
          "Needs a dedicated fixture harness for row actions and keyboard interaction.",
      },
      headless: {
        label: "Headless Table",
        summary: "ARIA table hooks and keyboard behavior.",
        react: "tracked",
        solid: "tracked",
        note: "Planned once the styled comparison exists.",
      },
      state: {
        label: "Table State",
        summary: "Collection, selection, and sorting state.",
        react: "tracked",
        solid: "tracked",
        note: "Important for parity, but not yet wired into the app.",
      },
    },
  },
  {
    slug: "listbox",
    title: "ListBox",
    category: "Collections",
    summary:
      "Another top priority because it underpins picker, menu, and combobox parity.",
    parity: "gap",
    priority: "tracked",
    gapSummary: [
      "A core backlog item from the current parity checklist.",
      "Will anchor several other comparison routes once the fixture model is in place.",
    ],
    layers: {
      styled: {
        label: "Styled ListBox",
        summary: "Design-system listbox and option rendering.",
        react: "tracked",
        solid: "tracked",
        note: "Planned with shared collection fixtures.",
      },
      components: {
        label: "Component ListBox",
        summary:
          "react-aria-components ListBox vs solidaria-components ListBox.",
        react: "tracked",
        solid: "tracked",
        note: "Will expose collection alias gaps clearly.",
      },
      headless: {
        label: "Headless ListBox",
        summary: "ARIA listbox behavior.",
        react: "tracked",
        solid: "tracked",
        note: "Useful after the component comparison is in place.",
      },
      state: {
        label: "List State",
        summary: "Collection and selection primitives.",
        react: "tracked",
        solid: "tracked",
        note: "Will become the backbone for collection-layer parity screens.",
      },
    },
  },
  {
    slug: "tree",
    title: "Tree",
    category: "Collections",
    summary:
      "Parity gap with nested collections, keyboard interaction, and virtualization pressure.",
    parity: "gap",
    priority: "tracked",
    gapSummary: [
      "Still a high-effort parity area.",
      "Needs hierarchical fixtures and stronger behavior instrumentation than the initial app slice.",
    ],
    layers: {
      styled: {
        label: "Styled Tree",
        summary: "Tree visuals, disclosure affordances, and selection state.",
        react: "tracked",
        solid: "tracked",
        note: "Not yet live.",
      },
      components: {
        label: "Component Tree",
        summary: "Headless component composition for hierarchical data.",
        react: "tracked",
        solid: "tracked",
        note: "Planned after table and listbox.",
      },
      headless: {
        label: "Headless Tree",
        summary: "ARIA tree primitives and keyboard navigation.",
        react: "tracked",
        solid: "tracked",
        note: "Requires richer focus-flow instrumentation.",
      },
      state: {
        label: "Tree State",
        summary: "Hierarchical collection and expansion state.",
        react: "tracked",
        solid: "tracked",
        note: "Tracked, but not yet wired into this app.",
      },
    },
  },
  {
    slug: "accordion",
    title: "Accordion",
    category: "Disclosure",
    summary:
      "Maps to React Spectrum accordion patterns while Silapse currently leans on Disclosure primitives.",
    parity: "gap",
    priority: "tracked",
    gapSummary: [
      "Explicit gap from the current package-level parity review.",
      "Will likely be represented as a named accordion surface on top of existing disclosure primitives.",
    ],
    layers: {
      styled: {
        label: "Styled Accordion",
        summary:
          "A user-facing accordion surface aligned with React Spectrum naming.",
        react: "tracked",
        solid: "missing",
        note: "Silapse does not yet expose a direct styled accordion API.",
      },
      components: {
        label: "Component Disclosure",
        summary: "Disclosure primitives as the lower-level building block.",
        react: "tracked",
        solid: "tracked",
        note:
          "Can be compared later, but it does not close the styled naming gap by itself.",
      },
      headless: {
        label: "Headless Disclosure",
        summary: "ARIA disclosure mechanics.",
        react: "tracked",
        solid: "tracked",
        note: "Not a first-slice visual priority.",
      },
      state: {
        label: "Disclosure State",
        summary: "Expansion state and selection semantics.",
        react: "tracked",
        solid: "tracked",
        note: "Still backlog.",
      },
    },
  },
  {
    slug: "menu",
    title: "Menu",
    category: "Overlays",
    summary:
      "Important because it combines listbox-like collections, overlays, and dismissal behavior.",
    parity: "partial",
    priority: "tracked",
    gapSummary: [
      "Underlying primitives are strong, but the styled surface still needs systematic parity review.",
      "The comparison app should eventually test submenu and overlay interaction here.",
    ],
    layers: {
      styled: {
        label: "Styled Menu",
        summary: "React Spectrum MenuTrigger surface vs Silapse menu.",
        react: "tracked",
        solid: "tracked",
        note: "Next overlay-heavy styled target after popover and table.",
      },
      components: {
        label: "Component Menu",
        summary: "react-aria-components Menu vs solidaria-components Menu.",
        react: "tracked",
        solid: "tracked",
        note: "A strong candidate for the second comparison-app wave.",
      },
      headless: {
        label: "Headless Menu",
        summary: "ARIA menu hooks and collection behavior.",
        react: "tracked",
        solid: "tracked",
        note: "Tracked.",
      },
      state: {
        label: "Menu State",
        summary: "Selection and overlay trigger state.",
        react: "tracked",
        solid: "tracked",
        note: "Tracked.",
      },
    },
  },
  {
    slug: "combobox",
    title: "ComboBox",
    category: "Inputs",
    summary:
      "Key parity target because it combines text input, collections, filtering, and overlays.",
    parity: "partial",
    priority: "tracked",
    gapSummary: [
      "Another major backlog item from the styled layer review.",
      "Needs shared fixtures to compare filtering, async loading, and option rendering.",
    ],
    layers: {
      styled: {
        label: "Styled ComboBox",
        summary: "React Spectrum ComboBox vs Silapse ComboBox.",
        react: "tracked",
        solid: "tracked",
        note:
          "Planned after listbox, because the collection harness will be shared.",
      },
      components: {
        label: "Component ComboBox",
        summary:
          "react-aria-components ComboBox vs solidaria-components ComboBox.",
        react: "tracked",
        solid: "tracked",
        note: "Will expose listbox and input parity clearly.",
      },
      headless: {
        label: "Headless ComboBox",
        summary: "Text input and popup trigger behavior.",
        react: "tracked",
        solid: "tracked",
        note: "Tracked.",
      },
      state: {
        label: "ComboBox State",
        summary: "Filtering, selection, and open-state management.",
        react: "tracked",
        solid: "tracked",
        note: "Tracked.",
      },
    },
  },
];

export function getComparisonEntry(
  slug: string,
): ComparisonEntry | undefined {
  return comparisonEntries.find((entry) => entry.slug === slug);
}
