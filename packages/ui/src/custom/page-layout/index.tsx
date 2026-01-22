import { JSX, splitProps } from 'solid-js'

export interface PageLayoutProps extends JSX.HTMLAttributes<HTMLDivElement> {
  /** Content of the page */
  children: JSX.Element
  /** Add padding-top to account for fixed header (use for non-landing pages) */
  withHeader?: boolean
}

/**
 * PageLayout provides consistent page structure with proper background and font styling.
 * Use this as the root wrapper for all pages.
 */
export function PageLayout(props: PageLayoutProps) {
  const [local, rest] = splitProps(props, ['children', 'class', 'withHeader'])

  const classes = () => {
    const base = 'vui-page'
    const header = local.withHeader ? 'vui-page--with-header' : ''
    const custom = local.class ?? ''
    return [base, header, custom].filter(Boolean).join(' ')
  }

  return (
    <div class={classes()} {...rest}>
      {local.children}
    </div>
  )
}
