import type { WizardState } from "@/types";

export function generateGitignore(state: WizardState): string {
  const { project } = state;

  const nextBlock = project.framework === "next" ? `
# Next.js
.next/
out/
` : "";

  const viteBlock =
    project.framework === "vite-react" || project.framework === "astro"
      ? `
# Build output
dist/
` : "";

  const remixBlock = project.framework === "remix" ? `
# Remix
build/
.cache/
` : "";

  const pkgBlock = project.packageManager === "yarn"
    ? `
# Yarn
.yarn/cache
.yarn/unplugged
.yarn/build-state.yml
.yarn/install-state.gz
.pnp.*
`
    : project.packageManager === "pnpm"
    ? `
# pnpm
.pnp.*
`
    : "";

  const sentryBlock = state.standards.logging === "sentry"
    ? `
# Sentry
.sentryclirc
`
    : "";

  return `# Dependencies
node_modules/
${nextBlock}${viteBlock}${remixBlock}
# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Editor
.vscode/
.idea/
*.swp
*.swo
.DS_Store
Thumbs.db

# Testing
coverage/
.nyc_output/
playwright-report/
test-results/
${pkgBlock}${sentryBlock}
# Misc
*.tgz
.cache/
`;
}
