// Custom server entry point for Cloudflare Workers
// Wraps TanStack Start handler

import handler, { createServerEntry } from "@tanstack/solid-start/server-entry";

// Default export for the worker's fetch handler
export default createServerEntry({
  fetch(request) {
    return handler.fetch(request);
  },
});
