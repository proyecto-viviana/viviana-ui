/**
 * Menu compatibility surface.
 *
 * Exposes React Stately-like menu hook names while using existing
 * Solid menu state primitives.
 */

export {
  createMenuState,
  createMenuTriggerState,
  type MenuStateProps,
  type MenuState,
  type MenuTriggerStateProps,
  type MenuTriggerState,
} from '../collections/createMenuState';

export {
  createMenuTriggerState as useMenuTriggerState,
} from '../collections/createMenuState';
