// Shared helpers for demo names, StackBlitz links and the DEMOS.md table.
// Used by create-demo.mjs and check-demos-md.mjs.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// "github:owner/repo" in the root package.json -> "owner/repo".
export const REPO = JSON.parse(
  fs.readFileSync(path.join(ROOT, "package.json"), "utf8"),
).repository.replace(/^github:/, "");

// "date-picker" -> "Date Picker"
export const toTitle = (name) =>
  name
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");

export const stackblitzUrl = (name) =>
  `https://stackblitz.com/github/${REPO}/tree/main/demos/${name}?file=src/App.tsx`;

// A CodeSandbox "synced template": it reads the folder from GitHub and updates on every commit.
export const codesandboxUrl = (name) =>
  `https://codesandbox.io/p/devbox/github/${REPO}/tree/main/demos/${name}`;

// Button-style badge image from shields.io, e.g. "[logo] STACKBLITZ | OPEN".
const badge = (platform, message, color, logo) =>
  `https://img.shields.io/badge/${platform}-${message}-${color}?style=for-the-badge&logo=${logo}&logoColor=white`;

// Active button: a badge image wrapped in a link.
export const stackblitzButton = (name) =>
  `[![Open in StackBlitz](${badge("StackBlitz", "Open", "1389FD", "stackblitz")})](${stackblitzUrl(name)})`;

export const codesandboxButton = (name) =>
  `[![Open in CodeSandbox](${badge("CodeSandbox", "Open", "151515", "codesandbox")})](${codesandboxUrl(name)})`;

// Disabled button: a grey badge image with no link.
const comingSoonButton = (platform, logo) =>
  `![${platform} coming soon](${badge(platform, "Coming_soon", "lightgrey", logo)})`;

// The row a demo needs in DEMOS.md. JSFiddle isn't supported yet.
export const demosTableRow = (name) =>
  `| ${toTitle(name)} | ${stackblitzButton(name)} ${codesandboxButton(name)} ${comingSoonButton("JSFiddle", "jsfiddle")} |`;

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Links every demo must have in DEMOS.md. `reason` is reported when the link is missing.
const REQUIRED_LINKS = [
  {
    reason: "no-stackblitz",
    url: (name) => `https://stackblitz.com/github/${REPO}/tree/main/demos/${name}`,
  },
  { reason: "no-codesandbox", url: codesandboxUrl },
];

/**
 * Checks that each demo has a row in the DEMOS.md table with StackBlitz and CodeSandbox links.
 * Returns the problems found: { name, reason: "missing" | "no-stackblitz" | "no-codesandbox" }.
 */
export function findDemoProblems(markdown, names) {
  // Table rows look like "| Breath Loader | [Open in StackBlitz](...) · ... |".
  // Rows inside ``` code blocks are examples, not real entries, so they're skipped.
  let inCodeBlock = false;
  const rows = markdown
    .split(/\r?\n/) // Windows line endings too
    .filter((line) => {
      if (line.trim().startsWith("```")) inCodeBlock = !inCodeBlock;
      return !inCodeBlock && line.trim().startsWith("|");
    })
    .map((line) =>
      line
        .trim()
        .replace(/^\||\|$/g, "")
        .split("|")
        .map((cell) => cell.trim()),
    );

  const problems = [];
  for (const name of names) {
    const demoPath = `/demos/${name}`;
    // A row belongs to the demo if its title matches, or its links point at the demo's folder.
    const row = rows.find(
      ([component = "", links = ""]) =>
        component.toLowerCase() === toTitle(name).toLowerCase() ||
        new RegExp(`${escapeRegExp(demoPath)}[?)/]`).test(links),
    );
    if (!row) {
      problems.push({ name, reason: "missing" });
      continue;
    }
    // Each required link (text or button) must open this demo from main; any "?file=..." is fine.
    for (const { reason, url } of REQUIRED_LINKS) {
      const link = new RegExp(`\\]\\(${escapeRegExp(url(name))}[?)]`);
      if (!link.test(row[1] ?? "")) problems.push({ name, reason });
    }
  }
  return problems;
}
