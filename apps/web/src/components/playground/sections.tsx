import { For, Show, type Accessor, type JSX } from "solid-js";

export const SECTION_IDS = [
  "button", "badge", "chip", "alert", "tooltip", "popover", "avatar",
  "switch", "checkbox", "textfield", "link", "progressbar", "separator",
  "radiogroup", "profilecard", "eventcard", "calendarcard", "conversation",
  "timelineitem", "dialog", "createbutton-hook", "createcheckboxgroup-hook",
  "listbox", "menu", "select", "styled-select", "styled-menu", "styled-listbox",
  "styled-tabs", "styled-breadcrumbs", "styled-numberfield", "styled-searchfield",
  "styled-slider", "styled-combobox", "disclosure", "meter", "taggroup",
  "calendar", "datepicker", "toast",
  "table", "gridlist", "tree", "rangecalendar", "datefield", "timefield",
  "colorslider", "colorarea", "colorwheel", "colorfield", "colorswatch",
  "textarea", "daterangepicker", "colorswatchpicker", "coloreditor",
  "contextualhelp", "rangeslider", "alertdialog", "actionmenu",
  "flex", "grid", "theme",
] as const;

export type SectionId = typeof SECTION_IDS[number];

const SECTION_NAMES: Record<SectionId, string> = {
  button: "Button",
  badge: "Badge",
  chip: "Chip",
  alert: "Alert",
  tooltip: "Tooltip",
  popover: "Popover",
  avatar: "Avatar",
  switch: "Switch",
  checkbox: "Checkbox",
  textfield: "Text Field",
  link: "Link",
  progressbar: "Progress Bar",
  separator: "Separator",
  radiogroup: "Radio Group",
  profilecard: "Profile Card",
  eventcard: "Event Card",
  calendarcard: "Calendar Card",
  conversation: "Conversation",
  timelineitem: "Timeline Item",
  dialog: "Dialog",
  "createbutton-hook": "createButton Hook",
  "createcheckboxgroup-hook": "createCheckboxGroup Hook",
  listbox: "ListBox",
  menu: "Menu",
  select: "Select",
  "styled-select": "Styled Select",
  "styled-menu": "Styled Menu",
  "styled-listbox": "Styled ListBox",
  "styled-tabs": "Styled Tabs",
  "styled-breadcrumbs": "Styled Breadcrumbs",
  "styled-numberfield": "Number Field",
  "styled-searchfield": "Search Field",
  "styled-slider": "Slider",
  "styled-combobox": "ComboBox",
  disclosure: "Disclosure",
  meter: "Meter",
  taggroup: "Tag Group",
  calendar: "Calendar",
  datepicker: "Date Picker",
  toast: "Toast",
  table: "Table",
  gridlist: "GridList",
  tree: "Tree",
  rangecalendar: "Range Calendar",
  datefield: "Date Field",
  timefield: "Time Field",
  colorslider: "Color Slider",
  colorarea: "Color Area",
  colorwheel: "Color Wheel",
  colorfield: "Color Field",
  colorswatch: "Color Swatch",
  textarea: "TextArea",
  daterangepicker: "Date Range Picker",
  colorswatchpicker: "Color Swatch Picker",
  coloreditor: "Color Editor",
  contextualhelp: "Contextual Help",
  rangeslider: "Range Slider",
  alertdialog: "Alert Dialog",
  actionmenu: "Action Menu",
  flex: "Flex Layout",
  grid: "Grid Layout",
  theme: "Theme / Provider",
};

interface SectionControlPanelProps {
  visibleSections: Accessor<Set<SectionId>>;
  setVisibleSections: (fn: (prev: Set<SectionId>) => Set<SectionId>) => void;
}

export function SectionControlPanel(props: SectionControlPanelProps) {
  const toggle = (id: SectionId) => {
    props.setVisibleSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const showAll = () => {
    props.setVisibleSections(() => new Set(SECTION_IDS));
  };

  const hideAll = () => {
    props.setVisibleSections(() => new Set());
  };

  const jumpToSection = (id: SectionId) => {
    if (!props.visibleSections().has(id)) {
      toggle(id);
    }
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <div class="mb-8 rounded-2xl border border-primary-700/30 bg-bg-300/50 backdrop-blur-sm overflow-hidden">
      <div class="flex items-center justify-between p-4 border-b border-primary-700/30 bg-bg-400/50">
        <div class="flex items-center gap-3">
          <div class="w-2 h-8 rounded-full bg-linear-to-b from-accent to-primary-500" />
          <div>
            <h3 class="font-jost text-lg font-semibold text-primary-200">Component Sections</h3>
            <p class="text-xs text-primary-500">
              {props.visibleSections().size} of {SECTION_IDS.length} visible
            </p>
          </div>
        </div>
        <div class="flex gap-2">
          <button
            class="px-4 py-2 text-sm font-medium rounded-lg bg-accent/20 text-accent-200 hover:bg-accent/30 transition-colors"
            onClick={showAll}
            data-testid="show-all-sections"
          >
            Show All
          </button>
          <button
            class="px-4 py-2 text-sm font-medium rounded-lg bg-primary-700/30 text-primary-300 hover:bg-primary-700/50 transition-colors"
            onClick={hideAll}
            data-testid="hide-all-sections"
          >
            Hide All
          </button>
        </div>
      </div>

      <div class="p-4">
        <div class="flex flex-wrap gap-2">
          <For each={SECTION_IDS}>
            {(id) => (
              <button
                onClick={() => jumpToSection(id)}
                class={`px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
                  props.visibleSections().has(id)
                    ? "bg-accent/20 text-accent-200 border border-accent/40 hover:bg-accent/30"
                    : "bg-bg-400/50 text-primary-500 border border-transparent hover:border-primary-600 hover:text-primary-300"
                }`}
                data-testid={`section-toggle-${id}`}
              >
                {SECTION_NAMES[id]}
              </button>
            )}
          </For>
        </div>
      </div>
    </div>
  );
}

interface SectionProps {
  id: SectionId;
  title: string;
  description: string;
  children: JSX.Element;
  class?: string;
  visibleSections: Accessor<Set<SectionId>>;
}

export function Section(props: SectionProps) {
  return (
    <Show when={props.visibleSections().has(props.id)}>
      <section
        id={props.id}
        class={`vui-feature-card ${props.class ?? ""}`}
        data-testid={`section-${props.id}`}
      >
        <h3 class="vui-feature-card__title">{props.title}</h3>
        <p class="vui-feature-card__description" style={{ "margin-bottom": "1rem" }}>
          {props.description}
        </p>
        {props.children}
      </section>
    </Show>
  );
}
