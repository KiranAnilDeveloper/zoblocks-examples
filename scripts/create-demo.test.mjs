import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, test } from "node:test";
import { fileURLToPath } from "node:url";

const SCRIPT = fileURLToPath(new URL("./create-demo.mjs", import.meta.url));

let demosDir;

beforeEach(() => {
  demosDir = fs.mkdtempSync(path.join(os.tmpdir(), "zoblocks-demos-"));
});

afterEach(() => {
  fs.rmSync(demosDir, { recursive: true, force: true });
});

function createDemo(input) {
  return spawnSync(process.execPath, [SCRIPT], {
    input: `${input}\n`,
    encoding: "utf8",
    env: { ...process.env, DEMOS_DIR: demosDir },
  });
}

const read = (...parts) => fs.readFileSync(path.join(demosDir, ...parts), "utf8");

test("creates a demo with the name and title filled in", () => {
  const result = createDemo("date-picker");

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Demo created successfully/);
  assert.equal(JSON.parse(read("date-picker", "package.json")).name, "demo-date-picker");
  assert.match(read("date-picker", "src", "App.tsx"), /<h1>Date Picker Demo<\/h1>/);
  assert.ok(fs.existsSync(path.join(demosDir, "date-picker", "public")));
});

test("adds StackBlitz config and an Open in StackBlitz link", () => {
  const url =
    "https://stackblitz.com/github/md-nabas-pm/zoblocks-examples/tree/main/demos/date-picker?file=src/App.tsx";

  const result = createDemo("date-picker");

  assert.equal(result.status, 0, result.stderr);
  assert.ok(read("date-picker", "README.md").includes(`(${url})`));
  assert.ok(result.stdout.includes(url));
  assert.equal(JSON.parse(read("date-picker", ".stackblitzrc")).startCommand, "npm run dev");
});

test("leaves no unreplaced placeholders", () => {
  createDemo("date-picker");

  const walk = (dir) =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const file = path.join(dir, entry.name);
      return entry.isDirectory() ? walk(file) : [file];
    });
  for (const file of walk(path.join(demosDir, "date-picker"))) {
    assert.doesNotMatch(fs.readFileSync(file, "utf8"), /\{\{\w+\}\}/, file);
  }
});

test("normalises the name to lowercase", () => {
  assert.equal(createDemo("  Button ").status, 0);
  assert.ok(fs.existsSync(path.join(demosDir, "button")));
});

test("rejects an empty name", () => {
  const result = createDemo("");

  assert.equal(result.status, 1);
  assert.match(result.stderr, /required/);
});

for (const name of ["my button", "-bad", "bad-", "a_b", "a--b", "a.b"]) {
  test(`rejects invalid name "${name}"`, () => {
    const result = createDemo(name);

    assert.equal(result.status, 1);
    assert.match(result.stderr, /not a valid name/);
    assert.deepEqual(fs.readdirSync(demosDir), []);
  });
}

test("does not overwrite an existing demo", () => {
  fs.mkdirSync(path.join(demosDir, "button"));
  fs.writeFileSync(path.join(demosDir, "button", "keep.txt"), "mine");

  const result = createDemo("button");

  assert.equal(result.status, 1);
  assert.match(result.stderr, /already exists/);
  assert.deepEqual(fs.readdirSync(path.join(demosDir, "button")), ["keep.txt"]);
});

test("warns about unknown components but still creates the demo", () => {
  const result = createDemo("not-a-component");

  assert.equal(result.status, 0);
  assert.match(result.stderr, /not a known ZoBlocks component/);
  assert.ok(fs.existsSync(path.join(demosDir, "not-a-component")));
});
