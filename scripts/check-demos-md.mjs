#!/usr/bin/env node
// Checks that demos are listed in DEMOS.md with "Open in StackBlitz" and "Open in CodeSandbox" links.
//   npm run check:demos                        every demo (used by CI)
//   node scripts/check-demos-md.mjs --staged   only demos added in this commit (pre-commit hook)

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import {
  ROOT,
  codesandboxButton,
  demosTableRow,
  findDemoProblems,
  stackblitzButton,
} from "./demos.mjs";

const color = (code) => (text) => (process.stdout.isTTY ? `\x1b[${code}m${text}\x1b[0m` : text);
const red = color(31);
const bold = color(1);

const staged = process.argv.includes("--staged");
const DEMOS_MD = path.join(ROOT, "DEMOS.md");

function git(...args) {
  return spawnSync("git", args, { cwd: ROOT, encoding: "utf8" });
}

// Demo folders with files being added in this commit that don't exist in the last commit.
function newStagedDemos() {
  const added = git("diff", "--cached", "--name-only", "--diff-filter=A", "--", "demos/");
  const names = new Set(
    added.stdout
      .split(/\r?\n/)
      .map((file) => file.split("/"))
      .filter((parts) => parts.length >= 3) // demos/<name>/<file>
      .map((parts) => parts[1]),
  );
  return [...names].filter((name) => !git("ls-tree", "HEAD", "--", `demos/${name}`).stdout.trim());
}

function allDemos() {
  const dir = path.join(ROOT, "demos");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((name) => fs.existsSync(path.join(dir, name, "package.json")));
}

const readWorkingCopy = () => (fs.existsSync(DEMOS_MD) ? fs.readFileSync(DEMOS_MD, "utf8") : "");

// In the hook, check the staged DEMOS.md (what will actually be committed).
const readDemosMd = () => {
  if (!staged) return readWorkingCopy();
  const result = git("show", ":DEMOS.md");
  return result.status === 0 ? result.stdout : "";
};

const names = (staged ? newStagedDemos() : allDemos()).sort();
const problems = findDemoProblems(readDemosMd(), names);
if (problems.length === 0) process.exit(0);

const lines = [
  "",
  red(bold(`✗ DEMOS.md is missing information about a demo.`)),
  "",
  'Every demo must be listed in DEMOS.md with "Open in StackBlitz" and "Open in CodeSandbox" buttons.',
];

// What to show for a missing link: platform name and the exact button to add.
const MISSING_LINK = {
  "no-stackblitz": { platform: "StackBlitz", button: stackblitzButton },
  "no-codesandbox": { platform: "CodeSandbox", button: codesandboxButton },
};

for (const { name, reason } of problems) {
  lines.push("");
  if (reason === "missing") {
    lines.push(
      bold(`• demos/${name} is not listed in DEMOS.md.`),
      "  Add this row to the table:",
      "",
    );
    lines.push(`  ${demosTableRow(name)}`);
  } else {
    const { platform, button } = MISSING_LINK[reason];
    lines.push(
      bold(`• demos/${name} is listed, but its ${platform} link is missing or wrong.`),
      `  The "Open online" column must contain this ${platform} button:`,
      "",
      `  ${button(name)}`,
    );
  }
}

if (staged && findDemoProblems(readWorkingCopy(), names).length === 0) {
  lines.push(
    "",
    "It looks like you already fixed DEMOS.md but didn't stage it. Run:",
    "",
    "  git add DEMOS.md",
  );
} else if (staged) {
  lines.push("", "Then stage the file and commit again:", "", "  git add DEMOS.md");
}

console.error([...lines, ""].join("\n"));
process.exit(1);
