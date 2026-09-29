import assert from "node:assert/strict";
import { test } from "node:test";
import { demosTableRow, findDemoProblems, stackblitzUrl, toTitle } from "./demos.mjs";

const table = (...rows) => ["| Component | Open online |", "| --- | --- |", ...rows].join("\n");

test("toTitle turns a folder name into a title", () => {
  assert.equal(toTitle("date-picker"), "Date Picker");
  assert.equal(toTitle("button"), "Button");
});

test("accepts a demo listed with its StackBlitz link", () => {
  assert.deepEqual(findDemoProblems(table(demosTableRow("pulse-loader")), ["pulse-loader"]), []);
});

test("accepts a row reformatted by Prettier (extra spaces)", () => {
  const row = `|   Pulse Loader   |   [Open in StackBlitz](${stackblitzUrl("pulse-loader")}) · CodeSandbox — Coming soon   |`;
  assert.deepEqual(findDemoProblems(table(row), ["pulse-loader"]), []);
});

test("reports a demo that is not listed", () => {
  assert.deepEqual(findDemoProblems(table(demosTableRow("breath-loader")), ["pulse-loader"]), [
    { name: "pulse-loader", reason: "missing" },
  ]);
});

test("reports a listed demo without a StackBlitz link", () => {
  const row = "| Pulse Loader | StackBlitz — Coming soon · CodeSandbox — Coming soon |";
  assert.deepEqual(findDemoProblems(table(row), ["pulse-loader"]), [
    { name: "pulse-loader", reason: "no-stackblitz" },
  ]);
});

test("reports a StackBlitz link that points at another demo", () => {
  const row = `| Pulse Loader | [Open in StackBlitz](${stackblitzUrl("breath-loader")}) |`;
  assert.deepEqual(findDemoProblems(table(row), ["pulse-loader"]), [
    { name: "pulse-loader", reason: "no-stackblitz" },
  ]);
});

test("does not confuse demos whose names share a prefix", () => {
  const row = `| Pulse | [Open in StackBlitz](${stackblitzUrl("pulse-loader")}) |`;
  assert.deepEqual(findDemoProblems(table(row), ["pulse"]), [
    { name: "pulse", reason: "no-stackblitz" },
  ]);
});

test("ignores example rows inside code blocks", () => {
  const markdown = [table(), "```md", demosTableRow("pulse-loader"), "```"].join("\n");
  assert.deepEqual(findDemoProblems(markdown, ["pulse-loader"]), [
    { name: "pulse-loader", reason: "missing" },
  ]);
});

test("the generated row uses an active StackBlitz button and disabled buttons for the rest", () => {
  const row = demosTableRow("pulse-loader");
  assert.ok(row.includes(`[![Open in StackBlitz](`));
  assert.ok(row.includes(`](${stackblitzUrl("pulse-loader")})`));
  assert.match(row, /!\[CodeSandbox coming soon\]\(https:\/\/img\.shields\.io\/[^)]+\) /);
  assert.match(row, /!\[JSFiddle coming soon\]\(https:\/\/img\.shields\.io\/[^)]+\) \|$/);
});

test("reports a StackBlitz button that isn't a link", () => {
  const row =
    "| Pulse Loader | ![StackBlitz coming soon](https://img.shields.io/badge/StackBlitz-Coming_soon-lightgrey) |";
  assert.deepEqual(findDemoProblems(table(row), ["pulse-loader"]), [
    { name: "pulse-loader", reason: "no-stackblitz" },
  ]);
});

test("reads DEMOS.md with Windows line endings", () => {
  const markdown = table(demosTableRow("pulse-loader")).replaceAll("\n", "\r\n");
  assert.deepEqual(findDemoProblems(markdown, ["pulse-loader"]), []);
});
