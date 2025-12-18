import { createFileRoute } from '@tanstack/solid-router';
import { createSignal } from 'solid-js';
import { Button } from '@proyecto-viviana/ui';
import { createButton } from '@proyecto-viviana/solidaria';
import '@/styles.css';

export const Route = createFileRoute('/')({
  component: PlaygroundPage,
});

function PlaygroundPage() {
  const [count, setCount] = createSignal(0);
  const [lastAction, setLastAction] = createSignal('None');

  return (
    <div class="mx-auto max-w-4xl px-6 py-12">
      <header class="mb-12">
        <h1 class="text-4xl font-bold text-bg-900">Viviana UI</h1>
        <p class="mt-2 text-lg text-bg-500">
          Interactive playground for @proyecto-viviana/ui and @proyecto-viviana/solidaria
        </p>
      </header>

      <section class="mb-8 rounded-xl border border-bg-200 bg-white p-6 shadow-sm">
        <h2 class="mb-2 text-xl font-semibold text-bg-800">Button Component</h2>
        <p class="mb-6 text-bg-500">
          Styled Button component built on solidaria primitives
        </p>

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
            <Button style="outline" variant="primary">
              Outline Primary
            </Button>
            <Button style="outline" variant="accent">
              Outline Accent
            </Button>
            <Button style="outline" variant="secondary">
              Outline Secondary
            </Button>
            <Button style="outline" variant="negative">
              Outline Negative
            </Button>
          </div>

          <p class="text-sm text-bg-500">Last action: {lastAction()}</p>
        </div>
      </section>

      <section class="mb-8 rounded-xl border border-bg-200 bg-white p-6 shadow-sm">
        <h2 class="mb-2 text-xl font-semibold text-bg-800">createButton Hook</h2>
        <p class="mb-6 text-bg-500">
          Low-level hook from @proyecto-viviana/solidaria for custom implementations
        </p>

        <CustomButton onPress={() => setLastAction('Custom button pressed!')}>
          Custom Button with createButton
        </CustomButton>
      </section>

      <section class="rounded-xl border border-bg-200 bg-white p-6 shadow-sm">
        <h2 class="mb-4 text-xl font-semibold text-bg-800">Features</h2>
        <ul class="space-y-2 text-bg-600">
          <li class="flex items-center gap-2">
            <span class="text-primary">✓</span> Press states with visual feedback
          </li>
          <li class="flex items-center gap-2">
            <span class="text-primary">✓</span> Keyboard support (Enter/Space)
          </li>
          <li class="flex items-center gap-2">
            <span class="text-primary">✓</span> Disabled state handling
          </li>
          <li class="flex items-center gap-2">
            <span class="text-primary">✓</span> ARIA attributes for accessibility
          </li>
          <li class="flex items-center gap-2">
            <span class="text-primary">✓</span> 1:1 API parity with React Aria
          </li>
        </ul>
      </section>
    </div>
  );
}

function CustomButton(props: { onPress?: () => void; children: string }) {
  const { buttonProps, isPressed } = createButton({
    onPress: props.onPress,
  });

  return (
    <button
      {...buttonProps}
      class={`rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 px-6 py-3 font-medium text-white shadow-md transition-all hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
        isPressed() ? 'scale-[0.98] shadow-sm' : ''
      }`}
    >
      {props.children}
    </button>
  );
}
