#!/usr/bin/env node
// Installs and builds every demo, the same way CI does:
//   npm run build:demos                 (all demos)
//   npm run build:demos -- breath-loader (one demo)
// Every demo is attempted; exits 1 if any of them fails.

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEMOS_DIR = path.join(ROOT, "demos");

const color = (code) => (text) => (process.stdout.isTTY ? `\x1b[${code}m${text}\x1b[0m` : text);
const green = color(32);
const red = color(31);
const bold = color(1);

const npm = process.platform === "win32" ? "npm.cmd" : "npm";

function run(args, cwd) {
  const { status } = spawnSync(npm, args, {
    cwd,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  return status === 0;
}

function build(name) {
  const dir = path.join(DEMOS_DIR, name);
  if (!fs.existsSync(path.join(dir, "package-lock.json"))) {
    console.error(
      red(`No package-lock.json. Run npm install in demos/${name} and commit the lockfile.`),
    );
    return false;
  }
  return run(["ci", "--no-audit", "--no-fund"], dir) && run(["run", "build"], dir);
}

const only = process.argv[2];
const demos = (fs.existsSync(DEMOS_DIR) ? fs.readdirSync(DEMOS_DIR) : [])
  .filter((name) => fs.existsSync(path.join(DEMOS_DIR, name, "package.json")))
  .filter((name) => !only || name === only)
  .sort();

if (only && demos.length === 0) {
  console.error(red(`✗ demos/${only} does not exist.`));
  process.exit(1);
}

const results = demos.map((name) => {
  console.log(bold(`\n→ demos/${name}`));
  return { name, ok: build(name) };
});

console.log(bold("\nDemo builds"));
for (const { name, ok } of results) console.log(ok ? green(`✓ ${name}`) : red(`✗ ${name}`));
if (results.length === 0) console.log("No demos found.");

process.exit(results.every(({ ok }) => ok) ? 0 : 1);
