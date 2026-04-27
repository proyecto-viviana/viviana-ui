/**
 * Appends a new RAC watch-log entry scaffold for today's date.
 *
 * Usage:
 *   npx tsx scripts/new-rac-watch-entry.ts
 *   npx tsx scripts/new-rac-watch-entry.ts --dry-run
 *   npx tsx scripts/new-rac-watch-entry.ts --force
 */

import { spawnSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";

const LOG_PATH = ".claude/docs/rac-watch-log.md";
const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const force = args.has("--force");

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function gitOutput(cwd: string, cmd: string[]): string | null {
  try {
    const result = spawnSync("git", cmd, {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    if (result.status !== 0) return null;
    return result.stdout.trim();
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

1. \`vp run guard:rac-parity\`: pass|fail - <short note>
2. \`vp run guard:rac-export-gap\`: pass|fail - <short note>
3. \`vp run guard:layer-parity\`: pass|fail - <short note>
4. \`vp run guard:dnd-keyboard-parity\`: pass|fail - <short note>

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
const log = await readFile(LOG_PATH, "utf8");
const dateHeading = `## ${date}`;
if (log.includes(dateHeading) && !force) {
  console.log(`Entry for ${date} already exists in ${LOG_PATH}. Use --force to append anyway.`);
  process.exit(0);
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
  process.exit(0);
}

await writeFile(LOG_PATH, `${log.trimEnd()}${entry}\n`);
console.log(`Appended RAC watch log entry for ${date} to ${LOG_PATH}.`);
