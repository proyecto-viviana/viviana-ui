import type { JSX } from 'solid-js'
import { Show } from 'solid-js'
import { Avatar } from '../avatar'

export type TimelineEventType = 'follow' | 'like' | 'comment' | 'event' | 'custom'

export interface TimelineItemProps {
  type?: TimelineEventType
  icon?: JSX.Element
  leftUser?: {
    name: string
    avatar?: string
  }
  rightUser?: {
    name: string
    avatar?: string
  }
  message?: JSX.Element
  class?: string
}

const eventMessages: Record<TimelineEventType, (left: string, right: string) => JSX.Element> = {
  follow: (left, right) => (
    <>
      <span class="font-semibold text-accent-200">{left}</span>
      {' ha empezado a seguir a '}
      <span class="font-semibold text-accent-200">{right}</span>
    </>
  ),
  like: (left, right) => (
    <>
      <span class="font-semibold text-accent-200">{left}</span>
      {' le ha dado like a '}
      <span class="font-semibold text-accent-200">{right}</span>
    </>
  ),
  comment: (left, right) => (
    <>
      <span class="font-semibold text-accent-200">{left}</span>
      {' ha comentado en '}
      <span class="font-semibold text-accent-200">{right}</span>
    </>
  ),
  event: (left, right) => (
    <>
      <span class="font-semibold text-accent-200">{left}</span>
      {' asistirá al evento de '}
      <span class="font-semibold text-accent-200">{right}</span>
    </>
  ),
  custom: () => null,
}

export function TimelineItem(props: TimelineItemProps) {
  const type = () => props.type ?? 'follow'
  const leftName = () => props.leftUser?.name ?? ''
  const rightName = () => props.rightUser?.name ?? ''

  return (
    <div class={`inline-flex w-auto flex-col gap-5 rounded-2xl border border-primary-700 bg-bg-200 p-5 hover:bg-bg-300 transition-colors ${props.class ?? ''}`}>
      <div class="flex items-center justify-around gap-3">
        <Show when={props.leftUser}>
          <Avatar src={props.leftUser!.avatar} alt={props.leftUser!.name} />
        </Show>
        <Show when={props.icon}>
          {props.icon}
        </Show>
        <Show when={props.rightUser}>
          <Avatar src={props.rightUser!.avatar} alt={props.rightUser!.name} />
        </Show>
      </div>
      <div class="flex items-center justify-center gap-3 text-center">
        <span class="font-light text-primary-300">
          <Show when={props.message} fallback={eventMessages[type()](leftName(), rightName())}>
            {props.message}
          </Show>
        </span>
      </div>
    </div>
  )
}
