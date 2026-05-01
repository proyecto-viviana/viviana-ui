# @proyecto-viviana/solid-spectrum

Spectrum 2-compatible styled Solid components.

## Styling Rule

`solid-spectrum` styling must come from an S2-compatible tokens/theme/component
style declaration system.

Do not implement S2 parity with handwritten component CSS.

See
[`../../docs/adr/0001-s2-styling-source-of-truth.md`](../../docs/adr/0001-s2-styling-source-of-truth.md).

## Status

The styling system is being reset. Components not migrated to the corrected S2
style system should be treated as incomplete for pixel parity.

## Usage

```tsx
import { Provider } from "@proyecto-viviana/solid-spectrum";
import "@proyecto-viviana/solid-spectrum/styles.css";

export function App() {
  return <Provider colorScheme="dark">{/* migrated components */}</Provider>;
}
```
