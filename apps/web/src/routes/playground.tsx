import { createFileRoute, Link } from '@tanstack/solid-router'
import { createSignal } from 'solid-js'
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
import { createButton } from '@proyecto-viviana/solidaria'

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
                <Button variant="accent" onPress={() => setLastAction('Accent clicked!')}>
                  Accent
                </Button>
                <Button variant="secondary" onPress={() => setLastAction('Secondary clicked!')}>
                  Secondary
                </Button>
                <Button variant="negative" onPress={() => setLastAction('Negative clicked!')}>
                  Negative
                </Button>
                <Button isDisabled>Disabled</Button>
              </div>
              <div class="flex flex-wrap gap-3">
                <Button style="outline" variant="primary">Outline Primary</Button>
                <Button style="outline" variant="accent">Outline Accent</Button>
                <Button style="outline" variant="secondary">Outline Secondary</Button>
                <Button style="outline" variant="negative">Outline Negative</Button>
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
              title="SolidJS Meetup: Building Accessible UIs"
              date="Dec 25, 2024"
              duration="2h"
              author="Viviana Team"
              attendees={[
                { name: 'Alice' },
                { name: 'Bob' },
                { name: 'Carol' },
              ]}
              attendeeCount={42}
              actions={
                <Button variant="accent" onPress={() => setLastAction('RSVP!')}>
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
