import type { JSX } from 'solid-js'
import { Show, For } from 'solid-js'
import { Avatar } from '../avatar'

export interface EventCardProps {
  title: string
  image?: string
  date?: string
  duration?: string
  author?: string
  authorAvatar?: string
  attendees?: { avatar?: string; name: string }[]
  attendeeCount?: number
  actions?: JSX.Element
  class?: string
}

export function EventCard(props: EventCardProps) {
  const displayedAttendees = () => props.attendees?.slice(0, 3) ?? []
  const remainingCount = () => {
    const total = props.attendeeCount ?? props.attendees?.length ?? 0
    const displayed = displayedAttendees().length
    return total - displayed
  }

  return (
    <div class={`bg-bg-200 rounded-xl overflow-hidden ${props.class ?? ''}`}>
      <Show when={props.image}>
        <div class="relative h-32 w-full">
          <img
            src={props.image}
            alt={props.title}
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-bg-400/80 to-transparent" />
          <Show when={props.duration}>
            <span class="absolute top-2 right-2 bg-accent text-white text-xs font-medium px-2 py-1 rounded-full">
              {props.duration}
            </span>
          </Show>
        </div>
      </Show>
      <div class="p-4">
        <h3 class="font-semibold text-primary-100 text-lg line-clamp-2">
          {props.title}
        </h3>
        <Show when={props.date || props.author}>
          <div class="flex items-center gap-2 mt-2 text-sm text-primary-300">
            <Show when={props.author}>
              <div class="flex items-center gap-1.5">
                <Avatar src={props.authorAvatar} alt={props.author} size="xs" />
                <span>{props.author}</span>
              </div>
            </Show>
            <Show when={props.date && props.author}>
              <span>•</span>
            </Show>
            <Show when={props.date}>
              <span>{props.date}</span>
            </Show>
          </div>
        </Show>
        <Show when={displayedAttendees().length > 0}>
          <div class="flex items-center mt-3">
            <div class="flex -space-x-2">
              <For each={displayedAttendees()}>
                {(attendee) => (
                  <Avatar src={attendee.avatar} alt={attendee.name} size="sm" />
                )}
              </For>
            </div>
            <Show when={remainingCount() > 0}>
              <span class="ml-2 text-sm text-primary-300">
                +{remainingCount()} más
              </span>
            </Show>
          </div>
        </Show>
        <Show when={props.actions}>
          <div class="mt-4 flex gap-2">{props.actions}</div>
        </Show>
      </div>
    </div>
  )
}

export interface EventListItemProps {
  title: string
  image?: string
  subtitle?: string
  onClick?: () => void
  class?: string
}

export function EventListItem(props: EventListItemProps) {
  return (
    <button
      class={`flex items-center gap-3 w-full p-2 rounded-lg hover:bg-bg-300 transition-colors text-left ${props.class ?? ''}`}
      onClick={props.onClick}
    >
      <Show when={props.image}>
        <div class="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={props.image}
            alt={props.title}
            class="w-full h-full object-cover"
          />
        </div>
      </Show>
      <div class="flex-1 min-w-0">
        <h4 class="font-medium text-primary-100 truncate">{props.title}</h4>
        <Show when={props.subtitle}>
          <p class="text-sm text-primary-300 truncate">{props.subtitle}</p>
        </Show>
      </div>
    </button>
  )
}
