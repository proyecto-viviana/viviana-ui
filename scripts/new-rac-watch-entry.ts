#!/usr/bin/env -S deno run -A

/**
 * Appends a new RAC watch-log entry scaffold for today's date.
 *
 * Usage:
 *   deno run -A scripts/new-rac-watch-entry.ts
 *   deno run -A scripts/new-rac-watch-entry.ts --dry-run
 *   deno run -A scripts/new-rac-watch-entry.ts --force
 */

const LOG_PATH = ".claude/docs/rac-watch-log.md";
const args = new Set(Deno.args);
const dryRun = args.has("--dry-run");
const force = args.has("--force");

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function gitOutput(cwd: string, cmd: string[]): string | null {
  try {
    const proc = new Deno.Command("git", {
      cwd,
      args: cmd,
      stdout: "piped",
      stderr: "null",
    });
    const out = proc.outputSync();
    if (out.code !== 0) return null;
    return new TextDecoder().decode(out.stdout).trim();
  } catch {
    return null;
  }
}

function buildEntry(date: string, sha: string, commitDate: string): string {
  return `
---

## ${date}

### React Spectrum Snapshot

1. Commit: \`${sha}\`
2. Commit date: \`${commitDate}\`
3. Notes: <optional>

### Guard Summary

1. \`deno task guard:rac-parity\`: pass|fail - <short note>
2. \`deno task guard:rac-export-gap\`: pass|fail - <short note>
3. \`deno task guard:layer-parity\`: pass|fail - <short note>
4. \`deno task guard:dnd-keyboard-parity\`: pass|fail - <short note>

### Behavioral Delta Review

1. Virtualizer delegate semantics: <none|summary>
2. List/Grid/Table/Tree DnD semantics: <none|summary>
3. TreeDropTargetDelegate behavior: <none|summary>
4. Non-virtualized keyboard DnD behavior: <none|summary>

### Actions

1. Commits landed: <sha list or none>
2. Plan updates: <item numbers>
3. New tests/guards: <list or none>

### Remaining Follow-ups

1. <item or none>
`;
}

const date = todayIsoDate();
const log = await Deno.readTextFile(LOG_PATH);
const dateHeading = `## ${date}`;
if (log.includes(dateHeading) && !force) {
  console.log(`Entry for ${date} already exists in ${LOG_PATH}. Use --force to append anyway.`);
  Deno.exit(0);
}

const repoTop = gitOutput(".", ["rev-parse", "--show-toplevel"]);
const mirrorTop = gitOutput("react-spectrum", ["rev-parse", "--show-toplevel"]);
const isStandaloneMirror = Boolean(
  mirrorTop &&
  repoTop &&
  mirrorTop !== repoTop
);

const racSha = isStandaloneMirror
  ? (gitOutput("react-spectrum", ["rev-parse", "--short", "HEAD"]) ?? "<sha>")
  : "<local-mirror>";
const racDate = isStandaloneMirror
  ? (gitOutput("react-spectrum", ["log", "-1", "--date=short", "--pretty=format:%ad"]) ?? "<YYYY-MM-DD>")
  : todayIsoDate();
const entry = buildEntry(date, racSha, racDate);

if (dryRun) {
  console.log(`Dry run: would append to ${LOG_PATH}:\n`);
  console.log(entry);
  Deno.exit(0);
}

await Deno.writeTextFile(LOG_PATH, `${log.trimEnd()}${entry}\n`);
console.log(`Appended RAC watch log entry for ${date} to ${LOG_PATH}.`);
