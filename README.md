# Proyecto Viviana

A comprehensive SolidJS component library inspired by Adobe's React Aria and React Spectrum. This monorepo provides a complete solution for building accessible, high-quality user interfaces with SolidJS.

## Packages

| Package | Version | Description |
|---------|---------|-------------|
| [@proyecto-viviana/solid-stately](./packages/solid-stately) | 0.2.5 | State management for UI components (port of React Stately) |
| [@proyecto-viviana/solidaria](./packages/solidaria) | 0.2.6 | Accessibility primitives (port of React Aria) |
| [@proyecto-viviana/solidaria-components](./packages/solidaria-components) | 0.2.7 | Pre-wired headless components (port of React Aria Components) |
| [@proyecto-viviana/silapse](./packages/silapse) | 0.4.0 | Styled UI components with Tailwind CSS |

## Architecture

The library follows a 4-layer architecture pattern:

```
┌─────────────────────────────────────────────────────┐
│                    @proyecto-viviana/silapse              │  Styled components
│         (Tailwind CSS, design tokens, variants)      │
└─────────────────────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────────┐
│           @proyecto-viviana/solidaria-components     │  Headless components
│      (Pre-wired state + accessibility, render props) │
└─────────────────────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────────┐
│               @proyecto-viviana/solidaria            │  ARIA hooks
│        (Accessibility behavior, keyboard, focus)     │
└─────────────────────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────────┐
│             @proyecto-viviana/solid-stately          │  State management
│           (Signals, reactive state, collections)     │
└─────────────────────────────────────────────────────┘
```

## Quick Start

### Installation

```bash
# For styled components (recommended)
bun add @proyecto-viviana/silapse solid-js

# For headless components
bun add @proyecto-viviana/solidaria-components solid-js

# For maximum control (hooks only)
bun add @proyecto-viviana/solidaria @proyecto-viviana/solid-stately solid-js
```

### Basic Usage

```tsx
import { Button, TextField, Select } from '@proyecto-viviana/silapse';
import '@proyecto-viviana/silapse/styles.css';

function App() {
  return (
    <div>
      <TextField label="Name" placeholder="Enter your name" />
      <Button variant="accent" onPress={() => alert('Hello!')}>
        Say Hello
      </Button>
    </div>
  );
}
```

## Release Management

- `package.json` is the only version source of truth for releasable packages.
- Changesets defines release intent and updates npm package versions.

Recommended PR flow before pushing:

```bash
bun run pr:check:fast
```

That mirrors the blocking non-Playwright CI checks:

- `bun run ci:changesets`
- `bun run ci:release-readiness`

When a PR changes the web app, accessibility surface, or CI wiring, run the full local PR gate too:

```bash
bun run pr:check
```

That adds `bun run ci:a11y`, which mirrors the blocking accessibility workflow. For stricter manual audits beyond the merge bar, run:

```bash
bun run a11y:full
```

Recommended local flow:

```bash
bun run changeset
bun run release:prepare
```

`bun run release:prepare` applies Changesets version bumps and then runs `bun run ci:release-readiness`.

When the generated changes look correct:

```bash
bun run release:publish
```

If you want the full end-to-end flow in one command:

```bash
bun run release
```

GitHub automation on `main`:

- merging a feature PR with changesets triggers the `Release` workflow
- that workflow creates or updates the Changesets version PR
- merging the version PR publishes changed packages to npm
- npm publishing uses trusted publishing via GitHub OIDC and does not need `NPM_TOKEN`

## Available Components

### Form Controls
- **Button** - Action buttons with variants (primary, secondary, accent, negative)
- **Checkbox / CheckboxGroup** - Single and grouped checkboxes
- **Radio / RadioGroup** - Radio button groups
- **TextField** - Text input with label and validation
- **NumberField** - Numeric input with increment/decrement
- **SearchField** - Search input with clear button
- **Slider** - Range input with track and thumb
- **Switch** - Toggle switches

### Navigation
- **Tabs** - Tabbed navigation with panels
- **Breadcrumbs** - Navigation breadcrumb trail
- **Link** - Accessible links

### Selection
- **Select** - Dropdown selection
- **Menu** - Action menus with trigger
- **ListBox** - Selectable lists

### Feedback
- **Alert** - Informational alerts
- **Badge** - Status badges
- **ProgressBar** - Progress indicators
- **Tooltip** - Contextual tooltips
- **Dialog** - Modal dialogs

### Layout
- **Separator** - Visual dividers
- **PageLayout** - Page structure
- **LateralNav** - Side navigation

### Custom Components
- **Avatar / AvatarGroup** - User avatars
- **Chip** - Tag-like chips
- **ProfileCard** - User profile cards
- **EventCard** - Event display cards
- **CalendarCard** - Calendar widgets
- **Conversation** - Chat bubbles
- **TimelineItem** - Timeline entries
- **SharedElementTransition** - Scoped shared element animation helpers

## Hooks Reference

### State Management (solid-stately)

| Hook | Description |
|------|-------------|
| `createToggleState` | Boolean toggle state |
| `createCheckboxGroupState` | Checkbox group selection |
| `createRadioGroupState` | Radio group selection |
| `createOverlayTriggerState` | Overlay open/close state |
| `createListState` | List with selection and focus |
| `createSingleSelectListState` | Single selection list |
| `createSelectionState` | Selection management |
| `createMenuState` | Menu state with actions |
| `createMenuTriggerState` | Menu trigger state |
| `createSelectState` | Select dropdown state |
| `createTabListState` | Tab navigation state |
| `createNumberFieldState` | Numeric input state |
| `createSearchFieldState` | Search input state |
| `createSliderState` | Slider/range state |
| `createTextFieldState` | Text input state |

### Accessibility Hooks (solidaria)

| Hook | Description |
|------|-------------|
| `createButton` | Button with press handling |
| `createToggleButton` | Toggle button with pressed state |
| `createCheckbox` | Checkbox with indeterminate support |
| `createCheckboxGroup` | Group of checkboxes |
| `createRadio` | Radio button |
| `createRadioGroup` | Radio button group |
| `createSwitch` | Switch/toggle control |
| `createTextField` | Text input field |
| `createNumberField` | Numeric input field |
| `createSearchField` | Search input field |
| `createSlider` | Range slider |
| `createLink` | Accessible link |
| `createTabs` | Tab navigation |
| `createTabList` | Tab list container |
| `createTab` | Individual tab |
| `createTabPanel` | Tab panel content |
| `createBreadcrumbs` | Breadcrumb navigation |
| `createBreadcrumbItem` | Breadcrumb item |
| `createListBox` | Listbox with keyboard navigation |
| `createOption` | Listbox option |
| `createMenu` | Menu with keyboard navigation |
| `createMenuItem` | Menu item |
| `createMenuTrigger` | Menu trigger button |
| `createSelect` | Select dropdown |
| `createHiddenSelect` | Native select for forms |
| `createProgressBar` | Progress indicator |
| `createSeparator` | Visual separator |
| `createPress` | Press events |
| `createHover` | Hover events |
| `createFocusRing` | Focus ring visibility |
| `createFocusable` | Focus management |
| `createLabel` | Label/input association |
| `createField` | Field with label, description, error |
| `createOverlayTrigger` | Overlay trigger |
| `createOverlay` | Overlay behavior |
| `createModal` | Modal dialog |
| `createPreventScroll` | Scroll lock |
| `createInteractOutside` | Click outside detection |

## Examples

### Using Styled Components

```tsx
import { Button, TextField, Checkbox, Select } from '@proyecto-viviana/silapse';
import '@proyecto-viviana/silapse/styles.css';

function Form() {
  const [name, setName] = createSignal('');
  const [agreed, setAgreed] = createSignal(false);

  return (
    <form>
      <TextField
        label="Full Name"
        value={name()}
        onChange={setName}
        size="md"
      />

      <Select
        label="Country"
        items={[
          { key: 'us', label: 'United States' },
          { key: 'uk', label: 'United Kingdom' },
          { key: 'ca', label: 'Canada' },
        ]}
        onSelectionChange={(key) => console.log('Selected:', key)}
      />

      <Checkbox
        isSelected={agreed()}
        onChange={setAgreed}
      >
        I agree to the terms
      </Checkbox>

      <Button variant="accent" type="submit">
        Submit
      </Button>
    </form>
  );
}
```

### Using Headless Components

```tsx
import { Button, TextField, Checkbox } from '@proyecto-viviana/solidaria-components';

function Form() {
  return (
    <form>
      <TextField>
        {({ labelProps, inputProps }) => (
          <>
            <Label {...labelProps}>Email</Label>
            <Input {...inputProps} class="my-input-class" />
          </>
        )}
      </TextField>

      <Checkbox>
        {({ inputProps, isSelected }) => (
          <label class={isSelected ? 'checked' : ''}>
            <input {...inputProps} />
            Subscribe to newsletter
          </label>
        )}
      </Checkbox>

      <Button>
        {({ buttonProps, isPressed }) => (
          <button
            {...buttonProps}
            class={isPressed ? 'pressed' : ''}
          >
            Submit
          </button>
        )}
      </Button>
    </form>
  );
}
```

### Using Low-Level Hooks

```tsx
import { createButton, createCheckbox } from '@proyecto-viviana/solidaria';
import { createToggleState } from '@proyecto-viviana/solid-stately';

function CustomButton(props) {
  let ref;
  const { buttonProps, isPressed } = createButton(props, () => ref);

  return (
    <button
      {...buttonProps}
      ref={ref}
      class={isPressed() ? 'pressed' : ''}
    >
      {props.children}
    </button>
  );
}

function CustomCheckbox(props) {
  let ref;
  const state = createToggleState(props);
  const { inputProps, labelProps } = createCheckbox(props, state, () => ref);

  return (
    <label {...labelProps}>
      <input {...inputProps} ref={ref} />
      <span class={state.isSelected() ? 'checked' : ''}>
        {props.children}
      </span>
    </label>
  );
}
```

## Development

> Primary runtime: Bun >= 1.0. Use `bun run ...` for build, dev, tests, guards, and release preparation.

### Prerequisites

- [Bun](https://bun.sh/) >= 1.0

### Setup

```bash
# Clone the repository
git clone https://github.com/proyecto-viviana/proyecto-viviana.git
cd proyecto-viviana

# Install dependencies
bun install

# Build all packages
bun run build

# Start development server
bun run dev
```

### Scripts

| Command | Description |
|---------|-------------|
| `bun install` | Install workspace dependencies |
| `bun run build` | Typecheck and build all packages |
| `bun run dev` | Start development server (playground) |
| `bun run test:run` | Run tests once |
| `bun run test:watch` | Run tests in watch mode |
| `bun run typecheck` | TypeScript type checking |
| `bun run changeset` | Create a changeset for releasable package changes |
| `bun run changeset:version` | Apply version bumps + changelog updates |
| `bun run changeset:publish` | Build and publish changed packages to npm |
| `bun run release:prepare` | Apply version bumps, build, and run the Vitest suite |
| `bun run release:publish` | Publish npm packages |
| `bun run release` | Run the full release flow: prepare, then publish |

Release and publish policy is documented in [`docs/release-policy.md`](./docs/release-policy.md).

### Project Structure

```
proyecto-viviana/
├── apps/
│   └── web/                    # Demo/playground application
├── packages/
│   ├── solid-stately/          # State management (React Stately port)
│   │   └── src/
│   │       ├── toggle/         # Toggle state
│   │       ├── checkbox/       # Checkbox group state
│   │       ├── radio/          # Radio group state
│   │       ├── overlays/       # Overlay trigger state
│   │       ├── collections/    # List, selection, menu states
│   │       ├── select/         # Select state
│   │       ├── tabs/           # Tab list state
│   │       ├── numberfield/    # Number field state
│   │       ├── searchfield/    # Search field state
│   │       ├── slider/         # Slider state
│   │       └── textfield/      # Text field state
│   │
│   ├── solidaria/              # ARIA hooks (React Aria port)
│   │   └── src/
│   │       ├── button/         # Button, toggle button
│   │       ├── checkbox/       # Checkbox, checkbox group
│   │       ├── radio/          # Radio, radio group
│   │       ├── switch/         # Switch toggle
│   │       ├── textfield/      # Text field
│   │       ├── numberfield/    # Number field
│   │       ├── searchfield/    # Search field
│   │       ├── slider/         # Slider
│   │       ├── interactions/   # Press, hover, focus
│   │       ├── label/          # Label, field
│   │       ├── link/           # Link
│   │       ├── progress/       # Progress bar
│   │       ├── separator/      # Separator
│   │       ├── overlays/       # Overlay, modal, interact outside
│   │       ├── listbox/        # ListBox, option
│   │       ├── menu/           # Menu, menu item, trigger
│   │       ├── select/         # Select, hidden select
│   │       ├── tabs/           # Tabs, tab, tab panel
│   │       └── breadcrumbs/    # Breadcrumbs
│   │
│   ├── solidaria-components/   # Headless components (RAC port)
│   │   └── src/
│   │       ├── Button.tsx
│   │       ├── Checkbox.tsx
│   │       ├── RadioGroup.tsx
│   │       ├── Switch.tsx
│   │       ├── TextField.tsx
│   │       ├── NumberField.tsx
│   │       ├── SearchField.tsx
│   │       ├── Slider.tsx
│   │       ├── Link.tsx
│   │       ├── ProgressBar.tsx
│   │       ├── Separator.tsx
│   │       ├── ListBox.tsx
│   │       ├── Menu.tsx
│   │       ├── Select.tsx
│   │       ├── Tabs.tsx
│   │       └── Breadcrumbs.tsx
│   │
│   └── silapse/                     # Styled components
│       └── src/
│           ├── button/         # Styled button
│           ├── checkbox/       # Styled checkbox
│           ├── radio/          # Styled radio
│           ├── switch/         # Styled switch
│           ├── textfield/      # Styled text field
│           ├── numberfield/    # Styled number field
│           ├── searchfield/    # Styled search field
│           ├── slider/         # Styled slider
│           ├── select/         # Styled select
│           ├── menu/           # Styled menu
│           ├── listbox/        # Styled listbox
│           ├── tabs/           # Styled tabs
│           ├── breadcrumbs/    # Styled breadcrumbs
│           ├── dialog/         # Modal dialog
│           ├── tooltip/        # Tooltip
│           ├── alert/          # Alert
│           ├── badge/          # Badge
│           ├── progress-bar/   # Progress bar
│           ├── separator/      # Separator
│           ├── link/           # Link
│           ├── avatar/         # Avatar
│           ├── icon/           # Icons
│           └── custom/         # Custom components
│               ├── chip/
│               ├── nav-header/
│               ├── lateral-nav/
│               ├── profile-card/
│               ├── event-card/
│               ├── calendar-card/
│               ├── conversation/
│               └── timeline-item/
│
└── react-spectrum/             # Reference implementation (read-only)
```

## Key Features

- **Full Accessibility** - WAI-ARIA compliant with keyboard navigation and screen reader support
- **SSR Support** - Server-side rendering compatible with proper hydration
- **Type Safe** - Full TypeScript support with exported types
- **Fine-grained Reactivity** - Built on SolidJS signals for optimal performance
- **Customizable** - Multiple abstraction levels for different needs
- **Tree Shakeable** - Only import what you use
- **Internationalization Ready** - Number formatting, RTL support

## Performance

Proyecto Viviana leverages SolidJS's fine-grained reactivity for significantly smaller bundle sizes compared to React Spectrum:

- **75% smaller** for individual components (Button: 15.7 KB vs 62.7 KB gzipped)
- **76% smaller** for multiple components (4 components: 29.6 KB vs 123.8 KB gzipped)
- **72% smaller** for full library (117 KB vs 418 KB gzipped)

These improvements come from SolidJS's compiled reactivity model, which eliminates the need for React's ~40 KB virtual DOM runtime. The smaller bundles mean faster load times, especially on mobile and slow networks.

**Important:** These are bundle size comparisons, not runtime speed benchmarks. SolidJS and React have fundamentally different architectures with different trade-offs. See [performance benchmarks](./.claude/docs/performance.md) for detailed methodology, caveats, and how to reproduce results.

### When to Choose Proyecto Viviana

✅ **Good fit if:**
- Bundle size is critical (mobile apps, slow networks)
- Using SolidJS already or willing to learn
- Need 10-30+ components (where bundle savings compound)
- Performance-sensitive applications

❌ **Consider alternatives if:**
- Need mature ecosystem with extensive third-party libraries
- Team is React-focused and SolidJS learning curve is a concern
- Using Adobe Creative Cloud integrations

### Benchmark Transparency

All benchmark code, methodology, and results are publicly available:
- Benchmarks: [`benchmarks/`](./benchmarks/)
- Documentation: [`.claude/docs/performance.md`](./.claude/docs/performance.md)
- Reproduce: `bun run bench:bundle`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Credits

Inspired by and based on Adobe's [React Spectrum](https://react-spectrum.adobe.com/) libraries:
- [React Stately](https://react-spectrum.adobe.com/react-stately/)
- [React Aria](https://react-spectrum.adobe.com/react-aria/)
- [React Aria Components](https://react-spectrum.adobe.com/react-aria/components.html)
