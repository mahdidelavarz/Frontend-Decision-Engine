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
  projectName: "",
  framework: "",
  language: "typescript",
  routing: "",
  stateManagement: [],
  serverState: "none",
  apiClient: "fetch",
  apiStyle: "rest",
  formLibrary: "react-hook-form",
  validation: "zod",
  styling: ["tailwind"],
  packageManager: "npm",
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
  accentColorHex: "#3b82f6",
  neutralPalette: "zinc",
  fontFamily: "geist",
  radiusScale: "md",
  spacingBase: 4,
  shadowDepth: "subtle",
  iconLibrary: "lucide",
};

export const defaultStandards: StandardsData = {
  errorHandling: "toast",
  retryPolicy: "none",
  logging: "console",
  testingUnit: "vitest",
  testingE2E: "none",
  linting: ["eslint", "prettier"],
  gitStrategy: "conventional-commits",
  authApproach: "none",
  dateLibrary: "native",
  aiCodingTool: "none",
};

export const defaultUXPatterns: UXPatternsData = {
  loadingPattern: "skeleton",
  emptyStateStyle: "icon-text",
  successFeedback: "toast",
  confirmationPattern: "modal",
  errorState: "toast",
  searchDebounce: true,
  paginationStyle: "offset",
  modalVsDrawer: "modal",
  fileUpload: "native",
  breadcrumbs: false,
  filteringPattern: "toolbar",
  mobileNavigation: "hamburger",
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
  teamSize: "small",
  seoImportance: "none",
  projectScale: "production",
  complexity: "moderate",
  longevity: "long",
};

export const defaultCompletedSteps: StepCompletion = {};

export function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
