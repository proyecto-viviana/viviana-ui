import { type JSX, For, Show } from "solid-js";

export interface PropDefinition {
  name: string;
  type: string;
  default?: string;
  description: string;
}

export interface DocPageProps {
  title: string;
  description: string;
  importCode: string;
  children?: JSX.Element;
}

export function DocPage(props: DocPageProps) {
  return (
    <div class="mx-auto max-w-3xl px-8 py-12">
      <article class="prose">
        <h1>{props.title}</h1>
        <p>{props.description}</p>

        <h2>Import</h2>
        <pre>
          <code>{props.importCode}</code>
        </pre>

        {props.children}
      </article>
    </div>
  );
}

export interface ExampleProps {
  title: string;
  description?: string;
  code: string;
  children: JSX.Element;
}

export function Example(props: ExampleProps) {
  return (
    <>
      <h2>{props.title}</h2>
      <Show when={props.description}>
        <p>{props.description}</p>
      </Show>

      <div class="not-prose my-6 rounded-lg border border-bg-200 p-6 bg-bg-50">
        {props.children}
      </div>

      <pre>
        <code>{props.code}</code>
      </pre>
    </>
  );
}

export interface PropsTableProps {
  props: PropDefinition[];
}

export function PropsTable(props: PropsTableProps) {
  return (
    <>
      <h2>Props</h2>
      <div class="not-prose my-6 overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-bg-200">
              <th class="py-2 pr-4 text-left font-semibold">Prop</th>
              <th class="py-2 pr-4 text-left font-semibold">Type</th>
              <th class="py-2 pr-4 text-left font-semibold">Default</th>
              <th class="py-2 text-left font-semibold">Description</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-bg-100">
            <For each={props.props}>
              {(prop) => (
                <tr>
                  <td class="py-2 pr-4">
                    <code>{prop.name}</code>
                  </td>
                  <td class="py-2 pr-4 text-bg-500 font-mono text-xs">{prop.type}</td>
                  <td class="py-2 pr-4 text-bg-400">
                    <Show when={prop.default} fallback="-">
                      <code>{prop.default}</code>
                    </Show>
                  </td>
                  <td class="py-2">{prop.description}</td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </>
  );
}

export function AccessibilitySection(props: { children: JSX.Element }) {
  return (
    <>
      <h2>Accessibility</h2>
      <div class="not-prose my-4 rounded-lg border-l-4 border-primary-400 bg-primary-50 p-4">
        {props.children}
      </div>
    </>
  );
}
