import type { WizardState } from "@/types";

const frameworkRationale: Record<string, string> = {
  next: "Next.js was chosen for its hybrid rendering capabilities (SSR, SSG, RSC), built-in routing, and tight Vercel integration. It's the safest long-term bet for React applications that may need SEO or server-side logic.",
  "vite-react": "Vite + React was chosen for a pure client-side SPA with minimal overhead. It offers the fastest possible development experience (HMR in milliseconds) and is ideal when all data fetching happens client-side.",
  remix: "Remix was chosen for its progressive enhancement philosophy, nested routing, and excellent form handling. It treats the browser as a first-class client and builds on web standards.",
  astro: "Astro was chosen for its content-first, island architecture approach. It ships zero JavaScript by default and hydrates only interactive components, making it ideal for marketing sites and documentation.",
  sveltekit: "SvelteKit was chosen as an alternative to React for its compiler-based approach that eliminates the virtual DOM. It typically produces smaller bundles and has excellent built-in routing.",
};

const stateRationale: Record<string, string> = {
  zustand: "Zustand was chosen for its minimal API surface (~1KB gzipped), zero boilerplate, and excellent TypeScript support. It handles both simple and complex global state without Redux's ceremony.",
  "redux-toolkit": "Redux Toolkit was chosen for its standardized patterns, powerful DevTools integration, and strong ecosystem. It's worth the additional complexity for large teams or complex state machines.",
  jotai: "Jotai was chosen for its atomic state model that composes naturally and is compatible with React Server Components. It avoids the global singleton issue that affects Redux and Zustand in RSC.",
  "context-only": "React Context was chosen to avoid adding a state library. This is a good call when global state is minimal and updates are infrequent — Context re-renders all consumers on every change, so it's unsuitable for frequently updated state.",
  none: "No global state library was chosen. All data fetching is handled server-side (RSC or server functions), making client-side state largely unnecessary.",
};

const serverStateRationale: Record<string, string> = {
  "react-query": "TanStack Query (React Query) was chosen for its robust caching layer, background refetching, optimistic updates, and mutation support. It's the most full-featured option and works with REST, GraphQL, and custom fetchers.",
  swr: "SWR was chosen for its minimal API and REST-first design. It provides stale-while-revalidate caching with a smaller footprint than React Query.",
  none: "No server state library was chosen. Data fetching is handled with RSC, server actions, or manual fetch — appropriate when server-side rendering handles most data needs.",
};

const formRationale: Record<string, string> = {
  "react-hook-form": "React Hook Form was chosen for its performance-first approach (uncontrolled inputs, minimal re-renders), small size (~9KB), and excellent integration with Zod via the @hookform/resolvers package.",
  "tanstack-form": "TanStack Form was chosen for its type-safe, headless approach and first-class TypeScript support. It's the modern successor and handles complex form scenarios elegantly.",
  formik: "Formik was chosen for its familiarity and large adoption base. Note: Formik is in maintenance mode with no active development.",
  none: "No form library was chosen. Native HTML form handling is appropriate for simple forms with few fields.",
};

const stylingRationale: Record<string, string> = {
  tailwind: "Tailwind CSS was chosen for its utility-first approach that keeps styling co-located with markup, eliminating dead CSS and making design constraints explicit. Tailwind 4 with its CSS-based configuration is significantly improved.",
  "css-modules": "CSS Modules were chosen for scoped, locally-namespaced CSS with zero runtime overhead. They work naturally with any build tool and avoid global namespace pollution.",
  scss: "SCSS was chosen for its nesting, variables, and mixins — familiar for teams coming from a Bootstrap/SCSS background.",
  "styled-components": "Styled Components was chosen for its component-scoped CSS-in-JS approach with dynamic styling capabilities. Note: it adds a runtime cost and is incompatible with RSC.",
  emotion: "Emotion was chosen for its flexible CSS-in-JS with both string and object syntax. Note: it adds runtime overhead and is incompatible with RSC.",
};

const testingRationale: Record<string, string> = {
  vitest: "Vitest was chosen for its native Vite integration, Jest-compatible API, and dramatically faster execution. It supports TypeScript and ESM natively without configuration.",
  jest: "Jest was chosen for its massive ecosystem, stable API, and broad Next.js support via `@jest/globals` and SWC transforms.",
  none: "No unit testing framework was selected. This is a risk — consider adding Vitest at minimum for critical business logic.",
  playwright: "Playwright was chosen for its multi-browser support, reliable selectors, and excellent TypeScript integration. It handles modern web APIs (dialogs, file uploads, network mocking) better than Cypress.",
  cypress: "Cypress was chosen for its excellent developer experience, real-time test runner UI, and large community. Best for teams new to E2E testing.",
};

const dnaRationale = (state: WizardState): string => {
  const { projectDna } = state;
  const lines: string[] = [];
  if (projectDna.teamSize === "solo") lines.push("Solo developer — decisions favour simplicity and low ceremony over scalability patterns.");
  if (projectDna.teamSize === "team") lines.push("Full team — decisions favour consistency, tooling enforcement, and clear conventions over developer speed.");
  if (projectDna.projectScale === "mvp") lines.push("MVP scale — we prioritise shipping speed; some tooling (E2E tests, schema validation) can be added later.");
  if (projectDna.projectScale === "enterprise") lines.push("Enterprise scale — we invest upfront in linting, testing, and strict conventions to reduce long-term maintenance cost.");
  if (projectDna.seoImportance === "critical") lines.push("SEO is critical — framework choice and rendering strategy were weighted towards server-side rendering.");
  if (projectDna.longevity === "short") lines.push("Short-lived project — we kept the dependency count low to minimise long-term maintenance burden.");
  if (projectDna.longevity === "long") lines.push("Long-term project — we invested in stronger foundations (type safety, testing, linting) that pay off over a multi-year horizon.");
  return lines.join("\n");
};

export function generateWhy(state: WizardState): string {
  const { project, standards, projectDna } = state;
  const sections: string[] = [];

  sections.push(`# Why — ${project.projectName || "This Project"}

This document explains the rationale behind each architectural decision. It exists so future team members (and your future self) understand not just *what* was chosen, but *why*.

---
`);

  // Project DNA rationale
  const dnaLines = dnaRationale(state);
  if (dnaLines) {
    const contextSummary = [
      projectDna.projectScale,
      projectDna.teamSize,
      projectDna.complexity && `${projectDna.complexity} complexity`,
      projectDna.longevity && (projectDna.longevity === "long" ? "long-term" : "short-lived"),
    ].filter(Boolean).join(" · ");
    sections.push(`## Project Context

${contextSummary}

${dnaLines}
`);
  }

  if (project.framework) {
    sections.push(`## Framework: ${project.framework}

${frameworkRationale[project.framework] || "No rationale available."}
`);
  }

  if (project.stateManagement.length > 0) {
    const statePicks = project.stateManagement.filter((s) => s !== "none");
    if (statePicks.length > 0) {
      sections.push(`## State Management: ${statePicks.join(", ")}

${statePicks.map((s) => stateRationale[s] || "").filter(Boolean).join("\n\n")}
`);
    }
  }

  sections.push(`## Server State: ${project.serverState}

${serverStateRationale[project.serverState] || "No rationale available."}
`);

  if (project.formLibrary !== "none") {
    sections.push(`## Forms: ${project.formLibrary}

${formRationale[project.formLibrary] || "No rationale available."}
`);
  }

  if (project.styling.length > 0) {
    sections.push(`## Styling: ${project.styling.join(", ")}

${project.styling.map((s) => stylingRationale[s] || "").filter(Boolean).join("\n\n")}
`);
  }

  if (standards.testingUnit !== "none") {
    sections.push(`## Unit Testing: ${standards.testingUnit}

${testingRationale[standards.testingUnit] || "No rationale available."}
`);
  }

  if (standards.testingE2E !== "none") {
    sections.push(`## E2E Testing: ${standards.testingE2E}

${testingRationale[standards.testingE2E] || "No rationale available."}
`);
  }

  // Theme strategy
  const themeRationale: Record<string, string> = {
    "light-only": "A single light theme keeps the design system simple and avoids the engineering cost of maintaining two token sets. Appropriate when the user base is known and dark mode is not expected.",
    "dark-only": "A dark-only theme suits developer tools, creative applications, and contexts where users prefer low-brightness interfaces.",
    "light-dark": "Shipping both light and dark themes provides the best user experience but requires maintaining two sets of semantic color tokens and testing both states.",
    system: "Following the system preference (prefers-color-scheme) is the most user-respectful approach — the UI adapts automatically without requiring a manual toggle.",
  };
  if (state.designSystem.themeStrategy) {
    sections.push(`## Theme Strategy: ${state.designSystem.themeStrategy}

${themeRationale[state.designSystem.themeStrategy] || ""}
`);
  }

  // Accessibility
  const a11yRationale: Record<string, string> = {
    basic: "Basic accessibility ensures the project is usable by the broadest audience without the overhead of full WCAG auditing. Semantic HTML and keyboard navigation are the minimum bar.",
    "wcag-aa": "WCAG AA is the international standard for most commercial and public-facing applications. It requires 4.5:1 contrast ratio for normal text and full keyboard navigation.",
    "wcag-aaa": "WCAG AAA is the highest accessibility standard, required for government, healthcare, and public-sector applications. It sets stricter contrast (7:1), timing, and motion requirements.",
  };
  if (state.standards.accessibilityTarget) {
    sections.push(`## Accessibility Target: ${state.standards.accessibilityTarget}

${a11yRationale[state.standards.accessibilityTarget] || ""}
`);
  }

  // Deployment
  const deployRationale: Record<string, string> = {
    vercel: "Vercel was chosen for its zero-configuration deployments, preview environments per pull request, and native Next.js optimizations. It's the best choice for Next.js and React projects.",
    netlify: "Netlify was chosen for its straightforward CI/CD pipeline, built-in form handling, and excellent support for static sites and JAMstack architectures.",
    "cloudflare-pages": "Cloudflare Pages was chosen for its global CDN performance, generous free tier, and tight integration with Cloudflare Workers for edge functions.",
    "static-hosting": "Static hosting (S3, GitHub Pages, or a CDN) was chosen for maximum simplicity and portability. The built output is a directory of files with no server dependency.",
    "self-hosted": "Self-hosting was chosen for full infrastructure control, data residency requirements, or existing server resources.",
    "not-decided": "Deployment target has not been decided yet. Choosing early avoids late-stage build or routing surprises.",
  };
  if (state.project.deploymentTarget && state.project.deploymentTarget !== "not-decided") {
    sections.push(`## Deployment Target: ${state.project.deploymentTarget}

${deployRationale[state.project.deploymentTarget] || ""}
`);
  }

  // Localization
  const localeRationale: Record<string, string> = {
    "i18next": "i18next is the most widely adopted localization library in the JavaScript ecosystem, with extensive plugin support, pluralisation, and interpolation. Framework-agnostic.",
    "next-intl": "next-intl was built specifically for Next.js App Router — it supports server components, integrates with Next.js routing, and provides type-safe messages without client-side overhead.",
    paraglide: "Paraglide offers compile-time i18n with full type safety — messages are typed, unused messages are tree-shaken, and there is no runtime overhead for string lookup.",
  };
  if (state.project.localization && state.project.localization !== "none") {
    sections.push(`## Localization: ${state.project.localization}

${localeRationale[state.project.localization] || ""}
`);
  }

  sections.push(`---

*Generated by FrontForge. Decisions can be revisited at any time by re-running your blueprint.*`);

  return sections.join("\n");
}
