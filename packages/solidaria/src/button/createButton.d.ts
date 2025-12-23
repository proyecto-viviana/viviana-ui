import type { AriaButtonProps, ButtonAria } from './types';
/**
 * Provides the behavior and accessibility implementation for a button component.
 * Handles press interactions across mouse, touch, keyboard and screen readers.
 *
 * Based on react-aria's useButton but adapted for SolidJS.
 *
 * @example
 * ```tsx
 * import { createButton } from 'solidaria';
 *
 * function Button(props) {
 *   let ref;
 *   const { buttonProps, isPressed } = createButton(props);
 *
 *   return (
 *     <button
 *       {...buttonProps}
 *       ref={ref}
 *       class={isPressed() ? 'pressed' : ''}
 *     >
 *       {props.children}
 *     </button>
 *   );
 * }
 * ```
 */
export declare function createButton(props?: AriaButtonProps): ButtonAria;
//# sourceMappingURL=createButton.d.ts.map