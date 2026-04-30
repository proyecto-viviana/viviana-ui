# @proyecto-viviana/solidaria-components

Pre-wired headless components for SolidJS - a port of [React Aria Components](https://react-spectrum.adobe.com/react-aria/components.html).

## Installation

```bash
npm install @proyecto-viviana/solidaria-components solid-js
```

## Overview

solidaria-components provides ready-to-use headless components that combine state management and accessibility in one package. Unlike the lower-level hooks in solidaria, these components handle all the wiring for you while giving you full control over styling through render props and data attributes.

## Available Components

### Form Controls

| Component | Description |
|-----------|-------------|
| Button | Accessible button with press states |
| Checkbox, CheckboxGroup | Checkboxes with group support |
| Radio, RadioGroup | Radio buttons |
| ToggleSwitch | Toggle switch control |
| TextField, Input, TextArea, Label | Text inputs with labels |
| NumberField | Numeric input with inc/dec buttons |
| SearchField | Search input with clear button |
| Slider, SliderTrack, SliderThumb | Range slider |

### Navigation

| Component | Description |
|-----------|-------------|
| Tabs, TabList, Tab, TabPanel | Tabbed navigation |
| Breadcrumbs, BreadcrumbItem | Breadcrumb navigation |
| Link | Accessible link |
| Landmark | ARIA landmark regions with F6 navigation |

### Selection

| Component | Description |
|-----------|-------------|
| Select, SelectTrigger, SelectValue, SelectListBox, SelectOption | Dropdown select |
| Menu, MenuItem, MenuTrigger, MenuButton | Action menus |
| ListBox, ListBoxOption | Selectable lists |

### Feedback & Layout

| Component | Description |
|-----------|-------------|
| ProgressBar | Progress indicator |
| Separator | Visual divider |
| VisuallyHidden | Screen reader only content |

## Usage

### Render Props Pattern

Components expose state through render props for full styling control:

```tsx
import { Button } from "@proyecto-viviana/solidaria-components";

function MyButton() {
  return (
    <Button onPress={() => console.log("pressed")}>
      {({ isPressed, isHovered, isFocusVisible }) => (
        <span
          class={`btn ${isPressed() ? "pressed" : ""} ${isHovered() ? "hovered" : ""}`}
        >
          Click me
        </span>
      )}
    </Button>
  );
}
```

### Data Attributes

Components also expose state via data attributes for CSS styling:

```tsx
import { Button } from "@proyecto-viviana/solidaria-components";

function MyButton() {
  return (
    <Button class="my-button" onPress={() => {}}>
      Click me
    </Button>
  );
}
```

```css
.my-button {
  background: blue;
}
.my-button[data-pressed] {
  background: darkblue;
}
.my-button[data-hovered] {
  background: lightblue;
}
.my-button[data-focus-visible] {
  outline: 2px solid white;
}
```

### Checkbox Example

```tsx
import { Checkbox, CheckboxGroup } from "@proyecto-viviana/solidaria-components";

function Preferences() {
  return (
    <CheckboxGroup>
      {({ groupProps }) => (
        <div {...groupProps}>
          <Checkbox value="newsletter">
            {({ inputProps, isSelected }) => (
              <label>
                <input {...inputProps} />
                <span class={isSelected() ? "checked" : ""}>
                  Subscribe to newsletter
                </span>
              </label>
            )}
          </Checkbox>
          <Checkbox value="updates">
            {({ inputProps, isSelected }) => (
              <label>
                <input {...inputProps} />
                <span class={isSelected() ? "checked" : ""}>
                  Receive updates
                </span>
              </label>
            )}
          </Checkbox>
        </div>
      )}
    </CheckboxGroup>
  );
}
```

### Select Example

```tsx
import { Select, SelectTrigger, SelectValue, SelectListBox, SelectOption } from "@proyecto-viviana/solidaria-components";

const countries = [
  { key: "us", label: "United States" },
  { key: "uk", label: "United Kingdom" },
  { key: "ca", label: "Canada" },
];

function CountrySelect() {
  return (
    <Select items={countries} onSelectionChange={(key) => console.log(key)}>
      <SelectTrigger>
        <SelectValue placeholder="Select a country" />
      </SelectTrigger>
      <SelectListBox>
        {(item) => (
          <SelectOption key={item.key}>
            {({ isSelected, isFocused }) => (
              <span class={`option ${isSelected() ? "selected" : ""}`}>
                {item.label}
              </span>
            )}
          </SelectOption>
        )}
      </SelectListBox>
    </Select>
  );
}
```

### Tabs Example

```tsx
import { Tabs, TabList, Tab, TabPanel } from "@proyecto-viviana/solidaria-components";

const tabs = [
  { id: "overview", label: "Overview", content: "Overview content here" },
  { id: "features", label: "Features", content: "Features content here" },
  { id: "pricing", label: "Pricing", content: "Pricing content here" },
];

function Navigation() {
  return (
    <Tabs items={tabs} defaultSelectedKey="overview">
      <TabList>
        {(item) => (
          <Tab id={item.id}>
            {({ isSelected }) => (
              <span class={isSelected() ? "active" : ""}>{item.label}</span>
            )}
          </Tab>
        )}
      </TabList>
      {tabs.map((tab) => (
        <TabPanel key={tab.id}>{tab.content}</TabPanel>
      ))}
    </Tabs>
  );
}
```

### Slider Example

```tsx
import { Slider, SliderTrack, SliderThumb, SliderOutput } from "@proyecto-viviana/solidaria-components";

function VolumeSlider() {
  return (
    <Slider defaultValue={50} minValue={0} maxValue={100}>
      {({ value, getValuePercent }) => (
        <>
          <div class="label-row">
            <span>Volume</span>
            <SliderOutput />
          </div>
          <SliderTrack>
            {({ isDragging }) => (
              <div class={`track ${isDragging() ? "dragging" : ""}`}>
                <div class="fill" style={{ width: `${getValuePercent() * 100}%` }} />
                <SliderThumb>
                  {({ isFocusVisible }) => (
                    <div class={`thumb ${isFocusVisible() ? "focused" : ""}`} />
                  )}
                </SliderThumb>
              </div>
            )}
          </SliderTrack>
        </>
      )}
    </Slider>
  );
}
```

## Context

Components provide context for nested access:

```tsx
import { TabsStateContext } from "@proyecto-viviana/solidaria-components";

function CustomTabIndicator() {
  const state = useContext(TabsStateContext);
  return <div>Selected: {state?.selectedKey()}</div>;
}
```

## Styling Approaches

### 1. Render Props (Most Control)

```tsx
<Button>
  {({ isPressed, isHovered }) => (
    <span style={{ background: isPressed() ? "red" : isHovered() ? "pink" : "blue" }}>
      Click
    </span>
  )}
</Button>
```

### 2. Data Attributes (CSS)

```tsx
<Button class="btn">Click</Button>
```

```css
.btn[data-pressed] { background: red; }
.btn[data-hovered] { background: pink; }
```

### 3. Class Functions

```tsx
<Button class={({ isPressed }) => isPressed() ? "pressed" : "normal"}>
  Click
</Button>
```

## TypeScript

Full TypeScript support with exported types:

```tsx
import {
  Button,
  type ButtonProps,
  type ButtonRenderProps,
} from "@proyecto-viviana/solidaria-components";
```

## License

MIT
