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

// Button-style badge image from shields.io, e.g. "[logo] STACKBLITZ | OPEN".
const badge = (platform, message, color, logo) =>
  `https://img.shields.io/badge/${platform}-${message}-${color}?style=for-the-badge&logo=${logo}&logoColor=white`;

// Active button: a badge image wrapped in a link.
export const stackblitzButton = (name) =>
  `[![Open in StackBlitz](${badge("StackBlitz", "Open", "1389FD", "stackblitz")})](${stackblitzUrl(name)})`;

// Disabled button: a grey badge image with no link.
const comingSoonButton = (platform, logo) =>
  `![${platform} coming soon](${badge(platform, "Coming_soon", "lightgrey", logo)})`;

// The row a demo needs in DEMOS.md. CodeSandbox and JSFiddle aren't supported yet.
export const demosTableRow = (name) =>
  `| ${toTitle(name)} | ${stackblitzButton(name)} ${comingSoonButton("CodeSandbox", "codesandbox")} ${comingSoonButton("JSFiddle", "jsfiddle")} |`;

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Checks that each demo has a row in the DEMOS.md table with a StackBlitz link.
 * Returns one problem per demo that isn't OK: { name, reason: "missing" | "no-stackblitz" }.
 */
export function findDemoProblems(markdown, names) {
  // Table rows look like "| Breath Loader | [Open in StackBlitz](...) · ... |".
  // Rows inside ``` code blocks are examples, not real entries, so they're skipped.
  let inCodeBlock = false;
  const rows = markdown
    .split("\n")
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
    // A link (text or button) must open this demo in StackBlitz from main; any "?file=..." is fine.
    const link = new RegExp(
      `\\]\\(${escapeRegExp(`https://stackblitz.com/github/${REPO}/tree/main${demoPath}`)}[?)]`,
    );
    if (!link.test(row[1] ?? "")) problems.push({ name, reason: "no-stackblitz" });
  }
  return problems;
}
