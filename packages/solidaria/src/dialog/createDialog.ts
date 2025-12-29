/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/**
 * Ported from React Aria:
 * https://github.com/adobe/react-spectrum/blob/main/packages/@react-aria/dialog/src/useDialog.ts
 */

import { Accessor, createEffect, createMemo, createSignal, createUniqueId, onCleanup } from 'solid-js'
import { filterDOMProps, focusSafely } from '../utils'
import type { AriaLabelingProps, DOMProps } from './types'

export interface AriaDialogProps extends DOMProps, AriaLabelingProps {
  /**
   * The role of the dialog element.
   * @default 'dialog'
   */
  role?: 'dialog' | 'alertdialog'
}

export interface DialogAria {
  /** Props for the dialog container element. */
  dialogProps: Accessor<Record<string, any>>

  /** Props for the dialog title element. */
  titleProps: Accessor<Record<string, any>>
}

/**
 * Provides the behavior and accessibility implementation for a dialog component.
 * A dialog is an overlay shown above other content in an application.
 */
export function createDialog(
  props: AriaDialogProps | Accessor<AriaDialogProps>,
  ref: Accessor<HTMLElement | undefined>
): DialogAria {
  // Support both direct props and accessor pattern
  const getProps = typeof props === 'function' ? props : () => props

  const role = () => getProps().role ?? 'dialog'
  const generatedTitleId = createUniqueId()
  const [isRefocusing, setIsRefocusing] = createSignal(false)

  const titleId = createMemo(() => {
    const p = getProps()
    // Use provided aria-labelledby, or generated ID if no aria-label
    if (p['aria-labelledby']) return undefined
    return p['aria-label'] ? undefined : generatedTitleId
  })

  // Focus the dialog itself on mount, unless a child element is already focused.
  // Only run on the client (SSR-safe)
  createEffect(() => {
    // Guard against SSR - document is not available on the server
    if (typeof document === 'undefined') return

    const dialogEl = ref()
    if (dialogEl && !dialogEl.contains(document.activeElement)) {
      focusSafely(dialogEl)

      // Safari on iOS does not move the VoiceOver cursor to the dialog
      // or announce that it has opened until it has rendered. A workaround
      // is to wait for half a second, then blur and re-focus the dialog.
      const timeout = setTimeout(() => {
        // Check that the dialog is still focused, or focused was lost to the body.
        if (document.activeElement === dialogEl || document.activeElement === document.body) {
          setIsRefocusing(true)
          dialogEl.blur()
          focusSafely(dialogEl)
          setIsRefocusing(false)
        }
      }, 500)

      onCleanup(() => {
        clearTimeout(timeout)
      })
    }
  })

  // Note: Focus containment is typically handled by createModal at a higher level
  // For standalone dialogs, focus containment should be managed by the overlay system

  const dialogProps = createMemo(() => {
    const p = getProps()
    return {
      ...filterDOMProps(p),
      role: role(),
      tabIndex: -1,
      'aria-label': p['aria-label'],
      'aria-labelledby': p['aria-labelledby'] || titleId(),
      'aria-describedby': p['aria-describedby'],
      // Prevent blur events from reaching createOverlay, which may cause
      // popovers to close. Since focus is contained within the dialog,
      // we don't want this to occur due to the above createEffect.
      onBlur: (e: FocusEvent) => {
        if (isRefocusing()) {
          e.stopPropagation()
        }
      }
    }
  })

  const titlePropsValue = createMemo(() => ({
    id: titleId()
  }))

  return {
    dialogProps,
    titleProps: titlePropsValue
  }
}
