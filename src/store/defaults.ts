import type {
  ProjectData,
  ArchitectureData,
  DesignSystemData,
  StandardsData,
  UXPatternsData,
  TeamAgreementsData,
  SharedComponentsData,
  ProjectDnaData,
  StepCompletion,
} from "@/types";

export const defaultProject: ProjectData = {
  // Main fields — keep recommended defaults
  projectName: "",
  framework: "",
  language: "typescript",
  routing: "",
  stateManagement: ["zustand"],
  serverState: "react-query",
  formLibrary: "react-hook-form",
  validation: "zod",
  styling: ["tailwind"],
  // Advanced (collapsible) — start unselected
  apiClient: "",
  apiStyle: "",
  packageManager: "",
  localization: "",
  rtlSupport: false,
  seoStrategy: "",
  imageHandling: "",
  deploymentTarget: "",
  enforcePackageManager: false,
};

export const defaultArchitecture: ArchitectureData = {
  folderStrategy: "feature-based",
  componentNaming: "PascalCase",
  utilNaming: "camelCase",
  fileSuffixes: false,
  pathAliases: true,
  aliasRoot: "@",
  envStrategy: "dotenv-only",
  barrelFiles: "feature-level-only",
};

export const defaultDesignSystem: DesignSystemData = {
  // Main visual fields — required for the live preview, keep defaults
  accentColorHex: "#3b82f6",
  neutralPalette: "zinc",
  fontFamily: "geist",
  radiusScale: "md",
  spacingBase: 4,
  shadowDepth: "subtle",
  // Optional (collapsible) — start unselected
  iconLibrary: "",
  themeStrategy: "",
};

export const defaultStandards: StandardsData = {
  // Main fields — keep recommended defaults
  errorHandling: "toast",
  testingUnit: "vitest",
  testingE2E: "playwright",
  linting: ["eslint", "prettier"],
  gitStrategy: "conventional-commits",
  aiCodingTool: "none",
  // Advanced + Quality Targets (collapsible) — start unselected
  retryPolicy: "",
  logging: "",
  authApproach: "",
  dateLibrary: "",
  browserSupport: "",
  accessibilityTarget: "",
};

export const defaultUXPatterns: UXPatternsData = {
  // Main (always visible) — keep recommended defaults
  loadingPattern: "skeleton",
  emptyStateStyle: "icon-text",
  successFeedback: "toast",
  confirmationPattern: "modal",
  // Responsive + Frontend Conventions (collapsible) — start unselected
  errorState: "",
  searchDebounce: false,
  paginationStyle: "",
  modalVsDrawer: "",
  fileUpload: "",
  breadcrumbs: false,
  filteringPattern: "",
  mobileNavigation: "",
  layoutStrategy: "",
  breakpointStrategy: "",
};

export const defaultTeamAgreements: TeamAgreementsData = {
  noAny: false,
  preferInterfaces: false,
  namedExports: false,
  hooksNaming: false,
  componentOrganization: false,
  importOrdering: false,
  maxFileLines: null,
};

export const defaultSharedComponents: SharedComponentsData = {
  planned: [],
};

export const defaultProjectDna: ProjectDnaData = {
  // Project DNA (collapsible) — start unselected
  teamSize: "",
  seoImportance: "",
  projectScale: "",
  complexity: "",
  longevity: "",
};

export const defaultCompletedSteps: StepCompletion = {};

export function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
