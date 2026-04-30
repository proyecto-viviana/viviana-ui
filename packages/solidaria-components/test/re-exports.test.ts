import { describe, it, expect } from "vitest";
import {
  // DnD
  DIRECTORY_DRAG_TYPE,
  isDirectoryDropItem,
  isFileDropItem,
  isTextDropItem,
  // i18n
  isRTL,
  I18nProvider,
  useLocale,
  useFilter,
  // SSR
  SSRProvider,
  // Color + Form
  parseColor,
  FormValidationContext,
  // Toast alias
  UNSTABLE_ToastQueue,
} from "../src/index";

describe("solidaria-components re-exports", () => {
  it("exports DnD utilities", () => {
    expect(DIRECTORY_DRAG_TYPE).toBeDefined();
    expect(typeof isDirectoryDropItem).toBe("function");
    expect(typeof isFileDropItem).toBe("function");
    expect(typeof isTextDropItem).toBe("function");
  });

  it("exports i18n utilities", () => {
    expect(typeof isRTL).toBe("function");
    expect(I18nProvider).toBeDefined();
    expect(typeof useLocale).toBe("function");
    expect(typeof useFilter).toBe("function");
  });

  it("exports SSRProvider", () => {
    expect(SSRProvider).toBeDefined();
  });

  it("exports parseColor", () => {
    expect(typeof parseColor).toBe("function");
  });

  it("exports FormValidationContext", () => {
    expect(FormValidationContext).toBeDefined();
  });

  it("exports UNSTABLE_ToastQueue", () => {
    expect(UNSTABLE_ToastQueue).toBeDefined();
  });
});
