// Re-export state from solid-stately
export { createToggleState } from 'solid-stately';
export type { ToggleStateOptions, ToggleState } from 'solid-stately';

// ARIA hook (solidaria-specific)
export { createToggle } from './createToggle';
export type { AriaToggleProps, ToggleAria } from './createToggle';
