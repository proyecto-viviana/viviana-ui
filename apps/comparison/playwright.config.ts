import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.COMPARISON_PORT ?? 4322);
const host = process.env.COMPARISON_HOST ?? "127.0.0.1";
const baseURL = process.env.COMPARISON_BASE_URL ?? `http://${host}:${port}`;
const managesPreviewServer = process.env.COMPARISON_BASE_URL == null;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "line",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: managesPreviewServer
    ? {
        command: `vp run comparison:preview --host ${host} --port ${port}`,
        url: `${baseURL}/components/dialog/`,
        reuseExistingServer: !process.env.CI,
        timeout: 120000,
        cwd: new URL("../..", import.meta.url).pathname,
      }
    : undefined,
});
