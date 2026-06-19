import type { WizardState } from "@/types";

export function generateReadme(state: WizardState): string {
  const { project, architecture, standards, designSystem } = state;
  const name = project.projectName || "project";

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
    vitest: project.packageManager === "npm" ? "npm run test" : `${project.packageManager} test`,
    jest: project.packageManager === "npm" ? "npm run test" : `${project.packageManager} test`,
    none: "",
  };

  return `# ${name}

## Stack

| Layer | Choice |
|---|---|
| Framework | ${project.framework || "Not specified"} |
| Language | ${project.language} |
${project.routing && project.routing !== "none" ? `| Routing | ${project.routing} |\n` : ""}| State | ${project.stateManagement.join(", ") || "none"} |
| Styling | ${project.styling.join(", ") || "none"} |
| Icons | ${state.designSystem.iconLibrary} |
| Forms | ${project.formLibrary} |
| Validation | ${project.validation} |
| Package manager | ${project.packageManager} |

## Getting Started

\`\`\`bash
# Install dependencies
${installCmd[project.packageManager]}

# Start development server
${devCmd[project.packageManager]}

# Build for production
${buildCmd[project.packageManager]}
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
