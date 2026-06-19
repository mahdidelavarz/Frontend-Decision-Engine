import type { WizardState } from "@/types";

/** Join non-empty lines, dropping unselected (omitted) entries. */
function lines(...items: (string | false | null | undefined)[]): string {
  return items.filter(Boolean).join("\n");
}

export function generateReadme(state: WizardState): string {
  const { project, architecture, standards, designSystem } = state;
  const name = project.projectName || "project";
  // Commands need a concrete package manager; default to npm when unselected.
  const pm = project.packageManager || "npm";

  const installCmd: Record<string, string> = {
    npm: "npm install",
    pnpm: "pnpm install",
    yarn: "yarn",
    bun: "bun install",
  };

  const devCmd: Record<string, string> = {
    npm: "npm run dev",
    pnpm: "pnpm dev",
    yarn: "yarn dev",
    bun: "bun dev",
  };

  const buildCmd: Record<string, string> = {
    npm: "npm run build",
    pnpm: "pnpm build",
    yarn: "yarn build",
    bun: "bun run build",
  };

  const testCmd: Record<string, string> = {
    vitest: pm === "npm" ? "npm run test" : `${pm} test`,
    jest: pm === "npm" ? "npm run test" : `${pm} test`,
    none: "",
  };

  const themeLabel: Record<string, string> = {
    "light-only": "Light only",
    "dark-only": "Dark only",
    "light-dark": "Light + Dark",
    system: "Follow system (prefers-color-scheme)",
  };

  const deployLabel: Record<string, string> = {
    vercel: "Vercel",
    netlify: "Netlify",
    "cloudflare-pages": "Cloudflare Pages",
    "static-hosting": "Static hosting",
    "self-hosted": "Self-hosted",
    "not-decided": "TBD",
  };

  const accessLabel: Record<string, string> = {
    basic: "Basic",
    "wcag-aa": "WCAG AA",
    "wcag-aaa": "WCAG AAA",
  };

  return `# ${name}

## Stack

| Layer | Choice |
|---|---|
${lines(
  `| Framework | ${project.framework || "Not specified"} |`,
  `| Language | ${project.language} |`,
  project.routing && project.routing !== "none" && `| Routing | ${project.routing} |`,
  `| State | ${project.stateManagement.join(", ") || "none"} |`,
  `| Styling | ${project.styling.join(", ") || "none"} |`,
  designSystem.iconLibrary && `| Icons | ${designSystem.iconLibrary} |`,
  `| Forms | ${project.formLibrary} |`,
  `| Validation | ${project.validation} |`,
  project.packageManager && `| Package manager | ${project.packageManager} |`,
  designSystem.themeStrategy && `| Theme | ${themeLabel[designSystem.themeStrategy] || designSystem.themeStrategy} |`,
  standards.accessibilityTarget && `| Accessibility | ${accessLabel[standards.accessibilityTarget] || standards.accessibilityTarget} |`,
  project.deploymentTarget && `| Deployment | ${deployLabel[project.deploymentTarget] || project.deploymentTarget} |`,
  project.localization && project.localization !== "none" && `| Localization | ${project.localization} |`,
  standards.browserSupport && `| Browser support | ${standards.browserSupport === "legacy" ? "Legacy (IE11+)" : "Modern browsers"} |`,
)}

## Getting Started

${project.enforcePackageManager && project.packageManager ? `> **Package manager:** This project uses **${project.packageManager}** exclusively. Do not use npm/yarn/bun/pnpm interchangeably.\n\n` : ""}\`\`\`bash
# Install dependencies
${installCmd[pm]}

# Start development server
${devCmd[pm]}

# Build for production
${buildCmd[pm]}
${standards.testingUnit !== "none" ? `
# Run tests
${testCmd[standards.testingUnit]}` : ""}
\`\`\`

## Project Structure

\`\`\`
src/
${architecture.folderStrategy === "feature-based" ? `├── features/       # Domain-specific modules
│   ├── auth/
│   └── dashboard/
├── components/     # Shared UI components
├── hooks/          # Shared custom hooks
└── lib/            # Utilities and constants` : architecture.folderStrategy === "layer-based" ? `├── components/     # All UI components
├── hooks/          # Custom React hooks
├── services/       # API and business logic
└── utils/          # Utility functions` : `├── components/
├── hooks/
└── utils/`}
\`\`\`

## Path Aliases

${architecture.pathAliases
  ? `Configured: \`${architecture.aliasRoot}/*\` → \`src/*\`

\`\`\`typescript
// Instead of this:
import { Button } from "../../components/ui/Button";

// Use this:
import { Button } from "${architecture.aliasRoot}/components/ui/Button";
\`\`\``
  : "No path aliases — use relative imports."}

## Code Standards

- **Commits:** ${standards.gitStrategy === "conventional-commits" ? "Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`)" : "No enforced format"}
- **Linting:** ${standards.linting.length > 0 ? standards.linting.join(", ") : "None configured"}
- **Testing:** ${[standards.testingUnit !== "none" ? standards.testingUnit : null, standards.testingE2E !== "none" ? standards.testingE2E : null].filter(Boolean).join(" + ") || "None"}

---

> Architecture decisions documented in \`PROJECT_GUIDELINES.md\`.
> AI context available in \`AI_CONTEXT.md\`.
`;
}
