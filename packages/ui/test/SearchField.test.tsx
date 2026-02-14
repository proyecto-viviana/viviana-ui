/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import { SearchField } from '../src/searchfield';

describe('SearchField (ui)', () => {
  it('renders search input with label', () => {
    render(() => <SearchField label="Search" defaultValue="" />);
    expect(screen.getByRole('searchbox', { name: 'Search' })).toBeInTheDocument();
  });

  it('supports hiding the search icon', () => {
    const { container } = render(() => <SearchField label="Search" hideSearchIcon />);
    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });
});
