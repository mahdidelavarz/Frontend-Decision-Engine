import type { WizardState } from "@/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pkgInstall(pm: string, packages: string[], dev = false): string {
  const flag = dev ? (pm === "npm" ? "--save-dev" : "-D") : "";
  const cmd = pm === "yarn" ? "yarn add" : `${pm} install`;
  return `${cmd} ${flag} ${packages.join(" ")}`.trim();
}

const ICON_PACKAGES: Record<string, string> = {
  lucide: "lucide-react",
  heroicons: "@heroicons/react",
  tabler: "@tabler/icons-react",
  phosphor: "@phosphor-icons/react",
  iconify: "@iconify/react",
};

function collectDeps(state: WizardState): { prod: string[]; dev: string[] } {
  const { project, architecture, standards, designSystem } = state;
  const prod: string[] = [];
  const dev: string[] = [];

  // Icon library (omitted when unselected, "none", or "material" which uses a font/CDN)
  if (designSystem.iconLibrary && ICON_PACKAGES[designSystem.iconLibrary]) {
    prod.push(ICON_PACKAGES[designSystem.iconLibrary]);
  }

  project.stateManagement.forEach((s) => {
    if (s === "zustand") prod.push("zustand");
    if (s === "redux-toolkit") prod.push("@reduxjs/toolkit", "react-redux");
    if (s === "jotai") prod.push("jotai");
  });

  if (project.serverState === "react-query") prod.push("@tanstack/react-query", "@tanstack/react-query-devtools");
  if (project.serverState === "swr") prod.push("swr");

  if (project.apiClient === "axios") prod.push("axios");
  if (project.apiStyle === "graphql") prod.push("graphql", "@apollo/client");

  if (project.formLibrary === "react-hook-form") prod.push("react-hook-form");
  if (project.formLibrary === "formik") prod.push("formik");
  if (project.formLibrary === "tanstack-form") prod.push("@tanstack/react-form");

  if (project.validation === "zod") prod.push("zod");
  if (project.validation === "yup") prod.push("yup");

  if (project.styling.includes("styled-components")) prod.push("styled-components");
  if (project.styling.includes("emotion")) prod.push("@emotion/react", "@emotion/styled");

  if (architecture.envStrategy === "schema-validated") {
    prod.push(project.framework === "next" ? "@t3-oss/env-nextjs" : "@t3-oss/env-core");
  }

  if (standards.logging === "sentry") {
    prod.push(project.framework === "next" ? "@sentry/nextjs" : "@sentry/react");
  }

  if (standards.dateLibrary === "dayjs") prod.push("dayjs");
  if (standards.dateLibrary === "date-fns") prod.push("date-fns");

  // Localization
  if (project.localization === "i18next") prod.push("i18next", "react-i18next");
  if (project.localization === "next-intl") prod.push("next-intl");
  if (project.localization === "paraglide") prod.push("@inlang/paraglide-js");

  // Dev deps
  if (standards.testingUnit === "vitest") {
    dev.push("vitest", "@testing-library/react", "@testing-library/jest-dom", "jsdom");
  }
  if (standards.testingUnit === "jest") {
    dev.push("jest", "@types/jest", "@testing-library/react", "@testing-library/jest-dom", "jest-environment-jsdom", "ts-jest");
  }
  if (standards.testingE2E === "playwright") dev.push("@playwright/test");
  if (standards.testingE2E === "cypress") dev.push("cypress");

  if (standards.linting.includes("biome")) dev.push("@biomejs/biome");
  if (standards.linting.includes("prettier")) dev.push("prettier");
  if (standards.linting.includes("husky")) dev.push("husky", "lint-staged");

  return { prod, dev };
}

function frameworkCreateCmd(state: WizardState): string {
  const { project } = state;
  const name = project.projectName || "my-app";
  switch (project.framework) {
    case "next":
      return `npx create-next-app@latest ${name} --typescript --tailwind --app --src-dir --import-alias "@/*"`;
    case "vite-react":
      return `npm create vite@latest ${name} -- --template react-ts`;
    case "remix":
      return `npx create-remix@latest ${name}`;
    case "astro":
      return `npm create astro@latest ${name}`;
    case "sveltekit":
      return `npm create svelte@latest ${name}`;
    default:
      return `npx create-next-app@latest ${name}`;
  }
}

function buildFolderPaths(state: WizardState): string[] {
  const { architecture } = state;
  const base = "src";
  switch (architecture.folderStrategy) {
    case "feature-based":
      return [
        `${base}/features/auth/components`,
        `${base}/features/auth/hooks`,
        `${base}/features/auth/services`,
        `${base}/features/dashboard/components`,
        `${base}/features/dashboard/hooks`,
        `${base}/shared/ui`,
        `${base}/shared/hooks`,
        `${base}/shared/utils`,
      ];
    case "layer-based":
      return [
        `${base}/components`,
        `${base}/hooks`,
        `${base}/services`,
        `${base}/store`,
        `${base}/types`,
        `${base}/utils`,
      ];
    case "simple":
    default:
      return [`${base}/components`, `${base}/pages`, `${base}/utils`];
  }
}

// ─── Main generator ───────────────────────────────────────────────────────────

export function generateApplyBlueprint(state: WizardState): string {
  const { project, architecture, standards, designSystem, sharedComponents } = state;
  const pm = project.packageManager || "npm";
  const name = project.projectName || "my-app";
  const deps = collectDeps(state);
  const createCmd = frameworkCreateCmd(state);
  const folders = buildFolderPaths(state);
  const alias = architecture.pathAliases && architecture.aliasRoot !== "none"
    ? architecture.aliasRoot
    : null;

  const prodInstall = deps.prod.length ? pkgInstall(pm, deps.prod) : null;
  const devInstall = deps.dev.length ? pkgInstall(pm, deps.dev, true) : null;

  const hasConventional = standards.gitStrategy === "conventional-commits";
  const hasHusky = standards.linting.includes("husky");
  const hasBiome = standards.linting.includes("biome");
  const hasPrettier = standards.linting.includes("prettier");

  const aiToolFileMap: Record<string, string> = {
    "claude-code": ".claude/CLAUDE.md",
    cursor: ".cursor/rules/project.mdc",
    copilot: ".github/copilot-instructions.md",
    windsurf: ".windsurfrules",
    cline: ".clinerules",
  };
  const aiToolPath = aiToolFileMap[standards.aiCodingTool] || null;

  return `#!/usr/bin/env node
// apply-blueprint.js
// Generated by Frontend Decision Engine
// Run: node apply-blueprint.js
// Dry run: node apply-blueprint.js --dry-run

"use strict";

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const readline = require("readline");

const DRY_RUN = process.argv.includes("--dry-run");
const PROJECT = ${JSON.stringify(name)};

// ─── Logging ─────────────────────────────────────────────────────────────────

function log(msg) { console.log("  " + msg); }
function ok(msg)  { console.log("  \\x1b[32m✓\\x1b[0m " + msg); }
function info(msg){ console.log("  \\x1b[36m→\\x1b[0m " + msg); }
function skip(msg){ console.log("  \\x1b[33m~\\x1b[0m " + msg + " (dry-run)"); }
function run(cmd) {
  if (DRY_RUN) { skip(cmd); return; }
  info(cmd);
  execSync(cmd, { stdio: "inherit" });
}

// ─── File helpers (additive only) ────────────────────────────────────────────

function writeIfMissing(filePath, content) {
  if (fs.existsSync(filePath)) {
    log("exists, skipping: " + filePath);
    return;
  }
  if (DRY_RUN) { skip("create " + filePath); return; }
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
  ok("created: " + filePath);
}

function appendIfMissing(filePath, content, marker) {
  if (!fs.existsSync(filePath)) return;
  const existing = fs.readFileSync(filePath, "utf8");
  if (existing.includes(marker)) { log("already set, skipping: " + marker); return; }
  if (DRY_RUN) { skip("append to " + filePath); return; }
  fs.appendFileSync(filePath, "\\n" + content, "utf8");
  ok("updated: " + filePath);
}

function mkdir(dir) {
  if (DRY_RUN) { skip("mkdir " + dir); return; }
  fs.mkdirSync(dir, { recursive: true });
  ok("created: " + dir);
}

// Move a generated file from the run directory INTO the project, then delete the
// original so no loose blueprint files are left behind next to apply-blueprint.js.
function moveInto(srcName, destPath) {
  const src = path.join(process.cwd(), srcName);
  if (!fs.existsSync(src)) return;
  if (DRY_RUN) { skip("move " + srcName + " → " + path.relative(process.cwd(), destPath)); return; }
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  if (!fs.existsSync(destPath)) fs.copyFileSync(src, destPath);
  fs.unlinkSync(src);
  ok("moved: " + path.relative(process.cwd(), destPath));
}

// ─── Summary ─────────────────────────────────────────────────────────────────

function printSummary() {
  console.log("\\n\\x1b[1m  Blueprint Summary\\x1b[0m");
  console.log("  " + "─".repeat(40));
  console.log("  Project:      " + ${JSON.stringify(name)});
  console.log("  Framework:    " + ${JSON.stringify(project.framework || "next")});
  console.log("  Language:     " + ${JSON.stringify(project.language)});
  console.log("  State:        " + ${JSON.stringify(project.stateManagement.join(", ") || "none")});
  console.log("  Server state: " + ${JSON.stringify(project.serverState)});
  console.log("  Styling:      " + ${JSON.stringify(project.styling.join(", ") || "none")});
  console.log("  Pkg manager:  " + ${JSON.stringify(pm)});
  console.log("  Unit tests:   " + ${JSON.stringify(standards.testingUnit)});
  console.log("  E2E tests:    " + ${JSON.stringify(standards.testingE2E)});
  if (DRY_RUN) console.log("\\n  \\x1b[33m[DRY-RUN MODE] No files will be created.\\x1b[0m");
  console.log("  " + "─".repeat(40) + "\\n");
}

// ─── Prompt ──────────────────────────────────────────────────────────────────

function prompt(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, (answer) => { rl.close(); resolve(answer.trim()); });
  });
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  printSummary();

  if (!DRY_RUN) {
    const answer = await prompt("  Proceed? [Y/n] ");
    if (answer && answer.toLowerCase() !== "y") {
      console.log("  Aborted.\\n");
      process.exit(0);
    }
  }

  console.log("\\n  \\x1b[1mStep 1 — Scaffold project\\x1b[0m");
  run(${JSON.stringify(createCmd)});

  const root = path.join(process.cwd(), PROJECT);

  console.log("\\n  \\x1b[1mStep 2 — Install dependencies\\x1b[0m");
${prodInstall ? `  run("cd " + ${JSON.stringify(JSON.stringify(name))} + " && " + ${JSON.stringify(prodInstall)});` : "  log(\"no production dependencies to install\");"}
${devInstall ? `  run("cd " + ${JSON.stringify(JSON.stringify(name))} + " && " + ${JSON.stringify(devInstall)});` : "  log(\"no dev dependencies to install\");"}

  console.log("\\n  \\x1b[1mStep 3 — Create folder structure\\x1b[0m");
${folders.map((f) => `  mkdir(path.join(root, ${JSON.stringify(f)}));`).join("\n")}

  console.log("\\n  \\x1b[1mStep 4 — Create placeholder files\\x1b[0m");
  const srcDir = path.join(root, "src");

  writeIfMissing(
    path.join(srcDir, "lib", "api.ts"),
    \`// API client placeholder\\nimport axios from "axios";\\n\\nexport const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });\\n\`
  );
  writeIfMissing(
    path.join(srcDir, "lib", "constants.ts"),
    \`// Application constants\\nexport const APP_NAME = ${JSON.stringify(name)};\\n\`
  );
${project.serverState === "react-query" ? `  writeIfMissing(
    path.join(srcDir, "lib", "queryClient.ts"),
    \`import { QueryClient } from "@tanstack/react-query";\\n\\nexport const queryClient = new QueryClient({\\n  defaultOptions: { queries: { staleTime: 5 * 60 * 1000 } },\\n});\\n\`
  );` : ""}
${project.stateManagement.includes("zustand") ? `  writeIfMissing(
    path.join(srcDir, "store", "index.ts"),
    \`import { create } from "zustand";\\n\\ninterface AppState {\\n  // add your state here\\n}\\n\\nexport const useStore = create<AppState>(() => ({\\n  // initial state\\n}));\\n\`
  );` : ""}
${sharedComponents.planned.length > 0 ? `
  // Scaffold planned shared components (from UX Patterns → Shared Components)
${sharedComponents.planned.map((c) => `  writeIfMissing(
    path.join(srcDir, "components", "ui", ${JSON.stringify(c + ".tsx")}),
    \`// ${c} — shared component (planned in your blueprint)\\nexport function ${c}() {\\n  return null; // TODO: implement\\n}\\n\`
  );`).join("\n")}` : ""}

  console.log("\\n  \\x1b[1mStep 5 — Move blueprint files into the project\\x1b[0m");
  const docsDir = path.join(root, "docs");
  mkdir(docsDir);
  // Documentation → <project>/docs/
  ["PROJECT_GUIDELINES.md", "AI_CONTEXT.md", "WHY.md"].forEach((f) => {
    moveInto(f, path.join(docsDir, f));
  });
  // Project root files (README replaces the scaffold's, .gitignore merges conceptually)
  moveInto("README.md", path.join(root, "BLUEPRINT_README.md"));
  moveInto("project-config.json", path.join(docsDir, "project-config.json"));
  moveInto("tokens.tailwind.json", path.join(docsDir, "tokens.tailwind.json"));
  // Keep the scaffold's own .gitignore; preserve ours as a reference in docs/
  moveInto(".gitignore", path.join(docsDir, "gitignore.blueprint.txt"));
${aiToolPath ? `  moveInto(${JSON.stringify(aiToolPath)}, path.join(root, ${JSON.stringify(aiToolPath)}));` : ""}

  console.log("\\n  \\x1b[1mStep 6 — Inject design tokens into the project CSS\\x1b[0m");
  const tokensSource = path.join(process.cwd(), "tokens.css");
  const tokensDest   = path.join(srcDir, "tokens.css");
  let tokensCss = "";
  if (fs.existsSync(tokensSource)) {
    tokensCss = fs.readFileSync(tokensSource, "utf8");
    moveInto("tokens.css", tokensDest);
  }
  // Apply tokens DIRECTLY into the project's globals.css (guarded, idempotent).
  const globalsPath = path.join(srcDir, "app", "globals.css");
  if (tokensCss) {
    const marker = "Frontend Decision Engine — design tokens";
    const block = "\\n/* ── " + marker + " ── */\\n" + tokensCss + "\\n";
    if (fs.existsSync(globalsPath)) {
      appendIfMissing(globalsPath, block, marker);
    } else {
      writeIfMissing(globalsPath, block);
    }
  }

  console.log("\\n  \\x1b[1mStep 7 — Apply configuration\\x1b[0m");
${alias ? `  // tsconfig.json path aliases
  const tsconfigPath = path.join(root, "tsconfig.json");
  if (fs.existsSync(tsconfigPath)) {
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf8"));
    if (!tsconfig.compilerOptions) tsconfig.compilerOptions = {};
    if (!tsconfig.compilerOptions.paths) {
      tsconfig.compilerOptions.baseUrl = ".";
      tsconfig.compilerOptions.paths = { ${JSON.stringify(alias + "/*")}: ["./src/*"] };
      if (DRY_RUN) { skip("update tsconfig.json paths"); }
      else { fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2), "utf8"); ok("updated tsconfig.json paths"); }
    } else {
      log("tsconfig paths already set, skipping");
    }
  }` : "  log(\"path aliases not enabled, skipping tsconfig update\");"}

${hasBiome ? `  writeIfMissing(
    path.join(root, "biome.json"),
    JSON.stringify({ \\$schema: "https://biomejs.dev/schemas/1.5.0/schema.json", organizeImports: { enabled: true }, linter: { enabled: true, rules: { recommended: true } } }, null, 2)
  );` : ""}
${hasPrettier ? `  writeIfMissing(
    path.join(root, ".prettierrc"),
    JSON.stringify({ semi: true, singleQuote: false, tabWidth: 2, trailingComma: "es5" }, null, 2)
  );` : ""}
${hasHusky ? `  run("cd " + ${JSON.stringify(name)} + " && npx husky init");` : ""}
${hasConventional && hasHusky ? `  writeIfMissing(
    path.join(root, ".husky", "commit-msg"),
    \`#!/bin/sh\\nnpx --no -- commitlint --edit $1\\n\`
  );` : ""}

  console.log("\\n  \\x1b[1mStep 8 — Deployment & notes\\x1b[0m");
${project.deploymentTarget === "vercel" ? `  info("Deployment: Vercel — connect your repo at vercel.com or run \`npx vercel\` in the project root");` : ""}
${project.deploymentTarget === "netlify" ? `  info("Deployment: Netlify — connect your repo at app.netlify.com or run \`npx netlify-cli init\`");` : ""}
${project.deploymentTarget === "cloudflare-pages" ? `  info("Deployment: Cloudflare Pages — connect via Cloudflare dashboard or \`npx wrangler pages deploy out/\`");` : ""}
${project.deploymentTarget === "static-hosting" ? `  info("Deployment: Static hosting — upload the \`out/\` directory to your CDN or host after building");` : ""}
${project.deploymentTarget === "self-hosted" ? `  info("Deployment: Self-hosted — build the project and serve with Node.js, Nginx, or a reverse proxy");` : ""}
${project.deploymentTarget === "not-decided" ? `  info("Deployment target not yet decided — choose a host and update your CI/CD pipeline accordingly");` : ""}
${project.enforcePackageManager && project.packageManager ? `  info("Package manager enforced: use ${pm} only — update CI/CD scripts to match");` : ""}
${project.localization && project.localization !== "none" ? `  info("Localization: ${project.localization} installed — set up your locale files before adding user-facing strings");` : ""}
${designSystem.iconLibrary && ICON_PACKAGES[designSystem.iconLibrary] ? `  info("Icons: ${ICON_PACKAGES[designSystem.iconLibrary]} installed — import icons individually for best tree-shaking");` : ""}
${designSystem.iconLibrary === "material" ? `  info("Icons: Material Symbols — add the Google Fonts <link> or @fontsource package; no npm icon package needed");` : ""}
${standards.accessibilityTarget && standards.accessibilityTarget !== "basic" ? `  info("Accessibility target: ${standards.accessibilityTarget === "wcag-aa" ? "WCAG AA" : "WCAG AAA"} — budget time for audits (axe, Lighthouse) before launch");` : ""}
${standards.browserSupport === "legacy" ? `  info("Browser support: Legacy — verify your CSS/build targets (browserslist) cover older browsers; Tailwind v4 uses modern CSS");` : ""}
${designSystem.themeStrategy === "light-dark" || designSystem.themeStrategy === "system" ? `  info("Theme: ${designSystem.themeStrategy} — wire a theme toggle / prefers-color-scheme overrides using the injected CSS tokens");` : ""}
${sharedComponents.planned.length > 0 ? `  info("Scaffolded ${sharedComponents.planned.length} shared component stub(s) in src/components/ui — implement before building features");` : ""}

  console.log("\\n  \\x1b[32m\\x1b[1m✓ Blueprint applied!\\x1b[0m");
  console.log("  cd " + PROJECT);
  console.log("  ${pm === "npm" ? "npm run dev" : pm === "yarn" ? "yarn dev" : pm + " dev"}\\n");
}

main().catch((e) => { console.error("\\n  Error:", e.message); process.exit(1); });
`;
}
