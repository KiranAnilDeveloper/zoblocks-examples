#!/usr/bin/env node
// Scaffolds a standalone React + Vite demo app for one component:
//   npm run create:demo            (prompts for the name)
//   npm run create:demo -- button  (non-interactive)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline/promises";
import { CLI_COMPONENTS, NPM_COMPONENTS } from "./components.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TEMPLATE_DIR = path.join(ROOT, "templates", "react-vite");
// Overridable so tests can generate into a temporary folder.
const DEMOS_DIR = process.env.DEMOS_DIR ?? path.join(ROOT, "demos");

const NAME_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const MAX_NAME_LENGTH = 50;

// "github:owner/repo" in the root package.json -> "owner/repo", used for StackBlitz links.
const REPO = JSON.parse(
  fs.readFileSync(path.join(ROOT, "package.json"), "utf8"),
).repository.replace(/^github:/, "");

const color = (code) => (text) => (process.stdout.isTTY ? `\x1b[${code}m${text}\x1b[0m` : text);
const green = color(32);
const red = color(31);
const yellow = color(33);
const bold = color(1);

function fail(message) {
  console.error(red(`✗ ${message}`));
  process.exit(1);
}

async function readName() {
  if (process.argv[2] !== undefined) return process.argv[2];
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  // Resolve with "" if stdin closes (Ctrl+D) before an answer arrives.
  const closed = new Promise((resolve) => rl.once("close", () => resolve("")));
  try {
    return await Promise.race([rl.question("Component name: "), closed]);
  } finally {
    rl.close();
  }
}

function validate(name) {
  if (!name) fail("Component name is required.");
  if (name.length > MAX_NAME_LENGTH)
    fail(`Component name must be at most ${MAX_NAME_LENGTH} characters.`);
  if (!NAME_PATTERN.test(name)) {
    fail(
      `"${name}" is not a valid name. Use lowercase letters, numbers and single dashes (e.g. button, date-picker).`,
    );
  }
  if (fs.existsSync(path.join(DEMOS_DIR, name)))
    fail(`demos/${name} already exists. Choose another name or remove it first.`);
}

// "date-picker" -> "Date Picker"
const toTitle = (name) =>
  name
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");

function replaceTokens(dir, tokens) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      replaceTokens(file, tokens);
      continue;
    }
    const content = fs.readFileSync(file, "utf8");
    const replaced = Object.entries(tokens).reduce(
      (text, [key, value]) => text.replaceAll(`{{${key}}}`, value),
      content,
    );
    if (replaced !== content) fs.writeFileSync(file, replaced);
  }
}

function nextSteps(name) {
  if (CLI_COMPONENTS.includes(name)) {
    return ["Add the component:", `npx @zoblocks/cli add ${name} --yes`];
  }
  if (name in NPM_COMPONENTS) {
    const packages = [`@zoblocks/${name}`, ...NPM_COMPONENTS[name]].join(" ");
    return [
      "Add the component:",
      `npm install ${packages}`,
      `import "@zoblocks/${name}/styles.css";`,
    ];
  }
  return [];
}

const name = (await readName()).trim().toLowerCase();
validate(name);

const known = CLI_COMPONENTS.includes(name) || name in NPM_COMPONENTS;
if (!known)
  console.warn(yellow(`! "${name}" is not a known ZoBlocks component. Creating the demo anyway.`));

const target = path.join(DEMOS_DIR, name);
fs.mkdirSync(DEMOS_DIR, { recursive: true });
fs.cpSync(TEMPLATE_DIR, target, { recursive: true });
replaceTokens(target, { name, title: toTitle(name), repo: REPO });

const relative = `demos/${name}`;
const steps = nextSteps(name);
console.log(
  [
    "",
    green("✓ Demo created successfully"),
    "",
    bold(relative),
    "",
    "Run:",
    `cd ${relative}`,
    "npm install",
    "npm run dev",
    ...(steps.length ? ["", ...steps] : []),
    "",
    "Open in StackBlitz (once pushed to main):",
    `https://stackblitz.com/github/${REPO}/tree/main/${relative}?file=src/App.tsx`,
    "",
  ].join("\n"),
);
