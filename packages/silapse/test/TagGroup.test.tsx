/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import { setupUser } from '@proyecto-viviana/silapse-test-utils';
import { TagGroup } from '../src/tag-group';

interface TagItem {
  id: string;
  name: string;
}

const items: TagItem[] = [
  { id: '1', name: 'News' },
  { id: '2', name: 'Travel' },
  { id: '3', name: 'Gaming' },
];

function renderTagGroup(props: Partial<Parameters<typeof TagGroup<TagItem>>[0]> = {}) {
  render(() => (
    <TagGroup<TagItem>
      items={items}
      label="Topics"
      selectionMode="single"
      {...props}
    >
      {(item) => item.name}
    </TagGroup>
  ));
}

describe('TagGroup (silapse)', () => {
  it('wires visible label via aria-labelledby', () => {
    renderTagGroup();

    const label = screen.getByText('Topics');
    const listbox = screen.getByRole('listbox', { name: 'Topics' });
    expect(label.id).toBeTruthy();
    expect(listbox.getAttribute('aria-labelledby')).toContain(label.id);
  });

  it('supports defaultSelectedKeys passthrough', () => {
    renderTagGroup({ defaultSelectedKeys: ['2'] });

    expect(screen.getByRole('option', { name: 'Travel' })).toHaveAttribute('data-selected');
    expect(screen.getByRole('option', { name: 'News' })).not.toHaveAttribute('data-selected');
  });

  it('does not allow selection when TagGroup is disabled', async () => {
    const user = setupUser();
    const onSelectionChange = vi.fn();
    renderTagGroup({
      selectionMode: 'multiple',
      isDisabled: true,
      onSelectionChange,
    });

    const options = screen.getAllByRole('option');
    for (const option of options) {
      expect(option).toHaveAttribute('aria-disabled', 'true');
    }

    await user.click(options[0]);
    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  it('supports arrow-key focus navigation', async () => {
    const user = setupUser();
    renderTagGroup();

    const news = screen.getByRole('option', { name: 'News' });
    const travel = screen.getByRole('option', { name: 'Travel' });

    news.focus();
    await user.keyboard('{ArrowRight}');

    expect(travel).toHaveFocus();
  });
});
