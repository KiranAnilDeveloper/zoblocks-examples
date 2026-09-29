# Contributing

Thanks for helping out! This guide shows you, step by step, how to make a change and get it merged. If you haven't set up the project yet, start with [Run a demo on your computer](README.md#run-a-demo-on-your-computer) in the README.

## The workflow at a glance

```text
1. Create a branch      →  git switch -c feat/button-example
2. Make your changes
3. Check your work      →  npm run lint, typecheck, test, build:demos
4. Commit               →  git commit -m "feat(demo): add button example"
5. Push and open a pull request
6. Automatic checks run and a teammate reviews
7. Merge into main
```

Nobody pushes directly to `main`. Every change goes through a pull request (PR).

## 1. Create a branch

A branch is your own copy of the code where you can work without affecting `main`. Always start from an up-to-date `main`:

```bash
git switch main
git pull
git switch -c feat/button-example
```

Branch names look like `<type>/<short-description>`:

| Good                        | Why it's good                 |
| --------------------------- | ----------------------------- |
| `feat/button-example`       | New feature: a button demo    |
| `fix/demo-generation`       | Bug fix in the demo generator |
| `docs/setup-guide`          | Documentation change          |
| `chore/update-dependencies` | Maintenance work              |

Rules: lowercase, words joined with `-`, short and specific. Don't use your name or vague words like `test`, `changes`, `update` or `new`. The type must be one of the [commit types](#commit-types) below.

## 2. Make your changes

### Adding a demo

Most contributions are new demos. Here is the full process, using `pulse-loader` as the example.

**a. Create the demo** (from the root folder):

```bash
npm run create:demo -- pulse-loader
```

This creates `demos/pulse-loader` with everything a React + Vite app needs.

**b. Install its dependencies:**

```bash
cd demos/pulse-loader
npm install
```

This also creates a `package-lock.json` file. **Commit it.** It records the exact package versions, so the automatic checks and StackBlitz install the same thing you did.

**c. Add the ZoBlocks component:**

```bash
npx @zoblocks/cli add pulse-loader --yes
```

This copies the component's source code into `src/components/zoblocks/`, `src/lib/` and `src/styles/`. Don't edit those files; they belong to ZoBlocks.

> A few components, such as `signature` and `tabs`, are installed from npm instead. For those, `create:demo` prints the right command to use.

**d. Turn on the styles.** Open `src/index.css`. Remove the `/* */` around the two ZoBlocks lines, and add one `@import` line for each `zoblocks-*.css` file in `src/styles/`:

```css
@import "tailwindcss";

@import "./styles/zoblocks-tokens.css";
@import "./styles/zoblocks-loader.css";
@source "./components/zoblocks";
```

Without these lines the component shows up with no styling.

**e. Use the component** in `src/App.tsx`:

```tsx
import { PulseLoader } from "@/components/zoblocks/pulse-loader";

export default function App() {
  return (
    <div>
      <PulseLoader label="Loading your records" showLabel />
    </div>
  );
}
```

`@/` is a shortcut for the demo's `src/` folder.

**f. Try it:** run `npm run dev` and open the address it prints.

**g. Add it to [DEMOS.md](DEMOS.md). This is required.** Every demo must have a row in the table there with an active "Open in StackBlitz" button, or your commit will be stopped. `create:demo` printed the exact row for you in step a. It looks like this:

```md
| Pulse Loader | [![Open in StackBlitz](https://img.shields.io/badge/StackBlitz-Open-1389FD?style=for-the-badge&logo=stackblitz&logoColor=white)](https://stackblitz.com/github/md-nabas-pm/zoblocks-examples/tree/main/demos/pulse-loader?file=src/App.tsx) ![CodeSandbox coming soon](https://img.shields.io/badge/CodeSandbox-Coming_soon-lightgrey?style=for-the-badge&logo=codesandbox&logoColor=white) ![JSFiddle coming soon](https://img.shields.io/badge/JSFiddle-Coming_soon-lightgrey?style=for-the-badge&logo=jsfiddle&logoColor=white) |
```

Keep the grey CodeSandbox and JSFiddle buttons as they are; they mean "coming soon". Remember to commit `DEMOS.md` together with your demo (`git add DEMOS.md`).

> Keep TypeScript at version 6 in demos. TypeScript 7 doesn't run in StackBlitz.

### Code style

You don't need to memorise a style guide. The tools handle it:

- **ESLint** finds common mistakes. Run `npm run lint:fix` to fix what it can.
- **Prettier** formats the code. Run `npm run format`.
- Avoid the `any` type. If you really need it, add a comment explaining why.

## 3. Check your work

Run these from the root folder before you commit. They are the same checks that run on GitHub.

```bash
npm run lint
npm run format:check
npm run check:demos
npm run typecheck
npm test
npm run build:demos
```

If they all pass, you're good to go. If one fails, read the error message; it usually names the file and line.

## 4. Commit

A commit saves a snapshot of your changes with a message describing them. Messages follow the [Conventional Commits](https://www.conventionalcommits.org) format:

```text
<type>(<scope>): <description>
```

- **type** is what kind of change it is (see below).
- **scope** is optional: the area you changed, like `demo`, `generator` or `readme`.
- **description** is a short summary, lowercase, written as a command ("add", not "added").

```bash
git add .
git commit -m "feat(demo): add pulse loader example"
```

| Good                                             | Bad             | Why it's bad                |
| ------------------------------------------------ | --------------- | --------------------------- |
| `feat(demo): add pulse loader example`           | `new demo`      | No type                     |
| `fix(generator): prevent duplicate demo folders` | `fix`           | No description              |
| `docs(readme): add setup steps`                  | `updated stuff` | No type, and it's too vague |
| `chore(deps): update vite`                       | `Feat: Add X`   | Must be lowercase           |

### Commit types

| Type       | Use it for                                   |
| ---------- | -------------------------------------------- |
| `feat`     | A new feature or demo                        |
| `fix`      | A bug fix                                    |
| `docs`     | Documentation only                           |
| `refactor` | Restructuring code without changing behavior |
| `test`     | Adding or changing tests                     |
| `chore`    | Tooling, configuration or dependency updates |
| `build`    | Changes to how the project is built          |
| `ci`       | Changes to the automatic GitHub checks       |
| `style`    | Formatting only                              |
| `perf`     | Performance improvements                     |

### What happens when you commit

Automatic checks (called Git hooks) run when you commit:

1. **New demos** must be listed in `DEMOS.md` with a StackBlitz link. If one isn't, the error shows the exact row to add.
2. **ESLint and Prettier** check and tidy the files you're committing.
3. **The commit message** is checked against the format above.

If any check fails, the commit is **not created**. Fix the problem it reports and run `git commit` again.

The hooks work on Windows, macOS and Linux, whether you commit from a terminal or from an app like VS Code or GitHub Desktop. On Windows they run with the `sh` that comes with Git for Windows.

## 5. Push and open a pull request

```bash
git push -u origin feat/button-example
```

Then open the repository on GitHub and click **Compare & pull request**.

- Give the pull request a title in the commit format, for example `feat(demo): add button example`.
- Describe what you changed and how you tested it.

**Tip:** you can try your demo in StackBlitz before it's merged. Take the demo's link and replace `main` with your branch name:

```text
https://stackblitz.com/github/md-nabas-pm/zoblocks-examples/tree/feat/button-example/demos/button?file=src/App.tsx
```

## 6. Automatic checks and review

GitHub runs these checks on every pull request:

| Check                        | What it does                                                |
| ---------------------------- | ----------------------------------------------------------- |
| Lint, typecheck, build, test | The same commands as in step 3                              |
| Build demos                  | Installs and builds every demo; fails if any demo is broken |
| PR title and branch name     | Checks the naming rules above                               |

A pull request can be merged when:

- all checks are green ✅
- at least one teammate has approved it
- the branch is up to date with `main` (GitHub shows an **Update branch** button if it isn't)

If a check fails, click **Details** next to it to see the error. Fix it, commit and push again, and the checks re-run automatically.

## Troubleshooting

| Problem                                                                                                                                                                              | Fix                                                                                                                                                                                                     |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| My commit was rejected                                                                                                                                                               | Read the message. It's usually the commit format, or a lint error in a staged file.                                                                                                                     |
| The component has no styling                                                                                                                                                         | Check the `@import` and `@source` lines in the demo's `src/index.css` (step 2d).                                                                                                                        |
| `Cannot find module '@/…'`                                                                                                                                                           | The demo's `vite.config.ts` or `tsconfig.json` lost its `@` setting. Compare them with `templates/react-vite/`.                                                                                         |
| `build:demos` says `No package-lock.json`                                                                                                                                            | Run `npm install` inside that demo folder and commit the `package-lock.json`.                                                                                                                           |
| `DEMOS.md is missing information about a demo`                                                                                                                                       | Add the row the error shows to `DEMOS.md`, run `git add DEMOS.md`, and commit again.                                                                                                                    |
| `demos/<name> already exists`                                                                                                                                                        | That demo already exists. Pick another name or work on the existing one.                                                                                                                                |
| Hook error `node: command not found` or `npx: command not found` (usually when committing from an app like VS Code or GitHub Desktop, often with a Node version manager such as nvm) | The app can't find Node.js. Commit from a terminal instead, or follow [Husky's guide](https://typicode.github.io/husky/how-to.html#node-version-managers-and-guis) to create `~/.config/husky/init.sh`. |
| Windows: every file shows as changed, or `format:check` fails on files you didn't touch                                                                                              | Your copy was cloned with Windows (CRLF) line endings, before the project set LF for everyone. Save your work, then clone the repository again.                                                         |
| Windows: `"con" can't be used as a folder name`                                                                                                                                      | Windows reserves a few names (`con`, `nul`, `aux`, `prn`, `com1`…). Choose another demo name.                                                                                                           |
| `npm warn EBADENGINE` or strange install errors                                                                                                                                      | Your Node.js is too old. Check with `node -v` and install 20.19 or newer.                                                                                                                               |
