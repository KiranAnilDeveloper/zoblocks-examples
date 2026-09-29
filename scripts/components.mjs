// Known ZoBlocks components. Used only to tailor the "next steps" output;
// unknown names still get a demo (with a warning).

// Installed as source with `npx @zoblocks/cli add <name> --yes`.
export const CLI_COMPONENTS = [
  "accordion",
  "allergy-chip",
  "breath-loader",
  "care-team-presence",
  "care-timeline",
  "chart-accordion",
  "chart-command-palette",
  "chart-context-menu",
  "chart-header",
  "clinical-note",
  "clinical-status",
  "copilot",
  "data-grid",
  "date-picker",
  "helix-loader",
  "infusion-loader",
  "provenance-chip",
  "pulse-loader",
  "recent-patient-stack",
  "recorder",
  "result-value",
  "rhythm-loader",
  "risk-indicator",
  "safety-plan",
  "switch",
  "timeline",
  "trend-indicator",
];

// Installed from npm as `@zoblocks/<name>`, with a `styles.css` to import once.
export const NPM_COMPONENTS = {
  signature: ["antd"],
  tabs: [],
};
