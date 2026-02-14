/**
 * Form primitive for solidaria-components.
 *
 * Provides form-level validation behavior and server validation context.
 * Port direction: react-aria-components/src/Form.tsx
 */

import { type JSX, createContext, splitProps } from 'solid-js';
import {
  FormValidationContext,
  type ValidationErrors,
  type ValidationBehavior,
} from '@proyecto-viviana/solid-stately';
import {
  type ClassNameOrFunction,
  type StyleOrFunction,
  type RenderChildren,
  type SlotProps,
  useRenderProps,
  filterDOMProps,
} from './utils';

export interface FormRenderProps {
  validationBehavior: ValidationBehavior;
}

export interface FormProps
  extends Omit<JSX.FormHTMLAttributes<HTMLFormElement>, 'children' | 'class' | 'style'>,
    SlotProps {
  /** Server-side validation errors keyed by field name. */
  validationErrors?: ValidationErrors;
  /** Validation behavior mode. */
  validationBehavior?: ValidationBehavior;
  /** The children of the component. */
  children?: RenderChildren<FormRenderProps>;
  /** The CSS className for the element. */
  class?: ClassNameOrFunction<FormRenderProps>;
  /** The inline style for the element. */
  style?: StyleOrFunction<FormRenderProps>;
}

export const FormContext = createContext<FormProps | null>(null);

export function Form(props: FormProps): JSX.Element {
  const [local, domProps] = splitProps(props, [
    'validationErrors',
    'validationBehavior',
    'children',
    'class',
    'style',
    'slot',
  ]);

  const validationBehavior: ValidationBehavior = local.validationBehavior ?? 'native';
  const errors = local.validationErrors ?? {};
  const renderProps = useRenderProps(
    {
      children: local.children,
      class: local.class,
      style: local.style,
      defaultClassName: 'solidaria-Form',
    },
    () => ({
      validationBehavior,
    })
  );

  const filteredDomProps = filterDOMProps(domProps, { global: true });

  return (
    <form
      {...filteredDomProps}
      noValidate={validationBehavior !== 'native'}
      class={renderProps.class()}
      style={renderProps.style()}
      slot={local.slot}
    >
      <FormContext.Provider value={{ ...props, validationBehavior }}>
        <FormValidationContext.Provider value={errors}>
          {renderProps.renderChildren()}
        </FormValidationContext.Provider>
      </FormContext.Provider>
    </form>
  );
}
