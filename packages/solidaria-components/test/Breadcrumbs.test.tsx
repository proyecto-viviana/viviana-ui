/**
 * Breadcrumbs tests - Port of React Aria's Breadcrumbs.test.tsx
 *
 * Tests for Breadcrumbs component functionality including:
 * - Rendering
 * - Navigation structure
 * - Current item
 * - Disabled state
 * - Links/navigation
 * - ARIA attributes
 */

import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { PointerEventsCheckLevel } from '@testing-library/user-event';
import { Breadcrumbs, BreadcrumbItem } from '../src/Breadcrumbs';

// Pointer map matching react-spectrum's test setup
const pointerMap = [
  { name: 'MouseLeft', pointerType: 'mouse', button: 'primary', height: 1, width: 1, pressure: 0.5 },
  { name: 'MouseRight', pointerType: 'mouse', button: 'secondary' },
  { name: 'MouseMiddle', pointerType: 'mouse', button: 'auxiliary' },
  { name: 'TouchA', pointerType: 'touch', height: 1, width: 1 },
  { name: 'TouchB', pointerType: 'touch' },
  { name: 'TouchC', pointerType: 'touch' },
];

function setupUser() {
  return userEvent.setup({
    delay: null,
    pointerMap: pointerMap as any,
    pointerEventsCheck: PointerEventsCheckLevel.Never,
  });
}

// Sample breadcrumb items for testing
const breadcrumbItems = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'products', label: 'Products', href: '/products' },
  { id: 'category', label: 'Category', href: '/products/category' },
];

describe('Breadcrumbs', () => {
  let user: ReturnType<typeof setupUser>;

  beforeEach(() => {
    user = setupUser();
  });

  afterEach(() => {
    cleanup();
  });

  // ============================================
  // RENDERING
  // ============================================

  describe('rendering', () => {
    it('should render with default class', () => {
      render(() => (
        <Breadcrumbs items={breadcrumbItems} getKey={(item) => item.id}>
          {(item) => <BreadcrumbItem href={item.href}>{item.label}</BreadcrumbItem>}
        </Breadcrumbs>
      ));

      const breadcrumbs = document.querySelector('.solidaria-Breadcrumbs');
      expect(breadcrumbs).toBeInTheDocument();
    });

    it('should render navigation element', () => {
      render(() => (
        <Breadcrumbs items={breadcrumbItems} getKey={(item) => item.id}>
          {(item) => <BreadcrumbItem href={item.href}>{item.label}</BreadcrumbItem>}
        </Breadcrumbs>
      ));

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });

    it('should render list', () => {
      render(() => (
        <Breadcrumbs items={breadcrumbItems} getKey={(item) => item.id}>
          {(item) => <BreadcrumbItem href={item.href}>{item.label}</BreadcrumbItem>}
        </Breadcrumbs>
      ));

      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();
    });

    it('should render all items', () => {
      render(() => (
        <Breadcrumbs items={breadcrumbItems} getKey={(item) => item.id}>
          {(item) => <BreadcrumbItem href={item.href}>{item.label}</BreadcrumbItem>}
        </Breadcrumbs>
      ));

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.getByText('Category')).toBeInTheDocument();
    });

    it('should render with custom class', () => {
      render(() => (
        <Breadcrumbs items={breadcrumbItems} getKey={(item) => item.id} class="my-breadcrumbs">
          {(item) => <BreadcrumbItem href={item.href}>{item.label}</BreadcrumbItem>}
        </Breadcrumbs>
      ));

      const breadcrumbs = document.querySelector('.my-breadcrumbs');
      expect(breadcrumbs).toBeInTheDocument();
    });
  });

  // ============================================
  // BREADCRUMB ITEMS
  // ============================================

  describe('breadcrumb items', () => {
    it('should render BreadcrumbItem with default class', () => {
      render(() => (
        <Breadcrumbs items={breadcrumbItems} getKey={(item) => item.id}>
          {(item) => <BreadcrumbItem href={item.href}>{item.label}</BreadcrumbItem>}
        </Breadcrumbs>
      ));

      const items = document.querySelectorAll('.solidaria-BreadcrumbItem');
      expect(items).toHaveLength(3);
    });

    it('should render links', () => {
      render(() => (
        <Breadcrumbs items={breadcrumbItems} getKey={(item) => item.id}>
          {(item) => <BreadcrumbItem href={item.href}>{item.label}</BreadcrumbItem>}
        </Breadcrumbs>
      ));

      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(3);
    });

    it('should have correct href on links', () => {
      render(() => (
        <Breadcrumbs items={breadcrumbItems} getKey={(item) => item.id}>
          {(item) => <BreadcrumbItem href={item.href}>{item.label}</BreadcrumbItem>}
        </Breadcrumbs>
      ));

      const homeLink = screen.getByText('Home');
      expect(homeLink).toHaveAttribute('href', '/');

      const productsLink = screen.getByText('Products');
      expect(productsLink).toHaveAttribute('href', '/products');
    });
  });

  // ============================================
  // CURRENT ITEM
  // ============================================

  describe('current item', () => {
    it('should mark last item as current', () => {
      render(() => (
        <Breadcrumbs items={breadcrumbItems} getKey={(item) => item.id}>
          {(item) => (
            <BreadcrumbItem
              href={item.href}
              isCurrent={item.id === 'category'}
            >
              {item.label}
            </BreadcrumbItem>
          )}
        </Breadcrumbs>
      ));

      const currentItem = screen.getByText('Category');
      expect(currentItem).toHaveAttribute('data-current');
    });

    it('should have aria-current on current item', () => {
      render(() => (
        <Breadcrumbs items={breadcrumbItems} getKey={(item) => item.id}>
          {(item) => (
            <BreadcrumbItem
              href={item.href}
              isCurrent={item.id === 'category'}
            >
              {item.label}
            </BreadcrumbItem>
          )}
        </Breadcrumbs>
      ));

      const currentItem = screen.getByText('Category');
      expect(currentItem).toHaveAttribute('aria-current', 'page');
    });

    it('should not have aria-current on non-current items', () => {
      render(() => (
        <Breadcrumbs items={breadcrumbItems} getKey={(item) => item.id}>
          {(item) => (
            <BreadcrumbItem
              href={item.href}
              isCurrent={item.id === 'category'}
            >
              {item.label}
            </BreadcrumbItem>
          )}
        </Breadcrumbs>
      ));

      const homeLink = screen.getByText('Home');
      expect(homeLink).not.toHaveAttribute('aria-current');
    });
  });

  // ============================================
  // DISABLED STATE
  // ============================================

  describe('disabled state', () => {
    it('should support isDisabled on Breadcrumbs', () => {
      render(() => (
        <Breadcrumbs items={breadcrumbItems} getKey={(item) => item.id} isDisabled>
          {(item) => <BreadcrumbItem href={item.href}>{item.label}</BreadcrumbItem>}
        </Breadcrumbs>
      ));

      const breadcrumbs = document.querySelector('.solidaria-Breadcrumbs');
      expect(breadcrumbs).toHaveAttribute('data-disabled');
    });

    it('should support isDisabled on BreadcrumbItem', () => {
      render(() => (
        <Breadcrumbs items={breadcrumbItems} getKey={(item) => item.id}>
          {(item) => (
            <BreadcrumbItem href={item.href} isDisabled={item.id === 'products'}>
              {item.label}
            </BreadcrumbItem>
          )}
        </Breadcrumbs>
      ));

      const productsLink = screen.getByText('Products');
      expect(productsLink).toHaveAttribute('data-disabled');
    });
  });

  // ============================================
  // INTERACTION
  // ============================================

  describe('interaction', () => {
    it('should call onPress when clicking a breadcrumb', async () => {
      const onPress = vi.fn();
      render(() => (
        <Breadcrumbs items={breadcrumbItems} getKey={(item) => item.id}>
          {(item) => (
            <BreadcrumbItem href={item.href} onPress={item.id === 'home' ? onPress : undefined}>
              {item.label}
            </BreadcrumbItem>
          )}
        </Breadcrumbs>
      ));

      const homeLink = screen.getByText('Home');
      await user.click(homeLink);

      expect(onPress).toHaveBeenCalled();
    });
  });

  // ============================================
  // ARIA ATTRIBUTES
  // ============================================

  describe('aria attributes', () => {
    it('should have navigation role', () => {
      render(() => (
        <Breadcrumbs items={breadcrumbItems} getKey={(item) => item.id}>
          {(item) => <BreadcrumbItem href={item.href}>{item.label}</BreadcrumbItem>}
        </Breadcrumbs>
      ));

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });

    it('should have aria-label when provided', () => {
      render(() => (
        <Breadcrumbs items={breadcrumbItems} getKey={(item) => item.id} aria-label="Breadcrumb navigation">
          {(item) => <BreadcrumbItem href={item.href}>{item.label}</BreadcrumbItem>}
        </Breadcrumbs>
      ));

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label', 'Breadcrumb navigation');
    });

    it('should have list role for ol element', () => {
      render(() => (
        <Breadcrumbs items={breadcrumbItems} getKey={(item) => item.id}>
          {(item) => <BreadcrumbItem href={item.href}>{item.label}</BreadcrumbItem>}
        </Breadcrumbs>
      ));

      const list = screen.getByRole('list');
      expect(list.tagName.toLowerCase()).toBe('ol');
    });
  });

  // ============================================
  // EMPTY STATE
  // ============================================

  describe('empty state', () => {
    it('should render empty breadcrumbs', () => {
      render(() => (
        <Breadcrumbs items={[]} getKey={(item: { id: string }) => item.id}>
          {(item: { id: string; label: string }) => <BreadcrumbItem>{item.label}</BreadcrumbItem>}
        </Breadcrumbs>
      ));

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();

      const items = document.querySelectorAll('.solidaria-BreadcrumbItem');
      expect(items).toHaveLength(0);
    });
  });
});
