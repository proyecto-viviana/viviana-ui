/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@solidjs/testing-library";
import {
  ToastProvider,
  ToastRegion,
  Toast,
  addToast,
  toastSuccess,
  toastError,
  toastWarning,
  toastInfo,
  globalToastQueue,
} from "../src/toast";
import type { QueuedToast, ToastContent } from "../src/toast";

/** Drain all toasts from the global queue. */
function clearGlobalToasts() {
  const toasts = globalToastQueue.visibleToasts;
  if (typeof toasts === "function") {
    (toasts() as QueuedToast<ToastContent>[]).forEach((t) => globalToastQueue.remove(t.key));
  }
}

describe("Toast (solid-spectrum)", () => {
  afterEach(() => {
    clearGlobalToasts();
    cleanup();
  });

  describe("ToastProvider + ToastRegion", () => {
    it("renders region when toasts are present", () => {
      render(() => (
        <ToastProvider useGlobalQueue>
          <ToastRegion portal={false} />
        </ToastProvider>
      ));

      // Add a toast to trigger region rendering
      addToast({ title: "Hello", type: "info" });

      const region = screen.getByRole("region");
      expect(region).toBeInTheDocument();
    });
  });

  describe("variant styles", () => {
    const variantCases = [
      { type: "info" as const, colorFragment: "bg-blue-50" },
      { type: "success" as const, colorFragment: "bg-green-50" },
      { type: "warning" as const, colorFragment: "bg-yellow-50" },
      { type: "error" as const, colorFragment: "bg-red-50" },
      { type: "neutral" as const, colorFragment: "bg-neutral-50" },
    ];

    variantCases.forEach(({ type, colorFragment }) => {
      it(`applies ${type} variant color classes`, () => {
        render(() => (
          <ToastProvider useGlobalQueue>
            <ToastRegion portal={false} />
          </ToastProvider>
        ));

        addToast({ title: `${type} toast`, type });

        const region = screen.getByRole("region");
        const toastEl = region.querySelector(`[data-type="${type}"]`);
        expect(toastEl).toBeInTheDocument();
        expect(toastEl!.className).toContain(colorFragment);
      });
    });
  });

  describe("variant icons", () => {
    it("renders SuccessIcon SVG for success variant", () => {
      render(() => (
        <ToastProvider useGlobalQueue>
          <ToastRegion portal={false} />
        </ToastProvider>
      ));

      addToast({ title: "Done!", type: "success" });

      const region = screen.getByRole("region");
      const toastEl = region.querySelector('[data-type="success"]');
      const svg = toastEl?.querySelector("svg");
      expect(svg).toBeInTheDocument();
      // SuccessIcon path includes "9 12l2 2 4-4" (checkmark in circle)
      const path = svg?.querySelector("path");
      expect(path?.getAttribute("d")).toContain("9 12l2 2 4-4");
    });

    it("renders WarningIcon SVG for warning variant", () => {
      render(() => (
        <ToastProvider useGlobalQueue>
          <ToastRegion portal={false} />
        </ToastProvider>
      ));

      addToast({ title: "Caution", type: "warning" });

      const region = screen.getByRole("region");
      const toastEl = region.querySelector('[data-type="warning"]');
      const svg = toastEl?.querySelector("svg");
      expect(svg).toBeInTheDocument();
      // WarningIcon path includes "12 9v2m0 4h.01" (triangle exclamation)
      const path = svg?.querySelector("path");
      expect(path?.getAttribute("d")).toContain("12 9v2m0 4h.01");
    });

    it("renders ErrorIcon SVG for error variant", () => {
      render(() => (
        <ToastProvider useGlobalQueue>
          <ToastRegion portal={false} />
        </ToastProvider>
      ));

      addToast({ title: "Failed", type: "error" });

      const region = screen.getByRole("region");
      const toastEl = region.querySelector('[data-type="error"]');
      const svg = toastEl?.querySelector("svg");
      expect(svg).toBeInTheDocument();
      // ErrorIcon path includes "10 14l2-2m0 0l2-2" (X in circle)
      const path = svg?.querySelector("path");
      expect(path?.getAttribute("d")).toContain("10 14l2-2m0 0l2-2");
    });

    it("renders InfoIcon SVG for info variant", () => {
      render(() => (
        <ToastProvider useGlobalQueue>
          <ToastRegion portal={false} />
        </ToastProvider>
      ));

      addToast({ title: "FYI", type: "info" });

      const region = screen.getByRole("region");
      const toastEl = region.querySelector('[data-type="info"]');
      const svg = toastEl?.querySelector("svg");
      expect(svg).toBeInTheDocument();
      // InfoIcon path includes "13 16h-1v-4h-1m1-4h.01" (i in circle)
      const path = svg?.querySelector("path");
      expect(path?.getAttribute("d")).toContain("13 16h-1v-4h-1m1-4h.01");
    });
  });

  describe("content rendering", () => {
    it("renders title when provided", () => {
      render(() => (
        <ToastProvider useGlobalQueue>
          <ToastRegion portal={false} />
        </ToastProvider>
      ));

      addToast({ title: "My Title", type: "info" });

      expect(screen.getByText("My Title")).toBeInTheDocument();
    });

    it("renders description when provided", () => {
      render(() => (
        <ToastProvider useGlobalQueue>
          <ToastRegion portal={false} />
        </ToastProvider>
      ));

      addToast({ title: "Title", description: "Some details here", type: "info" });

      expect(screen.getByText("Some details here")).toBeInTheDocument();
    });

    it("renders action button when provided", () => {
      const onAction = vi.fn();

      render(() => (
        <ToastProvider useGlobalQueue>
          <ToastRegion portal={false} />
        </ToastProvider>
      ));

      addToast({
        title: "Deleted",
        type: "info",
        action: { label: "Undo", onAction },
      });

      const actionButton = screen.getByText("Undo");
      expect(actionButton).toBeInTheDocument();
      expect(actionButton.tagName).toBe("BUTTON");
    });

    it("links alertdialog labeling to title and description elements", () => {
      render(() => (
        <ToastProvider useGlobalQueue>
          <ToastRegion portal={false} />
        </ToastProvider>
      ));

      addToast({ title: "Accessible title", description: "Accessible description", type: "info" });

      const description = screen.getByText("Accessible description");
      const toast = description.closest('[role="alertdialog"]') as HTMLElement | null;
      const title = screen.getByText("Accessible title");

      expect(toast).toBeTruthy();
      expect(title.id).toBeTruthy();
      expect(description.id).toBeTruthy();
      expect(toast).toHaveAttribute("aria-labelledby", title.id);
      expect(toast).toHaveAttribute("aria-describedby", description.id);
    });
  });

  describe("close button", () => {
    it("renders close button with Dismiss aria-label and CloseIcon SVG", () => {
      render(() => (
        <ToastProvider useGlobalQueue>
          <ToastRegion portal={false} />
        </ToastProvider>
      ));

      addToast({ title: "Closeable", type: "info" });

      const region = screen.getByRole("region");
      const toastEl = region.querySelector('[data-type="info"]')!;
      const closeBtn = toastEl.querySelector('button[aria-label="Dismiss"]');
      expect(closeBtn).toBeInTheDocument();
      // CloseIcon SVG should be inside the close button
      const svg = closeBtn!.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });
  });

  describe("animation data attributes", () => {
    it("sets data-animation attribute on toast element", () => {
      render(() => (
        <ToastProvider useGlobalQueue>
          <ToastRegion portal={false} />
        </ToastProvider>
      ));

      addToast({ title: "Animated", type: "info" });

      const region = screen.getByRole("region");
      const toastEl = region.querySelector('[data-type="info"]');
      expect(toastEl).toBeInTheDocument();
      // data-animation is set by the headless layer
      expect(toastEl).toHaveAttribute("data-animation");
    });

    it("applies animation CSS classes in toast base styles", () => {
      render(() => (
        <ToastProvider useGlobalQueue>
          <ToastRegion portal={false} />
        </ToastProvider>
      ));

      addToast({ title: "Animated", type: "success" });

      const region = screen.getByRole("region");
      const toastEl = region.querySelector('[data-type="success"]');
      // The base styles include data-[animation=entering]:animate-in
      expect(toastEl!.className).toContain("data-[animation=entering]:animate-in");
    });
  });

  describe("global API helpers", () => {
    it("toastSuccess sets type to success with 5s timeout", () => {
      const spy = vi.spyOn(globalToastQueue, "add");

      toastSuccess("It worked!");

      expect(spy).toHaveBeenCalledWith(
        { title: "It worked!", type: "success" },
        expect.objectContaining({ timeout: 5000 }),
      );

      spy.mockRestore();
    });

    it("toastError sets type to error with 8s timeout", () => {
      const spy = vi.spyOn(globalToastQueue, "add");

      toastError("Something broke");

      expect(spy).toHaveBeenCalledWith(
        { title: "Something broke", type: "error" },
        expect.objectContaining({ timeout: 8000 }),
      );

      spy.mockRestore();
    });

    it("toastWarning sets type to warning with 6s timeout", () => {
      const spy = vi.spyOn(globalToastQueue, "add");

      toastWarning("Be careful");

      expect(spy).toHaveBeenCalledWith(
        { title: "Be careful", type: "warning" },
        expect.objectContaining({ timeout: 6000 }),
      );

      spy.mockRestore();
    });

    it("toastInfo sets type to info with 5s timeout", () => {
      const spy = vi.spyOn(globalToastQueue, "add");

      toastInfo("Just so you know");

      expect(spy).toHaveBeenCalledWith(
        { title: "Just so you know", type: "info" },
        expect.objectContaining({ timeout: 5000 }),
      );

      spy.mockRestore();
    });
  });
});
