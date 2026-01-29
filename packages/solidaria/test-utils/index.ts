/**
 * @proyecto-viviana/solidaria test utilities
 *
 * Utilities for testing accessible SolidJS components built with solidaria.
 * Provides helpers for simulating user interactions, querying ARIA attributes,
 * and asserting accessibility patterns.
 */

export {
  // Pointer event utilities
  pointerMap,
  createPointerEvent,
  pointerEvent,
  firePointerDown,
  firePointerUp,
  firePointerClick,
  type PointerMapEntry,
  type PointerEventOptions,
} from './pointer';

export {
  // User interaction utilities
  setupUser,
  press,
  longPress,
  hover,
  type UserEventInstance,
  type PressOptions,
  type LongPressOptions,
  type HoverOptions,
} from './interactions';

export {
  // ARIA testing utilities
  getAriaRole,
  hasAriaLabel,
  getAriaLabel,
  getAriaDescribedBy,
  getAriaLabelledBy,
  isAriaDisabled,
  isAriaExpanded,
  isAriaPressed,
  isAriaChecked,
  isAriaSelected,
  isAriaRequired,
  isAriaInvalid,
  isAriaHidden,
  isAriaBusy,
  getAriaControls,
  getAriaOwns,
  getAriaActiveDescendant,
  getAriaValueNow,
  getAriaValueMin,
  getAriaValueMax,
  getAriaValueText,
  getAriaLevel,
  getAriaSetSize,
  getAriaPosInSet,
  type AriaState,
} from './aria';

export {
  // Focus testing utilities
  getFocusedElement,
  isFocused,
  isFocusWithin,
  getFocusableElements,
  getTabbableElements,
  simulateFocusVisible,
  waitForFocus,
  type FocusableSelector,
} from './focus';

export {
  // Component testers
  createButtonTester,
  createCheckboxTester,
  createRadioGroupTester,
  createListBoxTester,
  createMenuTester,
  createSelectTester,
  createTabsTester,
  createDialogTester,
  type ButtonTester,
  type CheckboxTester,
  type RadioGroupTester,
  type ListBoxTester,
  type MenuTester,
  type SelectTester,
  type TabsTester,
  type DialogTester,
} from './testers';

export {
  // Test setup utilities
  installPointerEventPolyfill,
  installResizeObserverPolyfill,
  installIntersectionObserverPolyfill,
  setupTestEnvironment,
  cleanupTestEnvironment,
} from './setup';
