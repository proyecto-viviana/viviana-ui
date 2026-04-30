/**
 * Live region monitor (INFRA-4)
 *
 * Uses MutationObserver to watch live regions ([aria-live], [role="alert"],
 * [role="status"], [role="log"]) and record announcements for assertion.
 */

export interface Announcement {
  text: string;
  politeness: "assertive" | "polite" | "off";
  role: string | null;
  timestamp: number;
}

export interface LiveRegionMonitor {
  /** All recorded announcements so far */
  announcements: Announcement[];
  /** Stop observing */
  stop(): void;
  /** Clear recorded announcements */
  clear(): void;
  /** Wait for an announcement matching `text` (substring or regex) */
  waitForAnnouncement(text: string | RegExp, options?: { timeout?: number }): Promise<Announcement>;
}

const LIVE_REGION_SELECTOR = [
  "[aria-live]",
  '[role="alert"]',
  '[role="status"]',
  '[role="log"]',
].join(",");

function getPoliteness(element: Element): "assertive" | "polite" | "off" {
  const ariaLive = element.getAttribute("aria-live");
  if (ariaLive === "assertive") return "assertive";
  if (ariaLive === "polite") return "polite";
  if (ariaLive === "off") return "off";

  // Implicit live region roles
  const role = element.getAttribute("role");
  if (role === "alert") return "assertive";
  if (role === "status" || role === "log") return "polite";

  return "off";
}

function recordAnnouncement(element: Element, announcements: Announcement[]): void {
  const text = (element.textContent || "").trim();
  if (!text) return;

  announcements.push({
    text,
    politeness: getPoliteness(element),
    role: element.getAttribute("role"),
    timestamp: Date.now(),
  });
}

/**
 * Create a live region monitor that watches for announcements.
 *
 * @example
 * ```ts
 * const monitor = createLiveRegionMonitor();
 * // ... trigger toast/alert ...
 * const ann = await monitor.waitForAnnouncement('Success');
 * expect(ann.politeness).toBe('polite');
 * monitor.stop();
 * ```
 */
export function createLiveRegionMonitor(container: Element = document.body): LiveRegionMonitor {
  const announcements: Announcement[] = [];

  // Record content changes in existing live regions
  const contentObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      const target =
        mutation.target instanceof Element ? mutation.target : mutation.target.parentElement;

      if (!target) continue;

      // Check if mutation is within a live region
      const liveRegion = target.closest(LIVE_REGION_SELECTOR);
      if (liveRegion) {
        recordAnnouncement(liveRegion, announcements);
      }
    }
  });

  // Watch for dynamically added live regions (e.g. Toast portals)
  const subtreeObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof Element)) continue;

        // Check if the added node is itself a live region
        if (node.matches(LIVE_REGION_SELECTOR)) {
          recordAnnouncement(node, announcements);
        }

        // Check for live regions within added subtree
        for (const lr of node.querySelectorAll(LIVE_REGION_SELECTOR)) {
          recordAnnouncement(lr, announcements);
        }
      }
    }
  });

  contentObserver.observe(container, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  subtreeObserver.observe(container, {
    childList: true,
    subtree: true,
  });

  return {
    announcements,

    stop() {
      contentObserver.disconnect();
      subtreeObserver.disconnect();
    },

    clear() {
      announcements.length = 0;
    },

    waitForAnnouncement(
      text: string | RegExp,
      options: { timeout?: number } = {},
    ): Promise<Announcement> {
      const { timeout = 2000 } = options;

      // Check existing announcements first
      const existing = announcements.find((a) =>
        typeof text === "string" ? a.text.includes(text) : text.test(a.text),
      );
      if (existing) return Promise.resolve(existing);

      return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          cleanup();
          const recorded = announcements.map((a) => `"${a.text}"`).join(", ");
          reject(
            new Error(
              `No announcement matching ${text} within ${timeout}ms. ` +
                `Recorded: [${recorded || "none"}]`,
            ),
          );
        }, timeout);

        // Poll the announcements array
        const intervalId = setInterval(() => {
          const match = announcements.find((a) =>
            typeof text === "string" ? a.text.includes(text) : text.test(a.text),
          );
          if (match) {
            cleanup();
            resolve(match);
          }
        }, 50);

        function cleanup() {
          clearTimeout(timeoutId);
          clearInterval(intervalId);
        }
      });
    },
  };
}

/**
 * Convenience assertion: expect an announcement matching `text`.
 *
 * @example
 * ```ts
 * await expectAnnouncement(monitor, 'Item deleted');
 * ```
 */
export async function expectAnnouncement(
  monitor: LiveRegionMonitor,
  text: string | RegExp,
  options?: { timeout?: number; politeness?: "assertive" | "polite" },
): Promise<void> {
  const announcement = await monitor.waitForAnnouncement(text, options);
  if (options?.politeness && announcement.politeness !== options.politeness) {
    throw new Error(
      `Expected announcement "${announcement.text}" to be ${options.politeness}, ` +
        `but was ${announcement.politeness}`,
    );
  }
}
