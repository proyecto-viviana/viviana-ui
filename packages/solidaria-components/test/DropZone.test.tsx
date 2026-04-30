/**
 * Tests for solidaria-components DropZone
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@solidjs/testing-library";
import { DropZone } from "../src/DropZone";

function createDataTransferStub(): DataTransfer {
  return {
    items: [] as unknown as DataTransferItemList,
    types: [],
    files: [] as unknown as FileList,
    dropEffect: "copy",
    effectAllowed: "copy",
    getData: () => "",
    setData: () => {},
    clearData: () => {},
    setDragImage: () => {},
  } as unknown as DataTransfer;
}

function createClipboardDataStub(text: string): DataTransfer {
  return {
    items: [{ kind: "string", type: "text/plain" }] as unknown as DataTransferItemList,
    types: ["text/plain"],
    files: [] as unknown as FileList,
    dropEffect: "copy",
    effectAllowed: "copy",
    getData: (type: string) => (type === "text/plain" ? text : ""),
    setData: () => {},
    clearData: () => {},
    setDragImage: () => {},
  } as unknown as DataTransfer;
}

describe("DropZone", () => {
  it("renders with default class", () => {
    render(() => <DropZone>Drop files</DropZone>);
    const zone = document.querySelector(".solidaria-DropZone") as HTMLDivElement;
    expect(zone).toBeInTheDocument();
    expect(zone).toHaveClass("solidaria-DropZone");

    const button = screen.getByRole("button", { name: "Drop files" });
    expect(button).toBeInTheDocument();
  });

  it("calls onDrop handler on drop event", () => {
    const onDrop = vi.fn();
    render(() => <DropZone onDrop={onDrop}>Drop files</DropZone>);

    const zone = document.querySelector(".solidaria-DropZone") as HTMLDivElement;
    expect(zone).toBeInTheDocument();
    const dataTransfer = createDataTransferStub();
    fireEvent.drop(zone, {
      dataTransfer,
      clientX: 0,
      clientY: 0,
    });

    expect(onDrop).toHaveBeenCalled();
  });

  it("sets disabled state attributes", () => {
    render(() => <DropZone isDisabled>Drop files</DropZone>);
    const zone = document.querySelector(".solidaria-DropZone") as HTMLDivElement;
    expect(zone).toBeInTheDocument();
    expect(zone).toHaveAttribute("data-disabled");

    const button = screen.getByRole("button", { name: "Drop files" });
    expect(button).toBeDisabled();
  });

  it("maps hidden button paste to onDrop copy events", () => {
    const onDrop = vi.fn();
    render(() => <DropZone onDrop={onDrop}>Drop files</DropZone>);

    const button = screen.getByRole("button", { name: "Drop files" });
    const clipboardData = createClipboardDataStub("pasted text");
    fireEvent.paste(button, { clipboardData });

    expect(onDrop).toHaveBeenCalledTimes(1);
    expect(onDrop.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        type: "drop",
        dropOperation: "copy",
      }),
    );
  });

  it("uses explicit aria-label for hidden drop button", () => {
    render(() => <DropZone aria-label="Upload area">Drop files</DropZone>);
    expect(screen.getByRole("button", { name: "Upload area" })).toBeInTheDocument();
  });
});
