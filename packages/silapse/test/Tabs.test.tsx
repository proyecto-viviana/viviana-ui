/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import { createSignal } from 'solid-js';
import { setupUser } from '@proyecto-viviana/silapse-test-utils';
import { Tabs, TabList, Tab, TabPanel } from '../src/tabs';

/** Helper items for tab rendering. */
const tabItems = [
  { id: 'tab1', label: 'First' },
  { id: 'tab2', label: 'Second' },
  { id: 'tab3', label: 'Third' },
];

/** Reusable full tabs component for styling tests. */
function TestTabs(props: {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'underline' | 'pill' | 'boxed';
  orientation?: 'horizontal' | 'vertical';
  disabledKeys?: string[];
}) {
  return (
    <Tabs
      items={tabItems}
      getKey={(i) => i.id}
      defaultSelectedKey="tab1"
      size={props.size}
      variant={props.variant}
      orientation={props.orientation}
      disabledKeys={props.disabledKeys}
    >
      <TabList items={tabItems}>
        {(item) => <Tab id={item.id}>{item.label}</Tab>}
      </TabList>
      <TabPanel id="tab1">Content 1</TabPanel>
      <TabPanel id="tab2">Content 2</TabPanel>
      <TabPanel id="tab3">Content 3</TabPanel>
    </Tabs>
  );
}

describe('Tabs (silapse)', () => {
  describe('roles', () => {
    it('renders TabList with role="tablist"', () => {
      render(() => <TestTabs />);
      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    it('renders tabs with role="tab"', () => {
      render(() => <TestTabs />);
      const tabs = screen.getAllByRole('tab');
      expect(tabs.length).toBe(3);
    });

    it('renders tabpanel with role="tabpanel"', () => {
      render(() => <TestTabs />);
      expect(screen.getByRole('tabpanel')).toBeInTheDocument();
    });
  });

  describe('size variants', () => {
    it('applies sm size classes to tabs', () => {
      render(() => <TestTabs size="sm" />);
      const tabs = screen.getAllByRole('tab');
      // sm tab: 'text-sm px-3 py-1.5'
      expect(tabs[0].className).toContain('text-sm');
      expect(tabs[0].className).toContain('px-3');
    });

    it('applies md size classes to tabs by default', () => {
      render(() => <TestTabs />);
      const tabs = screen.getAllByRole('tab');
      // md tab: 'text-base px-4 py-2'
      expect(tabs[0].className).toContain('text-base');
      expect(tabs[0].className).toContain('px-4');
    });

    it('applies lg size classes to tabs', () => {
      render(() => <TestTabs size="lg" />);
      const tabs = screen.getAllByRole('tab');
      // lg tab: 'text-lg px-5 py-2.5'
      expect(tabs[0].className).toContain('text-lg');
      expect(tabs[0].className).toContain('px-5');
    });

    it('applies sm size classes to tablist', () => {
      render(() => <TestTabs size="sm" />);
      const tablist = screen.getByRole('tablist');
      // sm tabList: 'gap-1'
      expect(tablist.className).toContain('gap-1');
    });

    it('applies lg size classes to tabpanel', () => {
      render(() => <TestTabs size="lg" />);
      const panel = screen.getByRole('tabpanel');
      // lg panel: 'text-lg p-5'
      expect(panel.className).toContain('p-5');
    });
  });

  describe('underline variant (default)', () => {
    it('applies border-b on tablist', () => {
      render(() => <TestTabs />);
      const tablist = screen.getByRole('tablist');
      expect(tablist.className).toContain('border-b-2');
      expect(tablist.className).toContain('border-primary-600');
    });

    it('selected tab gets border-accent and text-accent', () => {
      render(() => <TestTabs />);
      const tabs = screen.getAllByRole('tab');
      const selectedTab = tabs.find(
        (t) => t.getAttribute('aria-selected') === 'true'
      );
      expect(selectedTab?.className).toContain('border-accent');
      expect(selectedTab?.className).toContain('text-accent');
    });

    it('unselected tab gets border-transparent', () => {
      render(() => <TestTabs />);
      const tabs = screen.getAllByRole('tab');
      const unselectedTab = tabs.find(
        (t) => t.getAttribute('aria-selected') !== 'true'
      );
      expect(unselectedTab?.className).toContain('border-transparent');
    });
  });

  describe('pill variant', () => {
    it('tablist has rounded bg container', () => {
      render(() => <TestTabs variant="pill" />);
      const tablist = screen.getByRole('tablist');
      expect(tablist.className).toContain('bg-bg-300');
      expect(tablist.className).toContain('rounded-lg');
    });

    it('selected tab gets bg-accent and shadow', () => {
      render(() => <TestTabs variant="pill" />);
      const tabs = screen.getAllByRole('tab');
      const selectedTab = tabs.find(
        (t) => t.getAttribute('aria-selected') === 'true'
      );
      expect(selectedTab?.className).toContain('bg-accent');
      expect(selectedTab?.className).toContain('shadow-sm');
    });
  });

  describe('boxed variant', () => {
    it('tablist has border-2 and rounded container', () => {
      render(() => <TestTabs variant="boxed" />);
      const tablist = screen.getByRole('tablist');
      expect(tablist.className).toContain('border-2');
      expect(tablist.className).toContain('border-primary-600');
      expect(tablist.className).toContain('rounded-lg');
    });

    it('tabs have border-r between them', () => {
      render(() => <TestTabs variant="boxed" />);
      const tabs = screen.getAllByRole('tab');
      // boxed tab base: 'border-r-2 border-primary-600 last:border-r-0'
      expect(tabs[0].className).toContain('border-r-2');
    });

    it('selected tab gets bg-accent/20', () => {
      render(() => <TestTabs variant="boxed" />);
      const tabs = screen.getAllByRole('tab');
      const selectedTab = tabs.find(
        (t) => t.getAttribute('aria-selected') === 'true'
      );
      expect(selectedTab?.className).toContain('bg-accent/20');
      expect(selectedTab?.className).toContain('text-accent');
    });
  });

  describe('disabled tab', () => {
    it('applies cursor-not-allowed', () => {
      render(() => <TestTabs disabledKeys={['tab2']} />);
      const tabs = screen.getAllByRole('tab');
      const disabledTab = tabs.find(
        (t) => t.textContent === 'Second'
      );
      expect(disabledTab?.className).toContain('cursor-not-allowed');
    });

    it('applies variant-specific disabled class for underline', () => {
      render(() => <TestTabs disabledKeys={['tab2']} />);
      const tabs = screen.getAllByRole('tab');
      const disabledTab = tabs.find(
        (t) => t.textContent === 'Second'
      );
      // underline disabled: 'border-transparent text-primary-600 cursor-not-allowed'
      expect(disabledTab?.className).toContain('text-primary-600');
    });

    it('applies variant-specific disabled class for pill', () => {
      render(() => <TestTabs variant="pill" disabledKeys={['tab2']} />);
      const tabs = screen.getAllByRole('tab');
      const disabledTab = tabs.find(
        (t) => t.textContent === 'Second'
      );
      // pill disabled: 'text-primary-600 cursor-not-allowed'
      expect(disabledTab?.className).toContain('text-primary-600');
      expect(disabledTab?.className).toContain('cursor-not-allowed');
    });
  });

  describe('vertical orientation', () => {
    it('Tabs wrapper switches to flex-row', () => {
      const { container } = render(() => <TestTabs orientation="vertical" />);
      // The Tabs wrapper (outermost solidaria-Tabs div) should have flex-row
      const tabsWrapper = container.querySelector('[data-orientation="vertical"]');
      expect(tabsWrapper).toBeInTheDocument();
      expect(tabsWrapper!.className).toContain('flex-row');
    });

    it('TabList uses flex-col for vertical', () => {
      render(() => <TestTabs orientation="vertical" />);
      const tablist = screen.getByRole('tablist');
      expect(tablist.className).toContain('flex-col');
    });
  });

  describe('keyboard navigation', () => {
    it('arrow keys update roving tabindex', async () => {
      const user = setupUser();
      render(() => <TestTabs />);

      const tabs = screen.getAllByRole('tab');
      // Focus the selected tab (tab1 has tabindex="0")
      const selectedTab = tabs.find(
        (t) => t.getAttribute('tabindex') === '0'
      );
      expect(selectedTab).toBeTruthy();
      selectedTab!.focus();

      // Right arrow should update tabindex pattern
      await user.keyboard('{ArrowRight}');
      expect(document.activeElement).toBe(tabs[1]);
      expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('dynamic updates', () => {
    it('reselects first enabled tab when selected tab is removed', () => {
      const [items, setItems] = createSignal(tabItems);

      render(() => (
        <Tabs
          items={items()}
          getKey={(item) => item.id}
          defaultSelectedKey="tab2"
        >
          <TabList items={items()}>
            {(item) => <Tab id={item.id}>{item.label}</Tab>}
          </TabList>
          {items().map((item) => (
            <TabPanel id={item.id}>Content for {item.label}</TabPanel>
          ))}
        </Tabs>
      ));

      let tabs = screen.getAllByRole('tab');
      expect(tabs[1]).toHaveAttribute('aria-selected', 'true');

      setItems(tabItems.filter((item) => item.id !== 'tab2'));

      tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(2);
      expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByRole('tabpanel')).toHaveTextContent('Content for First');
    });
  });
});
