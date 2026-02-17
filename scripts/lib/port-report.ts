/**
 * Shared PORT_REPORT.md generation utilities.
 * Extracted from port-version.ts for reuse.
 */

import { $ } from "bun";

export interface PortReportOptions {
  packageName: string;
  sourceRepo: string;
  currentGoVersion: string;
  targetVersion: string;
}

export function extractOwnerRepo(url: string): [string, string] {
  const match = url.match(/github\.com[/:]([^/]+)\/([^/.]+)/);
  if (!match) {
    throw new Error(`Cannot extract owner/repo from URL: ${url}`);
  }
  return [match[1], match[2]];
}

export function extractFunctionChanges(patch: string): { added: string[]; modified: string[] } {
  const added: string[] = [];
  const modified: string[] = [];
  const seen = new Set<string>();

  for (const line of patch.split("\n")) {
    const funcMatch = line.match(/^[+-]\s*func\s+(?:\([^)]+\)\s+)?(\w+)\s*\(/);
    if (funcMatch && !seen.has(funcMatch[1])) {
      seen.add(funcMatch[1]);
      if (line.startsWith("+")) {
        const removeLine = patch.includes(`-func ${funcMatch[1]}(`) || patch.includes(`- func ${funcMatch[1]}(`);
        if (removeLine) {
          modified.push(funcMatch[1]);
        } else {
          added.push(funcMatch[1]);
        }
      }
    }
  }

  return { added, modified };
}

export async function generatePortReport(opts: PortReportOptions): Promise<string> {
  const { packageName, sourceRepo, currentGoVersion, targetVersion } = opts;
  const [owner, repo] = extractOwnerRepo(sourceRepo);

  let reportContent = `# Port Report: ${packageName} v${targetVersion}\n\n`;
  reportContent += `**Upstream**: ${sourceRepo}\n`;
  reportContent += `**Previous version**: v${currentGoVersion}\n`;
  reportContent += `**Target version**: v${targetVersion}\n`;
  reportContent += `**Generated**: ${new Date().toISOString()}\n\n`;

  try {
    const { stdout: diffJson } = await $`gh api repos/${owner}/${repo}/compare/v${currentGoVersion}...v${targetVersion}`.quiet();
    const diff = JSON.parse(diffJson.toString());

    reportContent += `## Summary\n\n`;
    reportContent += `- **Commits**: ${diff.total_commits}\n`;
    reportContent += `- **Files changed**: ${diff.files?.length ?? 0}\n\n`;

    if (diff.files && diff.files.length > 0) {
      reportContent += `## Changed Files\n\n`;
      reportContent += `| File | Status | +Lines | -Lines | Relevant? |\n`;
      reportContent += `|------|--------|--------|--------|-----------|\n`;

      const goFiles: Array<{ filename: string; status: string; additions: number; deletions: number; patch?: string }> = [];

      for (const file of diff.files) {
        const isGo = file.filename.endsWith(".go");
        const isTest = file.filename.includes("_test.go");
        const isDoc = file.filename.startsWith("doc/") || file.filename.startsWith(".github/");
        const relevant = isGo && !isTest && !isDoc ? "**YES**" : isTest ? "test" : "no";

        reportContent += `| ${file.filename} | ${file.status} | +${file.additions} | -${file.deletions} | ${relevant} |\n`;

        if (isGo && !isTest && !isDoc) {
          goFiles.push(file);
        }
      }

      if (goFiles.length > 0) {
        reportContent += `\n## Files to Port\n\n`;
        reportContent += `These Go source files have changes that need to be reflected in TypeScript:\n\n`;

        for (const file of goFiles) {
          const tsFile = file.filename.replace(".go", ".ts");
          reportContent += `### ${file.filename}\n\n`;
          reportContent += `- **Status**: ${file.status}\n`;
          reportContent += `- **Changes**: +${file.additions} / -${file.deletions}\n`;
          reportContent += `- **TS counterpart**: \`src/${tsFile}\` (verify path)\n`;

          if (file.patch) {
            const functions = extractFunctionChanges(file.patch);
            if (functions.added.length > 0) {
              reportContent += `- **New functions**: ${functions.added.map((f) => `\`${f}\``).join(", ")}\n`;
            }
            if (functions.modified.length > 0) {
              reportContent += `- **Modified functions**: ${functions.modified.map((f) => `\`${f}\``).join(", ")}\n`;
            }
          }

          reportContent += `\n`;
        }
      }

      reportContent += `## Suggested Porting Order\n\n`;
      const newFiles = goFiles.filter((f) => f.status === "added");
      const modifiedFiles = goFiles.filter((f) => f.status === "modified");

      if (newFiles.length > 0) {
        reportContent += `### New files (create from scratch)\n\n`;
        for (const f of newFiles) {
          reportContent += `1. \`${f.filename}\` → \`src/${f.filename.replace(".go", ".ts")}\`\n`;
        }
        reportContent += `\n`;
      }

      if (modifiedFiles.length > 0) {
        reportContent += `### Modified files (update existing)\n\n`;
        modifiedFiles.sort((a, b) => a.additions + a.deletions - (b.additions + b.deletions));
        for (const f of modifiedFiles) {
          reportContent += `1. \`${f.filename}\` (+${f.additions}/-${f.deletions})\n`;
        }
        reportContent += `\n`;
      }
    }
  } catch {
    reportContent += `## Diff Analysis\n\n`;
    reportContent += `⚠️ Could not fetch diff from GitHub API. You can view it manually:\n\n`;
    reportContent += `\`\`\`\ngh api repos/${owner}/${repo}/compare/v${currentGoVersion}...v${targetVersion}\n\`\`\`\n\n`;
    reportContent += `Or visit: https://github.com/${owner}/${repo}/compare/v${currentGoVersion}...v${targetVersion}\n`;
  }

  reportContent += `## Checklist\n\n`;
  reportContent += `- [ ] Review all changed Go files above\n`;
  reportContent += `- [ ] Port new functions/types to TypeScript\n`;
  reportContent += `- [ ] Update existing functions with Go changes\n`;
  reportContent += `- [ ] Add Go-style API wrappers for new exports (\`src/go-style.ts\`)\n`;
  reportContent += `- [ ] Update \`src/index.ts\` exports\n`;
  reportContent += `- [ ] Update/add tests\n`;
  reportContent += `- [ ] Run \`bun test\` and verify all tests pass\n`;
  reportContent += `- [ ] Update CHANGELOG.md\n`;
  reportContent += `- [ ] Commit and merge to main\n`;

  return reportContent;
}
