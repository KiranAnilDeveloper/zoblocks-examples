# Online demos

Every component demo in this repository, and where you can open it online. Click a link to run and edit the demo in your browser. You don't need to install anything.

| Component     | Open online                                                                                                                                                                           |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Breath Loader | [Open in StackBlitz](https://stackblitz.com/github/md-nabas-pm/zoblocks-examples/tree/main/demos/breath-loader?file=src/App.tsx) · CodeSandbox — Coming soon · JSFiddle — Coming soon |

## Adding a new demo

**Every demo must be listed here before it can be committed.** A check runs when you commit and stops the commit if the demo is missing.

1. Add one row to the table above, in alphabetical order. `npm run create:demo` prints the exact row for you. It looks like this:

   ```md
   | Pulse Loader | [Open in StackBlitz](https://stackblitz.com/github/md-nabas-pm/zoblocks-examples/tree/main/demos/pulse-loader?file=src/App.tsx) · CodeSandbox — Coming soon · JSFiddle — Coming soon |
   ```

2. Stage the file together with your demo: `git add DEMOS.md`.

### Rules for the "Open online" column

| Platform    | What to write                                                                                                                             |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| StackBlitz  | **Required.** `[Open in StackBlitz](https://stackblitz.com/github/md-nabas-pm/zoblocks-examples/tree/main/demos/<name>?file=src/App.tsx)` |
| CodeSandbox | `CodeSandbox — Coming soon` (replace it with a link once CodeSandbox is supported)                                                        |
| JSFiddle    | `JSFiddle — Coming soon` (replace it with a link once JSFiddle is supported)                                                              |

`<name>` is the demo's folder name in `demos/`, for example `pulse-loader`. Keep the three platforms in the same order in every row, separated by `·`.
