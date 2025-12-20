// Re-export state from solid-stately
export { createToggleState } from '@proyecto-viviana/solid-stately';
export type { ToggleStateOptions, ToggleState } from '@proyecto-viviana/solid-stately';

// ARIA hook (solidaria-specific)
export { createToggle } from './createToggle';
export type { AriaToggleProps, ToggleAria } from './createToggle';
