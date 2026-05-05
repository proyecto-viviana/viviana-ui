import { createSignal } from "solid-js";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@solidjs/testing-library";
import { SelectBox, SelectBoxGroup } from "../src";
import { setupUser } from "@proyecto-viviana/solid-spectrum-test-utils";

interface PlanOption {
  id: string;
  label: string;
  description: string;
}

const plans: PlanOption[] = [
  { id: "starter", label: "Starter", description: "For small teams" },
  { id: "pro", label: "Pro", description: "For growing teams" },
];

describe("SelectBoxGroup (solid-spectrum)", () => {
  it("renders selectable cards with listbox semantics", async () => {
    const user = setupUser();
    const onSelectionChange = vi.fn();

    function Demo() {
      const [selectedKeys, setSelectedKeys] = createSignal<Set<string>>(new Set(["starter"]));
      return (
        <SelectBoxGroup
          aria-label="Plans"
          items={plans}
          getKey={(item) => item.id}
          getTextValue={(item) => item.label}
          selectedKeys={selectedKeys()}
          onSelectionChange={(keys) => {
            const nextKeys = keys === "all" ? new Set(plans.map((plan) => plan.id)) : keys;
            setSelectedKeys(new Set(Array.from(nextKeys, String)));
            onSelectionChange(keys);
          }}
        >
          {(item) => (
            <SelectBox id={item.id} textValue={item.label}>
              <strong>{item.label}</strong>
              <span>{item.description}</span>
            </SelectBox>
          )}
        </SelectBoxGroup>
      );
    }

    render(() => <Demo />);

    expect(screen.getByRole("listbox", { name: "Plans" })).toBeInTheDocument();
    const starter = screen.getByRole("option", { name: "Starter" });
    const pro = screen.getByRole("option", { name: "Pro" });
    expect(starter).toHaveAttribute("data-selected", "true");
    expect(pro).not.toHaveAttribute("data-selected");

    await user.click(pro);

    expect(starter).not.toHaveAttribute("data-selected");
    expect(pro).toHaveAttribute("data-selected", "true");
    expect(onSelectionChange).toHaveBeenCalledWith(new Set(["pro"]));
  });

  it("supports horizontal orientation and disabled state", async () => {
    const user = setupUser();
    const onSelectionChange = vi.fn();
    render(() => (
      <SelectBoxGroup
        aria-label="Plans"
        items={plans}
        getKey={(item) => item.id}
        getTextValue={(item) => item.label}
        orientation="horizontal"
        isDisabled
        onSelectionChange={onSelectionChange}
      >
        {(item) => (
          <SelectBox id={item.id} textValue={item.label}>
            <strong>{item.label}</strong>
            <span>{item.description}</span>
          </SelectBox>
        )}
      </SelectBoxGroup>
    ));

    const listbox = screen.getByRole("listbox", { name: "Plans" });
    expect(listbox).toHaveAttribute("data-orientation", "horizontal");
    expect(listbox).toHaveAttribute("data-disabled", "true");

    const starter = screen.getByRole("option", { name: "Starter" });
    expect(starter).toHaveAttribute("aria-disabled", "true");

    await user.click(starter);
    expect(onSelectionChange).not.toHaveBeenCalled();
  });
});
