import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { evaluate } from "@/rules/evaluate";
import { SCHEMA_VERSION } from "@/types";
import type { WizardState, WizardStep } from "@/types";
import {
  defaultProject,
  defaultArchitecture,
  defaultDesignSystem,
  defaultStandards,
  defaultUXPatterns,
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
        set((s) => ({
          designSystem: { ...s.designSystem, ...data },
          updatedAt: now(),
        })),

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
      }),
      onRehydrateStorage: () => (state) => {
        if (state && state.schemaVersion < SCHEMA_VERSION) {
          // Future migrations go here
        }
      },
    }
  )
);
