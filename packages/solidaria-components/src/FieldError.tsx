/**
 * FieldError primitive for solidaria-components.
 *
 * Displays validation errors for a field from context or explicit validation prop.
 * Port direction: react-aria-components/src/FieldError.tsx
 */

import { type JSX, createContext, createMemo, splitProps, useContext } from 'solid-js';
import type { ValidationResult } from '@proyecto-viviana/solid-stately';
import {
  type ClassNameOrFunction,
  type StyleOrFunction,
  type RenderChildren,
  type SlotProps,
  useRenderProps,
  filterDOMProps,
} from './utils';

export type FieldErrorRenderProps = ValidationResult;

export interface FieldErrorProps
  extends Omit<JSX.HTMLAttributes<HTMLElement>, 'children' | 'class' | 'style'>,
    SlotProps {
  /** Validation result. Falls back to context when omitted. */
  validation?: ValidationResult | null;
  /** The children of the component. */
  children?: RenderChildren<FieldErrorRenderProps>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<FieldErrorRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<FieldErrorRenderProps>;
}

export const FieldErrorContext = createContext<ValidationResult | null>(null);

export function FieldError(props: FieldErrorProps): JSX.Element | null {
  const contextValidation = useContext(FieldErrorContext);
  const [local, domProps] = splitProps(props, ['validation', 'children', 'class', 'style', 'slot']);

  const validation = createMemo<ValidationResult | null>(() => local.validation ?? contextValidation);
  if (!validation()?.isInvalid) return null;

  const renderProps = useRenderProps(
    {
      children: local.children ?? validation()!.validationErrors.join(' '),
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-FieldError',
    },
    () => validation()!
  );

  if (renderProps.renderChildren() == null) return null;

  const filteredDomProps = filterDOMProps(domProps, { global: true });

  return (
    <div
      {...filteredDomProps}
      slot={local.slot ?? 'errorMessage'}
      class={renderProps.class()}
      style={renderProps.style()}
    >
      {renderProps.renderChildren()}
    </div>
  );
}
