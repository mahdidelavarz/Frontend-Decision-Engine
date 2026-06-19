import type { WizardState } from "@/types";

const frameworkLabel: Record<string, string> = {
  next: "Next.js (App Router)",
  "vite-react": "Vite + React (SPA)",
  remix: "Remix",
  astro: "Astro",
  sveltekit: "SvelteKit",
};

const stateLabel: Record<string, string> = {
  zustand: "Zustand",
  "redux-toolkit": "Redux Toolkit",
  jotai: "Jotai",
  "context-only": "React Context only",
  none: "None",
};

const stylingLabel: Record<string, string> = {
  tailwind: "Tailwind CSS",
  "css-modules": "CSS Modules",
  scss: "SCSS",
  "styled-components": "Styled Components",
  emotion: "Emotion",
};

const iconLabel: Record<string, string> = {
  lucide: "Lucide React",
  heroicons: "Heroicons",
  tabler: "Tabler Icons",
  phosphor: "Phosphor Icons",
  material: "Material Symbols",
  iconify: "Iconify (@iconify/react)",
  none: "None (custom SVGs)",
};

const routingLabel: Record<string, string> = {
  "react-router": "React Router v7",
  "tanstack-router": "TanStack Router",
  none: "None (single view)",
};

const localizationLabel: Record<string, string> = {
  none: "None",
  i18next: "i18next",
  "next-intl": "next-intl",
  paraglide: "Paraglide",
};

const deploymentLabel: Record<string, string> = {
  vercel: "Vercel",
  netlify: "Netlify",
  "cloudflare-pages": "Cloudflare Pages",
  "static-hosting": "Static hosting (S3 / GitHub Pages / CDN)",
  "self-hosted": "Self-hosted (own server / VPS)",
  "not-decided": "Not yet decided",
};

const themeLabel: Record<string, string> = {
  "light-only": "Light only",
  "dark-only": "Dark only",
  "light-dark": "Light + Dark (user toggle)",
  system: "Follow system preference (prefers-color-scheme)",
};

const aiToolFileMap: Record<string, string> = {
  "claude-code": ".claude/CLAUDE.md",
  cursor: ".cursor/rules/project.mdc",
  copilot: ".github/copilot-instructions.md",
  windsurf: ".windsurfrules",
  cline: ".clinerules",
};

/** Join non-empty lines, dropping unselected (omitted) entries. */
function lines(...items: (string | false | null | undefined)[]): string {
  return items.filter(Boolean).join("\n");
}

export function generateGuidelines(state: WizardState): string {
  const { project, architecture, standards, uxPatterns, designSystem, teamAgreements, sharedComponents } = state;
  const generatedAt = new Date().toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  const agreementsList: string[] = [];
  if (teamAgreements.noAny) agreementsList.push("No TypeScript `any` — use `unknown` or explicit types");
  if (teamAgreements.preferInterfaces) agreementsList.push("Prefer `interface` over `type` for object shapes");
  if (teamAgreements.namedExports) agreementsList.push("Named exports only — no default exports");
  if (teamAgreements.hooksNaming) agreementsList.push("All custom hooks must begin with `use`");
  if (teamAgreements.componentOrganization) agreementsList.push("File structure: types → component → export");
  if (teamAgreements.importOrdering) agreementsList.push("Import order: node → external → internal alias → relative");
  if (teamAgreements.maxFileLines) agreementsList.push(`Maximum ${teamAgreements.maxFileLines} lines per file`);

  // ─── UX table rows (only for decided patterns) ──────────────────────────────
  const uxRows = lines(
    uxPatterns.loadingPattern && `| Loading states | ${uxPatterns.loadingPattern === "skeleton" ? "Skeleton placeholders" : uxPatterns.loadingPattern === "spinner" ? "Spinner indicator" : "NProgress-style progress bar"} |`,
    uxPatterns.emptyStateStyle && `| Empty states | ${uxPatterns.emptyStateStyle === "illustration" ? "SVG illustrations" : uxPatterns.emptyStateStyle === "icon-text" ? "Icon + descriptive text" : "Text only"} |`,
    uxPatterns.errorState && `| Error states | ${uxPatterns.errorState} |`,
    uxPatterns.successFeedback && `| Success feedback | ${uxPatterns.successFeedback === "toast" ? "Toast notifications" : uxPatterns.successFeedback === "snackbar" ? "Snackbar with action" : "Redirect to success page"} |`,
    uxPatterns.confirmationPattern && `| Destructive actions | ${uxPatterns.confirmationPattern === "modal" ? "Modal confirmation dialog" : uxPatterns.confirmationPattern === "inline" ? "Inline confirm/cancel" : "No confirmation (immediate)"} |`,
    uxPatterns.paginationStyle && `| Pagination | ${uxPatterns.paginationStyle} |`,
    uxPatterns.filteringPattern && `| Filtering | ${uxPatterns.filteringPattern} |`,
    uxPatterns.mobileNavigation && `| Mobile navigation | ${uxPatterns.mobileNavigation} |`,
    uxPatterns.modalVsDrawer && `| Modal vs drawer | ${uxPatterns.modalVsDrawer} |`,
    uxPatterns.fileUpload && `| File upload | ${uxPatterns.fileUpload} |`,
    uxPatterns.searchDebounce && `| Search | Debounce all search inputs (300ms) |`,
    uxPatterns.breadcrumbs && `| Breadcrumbs | Show on pages deeper than 2 levels |`,
  );

  // ─── Optional standards lines ───────────────────────────────────────────────
  const errorHandlingLines = lines(
    standards.errorHandling && `- **Strategy:** ${standards.errorHandling === "toast" ? "Toast notifications for all errors" : standards.errorHandling === "inline" ? "Inline field-level errors" : "Hybrid — inline for form validation, toast for API errors"}`,
    standards.retryPolicy && `- **Retry policy:** ${standards.retryPolicy === "none" ? "None — fail fast" : standards.retryPolicy === "manual" ? "Manual retry button shown" : "Automatic retry with backoff"}`,
    standards.logging && `- **Logging:** ${standards.logging === "sentry" ? "Sentry for production error tracking" : standards.logging === "console" ? "console.error in development only" : "No logging"}`,
  );

  const responsiveLines = lines(
    uxPatterns.layoutStrategy && `- **Layout strategy:** ${uxPatterns.layoutStrategy === "mobile-first" ? "Mobile first — base styles target small screens; scale up with breakpoints" : "Desktop first — base styles target large screens; scale down with breakpoints"}`,
    uxPatterns.breakpointStrategy && `- **Breakpoints:** ${uxPatterns.breakpointStrategy === "framework-defaults" ? "Framework defaults (Tailwind: sm 640px, md 768px, lg 1024px, xl 1280px)" : "Custom breakpoints — defined per project requirements"}`,
  );

  const hasI18n = (project.localization && project.localization !== "none") || project.rtlSupport;

  return `# Project Guidelines

> Generated by [Frontend Decision Engine](https://github.com/your-org/frontend-decision-engine) on ${generatedAt}.
> This document is the single source of truth for architectural decisions in this project.

---

## Project Overview

${lines(
  `- **Name:** ${project.projectName || "Unnamed Project"}`,
  `- **Framework:** ${frameworkLabel[project.framework] || "Not specified"}`,
  `- **Language:** ${project.language === "typescript" ? "TypeScript (strict mode)" : "JavaScript"}`,
  project.packageManager && `- **Package Manager:** ${project.packageManager}${project.enforcePackageManager ? ` *(enforced — use ${project.packageManager} only)*` : ""}`,
  project.routing && project.routing !== "none" && `- **Routing:** ${routingLabel[project.routing] || project.routing}`,
  project.deploymentTarget && `- **Deployment Target:** ${deploymentLabel[project.deploymentTarget] || project.deploymentTarget}`,
)}

---

## Stack

### State Management

${project.stateManagement.length > 0
  ? project.stateManagement.map((s) => `- ${stateLabel[s] || s}`).join("\n")
  : "- No global client state library (use server state or React Context)"}

### Server State / Data Fetching

${project.serverState === "react-query"
  ? "- TanStack Query (React Query) — cache-first, background refetching"
  : project.serverState === "swr"
  ? "- SWR — lightweight REST-focused data fetching"
  : "- Manual fetch / RSC / no caching library"}
${(project.apiStyle || project.apiClient) ? `
### API

${lines(
  project.apiStyle && `- **Style:** ${project.apiStyle.toUpperCase()}`,
  project.apiClient && `- **HTTP Client:** ${project.apiClient === "fetch" ? "Native Fetch API" : "Axios"}`,
)}` : ""}

### Forms & Validation

- **Forms:** ${project.formLibrary === "react-hook-form" ? "React Hook Form" : project.formLibrary === "tanstack-form" ? "TanStack Form" : project.formLibrary === "formik" ? "Formik" : "None (native HTML forms)"}
- **Validation:** ${project.validation === "zod" ? "Zod" : project.validation === "yup" ? "Yup" : "None"}

### Styling

${project.styling.length > 0
  ? project.styling.map((s) => `- ${stylingLabel[s] || s}`).join("\n")
  : "- No styling library configured"}
${designSystem.iconLibrary ? `
### Icons

- ${iconLabel[designSystem.iconLibrary] || designSystem.iconLibrary}
- **Rule:** Do not mix icon libraries. All icons must come from this source.` : ""}

---

## Architecture

### Folder Structure

- **Strategy:** ${architecture.folderStrategy === "feature-based" ? "Feature-based (group by domain)" : architecture.folderStrategy === "layer-based" ? "Layer-based (group by type)" : "Simple / flat"}
- **Component files (.tsx):** ${architecture.componentNaming} (e.g. ${architecture.componentNaming === "PascalCase" ? "`UserProfile.tsx`" : "`user-profile.tsx`"})
- **Utility / hook / service files (.ts):** ${architecture.utilNaming} (e.g. ${architecture.utilNaming === "camelCase" ? "`useAuth.ts`, `authService.ts`" : "`use-auth.ts`, `auth-service.ts`"})${architecture.fileSuffixes ? "\n- **Dot-suffix convention:** Enabled — `auth.types.ts`, `auth.service.ts`, `auth.utils.ts`, `useAuth.hook.ts`" : ""}
- **Always enforced:** Component functions → PascalCase · TS types/interfaces → PascalCase · Hooks → \`use\` prefix
- **Path aliases:** ${architecture.pathAliases ? `Enabled — import from \`${architecture.aliasRoot}/*\`` : "Disabled — use relative imports"}
- **Barrel files:** ${architecture.barrelFiles === "always" ? "Used everywhere (index.ts in all folders)" : architecture.barrelFiles === "feature-level-only" ? "Feature boundaries only" : "Never — use direct imports"}

### Environment Variables

${architecture.envStrategy === "schema-validated"
  ? "Schema-validated at build time using t3-env. All environment variables are typed."
  : "Standard dotenv files (.env, .env.local). No runtime validation."}

---

## Standards

### Error Handling

${errorHandlingLines || "- Not specified"}

### Testing

- **Unit tests:** ${standards.testingUnit === "none" ? "None" : standards.testingUnit}
- **E2E tests:** ${standards.testingE2E === "none" ? "None" : standards.testingE2E}

### Code Quality

- **Linting / formatting:** ${standards.linting.length > 0 ? standards.linting.join(", ") : "None configured"}
- **Git commits:** ${standards.gitStrategy === "conventional-commits" ? "Conventional Commits (feat:, fix:, chore:, docs:, refactor:)" : "No enforced format"}
${standards.authApproach ? `
### Authentication

${standards.authApproach === "none" ? "No authentication required." : standards.authApproach === "cookie" ? "Cookie-based auth (HttpOnly, Secure cookies)." : "JWT-based auth (manual implementation)."}` : ""}
${standards.dateLibrary ? `
### Dates & Times

${standards.dateLibrary === "native" ? "Native Date API." : standards.dateLibrary === "dayjs" ? "dayjs — Moment-compatible, 2KB." : "date-fns — functional, fully tree-shakeable."}` : ""}

${standards.aiCodingTool !== "none" ? `### AI Coding Tool

Using **${standards.aiCodingTool}** — project instructions are in \`${aiToolFileMap[standards.aiCodingTool] || ""}\`.` : ""}
${uxRows ? `
---

## UX Patterns

| Pattern | Decision |
|---|---|
${uxRows}` : ""}

---

## Design & Accessibility
${designSystem.themeStrategy ? `
### Theme Strategy

${themeLabel[designSystem.themeStrategy] || designSystem.themeStrategy}
${designSystem.themeStrategy === "light-dark" || designSystem.themeStrategy === "system" ? "Implement dark mode overrides using `prefers-color-scheme` media query or a `data-theme` attribute on the root element. Use CSS custom properties from `tokens.css` for all theme-sensitive values." : ""}` : ""}
${standards.accessibilityTarget ? `
### Accessibility Target

${standards.accessibilityTarget === "wcag-aa" ? "**WCAG AA** — All interactive components must meet 4.5:1 contrast ratio (normal text) and 3:1 (large text). Full keyboard navigation required." : standards.accessibilityTarget === "wcag-aaa" ? "**WCAG AAA** — All interactive components must meet 7:1 contrast ratio. Strict requirements for timing, motion, and reading level. Required for government / public-sector compliance." : "**Basic** — Use semantic HTML elements. Ensure all interactive elements are keyboard-accessible."}` : ""}
${responsiveLines ? `
### Responsive Design

${responsiveLines}` : ""}
${(project.seoStrategy || project.imageHandling || standards.browserSupport) ? `
---

## Project Scope
${project.seoStrategy ? `
### SEO Strategy

${project.seoStrategy === "not-needed" ? "No SEO required. Application is internal or auth-gated." : project.seoStrategy === "basic" ? "Basic SEO: include `<title>`, `<meta description>`, and Open Graph tags on all public pages." : "Advanced SEO: implement dynamic metadata, sitemap.xml, robots.txt, structured data (JSON-LD), and server-side rendering for all indexable pages."}` : ""}
${project.imageHandling ? `
### Image Handling

${project.imageHandling === "framework-default" ? "Use the framework's built-in image optimization (e.g. Next.js `<Image>`)." : project.imageHandling === "native-img" ? "Use native `<img>` elements. No abstraction layer." : project.imageHandling === "external-optimization" ? "Use an external image optimization service (Cloudinary, Imgix, or similar)." : "Images are not a significant part of this application — no special strategy required."}` : ""}
${standards.browserSupport ? `
### Browser Support

${standards.browserSupport === "legacy" ? "**Legacy support** — target IE11 and modern browsers. Avoid CSS features without broad support (container queries, :has(), grid subgrid). Verify Tailwind v4 compatibility with your legacy target list." : "**Modern browsers only** — last 2 major versions of Chrome, Firefox, Safari, Edge. IE11 is not supported."}` : ""}` : ""}
${hasI18n ? `
---

## Internationalization

- **Library:** ${project.localization && project.localization !== "none" ? localizationLabel[project.localization] : "None (single language)"}
- **RTL Support:** ${project.rtlSupport ? "Enabled" : "Not required"}
${project.rtlSupport ? `
### RTL Guidelines

- Use logical CSS properties throughout: \`margin-inline-start\` not \`margin-left\`, \`padding-inline-end\` not \`padding-right\`
- Avoid hardcoded directional values (left/right) in CSS or inline styles
- Use \`start\`/\`end\` instead of \`left\`/\`right\` in Tailwind (e.g. \`ms-4\` not \`ml-4\`)
- Test the UI with an RTL locale before shipping` : ""}` : ""}
${project.enforcePackageManager && project.packageManager ? `
---

## Package Manager

Use **${project.packageManager}** exclusively. Do not use other package managers in this project.
- Commit the lock file (\`${project.packageManager === "npm" ? "package-lock.json" : project.packageManager === "pnpm" ? "pnpm-lock.yaml" : project.packageManager === "yarn" ? "yarn.lock" : "bun.lockb"}\`) to version control
- CI/CD pipelines must use ${project.packageManager}` : ""}
${sharedComponents.planned.length > 0 ? `
---

## Shared Component Library

The following components should be built as shared, reusable primitives before implementing features:

${sharedComponents.planned.map((c) => `- [ ] ${c}`).join("\n")}

Do not re-implement these inline in feature code. Import from the shared library.` : ""}
${agreementsList.length > 0 ? `
---

## Team Agreements

${agreementsList.map((a) => `- ${a}`).join("\n")}` : ""}

---

*Generated by Frontend Decision Engine. Do not edit manually — regenerate from your blueprint.*
`;
}
