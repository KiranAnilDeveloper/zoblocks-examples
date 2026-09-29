# Contributing

## Workflow

```text
Create branch → Develop → lint / typecheck / build → Conventional Commit
→ Push branch → Pull Request → GitHub CI → Review → Merge into main
```

`main` is the only long-lived branch. All work happens on short-lived branches that merge into `main` through a pull request.

## Branches

Name branches `<type>/<short-description>`:

```text
feat/button-example
fix/demo-generation
docs/setup-guide
refactor/demo-template
chore/update-dependencies
ci/github-actions
```

- Use a type from the commit type list below.
- Lowercase, words separated by hyphens.
- Short and descriptive. No personal names, and no vague names such as `test`, `changes`, `update` or `new`.

CI checks the branch name on every pull request.

## Commits

Use [Conventional Commits](https://www.conventionalcommits.org):

```text
<type>(<scope>): <description>
```

| Type       | Use for                                    |
| ---------- | ------------------------------------------ |
| `feat`     | New functionality                          |
| `fix`      | Bug fix                                    |
| `docs`     | Documentation changes                      |
| `refactor` | Code restructuring without behavior change |
| `test`     | Tests                                      |
| `chore`    | Tooling, configuration, dependencies       |
| `build`    | Build system changes                       |
| `ci`       | CI/CD changes                              |
| `style`    | Formatting or style-only changes           |
| `perf`     | Performance improvements                   |

```text
feat(demo): add button demo
fix(generator): prevent duplicate demo creation
docs(readme): update demo setup instructions
chore(deps): update vite
ci: add lint workflow
```

Keep messages short, in the imperative ("add", not "added"), lowercase after the colon, and about one logical change. The scope is optional.

## Git hooks

Husky installs the hooks when you run `npm install`.

- **pre-commit** runs lint-staged on staged files only: ESLint (`--fix`) and Prettier for `.ts`/`.tsx`/`.js`/`.mjs`, and Prettier for JSON, Markdown, YAML and CSS.
- **commit-msg** runs commitlint and rejects messages such as `updated stuff`, `fix` or `new demo`.

The full test suite is not run on commit. CI runs it.

## Pull requests

- The PR title follows the commit format, e.g. `feat(demo): add button example`.
- The branch is up to date with `main`.
- CI passes: lint, format check, typecheck, build, tests, and every demo builds (`npm run build:demos`).
- At least one reviewer approves.
- Nobody pushes directly to `main`.

Before pushing, run the same checks locally:

```bash
npm run lint
npm run typecheck
npm run build
npm test
```

## Adding a demo

1. `npm run create:demo -- <component>` creates `demos/<component>`.
2. `cd demos/<component> && npm install`, then commit the generated `package-lock.json`.
3. `npx @zoblocks/cli add <component> --yes`, enable its styles in `src/index.css`, and use it in `src/App.tsx`.
4. `npm run build:demos -- <component>` from the root checks it the same way CI does.
5. Add the demo to the table in `README.md`, then open a PR. To try it in StackBlitz before merging, use the link with your branch name in place of `main`.

Keep demos on TypeScript 6. TypeScript 7 ships only as native binaries, which StackBlitz cannot run.

## Code style

- ESLint (TypeScript, React, React Hooks) and Prettier are the source of truth. Run `npm run lint:fix` and `npm run format`.
- Avoid `any`. If you truly need it, disable the rule on that line with a comment explaining why.
- Don't disable other ESLint rules without a documented reason.
- Component source copied in by `npx @zoblocks/cli add` (`demos/*/src/components/zoblocks`, `src/lib`, `src/styles`) belongs to ZoBlocks and is not linted or formatted here.
