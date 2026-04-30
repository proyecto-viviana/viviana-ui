/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@solidjs/testing-library";
import { Tree, TreeItem } from "../src/tree";
import type { TreeItemData } from "@proyecto-viviana/solid-stately";

interface TestItem {
  name: string;
}

function createTestItems(): TreeItemData<TestItem>[] {
  return [
    {
      key: "folder-1",
      value: { name: "Documents" },
      textValue: "Documents",
      children: [
        { key: "file-1", value: { name: "Report.pdf" }, textValue: "Report.pdf" },
        { key: "file-2", value: { name: "Notes.txt" }, textValue: "Notes.txt" },
      ],
    },
    {
      key: "folder-2",
      value: { name: "Images" },
      textValue: "Images",
      children: [{ key: "file-3", value: { name: "Photo.jpg" }, textValue: "Photo.jpg" }],
    },
    {
      key: "file-4",
      value: { name: "readme.md" },
      textValue: "readme.md",
    },
  ];
}

function TestTree(props: {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "bordered" | "quiet";
  label?: string;
  description?: string;
  defaultExpandedKeys?: string[];
  selectionMode?: "none" | "single" | "multiple";
  defaultSelectedKeys?: string[];
  disabledKeys?: string[];
  items?: TreeItemData<TestItem>[];
}) {
  const items = props.items ?? createTestItems();
  return (
    <Tree
      items={items}
      aria-label="Test tree"
      size={props.size}
      variant={props.variant}
      label={props.label}
      description={props.description}
      defaultExpandedKeys={props.defaultExpandedKeys}
      selectionMode={props.selectionMode}
      defaultSelectedKeys={props.defaultSelectedKeys}
      disabledKeys={props.disabledKeys}
    >
      {(item) => <TreeItem id={item.key}>{item.textValue}</TreeItem>}
    </Tree>
  );
}

describe("Tree (solid-spectrum)", () => {
  afterEach(() => cleanup());

  describe("variant styles", () => {
    it("renders treegrid rows with gridcells", () => {
      render(() => <TestTree defaultExpandedKeys={["folder-1"]} />);
      const tree = screen.getByRole("treegrid");
      const rows = screen.getAllByRole("row");

      expect(tree).toBeInTheDocument();
      expect(rows.length).toBeGreaterThan(0);
      for (const row of rows) {
        expect(row.querySelector('[role="gridcell"]')).toBeInTheDocument();
      }
    });

    it("applies default variant classes", () => {
      render(() => <TestTree />);
      const tree = screen.getByRole("treegrid");
      // default: 'bg-bg-400 rounded-lg border border-bg-300 p-2'
      expect(tree.className).toContain("bg-bg-400");
      expect(tree.className).toContain("rounded-lg");
      expect(tree.className).toContain("border");
    });

    it("applies bordered variant classes", () => {
      render(() => <TestTree variant="bordered" />);
      const tree = screen.getByRole("treegrid");
      // bordered: 'bg-bg-400 rounded-lg border-2 border-bg-400 p-2'
      expect(tree.className).toContain("border-2");
      expect(tree.className).toContain("rounded-lg");
    });

    it("applies quiet variant classes", () => {
      render(() => <TestTree variant="quiet" />);
      const tree = screen.getByRole("treegrid");
      // quiet: 'bg-transparent'
      expect(tree.className).toContain("bg-transparent");
    });
  });

  describe("size variants", () => {
    it("applies sm size classes to tree", () => {
      render(() => <TestTree size="sm" />);
      const tree = screen.getByRole("treegrid");
      // sm tree: 'text-sm'
      expect(tree.className).toContain("text-sm");
    });

    it("applies md size classes to tree by default", () => {
      render(() => <TestTree />);
      const tree = screen.getByRole("treegrid");
      // md tree: 'text-base'
      expect(tree.className).toContain("text-base");
    });

    it("applies lg size classes to tree", () => {
      render(() => <TestTree size="lg" />);
      const tree = screen.getByRole("treegrid");
      // lg tree: 'text-lg'
      expect(tree.className).toContain("text-lg");
    });

    it("applies sm item classes", () => {
      render(() => <TestTree size="sm" />);
      const rows = screen.getAllByRole("row");
      // sm item: 'py-1 px-2 gap-1'
      expect(rows[0].className).toContain("py-1");
      expect(rows[0].className).toContain("px-2");
    });

    it("applies lg item classes", () => {
      render(() => <TestTree size="lg" />);
      const rows = screen.getAllByRole("row");
      // lg item: 'py-2 px-4 gap-2'
      expect(rows[0].className).toContain("py-2");
      expect(rows[0].className).toContain("px-4");
    });
  });

  describe("indent levels", () => {
    it("root items have padding-left based on level 0", () => {
      render(() => <TestTree defaultExpandedKeys={["folder-1"]} />);
      const rows = screen.getAllByRole("row");
      const rootRow = rows.find((r) => r.textContent?.includes("Documents"));
      // level 0: padding-left = 0 * 20 + 8 = 8px (md indent=20)
      expect(rootRow?.style.paddingLeft).toBe("8px");
    });

    it("child items have increased padding-left", () => {
      render(() => <TestTree defaultExpandedKeys={["folder-1"]} />);
      const rows = screen.getAllByRole("row");
      const childRow = rows.find((r) => r.textContent?.includes("Report.pdf"));
      // level 1: padding-left = 1 * 20 + 8 = 28px (md indent=20)
      expect(childRow?.style.paddingLeft).toBe("28px");
    });

    it("sm indent is 16px per level", () => {
      render(() => <TestTree size="sm" defaultExpandedKeys={["folder-1"]} />);
      const rows = screen.getAllByRole("row");
      const childRow = rows.find((r) => r.textContent?.includes("Report.pdf"));
      // level 1: padding-left = 1 * 16 + 8 = 24px
      expect(childRow?.style.paddingLeft).toBe("24px");
    });

    it("lg indent is 24px per level", () => {
      render(() => <TestTree size="lg" defaultExpandedKeys={["folder-1"]} />);
      const rows = screen.getAllByRole("row");
      const childRow = rows.find((r) => r.textContent?.includes("Report.pdf"));
      // level 1: padding-left = 1 * 24 + 8 = 32px
      expect(childRow?.style.paddingLeft).toBe("32px");
    });
  });

  describe("default icons", () => {
    it("renders FolderIcon for expandable items", () => {
      render(() => <TestTree />);
      const rows = screen.getAllByRole("row");
      const folderRow = rows.find((r) => r.textContent?.includes("Documents"));
      // FolderIcon has a path with folder shape
      const svgs = folderRow?.querySelectorAll("svg");
      expect(svgs!.length).toBeGreaterThan(0);
    });

    it("renders FileIcon for leaf items", () => {
      render(() => <TestTree />);
      const rows = screen.getAllByRole("row");
      const fileRow = rows.find((r) => r.textContent?.includes("readme.md"));
      // FileIcon has a path with file shape
      const svgs = fileRow?.querySelectorAll("svg");
      expect(svgs!.length).toBeGreaterThan(0);
    });
  });

  describe("custom icon", () => {
    it("overrides default icon when provided", () => {
      render(() => (
        <Tree items={createTestItems()} aria-label="Custom tree">
          {(item) => (
            <TreeItem id={item.key} icon={() => <svg data-testid="custom-icon" />}>
              {item.textValue}
            </TreeItem>
          )}
        </Tree>
      ));

      const customIcons = screen.getAllByTestId("custom-icon");
      expect(customIcons.length).toBeGreaterThan(0);
    });
  });

  describe("expand/collapse", () => {
    it("expand button chevron has rotate-90 when expanded", () => {
      render(() => <TestTree defaultExpandedKeys={["folder-1"]} />);
      const rows = screen.getAllByRole("row");
      const expandedRow = rows.find((r) => r.textContent?.includes("Documents"));
      // The chevron SVG in expanded state should have rotate-90
      const svgs = expandedRow?.querySelectorAll("svg");
      const chevronSvg = Array.from(svgs || []).find(
        (svg) =>
          svg.className.baseVal?.includes("rotate-90") ||
          svg.getAttribute("class")?.includes("rotate-90"),
      );
      expect(chevronSvg).toBeTruthy();
    });

    it("expand button chevron does NOT have rotate-90 when collapsed", () => {
      render(() => <TestTree />);
      const rows = screen.getAllByRole("row");
      const collapsedRow = rows.find((r) => r.textContent?.includes("Documents"));
      // The first SVG (chevron) should not have rotate-90 when collapsed
      const svgs = collapsedRow?.querySelectorAll("svg");
      const rotatedSvg = Array.from(svgs || []).find(
        (svg) =>
          svg.className.baseVal?.includes("rotate-90") ||
          svg.getAttribute("class")?.includes("rotate-90"),
      );
      expect(rotatedSvg).toBeFalsy();
    });
  });

  describe("selection", () => {
    it("selected item gets variant itemSelected class", () => {
      render(() => <TestTree selectionMode="single" defaultSelectedKeys={["file-4"]} />);
      const rows = screen.getAllByRole("row");
      const selectedRow = rows.find((r) => r.textContent?.includes("readme.md"));
      // itemSelected: 'bg-accent/10 text-accent'
      expect(selectedRow?.className).toContain("bg-accent/10");
      expect(selectedRow?.className).toContain("text-accent");
    });

    it("selected item renders CheckIcon", () => {
      render(() => <TestTree selectionMode="single" defaultSelectedKeys={["file-4"]} />);
      const rows = screen.getAllByRole("row");
      const selectedRow = rows.find((r) => r.textContent?.includes("readme.md"));
      // CheckIcon has path with "M5 13l4 4L19 7"
      const svgs = selectedRow?.querySelectorAll("svg");
      const checkIcon = Array.from(svgs || []).find((svg) => {
        const path = svg.querySelector("path");
        return path?.getAttribute("d")?.includes("M5 13l4 4L19 7");
      });
      expect(checkIcon).toBeTruthy();
    });
  });

  describe("disabled items", () => {
    it("disabled item gets opacity-50 cursor-not-allowed", () => {
      render(() => <TestTree disabledKeys={["file-4"]} />);
      const rows = screen.getAllByRole("row");
      const disabledRow = rows.find((r) => r.textContent?.includes("readme.md"));
      expect(disabledRow?.className).toContain("opacity-50");
      expect(disabledRow?.className).toContain("cursor-not-allowed");
    });
  });

  describe("label and description", () => {
    it("renders label above tree", () => {
      render(() => <TestTree label="File Browser" />);
      expect(screen.getByText("File Browser")).toBeInTheDocument();
    });

    it("renders description below tree", () => {
      render(() => <TestTree description="Browse your files" />);
      expect(screen.getByText("Browse your files")).toBeInTheDocument();
    });
  });

  describe("empty state", () => {
    it('renders "No items" text', () => {
      render(() => <TestTree items={[]} />);
      expect(screen.getByText("No items")).toBeInTheDocument();
    });

    it("renders EmptyTreeIcon SVG", () => {
      const { container } = render(() => <TestTree items={[]} />);
      // EmptyTreeIcon has w-12 h-12 classes
      const icon = container.querySelector("svg.w-12.h-12");
      expect(icon).toBeInTheDocument();
    });
  });

  describe("size context propagation", () => {
    it("propagates sm size from Tree to TreeItem", () => {
      render(() => <TestTree size="sm" />);
      const rows = screen.getAllByRole("row");
      // sm item: 'py-1 px-2 gap-1'
      expect(rows[0].className).toContain("py-1");
    });

    it("propagates lg size from Tree to TreeItem", () => {
      render(() => <TestTree size="lg" />);
      const rows = screen.getAllByRole("row");
      // lg item: 'py-2 px-4 gap-2'
      expect(rows[0].className).toContain("py-2");
      expect(rows[0].className).toContain("px-4");
    });
  });
});
