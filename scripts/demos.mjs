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

// The row a demo needs in DEMOS.md. CodeSandbox and JSFiddle aren't supported yet.
export const demosTableRow = (name) =>
  `| ${toTitle(name)} | [Open in StackBlitz](${stackblitzUrl(name)}) · CodeSandbox — Coming soon · JSFiddle — Coming soon |`;

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
    // The StackBlitz link must open this demo from main; any "?file=..." is fine.
    const link = new RegExp(
      `\\[Open in StackBlitz\\]\\(${escapeRegExp(`https://stackblitz.com/github/${REPO}/tree/main${demoPath}`)}[?)]`,
    );
    if (!link.test(row[1] ?? "")) problems.push({ name, reason: "no-stackblitz" });
  }
  return problems;
}
