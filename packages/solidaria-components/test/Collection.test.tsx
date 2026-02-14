/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import {
  CollectionRendererContext,
  Group,
  Header,
  Section,
  flattenCollectionEntries,
  isCollectionSection,
  useCollectionRenderer,
} from '../src/Collection';

describe('Collection primitives', () => {
  it('renders Section with default class', () => {
    render(() => <Section>Content</Section>);
    const section = document.querySelector('.solidaria-Section');
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute('data-section');
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders Header as heading role', () => {
    render(() => <Header aria-level={2}>Header text</Header>);
    const header = screen.getByRole('heading');
    expect(header).toHaveClass('solidaria-Header');
    expect(header).toHaveAttribute('aria-level', '2');
    expect(header).toHaveAttribute('data-header');
  });

  it('renders Group as group role', () => {
    render(() => <Group>Items</Group>);
    const group = screen.getByRole('group');
    expect(group).toHaveClass('solidaria-Group');
    expect(group).toHaveAttribute('data-group');
    expect(group).toHaveTextContent('Items');
  });

  it('supports class and style render props', () => {
    render(() => (
      <Section
        class={(props) => props.hasChildren ? 'has-children' : 'empty'}
        style={(props) => ({ opacity: props.hasChildren ? '1' : '0.5' })}
      >
        Child
      </Section>
    ));

    const section = document.querySelector('.has-children') as HTMLElement;
    expect(section).toBeInTheDocument();
    expect(section.style.opacity).toBe('1');
  });

  it('detects section entries and flattens sectioned collections', () => {
    const entries = [
      { id: 'one' },
      {
        title: <span>Group</span>,
        items: [{ id: 'two' }, { id: 'three' }],
      },
    ];

    expect(isCollectionSection(entries[1])).toBe(true);
    expect(flattenCollectionEntries(entries).map((item) => item.id)).toEqual(['one', 'two', 'three']);
  });

  it('provides collection renderer context to descendants', () => {
    function Consumer() {
      const renderer = useCollectionRenderer<{ label: string }>();
      return <div>{renderer?.renderItem({ label: 'Hello' })}</div>;
    }

    render(() => (
      <CollectionRendererContext.Provider
        value={{
          renderItem: (item: { label: string }) => <span>{item.label}</span>,
        }}
      >
        <Consumer />
      </CollectionRendererContext.Provider>
    ));

    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
