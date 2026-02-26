/**
 * StepList component for proyecto-viviana-silapse.
 *
 * Styling-only ordered-step composition primitive.
 */

import { type JSX, splitProps } from 'solid-js';

export interface StepListProps extends JSX.HTMLAttributes<HTMLOListElement> {
  class?: string;
}

export interface StepProps extends JSX.HTMLAttributes<HTMLLIElement> {
  class?: string;
}

export function StepList(props: StepListProps): JSX.Element {
  const [local, domProps] = splitProps(props, ['class', 'children']);
  return (
    <ol
      {...domProps}
      class={`flex list-decimal flex-col gap-2 pl-5 text-primary-200 ${local.class ?? ''}`}
    >
      {local.children}
    </ol>
  );
}

export function Step(props: StepProps): JSX.Element {
  const [local, domProps] = splitProps(props, ['class', 'children']);
  return (
    <li
      {...domProps}
      class={`text-sm leading-6 ${local.class ?? ''}`}
    >
      {local.children}
    </li>
  );
}

