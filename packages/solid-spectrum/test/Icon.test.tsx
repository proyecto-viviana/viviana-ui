/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@solidjs/testing-library";
import { setupUser } from "@proyecto-viviana/solid-spectrum-test-utils";
import { Icon } from "../src/icon";
import { GitHubIcon } from "../src/icon/icons/GitHubIcon";
import CrossIcon from "../src/icon/ui-icons/Cross";
import { BellIcon } from "../src/icon/s2wf-icons/BellIcon";

describe("Icon (solid-spectrum)", () => {
  it("renders as non-interactive content by default", () => {
    const { container } = render(() => <Icon icon={GitHubIcon} />);
    const span = container.querySelector("span.vui-icon");
    expect(span).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it('decorative icon has aria-hidden="true"', () => {
    const { container } = render(() => <Icon icon={GitHubIcon} />);
    const span = container.querySelector("span.vui-icon");
    expect(span).toHaveAttribute("aria-hidden", "true");
  });

  it("renders as a semantic button when onPress is provided", async () => {
    const user = setupUser();
    const onPress = vi.fn();

    render(() => <Icon icon={GitHubIcon} onPress={onPress} aria-label="Open GitHub" />);

    const button = screen.getByRole("button", { name: "Open GitHub" });
    await user.click(button);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("interactive icon supports keyboard activation", async () => {
    const user = setupUser();
    const onPress = vi.fn();

    render(() => <Icon icon={GitHubIcon} onPress={onPress} aria-label="Open GitHub" />);

    const button = screen.getByRole("button", { name: "Open GitHub" });
    button.focus();
    await user.keyboard("{Enter}");
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("applies shadow class when withShadow is true", () => {
    const { container } = render(() => <Icon icon={GitHubIcon} withShadow />);
    const span = container.querySelector("span.vui-icon");
    expect(span).toHaveClass("vui-icon--with-shadow");
  });

  it("applies custom class", () => {
    const { container } = render(() => <Icon icon={GitHubIcon} class="custom" />);
    const span = container.querySelector("span.vui-icon");
    expect(span).toHaveClass("custom");
  });

  it("renders a UI icon size variant", () => {
    const { container } = render(() => <CrossIcon size="L" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("width", "10");
    expect(svg).toHaveAttribute("height", "10");
  });

  it("renders a workflow icon directly", () => {
    const { container } = render(() => <BellIcon />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("role", "img");
  });
});
