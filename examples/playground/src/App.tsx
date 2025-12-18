import { Component, createSignal } from 'solid-js';
import { Button } from '@vivianacorp/ui';
import { createButton } from '@vivianacorp/solid-aria';
import './App.css';

const App: Component = () => {
  const [count, setCount] = createSignal(0);
  const [lastAction, setLastAction] = createSignal('None');

  return (
    <div class="app">
      <h1>Proyecto Viviana - Playground</h1>
      <p class="subtitle">Testing @vivianacorp/ui and @vivianacorp/solid-aria</p>

      <section class="section">
        <h2>@vivianacorp/ui Button</h2>
        <p class="description">Styled Button component using solid-aria primitives</p>

        <div class="button-row">
          <Button onPress={() => setCount((c) => c + 1)}>Count: {count()}</Button>
          <Button variant="accent" onPress={() => setLastAction('Accent clicked!')}>Accent</Button>
          <Button variant="secondary" onPress={() => setLastAction('Secondary clicked!')}>Secondary</Button>
          <Button variant="negative" onPress={() => setLastAction('Negative clicked!')}>Negative</Button>
          <Button isDisabled>Disabled</Button>
        </div>

        <div class="button-row">
          <Button style="outline" variant="primary">Outline Primary</Button>
          <Button style="outline" variant="accent">Outline Accent</Button>
          <Button style="outline" variant="secondary">Outline Secondary</Button>
          <Button style="outline" variant="negative">Outline Negative</Button>
        </div>

        <p class="action-text">Last action: {lastAction()}</p>
      </section>

      <section class="section">
        <h2>@vivianacorp/solid-aria createButton</h2>
        <p class="description">Low-level hook for custom button implementations</p>

        <CustomButton onPress={() => setLastAction('Custom button clicked!')}>
          Custom Button
        </CustomButton>
      </section>

      <section class="section">
        <h2>Features</h2>
        <ul class="features">
          <li>Press states with visual feedback</li>
          <li>Keyboard support (Enter/Space)</li>
          <li>Disabled state handling</li>
          <li>ARIA attributes</li>
          <li>1-1 parity with React Aria</li>
        </ul>
      </section>
    </div>
  );
};

// Example of using the low-level createButton hook directly
const CustomButton: Component<{
  onPress?: () => void;
  children: string;
}> = (props) => {
  const { buttonProps, isPressed } = createButton({
    onPress: props.onPress,
  });

  return (
    <button {...buttonProps} class={`custom-button ${isPressed() ? 'is-pressed' : ''}`}>
      {props.children}
    </button>
  );
};

export default App;
