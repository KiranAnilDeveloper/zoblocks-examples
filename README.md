# ZoBlocks Examples

Small example apps (called **demos**) that show how to use [ZoBlocks](https://zoblocks.design) components.

- Each demo lives in its own folder under `demos/`, for example `demos/breath-loader`.
- Each demo is a complete [React](https://react.dev) app built with [Vite](https://vite.dev) (a fast development server and build tool). You can run it on its own.
- Every demo can also be opened online, with nothing to install, in [StackBlitz](https://stackblitz.com) (runs in your browser, no account needed) or [CodeSandbox](https://codesandbox.io) (runs on a cloud machine; may ask you to sign in).

## Try a demo online

**[See all demos in DEMOS.md →](DEMOS.md)**

Each demo has an **Open in StackBlitz** and an **Open in CodeSandbox** button. Both install everything and start the app for you. For example, the Breath Loader demo:

[![Open in StackBlitz](https://img.shields.io/badge/StackBlitz-Open-1389FD?style=for-the-badge&logo=stackblitz&logoColor=white)](https://stackblitz.com/github/md-nabas-pm/zoblocks-examples/tree/main/demos/breath-loader?file=src/App.tsx) [![Open in CodeSandbox](https://img.shields.io/badge/CodeSandbox-Open-151515?style=for-the-badge&logo=codesandbox&logoColor=white)](https://codesandbox.io/p/devbox/github/md-nabas-pm/zoblocks-examples/tree/main/demos/breath-loader)

Both read the code straight from this GitHub repository, so they always show the latest version on `main`. There are no separate StackBlitz or CodeSandbox projects to keep up to date. JSFiddle links are coming later.

|               | StackBlitz       | CodeSandbox                                             |
| ------------- | ---------------- | ------------------------------------------------------- |
| Where it runs | In your browser  | On a cloud machine                                      |
| Account       | Not needed       | May ask you to sign in                                  |
| Start time    | About 30 seconds | Up to a couple of minutes the first time after a change |

## Run a demo on your computer

### 1. Install the tools

You need:

- **Node.js 20.19 or newer.** Check your version with `node -v`. If it's older, install the LTS version from [nodejs.org](https://nodejs.org).
- **Git.** Check with `git --version`. On Windows, install [Git for Windows](https://git-scm.com/download/win). It includes the tools the project's Git hooks need.

The project works the same on **Windows, macOS and Linux**. Every command in this README and in [CONTRIBUTING.md](CONTRIBUTING.md) works in any terminal: PowerShell, Command Prompt, Git Bash, or the macOS/Linux terminal. On Windows, run commands one line at a time, as shown.

### 2. Get the code

```bash
git clone https://github.com/md-nabas-pm/zoblocks-examples.git
cd zoblocks-examples
npm install
```

`npm install` downloads the project's tools. It also sets up the Git hooks that check your commits (see [CONTRIBUTING.md](CONTRIBUTING.md)).

### 3. Start a demo

Each demo has its own dependencies, so you install and start it from inside its folder:

```bash
cd demos/breath-loader
npm install
npm run dev
```

Open the address it prints (usually http://localhost:5173) in your browser. Changes you save in `src/App.tsx` show up right away. Press `Ctrl + C` in the terminal to stop the server.

## Create a new demo

Run this from the **root folder** of the project (not inside `demos/`):

```bash
npm run create:demo
```

It asks for the component name:

```text
Component name: pulse-loader
```

Use lowercase letters, numbers and dashes only, like `button` or `date-picker`. It then creates `demos/pulse-loader` and prints the next steps. You can also give the name directly: `npm run create:demo -- pulse-loader`.

See [Adding a demo](CONTRIBUTING.md#adding-a-demo) for the full step-by-step guide, including how to add the ZoBlocks component itself.

## Useful commands

Run these from the **root folder**.

| Command                         | What it does                                              |
| ------------------------------- | --------------------------------------------------------- |
| `npm run create:demo`           | Creates a new demo in `demos/`                            |
| `npm run lint`                  | Checks the code for common mistakes                       |
| `npm run lint:fix`              | Fixes the mistakes that can be fixed automatically        |
| `npm run format`                | Formats all files in the project's standard style         |
| `npm run format:check`          | Checks formatting without changing files                  |
| `npm run typecheck`             | Checks for TypeScript type errors                         |
| `npm test`                      | Runs the tests for the demo generator                     |
| `npm run build`                 | Builds the small root app                                 |
| `npm run build:demos`           | Installs and builds every demo, like the automatic checks |
| `npm run build:demos -- <name>` | Installs and builds one demo, e.g. `-- breath-loader`     |
| `npm run check:demos`           | Checks that every demo is listed in `DEMOS.md`            |

Inside a demo folder you mostly need `npm run dev` (start it) and `npm run build` (check that it builds).

## Project structure

```text
zoblocks-examples/
├── demos/                   One folder per component demo
│   └── breath-loader/
├── templates/react-vite/    Starting files copied for every new demo
├── scripts/                 The create:demo and build:demos scripts, plus tests
├── src/                     A small root app (not a demo)
├── .github/workflows/ci.yml Automatic checks that run on GitHub
├── DEMOS.md                 List of all demos with their online links
├── README.md                This file
└── CONTRIBUTING.md          How to make changes and open a pull request
```

## Contributing

Want to add a demo or fix something? Read [CONTRIBUTING.md](CONTRIBUTING.md). It walks you through creating a branch, writing commit messages, and opening a pull request.
