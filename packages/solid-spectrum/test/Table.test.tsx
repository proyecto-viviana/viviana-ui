/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@solidjs/testing-library";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableFooter,
  TableRow,
  TableCell,
} from "../src/table";

/** Test data. */
const columns = [
  { key: "name", name: "Name" },
  { key: "role", name: "Role" },
];

const rows = [
  { id: 1, name: "Alice", role: "Engineer" },
  { id: 2, name: "Bob", role: "Designer" },
  { id: 3, name: "Carol", role: "Manager" },
];

/** Reusable table helper using the same render prop pattern as headless tests. */
function TestTable(props: {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "striped" | "bordered";
  title?: string;
  description?: string;
  items?: typeof rows;
}) {
  const data = props.items ?? rows;
  return (
    <Table
      items={data}
      columns={columns}
      getKey={(r: any) => r.id}
      size={props.size}
      variant={props.variant}
      title={props.title}
      description={props.description}
      aria-label="Test table"
    >
      {() => (
        <>
          <TableHeader>
            <TableColumn id="name">{() => <>Name</>}</TableColumn>
            <TableColumn id="role">{() => <>Role</>}</TableColumn>
          </TableHeader>
          <TableBody>
            {(row: any) => (
              <TableRow id={row.id} item={row}>
                {() => (
                  <>
                    <TableCell>{() => <>{row.name}</>}</TableCell>
                    <TableCell>{() => <>{row.role}</>}</TableCell>
                  </>
                )}
              </TableRow>
            )}
          </TableBody>
        </>
      )}
    </Table>
  );
}

describe("Table (solid-spectrum)", () => {
  afterEach(() => cleanup());

  describe("structure", () => {
    it('renders a table element with role="grid"', () => {
      render(() => <TestTable />);
      expect(screen.getByRole("grid")).toBeInTheDocument();
      expect(screen.getByRole("grid").tagName).toBe("TABLE");
    });

    it("renders inside a variant wrapper div", () => {
      const { container } = render(() => <TestTable />);
      // default wrapper: 'rounded-lg border border-bg-300 overflow-hidden'
      const wrapper = container.querySelector(".rounded-lg.overflow-hidden");
      expect(wrapper).toBeInTheDocument();
    });

    it("renders a styled table footer", () => {
      render(() => (
        <Table items={rows} columns={columns} getKey={(r: any) => r.id} aria-label="Test table">
          {() => (
            <>
              <TableHeader>
                <TableColumn id="name">{() => <>Name</>}</TableColumn>
                <TableColumn id="role">{() => <>Role</>}</TableColumn>
              </TableHeader>
              <TableBody>
                {(row: any) => (
                  <TableRow id={row.id} item={row}>
                    {() => (
                      <>
                        <TableCell>{() => <>{row.name}</>}</TableCell>
                        <TableCell>{() => <>{row.role}</>}</TableCell>
                      </>
                    )}
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={2}>{() => <>3 people</>}</TableCell>
                </TableRow>
              </TableFooter>
            </>
          )}
        </Table>
      ));

      const footer = document.querySelector("tfoot");
      expect(footer).toBeInTheDocument();
      expect(footer?.className).toContain("bg-bg-300");
      expect(screen.getByText("3 people")).toHaveAttribute("colspan", "2");
    });
  });

  describe("size variants", () => {
    it("applies sm cell padding", () => {
      render(() => <TestTable size="sm" />);
      const cells = screen.getAllByRole("gridcell");
      // sm cell: 'px-3 py-2'
      expect(cells[0].className).toContain("px-3");
      expect(cells[0].className).toContain("py-2");
    });

    it("applies md cell padding by default", () => {
      render(() => <TestTable />);
      const cells = screen.getAllByRole("gridcell");
      // md cell: 'px-4 py-3'
      expect(cells[0].className).toContain("px-4");
      expect(cells[0].className).toContain("py-3");
    });

    it("applies lg cell padding", () => {
      render(() => <TestTable size="lg" />);
      const cells = screen.getAllByRole("gridcell");
      // lg cell: 'px-5 py-4'
      expect(cells[0].className).toContain("px-5");
      expect(cells[0].className).toContain("py-4");
    });

    it("applies sm header cell padding", () => {
      render(() => <TestTable size="sm" />);
      const headers = screen.getAllByRole("columnheader");
      // sm headerCell: 'px-3 py-2'
      expect(headers[0].className).toContain("px-3");
      expect(headers[0].className).toContain("py-2");
    });
  });

  describe("default variant", () => {
    it("header has bg-bg-300", () => {
      const { container } = render(() => <TestTable />);
      const thead = container.querySelector("thead");
      // default header: 'bg-bg-300 border-b border-bg-400'
      expect(thead?.className).toContain("bg-bg-300");
    });
  });

  describe("striped variant", () => {
    it("rows get even:bg-bg-200/30", () => {
      render(() => <TestTable variant="striped" />);
      const tableRows = screen.getAllByRole("row");
      // Data rows (skip header row)
      const dataRows = tableRows.filter((r) => r.querySelector('[role="gridcell"]'));
      expect(dataRows.length).toBeGreaterThan(0);
      // striped row: 'even:bg-bg-200/30'
      expect(dataRows[0].className).toContain("even:bg-bg-200/30");
    });
  });

  describe("bordered variant", () => {
    it("wrapper has thicker border", () => {
      const { container } = render(() => <TestTable variant="bordered" />);
      // bordered wrapper: 'rounded-lg border-2 border-bg-400 overflow-hidden'
      const wrapper = container.querySelector(".border-2.border-bg-400");
      expect(wrapper).toBeInTheDocument();
    });

    it("rows have border-b", () => {
      render(() => <TestTable variant="bordered" />);
      const tableRows = screen.getAllByRole("row");
      const dataRows = tableRows.filter((r) => r.querySelector('[role="gridcell"]'));
      // bordered row: 'border-b border-bg-300 last:border-b-0'
      expect(dataRows[0].className).toContain("border-b");
      expect(dataRows[0].className).toContain("border-bg-300");
    });
  });

  describe("column alignment", () => {
    it("applies text-left by default", () => {
      render(() => <TestTable />);
      const headers = screen.getAllByRole("columnheader");
      expect(headers[0].className).toContain("text-left");
    });

    it("applies text-center alignment", () => {
      render(() => (
        <Table items={rows} columns={columns} getKey={(r: any) => r.id} aria-label="Aligned table">
          {() => (
            <>
              <TableHeader>
                <TableColumn id="name" align="center">
                  {() => <>Name</>}
                </TableColumn>
                <TableColumn id="role" align="center">
                  {() => <>Role</>}
                </TableColumn>
              </TableHeader>
              <TableBody>
                {(row: any) => (
                  <TableRow id={row.id} item={row}>
                    {() => (
                      <>
                        <TableCell align="center">{() => <>{row.name}</>}</TableCell>
                        <TableCell align="center">{() => <>{row.role}</>}</TableCell>
                      </>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </>
          )}
        </Table>
      ));

      const headers = screen.getAllByRole("columnheader");
      expect(headers[0].className).toContain("text-center");
    });

    it("applies text-right alignment", () => {
      render(() => (
        <Table
          items={rows}
          columns={columns}
          getKey={(r: any) => r.id}
          aria-label="Right-aligned table"
        >
          {() => (
            <>
              <TableHeader>
                <TableColumn id="name" align="right">
                  {() => <>Name</>}
                </TableColumn>
                <TableColumn id="role">{() => <>Role</>}</TableColumn>
              </TableHeader>
              <TableBody>
                {(row: any) => (
                  <TableRow id={row.id} item={row}>
                    {() => (
                      <>
                        <TableCell>{() => <>{row.name}</>}</TableCell>
                        <TableCell>{() => <>{row.role}</>}</TableCell>
                      </>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </>
          )}
        </Table>
      ));

      const headers = screen.getAllByRole("columnheader");
      expect(headers[0].className).toContain("text-right");
    });
  });

  describe("column width", () => {
    it("applies inline width style", () => {
      render(() => (
        <Table items={rows} columns={columns} getKey={(r: any) => r.id} aria-label="Width table">
          {() => (
            <>
              <TableHeader>
                <TableColumn id="name" width="200px">
                  {() => <>Name</>}
                </TableColumn>
                <TableColumn id="role">{() => <>Role</>}</TableColumn>
              </TableHeader>
              <TableBody>
                {(row: any) => (
                  <TableRow id={row.id} item={row}>
                    {() => (
                      <>
                        <TableCell>{() => <>{row.name}</>}</TableCell>
                        <TableCell>{() => <>{row.role}</>}</TableCell>
                      </>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </>
          )}
        </Table>
      ));

      const headers = screen.getAllByRole("columnheader");
      expect(headers[0].style.width).toBe("200px");
    });
  });

  describe("title and description", () => {
    it("renders title above table", () => {
      render(() => <TestTable title="User Directory" />);
      expect(screen.getByText("User Directory")).toBeInTheDocument();
    });

    it("renders description above table", () => {
      render(() => <TestTable description="All active users" />);
      expect(screen.getByText("All active users")).toBeInTheDocument();
    });
  });

  describe("empty state", () => {
    it('renders empty state with "No data available"', () => {
      render(() => <TestTable items={[]} />);
      expect(screen.getByText("No data available")).toBeInTheDocument();
    });

    it("renders EmptyIcon SVG in empty state", () => {
      const { container } = render(() => <TestTable items={[]} />);
      // EmptyIcon has w-12 h-12 classes
      const icon = container.querySelector("svg.w-12.h-12");
      expect(icon).toBeInTheDocument();
    });
  });

  describe("size context propagation", () => {
    it("propagates lg size from Table to cells", () => {
      render(() => <TestTable size="lg" />);
      const cells = screen.getAllByRole("gridcell");
      // lg cell: 'px-5 py-4'
      expect(cells[0].className).toContain("px-5");
      expect(cells[0].className).toContain("py-4");
      const headers = screen.getAllByRole("columnheader");
      // lg headerCell: 'px-5 py-4'
      expect(headers[0].className).toContain("px-5");
      expect(headers[0].className).toContain("py-4");
    });
  });
});
