export const SCHEMA_VERSION = 1;

export type WizardStep =
  | "home"
  | "project"
  | "architecture"
  | "design-system"
  | "standards"
  | "ux-patterns"
  | "preview"
  | "export";

export const STEP_ORDER: WizardStep[] = [
  "home",
  "project",
  "architecture",
  "design-system",
  "standards",
  "ux-patterns",
  "preview",
  "export",
];

export const STEP_LABELS: Record<WizardStep, string> = {
  home: "Home",
  project: "Project",
  architecture: "Architecture",
  "design-system": "Design System",
  standards: "Standards",
  "ux-patterns": "UX Patterns",
  preview: "Preview",
  export: "Export",
};

// ─── Step Data ──────────────────────────────────────────────────────────────

export interface ProjectData {
  projectName: string;
  framework: "next" | "vite-react" | "remix" | "astro" | "sveltekit" | "";
  language: "typescript" | "javascript";
  stateManagement: Array<
    "zustand" | "redux-toolkit" | "jotai" | "context-only" | "none"
  >;
  serverState: "react-query" | "swr" | "none";
  apiClient: "axios" | "fetch";
  apiStyle: "rest" | "graphql" | "trpc";
  formLibrary: "react-hook-form" | "formik" | "tanstack-form" | "none";
  validation: "zod" | "yup" | "none";
  styling: Array<
    "tailwind" | "css-modules" | "styled-components" | "emotion" | "scss"
  >;
  packageManager: "npm" | "pnpm" | "yarn" | "bun";
}

export interface ArchitectureData {
  folderStrategy: "feature-based" | "layer-based" | "simple";
  namingConvention: "PascalCase" | "kebab-case" | "camelCase";
  pathAliases: boolean;
  aliasRoot: "@" | "~" | "src" | "none";
  envStrategy: "dotenv-only" | "schema-validated";
  barrelFiles: "always" | "never" | "feature-level-only";
}

export interface DesignSystemData {
  accentColorHex: string;
  neutralPalette: "zinc" | "slate" | "gray" | "stone";
  fontFamily: "geist" | "inter" | "roboto" | "system";
  radiusScale: "none" | "sm" | "md" | "lg" | "full";
  spacingBase: 4 | 8 | 12 | 16;
  shadowDepth: "flat" | "subtle" | "elevated";
}

export interface StandardsData {
  errorHandling: "inline" | "toast" | "hybrid";
  retryPolicy: "none" | "manual" | "automatic";
  logging: "console" | "sentry" | "none";
  testingUnit: "vitest" | "jest" | "none";
  testingE2E: "playwright" | "cypress" | "none";
  linting: Array<"eslint" | "biome" | "prettier" | "husky">;
  gitStrategy: "conventional-commits" | "none";
  authApproach: "jwt" | "cookie" | "none";
  dateLibrary: "native" | "dayjs" | "date-fns";
}

export interface UXPatternsData {
  loadingPattern: "skeleton" | "spinner" | "progress-bar";
  emptyStateStyle: "illustration" | "icon-text" | "text-only";
  successFeedback: "toast" | "snackbar" | "redirect";
  confirmationPattern: "modal" | "inline" | "none";
}

// ─── Design tokens ───────────────────────────────────────────────────────────

export type { ContrastLevel, DerivedTokens } from "@/tokens/derive";

// ─── Rule Engine ─────────────────────────────────────────────────────────────

export type RuleSeverity = "error" | "warning" | "info";

export interface Violation {
  ruleId: string;
  severity: RuleSeverity;
  title: string;
  message: string;
  affectedSteps: WizardStep[];
}

export type CheckState = {
  project: ProjectData;
  architecture: ArchitectureData;
  standards: StandardsData;
};

export interface Rule {
  id: string;
  severity: RuleSeverity;
  title: string;
  message: string;
  affectedSteps: WizardStep[];
  check: (state: CheckState) => boolean;
}

// ─── Store ───────────────────────────────────────────────────────────────────

export type StepCompletion = Partial<Record<WizardStep, boolean>>;

export interface WizardState {
  // Meta
  schemaVersion: number;
  sessionId: string;
  createdAt: string;
  updatedAt: string;

  // Navigation
  currentStep: WizardStep;
  completedSteps: StepCompletion;

  // Step data
  project: ProjectData;
  architecture: ArchitectureData;
  designSystem: DesignSystemData;
  standards: StandardsData;
  uxPatterns: UXPatternsData;

  // Computed
  violations: Violation[];

  // Actions
  setStep: (step: WizardStep) => void;
  markStepComplete: (step: WizardStep) => void;
  updateProject: (data: Partial<ProjectData>) => void;
  updateArchitecture: (data: Partial<ArchitectureData>) => void;
  updateDesignSystem: (data: Partial<DesignSystemData>) => void;
  updateStandards: (data: Partial<StandardsData>) => void;
  updateUXPatterns: (data: Partial<UXPatternsData>) => void;
  resetSession: () => void;
}
