import { type JSX, createContext } from 'solid-js';
import type { SlotProps } from './utils';

export interface TextProps extends SlotProps {
  children?: JSX.Element;
  class?: string;
  style?: JSX.CSSProperties;
}

export const TextContext = createContext<null>(null);

export function Text(props: TextProps): JSX.Element {
  return (
    <span class={props.class ?? 'solidaria-Text'} style={props.style}>
      {props.children}
    </span>
  );
}
