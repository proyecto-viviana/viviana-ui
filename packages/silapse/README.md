# @proyecto-viviana/silapse

Styled UI components for SolidJS - beautiful, accessible, and ready to use.

## Installation

```bash
pnpm add @proyecto-viviana/silapse solid-js
```

## Setup

Import the CSS in your app entry point:

```tsx
import "@proyecto-viviana/silapse/styles.css";
```

## Quick Start

```tsx
import { Button, TextField, Select } from "@proyecto-viviana/silapse";
import "@proyecto-viviana/silapse/styles.css";

function App() {
  return (
    <div>
      <TextField label="Email" placeholder="Enter your email" />
      <Button variant="accent" onPress={() => alert("Hello!")}>
        Submit
      </Button>
    </div>
  );
}
```

## Available Components

### Form Controls

| Component | Description |
|-----------|-------------|
| Button | Action buttons with variants |
| TextField | Text input with label |
| NumberField | Numeric input with inc/dec |
| SearchField | Search input with clear |
| Slider | Range slider |
| Checkbox, CheckboxGroup | Checkboxes |
| RadioGroup, Radio | Radio buttons |
| ToggleSwitch | Toggle switch |

### Selection

| Component | Description |
|-----------|-------------|
| Select | Dropdown select |
| Menu, MenuItem | Action menus |
| ListBox, ListBoxOption | Selectable lists |

### Navigation

| Component | Description |
|-----------|-------------|
| Tabs, TabList, Tab, TabPanel | Tabbed navigation |
| Breadcrumbs, BreadcrumbItem | Breadcrumb trail |
| Link | Accessible links |
| Landmark, SkipLink, LandmarkNavigator | ARIA landmarks with F6 navigation |

### Data Display

| Component | Description |
|-----------|-------------|
| Table | Data tables with sorting/selection |
| GridList, GridListItem | Grid lists with keyboard nav |
| Tree, TreeItem | Hierarchical tree views |

### Color

| Component | Description |
|-----------|-------------|
| ColorSlider | Single channel color slider |
| ColorArea | 2D color gradient picker |
| ColorWheel | Circular hue picker |
| ColorField | Hex/RGB color input |
| ColorSwatch | Color preview |
| ColorPicker | Complete color picker |

### Feedback

| Component | Description |
|-----------|-------------|
| Alert | Informational alerts |
| Badge | Status badges |
| ProgressBar | Progress indicators |
| Tooltip | Contextual tooltips |
| Dialog | Modal dialogs |

### Layout

| Component | Description |
|-----------|-------------|
| Separator | Visual dividers |
| Avatar, AvatarGroup | User avatars |

### Custom Components

| Component | Description |
|-----------|-------------|
| Chip | Tag-like chips |
| ProfileCard | User profile cards |
| EventCard | Event display |
| CalendarCard | Calendar widget |
| Conversation | Chat bubbles |
| LateralNav | Side navigation |
| PageLayout | Page structure |

## Examples

### Button

```tsx
<Button>Default</Button>
<Button variant="accent">Accent</Button>
<Button variant="negative">Delete</Button>
<Button style="outline">Outline</Button>
```

### TextField

```tsx
<TextField label="Name" placeholder="Enter your name" />
<TextField label="Email" type="email" isRequired />
```

### Select

```tsx
<Select
  label="Country"
  items={[
    { key: "us", label: "United States" },
    { key: "uk", label: "United Kingdom" },
  ]}
  onSelectionChange={(key) => console.log(key)}
/>
```

### Tabs

```tsx
<Tabs defaultSelectedKey="overview">
  <TabList>
    <Tab id="overview">Overview</Tab>
    <Tab id="features">Features</Tab>
  </TabList>
  <TabPanel id="overview">Overview content</TabPanel>
  <TabPanel id="features">Features content</TabPanel>
</Tabs>
```

## Sizes

Most components support size variants:

```tsx
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

## Theming

Customize via CSS variables:

```css
:root {
  --color-primary-100: #your-color;
  --color-accent: #your-accent;
}
```

## TypeScript

Full TypeScript support:

```tsx
import { Button, type ButtonProps } from "@proyecto-viviana/silapse";
```

## License

MIT
