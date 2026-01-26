import { readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

// We assume junit.xml is in the current working directory (project root)
const JUNIT_FILE = "junit.xml";

if (!existsSync(JUNIT_FILE)) {
  console.error(`No ${JUNIT_FILE} found. Run "moon run :test" first to generate it.`);
  // We exit with 0 or 1? If user wants to re-run failed, and there is no record, it's an error.
  process.exit(1);
}

const content = readFileSync(JUNIT_FILE, "utf-8");
const failedFiles: Set<string> = new Set();

// Regex to find testsuites with failures > 0
// Format: <testsuite ... failures="1" ... file="path/to/file" ...>
// or <testsuite ... file="path/to/file" ... failures="1" ...>
// We'll iterate over all <testsuite> tags.

const tagRegex = /<testsuite\s+([^>]+)>/g;
let match;

while ((match = tagRegex.exec(content)) !== null) {
  const attributes = match[1];
  
  // Extract failures
  const failuresMatch = attributes.match(/failures="(\d+)"/);
  if (!failuresMatch) continue;
  
  const failures = parseInt(failuresMatch[1], 10);
  
  if (failures > 0) {
    // Extract file
    const fileMatch = attributes.match(/file="([^"]+)"/);
    if (fileMatch) {
      failedFiles.add(fileMatch[1]);
    }
  }
}

if (failedFiles.size === 0) {
  console.log("No failed tests found in junit.xml.");
  process.exit(0);
}

console.log(`Re-running ${failedFiles.size} failed test files...`);
const files = Array.from(failedFiles);
console.log(files.join("\n"));

// Construct bun test command
// We pass the files as arguments
const args = ["test", ...files];

const result = spawnSync("bun", args, { stdio: "inherit" });

process.exit(result.status ?? 1);
