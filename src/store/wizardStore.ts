import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { evaluate } from "@/rules/evaluate";
import { SCHEMA_VERSION } from "@/types";
import type { WizardState, WizardStep, ArchitectureData } from "@/types";
import {
  defaultProject,
  defaultArchitecture,
  defaultDesignSystem,
  defaultStandards,
  defaultUXPatterns,
  defaultTeamAgreements,
  defaultSharedComponents,
  defaultProjectDna,
  generateSessionId,
} from "./defaults";

const now = () => new Date().toISOString();

const initialState = {
  schemaVersion: SCHEMA_VERSION,
  sessionId: generateSessionId(),
  createdAt: now(),
  updatedAt: now(),
  currentStep: "home" as WizardStep,
  completedSteps: {},
  project: defaultProject,
  architecture: defaultArchitecture,
  designSystem: defaultDesignSystem,
  standards: defaultStandards,
  uxPatterns: defaultUXPatterns,
  teamAgreements: defaultTeamAgreements,
  sharedComponents: defaultSharedComponents,
  projectDna: defaultProjectDna,
  violations: [],
};

export const useWizardStore = create<WizardState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setStep: (step) =>
        set({ currentStep: step, updatedAt: now() }),

      markStepComplete: (step) =>
        set((s) => ({
          completedSteps: { ...s.completedSteps, [step]: true },
          updatedAt: now(),
        })),

      // Single atomic set — avoids two re-renders per keystroke
      updateProject: (data) =>
        set((s) => {
          const project = { ...s.project, ...data };
          return { project, updatedAt: now(), violations: evaluate({ ...s, project }) };
        }),

      updateArchitecture: (data) =>
        set((s) => {
          const architecture = { ...s.architecture, ...data };
          return { architecture, updatedAt: now(), violations: evaluate({ ...s, architecture }) };
        }),

      updateDesignSystem: (data) =>
        set((s) => {
          const designSystem = { ...s.designSystem, ...data };
          return { designSystem, updatedAt: now(), violations: evaluate({ ...s, designSystem }) };
        }),

      updateStandards: (data) =>
        set((s) => {
          const standards = { ...s.standards, ...data };
          return { standards, updatedAt: now(), violations: evaluate({ ...s, standards }) };
        }),

      updateUXPatterns: (data) =>
        set((s) => ({
          uxPatterns: { ...s.uxPatterns, ...data },
          updatedAt: now(),
        })),

      updateTeamAgreements: (data) =>
        set((s) => ({
          teamAgreements: { ...s.teamAgreements, ...data },
          updatedAt: now(),
        })),

      updateSharedComponents: (data) =>
        set((s) => ({
          sharedComponents: { ...s.sharedComponents, ...data },
          updatedAt: now(),
        })),

      updateProjectDna: (data) =>
        set((s) => {
          const projectDna = { ...s.projectDna, ...data };
          return { projectDna, updatedAt: now(), violations: evaluate({ ...s, projectDna }) };
        }),

      resetSession: () =>
        set({
          ...initialState,
          sessionId: generateSessionId(),
          createdAt: now(),
          updatedAt: now(),
          violations: [],
        }),
    }),
    {
      name: "fde-session-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        schemaVersion: state.schemaVersion,
        sessionId: state.sessionId,
        createdAt: state.createdAt,
        updatedAt: state.updatedAt,
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
        project: state.project,
        architecture: state.architecture,
        designSystem: state.designSystem,
        standards: state.standards,
        uxPatterns: state.uxPatterns,
        teamAgreements: state.teamAgreements,
        sharedComponents: state.sharedComponents,
        projectDna: state.projectDna,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        // v1 → v2: fill in fields added in schema version 2
        if (state.schemaVersion < 2) {
          state.project = { ...defaultProject, ...state.project };
          state.designSystem = { ...defaultDesignSystem, ...state.designSystem };
          state.standards = { ...defaultStandards, ...state.standards };
          state.uxPatterns = { ...defaultUXPatterns, ...state.uxPatterns };
          state.teamAgreements = defaultTeamAgreements;
          state.sharedComponents = defaultSharedComponents;
          state.projectDna = defaultProjectDna;
          state.schemaVersion = 2;
        }
        if (state.schemaVersion < 3) {
          // Replace namingConvention with componentNaming + utilNaming + fileSuffixes
          const arch = state.architecture as ArchitectureData & { namingConvention?: string };
          const legacy = arch.namingConvention;
          state.architecture = {
            ...defaultArchitecture,
            ...state.architecture,
            componentNaming: legacy === "kebab-case" ? "kebab-case" : "PascalCase",
            utilNaming: legacy === "kebab-case" ? "kebab-case" : "camelCase",
            fileSuffixes: false,
          };
          delete (state.architecture as unknown as Record<string, unknown>).namingConvention;
          state.schemaVersion = 3;
        }
      },
    }
  )
);
