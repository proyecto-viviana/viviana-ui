// Scroll prevention
export { createPreventScroll, type PreventScrollOptions } from './createPreventScroll';

// Overlay trigger
export {
  createOverlayTrigger,
  onCloseMap,
  type OverlayTriggerProps,
  type OverlayTriggerAria,
} from './createOverlayTrigger';

// Overlay behavior
export {
  createOverlay,
  type AriaOverlayProps,
  type OverlayAria,
} from './createOverlay';

// Interact outside detection
export {
  createInteractOutside,
  type InteractOutsideProps,
} from './createInteractOutside';

// Aria hiding
export {
  ariaHideOutside,
  keepVisible,
  type AriaHideOutsideOptions,
} from './ariaHideOutside';

// Modal
export {
  ModalProvider,
  OverlayProvider,
  OverlayContainer,
  useModalProvider,
  createModal,
  type ModalProviderProps,
  type ModalProviderAria,
  type OverlayContainerProps,
  type AriaModalOptions,
  type ModalAria,
} from './createModal';
