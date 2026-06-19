import type { WizardState } from "@/types";

export function generateAIContext(state: WizardState): string {
  const { project, architecture, standards, uxPatterns, designSystem, teamAgreements, sharedComponents, projectDna } = state;

  const doNotUse: string[] = [];
  if (!project.stateManagement.includes("redux-toolkit")) doNotUse.push("Redux / Redux Toolkit");
  if (project.formLibrary !== "formik") doNotUse.push("Formik");
  if (!project.styling.includes("emotion") && !project.styling.includes("styled-components")) {
    doNotUse.push("Styled Components or Emotion (CSS-in-JS)");
  }
  if (project.validation !== "yup") doNotUse.push("Yup");
  if (project.validation !== "zod") doNotUse.push("Zod");
  if (standards.dateLibrary !== "dayjs") doNotUse.push("dayjs");
  if (standards.dateLibrary !== "date-fns") doNotUse.push("date-fns");
  if (standards.testingUnit !== "jest") doNotUse.push("Jest");
  if (standards.testingUnit !== "vitest") doNotUse.push("Vitest");

  const agreements: string[] = [];
  if (teamAgreements.noAny) agreements.push("NEVER use TypeScript `any` — use `unknown` or proper types");
  if (teamAgreements.preferInterfaces) agreements.push("ALWAYS use `interface` for object type definitions, not `type`");
  if (teamAgreements.namedExports) agreements.push("ALWAYS use named exports — no default exports");
  if (teamAgreements.hooksNaming) agreements.push("ALL custom hooks MUST start with `use`");
  if (teamAgreements.componentOrganization) agreements.push("File structure order MUST be: type definitions → component function → exports");
  if (teamAgreements.importOrdering) agreements.push("Import order: node built-ins → external → internal alias → relative");
  if (teamAgreements.maxFileLines) agreements.push(`Files MUST NOT exceed ${teamAgreements.maxFileLines} lines`);

  const stateStr = project.stateManagement.filter((s) => s !== "none").join(", ") || "None";

  return `# AI Context — ${project.projectName || "Project"}

This file defines all technical decisions for this project.
When generating code, follow these decisions strictly. Do not introduce unlisted dependencies.

---

## Project Profile

- **Type:** ${projectDna.projectScale} · ${projectDna.teamSize === "solo" ? "Solo developer" : projectDna.teamSize === "small" ? "Small team" : "Full team"}
- **Longevity:** ${projectDna.longevity === "long" ? "Long-term maintained" : "Short-lived"} · **Complexity:** ${projectDna.complexity}
- **SEO:** ${projectDna.seoImportance}

## Stack

- **Framework:** ${project.framework || "Not specified"}
- **Language:** ${project.language === "typescript" ? "TypeScript — always use proper types, avoid `any`" : "JavaScript"}
- **Package Manager:** ${project.packageManager}
${project.routing && project.routing !== "none" ? `- **Routing:** ${project.routing}` : ""}

## State

- **Client state:** ${stateStr}
- **Server state:** ${project.serverState}
- **API style:** ${project.apiStyle}
- **HTTP client:** ${project.apiClient}

## Forms

- **Library:** ${project.formLibrary}
- **Validation:** ${project.validation}

## Styling & Icons

- **Styling:** ${project.styling[0] || "none"}${project.styling.length > 1 ? ` (+ ${project.styling.slice(1).join(", ")})` : ""}
- **Icons:** ${designSystem.iconLibrary} — use ONLY this icon library, never mix

## Architecture Rules

- Folder strategy: ${architecture.folderStrategy}
- Component file naming: ${architecture.componentNaming} (e.g. ${architecture.componentNaming === "PascalCase" ? "UserProfile.tsx" : "user-profile.tsx"}) — component function is always PascalCase
- Util / hook / service naming: ${architecture.utilNaming} (e.g. ${architecture.utilNaming === "camelCase" ? "useAuth.ts · authService.ts" : "use-auth.ts · auth-service.ts"})
${architecture.fileSuffixes ? "- Dot-suffix convention enabled: auth.types.ts, auth.service.ts, auth.utils.ts" : ""}
- TypeScript type/interface names are always PascalCase (language convention)
- Custom hooks always start with \`use\` (React rule)
- Path alias: ${architecture.pathAliases ? `${architecture.aliasRoot}/* → src/*` : "relative imports only"}
- Barrel files: ${architecture.barrelFiles}
- Env vars: ${architecture.envStrategy}

## Standards

- Error handling: ${standards.errorHandling}
- Retry policy: ${standards.retryPolicy}
- Unit tests: ${standards.testingUnit}
- E2E tests: ${standards.testingE2E}
- Linting: ${standards.linting.join(", ") || "none"}
- Git: ${standards.gitStrategy}
- Auth: ${standards.authApproach}
- Dates: ${standards.dateLibrary}

## UX Patterns

- Loading: ${uxPatterns.loadingPattern}
- Empty states: ${uxPatterns.emptyStateStyle}
- Error state: ${uxPatterns.errorState}
- Success feedback: ${uxPatterns.successFeedback}
- Destructive confirmation: ${uxPatterns.confirmationPattern}
- Pagination: ${uxPatterns.paginationStyle}
- Filtering: ${uxPatterns.filteringPattern}
- Mobile nav: ${uxPatterns.mobileNavigation}
${uxPatterns.searchDebounce ? "- Search inputs MUST be debounced (300ms)" : ""}
${uxPatterns.breadcrumbs ? "- Show breadcrumbs on pages deeper than 2 levels" : ""}

## Design Tokens

- Accent color: ${designSystem.accentColorHex}
- Neutral: ${designSystem.neutralPalette}
- Font: ${designSystem.fontFamily}
- Radius scale: ${designSystem.radiusScale}
- Spacing base: ${designSystem.spacingBase}px
- Shadows: ${designSystem.shadowDepth}

${sharedComponents.planned.length > 0 ? `## Shared Components

These components exist in the shared library — DO NOT reimplement them inline:

${sharedComponents.planned.map((c) => `- ${c}`).join("\n")}

` : ""}---

## Do NOT Use

The following were explicitly not chosen for this project:

${doNotUse.length > 0 ? doNotUse.map((d) => `- ${d}`).join("\n") : "- (no explicit exclusions)"}

---

${agreements.length > 0 ? `## Team Agreements (ALWAYS enforce)

${agreements.map((a) => `- ${a}`).join("\n")}

---

` : ""}## Code Generation Rules

1. Component files use **${architecture.componentNaming}** naming (e.g. ${architecture.componentNaming === "PascalCase" ? "UserProfile.tsx" : "user-profile.tsx"}); component functions are always PascalCase
2. Import paths must use ${architecture.pathAliases ? `the \`${architecture.aliasRoot}\` alias` : "relative imports"}
3. Validate all user input with **${project.validation !== "none" ? project.validation : "manual validation"}**
4. All API errors should be handled with **${standards.errorHandling}** pattern
5. Loading states use **${uxPatterns.loadingPattern}** pattern
6. ${standards.gitStrategy === "conventional-commits" ? "Commit messages must follow Conventional Commits format (feat:, fix:, chore:)" : "No enforced commit format"}
7. Icons MUST come from **${designSystem.iconLibrary}** only

*This file was generated by Frontend Decision Engine. Paste it into your AI assistant's context window at the start of every coding session.*
`;
}
