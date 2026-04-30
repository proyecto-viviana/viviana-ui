export type ReactSpectrumCatalogueCategory =
  | "Application"
  | "Layout"
  | "Buttons"
  | "Category Name"
  | "Collections"
  | "Color"
  | "Date and Time"
  | "Drag and drop"
  | "Forms"
  | "Icons"
  | "Navigation"
  | "Overlays"
  | "Pickers"
  | "Status"
  | "Content";

export interface ReactSpectrumCatalogueEntry {
  slug: string;
  title: string;
  category: ReactSpectrumCatalogueCategory;
  docsPath: string;
}

const reactSpectrumDocsBase = "https://react-spectrum.adobe.com/v3";

function component(
  category: ReactSpectrumCatalogueCategory,
  title: string,
  slug = title.toLowerCase(),
): ReactSpectrumCatalogueEntry {
  return {
    slug,
    title,
    category,
    docsPath: `${reactSpectrumDocsBase}/${title.replace(/\s+/g, "")}.html`,
  };
}

export const reactSpectrumCatalogue = [
  component("Application", "Provider"),

  component("Layout", "Flex"),
  component("Layout", "Grid"),

  component("Buttons", "ActionButton"),
  component("Buttons", "ActionGroup"),
  component("Buttons", "Button"),
  component("Buttons", "ButtonGroup"),
  component("Buttons", "FileTrigger"),
  component("Buttons", "LogicButton"),
  component("Buttons", "ToggleButton"),

  component("Category Name", "StepList"),

  component("Collections", "ActionBar"),
  component("Collections", "ActionMenu"),
  component("Collections", "ListBox"),
  component("Collections", "ListView"),
  component("Collections", "Menu"),
  component("Collections", "MenuTrigger"),
  component("Collections", "TableView"),
  component("Collections", "TagGroup"),
  component("Collections", "TreeView"),

  component("Color", "ColorArea"),
  component("Color", "ColorField"),
  component("Color", "ColorPicker"),
  component("Color", "ColorSlider"),
  component("Color", "ColorSwatch"),
  component("Color", "ColorSwatchPicker"),
  component("Color", "ColorWheel"),

  component("Date and Time", "Calendar"),
  component("Date and Time", "DateField"),
  component("Date and Time", "DatePicker"),
  component("Date and Time", "DateRangePicker"),
  component("Date and Time", "RangeCalendar"),
  component("Date and Time", "TimeField"),

  component("Drag and drop", "DropZone"),

  component("Forms", "Checkbox"),
  component("Forms", "CheckboxGroup"),
  component("Forms", "Form"),
  component("Forms", "NumberField"),
  component("Forms", "RadioGroup"),
  component("Forms", "RangeSlider"),
  component("Forms", "SearchField"),
  component("Forms", "Slider"),
  component("Forms", "Switch"),
  component("Forms", "TextArea"),
  component("Forms", "TextField"),

  component("Icons", "Custom Icons", "customicons"),
  component("Icons", "Workflow Icons", "workflowicons"),

  component("Navigation", "Accordion"),
  component("Navigation", "Breadcrumbs"),
  component("Navigation", "Disclosure"),
  component("Navigation", "Link"),
  component("Navigation", "Tabs"),

  component("Overlays", "AlertDialog"),
  component("Overlays", "ContextualHelp"),
  component("Overlays", "Dialog"),
  component("Overlays", "DialogContainer"),
  component("Overlays", "DialogTrigger"),
  component("Overlays", "Tooltip"),

  component("Pickers", "ComboBox"),
  component("Pickers", "Picker"),
  component("Pickers", "SearchAutocomplete"),

  component("Status", "Badge"),
  component("Status", "InlineAlert"),
  component("Status", "LabeledValue"),
  component("Status", "Meter"),
  component("Status", "ProgressBar"),
  component("Status", "ProgressCircle"),
  component("Status", "StatusLight"),
  component("Status", "Toast"),

  component("Content", "Avatar"),
  component("Content", "Content"),
  component("Content", "Divider"),
  component("Content", "Footer"),
  component("Content", "Header"),
  component("Content", "Heading"),
  component("Content", "IllustratedMessage"),
  component("Content", "Image"),
  component("Content", "Keyboard"),
  component("Content", "Text"),
  component("Content", "View"),
  component("Content", "Well"),
] as const satisfies readonly ReactSpectrumCatalogueEntry[];

export type ReactSpectrumComponentSlug =
  (typeof reactSpectrumCatalogue)[number]["slug"];

export const reactSpectrumCatalogueSource = {
  name: "React Spectrum v3 component catalogue",
  url: `${reactSpectrumDocsBase}/index.html`,
} as const;
