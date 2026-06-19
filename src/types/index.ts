export const SCHEMA_VERSION = 3;

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
  routing: "react-router" | "tanstack-router" | "none" | "";
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
  /** File naming for React component files (.tsx) — identifier inside is always PascalCase */
  componentNaming: "PascalCase" | "kebab-case";
  /** File naming for utilities, hooks, services, stores (.ts) */
  utilNaming: "camelCase" | "kebab-case";
  /** Use dot-suffix convention: auth.types.ts, auth.service.ts, auth.utils.ts */
  fileSuffixes: boolean;
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
  iconLibrary: "lucide" | "heroicons" | "tabler" | "phosphor" | "material" | "iconify" | "none";
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
  aiCodingTool: "claude-code" | "cursor" | "copilot" | "windsurf" | "cline" | "none";
}

export interface UXPatternsData {
  // Core (always visible)
  loadingPattern: "skeleton" | "spinner" | "progress-bar";
  emptyStateStyle: "illustration" | "icon-text" | "text-only";
  successFeedback: "toast" | "snackbar" | "redirect";
  confirmationPattern: "modal" | "inline" | "none";
  // Frontend conventions (progressive disclosure)
  errorState: "inline" | "full-page" | "toast";
  searchDebounce: boolean;
  paginationStyle: "offset" | "infinite-scroll" | "cursor";
  modalVsDrawer: "modal" | "drawer" | "context";
  fileUpload: "native" | "drag-drop" | "none";
  breadcrumbs: boolean;
  filteringPattern: "sidebar" | "toolbar" | "inline";
  mobileNavigation: "bottom-bar" | "hamburger" | "drawer";
}

export interface TeamAgreementsData {
  noAny: boolean;
  preferInterfaces: boolean;
  namedExports: boolean;
  hooksNaming: boolean;
  componentOrganization: boolean;
  importOrdering: boolean;
  maxFileLines: number | null;
}

export interface SharedComponentsData {
  planned: Array<
    | "Button"
    | "Input"
    | "Select"
    | "Modal"
    | "Table"
    | "DataTable"
    | "Toast"
    | "Tabs"
    | "Card"
    | "Avatar"
    | "Pagination"
  >;
}

export interface ProjectDnaData {
  teamSize: "solo" | "small" | "team";
  seoImportance: "none" | "moderate" | "critical";
  projectScale: "mvp" | "production" | "enterprise";
  complexity: "simple" | "moderate" | "complex";
  longevity: "short" | "long";
}

// ─── Design tokens ───────────────────────────────────────────────────────────

export type { ContrastLevel, DerivedTokens } from "@/tokens/derive";

// ─── Rule Engine ─────────────────────────────────────────────────────────────

export type RuleSeverity = "error" | "warning" | "info" | "recommendation" | "excellent-match";

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
  designSystem: DesignSystemData;
  standards: StandardsData;
  uxPatterns: UXPatternsData;
  teamAgreements: TeamAgreementsData;
  projectDna: ProjectDnaData;
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
  teamAgreements: TeamAgreementsData;
  sharedComponents: SharedComponentsData;
  projectDna: ProjectDnaData;

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
  updateTeamAgreements: (data: Partial<TeamAgreementsData>) => void;
  updateSharedComponents: (data: Partial<SharedComponentsData>) => void;
  updateProjectDna: (data: Partial<ProjectDnaData>) => void;
  resetSession: () => void;
}
