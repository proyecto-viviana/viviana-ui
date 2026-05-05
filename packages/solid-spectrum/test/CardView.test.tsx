import { createSignal } from "solid-js";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@solidjs/testing-library";
import { Card, CardView } from "../src";
import { setupUser } from "@proyecto-viviana/solid-spectrum-test-utils";

interface ProjectCard {
  id: string;
  title: string;
  status: string;
}

const projects: ProjectCard[] = [
  { id: "apollo", title: "Apollo", status: "Active" },
  { id: "zephyr", title: "Zephyr", status: "Queued" },
];

describe("CardView (solid-spectrum)", () => {
  it("renders cards with grid semantics and S2 data attributes", () => {
    render(() => (
      <CardView
        aria-label="Projects"
        items={projects}
        getKey={(item) => item.id}
        getTextValue={(item) => item.title}
        size="S"
        density="compact"
        variant="secondary"
      >
        {(item) => (
          <Card>
            <strong>{item.title}</strong>
            <span>{item.status}</span>
          </Card>
        )}
      </CardView>
    ));

    const grid = screen.getByRole("grid", { name: "Projects" });
    expect(grid).toHaveAttribute("data-layout", "grid");
    expect(grid).toHaveAttribute("data-size", "S");
    expect(grid).toHaveAttribute("data-density", "compact");
    expect(grid).toHaveAttribute("data-variant", "secondary");
    expect(screen.getByRole("row", { name: "ApolloActive" })).toBeInTheDocument();
    expect(screen.getByRole("row", { name: "ZephyrQueued" })).toBeInTheDocument();
  });

  it("supports controlled selection", async () => {
    const user = setupUser();
    const onSelectionChange = vi.fn();

    function Demo() {
      const [selectedKeys, setSelectedKeys] = createSignal<Set<string>>(new Set(["apollo"]));
      return (
        <CardView
          aria-label="Projects"
          items={projects}
          getKey={(item) => item.id}
          getTextValue={(item) => item.title}
          selectionMode="single"
          selectionStyle="highlight"
          selectedKeys={selectedKeys()}
          onSelectionChange={(keys) => {
            const nextKeys = keys === "all" ? new Set(projects.map((item) => item.id)) : keys;
            setSelectedKeys(new Set(Array.from(nextKeys, String)));
            onSelectionChange(keys);
          }}
        >
          {(item) => (
            <Card>
              <strong>{item.title}</strong>
              <span>{item.status}</span>
            </Card>
          )}
        </CardView>
      );
    }

    render(() => <Demo />);

    const apollo = screen.getByRole("row", { name: "ApolloActive" });
    const zephyr = screen.getByRole("row", { name: "ZephyrQueued" });
    expect(apollo).toHaveAttribute("data-selected", "true");
    expect(zephyr).not.toHaveAttribute("data-selected");

    await user.click(zephyr);

    expect(apollo).not.toHaveAttribute("data-selected");
    expect(zephyr).toHaveAttribute("data-selected", "true");
    expect(onSelectionChange).toHaveBeenCalledWith(new Set(["zephyr"]));
  });
});
