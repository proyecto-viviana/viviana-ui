/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@solidjs/testing-library";
import { Separator } from "../src/separator";

describe("Separator (solid-spectrum)", () => {
  it('should render with role="separator"', () => {
    render(() => <Separator />);
    const separator = screen.getByRole("separator");
    expect(separator).toBeInTheDocument();
  });

  it("should render as hr by default", () => {
    render(() => <Separator />);
    const separator = screen.getByRole("separator");
    expect(separator.tagName).toBe("HR");
  });

  it("should render as div for vertical orientation", () => {
    render(() => <Separator orientation="vertical" />);
    const separator = screen.getByRole("separator");
    expect(separator.tagName).toBe("DIV");
    expect(separator).toHaveAttribute("aria-orientation", "vertical");
  });

  it("should support size prop", () => {
    const { container } = render(() => <Separator size="lg" />);
    // Large horizontal size should have h-1 class
    expect(container.querySelector(".h-1")).toBeInTheDocument();
  });

  it("should support vertical size prop", () => {
    const { container } = render(() => <Separator orientation="vertical" size="lg" />);
    // Large vertical size should have w-1 class
    expect(container.querySelector(".w-1")).toBeInTheDocument();
  });

  it("should support variant prop", () => {
    const { container } = render(() => <Separator variant="strong" />);
    expect(container.querySelector(".bg-primary-600")).toBeInTheDocument();
  });

  it("should support custom class", () => {
    render(() => <Separator class="my-custom-class" />);
    const separator = screen.getByRole("separator");
    expect(separator).toHaveClass("my-custom-class");
  });

  it("should support aria-label", () => {
    render(() => <Separator aria-label="Section divider" />);
    const separator = screen.getByRole("separator");
    expect(separator).toHaveAttribute("aria-label", "Section divider");
  });

  it("should have full width for horizontal", () => {
    render(() => <Separator />);
    const separator = screen.getByRole("separator");
    expect(separator).toHaveClass("w-full");
  });

  it("should have self-stretch for vertical", () => {
    render(() => <Separator orientation="vertical" />);
    const separator = screen.getByRole("separator");
    expect(separator).toHaveClass("self-stretch");
  });

  it("should reset hr border", () => {
    render(() => <Separator />);
    const separator = screen.getByRole("separator");
    expect(separator).toHaveClass("border-0");
  });
});
