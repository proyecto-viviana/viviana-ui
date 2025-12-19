import type { JSX } from 'solid-js'
import { Show } from 'solid-js'
import { Button } from '../button'
import { Chip } from '../chip'

export interface DialogProps {
  title: string
  subtitle?: string
  children: JSX.Element
  tags?: string[]
  primaryAction?: {
    label: string
    onClick: () => void
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  class?: string
}

export function Dialog(props: DialogProps) {
  return (
    <div class={`flex flex-col w-full max-w-[540px] ${props.class ?? ''}`}>
      <span class="relative left-8 top-4 bg-gradient-to-b from-primary-100 to-primary-500 bg-clip-text text-4xl font-extrabold text-transparent">
        {props.title}
      </span>
      <div class="flex h-[50px] flex-col justify-end rounded-t-[26px] bg-primary-800">
        <div class="flex h-[40px] flex-col justify-end rounded-t-[30px] bg-primary-600">
          <div class="flex h-[20px] items-center justify-end rounded-t-[100px] bg-primary-700 pr-4">
            <Show when={props.subtitle}>
              <span class="text-base font-normal text-primary-300">
                {props.subtitle}
              </span>
            </Show>
          </div>
        </div>
      </div>
      <div class="mt-1 flex min-h-[200px] flex-col rounded-b-[26px] rounded-t-lg border-b border-accent-500 bg-bg-300">
        <div class="flex flex-1 flex-col p-4">
          <div class="text-lg text-gray-100">{props.children}</div>
          <Show when={props.primaryAction || props.secondaryAction}>
            <div class="flex flex-1 flex-row items-end justify-center gap-5 py-5">
              <Show when={props.secondaryAction}>
                <Button variant="primary" style="outline" onPress={props.secondaryAction!.onClick}>
                  {props.secondaryAction!.label}
                </Button>
              </Show>
              <Show when={props.primaryAction}>
                <Button variant="primary" onPress={props.primaryAction!.onClick}>
                  {props.primaryAction!.label}
                </Button>
              </Show>
            </div>
          </Show>
        </div>
      </div>
      <Show when={props.tags && props.tags.length > 0}>
        <div class="relative bottom-4 right-4 w-full">
          <div class="flex flex-row justify-end gap-2 pr-4">
            {props.tags!.map((tag) => (
              <Chip variant="primary" text={tag} />
            ))}
          </div>
        </div>
      </Show>
    </div>
  )
}
