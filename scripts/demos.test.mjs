import assert from "node:assert/strict";
import { test } from "node:test";
import {
  codesandboxUrl,
  demosTableRow,
  findDemoProblems,
  stackblitzUrl,
  toTitle,
} from "./demos.mjs";

const table = (...rows) => ["| Component | Open online |", "| --- | --- |", ...rows].join("\n");

// Plain-text links for a demo, used to build rows that are missing one of them.
const stackblitzLink = (name) => `[Open in StackBlitz](${stackblitzUrl(name)})`;
const codesandboxLink = (name) => `[Open in CodeSandbox](${codesandboxUrl(name)})`;

test("toTitle turns a folder name into a title", () => {
  assert.equal(toTitle("date-picker"), "Date Picker");
  assert.equal(toTitle("button"), "Button");
});

test("accepts a demo listed with its StackBlitz and CodeSandbox links", () => {
  assert.deepEqual(findDemoProblems(table(demosTableRow("pulse-loader")), ["pulse-loader"]), []);
});

test("accepts plain-text links in a row reformatted by Prettier (extra spaces)", () => {
  const row = `|   Pulse Loader   |   ${stackblitzLink("pulse-loader")} · ${codesandboxLink("pulse-loader")} · JSFiddle — Coming soon   |`;
  assert.deepEqual(findDemoProblems(table(row), ["pulse-loader"]), []);
});

test("reports a demo that is not listed", () => {
  assert.deepEqual(findDemoProblems(table(demosTableRow("breath-loader")), ["pulse-loader"]), [
    { name: "pulse-loader", reason: "missing" },
  ]);
});

test("reports a listed demo without a StackBlitz link", () => {
  const row = `| Pulse Loader | StackBlitz — Coming soon · ${codesandboxLink("pulse-loader")} |`;
  assert.deepEqual(findDemoProblems(table(row), ["pulse-loader"]), [
    { name: "pulse-loader", reason: "no-stackblitz" },
  ]);
});

test("reports a listed demo without a CodeSandbox link", () => {
  const row = `| Pulse Loader | ${stackblitzLink("pulse-loader")} · CodeSandbox — Coming soon |`;
  assert.deepEqual(findDemoProblems(table(row), ["pulse-loader"]), [
    { name: "pulse-loader", reason: "no-codesandbox" },
  ]);
});

test("reports both links when neither is there", () => {
  const row = "| Pulse Loader | StackBlitz — Coming soon · CodeSandbox — Coming soon |";
  assert.deepEqual(findDemoProblems(table(row), ["pulse-loader"]), [
    { name: "pulse-loader", reason: "no-stackblitz" },
    { name: "pulse-loader", reason: "no-codesandbox" },
  ]);
});

test("reports links that point at another demo", () => {
  const row = `| Pulse Loader | ${stackblitzLink("breath-loader")} ${codesandboxLink("breath-loader")} |`;
  assert.deepEqual(findDemoProblems(table(row), ["pulse-loader"]), [
    { name: "pulse-loader", reason: "no-stackblitz" },
    { name: "pulse-loader", reason: "no-codesandbox" },
  ]);
});

test("does not confuse demos whose names share a prefix", () => {
  const row = `| Pulse | ${stackblitzLink("pulse-loader")} ${codesandboxLink("pulse-loader")} |`;
  assert.deepEqual(findDemoProblems(table(row), ["pulse"]), [
    { name: "pulse", reason: "no-stackblitz" },
    { name: "pulse", reason: "no-codesandbox" },
  ]);
});

test("ignores example rows inside code blocks", () => {
  const markdown = [table(), "```md", demosTableRow("pulse-loader"), "```"].join("\n");
  assert.deepEqual(findDemoProblems(markdown, ["pulse-loader"]), [
    { name: "pulse-loader", reason: "missing" },
  ]);
});

test("the generated row has active StackBlitz and CodeSandbox buttons and a disabled JSFiddle one", () => {
  const row = demosTableRow("pulse-loader");
  assert.ok(row.includes(`[![Open in StackBlitz](`));
  assert.ok(row.includes(`](${stackblitzUrl("pulse-loader")})`));
  assert.ok(row.includes(`[![Open in CodeSandbox](`));
  assert.ok(row.includes(`](${codesandboxUrl("pulse-loader")})`));
  assert.match(row, /!\[JSFiddle coming soon\]\(https:\/\/img\.shields\.io\/[^)]+\) \|$/);
});

test("the CodeSandbox link opens the demo's folder on main from GitHub", () => {
  assert.equal(
    codesandboxUrl("pulse-loader"),
    "https://codesandbox.io/p/devbox/github/md-nabas-pm/zoblocks-examples/tree/main/demos/pulse-loader",
  );
});

test("reports buttons that aren't links", () => {
  const row =
    "| Pulse Loader | ![StackBlitz](https://img.shields.io/badge/StackBlitz-Open-1389FD) ![CodeSandbox](https://img.shields.io/badge/CodeSandbox-Open-151515) |";
  assert.deepEqual(findDemoProblems(table(row), ["pulse-loader"]), [
    { name: "pulse-loader", reason: "no-stackblitz" },
    { name: "pulse-loader", reason: "no-codesandbox" },
  ]);
});

test("reads DEMOS.md with Windows line endings", () => {
  const markdown = table(demosTableRow("pulse-loader")).replaceAll("\n", "\r\n");
  assert.deepEqual(findDemoProblems(markdown, ["pulse-loader"]), []);
});
