import type { WizardState } from "@/types";

export function generateConfig(state: WizardState): object {
  return {
    schemaVersion: state.schemaVersion,
    generatedAt: new Date().toISOString(),
    project: state.project,
    architecture: state.architecture,
    designSystem: state.designSystem,
    standards: state.standards,
    uxPatterns: state.uxPatterns,
    teamAgreements: state.teamAgreements,
    sharedComponents: state.sharedComponents,
    projectDna: state.projectDna,
  };
}
