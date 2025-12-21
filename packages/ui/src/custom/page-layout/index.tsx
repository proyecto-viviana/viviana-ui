import { JSX, splitProps } from 'solid-js'

export interface PageLayoutProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /** Content of the page */
  children: JSX.Element
}

/**
 * PageLayout provides consistent page structure with proper background and font styling.
 * Use this as the root wrapper for all pages.
 */
export function PageLayout(props: PageLayoutProps) {
  const [local, rest] = splitProps(props, ['children', 'class'])

  return (
    <div class={`vui-page ${local.class ?? ''}`} {...rest}>
      {local.children}
    </div>
  )
}
