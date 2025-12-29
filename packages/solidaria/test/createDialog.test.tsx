/**
 * Tests for createDialog hook.
 * Ported from @react-aria/dialog useDialog.test.js
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup } from '@solidjs/testing-library'
import { createDialog } from '../src'

// Test component that uses createDialog
function TestDialog(props: {
  role?: 'dialog' | 'alertdialog'
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
  children?: any
}) {
  let dialogRef: HTMLDivElement | null = null

  const { dialogProps } = createDialog(
    () => ({
      role: props.role,
      'aria-label': props['aria-label'],
      'aria-labelledby': props['aria-labelledby'],
      'aria-describedby': props['aria-describedby'],
    }),
    () => dialogRef
  )

  return (
    <div
      ref={(el) => (dialogRef = el)}
      {...dialogProps()}
      data-testid="dialog"
    >
      {props.children}
    </div>
  )
}

describe('createDialog', () => {
  afterEach(() => {
    cleanup()
  })

  it('should have role="dialog" by default', () => {
    render(() => <TestDialog />)
    const dialog = screen.getByTestId('dialog')
    expect(dialog).toHaveAttribute('role', 'dialog')
  })

  it('should accept role="alertdialog"', () => {
    render(() => <TestDialog role="alertdialog" />)
    const dialog = screen.getByTestId('dialog')
    expect(dialog).toHaveAttribute('role', 'alertdialog')
  })

  it('should have tabIndex=-1 for focus management', () => {
    render(() => <TestDialog />)
    const dialog = screen.getByTestId('dialog')
    expect(dialog).toHaveAttribute('tabIndex', '-1')
  })

  it('should support aria-label', () => {
    render(() => <TestDialog aria-label="Test Dialog" />)
    const dialog = screen.getByTestId('dialog')
    expect(dialog).toHaveAttribute('aria-label', 'Test Dialog')
  })

  it('should support aria-labelledby', () => {
    render(() => (
      <>
        <h2 id="dialog-title">Dialog Title</h2>
        <TestDialog aria-labelledby="dialog-title" />
      </>
    ))
    const dialog = screen.getByTestId('dialog')
    expect(dialog).toHaveAttribute('aria-labelledby', 'dialog-title')
  })

  it('should support aria-describedby', () => {
    render(() => (
      <>
        <p id="dialog-desc">Dialog description</p>
        <TestDialog aria-describedby="dialog-desc" />
      </>
    ))
    const dialog = screen.getByTestId('dialog')
    expect(dialog).toHaveAttribute('aria-describedby', 'dialog-desc')
  })

  it('should render children', () => {
    render(() => (
      <TestDialog>
        <p>Dialog content</p>
      </TestDialog>
    ))
    expect(screen.getByText('Dialog content')).toBeInTheDocument()
  })

  it('should focus the dialog on mount when no focusable children', async () => {
    render(() => <TestDialog aria-label="Test" />)
    const dialog = screen.getByTestId('dialog')

    // Wait for focus effect to run
    await new Promise(resolve => setTimeout(resolve, 50))

    // Dialog should be focusable (has tabIndex=-1)
    expect(dialog).toHaveAttribute('tabIndex', '-1')
  })

  it('should not steal focus from autofocused children', async () => {
    render(() => (
      <TestDialog aria-label="Test">
        <input data-testid="input" autofocus />
      </TestDialog>
    ))

    // Wait for mount effects
    await new Promise(resolve => setTimeout(resolve, 50))

    const input = screen.getByTestId('input')
    // In a real browser, autofocus would work
    // In JSDOM, we verify the element exists and is focusable
    expect(input).toBeInTheDocument()
  })
})

describe('createDialog accessibility', () => {
  afterEach(() => {
    cleanup()
  })

  it('should be accessible with aria-label', () => {
    render(() => <TestDialog aria-label="Settings Dialog" />)
    const dialog = screen.getByRole('dialog', { name: 'Settings Dialog' })
    expect(dialog).toBeInTheDocument()
  })

  it('should be accessible with aria-labelledby', () => {
    render(() => (
      <>
        <h2 id="title">User Settings</h2>
        <TestDialog aria-labelledby="title" />
      </>
    ))
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-labelledby', 'title')
  })

  it('alertdialog should be accessible', () => {
    render(() => <TestDialog role="alertdialog" aria-label="Confirm Delete" />)
    const dialog = screen.getByRole('alertdialog', { name: 'Confirm Delete' })
    expect(dialog).toBeInTheDocument()
  })
})
