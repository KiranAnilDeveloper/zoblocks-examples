# ZoBlocks Examples

Standalone React + Vite demos for [ZoBlocks](https://zoblocks.design) components. Each demo in `demos/<name>` is its own app with its own `package.json`.

Requires Node.js 20.19+.

## Demos

Every demo opens straight from GitHub in [StackBlitz](https://stackblitz.com), where you can run, edit and test it in the browser. No account needed.

| Component     | Open online                                                                                                                                                                                      |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Breath Loader | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/md-nabas-pm/zoblocks-examples/tree/main/demos/breath-loader?file=src/App.tsx) |

The link for any demo is:

```text
https://stackblitz.com/github/md-nabas-pm/zoblocks-examples/tree/<branch>/demos/<name>?file=src/App.tsx
```

StackBlitz reads the demo straight from GitHub, so a link only works once that demo is pushed. Use `main` for merged demos, or a branch name to preview a pull request. Each demo's own `README.md` has its badge too.

## Create a demo

```bash
npm run create:demo
# Component name: pulse-loader
```

Or without the prompt: `npm run create:demo -- pulse-loader`. This copies `templates/react-vite` to `demos/<name>`, already set up with Tailwind CSS 4, the `@/` alias and `zoblocks.json`. Then:

```bash
cd demos/pulse-loader
npm install
npx @zoblocks/cli add pulse-loader --yes
npm run dev
```

After `add`, uncomment the ZoBlocks block in `src/index.css` and add one `@import` for each `styles/zoblocks-*.css` file it wrote. Commit the demo's `package-lock.json` (CI uses it), and add a row to the table above.

## Development & Git workflow

| Task                 | Command                                   |
| -------------------- | ----------------------------------------- |
| Install dependencies | `npm install` (also installs hooks)       |
| Run the base app     | `npm run dev`                             |
| Lint                 | `npm run lint` / `npm run lint:fix`       |
| Format               | `npm run format` / `npm run format:check` |
| Typecheck            | `npm run typecheck`                       |
| Build                | `npm run build`                           |
| Test                 | `npm test`                                |
| Build all demos      | `npm run build:demos` (or `-- <name>`)    |

**Branches:** `<type>/<short-description>`, e.g. `feat/button-example` or `fix/demo-generation`. Branch from `main`.

**Commits:** [Conventional Commits](https://www.conventionalcommits.org), `<type>(<scope>): <description>`, e.g. `feat(demo): add button example`. Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `build`, `ci`, `style`, `perf`. A commit-msg hook rejects anything else, and a pre-commit hook lints and formats staged files.

**Pull requests:** into `main` only, with a Conventional Commit title. CI (lint, format check, typecheck, build, tests, and a build of every demo) must pass, the branch must be up to date with `main`, and one reviewer must approve.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the details.
