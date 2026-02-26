/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import { setupUser } from '@proyecto-viviana/silapse-test-utils';
import { Breadcrumbs, BreadcrumbItem } from '../src/breadcrumbs';

interface CrumbItem {
  id: string;
  label: string;
  href?: string;
}

const crumbItems: CrumbItem[] = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'catalog', label: 'Catalog', href: '/catalog' },
  { id: 'phones', label: 'Phones' },
];

function TestBreadcrumbs(props: {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'subtle';
  showSeparator?: boolean;
  onAction?: (key: string | number) => void;
}) {
  return (
    <Breadcrumbs
      items={crumbItems}
      getKey={(item) => item.id}
      size={props.size}
      variant={props.variant}
      showSeparator={props.showSeparator}
      onAction={props.onAction}
      aria-label="Breadcrumb demo"
    >
      {(item) => <BreadcrumbItem href={item.href}>{item.label}</BreadcrumbItem>}
    </Breadcrumbs>
  );
}

describe('Breadcrumbs (silapse)', () => {
  it('renders navigation, list and breadcrumb items', () => {
    render(() => <TestBreadcrumbs />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('marks the last breadcrumb as current by default', () => {
    render(() => <TestBreadcrumbs />);
    expect(screen.getByText('Phones')).toHaveAttribute('aria-current', 'page');
  });

  it('forwards onAction through the styled wrapper', async () => {
    const user = setupUser();
    const onAction = vi.fn();
    render(() => <TestBreadcrumbs onAction={onAction} />);

    await user.click(screen.getByText('Catalog'));
    expect(onAction).toHaveBeenCalledWith('catalog');
  });

  it('supports render-prop children on BreadcrumbItem', () => {
    render(() => (
      <Breadcrumbs items={crumbItems} getKey={(item) => item.id} aria-label="Render prop breadcrumbs">
        {(item) => (
          <BreadcrumbItem href={item.href}>
            {(renderProps) => `${item.label}-${renderProps.isCurrent ? 'current' : 'link'}`}
          </BreadcrumbItem>
        )}
      </Breadcrumbs>
    ));

    expect(screen.getByText('Home-link')).toBeInTheDocument();
    expect(screen.getByText('Phones-current')).toBeInTheDocument();
  });

  it('applies subtle variant classes', () => {
    render(() => <TestBreadcrumbs variant="subtle" />);
    expect(screen.getByText('Home').className).toContain('text-primary-500');
  });

  it('applies large size classes', () => {
    render(() => <TestBreadcrumbs size="lg" />);
    expect(screen.getByText('Home').className).toContain('text-lg');
  });

  it('exposes separator icons with aria-hidden', () => {
    const { container } = render(() => <TestBreadcrumbs />);
    const icons = container.querySelectorAll('svg[aria-hidden="true"]');
    expect(icons.length).toBeGreaterThan(0);
  });
});
