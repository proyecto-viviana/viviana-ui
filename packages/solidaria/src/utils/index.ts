export { mergeProps } from './mergeProps';
export { filterDOMProps, type FilterDOMPropsOptions } from './filterDOMProps';

// Platform detection
export {
  isMac,
  isIPhone,
  isIPad,
  isIOS,
  isAppleDevice,
  isWebKit,
  isChrome,
  isAndroid,
  isFirefox,
} from './platform';

// DOM utilities
export {
  getOwnerDocument,
  getOwnerWindow,
  nodeContains,
  getEventTarget,
  isFocusable,
  isValidKeyboardEvent,
  isValidInputKey,
  isHTMLAnchorLink,
  shouldPreventDefaultKeyboard,
  shouldPreventDefaultUp,
  openLink,
} from './dom';

// Geometry utilities
export {
  areRectanglesOverlapping,
  getPointClientRect,
  isPointOverTarget,
  getTouchFromEvent,
  getTouchById,
  type Rect,
  type EventPoint,
} from './geometry';

// Event utilities
export {
  isVirtualClick,
  isVirtualPointerEvent,
  createMouseEvent,
  chain,
  setEventTarget,
} from './events';

// Text selection management
export { disableTextSelection, restoreTextSelection } from './textSelection';

// Focus utilities
export { focusWithoutScrolling, focusSafely, preventFocus } from './focus';

// Global listener management
export {
  createGlobalListeners,
  addGlobalListenerOnce,
  type GlobalListenerOptions,
} from './globalListeners';
