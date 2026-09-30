# Online demos

Every component demo in this repository, and where you can open it online. Click a button to run and edit the demo in your browser. You don't need to install anything. Grey buttons are platforms we don't support yet.

- **StackBlitz** runs the demo inside your browser. It starts in about 30 seconds and needs no account.
- **CodeSandbox** runs the demo on a cloud machine. The first start after a change can take a minute or two, and CodeSandbox may ask you to sign in to run or edit it.

Both read the code straight from GitHub, so they always show the latest version on `main`.

| Component     | Open online                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Breath Loader | [![Open in StackBlitz](https://img.shields.io/badge/StackBlitz-Open-1389FD?style=for-the-badge&logo=stackblitz&logoColor=white)](https://stackblitz.com/github/md-nabas-pm/zoblocks-examples/tree/main/demos/breath-loader?file=src/App.tsx) [![Open in CodeSandbox](https://img.shields.io/badge/CodeSandbox-Open-151515?style=for-the-badge&logo=codesandbox&logoColor=white)](https://codesandbox.io/p/devbox/github/md-nabas-pm/zoblocks-examples/tree/main/demos/breath-loader) ![JSFiddle coming soon](https://img.shields.io/badge/JSFiddle-Coming_soon-lightgrey?style=for-the-badge&logo=jsfiddle&logoColor=white) |
| Helix Loader  | [![Open in StackBlitz](https://img.shields.io/badge/StackBlitz-Open-1389FD?style=for-the-badge&logo=stackblitz&logoColor=white)](https://stackblitz.com/github/md-nabas-pm/zoblocks-examples/tree/main/demos/helix-loader?file=src/App.tsx) [![Open in CodeSandbox](https://img.shields.io/badge/CodeSandbox-Open-151515?style=for-the-badge&logo=codesandbox&logoColor=white)](https://codesandbox.io/p/devbox/github/md-nabas-pm/zoblocks-examples/tree/main/demos/helix-loader) ![JSFiddle coming soon](https://img.shields.io/badge/JSFiddle-Coming_soon-lightgrey?style=for-the-badge&logo=jsfiddle&logoColor=white)   |
| Date Picker   | [![Open in StackBlitz](https://img.shields.io/badge/StackBlitz-Open-1389FD?style=for-the-badge&logo=stackblitz&logoColor=white)](https://stackblitz.com/github/md-nabas-pm/zoblocks-examples/tree/main/demos/date-picker?file=src/App.tsx) [![Open in CodeSandbox](https://img.shields.io/badge/CodeSandbox-Open-151515?style=for-the-badge&logo=codesandbox&logoColor=white)](https://codesandbox.io/p/devbox/github/md-nabas-pm/zoblocks-examples/tree/main/demos/date-picker) ![JSFiddle coming soon](https://img.shields.io/badge/JSFiddle-Coming_soon-lightgrey?style=for-the-badge&logo=jsfiddle&logoColor=white)     |

## Adding a new demo

**Every demo must be listed here before it can be committed.** A check runs when you commit and stops the commit if the demo is missing.

1. Add one row to the table above, in alphabetical order. `npm run create:demo` prints the exact row for you. It looks like this:

   ```md
   | Pulse Loader | [![Open in StackBlitz](https://img.shields.io/badge/StackBlitz-Open-1389FD?style=for-the-badge&logo=stackblitz&logoColor=white)](https://stackblitz.com/github/md-nabas-pm/zoblocks-examples/tree/main/demos/pulse-loader?file=src/App.tsx) [![Open in CodeSandbox](https://img.shields.io/badge/CodeSandbox-Open-151515?style=for-the-badge&logo=codesandbox&logoColor=white)](https://codesandbox.io/p/devbox/github/md-nabas-pm/zoblocks-examples/tree/main/demos/pulse-loader) ![JSFiddle coming soon](https://img.shields.io/badge/JSFiddle-Coming_soon-lightgrey?style=for-the-badge&logo=jsfiddle&logoColor=white) |
   ```

2. Stage the file together with your demo: `git add DEMOS.md`.

### The buttons

Each button is a small image (a "badge" from [shields.io](https://shields.io)). An **active** button is a badge wrapped in a link. A **disabled** button is a grey badge with no link.

| Platform    | Button                                                                                                                               |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| StackBlitz  | **Required**, active. Links to `https://stackblitz.com/github/md-nabas-pm/zoblocks-examples/tree/main/demos/<name>?file=src/App.tsx` |
| CodeSandbox | **Required**, active. Links to `https://codesandbox.io/p/devbox/github/md-nabas-pm/zoblocks-examples/tree/main/demos/<name>`         |
| JSFiddle    | Disabled (`Coming soon`) until JSFiddle is supported                                                                                 |

| Pulse Loader | [![Open in StackBlitz](https://img.shields.io/badge/StackBlitz-Open-1389FD?style=for-the-badge&logo=stackblitz&logoColor=white)](https://stackblitz.com/github/md-nabas-pm/zoblocks-examples/tree/main/demos/pulse-loader?file=src/App.tsx) ![CodeSandbox coming soon](https://img.shields.io/badge/CodeSandbox-Coming_soon-lightgrey?style=for-the-badge&logo=codesandbox&logoColor=white) ![JSFiddle coming soon](https://img.shields.io/badge/JSFiddle-Coming_soon-lightgrey?style=for-the-badge&logo=jsfiddle&logoColor=white) |

`<name>` is the demo's folder name in `demos/`, for example `pulse-loader`. Keep the buttons in the same order in every row: StackBlitz, CodeSandbox, JSFiddle.

When a platform becomes supported, turn its grey badge into an active one: change `Coming_soon-lightgrey` to `Open-<color>` in the image address, and wrap the image in a link, like the StackBlitz and CodeSandbox buttons.
