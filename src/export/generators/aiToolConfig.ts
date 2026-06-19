import type { WizardState } from "@/types";

/** Join non-empty lines, dropping unselected (omitted) entries. */
function lines(...items: (string | false | null | undefined)[]): string {
  return items.filter(Boolean).join("\n");
}

// Shared content block used by all tool formats
function buildProjectRules(state: WizardState): string {
  const { project, architecture, standards, uxPatterns, designSystem, teamAgreements, sharedComponents, projectDna } = state;

  const stateStr = project.stateManagement.filter((s) => s !== "none").join(", ") || "none";

  const agreements: string[] = [];
  if (teamAgreements.noAny) agreements.push("Never use TypeScript `any` — use `unknown` or proper types");
  if (teamAgreements.preferInterfaces) agreements.push("Prefer `interface` over `type` for object shapes");
  if (teamAgreements.namedExports) agreements.push("Named exports only — no default exports");
  if (teamAgreements.hooksNaming) agreements.push("All custom hooks must start with `use`");
  if (teamAgreements.componentOrganization) agreements.push("File order: types → component function → export");
  if (teamAgreements.importOrdering) agreements.push("Import order: node built-ins → external packages → internal aliases → relative");
  if (teamAgreements.maxFileLines) agreements.push(`Maximum ${teamAgreements.maxFileLines} lines per file`);

  const doNotUse: string[] = [];
  if (!project.stateManagement.includes("redux-toolkit")) doNotUse.push("Redux Toolkit");
  if (project.formLibrary !== "formik") doNotUse.push("Formik");
  if (!project.styling.includes("emotion") && !project.styling.includes("styled-components")) {
    doNotUse.push("CSS-in-JS (Styled Components / Emotion)");
  }
  if (project.validation !== "yup") doNotUse.push("Yup");
  if (project.validation !== "zod") doNotUse.push("Zod");
  if (standards.testingUnit !== "jest") doNotUse.push("Jest");
  if (standards.testingUnit !== "vitest") doNotUse.push("Vitest");

  return `# ${project.projectName || "Project"} — AI Coding Instructions

${lines(
  (projectDna.projectScale || projectDna.teamSize || projectDna.complexity || projectDna.longevity || projectDna.seoImportance) && "## Project Context\n",
  (projectDna.projectScale || projectDna.teamSize) && `- **Type:** ${[projectDna.projectScale, projectDna.teamSize === "solo" ? "Solo developer" : projectDna.teamSize === "small" ? "Small team (2–5)" : projectDna.teamSize === "team" ? "Full team (6+)" : ""].filter(Boolean).join(" · ")}`,
  (projectDna.complexity || projectDna.longevity) && `- **Complexity:** ${projectDna.complexity || "—"}${projectDna.longevity ? ` · **Longevity:** ${projectDna.longevity === "long" ? "Long-term maintained" : "Short-lived"}` : ""}`,
  projectDna.seoImportance && `- **SEO:** ${projectDna.seoImportance}`,
)}

## Tech Stack

| Concern | Choice |
|---|---|
${lines(
  `| Framework | ${project.framework || "Not set"} |`,
  `| Language | ${project.language} |`,
  `| Routing | ${project.routing || "built-in"} |`,
  `| Client state | ${stateStr || "none"} |`,
  `| Server state | ${project.serverState} |`,
  project.apiStyle && `| API style | ${project.apiStyle} |`,
  project.apiClient && `| HTTP client | ${project.apiClient} |`,
  `| Forms | ${project.formLibrary} |`,
  `| Validation | ${project.validation} |`,
  `| Styling | ${project.styling.join(", ") || "none"} |`,
  designSystem.iconLibrary && `| Icons | ${designSystem.iconLibrary} |`,
  `| Unit tests | ${standards.testingUnit} |`,
  `| E2E tests | ${standards.testingE2E} |`,
  `| Linting | ${standards.linting.join(", ") || "none"} |`,
  standards.authApproach && `| Auth | ${standards.authApproach} |`,
  standards.dateLibrary && `| Dates | ${standards.dateLibrary} |`,
)}

## Architecture

- **Folder strategy:** ${architecture.folderStrategy}
- **Component files:** ${architecture.componentNaming} · **Util/hook/service files:** ${architecture.utilNaming}${architecture.fileSuffixes ? " · dot-suffixes enabled (auth.types.ts, auth.service.ts)" : ""}
- **Path alias:** ${architecture.pathAliases ? `${architecture.aliasRoot}/* → src/*` : "relative imports only"}
- **Barrel files:** ${architecture.barrelFiles}
- **Env vars:** ${architecture.envStrategy}

## UX Conventions

${lines(
  `- Loading state: ${uxPatterns.loadingPattern}`,
  `- Empty states: ${uxPatterns.emptyStateStyle}`,
  uxPatterns.errorState && `- Error state: ${uxPatterns.errorState}`,
  `- Success feedback: ${uxPatterns.successFeedback}`,
  `- Confirmation: ${uxPatterns.confirmationPattern}`,
  uxPatterns.paginationStyle && `- Pagination: ${uxPatterns.paginationStyle}`,
  uxPatterns.mobileNavigation && `- Mobile nav: ${uxPatterns.mobileNavigation}`,
  uxPatterns.searchDebounce && "- Always debounce search inputs (300ms)",
  uxPatterns.breadcrumbs && "- Show breadcrumbs on pages deeper than 2 levels",
)}

## Design Tokens

- Accent: ${designSystem.accentColorHex} | Neutral: ${designSystem.neutralPalette}
- Font: ${designSystem.fontFamily} | Radius: ${designSystem.radiusScale} | Spacing base: ${designSystem.spacingBase}px

${sharedComponents.planned.length > 0 ? `## Shared Components

The following UI components are in a shared library — do NOT recreate them inline:
${sharedComponents.planned.map((c) => `- ${c}`).join("\n")}

` : ""}${agreements.length > 0 ? `## Team Agreements (ALWAYS follow)

${agreements.map((a) => `- ${a}`).join("\n")}

` : ""}## DO NOT Use

${doNotUse.length > 0 ? doNotUse.map((d) => `- ${d}`).join("\n") : "- (no explicit exclusions)"}

## Code Generation Rules

1. Component files use **${architecture.componentNaming}** naming; component functions are always PascalCase
2. Use ${architecture.pathAliases ? `the \`${architecture.aliasRoot}\` alias` : "relative imports"} for imports
3. Handle all API errors with **${standards.errorHandling}** pattern
4. Show loading states with **${uxPatterns.loadingPattern}** pattern
5. Validate user input with **${project.validation !== "none" ? project.validation : "manual validation"}**
${standards.gitStrategy === "conventional-commits" ? "6. Commit messages must follow Conventional Commits (feat:, fix:, chore:, docs:)" : ""}`;
}

// ─── Claude Code ─────────────────────────────────────────────────────────────

export function generateClaudeConfig(state: WizardState): { path: string; content: string } | null {
  if (state.standards.aiCodingTool !== "claude-code") return null;
  return {
    path: ".claude/CLAUDE.md",
    content: buildProjectRules(state) + "\n\n*Generated by Frontend Decision Engine*\n",
  };
}

// ─── Cursor ───────────────────────────────────────────────────────────────────

export function generateCursorConfig(state: WizardState): { path: string; content: string } | null {
  if (state.standards.aiCodingTool !== "cursor") return null;
  const body = buildProjectRules(state);
  return {
    path: ".cursor/rules/project.mdc",
    content: `---
description: Project architecture rules for ${state.project.projectName || "this project"}
globs: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"]
alwaysApply: true
---

${body}

*Generated by Frontend Decision Engine*
`,
  };
}

// ─── GitHub Copilot ───────────────────────────────────────────────────────────

export function generateCopilotConfig(state: WizardState): { path: string; content: string } | null {
  if (state.standards.aiCodingTool !== "copilot") return null;
  return {
    path: ".github/copilot-instructions.md",
    content: buildProjectRules(state) + "\n\n*Generated by Frontend Decision Engine*\n",
  };
}

// ─── Windsurf ─────────────────────────────────────────────────────────────────

export function generateWindsurfConfig(state: WizardState): { path: string; content: string } | null {
  if (state.standards.aiCodingTool !== "windsurf") return null;
  return {
    path: ".windsurfrules",
    content: buildProjectRules(state) + "\n\n*Generated by Frontend Decision Engine*\n",
  };
}

// ─── Cline ────────────────────────────────────────────────────────────────────

export function generateClineConfig(state: WizardState): { path: string; content: string } | null {
  if (state.standards.aiCodingTool !== "cline") return null;
  return {
    path: ".clinerules",
    content: buildProjectRules(state) + "\n\n*Generated by Frontend Decision Engine*\n",
  };
}

// ─── Dispatcher ───────────────────────────────────────────────────────────────

export function generateAiToolConfig(state: WizardState): { path: string; content: string } | null {
  return (
    generateClaudeConfig(state) ??
    generateCursorConfig(state) ??
    generateCopilotConfig(state) ??
    generateWindsurfConfig(state) ??
    generateClineConfig(state)
  );
}
