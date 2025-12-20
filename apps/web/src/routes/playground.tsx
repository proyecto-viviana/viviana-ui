import { createFileRoute, Link } from '@tanstack/solid-router'
import { createSignal, JSX } from 'solid-js'
import {
  Button,
  Badge,
  Chip,
  Alert,
  Avatar,
  AvatarGroup,
  TabSwitch,
  ToggleSwitch,
  Dialog,
  ProfileCard,
  EventCard,
  CalendarCard,
  ConversationPreview,
  ConversationBubble,
  TimelineItem,
} from '@proyecto-viviana/ui'
import {
  createButton,
  createCheckboxGroup,
  createCheckboxGroupItem,
  createCheckboxGroupState,
  type CheckboxGroupState,
  type AriaCheckboxGroupItemProps,
} from '@proyecto-viviana/solidaria'
// Fire gif for event card decoration
const fireGif = '/fire.gif'

export const Route = createFileRoute('/playground')({
  component: Playground,
})

function Playground() {
  const [count, setCount] = createSignal(0)
  const [lastAction, setLastAction] = createSignal('None')
  const [switchValue, setSwitchValue] = createSignal('trending')
  const [toggleOn, setToggleOn] = createSignal(false)

  return (
    <div class="min-h-screen bg-bg-400">
      <header class="border-b border-bg-300 bg-bg-400/80 backdrop-blur-sm">
        <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" class="flex items-center gap-2 text-xl font-bold text-primary-100">
            <span class="text-2xl gradient-text">V</span>
            <span>Viviana</span>
          </Link>
          <nav class="flex items-center gap-6">
            <Link to="/docs" class="text-sm font-medium text-primary-300 hover:text-primary-100">
              Docs
            </Link>
            <Link to="/playground" class="text-sm font-medium text-accent">
              Playground
            </Link>
          </nav>
        </div>
      </header>

      <div class="mx-auto max-w-6xl px-6 py-12">
        <header class="mb-12">
          <h1 class="text-4xl font-bold text-primary-100">Component Playground</h1>
          <p class="mt-2 text-lg text-primary-300">
            Interactive showcase of @proyecto-viviana/ui components
          </p>
          <p class="mt-1 text-sm text-primary-400">Last action: {lastAction()}</p>
        </header>

        <div class="grid gap-8 lg:grid-cols-2">
          {/* Button Component */}
          <Section title="Button" description="Primary interactive element with variants and styles">
            <div class="space-y-4">
              <div class="flex flex-wrap gap-3">
                <Button onPress={() => setCount((c) => c + 1)}>Count: {count()}</Button>
                <Button variant="secondary" onPress={() => setLastAction('Secondary clicked!')}>
                  Secondary
                </Button>
                <Button variant="danger" onPress={() => setLastAction('Danger clicked!')}>
                  Danger
                </Button>
                <Button variant="success" onPress={() => setLastAction('Success clicked!')}>
                  Success
                </Button>
                <Button isDisabled>Disabled</Button>
              </div>
              <div class="flex flex-wrap gap-3">
                <Button style="outline" variant="primary">Outline Primary</Button>
                <Button style="outline" variant="secondary">Outline Secondary</Button>
                <Button style="outline" variant="danger">Outline Danger</Button>
                <Button style="outline" variant="success">Outline Success</Button>
              </div>
            </div>
          </Section>

          {/* Badge Component */}
          <Section title="Badge" description="Notification indicators and counts">
            <div class="flex flex-wrap items-center gap-4">
              <div class="flex items-center gap-2">
                <Badge count={5} variant="primary" />
                <span class="text-sm text-primary-300">Primary</span>
              </div>
              <div class="flex items-center gap-2">
                <Badge count={12} variant="accent" />
                <span class="text-sm text-primary-300">Accent</span>
              </div>
              <div class="flex items-center gap-2">
                <Badge count={3} variant="success" />
                <span class="text-sm text-primary-300">Success</span>
              </div>
              <div class="flex items-center gap-2">
                <Badge count={99} variant="warning" />
                <span class="text-sm text-primary-300">Warning</span>
              </div>
              <div class="flex items-center gap-2">
                <Badge count={1} variant="danger" />
                <span class="text-sm text-primary-300">Danger</span>
              </div>
            </div>
          </Section>

          {/* Chip Component */}
          <Section title="Chip" description="Small labels and tag buttons">
            <div class="flex flex-wrap gap-3">
              <Chip text="Primary" variant="primary" onClick={() => setLastAction('Primary chip')} />
              <Chip text="Secondary" variant="secondary" onClick={() => setLastAction('Secondary chip')} />
              <Chip text="Accent" variant="accent" onClick={() => setLastAction('Accent chip')} />
              <Chip text="Outline" variant="outline" onClick={() => setLastAction('Outline chip')} />
              <Chip text="With Icon" variant="primary" icon={<span>★</span>} onClick={() => setLastAction('Icon chip')} />
            </div>
          </Section>

          {/* Alert Component */}
          <Section title="Alert" description="Contextual feedback messages">
            <div class="space-y-3">
              <Alert variant="info" title="Information">
                This is an informational message.
              </Alert>
              <Alert variant="success" title="Success">
                Operation completed successfully!
              </Alert>
              <Alert variant="warning" title="Warning">
                Please review before continuing.
              </Alert>
              <Alert variant="error" title="Error" dismissible onDismiss={() => setLastAction('Alert dismissed')}>
                Something went wrong.
              </Alert>
            </div>
          </Section>

          {/* Avatar Component */}
          <Section title="Avatar" description="User profile images with status">
            <div class="space-y-4">
              <div class="flex items-center gap-4">
                <Avatar size="xs" alt="XS" />
                <Avatar size="sm" alt="SM" />
                <Avatar size="md" alt="MD" online />
                <Avatar size="lg" alt="LG" online={false} />
                <Avatar size="xl" alt="XL" fallback="VV" />
              </div>
              <div class="flex items-center gap-2">
                <span class="text-sm text-primary-300">Avatar Group:</span>
                <AvatarGroup>
                  <Avatar size="sm" alt="User 1" />
                  <Avatar size="sm" alt="User 2" />
                  <Avatar size="sm" alt="User 3" />
                </AvatarGroup>
              </div>
            </div>
          </Section>

          {/* Switch Components */}
          <Section title="Switch" description="Toggle and tab switch controls">
            <div class="space-y-4">
              <div class="flex items-center gap-4">
                <span class="text-sm text-primary-200">Toggle:</span>
                <ToggleSwitch checked={toggleOn()} onChange={setToggleOn} />
                <span class="text-sm text-primary-300">{toggleOn() ? 'On' : 'Off'}</span>
              </div>
              <div>
                <span class="text-sm text-primary-200 block mb-2">Tab Switch:</span>
                <TabSwitch
                  options={[
                    { label: 'TRENDING', value: 'trending' },
                    { label: 'LATEST', value: 'latest' },
                  ]}
                  value={switchValue()}
                  onChange={setSwitchValue}
                />
                <p class="text-sm text-primary-300 mt-2">Selected: {switchValue()}</p>
              </div>
            </div>
          </Section>

          {/* Profile Card */}
          <Section title="ProfileCard" description="User profile display cards">
            <ProfileCard
              username="@viviana_dev"
              bio="Building accessible SolidJS components. React Aria patterns for Solid."
              followers={1234}
              following={567}
              actions={
                <div class="flex gap-2">
                  <Button variant="primary" onPress={() => setLastAction('Followed!')}>Follow</Button>
                  <Button variant="secondary" style="outline" onPress={() => setLastAction('Message!')}>Message</Button>
                </div>
              }
            />
          </Section>

          {/* Event Card */}
          <Section title="EventCard" description="Event display with attendees">
            <EventCard
              title="Fiesta de Taylor 2021 todos invitados"
              date="2 días"
              author="taylorswift"
              decorationImage={fireGif}
              attendees={[
                { name: 'Alice' },
                { name: 'Bob' },
                { name: 'Carol' },
              ]}
              attendeeCount={42}
              actions={
                <Button variant="primary" onPress={() => setLastAction('RSVP!')}>
                  RSVP
                </Button>
              }
            />
          </Section>

          {/* Calendar Card */}
          <Section title="CalendarCard" description="Calendar event with followers">
            <CalendarCard
              title="Component Design Workshop"
              tags={['Design', 'UI/UX']}
              followers={[
                { name: 'Alice' },
                { name: 'Bob' },
              ]}
              followerCount={15}
            />
          </Section>

          {/* Conversation Components */}
          <Section title="Conversation" description="Chat and messaging UI">
            <div class="space-y-4">
              <ConversationPreview
                user={{ name: 'Alice', online: true }}
                lastMessage="Hey! Have you seen the new components?"
                timestamp="2m ago"
                unreadCount={3}
                onClick={() => setLastAction('Opened conversation with Alice')}
              />
              <div class="rounded-lg bg-bg-300 p-4 space-y-2">
                <ConversationBubble content="Hi there!" sender="other" timestamp="10:30 AM" />
                <ConversationBubble content="Hello! How are you?" sender="user" timestamp="10:31 AM" />
                <ConversationBubble content="Great! Love the new UI" sender="other" timestamp="10:32 AM" />
              </div>
            </div>
          </Section>

          {/* Timeline Item */}
          <Section title="TimelineItem" description="Social activity timeline">
            <div class="flex flex-wrap gap-4">
              <TimelineItem
                type="follow"
                leftUser={{ name: 'Alice' }}
                rightUser={{ name: 'Bob' }}
                icon={<span class="text-2xl">👋</span>}
              />
              <TimelineItem
                type="like"
                leftUser={{ name: 'Carol' }}
                rightUser={{ name: 'Dave' }}
                icon={<span class="text-2xl">❤️</span>}
              />
            </div>
          </Section>

          {/* Dialog */}
          <Section title="Dialog" description="Modal dialog with actions" class="lg:col-span-2">
            <Dialog
              title="Welcome!"
              subtitle="Getting Started Guide"
              tags={['New', 'Featured']}
              primaryAction={{
                label: 'Get Started',
                onClick: () => setLastAction('Dialog: Get Started'),
              }}
              secondaryAction={{
                label: 'Learn More',
                onClick: () => setLastAction('Dialog: Learn More'),
              }}
            >
              <p>
                Welcome to Proyecto Viviana! A collection of accessible,
                beautifully styled SolidJS components inspired by React Spectrum.
              </p>
            </Dialog>
          </Section>

          {/* createButton Hook */}
          <Section title="createButton Hook" description="Low-level hook for custom implementations" class="lg:col-span-2">
            <div class="flex flex-wrap gap-4">
              <CustomGradientButton onPress={() => setLastAction('Gradient button pressed!')}>
                Custom Gradient Button
              </CustomGradientButton>
              <CustomOutlineButton onPress={() => setLastAction('Outline button pressed!')}>
                Custom Outline Button
              </CustomOutlineButton>
            </div>
          </Section>

          {/* Checkbox Group Hook */}
          <Section title="createCheckboxGroup Hook" description="Accessible checkbox group with ARIA support" class="lg:col-span-2">
            <CheckboxGroupDemo onSelectionChange={(values) => setLastAction(`Selected: ${values.join(', ') || 'none'}`)} />
          </Section>
        </div>
      </div>
    </div>
  )
}

function Section(props: { title: string; description: string; children: any; class?: string }) {
  return (
    <section class={`rounded-xl border border-bg-100 bg-bg-200 p-6 shadow-sm ${props.class ?? ''}`}>
      <h2 class="mb-1 text-xl font-semibold text-primary-100">{props.title}</h2>
      <p class="mb-4 text-sm text-primary-400">{props.description}</p>
      {props.children}
    </section>
  )
}

function CustomGradientButton(props: { onPress?: () => void; children: string }) {
  const { buttonProps, isPressed } = createButton({
    onPress: props.onPress,
  })

  return (
    <button
      {...buttonProps}
      class={`rounded-lg bg-gradient-to-r from-primary-500 to-accent px-6 py-3 font-medium text-white shadow-md transition-all hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
        isPressed() ? 'scale-[0.98] shadow-sm' : ''
      }`}
    >
      {props.children}
    </button>
  )
}

function CustomOutlineButton(props: { onPress?: () => void; children: string }) {
  const { buttonProps, isPressed } = createButton({
    onPress: props.onPress,
  })

  return (
    <button
      {...buttonProps}
      class={`rounded-lg border-2 border-primary-500 bg-transparent px-6 py-3 font-medium text-primary-200 transition-all hover:bg-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
        isPressed() ? 'scale-[0.98] bg-primary-700' : ''
      }`}
    >
      {props.children}
    </button>
  )
}

// ============================================
// Checkbox Group Demo Components
// ============================================

function CheckboxGroupDemo(props: { onSelectionChange?: (values: string[]) => void }) {
  const state = createCheckboxGroupState(() => ({
    defaultValue: ['notifications'],
    onChange: props.onSelectionChange,
  }))

  const { groupProps, labelProps } = createCheckboxGroup(
    () => ({ label: 'Preferences' }),
    state
  )

  return (
    <div class="space-y-6">
      {/* Basic Checkbox Group */}
      <div>
        <h3 class="text-sm font-medium text-primary-200 mb-3">Basic Group</h3>
        <div {...groupProps} class="space-y-2">
          <span {...labelProps} class="text-sm font-medium text-primary-100 block mb-2">
            Notification Settings
          </span>
          <CustomCheckbox value="notifications" state={state}>
            Enable notifications
          </CustomCheckbox>
          <CustomCheckbox value="emails" state={state}>
            Email updates
          </CustomCheckbox>
          <CustomCheckbox value="marketing" state={state}>
            Marketing communications
          </CustomCheckbox>
        </div>
        <p class="mt-2 text-xs text-primary-400">
          Selected: {state.value().join(', ') || 'none'}
        </p>
      </div>

      {/* Disabled & Read-only Examples */}
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <h3 class="text-sm font-medium text-primary-200 mb-3">Disabled Checkbox</h3>
          <DisabledCheckboxDemo />
        </div>
        <div>
          <h3 class="text-sm font-medium text-primary-200 mb-3">Read-only Checkbox</h3>
          <ReadonlyCheckboxDemo />
        </div>
      </div>
    </div>
  )
}

function CustomCheckbox(props: {
  value: string
  state: CheckboxGroupState
  children: JSX.Element
  isDisabled?: boolean
  isReadOnly?: boolean
}) {
  let inputRef: HTMLInputElement | null = null

  const result = createCheckboxGroupItem(
    () => ({
      value: props.value,
      isDisabled: props.isDisabled,
      isReadOnly: props.isReadOnly,
      children: props.children,
    }),
    props.state,
    () => inputRef
  )

  const isChecked = () => props.state.value().includes(props.value)
  const getInputProps = () => result.inputProps

  return (
    <label
      class={`flex items-center gap-3 cursor-pointer group ${
        props.isDisabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <div class="relative">
        <input
          ref={(el) => (inputRef = el)}
          type="checkbox"
          value={props.value}
          checked={isChecked()}
          disabled={getInputProps().disabled}
          aria-readonly={getInputProps()['aria-readonly']}
          onChange={getInputProps().onChange}
          class="peer sr-only"
        />
        <div
          class={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center
            ${isChecked()
              ? 'bg-accent border-accent'
              : 'border-primary-400 group-hover:border-primary-200'
            }
            ${props.isDisabled ? '' : 'peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-bg-200'}
          `}
        >
          {isChecked() && (
            <svg class="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 6L5 9L10 3"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          )}
        </div>
      </div>
      <span class="text-sm text-primary-200">{props.children}</span>
    </label>
  )
}

function DisabledCheckboxDemo() {
  const state = createCheckboxGroupState(() => ({
    defaultValue: ['option1'],
    isDisabled: true,
  }))

  const { groupProps } = createCheckboxGroup(() => ({}), state)

  return (
    <div {...groupProps} class="space-y-2">
      <CustomCheckbox value="option1" state={state} isDisabled>
        Disabled (checked)
      </CustomCheckbox>
      <CustomCheckbox value="option2" state={state} isDisabled>
        Disabled (unchecked)
      </CustomCheckbox>
    </div>
  )
}

function ReadonlyCheckboxDemo() {
  const state = createCheckboxGroupState(() => ({
    defaultValue: ['readonly1'],
    isReadOnly: true,
  }))

  const { groupProps } = createCheckboxGroup(() => ({}), state)

  return (
    <div {...groupProps} class="space-y-2">
      <CustomCheckbox value="readonly1" state={state} isReadOnly>
        Read-only (checked)
      </CustomCheckbox>
      <CustomCheckbox value="readonly2" state={state} isReadOnly>
        Read-only (unchecked)
      </CustomCheckbox>
    </div>
  )
}
