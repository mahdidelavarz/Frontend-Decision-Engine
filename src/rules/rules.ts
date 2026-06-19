import type { Rule } from "@/types";

export const rules: Rule[] = [
  // ─── Errors ──────────────────────────────────────────────────────────────

  {
    id: "dual-state-managers",
    severity: "error",
    title: "Multiple state managers selected",
    message:
      "Combining state libraries (e.g. Zustand + Redux Toolkit) creates competing data flows, doubles your bundle size, and confuses new contributors. Pick one and commit.",
    affectedSteps: ["project"],
    field: "stateManagement",
    check: ({ project }) =>
      project.stateManagement.filter((s) => s !== "none").length > 1,
  },
  {
    id: "css-in-js-with-tailwind",
    severity: "error",
    title: "CSS-in-JS conflicts with Tailwind",
    message:
      "Styled Components or Emotion alongside Tailwind creates two competing style systems that fight over specificity. Choose one approach: utility-first (Tailwind) or component-scoped (CSS-in-JS).",
    affectedSteps: ["project"],
    field: "styling",
    check: ({ project }) =>
      project.styling.includes("tailwind") &&
      (project.styling.includes("styled-components") ||
        project.styling.includes("emotion")),
  },
  {
    id: "multiple-styling-systems",
    severity: "error",
    title: "Too many styling systems",
    message:
      "Three or more styling solutions in one project creates unmaintainable CSS. Settle on one primary system and use it consistently.",
    affectedSteps: ["project"],
    field: "styling",
    check: ({ project }) => project.styling.length >= 3,
  },

  // ─── Warnings ─────────────────────────────────────────────────────────────

  {
    id: "formik-deprecated",
    severity: "warning",
    title: "Formik is in maintenance mode",
    message:
      "Formik has no active development and its maintainer has stepped back. React Hook Form is actively maintained, smaller, and has better TypeScript support. TanStack Form is the modern alternative.",
    affectedSteps: ["project"],
    field: "formLibrary",
    check: ({ project }) => project.formLibrary === "formik",
  },
  {
    id: "redux-with-next-rsc",
    severity: "warning",
    title: "Redux Toolkit is incompatible with React Server Components",
    message:
      "Redux Toolkit stores state in a module-level singleton that cannot work inside React Server Components. If you're using Next.js with the App Router, consider Zustand or Jotai — both support RSC patterns.",
    affectedSteps: ["project"],
    field: "stateManagement",
    check: ({ project }) =>
      project.stateManagement.includes("redux-toolkit") &&
      project.framework === "next",
  },
  {
    id: "swr-with-graphql",
    severity: "warning",
    title: "SWR is designed for REST, not GraphQL",
    message:
      "SWR works best with REST endpoints. For GraphQL, React Query (TanStack Query) with urql or Apollo Client handles query caching, normalization, and subscriptions correctly.",
    affectedSteps: ["project"],
    field: "serverState",
    check: ({ project }) =>
      project.serverState === "swr" && project.apiStyle === "graphql",
  },
  {
    id: "no-testing",
    severity: "warning",
    title: "No testing configured",
    message:
      "Without any tests, every refactor is a gamble. Vitest is fast to set up and works with Vite and Next.js. Even a handful of unit tests on critical utilities pays dividends immediately.",
    affectedSteps: ["standards"],
    field: "testingUnit",
    check: ({ standards }) =>
      standards.testingUnit === "none" && standards.testingE2E === "none",
  },
  {
    id: "no-linting",
    severity: "warning",
    title: "No linting configured",
    message:
      "Without a linter, code style drifts and common bugs go undetected. ESLint with a base Next.js config takes 10 minutes to add and catches real issues before code review.",
    affectedSteps: ["standards"],
    field: "linting",
    check: ({ standards }) => standards.linting.length === 0,
  },
  {
    id: "trpc-with-swr",
    severity: "warning",
    title: "tRPC includes its own React Query adapter",
    message:
      "tRPC ships a first-party @trpc/react-query adapter. Adding SWR on top creates a redundant caching layer. Use tRPC's built-in React Query integration and remove SWR.",
    affectedSteps: ["project"],
    field: "serverState",
    check: ({ project }) =>
      project.apiStyle === "trpc" && project.serverState === "swr",
  },
  {
    id: "enterprise-no-linting",
    severity: "warning",
    title: "Enterprise project with no linting",
    message:
      "Enterprise-scale projects without enforced linting accumulate style drift and subtle bugs across contributors. Add at minimum ESLint + Prettier to establish a baseline.",
    affectedSteps: ["standards"],
    field: "linting",
    check: ({ standards, projectDna }) =>
      projectDna.projectScale === "enterprise" && standards.linting.length === 0,
  },

  // ─── Info ─────────────────────────────────────────────────────────────────

  {
    id: "e2e-no-unit",
    severity: "info",
    title: "E2E tests without unit tests",
    message:
      "E2E tests give you confidence but run slowly (minutes per suite). Unit tests run in milliseconds and catch logic bugs much earlier in the development loop. Consider adding both.",
    affectedSteps: ["standards"],
    field: "testingUnit",
    check: ({ standards }) =>
      standards.testingE2E !== "none" && standards.testingUnit === "none",
  },
  {
    id: "barrel-files-with-simple",
    severity: "info",
    title: "Barrel files in a flat folder structure",
    message:
      "Barrel files (index.ts re-exports) add value in feature-based structures where they define public API boundaries. In a simple flat folder, they add indirection without benefit and can cause circular import issues.",
    affectedSteps: ["architecture"],
    field: "barrelFiles",
    check: ({ architecture }) =>
      architecture.barrelFiles === "always" &&
      architecture.folderStrategy === "simple",
  },
  {
    id: "no-env-validation-with-next",
    severity: "info",
    title: "No environment variable validation",
    message:
      "Using raw dotenv with Next.js means missing env vars cause silent runtime failures. t3-env validates your env schema at build time and gives TypeScript types — worth the 5-minute setup.",
    affectedSteps: ["architecture"],
    field: "envStrategy",
    check: ({ architecture, project }) =>
      architecture.envStrategy === "dotenv-only" &&
      project.framework === "next",
  },
  {
    id: "no-date-lib-with-ssr",
    severity: "info",
    title: "Native Date API with SSR can cause timezone drift",
    message:
      "The native Date API produces different output on the server (UTC) vs the browser (user timezone), which causes hydration mismatches. dayjs or date-fns handle timezone-aware formatting correctly.",
    affectedSteps: ["standards"],
    check: ({ standards, project }) =>
      standards.dateLibrary === "native" &&
      (project.framework === "next" || project.framework === "remix"),
  },
  {
    id: "jwt-manual",
    severity: "info",
    title: "Manual JWT has security footguns",
    message:
      "Rolling your own JWT auth means handling token storage, refresh rotation, and CSRF correctly — each is a security minefield. NextAuth.js or Clerk handle all of this and are actively audited.",
    affectedSteps: ["standards"],
    check: ({ standards }) => standards.authApproach === "jwt",
  },
  {
    id: "mvp-e2e-overhead",
    severity: "info",
    title: "E2E testing may be premature for an MVP",
    message:
      "E2E tests are valuable long-term but have high setup and maintenance cost. For MVPs, unit tests give faster feedback. Consider adding E2E once core flows stabilize.",
    affectedSteps: ["standards"],
    field: "testingE2E",
    check: ({ standards, projectDna }) =>
      projectDna.projectScale === "mvp" && standards.testingE2E !== "none",
  },
  {
    id: "icon-library-none",
    severity: "info",
    title: "No icon library selected",
    message:
      "Most UIs need icons for actions, states, and navigation. Lucide React is lightweight, tree-shakeable, and pairs well with Tailwind. Consider adding one before you need dozens of custom SVGs.",
    affectedSteps: ["design-system"],
    check: ({ designSystem }) => designSystem.iconLibrary === "none",
  },

  // ─── Recommendations ──────────────────────────────────────────────────────

  {
    id: "routing-unset-vite",
    severity: "recommendation",
    title: "Routing library not selected",
    message:
      "You're using Vite + React without a routing library. For multi-page apps, React Router v7 or TanStack Router are the standard choices. If this is a single-view app, select 'None' to make it explicit.",
    affectedSteps: ["project"],
    field: "routing",
    check: ({ project }) =>
      project.framework === "vite-react" && project.routing === "",
  },
  {
    id: "tanstack-router-modern",
    severity: "recommendation",
    title: "Consider TanStack Router for type-safe routing",
    message:
      "TanStack Router offers fully type-safe routes, built-in search param validation, and a modern file-based routing option. If your app has complex routing or many query params, it's worth the switch from React Router.",
    affectedSteps: ["project"],
    field: "routing",
    check: ({ project }) =>
      project.framework === "vite-react" && project.routing === "react-router",
  },
  {
    id: "vitest-not-configured",
    severity: "recommendation",
    title: "Add Vitest for fast unit testing",
    message:
      "You have no unit tests configured. Vitest is the fastest option for Vite and Next.js projects — it reuses your existing Vite config, runs in milliseconds, and has first-class TypeScript support.",
    affectedSteps: ["standards"],
    field: "testingUnit",
    check: ({ standards, project }) =>
      standards.testingUnit === "none" &&
      (project.framework === "vite-react" || project.framework === "next"),
  },
  {
    id: "solo-redux-complexity",
    severity: "recommendation",
    title: "Redux Toolkit adds overhead for solo projects",
    message:
      "Redux Toolkit works well for large teams with shared state across many features. For a solo project, Zustand gives you the same result with far less boilerplate and no reducer/action ceremony.",
    affectedSteps: ["project"],
    field: "stateManagement",
    check: ({ project, projectDna }) =>
      projectDna.teamSize === "solo" &&
      project.stateManagement.includes("redux-toolkit"),
  },
  {
    id: "iconify-bundle-note",
    severity: "recommendation",
    title: "Iconify: ensure tree-shaking is configured",
    message:
      "Iconify's universal adapter provides access to 200,000+ icons but can bloat your bundle if icons aren't imported individually (e.g. via @iconify/react). Make sure your bundler tree-shakes unused icons.",
    affectedSteps: ["design-system"],
    check: ({ designSystem }) => designSystem.iconLibrary === "iconify",
  },

  // ─── v1.1 Additions ──────────────────────────────────────────────────────

  {
    id: "rtl-logical-css",
    severity: "recommendation",
    title: "RTL enabled — use logical CSS properties",
    message:
      "With RTL support enabled, avoid hardcoded directional styles (left/right, margin-left, padding-right). Use logical CSS properties instead: margin-inline-start, padding-inline-end, inset-inline-start. Tailwind 4 supports these natively.",
    affectedSteps: ["project"],
    check: ({ project }) => project.rtlSupport === true,
  },
  {
    id: "localization-rtl-reminder",
    severity: "info",
    title: "Localization enabled — consider RTL languages",
    message:
      "You have a localization library selected but RTL support is off. If any target locale uses a right-to-left script (Arabic, Hebrew, Persian, Urdu), enable RTL support in Project → Internationalization.",
    affectedSteps: ["project"],
    check: ({ project }) =>
      project.localization !== "none" &&
      project.localization !== "" &&
      project.rtlSupport === false,
  },
  {
    id: "advanced-seo-vite",
    severity: "recommendation",
    title: "Advanced SEO typically requires SSR",
    message:
      "Advanced SEO (sitemap, structured data, dynamic meta) needs server-side rendering to be effective. Vite + React is a client-only SPA — search engines may not index dynamic content. Consider Next.js or Remix if SEO is a priority.",
    affectedSteps: ["project"],
    check: ({ project }) =>
      project.seoStrategy === "advanced" && project.framework === "vite-react",
  },
  {
    id: "legacy-browser-tailwind-v4",
    severity: "info",
    title: "Legacy browser support with Tailwind v4",
    message:
      "Tailwind CSS v4 uses modern CSS features (cascade layers, color-mix(), container queries) that are not supported in IE11 or older browsers. Verify your legacy target list against Tailwind v4's browser baseline.",
    affectedSteps: ["project", "standards"],
    check: ({ project, standards }) =>
      standards.browserSupport === "legacy" && project.styling.includes("tailwind"),
  },
  {
    id: "wcag-aaa-expectation",
    severity: "info",
    title: "WCAG AAA is a very high accessibility bar",
    message:
      "WCAG AAA requires 7:1 color contrast and strict controls for timing, motion, and reading level. It is typically required for government or public-sector projects. Make sure your color palette and component designs can meet this standard.",
    affectedSteps: ["standards", "design-system"],
    check: ({ standards }) => standards.accessibilityTarget === "wcag-aaa",
  },

  // ─── Excellent Matches ────────────────────────────────────────────────────

  {
    id: "zustand-next-excellent",
    severity: "excellent-match",
    title: "Zustand + Next.js is an excellent combination",
    message:
      "Zustand works seamlessly with Next.js App Router and React Server Components. It's lightweight, has zero boilerplate, and its localStorage persist middleware pairs perfectly with client components.",
    affectedSteps: ["project"],
    field: "stateManagement",
    check: ({ project }) =>
      project.framework === "next" &&
      project.stateManagement.includes("zustand") &&
      project.stateManagement.filter((s) => s !== "none").length === 1,
  },
  {
    id: "rhf-zod-excellent",
    severity: "excellent-match",
    title: "React Hook Form + Zod is the gold standard",
    message:
      "This combination gives you performant, uncontrolled form inputs with runtime-validated, TypeScript-inferred schema validation. The @hookform/resolvers package connects them with one line.",
    affectedSteps: ["project"],
    field: "formLibrary",
    check: ({ project }) =>
      project.formLibrary === "react-hook-form" &&
      project.validation === "zod",
  },
  {
    id: "lucide-tailwind-excellent",
    severity: "excellent-match",
    title: "Lucide + Tailwind is a perfect pair",
    message:
      "Lucide React icons accept className, so you can size and color them with standard Tailwind utilities (e.g. size-4 text-zinc-500). No extra CSS needed — fully consistent with your design system.",
    affectedSteps: ["design-system"],
    check: ({ project, designSystem }) =>
      designSystem.iconLibrary === "lucide" &&
      project.styling.includes("tailwind"),
  },
  {
    id: "next-intl-nextjs-excellent",
    severity: "excellent-match",
    title: "next-intl + Next.js App Router is an excellent combination",
    message:
      "next-intl is purpose-built for the Next.js App Router — it supports server components, integrates with Next.js routing, and provides type-safe message access without client-side overhead.",
    affectedSteps: ["project"],
    check: ({ project }) =>
      project.localization === "next-intl" && project.framework === "next",
  },
];
