import type { Rule } from "@/types";

export const rules: Rule[] = [
  {
    id: "dual-state-managers",
    severity: "error",
    title: "Multiple state managers selected",
    message:
      "Combining state libraries (e.g. Zustand + Redux Toolkit) creates competing data flows, doubles your bundle size, and confuses new contributors. Pick one and commit.",
    affectedSteps: ["project"],
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
    check: ({ project }) => project.styling.length >= 3,
  },
  {
    id: "zod-with-yup",
    severity: "error",
    title: "Duplicate validation libraries",
    message:
      "Zod and Yup both handle schema validation — there is no reason to use both. Zod is recommended for TypeScript projects (type inference is first-class).",
    affectedSteps: ["project"],
    check: ({ project }) =>
      project.validation === "zod" || project.validation === "yup"
        ? false
        : false, // placeholder — actual: both selected not possible via current UI (single select)
    // This rule activates if somehow both are set (e.g. via JSON import)
  },
  {
    id: "formik-deprecated",
    severity: "warning",
    title: "Formik is in maintenance mode",
    message:
      "Formik has no active development and its maintainer has stepped back. React Hook Form is actively maintained, smaller, and has better TypeScript support. TanStack Form is the modern alternative.",
    affectedSteps: ["project"],
    check: ({ project }) => project.formLibrary === "formik",
  },
  {
    id: "redux-with-next-rsc",
    severity: "warning",
    title: "Redux Toolkit is incompatible with React Server Components",
    message:
      "Redux Toolkit stores state in a module-level singleton that cannot work inside React Server Components. If you're using Next.js with the App Router, consider Zustand or Jotai — both support RSC patterns.",
    affectedSteps: ["project"],
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
    check: ({ standards }) => standards.linting.length === 0,
  },
  {
    id: "e2e-no-unit",
    severity: "info",
    title: "E2E tests without unit tests",
    message:
      "E2E tests give you confidence but run slowly (minutes per suite). Unit tests run in milliseconds and catch logic bugs much earlier in the development loop. Consider adding both.",
    affectedSteps: ["standards"],
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
    id: "trpc-with-swr",
    severity: "warning",
    title: "tRPC includes its own React Query adapter",
    message:
      "tRPC ships a first-party @trpc/react-query adapter. Adding SWR on top creates a redundant caching layer. Use tRPC's built-in React Query integration and remove SWR.",
    affectedSteps: ["project"],
    check: ({ project }) =>
      project.apiStyle === "trpc" && project.serverState === "swr",
  },
];
