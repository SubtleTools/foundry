#!/usr/bin/env bun
/**
 * Check for new versions of upstream Go projects
 * Shows a table with project, current Go version (checked out), and available newer versions
 */

import { join } from "path";
import { stripV, isNewer, getGitTags, getCurrentVersion } from "./lib/versions";

interface ProjectInfo {
  name: string;
  upstreamPath: string;
  currentVersion: string;
  latestVersion: string;
  newerVersions: string[];
  hasUpdate: boolean;
}

const COLORS = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
};

function truncateVersions(versions: string[], maxCount: number = 5): string {
  if (versions.length === 0) return `${COLORS.gray}none${COLORS.reset}`;

  const displayed = versions.slice(0, maxCount);
  const remaining = versions.length - maxCount;

  let result = displayed.join(", ");
  if (remaining > 0) {
    result += `${COLORS.gray} (+${remaining} more)${COLORS.reset}`;
  }
  return result;
}

async function checkProject(
  name: string,
  upstreamPath: string
): Promise<ProjectInfo | null> {
  const currentVersion = await getCurrentVersion(upstreamPath);
  if (!currentVersion) {
    console.error(`Could not determine current version for ${name}`);
    return null;
  }

  const allTags = await getGitTags(upstreamPath);
  if (allTags.length === 0) {
    console.error(`Could not fetch tags for ${name}`);
    return null;
  }

  const latestVersion = allTags[0];
  const newerVersions = allTags.filter((tag) => isNewer(tag, currentVersion));

  return {
    name,
    upstreamPath,
    currentVersion,
    latestVersion,
    newerVersions,
    hasUpdate: newerVersions.length > 0,
  };
}

function printTable(projects: ProjectInfo[]) {
  const nameWidth = Math.max(
    "Project".length,
    ...projects.map((p) => p.name.length)
  );
  const currentWidth = Math.max(
    "Current".length,
    ...projects.map((p) => p.currentVersion.length)
  );
  const latestWidth = Math.max(
    "Latest".length,
    ...projects.map((p) => p.latestVersion.length)
  );

  const header = `${COLORS.bold}${"Project".padEnd(nameWidth)}  ${"Current".padEnd(
    currentWidth
  )}  ${"Latest".padEnd(latestWidth)}  Newer Versions${COLORS.reset}`;
  const separator =
    "─".repeat(nameWidth) +
    "  " +
    "─".repeat(currentWidth) +
    "  " +
    "─".repeat(latestWidth) +
    "  " +
    "─".repeat(40);

  console.log(header);
  console.log(separator);

  for (const project of projects) {
    const statusIcon = project.hasUpdate
      ? `${COLORS.yellow}●${COLORS.reset}`
      : `${COLORS.green}●${COLORS.reset}`;

    const name = project.name.padEnd(nameWidth);
    const current = project.currentVersion.padEnd(currentWidth);
    const latest = project.latestVersion.padEnd(latestWidth);

    let newerCol: string;
    if (project.hasUpdate) {
      newerCol = `${COLORS.yellow}${truncateVersions(project.newerVersions)}${COLORS.reset}`;
    } else {
      newerCol = `${COLORS.gray}up to date${COLORS.reset}`;
    }

    console.log(`${statusIcon} ${name}  ${current}  ${latest}  ${newerCol}`);
  }

  console.log();
  console.log(`${COLORS.bold}Summary:${COLORS.reset}`);
  const outdated = projects.filter((p) => p.hasUpdate);
  if (outdated.length === 0) {
    console.log(`${COLORS.green}All projects are up to date!${COLORS.reset}`);
  } else {
    console.log(
      `${COLORS.yellow}${outdated.length}${COLORS.reset} of ${projects.length} projects have updates available`
    );
    console.log(
      `\nRun ${COLORS.cyan}git -C upstream/<project> fetch --tags${COLORS.reset} to update tags`
    );
  }
}

async function main() {
  const rootDir = process.cwd();
  const upstreamDir = join(rootDir, "upstream");

  const projects = ["gamut", "go-colorful", "go-osc52", "lipgloss", "termenv", "uniseg"];

  console.log(
    `${COLORS.bold}Checking upstream Go project versions...${COLORS.reset}\n`
  );

  const results: ProjectInfo[] = [];

  for (const name of projects) {
    const upstreamPath = join(upstreamDir, name);
    const project = await checkProject(name, upstreamPath);
    if (project) {
      results.push(project);
    }
  }

  // Sort: outdated first, then alphabetically
  results.sort((a, b) => {
    if (a.hasUpdate && !b.hasUpdate) return -1;
    if (!a.hasUpdate && b.hasUpdate) return 1;
    return a.name.localeCompare(b.name);
  });

  printTable(results);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
