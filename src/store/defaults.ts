import type {
  ProjectData,
  ArchitectureData,
  DesignSystemData,
  StandardsData,
  UXPatternsData,
  StepCompletion,
} from "@/types";

export const defaultProject: ProjectData = {
  projectName: "",
  framework: "",
  language: "typescript",
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
  namingConvention: "PascalCase",
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
};

export const defaultUXPatterns: UXPatternsData = {
  loadingPattern: "skeleton",
  emptyStateStyle: "icon-text",
  successFeedback: "toast",
  confirmationPattern: "modal",
};

export const defaultCompletedSteps: StepCompletion = {};

export function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
