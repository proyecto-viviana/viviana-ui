/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest'
import { render, screen } from '@solidjs/testing-library'
import {
  ComboBox,
  ComboBoxInputGroup,
  ComboBoxInput,
  ComboBoxButton,
  ComboBoxListBox,
  ComboBoxOption,
} from '../src/combobox'
import { SearchAutocomplete } from '../src/autocomplete'

const items = [
  { id: '1', name: 'Apple' },
  { id: '2', name: 'Banana' },
]

describe('ComboBox (solid-spectrum)', () => {
  it('associates visible label with combobox input', () => {
    render(() => (
      <ComboBox
        label="Fruit"
        items={items}
        getKey={(item) => item.id}
        getTextValue={(item) => item.name}
      >
        <ComboBoxInputGroup>
          <ComboBoxInput />
          <ComboBoxButton />
        </ComboBoxInputGroup>
        <ComboBoxListBox>
          {(item) => <ComboBoxOption id={item.id}>{item.name}</ComboBoxOption>}
        </ComboBoxListBox>
      </ComboBox>
    ))

    expect(screen.getByRole('combobox', { name: 'Fruit' })).toBeInTheDocument()
  })

  it('links description text via aria-describedby', () => {
    render(() => (
      <ComboBox
        label="Fruit"
        description="Pick one item"
        items={items}
        getKey={(item) => item.id}
        getTextValue={(item) => item.name}
      >
        <ComboBoxInputGroup>
          <ComboBoxInput />
          <ComboBoxButton />
        </ComboBoxInputGroup>
        <ComboBoxListBox>
          {(item) => <ComboBoxOption id={item.id}>{item.name}</ComboBoxOption>}
        </ComboBoxListBox>
      </ComboBox>
    ))

    const input = screen.getByRole('combobox', { name: 'Fruit' })
    const describedBy = input.getAttribute('aria-describedby') ?? ''
    const description = screen.getByText('Pick one item')

    expect(describedBy).toContain(description.id)
  })

  it('links error text and omits hidden description ids when invalid', () => {
    render(() => (
      <ComboBox
        label="Fruit"
        description="Pick one item"
        errorMessage="Selection is required"
        isInvalid
        items={items}
        getKey={(item) => item.id}
        getTextValue={(item) => item.name}
      >
        <ComboBoxInputGroup>
          <ComboBoxInput />
          <ComboBoxButton />
        </ComboBoxInputGroup>
        <ComboBoxListBox>
          {(item) => <ComboBoxOption id={item.id}>{item.name}</ComboBoxOption>}
        </ComboBoxListBox>
      </ComboBox>
    ))

    const input = screen.getByRole('combobox', { name: 'Fruit' })
    const describedBy = input.getAttribute('aria-describedby') ?? ''
    const error = screen.getByText('Selection is required')

    expect(screen.queryByText('Pick one item')).not.toBeInTheDocument()
    expect(describedBy).not.toContain('description')
    expect(describedBy).toContain(error.id)
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  it('submits selected key by default when name is provided', () => {
    render(() => (
      <ComboBox
        label="Fruit"
        name="fruit"
        defaultSelectedKey="1"
        items={items}
        getKey={(item) => item.id}
        getTextValue={(item) => item.name}
      >
        <ComboBoxInputGroup>
          <ComboBoxInput />
          <ComboBoxButton />
        </ComboBoxInputGroup>
        <ComboBoxListBox>
          {(item) => <ComboBoxOption id={item.id}>{item.name}</ComboBoxOption>}
        </ComboBoxListBox>
      </ComboBox>
    ))

    const input = screen.getByRole('combobox', { name: 'Fruit' })
    const hiddenInput = document.querySelector('input[type="hidden"][name="fruit"]')

    expect(input).not.toHaveAttribute('name')
    expect(hiddenInput).toBeInTheDocument()
    expect(hiddenInput).toHaveValue('1')
  })

  it('uses text submission when allowsCustomValue is enabled', () => {
    render(() => (
      <ComboBox
        label="Fruit"
        name="fruit"
        formValue="key"
        allowsCustomValue
        defaultInputValue="Dragonfruit"
        items={items}
        getKey={(item) => item.id}
        getTextValue={(item) => item.name}
      >
        <ComboBoxInputGroup>
          <ComboBoxInput />
          <ComboBoxButton />
        </ComboBoxInputGroup>
        <ComboBoxListBox>
          {(item) => <ComboBoxOption id={item.id}>{item.name}</ComboBoxOption>}
        </ComboBoxListBox>
      </ComboBox>
    ))

    const input = screen.getByRole('combobox', { name: 'Fruit' })
    const hiddenInput = document.querySelector('input[type="hidden"][name="fruit"]')

    expect(input).toHaveAttribute('name', 'fruit')
    expect(input).toHaveValue('Dragonfruit')
    expect(hiddenInput).not.toBeInTheDocument()
  })
})

describe('SearchAutocomplete (solid-spectrum)', () => {
  it('uses visible label as combobox accessible name', () => {
    render(() => (
      <SearchAutocomplete
        label="Search fruit"
        items={items}
      />
    ))

    expect(screen.getByRole('combobox', { name: 'Search fruit' })).toBeInTheDocument()
  })
})
