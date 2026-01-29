/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@solidjs/testing-library'
import {
  Autocomplete,
  AutocompleteContext,
  AutocompleteStateContext,
  AutocompleteCollectionContext,
  useAutocompleteInput,
  useAutocompleteState,
  useAutocompleteCollection,
} from '../src/Autocomplete'
import { For, Show } from 'solid-js'

// Simple test input component
function TestInput() {
  const ctx = useAutocompleteInput()
  if (!ctx) return <input data-testid="input" />

  return (
    <input
      ref={ctx.inputRef}
      data-testid="input"
      value={ctx.inputProps.value()}
      onInput={(e) => ctx.inputProps.onChange(e.currentTarget.value)}
      onKeyDown={ctx.inputProps.onKeyDown}
      aria-activedescendant={ctx.inputProps['aria-activedescendant']()}
      aria-controls={ctx.inputProps['aria-controls']}
    />
  )
}

// Simple test list component
function TestList(props: { items: { id: string; name: string }[] }) {
  const ctx = useAutocompleteCollection()
  const state = useAutocompleteState()

  if (!ctx) {
    return (
      <ul data-testid="list">
        <For each={props.items}>
          {(item) => <li data-testid={`item-${item.id}`}>{item.name}</li>}
        </For>
      </ul>
    )
  }

  const filteredItems = () =>
    ctx.filter ? props.items.filter((item) => ctx.filter!(item.name)) : props.items

  return (
    <ul
      ref={ctx.collectionRef}
      id={ctx.collectionProps.id}
      role="listbox"
      data-testid="list"
    >
      <For each={filteredItems()}>
        {(item) => (
          <li
            id={`item-${item.id}`}
            role="option"
            data-testid={`item-${item.id}`}
            onClick={() => state?.setInputValue(item.name)}
          >
            {item.name}
          </li>
        )}
      </For>
    </ul>
  )
}

describe('Autocomplete', () => {
  const testItems = [
    { id: '1', name: 'Apple' },
    { id: '2', name: 'Banana' },
    { id: '3', name: 'Cherry' },
  ]

  it('renders children', () => {
    render(() => (
      <Autocomplete>
        <TestInput />
        <TestList items={testItems} />
      </Autocomplete>
    ))

    expect(screen.getByTestId('input')).toBeInTheDocument()
    expect(screen.getByTestId('list')).toBeInTheDocument()
  })

  it('provides input context to children', () => {
    render(() => (
      <Autocomplete>
        <TestInput />
        <TestList items={testItems} />
      </Autocomplete>
    ))

    const input = screen.getByTestId('input')
    expect(input).toHaveAttribute('aria-controls')
  })

  it('provides collection context to children', () => {
    render(() => (
      <Autocomplete>
        <TestInput />
        <TestList items={testItems} />
      </Autocomplete>
    ))

    const list = screen.getByTestId('list')
    expect(list).toHaveAttribute('id')
    expect(list).toHaveAttribute('role', 'listbox')
  })

  it('filters items based on input value', () => {
    const filter = (textValue: string, inputValue: string) =>
      textValue.toLowerCase().includes(inputValue.toLowerCase())

    render(() => (
      <Autocomplete filter={filter}>
        <TestInput />
        <TestList items={testItems} />
      </Autocomplete>
    ))

    // Initially all items visible
    expect(screen.getByTestId('item-1')).toBeInTheDocument()
    expect(screen.getByTestId('item-2')).toBeInTheDocument()
    expect(screen.getByTestId('item-3')).toBeInTheDocument()

    // Type to filter
    const input = screen.getByTestId('input')
    fireEvent.input(input, { target: { value: 'ban' } })

    expect(screen.queryByTestId('item-1')).not.toBeInTheDocument() // Apple
    expect(screen.getByTestId('item-2')).toBeInTheDocument() // Banana
    expect(screen.queryByTestId('item-3')).not.toBeInTheDocument() // Cherry
  })

  it('calls onInputChange when input value changes', () => {
    const onInputChange = vi.fn()

    render(() => (
      <Autocomplete onInputChange={onInputChange}>
        <TestInput />
        <TestList items={testItems} />
      </Autocomplete>
    ))

    const input = screen.getByTestId('input')
    fireEvent.input(input, { target: { value: 'test' } })

    expect(onInputChange).toHaveBeenCalledWith('test')
  })

  it('supports controlled input value', () => {
    render(() => (
      <Autocomplete inputValue="controlled">
        <TestInput />
        <TestList items={testItems} />
      </Autocomplete>
    ))

    const input = screen.getByTestId('input') as HTMLInputElement
    expect(input.value).toBe('controlled')
  })

  it('supports default input value', () => {
    render(() => (
      <Autocomplete defaultInputValue="default">
        <TestInput />
        <TestList items={testItems} />
      </Autocomplete>
    ))

    const input = screen.getByTestId('input') as HTMLInputElement
    expect(input.value).toBe('default')
  })

  it('updates input value when item is clicked', () => {
    render(() => (
      <Autocomplete>
        <TestInput />
        <TestList items={testItems} />
      </Autocomplete>
    ))

    const item = screen.getByTestId('item-2')
    fireEvent.click(item)

    const input = screen.getByTestId('input') as HTMLInputElement
    expect(input.value).toBe('Banana')
  })

  it('connects input aria-controls to list id', () => {
    render(() => (
      <Autocomplete>
        <TestInput />
        <TestList items={testItems} />
      </Autocomplete>
    ))

    const input = screen.getByTestId('input')
    const list = screen.getByTestId('list')

    const controlsId = input.getAttribute('aria-controls')
    const listId = list.getAttribute('id')

    expect(controlsId).toBe(listId)
  })

  it('exposes useAutocompleteState hook', () => {
    function StateConsumer() {
      const state = useAutocompleteState()
      return <span data-testid="state">{state ? 'has-state' : 'no-state'}</span>
    }

    render(() => (
      <Autocomplete>
        <StateConsumer />
      </Autocomplete>
    ))

    expect(screen.getByTestId('state')).toHaveTextContent('has-state')
  })

  it('returns null from hooks when used outside context', () => {
    function InputOutsideContext() {
      const ctx = useAutocompleteInput()
      return <span data-testid="result">{ctx ? 'has-context' : 'no-context'}</span>
    }

    render(() => <InputOutsideContext />)
    expect(screen.getByTestId('result')).toHaveTextContent('no-context')
  })
})
