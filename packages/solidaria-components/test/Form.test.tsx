/**
 * Tests for solidaria-components Form
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import { useContext } from 'solid-js';
import { FormValidationContext, type ValidationErrors } from '@proyecto-viviana/solid-stately';
import { Form } from '../src/Form';

function ContextProbe() {
  const errors = useContext(FormValidationContext) as unknown;
  const normalized =
    typeof errors === 'function'
      ? (errors as () => unknown)()
      : errors;
  return (
    <div data-testid="errors">
      {String((normalized as Record<string, unknown>)?.email ?? '')}
    </div>
  );
}

describe('Form', () => {
  it('renders with default class and native validation behavior', () => {
    render(() => <Form />);
    const form = document.querySelector('form') as HTMLFormElement;
    expect(form).toHaveClass('solidaria-Form');
    expect(form).not.toHaveAttribute('novalidate');
  });

  it('sets noValidate when validationBehavior is aria', () => {
    render(() => <Form validationBehavior="aria" />);
    const form = document.querySelector('form') as HTMLFormElement;
    expect(form).toHaveAttribute('novalidate');
  });

  it('provides validation errors through FormValidationContext', () => {
    const validationErrors: ValidationErrors = {
      email: 'Invalid email',
    };

    render(() => (
      <Form validationErrors={validationErrors}>
        {() => <ContextProbe />}
      </Form>
    ));

    expect(screen.getByTestId('errors')).toHaveTextContent('Invalid email');
  });
});
